const express = require("express");
const router = express.Router();
const paymentService = require("../services/paymentService");
const Order = require("../models/Order");

// Initiate JazzCash payment
router.post("/jazzcash/initiate", async (req, res) => {
    try {
        const { orderId, amount, description } = req.body;
        
        const result = await paymentService.createJazzCashPayment({
            orderId,
            amount,
            description
        });
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Initiate EasyPaisa payment
router.post("/easypaisa/initiate", async (req, res) => {
    try {
        const { orderId, amount, mobileNumber, email, description } = req.body;
        
        const result = await paymentService.createEasyPaisaPayment({
            orderId,
            amount,
            mobileNumber,
            email,
            description
        });
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Payment callback handler
router.post("/callback/:gateway", async (req, res) => {
    try {
        const { gateway } = req.params;
        const paymentData = req.body;
        
        const isValid = paymentService.verifyPaymentCallback(paymentData, gateway);
        
        if (isValid) {
            // Update order status in database
            await Order.findOneAndUpdate(
                { orderId: paymentData.pp_BillReference || paymentData.transactionId },
                { status: "paid", paymentGateway: gateway }
            );
            
            res.status(200).send("OK");
        } else {
            res.status(400).send("Invalid callback");
        }
    } catch (error) {
        console.error("Callback error:", error);
        res.status(500).send("Error");
    }
});

module.exports = router;
