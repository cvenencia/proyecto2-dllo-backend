const mongoose = require('mongoose')

const {Schema} = mongoose

const followRequestSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, "User required."]
    },
    requested_user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, "Requested user required."]
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = followRequestSchema
