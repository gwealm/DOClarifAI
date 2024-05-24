import React from "react";
import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider"
import Router from "./Router";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router />
        </ThemeProvider>
    );
}

export default App;
