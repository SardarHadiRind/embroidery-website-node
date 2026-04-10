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

// DEBUG: Log all environment variables
console.log("=== ENVIRONMENT VARIABLES CHECK ===");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "SET ✓" : "NOT SET ✗");
console.log("DB_NAME:", process.env.DB_NAME || "NOT SET");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET ✓" : "NOT SET ✗");
console.log("PORT:", process.env.PORT || "NOT SET");
console.log("===================================");

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "embroideryDB";

if (!MONGODB_URI) {
    console.error("❌ CRITICAL: MONGODB_URI environment variable is missing!");
    console.error("Please add it in Railway Variables tab");
} else {
    console.log("Attempting to connect to MongoDB...");
    mongoose.connect(`${MONGODB_URI}/${DB_NAME}`)
        .then(() => console.log("✅✅✅ MongoDB Connected Successfully! ✅✅✅"))
        .catch(err => console.error("❌ MongoDB Error:", err.message));
}

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
