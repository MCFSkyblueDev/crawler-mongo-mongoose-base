import { Nft721ItemEvent } from "./enums/event.enum";
import { CrawlerProcess } from "./helpers/crawler-process";
import { CrawlerType } from "./enums/crawler.enum";
import { Config } from "./config";
// import { CrawlerConstants } from "./constants/crawler.constant";
// import { DatabaseConnection } from './database/connection';


const config: Config = new Config();

// const prepareEnv = async () => {
//    const database : DatabaseConnection = new DatabaseConnection(config.MONGODB_URI);
//    await database.connect();
// }

export const crawlNft721Item = async () => {
   // const database : DatabaseConnection = new DatabaseConnection(config.MONGODB_URI);
   // await database.connect();
   // await DatabaseConnection.connect(config.MONGODB_URI);
   let fromBlock: number = await CrawlerProcess.setUpFirstBlock(
      CrawlerType.NFT721_ITEM,
      82990
   );
   let events = await CrawlerProcess.getEvents(
      fromBlock,
      Object.values(Nft721ItemEvent),
      config.NFT_ITEM_CONTRACT
   );

   const latestBlocknumber: number = await CrawlerProcess.getBlockNumber();
   await CrawlerProcess.updateCrawlerStatus(
      fromBlock + 100 < latestBlocknumber ? fromBlock + 100 : latestBlocknumber,
      CrawlerType.NFT721_ITEM
   );

   console.log("NFT721 ITEM  NFT721 ITEM  NFT721 ITEM  NFT721 ITEM");
   // console.log(events);
   if(!events) return;
   for (let event of events) {
      console.log(event.keys[0]);
      console.log(event.block_number);
      await CrawlerProcess.handleNftItemEvents(event);
   }
   // await database.disconnect();
};

// prepareEnv().then(crawlNft721Item).catch((err) => {
//    console.error(err);
//    process.exit(1);
// });

// crawlNft721Item();