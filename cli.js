#! /usr/bin/env node

var commander = require('commander');
var pkg = require('./package.json');
var gqlTools = require('./index');

commander
    .version(pkg.version)
    .usage([
        '<schema.txt> [options]',
        '',
        '  Given a file with a GraphQL schema in the schema language or the URL of a GraphQL endpoint, generates the introspected schema and / or the schema AST as JSON files.',
        '  By default, only the introspected schema is generated.',
        '  To select which files to generate use the "-i" and "-o" options.'
    ].join('\n'))
    .option('-i --generate-introspected-schema', 'generates the introspected schema')
    .option('-a --generate-schema-ast', 'generates the schema AST')
    .option('-o --introspected-schema-output-file [outputFile]', 'name for the output file of the introspected schema, defaults to "schema.json"', 'schema.json')
    .option('-u --schema-ast-output-file [outputFile]', 'name for the output file of the schema AST, defaults to "schema-ast.json"', 'schema-ast.json')
    .action((schemaTextFileName, options) => {
        if (options.generateIntrospectedSchema || (!options.generateIntrospectedSchema && !options.generateSchemaAst)) {
            gqlTools.generateIntrospectedSchema(schemaTextFileName, options.introspectedSchemaOutputFile);
        }
        if (options.generateSchemaAst) {
            gqlTools.generateSchemaAst(schemaTextFileName, options.schemaAstOutputFile);
        }
    })
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    commander.outputHelp();
}
