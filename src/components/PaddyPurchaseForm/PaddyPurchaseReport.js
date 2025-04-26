import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogTitle, DialogContent, TablePagination } from "@mui/material";
import { getUserInfo } from "../../utils/userSession";
import PaddyPurchaseForm from "./PaddyPurchaseForm";  // Importing the existing form
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
    collectionCenter: row[16] || "",
    rememberFarmer: row[18] || false,
});

const PaddyPurchaseReport = () => {
    // const [user, setUser] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(false);
    const user = getUserInfo();
    const [paddyData, setPaddyData] = useState([]);  // Data for the report
    const [openEditDialog, setOpenEditDialog] = useState(false);  // To control the dialog visibility
    const [selectedRow, setSelectedRow] = useState(null);  // Selected row to edit
    const [page, setPage] = useState(0);  // Current page number
    const [rowsPerPage, setRowsPerPage] = useState(10);  // Set default page size to 10
    const formPayload = new FormData();
    formPayload.append("action", "paddyPurchaseReport");

    // Fetch Paddy Purchase Report Data
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
                    const cleanedData = result.message.slice(1);
                    setPaddyData(cleanedData);  // Assuming the report data is in 'data'
                } else {
                    console.error("Error fetching data:", result.message);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchPaddyReport();
    }, []);

    // Handle Page Change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle Rows Per Page Change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);  // Reset to the first page when rows per page changes
    };

    // Open Edit Dialog with Existing Data
    const handleEdit = (row) => {
        const mappedData = mapRowToFormData(row); // 👈 mapping here
        setSelectedRow(mappedData); // Set selected row data
        setOpenEditDialog(true);  // Show the edit dialog
    };

    // Handle Delete Operation
    const handleDelete = async (serialNo) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");
        if (confirmDelete) {
            try {
                const response = await fetch(user[10], {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "paddyPurchaseRecordDelete",
                        userId: user[0],
                        serialNo,
                    }),
                });
                const result = await response.json();
                if (result.success) {
                    // Remove the deleted record from the data
                    setPaddyData((prevData) => prevData.filter((item) => item.serialNo !== serialNo));
                } else {
                    console.error("Error deleting data:", result.message);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };
    const filteredData = paddyData.filter((row) =>
        row[4]?.toLowerCase().includes(filterText.toLowerCase())
    );
    return (
        <div className="paddy-report-container">
            <h2>Paddy Purchase Report</h2>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by Farmer Name"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                     className="search-input"
                />
            </div>
            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>  {/* loader symbol here */}
                </div>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Serial No</TableCell>
                                    <TableCell>Farmer Name</TableCell>
                                    <TableCell>Purchase Date</TableCell>
                                    <TableCell>Total Paddy (KG)</TableCell>
                                    <TableCell>Price per Bag</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row[0]}>
                                        <TableCell>{row[3]}</TableCell>
                                        <TableCell>{row[4]}</TableCell>
                                        <TableCell>{row[8]}</TableCell>
                                        <TableCell>{row[10]}</TableCell>
                                        <TableCell>{row[11]}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleEdit(row)} variant="outlined" color="primary">
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(row[3])} variant="outlined" color="secondary">
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={paddyData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}  // Adjust available options
                    />

                    {/* Edit Dialog with PaddyPurchaseForm */}
                    <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                        <DialogTitle>Edit Paddy Purchase</DialogTitle>
                        <DialogContent>
                            {/* Pass selectedRow as initialData to pre-fill form fields */}
                            <PaddyPurchaseForm initialData={selectedRow} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                                Cancel
                            </Button>
                            {/* The Save Changes button will be handled inside PaddyPurchaseForm */}
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default PaddyPurchaseReport;
