import React, { useContext } from "react";

const AuthContext = React.createContext();

function useAuth() {
    return useContext(AuthContext);
}

export { useAuth, AuthContext };