import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Orders from './components/Orders';
import Product from './components/Products';
import Check from './components/Check';
import Client from './components/Client';
import ServeClient from './components/ServeClient';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/orders" element={<Orders />} />
        <Route path="/product" element={<Product />} />
        <Route path="/check" element={<Check />} />
        <Route path="/client" element={<Client />} />
        <Route path="/serve-client" element={<ServeClient />} />
      </Routes>
    </Router>
  );
};

export default App;
