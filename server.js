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

// DEBUG: Show what we have
console.log("=== MONGODB DEBUG ===");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("MONGODB_URI length:", process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
console.log("DB_NAME:", process.env.DB_NAME);

// Test route to check MongoDB status
app.get("/api/db-status", async (req, res) => {
    try {
        const status = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        res.json({ 
            status: states[status],
            mongodb_uri_exists: !!process.env.MONGODB_URI,
            db_name: process.env.DB_NAME
        });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "embroideryDB";

if (MONGODB_URI) {
    console.log("Attempting connection to:", MONGODB_URI.substring(0, 30) + "...");
    
    // Try without database name first
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log("✅✅✅ DATABASE CONNECTED! ✅✅✅");
            // Then switch to the specific database
            const db = mongoose.connection.db;
            db.command({ ping: 1 }).then(() => {
                console.log("Database ping successful");
            });
        })
        .catch(err => {
            console.error("❌ DB Error:", err.message);
            console.error("Full error:", err);
        });
} else {
    console.log("⚠️ No MONGODB_URI found");
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server on port ${PORT}`);
    console.log(`🌐 https://embroidery-website-node-production.up.railway.app`);
    console.log(`🔍 Test DB: /api/db-status`);
});
