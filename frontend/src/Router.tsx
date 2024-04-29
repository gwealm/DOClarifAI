import React, { useState } from "react";
import Workflows from "./pages/Workflows";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Workflow from "./pages/Workflow";
import Header from "./components/Header";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import ProcessedFiles from "./pages/ProcessedFiles";
import { AboutUs } from "./pages/AboutUs";

function Router(props) {
    const isLoggedIn = false;
    const handleLogout = false;
    const handleLogin = false;

    return (
        <BrowserRouter>
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
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
                <Route path="/register" element={<Register onLogin={handleLogin} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;