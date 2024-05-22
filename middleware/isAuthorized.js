const userDAO = require('../daos/user');

/**
 * Middleware confirming request userId has admin role 
 * @name isAuthorized
 * @function
 * @returns {status} Sends an http status code
 */
const isAuthorized = async (req, res, next) => {

    const userObj = await userDAO.getUser(req.userId);

    if (userObj) {

        try {
            
            const userRoles = userObj.roles;

            if (userRoles.includes('admin')) {
                next();
            } else {
                res.status(403).send('Forbidden');
            }

        } catch (error) {
            res.status(403).json({ error: 'Forbidden' });
        }

    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

module.exports = isAuthorized;