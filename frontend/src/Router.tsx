import React from "react";
import Workflows from "./pages/Workflows";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Workflow from "./pages/Workflow";
import Header from "./components/Header";
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ProcessedFiles from "./pages/ProcessedFiles";
import AuthProvider from "./components/auth/AuthProvider";
import Template from "./pages/Template"
import Templates from "./pages/Templates"
import Schema from "./pages/Schema"
import Schemas from "./pages/Schemas"
import ProcessedFile from "./pages/ProcessedFile"

import { AboutUs } from "./pages/AboutUs";
import { HomePage } from "./pages/HomePage";

function Router() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="w-full h-full ">
                    <Header />
                    <Routes location={location} key={location.pathname}>
                        <Route path="/workflows" element={<Workflows />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/templates" element={<Templates  />} />
                        <Route
                            path="/templates/:id"
                            element={<Template />}
                        />
                        <Route path="/schemas" element={<Schemas  />} />
                        <Route
                            path="/schemas/:id"
                            element={<Schema />}
                        />
                        <Route path="/workflow/:id" element={<Workflow />} />
                        <Route
                            path="/workflow/:id/processed-files"
                            element={<ProcessedFiles />}
                        />
                        <Route
                            path="/workflow/:id/processed-files/:fileId"
                            element={<ProcessedFile />}
                        />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/login" element={<LogIn />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default Router;