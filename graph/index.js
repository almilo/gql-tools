var http = require('http');
var url = require('url');
var path = require('path');
var exec = require('child_process').exec;
var fs = require('fs');
var livereload = require('livereload');

module.exports = function (schemaTextFileName, port) {
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

        console.log('Server listening on port:', port);
        console.log('Opening graph in browser...');

        exec((isWindows() ? 'start' : 'open') + ' http://localhost:' + port);
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

function isWindows() {
    return /^win/.test(process.platform);
}
