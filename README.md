# Self Evaluation

## Approach and results
I used Express.js and Mongoose to create an APi that had multiple sets of functionality for 2 distinct user cases: a watchlist owner and a contributing friend or family member.  The main watchlist is only managed by the authenticated and authorized owner, and is for their personal use. It is a list of all movies they want to watch. A second similar set of functionality allows authenticated users to create entries in a second set of movie suggestions. The list owner can accept these suggestions and incorporate them into their primary watchlist.

The app uses 4 collections:
- Users that are registered (including the owner)
- Tokens for current authenticated sessions
- Watchlist for the main list
- Suggestions for the user suggestions

All routes are tested and function well together. Only admins can accomplish tasks that are intended for admins.

## What I learned
This project had an "eureka" moment for understanding how express routes are created and leveraged, and how the large set of files work together. Building this from scratch really solidified my understanding of how these technologies work.

## What I would do differently and improve upon
I would love to see this project built out with a front end, and plan to explore that in the future. The API works, but it doesn't function as a full tool without a front end user interface.

Unit tests for suggestions proved more difficult as there was added complexity in multiple users being able to add documents to the collection, and an admin that had total permissions over the whole tool. I would like to re-write the unit tests for suggestions from scratch with a more cohesive approach.

## What worked well and what didn't
The concept worked well, and fills a legitimate need that I, and probably others, have. I have several lists of movies saved in various places digitally, and frequently have movies suggested to me that I'm not sure I want to watch but want to evaluate later, and know who suggested. I just can't keep it all in my head! So the concept has great value.

What didn't work well was the details that would be needed to make an evaluation where a lot. Not all of the details were required, but usually would be necessary. For example, descriptions are a bit of writing and a lot to ask somebody to write, so they are not required, but without them a suggestion is only partial information.

And again, without a UI this API is not complete. In it's current state it is not a tool that can be used.

# Reel Roadmap: A movie watchlist
A personal movie watchlist API using express.js and MongoDB that allows you to track what movies you want to watch, search for movies that fit your mood using keywords, and collaborate with friends and family.

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
- /password (put) - Allows users to change password
- /logout (post) - Deletes a user token and logs them out


**Watchlist (/watchlist/...)**
- / (post) - Allows admin to add movie
- /:id (put) - Allows admin to update movie, such as mark it watched
- / (get) - Allows any user to view watchlist
- /:id (get) - Allows any user to view single movie
- /:id (delete) - Allows admin to delete movie from list
- /search/ (get) - Allows any user to search watchlist by keyword


**Suggestions (/suggest/...)**
- / (post) - Allows any user to add a movie suggestion
- /:id (put) - Allows admin to mark as watched
- / (get) - Allows any user to view suggestions list
- /:id (delete) - Allows admin to delete movie from suggestions
- /accept/:id (post) - Allows admin to accept suggestion, adding it to the watchlist and removing it from the suggestions


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
- search - finds all movies that match keyword in title, description, or genre
- deleteMovie - finds a specific movie and deletes it


**Suggestion DAOs**
- createSuggestion - adds a document to the suggestions collection
- updateSuggestion - updates a specific document in the suggestions collection
- getAll - retrieves all suggested movies from collection
- deleteSuggestion - finds a specific suggestion and deletes it
- acceptSuggestion - takes a suggestion, adds it to the watchlist, then deletes it from suggestions


### Models
- user - email (required, unique), hashed password (required)
- token - userId (required), token (required, unique)
- watchlist - title (required), description (required), genre, year (required), runtime, IMDB rating, watched true/false (creates unique movies with title and year [ watchlistSchema.index({ title: 1, year: 1 }, { unique: true }); ]
- suggestion - title (required), description (required), genre, year (required), runtime, IMDB rating, watched true/false (creates unique movies with title and year [ watchlistSchema.index({ title: 1, year: 1 }, { unique: true }); ]

## How requirements will be met

- Authentication required as user to view list and make suggestions
- Authorization as admin required to manage list (create, mark watched, remove, etc.)
- 2 sets of crud routes for watchlist and suggestions, both include creating documents (post), retrieving documents (get), updating documents (put), and deleting documents (delete) -- see above for specifics
- All routes tested using jest tests
- Demoed to class using a saved Postman collection

## Timeline

- Week 6: Project proposal, timeline, and technical setup drafted
- Week 7: Authenticate/Authorize and main watchlist create / read
  - Set up routes, DAOs and models for user management
  - Set up routes, DAOs and models for watchlist create and reading
- Week 8: Watchlist update, delete and Suggestions
  - Set up routes and DAOs for watchlist updates, deletes
  - Set up routes, DAOs, and models for suggestions list
- Week 9: Tests and deploys
  - Create jest tests for all routes and ensure complete coverage
  - Deploy project using Railway and Mongo Atlas
- Week 10: Rehearse and present
