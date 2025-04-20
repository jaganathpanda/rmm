import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css"

const RegistrationPage = () => {
  const [rmmFirstName, setRmmFirstName] = useState("");
  const [rmmLastName, setRmmLastName] = useState("");
  const [rmmUserName, setRmmUserName] = useState("");
  const [rmmEmail, setRmmEmail] = useState("");
  const [rmmRiceMillName, setRmmRiceMillName] = useState("");
  const [rmmRiceMillAddress, setRmmRiceMillAddress] = useState("");
  const [rmmMobileNo, setRmmMobileNo] = useState("");
  const [rmmPassword, setRmmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Email Format (Basic Email Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rmmEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Validate Mobile Number Format (Indian Mobile Number - 10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(rmmMobileNo)) {
      setErrorMessage("Please enter a valid Indian mobile number.");
      return;
    }

    try {
      const response = await axios.post(
        "https://script.google.com/macros/s/AKfycbxPTBzOQdfrmLQf9FnXT1jyCr3U_WGaNdMCuXau_PSN5etcVgtG1JhIQCuXrZ6mNOeHUA/exec",
        null,
        {
          params: {
            action: "userRegisterAction",
            rmmUserName,
            rmmFirstName,
            rmmLastName,
            rmmRiceMillName,
            rmmRiceMillAddress,
            rmmEmail,
            rmmMobileNo,
            rmmPassword,
          },
        }
      );

      if (response.data.status === "Success") {
        sessionStorage.setItem("pendingUserEmail", rmmEmail);
        navigate("/otp-verification");
      } else if (response.data.status === "Fail" && response.data.statusCode === 409) {
        // Email already exists, check OTP verification status
        const pendingEmail = sessionStorage.getItem("pendingUserEmail");
        if (pendingEmail === rmmEmail) {
          navigate("/otp-verification"); // Redirect to OTP verification
        } else {
          navigate("/forgot-password"); // Redirect to forgot password if OTP is already verified
        }
        setErrorMessage("Email already exists. Please verify your OTP or reset your password.");
      } else {
        setErrorMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="registration-container">
      <h2>Register for Rice Mill Management</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <input
          type="text"
          placeholder="First Name"
          value={rmmFirstName}
          onChange={(e) => setRmmFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={rmmLastName}
          onChange={(e) => setRmmLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={rmmUserName}
          onChange={(e) => setRmmUserName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={rmmEmail}
          onChange={(e) => setRmmEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Rice Mill Name"
          value={rmmRiceMillName}
          onChange={(e) => setRmmRiceMillName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Rice Mill Address"
          value={rmmRiceMillAddress}
          onChange={(e) => setRmmRiceMillAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={rmmMobileNo}
          onChange={(e) => setRmmMobileNo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={rmmPassword}
          onChange={(e) => setRmmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="login-link">
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default RegistrationPage;
