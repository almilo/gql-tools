#! /usr/bin/env node

var commander = require('commander');
var pkg = require('../package.json');
var server = require('../server');

commander
    .version(pkg.version)
    .usage([
        '<schema.txt> [options]',
        '',
        '  Given a file with a GraphQL schema in the schema language, creates a GraphQL server with mock support.'
    ].join('\n'))
    .option('-p --port [port]', 'server port, defaults to 3000.', parseInt)
    .action((schemaTextFileName, options) => server(schemaTextFileName, options.port))
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    commander.outputHelp();
}
