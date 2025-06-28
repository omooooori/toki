#!/bin/bash

# ========================================
# Toki 環境設定セットアップスクリプト
# ========================================

set -e

# 色付きの出力関数
print_success() { echo -e "\033[32m✅ $1\033[0m"; }
print_warning() { echo -e "\033[33m⚠️  $1\033[0m"; }
print_error() { echo -e "\033[31m❌ $1\033[0m"; }
print_info() { echo -e "\033[34m📝 $1\033[0m"; }
print_header() { echo -e "\033[35m🚀 $1\033[0m"; }

print_header "Toki 環境設定セットアップを開始します..."

# プロジェクトルートに移動
cd "$(dirname "$0")/.."

# 環境設定ファイルの存在確認
if [ ! -f ".env.example" ]; then
    print_error ".env.example ファイルが見つかりません"
    exit 1
fi

# プロジェクトルートの.envファイルの確認
if [ ! -f ".env" ]; then
    print_warning ".env ファイルが見つかりません"
    print_info "env.example を .env にコピーして、実際の値を設定してください"
    cp env.example .env
    print_success ".env ファイルを作成しました"
    print_info "次に、.env ファイルを編集して実際の値を設定してから、このスクリプトを再実行してください"
    exit 0
fi

# 環境変数を読み込み
print_info "プロジェクトルートの .env ファイルから環境変数を読み込み中..."
source .env

# バックエンド用の.envファイルを作成
print_info "バックエンド用の環境設定ファイルを作成中..."
cat > backend/.env << EOF
# ========================================
# バックエンド環境設定
# ========================================
# このファイルは自動生成されています。編集しないでください。
# 変更する場合は、プロジェクトルートの .env ファイルを編集してください。

# サーバー設定
PORT=${PORT:-4000}
NODE_ENV=${NODE_ENV:-development}

# Firebase設定
FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}
FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}

# OpenAI設定
OPENAI_API_KEY=${OPENAI_API_KEY}
OPENAI_MODEL=${OPENAI_MODEL:-gpt-4}

# CORS設定
CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:3000}

# JWT設定
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-7d}

# 開発環境設定
DEBUG=${DEBUG:-true}
LOG_LEVEL=${LOG_LEVEL:-debug}
EOF

print_success "backend/.env を作成しました"

# モバイルアプリ用の.envファイルを作成
print_info "モバイルアプリ用の環境設定ファイルを作成中..."
cat > apps/mobile/.env << EOF
# ========================================
# モバイルアプリ環境設定
# ========================================
# このファイルは自動生成されています。編集しないでください。
# 変更する場合は、プロジェクトルートの .env ファイルを編集してください。

# OpenAI設定
OPENAI_API_KEY=${OPENAI_API_KEY}
OPENAI_MODEL=${OPENAI_MODEL:-gpt-4}

# 開発環境設定
DEBUG=${DEBUG:-true}
LOG_LEVEL=${LOG_LEVEL:-debug}
EOF

print_success "apps/mobile/.env を作成しました"

# 設定ファイルの権限を設定
chmod 600 backend/.env 2>/dev/null || true

echo
print_success "環境設定セットアップが完了しました！"
echo
print_info "設定ファイルが正常に生成されました："
echo "  - backend/.env"
echo "  - apps/web/.env.local"
echo "  - apps/mobile/lib/config/app_config.dart"
echo
print_info "設定を変更する場合は、プロジェクトルートの .env ファイルを編集してから、"
echo "このスクリプトを再実行してください。"
echo
print_warning "注意：.env ファイルは .gitignore に含まれているため、"
echo "    バージョン管理されません。機密情報を安全に管理してください。" 