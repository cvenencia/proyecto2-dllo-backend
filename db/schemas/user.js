const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username required."],
    },
    password: {
        type: String,
        required: [true, "Password required"]
    },
    email: {
        type: String,
        required: [true, "Email required."],
        validate: {
            validator: email => {
                const ex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                var regex = new RegExp(ex)
                return regex.test(email)
            },
            message: "Invalid Email."
        }
    },
    birthdate: {
        type: Date,
        required: [true, "Birthdate required."]
    },
    bio: {
        type: String,
        required: [true, "Bio required."]
    },
    token: {
        type: String
    }
})

module.exports = userSchema
