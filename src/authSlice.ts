import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";
import { WritableDraft } from "immer";

const cookie = new Cookies();

export interface AuthState {
    isSignIn: boolean;
}

const initialState: AuthState = {
    isSignIn: cookie.get("token") !== undefined,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signIn: (state: WritableDraft<AuthState>) => {
            state.isSignIn = true;
        },
        signOut: (state: WritableDraft<AuthState>) => {
            state.isSignIn = false;
        },
    },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;