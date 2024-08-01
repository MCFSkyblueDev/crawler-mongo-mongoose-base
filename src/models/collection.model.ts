import { Schema, model } from "mongoose";
import { ICollectionDocument } from "../documents/collection.document";

export const CollectionModel = model<ICollectionDocument>(
   "collections",
   new Schema({
      collection_address: {
         type: String,
         required: true,
      },
      index: {
         type: Number,
         required: true,
      },
      name: {
         type: String,
         required: false,
      },
      image: {
         type: String,
         required: false,
      },
      symbol: {
         type: String,
         required: false,
      },
   })
);
