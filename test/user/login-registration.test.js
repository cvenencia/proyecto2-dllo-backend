const app = require("../index-test")
const {connectTest, cleanDB} = require("../../db/mongo")
const request = require("supertest")

describe("User login and registration", () => {
    let mongo, server

    beforeAll(async () => {
        mongo = await connectTest("login-registration")
        await cleanDB(mongo)
        server = app.listen(5001)
    })

    afterAll(async () => {
        await mongo.connection.close()
        await server.close()
    })

    test("Succesful registration", async () => {
        const user = {
            username: "username1234",
            password: "password1234",
            birthdate: "1950-04-30",
            email: "test@test.com",
            bio: "xd"
        }
        const {status} = await request(app).post('/users').send(user)

        expect(status).toBe(201)
    })

    test("Incomplete registration", async () => {
        let user = {
            username: "username1",
            password: "password1234",
            birthdate: "2020-04-30",
            email: "test@test.com",
            // Missing bio
        }
        var {status} = await request(app).post('/users').send(user)

        expect(status).toBe(400)

        user = {
            username: "username2",
            password: "password1234",
            birthdate: "2020-04-30",
            // Missing email
            bio: "xd"
        }
        var {status} = await request(app).post('/users').send(user)

        expect(status).toBe(400)

        user = {
            username: "username3",
            password: "password1234",
            // Missing birthdate
            email: "test@test.com",
            bio: "xd"
        }
        var {status} = await request(app).post('/users').send(user)

        expect(status).toBe(400)

        user = {
            username: "username4",
            // Missing password
            birthdate: "1950-04-30",
            email: "test@test.com",
            bio: "xd"
        }
        var {status} = await request(app).post('/users').send(user)

        expect(status).toBe(400)

        user = {
            // Missing username
            password: "password5",
            birthdate: "1950-04-30",
            email: "test@test.com",
            bio: "xd"
        }
        var {status} = await request(app).post('/users').send(user)

        expect(status).toBe(400)
    })

    describe("Login tests", () => {

        // Register user
        beforeAll(async () => {
            const user = {
                username: "logintest",
                password: "password1234",
                birthdate: "1950-04-30",
                email: "test@test.com",
                bio: "xd"
            }
            await request(app).post('/users').send(user)
        })

        test("Valid login", async () => {
            const login = {
                username: "logintest",
                password: "password1234"
            }
            const {status: loginStatus, _body: body} = await request(app).post('/users/login').send(login)
    
            expect(loginStatus).toBe(200)
            expect(body.token).toBeTruthy()
        })

        test("Invalid login (nonexistent username)", async () => {
            const login = {
                username: "idontexist",
                password: "password1234"
            }
            const {status: loginStatus, _body: body} = await request(app).post('/users/login').send(login)
    
            expect(loginStatus).toBe(401)
            expect(body.token).not.toBeTruthy()
        })

        test("Invalid login (invalid password)", async () => {
            const login = {
                username: "logintest",
                password: "invalidpassword"
            }
            const {status: loginStatus, _body: body} = await request(app).post('/users/login').send(login)
    
            expect(loginStatus).toBe(401)
            expect(body.token).not.toBeTruthy()
        })
    })
})
