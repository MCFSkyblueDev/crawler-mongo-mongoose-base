import { Schema, model } from "mongoose";
import { ITbaDocument } from "../documents/tba.document";
// import { Formatter } from "../helpers/formatter";

export const TbaModel = model<ITbaDocument>(
   "tbas",
   new Schema({
      tba_address: {
         type: String,
         required: false,
      },
      collection_address: {
         type: String,
         required: false,
      },
      token_id: {
         type: Number,
         required: true,
      },
      owner_address: {
         type: String,
         required: false,
      },
      tba_image: {
         type: String,
         required: false,
      },
      tba_name: {
         type: String,
         required: false,
      },
      listing: {
         type: Boolean,
         default: false,
         required: true,
      },
      point: {
         type: Number,
         default: 0,
         required: true,
      },
      price: {
         type: Number,
         default: 0,
         required: true,
      },
      power: {
         type: Number,
         default: 0,
         required: true,
      },
      claimed: {
         type: Number,
         default: 0,
      },
      genesis_image: {
         type: String,
         required: true,
      },
      // items: {
      //    type: [
      //       {
      //          collection_address: String,
      //          token_id: Number,
      //          power: Number,
      //       },
      //    ],
      //    default: new Array(6).fill(null).map(() => ({
      //       collection_address: Formatter.formatStarknet("0x0"),
      //       token_id: 0,
      //       power: 0,
      //    })),
      // },
   })
);
