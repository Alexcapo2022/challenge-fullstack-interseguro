import type { Matrix } from "./matrix.types";

export interface MatrixRequest {
  matrix: Matrix;
}

export interface RotationRequest extends MatrixRequest {
  degrees?: number;      // default 90 en backend
  direction?: string;    // default "cw" en backend
}

export interface QrPayload {
  Q: Matrix;
  R: Matrix;
}

export interface QrResponse {
  qr?: QrPayload;
  stats?: unknown;
  warning?: string;
  detail?: string;
}

export interface RotationResponse {
  rotated?: Matrix;
  stats?: unknown;
  warning?: string;
  detail?: string;
}