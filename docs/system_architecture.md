# Toki AutoDiary システムアーキテクチャ

## 概要

Toki AutoDiaryは、モノレポ構成のAI日記アプリケーションで、以下のコンポーネントで構成されています：

- **モバイルアプリ** (Flutter)
- **Webアプリ** (Next.js)
- **バックエンドAPI** (GraphQL + Express)
- **AIサービス** (OpenAI/Vertex AI)
- **データベース** (Firestore + SQLite)
- **認証** (Firebase Auth)

## システム構成図

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   モバイルアプリ   │    │    Webアプリ     │    │   バックエンド    │
│   (Flutter)     │    │   (Next.js)     │    │  (GraphQL)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ローカルDB     │    │   Apollo Client │    │   Firestore     │
│   (SQLite)      │    │   (GraphQL)     │    │   (Cloud DB)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   位置情報サービス │    │   認証サービス   │    │   AIサービス     │
│   (Geolocator)  │    │  (Firebase Auth)│    │  (OpenAI/Vertex)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## コンポーネント詳細

### 1. モバイルアプリ (apps/mobile)

#### アーキテクチャ
- **フレームワーク**: Flutter + Riverpod
- **データベース**: Drift (SQLite)
- **ナビゲーション**: GoRouter
- **状態管理**: Riverpod

#### 主要サービス

##### AutoDiaryService
```dart
// 自動日記生成の管理
class AutoDiaryService {
  // バックグラウンドアラーム設定
  Future<void> scheduleAutoDiaryGeneration(TimeOfDay time)
  
  // 手動日記生成
  Future<void> generateDiaryManually()
}
```

##### LocationTrackingService
```dart
// 位置情報の自動追跡
class LocationTrackingService {
  // 追跡開始（5分間隔、100m以上移動時記録）
  Future<void> startTracking()
  
  // 位置情報変更時の処理
  Future<void> _onLocationChanged(location_package.LocationData data)
}
```

##### AIDiaryService
```dart
// AI日記生成
class AIDiaryService {
  // 指定日の位置情報から日記生成
  Future<String?> generateDiaryForDate(DateTime date)
  
  // OpenAI API呼び出し
  Future<String?> _callOpenAI(String prompt)
}
```

#### データフロー

1. **アプリ起動**
   ```
   main() → AutoDiaryService.initialize() → AndroidAlarmManager.initialize()
   ```

2. **位置情報追跡**
   ```
   LocationTrackingService.startTracking() → 
   _onLocationChanged() → 
   LocationService.getDetailedLocationData() → 
   AppDatabase.insertLocationHistory()
   ```

3. **自動日記生成**
   ```
   AndroidAlarmManager (毎日指定時刻) → 
   _generateDiaryCallback() → 
   AIDiaryService.generateDiaryForDate() → 
   AppDatabase.insertDiaryEntry()
   ```

### 2. バックエンド (backend)

#### アーキテクチャ
- **フレームワーク**: Express + Apollo Server
- **データベース**: Firestore
- **認証**: Firebase Auth
- **API**: GraphQL

#### 主要コンポーネント

##### GraphQLスキーマ
```graphql
type Diary {
  id: ID!
  userId: ID!
  date: Date!
  generatedText: String!
  editedText: String
  photos: [Photo!]!
}

type LocationVisit {
  id: ID!
  userId: ID!
  latitude: Float!
  longitude: Float!
  placeName: String
  address: String
  visitedAt: DateTime!
  durationMinutes: Int
}
```

##### 認証ミドルウェア
```typescript
// Firebase Auth トークン検証
export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.substring(7);
  const decodedToken = await admin.auth().verifyIdToken(token);
  req.user = { uid: decodedToken.uid, email: decodedToken.email };
  next();
};
```

#### データフロー

1. **GraphQLリクエスト処理**
   ```
   HTTP Request → authMiddleware → Apollo Server → Resolver → Firestore
   ```

2. **日記作成**
   ```
   createDiary Mutation → diaryResolvers → DiaryRepository → Firestore
   ```

### 3. AIサービス (packages/ai)

#### アーキテクチャ
- **プロバイダー**: OpenAI GPT-3.5/4, Vertex AI
- **機能**: 日記生成、感情分析、トピック抽出

#### 主要サービス

##### DiaryGeneratorService
```typescript
export class DiaryGeneratorService {
  // 日記生成
  async generateDiary(input: DiaryGenerationInput): Promise<DiaryGenerationResult>
  
  // 日記分析
  async analyzeDiary(content: string): Promise<AIAnalysisResult>
}
```

##### OpenAIService
```typescript
export class OpenAIService {
  // プロンプト構築
  private buildDiaryGenerationPrompt(input: DiaryGenerationInput): string
  
  // API呼び出し
  async generateDiary(input: DiaryGenerationInput): Promise<DiaryGenerationResult>
}
```

#### データフロー

1. **日記生成**
   ```
   DiaryGenerationInput → Prompt構築 → OpenAI API → レスポンス解析 → DiaryGenerationResult
   ```

2. **日記分析**
   ```
   Diary Content → Analysis Prompt → OpenAI API → レスポンス解析 → AIAnalysisResult
   ```

### 4. Webアプリ (apps/web)

#### アーキテクチャ
- **フレームワーク**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks
- **GraphQL**: Apollo Client

#### 主要コンポーネント

```typescript
// メインページ
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <h1>Toki - AI日記アプリ</h1>
      {/* 機能説明 */}
    </main>
  )
}
```

## データベース設計

### ローカルデータベース (SQLite)

#### DiaryEntries テーブル
```sql
CREATE TABLE diary_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  summary TEXT NOT NULL,
  imageUrl TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

#### LocationHistory テーブル
```sql
CREATE TABLE location_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  placeName TEXT,
  buildingName TEXT,
  streetName TEXT,
  neighborhood TEXT,
  formattedAddress TEXT,
  timestamp DATETIME NOT NULL
);
```

### クラウドデータベース (Firestore)

#### コレクション構造
```
users/
  {userId}/
    profile: { name, email, createdAt }
    
diaries/
  {diaryId}/
    userId: string
    date: timestamp
    generatedText: string
    editedText: string
    createdAt: timestamp
    updatedAt: timestamp

location_visits/
  {visitId}/
    userId: string
    latitude: number
    longitude: number
    placeName: string
    address: string
    visitedAt: timestamp
    durationMinutes: number

photos/
  {photoId}/
    userId: string
    imageUrl: string
    takenAt: timestamp
    relatedLocationId: string
```

## セキュリティ

### 認証フロー
1. **Firebase Auth**でユーザー認証
2. **ID Token**をクライアントで取得
3. **GraphQLリクエスト**でAuthorizationヘッダーにBearer Tokenを設定
4. **バックエンド**でトークン検証
5. **Firestore Security Rules**でデータアクセス制御

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /diaries/{diaryId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## パフォーマンス最適化

### モバイルアプリ
- **バッテリー最適化**: 位置情報取得間隔を5分に設定
- **データベース**: Driftによる効率的なSQLite操作
- **画像処理**: 圧縮とキャッシュ

### バックエンド
- **GraphQL**: 必要なデータのみ取得
- **Firestore**: インデックス最適化
- **キャッシュ**: Redis導入予定

### AIサービス
- **プロンプト最適化**: トークン数を最小化
- **フォールバック**: API失敗時の代替処理
- **レート制限**: API呼び出し頻度制御

## 監視・ログ

### ログ戦略
- **モバイル**: print文によるデバッグログ
- **バックエンド**: console.log + 構造化ログ
- **AIサービス**: エラーログ + 成功メトリクス

### メトリクス
- **日記生成成功率**
- **位置情報取得頻度**
- **API応答時間**
- **エラー率**

## 今後の拡張予定

### 短期目標
1. **認証システム**の完全実装
2. **写真連携**機能の追加
3. **カレンダー連携**の実装

### 中期目標
1. **リアルタイム同期**の実装
2. **オフライン対応**の強化
3. **分析機能**の拡張

### 長期目標
1. **機械学習**による行動予測
2. **音声入力**機能
3. **ソーシャル機能**の追加 