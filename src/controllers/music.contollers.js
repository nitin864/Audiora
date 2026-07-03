const musicModel = require('../models/music.model')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const musicFilesUpload = require('../services/storage.service')

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

        const { title, genre, releaseDate } = req.body;
        const file = req.file;

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createMusic }