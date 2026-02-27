const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    category: {
        type: String,
        required: true,
        enum: ['pothole', 'garbage', 'streetlight', 'water', 'sewage', 'electricity', 'road', 'park', 'noise', 'other']
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['reported', 'assigned', 'in_progress', 'resolved', 'closed'],
        default: 'reported'
    },
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        area: { type: String, trim: true }
    },
    imageUrl: { type: String, default: '' },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    resolvedAt: { type: Date, default: null },
    assignedAt: { type: Date, default: null }
}, {
    timestamps: true
});

// Index for geospatial queries
issueSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
issueSchema.index({ status: 1, category: 1 });
issueSchema.index({ reportedBy: 1 });

module.exports = mongoose.model('Issue', issueSchema);
