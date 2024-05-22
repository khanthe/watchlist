const mongoose = require('mongoose');

const Watchlist = require('../models/watchlist');

module.exports = {};

/**
 * Creates a movie entry document for the watchlist collection.
 * @function
 * @param {object} entryObj - An object that represents a movie.
 * @returns {object} Returns the document object that was created in the collection
 */
module.exports.createEntry = async (entryObj) => {
  return Watchlist.create(entryObj);
};

/**
 * Updates a movie entry document for the watchlist collection.
 * @function
 * @param {string} entryId - A string representation of a mongo ObjectId for an existing document
 * @param {object} entryObj - An object that represents an existing document with at least one changed value.
 * @returns {boolean} Returns true or false if the document was updated or not
 */
module.exports.updateEntry = async (entryId, entryObj) => {
  if (!mongoose.Types.ObjectId.isValid(entryId)) {
    return false;
  }
  await Watchlist.updateOne({ _id: entryId }, entryObj);
  return true;
};

/**
 * Retrieves all documents in the watchlist collection.
 * @function
 * @returns {array} Returns tan array of all documents from the watchlist collection.
 */
module.exports.getAll = async () => {
  return await Watchlist.find({});
};

/**
 * Retrieves a specific document from the watchlist collection
 * @function
 * @param {string} id - A string representation of a mongo ObjectId for an existing document
 * @returns {object|null} Returns the document object if found or null if not
 */
module.exports.getById = async (id) => {
  try {
    const entry = await Watchlist.findOne({ _id: id }).lean();
    return entry;
  } catch (e) {
    return null;
  }
};

/**
 * Deletes a specific document from the watchlist collection
 * @function
 * @param {string} entryId - A string representation of a mongo ObjectId for an existing document
 * @returns {object|null} Returns the document object if found and deleted or null if not
 */
module.exports.deleteById = (entryId) => {
  try {
    const deletedMovie = Watchlist.findOneAndDelete({ _id: entryId });
    return deletedMovie;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Searches a collection for documents that match the query string
 * @function
 * @param {string} query - A term to search the collection for
 * @returns {array} Returns a sorted array of objects containing up to 50 matches for the query string
 */
module.exports.search = async (query) => {
  return Watchlist.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(50);
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;