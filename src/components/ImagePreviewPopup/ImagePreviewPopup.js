// src/components/ImagePreviewPopup.jsx
import React, { useState } from "react";
import "./ImagePreviewPopup.css"; // move styles here

const ImagePreviewPopup = ({ imageUrl, altText = "Image Preview" }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (!imageUrl) return null; // no image, no preview

  return (
    <>
      <div className="image-preview">
        <img
          src={imageUrl}
          alt={altText}
          className="thumbnail-image"
          onClick={() => setIsPopupOpen(true)}
        />
      </div>
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <img
            src={imageUrl}
            alt="Full View"
            className="popup-image"
          />
        </div>
      )}
    </>
  );
};

export default ImagePreviewPopup;
