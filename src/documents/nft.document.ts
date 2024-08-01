import { Document } from 'mongoose';

export interface INftDocument extends Document {
   token_id: number;
   collection_address: string;
   owner_address: string;
   nft_type: number;
   nft_name: string;
   nft_image: string;
   nft_rank: number;
   listing: boolean;
   price: number;
   power : number;
   equip : boolean;
}