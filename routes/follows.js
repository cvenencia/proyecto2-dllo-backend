const express = require('express')
const router = express.Router()
router.use(express.json())
module.exports = router

router.use(( req, res, next ) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
    }
    next();
})

const {getFollowing, getFollowers} = require("../db/queries/user_follower")

router.get("/following", async (req, res) => {
    if (req.query.user_id && req.body.token) {
        const followedUsers = await getFollowing(req.body.token, req.query.user_id)
        if (followedUsers) {
            res.status(200).json(followedUsers)
        } else {
            res.status(400).json({message: "Invalid parameters."})
        }
    } else {
        res.status(403).json({message: "Missing parameters."})
    }
})

router.get("/followers", async (req, res) => {
    if (req.query.user_id && req.body.token) {
        const followerUsers = await getFollowers(req.body.token, req.query.user_id)
        if (followerUsers) {
            res.status(200).json(followerUsers)
        } else {
            res.status(400).json({message: "Invalid parameters."})
        }
    } else {
        res.status(403).json({message: "Missing parameters."})
    }
})
