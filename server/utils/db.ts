import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schemas";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Disable prefetch in serverless/Nitro environment
export const queryClient = postgres(connectionString, { max: 10 });
export const db = drizzle(queryClient, { schema });
