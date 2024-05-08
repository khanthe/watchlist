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

**Watchlist (/watchlist/..)**
- / (post) - Allows admin to add movie
- /:id (put) - Allows admin to update movie, such as mark it watched
- / (get) - Allows any user to view watchlist
- /:id (get) - Allows any user to view single movie
- /search/ (get) - Allows any user to search watchlist by keyword

**Suggestions (/suggest/..)**
- / (post) - Allows any user to add a movie suggestion
- /:id (put) - Allows admin to mark as watched
- / (get) - Allows any user to view suggestions list


### DAOs

### Models

## How requirements will be met


## Timeline
