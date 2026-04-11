const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ============================================
// IMAGE UPLOAD CONFIGURATION
// ============================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Serve uploaded images
app.use('/uploads', express.static('public/uploads'));

// ============================================
// IMPORT ROUTES
// ============================================
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const discountRoutes = require("./routes/discountRoutes");

// ============================================
// USE ROUTES
// ============================================
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/discounts", discountRoutes);

// ============================================
// IMAGE UPLOAD ROUTE
// ============================================
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
        imageUrl: `/uploads/${req.file.filename}`,
        message: 'Image uploaded successfully'
    });
});

// ============================================
// SEARCH & FILTER API ENDPOINTS
// ============================================

// Search products by name, description, or category
app.get('/api/products/search/:query', async (req, res) => {
    try {
        const Product = require("./models/Product");
        const searchQuery = req.params.query;
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
    try {
        const Product = require("./models/Product");
        const products = await Product.find({ category: req.params.category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============================================
// SERVE HTML PAGES
// ============================================
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

app.get("/admin-orders.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin-orders.html"));
});

app.get("/admin-discounts.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin-discounts.html"));
});

// ============================================
// MONGODB CONNECTION
// ============================================
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/embroideryDB";

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch(err => {
    console.log("❌ MongoDB Connection Error:", err);
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}/login.html`);
    console.log(`📋 Admin Panel: http://localhost:${PORT}/admin.html`);
    console.log(`📦 Admin Orders: http://localhost:${PORT}/admin-orders.html`);
    console.log(`🏷️ Admin Discounts: http://localhost:${PORT}/admin-discounts.html`);
    console.log(`🛒 Shopping Cart: http://localhost:${PORT}/cart.html`);
    console.log(`📦 My Orders: http://localhost:${PORT}/orders.html`);
    console.log(`🔍 Search API: http://localhost:${PORT}/api/products/search/:query`);
});
