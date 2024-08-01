import { Schema, model } from "mongoose";
import { INftDocument } from "../documents/nft.document";

export const NftModel = model<INftDocument>(
   "nfts",
   new Schema({
      token_id: {
         type: Number,
         required: true,
      },
      collection_address: {
         type: String,
         required: false,
      },
      owner_address: {
         type: String,
         required: true,
      },
      nft_type: {
         type: Number,
         required: true,
      },
      nft_name: {
         type: String,
         required: true,
      },
      nft_image: {
         type: String,
         required: true,
      },
      nft_rank: {
         type: Number,
         require: true,
      },
      listing: {
         type: Boolean,
         default: false,
         required: true,
      },
      price: {
         type: Number,
         default: 0,
      },
      power: {
         type: Number,
         default: 0,
      },
      equip : {
         type : Boolean,
         default: false,
      }
   })
);
