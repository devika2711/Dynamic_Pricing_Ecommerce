const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ Fetch Orders for a Specific User
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).populate({
        path: "products.product", // ✅ Fetch full product details
        select: "name image price" // ✅ Fetch only required fields
    });

res.json(orders);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders", message: error.message });
    }
});

module.exports = router;
