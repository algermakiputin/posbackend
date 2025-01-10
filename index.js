import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { context } from './app/context/context.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
  
const { url } = await startStandaloneServer(server, {
  listen: { port: 3333 },
  context,
});
  
console.log(`🚀  Server ready at: ${url}`);