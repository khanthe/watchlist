const { Router } = require("express");
const router = Router({ mergeParams: true });

const suggestionDAO = require('../daos/suggestions');
const userDAO = require('../daos/user');
const watchlistDAO = require('../daos/watchlist');

const isLoggedIn = require('../middleware/isLoggedIn');
const isAuthorized = require('../middleware/isAuthorized');
const Suggestion = require("../models/suggestion");
const mongoose = require("mongoose"); 


/**
 * Route for creating a suggestion
 * @name post/
 * @function
 * @memberof module:routers/suggestionsRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.post("/", isLoggedIn, async (req, res, next) => {
    let entryObj = req.body;
    const user = await userDAO.getUser(req.userId); 

    entryObj.userId = user._id;
    if ( !entryObj.title || !entryObj.description || !entryObj.year ) {
      return res.status(400).send('Title, description, and year are required');
    } else {
      try {
          const suggestionEntry = await suggestionDAO.createEntry(entryObj);
          res.json(suggestionEntry); 
      } catch(e) {
          res.status(500).send(e.message);
      }    
    }
});

/**
 * Route for updating a suggestion
 * @name put/:id
 * @function
 * @memberof module:routers/suggestionsRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.put("/:id", isLoggedIn,  async (req, res, next) => {

    const entryId = req.params.id;
    const entryUpdate = req.body;
    const user = await userDAO.getUser(req.userId); 

    originalSuggestion = await suggestionDAO.getById(entryId);

    if (originalSuggestion.userId.toString() === user._id.toString()) {
        
      if (!entryUpdate || JSON.stringify(entryUpdate) === '{}' ) {
        res.status(400).send('Suggestion entry is required"');
      
      } else {
        try {
          const updatedEntry = await suggestionDAO.updateEntry(entryId, entryUpdate);
          res.status(200).json(updatedEntry);
        } catch(e) {
          if (e instanceof itemDAO.BadDataError) {
            res.status(400).send(e.message);
          } else {
            res.status(500).json({ error: 'Internal Server Error' });
          }
        }
      }
    
    } else {
      res.status(403).send('User doe not match suggestion');
    }

});

/**
 * Route for getting all suggestions
 * @name get/
 * @function
 * @memberof module:routers/suggestionsRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const suggestions = await suggestionDAO.getAll();
        res.status(200).json(suggestions);
    } catch(e) {
        res.status(500).json({ e: 'Internal Server Error' });
    }
});

/**
 * Route for getting a specific suggestion
 * @name get/:id
 * @function
 * @memberof module:routers/suggestionsRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.get("/:id", isLoggedIn, async (req, res, next) => {
  const entryId = req.params.id;

  try {
    const entry = await suggestionDAO.getById(entryId);
    if (entry) {
        res.status(200).json(entry);
    } else {
        res.sendStatus(400);
    }
  } catch(e) {
    next(e);
  }
});

/**
 * Route for deleting a specific suggestion
 * @name delete/:id
 * @function
 * @memberof module:routers/suggestionsRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.delete("/:id", isLoggedIn, isAuthorized, async (req, res, next) => {
  try {
      const entryId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(entryId)) {
        return res.status(400).json({ error: "Invalid ObjectId" });
      } else {
        const success = await suggestionDAO.deleteById(entryId);
        res.sendStatus(success ? 200 : 400);
      }
  } catch(e) {
      return res.status(500).send("Internal Server Error");
  }
});

/**
 * Route for accepting a specific suggestion
 * @name post/accept/:id
 * @function
 * @memberof module:routers/suggestionsRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} isAuthorized - Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.post("/accept/:id", isLoggedIn, isAuthorized, async (req, res, next) => {
  const entryId = req.params.id;
  let suggestion = await suggestionDAO.getById(entryId);

  if (suggestion) {
    try {
        delete suggestion._id;
        delete suggestion.userId;
        const watchlistEntry = await watchlistDAO.createEntry(suggestion);
        if (watchlistEntry) {
          await suggestionDAO.deleteById(entryId);
          res.send(200).json(watchlistEntry); 
        } else {

        }
        
    } catch(e) {
        res.status(500).send(e.message);
    }    
  } else {
    res.status(404).send('Suggestion not found');
  }

});


module.exports = router;