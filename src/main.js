const http = require('http');
const url = require('url');
const querystring = require('querystring');
const requestParser = require('./requestParser');
const imageService = require('./imageService');
const args = require('./args');

const defaultParams = {
    port: '8080',
    cacheDirectory: './images',
    tmpDirectory: '/tmp/images'
};
const startParams = Object.assign({}, defaultParams, args.parse(process.argv));

imageService.init(startParams.cacheDirectory, startParams.tmpDirectory);

function handleHealth(response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('UP');
}

function handleResize(urlPath, queryParameters, response) {
    const resizeRequest = requestParser.parseResizeRequest(urlPath, queryParameters);
    if (resizeRequest) {
        const resizer = imageService.resize(resizeRequest);
        response.writeHead(200, {
            // FIXME
            'Content-Type': 'image/jpg'
        });
        resizer.pipe(response);
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

console.log('Running on port %i. Using %s as temporary directory and writing processed files to %s.', 
    startParams.port, startParams.tmpDirectory, startParams.cacheDirectory);