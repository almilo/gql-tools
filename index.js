var fs = require('fs');
var graphql = require('graphql');
var mockServer = require('graphql-tools').mockServer;
var isUrl = require('is-url');
var fetch = require('node-fetch');

exports.generateSchemaAst = function (schemaResource, outputFileName) {
    if (isUrl(schemaResource)) {
        throw new Error('URLs not supported yet for schema AST generation.');
    }

    createWriter(outputFileName)(graphql.parse(read(schemaResource)));
};

exports.generateIntrospectedSchema = function (schemaResource, outputFileName) {
    var promise = isUrl(schemaResource) ?
        fetchIntrospectionSchema(schemaResource) :
        mockServer(read(schemaResource)).query(graphql.introspectionQuery);

    promise.then(createWriter(outputFileName));
};

function fetchIntrospectionSchema(endpointUrl) {
    var headers = {
        'content-type': 'application/json',
        'accept': 'application/json'
    };
    var body = JSON.stringify({query: graphql.introspectionQuery});

    return fetch(endpointUrl, {method: 'POST', body: body, headers: headers}).then(toJson);

    function toJson(response) {
        return response.json();
    }
}

function read(fileName) {
    return fs.readFileSync(fileName, 'utf-8');
}

function createWriter(fileName) {
    return function (content) {
        return fs.writeFileSync(fileName, JSON.stringify(content, null, 2));
    }
}
