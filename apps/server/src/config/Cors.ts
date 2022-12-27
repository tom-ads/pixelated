import { CorsOptions } from "cors";
import { getClientHost } from "../helpers";

const CorsConfig: CorsOptions = {
  origin: getClientHost(),
};

export default CorsConfig;
