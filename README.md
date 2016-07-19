# gql-tools
This package provides several command-line tools to work with GraphQL schemas. For instance, generating the
introspected schema or the schema AST in JSON format. Generation of the schema of a remote GraphQL endpoint
in the schema language is also supported (see CLI options).

### Installation
Install *gqltools* locally and add as dependency to the current project.

```sh
npm install --save gql-tools
```

Install *gqltools* globally.

```sh
npm install -g gql-tools
```

**Note**: this package requires *graphql* as peer dependency.

```sh
npm install [-g] graphql
```

### Usage
* **gqlschema**: generates the introspected schema and the schema AST of a given GraphQL schema either from the schema
language (file must be provided) or from a GraphQL endpoint (URL must be provided). Schema language generation of a
GraphQL endpoint is also supported if a URL is provided (see command options).  
  * **usage**: *gqlschema  <schema.txt | http://example.com/graphql>*
