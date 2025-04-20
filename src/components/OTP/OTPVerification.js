import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OTPVerification.css"; // Optional: create styles

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const registrationData = JSON.parse(sessionStorage.getItem("registrationData"));

  useEffect(() => {
    if (!registrationData) {
      // If user refreshes or opens directly without registration
      navigate("/login");
    }
  }, [registrationData, navigate]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Focus next input
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 4) {
      setErrorMessage("Please enter the 4-digit OTP.");
      return;
    }

    try {
      const response = await axios.post(
        registrationData.scriptUrl,
        null,
        {
          params: {
            action: "verifyOTP",
            username: registrationData.username,
            otp: fullOtp,
          },
        }
      );

      if (response.data.status === "Success") {
        sessionStorage.removeItem("registrationData");
        navigate("/login");
      } else {
        setErrorMessage(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit} className="otp-form">
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              required
            />
          ))}
        </div>
        <button type="submit">Verify</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default OTPVerification;
