import api from "@/lib/axios";

export const logoutUser = async (refreshToken: string) => {
  return api.post("/auth/logout", { token: refreshToken });
};
