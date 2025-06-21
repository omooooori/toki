# Toki

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-development-orange.svg)](https://github.com/your-repo/toki)

## 📖 概要

Tokiは、ユーザーの位置情報・写真・カレンダー予定をもとに、毎日を自動で記録・提案するAI日記アプリです。
「気づいたら記録されている」自然な日記体験を提供し、忙しい日常の中でも大切な瞬間を自動でアーカイブします。

---

## 📋 詳細仕様

AutoDiary（Toki）は、ユーザーの位置情報・写真・カレンダー予定をもとに、毎日を自動で記録・提案するAI日記アプリです。本ドキュメントでは、課題、要件、機能仕様、考慮事項、アーキテクチャ、システム構成を一元的に記述します。

---

## 🎯 解決したい課題
- 忙しい生活の中で、日々の出来事や気持ちを記録する余裕がない
- 手書き日記やSNSは手間がかかり継続しにくい
- 記憶は曖昧になり、大切な日常の断片が自然に失われてしまう

## 💡 着目した背景
- 自分自身や周囲の体験から「振り返りたいときには記憶がない」という課題を痛感
- スマートフォンやAI技術により、日常ログを自然に蓄積することが可能になってきている

## 🌱 提供したい価値
- 「気づいたら記録されている」自然な日記体験
- 写真・位置・予定をもとにAIが自然な文章を生成
- 自動で人生をアーカイブし、後から楽しく見返せる

---

## 📌 機能要件（MVP）
- 位置情報の自動取得（滞在場所＋時間）
- 写真との自動紐づけ（Google Photos APIなど）
- カレンダーから予定情報の取得（Google Calendar）
- AIによる日記生成（OpenAI API等）
- 編集・保存・削除機能
- カレンダーUIによる振り返り
- 週次／月次のハイライト自動生成

---

## 🚀 非機能要件・技術的考慮事項
- 起動時間：1秒以内
- AI応答：3秒以内
- バッテリー最適化：バックグラウンド位置取得の制御
- プライバシー対応：オンデバイス処理の検討（Edge AI）
- セキュリティ：Firebase AuthとFirestore Security Rulesの併用
- スケーラビリティ：GraphQL BFFの導入による柔軟なフロント接続

---

## 🧱 採用技術スタック
| レイヤ | 技術構成 |
|--------|----------|
| モバイル | Flutter + Riverpod + Drift |
| Web | Next.js + TypeScript + Apollo Client |
| バックエンド | GraphQL（Apollo Server / gqlgen）|
| データベース | Firestore または Cloud SQL + Prisma |
| 認証 | Firebase Auth（トークン検証）|
| AI生成 | OpenAI API / Vertex AI |
| インフラ | GCP（Cloud Run / Firebase / GitHub Actions）|

---

## 🏗️ アーキテクチャ

![システム構成図](docs/diagrams/Architecture.png)

---

## 🔧 システム構成図（データフロー）

![システムアーキテクチャ](docs/diagrams/SystemArchitecture.png)

---

## 📁 プロジェクト構成

```
toki/
├── README.md
├── scripts/
│   └── generate_readme.sh    # README生成スクリプト
└── docs/
    ├── project_spec.md        # 詳細設計ドキュメント
    └── diagrams/
        ├── architecture.pu    # アーキテクチャ図（PlantUML）
        ├── systemArchitecture.pu  # システム構成図（PlantUML）
        ├── Architecture.png
        ├── systemArchitecture.png
        └── generate_images.sh # 図表生成スクリプト
```

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

---

