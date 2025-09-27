// Warehouse.js
import React, { useEffect, useState, useCallback } from "react";
import { getUserInfo } from "../../utils/userSession";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import "./Warehouse.css";

const Warehouse = () => {
  const user = getUserInfo();
  const scriptUrl = user[10];

  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseCapacity, setWarehouseCapacity] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editedWarehouse, setEditedWarehouse] = useState({
    warehouseId: "",
    warehouseName: "",
    warehouseCapacity: "",
    warehouseAddress: "",
  });

  // ✅ Fetch all warehouses
  const fetchWarehouseList = useCallback(async () => {
    try {
      setLoading(true);
      const formPayload = new FormData();
      formPayload.append("action", "getAllWarehouses");
      const response = await fetch(scriptUrl, {
        method: "POST",
        body: formPayload,
      });
      const result = await response.json();
      if (result.success) {
        setWarehouseList(result.data || []);
      } else {
        console.error("Error fetching warehouses:", result.message);
      }
    } catch (err) {
      console.error("Failed to fetch warehouse list:", err);
    } finally {
      setLoading(false);
    }
  }, [scriptUrl]);

  // ✅ Add Warehouse
  const addWarehouse = async () => {
    if (!warehouseName.trim() || !warehouseCapacity.trim() || !warehouseAddress.trim()) return;

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Warehouse
  const deleteWarehouse = async (warehouse) => {
    if (!window.confirm(`Delete warehouse "${warehouse.warehouseName}"?`)) return;
    try {
      setLoading(true);
      const formPayload = new FormData();
      formPayload.append("action", "deleteWarehouse");
      formPayload.append("warehouseId", warehouse.warehouseId);
      await fetch(scriptUrl, { method: "POST", body: formPayload });
      fetchWarehouseList();
    } catch (err) {
      console.error("Failed to delete warehouse:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Edited Warehouse
  const saveEditedWarehouse = async () => {
    if (!editedWarehouse.warehouseName.trim() || !editedWarehouse.warehouseCapacity.trim() || !editedWarehouse.warehouseAddress.trim()) return;

    try {
      setLoading(true);
      const formPayload = new FormData();
      formPayload.append("action", "editWarehouse");
      formPayload.append("warehouseId", editedWarehouse.warehouseId);
      formPayload.append("newWarehouseName", editedWarehouse.warehouseName);
      formPayload.append("newWarehouseCapacity", editedWarehouse.warehouseCapacity);
      formPayload.append("newWarehouseAddress", editedWarehouse.warehouseAddress);

      await fetch(scriptUrl, { method: "POST", body: formPayload });
      setEditingIndex(null);
      setEditedWarehouse({ warehouseId: "", warehouseName: "", warehouseCapacity: "", warehouseAddress: "" });
      fetchWarehouseList();
    } catch (err) {
      console.error("Failed to update warehouse:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouseList();
  }, [fetchWarehouseList]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        🏭 Warehouse Settings
      </Typography>

      {/* 🔹 Add Form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Warehouse Name"
          value={warehouseName}
          onChange={(e) => setWarehouseName(e.target.value)}
          size="small"
          sx={{ mr: 2 }}
        />
        <TextField
          label="Capacity (In Tons)"
          type="number"
          value={warehouseCapacity}
          onChange={(e) => setWarehouseCapacity(e.target.value)}
          size="small"
          sx={{ mr: 2 }}
        />
        <TextField
          label="Address"
          value={warehouseAddress}
          onChange={(e) => setWarehouseAddress(e.target.value)}
          size="small"
          sx={{ mr: 2, width: 250 }}
        />
        <Button variant="contained" color="primary" onClick={addWarehouse}>
          ➕ Add Warehouse
        </Button>
      </Paper>

      {/* 🔹 Spinner + List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="warehouse-list">
          <Typography variant="h6">Current Warehouses:</Typography>
          <ul>
            {warehouseList.map((warehouse, index) => (
              <li key={warehouse.warehouseId}>
                {editingIndex === index ? (
                  <div className="edit-mode">
                    <TextField
                      value={editedWarehouse.warehouseName}
                      onChange={(e) =>
                        setEditedWarehouse({ ...editedWarehouse, warehouseName: e.target.value })
                      }
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <TextField
                      type="number"
                      value={editedWarehouse.warehouseCapacity}
                      onChange={(e) =>
                        setEditedWarehouse({ ...editedWarehouse, warehouseCapacity: e.target.value })
                      }
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <TextField
                      value={editedWarehouse.warehouseAddress}
                      onChange={(e) =>
                        setEditedWarehouse({ ...editedWarehouse, warehouseAddress: e.target.value })
                      }
                      size="small"
                      sx={{ mr: 1, width: 200 }}
                    />
                    <Button size="small" onClick={saveEditedWarehouse}>💾 Save</Button>
                    <Button size="small" onClick={() => setEditingIndex(null)}>❌ Cancel</Button>
                  </div>
                ) : (
                  <div className="warehouse-info">
                    <span><strong>Name:</strong> {warehouse.warehouseName}</span>{" "}
                    <span><strong>Capacity:</strong> {warehouse.warehouseCapacity}</span>{" "}
                    <span><strong>Address:</strong> {warehouse.warehouseAddress}</span>
                    <div className="actions" style={{ marginLeft: "10px" }}>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingIndex(index);
                          setEditedWarehouse(warehouse);
                        }}
                        sx={{ mr: 1 }}
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => deleteWarehouse(warehouse)}
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Box>
  );
};

export default Warehouse;
