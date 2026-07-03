const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({
    uri: {
        type: String,   
        required: true
    },

    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
     
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    }   
})

const musicModel = mongoose.model('music' , musicSchema);

module.exports = musicModel;