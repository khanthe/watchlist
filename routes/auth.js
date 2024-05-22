const { Router } = require("express");
const router = Router({ mergeParams: true });
const bcrypt = require('bcrypt');

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

const isLoggedIn = require('../middleware/isLoggedIn');


/**
 * Route serving signup form.
 * @name post/signup
 * @function
 * @memberof module:routers/authRouter
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password ) {
        return res.status(400).send('Both email and password are required');
    } else {
        try {
            const hashedPassword  = await bcrypt.hash(password, 3);
            const userObj = { email: email, password: hashedPassword, roles: ['user'] };
            const savedUser = await userDAO.createUser(userObj);
            res.status(200).json(savedUser); 
        } catch(e) {
            if (e.code === 11000) {
                res.status(409).send('Duplicate');
            } else {
                res.status(500).send(e.message);
            }
        }
    }
});


/**
 * Route serving login form.
 * @name post/login
 * @function
 * @memberof module:routers/authRouter
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password ) {
        return res.status(400).send('Both email and password are required');
    } else {
        try {
            const userObj = await userDAO.getUser(email);

            if (!userObj) {
                res.status(401).send('Unauthorized');
            } else {
                const passwordsMatch = await bcrypt.compare(password, userObj.password);
                
                if (!passwordsMatch) {
                    res.status(401).send('Unauthorized');
                } else {
                    const userToken = await tokenDAO.makeTokenForUserId(email);
                    res.status(200).json({token: userToken}); 
                }
            }
        } catch(e) {
            res.status(500).send('errrrorrrr', e.message);
        }
    }

});


/**
 * Route serving password update form.
 * @name put/password
 * @function
 * @memberof module:routers/authRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.put("/password", isLoggedIn, async (req, res, next) => {
    try {
        const password = req.body.password;
        if (password.length < 1) {
            res.sendStatus(400);
        } else {
            const hashedPassword  = await bcrypt.hash(password, 3);
            const updatedUser = await userDAO.updateUserPassword(req.userId, hashedPassword);
            if (!updatedUser) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
});


/**
 * Route serving password update form.
 * @name post/logout
 * @function
 * @memberof module:routers/authRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.post("/logout", isLoggedIn, async (req, res, next) => {
    try {
        const deletedToken = await tokenDAO.removeToken(req.token);

        if (deletedToken) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }

    } catch(e) {
        res.status(500).send(e.message);
    }
});


module.exports = router;