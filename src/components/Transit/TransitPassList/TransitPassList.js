import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../../utils/userSession";

import {
  Box,
  Button,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography
} from "@mui/material";

const ITEMS_PER_PAGE = 10;

const TransitPassList = () => {
  const user = getUserInfo();
  const scriptUrl = user?.[10];
  const navigate = useNavigate();

  const [transitPasses, setTransitPasses] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const form = new FormData();
        form.append("action", "getAllTransitPass");

        const response = await fetch(scriptUrl, { method: "POST", body: form });
        const result = await response.json();
        if (result.success) {
          setTransitPasses(result.data || []);
        } else {
          console.error("Fetch failed:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scriptUrl]);

  const handleDelete = async (transitId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const form = new FormData();
      form.append("action", "deleteTransitPass");
      form.append("transitId", transitId);

      const response = await fetch(scriptUrl, { method: "POST", body: form });
      const result = await response.json();

      if (result.success) {
        setTransitPasses((prev) => prev.filter((p) => p.TransitId !== transitId));
      } else {
        alert("Failed to delete record.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const filteredPasses = useMemo(() => {
    return transitPasses.filter((pass) =>
      (pass?.PPC || "").toLowerCase().includes(filter.toLowerCase())
    );
  }, [transitPasses, filter]);

  const totalPages = Math.ceil(filteredPasses.length / ITEMS_PER_PAGE);
  const currentItems = filteredPasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        🚛 Transit Pass Records
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Filter by PPC"
          variant="outlined"
          size="small"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate("/viewTransitPassForm", { state: { mode: "add" } })
          }
        >
          ➕ Add New Transit Pass
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>PPC</TableCell>
                  <TableCell>Miller</TableCell>
                  <TableCell>TP No.</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Bags</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Delay</TableCell>
                  <TableCell>Accepted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row?.PPC}</TableCell>
                      <TableCell>{row?.MILLER}</TableCell>
                      <TableCell>{row?.["Transit Pass No"]}</TableCell>
                      <TableCell>{row?.["Transit Pass Date"]}</TableCell>
                      <TableCell>{row?.["Vehicle No."]}</TableCell>
                      <TableCell>{row?.["Driver Name"]}</TableCell>
                      <TableCell>{row?.Bag}</TableCell>
                      <TableCell>{row?.["Quantity (in Quintals)"]}</TableCell>
                      <TableCell>{row?.["Delay (in Days)"]}</TableCell>
                      <TableCell>{row?.["Accepted Date"]}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            navigate("/viewTransitPassForm", {
                              state: { mode: "edit", transitPass: row }
                            })
                          }
                          sx={{ mr: 1 }}
                        >
                          ✏️
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(row?.TransitId)}
                        >
                          🗑️
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default TransitPassList;
