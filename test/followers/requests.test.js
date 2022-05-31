const app = require("../index-test")
const {connectTest, cleanDB} = require("../../db/mongo")
const request = require("supertest")
const jwt = require("jsonwebtoken")

describe("Follow requests", () => {
    let mongo, server
    let token, user_id, followId1, followId2

    beforeAll(async () => {
        mongo = await connectTest("requests")
        await cleanDB(mongo)
        server = app.listen(5004)

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
        const {user_id: u} = jwt.verify(token, process.env.TOKEN_KEY)
        user_id = u

        // Register users to request follow
        const follow1 = {
            username: "follow1",
            password: "password1234",
            birthdate: "1950-04-30",
            email: "test@test.com",
            bio: "xd"
        }
        const {body: {token: t1}} = await request(app).post('/users').send(follow1)
        const {user_id: u1} = jwt.verify(t1, process.env.TOKEN_KEY)
        followId1 = u1

        const follow2 = {
            username: "follow2",
            password: "password1234",
            birthdate: "1950-04-30",
            email: "test@test.com",
            bio: "xd"
        }
        const {body: {token: t2}} = await request(app).post('/users').send(follow2)
        const {user_id: u2} = jwt.verify(t2, process.env.TOKEN_KEY)
        followId2 = u2
    })

    afterAll(async () => {
        await mongo.connection.close()
        await server.close()
    })

    test("Tests", async () => {
        // Send request to different users
        const {status: s1} = await request(app).post("/follows/request").send({
            user_id: followId1,
            token
        })
        expect(s1).toBe(201)

        const {status: s2} = await request(app).post("/follows/request").send({
            user_id: followId2,
            token
        })
        expect(s2).toBe(201)

        // Get all request from the current user 
        const {body: requests, status: s3} = await request(app).get("/follows/request").send({
            user_id,
            token
        })
        expect(s3).toBe(200)
        expect(requests).toBeTruthy()

        // Accept the first request
        const {status: s4} = await request(app).post("/follows/response").send({
            action: "accept",
            token,
            request_id: requests[0]._id
        })
        expect(s4).toBe(201)

        // Try to reject the already accepted first request
        const {status: s5} = await request(app).post("/follows/response").send({
            action: "reject",
            token,
            request_id: requests[0]._id
        })
        expect(s5).toBe(400)

        // Reject the second request
        const {status: s6} = await request(app).post("/follows/response").send({
            action: "reject",
            token,
            request_id: requests[1]._id
        })
        expect(s6).toBe(201)

        // Try to accept the already rejected second request
        const {status: s7} = await request(app).post("/follows/response").send({
            action: "accept",
            token,
            request_id: requests[1]._id
        })
        expect(s7).toBe(400)
    })
})
