import React from "react";
import "./LandingPage.css";
import DynamicContent from "../../DynamicContent"; // Dynamic CMS

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* 🔹 Dynamic Content Section */}
      <DynamicContent /> {/* <-- dynamically renders Navbar, HeroCarousel, Cards, TextBlocks, Pricing */}
    </div>
  );
};

export default LandingPage;
