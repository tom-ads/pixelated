import mongoose from "mongoose";
import { DatabaseConfigContract } from "../config/database";

class DatabaseManager {
  constructor(private dbConfig: DatabaseConfigContract) {}

  public async createConnection() {
    try {
      mongoose.connect(this.dbConfig.connectionUrl, {
        dbName: this.dbConfig.dbName,
      });
      console.log("[Mongo] Connection established");
    } catch (err) {
      console.log("[Mongo] Failed to establish a connection to mongo");
      console.error(err);
    }
  }
}

export default DatabaseManager;
