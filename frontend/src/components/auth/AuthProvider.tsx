import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth";


function AuthProvider(props) {
    const savedToken = localStorage.getItem("jwtToken");
    const startLoggedIn = savedToken !== null;


    const [user, setUser] = useState(null);
    const [token, setToken] = useState(savedToken);
    const [isLogedIn, setIsLogedIn] = useState(startLoggedIn);
    const navigate = useNavigate();
    const saveToken = (token) => {
        localStorage.setItem("jwtToken", token);
        setToken(token);
    }

    const onLogIn = (token) => {
        setIsLogedIn(true);
        saveToken(token)
    }
    const onLogout = () => {
        setIsLogedIn(false);
        setUser(null);
        saveToken(null);
    }
    const onRegister = () => {
        setIsLogedIn(true);
    }
    const authFetch = async (url, params) => {
        if (!isLogedIn || token == null) {
            // TODO: ERROR MESSAGES
            console.error("User Is not Logged in!");
            return false;
        }
        if (!params) {
            params = {};
        }
        if (!params.headers) {
            params.headers = {};
        }
        params.headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(url, params);
        if (res.status == 403) {
            onLogout();
            navigate("/login");
        }
        return res;
    }

    const logIn = async (email: string, password: string) => {
        const data = new FormData();
        data.append("username", email);
        console.log("Trying to log in");
        data.append("password", password);
        const res = await fetch("http://localhost:8083/oauth/token", {
            method: 'post',
            mode: 'cors',
            body: data,
        });
        if (res.ok) {
            // TODO: ERROR MESSAGES
            console.log("Log In Success");
            const token = await res.json();
            onLogIn(token.access_token);
            return true;
        } else {
            saveToken(null);
            setIsLogedIn(false);
            // TODO: ERROR Messages
            console.log("Log In Failed")
            console.log(res.status)
            console.log(res.statusText)
            return false;
        }
    }
    const register = async (email, password) => {
        const data = { "username": email, "password": password };
        const res = await fetch("http://localhost:8083/users", {
            method: 'post',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            // TODO: error messages
            console.log("Successefully Created account!");
            const logRes = await logIn(email, password);
            return logRes;
        } else {
            // TODO: error messages
            console.log("Register Failed!");
            console.log(res.status)
            console.log(res.statusText)
            return false;
        }

    }
    const value = {
        user: user,
        setUser: setUser,
        isLoggedIn: isLogedIn,
        logIn: logIn,
        register: register,
        onLogout: onLogout,
        onRegister: onRegister,
        onLogIn: onLogIn,
        fetch: authFetch,
    };

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;