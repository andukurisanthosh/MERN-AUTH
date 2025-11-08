const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');
const transporter = require('../Config/NodeMailer');
const { Email_Verify_Template, PASSWORD_RESET_TEMPLATE } = require('../Config/emailTemplates');


const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        // Check if user already exists 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie(
            'token', token,
            {
                httpOnly: true
                , secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

        // const mailOptions = {
        //     from: process.env.SENDER_EMAIL,
        //     to: newUser.email,
        //     subject: 'Welcome to Our Service',
        //     text: `Hello ${newUser.username},\n\nThank you for registering at our service!\n\nBest regards,\nTeam`
        // };

        // await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie(
            'token', token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        res.json({ success: false, message: 'Server error' });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        res.json({ success: false, message: 'Server error' });
    }
}

const sendVerifyOtpEmail = async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await User.findById(userID);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account already verified' });
        }
        const OTP = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = OTP;
        user.verifyOtpExpiry = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Hello ${user.username},\n\nYour OTP for account verification is: ${user.verifyOtp}\nIt is valid for 24 hours.\n\nBest regards,\nTeam`,
            html: Email_Verify_Template.replace('{{email}}', user.email).replace('{{otp}}', OTP)
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Verification OTP sent to email' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    const { OTP } = req.body
    const userID = req.user.id;
    if (!userID || !OTP) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.json({ message: 'User not found' });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== OTP) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }
        if (user.verifyOtpExpiry < Date.now()) {
            return res.json({ success: false, message: 'OTP has expired' });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiry = 0;

        await user.save();
        res.json({ success: true, message: 'Account verified successfully' });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};


const isAuthenticated = (req, res) => {
    try {
        res.json({ success: true, message: 'User is authenticated' });
    } catch (error) {
        res.json({ success: false, message: 'Server error' });
    }
};

const sendResetPasswordOtpEmail = async (req, res) => {
    // Implementation for sending reset password OTP email
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const OTP = String(Math.floor(100000 + Math.random() * 900000));

        user.resetPasswordOtp = OTP;
        user.resetPasswordOtpExpiry = Date.now() + 1 * 60 * 60 * 1000; // 1 hour    
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            // text: `Hello ${user.username},\n\nYour OTP for password reset is: ${user.resetPasswordOtp}\nIt is valid for 1 hour.\n\nBest regards,\nTeam`
            html: PASSWORD_RESET_TEMPLATE.replace('{{email}}', user.email).replace('{{otp}}', OTP)
        };
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Password reset OTP sent to email' });
    } catch (error) {
        res.json({ success: false, message: 'Server error' });
    }
}

const resetPassword = async (req, res) => {
    const { email, OTP, newPassword } = req.body;
    if (!email || !OTP || !newPassword) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        if (user.resetPasswordOtp === '' || user.resetPasswordOtp !== OTP) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }
        if (user.resetPasswordOtpExpiry < Date.now()) {
            return res.json({ success: false, message: 'OTP has expired' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOtp = '';
        user.resetPasswordOtpExpiry = 0;
        await user.save();
        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.json({ success: false, message: 'Server error' });
    }
};


module.exports = { register, login, logout, sendVerifyOtpEmail, verifyEmail, isAuthenticated, sendResetPasswordOtpEmail, resetPassword };