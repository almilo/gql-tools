#! /usr/bin/env node

var commander = require('commander');
var pkg = require('../package.json');
var graph = require('../graph');

commander
    .version(pkg.version)
    .usage([
        '<schema.txt> [options]',
        '',
        '  Given a file with a GraphQL schema in the schema language, creates a livereload-enabled graphical visualization.'
    ].join('\n'))
    .option('-p --port [port]', 'server port, defaults to 4000.', parseInt)
    .action((schemaTextFileName, options) => graph(schemaTextFileName, options.port))
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    commander.outputHelp();
}
