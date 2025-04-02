import React from "react";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../authSlice";
import { RootState } from "../../store";
import "./Header.scss";

export const Header = () => {
    const auth = useSelector((state: RootState) => state.auth.isSignIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies();
    const handleSignOut = () => {
        dispatch(signOut());
        removeCookie("token");
        navigate("/sighin")
    };

    const handleLogin = () => {
        navigate("/login");
    }

    return (
        <header className='header'>
            <h1>Books-Review</h1>
            {auth ? (
                <button onClick={handleSignOut} className='sign-out-button'>
                    SignOut
                </button>
            ) : (
                <button onClick={handleLogin} className='login-button'>
                    Login
                </button>
            )}
        </header>
    );
};

