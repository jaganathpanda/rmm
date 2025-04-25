import React, { useEffect, useState, useCallback } from "react";
import { getUserInfo } from "../../utils/userSession";
import "./PPCSetting.css";

const PPCSetting = () => {
  const user = getUserInfo();
  const scriptUrl = user[10];
  const [ppcName, setPpcName] = useState("");
  const [ppcList, setPpcList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPPC, setEditedPPC] = useState("");

  const fetchPPCList = useCallback(async () => {
    try {
      const formPayload = new FormData();
      formPayload.append("action", "getAllPPCs");
      const response = await fetch(scriptUrl, {
        method: "POST",
        body: formPayload,
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
  }, [scriptUrl]);

  const addPPC = async () => {
    if (!ppcName.trim()) return;
    try {
      const formPayload = new FormData();
      formPayload.append("action", "addPPC");
      formPayload.append("ppcName", ppcName);
      await fetch(scriptUrl, { method: "POST", body: formPayload });
      setPpcName("");
      fetchPPCList();
    } catch (err) {
      console.error("Failed to add PPC:", err);
    }
  };

  const deletePPC = async (ppcName) => {
    if (!window.confirm(`Delete PPC "${ppcName}"?`)) return;
    try {
      const formPayload = new FormData();
      formPayload.append("action", "deletePPC");
      formPayload.append("ppcName", ppcName);
      await fetch(scriptUrl, { method: "POST", body: formPayload });
      fetchPPCList();
    } catch (err) {
      console.error("Failed to delete PPC:", err);
    }
  };

  const saveEditedPPC = async (originalPPC) => {
    if (!editedPPC.trim()) return;
    try {
      const formPayload = new FormData();
      formPayload.append("action", "editPPC");
      formPayload.append("originalPPC", originalPPC);
      formPayload.append("newPPC", editedPPC);
      await fetch(scriptUrl, { method: "POST", body: formPayload });
      setEditingIndex(null);
      setEditedPPC("");
      fetchPPCList();
    } catch (err) {
      console.error("Failed to update PPC:", err);
    }
  };

  useEffect(() => {
    fetchPPCList();
  }, [fetchPPCList]);

  return (
    <div className="ppc-setting">
      <h2>🏢 PPC Setting</h2>
      <div className="ppc-form">
        <input
          type="text"
          value={ppcName}
          onChange={(e) => setPpcName(e.target.value)}
          placeholder="Enter PPC Name"
        />
        <button onClick={addPPC}>Add PPC</button>
      </div>

      <div className="ppc-list">
        <h4>Current PPCs:</h4>
        <ul>
          {ppcList.map((ppc, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editedPPC}
                    onChange={(e) => setEditedPPC(e.target.value)}
                  />
                  <button onClick={() => saveEditedPPC(ppc)}>💾 Save</button>
                  <button onClick={() => setEditingIndex(null)}>❌ Cancel</button>
                </>
              ) : (
                <>
                  {ppc}
                  <button onClick={() => {
                    setEditingIndex(index);
                    setEditedPPC(ppc);
                  }}>✏️ Edit</button>
                  <button onClick={() => deletePPC(ppc)}>🗑️ Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PPCSetting;
