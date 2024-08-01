import { BigNumberish } from "starknet";

export class DataDecoder {
   static feltToStr = (felt: number) => {
      let hex = felt.toString(16);
      if (hex.length % 2 !== 0) {
         hex = "0" + hex;
      }
      const text = Buffer.from(hex, "hex").toString("utf8");
      return text;
   };

   static feltToInt = ({ low, high }: any) => {
      return Number((BigInt(high) << 64n) + BigInt(low));
   };

   static bigNumberishToHex(value: BigNumberish): string {
      const bigIntValue: bigint = BigInt(value);
      let hexValue: string = bigIntValue.toString(16);
      if (hexValue.length % 2 !== 0) {
         hexValue = "0" + hexValue;
      }
      return `0x${hexValue}`;
   }

   static arrayBigNumberToString(value: number[]): string {
      let result: string = "";
      for (let numberValue of value) {
         result += DataDecoder.feltToStr(numberValue);
      }
      return result;
   }
}
