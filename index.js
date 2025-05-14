import { ApolloServer } from 'apollo-server-express';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { context } from './app/context/context.js';
import logger from './app/logger/logger.js';
import express from 'express';
import { url } from 'inspector';

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  server.applyMiddleware({ app }); 

  await new Promise(resolve => app.listen({ port: 4000, context }, resolve));
  logger.info(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startApolloServer();
  
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 3333 },
//   context
// });
  
// logger.info(`🚀  Server ready at: ${url}`);
// console.log(`🚀  Server ready at: ${url}`);