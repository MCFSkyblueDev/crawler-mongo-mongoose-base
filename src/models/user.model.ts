import mongoose, { Schema } from "mongoose";

export const UserModel = mongoose.model(
   "users",
   new Schema({
      address: {
         type: String,
         required: true,
      },
   })
);
