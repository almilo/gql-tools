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

    promise
        .then(createWriter(outputFileName))
        .catch(throwError);
};

exports.generateSchemaLanguage = function (schemaResource, outputFileName) {
    if (!isUrl(schemaResource)) {
        throw new Error('Only URLs are supported for schema language generation.');
    }

    fetchIntrospectionSchema(schemaResource)
        .then(toSchemaLanguage)
        .then(createWriter(outputFileName))
        .catch(throwError);

    function toSchemaLanguage(introspectionQueryResponse) {
        return graphql.printSchema(graphql.buildClientSchema(introspectionQueryResponse.data));
    }
};

function fetchIntrospectionSchema(endpointUrl) {
    var headers = {
        'content-type': 'application/json',
        'accept': 'application/json'
    };
    var body = JSON.stringify({query: graphql.introspectionQuery});

    return fetch(endpointUrl, {method: 'POST', body: body, headers: headers})
        .then(checkStatus)
        .then(toJson);

    function checkStatus(response) {
        if (response.status !== 200) {
            return Promise.reject(response.statusText);
        }

        return response;
    }

    function toJson(response) {
        return response.json();
    }
}

function read(fileName) {
    return fs.readFileSync(fileName, 'utf-8');
}

function createWriter(fileName) {
    return function (content) {
        var stringContent = typeof content !== 'string' ? JSON.stringify(content, null, 2) : content;

        return fs.writeFileSync(fileName, stringContent);
    }
}

function throwError(error) {
    console.error(error);
    process.exit(1);
}
