import React from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './App.css';
import Workflows from './pages/Workflows';
import Workflow from './pages/Workflow';
import Header from './components/Header';


function App() {
  //const location = useLocation();
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes location = {location} key = {location.pathname}>
          <Route path="/workflows" element={<Workflows/>}/>
          <Route path="/" element={<Workflows/>}/>
          <Route path="/workflow/:id" element={<Workflow/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
