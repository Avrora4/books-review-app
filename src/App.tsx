import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './Component/Login/Login';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};