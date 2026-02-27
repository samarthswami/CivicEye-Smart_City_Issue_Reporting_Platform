const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// @route   GET /api/leaderboard
// @desc    Get citizen leaderboard by points
router.get('/', authenticate, async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const citizens = await User.find({ role: 'citizen', isActive: true })
            .sort({ points: -1 })
            .limit(Number(limit))
            .select('fullName points level city badges createdAt');

        // Add rank to each citizen
        const leaderboard = citizens.map((citizen, index) => ({
            rank: index + 1,
            ...citizen.toJSON()
        }));

        // Get current user's rank
        const currentUserRank = await User.countDocuments({
            role: 'citizen',
            points: { $gt: (await User.findById(req.user._id))?.points || 0 }
        }) + 1;

        res.json({ leaderboard, currentUserRank });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
