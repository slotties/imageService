const sharp = require('sharp');

function resize(resizeRequest) {
    return sharp(resizeRequest.fileName)
        .rotate()
        .resize({
            height: resizeRequest.height,
            width: resizeRequest.width,
            fit: 'inside'
        });
}

module.exports.resize = resize;