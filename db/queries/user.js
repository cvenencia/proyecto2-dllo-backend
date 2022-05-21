const mongoose = require("../mongo")
const userSchema = require("../schemas/user")
const UserModel = mongoose.model("User", userSchema)

async function registerUser(data) {
    
}

module.exports = {registerUser}
