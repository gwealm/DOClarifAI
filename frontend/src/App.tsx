import React, { useState } from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './App.css';
import Workflows from './pages/Workflows';
import Workflow from './pages/Workflow';
import Header from './components/Header';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import ProcessedFiles from './pages/ProcessedFiles';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  }

  return (
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>
        <Routes location = {location} key = {location.pathname}>
          <Route path="/workflows" element={<Workflows/>}/>
          <Route path="/" element={<Workflows/>}/>
          <Route path="/workflow/:id" element={<Workflow/>}/>
          <Route path="/login" element={<LogIn onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin}/>} />
          <Route path="/processedfiles" element={<ProcessedFiles/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
