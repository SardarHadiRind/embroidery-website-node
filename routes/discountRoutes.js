const express = require("express");
const router = express.Router();

// Store discounts in memory (in production, use MongoDB)
let discounts = [
    {
        code: "SAVE10",
        type: "percentage",
        value: 10,
        minOrder: 500,
        maxDiscount: 500,
        validFrom: new Date("2024-01-01"),
        validTo: new Date("2025-12-31"),
        usedCount: 0,
        usageLimit: 100,
        isActive: true
    },
    {
        code: "SAVE20",
        type: "percentage",
        value: 20,
        minOrder: 1000,
        maxDiscount: 1000,
        validFrom: new Date("2024-01-01"),
        validTo: new Date("2025-12-31"),
        usedCount: 0,
        usageLimit: 100,
        isActive: true
    },
    {
        code: "WELCOME50",
        type: "fixed",
        value: 50,
        minOrder: 0,
        maxDiscount: 0,
        validFrom: new Date("2024-01-01"),
        validTo: new Date("2025-12-31"),
        usedCount: 0,
        usageLimit: 1000,
        isActive: true
    }
];

// Validate discount code
router.post("/validate", async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        
        if (!code) {
            return res.json({ valid: false, message: "Please enter a coupon code" });
        }
        
        // Find discount
        const discount = discounts.find(d => 
            d.code === code.toUpperCase() && 
            d.isActive && 
            new Date(d.validFrom) <= new Date() && 
            new Date(d.validTo) >= new Date() &&
            d.usedCount < d.usageLimit
        );
        
        if (!discount) {
            return res.json({ valid: false, message: "Invalid or expired coupon" });
        }
        
        if (subtotal < discount.minOrder) {
            return res.json({ valid: false, message: `Minimum order of ₨ ${discount.minOrder.toLocaleString()} required` });
        }
        
        let discountAmount = 0;
        if (discount.type === 'percentage') {
            discountAmount = (subtotal * discount.value) / 100;
            if (discount.maxDiscount > 0 && discountAmount > discount.maxDiscount) {
                discountAmount = discount.maxDiscount;
            }
        } else {
            discountAmount = discount.value;
        }
        
        res.json({
            valid: true,
            discountAmount: Math.round(discountAmount),
            finalAmount: subtotal - discountAmount,
            discountCode: discount.code,
            message: `Coupon applied! You saved ₨ ${Math.round(discountAmount).toLocaleString()}`
        });
    } catch (error) {
        console.error("Coupon validation error:", error);
        res.status(500).json({ valid: false, error: error.message });
    }
});

// Create discount (Admin)
router.post("/create", async (req, res) => {
    try {
        const newDiscount = {
            ...req.body,
            code: req.body.code.toUpperCase(),
            usedCount: 0,
            isActive: true,
            createdAt: new Date()
        };
        discounts.push(newDiscount);
        res.json({ success: true, discount: newDiscount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all discounts
router.get("/", async (req, res) => {
    res.json(discounts);
});

// Delete discount
router.delete("/:code", async (req, res) => {
    discounts = discounts.filter(d => d.code !== req.params.code.toUpperCase());
    res.json({ success: true });
});

module.exports = router;
