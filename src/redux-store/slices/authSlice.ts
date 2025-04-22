import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define default admin credentials
const DEFAULT_ADMIN = {
  email: "admin@prapti.org",
  password: "admin123",
};

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

// Define the authentication state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

// Initialize state from localStorage if available
const getUserFromStorage = (): User | null => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
};

const getTokenFromStorage = (): string | null => {
  return localStorage.getItem("token");
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

// Export selector
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated && state.auth.user?.role === "admin";

// Export reducer
export default authSlice.reducer;

// Export default admin credentials for mock authentication
export { DEFAULT_ADMIN };
