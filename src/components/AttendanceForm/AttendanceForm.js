import React, { useState, useEffect } from "react";
import "./AttendanceForm.css";

const AttendanceForm = () => {
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [salaryType, setSalaryType] = useState("Weekly");
  const [vouNo, setVouNo] = useState("");
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: "Akura Sahu", attendance: "Present", ot: 0, overtime: 0, remarks: "", salary: "Weekly" },
    { id: 2, name: "Alok Podh", attendance: "Present", ot: 0, overtime: 0, remarks: "", salary: "Monthly" },
    { id: 3, name: "Arjun Sahu", attendance: "Absent", ot: 0, overtime: 0, remarks: "", salary: "Monthly" },
    { id: 4, name: "Janki Ganit", attendance: "Half", ot: 0, overtime: 0, remarks: "", salary: "Monthly" },
  ]);

  // Generate Vou No
  useEffect(() => {
    const generatedVouNo = "V" + new Date().getTime().toString().slice(-5);
    setVouNo(generatedVouNo);
  }, []);

  // Update day of week when date changes
  useEffect(() => {
    if (date) {
      const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
      setDay(dayName);
    }
  }, [date]);

  const handleAttendanceChange = (id, value) => {
    setAttendanceData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, attendance: value } : item))
    );
  };

  const totalCounts = () => {
    let present = 0, half = 0, absent = 0;
    attendanceData.forEach((item) => {
      if (item.attendance === "Present") present++;
      else if (item.attendance === "Half") half++;
      else if (item.attendance === "Absent") absent++;
    });
    return { present, half, absent };
  };

  const { present, half, absent } = totalCounts();

  return (
    <div className="attendance-form">
      <h2>📝 Attendance Entry</h2>

      {/* Form Header */}
      <div className="form-header">
        <label>
          Date:{" "}
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <span><b>{day}</b></span>
        <label>
          Salary Type:{" "}
          <select value={salaryType} onChange={(e) => setSalaryType(e.target.value)}>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
            <option value="Monthly">Monthly</option>
          </select>
        </label>
        <span>Vou No: {vouNo}</span>
        <label>
          Remark: <input type="text" placeholder="Enter remarks" />
        </label>
      </div>

      {/* Attendance Table */}
      <table>
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Staff Name</th>
            <th>Attendance</th>
            <th>OT (Hour)</th>
            <th>Overtime</th>
            <th>Remarks</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((staff, index) => (
            <tr key={staff.id}>
              <td>{index + 1}</td>
              <td>{staff.name}</td>
              <td>
                <select
                  value={staff.attendance}
                  onChange={(e) => handleAttendanceChange(staff.id, e.target.value)}
                >
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Half</option>
                </select>
              </td>
              <td><input type="number" value={staff.ot} readOnly /></td>
              <td><input type="number" value={staff.overtime} readOnly /></td>
              <td><input type="text" value={staff.remarks} readOnly /></td>
              <td>{staff.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="summary">
        Present: {present} | Half: {half} | Absent: {absent} | Total: {attendanceData.length}
      </div>

      {/* Buttons */}
      <div className="form-buttons">
        <button>Modify</button>
        <button>Cancel</button>
        <button>Exit</button>
      </div>
    </div>
  );
};

export default AttendanceForm;
