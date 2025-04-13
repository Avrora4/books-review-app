<<<<<<< Updated upstream
import React, { useState, ChangeEvent, FormEvent } from 'react';
import './Login.scss';
=======
import { useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginRequest } from "../../model/user/loginModels";
import { loginAPI } from "../../services/user/userService";
// import { Header } from "../common/header"; 
>>>>>>> Stashed changes

export const Login = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>('');


    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Your email address is not correct').required('Please input your email'),
        password: Yup.string().required('Please input your password'),
    });

    const onLogin = async (loginValues: loginRequest) => {
        const loginFormData: loginRequest = {
            email: loginValues.email,
            password: loginValues.password,
        };

        try {
            const loginResponse = await loginAPI(loginFormData);

            if ( "token" in loginResponse) {
                localStorage.setItem('authToken', loginResponse.token);
                navigate('/home');
            } else {
                setErrorMessage(`Login Fiald\n ErrorMessages: ${loginResponse}`);
            }
        } catch (err) {
            setErrorMessage(`Error during login: ${err}`);
        }
    };

    return (
<<<<<<< Updated upstream
        <div>
=======
        <>
        <div className="LoginFrom">
>>>>>>> Stashed changes
            <h1>Login</h1>
            {errorMessage && <p style={{ color: 'red'}}>{errorMessage}</p>}
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const userValues: loginRequest = {
                        email: values.email,
                        password: values.password,
                    };
                    onLogin(userValues);
                    setSubmitting(false);
                }}
            >
            <Form>
                    <div>
                        <label htmlFor="email">Email</label>
                        <Field type="email" name="email" id="email" />
                        <ErrorMessage name="email" component="p" className="error-message" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <Field type="password" name="password" id="password" />
                        <ErrorMessage name="password" component="p" className="error-message" />
                    </div>
                    <button type="submit">Login</button>
                </Form>
            </Formik>
        </div>
    );
};

