import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Orders from './components/Orders';
import Specifications from './components/Specifications';
import Stock from './components/Stock';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/orders" element={<Orders />} />
        <Route path="/specifications" element={<Specifications />} />
        <Route path="/stock" element={<Stock />} />
      </Routes>
    </Router>
  );
};

export default App;
