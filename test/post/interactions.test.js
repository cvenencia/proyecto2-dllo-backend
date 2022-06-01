const app = require("../index-test")
const {connectTest, cleanDB} = require("../../db/mongo")
const request = require("supertest")
const jwt = require("jsonwebtoken")

const {random} = require("../util")

describe("Post interactions", () => {
    let mongo, server
    let token, user_id
    let posts, postCount

    beforeAll(async () => {
        mongo = await connectTest("post-interactions")
        await cleanDB(mongo)
        server = app.listen(5005)

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
        
        // Create random amount of posts
        postCount = random(1, 20)
        for (let i = 0; i < postCount; i++) {
            await request(app).post("/posts").send({
                token,
                img_url: "https://test.com",
                bio: "test"
            })
        }

        const {body} = await request(app).get("/posts?user_id=" + user_id).send({
            token
        })
        posts = body
    })

    afterAll(async () => {
        await mongo.connection.close()
        await server.close()
    })

    test("Likes", async () => {
        const expectedLikedPosts = []
        
        // Like random amount of posts
        const likeCount = random(1, 20)
        for (let i = 0; i < likeCount; i++) {
            const index = random(0, postCount - 1)
            const {status} = await request(app).post("/posts/like").send({
                token,
                post_id: posts[index]._id
            })
            expectedLikedPosts.push(posts[index]._id)
            expect(status).toBe(201)
        }

        let {body: likedPosts} = await request(app).get("/posts/liked-by?user_id=" + user_id).send({token})
        likedPosts = likedPosts.map(p => p._id)
        expect(expectedLikedPosts).toBe(likedPosts)
    })

    test("Saves", async () => {
        const expectedSavedPosts = []
        
        // Save random amount of posts
        const saveCount = random(1, 20)
        for (let i = 0; i < saveCount; i++) {
            const index = random(0, postCount - 1)
            const {status} = await request(app).post("/posts/save").send({
                token,
                post_id: posts[index]._id
            })
            expectedSavedPosts.push(posts[index]._id)
            expect(status).toBe(201)
        }

        let {body: savedPosts} = await request(app).get("/posts/saved-by?user_id=" + user_id).send({token})
        savedPosts = savedPosts.map(p => p._id)
        expect(expectedSavedPosts).toBe(savedPosts)
    })

    test("Comments", async () => {
        const expectedComments = []
        
        // Comment random amount of posts
        const commentCount = random(1, 20)
        for (let i = 0; i < commentCount; i++) {
            const index = random(0, postCount - 1)
            const comment = "xd " + i
            const {status} = await request(app).post("/posts/comment").send({
                token,
                post_id: posts[index]._id,
                comment: comment
            })
            expectedComments.push(comment)
            expect(status).toBe(201)
        }

        let {body: comments} = await request(app).get("/posts/saved-by?user_id=" + user_id).send({token})
        comments = comments.map(p => p.comment)
        expect(expectedComments).toBe(comments)
    })
})
