import { Config } from "./config";
import { DatabaseConnection } from "./database/connection";
import { crawlMarket } from "./market-crawler";
import { crawlNft721Item } from "./nft721-item-crawler";
import { crawlRegistry } from "./registry-crawler";

const delay = (ms: number) => {
   return new Promise((resolve) => setTimeout(resolve, ms));
};

const config: Config = new Config();
const main = async () => {
   const database : DatabaseConnection = new DatabaseConnection(config.MONGODB_URI);
   await database.connect();
   while (true) {
      await crawlRegistry();
      await crawlNft721Item();
      await crawlMarket();

      await delay(1000);
   }
   // await database.disconnect();
};

main().catch((error) => {
   console.error("Error in main loop:", error);
});
