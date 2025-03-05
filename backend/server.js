const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));


// Routes

const { router: authRoutes, authMiddleware, adminMiddleware } = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);
const chatRoute = require("./routes/chat");
app.use("/api/chat", chatRoute);
app.use("/api/admin", require("./routes/admin"));

// WebSocket for Real-time Pricing Updates
io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("priceUpdate", (data) => {
        io.emit("newPrice", data);
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
