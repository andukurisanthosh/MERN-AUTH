const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpiry: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetPasswordOtp: { type: String, default: '' },
    resetPasswordOtpExpiry: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.model.User || mongoose.model('User', userSchema);
module.exports = User;