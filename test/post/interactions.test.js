const app = require("../index-test")
const {connectTest, cleanDB} = require("../../db/mongo")
const request = require("supertest")
const jwt = require("jsonwebtoken")

const {random} = require("../util")

describe("Post interactions", () => {
    let mongo, server
    let token, user_id
    let post, postCount

    beforeAll(async () => {
        mongo = await connectTest("post-interactions")
        await cleanDB(mongo)
        server = app.listen(5005)

        // Register user
        const user = {
            username: "username12345",
            password: "password1234",
            birthdate: "1950-04-30",
            email: "test@test.com",
            bio: "xd"
        }
        const {body: {token: t}} = await request(app).post('/users').send(user)
        token = t
        const {user_id: u} = jwt.verify(token, process.env.TOKEN_KEY)
        user_id = u
        
        // Create a post
        await request(app).post("/posts").send({
            token,
            img_url: "https://test.com",
            bio: "test"
        })

        const {body} = await request(app).get("/posts?user_id=" + user_id).send({
            token
        })
        post = body[0]
    })

    afterAll(async () => {
        await mongo.connection.close()
        await server.close()
    })

    test("Likes", async () => {
        const expectedLikedPosts = []
        
        // Like post
        const {status: s1} = await request(app).post("/posts/like").send({
            token,
            post_id: post._id
        })
        expectedLikedPosts.push(post._id)
        expect(s1).toBe(201)

        // Correct like count on post information
        const {status: s2, body} = await request(app).get("/posts").send({
            post_id: post._id
        })
        expect(s2).toBe(200)
        expect(body.likes).toBe(1)

        // Correct posts liked by user
        let {status: s3, body: likedPosts} = await request(app).get("/posts/liked-by?user_id=" + user_id).send({token})
        likedPosts = likedPosts.map(p => p._id)
        expect(expectedLikedPosts.toString()).toBe(likedPosts.toString())
    })

    test("Saves", async () => {
        const expectedSavedPosts = []
        
        // Save post
        const {status} = await request(app).post("/posts/save").send({
            token,
            post_id: post._id
        })
        expectedSavedPosts.push(post._id)
        expect(status).toBe(201)

        let {body: savedPosts} = await request(app).get("/posts/saved-by?user_id=" + user_id).send({token})
        savedPosts = savedPosts.map(p => p._id)
        expect(expectedSavedPosts.toString()).toBe(savedPosts.toString())
    })

    test("Comments", async () => {
        const expectedComments = []
        
        // Comment post
        const commentCount = random(1, 20)
        for (let i = 0; i < commentCount; i++) {
            const comment = "xd " + i
            const {status} = await request(app).post("/posts/comment").send({
                token,
                post_id: post._id,
                comment: comment
            })
            expectedComments.push(comment)
            expect(status).toBe(201)
        }

        let {body: receivedPost} = await request(app).get("/posts").send({post_id: post._id})
        receivedPost = receivedPost.comments.map(c => c.comment)
        expect(expectedComments.toString()).toBe(receivedPost.toString())
    })
})
