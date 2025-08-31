import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
 
import './App.css';
 
import LandingRoutes from './landing/LandingRoutes';
import Test from './test/Test';
 
 
import LandingRoutes from './landing/LandingRoutes';
 

 

function App() {
  return (
    <>
    <Router>
      <LandingRoutes/>
    </Router>
    
    </>
  );
}

export default App;
