import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Compressor from "compressorjs";
import "./Signup.scss"
import { signupUserRequest, iconUploadRequest } from "../../model/user/signupModels.ts";
import { iconUploadAPI, signupUserAPI, getLoginInfoAPI } from "../../services/user/userService.ts";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { SignIn } from "../../authSlice.ts";
import { getLoginInfoRequest } from "../../model/user/profileEditModels.ts";


export const Signup = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [, setTokenCookie] = useCookies(['authToken']);
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Please input your name'),
        email: Yup.string().email('Your email address is not correct').required('Please input your email'),
        password: Yup.string().required('Please input your password'),
        icon: Yup.mixed().nullable(),
    });

    const handleIconChange = (setFieldValue: (field: string, value: File | null, shouldValidate?: boolean) => void, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    setFieldValue('icon',result as File);
                },
                error(err) {
                    console.error(err);
                    setFieldValue('icon', null);
                    setErrorMessage('Faild to resize the icon');
                },
            });
        }
    };

    const onSignup = async (userValues: signupUserRequest, iconValue: iconUploadRequest) => {
        const userFormData: signupUserRequest = {
            name: userValues.name,
            email: userValues.email,
            password: userValues.password,
        };

        const iconFormData: iconUploadRequest = {token: '', icon: null};
        if (iconValue.icon !== null) {
            iconFormData.icon = iconValue.icon;
        }
        
        // Call API
        try {
            const signupResponse = await signupUserAPI(userFormData);

            if(signupResponse && typeof signupResponse === "object" && "token" in signupResponse && signupResponse.token) {
                setTokenCookie('authToken', signupResponse.token, { path: '/', expires: new Date(Date.now() + 86400 * 1000)});
                
                if (iconValue.icon) {
                    iconFormData.token = signupResponse.token;
                    const iconResponse = await iconUploadAPI(iconFormData);
                    if(iconResponse && typeof iconResponse === "object" && "iconUrl" in iconResponse && iconResponse.iconUrl) {
                        console.log(iconResponse.iconUrl);
                    }
                }
            
                try {
                    const loginInfoRequestData: getLoginInfoRequest = {
                        token: `Bearer ${signupResponse.token}`
                    };
                     const userInfo = await getLoginInfoAPI(loginInfoRequestData);
    
                     if (userInfo && typeof userInfo === 'object' && "name" in userInfo && userInfo.name) {
                         dispatch(SignIn({ name: userInfo.name, iconUrl: userInfo.iconUrl || null })); // iconUrl は getLoginInfoAPI からの値を使用するのが確実
    
                         console.log("User info fetched after login:", userInfo);
    
                         navigate('/home');
                     } else {
                         setErrorMessage("Login successful, but failed to fetch user info.");
                     }
    
                } catch (err) {
                     setErrorMessage(`"Error calling getLoginInfoAPI after login: " ${err}`);
                }

            } else {
                setErrorMessage(`Signup Failed\n ErrorMessages: ${signupResponse}`);
            }

        } catch (err) {
            setErrorMessage(`Error during signup: ${err}`);
        }
    };

    return (
        <div className="SignupForm">
            <h1>Signup</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <Formik
                initialValues={{ name: '', email: '', password: '', icon: null }}
                validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting}) => {
                    const userValues: signupUserRequest = {
                        name: values.name,
                        email: values.email,
                        password: values.password,
                    };
                    const iconValues : iconUploadRequest = { token: '', icon: values.icon };
                    onSignup(userValues,iconValues);
                    setSubmitting(false);
                }}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <div>
                            <label>Name</label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="p" className="error-message" />
                        </div>
                        <div>
                            <label>Email</label>
                            <Field type="email" name="email" />
                            <ErrorMessage name="email" component="p" className="error-message" />
                        </div>
                        <div>
                            <label>Password</label>
                            <Field type="password" name="password" />
                            <ErrorMessage name="password" component="p" className="error-message" />
                        </div>
                        <div>
                            <label>Icon</label>
                            <input type="file" onChange={(event) => handleIconChange(setFieldValue, event)} />
                            <ErrorMessage name="name" component="p" className="error-message" />
                        </div>
                        <button type="submit">Signup</button>
                    </Form>
                )}
                </Formik>
                <p>
                    Do you have your account?? <Link to="/login">Login</Link>
                </p>
        </div>
    );
};


// 模倣で問題ない
// こだわりポイントとか
// 同じものでも内部の技術を変えてみる
// サービスをデプロイしてみると良い
// Firebase