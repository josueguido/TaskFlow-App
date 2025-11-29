import axios from "axios";
import { useAuth } from "../store/auth";

// Determinar la URL base del API dinámicamente
const getApiUrl = () => {
  // Si existe variable de entorno, usarla y agregar /api si no lo tiene
  if (import.meta.env.VITE_API_URL) {
    const baseUrl = import.meta.env.VITE_API_URL;
    const fullUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    console.log('[AXIOS] Usando VITE_API_URL:', fullUrl);
    return fullUrl;
  }
  
  // Fallback: construir URL basada en el navegador
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const apiUrl = `${protocol}//${hostname}:3000/api`;
  
  console.log('[AXIOS] Construyendo URL dinámicamente:', {
    protocol,
    hostname,
    apiUrl
  });
  
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
  
  // Log completo de todas las peticiones
  console.log('[AXIOS REQUEST]', {
    url: `${config.baseURL || ''}${config.url || ''}`,
    method: config.method?.toUpperCase(),
    timestamp: new Date().toISOString(),
    data: config.data || null,
    headers: {
      'content-type': config.headers['Content-Type'],
      'authorization': config.headers.Authorization ? '***Bearer***' : 'no-auth',
      'x-business-id': config.headers['X-Business-Id'] || 'none'
    }
  });
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Log de respuestas exitosas
    console.log('[AXIOS RESPONSE]', {
      url: `${response.config.baseURL || ''}${response.config.url || ''}`,
      method: response.config.method?.toUpperCase(),
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  async (error) => {
    // Log de errores
    console.error('[AXIOS ERROR]', {
      url: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
    
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
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
        const res = await api.post("/api/auth/refresh", {
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
        console.error('[REFRESH] Error:', err?.response?.data || err?.message);
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
