import mongoose, { ConnectOptions } from "mongoose";

class MongoManager {
  constructor(private connectionString: string) {}

  public async createConnection() {
    const options: ConnectOptions = {
      dbName: process.env.MONGO_DB_NAME || "pixelated",
    };

    try {
      await mongoose.connect(this.connectionString, options);
      console.log("[Database] Connection established");
    } catch (err) {
      console.error(err);
    }
  }
}

export default MongoManager;
