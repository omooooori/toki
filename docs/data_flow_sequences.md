# Toki AutoDiary データフロー・シーケンス図

## 概要

このドキュメントでは、Toki AutoDiaryアプリケーションの主要なデータフローとシーケンスを詳しく説明します。

## 1. アプリケーション起動シーケンス

### モバイルアプリ起動

```mermaid
sequenceDiagram
    participant User
    participant App as Flutter App
    participant AutoService as AutoDiaryService
    participant AlarmManager as AndroidAlarmManager
    participant Database as SQLite DB

    User->>App: アプリを起動
    App->>AutoService: initialize()
    AutoService->>AlarmManager: AndroidAlarmManager.initialize()
    AutoService->>Database: AppDatabase()
    App->>App: メイン画面を表示
    Note over App: ホーム画面、ナビゲーション設定
```

### バックエンド起動

```mermaid
sequenceDiagram
    participant Server as Express Server
    participant Apollo as Apollo Server
    participant Firebase as Firebase Admin
    participant Firestore as Firestore DB

    Server->>Apollo: ApolloServer初期化
    Apollo->>Server: GraphQLスキーマ読み込み
    Server->>Firebase: Firebase Admin初期化
    Firebase->>Firestore: 接続確認
    Server->>Server: ポート4000でリッスン開始
```

## 2. 位置情報追跡シーケンス

### 位置情報追跡開始

```mermaid
sequenceDiagram
    participant User
    participant App as Flutter App
    participant LocationService as LocationTrackingService
    participant Geolocator as Geolocator
    participant Database as SQLite DB

    User->>App: 位置情報追跡開始
    App->>LocationService: startTracking()
    LocationService->>Geolocator: 権限チェック
    Geolocator-->>LocationService: 権限許可
    LocationService->>Geolocator: onLocationChanged.listen()
    Note over LocationService: 5分間隔で位置情報監視開始
```

### 位置情報取得・保存

```mermaid
sequenceDiagram
    participant Geolocator as Geolocator
    participant LocationService as LocationTrackingService
    participant Geocoding as Geocoding Service
    participant Database as SQLite DB

    Geolocator->>LocationService: 位置情報変更通知
    LocationService->>LocationService: 移動距離計算
    alt 100m以上移動
        LocationService->>Geocoding: 逆ジオコーディング
        Geocoding-->>LocationService: 詳細住所情報
        LocationService->>Database: insertLocationHistory()
        Database-->>LocationService: 保存完了
    else 100m未満移動
        LocationService->>LocationService: 記録スキップ
    end
```

## 3. 自動日記生成シーケンス

### バックグラウンド日記生成

```mermaid
sequenceDiagram
    participant AlarmManager as AndroidAlarmManager
    participant AutoService as AutoDiaryService
    participant AIService as AIDiaryService
    participant Database as SQLite DB
    participant OpenAI as OpenAI API

    AlarmManager->>AutoService: _generateDiaryCallback()
    AutoService->>Database: getLocationHistory()
    Database-->>AutoService: 昨日の位置情報履歴
    AutoService->>AIService: generateDiaryForDate()
    AIService->>AIService: 位置情報をテキスト形式に変換
    AIService->>OpenAI: 日記生成プロンプト送信
    OpenAI-->>AIService: 生成された日記テキスト
    AIService-->>AutoService: 日記内容
    AutoService->>Database: insertDiaryEntry()
    Database-->>AutoService: 保存完了
```

### 手動日記生成

```mermaid
sequenceDiagram
    participant User
    participant App as Flutter App
    participant AutoService as AutoDiaryService
    participant AIService as AIDiaryService
    participant Database as SQLite DB
    participant OpenAI as OpenAI API

    User->>App: 手動日記生成ボタン
    App->>AutoService: generateDiaryManually()
    AutoService->>Database: getLocationHistory()
    Database-->>AutoService: 今日の位置情報履歴
    AutoService->>AIService: generateDiaryForDate()
    AIService->>OpenAI: 日記生成プロンプト送信
    OpenAI-->>AIService: 生成された日記テキスト
    AIService-->>AutoService: 日記内容
    AutoService->>Database: insertDiaryEntry()
    Database-->>AutoService: 保存完了
    AutoService-->>App: 生成完了通知
    App->>User: 日記表示
```

## 4. GraphQL API シーケンス

### 日記取得

```mermaid
sequenceDiagram
    participant Client as Web/Mobile Client
    participant Server as Express Server
    participant Auth as Auth Middleware
    participant Apollo as Apollo Server
    participant Resolver as Diary Resolver
    participant Firestore as Firestore DB

    Client->>Server: GraphQL Query (getDiary)
    Server->>Auth: トークン検証
    Auth-->>Server: 認証成功
    Server->>Apollo: GraphQL処理
    Apollo->>Resolver: getDiary()
    Resolver->>Firestore: 日記データ取得
    Firestore-->>Resolver: 日記データ
    Resolver-->>Apollo: 日記オブジェクト
    Apollo-->>Server: GraphQLレスポンス
    Server-->>Client: JSONレスポンス
```

### 日記作成

```mermaid
sequenceDiagram
    participant Client as Web/Mobile Client
    participant Server as Express Server
    participant Auth as Auth Middleware
    participant Apollo as Apollo Server
    participant Resolver as Diary Resolver
    participant Firestore as Firestore DB

    Client->>Server: GraphQL Mutation (createDiary)
    Server->>Auth: トークン検証
    Auth-->>Server: 認証成功
    Server->>Apollo: GraphQL処理
    Apollo->>Resolver: createDiary()
    Resolver->>Firestore: 日記データ保存
    Firestore-->>Resolver: 保存完了
    Resolver-->>Apollo: 作成された日記オブジェクト
    Apollo-->>Server: GraphQLレスポンス
    Server-->>Client: JSONレスポンス
```

## 5. AIサービス シーケンス

### 日記生成プロセス

```mermaid
sequenceDiagram
    participant Service as DiaryGeneratorService
    participant OpenAI as OpenAIService
    participant API as OpenAI API
    participant Parser as Response Parser

    Service->>OpenAI: generateDiary(input)
    OpenAI->>OpenAI: buildDiaryGenerationPrompt()
    OpenAI->>API: chat.completions.create()
    API-->>OpenAI: AI応答
    OpenAI->>Parser: parseDiaryGenerationResponse()
    Parser-->>OpenAI: DiaryGenerationResult
    OpenAI-->>Service: 生成結果
```

### 日記分析プロセス

```mermaid
sequenceDiagram
    participant Service as DiaryGeneratorService
    participant OpenAI as OpenAIService
    participant API as OpenAI API
    participant Parser as Response Parser

    Service->>OpenAI: analyzeDiary(content)
    OpenAI->>OpenAI: DIARY_ANALYSIS_PROMPT構築
    OpenAI->>API: chat.completions.create()
    API-->>OpenAI: AI応答
    OpenAI->>Parser: parseAnalysisResponse()
    Parser-->>OpenAI: AIAnalysisResult
    OpenAI-->>Service: 分析結果
```

## 6. 認証フロー

### Firebase認証

```mermaid
sequenceDiagram
    participant User
    participant App as Flutter App
    participant Firebase as Firebase Auth
    participant Backend as Backend API
    participant Firestore as Firestore DB

    User->>App: ログイン
    App->>Firebase: signInWithEmailAndPassword()
    Firebase-->>App: ID Token
    App->>Backend: GraphQL Request + Bearer Token
    Backend->>Firebase: verifyIdToken()
    Firebase-->>Backend: 検証結果
    Backend->>Firestore: データアクセス
    Firestore-->>Backend: データ
    Backend-->>App: GraphQL Response
    App->>User: 認証完了
```

## 7. データ同期フロー

### ローカル→クラウド同期

```mermaid
sequenceDiagram
    participant App as Flutter App
    participant LocalDB as SQLite DB
    participant SyncService as Sync Service
    participant Backend as Backend API
    participant Firestore as Firestore DB

    App->>SyncService: 同期開始
    SyncService->>LocalDB: 未同期データ取得
    LocalDB-->>SyncService: 日記・位置情報データ
    SyncService->>Backend: バッチアップロード
    Backend->>Firestore: データ保存
    Firestore-->>Backend: 保存完了
    Backend-->>SyncService: 同期完了
    SyncService->>LocalDB: 同期状態更新
    SyncService-->>App: 同期完了通知
```

### クラウド→ローカル同期

```mermaid
sequenceDiagram
    participant App as Flutter App
    participant LocalDB as SQLite DB
    participant SyncService as Sync Service
    participant Backend as Backend API
    participant Firestore as Firestore DB

    App->>SyncService: 同期開始
    SyncService->>Backend: 最新データ取得
    Backend->>Firestore: データ取得
    Firestore-->>Backend: 最新データ
    Backend-->>SyncService: データ
    SyncService->>LocalDB: データ更新
    LocalDB-->>SyncService: 更新完了
    SyncService-->>App: 同期完了通知
```

## 8. エラーハンドリングフロー

### API エラー処理

```mermaid
sequenceDiagram
    participant Client as Client App
    participant Server as Backend Server
    participant Service as AI Service
    participant API as External API

    Client->>Server: API Request
    Server->>Service: 処理要求
    Service->>API: 外部API呼び出し
    API-->>Service: エラーレスポンス
    Service->>Service: フォールバック処理
    Service-->>Server: 代替結果
    Server-->>Client: エラーハンドリング済みレスポンス
```

### ネットワークエラー処理

```mermaid
sequenceDiagram
    participant App as Flutter App
    participant Network as Network Service
    participant LocalDB as SQLite DB
    participant Queue as Sync Queue

    App->>Network: API Request
    Network-->>App: ネットワークエラー
    App->>Queue: リクエストをキューに追加
    App->>LocalDB: ローカルデータ使用
    App->>Network: 定期的な再接続試行
    Network-->>App: 接続復旧
    App->>Queue: キューされたリクエスト実行
```

## 9. パフォーマンス最適化フロー

### バッテリー最適化

```mermaid
sequenceDiagram
    participant App as Flutter App
    participant LocationService as Location Service
    participant Battery as Battery Monitor
    participant Settings as App Settings

    App->>Battery: バッテリー状態監視
    Battery-->>App: 低バッテリー警告
    App->>Settings: 位置情報間隔調整
    Settings->>LocationService: 間隔を10分に変更
    LocationService->>LocationService: 新しい間隔で追跡継続
```

### データベース最適化

```mermaid
sequenceDiagram
    participant App as Flutter App
    participant Database as SQLite DB
    participant Cleanup as Cleanup Service

    App->>Cleanup: 定期的なクリーンアップ
    Cleanup->>Database: 古い位置情報削除
    Database-->>Cleanup: 削除完了
    Cleanup->>Database: インデックス最適化
    Database-->>Cleanup: 最適化完了
    Cleanup-->>App: クリーンアップ完了
```

## 10. 監視・ログフロー

### ログ収集

```mermaid
sequenceDiagram
    participant App as Flutter App
    participant Logger as Logger Service
    participant Analytics as Analytics Service
    participant Backend as Backend API

    App->>Logger: イベントログ
    Logger->>Analytics: メトリクス送信
    Analytics->>Backend: ログデータ送信
    Backend->>Backend: ログ保存・分析
    Backend-->>Analytics: 分析結果
    Analytics-->>Logger: 統計情報
    Logger-->>App: ログ完了通知
```

これらのシーケンス図は、Toki AutoDiaryアプリケーションの主要なデータフローと処理の流れを示しています。各コンポーネント間の相互作用と、データの流れを理解するのに役立ちます。 