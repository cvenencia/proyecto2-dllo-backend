const express= require('express')
const app = express()
app.use(express.json())

const users = require("./routes/user")
app.use("/users", users)

app.listen(5000)
