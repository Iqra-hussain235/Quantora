import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api";

// ── Helper: set a cookie (accessible to Next.js middleware) ──────────────────
const setCookie = (name, value, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // SameSite=Lax works for same-origin requests; Secure on HTTPS
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const removeCookie = (name) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

// ── Helper: persist tokens to localStorage + cookie ───────────────────────────
const saveTokens = (data) => {
  const access  = data.accessToken || data.token;
  const refresh = data.refreshToken;

  if (access) {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("token", access);   // backward compat
    // Write to cookie so Next.js Edge middleware can read it
    setCookie("accessToken", access, 1);     // 1 day (matches JWT expiry)
    setCookie("token", access, 1);
  }
  if (refresh) {
    localStorage.setItem("refreshToken", refresh);
    setCookie("refreshToken", refresh, 7);
  }
};

// ── Helper: clear all tokens ──────────────────────────────────────────────────
const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  removeCookie("accessToken");
  removeCookie("token");
  removeCookie("refreshToken");
};

// ── REGISTER USER ─────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const res = await API.post("/auth/register", userData);
      saveTokens(res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Register failed. Please try again."
      );
    }
  }
);

// ── LOGIN USER ────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const res = await API.post("/auth/login", userData);
      saveTokens(res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  }
);

// ── GET CURRENT USER ──────────────────────────────────────────────────────────
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/auth/me");
      // Support both { user: {...} } and flat { _id, name, ... } shapes
      return res.data.user || res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user."
      );
    }
  }
);

// ── REFRESH TOKEN ─────────────────────────────────────────────────────────────
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available.");

      const res = await API.post("/auth/refresh-token", { refreshToken });
      saveTokens(res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Token refresh failed."
      );
    }
  }
);

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const res = await API.put("/users/profile", userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile update failed."
      );
    }
  }
);

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await API.post("/auth/logout");
    } catch (_) {
      // Ignore network errors — always clear local tokens
    } finally {
      clearTokens();
    }
    return null;
  }
);