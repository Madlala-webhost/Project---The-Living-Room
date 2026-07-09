import { configureStore } from "@reduxjs/toolkit";
import { baseAPI } from "./api/baseAPI";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseAPI.middleware),
});
//The store is the central hub for managing the application's state. It combines reducers and applies middleware, such as the baseAPI middleware, to handle asynchronous actions and side effects.
