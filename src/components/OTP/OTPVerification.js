import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OTPVerification.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const pendingOtp = JSON.parse(sessionStorage.getItem("pendingOtp"));

  useEffect(() => {
    if (!pendingOtp || !pendingOtp.rmmEmail) {
      navigate("/login");
    }
  }, [navigate, pendingOtp]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
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
        "https://script.google.com/macros/s/AKfycbxPTBzOQdfrmLQf9FnXT1jyCr3U_WGaNdMCuXau_PSN5etcVgtG1JhIQCuXrZ6mNOeHUA/exec",
        null,
        {
          params: {
            action: "otpVerification",
            rmmOtp: fullOtp,
            rmmEmailId: pendingOtp.rmmEmail,
          },
        }
      );

      if (response.data.status === "Success") {
        sessionStorage.removeItem("pendingOtp");
        if (pendingOtp.status === "forgotPasswordPending") {
          const pendingPassowrdUpdate = {
            rmmEmail: pendingOtp.rmmEmail,
            status: "pendingPassowrdUpdate",
        };
        sessionStorage.setItem("pendingPassowrdUpdate", JSON.stringify(pendingPassowrdUpdate));
          navigate("/update-password");
        } else if (pendingOtp.status === "pendingRegistration") {
          navigate("/login");
        } else {
          navigate("/login"); // fallback if status is unknown
        }
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
