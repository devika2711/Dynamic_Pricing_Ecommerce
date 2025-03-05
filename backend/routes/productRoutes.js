const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Dynamic Pricing Function
const calculateDynamicPrice = (product) => {
    let newPrice = product.price;

    if (product.demand > 100) {
        newPrice *= 1.2; // Increase price by 20% if demand is high
    } else if (product.stock > 50) {
        newPrice *= 0.9; // Decrease price by 10% if stock is high
    }

    return newPrice.toFixed(2);
};

// Get all products
router.get("/", async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// Add new product
router.post("/add", async (req, res) => {
    try {
        console.log(req.body);
        const { name, price, stock, image, category } = req.body;
        const product = new Product({ name, price, stock, image, category });
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Update Demand & Adjust Price
router.post("/update-demand", async (req, res) => {
    const { productId, demand } = req.body;
    let product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.demand += demand;
    product.price = calculateDynamicPrice(product);
    await product.save();

    res.json(product);
});

router.delete("/delete-old", async (req, res) => {
    try {
        const result = await Product.deleteMany({ "category": { "$exists": false } });
        res.json({ message: "Old products deleted", deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ message: "Error deleting old products" });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const categories = await Product.distinct("category"); // ✅ Get unique categories
        res.json(["All", ...categories]); // ✅ Include "All" option
    } catch (err) {
        res.status(500).json({ message: "Error fetching categories" });
    }
});

router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        // ✅ Search in `name`, `category`, and `description`
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },        // Match product name
                { category: { $regex: query, $options: "i" } },    // Match category
                { description: { $regex: query, $options: "i" } }  // Match description
            ]
        });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error searching products" });
    }
});


module.exports = router;
