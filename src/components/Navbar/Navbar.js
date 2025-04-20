// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ logout }) => {
  return (
    <nav className="navbar">
      <h1 className="logo">Rice Mill</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/purchases">Purchases</Link></li>
        <li><Link to="/sales">Sales</Link></li>
        <li><Link to="/customers">Customers</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><button onClick={logout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
