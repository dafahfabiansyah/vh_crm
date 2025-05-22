import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser, refreshToken } from "../api/auth";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      // Store user data in localStorage for non-sensitive info
      localStorage.setItem("user_name", response.data.user.name);
      localStorage.setItem("user_email", response.data.user.email);
      localStorage.setItem("user_type", response.data.user.type || "free");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken: token } = getState().auth;
      await logoutUser(token);
      // Clear localStorage on logout
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_type");
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken: token } = getState().auth;
      if (!token) return rejectWithValue("No refresh token available");

      const response = await refreshToken(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {        
        state.isAuthenticated = true;
        state.token = action.payload.token.access_token;
        state.refreshToken = action.payload.token.refresh_token;
        state.businessName = action.payload.user.business_name;
        state.user = action.payload.user;
        state.loading = false;
        // DEBUG: Simpan refreshToken ke localStorage
        localStorage.setItem("debug_refreshToken", action.payload.token.refresh_token);
        localStorage.setItem("debug_businessName", action.payload.user.business_name);
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      // console.log("login.fulfilled", action.payload.access_token);
      // console.log("ini refresh token", action.payload.token.refresh_token);

      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.loading = false;
        // DEBUG: Hapus refreshToken dari localStorage
        localStorage.removeItem("debug_refreshToken");
      })
      .addCase(logout.rejected, (state) => {
        // Even if the server logout fails, we log out locally
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.loading = false;
        // DEBUG: Hapus refreshToken dari localStorage
        localStorage.removeItem("debug_refreshToken");
      })

      // Token refresh cases
      .addCase(refresh.pending, (state) => {
        state.loading = true;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.token = action.payload.token.access_token;
        state.refreshToken = action.payload.token.refresh_token || state.refreshToken;
        state.loading = false;
        // DEBUG: Simpan refreshToken ke localStorage (pakai yang baru jika ada, jika tidak pakai yang lama)
        localStorage.setItem("debug_refreshToken", action.payload.token.refresh_token || state.refreshToken);
      })
      .addCase(refresh.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.loading = false;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
