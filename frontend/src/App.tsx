import React from "react";
import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider"
import AuthProvider from "./components/auth/AuthProvider";
import Router from "./Router";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Router />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
