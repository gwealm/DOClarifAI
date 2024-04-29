import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider(props) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLogedIn, setIsLogedIn] = useState(false);

    const authFetch = (url, params) => {
        if (!isLogedIn || token == null) {
            console.error("User Is not Logged in!");
            return false;
        }
        if (!params) {
            params = {};
        }
        if (!params.headers) {
            params.headers = {};
        }
        params.headers['Authorization'] = `Bearer ${token.access_token}`;
        return fetch(url, params);
    }

    const onLogIn = (token) => {
        setIsLogedIn(true);
        setToken(token)
    }
    const onLogout = () => { setIsLogedIn(false); }
    const onRegister = () => {
        setIsLogedIn(true);
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
            console.log("Log In Success");
            const token = await res.json();
            onLogIn(token);
            return true;
        } else {
            // TODO
            setToken(null);
            setIsLogedIn(false);
            console.log("Log In Failed")
            console.log(res.status)
            console.log(res.statusText)
            return false;
        }
    }
    const register = async (email, password) => {
        const data = { "username": email, "password": password };
        console.log(JSON.stringify(data));
        const res = await fetch("http://localhost:8083/users", {
            method: 'post',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            console.log("Successefully Created account");
            const logRes = await logIn(email, password);
            return logRes;
        } else {
            // TODO
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