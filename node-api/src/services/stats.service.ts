import { Matrix, StatsResponse } from "../types/matrix.types";
import { isRectangular, flatten, computeStats, isDiagonal } from "../utils/matrix.utils";
import { HttpError } from "../middlewares/error.middleware";

type MatricesPayload = Record<string, Matrix>;

export function buildStatsResponse(matrices: unknown): StatsResponse {
  if (!matrices || typeof matrices !== "object") {
    const e = new Error(
      "Body inválido. Se espera { matrices: { nombre: number[][], ... } }"
    ) as HttpError;
    e.status = 400;
    throw e;
  }

  const typed = matrices as MatricesPayload;

  const perMatrix: StatsResponse["perMatrix"] = {};
  let allValues: number[] = [];

  for (const [name, matrix] of Object.entries(typed)) {
    if (!isRectangular(matrix)) {
      const e = new Error(`Matriz inválida: ${name}`) as HttpError;
      e.status = 400;
      throw e;
    }

    const values = flatten(matrix);
    allValues = allValues.concat(values);

    perMatrix[name] = {
      shape: { rows: matrix.length, cols: matrix[0].length },
      stats: computeStats(values),
      diagonal: isDiagonal(matrix),
    };
  }

  return {
    global: computeStats(allValues),
    perMatrix,
  };
}