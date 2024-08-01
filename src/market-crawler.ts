import { MarketEvent } from "./enums/event.enum";
import { CrawlerProcess } from "./helpers/crawler-process";
import { CrawlerType } from "./enums/crawler.enum";
// import { CrawlerConstants } from "./constants/crawler.constant";
import { Config } from "./config";
// import { CrawlerConstants } from "./constants/crawler.constant";
// import { DatabaseConnection } from "./database/connection";
// import { DatabaseConnection } from './database/connection';

const config: Config = new Config();

// const prepareEnv = async () => {
//    const database : DatabaseConnection = new DatabaseConnection(config.MONGODB_URI);
//    await database.connect();
// }

export const crawlMarket = async () => {
   // await DatabaseConnection.connect(config.MONGODB_URI);
   // const database : DatabaseConnection = new DatabaseConnection(config.MONGODB_URI);
   // await database.connect();

   let fromBlock: number = await CrawlerProcess.setUpFirstBlock(
      CrawlerType.MARKET,
      82990
   );
   let events = await CrawlerProcess.getEvents(
      fromBlock,
      Object.values(MarketEvent),
      config.MARKET_CONTRACT
   );

   const latestBlocknumber: number = await CrawlerProcess.getBlockNumber();
   await CrawlerProcess.updateCrawlerStatus(
      fromBlock + 100 < latestBlocknumber ? fromBlock + 100 : latestBlocknumber,
      CrawlerType.MARKET
   );

   console.log(
      "MARKET MARKET MARKET MARKET MARKET MARKET MARKET MARKET MARKET"
   );
   // console.log(events);
   if(!events) return;
   for (let event of events) {
      console.log(event.keys[0]);
      console.log(event.block_number);
      await CrawlerProcess.handleMarketEvents(event);
   }
   // await database.disconnect();
};

// prepareEnv().then(crawlMarket).catch((err) => {
//    console.error(err);
//    process.exit(1);
// });

// crawlMarket();
