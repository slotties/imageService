const resizePathRegexp = /\/resize\/([a-zA-Z0-9=]+)_([0-9]+)x([0-9]+)\.?(jpg|png)?/;

function decodeFileName (encodedFileName) {
    return Buffer.from(encodedFileName, 'base64').toString();
}

function parseResizeRequest (path) {
    if (path) {
        const match = resizePathRegexp.exec(path);
        if (match) {
            return {
                fileName: decodeFileName(match[1]),
                width: parseInt(match[2], 10),
                height: parseInt(match[3], 10),
                outputFormat: match[4] || null
            };
        }
    }
    
    return null;
}

module.exports.parseResizeRequest = parseResizeRequest;