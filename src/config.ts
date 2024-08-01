import { config } from "dotenv";

config();

export class Config {
   public MONGODB_URI: string;

   public JWT_KEY: string;

   public ERC20_CONTRACT: string;
   public NFT_CONTRACT: string;
   public NFT_ITEM_CONTRACT: string;
   public MARKET_CONTRACT: string;
   public REGISTRY_CONTRACT: string;

   public ACCOUNT_CLASS_HASH: string;

   public RPC_PROVIDER: string;

   public PRIVATE_KEY: string;
   public ACCOUNT_ADDRESS: string;

   public PRIVATE_SIGNER: string;

   public WALLET_ADDRESS: string;
   public WALLET_PRIVATE_KEY: string;

   public IMAGE_URL: string;

   public CLOUDINARY_CLOUD_NAME: string;
   public CLOUDINARY_API_KEY: string;
   public CLOUDINARY_API_SECRET: string;

   constructor() {
      this.MONGODB_URI =
         process.env.MONGODB_URI ||
         "mongodb+srv://phongndhdev:wahUjzY5n0NPXqRA@ventorii-nft.k8r55ak.mongodb.net/bling-bling";
      this.JWT_KEY = process.env.JWT_KEY || "ventorii_x_ventory";

      this.ERC20_CONTRACT =
         process.env.ERC20_CONTRACT ||
         "0x06be32f1bd65b394a772fef47a4a4c0df3dff3e5ae1529542b0508140e8110bf";
      this.NFT_CONTRACT =
         process.env.NFT_CONTRACT ||
         "0x03e90f44fd3db55fff5a313b97f5fc8b8f763c7aa91dded76b1f741099efd231";
      this.NFT_ITEM_CONTRACT =
         process.env.NFT_ITEM_CONTRACT ||
         "0x01eb5cd6d407c3de416a4d8128b2f41a212c9f9315af1af7477597a015453c6b";
      this.MARKET_CONTRACT =
         process.env.MARKET_CONTRACT ||
         "0x01a8c011f0de9ed6a0f34972ff402837bafdb10b7828437c653b600e52c048e7";
      this.REGISTRY_CONTRACT =
         process.env.REGISTRY_CONTRACT ||
         "0x02db79ceddaa0c057940a9caf37c48dd65cf65bd2f82c45c2694b9be0e41a52a";
      this.ACCOUNT_CLASS_HASH =
         process.env.ACCOUNT_CLASS_HASH ||
         "0x033ac081b041d87e30434fca36dfa5ff55dc2230e9dcac595621ae051a2ee865";

      this.RPC_PROVIDER =
         process.env.RPC_PROVIDER ||
         "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";

      this.PRIVATE_KEY =
         process.env.PRIVATE_KEY ||
         "0x059604373118d3969b5e2a3868d62a52cc8307066b8f208589de5de714ba4751";
      this.ACCOUNT_ADDRESS =
         process.env.ACCOUNT_ADDRESS ||
         "0x07C78deB47D082c21a473528BaC457d121632c713ae13fF2F638a03e20bc89dF";

      this.PRIVATE_SIGNER =
         process.env.PRIVATE_SIGNER ||
         "0x024d59610984eadcb879a4d16c6bca4bbf85a5a54731363fb7cb4b2c2d9c2057";

      this.WALLET_ADDRESS =
         process.env.WALLET_ADDRESS ||
         "0x01c41e7e3fef67E9648b96349d312F78fBe52c0b0196D767C7777104d33fc874";
      this.WALLET_PRIVATE_KEY =
         process.env.WALLET_PRIVATE_KEY ||
         "0x03a3059f198132aa5eceb56124c141621dc222fb8e26e3c4a615522c944192d8";
      this.IMAGE_URL =
         process.env.IMAGE_URL ||
         "https://res.cloudinary.com/dfnvpr9lg/image/upload/v1721278123";

      this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dfnvpr9lg";

      this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "759248853929979";
      this.CLOUDINARY_API_SECRET =
         process.env.CLOUDINARY_API_SECRET || "b0nSkahJOSGf8tAA91NMsq0GaJ0";
   }
}
