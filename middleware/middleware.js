const jwt = require('jsonwebtoken');
const { nextTick } = require('process');
module.exports = {
    verifyToken: (req, res, next) => {
        let authHeader = req.headers.authorization;
        let token = authHeader && authHeader.split(' ')[1];
        if (token === null) return res.status(401).json({
            status: 'Unauthorized',
            message: 'Please provide a valid token!'
        });
        // console.log(token);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({
                status: 'Forbidden',
                message: 'Please provide a valid token!'
            });
            req.email = decoded.email;
            console.log('success', decoded);
            next();
        })
    },
    refreshToken: async (req, res) => {
        try {

        } catch (e) {

        }
    }
}
