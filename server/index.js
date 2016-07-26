var fs = require('fs');
var path = require('path');
var graphql = require('graphql').graphql;
var graphqlTools = require('graphql-tools');
var express = require('express');
var graphqlHTTP = require('express-graphql');
var openUrl = require('../lib').openUrl;

module.exports = function (schemaTextFileName, mocksFileName, port, openInBrowser) {
    port = port || 3000;
    mocksFileName = mocksFileName || changeExtension(schemaTextFileName, '.json');

    var graphqlEndpoint = '/graphql';

    express()
        .use(express.static(__dirname))
        .use(graphqlEndpoint, graphqlHTTP(function () {
            return {
                schema: createSchema(schemaTextFileName, mocksFileName),
                pretty: true,
                graphiql: true
            };
        }))
        .listen(port, onServerReady);

    function createSchema(schemaTextFileName, mocksFileName) {
        var schemaText = fs.readFileSync(schemaTextFileName, 'utf-8');
        var schema = graphqlTools.buildSchemaFromTypeDefinitions(schemaText);
        var mocks = getMocks(mocksFileName);

        graphqlTools.addMockFunctionsToSchema({schema: schema, mocks: mocks});

        return schema;

        function getMocks(mocksFileName) {
            if (mocksFileName) {
                if (fs.existsSync(mocksFileName)) {
                    var resolvedPath = path.resolve('./', mocksFileName);

                    delete require.cache[resolvedPath];
                    var jsonMocks = require(resolvedPath);

                    return Object.keys(jsonMocks).reduce(wrap, {});

                    function wrap(jsMocks, propertyName) {
                        jsMocks[propertyName] = function () {
                            return jsonMocks[propertyName];
                        };

                        return jsMocks;
                    }
                } else {
                    console.error('Mocks file: "' + mocksFileName + '" not found.');
                }
            } else {
                return undefined;
            }
        }
    }

    function onServerReady(error) {
        if (error) {
            console.error(error);
            process.exit(1);
        }

        console.log('GraphQL server listening on port:', port);

        if (openInBrowser) {
            console.log('Opening GraphiQL console in browser...');
            openUrl(' http://localhost:' + port);
        }
    }
};

function changeExtension(filename, newExtension) {
    var extension = path.extname(filename);

    return filename.replace(extension, newExtension);
}
