import React from 'react';
import logo from './logo.svg';
import './App.css';
import List from './pages/employees/List';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path='/' element={<List />} />
    </Routes>
  );
}

export default App;
