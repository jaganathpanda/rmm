import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Inventory from "./components/Inventory/Inventory";
import Purchases from "./components/Purchases/Purchases";
import Sales from "./components/Sales/Sales";
import Customers from "./components/Customers/Customers";
import Reports from "./components/Reports/Reports";
import Settings from "./components/Settings/Settings";
import Profile from "./components/Profile/Profile"; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    sessionStorage.clear(); 
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <>
          <Navbar logout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<LoginPage setUserLoggedIn={(val) => {
            if (val) {
              localStorage.setItem("isLoggedIn", "true");
              setIsLoggedIn(true);
            }
          }} />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
