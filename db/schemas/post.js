const mongoose = require('mongoose')

const {Schema} = mongoose

const postSchema = new Schema({
    bio: {
        type: String,
        required: [true, "Bio required."]
    },
    img_url: {
        type: String,
        validate: {
            validator: url => {
                const ex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/gi
                var regex = new RegExp(ex)
                return regex.test(url) || url == ""
            },
            message: "Invalid URL."
        }
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, "Author required."]
    }
})

module.exports = postSchema
