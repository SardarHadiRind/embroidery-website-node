const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Secret key for JWT (store in .env in production)
const JWT_SECRET = "your_secret_key_change_this";

// 📝 SIGNUP Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        res.status(201).json({ 
            message: "User created successfully",
            userId: user._id 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔐 LOGIN Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Create token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );
        
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Make sure this line is EXACTLY this
module.exports = router;