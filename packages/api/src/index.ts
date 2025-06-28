import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

import { createResolvers } from './resolvers/index';
import { AuthMiddleware, AuthenticatedRequest } from './auth/middleware';

// 環境変数を読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// データベース設定
const dbConfig = {
  type: 'firebase' as const,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  },
};

// AI設定
const aiConfig = {
  openai: process.env.OPENAI_API_KEY ? {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7,
  } : undefined,
};

// 認証ミドルウェア
const authMiddleware = new AuthMiddleware(dbConfig);

// ミドルウェアの設定
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// GraphQLスキーマを読み込み
const typeDefs = readFileSync(
  join(__dirname, '../../shared/src/graphql/schema.graphql'),
  'utf8'
);

// リゾルバーを作成
const resolvers = createResolvers(dbConfig, aiConfig);

// Apollo Serverを作成
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authenticatedReq = req as AuthenticatedRequest;
    return {
      userId: authenticatedReq.userId,
      user: authenticatedReq.user,
    };
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      path: error.path,
    };
  },
});

// サーバーを起動
async function startServer() {
  try {
    await server.start();
    
    // Apollo ServerをExpressに統合
    server.applyMiddleware({
      app,
      path: '/graphql',
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
      },
    });

    // 認証が必要なルート
    app.use('/api', (req, res, next) => {
      authMiddleware.authenticate(req as AuthenticatedRequest, res, next);
    });

    // ヘルスチェックエンドポイント
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    });

    // 404ハンドラー
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'エンドポイントが見つかりません',
        path: req.originalUrl,
      });
    });

    // エラーハンドラー
    app.use((error: any, req: any, res: any, next: any) => {
      console.error('Server Error:', error);
      res.status(500).json({
        error: 'サーバー内部エラーが発生しました',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: ${dbConfig.type}`);
      console.log(`🤖 AI Services: ${Object.keys(aiConfig).filter(key => aiConfig[key as keyof typeof aiConfig]).join(', ')}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.stop();
  process.exit(0);
});

startServer(); 