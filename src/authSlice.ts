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
    user: UserInfo | null;
}

const initialState: AuthState = {
    isSignIn: cookie.get("token") !== undefined,
    user: null,
};

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SignIn: (state: WritableDraft<AuthState>, action: PayloadAction<UserInfo | null>) => {
            state.isSignIn = true;
            state.user = action.payload;
        },
        SignOut: (state: WritableDraft<AuthState>) => {
            state.isSignIn = false;
            state.user = null;
        },
    },
});

export const { SignIn, SignOut } = AuthSlice.actions;
export default AuthSlice.reducer;