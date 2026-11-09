import { NextFunction, Request, Response, Router } from "express";

import { CreateUserDto } from "../dtos/CreateUserDto";
import { validateBody } from "../middleware/validateBody";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../database/data-source";
import { TypeOrmTransactionRunner } from "../infrastructure/transactions/TypeOrmTransactionRunner";

const router = Router();
const transactionRunner = new TypeOrmTransactionRunner(AppDataSource);
const userService = new UserService(transactionRunner);

router.post(
  "/create",
  validateBody(CreateUserDto),
  (req : Request,res : Response,next : NextFunction) => {
    return userService.createUser(req.body)
  }
);

export default router;