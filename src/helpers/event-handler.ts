import axios from "axios";
import { DataDecoder } from "./data-decoder";

import { ITbaDocument } from "../documents/tba.document";
import { TbaModel } from "../models/tba.model";
import { BigNumberish, Contract } from "starknet";
import { ContractConnection } from "./contract-connection";
import { Config } from "../config";
import { INftDocument } from "../documents/nft.document";
import { NftModel } from "../models/nft.model";
import { Formatter } from "./formatter";
import {
   COLLECTION_NAME,
   IMAGE_FOLDER_DATA,
} from "../constants/image.constant";
import { v2 as cloudinary } from "cloudinary";
import { ImageExporter } from "./image-exporter";

const config: Config = new Config();
export class EventHandler {
   //* NFT721 TOKENBOUND ACCOUNT
   public handleRegistryCreateAccount = async (event: any) => {
      const tokenId = DataDecoder.feltToInt({
         low: event.data[1],
         high: event.data[2],
      });
      // const tokenContractAddress = event.data[0];

      //? Check tokenbound account exists or not
      const existTokenboundAccount: ITbaDocument | null =
         await TbaModel.findOne({
            token_id: tokenId,
         });

      const registryContract: Contract = await ContractConnection.connect(
         config.REGISTRY_CONTRACT
      );
      const nftTbaContract: Contract = await ContractConnection.connect(
         config.NFT_CONTRACT
      );
      const erc20Contract: Contract = await ContractConnection.connect(
         config.ERC20_CONTRACT
      );

      const tokenboundAddress: BigNumberish =
         await registryContract.get_account(
            config.ACCOUNT_CLASS_HASH,
            config.NFT_CONTRACT,
            tokenId
         );

      const userAddress: BigNumberish = await nftTbaContract.owner_of(tokenId);

      const claimed: BigNumberish = await erc20Contract.get_minted(
         "0x" + tokenboundAddress.toString(16)
      );

      if (existTokenboundAccount) {
         console.log(tokenId);
         console.log(existTokenboundAccount);
         console.log("Cannot add tokenbound account");
         return;
      }

      //? create new image
      const { tba: tbaFolderData } = IMAGE_FOLDER_DATA;
      const pickedImage = `${config.IMAGE_URL}/${tbaFolderData.folder}/${
         tbaFolderData.folder
      }${Formatter.hashValue(tokenId, tbaFolderData.end)}.png`;
      cloudinary.config({
         cloud_name: config.CLOUDINARY_CLOUD_NAME,
         api_key: config.CLOUDINARY_API_KEY,
         api_secret: config.CLOUDINARY_API_SECRET,
      });
      const data = await cloudinary.uploader.upload(
         pickedImage,
         {
            folder: "tokenbound",
            public_id: `tokenbound${tokenId}`,
         },
         (error, _) => {
            if (error) {
               console.error("Upload error:", error);
               return;
            }
            console.log("Upload Genesis Image successful");
         }
      );

      await TbaModel.create({
         token_id: tokenId,
         tba_address: Formatter.formatStarknet(
            "0x" + tokenboundAddress.toString(16)
         ),
         owner_address: Formatter.formatStarknet(
            "0x" + userAddress.toString(16)
         ),
         collection_address: Formatter.formatStarknet(config.NFT_CONTRACT),
         tba_name: `${COLLECTION_NAME} #${tokenId}`,
         tba_image: data.secure_url,
         genesis_image: pickedImage,
         claimed: Number(claimed),
         point: Number(claimed) * 5,
         power: 0,
      });
   };

   //* MARKET
   public handleListNft = async (event: any) => {
      const tokenId = DataDecoder.feltToInt({
         low: event.data[1],
         high: event.data[2],
      });
      const price = DataDecoder.feltToInt({
         low: event.data[3],
         high: event.data[4],
      });
      try {
         await TbaModel.findOneAndUpdate(
            {
               token_id: tokenId,
            },
            {
               price: price / 10 ** 18,
               listing: true,
            }
         );
      } catch (error) {
         throw new Error("Can not update tokenbound entity");
      }
   };

   public handleRemoveNftFromMarket = async (event: any) => {
      const tokenId = DataDecoder.feltToInt({
         low: event.data[1],
         high: event.data[2],
      });

      try {
         await TbaModel.findOneAndUpdate(
            {
               token_id: tokenId,
            },
            {
               price: 0,
               listing: true,
            }
         );
      } catch (error) {
         throw new Error("Can not remove tokenbound from market");
      }
   };

   public handleBuyNftTokenboundAccount = async (event: any) => {
      const tokenId = DataDecoder.feltToInt({
         low: event.data[2],
         high: event.data[3],
      });
      const newOwnerAddress = event.data[0];
      try {
         await TbaModel.findOneAndUpdate(
            {
               token_id: tokenId,
            },
            {
               owner_address: Formatter.formatStarknet(newOwnerAddress),
               listing: false,
            }
         );
      } catch (error) {
         throw new Error("Can not remove tokenbound from market");
      }
   };

   //* NFT721 ITEM
   public handleGachaMintNftItem = async (event: any) => {
      const tokenId = DataDecoder.feltToInt({
         low: event.data[0],
         high: event.data[1],
      });
      const tokenType = Number(event.data[2]);
      const tokenRank = Number(event.data[3]);
      const tokenPower = Number(event.data[4]);

      const tokenboundAddress = event.data[5];
      // try {
      //    await NftModel.findOneAndUpdate(
      //       { owner_address: Formatter.formatStarknet(tokenboundAddress) },
      //       {
      //          power: tokenPower,
      //       }
      //    );
      // } catch (error) {
      //    console.log(
      //       "Cannot create this nft because cannot find token bound account"
      //    );
      // }
      // console.log("handleGachaMintNftItem _________________________--  ");
      const existNftItem: INftDocument | null = await NftModel.findOne({
         token_id: tokenId,
      });
      if (existNftItem) {
         // console.log(existNftItem)
         console.log("Nft already exists");
         return;
      }
      const nftItemContract: Contract = await ContractConnection.connect(
         config.NFT_ITEM_CONTRACT
      );
      const bigNumberArray: number[] = await nftItemContract.token_uri(tokenId);
      const itemUri = DataDecoder.arrayBigNumberToString(bigNumberArray);

      const { data } = await axios.get(itemUri);

      return await NftModel.create(
         new NftModel({
            collection_address: Formatter.formatStarknet(
               config.NFT_ITEM_CONTRACT
            ),
            token_id: Number(tokenId),
            nft_type: tokenType.toString(),
            nft_rank: tokenRank.toString(),
            power: tokenPower,
            nft_name: data?.name || `Tokenbound Item #${tokenId}`,
            nft_image: data?.image,
            owner_address: Formatter.formatStarknet(tokenboundAddress),
         })
      );
   };

   public handleEquipNftItem = async (event: any) => {
      const tokenId = DataDecoder.feltToInt({
         low: event.data[1],
         high: event.data[2],
      });
      const tokenboundAddress = event.data[0];

      // get equipped item type
      const nftItemContract: Contract = await ContractConnection.connect(
         config.NFT_ITEM_CONTRACT
      );
      const newEquippedItemMetadata = await nftItemContract.get_token_metadata(
         tokenId
      );

      const newEquippedItemType = Number(newEquippedItemMetadata[0]);
      // const newEquippedItemRank = Number(newEquippedItemMetadata[1]);
      const newEquippedItemPower = Number(newEquippedItemMetadata[2]);

      const checkedItem: INftDocument | null = await NftModel.findOne({
         owner_address: Formatter.formatStarknet(tokenboundAddress),
         nft_type: newEquippedItemType,
         token_id: tokenId,
         equip: true,
      });
      if (checkedItem) {
         console.log("Cannot equip again");
         return;
      }

      try {
         //

         //? Un equip old item
         const oldNftItem: INftDocument | null = await NftModel.findOne({
            owner_address: Formatter.formatStarknet(tokenboundAddress),
            nft_type: newEquippedItemType,
            equip: true,
         });
         console.log("_____________________++++++++++++++++++");
         console.log(newEquippedItemPower);
         console.log(tokenboundAddress);
         console.log(oldNftItem?.power);
         console.log("_____________________++++++++++++++++++");

         if (oldNftItem) {
            await NftModel.findOneAndUpdate(
               { _id: oldNftItem._id },
               {
                  equip: false,
               }
            );
            await TbaModel.findOneAndUpdate(
               { tba_address: Formatter.formatStarknet(tokenboundAddress) },
               {
                  $inc: { power: -Number(oldNftItem.power) },
               }
            );
         }
         const tbaPPPP: ITbaDocument | null = await TbaModel.findOne({
            tba_address: Formatter.formatStarknet(tokenboundAddress),
         });
         console.log("TBA TBA TBA " + tbaPPPP?.power);

         //? Equip new item
         const tba: ITbaDocument | null = await TbaModel.findOne({
            tba_address: Formatter.formatStarknet(tokenboundAddress),
         });
         console.log(tba?.power);
         await NftModel.findOneAndUpdate(
            { token_id: tokenId },
            {
               equip: true,
            }
         );
         await TbaModel.findOneAndUpdate(
            { tba_address: Formatter.formatStarknet(tokenboundAddress) },
            {
               $inc: { power: newEquippedItemPower },
            }
         );

         const tbaPPP: ITbaDocument | null = await TbaModel.findOne({
            tba_address: Formatter.formatStarknet(tokenboundAddress),
         });
         console.log("TBA TBA " + tbaPPP?.power);
      } catch (error) {
         throw new Error("handleEquipNftItem " + error);
      }

      //? Deal with Image
      const equippedNfts: INftDocument[] = await NftModel.find({
         owner_address: Formatter.formatStarknet(tokenboundAddress),
         equip: true,
      });
      // console.log(tokenboundAddress);
      const tba: ITbaDocument | null = await TbaModel.findOne({
         tba_address: Formatter.formatStarknet(tokenboundAddress),
      });
      if (!tba) {
         throw new Error("handleEquipNftItem ----");
      }
      let imagesPath = [];
      // console.log(tba.genesis_image);
      imagesPath.push(tba.genesis_image);
      equippedNfts.forEach((equippedNft) => {
         imagesPath.push(equippedNft.nft_image);
      });
      // console.log(imagesPath);
      await ImageExporter.uploadImage(imagesPath, tba.token_id);
   };
}
