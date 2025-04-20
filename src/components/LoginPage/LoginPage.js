import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css"; // Make sure this CSS file exists

const LoginPage = ({ setUserLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "https://script.google.com/macros/s/AKfycbxPTBzOQdfrmLQf9FnXT1jyCr3U_WGaNdMCuXau_PSN5etcVgtG1JhIQCuXrZ6mNOeHUA/exec",
        null,
        {
          params: {
            action: "userValidation",
            username,
            password,
          },
        }
      );
  
      if (response.data.status == "Success" && response.data.message !== "Invalid Username and Password" ) {
        const userInfo = response.data.message;
        // Save user data in sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(userInfo));
        localStorage.setItem("isLoggedIn", "true");
        setUserLoggedIn(true);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error", error);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="navbar-logo">Rice Mill Management</div>
      </nav>

      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
