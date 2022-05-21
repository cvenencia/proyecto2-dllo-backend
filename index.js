const express= require('express')
const app = express()
app.use(express.json())
require('dotenv').config()

const users = require("./routes/users")
app.use("/users", users)

app.listen(5000)
