const express = require('express')
const musicControllers = require('../controllers/music.contollers')

const router = express.Router()

router.post('/upload', musicControllers.createMusic)

module.exports = router