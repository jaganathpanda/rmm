import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getUserInfo } from "../../utils/userSession"
import "./Navbar.css";

const Navbar = ({ logout }) => {
  const user = getUserInfo();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false); // Close menu after navigation
  };

  return (
    
    <nav className="navbar">
      <h1 className="logo">{user[4]}</h1>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
        <li><Link to="/inventory" onClick={handleLinkClick}>Inventory</Link></li>
        <li><Link to="/purchases" onClick={handleLinkClick}>Purchases</Link></li>
        <li><Link to="/sales" onClick={handleLinkClick}>Sales</Link></li>
        <li><Link to="/customers" onClick={handleLinkClick}>Customers</Link></li>
        <li><Link to="/reports" onClick={handleLinkClick}>Reports</Link></li>
        <li><Link to="/settings" onClick={handleLinkClick}>Settings</Link></li>
        <li><Link to="/profile" onClick={handleLinkClick}>Profile</Link></li>
        <li>
          <button onClick={() => { logout(); handleLinkClick(); }} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
