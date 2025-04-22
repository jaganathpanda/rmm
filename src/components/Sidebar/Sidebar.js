// SidebarToggle.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">Rice Mill</div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/paddyPurchaseForm">Paddy Purchase Form</Link></li>
          <li>
            Sales Voucher
            <ul className="submenu">
              <li><Link to="/goodsSalesVoucherForm">Sales Form</Link></li>
              <li><Link to="/salesVoucherCardView">Sales Report View</Link></li>
            </ul>
          </li>
          <li><Link to="/customers">Customers</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><button className="logout-btn" onClick={logout}>Logout</button></li>
        </ul>
      </div>

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        {/* Your page content here */}
      </div>
    </>
  );
};

export default Sidebar;
