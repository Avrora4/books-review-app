import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import { Router } from "./routes/router";
import { signIn, signOut } from "./authSlice";
import { RootState } from "./store";


export default function App() {
    const [cookies] = useCookies<string>(['authToken']);
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth.isSignIn);

    useEffect (() => {
        console.log("Checking auth token in cookie...");
        if(cookies.authToken && !auth) {
            dispatch(signIn());
        } else if (!cookies.authToken && auth) {
            dispatch(signOut());
        }
    }, [cookies.authToken, dispatch, auth])
    return (
        <div className='App'>
            <Router />
        </div>
    );
};