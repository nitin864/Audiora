const express = require('express')
const musicControllers = require('../controllers/music.contollers')

const router = express.Router()

router.post('/create', musicControllers.createMusic)

module.exports = router