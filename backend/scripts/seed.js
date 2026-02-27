require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Delete existing admin if exists
        await User.deleteOne({ email: 'admin@civiceye.com' });

        const admin = new User({
            fullName: 'CivicEye Admin',
            email: 'admin@civiceye.com',
            password: 'Admin@123',
            role: 'admin',
            status: 'active',
            city: 'Mumbai',
            points: 0
        });

        await admin.save();
        console.log('✅ Admin account created:');
        console.log('   Email: admin@civiceye.com');
        console.log('   Password: Admin@123');
        console.log('⚠️  Please change these credentials in production!');

        await mongoose.disconnect();
        console.log('✅ Seeding complete!');
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
