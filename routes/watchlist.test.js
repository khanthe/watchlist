const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const Watchlist = require('../models/watchlist');
const User = require('../models/user');

describe("/watchlist", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);

    //let savedAuthors;
    const testWatchlist = [{
            title: "Stargate",
            description: "An interstellar teleportation device, found in Egypt, leads to a planet with humans resembling ancient Egyptians who worship the god Ra.",
            genre: "Sci-Fi",
            year: 1994,
            runtime: 116,
            rating: 7.0,
            watched: false
        },
        {
            title: "Star Trek: The Motion Picture",
            description: "When an alien spacecraft of enormous power is spotted approaching planet Earth, Admiral James T. Kirk resumes command of the overhauled USS Enterprise in order to intercept the planet.",
            genre: "Sci-Fi",
            year: 1979,
            runtime: 143,
            rating: 6.4,
            watched: false
        },
        {
            title: "Dune",
            description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
            genre: "Sci-Fi",
            year: 2021,
            runtime: 155,
            rating: 8.0,
            watched: false
        },
        {
            title: "Mrs. Harris Goes to Paris",
            description: "A widowed cleaning lady in 1950s London falls madly in love with a couture Dior dress, and decides that she must have one of her own.",
            genre: "Drama",
            year: 2022,
            runtime: 115,
            rating: 7.1,
            watched: false
        },
        {
            title: "Damsel",
            description: "A dutiful damsel agrees to marry a handsome prince, only to find the royal family has recruited her as a sacrifice to repay an ancient debt.",
            genre: "Fantasy",
            year: 2024,
            runtime: 110,
            rating: 6.1,
            watched: false
        },
        {
            title: "Top Gun: Maverick",
            description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
            genre: "Action",
            year: 2022,
            runtime: 130,
            rating: 8.2,
            watched: false
        }
    ];

    describe("Before login", () => {
        describe("POST /", () => {
            it("should send 401 without a token", async () => {
                const res = await request(server).post("/watchlist").send(testWatchlist[0]);
                expect(res.statusCode).toEqual(401);
            });
            it("should send 401 with a bad token", async () => {
                const res = await request(server)
                    .post("/watchlist")
                    .set("Authorization", "Bearer BAD")
                    .send(testWatchlist[0]);
                expect(res.statusCode).toEqual(401);
            });
        });
        describe("GET /", () => {
            it("should send 401 without a token", async () => {
                const res = await request(server).get("/watchlist").send(testWatchlist[0]);
                expect(res.statusCode).toEqual(401);
            });
            it("should send 401 with a bad token", async () => {
                const res = await request(server)
                    .get("/watchlist")
                    .set("Authorization", "Bearer BAD")
                    .send(testWatchlist[0]);
                expect(res.statusCode).toEqual(401);
            });
        });
        describe("GET /:id", () => {
            it("should send 401 without a token", async () => {
                const res = await request(server).get("/watchlist/123").send(testWatchlist[0]);
                expect(res.statusCode).toEqual(401);
            });
            it("should send 401 with a bad token", async () => {
                const res = await request(server)
                    .get("/watchlist/456")
                    .set("Authorization", "Bearer BAD")
                    .send(testWatchlist[0]);
                expect(res.statusCode).toEqual(401);
            });
        });
    });

    describe("after login", () => {
        const user0 = {
            email: "user0@mail.com",
            password: "123password",
        };
        const user1 = {
            email: "user1@mail.com",
            password: "456password",
        };
        let token0;
        let token1;
        beforeEach(async () => {
            await request(server).post("/auth/signup").send(user0);
            const res0 = await request(server).post("/auth/login").send(user0);
            token0 = res0.body.token;
            await request(server).post("/auth/signup").send(user1);
            await User.updateOne(
                { email: user1.email },
                { $push: { roles: "admin" } }
            );
            const res1 = await request(server).post("/auth/login").send(user1);
            token1 = res1.body.token;
        });
        describe("POST /", () => {
            it("should send 403 for a basic user", async () => {
                const res = await request(server)
                    .post("/watchlist")
                    .set("Authorization", "Bearer " + token0)
                    .send(testWatchlist[0]);
                expect(res.statusCode).toEqual(403);
            });
            it("should send 200 for an admin", async () => {
                const movie = {
                    title: "Test",
                    description: "No desc",
                    genre: "Drama",
                    year: 2020,
                    runtime: 115,
                    rating: 7.1,
                    watched: false
                }
                const res = await request(server)
                    .post("/watchlist")
                    .set("Authorization", "Bearer " + token1)
                    .send(movie);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toMatchObject(movie);
            });
        });
        describe("GET /", () => {

            beforeEach(async () => {
                const savedWatchlist = await Watchlist.insertMany(testWatchlist);
                testWatchlist.forEach((movie, index) => {
                    movie._id = savedWatchlist[index]._id.toString();
                });
            });
            afterEach(testUtils.clearDB);

            it("should return all movies for a basic user", async () => {
                const res = await request(server)
                    .get("/watchlist")
                    .set("Authorization", "Bearer " + token0)
                    .send();
                expect(res.statusCode).toEqual(200);
                testWatchlist.forEach(movie => {
                    expect(res.body).toContainEqual(
                        expect.objectContaining(movie)
                    )
                })
            });
        });
        
        describe("GET /:id", () => {

            beforeEach(async () => {
                const savedWatchlist = await Watchlist.insertMany(testWatchlist);
                testWatchlist.forEach((movie, index) => {
                    movie._id = savedWatchlist[index]._id.toString();
                });
            });
            afterEach(testUtils.clearDB);

            it("should return 400 if id is invalid", async () => {
            const res = await request(server)
                .get("/watchlist/123")
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res.statusCode).toEqual(400);
            });
            it("should return 200 if id is valid", async () => {
            const res = await request(server)
                .get("/watchlist/" + testWatchlist[0]._id)
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject(testWatchlist[0]);
            });
        });

        describe("PUT /:id", () => {

            beforeEach(async () => {
                const savedWatchlist = await Watchlist.insertMany(testWatchlist);
                testWatchlist.forEach((movie, index) => {
                    movie._id = savedWatchlist[index]._id.toString();
                });
            });
            afterEach(testUtils.clearDB);

            it("should reject a movie with an empty body", async () => {
                const { _id } = testWatchlist[0];
                const res = await request(server)
                    .put("/watchlist/" + _id)
                    .set("Authorization", "Bearer " + token1)
                    .send({});
                expect(res.statusCode).toEqual(400);
            });
        
            it("should reject a bad id", async () => {
                const res = await request(server)
                    .put("/watchlist/fake")
                    .set("Authorization", "Bearer " + token1)
                    .send(testWatchlist[0]);
                expect(res.statusCode).toEqual(400);
            });

            it("should send 403 for a non admin", async () => {
                const res = await request(server)
                    .put("/watchlist/fake")
                    .set("Authorization", "Bearer " + token0)
                    .send(testWatchlist[0]);
                expect(res.statusCode).toEqual(403);
            });
        
            it("should update a movie", async () => {
                const originalMovie = testWatchlist[1];
                const movie = { ...originalMovie };
                movie.year = 2025;
                const res = await request(server)
                    .put("/watchlist/" + movie._id)
                    .set("Authorization", "Bearer " + token1)
                    .send(movie);
                expect(res.statusCode).toEqual(200);
                
                const savedMovie = await testUtils.findOne(Watchlist, { _id: movie._id });
                expect(savedMovie).toMatchObject(movie);
            });
        });

        describe("DELETE /:id", () => {

            beforeEach(async () => {
                const savedWatchlist = await Watchlist.insertMany(testWatchlist);
                testWatchlist.forEach((movie, index) => {
                    movie._id = savedWatchlist[index]._id.toString();
                });
            });
            afterEach(testUtils.clearDB);

            it("should reject a bad id", async () => {
                const res = await request(server)
                    .delete("/watchlist/fake")
                    .set("Authorization", "Bearer " + token1)
                    .send();
                expect(res.statusCode).toEqual(400);
            });

            it("should send 403 for a non admin", async () => {
                const res = await request(server)
                    .delete("/watchlist/fake")
                    .set("Authorization", "Bearer " + token0)
                    .send();
                expect(res.statusCode).toEqual(403);
            });
            
            it("should delete the expected entry", async () => {
                const { _id } = testWatchlist[2];
                const res = await request(server)
                    .delete("/watchlist/" + _id)
                    .set("Authorization", "Bearer " + token1)
                    .send({});
                expect(res.statusCode).toEqual(200);
                const storedMovie = await Watchlist.findOne({ _id });
                expect(storedMovie).toBeNull();
            });
        });


        describe("GET /search", () => {

            beforeEach(async () => {
                const savedWatchlist = await Watchlist.insertMany(testWatchlist);
                testWatchlist.forEach((movie, index) => {
                    movie._id = savedWatchlist[index]._id.toString();
                });
            });
            afterEach(testUtils.clearDB);

            it("should return movies that matched the search term", async () => {
                const searchTerm = 'teleportation'
                const res = await request(server)
                    .get("/watchlist/search?query=" + encodeURI(searchTerm))
                    .set("Authorization", "Bearer " + token0)
                    .send();
                expect(res.statusCode).toEqual(200);
                expect(res.body).toMatchObject([
                    testWatchlist.find(movie => movie.title === 'Stargate')
                ]);
            });

          });

    });
});