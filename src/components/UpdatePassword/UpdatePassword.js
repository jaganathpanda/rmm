import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdatePassword.css";

const UpdatePassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const pendingPassowrdUpdate = JSON.parse(sessionStorage.getItem("pendingPassowrdUpdate"));
    useEffect(() => {
        if (!pendingPassowrdUpdate || !pendingPassowrdUpdate.rmmEmail) {
            navigate("/login");
        }
    }, [navigate, pendingPassowrdUpdate]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(
                "https://script.google.com/macros/s/AKfycbxPTBzOQdfrmLQf9FnXT1jyCr3U_WGaNdMCuXau_PSN5etcVgtG1JhIQCuXrZ6mNOeHUA/exec",
                null,
                {
                    params: {
                        action: "setNewPassword",
                        rmmEmail: pendingPassowrdUpdate.rmmEmail,
                        newPasswordValue: password,
                    },
                }
            );

            if (response.data.status === "Success") {
                sessionStorage.removeItem("pendingPassowrdUpdate");
                setSuccess("Password updated successfully!");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(response.data.message || "Failed to update password.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="update-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Update Password</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default UpdatePassword;
