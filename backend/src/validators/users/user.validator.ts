import { userSchema } from "../../schemas/user.schema";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../errors/BadRequestError";

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    throw new BadRequestError("Datos inválidos para registro");
  }
  next();
};
