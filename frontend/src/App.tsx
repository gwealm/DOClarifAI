import React from "react";
import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider"
import Workflow from "./pages/Workflow";
import Header from "./components/Header";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import ProcessedFiles from "./pages/ProcessedFiles";
import { AboutUs } from "./pages/AboutUs";
import HomePage from "./pages/HomePage";

import Router from "./Router";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router />
        </ThemeProvider>
    );
}

export default App;
