import { Router } from "express";

import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { validateBody } from "../middleware/validateBody";
import { TypeOrmTransactionRunner } from "../infrastructure/transactions/TypeOrmTransactionRunner";
import { AppDataSource } from "../database/data-source";

const typeOrmTransactionRunner = new TypeOrmTransactionRunner(AppDataSource);
const userService = new UserService(typeOrmTransactionRunner);

export function createUserRouter(userService: UserService) {
  const router = Router();
  const controller = new UserController(userService);

  router.post(
    "/create",
    validateBody(CreateUserDto),
    controller.createUser
  );

  router.delete(
    "/delete/:id",
    controller.deleteUser
  );

  return router;
}

export default createUserRouter(userService);