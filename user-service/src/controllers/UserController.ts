import type {
  Request,
  Response,
  NextFunction
} from "express";

import type { CreateUserInput } from "../domain/repositories/UserRepositories";
import type { UserService } from "../services/UserService";

type NoParams = Record<string, never>;

type UserIdParams = {
  id: string;
};

type UserEmailParams = {
  email : string
}

type CreateUserRequest = Request<
  NoParams,        // Route parameters
  unknown,         // Response body
  CreateUserInput  // Validated request body
>;

type FindUserIdRequest = Request<UserIdParams>;

type FindUserEmailRequest = Request<
  NoParams,
  unknown,
  UserEmailParams
>;

type DeleteUserRequest = Request<UserIdParams>;

export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  // Arrow functions preserve `this` when passed to Express.
  readonly createUser = async (
    req: CreateUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);

      res.status(201).json(user);
    } catch (error: unknown) {
      next(error);
    }
  };

  readonly findByEmail = async (
    req : FindUserEmailRequest,
    res : Response,
    next : NextFunction
  ): Promise<void> => {
    try
    {
      const { email } = req.body;

      const user = await this.userService.getUser(email);

      res.status(200).json(user);

    }
    catch(error : unknown)
    {
      next(error);
    }
  }

  readonly findById = async (
    req : FindUserIdRequest,
    res : Response,
    next : NextFunction
  ): Promise<void> => {
    try
    {
      const { id } = req.params;

      // Runtime validation remains separate from TypeScript typing.
      if (typeof id !== "string" || id.trim().length === 0) {
        res.status(400).json({
          message: "A valid user ID is required."
        });
        return;
      }

      const user = await this.userService.getUser(id);

      res.status(200).json(user);
    }
    catch(error : unknown)
    {
      next(error)
    }
  }

  readonly deleteUser = async (
    req: DeleteUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      // Runtime validation remains separate from TypeScript typing.
      if (typeof id !== "string" || id.trim().length === 0) {
        res.status(400).json({
          message: "A valid user ID is required."
        });
        return;
      }

      await this.userService.deleteUser(id);

      res.status(204).send();
    } catch (error: unknown) {
      next(error);
    }
  };
}