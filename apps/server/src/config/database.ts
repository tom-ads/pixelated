export interface DatabaseConfigContract {
  connectionUrl: string;
}

export const DatabaseConfig = {
  connectionUrl: process.env.MONGO_CONNECTION_URL,
};
