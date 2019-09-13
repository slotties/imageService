const sharp = require('sharp');

function resize(resizeRequest) {
    const resizeParams = {
        height: resizeRequest.height,
        width: resizeRequest.width
    };

    if (resizeRequest.fill) {
        resizeParams.fit = 'contain';
        resizeParams.background = resizeRequest.fillBackgroundColor;
    } else {
        resizeParams.fit = 'inside';
    }

    return sharp(resizeRequest.imageSourcePath)
        .rotate()
        .resize(resizeParams);
}

module.exports.resize = resize;