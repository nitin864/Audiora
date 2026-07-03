const mongoose = require('mongoose')

const albumModel = new mongoose.model({
    title : {
        type: String,
        required: true
    },

    musics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'musics',
        required: true
    }],

    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required : true
    }
})

const album = await mongoose.model('album', albumModel);

module.exports = album