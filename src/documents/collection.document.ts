import { Document } from "mongoose";

export interface ICollectionDocument extends Document {
   collection_address: string;
   index : number;
   name: string;
   image: string;
   symbol: string;
}
