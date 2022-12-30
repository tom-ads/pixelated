import { CorsOptions } from "cors";

const CorsConfig: CorsOptions = {
  credentials: true,
  origin: process.env.CLIENT_HOST,
};

export default CorsConfig;
