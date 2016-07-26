var fs = require('fs');
var graphql = require('graphql').graphql;
var graphqlTools = require('graphql-tools');
var express = require('express');
var graphqlHTTP = require('express-graphql');
var openUrl = require('../lib').openUrl;

module.exports = function (schemaTextFileName, port) {
    port = port || 3000;

    var graphqlEndpoint = '/graphql';
    var schemaText = fs.readFileSync(schemaTextFileName, 'utf-8');
    var schema = graphqlTools.buildSchemaFromTypeDefinitions(schemaText);

    graphqlTools.addMockFunctionsToSchema({schema: schema});

    express()
        .get('/', function (req, res) {
            res.redirect(graphqlEndpoint);
        })
        .use(express.static(__dirname))
        .use(graphqlEndpoint, graphqlHTTP({
            schema: schema,
            pretty: true,
            graphiql: true
        }))
        .listen(port, onServerReady);

    function onServerReady(error) {
        if (error) {
            console.error(error);
            process.exit(1);
        }

        console.log('GraphQL server listening on port:', port);
        console.log('Opening GraphiQL console in browser...');

        openUrl(' http://localhost:' + port);
    }
};
