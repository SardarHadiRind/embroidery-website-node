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
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "embroideryDB";

console.log("=== MONGODB CONNECTION ===");
console.log("URI exists:", !!MONGODB_URI);
console.log("Database:", DB_NAME);

mongoose.connect(`${MONGODB_URI}/${DB_NAME}`)
    .then(() => {
        console.log("✅✅✅ MONGO DB CONNECTED! ✅✅✅");
        console.log("Your database is ready!");
    })
    .catch(err => {
        console.error("❌ MongoDB Error:", err.message);
    });

// Test route to check database status
app.get("/api/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.json({ 
        status: "ok", 
        database: dbStatus,
        message: "Embroidery Store API is running"
    });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Visit: https://embroidery-website-node-production.up.railway.app`);
});
