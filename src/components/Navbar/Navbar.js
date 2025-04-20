// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Optional for custom styles

const Navbar = () => {
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
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
