export type Matrix = number[][];

export interface StatsResult {
  min: number | null;
  max: number | null;
  sum: number;
  avg: number | null;
  count: number;
}

export interface MatrixStats {
  shape: {
    rows: number;
    cols: number;
  };
  stats: StatsResult;
  diagonal: boolean;
}

export interface StatsResponse {
  global: StatsResult;
  perMatrix: Record<string, MatrixStats>;
}