import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./GoodsPaymentForm.css";
import { getUserInfo } from "../../utils/userSession";
import { formatDateDDMMYYYY } from "../../utils/dateUtils";
import DateInput  from "../../utils/DateInput";

const GoodsPaymentForm = () => {
    const user = getUserInfo();
    const scriptUrl = user[10];
    const location = useLocation();
    const rawData = location.state.row || {};
    const navigate = useNavigate();
    
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [remark, setRemark] = useState("");

    const totalAmount = Number(rawData[16] || 0);
    const totalPaid = Number(rawData[20] || 0);
    const vendorMobile = rawData[10];
    const vendorName = rawData[5];
    const serialNo = rawData[4];
    const typeOfGoods = rawData[3];

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(scriptUrl, {
                method: "POST",
                body: new URLSearchParams({
                    action: "receiveAmountAgainstGoods",
                    saleVoucherId: rawData[0],
                    rmmUserId: rawData[2], // Make sure this is correct
                    paidAmount: paymentAmount,
                    paymentType,
                    paymentDate,
                    anyRemarks: remark,
                }),
            });

            const result = await res.json();

            if (result.status === "Success") {
                alert("Payment successfully entered.");
                navigate("/SalesVoucherCardView");
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error during payment:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="payment-form">
            <h2>GOODS PAYMENT</h2>
            <p><strong>TYPE OF GOODS:</strong> {typeOfGoods}</p>
            <p><strong>VENDOR NAME:</strong> {vendorName}</p>
            <p><strong>VENDOR MOBILE:</strong> {vendorMobile}</p>
            <p><strong>TOTAL GOODS AMOUNT:</strong> ₹{totalAmount}</p>
            <p><strong>TOTAL AMOUNT PAID:</strong> ₹{totalPaid}</p>
            <p><strong>TOTAL PENDING AMOUNT:</strong> ₹{totalAmount - totalPaid}</p>
            <p><strong>GOODS SERIAL NO:</strong> {serialNo}</p>

            <form onSubmit={handleSubmit}>
                <label>PAYMENT AMOUNT</label>
                <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                />

                <label>PAYMENT TYPE</label>
                <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    required
                >
                    <option value="">Select Payment Type</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK">Bank</option>
                    <option value="ONLINE">Online</option>
                </select>

                <DateInput
                    label="PAYMENT DATE"
                    name="paymentDate"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                />

                <label>ANY REMARK</label>
                <input
                    type="text"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />

                <button type="submit">SAVE</button>
            </form>
        </div>
    );
};

export default GoodsPaymentForm;
