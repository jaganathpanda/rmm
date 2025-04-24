import React, { useState } from "react";
import "../../utils/Form.css";
import { getUserInfo } from "../../utils/userSession";


const PaddyPurchaseForm = () => {
  const user = getUserInfo();
  const [formData, setFormData] = useState({
    serialNo: "",
    farmerName: "",
    rememberFarmer: false,
    address: "",
    email: "",
    mobile: "",
    purchaseDate: "",
    totalPaddy: "",
    perBagPrice: "",
    paddyType: "",
    collectionCenter: "",
  });

  const [paddyReceipt, setPaddyReceipt] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPaddyReceipt(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.paddyType || !formData.collectionCenter) {
      alert("Please select all required dropdowns.");
      return;
    }

    const formPayload = new FormData();

    formPayload.append("action", "paddyPurchaseAction");
    formPayload.append("rmmUserId", user[0]); // Replace with actual user ID logic
    formPayload.append("serialNo", formData.serialNo);
    formPayload.append("farmerName", formData.farmerName);
    formPayload.append("rememberFarmerName", formData.rememberFarmer ? "TRUE" : "FALSE");
    formPayload.append("farmerAddress", formData.address);
    formPayload.append("purchaseDate", formData.purchaseDate);
    formPayload.append("totalPaddyInKg", formData.totalPaddy);
    formPayload.append("perBagPrice", formData.perBagPrice);
    formPayload.append("farmerEmail", formData.email);
    formPayload.append("farmerMobile", formData.mobile);
    formPayload.append("typeOfPaddy", formData.paddyType);
    formPayload.append("paddyCollectFrom", formData.collectionCenter);
    formPayload.append("anyRemarks", ""); // Optional remarks if needed

    if (paddyReceipt) {
      formPayload.append("receiptImage", paddyReceipt);
    }

    try {
      const response = await fetch(user[10], {
        method: "POST",
        body: formPayload,
      });

      const result = await response.json();
      console.log("Server Response:", result);
      alert(result.message || "Paddy entry submitted!");

      // Reset form
      setFormData({
        serialNo: "",
        farmerName: "",
        rememberFarmer: false,
        address: "",
        email: "",
        mobile: "",
        purchaseDate: "",
        totalPaddy: "",
        perBagPrice: "",
        paddyType: "",
        collectionCenter: "",
      });
      setPaddyReceipt(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit paddy entry.");
    }
  };

  return (
    <div className="purchase-form-container">
      <h2 className="form-title">PADDY PURCHASE FORM</h2>
      <form onSubmit={handleSubmit} className="purchase-form">
        <label>SERIAL NO.</label>
        <input
          type="text"
          name="serialNo"
          value={formData.serialNo}
          onChange={handleChange}
          required
        />
        <label>COLLECTION CENTER</label>
        <select
          name="collectionCenter"
          value={formData.collectionCenter}
          onChange={handleChange}
          required
        >
          <option value="">Select Collection Center</option>
          <option value="Local">Local</option>
          <option value="Mandi">Mandi</option>
          <option value="Own">Own</option>
        </select>

        <label>FARMER NAME</label>
        <input
          type="text"
          name="farmerName"
          value={formData.farmerName}
          onChange={handleChange}
          required
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="rememberFarmer"
            checked={formData.rememberFarmer}
            onChange={handleChange}
          />
          REMEMBER FARMER (Select only for paddy business man)
        </label>

        <label>FARMER ADDRESS</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>EMAIL</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>MOBILE</label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />

        <label>PURCHASE DATE</label>
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
        />

        <label>TOTAL PADDY (IN KG)</label>
        <input
          type="number"
          name="totalPaddy"
          value={formData.totalPaddy}
          onChange={handleChange}
        />

        <label>PER BAG PRICE</label>
        <input
          type="number"
          name="perBagPrice"
          value={formData.perBagPrice}
          onChange={handleChange}
        />

        <label>TYPE OF PADDY</label>
        <select
          name="paddyType"
          value={formData.paddyType}
          onChange={handleChange}
          required
        >
          <option value="">Select Paddy Type</option>
          <option value="Masoori">Masoori</option>
          <option value="Tiki Masoori">Tiki Masoori</option>
          <option value="Sama">Sama</option>
          <option value="Sona Mossori">Sona Mossori</option>
          <option value="HMT">HMT</option>
          <option value="Other">Other</option>
        </select>

        <label>ADD PADDY RECEIPT</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
        {paddyReceipt && (
          <p className="file-info">Selected: {paddyReceipt.name}</p>
        )}

        <button type="submit">SAVE</button>
      </form>
    </div>
  );
};

export default PaddyPurchaseForm;
