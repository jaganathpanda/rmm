import React, { useState } from "react";
import "../../utils/Form.css";
import { getUserInfo } from "../../utils/userSession";

const PaddyPurchaseForm = ({ initialData = {}, onClose }) => {
  const editOrAdd = initialData?.rmmPaddyRecordId ? "UPDATE" : "SAVE"
  const user = getUserInfo();
  const [formData, setFormData] = useState({
    rmmPaddyRecordId: "",
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
    ...initialData,
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
    if (!formData.paddyType || !formData.collectionCenter) {
      alert("Please select all required dropdowns.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("action", initialData?.rmmPaddyRecordId ? "paddyPurchaseUpdateAction" : "paddyPurchaseAction");
    formPayload.append("rmmUserId", user[0]);
    if (initialData?.rmmPaddyRecordId) formPayload.append("rmmPaddyRecordId", initialData.rmmPaddyRecordId);
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
    formPayload.append("anyRemarks", "");

    if (paddyReceipt) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1]; // remove 'data:image/jpeg;base64,...'
        formPayload.append("receiptImage", base64String);

        // 🚀 Now after base64 is ready, submit the form
        try {
          const response = await fetch(user[10], {
            method: "POST",
            body: formPayload,
          });
          const result = await response.json();
          alert(result.message || "Paddy entry saved!");
          if (onClose) onClose();
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("Failed to submit paddy entry.");
        }
      };

      reader.readAsDataURL(paddyReceipt);
    } else {
      // No image, just submit directly
      try {
        const response = await fetch(user[10], {
          method: "POST",
          body: formPayload,
        });
        const result = await response.json();
        alert(result.message || "Paddy entry saved!");
        if (onClose) onClose();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit paddy entry.");
      }
    }
  };

  return (
    <div className="purchase-form-container">
      <h2 className="form-title">PADDY PURCHASE FORM</h2>
      <form onSubmit={handleSubmit} className="purchase-form">
        <label>COLLECTION CENTER</label>
        <select
          name="collectionCenter"
          value={formData.collectionCenter}
          onChange={handleChange}
          required
        >
          <option value="">Select Collection Center</option>
          <option value="LOCAL">Farmer/Local Business Vendor</option>
          <option value="MANDI">Mandi</option>
          <option value="OWN">Own</option>
        </select>
        <label>SERIAL NO.</label>
        <input
          type="text"
          name="serialNo"
          value={formData.serialNo}
          onChange={handleChange}
          required
        />

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
        <button type="submit">{editOrAdd}</button>
      </form>
    </div>
  );
};

export default PaddyPurchaseForm;
