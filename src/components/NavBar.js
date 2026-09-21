import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import './NavBar.css';

const Navbar = () => {
 


  
  return (
    <BootstrapNavbar bg="light" expand="lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <h2>Nodes</h2>
        </Link>
        <BootstrapNavbar.Toggle aria-controls="navbarNav" />
        <BootstrapNavbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Link className="nav-link" to="/FetchProducts" >
              Add Items
            </Link>
            <Link className="nav-link" to="/viewItems" >
              View/Modify Items
            </Link>
            <Link className="nav-link" to="/viewMyOrder" >
              Track Order
            </Link>
            <Link className="nav-link" to="/viewOrders" >
              View Orders
            </Link>
            <Link className="nav-link" to="/deliveryOfficialsLogIn" >
              Verify Delivery
            </Link>
            <Link className="nav-link" to="/contactUs" >
              ContactUs
            </Link>
            <Link className="nav-link" to="/trackOrder/" >
              LogIn
            </Link>
            <Link className="nav-link" to="/logout" >
              LogOut
            </Link>
            
          </Nav>
        </BootstrapNavbar.Collapse>
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
