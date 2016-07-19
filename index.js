var fs = require('fs');
var graphql = require('graphql');
var mockServer = require('graphql-tools').mockServer;

exports.generateSchemaAst = function (schemaTextFileName, outputFileName) {
    var schemaText = fs.readFileSync(schemaTextFileName, 'utf-8');

    createWriter(outputFileName)(graphql.parse(schemaText));
};

exports.generateIntrospectedSchema = function (schemaTextFileName, outputFileName) {
    var schemaText = fs.readFileSync(schemaTextFileName, 'utf-8');

    mockServer(schemaText).query(graphql.introspectionQuery).then(createWriter(outputFileName));
};

function createWriter(fileName) {
    return content => fs.writeFileSync(fileName, JSON.stringify(content, null, 2));
}
