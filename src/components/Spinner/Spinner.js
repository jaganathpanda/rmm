import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 80, color = '#3498db', text = "Loading..." }) => {
  return (
    <div className="spinner-wrapper">
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderTopColor: color,
          borderWidth: size / 10,
        }}
      ></div>
      <div className="spinner-text" style={{ color }}>{text}</div>
    </div>
  );
};

export default Spinner;
