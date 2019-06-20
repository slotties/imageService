const http = require('http');
const url = require('url');
const querystring = require('querystring');
const requestParser = require('./requestParser');
const imageOperations = require('./imageOperations');

// TODO: set via arguments
const port = 8080;

function handleHealth(response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('UP');
}

function handleResize(urlPath, queryParameters, response) {
    const resizeRequest = requestParser.parseResizeRequest(urlPath, queryParameters);
    if (resizeRequest) {
        const resizer = imageOperations.resize(resizeRequest);
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
}).listen(port);
