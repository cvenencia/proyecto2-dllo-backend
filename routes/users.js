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

const {registerUser, loginWithToken, loginWithCredentials, getUserInformation} = require("../db/queries/user")

router.get("/", async (req, res) => {
    if (req.query.user_id) {
        const data = await getUserInformation(req.query.user_id)
        if (data) {
            res.status(200).json(data)
        } else {
            res.status(400).json({message: "Invalid parameters."})
        }
    } else {
        res.status(403).json({message: "Missing parameters."})
    }
})

router.post("/", async (req, res) => {
    const response = await registerUser(req.body)
    if (typeof(response) != "number"){
        res.status(201).json(response)
    } else if (response == 0){
        res.status(400).json({
            message: "Invalid form."
        })
    } else {
        res.status(409).json({
            message: "User already exists."
        })
    }
})

router.post("/login", async (req, res) => {
    if (req.body.token) {
        if (await loginWithToken(req.body.token)){
            res.status(200).json({})
        } else {
            res.status(401).json({message: "Invalid token."})
        }
    } else if (req.body.username && req.body.password) {
        const response = await loginWithCredentials({username: req.body.username, password: req.body.password})
        if (response) {
            const token = response
            res.status(200).json({token})
        } else {
            res.status(401).json({message: "Invalid credentials."})
        }
    } else {
        res.status(403).json({message: "Missing parameters."})
    }
})
