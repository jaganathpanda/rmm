// components/Carousel/Carousel.js
import React, { useState } from "react";
import "./Carousel.css";

const Carousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="carousel">
      <button className="arrow left" onClick={goToPrevious}>
        ❮
      </button>

      <div className="slide">
        {slides[currentIndex]}
      </div>

      <button className="arrow right" onClick={goToNext}>
        ❯
      </button>
    </div>
  );
};

export default Carousel;
