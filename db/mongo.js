const mongoose = require('mongoose')

async function connect(){ 
    await mongoose.connect(
        "mongodb://localhost:27017/picshar"
        )
    .then(() => {
        console.log("Connected with mongo")
    })
    .catch((e) => {
        console.log(e)
        console.log("Error connecting with mongo")
    })
}

async function connectTest(){ 
    await mongoose.connect(
        "mongodb://localhost:27017/picshar-test"
        )
    .then(() => {
        console.log("Connected with mongo")
    })
    .catch((e) => {
        console.log(e)
        console.log("Error connecting with mongo")
    })
    return mongoose
}

async function cleanDB(mongo){
    const userSchema = require("../db/schemas/user")
    await mongo.model('User', userSchema).deleteMany({})
}

module.exports = {connect, connectTest, cleanDB}
