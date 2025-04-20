import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../component/login/login";
import { Signup } from "../component/signup/signup";
import { BookList } from "../component/booklist/booklist"

import { RootState } from "../store";

export const Router = () => {
    const auth = useSelector((state: RootState) => state.auth.isSignIn);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {auth ? (
                    <>
                    <Route path="/home" element={<BookList />}/>
                    </>
                ) : (
                    <Route path='/*' element={<Navigate to='/signin' replace/>} />
                )}
            </Routes>
        </BrowserRouter>
    );
};
