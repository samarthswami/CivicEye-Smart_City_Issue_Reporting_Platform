const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Issue = require('../models/Issue');
const InviteToken = require('../models/InviteToken');
const { authenticate, requireRole } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// All admin routes require admin role
router.use(authenticate, requireRole('admin'));

// @route   GET /api/admin/stats
// @desc    Get system-wide statistics
router.get('/stats', async (req, res) => {
    try {
        const [
            totalUsers,
            totalCitizens,
            totalGovt,
            totalIssues,
            resolvedIssues,
            pendingApprovals
        ] = await Promise.all([
            User.countDocuments({ role: { $ne: 'admin' } }),
            User.countDocuments({ role: 'citizen' }),
            User.countDocuments({ role: 'government' }),
            Issue.countDocuments(),
            Issue.countDocuments({ status: 'resolved' }),
            User.countDocuments({ role: 'government', status: 'pending' })
        ]);

        const recentIssues = await Issue.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('reportedBy', 'fullName city');

        const categoryStats = await Issue.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            stats: {
                totalUsers,
                totalCitizens,
                totalGovt,
                totalIssues,
                resolvedIssues,
                pendingApprovals,
                resolutionRate: totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0
            },
            recentIssues,
            categoryStats
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/users/pending
// @desc    Get government users pending approval
router.get('/users/pending', async (req, res) => {
    try {
        const users = await User.find({ role: 'government', status: 'pending' })
            .sort({ createdAt: -1 });
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
    try {
        const { role, status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (role) query.role = role;
        if (status) query.status = status;

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/admin/users/:id/approve
// @desc    Approve government user
router.post('/users/:id/approve', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'active' },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `${user.fullName} has been approved`, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/admin/users/:id/reject
// @desc    Reject government user
router.post('/users/:id/reject', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `${user.fullName} has been rejected`, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/admin/invite/generate
// @desc    Generate invite link for government user
router.post('/invite/generate', async (req, res) => {
    try {
        const { email, department, position, assignedArea } = req.body;

        if (!email || !department) {
            return res.status(400).json({ message: 'Email and department are required' });
        }

        // Check if active unused invite exists for this email
        const existingInvite = await InviteToken.findOne({ email, isUsed: false, expiresAt: { $gt: new Date() } });
        if (existingInvite) {
            return res.status(400).json({ message: 'An active invite already exists for this email' });
        }

        const invite = new InviteToken({
            email,
            department,
            position: position || '',
            assignedArea: assignedArea || '',
            createdBy: req.user._id
        });

        await invite.save();

        const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register/government?token=${invite.token}`;

        res.status(201).json({
            message: 'Invite generated successfully',
            invite,
            inviteLink
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/invite/list
// @desc    List all invite tokens
router.get('/invite/list', async (req, res) => {
    try {
        const invites = await InviteToken.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'fullName')
            .populate('usedBy', 'fullName email');
        res.json({ invites });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
