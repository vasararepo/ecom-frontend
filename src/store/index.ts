import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.ts";
import orderReducer from "./orderSlice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
  },
});

/* Types for TypeScript */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
