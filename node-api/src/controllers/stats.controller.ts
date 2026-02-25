import { Request, Response, NextFunction } from "express";
import { buildStatsResponse } from "../services/stats.service";
import { StatsResponse } from "../types/matrix.types";

type StatsBody = {
  matrices: unknown;
};

export const calculateStats = (
  req: Request<unknown, unknown, StatsBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result: StatsResponse = buildStatsResponse(req.body?.matrices);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};