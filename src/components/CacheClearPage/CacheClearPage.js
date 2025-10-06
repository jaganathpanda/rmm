import React from "react";
import { useNavigate } from "react-router-dom";
import { clearContent } from "../../ContentCache";

const CacheClearPage = () => {
  const navigate = useNavigate();

  const handleClearCache = () => {
    clearContent();
    alert("Cache cleared! The page will reload.");
    navigate("/"); // redirect to home after clearing
    window.location.reload(); // reload to fetch fresh content
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Cache Management</h2>
      <p>Click the button below to clear the application cache.</p>
      <button
        onClick={handleClearCache}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Clear Cache
      </button>
    </div>
  );
};

export default CacheClearPage;
