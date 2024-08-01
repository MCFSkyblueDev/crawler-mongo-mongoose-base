import { RegistryEvent } from "./enums/event.enum";
import { CrawlerProcess } from "./helpers/crawler-process";
import { CrawlerType } from "./enums/crawler.enum";
import { Config } from "./config";
// import { CrawlerConstants } from "./constants/crawler.constant";
// import { DatabaseConnection } from "./database/connection";

const config: Config = new Config();

// const prepareEnv = async () => {
//    const database : DatabaseConnection = new DatabaseConnection(config.MONGODB_URI);
//    return database.connect();
// }

export const crawlRegistry = async () => {
   // const database : DatabaseConnection = new DatabaseConnection(config.MONGODB_URI);
   // await database.connect();
   // await DatabaseConnection.connect(config.MONGODB_URI);
   let fromBlock: number = await CrawlerProcess.setUpFirstBlock(
      CrawlerType.REGISTRY,
      82990
   );
   let events = await CrawlerProcess.getEvents(
      fromBlock,
      Object.values(RegistryEvent),
      config.REGISTRY_CONTRACT
   );

   const latestBlocknumber: number = await CrawlerProcess.getBlockNumber();
   await CrawlerProcess.updateCrawlerStatus(
      fromBlock + 100 < latestBlocknumber ? fromBlock + 100 : latestBlocknumber,
      CrawlerType.REGISTRY
   );

   console.log("REGISTRY REGISTRY REGISTRY REGISTRY REGISTRY REGISTRY");
   // console.log(events);
   if(!events) return;
   for (let event of events) {
      console.log(event.keys[0]);
      console.log(event.block_number);

      await CrawlerProcess.handleRegistryEvents(event);
   }
   // await database.disconnect();
};

// prepareEnv().then(crawlRegistry).catch((err) => {
//    console.error(err);
//    process.exit(1);
// });

// crawlRegistry();
