import express, { type NextFunction, type Request, type Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./database/data-source";
import userRouter from "./router/user.routes";

const app = express();

app.use(express.json());

// registering the user controller
app.use("/api/users", userRouter);

app.use((
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(error);

  res.status(500).json({
    message: "Something went wrong."
  });
});

const PORT = Number(process.env.PORT || 3001);

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