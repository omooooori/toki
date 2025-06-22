# APIテスト用スクリプト

このフォルダには、GraphQL APIをテストするためのBashスクリプトが含まれています。

## ファイル構成

### サンプルファイル（機密情報なし）
- `get_firebase_token.example.sh` - Firebase IDトークン取得のサンプル
- `sample_request.example.sh` - GraphQL APIテストのサンプル

### 実際のスクリプト（機密情報あり - Git管理外）
- `get_firebase_token.sh` - Firebase IDトークン取得
- `sample_request.sh` - 基本的なユーザー取得テスト
- `create_user_request.sh` - ユーザー作成テスト
- `create_auth_user.sh` - Firebase UIDでのユーザー作成
- `test_auth_user.sh` - 認証ユーザーの取得テスト
- `test_created_user.sh` - 作成されたユーザーの取得テスト

## セットアップ手順

### 1. サンプルファイルをコピー
```bash
# Firebase IDトークン取得スクリプト
cp get_firebase_token.example.sh get_firebase_token.sh

# GraphQL APIテストスクリプト
cp sample_request.example.sh sample_request.sh
```

### 2. 設定値を編集
各ファイル内の以下の値を実際の値に置き換えてください：

#### get_firebase_token.sh
```bash
API_KEY="YOUR_FIREBASE_WEB_API_KEY"
EMAIL="YOUR_EMAIL@example.com"
PASSWORD="YOUR_PASSWORD"
```

#### sample_request.sh
```bash
TOKEN="YOUR_FIREBASE_ID_TOKEN"
USER_ID="YOUR_USER_ID"
```

## 使用方法

### Firebase IDトークンの取得
```bash
./scripts/get_firebase_token.sh
```

### GraphQL APIのテスト
```bash
./scripts/sample_request.sh
```

### ユーザー作成のテスト
```bash
./scripts/create_auth_user.sh
```

### ユーザー取得のテスト
```bash
./scripts/test_auth_user.sh
```

## 注意事項

- 実際のスクリプトファイル（機密情報を含む）はGit管理から除外されています
- サンプルファイル（`.example.sh`）のみGitで管理されています
- 各開発者は自分の環境で設定を行ってください
- Firebase IDトークンは1時間で期限切れになります

## トラブルシューティング

### 権限エラーが発生する場合
```bash
chmod +x scripts/*.sh
```

### サーバーが起動していない場合
```bash
npm run dev
```

### トークンが無効な場合
```bash
./scripts/get_firebase_token.sh
```
で新しいトークンを取得してください。 