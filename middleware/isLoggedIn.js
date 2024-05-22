
const tokenDAO = require('../daos/token');

/**
 * Middleware that checks for authHeader contains a valid token
 * @name isLoggedIn
 * @function
 * @param {header} - an authHeader
 * @returns {status} Sends an http status code
 */
const isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {

        const token = authHeader.slice(7); 
        const userId = await tokenDAO.getUserIdFromToken(token);

        if (!userId) {
            res.status(401).json({ error: 'Token invalid' });
        } else {
            req.userId = userId;
            req.token = token;
            next();
        }
    } else {
        res.status(401).json({ error: 'Auth header missing or invalid' });
    }
};

module.exports = isLoggedIn;