const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const https = require('https');

var __imagesSourceDirectory;
var __tmpDirectory;

function init(imagesSourceDirectory, tmpDirectory) {
    __imagesSourceDirectory = imagesSourceDirectory;
    __tmpDirectory = tmpDirectory;

    if (!fs.existsSync(__imagesSourceDirectory)) {
        fs.mkdirSync(__imagesSourceDirectory, { recursive: true });
    }

    if (!fs.existsSync(__tmpDirectory)) {
        fs.mkdirSync(__tmpDirectory, { recursive: true });
    }
}

function tempFilePath() {
    return path.join(__tmpDirectory, uuid());
}

function downloadFile(url) {
    const filePath = tempFilePath();
    const file = fs.createWriteStream(filePath);
    return new Promise((resolve, reject) => {
        // TODO: timeouts?
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                resolve(filePath)
            });

            // TODO: timeout/error?
            // TODO: possible to stream response to sharp/memory to avoid file access?
        }).on('error', (error) => {
            console.log(error);
            reject();
            // TODO: cleanup
        })
    });
}

function getImageSourcePath(relativeFileName) {
    const absoluteFileName = path.join(__imagesSourceDirectory, relativeFileName);
    if (absoluteFileName.indexOf(__imagesSourceDirectory) === 0 && fs.existsSync(absoluteFileName)) {
        return absoluteFileName;
    }

    return null;
}

function resolveInputFile(resizeRequest) {
    if (resizeRequest.fileName && (resizeRequest.fileName.indexOf('http:') === 0 || resizeRequest.fileName.indexOf('https:') === 0)) {
        return downloadFile(resizeRequest.fileName);
    }

    return new Promise((resolve, reject) => {
        const absoluteFileName = getImageSourcePath(resizeRequest.fileName);
        if (absoluteFileName) {
            resolve(absoluteFileName);
        } else {
            reject();
        }
    });
    
}

module.exports.resolveInputFile = resolveInputFile;
module.exports.init = init;