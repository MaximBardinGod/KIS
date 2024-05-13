import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        <li>
          <Link to="/specifications">Specifications</Link>
        </li>
        <li>
          <Link to="/stock">Stock</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;