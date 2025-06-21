# Toki Web App

Next.jsを使用したToki AI日記アプリのWeb版です。

## 技術スタック

- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **状態管理**: Zustand
- **GraphQL**: Apollo Client
- **UI**: Tailwind CSS + shadcn/ui
- **認証**: Firebase Auth

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## プロジェクト構造

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── auth/
│   ├── diary/
│   └── ai/
├── lib/
│   ├── apollo-client.ts
│   ├── auth.ts
│   └── utils.ts
├── hooks/
├── types/
└── generated/
    └── graphql/
```

## GraphQL型定義

`packages/shared`からGraphQLの型定義を共有しています。

## 環境変数

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
``` 