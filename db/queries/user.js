const mongoose = require("../mongo")
const userSchema = require("../schemas/user")
const UserModel = mongoose.model("User", userSchema)
const jwt = require("jsonwebtoken")

async function registerUser(data) {
    const exists = await userExists(data.username)
    if (!exists) {
        const newUser = new UserModel(data)
        const {errors} = await newUser.save().catch(err => err)
        const valid = errors ? false : true
        if (valid) {
            const token = jwt.sign(
                {
                    user_id: newUser._id,
                    username: newUser.username,
                    password: newUser.password,
                    email: newUser.email,
                    birthdate: newUser.birthdate,
                    bio: newUser.bio
                },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
            )
            newUser.token = token
            await newUser.save().catch(err => err)
            return {token}
        } else {
            return 0 // Invalid data for creating user
        }
    } else {
        return -1 // User already exists
    }
}

async function loginWithToken(token) {
    const user = await UserModel.findOne({token}).exec()
    if (user) {
        return true
    } else {
        return false
    }
}

async function loginWithCredentials(data) {
    const user = await UserModel.findOne(data).exec()
    if (user) {
        const token = jwt.sign(
            {
                user_id: user._id,
                username: user.username,
                password: user.password,
                email: user.email,
                birthdate: user.birthdate,
                bio: user.bio
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
        )
        user.token = token
        await user.save().catch(err => err)
        return token
    } else {
        return false
    }
}

async function userExists(username) {
    const user = await UserModel.findOne({username: username}).exec()
    return user == null ? false : true
}

module.exports = {registerUser, loginWithToken, loginWithCredentials}
