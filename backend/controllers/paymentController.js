const Razorpay = require("razorpay");
const Order = require("../models/Order");
const mongoose = require("mongoose");
const Product = require("../models/Product");

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ Process Razorpay Payment
exports.processRazorpayPayment = async (req, res) => {
    try {
        const { amount, userId, cartItems } = req.body;

        console.log("🔹 Payment request received:", { amount, userId, cartItems });

        if (!amount || !userId || !cartItems || cartItems.length === 0) {
            console.error("❌ Missing required fields in request:", { amount, userId, cartItems });
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error("❌ Invalid userId format:", userId);
            return res.status(400).json({ error: "Invalid user ID format" });
        }
        
        const options = {
            amount: amount * 100, // Convert to paisa
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        console.log("🔹 Creating Razorpay Order with:", options);
        const response = await razorpay.orders.create(options);
        console.log("✅ Razorpay Order Created:", response);
    
        // Save order (Pending until Razorpay webhook confirms)
        const userObjectId = userId;
        const formattedCartItems = await Promise.all(
            cartItems.map(async (item) => {
                if (!mongoose.Types.ObjectId.isValid(item.product)) {
                    console.error("❌ Invalid product ID format:", item.product);
                    throw new Error("Invalid product ID format");
                }

                // ✅ Check if product exists in the database
                const productExists = await Product.findById(item.product);
                if (!productExists) {
                    console.error("❌ Product not found in DB:", item.product);
                    throw new Error(`Product with ID ${item.product} not found`);
                }

                return {
                    product: item.product, // ✅ Use the existing ObjectId from DB
                    quantity: item.quantity
                };
            })
        );

        console.log("🔹 Saving Order in DB...");
        const order = new Order({
            
            user: userObjectId,
            products: formattedCartItems,
            totalAmount: amount,
            paymentMethod: "Razorpay",
            paymentStatus: "Pending"
        });

        await order.save();
        console.log("Order Saved:", order);
        res.json({ orderId: response.id, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error("❌ Order Save Failed:", error);
        res.status(500).json({ error: "Payment failed", message: error.message });
    }
};

// ✅ Handle Webhook for Razorpay (Updates Order Status)
exports.handleRazorpayWebhook = async (req, res) => {
    const { payload } = req.body;
    if (payload && payload.payment) {
        await Order.findOneAndUpdate(
            { totalAmount: payload.payment.entity.amount / 100, paymentStatus: "Pending" },
            { paymentStatus: "Paid" }
        );
    }
    res.json({ received: true });
};

// ✅ Handle Cash on Delivery (COD)
exports.processCOD = async (req, res) => {
    try {
        const { amount, userId, cartItems } = req.body;

        // Save order directly with status "Pending"
        const order = new Order({
            user: userId,
            products: cartItems,
            totalAmount: amount,
            paymentMethod: "Razorpay",
            paymentStatus: "Pending"
        });
        await order.save();

        res.json({ message: "Order placed successfully" });
    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ error: "Failed to place order", message: error.message });
    }
};
