const mongoose = require('mongoose')

mongoose.connect(
    "mongodb://localhost:27017/picshar"
    )
.then(() => {
    console.log("Connected with mongo")
})
.catch((e) => {
    console.log(e)
    console.log("Error connecting with mongo")
})

module.exports = mongoose
