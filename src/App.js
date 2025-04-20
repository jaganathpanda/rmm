import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check localStorage for login status on app load
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Logout function to reset login state
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Navbar logout={handleLogout} />
          <Home />
        </>
      ) : (
        <LoginPage setUserLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
};

export default App;
