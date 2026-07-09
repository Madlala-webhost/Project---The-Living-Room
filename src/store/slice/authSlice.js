import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    isAuthenticated: false,
    isInitialized: false,
    isAdmin: false,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.isInitialized = true;
            state.isAdmin = action.payload?.role === "admin";
        },
        clearUser:(state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
            state.isAdmin = false;
        },
        setInitialized:(state) => {
            state.isInitialized = true;
        }
    }
})

export const { setUser, clearUser, setInitialized } = authSlice.actions;
export default authSlice.reducer;