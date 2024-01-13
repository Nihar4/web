import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "../src/css/global.css"
import Login from './components/AccessManagement/Login';
import Signup from './components/AccessManagement/Signup';
import Home from './components/Home/Home';
import DashBoard from './components/DashBoard/DashBoard';
import Error from './components/Error';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path='/signup/*' element={<Signup />} />
        <Route path='/dashboard' element={<DashBoard />} />
        <Route path='/404' element={<Error />} />
      </Routes>
    </Router>
  );
}


export default App;

