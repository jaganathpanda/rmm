import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegistrationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setErrorMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rmmEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(rmmMobileNo)) {
      setErrorMessage("Please enter a valid Indian mobile number.");
      setIsLoading(false);
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
        const pendingRegistartion = {
          rmmEmail,
          status: "pendingRegistartion",
        };
        sessionStorage.setItem("pendingOtp", JSON.stringify(pendingRegistartion));
        navigate("/otp-verification");
      } else if (response.data.status === "Fail") {
        setErrorMessage(`${rmmEmail} already exists`);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <h2>Register for Rice Mill Management</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={rmmFirstName}
            onChange={(e) => setRmmFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={rmmLastName}
            onChange={(e) => setRmmLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={rmmUserName}
            onChange={(e) => setRmmUserName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={rmmEmail}
            onChange={(e) => setRmmEmail(e.target.value.toLowerCase())}
            required
          />
        </div>

        <div>
          <label htmlFor="riceMillName">Rice Mill Name</label>
          <input
            id="riceMillName"
            type="text"
            value={rmmRiceMillName}
            onChange={(e) => setRmmRiceMillName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="riceMillAddress">Rice Mill Address</label>
          <input
            id="riceMillAddress"
            type="text"
            value={rmmRiceMillAddress}
            onChange={(e) => setRmmRiceMillAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="mobile">Mobile Number</label>
          <input
            id="mobile"
            type="text"
            value={rmmMobileNo}
            onChange={(e) => setRmmMobileNo(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={rmmPassword}
            onChange={(e) => setRmmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registration in progress..." : "Register"}
        </button>
      </form>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <div className="login-link">
        <p>Already have an account? <Link to="/login">Login Here</Link></p>
      </div>
    </div>
  );
};

export default RegistrationPage;
