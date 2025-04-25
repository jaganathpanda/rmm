import React, { useState } from "react";
import { getUserInfo } from "../../utils/userSession";

const EditTransitPassForm = ({ record, onSave }) => {
  const user = getUserInfo();
  const scriptUrl = user[10];

  const [formData, setFormData] = useState({ ...record });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("action", "updateTransitPass");
    form.append("recordId", formData["TRANSIT PASS RECORD ID"]);

    Object.keys(formData).forEach(key => {
      if (key !== "CURRENT TIME STAMP") {
        form.append(key, formData[key]);
      }
    });

    const res = await fetch(scriptUrl, { method: "POST", body: form });
    const result = await res.json();
    if (result.success) {
      alert("Updated successfully");
      onSave(); // trigger parent to refresh list
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>✏️ Edit Transit Pass</h3>
      <label>
        PPC: <input name="PPC" value={formData["PPC"]} onChange={handleChange} />
      </label>
      <label>
        Miller: <input name="MILLER" value={formData["MILLER"]} readOnly />
      </label>
      {/* Add remaining fields like Vehicle No., Bag, Qty, etc... */}
      <button type="submit">Update</button>
    </form>
  );
};

export default EditTransitPassForm;
