import { Matrix, StatsResult } from "../types/matrix.types";

const EPS = 1e-9;

export function isRectangular(matrix: Matrix): boolean {
  if (!Array.isArray(matrix) || matrix.length === 0) return false;

  const cols = matrix[0].length;

  for (const row of matrix) {
    if (!Array.isArray(row) || row.length !== cols) return false;
    for (const v of row) {
      if (typeof v !== "number" || !Number.isFinite(v)) return false;
    }
  }
  return true;
}

export function flatten(matrix: Matrix): number[] {
  return matrix.flat();
}

export function computeStats(values: number[]): StatsResult {
  if (values.length === 0) {
    return { min: null, max: null, sum: 0, avg: null, count: 0 };
  }

  const sum = values.reduce((acc, val) => acc + val, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    min,
    max,
    sum,
    avg: sum / values.length,
    count: values.length
  };
}

export function isDiagonal(matrix: Matrix): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;
  if (rows !== cols) return false;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i !== j && Math.abs(matrix[i][j]) > EPS) {
        return false;
      }
    }
  }
  return true;
}