# Toki AutoDiary 実装詳細

## 概要

このドキュメントでは、Toki AutoDiaryアプリケーションの各コンポーネントの実装詳細とコードの説明を行います。

## 1. モバイルアプリ実装詳細

### 1.1 アプリケーション構造

#### メインエントリーポイント
```dart
// apps/mobile/lib/main.dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // ロケール初期化
  await initializeDateFormatting('ja_JP', null);
  
  // 自動日記生成サービスを初期化
  final autoDiaryService = AutoDiaryService();
  await autoDiaryService.initialize();
  
  // システムUI設定
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  
  await AndroidAlarmManager.initialize();
  runApp(const MyApp());
}
```

#### アプリケーション設定
```dart
// apps/mobile/lib/app.dart
final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const MainLayout(),
    ),
    GoRoute(
      path: '/diary/:id',
      builder: (context, state) {
        final diaryId = state.pathParameters['id']!;
        return DiaryDetailScreen(diaryId: diaryId);
      },
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
    ),
  ],
);
```

### 1.2 データベース実装

#### Driftデータベース設定
```dart
// apps/mobile/lib/data/local/database.dart
@DriftDatabase(tables: [DiaryEntries, LocationHistory])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 3;

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
        if (from < 2) {
          await m.createTable(locationHistory);
        }
        if (from < 3) {
          await m.addColumn(locationHistory, locationHistory.buildingName);
          await m.addColumn(locationHistory, locationHistory.streetName);
          await m.addColumn(locationHistory, locationHistory.neighborhood);
          await m.addColumn(locationHistory, locationHistory.formattedAddress);
        }
      },
    );
  }
}
```

#### テーブル定義
```dart
class DiaryEntries extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get date => text()();
  TextColumn get summary => text()();
  TextColumn? get imageUrl => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
}

class LocationHistory extends Table {
  IntColumn get id => integer().autoIncrement()();
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  TextColumn? get address => text().nullable()();
  TextColumn? get placeName => text().nullable()();
  TextColumn? get buildingName => text().nullable()();
  TextColumn? get streetName => text().nullable()();
  TextColumn? get neighborhood => text().nullable()();
  TextColumn? get formattedAddress => text().nullable()();
  DateTimeColumn get timestamp => dateTime()();
}
```

### 1.3 位置情報サービス実装

#### LocationTrackingService
```dart
// apps/mobile/lib/services/location_tracking_service.dart
class LocationTrackingService {
  static final LocationTrackingService _instance = LocationTrackingService._internal();
  factory LocationTrackingService() => _instance;
  LocationTrackingService._internal();

  final location_package.Location _location = location_package.Location();
  StreamSubscription<location_package.LocationData>? _locationSubscription;
  final AppDatabase _database = AppDatabase();
  
  // 追跡設定
  static const Duration _trackingInterval = Duration(minutes: 5); // 5分間隔
  static const double _minDistanceMeters = 100; // 100m以上移動した場合のみ記録
  
  bool _isTracking = false;
  DateTime? _lastLocationTime;
  LocationData? _lastLocation;
}
```

#### 位置情報追跡開始
```dart
Future<void> startTracking() async {
  if (_isTracking) return;

  // 権限チェック
  final hasPermission = await _location.hasPermission();
  if (hasPermission == location_package.PermissionStatus.denied) {
    final permission = await _location.requestPermission();
    if (permission != location_package.PermissionStatus.granted) {
      throw Exception('位置情報の権限が許可されていません');
    }
  }

  // 位置情報サービスが有効かチェック
  final isEnabled = await _location.serviceEnabled();
  if (!isEnabled) {
    final enabled = await _location.requestService();
    if (!enabled) {
      throw Exception('位置情報サービスが有効になっていません');
    }
  }

  _isTracking = true;
  
  // 位置情報の変更を監視
  _locationSubscription = _location.onLocationChanged.listen(_onLocationChanged);
  
  print('位置情報追跡を開始しました');
}
```

#### 位置情報変更処理
```dart
Future<void> _onLocationChanged(location_package.LocationData packageLocationData) async {
  if (!_isTracking) return;

  final now = DateTime.now();
  
  // 前回の位置情報と比較して、移動距離を計算
  if (_lastLocation != null) {
    final distance = Geolocator.distanceBetween(
      _lastLocation!.latitude,
      _lastLocation!.longitude,
      packageLocationData.latitude ?? 0,
      packageLocationData.longitude ?? 0,
    );
    
    // 最小移動距離未満の場合は記録しない
    if (distance < _minDistanceMeters) {
      return;
    }
  }

  try {
    // 詳細な位置情報を取得
    final locationService = LocationService();
    final locationData = await locationService.getDetailedLocationData(
      packageLocationData.latitude ?? 0,
      packageLocationData.longitude ?? 0,
      now,
    );

    await _saveLocationData(locationData);
    
    _lastLocation = locationData;
    _lastLocationTime = now;
    
    print('位置情報を記録しました: ${locationData.displayName}');
    
  } catch (e) {
    print('位置情報の保存に失敗しました: $e');
  }
}
```

### 1.4 AI日記生成サービス実装

#### AIDiaryService
```dart
// apps/mobile/lib/services/ai_diary_service.dart
class AIDiaryService {
  static final AIDiaryService _instance = AIDiaryService._internal();
  factory AIDiaryService() => _instance;
  AIDiaryService._internal();

  // OpenAI API設定
  static const String _openaiApiKey = 'YOUR_OPENAI_API_KEY';
  static const String _openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
}
```

#### 日記生成メソッド
```dart
Future<String?> generateDiaryForDate(DateTime date) async {
  try {
    // データベースから位置情報履歴を取得
    final database = AppDatabase();
    final startOfDay = DateTime(date.year, date.month, date.day);
    final endOfDay = startOfDay.add(const Duration(days: 1));
    
    final locationHistory = await database.getLocationHistory(
      startDate: startOfDay,
      endDate: endOfDay,
    );
    
    await database.close();

    if (locationHistory.isEmpty) {
      print('位置情報履歴が見つかりません: ${DateFormat('yyyy-MM-dd').format(date)}');
      return null;
    }

    // 位置情報を時系列で整理
    final sortedLocations = locationHistory
      ..sort((a, b) => a.timestamp.compareTo(b.timestamp));

    // 位置情報をテキスト形式に変換
    final locationText = _formatLocationHistory(sortedLocations);
    
    // AIに送信するプロンプトを作成
    final prompt = _createDiaryPrompt(date, locationText);
    
    // OpenAI APIを呼び出し
    final diaryContent = await _callOpenAI(prompt);
    
    return diaryContent;
  } catch (e) {
    print('AI日記生成エラー: $e');
    return null;
  }
}
```

#### プロンプト構築
```dart
String _createDiaryPrompt(DateTime date, String locationText) {
  final dateStr = DateFormat('yyyy年M月d日 (E)', 'ja_JP').format(date);
  
  return '''
以下の位置情報履歴を基に、その日の日記を自然な日本語で書いてください。

日付: $dateStr

位置情報履歴:
$locationText

指示:
1. 位置情報から推測できる活動や移動を自然に描写してください
2. 時間の流れに沿って、その日の出来事を物語のように書いてください
3. 感情や印象も含めて、個人的な体験として書いてください
4. 300-500文字程度で書いてください
5. 敬語は使わず、親しみやすい文体で書いてください

日記:
''';
}
```

#### OpenAI API呼び出し
```dart
Future<String?> _callOpenAI(String prompt) async {
  if (_openaiApiKey == 'YOUR_OPENAI_API_KEY') {
    print('OpenAI APIキーが設定されていません');
    return _generateMockDiary(prompt);
  }

  try {
    final response = await http.post(
      Uri.parse(_openaiApiUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_openaiApiKey',
      },
      body: jsonEncode({
        'model': 'gpt-3.5-turbo',
        'messages': [
          {
            'role': 'system',
            'content': 'あなたは親しみやすい日記作家です。位置情報を基に、その日の出来事を自然で魅力的な日記として書いてください。',
          },
          {
            'role': 'user',
            'content': prompt,
          },
        ],
        'max_tokens': 1000,
        'temperature': 0.7,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final content = data['choices'][0]['message']['content'];
      return content.trim();
    } else {
      print('OpenAI API エラー: ${response.statusCode} - ${response.body}');
      return _generateMockDiary(prompt);
    }
  } catch (e) {
    print('OpenAI API 呼び出しエラー: $e');
    return _generateMockDiary(prompt);
  }
}
```

### 1.5 自動日記生成サービス実装

#### AutoDiaryService
```dart
// apps/mobile/lib/services/auto_diary_service.dart
class AutoDiaryService {
  static final AutoDiaryService _instance = AutoDiaryService._internal();
  factory AutoDiaryService() => _instance;
  AutoDiaryService._internal();

  static const int _alarmId = 1001;
  static const String _alarmTimeKey = 'auto_diary_alarm_time';
}
```

#### アラーム設定
```dart
Future<void> scheduleAutoDiaryGeneration(TimeOfDay time) async {
  try {
    // 既存のアラームをキャンセル
    await AndroidAlarmManager.cancel(_alarmId);
    
    // 新しいアラームを設定
    final now = DateTime.now();
    var scheduledTime = DateTime(
      now.year,
      now.month,
      now.day,
      time.hour,
      time.minute,
    );
    
    // 今日の設定時刻が過ぎている場合は明日に設定
    if (scheduledTime.isBefore(now)) {
      scheduledTime = scheduledTime.add(const Duration(days: 1));
    }
    
    final scheduledTimeInMillis = scheduledTime.millisecondsSinceEpoch;
    
    await AndroidAlarmManager.periodic(
      const Duration(days: 1),
      _alarmId,
      _generateDiaryCallback,
      exact: true,
      wakeup: true,
      rescheduleOnReboot: true,
      startAt: DateTime.fromMillisecondsSinceEpoch(scheduledTimeInMillis),
    );
    
    // 設定時刻を保存
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_alarmTimeKey, '${time.hour}:${time.minute}');
    
    print('自動日記生成アラームを設定しました: ${DateFormat('HH:mm').format(scheduledTime)}');
  } catch (e) {
    print('自動日記生成アラーム設定エラー: $e');
  }
}
```

#### バックグラウンド日記生成
```dart
@pragma('vm:entry-point')
Future<void> _generateDiaryCallback() async {
  print('自動日記生成を開始します');
  await _generateDiaryForYesterday();
}

Future<void> _generateDiaryForYesterday() async {
  try {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    final dateStr = DateFormat('yyyy-MM-dd').format(yesterday);
    
    print('$dateStr の日記を生成中...');
    
    // データベースをチェックして、既に日記が存在するか確認
    final database = AppDatabase();
    final existingDiary = await database.getDiaryEntryByDate(dateStr);
    
    if (existingDiary != null) {
      print('$dateStr の日記は既に存在します');
      await database.close();
      return;
    }
    
    // AI日記生成サービスを使用して日記を生成
    final aiService = AIDiaryService();
    final diaryContent = await aiService.generateDiaryForDate(yesterday);
    
    if (diaryContent != null) {
      // 日記をデータベースに保存
      final diaryData = DiaryEntryData(
        date: dateStr,
        summary: diaryContent,
        createdAt: yesterday,
        updatedAt: DateTime.now(),
      );
      
      await database.insertDiaryEntry(diaryData);
      print('$dateStr の日記を生成・保存しました');
    } else {
      print('$dateStr の日記生成に失敗しました');
    }
    
    await database.close();
  } catch (e) {
    print('自動日記生成エラー: $e');
  }
}
```

## 2. バックエンド実装詳細

### 2.1 サーバー設定

#### メインサーバーファイル
```typescript
// backend/src/index.ts
async function startServer() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  // GraphQLスキーマの読み込み
  const typeDefs = readFileSync(path.join(__dirname, 'schema', 'schema.graphql'), 'utf8');

  // Apollo Serverの初期化
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  // 認証ミドルウェアをGraphQLリクエストに適用
  app.use('/graphql', authMiddleware, expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  }));

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}
```

### 2.2 GraphQLスキーマ

#### メインスキーマ
```graphql
# backend/src/schema/schema.graphql
scalar DateTime
scalar Date

type User {
  id: ID!
  name: String
  createdAt: DateTime!
}

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

type Query {
  getUser(id: ID!): User
  getDiary(date: Date!): Diary
  getDiaries(userId: ID!, startDate: Date, endDate: Date): [Diary!]!
  getLocationVisits(userId: ID!, startDate: DateTime, endDate: DateTime): [LocationVisit!]!
}

type Mutation {
  createDiary(userId: ID!, date: Date!, generatedText: String!, editedText: String): Diary!
  updateDiary(id: ID!, generatedText: String, editedText: String): Diary!
  deleteDiary(id: ID!): Boolean!
  
  createLocationVisit(userId: ID!, latitude: Float!, longitude: Float!, placeName: String, address: String, visitedAt: DateTime!, durationMinutes: Int): LocationVisit!
}
```

### 2.3 認証ミドルウェア

#### Firebase認証
```typescript
// backend/src/auth/middleware.ts
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 2.4 Firestore設定

#### Firebase初期化
```typescript
// backend/src/firestore/index.ts
const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }
  return admin;
};

// Firestoreインスタンスの取得
export const getFirestoreInstance = () => {
  initializeFirebase();
  return getFirestore();
};
```

## 3. AIサービス実装詳細

### 3.1 日記生成サービス

#### DiaryGeneratorService
```typescript
// packages/ai/src/services/diary-generator.service.ts
export class DiaryGeneratorService {
  private openaiService?: OpenAIService;

  setOpenAIConfig(config: AIServiceConfig): void {
    this.openaiService = new OpenAIService(config);
  }

  async generateDiary(input: DiaryGenerationInput): Promise<DiaryGenerationResult> {
    if (!this.openaiService) {
      throw new Error('OpenAIサービスが未設定です');
    }
    return await this.openaiService.generateDiary(input);
  }

  async analyzeDiary(content: string): Promise<AIAnalysisResult> {
    if (!this.openaiService) {
      throw new Error('OpenAIサービスが未設定です');
    }
    return await this.openaiService.analyzeDiary(content);
  }
}
```

### 3.2 OpenAIサービス

#### OpenAIService
```typescript
// packages/ai/src/services/openai.service.ts
export class OpenAIService {
  private client: OpenAI;
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async generateDiary(input: DiaryGenerationInput): Promise<DiaryGenerationResult> {
    try {
      const prompt = this.buildDiaryGenerationPrompt(input);
      
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'あなたは親しみやすく、共感的な日記ライターです。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens || 1000,
        temperature: this.config.temperature || 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('AIからの応答が空です');
      }

      return this.parseDiaryGenerationResponse(content);
    } catch (error) {
      console.error('日記生成エラー:', error);
      throw new Error('日記の生成に失敗しました');
    }
  }
}
```

#### プロンプト構築
```typescript
private buildDiaryGenerationPrompt(input: DiaryGenerationInput): string {
  const location = input.location 
    ? `${input.location.placeName || '不明な場所'} (${input.location.latitude}, ${input.location.longitude})`
    : '不明';
  
  const photoCount = input.photos?.length || 0;
  const eventCount = input.calendarEvents?.length || 0;
  const mood = input.userMood || '不明';
  const timestamp = input.timestamp.toLocaleString('ja-JP');

  return DIARY_GENERATION_PROMPT
    .replace('{location}', location)
    .replace('{photoCount}', photoCount.toString())
    .replace('{eventCount}', eventCount.toString())
    .replace('{mood}', mood)
    .replace('{timestamp}', timestamp);
}
```

### 3.3 型定義

#### AI型定義
```typescript
// packages/ai/src/types/ai.types.ts
export interface AIServiceConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface DiaryGenerationInput {
  location?: {
    latitude: number;
    longitude: number;
    placeName?: string;
  };
  photos?: Array<{
    url: string;
    description?: string;
  }>;
  calendarEvents?: Array<{
    title: string;
    startTime: Date;
    endTime: Date;
    location?: string;
  }>;
  userMood?: string;
  timestamp: Date;
}

export interface DiaryGenerationResult {
  content: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  topics: string[];
  summary: string;
  suggestions: string[];
}

export interface AIAnalysisResult {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  topics: string[];
  summary: string;
  suggestions: string[];
  keywords: string[];
}
```

## 4. Webアプリ実装詳細

### 4.1 Next.js設定

#### メインページ
```typescript
// apps/web/app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Toki - AI日記アプリ
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          AIを活用して日記を書く、新しい体験を始めましょう。
        </p>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">機能</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• AIによる日記の自動分析</li>
            <li>• 感情分析とトレンド追跡</li>
            <li>• 美しいUI/UX</li>
            <li>• モバイル対応</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
```

#### レイアウト設定
```typescript
// apps/web/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

## 5. 共有パッケージ実装詳細

### 5.1 型定義

#### 日記型定義
```typescript
// packages/shared/src/types/diary.ts
export interface Diary {
  id: string;
  userId: string;
  content: string;
  location?: Location;
  photos: Photo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  takenAt?: Date;
  location?: Location;
}

export interface CreateDiaryInput {
  content: string;
  location?: Location;
  photoUrls?: string[];
}

export interface UpdateDiaryInput {
  content?: string;
  location?: Location;
  photoUrls?: string[];
}
```

### 5.2 GraphQLスキーマ

#### 共有スキーマ
```graphql
# packages/shared/src/graphql/schema.graphql
scalar DateTime
scalar JSON

type User {
  id: ID!
  email: String!
  name: String
  createdAt: DateTime!
  updatedAt: DateTime!
  diaries: [Diary!]!
}

type Diary {
  id: ID!
  userId: ID!
  user: User!
  content: String!
  location: Location
  photos: [Photo!]!
  aiAnalysis: AIAnalysis
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Location {
  latitude: Float!
  longitude: Float!
  address: String
  placeName: String
}

type Photo {
  id: ID!
  url: String!
  thumbnailUrl: String
  takenAt: DateTime
  location: Location
}

type AIAnalysis {
  id: ID!
  diaryId: ID!
  diary: Diary!
  sentiment: Sentiment!
  topics: [String!]!
  summary: String
  suggestions: [String!]!
  createdAt: DateTime!
}

enum Sentiment {
  POSITIVE
  NEUTRAL
  NEGATIVE
}

type Query {
  me: User
  user(id: ID!): User
  diary(id: ID!): Diary
  diaries(userId: ID!, limit: Int, offset: Int): [Diary!]!
  aiAnalysis(id: ID!): AIAnalysis
}

type Mutation {
  createDiary(input: CreateDiaryInput!): Diary!
  updateDiary(id: ID!, input: UpdateDiaryInput!): Diary!
  deleteDiary(id: ID!): Boolean!
  analyzeDiary(id: ID!): AIAnalysis!
}

type Subscription {
  diaryCreated: Diary!
  diaryUpdated: Diary!
  diaryDeleted: ID!
}
```

## 6. 設定ファイル

### 6.1 モバイルアプリ設定

#### pubspec.yaml
```yaml
# apps/mobile/pubspec.yaml
name: toki_mobile
description: Toki AutoDiary Mobile App

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.4.9
  go_router: ^12.1.3
  drift: ^2.14.0
  sqlite3_flutter_libs: ^0.5.20
  path_provider: ^2.1.1
  path: ^1.8.3
  geolocator: ^10.1.0
  geocoding: ^2.1.1
  location: ^5.0.3
  permission_handler: ^11.0.1
  android_alarm_manager_plus: ^3.0.1
  shared_preferences: ^2.2.2
  http: ^1.1.0
  intl: ^0.18.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  drift_dev: ^2.14.0
  build_runner: ^2.4.7
  flutter_lints: ^3.0.0
```

### 6.2 バックエンド設定

#### package.json
```json
{
  "name": "toki-backend",
  "version": "1.0.0",
  "description": "Toki AutoDiary Backend API",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@apollo/server": "^4.9.5",
    "graphql": "^16.8.1",
    "firebase-admin": "^11.11.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.2",
    "ts-node": "^10.9.1",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8"
  }
}
```

### 6.3 AIパッケージ設定

#### package.json
```json
{
  "name": "@toki/ai",
  "version": "1.0.0",
  "description": "AI services for Toki AutoDiary",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "openai": "^4.20.1"
  },
  "devDependencies": {
    "typescript": "^5.3.2",
    "@types/node": "^20.10.0"
  }
}
```

## 7. 環境変数設定

### 7.1 バックエンド環境変数
```bash
# backend/.env
PORT=4000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 7.2 モバイルアプリ環境変数
```dart
// apps/mobile/lib/services/ai_diary_service.dart
static const String _openaiApiKey = 'YOUR_OPENAI_API_KEY';
static const String _openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
```

## 8. デプロイメント設定

### 8.1 Docker設定
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
```

### 8.2 GitHub Actions設定
```yaml
# .github/workflows/deploy.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd backend
        npm ci
    
    - name: Build
      run: |
        cd backend
        npm run build
    
    - name: Deploy to Cloud Run
      uses: google-github-actions/deploy-cloudrun@v1
      with:
        service: toki-backend
        image: gcr.io/${{ secrets.GCP_PROJECT_ID }}/toki-backend
        region: asia-northeast1
        credentials: ${{ secrets.GCP_SA_KEY }}
```

この実装詳細ドキュメントは、Toki AutoDiaryアプリケーションの各コンポーネントの具体的な実装方法とコードの説明を提供しています。開発者がコードベースを理解し、機能を拡張する際の参考資料として活用できます。 