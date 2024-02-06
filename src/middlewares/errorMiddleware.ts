import { NextFunction, Request, Response } from "express";
import { Exception } from "../exceptions";

export function errorMiddleware(
  err: Exception,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message || "Something went wrong",
    details: err.details || "",
  });

  next();
}
