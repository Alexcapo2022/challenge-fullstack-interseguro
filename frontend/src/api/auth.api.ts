import { http } from "./http";

export const authApi = {
  login: async (username: string, password: string): Promise<{ token: string }> => {
    const { data } = await http.post("/api/v1/auth/login", { username, password });
    return data;
  }
};
