import dotenv from "dotenv";
import path from "path";
import { validatedEnv } from "./validation";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Export the validated environment variables
export const env = validatedEnv;
