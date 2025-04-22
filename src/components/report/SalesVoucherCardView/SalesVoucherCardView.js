import React, { useEffect, useState } from "react";
import "./SalesVoucherCardView.css";
import { getUserInfo } from "../../../utils/userSession";

const productTypes = [
  { name: "PADDY", image: "paddy.png" },
  { name: "RICE", image: "rice.png" },
  { name: "BROKEN RICE", image: "broken_rice.png" },
  { name: "RICE BRAN", image: "rice_bran.png" },
  { name: "HUSK", image: "husk.png" },
];

const SalesVoucherCardView = () => {
  const user = getUserInfo();
  const scriptUrl = user[10];
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState("RICE BRAN");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch sales data using POST
  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "allSalesVoucherReport" }),
        });

        const result = await response.json();

        if (result.success) {
          const rawData = result.data[0]; // 0 = salesVoucherRecord
          setSalesData(rawData.slice(1)); // Skip headers
        }
      } catch (error) {
        console.error("Error fetching sales voucher report:", error);
      }
    };

    fetchSalesReport();
  }, [scriptUrl]);

  // Filter by product type and search
  useEffect(() => {
    const filtered = salesData.filter((row) => {
      const [vendorName, sno, totalGoods, totalAmount, date, type] = [
        row[2], row[3], row[4], row[5], row[6], row[7],
      ];

      const matchType = type === selectedType;
      const searchMatch =
        vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        totalGoods?.toString().includes(searchTerm);

      return matchType && searchMatch;
    });

    setFilteredData(filtered);
  }, [searchTerm, selectedType, salesData]);

  return (
    <div className="sales-card-container">
      <h2>Sales Record Details</h2>

      <div className="type-filter">
        {productTypes.map((type) => (
          <div
            key={type.name}
            className={`type-item ${selectedType === type.name ? "active" : ""}`}
            onClick={() => setSelectedType(type.name)}
          >
            <img src={`/images/${type.image}`} alt={type.name} />
            <p>{type.name}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search (Vendor Name, Serial no, Total Goods KG)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="voucher-list">
        {filteredData.map((row, index) => (
          <div className="voucher-card" key={index}>
            <h4>{row[2]}</h4> {/* Vendor Name */}
            <p><strong>SNO:</strong> <span className="sno">{row[3]}</span></p>
            <p><strong>Total Goods:</strong> {row[4]}KG</p>
            <p><strong>Total Amount:</strong> {row[5]}</p>
            <p><strong>P Date:</strong> {row[6]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesVoucherCardView;
