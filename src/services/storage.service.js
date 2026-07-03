const ImageKit = require('@imagekit/nodejs')


const client = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,  
});

async function filesUpload(file, options = {}) {
  const response = await client.files.upload({
    file: file,
    fileName: options.fileName || ('file_' + Date.now()),
    folder: options.folder || "audiora/music"
  })
  return response;
}

module.exports = {filesUpload}