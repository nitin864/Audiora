const express = require('express')
const musicControllers = require('../controllers/music.contollers')
const multer = require('multer')



const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })  

router.get('/', musicControllers.getAllMusics)

router.post('/upload', upload.single('music'), musicControllers.createMusic)
router.post('/album', musicControllers.createAlbum)

module.exports = router 