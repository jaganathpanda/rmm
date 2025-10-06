import React, { useState, useEffect } from "react";
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
import "./PaddyPurchaseReport.css"; // Import the CSS

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
  const user = getUserInfo();
  const [paddyData, setPaddyData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const navigate = useNavigate();

  const formPayload = new FormData();
  formPayload.append("action", "paddyPurchaseReport");

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchPaddyReport();
  }, [formPayload, user]); // ✅ added dependencies

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (row) => {
    const mappedData = mapRowToFormData(row);
    setSelectedRow(mappedData);
    setOpenEditDialog(true);
  };

  const handlePayment = (row) => {
    navigate("/paddyPaymentForm", { state: { row, source: "paddy" } });
  };

  const handleDelete = async (rmmPaddyRecordId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    const formDeletePayload = new FormData();
    formDeletePayload.append("action", "paddyPurchaseRecordDelete");
    formDeletePayload.append("paddyRecordId", rmmPaddyRecordId);

    try {
      const response = await fetch(user[10], {
        method: "POST",
        body: formDeletePayload,
      });
      const result = await response.json();

      // ✅ FIX: use comparison, not assignment
      if (result.status === "Success") {
        setPaddyData((prevData) =>
          prevData.filter((item) => item[0] !== rmmPaddyRecordId)
        );
      } else {
        console.error("Error deleting data:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = paddyData.filter((row) =>
    row[4]?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="paddy-report-container">
      <h2>Paddy Purchase Report</h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Farmer Name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <Spinner size={100} color="#e74c3c" text="Please wait..." />
      ) : (
        <>
          <div className="paddy-card-list">
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <div className="paddy-card" key={index}>
                  <div className="card-actions">
                    <Button
                      onClick={() => handleEdit(row)}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(row[0])}
                      variant="outlined"
                      color="secondary"
                      size="small"
                    >
                      🗑️ Delete
                    </Button>
                    <Button
                      onClick={() => handlePayment(row)}
                      variant="outlined"
                      color="success"
                      size="small"
                    >
                      💰 Payment
                    </Button>
                  </div>

                  <h4>👨‍🌾 {row[4]}</h4>
                  <p>
                    <strong>Serial No:</strong> {row[3]}
                  </p>
                  <p>
                    <strong>Purchase Date:</strong> {row[8]}
                  </p>
                  <p>
                    <strong>Total Paddy:</strong> {row[10]} KG
                  </p>
                  <p>
                    <strong>Price per Bag:</strong> ₹{row[11]}
                  </p>
                  <p>
                    <strong>Paddy Type:</strong> {row[15]}
                  </p>
                  <p>
                    <strong>Collection Center:</strong> {row[16]}
                  </p>
                </div>
              ))}
          </div>

          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />

          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
          >
            <DialogTitle>Edit Paddy Purchase</DialogTitle>
            <DialogContent>
              <PaddyPurchaseForm initialData={selectedRow} />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenEditDialog(false)}
                color="secondary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default PaddyPurchaseReport;
