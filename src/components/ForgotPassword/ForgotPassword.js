import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css"; // Optional for styling

const ForgotPassword = () => {
    const [rmmEmail, setRmmEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                "https://script.google.com/macros/s/AKfycbxPTBzOQdfrmLQf9FnXT1jyCr3U_WGaNdMCuXau_PSN5etcVgtG1JhIQCuXrZ6mNOeHUA/exec",
                null,
                {
                    params: {
                        action: "forgotPassword",
                        rmmEmail,
                    },
                }
            );

            if (response.data.status === "Success") {
                const forgotJson = {
                    rmmEmail: rmmEmail,
                    status: "forgotPasswordPending",
                };
                sessionStorage.setItem("pendingOtp", JSON.stringify(forgotJson));
                navigate("/otp-verification");
            } else {
                setError(response.data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <div className="forgot-box">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit} className="forgot-form">
                    <input
                        type="email"
                        placeholder="Enter your registered Email"
                        value={rmmEmail}
                        onChange={(e) => setRmmEmail(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <div className="login-link">
                    <p>Already have an account? <Link to="/login">Login Here</Link></p>
                </div>ß
            </div>
        </div>
    );
};

export default ForgotPassword;
