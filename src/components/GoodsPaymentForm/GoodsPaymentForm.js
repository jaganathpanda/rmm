import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./GoodsPaymentForm.css";
import { getUserInfo } from "../../utils/userSession";
import DateInput from "../../utils/DateInput";

const GoodsPaymentForm = () => {
    const user = getUserInfo();
    const scriptUrl = user[10]; // Apps Script endpoint
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
    const vendorEmail = rawData[9];
    const vendorAddress = rawData[6];
    const vendorName = rawData[5];
    const serialNo = rawData[4];
    const typeOfGoods = rawData[3];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentType === "UPI") {
            try {
                // 1. Create Razorpay order via Apps Script
                const res = await fetch(scriptUrl, {
                    method: "POST",
                    body: new URLSearchParams({
                        action: "createRazorpayOrder",
                        paidAmount: paymentAmount,
                        paymentDate,
                    }),
                });

                const result = await res.json();

                if (result.status === "Success") {
                    const options = {
                        key: "rzp_test_cXfTaJk9JKQ5Ff", // Replace with your Razorpay Key ID
                        amount: result.amount,
                        currency: "INR",
                        order_id: result.order_id,
                        name: user[2],
                        description: "Payment for Goods",
                        handler: async function (response) {
                            try {
                                const saveRes = await fetch(scriptUrl, {
                                    method: "POST",
                                    body: new URLSearchParams({
                                        action: "receiveAmountAgainstGoods",
                                        saleVoucherId: rawData[0],
                                        rmmUserId: rawData[2],
                                        paidAmount: paymentAmount,
                                        paymentType: "UPI",
                                        paymentDate,
                                        anyRemarks: remark,
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_signature: response.razorpay_signature,
                                    }),
                                });

                                const saveResult = await saveRes.json();

                                if (saveResult.status === "Success") {
                                    alert("UPI Payment successful and saved.");
                                    navigate("/SalesVoucherCardView");
                                } else {
                                    alert("Payment done, but failed to save details: " + saveResult.message);
                                }
                            } catch (error) {
                                console.error("Error saving Razorpay payment:", error);
                                alert("Payment successful, but saving failed.");
                            }
                        },
                        prefill: {
                            name: vendorName,
                            email: vendorEmail,
                            contact: vendorMobile,
                        },
                        notes: {
                            address:vendorAddress,
                        },
                        theme: {
                            color: "#3399cc"
                        }
                    };

                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                } else {
                    alert("Error creating Razorpay order: " + result.message);
                }
            } catch (error) {
                console.error("Error during Razorpay order creation:", error);
                alert("Something went wrong with Razorpay!");
            }
        } else {
            // Non-UPI Payment
            try {
                const res = await fetch(scriptUrl, {
                    method: "POST",
                    body: new URLSearchParams({
                        action: "receiveAmountAgainstGoods",
                        saleVoucherId: rawData[0],
                        rmmUserId: rawData[2],
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
                    <option value="UPI">UPI (Razorpay)</option>
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
