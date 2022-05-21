const mongoose = require('mongoose')

const {Schema} = mongoose

const postSaveSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, "User required."]
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post",
        required: [true, "Post required."]
    }
})

module.exports = postSaveSchema
