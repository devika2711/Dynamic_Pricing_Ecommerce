const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Set in .env file

// ✅ Signup Route
router.post("/signup", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 })
], async (req, res) => {
    console.log("📌 Signup request received:", req.body); // ✅ Log request data

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role = "user"  } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user){
            console.log("❌ User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("🔹 Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("✅ Creating new user...");
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        console.log("✅ User saved in DB:", user);

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role} });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Login Route
router.post("/login", [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, role: user.role}, JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role  } });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Middleware to Protect Routes
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};

router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
    res.json({ message: "Welcome Admin!" });
});


// ✅ Protected Route Example
router.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});

module.exports = {
    router,            // 🟢 Exporting the router
    authMiddleware,    // 🟢 Exporting the auth middleware
    adminMiddleware    // 🟢 Exporting the admin middleware
};
