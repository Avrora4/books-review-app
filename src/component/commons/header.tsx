import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
import { SignOut } from "../../authSlice";
import { RootState } from "../../store";
import "./Header.scss";

export const Header = () => {
    const auth = useSelector((state: RootState) => state.auth.isSignIn);
    const userInfo = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ , removeCookie] = useCookies(['authToken']);
    const handleLogout = () => {
        removeCookie('authToken', { path: '/' });
        dispatch(SignOut());
        navigate("/login")
    };

    const userName = userInfo?.name || null;
    const iconUrl = userInfo?.iconUrl || null;
              
    return (
        <header className='header'>
            <nav>
                <ul>
                    <li className='eftContents'>
                        <span>Book-Review-App</span>
                        <Link to='/home'>Home</Link>
                    </li>
                    <li className='rightContents'>
                        {auth ? (
                            <>
                                {iconUrl && ( <img src={iconUrl} alt={`userIcon`} className='iconImage' />)}
                                <Link to='/profile'>{userName}</Link>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to='/login' className='button-link'>Login</Link>
                                <Link to='/signup' className='button-link'>Signup</Link>
                            </>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

