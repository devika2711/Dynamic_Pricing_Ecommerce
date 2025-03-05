const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("./authRoutes.js");

router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard!" });
});

module.exports = router;
