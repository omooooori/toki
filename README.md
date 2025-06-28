# AutoDiary（Toki）- AI日記アプリ

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-development-orange.svg)](https://github.com/your-repo/toki)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/omooooori/toki?utm_source=oss&utm_medium=github&utm_campaign=omooooori%2Ftoki&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

## 📖 概要

AutoDiary（Toki）は、ユーザーの位置情報・写真・カレンダー予定をもとに、毎日を自動で記録・提案するAI日記アプリです。

### 🎯 解決したい課題
- 忙しい生活の中で、日々の出来事や気持ちを記録する余裕がない
- 手書き日記やSNSは手間がかかり継続しにくい
- 記憶は曖昧になり、大切な日常の断片が自然に失われてしまう

### 🌱 提供したい価値
- 「気づいたら記録されている」自然な日記体験
- 写真・位置・予定をもとにAIが自然な文章を生成
- 自動で人生をアーカイブし、後から楽しく見返せる

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
│   ├── environment-setup.md  # 環境設定ガイド
│   └── diagrams/        # アーキテクチャ図
├── scripts/
│   └── setup-env.sh     # 環境設定セットアップスクリプト
├── env.example          # 統合環境設定例
└── README.md
```

---

## 🚀 クイックスタート

### 前提条件
- Node.js 18+
- Flutter 3.0+
- Firebase プロジェクト（認証・Firestore用）
- OpenAI API キー

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-repo/toki.git
cd toki

# 依存関係のインストール
npm run install:all

# 環境変数の設定（自動セットアップ）
./scripts/setup-env.sh

# プロジェクトルートの .env ファイルを編集して実際の値を設定
# 例: FIREBASE_PROJECT_ID=your-actual-project-id

# 設定ファイルを再生成
./scripts/setup-env.sh

# 開発サーバーの起動
npm run dev
```

### 環境設定の詳細

環境設定については、[環境設定ガイド](./docs/environment-setup.md)を参照してください。

**セットアップスクリプトの機能：**
- ✅ プロジェクトルートの `.env` ファイルから各アプリケーション用の設定ファイルを自動生成
- ✅ 色付きの出力で分かりやすい進行状況表示
- ✅ 設定ファイルの権限自動設定
- ✅ 一元管理された環境設定

**設定の流れ：**
1. `env.example` を `.env` にコピー
2. `.env` ファイルに実際の値を設定
3. スクリプトを実行して各アプリケーション用の設定ファイルを生成

必要な主な設定：
- **Firebase設定**: プロジェクトID、APIキー、秘密鍵
- **OpenAI設定**: APIキー、使用モデル
- **サーバー設定**: ポート、CORS設定、JWT秘密鍵

### 各アプリケーションの起動

```bash
# Webアプリ (http://localhost:3000)
npm run dev:web

# APIサーバー (http://localhost:4000)
npm run dev:api

# モバイルアプリ
cd apps/mobile && flutter run
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

## 📌 機能要件（MVP）

### ✅ 実装済み
- [x] 基本的なモノレポ構成
- [x] GraphQLスキーマ設計
- [x] Flutterアプリの基本構造
- [x] Next.js Webアプリの基本構造
- [x] 共有型定義とユーティリティ

### 🚧 開発中
- [ ] 位置情報の自動取得（滞在場所＋時間）
- [ ] 写真との自動紐づけ（Google Photos APIなど）
- [ ] カレンダーから予定情報の取得（Google Calendar）
- [ ] AIによる日記生成（OpenAI API等）
- [ ] 編集・保存・削除機能
- [ ] カレンダーUIによる振り返り
- [ ] 週次／月次のハイライト自動生成

---

## 🚀 非機能要件・技術的考慮事項

- **起動時間**: 1秒以内
- **AI応答**: 3秒以内
- **バッテリー最適化**: バックグラウンド位置取得の制御
- **プライバシー対応**: オンデバイス処理の検討（Edge AI）
- **セキュリティ**: Firebase AuthとFirestore Security Rulesの併用
- **スケーラビリティ**: GraphQL BFFの導入による柔軟なフロント接続

---

## 🛠️ 開発ガイド

### 新しい機能の追加

1. 適切なパッケージ/アプリに機能を追加
2. 型定義を `packages/shared` に追加
3. GraphQLスキーマを更新
4. テストを追加
5. リントを実行してコード品質を確認

### テスト

```bash
# 全テスト実行
npm run test

# 個別テスト
npm run test:web   # Webアプリのテスト
npm run test:api   # APIのテスト
```

### リント

```bash
# 全リント実行
npm run lint

# 個別リント
npm run lint:web   # Webアプリのリント
npm run lint:api   # APIのリント
```

### ビルド

```bash
# 全ビルド
npm run build

# 個別ビルド
npm run build:web  # Webアプリのビルド
npm run build:api  # APIのビルド
```

### コミットメッセージ

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `style:` コードスタイル修正
- `refactor:` リファクタリング
- `test:` テスト追加・修正
- `chore:` その他の変更

---

## 📚 ドキュメント

- [プロジェクト仕様書](./docs/project_spec.md)
- [アーキテクチャ図](./docs/diagrams/)
- [API仕様](./packages/shared/src/graphql/schema.graphql)

---

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

---

## 🙏 謝辞

このプロジェクトは、忙しい日常の中で大切な瞬間を記録したいという想いから生まれました。AI技術の発展により、自然な形で日記を書くことができるようになりました。

