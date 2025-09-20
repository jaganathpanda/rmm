// Warehouse.js
import React, { useEffect, useState, useCallback } from "react";
import { getUserInfo } from "../../utils/userSession";
import "./Warehouse.css";

const Warehouse = () => {
  const user = getUserInfo();
  const scriptUrl = user[10];

  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseCapacity, setWarehouseCapacity] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedWarehouse, setEditedWarehouse] = useState({
    name: "",
    capacity: "",
    address: "",
  });

  const fetchWarehouseList = useCallback(async () => {
    try {
      const formPayload = new FormData();
      formPayload.append("action", "getAllWarehouses");
      const response = await fetch(scriptUrl, {
        method: "POST",
        body: formPayload,
      });
      const result = await response.json();
      if (result.success) {
        setWarehouseList(result.data); // expecting array of { name, capacity, address }
      } else {
        console.error("Error fetching warehouses:", result.message);
      }
    } catch (err) {
      console.error("Failed to fetch warehouse list:", err);
    }
  }, [scriptUrl]);

  const addWarehouse = async () => {
    if (!warehouseName.trim() || !warehouseCapacity.trim() || !warehouseAddress.trim()) return;

    try {
      const formPayload = new FormData();
      formPayload.append("action", "addWarehouse");
      formPayload.append("warehouseName", warehouseName);
      formPayload.append("warehouseCapacity", warehouseCapacity);
      formPayload.append("warehouseAddress", warehouseAddress);

      await fetch(scriptUrl, { method: "POST", body: formPayload });

      setWarehouseName("");
      setWarehouseCapacity("");
      setWarehouseAddress("");
      fetchWarehouseList();
    } catch (err) {
      console.error("Failed to add warehouse:", err);
    }
  };

  const deleteWarehouse = async (warehouse) => {
    if (!window.confirm(`Delete warehouse "${warehouse.name}"?`)) return;
    try {
      const formPayload = new FormData();
      formPayload.append("action", "deleteWarehouse");
      formPayload.append("warehouseName", warehouse.name);
      await fetch(scriptUrl, { method: "POST", body: formPayload });
      fetchWarehouseList();
    } catch (err) {
      console.error("Failed to delete warehouse:", err);
    }
  };

  const saveEditedWarehouse = async (originalName) => {
    if (!editedWarehouse.name.trim() || !editedWarehouse.capacity.trim() || !editedWarehouse.address.trim()) return;

    try {
      const formPayload = new FormData();
      formPayload.append("action", "editWarehouse");
      formPayload.append("originalWarehouse", originalName);
      formPayload.append("newWarehouseName", editedWarehouse.name);
      formPayload.append("newWarehouseCapacity", editedWarehouse.capacity);
      formPayload.append("newWarehouseAddress", editedWarehouse.address);

      await fetch(scriptUrl, { method: "POST", body: formPayload });
      setEditingIndex(null);
      setEditedWarehouse({ name: "", capacity: "", address: "" });
      fetchWarehouseList();
    } catch (err) {
      console.error("Failed to update warehouse:", err);
    }
  };

  useEffect(() => {
    fetchWarehouseList();
  }, [fetchWarehouseList]);

  return (
    <div className="warehouse-setting">
      <h2>🏭 Warehouse Settings</h2>

      <div className="warehouse-form">
        <input
          type="text"
          value={warehouseName}
          onChange={(e) => setWarehouseName(e.target.value)}
          placeholder="Warehouse Name"
        />
        <input
          type="number"
          value={warehouseCapacity}
          onChange={(e) => setWarehouseCapacity(e.target.value)}
          placeholder="Capacity(In Tons)"
        />
        <input
          type="text"
          value={warehouseAddress}
          onChange={(e) => setWarehouseAddress(e.target.value)}
          placeholder="Address"
        />
        <button onClick={addWarehouse}>Add Warehouse</button>
      </div>

      <div className="warehouse-list">
        <h4>Current Warehouses:</h4>
        <ul>
          {warehouseList.map((warehouse, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editedWarehouse.name}
                    onChange={(e) =>
                      setEditedWarehouse({ ...editedWarehouse, name: e.target.value })
                    }
                    placeholder="Warehouse Name"
                  />
                  <input
                    type="number"
                    value={editedWarehouse.capacity}
                    onChange={(e) =>
                      setEditedWarehouse({ ...editedWarehouse, capacity: e.target.value })
                    }
                    placeholder="Capacity"
                  />
                  <input
                    type="text"
                    value={editedWarehouse.address}
                    onChange={(e) =>
                      setEditedWarehouse({ ...editedWarehouse, address: e.target.value })
                    }
                    placeholder="Address"
                  />
                  <button onClick={() => saveEditedWarehouse(warehouse.name)}>💾 Save</button>
                  <button onClick={() => setEditingIndex(null)}>❌ Cancel</button>
                </div>
              ) : (
                <div className="warehouse-info">
                  <span><strong>Name:</strong> {warehouse.name}</span>
                  <span><strong>Capacity:</strong> {warehouse.capacity}</span>
                  <span><strong>Address:</strong> {warehouse.address}</span>
                  <div className="actions">
                    <button
                      onClick={() => {
                        setEditingIndex(index);
                        setEditedWarehouse(warehouse);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteWarehouse(warehouse)}>🗑️ Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Warehouse;
