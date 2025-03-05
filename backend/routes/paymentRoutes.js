const express = require("express");
const router = express.Router();
const {
    processRazorpayPayment,
    handleRazorpayWebhook,
    processCOD
} = require("../controllers/paymentController");

// ✅ Razorpay Payment
router.post("/razorpay", processRazorpayPayment);
router.post("/razorpay/webhook", handleRazorpayWebhook);

// ✅ Cash on Delivery (COD)
router.post("/cod", processCOD);

module.exports = router;
