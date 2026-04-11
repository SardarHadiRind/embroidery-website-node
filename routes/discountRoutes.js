const express = require("express");
const router = express.Router();
const Discount = require("../models/Discount");

// Validate discount code
router.post("/validate", async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        const discount = await Discount.findOne({ 
            code: code.toUpperCase(), 
            isActive: true,
            validFrom: { $lte: new Date() },
            validTo: { $gte: new Date() }
        });
        
        if (!discount) {
            return res.json({ valid: false, message: "Invalid or expired coupon" });
        }
        
        if (discount.usedCount >= discount.usageLimit) {
            return res.json({ valid: false, message: "Coupon usage limit reached" });
        }
        
        if (subtotal < discount.minOrder) {
            return res.json({ valid: false, message: `Minimum order of ₨ ${discount.minOrder} required` });
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
            discountAmount: discountAmount,
            finalAmount: subtotal - discountAmount,
            discountCode: discount.code
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create discount (Admin only)
router.post("/create", async (req, res) => {
    try {
        const discount = new Discount(req.body);
        await discount.save();
        res.json({ success: true, discount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;