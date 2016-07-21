var fs = require('fs');
var graphql = require('graphql');
var mockServer = require('graphql-tools').mockServer;
var isUrl = require('is-url');
var fetch = require('node-fetch');

exports.generateSchemaAst = function (schemaResource, outputFileName) {
    var promise = isUrl(schemaResource) ?
        fetchIntrospectionSchema(schemaResource).then(fromIntrospectionToSchemaAst) :
        Promise.resolve(graphql.parse(read(schemaResource)));

    writeToFile(promise, 'schema AST', outputFileName);
};

exports.generateIntrospectedSchema = function (schemaResource, outputFileName) {
    var promise = isUrl(schemaResource) ?
        fetchIntrospectionSchema(schemaResource) :
        mockServer(read(schemaResource)).query(graphql.introspectionQuery);

    writeToFile(promise, 'introspection schema', outputFileName);
};

exports.generateSchemaLanguage = function (schemaResource, outputFileName) {
    var promise = isUrl(schemaResource) ?
        fetchIntrospectionSchema(schemaResource).then(fromIntrospectionToSchemaLanguage) :
        Promise.resolve(read(schemaResource));

    writeToFile(promise, 'schema file', outputFileName);
};

function writeToFile(promise, what, outputFileName) {
    promise
        .then(createWriter(outputFileName))
        .then(createLogger('GraphQL ' + what + ' written to file: "' + outputFileName + '".'))
        .catch(throwError);

    function createWriter(fileName) {
        return function (content) {
            var stringContent = typeof content !== 'string' ? JSON.stringify(content, null, 2) : content;

            return fs.writeFileSync(fileName, stringContent);
        }
    }

    function createLogger(message) {
        return function () {
            console.log(message);
        }
    }

    function throwError(error) {
        console.error(error);
        process.exit(1);
    }
}

function fetchIntrospectionSchema(endpointUrl) {
    var headers = {
        'content-type': 'application/json',
        'accept': 'application/json'
    };
    var body = JSON.stringify({query: graphql.introspectionQuery});

    return fetch(endpointUrl, {method: 'POST', body: body, headers: headers})
        .then(checkHttpStatus)
        .then(toJson);

    function checkHttpStatus(response) {
        if (response.status !== 200) {
            return Promise.reject('HTTP error: ' + response.status + ', ' + response.statusText);
        }

        return response;
    }

    function toJson(response) {
        return response.json();
    }
}

function fromIntrospectionToSchemaLanguage(introspection) {
    return graphql.printSchema(graphql.buildClientSchema(introspection.data));
}

function fromIntrospectionToSchemaAst(introspection) {
    return graphql.parse(fromIntrospectionToSchemaLanguage(introspection));
}

function read(fileName) {
    return fs.readFileSync(fileName, 'utf-8');
}
