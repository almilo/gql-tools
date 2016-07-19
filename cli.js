#! /usr/bin/env node

var commander = require('commander');
var pkg = require('./package.json');
var gqlTools = require('./index');

commander
    .version(pkg.version)
    .usage([
        '<schema.txt | http://example.com/graphql> [options]',
        '',
        '  Given a file with a GraphQL schema in the schema language or the URL of a GraphQL endpoint, generates the introspected schema and / or the schema AST as JSON files.',
        '  If a URL of a GraphQL endpoint is provided, generating the remote schema in the schema language is also supported.',
        '  By default, only the introspected schema is generated.',
        '  To select which files to generate use the "-i", "-a" and "-t" options.'
    ].join('\n'))
    .option('-i --generate-introspected-schema', 'generates the introspected schema')
    .option('-a --generate-schema-ast', 'generates the schema AST')
    .option('-t --generate-schema-language', 'generates the schema in the schema language from a GraphQL endpoint')
    .option('-o --introspected-schema-output-file [outputFile]', 'name for the output file of the introspected schema, defaults to "schema.json"', 'schema.json')
    .option('-u --schema-ast-output-file [outputFile]', 'name for the output file of the schema AST, defaults to "schema-ast.json"', 'schema-ast.json')
    .option('-v --schema-language-output-file [outputFile]', 'name for the output file of the schema in schema language, defaults to "schema.graphql"', 'schema.graphql')
    .action((schemaResource, options) => {
        if (options.generateIntrospectedSchema || (!options.generateIntrospectedSchema && !options.generateSchemaAst && !options.generateSchemaLanguage)) {
            gqlTools.generateIntrospectedSchema(schemaResource, options.introspectedSchemaOutputFile);
        }
        if (options.generateSchemaAst) {
            gqlTools.generateSchemaAst(schemaResource, options.schemaAstOutputFile);
        }
        if (options.generateSchemaLanguage) {
            gqlTools.generateSchemaLanguage(schemaResource, options.schemaLanguageOutputFile);
        }
    })
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    commander.outputHelp();
}
