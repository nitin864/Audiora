const express = require('express')
const musicControllers = require('../controllers/music.contollers')
const multer = require('multer')
const middleware = require('../middlewares/auth.middleware')


const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })  

router.get('/', middleware.authUser, musicControllers.getAllMusics)

router.post('/upload', middleware.authTokenArtistCheck, upload.single('music'), musicControllers.createMusic)
router.post('/album', middleware.authTokenArtistCheck ,musicControllers.createAlbum)

module.exports = router 