import sharp from "sharp";
import fs from "fs";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { TbaModel } from "../models/tba.model";
import { ITbaDocument } from "../documents/tba.document";
import { Config } from "../config";

const config = new Config();
export class ImageExporter {
   private static fetchImageFromUrl = async (url: string) => {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(response.data);
   };
   private static readImageBuffers = async (paths: string[]) => {
      return Promise.all(
         paths.map(async (pathOrUrl) => {
            if (
               pathOrUrl.startsWith("http://") ||
               pathOrUrl.startsWith("https://")
            ) {
               return await this.fetchImageFromUrl(pathOrUrl);
            } else {
               const buffer = await fs.promises.readFile(pathOrUrl);
               return buffer;
            }
         })
      );
   };

   // Function to overlay images with the first image as the base and the last image on top
   private static overlayImages = async (imageBuffers: any) => {
      if (imageBuffers.length === 0) {
         throw new Error("No images provided");
      }

      // Read dimensions of the base image
      const baseImageMetadata = await sharp(imageBuffers[0]).metadata();
      const { width, height } = baseImageMetadata;

      // Resize all images to match the base image dimensions
      const resizedBuffers = await Promise.all(
         imageBuffers.map((buffer: any) =>
            sharp(buffer).resize(width, height).toBuffer()
         )
      );

      let baseImage = sharp(resizedBuffers[0]);
      let bufferImage;

      // Overlay images
      for (let i = 1; i < resizedBuffers.length; i++) {
         bufferImage = await baseImage
            .composite([{ input: resizedBuffers[i], blend: "over" }])
            .toBuffer();
         baseImage = sharp(bufferImage); // Convert buffer back to sharp instance
      }

      return baseImage;
   };

   public static uploadImage = async (
      imagePaths: string[],
      tokenId: number
   ) => {
      try {
         const imageBuffers = await this.readImageBuffers(imagePaths);
         const outputImage = await this.overlayImages(imageBuffers);

         // Convert the final sharp instance to buffer and upload to Cloudinary or save
         const finalBuffer = await outputImage.toBuffer();

         const tba: ITbaDocument | null = await TbaModel.findOne({
            token_id: tokenId,
         });
         if (!tba) {
            throw new Error("uploadImage");
         }
         const existingImageUrl: string = tba.tba_image;
         const publicId =
            "tokenbound/" + existingImageUrl!.split("/")!.pop()!.split(".")[0];
         cloudinary.config({
            cloud_name:config.CLOUDINARY_CLOUD_NAME,
            api_key: config.CLOUDINARY_API_KEY,
            api_secret: config.CLOUDINARY_API_SECRET,
         });
         const uploadResult = await new Promise<{ secure_url: string }>(
            (resolve, reject) => {
               cloudinary.uploader
                  .upload_stream(
                     {
                        // folder: "tokenbound",
                        overwrite: true,
                        public_id: publicId,
                        format: "png",
                     },
                     (error, result) => {
                        if (error) {
                           reject(error);
                        } else {
                           resolve(result as { secure_url: string });
                        }
                     }
                  )
                  .end(finalBuffer);
            }
         );
         console.log(uploadResult);
         await TbaModel.updateOne(
            {
               token_id: tokenId,
            },
            {
               tba_image: uploadResult.secure_url,
            }
         );
         // console.log(result);
      } catch (error) {
         console.error("Error processing images:", error);
      }
   };
}
