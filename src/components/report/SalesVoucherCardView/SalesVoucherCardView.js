import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SalesVoucherCardView.css";
import { getUserInfo } from "../../../utils/userSession";
import { formatDateDDMMYYYY , formatDateYYYYMMDD} from "../../../utils/dateUtils";

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
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState("RICE");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesReport = async () => {
      setLoading(true);
      try {
        const formPayload = new FormData();
        formPayload.append("action", "allSalesVoucherReport");

        const response = await fetch(scriptUrl, {
          method: "POST",
          body: formPayload,
        });

        const result = await response.json();

        if (result.status === "Success") {
          const rawData = result.message[0];
          const rawPaymentData = result.message[1];
          setSalesData(rawData.slice(1));
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
        serialNo?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        totalGoods?.toString().includes(searchTerm);

      return matchType && searchMatch;
    });

    setFilteredData(filtered);
  }, [searchTerm, selectedType, salesData]);


  const handleEdit = (row) => {
    const editData = {
      rmmSalesVoucherId: row[0],
      typeOfGoods: row[3],
      serialNo: row[4],
      vendorName: row[5],
      vendorAddress: row[6],
      driverName: row[7],
      vehicleNumber: row[8],
      vendorEmail: row[9],
      vendorPhone: row[10],
      goodsSaleDate: row[11],
      bagPerKg: `${row[12]}kg`,
      goodPerKg: row[14],
      totalGoods: row[13],
      receiptImage: row[18],
    };

    navigate("/goodsSalesVoucherForm", { state: { editData } });
  };

  const handleDelete = async (row) => {
    if (window.confirm("Are you sure to delete this entry?")) {
      setLoading(true);
      const user = getUserInfo();
      const scriptUrl = user[10];
      const rmmSalesVoucherId = row[0]; // Assuming [0] contains the rmmSalesVoucherId

      const formData = new FormData();
      formData.append("action", "salesVoucherDeleteRecord");
      formData.append("salesVocherRecordId", rmmSalesVoucherId);

      try {
        const response = await fetch(scriptUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.status === "Success") {
          alert("Record deleted successfully.");
          // Optionally refresh the list or remove from local state:
          setSalesData((prev) => prev.filter((item) => item[0] !== rmmSalesVoucherId));
        } else {
          alert("Delete failed: " + result.message);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("An error occurred while deleting the record.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleShare = (row) => {
    const message = `🧾 Sales Receipt\nVendor: ${row[5]}\nProduct: ${row[3]}\nGoods: ${row[13]} KG\nTotal: ₹${row[16]}`;
    //const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    const encodedMessage = encodeURIComponent(message);
    const phone = row[10];
    const whatsappURL = `https://wa.me/91${phone}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handlePayment = (row) => {
    // Navigate to the Goods Payment Form with row data
    navigate("/goodsPaymentForm", {
      state: { row }, // Pass the row object as state
    });
  };

  return (
    <div className="sales-container">
      <div className="left-nav">
        <h3>Product Types</h3>
        {productTypes.map((type) => (
          <div
            key={type.name}
            className={`type-item ${selectedType === type.name ? "active" : ""}`}
            onClick={() => setSelectedType(type.name)}
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/${type.image}`}
              alt={type.name}
            />
            <span>{type.name}</span>
          </div>
        ))}
      </div>

      <div className="main-content">
        <h2>Sales Voucher Details</h2>

        <input
          type="text"
          placeholder="Search by Vendor, Serial No, or Total Goods In KG"
          value={searchTerm}
          onChange={(e) => {
            setLoading(true);
            setSearchTerm(e.target.value);
            setTimeout(() => setLoading(false), 300); // simulate search delay
          }}
          className="search-input"
        />

        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="voucher-list">
            {filteredData.map((row, index) => {
              const totalAmount = Number(row[16] || 0);
              const paidAmount = Number(row[20] || 0);
              const pendingAmount = totalAmount - paidAmount;

              let cardStatusClass = "card-default";
              if (pendingAmount > 0) cardStatusClass = "card-red";
              else if (pendingAmount < 0) cardStatusClass = "card-orange";
              else cardStatusClass = "card-green";

              return (
                <div className={`voucher-card ${cardStatusClass}`} key={index}>
                  <div className="card-actions">
                    <button title="Edit" onClick={() => handleEdit(row)}>✏️</button>
                    <button title="Delete" onClick={() => handleDelete(row)}>🗑️</button>
                    <button title="Share" onClick={() => handleShare(row)}>📤</button>
                    <button title="Payment" onClick={() => handlePayment(row)}>💰</button>
                  </div>

                  <h4>{row[5]}</h4>
                  <p><strong>SNO:</strong> <span className="sno">{row[4]}</span></p>
                  <p><strong>Product:</strong> {row[3]}</p>
                  <p><strong>Total Goods(In KG):</strong> {row[13]} KG</p>
                  <p><strong>Rate (Per KG):</strong> ₹{row[14]}</p>
                  <p><strong>Total Goods Amount:</strong> ₹{totalAmount}</p>
                  <p><strong>Total Goods Received Amount:</strong> ₹{paidAmount}</p>
                  <p><strong>Total Goods Pending Amount:</strong> ₹{pendingAmount}</p>
                  <p><strong>Purchase Date:</strong> {row[11]}</p>
                  <p><strong>Vehicle:</strong> {row[8]}</p>
                  <p><strong>Driver:</strong> {row[7]}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesVoucherCardView;
