import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroCarousel.css";

const slides = [
  {
    title: "Smarter Rice Mill Management",
    desc: "Automate purchase, sales, and reports — all in one place.",
    img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEieIKYvhoEoJX8LQBF3UzQ_r5LiLdYrtFjgQGj4z1Wcf_kX31Xi8xV41dyq5LkOyoinZxvNApGYWiYWtlS5KHaPf-m6ps0faXjpBIQhyK5M43uCOY29CLKdhNncsXIDOMBKIAmGfpJt1BvXxdUWJa1iKDq-X9eZuPjL88kFWmCGLp6lI8l2KO5z_1liMX-G/s1024/riceMill.webp",
    btn1: { text: "Start Free Trial", link: "/register" },
    btn2: { text: "View Pricing", link: "#pricing" },
  },
  {
    title: "Track Inventory Seamlessly",
    desc: "Manage paddy, rice, bran & husk with real-time stock updates.",
    img: " https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzS14vB-yzHcomvltwBjrwJTxElXpKs4zbreltCQ5TT1OufhVEbwIITF6B_C1xNjaPfBP49zjDa0Ua_LFiv6kjhW1LJUc55qLjvGNtf5WfdJRTAnjiBMHXdjOcqVQ9e-Z5JX1aWoOibtChVZQsu3B-2ScIbIGKgAgqc8hAC84u1f2eucNu5D03MAv3cm3y/s320/riceMill1.webp",
    btn1: { text: "Get Started", link: "/register" },
    btn2: { text: "Explore Features", link: "#features" },
  },
  {
    title: "Boost Productivity with Insights",
    desc: "Advanced analytics and reports to help you grow faster.",
    img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiuG0r_YmrzrGk-rD13lS-2fOUC8eay6RwHOjHAN2suG4Vq-6TwFKXJ0Dbgpvxj6PH_j4yqYyfpugw2rpNEZqd6wu5qr_5VIsvzUBcE7QcUDkc1VMW0jTq8OSrS3EUeTkslH9RP7Xoa2V6S8le5krouMly7ZPyT3ew2onNtkhs-RFwSM5xOWtzFFkay5M2Y/s400/ricemill4.png",
    btn1: { text: "Go Premium", link: "/register" },
    btn2: { text: "See Plans", link: "#pricing" },
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide every 6 sec
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 600000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.img})` }}
        >
          <div className="carousel-overlay">
            <h1>{slide.title}</h1>
            <p>{slide.desc}</p>
            <div className="carousel-buttons">
              <Link to={slide.btn1.link} className="btn-primary">
                {slide.btn1.text}
              </Link>
              <Link to={slide.btn2.link} className="btn-secondary">
                {slide.btn2.text}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* 🔹 Dots Below Carousel */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
