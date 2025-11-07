const jwt = require('jsonwebtoken');

const userAuth = async(req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id) {
            req.user = { id: decoded.id };
            next();
        } else {
            return res.json({ message: 'Not authorized' });
        }
    } catch (error) {
        return res.json({ message: 'Token is not valid' });
    }
};

module.exports = userAuth;