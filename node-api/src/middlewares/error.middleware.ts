import { NextFunction, Request, Response } from "express";

export interface HttpError extends Error {
  status?: number;
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status ?? 500;
  res.status(status).json({
    error: err.message || "Error interno",
  });
}