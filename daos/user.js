const mongoose = require('mongoose');

const User = require('../models/user');

module.exports = {};

/**
 * Creates a user document for the users collection.
 * @function
 * @param {object} entryObj - An object that represents a user.
 * @returns {object} Returns the document object that was created in the collection
 */
module.exports.createUser = async (userObj) => {
    return User.create(userObj);
} 

/**
 * Retrieves a specific user document from the users collection
 * @function
 * @param {string} email - The users email address
 * @returns {object|null} Returns the document object if found or null if not
 */
module.exports.getUser = async (email) => {
    try {
        return User.findOne({email: email}).lean();
    } catch (e) {
        return null;
    }
}

/**
 * Updates a user document password.
 * @function
 * @param {string} userId - A string representation of a mongo ObjectId for an existing document
 * @param {string} password - A hashed password string.
 * @returns {boolean} Returns the updated document
 */
module.exports.updateUserPassword = async (userId, password) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: userId }, 
            { password: password }, 
            { new: true } 
        );
        return updatedUser;
    } catch (e) {
        console.error('Error updating user password:', e);
        throw e; 
    }
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;