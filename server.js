const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Import Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Serve HTML Pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/cart.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cart.html"));
});

app.get("/orders.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "orders.html"));
});

app.get("/admin.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// ✅ FIXED: MongoDB Connection - Use Railway variable or fallback to local
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/embroideryDB";

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch(err => {
    console.log("❌ MongoDB Connection Error:", err);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}/login.html`);
    console.log(`📋 Admin Panel: http://localhost:${PORT}/admin.html`);
    console.log(`🛒 Shopping Cart: http://localhost:${PORT}/cart.html`);
    console.log(`📦 My Orders: http://localhost:${PORT}/orders.html`);
});
