const http = require('http');
const url = require('url');
const querystring = require('querystring');
const requestParser = require('./requestParser');
const imageService = require('./imageService');
const signature = require('./signature');
const args = require('./args');

const defaultParams = {
    port: '8080',
    imageSourceDirectory: '/usr/share/images',
    cacheDirectory: '/var/cache/images',
    tmpDirectory: '/tmp/images',
    signatureSecret: 'foobar'
};
const startParams = Object.assign({}, defaultParams, args.parse(process.argv));

imageService.init(startParams.imageSourceDirectory, startParams.cacheDirectory, startParams.tmpDirectory);
signature.init(startParams.signatureSecret);

function handleHealth(response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('UP');
}

function handleResize(urlPath, queryParameters, response) {
    if (!signature.verify(urlPath, queryParameters)) {
        response.writeHead(400);
        response.end('Bad signature');
        return;        
    }

    const resizeRequest = requestParser.parseResizeRequest(urlPath, queryParameters);
    if (resizeRequest) {
        const resizer = imageService.resize(resizeRequest);
        if (resizer) {
            response.writeHead(200, {
                // FIXME
                'Content-Type': 'image/jpg'
            });
            resizer.pipe(response);
        } else {
            response.writeHead(403);
            response.end('Invalid path: ' + urlPath);
        }
    } else {
        response.writeHead(400);
        response.end('Invalid path: ' + urlPath);
    }

}

function handleUnknownPath(response) {
    response.writeHead(404);
    response.end();
}

http.createServer((request, response) => {
    const urlParts = url.parse(request.url);
    const queryParameters = querystring.parse(urlParts.query);
    if (urlParts && urlParts.pathname.indexOf('/resized/') === 0) {
        handleResize(urlParts.pathname, queryParameters, response);
    } else if (urlParts && urlParts.pathname === '/health') {
        handleHealth(response);
    } else {
        handleUnknownPath(response);
    }
}).listen(parseInt(startParams.port));

console.log('Running on port %i. Using %s as source directory of images. %s as temporary directory and writing processed files to %s.',
    startParams.port,
    startParams.imageSourceDirectory,
    startParams.tmpDirectory,
    startParams.cacheDirectory
);