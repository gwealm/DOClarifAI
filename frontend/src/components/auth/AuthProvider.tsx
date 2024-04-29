import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider(props) {
    const [user, setUser] = useState(null);
    const [isLogedIn, setIsLogedIn] = useState(false);

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
        onLogout: onLogout,
        onRegister: onRegister,
        onLogIn: onLogIn,
    };

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;