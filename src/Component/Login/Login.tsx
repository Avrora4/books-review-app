import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Login.scss";
import { Header } from "../Common/Header"; 

export const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError(null);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError(null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            setEmailError('Please Input Email or correct Email')
        }

        if (!password) {
            setPasswordError('Please Input Password');
        }
    };

    return (
        <>
        <Header />
        <div className="LoginFrom">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmailChange} />
                    {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} />
                    {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
        </>
    );
};

