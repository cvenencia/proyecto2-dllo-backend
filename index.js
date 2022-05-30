const express= require('express')
const {connect} = require("./db/mongo")

const app = express()
app.use(express.json())
require('dotenv').config()

const users = require("./routes/users")
app.use("/users", users)

const posts = require("./routes/posts")
app.use("/posts", posts)

connect()
app.listen(5000)
