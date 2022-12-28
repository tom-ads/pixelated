import mongoose from "mongoose";

class MongoManager {
  constructor(private connectionString: string) {}

  public async createConnection() {
    try {
      await mongoose.connect(this.connectionString);
      console.log("[Database] Connection established");
    } catch (err) {
      console.error(err);
    }
  }
}

export default MongoManager;
