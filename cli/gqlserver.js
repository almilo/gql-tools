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
    .option('-m --mocks [mocks]', 'JSON file with mock data, defaults to the schema file name with ".json" extension.')
    .option('-p --port [port]', 'server port, defaults to 3000.', parseInt)
    .option('-o --open [open]', 'opens the server endpoint in the default browser.')
    .action((schemaTextFileName, options) => server(schemaTextFileName, options.mocks, options.port, options.open))
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    commander.outputHelp();
}
