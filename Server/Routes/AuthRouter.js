const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    sendVerifyOtpEmail,
    verifyEmail,
    isAuthenticated,
    sendResetPasswordOtpEmail,
    resetPassword
} = require('../Controllers/AuthController');
const userAuth = require('../Middleware/UserAUTH');



router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-verify-otp-email', userAuth, sendVerifyOtpEmail);
router.post('/verify-email', userAuth, verifyEmail);
router.get('/is-auth', userAuth, isAuthenticated);
router.post('/send-reset-password-otp-email', sendResetPasswordOtpEmail);
router.post('/reset-password', resetPassword);

module.exports = router;  