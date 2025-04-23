import React, { useEffect, useState } from "react";
import "./SalesVoucherCardView.css";
import { getUserInfo } from "../../../utils/userSession";

const productTypes = [
  { name: "PADDY", image: "paddy.jpeg" },
  { name: "RICE", image: "rice.jpeg" },
  { name: "BROKEN-RICE", image: "broken_rice.jpeg" },
  { name: "RICE-BRAN", image: "rice_bran.jpeg" },
  { name: "HUSK", image: "husk.jpeg" },
];

const SalesVoucherCardView = () => {
  const user = getUserInfo();
  const scriptUrl = user[10];
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState("RICE");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const formPayload = new FormData();
  formPayload.append("action", "allSalesVoucherReport");

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(scriptUrl, {
          method: "POST",
          body: formPayload,
        });

        const result = await response.json();

        if (result.status === "Success") {
          const rawData = result.message[0];
          setSalesData(rawData.slice(1)); // Skip headers
        }
      } catch (error) {
        console.error("Error fetching sales voucher report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, [scriptUrl]);

  useEffect(() => {
    const filtered = salesData.filter((row) => {
      const vendorName = row[5];
      const serialNo = row[4];
      const totalGoods = row[13];
      const type = row[3];

      const matchType = type === selectedType;
      const searchMatch =
        vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serialNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        totalGoods?.toString().includes(searchTerm);

      return matchType && searchMatch;
    });

    setFilteredData(filtered);
  }, [searchTerm, selectedType, salesData]);

  return (
    <div className="sales-card-container">
      <h2>Sales Record Details</h2>

      <div className="sales-main-layout">
        {/* Sidebar */}
        <div className="type-sidebar">
          {productTypes.map((type) => (
            <div
              key={type.name}
              className={`type-item ${selectedType === type.name ? "active" : ""}`}
              onClick={() => setSelectedType(type.name)}
            >
              <img src={`${process.env.PUBLIC_URL}/images/${type.image}`} alt={type.name} />
              <p>{type.name}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="sales-content">
          <input
            type="text"
            placeholder="Search (Vendor Name, Serial no, Total Goods KG)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
              <p>Loading sales vouchers...</p>
            </div>
          ) : (
            <div className="voucher-list">
              {filteredData.length === 0 ? (
                <p>No sales data found.</p>
              ) : (
                filteredData.map((row, index) => (
                  <div className="voucher-card" key={index}>
                    <h4>{row[5]}</h4>
                    <p><strong>SNO:</strong> <span className="sno">{row[4]}</span></p>
                    <p><strong>Product:</strong> {row[3]}</p>
                    <p><strong>Goods:</strong> {row[13]} KG</p>
                    <p><strong>Rate(Per KG):</strong> ₹{row[14]}</p>
                    <p><strong>Total:</strong> ₹{row[16]}</p>
                    <p><strong>Purchase Date:</strong> {row[11]}</p>
                    <p><strong>Vehicle:</strong> {row[8]}</p>
                    <p><strong>Driver:</strong> {row[17]}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesVoucherCardView;
