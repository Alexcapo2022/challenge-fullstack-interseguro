import { http } from "./http";
import type { MatrixRequest, RotationRequest, QrResponse, RotationResponse } from "../types/api.types";

export const matricesApi = {
  qr: async (payload: MatrixRequest) => {
    const { data } = await http.post<QrResponse>("/api/v1/matrices/qr", payload);
    return data;
  },

  rotation: async (payload: RotationRequest) => {
    const { data } = await http.post<RotationResponse>("/api/v1/matrices/rotation", payload);
    return data;
  },
};