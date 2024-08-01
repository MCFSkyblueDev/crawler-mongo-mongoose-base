import { CrawlerType } from "../enums/crawler.enum";

import { EventHandler } from "./event-handler";
import {
   MarketEvent,
   Nft721ItemEvent,
   RegistryEvent,
} from "../enums/event.enum";
import axios from "axios";
// import { CrawlerConstants } from "../constants/crawler.constant";
import { RpcProvider } from "starknet";
import { StatusModel } from "../models/status.model";
import { IStatusDocument } from "../documents/status.document";

export class CrawlerProcess {
   public static async getBlockNumber() {
      try {
         const body = {
            jsonrpc: "2.0",
            method: "starknet_blockNumber",
            id: 0,
         };
         const { data } = await axios.post(
            "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
            body
         );
         return data?.result || 0;
      } catch (error) {
         throw error;
      }
   }

   public static setUpFirstBlock = async (
      crawlerType: CrawlerType,
      defaultBlocknumber: number
   ): Promise<number> => {
      let crawlerStatusEntity: IStatusDocument | null =
         await StatusModel.findOne({
            contract_name: crawlerType,
         });

      if (!crawlerStatusEntity) {
         crawlerStatusEntity = await StatusModel.create(
            new StatusModel({
               event_seq: defaultBlocknumber,
               contract_name: crawlerType,
               contract_address: "",
               block_timestamp: new Date(Date.now()),
            })
         );
      }

      return crawlerStatusEntity.event_seq
         ? crawlerStatusEntity.event_seq
         : defaultBlocknumber;
   };

   public static updateCrawlerStatus = async (
      blocknumber: number,
      crawlerType: CrawlerType
   ) => {
      try {
         await StatusModel.findOneAndUpdate(
            {
               contract_name: crawlerType,
            },
            {
               event_seq: blocknumber,
            }
         );
      } catch (error) {
         throw error;
      }
   };

   public static handleRegistryEvents = async (event: any) => {
      const eventHandler: EventHandler = new EventHandler();
      switch (event.keys[0]) {
         case RegistryEvent.ACCOUNT_CREATED: {
            await eventHandler.handleRegistryCreateAccount(event);
            break;
         }
      }
   };

   public static handleNftItemEvents = async (event: any) => {
      const eventHandler: EventHandler = new EventHandler();

      switch (event.keys[0]) {
         case Nft721ItemEvent.ITEM_MINTED: {
            await eventHandler.handleGachaMintNftItem(event);
            break;
         }
         case Nft721ItemEvent.EQUIP: {
            await eventHandler.handleEquipNftItem(event);
            break;
         }
      }
   };

   public static handleMarketEvents = async (event: any) => {
      const eventHandler: EventHandler = new EventHandler();

      switch (event.keys[0]) {
         case MarketEvent.NFT_LISTED: {
            await eventHandler.handleListNft(event);
            break;
         }
         case MarketEvent.NFT_CANCELLED: {
            await eventHandler.handleRemoveNftFromMarket(event);
            break;
         }
         case MarketEvent.NFT_BUY: {
            await eventHandler.handleBuyNftTokenboundAccount(event);
            break;
         }
      }
   };

   public static getEvents = async (
      fromBlock: number,
      eventType: any,
      address: string
   ) => {
      console.log(`Start crawling event Scout`);
      const providerRPC = new RpcProvider({
         nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
      });

      const lastBlock = fromBlock;
      const nextCursor: number =
         Number(lastBlock) + 100 < Number(lastBlock)
            ? Number(lastBlock)
            : Number(lastBlock) + 100;
      const eventsList = await providerRPC.getEvents({
         address: address,
         from_block: { block_number: Number(lastBlock) },
         to_block: { block_number: nextCursor },
         keys: [eventType],
         chunk_size: 100,
      });

      console.log(
         `DONE crawling event Point from ${lastBlock} to ${nextCursor}`
      );

      return eventsList?.events;
   };
}
