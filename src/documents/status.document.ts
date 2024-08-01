import { Document } from "mongoose";

export interface IStatusDocument extends Document {
   contract_name: string;
   contract_address: string;
   event_seq: number;
   block_timestamp: Date;
}
