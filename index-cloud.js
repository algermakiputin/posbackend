import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { context } from './app/context/context.js'; 
import { ApolloServer } from 'apollo-server-cloud-functions'; 
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

export const handler = server.createHandler(); 