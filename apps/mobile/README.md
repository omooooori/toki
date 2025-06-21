# Toki Mobile App

Flutterを使用したToki AI日記アプリのモバイル版です。

## 技術スタック

- **フレームワーク**: Flutter
- **状態管理**: Riverpod
- **ローカルDB**: Drift
- **GraphQL**: graphql_flutter
- **認証**: Firebase Auth

## セットアップ

```bash
# 依存関係のインストール
flutter pub get

# 開発サーバーの起動
flutter run
```

## プロジェクト構造

```
lib/
├── main.dart
├── app/
│   ├── app.dart
│   └── providers/
├── features/
│   ├── auth/
│   ├── diary/
│   └── ai/
├── shared/
│   ├── models/
│   ├── services/
│   └── utils/
└── generated/
    └── graphql/
```

## GraphQL型定義

`packages/shared`からGraphQLの型定義を共有しています。 