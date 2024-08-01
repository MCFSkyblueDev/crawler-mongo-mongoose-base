import { Document } from "mongoose";

export interface ITbaDocument extends Document {
   tba_address: string;
   collection_address: string;
   token_id: number;
   owner_address: string;
   tba_image: string;
   tba_name: string;
   listing: boolean;
   point: number;
   price: number;
   power : number;
   claimed?: number;
   genesis_image: string;
   // items: Array<{
   //    collection_address: string,
   //    token_id: number,
   //    power: number
   // }>;
}
