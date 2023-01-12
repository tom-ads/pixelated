import mongoose from "mongoose";
import { DatabaseConfig } from "../config/database";

class MongoManager {
  public async createConnection() {
    if (!DatabaseConfig.connectionUrl) {
      throw new Error("Missing Mongo Connection URL");
    }

    try {
      await mongoose.connect(DatabaseConfig.connectionUrl, {
        dbName: DatabaseConfig.dbName,
      });
      console.log("[Database] Connection established");
    } catch (err) {
      console.error(err);
    }
  }
}

export default MongoManager;
