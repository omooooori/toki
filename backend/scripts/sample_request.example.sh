#!/bin/bash

# このファイルはサンプルです。実際の値に置き換えて使用してください。
# 使用方法：
# 1. このファイルをコピーして sample_request.sh を作成
# 2. 以下の値を実際の値に置き換える
# 3. ./get_firebase_token.sh でトークンを取得する

# 認証情報（実際の値に置き換えてください）
TOKEN="YOUR_FIREBASE_ID_TOKEN"
USER_ID="YOUR_USER_ID"

echo "GraphQL APIをテスト中..."

curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "query GetUser($id: ID!) { getUser(id: $id) { id name createdAt } }",
    "variables": { "id": "'$USER_ID'" }
  }' 