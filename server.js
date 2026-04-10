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

// MongoDB Connection - FIXED for Railway
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "embroideryDB";

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in environment variables");
    process.exit(1);
}

mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ MongoDB Connected Successfully to:", DB_NAME);
})
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Login page available`);
});
