import { Config } from "../config";
import { Account, Contract, RpcProvider } from "starknet";

const config: Config = new Config();
export class ContractConnection {
   public static connect = async (contractAddress: string) => {
      try {
         const provider = new RpcProvider({
            nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
         });

         const account = new Account(
            provider,
            config.WALLET_ADDRESS,
            config.WALLET_PRIVATE_KEY
         );
         const { abi } = await provider.getClassAt(contractAddress);
         const contract = new Contract(abi, contractAddress, account);
         return contract;
      } catch (error) {
         throw error;
      }
   };
}
