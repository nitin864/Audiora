const musicModel = require('../models/music.model')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { filesUpload } = require('../services/storage.service')
const albumModel = require('../models/album.model')



async function createMusic(req, res) {
    try {
        const { title, genre } = req.body;
        const musicFile = req.files?.music?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        if (!musicFile) {
            return res.status(400).json({ message: "music file is required" });
        }

        const musicResult = await filesUpload(musicFile.buffer.toString('base64'), {
            fileName: 'music_' + Date.now(),
            folder: 'audiora/music',
        });

        let thumbnailUrl;
        if (thumbnailFile) {
            const thumbResult = await filesUpload(thumbnailFile.buffer.toString('base64'), {
                fileName: 'thumb_' + Date.now(),
                folder: 'audiora/thumbnails',
            });
            thumbnailUrl = thumbResult.url;
        }

        const music = await musicModel.create({
            uri: musicResult.url,
            title,
            artist: req.user.id,
            genre,
            thumbnail: thumbnailUrl,
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

async function createAlbum(req, res) {
    try {
        const { title } = req.body;
        let { musics } = req.body;

        if (!musics) {
            musics = [];
        } else if (!Array.isArray(musics)) {
            musics = [musics];  
        }

        const thumbnailFile = req.file;
        let thumbnailUrl;
        if (thumbnailFile) {
            const thumbResult = await filesUpload(thumbnailFile.buffer.toString('base64'), {
                fileName: 'album_thumb_' + Date.now(),
                folder: 'audiora/thumbnails',
            });
            thumbnailUrl = thumbResult.url;
        }

        const album = await albumModel.create({
            title,
            musics,
            artist: req.user.id,
            thumbnail: thumbnailUrl,
        })

        res.status(201).json({
            message: "new album created",
            album: album
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllMusics(req, res) {
    try {



        const music = await musicModel.find()
            .populate("artist", "username")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: music.length,
            musics: music,
        });
    } catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: "Failed to fetch musics",
        });
    }
}

async function getAllAlbums(req, res) {
    try {
        const albums = await albumModel.find()
            .populate("artist", "username")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: albums.length,
            albums: albums,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch albums",
        });
    }
}

async function getMusicbyId(req,res){
          
     try {

        const {id} = req.params;
       
        const music = await musicModel
         .findById(id)
         .populate("artist", "username email")

        if(!music){
            return res.status(404).json({
                message: "music not found"
            })
        }

        res.status(200).json({
            message: "music fetched!",
            music: music
        })

        
     } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "internal server error"
        })
     }
}

async function getAlbumbyId(req,res){
          
     try {

        const {id} = req.params;
       
        const album = await albumModel
         .findById(id)
         .populate("artist", "username email")

        if(!album){
            return res.status(404).json({
                message: "album not found"
            })
        }

        res.status(200).json({
            message: "album fetched!",
            album: album
        })

        
     } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "internal server error"
        })
     }
} 

async function getSongByArtist(req,res){

    try {
        
       const {id} = req.params;

       const music = await musicModel
          .find({artist: id})
          .populate("artist",  "username email")

       if(!music){
        return res.status(404).json({
            message: `no music found from artist id : ${id}`
        })
       }

        res.status(200).json({
            message: `${music.length} music found from that artist id!`,
            music: music
        })


    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "internal server error"
        })
    }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getMusicbyId, getAlbumbyId, getSongByArtist}