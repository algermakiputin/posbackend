// vercel app
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { context } from './app/context/context.js';
import logger from './app/logger/logger.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
  
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context,
});

logger.info(`Server ready at: ${url}`);
console.log(`🚀  Server ready at: ${url}`);