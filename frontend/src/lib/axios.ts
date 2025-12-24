import axios from "axios";
import { useAuth } from "../store/auth";

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const baseUrl = import.meta.env.VITE_API_URL;
    const fullUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    return fullUrl;
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const apiUrl = `${protocol}//${hostname}:3003/api`;
  return apiUrl;
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const { token, businessId } = useAuth.getState();

  if (token && !config.url?.includes('/auth/refresh')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const currentBusinessId = businessId();
  if (currentBusinessId && !config.url?.includes('/auth/refresh')) {
    config.headers['X-Business-Id'] = currentBusinessId.toString();
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute = originalRequest.url?.includes('/auth/');

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      const { refreshToken } = useAuth.getState();

      if (!refreshToken) {
        useAuth.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;
      try {
        const res = await api.post("/auth/refresh", {
          refreshToken: refreshToken,
        });

        const tokenData = res.data.data || res.data;
        const newToken = tokenData?.accessToken || tokenData?.token || tokenData?.access_token;
        const newRefreshToken = tokenData?.refreshToken || tokenData?.refresh_token || refreshToken;

        if (!newToken) {
          throw new Error('No token in refresh response');
        }

        useAuth.getState().updateTokens(newToken, newRefreshToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err: any) {

        processQueue(err, null);
        useAuth.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
