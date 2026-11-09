import { NextFunction, Request, Response, Router } from "express";

import { CreateUserDto } from "../dtos/CreateUserDto";
import { validateBody } from "../middleware/validateBody";
import { UserService } from "../services/UserService";
import { TypeOrmUserRepository } from "../infrastructure/repositories/TypeOrmUserRepository";
import { AppDataSource } from "../database/data-source";
import { UserEntity } from "../domain/entities/UserEntity";

const router = Router();
const userRepository = new TypeOrmUserRepository(AppDataSource.getRepository(UserEntity));
const userService = new UserService(userRepository);

router.post(
  "/create",
  validateBody(CreateUserDto),
  (req : Request,res : Response,next : NextFunction) => {
    return userService.createUser(req.body)
  }
);

export default router;