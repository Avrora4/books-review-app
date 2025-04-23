import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut } from "../../authSlice";
import { RootState } from "../../store";
import "./Header.scss";
import { getLoginInfoAPI } from "../../services/user/userService";
import { getLoginInfoRequest } from "../../model/user/profileEditModels";

export const Header = () => {
    const auth = useSelector((state: RootState) => state.auth.isSignIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies, , removeCookie] = useCookies();
    const [userName, setUserName] = useState<string | null>('');
    const handleLogout = () => {
        removeCookie('authToken', { path: '/' });
        removeCookie('userName', { path: '/'});
        dispatch(signOut());
        navigate("/login")
    };

    useEffect(() => {
        if (auth && !userName) {
            const authToken = cookies.authToken;

            // トークンがあればユーザー名を取得
            if (authToken) {
                const fetchUserName = async () => {
                    try {
                        const loginInfoRequestData: getLoginInfoRequest = {
                            token: `Bearer ${authToken}`
                            };
                         const userInfoResponse = await getLoginInfoAPI(loginInfoRequestData);

                         if (userInfoResponse && typeof userInfoResponse === "object" && "name" in userInfoResponse && userInfoResponse.name) {
                             setUserName(userInfoResponse.name);
                         } else {
                             console.warn("Failed to fetch username in Header:", userInfoResponse);
                             setUserName(cookies.userName || null);
                         }
                    } catch (err) {
                         console.error("Error fetching username in Header:", err);
                         setUserName(cookies.userName || null);
                    }
                };
                fetchUserName();
            } else {
                 setUserName(cookies.userName || null);
            }
        } else if (!auth && userName) {
            setUserName(null);
        }
    }, [auth, userName, cookies.authToken, cookies.userName]);

    return (
        <header className='header'>
            <nav>
                <ul>
                    <li className="leftContents">
                        <span>Book-Review-App</span>
                        <Link to='/home'>Home</Link>
                    </li>
                    <li className="rightContents">
                        {auth ? (
                            <>
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

