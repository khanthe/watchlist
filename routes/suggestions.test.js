const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const Suggestion = require('../models/suggestion');
const User = require('../models/user');


describe("/suggestions", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);

    //let savedAuthors;
    const testSuggestions = [{
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
                const res = await request(server).post("/suggestions").send(testSuggestions[0]);
                expect(res.statusCode).toEqual(401);
            });
            it("should send 401 with a bad token", async () => {
                const res = await request(server)
                    .post("/suggestions")
                    .set("Authorization", "Bearer BAD")
                    .send(testSuggestions[0]);
                expect(res.statusCode).toEqual(401);
            });
        });
        describe("GET /", () => {
            it("should send 401 without a token", async () => {
                const res = await request(server).get("/suggestions").send(testSuggestions[0]);
                expect(res.statusCode).toEqual(401);
            });
            it("should send 401 with a bad token", async () => {
                const res = await request(server)
                    .get("/suggestions")
                    .set("Authorization", "Bearer BAD")
                    .send(testSuggestions[0]);
                expect(res.statusCode).toEqual(401);
            });
        });
        describe("GET /:id", () => {
            it("should send 401 without a token", async () => {
                const res = await request(server).get("/suggestions/123").send(testSuggestions[0]);
                expect(res.statusCode).toEqual(401);
            });
            it("should send 401 with a bad token", async () => {
                const res = await request(server)
                    .get("/suggestions/456")
                    .set("Authorization", "Bearer BAD")
                    .send(testSuggestions[0]);
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

            it("should send 200 for any user", async () => {
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
                    .post("/suggestions")
                    .set("Authorization", "Bearer " + token1)
                    .send(movie);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toMatchObject(movie);
            });

            it("should send reject a suggestion without a title", async () => {
                const movie = {
                    description: "No desc",
                    genre: "Drama",
                    year: 2020,
                    runtime: 115,
                    rating: 7.1,
                    watched: false
                }
                const res = await request(server)
                    .post("/suggestions")
                    .set("Authorization", "Bearer " + token1)
                    .send(movie);
                expect(res.statusCode).toEqual(400);
            });

        });
        describe("GET /", () => {

            beforeEach(async () => {
                const movie0 = {
                    title: "Test Movie 0",
                    description: "No desc",
                    genre: "Drama",
                    year: 2020,
                    runtime: 115,
                    rating: 7.1,
                    watched: false
                }
                const movie1 = {
                    title: "Test Movie 1",
                    description: "No desc",
                    genre: "Drama",
                    year: 2020,
                    runtime: 115,
                    rating: 7.1,
                    watched: false
                }
                sentMovie0 = await request(server)
                    .post("/suggestions")
                    .set("Authorization", "Bearer " + token0)
                    .send(movie0);
                sentMovie1 = await request(server)
                    .post("/suggestions")
                    .set("Authorization", "Bearer " + token0)
                    .send(movie1);
            });
            afterEach(testUtils.clearDB);

            it("should return all movies for any user", async () => {
                const res = await request(server)
                    .get("/suggestions")
                    .set("Authorization", "Bearer " + token0)
                    .send();
                expect(res.statusCode).toEqual(200);
            });

            it("should reject a bad token", async () => {
                const res = await request(server)
                    .get("/suggestions")
                    .set("Authorization", "Bearer fake")
                    .send();
                expect(res.statusCode).toEqual(401);
            });
        });
        
        describe("GET /:id", () => {

            beforeEach(async () => {
                const userObj = {
                    email: 'sampleuser@email.com',
                    password: 'xyz789password',
                    roles: ['user']
                }
                sampleUser = await User.create(userObj);
                const entryObj = {
                    title: "Test Movie 1",
                    description: "No desc",
                    genre: "Drama",
                    year: 2020,
                    runtime: 115,
                    rating: 7.1,
                    watched: false,
                    userId: sampleUser._id
                }
                testSuggestion = await Suggestion.create(entryObj);
            });
            afterEach(testUtils.clearDB);

            it("should return 400 if id is invalid", async () => {
            const res = await request(server)
                .get("/suggestions/123")
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res.statusCode).toEqual(400);
            });

            it("should return 200 if suggestion is valid", async () => {
                const res = await request(server)
                    .get("/suggestions/" + testSuggestion._id)
                    .set("Authorization", "Bearer " + token0)
                    .send();
                expect(res.statusCode).toEqual(200);
                });

        });

        describe("PUT /:id", () => {

            beforeEach(async () => {
                const userObj1 = {
                    email: 'sampleuser1@email.com',
                    password: 'xyz789password'
                }
                const userObj2 = {
                    email: 'sampleuser2@email.com',
                    password: 'xyz789password'
                }

                await request(server).post("/auth/signup").send(userObj1);
                await request(server).post("/auth/signup").send(userObj2);
                const resUser1 = await request(server).post("/auth/login").send(userObj1);
                const resUser2 = await request(server).post("/auth/login").send(userObj2);
                tokenSampleUser1 = resUser1.body.token;
                tokenSampleUser2 = resUser2.body.token;
                let sampleUser1 = await User.findOne({email: 'sampleuser1@email.com'}).lean().exec();
                let sampleUser2 = await User.findOne({email: 'sampleuser2@email.com'}).lean().exec();


                const entryObj = {
                    title: "Test Movie 1",
                    description: "No desc",
                    genre: "Drama",
                    year: 2020,
                    runtime: 115,
                    rating: 7.1,
                    watched: false,
                    userId: sampleUser1._id
                }
                testSuggestion = await Suggestion.create(entryObj);

                
            });
            afterEach(testUtils.clearDB);

            it("should reject an update from a different user", async () => {
                const res = await request(server)
                    .put("/suggestions/" + testSuggestion._id)
                    .set("Authorization", "Bearer " + tokenSampleUser2)
                    .send({
                        title: "Test Movie 1 updated",
                    });
                expect(res.statusCode).toEqual(403);
            });

            it("should reject an empty update object", async () => {
                const res = await request(server)
                    .put("/suggestions/" + testSuggestion._id)
                    .set("Authorization", "Bearer " + tokenSampleUser1)
                    .send({});
                expect(res.statusCode).toEqual(400);
            });

            it("should accept an update from the user that created the suggestion", async () => {
                const res = await request(server)
                    .put("/suggestions/" + testSuggestion._id)
                    .set("Authorization", "Bearer " + tokenSampleUser1)
                    .send({
                        title: "Test Movie 1 updated",
                    });
                expect(res.statusCode).toEqual(200);
            });
            
        });

        describe("DELETE /:id", () => {

            beforeEach(async () => {
                const userObj = {
                    email: 'sampleuser@email.com',
                    password: 'xyz789password',
                    roles: ['user']
                }
                sampleUser = await User.create(userObj);
                const entryObj = {
                    title: "Test Movie 1",
                    description: "No desc",
                    genre: "Drama",
                    year: 2020,
                    runtime: 115,
                    rating: 7.1,
                    watched: false,
                    userId: sampleUser._id
                }
                testSuggestion = await Suggestion.create(entryObj);
            });
            afterEach(testUtils.clearDB);

            it("should reject a bad id", async () => {
                const res = await request(server)
                    .delete("/suggestions/fake")
                    .set("Authorization", "Bearer " + token1)
                    .send();
                expect(res.statusCode).toEqual(400);
            });

            it("should send 403 for a non admin", async () => {
                const res = await request(server)
                    .delete("/suggestions/fake")
                    .set("Authorization", "Bearer " + token0)
                    .send();
                expect(res.statusCode).toEqual(403);
            });

            it("should delete an entry for an admin", async () => {
                const res = await request(server)
                    .delete("/suggestions/" + testSuggestion._id)
                    .set("Authorization", "Bearer " + token1)
                    .send();
                expect(res.statusCode).toEqual(200);
            });
            
        });

        describe("POST /accept/:id", () => { 

            beforeEach(async () => {
                const userObj = {
                    email: 'sampleuser@email.com',
                    password: 'xyz789password',
                    roles: ['user']
                }
                sampleUser = await User.create(userObj);
                const entryObj = {
                    title: "Test Movie 1",
                    description: "No desc",
                    genre: "Drama",
                    year: 2020,
                    runtime: 115,
                    rating: 7.1,
                    watched: false,
                    userId: sampleUser._id
                }
                testSuggestion = await Suggestion.create(entryObj);
            });
            afterEach(testUtils.clearDB);

            it("should send 403 for a basic user", async () => {

                const res = await request(server)
                    .post("/suggestions/accept/123abc")
                    .set("Authorization", "Bearer " + token0)
                    .send();
                expect(res.statusCode).toEqual(403);
            });

            it("should reject a bad id", async () => {
                const res = await request(server)
                    .delete("/suggestions/fake")
                    .set("Authorization", "Bearer " + token1)
                    .send();
                expect(res.statusCode).toEqual(400);
            });

            it("should allow a suggestion accept by admin", async () => {
                const res = await request(server)
                    .delete("/suggestions/" + testSuggestion._id)
                    .set("Authorization", "Bearer " + token1)
                    .send();
                expect(res.statusCode).toEqual(200);
            });

        });
          
    });
});