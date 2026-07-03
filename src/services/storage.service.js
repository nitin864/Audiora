const ImageKit = require('@imagekit/nodejs')


const client = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,  
});

async function filesUpload(file){
  const response = await client.files.upload({
    file: file,
    fileName: 'music_' + Date.now(),
    folder: "audiora/music"

  })

  return response;
}

module.exports = {filesUpload}