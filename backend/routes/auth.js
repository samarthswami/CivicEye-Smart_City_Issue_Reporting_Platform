const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const InviteToken = require('../models/InviteToken');
const { authenticate } = require('../middleware/auth');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/citizen/signup
// @desc    Register a new citizen
router.post('/citizen/signup', [
    body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullName, email, password, phone, city, ward } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User({
            fullName,
            email,
            password,
            phone,
            city,
            ward,
            role: 'citizen',
            status: 'active'
        });

        await user.save();
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Registration successful!',
            token,
            user: user.toJSON()
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @route   POST /api/auth/citizen/login
// @desc    Login citizen
router.post('/citizen/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'citizen' });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is disabled' });
        }

        const token = generateToken(user._id);
        res.json({ message: 'Login successful', token, user: user.toJSON() });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/government/signup
// @desc    Register government user (requires invite token)
router.post('/government/signup', [
    body('fullName').trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('inviteToken').notEmpty().withMessage('Invite token is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullName, email, password, phone, inviteToken } = req.body;

        // Validate invite token
        const invite = await InviteToken.findOne({ token: inviteToken });
        if (!invite) return res.status(400).json({ message: 'Invalid invite token' });
        if (invite.isUsed) return res.status(400).json({ message: 'Invite token already used' });
        if (invite.isExpired()) return res.status(400).json({ message: 'Invite token has expired' });
        if (invite.email !== email) return res.status(400).json({ message: 'Email does not match invite' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const user = new User({
            fullName,
            email,
            password,
            phone,
            role: 'government',
            status: 'pending',
            department: invite.department,
            position: invite.position,
            assignedArea: invite.assignedArea
        });

        await user.save();

        // Mark invite as used
        invite.isUsed = true;
        invite.usedBy = user._id;
        await invite.save();

        res.status(201).json({
            message: 'Registration submitted. Awaiting admin approval.',
            user: user.toJSON()
        });
    } catch (err) {
        console.error('Gov signup error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/government/login
// @desc    Login government user
router.post('/government/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'government' });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status === 'pending') {
            return res.status(403).json({ message: 'Your account is pending admin approval' });
        }
        if (user.status === 'rejected') {
            return res.status(403).json({ message: 'Your account has been rejected' });
        }

        const token = generateToken(user._id);
        res.json({ message: 'Login successful', token, user: user.toJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/admin/login
// @desc    Login admin
router.post('/admin/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'admin' });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const token = generateToken(user._id);
        res.json({ message: 'Admin login successful', token, user: user.toJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { fullName, phone, city, ward, address } = req.body;
        const user = await User.findById(req.user._id);

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (city) user.city = city;
        if (ward) user.ward = ward;
        if (address) user.address = address;

        await user.save();
        res.json({ message: 'Profile updated', user: user.toJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
