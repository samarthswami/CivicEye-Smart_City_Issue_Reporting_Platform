const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const inviteTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        default: () => uuidv4(),
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    department: { type: String, required: true },
    position: { type: String, default: '' },
    assignedArea: { type: String, default: '' },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isUsed: { type: Boolean, default: false },
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
}, {
    timestamps: true
});

inviteTokenSchema.methods.isExpired = function () {
    return this.expiresAt < new Date();
};

module.exports = mongoose.model('InviteToken', inviteTokenSchema);
