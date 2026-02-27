const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['citizen', 'government', 'admin'],
        default: 'citizen'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'rejected'],
        default: 'active'
    },
    phone: { type: String, trim: true },
    city: { type: String, trim: true },
    ward: { type: String, trim: true },
    address: { type: String, trim: true },
    department: { type: String, trim: true },
    assignedArea: { type: String, trim: true },
    position: { type: String, trim: true },
    points: { type: Number, default: 0 },
    level: { type: String, default: 'Newcomer' },
    badges: [{ type: String }],
    profilePicture: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

// Calculate level based on points
userSchema.methods.calculateLevel = function () {
    const points = this.points;
    if (points >= 1000) return 'Champion';
    if (points >= 500) return 'Expert';
    if (points >= 200) return 'Advanced';
    if (points >= 50) return 'Active';
    return 'Newcomer';
};

module.exports = mongoose.model('User', userSchema);
