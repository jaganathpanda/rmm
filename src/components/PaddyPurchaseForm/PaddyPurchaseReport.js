import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TablePagination,
} from "@mui/material";
import { getUserInfo } from "../../utils/userSession";
import PaddyPurchaseForm from "./PaddyPurchaseForm";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import "./PaddyPurchaseReport.css";

const mapRowToFormData = (row) => ({
  rmmPaddyRecordId: row[0] || "",
  serialNo: row[3] || "",
  farmerName: row[4] || "",
  address: row[5] || "",
  email: row[6] || "",
  mobile: row[7] || "",
  purchaseDate: row[8] || "",
  totalPaddy: row[10] || "",
  perBagPrice: row[11] || "",
  paddyType: row[15] || "",
  receiptImage: row[14] || "",
  collectionCenter: row[16] || "",
  rememberFarmer: row[18] || false,
});

const PaddyPurchaseReport = () => {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [paddyData, setPaddyData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const user = getUserInfo();
  const navigate = useNavigate();

  // ✅ Memoize formPayload so it doesn't trigger useEffect each render
  const formPayload = useMemo(() => {
    const data = new FormData();
    data.append("action", "paddyPurchaseReport");
    return data;
  }, []);

  useEffect(() => {
    const fetchPaddyReport = async () => {
      setLoading(true);
      try {
        const response = await fetch(user[10], {
          method: "POST",
          body: formPayload,
        });
        const result = await response.json();

        if (result.status === "Success") {
          const cleanedData = result.message[0].slice(1);
          setPaddyData(cleanedData);
        } else {
          console.error("Error fetching data:", result.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaddyReport();
  }, [formPayload, user]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setPage(0);
  };

  const filteredRows = paddyData.filter((row) => {
    const search = filterText.toLowerCase();
    return (
      row[4]?.toLowerCase().includes(search) ||
      row[5]?.toLowerCase().includes(search) ||
      row[7]?.toLowerCase().includes(search) ||
      row[8]?.toLowerCase().includes(search)
    );
  });

  const handleEditClick = (row) => {
    setSelectedRow(mapRowToFormData(row));
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setSelectedRow(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="paddy-report">
      <div className="paddy-report-header">
        <h2>Paddy Purchase Report</h2>
        <div className="paddy-report-actions">
          <input
            type="text"
            placeholder="Search by Farmer, Address, Mobile..."
            value={filterText}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/paddy-purchase-form")}
          >
            Add New Record
          </Button>
        </div>
      </div>

      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Farmer Name</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Purchase Date</th>
              <th>Total Paddy (Bag)</th>
              <th>Per Bag Price</th>
              <th>Paddy Type</th>
              <th>Collection Center</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <tr key={index}>
                  <td>{page * rowsPerPage + index + 1}</td>
                  <td>{row[4]}</td>
                  <td>{row[5]}</td>
                  <td>{row[7]}</td>
                  <td>{row[8]}</td>
                  <td>{row[10]}</td>
                  <td>{row[11]}</td>
                  <td>{row[15]}</td>
                  <td>{row[16]}</td>
                  <td>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(row)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        rowsPerPageOptions={[10, 12, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={openEditDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Paddy Purchase</DialogTitle>
        <DialogContent>
          <PaddyPurchaseForm formData={selectedRow} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaddyPurchaseReport;
