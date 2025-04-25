import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewTransitPassForm from "../ViewTransitPassForm/ViewTransitPassForm";
import { getUserInfo } from "../../../utils/userSession";
import "./TransitPassList.css";

const TransitPassList = () => {
  const user = getUserInfo();
  const scriptUrl = user[10];
  const [transitPasses, setTransitPasses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [filter, setFilter] = useState("");

  const fetchData = async () => {
    const form = new FormData();
    form.append("action", "getAllTransitPass");

    const response = await fetch(scriptUrl, { method: "POST", body: form });
    const result = await response.json();
    if (result.success) setTransitPasses(result.data);
  };

  const handleDelete = async (transitId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const form = new FormData();
      form.append("action", "deleteTransitPass");
      form.append("transitId", transitId); // +2: account for 0-based array and header
      const res = await fetch(scriptUrl, { method: "POST", body: form });
      const result = await res.json();
      if (result.success) fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = transitPasses.filter(transitPass =>
    transitPass.PPC.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="transit-pass-list">
      <h2>🚛 Transit Pass Records</h2>
      <input
        type="text"
        placeholder="Filter by PPC"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>PPC</th><th>Miller</th><th>TP No.</th><th>Date</th><th>Vehicle</th>
            <th>Driver</th><th>Bags</th><th>Qty</th><th>Delay</th><th>Accepted</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((col, i) => (
                // Skipping the first two columns (SL No. and Sys Date)
                i !== 0 && i !== 1 && <td key={i}>{col}</td>
              ))}
              <td>
                <button onClick={() => setEditingIndex(row["TransitId"])}>✏️ Edit</button>
                <button onClick={() => handleDelete(row["TransitId"])}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingIndex !== null && (
        <ViewTransitPassForm
          mode="edit"
          initialData={transitPasses[editingIndex]}
          rowIndex={editingIndex + 2}
          onDone={() => {
            setEditingIndex(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default TransitPassList;
