import React from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Workflows from './pages/Workflows';
import Workflow from './pages/Workflow';
import Header from './components/Header';
import ProcessedFiles from './pages/ProcessedFiles';


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
          <Route path="/processedfiles" element={<ProcessedFiles/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
