import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getDriveImageUrl } from "../../utils/imageUtils";

const HeroCarousel = ({ items = [] }) => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <Slider {...settings}>
      {items.map((item, idx) => {
        const imageUrl = getDriveImageUrl(item["Image URL"]);

        return (
          <div key={idx} style={{ position: "relative" }}>
            <img
              src={imageUrl}
              alt={item.Caption || "Slide"}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                console.error("Image failed to load:", imageUrl);
              }}
            />
            {item.Caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  color: "#fff",
                  background: "rgba(0,0,0,0.5)",
                  padding: "10px 15px",
                  borderRadius: "8px",
                }}
              >
                {item.Caption}
              </div>
            )}
          </div>
        );
      })}
    </Slider>
  );
};

export default HeroCarousel;
