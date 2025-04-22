import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../component/login/login";
import { Signup } from "../component/signup/signup";
import { BookList } from "../component/booklist/booklist";
import { Header } from "../component/commons/header";
import { RootState } from "../store";

export const Router = () => {
    const auth = useSelector((state: RootState) => state.auth.isSignIn);

    return (
        <BrowserRouter>
        <Header />
            <Routes>
                <Route path="/login" element={auth ? <Navigate to='/home' /> : <Login />} />
                <Route path="/signup" element={auth ? <Navigate to='/home' /> : <Signup />} />
                <Route path="/home" element={auth ? <BookList /> : <Navigate to='/login' replace />}/>
                <Route path='/*' element={auth ? <Navigate to='/home' replace/> : <Navigate to='/login' replace />} />
            </Routes>
        </BrowserRouter>
    );
};