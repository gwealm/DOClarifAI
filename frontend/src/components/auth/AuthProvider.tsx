import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth";

type Props = {children:React.ReactNode};
function AuthProvider(props:Props) {
    const savedToken = localStorage.getItem("jwtToken");
    const startLoggedIn = savedToken !== null;

    type User = {
        username: string,
        name?: string,
    };

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState(savedToken);
    const [isLogedIn, setIsLogedIn] = useState(startLoggedIn);
    const navigate = useNavigate();
    const saveToken = (token: string | null) => {
        if (token === null) {
            localStorage.removeItem("jwtToken");
        }
        else {
            localStorage.setItem("jwtToken", token);
        }
        setToken(token);
    }

    const onLogIn = (token: string) => {
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
    async function authFetch(url: RequestInfo, params: RequestInit) {
        if (!isLogedIn || token == null) {
            // TODO: ERROR MESSAGES
            console.error("User Is not Logged in!");
            return false;
        }
        if (params === null || params === undefined) {
            params = {};
        }
        if (!params.headers) {
            params.headers = new Headers();
        }
        else {
            params.headers = new Headers(params.headers);
        }
        params.headers.set("Authorization", `Bearer ${token}`);
        const res = await fetch(url, params);
        if (res.status == 403) {
            onLogout();
            navigate("/login");
        }
        return res;
    }

    const logIn = async (username: string, password: string) => {
        const data = new FormData();
        data.append("username", username);
        console.log("Trying to log in");
        data.append("password", password);
        const res = await fetch("http://localhost:8083/oauth/token", {
            method: 'post',
            mode: 'cors',
            body: data,
        });
        const json_res = await res.json();
        if (res.ok) {
            console.log("Log In Success");
            const token = json_res.access_token
            onLogIn(token);
            return null;
        } else {
            saveToken(null);
            setIsLogedIn(false);
            console.log("Log In Failed")
            return json_res.detail;
        }
    }
    const register = async (username: string, password: string) => {
        const data = { "username": username, "password": password };
        const res = await fetch("http://localhost:8083/users", {
            method: 'post',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            console.log("Successefully Created account!");
            const logRes = await logIn(username, password);
            return logRes;
        } else {
            const json_res = await res.json()
            console.log("Register Failed!");
            return json_res.detail;
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