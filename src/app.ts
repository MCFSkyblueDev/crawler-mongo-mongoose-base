// import {Connection,Collection} from "mongoose";s
import { Config } from "./config";
// import { Entity } from "typeorm";

// import { DatabaseConnection } from "./database/connection";

const config: Config = new Config();

const app = async () => {
   console.log(config.ACCOUNT_ADDRESS);
   // console.log(Collection);
};

app();
