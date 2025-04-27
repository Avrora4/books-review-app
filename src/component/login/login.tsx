import { useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginRequest } from "../../model/user/loginModels";
import { loginAPI, getLoginInfoAPI } from "../../services/user/userService";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { SignIn } from "../../authSlice";
import { getLoginInfoRequest } from "../../model/user/profileEditModels"

export const Login = () => {
    const navigate = useNavigate(); 
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [, setTokenCookie] = useCookies(['authToken']);
    const dispatch = useDispatch();

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
            if(loginResponse && typeof loginResponse === "object" && "token" in loginResponse && loginResponse.token) {
                setTokenCookie('authToken', loginResponse.token, { path: '/', expires: new Date(Date.now() + 86400 * 1000)});

                try {
                    const loginInfoRequestData: getLoginInfoRequest = {
                        token: `Bearer ${loginResponse.token}`
                    };
                     const userInfo = await getLoginInfoAPI(loginInfoRequestData);
    
                     if (userInfo && typeof userInfo === 'object' && "name" in userInfo && userInfo.name) {
                         dispatch(SignIn({ name: userInfo.name, iconUrl: userInfo.iconUrl || null }));
    
                         console.log("User info fetched after login:", userInfo);
    
                         navigate('/home');
                     } else {
                         setErrorMessage("Login successful, but failed to fetch user info.");
                     }
    
                } catch (err) {
                     setErrorMessage(`"Error calling getLoginInfoAPI after login: " ${err}`);
                }
            } else {
                setErrorMessage(`Login Fiald\n ErrorMessages: ${loginResponse}`);
            }
            

        } catch (err) {
            setErrorMessage(`Error during login: ${err}`);
        }
    };

    return (
        <div className="LoginFrom">
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

// Cookieで設定できるデータのサイズが限られているため、今回は必要ないかも、、
// localstrageが非推奨な理由は、javascriptからアクセスできてしまうため