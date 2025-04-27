import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./GoodsPaymentForm.css";
import { getUserInfo } from "../../utils/userSession";
import Spinner from '../Spinner/Spinner'
import DateInput from "../../utils/DateInput";

const GoodsPaymentForm = () => {
    const user = getUserInfo();
    const scriptUrl = user[10]; // Apps Script endpoint
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const rawData = location.state.row || {};
    const source = location.state.source || "";
    const actionName = source === "paddy" ? "payAmountAgainstPaddy" : "receiveAmountAgainstGoods";
    const navigate = useNavigate();

    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [remark, setRemark] = useState("");
    let totalAmount = Number(rawData[16] || 0);
    let totalPaid = Number(rawData[20] || 0);
    let vendorMobile = rawData[10];
    let vendorEmail = rawData[9];
    let vendorAddress = rawData[6];
    let vendorName = rawData[5];
    let serialNo = rawData[4];
    let typeOfGoods = rawData[3];
    let voucherOrPaddyId = "";
    if (source === "goods") {
        totalAmount = Number(rawData[16] || 0);
        totalPaid = Number(rawData[20] || 0);
        vendorMobile = rawData[10];
        vendorEmail = rawData[9];
        vendorAddress = rawData[6];
        vendorName = rawData[5];
        serialNo = rawData[4];
        typeOfGoods = rawData[3];
        voucherOrPaddyId = "saleVoucherId";
    } else {
        totalAmount = Number(rawData[13] || 0);
        totalPaid = Number(rawData[19] || 0);
        vendorMobile = rawData[7];
        vendorEmail = rawData[6];
        vendorAddress = rawData[5];
        vendorName = rawData[4];
        serialNo = rawData[3];
        typeOfGoods = rawData[15];
        voucherOrPaddyId = "paddyRecordId";
    }

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
                                setLoading(true);
                                const saveRes = await fetch(scriptUrl, {
                                    method: "POST",
                                    body: new URLSearchParams({
                                        action: actionName,
                                        [voucherOrPaddyId]: rawData[0],
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
                                    setLoading(true);
                                    alert("UPI Payment successful and saved.");
                                    if (source === "paddy") {
                                        navigate("/PaddyPurchaseReport");
                                    } else if (source === "goods") {
                                        navigate("/SalesVoucherCardView");
                                    }
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
                            address: vendorAddress,
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
                        action: actionName,
                        [voucherOrPaddyId]: rawData[0],
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
                    if (source === "paddy") {
                        navigate("/PaddyPurchaseReport");
                    } else if (source === "goods") {
                        navigate("/SalesVoucherCardView");
                    }

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
            <h2>{source === "paddy" ? "PADDY PAYMENT" : "GOODS PAYMENT"}</h2>
            {loading ? (
                <Spinner size={100} color="#e74c3c" text="Please wait..." />
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

export default GoodsPaymentForm;
