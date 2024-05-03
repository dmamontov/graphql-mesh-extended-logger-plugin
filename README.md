# Extended Logger Plugin for GraphQL Mesh

The Extended Logger Plugin is a plugin designed to enhance the logging capabilities of GraphQL Mesh. It provides detailed logs for operations and delegations, making it easier to debug and trace the flow of GraphQL queries and mutations.

## Installation

Before you can use the Extended Logger Plugin, you need to install it along with GraphQL Mesh if you haven't already done so. You can install these using npm or yarn.

```bash
npm install @dmamontov/graphql-mesh-extended-logger-plugin
```

or

```bash
yarn add @dmamontov/graphql-mesh-extended-logger-plugin
```

## Configuration

### Modifying tsconfig.json

To make TypeScript recognize the Extended Logger Plugin, you need to add an alias in your tsconfig.json.

Add the following paths configuration under the compilerOptions in your tsconfig.json file:

```json
{
  "compilerOptions": {
    "paths": {
       "extended-logger": ["node_modules/@dmamontov/graphql-mesh-extended-logger-plugin"]
    }
  }
}
```

### Adding the Plugin to GraphQL Mesh

You need to include the Extended Logger Plugin in your GraphQL Mesh configuration file (usually .meshrc.yaml). Below is an example configuration that demonstrates how to use this plugin:

```yaml
plugins:
  - extendedLogger:
      operations:
        success: true
        error: true
        result: false
        document: true
      delegations:
        success: true
        error: true
        result: false
        args: true
```

- **operations**: Logging Options for Operations;
    - **success**: Logging of successful operations;
    - **error**: Logging of error operations;
    - **result**: Logging of operation results;
    - **document**: Logging of documents processed in operations;
- **delegations**: Logging Options for Delegations;
    - **success**: Logging of successful delegations;
    - **error**: Logging of error delegations;
    - **result**: Logging of delegation results;
    - **args**: Logging of arguments passed to delegations;

## Conclusion

Remember, always test your configurations in a development environment before applying them in production to ensure that everything works as expected.