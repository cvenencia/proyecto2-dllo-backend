const app = require("../index-test")
const {connectTest, cleanDB} = require("../../db/mongo")
const request = require("supertest")
const jwt = require("jsonwebtoken")

const {followUser} = require("../../db/queries/user_follower")
const {getUserById} = require("../../db/queries/user")
const {random} = require("../util")

describe("List of followers and followed", () => {
    let mongo, server
    let followersIds = [], followedIds = []
    let token, responseFollowers, responseFollowed

    beforeAll(async () => {
        mongo = await connectTest("follow-lists")
        await cleanDB(mongo)
        server = app.listen(5003)

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
        const {user_id} = jwt.verify(token, process.env.TOKEN_KEY)

        // Follow random amount of users
        const followedCount = random(1, 20)
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
            followedIds.push(followed._id)
        }

        // Be followed by random amount of users
        const followersCount = random(1, 20)
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
            followersIds.push(follower._id)
        }

        const {body: b1} = await request(app).get("/follows/following?user_id=" + user_id).send({
            token
        })
        responseFollowed = b1.toString()

        const {body: b2} = await request(app).get("/follows/followers?user_id=" + user_id).send({
            token
        })
        responseFollowers = b2.toString()

        followersIds = followersIds.toString()
        followedIds = followedIds.toString()
    })

    afterAll(async () => {
        await mongo.connection.close()
        await server.close()
    })

    test("Correct followers list", async () => {
        expect(responseFollowers).toBe(followersIds)
    })

    test("Correct followed list", async () => {
        expect(responseFollowed).toBe(followedIds)
    })
})