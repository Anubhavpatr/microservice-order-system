import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./database/data-source";

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT || 3004);

async function bootstrap(): Promise<void> {
  try {
    // Establish PostgreSQL connection
    await AppDataSource.initialize();

    console.log("Database connected successfully!");

    // Start Express only after database connection succeeds
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

void bootstrap();