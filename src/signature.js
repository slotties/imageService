const crypto = require('crypto');

const signatureParameterName = 'sign';
var __secret;

function init(secret) {
    __secret = secret;
}

function queryParamsWithoutSignature(queryParams) {
    return Object.keys(queryParams)
        .filter(key => key !== signatureParameterName)
        .reduce((target, key) => {
            target.push(key + '=' + queryParams[key]);
            return target;
        }, [])
        .join('&');
}

function verifySignature(urlPath, queryParameters) {
    const params = queryParamsWithoutSignature(queryParameters);
    const providedSignature = queryParameters[signatureParameterName];
    const expectedSignature = crypto.createHmac('sha256', __secret)
        .update(urlPath + '?' + params)
        .digest('base64');

    return providedSignature === expectedSignature;
}

module.exports.init = init;
module.exports.verify = verifySignature;