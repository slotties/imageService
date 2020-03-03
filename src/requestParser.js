const resizePathRegexp = /\/resized\/([a-zA-Z0-9=_]+)_([0-9]+)x([0-9]+)\.?(jpg|png)?/;
const colorHexCodePattern = /^[a-f0-9]+$/;
const colorRgbPattern = /^([0-9]+),([0-9]+),([0-9]+),?([0-9\.]*)$/;

function decodeFileName (encodedFileName) {
    return Buffer.from(encodedFileName, 'base64').toString();
}

function parseColor (colorString) {
    if (colorString === null || colorString === undefined) {
        return null;
    } else if (colorRgbPattern.test(colorString)) {
        const match = colorRgbPattern.exec(colorString);
        if (match.length >= 4) {
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10),
                alpha: match[4] ? parseFloat(match[4], 10) : 1
            };
        }
    } else if (colorHexCodePattern.test(colorString)) {
        return '#' + colorString;
    }
        
    return null;
}

function parseResizeRequest (path, queryParameters) {
    if (path) {
        const match = resizePathRegexp.exec(path);
        if (match) {
            const resizeRequest = {
                fileName: decodeFileName(match[1]),
                width: parseInt(match[2], 10),
                height: parseInt(match[3], 10),
                outputFormat: match[4] || null,
                originalPath: match[0]
            };

            if (queryParameters.fill) {
                resizeRequest.fill = true;
                resizeRequest.fillBackgroundColor = parseColor(queryParameters.bg) || '#000';
            }

            return resizeRequest;
        }
    }
    
    return null;
}

module.exports.parseResizeRequest = parseResizeRequest;