// components/common/DateInput.js
import React from "react";
import { formatDateDDMMYYYY, formatToInputDate } from "./dateUtils";

const DateInput = ({ label, name, value, onChange, includeTime = false }) => {
  const handleChange = (e) => {
    const date = new Date(e.target.value);
    const formatted = formatDateDDMMYYYY(date, includeTime);
    onChange({ target: { name, value: formatted } });
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="date"
        name={name}
        value={formatToInputDate(value)}
        onChange={handleChange}
      />
      <small style={{ fontSize: "12px", color: "#666" }}>
        Displayed as: {value || "Not set"}
      </small>
    </div>
  );
};

export default DateInput;
