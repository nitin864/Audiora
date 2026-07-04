const express = require('express')
const musicControllers = require('../controllers/music.contollers')
const multer = require('multer')
const middleware = require('../middlewares/auth.middleware')


const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', middleware.authUser, musicControllers.getAllMusics)
router.get('/album', middleware.authUser, musicControllers.getAllAlbums)
router.get('/:id', middleware.authUser, musicControllers.getMusicbyId)
router.get('/album/:id', middleware.authUser, musicControllers.getAlbumbyId)



router.post('/upload', middleware.authTokenArtistCheck, upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]), musicControllers.createMusic)

router.post('/album', middleware.authTokenArtistCheck,upload.single('thumbnail'), musicControllers.createAlbum)

module.exports = router 