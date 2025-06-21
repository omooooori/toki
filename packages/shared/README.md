# Toki Shared Package

モノレポ全体で共有される型定義、ユーティリティ、GraphQLスキーマを管理するパッケージです。

## 技術スタック

- **言語**: TypeScript
- **GraphQL**: GraphQL Code Generator
- **バリデーション**: Zod

## セットアップ

```bash
# 依存関係のインストール
npm install

# GraphQL型定義の生成
npm run codegen
```

## プロジェクト構造

```
src/
├── index.ts
├── graphql/
│   ├── schema.graphql
│   ├── operations/
│   │   ├── queries/
│   │   ├── mutations/
│   │   └── subscriptions/
│   └── generated/
├── types/
│   ├── user.ts
│   ├── diary.ts
│   ├── ai-analysis.ts
│   └── common.ts
├── utils/
│   ├── validation.ts
│   ├── date.ts
│   └── constants.ts
├── constants/
│   ├── api.ts
│   └── app.ts
└── schemas/
    ├── user.schema.ts
    ├── diary.schema.ts
    └── ai-analysis.schema.ts
```

## GraphQLスキーマ

GraphQLスキーマ駆動開発の中心となるスキーマ定義を管理します。

## 共有型定義

モバイル、Web、API間で共有される型定義を提供します。

## 使用方法

```typescript
// 型定義のインポート
import { User, Diary, AIAnalysis } from '@toki/shared'

// GraphQLクエリのインポート
import { GetUserDocument } from '@toki/shared/graphql'

// バリデーションスキーマのインポート
import { userSchema } from '@toki/shared/schemas'
```

## パッケージ間の依存関係

- `packages/api` → `packages/shared`
- `packages/mobile` → `packages/shared`
- `packages/web` → `packages/shared` 