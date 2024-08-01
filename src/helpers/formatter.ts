import crypto from 'crypto';

export class Formatter {
  static formatStarknet: any = (address: any) => {
    if (!address) return "";
    return (
      address.split("x")[0] +
      "x" +
      "0".repeat(66 - address.length) +
      address.split("x")[1]
    );
  };

  static hashValue  = (input : any, maxValueOutput : any) => {
    const hash = crypto
      .createHash('sha256')
      .update(input.toString())
      .digest('hex');
  
    const intValue = parseInt(hash, 16);
  
    const mappedValue = (intValue % maxValueOutput) + 1;
    return mappedValue;
  };
  
}
