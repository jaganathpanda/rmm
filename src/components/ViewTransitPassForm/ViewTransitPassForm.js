import React, { useEffect, useState } from "react";
import { getUserInfo } from "../../utils/userSession";
import "./ViewTransitPassForm.css";

const ViewTransitPassForm = () => {
  const user = getUserInfo();
  const [ppcList, setPpcList] = useState([]);
  const [formData, setFormData] = useState({
    ppc: "",
    miller: user[4] || "", // Assuming index 4 is the Rice Mill name
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
    // Replace with actual PPC API call
    fetch("https://your-ppc-api-url.com/getPPCList")
      .then(res => res.json())
      .then(data => {
        setPpcList(data);
      })
      .catch(err => {
        console.error("Error fetching PPCs:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Transit Pass Data:", formData);
    // You can submit the data to your backend here
  };

  return (
    <div className="transit-pass-form">
      <h2>🚚 View Transit Pass Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          PPC:
          <select name="ppc" value={formData.ppc} onChange={handleChange} required>
            <option value="">Select PPC</option>
            {ppcList.map((ppc, index) => (
              <option key={index} value={ppc}>{ppc}</option>
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ViewTransitPassForm;
