import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* 🔹 Header / Navbar */}
      <header className="landing-header">
        <div className="logo">RMMS</div>
        <nav className="landing-nav">
          <Link to="#pricing">Pricing</Link>
          <Link to="/login">Login</Link> 
          <Link to="/register" className="btn-free-trial">Free Trial</Link>
        </nav>
      </header>

      {/* 🔹 Hero Section */}
      <section className="hero">
        <h1>Manage Your Rice Mill Business Smarter</h1>
        <p>
          From paddy purchase to sales & reports — everything at your fingertips.  
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">Start Free Trial</Link>
          <Link to="#pricing" className="btn-secondary">View Pricing</Link>
        </div>
      </section>

      {/* 🔹 Pricing Section */}
      <section id="pricing" className="plans-container">
        {/* Basic Plan */}
        <div className="plan-card">
          <h2>Basic Plan</h2>
          <p className="price">₹499 / month</p>
          <ul>
            <li>✔ Dashboard Access</li>
            <li>✔ Basic Reports</li>
            <li>✔ Customer Management</li>
          </ul>
          <Link to="/register" className="plan-btn">Get Started</Link>
        </div>

        {/* Silver Plan */}
        <div className="plan-card featured">
          <h2>Silver Plan</h2>
          <p className="price">₹999 / month</p>
          <ul>
            <li>✔ Everything in Basic</li>
            <li>✔ Inventory Management</li>
            <li>✔ Sales & Purchase Vouchers</li>
          </ul>
          <Link to="/register" className="plan-btn">Choose Silver</Link>
        </div>

        {/* Gold Plan */}
        <div className="plan-card">
          <h2>Gold Plan</h2>
          <p className="price">₹1999 / month</p>
          <ul>
            <li>✔ Everything in Silver</li>
            <li>✔ Attendance & Payroll</li>
            <li>✔ Advanced Reports</li>
            <li>✔ Priority Support</li>
          </ul>
          <Link to="/register" className="plan-btn">Go Gold</Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
