# Toki API

GraphQL BFF（Backend for Frontend）APIサーバーです。

## 技術スタック

- **フレームワーク**: Apollo Server
- **言語**: TypeScript
- **データベース**: Firestore / Cloud SQL
- **認証**: Firebase Auth
- **AI**: OpenAI API / Vertex AI

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# GraphQLスキーマの生成
npm run codegen
```

## プロジェクト構造

```
src/
├── index.ts
├── schema/
│   ├── index.ts
│   ├── types/
│   ├── queries/
│   ├── mutations/
│   └── subscriptions/
├── resolvers/
│   ├── auth.ts
│   ├── diary.ts
│   └── ai.ts
├── services/
│   ├── firebase.ts
│   ├── ai.ts
│   └── database.ts
├── middleware/
│   ├── auth.ts
│   └── validation.ts
└── utils/
```

## GraphQLスキーマ

スキーマ駆動開発を採用し、`packages/shared`で型定義を共有しています。

## 環境変数

```env
PORT=4000
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id
OPENAI_API_KEY=your_openai_key
```

## API エンドポイント

- **GraphQL**: `http://localhost:4000/graphql`
- **GraphQL Playground**: `http://localhost:4000/graphql` 