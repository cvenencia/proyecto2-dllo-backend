const app = require("./index-test")
const {connectTest, cleanDB} = require("../db/mongo")
const request = require("supertest")

describe("User login and registration", () => {
    let mongo, server

    beforeAll(async () => {
        mongo = await connectTest()
        await cleanDB(mongo)
        server = app.listen(5000)
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
        const user = {
            username: "username4321",
            password: "password1234",
            birthdate: "2020-04-30",
            email: "test@test.com",
            // Missing bio
        }
        const {status} = await request(app).post('/users').send(user)

        expect(status).toBe(400)
    })

    describe("Login tests", () => {

        // Register user
        beforeEach(async () => {
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