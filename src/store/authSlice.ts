import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  email: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("authToken"),
  email: localStorage.getItem("userEmail"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthState>) {
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    logout(state) {
      state.token = null;
      state.email = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
