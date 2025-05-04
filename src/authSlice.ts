import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";
import { WritableDraft } from "immer";

const cookie = new Cookies();

interface UserInfo {
    name: string;
    iconUrl: string | null;
}
export interface AuthState {
    isSignIn: boolean;
    isLoading: boolean;
    user: UserInfo | null;
}

const initialState: AuthState = {
    isSignIn: cookie.get("token") !== undefined,
    isLoading: true,
    user: null,
};

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SignIn: (state: WritableDraft<AuthState>, action: PayloadAction<UserInfo | null>) => {
            state.isSignIn = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        SignOut: (state: WritableDraft<AuthState>) => {
            state.isSignIn = false;
            state.isLoading = false;
            state.user = null;
        },
        CompleteLoading: (state: WritableDraft<AuthState>) => {
            state.isLoading = false;
        },
    },
});

export const { SignIn, SignOut, CompleteLoading } = AuthSlice.actions;
export default AuthSlice.reducer;