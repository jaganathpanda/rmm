import React, { useEffect, useState } from "react";
import { getUserInfo } from "../../../utils/userSession";
import "./ViewTransitPassForm.css";

const ViewTransitPassForm = ({ mode = "add", initialData = {}, rowIndex, onDone }) => {
  const user = getUserInfo();
  const scriptUrl = user[10]; // Assuming user[10] is the URL, validate its existence
  const [ppcList, setPpcList] = useState([]);
  const [formData, setFormData] = useState({
    ppc: "",
    miller: user[4] || "", // Default to Rice Mill name, assuming user[4] is the correct index
    transitPassNo: "",
    transitPassDate: "",
    vehicleNo: "",
    driverName: "",
    bag: "",
    quantity: "",
    delay: "",
    acceptedDate: ""
  });

  useEffect(() => {
    const fetchPPCList = async () => {
      try {
        const formPayload = new FormData();
        formPayload.append("action", "getAllPPCs");

        const response = await fetch(scriptUrl, {
          method: "POST",
          body: formPayload
        });

        const result = await response.json();
        if (result.success) {
          setPpcList(result.data);
        } else {
          console.error("Error fetching PPC list:", result.message);
        }
      } catch (err) {
        console.error("Failed to fetch PPC list:", err);
      }
    };

    fetchPPCList();
  }, [scriptUrl]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        ppc: initialData[0],
        miller: initialData[1],
        transitPassNo: initialData[2],
        transitPassDate: initialData[3],
        vehicleNo: initialData[4],
        driverName: initialData[5],
        bag: initialData[6],
        quantity: initialData[7],
        delay: initialData[8],
        acceptedDate: initialData[9]
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append("action", mode === "edit" ? "editTransitPass" : "submitTransitPass");

      if (mode === "edit") {
        formPayload.append("rowIndex", rowIndex); // For editing specific row
      }

      Object.keys(formData).forEach(key => {
        formPayload.append(key, formData[key]);
      });

      const response = await fetch(scriptUrl, {
        method: "POST",
        body: formPayload
      });

      const result = await response.json();
      if (result.success) {
        alert(mode === "edit" ? "Transit pass updated successfully!" : "Transit pass submitted successfully!");
        if (onDone) onDone(); // Callback after successful submission
        if (mode === "add") {
          setFormData({
            ppc: "",
            miller: user[4] || "",
            transitPassNo: "",
            transitPassDate: "",
            vehicleNo: "",
            driverName: "",
            bag: "",
            quantity: "",
            delay: "",
            acceptedDate: ""
          });
        }
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit transit pass.");
    }
  };

  return (
    <div className="transit-pass-form">
      <h2>{mode === "edit" ? "✏️ Edit Transit Pass" : "🚚 View Transit Pass Form"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          PPC:
          <select name="ppc" value={formData.ppc} onChange={handleChange} required>
            <option value="">Select PPC</option>
            {ppcList.map((ppc, index) => (
              <option key={ppc.id || index} value={ppc}>{ppc}</option> // Ensure unique key
            ))}
          </select>
        </label>

        <label>
          Miller:
          <input type="text" name="miller" value={formData.miller} readOnly />
        </label>

        <label>
          Transit Pass No.:
          <input type="number" name="transitPassNo" value={formData.transitPassNo} onChange={handleChange} required />
        </label>

        <label>
          Transit Pass Date:
          <input type="date" name="transitPassDate" value={formData.transitPassDate} onChange={handleChange} required />
        </label>

        <label>
          Vehicle No.:
          <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} required />
        </label>

        <label>
          Driver Name:
          <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} required />
        </label>

        <label>
          Bag:
          <input type="number" name="bag" value={formData.bag} onChange={handleChange} required />
        </label>

        <label>
          Quantity (in Quintals):
          <input type="number" step="0.01" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </label>

        <label>
          Delay (in Days):
          <input type="number" name="delay" value={formData.delay} onChange={handleChange} />
        </label>

        <label>
          Accepted Date:
          <input type="date" name="acceptedDate" value={formData.acceptedDate} onChange={handleChange} />
        </label>

        <button type="submit">{mode === "edit" ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};

export default ViewTransitPassForm;
