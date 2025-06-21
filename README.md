# Toki

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-development-orange.svg)](https://github.com/your-repo/toki)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/omooooori/toki?utm_source=oss&utm_medium=github&utm_campaign=omooooori%2Ftoki&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

## 📖 概要

Tokiは、ユーザーの位置情報・写真・カレンダー予定をもとに、毎日を自動で記録・提案するAI日記アプリです。
「気づいたら記録されている」自然な日記体験を提供し、忙しい日常の中でも大切な瞬間を自動でアーカイブします。

---

## 🏗️ モノレポ構成

```
toki/
├── apps/
│   ├── mobile/          # Flutterモバイルアプリ
│   └── web/             # Next.js Webアプリ
├── packages/
│   ├── api/             # GraphQL BFF API
│   ├── db/              # データベース操作
│   ├── ai/              # AI連携モジュール
│   └── shared/          # 共有型定義・ユーティリティ
├── docs/
│   ├── project_spec.md  # プロジェクト仕様書
│   └── diagrams/        # アーキテクチャ図
└── README.md
```

---

## 🚀 クイックスタート

### 前提条件
- Node.js 18+
- Flutter 3.0+
- Docker (開発環境)

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-repo/toki.git
cd toki

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 各アプリケーションの起動

```bash
# Webアプリ
cd apps/web
npm run dev

# APIサーバー
cd packages/api
npm run dev

# モバイルアプリ
cd apps/mobile
flutter run
```

---

## 🧱 技術スタック

| レイヤ | 技術構成 |
|--------|----------|
| モバイル | Flutter + Riverpod + Drift |
| Web | Next.js + TypeScript + Apollo Client |
| バックエンド | GraphQL（Apollo Server）|
| データベース | Firestore / Cloud SQL + Prisma |
| 認証 | Firebase Auth |
| AI生成 | OpenAI API / Vertex AI |
| インフラ | GCP（Cloud Run + GitHub Actions）|

---

## 📋 機能要件（MVP）

- 位置情報の自動取得（滞在場所＋時間）
- 写真との自動紐づけ（Google Photos APIなど）
- カレンダーから予定情報の取得（Google Calendar）
- AIによる日記生成（OpenAI API等）
- 編集・保存・削除機能
- カレンダーUIによる振り返り
- 週次／月次のハイライト自動生成

---

## 🏗️ アーキテクチャ

![システム構成図](docs/diagrams/Architecture.png)

## 🔧 システム構成図（データフロー）

![システムアーキテクチャ](docs/diagrams/SystemArchitecture.png)

---

## 📚 ドキュメント

- [プロジェクト仕様書](docs/project_spec.md) - 詳細な要件・設計ドキュメント
- [アーキテクチャ図](docs/diagrams/) - PlantUMLによる構成図

### 図表の生成

```bash
# PlantUMLで画像を生成
cd docs
./generate_images.sh
```

---

## 🔧 開発

### GraphQLスキーマ駆動開発

1. `packages/shared/graphql/schema.graphql`でスキーマを定義
2. `npm run codegen`で型定義を生成
3. 各アプリケーションで型安全なGraphQL操作を実装

### パッケージ間の依存関係

```
packages/shared ← packages/api
packages/shared ← apps/web
packages/shared ← apps/mobile
```

---

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

---

