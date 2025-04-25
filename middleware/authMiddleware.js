const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
    try {
        // Check both signed and unsigned cookies
        const token = req.signedCookies?.token || req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({ msg: 'Authentication Invalid' });
        }

        const payload = isTokenValid({ token });
        if (!payload || !payload.userId) {
            return res.status(401).json({ msg: 'Authentication Invalid' });
        }

        req.user = payload;
        next();
    } catch (error) {
        console.error('Token validation error:', error);
        return res.status(401).json({ msg: 'Authentication Invalid' });
    }
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Unauthorized to access this route' });
        }
        next();
    }
}

module.exports = { authenticateUser, authorizePermissions }