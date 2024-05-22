const mongoose = require('mongoose');

const Suggestion = require('../models/suggestion');

module.exports = {};

/**
 * Creates a movie entry document for the suggestions collection.
 * @function
 * @param {object} entryObj - An object that represents a movie.
 * @returns {object} Returns the document object that was created in the collection
 */
module.exports.createEntry = async (entryObj) => {
  return Suggestion.create(entryObj);
};

/**
 * Updates a movie entry document for the suggestions collection.
 * @function
 * @param {string} entryId - A string representation of a mongo ObjectId for an existing document
 * @param {object} entryObj - An object that represents an existing document with at least one changed value.
 * @returns {boolean} Returns true or false if the document was updated or not
 */
module.exports.updateEntry = async (entryId, entryObj) => {
  if (!mongoose.Types.ObjectId.isValid(entryId)) {
    return false;
  }
  await Suggestion.updateOne({ _id: entryId }, entryObj);
  return true;
};

/**
 * Retrieves all documents in the suggestions collection.
 * @function
 * @returns {array} Returns tan array of all documents from the suggestions collection.
 */
module.exports.getAll = async () => {
  return await Suggestion.find({});
};

/**
 * Retrieves a specific document from the suggestions collection
 * @function
 * @param {string} id - A string representation of a mongo ObjectId for an existing document
 * @returns {object|null} Returns the document object if found or null if not
 */
module.exports.getById = async (id) => {
  try {
    const entry = await Suggestion.findOne({ _id: id }).lean();
    return entry;
  } catch (e) {
    return null;
  }
};

/**
 * Deletes a specific document from the suggestions collection
 * @function
 * @param {string} entryId - A string representation of a mongo ObjectId for an existing document
 * @returns {object|null} Returns the document object if found and deleted or null if not
 */
module.exports.deleteById = (entryId) => {
  try {
    return Suggestion.findOneAndDelete({ _id: entryId });
  } catch (e) {
    return null;
  }
};

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;