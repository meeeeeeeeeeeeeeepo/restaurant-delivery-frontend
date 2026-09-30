import type { CodegenConfig } from '@graphql-codegen/cli';

// Schema is read from the published package artifact (consumed from GitHub Packages).
const config: CodegenConfig = {
  schema: 'node_modules/@meeeeeeeeeeeeeeepo/restaurant-schema/schema.graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': { preset: 'client' }
  }
};

export default config;
