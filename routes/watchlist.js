const { Router } = require("express");
const router = Router({ mergeParams: true });

const watchlistDAO = require('../daos/watchlist');

const isLoggedIn = require('../middleware/isLoggedIn');
const isAuthorized = require('../middleware/isAuthorized');
const e = require("express");
const mongoose = require("mongoose"); 


/**
 * Route for creating a movie for the watchlist
 * @name post/
 * @function
 * @memberof module:routers/watchlistRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} isAuthorized - Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.post("/", isLoggedIn, isAuthorized, async (req, res, next) => {
    const entryObj = req.body;

    if ( !entryObj.title || !entryObj.description || !entryObj.year ) {
      return res.status(400).send('Title, description, and year are required');
    } else {
      try {
          const watchlistEntry = await watchlistDAO.createEntry(entryObj);
          res.json(watchlistEntry); 
      } catch(e) {
        console.log(e);
          res.status(500).send(e.message);
      }    
    }
});

/**
 * Route for searching the watchlist 
 * @name get/search
 * @function
 * @memberof module:routers/watchlistRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.get("/search/", isLoggedIn, async (req, res, next) => {
  let { page, perPage, query } = req.query;
  page = page ? Number(page) : 0;
  perPage = perPage ? Number(perPage) : 10;
  try {
    const entries = await watchlistDAO.search(query);
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * Route for updating a movie for the watchlist
 * @name put/:id
 * @function
 * @memberof module:routers/watchlistRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} isAuthorized - Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.put("/:id", isLoggedIn, isAuthorized, async (req, res, next) => {

    const entryId = req.params.id;
    const entryUpdate = req.body;
  
    if (!entryUpdate || JSON.stringify(entryUpdate) === '{}' ) {
      res.status(400).send('Watchlist entry is required"');
    } else {
      try {
        const updatedEntry = await watchlistDAO.updateEntry(entryId, entryUpdate);
        if (!updatedEntry) {
          res.sendStatus(400);
        } else {
          res.status(200).json(updatedEntry);
        }
      } catch(e) {
        if (e instanceof itemDAO.BadDataError) {
          res.status(400).send(e.message);
        } else {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    }
});

/**
 * Route for getting all movies for the watchlist
 * @name get/
 * @function
 * @memberof module:routers/watchlistRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const watchlist = await watchlistDAO.getAll();
        res.status(200).json(watchlist);
    } catch(e) {
        res.status(500).json({ e: 'Internal Server Error' });
    }
});

/**
 * Route for getting a specific movie from the watchlist
 * @name get/:id
 * @function
 * @memberof module:routers/watchlistRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} isAuthorized - Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.get("/:id", isLoggedIn, async (req, res, next) => {
  const entryId = req.params.id;

  try {
      const entry = await watchlistDAO.getById(entryId);
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
 * Route for deleting a specific movie from the watchlist
 * @name delete/:id
 * @function
 * @memberof module:routers/watchlistRouter
 * @param {string} path - Express path
 * @param {callback} isLoggedIn -  Express middleware
 * @param {callback} isAuthorized - Express middleware
 * @param {callback} middleware - Express middleware.
 */
router.delete("/:id", isLoggedIn, isAuthorized, async (req, res, next) => {
  try {
      const entryId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(entryId)) {
        return res.status(400).json({ error: "Invalid ObjectId" });
    } else {
      const success = await watchlistDAO.deleteById(entryId);
      res.sendStatus(success ? 200 : 400);
    }
  } catch(e) {
      return res.status(500).send("Internal Server Error");
  }
});



module.exports = router;