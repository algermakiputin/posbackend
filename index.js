import { ApolloServer } from 'apollo-server-express';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { context } from './app/context/context.js';
import logger from './app/logger/logger.js';
import express from 'express';
import http from "http"; 
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app }); 

  await new Promise(resolve => app.listen({ port: 4000, context }, resolve));
  logger.info(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startApolloServer();
export default httpServer
  
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 3333 },
//   context
// });
  
// logger.info(`🚀  Server ready at: ${url}`);
// console.log(`🚀  Server ready at: ${url}`);