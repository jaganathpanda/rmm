import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar"

// Placeholder pages
const Home = () => <h2>Welcome to Rice Mill Management System</h2>;
const Inventory = () => <h2>Inventory Page</h2>;
const Purchases = () => <h2>Purchases Page</h2>;
const Sales = () => <h2>Sales Page</h2>;
const Customers = () => <h2>Customers Page</h2>;
const Reports = () => <h2>Reports Page</h2>;
const Settings = () => <h2>Settings Page</h2>;
const Logout = () => <h2>You have been logged out.</h2>;

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
