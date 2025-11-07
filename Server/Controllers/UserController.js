const User = require('../Models/UserModel');


const getUserProfile = async (req, res) => {
    try {
        const userID = req.user.id; 
        const user = await User.findById(userID).select('-password -verifyOtp -verifyOtpExpiry');
        if (!user) {
            return res.json({success:false, message: 'User not found' });
        }   
        res.json({ success: true, userData:{username:user.username, isAccountVerified:user.isAccountVerified} });
    } catch (error) {
        res.json({success:false, message: 'Server error' });
    }
};

module.exports = { getUserProfile };