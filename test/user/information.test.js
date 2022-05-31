const app = require("../index-test")
const {connectTest, cleanDB} = require("../../db/mongo")
const request = require("supertest")
const jwt = require("jsonwebtoken")

const {followUser} = require("../../db/queries/user_follower")
const {getUserById} = require("../../db/queries/user")

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

describe("User information", () => {
    let mongo, server
    let token, postCount, likeCount, followersCount, followedCount
    let response

    beforeAll(async () => {
        mongo = await connectTest()
        await cleanDB(mongo)
        server = app.listen(5002)

        // Register user
        const user = {
            username: "username1234",
            password: "password1234",
            birthdate: "1950-04-30",
            email: "test@test.com",
            bio: "xd"
        }
        const {body: {token: t}} = await request(app).post('/users').send(user)
        token = t

        // Create random amount of posts
        postCount = random(1, 20)
        for (let i = 0; i < postCount; i++) {
            await request(app).post("/posts").send({
                token,
                img_url: "https://test.com",
                bio: "test"
            })
        }

        // Like random amount of posts
        const {user_id} = jwt.verify(token, process.env.TOKEN_KEY)
        const {body: posts} = await request(app).get("/posts?user_id=" + user_id).send({
            token
        })
        likeCount = random(1, 20)
        for (let i = 0; i < likeCount; i++) {
            await request(app).post("/posts/like").send({
                token,
                post_id: posts[random(0, postCount - 1)]._id
            })
        }

        // Follow random amount of users
        followedCount = random(1, 20)
        for (let i = 0; i < followedCount; i++) {
            const user = {
                username: "username" + i,
                password: "password1234",
                birthdate: "1950-04-30",
                email: "test@test.com",
                bio: "xd"
            }
            const {body: {token: t}} = await request(app).post('/users').send(user)
            const {user_id: u} = jwt.verify(t, process.env.TOKEN_KEY)

            const follower = await getUserById(user_id)
            const followed = await getUserById(u)
            await followUser(follower, followed)
        }

        // Be followed by random amount of users
        followersCount = random(1, 20)
        for (let i = 0; i < followersCount; i++) {
            const user = {
                username: "username" + (i + followedCount),
                password: "password1234",
                birthdate: "1950-04-30",
                email: "test@test.com",
                bio: "xd"
            }
            const {body: {token: t}} = await request(app).post('/users').send(user)
            const {user_id: u} = jwt.verify(t, process.env.TOKEN_KEY)

            const followed = await getUserById(user_id)
            const follower = await getUserById(u)
            await followUser(follower, followed)
        }

       const {body: r} = await request(app).get("/users?user_id=" + user_id)
       response = r
    })

    afterAll(async () => {
        await mongo.connection.close()
        await server.close()
    })

    test("Password and birthdate not included in response", async () => {
        expect(response.password).not.toBeTruthy()
        expect(response.hashed_password).not.toBeTruthy()
        expect(response.birthdate).not.toBeTruthy()
    })

    test("Correct post count", async () => {
        expect(response.posts_count).toBe(postCount)
    })

    test("Correct like posts count", async () => {
        expect(response.liked_count).toBe(likeCount)
    })

    test("Correct followed count", async () => {
        expect(response.followed_count).toBe(followedCount)
    })

    test("Correct followers count", async () => {
        expect(response.followers_count).toBe(followersCount)
    })

})