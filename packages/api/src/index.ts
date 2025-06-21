import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const app = express();
const PORT = process.env.PORT || 4000;

// ミドルウェアの設定
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Apollo Serverの設定
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    // コンテキストにリクエスト情報を追加
    req,
  }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  });
}

startServer().catch(console.error); 