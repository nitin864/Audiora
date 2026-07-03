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

        const { title, musics } = req.body;
        const album = await albumModel.create({
            title,
            musics: musics,
            artist: req.user.id
        })

        res.status(201).json({
            message: "new album created",
            album: album
        })

    } catch (error) {
        console.log(error)
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


module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums }