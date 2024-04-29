import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider(props) {
    const [authUser, setAuthUser] = useState(null);
    const [isLogedIn, setIsLogedIn] = useState(false);

    const value = [
        authUser,
        setAuthUser,
        isLogedIn,
        setIsLogedIn
    ];

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;