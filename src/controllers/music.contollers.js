const musicModel = require('../models/music.model')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const {filesUpload} = require('../services/storage.service')
const albumModel = require('../models/album.model')

async function createMusic(req, res) {
    try {

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "unauthorized"
            })
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You don't have access to create an music"
            })
        }

        const { title, genre } = req.body;
        const file = req.file;

        const result = await filesUpload(file.buffer.toString('base64'));
       
        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id,
            genre,
            releaseDate: Date.now()
        })

        res.status(201).json({
            message: "new music uploaded successfully",
            music: music
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function createAlbum(req,res) {
    try {
       
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
                message: "unauthorized"
            })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if(decoded.role !== 'artist'){
        return res.status(403).json({
                message: "You don't have access to create an music"
            })
    }

    const {title, musics} = req.body;

    const album = await albumModel.create({
        title,
        musics: musics,
        artist: decoded.id
    })

    res.status(201).json({
        message: "new album created",
        album: album
    })

    } catch (error) {
        console.log(error)
    }
    
}


module.exports = { createMusic ,createAlbum }