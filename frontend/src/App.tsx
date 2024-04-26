import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Workflows from "./pages/Workflows";
import { ThemeProvider } from "./components/ThemeProvider"
import Workflow from "./pages/Workflow";
import Header from "./components/Header";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import ProcessedFiles from "./pages/ProcessedFiles";
import { AboutUs } from "./pages/AboutUs";
import Profile from "./pages/Profile";



function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
      setIsLoggedIn(true);
    }

    const handleLogout = () => {
      setIsLoggedIn(false);
    }

    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <BrowserRouter>
                    <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/workflows" element={<Workflows />} />
                        <Route path="/" element={<Workflows />} />
                        <Route path="/workflow/:id" element={<Workflow />} />
                        <Route
                            path="/processedfiles"
                            element={<ProcessedFiles />}
                        />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/login" element={<LogIn onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register onLogin={handleLogin}/>} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
}

export default App;
