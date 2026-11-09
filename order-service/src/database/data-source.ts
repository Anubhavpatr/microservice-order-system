import "reflect-metadata";
import dotenv from "dotenv";

import { DataSource } from "typeorm";
import path from "node:path";

// Load environment variables
dotenv.config();

// Validate and return a required environment variable
function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}`
    );
  }

  return value;
}

// Validate PostgreSQL port
const dbPort = Number(getRequiredEnv("DB_PORT"));

if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
  throw new Error("Invalid DB_PORT value");
}

// Configure PostgreSQL connection
export const AppDataSource = new DataSource({
  type: "postgres",

  host: getRequiredEnv("DB_HOST"),
  port: dbPort,

  username: getRequiredEnv("DB_USER"),
  password: getRequiredEnv("DB_PASSWORD"),
  database: getRequiredEnv("DB_NAME"),

  // __dirname is current file's directly not the directly from where
  // the code has started the server
  // Automatically discover entity classes
  entities: [
    path.join(__dirname, "../entities/**/*.{ts,js}"),
  ],

  // Discover migrations
  migrations: [
    path.join(__dirname, "../migrations/**/*.{ts,js}"),
  ],

  // Database configuration
  synchronize: true,
  logging: false,
});