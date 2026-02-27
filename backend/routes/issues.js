const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const User = require('../models/User');
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/issues/report
// @desc    Report a new issue (citizen)
router.post('/report', authenticate, requireRole('citizen'), upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, severity, latitude, longitude, address, city, area } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Title, description, and category are required' });
        }

        const issue = new Issue({
            title,
            description,
            category,
            severity: severity || 'medium',
            location: { latitude, longitude, address, city, area },
            imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
            reportedBy: req.user._id
        });

        await issue.save();

        // Award points to citizen
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { points: 10 }
        });

        // Update level
        const updatedUser = await User.findById(req.user._id);
        updatedUser.level = updatedUser.calculateLevel();
        await updatedUser.save();

        await issue.populate('reportedBy', 'fullName email');

        res.status(201).json({
            message: 'Issue reported successfully! You earned 10 points.',
            issue
        });
    } catch (err) {
        console.error('Issue report error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/issues/my-complaints
// @desc    Get citizen's own complaints
router.get('/my-complaints', authenticate, requireRole('citizen'), async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const query = { reportedBy: req.user._id };
        if (status) query.status = status;

        const total = await Issue.countDocuments(query);
        const issues = await Issue.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('reportedBy', 'fullName email')
            .populate('assignedTo', 'fullName department');

        res.json({ issues, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/issues/all
// @desc    Get all issues (government/admin)
router.get('/all', authenticate, requireRole('government', 'admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, status, category, severity } = req.query;
        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (severity) query.severity = severity;

        const total = await Issue.countDocuments(query);
        const issues = await Issue.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('reportedBy', 'fullName email city')
            .populate('assignedTo', 'fullName department');

        res.json({ issues, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/issues/stats
// @desc    Get issue statistics
router.get('/stats', authenticate, async (req, res) => {
    try {
        const query = req.user.role === 'citizen' ? { reportedBy: req.user._id } : {};

        const [total, reported, assigned, inProgress, resolved] = await Promise.all([
            Issue.countDocuments(query),
            Issue.countDocuments({ ...query, status: 'reported' }),
            Issue.countDocuments({ ...query, status: 'assigned' }),
            Issue.countDocuments({ ...query, status: 'in_progress' }),
            Issue.countDocuments({ ...query, status: 'resolved' }),
        ]);

        const categoryStats = await Issue.aggregate([
            { $match: query },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({ total, reported, assigned, inProgress, resolved, categoryStats });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/issues/:id
// @desc    Get single issue
router.get('/:id', authenticate, async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('reportedBy', 'fullName email city')
            .populate('assignedTo', 'fullName department');

        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        res.json({ issue });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/issues/:id/resolve
// @desc    Mark issue as resolved (government/admin)
router.post('/:id/resolve', authenticate, requireRole('government', 'admin'), async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id).populate('reportedBy');
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        issue.status = 'resolved';
        issue.resolvedAt = new Date();
        issue.assignedTo = req.user._id;
        await issue.save();

        // Award bonus points to original reporter
        if (issue.reportedBy) {
            await User.findByIdAndUpdate(issue.reportedBy._id, {
                $inc: { points: 25 }
            });
            const reporter = await User.findById(issue.reportedBy._id);
            reporter.level = reporter.calculateLevel();
            await reporter.save();
        }

        res.json({ message: 'Issue resolved! Reporter awarded 25 bonus points.', issue });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/issues/:id/status
// @desc    Update issue status (government/admin)
router.put('/:id/status', authenticate, requireRole('government', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['reported', 'assigned', 'in_progress', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            {
                status,
                ...(status === 'resolved' && { resolvedAt: new Date() }),
                ...(status === 'assigned' && { assignedTo: req.user._id, assignedAt: new Date() })
            },
            { new: true }
        ).populate('reportedBy', 'fullName').populate('assignedTo', 'fullName department');

        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        res.json({ message: 'Status updated', issue });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/issues/:id/upvote
// @desc    Upvote an issue (citizen)
router.post('/:id/upvote', authenticate, requireRole('citizen'), async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        const userId = req.user._id.toString();
        const alreadyUpvoted = issue.upvotedBy.map(id => id.toString()).includes(userId);

        if (alreadyUpvoted) {
            issue.upvotedBy = issue.upvotedBy.filter(id => id.toString() !== userId);
            issue.upvotes = Math.max(0, issue.upvotes - 1);
        } else {
            issue.upvotedBy.push(req.user._id);
            issue.upvotes += 1;
        }

        await issue.save();
        res.json({ message: alreadyUpvoted ? 'Upvote removed' : 'Issue upvoted', upvotes: issue.upvotes });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/issues/:id/comment
// @desc    Add comment to issue
router.post('/:id/comment', authenticate, async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment || !comment.trim()) {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }

        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        issue.comments.push({
            userId: req.user._id,
            userName: req.user.fullName,
            comment: comment.trim(),
            createdAt: new Date()
        });

        await issue.save();
        res.json({ message: 'Comment added', comments: issue.comments });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
