import React, { useContext, useState, useEffect } from "react";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider(props) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLogedIn, setIsLogedIn] = useState(false);

    const logIn = async (email: string, password: string) => {
        const data = new FormData();
        data.append("username", email);
        data.append("password", password);
        const res = await fetch("http://localhost:8083/oauth/token", {
            method: 'post',
            mode: 'cors',
            body: data,
        });
        if (res.ok) {
            const token = await res.json();
            setToken(token);
            return true;
        } else {
            // TODO
            console.log(res.status)
            console.log(res.statusText)
            return false;
        }
    }
    const onLogIn = () => {
        setIsLogedIn(true);
        setUser({ name: "Marcelo", lastname: "Rebelo de Sussa" });
    }
    const onLogout = () => { setIsLogedIn(false); }
    const onRegister = () => {
        setIsLogedIn(true);
        setUser({ name: "Marcelo", lastname: "Rebelo de Sussa" });
    }
    const value = {
        user: user,
        isLoggedIn: isLogedIn,
        logIn: logIn,
        onLogout: onLogout,
        onRegister: onRegister,
        onLogIn: onLogIn,
    };

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;