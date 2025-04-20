import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../../authSlice";
import { RootState } from "../../store";
import "./Header.scss";

export const Header = () => {
    const auth = useSelector((state: RootState) => state.auth.isSignIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [, , removeCookie] = useCookies();
    const handleLogout = () => {
        removeCookie('authToken', { path: '/' });
        dispatch(signOut());
        navigate("/login")
    };

    return (
        <header className='header'>
            <nav>
                <ul>
                    <li><Link to='/home'>Home</Link></li>
                    {auth ? (
                        <>
                        <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                        <>
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/signup'>Signup</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

