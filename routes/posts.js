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

const {createPost, getPostInformation} = require("../db/queries/post")

router.post("/", async (req, res) => {
    if (req.body.token) {
        const errors = await createPost(req.body)
        if (!errors) {
            res.status(201).json({})
        } else {
            const message = Object.keys(errors).map(key => errors[key].message).join(" ")
            res.status(400).json({message})
        }
    } else {
        res.status(403).json({message: "Missing user token."})
    }
})

router.get("/", async (req, res) => {
    if (req.body.post_id) {
        const post = await getPostInformation(req.body.post_id)
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(400).json({message: "Invalid post ID."})
        }
    } else {
        res.status(403).json({message: "Missing post ID."})
    }
})
