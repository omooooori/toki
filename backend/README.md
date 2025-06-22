# AutoDiary (Toki) バックエンド

このリポジトリは、自動日記アプリ「Toki」のバックエンド（GraphQL API）です。

## 主な技術
- Node.js (TypeScript)
- Apollo Server (GraphQL)
- Firebase Firestore（データベース）
- Firebase Auth（認証）
- graphql-codegen（型生成）
- Express

## ディレクトリ構成

```
backend/
├── src/
│   ├── resolvers/         # GraphQLリゾルバー
│   ├── schema/            # GraphQLスキーマ（.graphql）
│   ├── models/            # TypeScriptモデル
│   ├── firestore/         # Firestoreリポジトリ・初期化
│   ├── auth/              # 認証ミドルウェア
│   └── index.ts           # エントリーポイント
├── scripts/               # APIテスト用スクリプト・サンプル
│   ├── *.example.sh       # サンプルファイル（機密情報なし）
│   ├── *.sh               # 実際のスクリプト（機密情報あり）
│   ├── sample_request.json # APIクライアント用リクエスト例
│   └── README.md          # スクリプト使用方法
├── codegen.yml            # graphql-codegen設定
├── env.example            # 環境変数サンプル
├── package.json           # npmスクリプト・依存
├── tsconfig.json          # TypeScript設定
```

## セットアップ手順

1. **依存パッケージのインストール**

```bash
npm install
```

2. **環境変数の設定**

`env.example` をコピーして `.env` を作成し、Firebase Admin SDKの情報を記入してください。

```bash
cp env.example .env
```

3. **GraphQL型の自動生成**

```bash
npm run codegen
```

4. **開発サーバーの起動**

```bash
npm run dev
```

- サーバーは `http://localhost:4000/graphql` でGraphQL Playgroundが利用できます。

## 主なnpmスクリプト

| コマンド              | 説明                                  |
|----------------------|---------------------------------------|
| npm run dev          | 開発サーバーを起動（ホットリロード）  |
| npm run build        | TypeScriptをビルド                    |
| npm start            | ビルド済みコードで本番サーバー起動    |
| npm run codegen      | GraphQLスキーマから型を自動生成       |

## デバッグ方法

- **VSCodeなどのデバッガを利用**
  - `npm run dev` で起動すると `ts-node-dev` が利用され、ブレークポイントが有効です。
  - `src/index.ts` からサーバーが起動します。
- **GraphQL PlaygroundでAPIをテスト**
  - `http://localhost:4000/graphql` にアクセスし、クエリやミューテーションを試せます。
  - 認証が必要な場合は、HTTPヘッダーに `Authorization: Bearer <Firebase IDトークン>` を付与してください。
- **ログ出力**
  - サーバーの標準出力にエラーやリクエスト情報が出力されます。

## APIテスト方法

### 1. Bashスクリプト（推奨）

#### セットアップ
1. `scripts/get_firebase_token.example.sh` をコピーして `scripts/get_firebase_token.sh` を作成
2. `scripts/sample_request.example.sh` をコピーして `scripts/sample_request.sh` を作成
3. 各ファイル内の設定値を実際の値に置き換える

#### 使用方法
```bash
# Firebase IDトークンを取得
./scripts/get_firebase_token.sh

# GraphQL APIをテスト
./scripts/sample_request.sh

# ユーザー作成をテスト
./scripts/create_auth_user.sh

# ユーザー取得をテスト
./scripts/test_auth_user.sh
```

詳細な使用方法は `scripts/README.md` を参照してください。

### 2. APIクライアント（Altair/Insomnia/Postman）

`scripts/sample_request.json` ファイルをAPIクライアントにインポートして使用できます。

1. **Altair GraphQL Client**をインストール
2. `scripts/sample_request.json` をインポート
3. `YOUR_FIREBASE_ID_TOKEN` と `YOUR_USER_ID` を実際の値に置き換え
4. リクエストを送信

## よく使うGraphQLクエリ例

```graphql
query GetUser {
  getUser(id: "ユーザーID") {
    id
    name
    createdAt
  }
}
```

```graphql
mutation CreateDiary {
  createDiary(userId: "ユーザーID", date: "2024-06-01", generatedText: "自動生成テキスト") {
    id
    date
    generatedText
  }
}
```

## セキュリティに関する注意事項

### 機密情報の管理
- **`.env` ファイル**: Firebase Admin SDKの秘密鍵などの機密情報を含むため、Git管理から除外されています
- **テストスクリプト**: 実際のトークンを含むスクリプトはGit管理から除外されています
- **サンプルファイル**: `scripts/*.example.sh` ファイルは機密情報を含まないサンプルです
- **APIクライアント例**: `scripts/sample_request.json` は機密情報を含まないサンプルです

### 推奨事項
1. **環境変数の使用**: 機密情報は必ず環境変数で管理してください
2. **トークンの有効期限**: Firebase IDトークンは1時間で期限切れになります
3. **本番環境**: 本番環境では適切なセキュリティルールを設定してください

## 注意事項
- Firestoreのコレクション名やスキーマは `src/schema/schema.graphql` および `src/models/` を参照してください。
- Firebaseプロジェクトのサービスアカウント情報は `.env` に正しく設定してください。
- 認証が必要なAPIは、必ずFirebase IDトークンをリクエストヘッダーに付与してください。

---

何か不明点や追加要望があれば、`README.md`に追記してください。 