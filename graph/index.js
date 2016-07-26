var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var livereload = require('livereload');
var openUrl = require('../lib').openUrl;

module.exports = function (schemaTextFileName, port, openInBrowser) {
    port = port || 4000;

    var schemaTextFileNameExtension = path.extname(schemaTextFileName).slice(1);
    var livereloadConfiguration = {exts: [schemaTextFileNameExtension]};

    http.createServer(staticContentHandler).listen(port, onServerReady);
    livereload.createServer(livereloadConfiguration).watch(schemaTextFileName);

    function staticContentHandler(req, res) {
        var requestPath = getPath(req);
        var filePath = requestPath === '/schema' ?
            path.resolve(schemaTextFileName) :
            path.join(__dirname, requestPath.replace('/', path.sep));

        if (fs.existsSync(filePath)) {
            res.writeHead(200, {'Content-Type': getMimeType(requestPath)});

            return res.end(fs.readFileSync(filePath));
        } else {
            res.writeHead(404, 'Not found.');

            return res.end();
        }
    }

    function onServerReady(error) {
        if (error) {
            console.error(error);
            process.exit(1);
        }

        console.log('Graph server listening on port:', port);
        console.log('Opening graph in browser...');

        if (openInBrowser) {
            openUrl(' http://localhost:' + port);
        }
    }
};

function getPath(req) {
    var path = url.parse(req.url).path;

    return path !== '/' ? path : '/index.html';
}

function getMimeType(fileName) {
    var mimeTypes = {
        'html': 'text/html',
        'css': 'text/css'
    };
    var extension = path.extname(fileName).slice(1).toLowerCase();

    return mimeTypes[extension] || 'text/plain';
}
