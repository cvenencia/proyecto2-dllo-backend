const mongoose = require("mongoose")
const userSchema = require("../schemas/user")
const UserModel = mongoose.model("User", userSchema)
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const pepper = process.env.PEPPER

async function registerUser(data) {
    const exists = await userExists(data.username)
    const {password, ...newData} = data
    if (password) {
        if (!exists) {
            newData.salt = await bcrypt.genSalt(10)
            newData.hashed_password = await bcrypt.hash(password + newData.salt + pepper, 10)
            const newUser = new UserModel(newData)
            const {errors} = await newUser.save().catch(err => err)
            const valid = errors ? false : true
            if (valid) {
                const token = jwt.sign(
                    {
                        user_id: newUser._id,
                        username: newUser.username,
                        hashed_password: newUser.hashed_password,
                        email: newUser.email,
                        birthdate: newUser.birthdate,
                        bio: newUser.bio,
                        salt: newUser.salt
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
    } else {
        return 0 // Invalid data for creating user
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

async function getUserWithToken(token){
    return await UserModel.findOne({token}).exec()
}

async function getUserById(user_id) {
    try {
        return await UserModel.findById(user_id).exec()
    } catch (err) {
        return null
    }
}

async function loginWithCredentials(data) {
    const {password, username} = data
    const user = await UserModel.findOne({username}).exec()
    if (user) {
        const valid = await bcrypt.compare(password + user.salt + pepper, user.hashed_password)
        if (valid) {
            const token = jwt.sign(
                {
                    user_id: user._id,
                    username: user.username,
                    hashed_password: user.hashed_password,
                    email: user.email,
                    birthdate: user.birthdate,
                    bio: user.bio,
                    salt: user.salt
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
}

async function userExists(username) {
    const user = await UserModel.findOne({username: username}).exec()
    return user == null ? false : true
}

async function getUserInformation(user_id) {
    const {getUserPostsCount} = require("./post")
    const {getUserLikeCount} = require("./post_like")
    const {getFollowedCount, getFollowersCount} = require("./user_follower")

    const user = await getUserById(user_id)
    if (user) {
        const liked_count = await getUserLikeCount(user._id)
        const posts_count = await getUserPostsCount(user._id)
        const followers_count = await getFollowersCount(user._id)
        const followed_count = await getFollowedCount(user._id)
        return {
            username: user.username,
            email: user.email,
            bio: user.bio,
            liked_count,
            posts_count,
            followers_count,
            followed_count
        }
    } else {
        return null
    }
}

module.exports = {registerUser, loginWithToken, loginWithCredentials, getUserWithToken, getUserById, getUserInformation}
