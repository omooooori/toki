import 'dotenv/config';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import helmet from 'helmet';
import { readFileSync } from 'fs';
import path from 'path';
import { resolvers } from './resolvers';
import { authMiddleware } from './auth/middleware';

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  // GraphQLスキーマの読み込み
  const typeDefs = readFileSync(path.join(__dirname, 'schema', 'schema.graphql'), 'utf8');

  // Apollo Serverの初期化
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  // 認証ミドルウェアをGraphQLリクエストに適用
  app.use('/graphql', authMiddleware, expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  }));

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer(); 