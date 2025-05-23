import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import { Router } from "./routes/router";
import { SignIn, SignOut, CompleteLoading } from "./authSlice";
import { RootState } from "./store";
import { getLoginInfoRequest } from "./model/user/profileEditModels";
import { getLoginInfoAPI } from "./services/user/userService";

export default function App() {
    const [cookies, , removeCookie] = useCookies<string>(['authToken']);
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth.isSignIn);

    useEffect (() => {
        console.log("Checking auth token in cookie...");
        const authToken = cookies.authToken;
        console.log(authToken);
        
        const getUserInfo = async () => {
            if(authToken) {
                try {
                    const loginInfoRequestData: getLoginInfoRequest = {
                        token: `Bearer ${authToken}`
                    }
                    const userInfoResponse = await getLoginInfoAPI(loginInfoRequestData);
                    if (userInfoResponse && typeof userInfoResponse === "object" && "name" in userInfoResponse) {
                        const userInfo = userInfoResponse;
                        dispatch(SignIn({ name: userInfo.name , iconUrl: userInfo.iconUrl || null}));
                    } else {
                        dispatch(SignOut());
                        removeCookie('authToken', { path: '/' });
                    }
                } catch (err) {
                    console.log(err);
                        dispatch(SignOut());
                        removeCookie('authToken', { path: '/' });
                }
            } else {
                if (auth) {
                    dispatch(SignOut());
                }
            }
        };
        
        getUserInfo();
        dispatch(CompleteLoading());
    }, [cookies.authToken, dispatch, auth, removeCookie])
        
    return (
        <div className='App'>
            <Router />
        </div>
    );
};