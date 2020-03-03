const imageOperations = require('./imageOperations');
const stream = require('stream');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');

var __cacheDirectory;
var __tmpDirectory;

function init(imagesSourceDirectory, cacheDirectory, tmpDirectory) {
    __imagesSourceDirectory = imagesSourceDirectory;
    __cacheDirectory = cacheDirectory;
    __tmpDirectory = tmpDirectory;

    if (!fs.existsSync(__imagesSourceDirectory)) {
        fs.mkdirSync(__imagesSourceDirectory, { recursive: true });
    }

    if (!fs.existsSync(__cacheDirectory)) {
        fs.mkdirSync(__cacheDirectory, { recursive: true });
    }

    const resizedCacheDir = path.join(__cacheDirectory, 'resized');
    if (!fs.existsSync(resizedCacheDir)) {
        fs.mkdirSync(resizedCacheDir, { recursive: true });
    }

    if (!fs.existsSync(__tmpDirectory)) {
        fs.mkdirSync(__tmpDirectory, { recursive: true });
    }
}

function uniqueFileName() {
    return uuid();
}

function cleanupTempFile (tmpFilePath) {
    fs.unlink(tmpFilePath, (err) => {
        console.log('Could not remove %s. Please clean this up by yourself.', tmpFilePath);
    });
}

function moveFileToStore (tmpFilePath, cacheFilePath) {
    fs.rename(tmpFilePath, cacheFilePath, (err) => {
        if (err) {
            cleanupTempFile(tmpFilePath);
        }
    });
}

function storeFile(tmpFilePath, cacheFilePath) {
    const storeFileParentPath = path.resolve(cacheFilePath, '..');

    fs.exists(storeFileParentPath, (exists) => {
        if (!exists) {
            fs.mkdir(storeFileParentPath, { recursive: true }, (err) => {
                if (!err) {
                    moveFileToStore(tmpFilePath, cacheFilePath);
                } else {
                    console.log('Could not move file %s to %s. Still cleaning up.', tmpFilePath, cacheFilePath);
                    cleanupTempFile(tmpFilePath);
                }
            });
        } else {
            moveFileToStore(tmpFilePath, cacheFilePath);
        }
    });
}

function resize(resizeRequest) {
    const operation = imageOperations.resize(resizeRequest);
    if (operation) {
        const tmpFilePath = path.join(__tmpDirectory, uniqueFileName());
        const cacheFilePath = path.join(__cacheDirectory, resizeRequest.originalPath);
        
        const fsPipe = new stream.PassThrough().pipe(
            fs.createWriteStream(tmpFilePath)
        );

        fsPipe.on('close', () => storeFile(tmpFilePath, cacheFilePath));
    
        operation.pipe(fsPipe);        
    }

    return operation;
}

module.exports.resize = resize;
module.exports.init = init;