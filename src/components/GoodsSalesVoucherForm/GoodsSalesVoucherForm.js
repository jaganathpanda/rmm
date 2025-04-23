import React, { useState } from "react";
import "../../utils/Form.css";
import { getUserInfo } from "../../utils/userSession";

const GoodsSalesVoucherForm = () => {
  const [formData, setFormData] = useState({
    typeOfGoods: "",
    serialNo: "",
    vendorName: "",
    vendorAddress: "",
    driverName: "",
    vehicleNumber: "",
    vendorEmail: "",
    vendorPhone: "",
    goodsSaleDate: "",
    bagPerKg: "50kg",
    goodPerKg: "",
    totalGoods: ""
  });
  const [goodsReceipt, setGoodsReceipt] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setGoodsReceipt(file);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? value : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getUserInfo();
    const scriptUrl = user[10];
    const data = new FormData();
    data.append("action", "salesVoucherInsertAction");
    data.append("rmmUserId", user[0]); // Replace with actual user ID (from context or props)
    data.append("typeOfGoods", formData.typeOfGoods);
    data.append("voucherSerialNo", formData.serialNo);
    data.append("vendorName", formData.vendorName);
    data.append("vendorAddress", formData.vendorAddress);
    data.append("driverName", formData.driverName);
    data.append("vehicleNumber", formData.vehicleNumber);
    data.append("vendorEmail", formData.vendorEmail);
    data.append("vendorPhone", formData.vendorPhone);
    data.append("saleDate", formData.goodsSaleDate);
    data.append("bagPerKg", formData.bagPerKg.replace("kg", ""));
    data.append("goodsPerKgPrice", formData.goodPerKg);
    data.append("totalGoodsInKg", formData.totalGoods);
    data.append("goodsCategory", formData.typeOfGoods);
  
    if (goodsReceipt) {
      data.append("voucherReceiptImage", goodsReceipt);
    }
  
    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        body: data,
      });
  
      const result = await response.json();
      if (result.status==='Success') {
        alert(result.message || "Voucher saved successfully.");
        setFormData({
          typeOfGoods: "",
          serialNo: "",
          vendorName: "",
          vendorAddress: "",
          driverName: "",
          vehicleNumber: "",
          vendorEmail: "",
          vendorPhone: "",
          goodsSaleDate: "",
          bagPerKg: "50kg",
          goodPerKg: "",
          totalGoods: ""
        });
        setGoodsReceipt(null);
      } else {
        alert("Failed to save voucher: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while saving the voucher.");
    }
  };

  return (
    <div className="sales-voucher-container">
      <h2 className="form-title">GOODS SALES VOUCHER</h2>
      <form onSubmit={handleSubmit} className="sales-voucher-form">

        <label>TYPE OF GOODS</label>
        <select
          name="typeOfGoods"
          value={formData.typeOfGoods}
          onChange={handleChange}
          required
        >
          <option value="">TYPE OF GOODS</option>
          <option value="PADDY">PADDY</option>
          <option value="RICE">RICE</option>
          <option value="BROKEN-RICE">BROKEN-RICE</option>
          <option value="RICE-BRAN">RICE-BRAN</option>
          <option value="HUSK">HUSK</option>
          <option value="Other">Other</option>
        </select>

        <label>SERIAL NO.</label>
        <input
          type="text"
          name="serialNo"
          value={formData.serialNo}
          onChange={handleChange}
          required
        />

        <label>VENDOR NAME</label>
        <input
          type="text"
          name="vendorName"
          value={formData.vendorName}
          onChange={handleChange}
          required
        />

        <label>VENDOR ADDRESS</label>
        <input
          type="text"
          name="vendorAddress"
          value={formData.vendorAddress}
          onChange={handleChange}
        />

        <label>DRIVER NAME</label>
        <input
          type="text"
          name="driverName"
          value={formData.driverName}
          onChange={handleChange}
        />

        <label>VEHICLE NUMBER</label>
        <input
          type="text"
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleChange}
        />

        <label>VENDOR EMAIL</label>
        <input
          type="email"
          name="vendorEmail"
          value={formData.vendorEmail}
          onChange={handleChange}
        />

        <label>VENDOR PHONE</label>
        <input
          type="tel"
          name="vendorPhone"
          value={formData.vendorPhone}
          onChange={handleChange}
        />

        <label>GOODS SALE DATE</label>
        <input
          type="date"
          name="goodsSaleDate"
          value={formData.goodsSaleDate}
          onChange={handleChange}
        />

        <label>BAG PER KG</label>
        <div className="radio-group">
          {["25kg", "50kg", "77kg", "100kg"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="bagPerKg"
                value={option}
                checked={formData.bagPerKg === option}
                onChange={handleChange}
              />
              {option}
            </label>
          ))}
        </div>

        <label>GOODS PER KG</label>
        <input
          type="number"
          name="goodPerKg"
          value={formData.goodPerKg}
          onChange={handleChange}
        />

        <label>TOTAL GOODS(IN-KG)</label>
        <input
          type="number"
          name="totalGoods"
          value={formData.totalGoods}
          onChange={handleChange}
        />
        <label>ADD GOODS RECEIPT</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
        {goodsReceipt && (
          <p className="file-info">
            Selected: {goodsReceipt.name}
          </p>
        )}

        <button type="submit">SAVE</button>
      </form>
    </div>
  );
};

export default GoodsSalesVoucherForm;
