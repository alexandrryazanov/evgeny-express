import { NextFunction, Request, Response } from "express";
import { Exception } from "../exceptions";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request & { userId?: number },
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header) {
    throw new Exception(401, "Нет заголовка авторизации");
  }

  const token = header.split(" ")[1];

  if (!token) {
    throw new Exception(401, "Не удалось прочитать токен");
  }

  try {
    const decoded = jwt.verify(token, "secret-key");

    req["userId"] = (decoded as any).userId;

    next();
  } catch (e) {
    throw new Exception(401, (e as any).message);
  }
}
