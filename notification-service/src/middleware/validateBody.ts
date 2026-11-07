
import { RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

type DtoClass<T extends object> = new () => T;

export function validateBody<T extends object>(
  dtoClass: DtoClass<T>
): RequestHandler {

  return async (req, res, next) => {

    const dto = plainToInstance(
      dtoClass,
      req.body
    );

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true
    });

    if (errors.length > 0) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.map(error => ({
          field: error.property,
          messages: Object.values(
            error.constraints ?? {}
          )
        }))
      });

      return;
    }

    req.body = dto;

    next();
  };
}
