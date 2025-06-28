# 環境設定ガイド

このドキュメントでは、Toki AI日記アプリの環境設定について説明します。

## 概要

Tokiアプリは以下の3つのアプリケーションで構成されています：

1. **バックエンド（Node.js/Express）** - GraphQL APIサーバー
2. **Webアプリ（Next.js）** - Web版の日記アプリ
3. **モバイルアプリ（Flutter）** - モバイル版の日記アプリ

これらのアプリケーションは、それぞれ異なる環境変数やAPIキーを必要としますが、プロジェクトルートの `env.example` ファイルに統合されています。

## クイックセットアップ

### 1. 自動セットアップ（推奨）

```bash
# セットアップスクリプトを実行
./scripts/setup-env.sh

# プロジェクトルートの .env ファイルを編集して実際の値を設定
# 例: FIREBASE_PROJECT_ID=your-actual-project-id

# 設定ファイルを再生成
./scripts/setup-env.sh
```

このスクリプトは以下の処理を自動で実行します：
- プロジェクトルートの `env.example` を `.env` にコピー（初回のみ）
- プロジェクトルートの `.env` ファイルから各アプリケーション用の環境設定ファイルを生成
- モバイルアプリ用の設定ファイルを生成

### 2. 手動セットアップ

```bash
# プロジェクトルートに .env ファイルを作成
cp env.example .env

# .env ファイルを編集して実際の値を設定

# スクリプトを実行して各アプリケーション用の設定ファイルを生成
./scripts/setup-env.sh
```

## 必要な環境変数

### バックエンド（backend/.env）

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `FIREBASE_PROJECT_ID` | FirebaseプロジェクトID | ✅ |
| `FIREBASE_PRIVATE_KEY` | Firebase秘密鍵 | ✅ |
| `FIREBASE_CLIENT_EMAIL` | Firebaseクライアントメール | ✅ |
| `OPENAI_API_KEY` | OpenAI APIキー | ✅ |
| `OPENAI_MODEL` | 使用するOpenAIモデル | ❌ |
| `PORT` | サーバーポート | ❌ |
| `NODE_ENV` | 環境（development/production） | ❌ |
| `CORS_ORIGIN` | CORS許可オリジン | ❌ |
| `JWT_SECRET` | JWT秘密鍵 | ✅ |
| `JWT_EXPIRES_IN` | JWT有効期限 | ❌ |

### Webアプリ（apps/web/.env.local）

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase APIキー | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase認証ドメイン | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | FirebaseプロジェクトID | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebaseストレージバケット | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebaseメッセージング送信者ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | FirebaseアプリID | ✅ |
| `NEXT_PUBLIC_API_BASE_URL` | APIベースURL | ❌ |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | GraphQLエンドポイント | ❌ |

### モバイルアプリ（apps/mobile/lib/config/app_config.dart）

モバイルアプリでは、`AppConfig` クラスで設定を管理します：

```dart
class AppConfig {
  // API設定
  static const String apiBaseUrl = 'http://localhost:4000';
  static const String graphqlEndpoint = '$apiBaseUrl/graphql';
  
  // OpenAI設定
  static const String openaiApiKey = 'YOUR_OPENAI_API_KEY';
  static const String openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  
  // Firebase設定
  static const String firebaseApiKey = 'YOUR_FIREBASE_API_KEY';
  static const String firebaseAuthDomain = 'your-project-id.firebaseapp.com';
  // ... その他の設定
}
```

## 設定の取得方法

### Firebase設定

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクトを作成または選択
3. プロジェクト設定 → サービスアカウント
4. 「新しい秘密鍵の生成」をクリック
5. ダウンロードしたJSONファイルから必要な値を取得

### OpenAI設定

1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. API Keys セクションで新しいキーを作成
3. 作成したキーをコピー

## セキュリティに関する注意事項

### 機密情報の管理

- `.env` ファイルは `.gitignore` に含まれているため、バージョン管理されません
- 機密情報（APIキー、秘密鍵など）は絶対にGitにコミットしないでください
- 本番環境では、環境変数管理サービス（AWS Secrets Manager、Google Secret Manager等）の使用を推奨

### クライアントサイドでのAPIキー使用

- `NEXT_PUBLIC_` で始まる環境変数は、クライアントサイドで利用可能になります
- 機密性の高いAPIキー（OpenAI APIキーなど）は、サーバーサイドでのみ使用してください
- クライアントサイドで必要な場合は、プロキシAPIを経由してアクセスしてください

## 環境別設定

### 開発環境

```bash
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### 本番環境

```bash
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
```

本番環境では、以下の設定も必要です：

```bash
PRODUCTION_API_BASE_URL=https://your-api-domain.com
PRODUCTION_GRAPHQL_ENDPOINT=https://your-api-domain.com/graphql
```

## トラブルシューティング

### よくある問題

1. **環境変数が読み込まれない**
   - ファイル名が正しいか確認（`.env`、`.env.local`）
   - ファイルの場所が正しいか確認
   - アプリケーションを再起動

2. **Firebase接続エラー**
   - プロジェクトIDが正しいか確認
   - 秘密鍵の形式が正しいか確認（改行文字 `\n` が含まれているか）
   - サービスアカウントの権限を確認

3. **OpenAI APIエラー**
   - APIキーが正しいか確認
   - APIキーに十分なクレジットがあるか確認
   - 使用するモデルが利用可能か確認

### ログの確認

```bash
# バックエンドのログ
cd backend && npm run dev

# Webアプリのログ
cd apps/web && npm run dev
```

## サポート

環境設定で問題が発生した場合は、以下を確認してください：

1. このドキュメントの内容
2. 各アプリケーションのREADMEファイル
3. プロジェクトのIssuesページ

追加のサポートが必要な場合は、プロジェクトメンテナーに連絡してください。

## 設定の管理方法

### プロジェクトルートの .env ファイル

プロジェクトルートの `.env` ファイルが設定の中心となります。このファイルを編集することで、全てのアプリケーションの設定を一元管理できます。

```bash
# 設定を変更する場合
vim .env  # またはお好みのエディタ

# 変更後、設定ファイルを再生成
./scripts/setup-env.sh
```

### 生成されるファイル

以下のファイルは自動生成されるため、直接編集しないでください：
- `backend/.env` - バックエンド用環境変数
- `apps/web/.env.local` - Webアプリ用環境変数
- `apps/mobile/lib/config/app_config.dart` - モバイルアプリ用設定 