# Reel Roadmap: A movie watchlist
A personal movie watchlist API using express.js and MongoDB that allows you to track what movies you want to watch, search for movies that fit your mood using keywords, and collaborate with friends adnd family.

Do you ever forget what movies were on your "list" because you didn't write them down? Do you know there were many films you wanted to see, but when you sit down to watch something you can't find anything interesting? Do your friends and family suggest movies for you, but later you forget what they suggested? If you can say yes to any of those, the Reel Roadmap is for you. An comprehensive API that lets you keep track of all of the movies you want to watch.

The watchlist includes:
* A list of the movies you want to watch
* Tracking of movies that you hvae watched
* Search functionality that uses titles, descriptions, and genres
* Suggestions for you from other users (friends and family).

## Technical Components

### Routes

**Auth (/auth/...)**
- /signup (post) - Allows users to register
- /login (post) - User log-in to manage watch list or post suggestions, depending on role
- /password (put) - allows users to change password
- /logout (post) - deletes a user token and logs them out


**Watchlist (/watchlist/...)**
- / (post) - Allows admin to add movie
- /:id (put) - Allows admin to update movie, such as mark it watched
- / (get) - Allows any user to view watchlist
- /:id (get) - Allows any user to view single movie
- /search/ (get) - Allows any user to search watchlist by keyword


**Suggestions (/suggest/...)**
- / (post) - Allows any user to add a movie suggestion
- /:id (put) - Allows admin to mark as watched
- / (get) - Allows any user to view suggestions list


### DAOs

**User DAOs**
- createUser - makes new document in users collection
- getUser - retrieves document from users collection using email
- updatePassword - changes stored user password


**Token DAOs**
- makeTokenForUserId - createss a token using the users ID and stores it as a document in the tokens collection
- getUserIdFromToken - retrieves a user ID for a token from a document in the tokens collection
- removeToken - removes a specific document from the tokens collection


**Watchlist DAOs**
- createMovie - adds movie document to watchlist collection
- udpateMovie - updates existing movie object in watchlist collection
- getAll - retrieves all movies from watchlist
- getById - gets a specific movie document from the watchlist
- search - Finds all movies that match keyword in title, description, or genre


**Suggestion DAOs**
- createSuggestion - adds a document to the suggestions collection
- updateSuggestion - updates a specific document in the suggestions collection
- getAll - retrieves all suggested movies from collection


### Models
- user - email (required, unique), hashed password (required)
- token - userId (required), token (required, unique)
- watchlist - title (required), description (required), genre, year (required), runtime, IMDB rating, watched (creates unique movies with title and year [ watchlistSchema.index({ title: 1, year: 1 }, { unique: true }); ]
- suggestion - title (required), description (required), genre, year (required), runtime, IMDB rating, watched (creates unique movies with title and year [ watchlistSchema.index({ title: 1, year: 1 }, { unique: true }); ]

## How requirements will be met


## Timeline
