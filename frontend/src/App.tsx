import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Workflows from "./pages/Workflows";
import { ThemeProvider } from "./components/ThemeProvider"
import Workflow from "./pages/Workflow";
import Header from "./components/Header";
import ProcessedFiles from "./pages/ProcessedFiles";
import { AboutUs } from "./pages/AboutUs";

function App() {
    //const location = useLocation();
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Header />
                <BrowserRouter>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/workflows" element={<Workflows />} />
                        <Route path="/" element={<Workflows />} />
                        <Route path="/workflow/:id" element={<Workflow />} />
                        <Route
                            path="/processedfiles"
                            element={<ProcessedFiles />}
                        />
                        <Route path="/about-us" element={<AboutUs />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
}

export default App;
