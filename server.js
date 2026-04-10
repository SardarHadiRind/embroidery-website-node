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

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/embroideryDB")
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch(err => {
    console.log("❌ MongoDB Connection Error:", err);
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:5000/login.html`);
    console.log(`📋 Admin Panel: http://localhost:5000/admin.html`);
    console.log(`🛒 Shopping Cart: http://localhost:5000/cart.html`);
    console.log(`📦 My Orders: http://localhost:5000/orders.html`);
});