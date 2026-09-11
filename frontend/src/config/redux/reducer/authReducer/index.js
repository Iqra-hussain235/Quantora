import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  updateProfile,
  getMe,
  refreshAccessToken,
  logoutUser,
} from "../../action/authAction";

// ── Helper: read initial tokens from localStorage (browser only) ──────────────
const getStoredToken = (key) =>
  typeof window !== "undefined" ? localStorage.getItem(key) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: getStoredToken("accessToken") || getStoredToken("token"),
    refreshToken: getStoredToken("refreshToken"),
    loading: false,
    error: null,
    isAuthenticated: !!(getStoredToken("accessToken") || getStoredToken("token")),
  },

  reducers: {
    // Synchronous logout (fallback / direct call)
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ── loginUser ────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.accessToken || action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // ── registerUser ─────────────────────────────────────────────────────────
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.accessToken || action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // ── getMe ────────────────────────────────────────────────────────────────
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Token is invalid — clear auth state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

    // ── refreshAccessToken ────────────────────────────────────────────────────
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // Refresh failed — force full logout
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      })

    // ── updateProfile ─────────────────────────────────────────────────────────
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // ── logoutUser (async thunk) ──────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;