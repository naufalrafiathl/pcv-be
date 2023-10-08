const jwt = require('jsonwebtoken');
const secret = process.env.YOUR_SECRET;

exports.authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};
