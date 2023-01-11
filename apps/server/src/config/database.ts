export interface DatabaseConfigContract {
  connectionUrl: string;
  dbName: string;
}

export const DatabaseConfig = {
  dbName: process.env.MONGO_DB_NAME,
  connectionUrl: process.env.MONGO_CONNECTION_URL,
};
