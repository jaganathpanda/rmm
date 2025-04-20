// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Optional for custom styles

const Navbar = ({ logout }) => {
    return (
      <nav className="navbar">
        <h1 className="logo">Rice Mill</h1>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/inventory">Inventory</a></li>
          <li><a href="/purchases">Purchases</a></li>
          <li><a href="/sales">Sales</a></li>
          <li><a href="/customers">Customers</a></li>
          <li><a href="/reports">Reports</a></li>
          <li><a href="/settings">Settings</a></li>
          <li><button onClick={logout}>Logout</button></li>
        </ul>
      </nav>
    );
  };
  

export default Navbar;
