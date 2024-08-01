import mongoose, {  Mongoose } from "mongoose";

export class DatabaseConnection {
   private mongoUri: string;
   private connection: Mongoose | null = null;

   constructor(mongoUri: string) {
      this.mongoUri = mongoUri;
   }

   public async connect() {
      try {
         this.connection = await mongoose.connect(this.mongoUri);
         console.log(`Database connected!`);
      } catch (error) {
         console.error("Error connecting to database", error);
         throw error;
      }
   }

   public getConnection(): Mongoose | null {
      return this.connection;
   }

   public async disconnect() {
      if (this.connection) {
         await this.connection.disconnect();
         console.log("Disconnected from database");
         this.connection = null;
      }
   }
}
