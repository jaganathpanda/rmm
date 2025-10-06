import React from "react";

const Card = ({ image, caption, link }) => (
  <div style={{ 
    border: "1px solid #ddd", 
    borderRadius: "8px", 
    padding: "10px", 
    textAlign: "center", 
    margin: "10px", 
    flex: "1 1 250px" 
  }}>
    <img 
      src={image} 
      alt={caption} 
      style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }} 
    />
    <p>{caption}</p>
    {link && <a href={link}>Details</a>}
  </div>
);

export default Card;
