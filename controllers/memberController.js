const router = require("express").Router()
const { Member } = require('../models')

router.get('/test', (req, res) => {
    res.send("Testing This route!")
})


router.post('/register', async (req, res) => {
    
})
module.exports = router