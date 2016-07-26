var path = require('path');
var fs = require('fs');
var express = require('express');
var livereload = require('livereload');
var openUrl = require('../lib').openUrl;

module.exports = function (schemaTextFileName, port, openInBrowser) {
    port = port || 4000;
    schemaTextFileName = path.resolve(schemaTextFileName);

    var schemaTextFileNameExtension = path.extname(schemaTextFileName).slice(1);
    var livereloadConfiguration = {exts: [schemaTextFileNameExtension]};

    express()
        .use(express.static(__dirname))
        .get('/schema', schemaHandler)
        .listen(port, onServerReady);
    livereload.createServer(livereloadConfiguration).watch(schemaTextFileName);

    function schemaHandler(req, res) {
        if (fs.existsSync(schemaTextFileName)) {
            res.send(fs.readFileSync(schemaTextFileName));
        } else {
            console.error('Schema file: "' + schemaTextFileName + '" not found.');

            res.status(404).send('Not found.');
        }
    }

    function onServerReady(error) {
        if (error) {
            console.error(error);
            process.exit(1);
        }

        console.log('Graph server listening on port:', port);

        if (openInBrowser) {
            console.log('Opening graph in browser...');
            openUrl(' http://localhost:' + port);
        }
    }
};
