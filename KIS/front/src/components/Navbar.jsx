import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Button } from 'react-bootstrap';

const Navbar = () => {
  const navigate = useNavigate();

  const handleServeClient = () => {
    navigate('/serve-client');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark">
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/orders">Заказы</Nav.Link>
        <Nav.Link as={Link} to="/product">Продукты</Nav.Link>
        <Nav.Link as={Link} to="/check">Чеки</Nav.Link>
        <Nav.Link as={Link} to="/client">Клиенты</Nav.Link>
      </Nav>
      <Button variant="outline-light" onClick={handleServeClient}>
        Обслужить клиента
      </Button>
    </BootstrapNavbar>
  );
};

export default Navbar;
