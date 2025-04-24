import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getUserInfo } from "../../utils/userSession";
import "./Navbar.css";

const Navbar = ({ logout }) => {
  const user = getUserInfo();
  const [menuOpen, setMenuOpen] = useState(false);
  const [salesSubmenuOpen, setSalesSubmenuOpen] = useState(false);
  const [paddySubmenuOpen, setPaddySubmenuOpen] = useState(false); // new

  const handleLinkClick = () => {
    setMenuOpen(false); // Close menu after navigation
    setSalesSubmenuOpen(false); // Close submenu as well
    setPaddySubmenuOpen(false); // Close paddy submenu too
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

        {/* Paddy Purchase Submenu */}
        <li className="submenu-parent">
          <span onClick={() => setPaddySubmenuOpen(!paddySubmenuOpen)}>
            Paddy Purchase Form ▾
          </span>
          <ul className={`submenu ${paddySubmenuOpen ? "show" : ""}`}>
            <li>
              <Link to="/paddyPurchaseForm" onClick={handleLinkClick}>
                Paddy Purchase Form
              </Link>
            </li>
            <li>
              <Link to="/paddyPurchaseReport" onClick={handleLinkClick}>
                Paddy Purchase Report
              </Link>
            </li>
          </ul>
        </li>

        {/* Sales Voucher Menu with Submenu */}
        <li className="submenu-parent">
          <span onClick={() => setSalesSubmenuOpen(!salesSubmenuOpen)}>
            Sales Voucher ▾
          </span>
          <ul className={`submenu ${salesSubmenuOpen ? "show" : ""}`}>
            <li>
              <Link to="/goodsSalesVoucherForm" onClick={handleLinkClick}>
                Sales Voucher Form
              </Link>
            </li>
            <li>
              <Link to="/salesVoucherCardView" onClick={handleLinkClick}>
                Sales Report View
              </Link>
            </li>
          </ul>
        </li>

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
