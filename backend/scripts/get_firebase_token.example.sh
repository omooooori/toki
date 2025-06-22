#!/bin/bash

# このファイルはサンプルです。実際の値に置き換えて使用してください。
# 使用方法：
# 1. このファイルをコピーして get_firebase_token.sh を作成
# 2. 以下の値を実際の値に置き換える

# Firebase Web APIキーを設定してください
API_KEY="YOUR_FIREBASE_WEB_API_KEY"

# Firebaseユーザーの認証情報を設定してください
EMAIL="YOUR_EMAIL@example.com"
PASSWORD="YOUR_PASSWORD"

echo "Firebase IDトークンを取得中..."

# Firebase Authentication REST APIを使用してIDトークンを取得
RESPONSE=$(curl -s 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='$API_KEY \
  -H 'Content-Type: application/json' \
  --data-binary '{"email":"'$EMAIL'","password":"'$PASSWORD'","returnSecureToken":true}')

# jqコマンドが利用可能な場合はjqを使用、そうでなければgrepを使用
if command -v jq &> /dev/null; then
    ID_TOKEN=$(echo $RESPONSE | jq -r '.idToken // empty')
    USER_ID=$(echo $RESPONSE | jq -r '.localId // empty')
else
    ID_TOKEN=$(echo $RESPONSE | grep -o '"idToken":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo $RESPONSE | grep -o '"localId":"[^"]*"' | cut -d'"' -f4)
fi

if [ -n "$ID_TOKEN" ] && [ "$ID_TOKEN" != "null" ]; then
    echo "✅ IDトークンの取得に成功しました！"
    echo ""
    echo "=== 取得した情報 ==="
    echo "ユーザーID: $USER_ID"
    echo "IDトークン: $ID_TOKEN"
    echo ""
    echo "=== sample_request.sh の設定例 ==="
    echo "TOKEN=\"$ID_TOKEN\""
    echo "USER_ID=\"$USER_ID\""
    echo ""
    echo "=== 使用方法 ==="
    echo "1. sample_request.sh を開く"
    echo "2. 上記のTOKENとUSER_IDを貼り付ける"
    echo "3. bash sample_request.sh を実行"
else
    echo "❌ IDトークンの取得に失敗しました"
    echo "レスポンス: $RESPONSE"
    echo ""
    echo "=== 確認事項 ==="
    echo "1. API_KEYが正しく設定されているか"
    echo "2. EMAILとPASSWORDが正しいか"
    echo "3. Firebase Consoleでユーザーが作成されているか"
fi 