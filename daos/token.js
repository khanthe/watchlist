const mongoose = require('mongoose');
const uuid = require('uuid');

const Token = require('../models/token');

module.exports = {};

/**
 * Creates a random token string and creates a tokens document with that string
 * @function
 * @param {string} userId - A string representation of a mongo ObjectId for an existing document
 * @returns {object|boolean} Returns the document object that was created in the collection or false
 */
module.exports.makeTokenForUserId = async (userId) => {
    if (userId) {
        const theToken = uuid.v4();
        const tokenObj = await Token.create({userId: userId, token: theToken});
        return tokenObj.token;
    } else {
        return false;
    }
}

/**
 * Retrieves a userId matching the passed token string in a user document
 * @function
 * @param {string} tokenString - A token string
 * @returns {string|null} Returns the userId string or null if not found
 */
module.exports.getUserIdFromToken = async (tokenString) => {
    try {
        const tokenObj = await Token.findOne({token: tokenString}).lean();
        return tokenObj.userId;
    } catch (e) {
        return null;
    }
}

/**
 * Deletes a specific document from the tokens collection
 * @function
 * @param {string} tokenString - A token string
 * @returns {object|null} Returns the document object that was deleted if found and deleted or null if not
 */
module.exports.removeToken = async (tokenString) => {
    try {
        const deletedToken = await Token.findOneAndDelete({ token: tokenString });
        return deletedToken;
    } catch (e) {
        console.log(e);
        return null;
    }
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;