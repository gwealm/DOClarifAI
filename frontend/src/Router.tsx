import React from "react";
import Workflows from "./pages/Workflows";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Workflow from "./pages/Workflow";
import Header from "./components/Header";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import ProcessedFiles from "./pages/ProcessedFiles";
import AuthProvider from "./components/auth/AuthProvider";
import { AboutUs } from "./pages/AboutUs";

function Router() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Header />
                <Routes location={location} key={location.pathname}>
                    <Route path="/workflows" element={<Workflows />} />
                    <Route path="/" element={<Workflows />} />
                    <Route path="/workflow/:id" element={<Workflow />} />
                    <Route
                        path="/processedfiles"
                        element={<ProcessedFiles />}
                    />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default Router;