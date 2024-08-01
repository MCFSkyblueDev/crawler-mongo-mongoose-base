import { Schema, model } from "mongoose";
import { IStatusDocument } from "../documents/status.document";

export const StatusModel = model<IStatusDocument>(
   "status",
   new Schema({
      contract_name: {
         type: String,
         required: true,
      },
      contract_address: {
         type: String,
         required: false,
      },
      event_seq: {
         type: Number,
         required: true,
      },
      block_timestamp: {
         type: Date,
         default: Date.now(),
         required: true,
      },
   })
);
