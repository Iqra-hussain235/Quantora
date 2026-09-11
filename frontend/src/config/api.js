import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_BASE}/api`,
});

// ── Request interceptor — attach access token ─────────────────────────────────
API.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    // Prefer the new accessToken key; fall back to legacy "token"
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ── Response interceptor — auto-refresh access token on 401 ──────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh-token");

    // Attempt token refresh only once per request
    if (is401 && !originalRequest._retry && !isRefreshEndpoint) {
      if (isRefreshing) {
        // Queue requests that come in while a refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;

      if (!refreshToken) {
        isRefreshing = false;
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${API_BASE}/api/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("token", newAccessToken); // backward compat
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — clear tokens and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;