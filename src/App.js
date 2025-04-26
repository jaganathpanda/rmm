import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Inventory from "./components/Inventory/Inventory";
import PaddyPurchaseForm from "./components/PaddyPurchaseForm/PaddyPurchaseForm";
import PaddyPurchaseReport from "./components/PaddyPurchaseForm/PaddyPurchaseReport";
import TransitPassList from "./components/Transit/TransitPassList/TransitPassList";
import ViewTransitPassForm from "./components/Transit/ViewTransitPassForm/ViewTransitPassForm";
import GoodsSalesVoucherForm from "./components/GoodsSalesVoucherForm/GoodsSalesVoucherForm";
import Customers from "./components/Customers/Customers";
import Reports from "./components/Reports/Reports"; 
import Settings from "./components/Settings/Settings";
import Profile from "./components/Profile/Profile"; 
import RegisterPage from "./components/RegisterPage/RegisterPage";
import OTPVerification from "./components/OTP/OTPVerification";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import UpdatePassword from "./components/UpdatePassword/UpdatePassword";
import SalesVoucherCardView from "./components/report/SalesVoucherCardView/SalesVoucherCardView"; 
import GoodsPaymentForm from "./components/GoodsPaymentForm/GoodsPaymentForm"; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = sessionStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/paddyPurchaseForm" element={<PaddyPurchaseForm />} />
            <Route path="/paddyPurchaseReport" element={<PaddyPurchaseReport />} />
            <Route path="/viewTransitPass" element={<TransitPassList/>} />
            <Route path="/viewTransitPassForm" element={<ViewTransitPassForm />} />
            <Route path="/transit-pass/edit" element={<ViewTransitPassForm mode="edit" />} />
            <Route path="/goodsSalesVoucherForm" element={<GoodsSalesVoucherForm />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/goodsPaymentForm" element={<GoodsPaymentForm />} />
            <Route path="/paddyPaymentForm" element={<GoodsPaymentForm />} />
            <Route path="/salesVoucherCardView" element={<SalesVoucherCardView />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage
                setUserLoggedIn={(val) => {
                  if (val) {
                    sessionStorage.setItem("isLoggedIn", "true");
                    setIsLoggedIn(true);
                  }
                }}
              />
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />  
          <Route path="/update-password" element={<UpdatePassword />} />  
        </Routes>
      )}
    </Router>
  );
};

export default App;
