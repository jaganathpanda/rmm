import React from "react";
import { Link } from "react-router-dom";
import "./PricingPlan.css";

const PricingPlan = ({ plan }) => {
  const features = plan.Features.split(";"); // split string into list
  return (
    <div className={`plan-card ${plan.PlanName === "Silver" ? "featured" : ""}`}>
      <h2>{plan.PlanName} Plan</h2>
      <p className="price">{plan.Price}</p>
      <ul>
        {features.map((feat, idx) => (
          <li key={idx}>✔ {feat}</li>
        ))}
      </ul>
      <Link to={plan.Link} className="plan-btn">Choose {plan.PlanName}</Link>
    </div>
  );
};

export default PricingPlan;
