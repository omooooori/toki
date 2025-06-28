// ========================================
// Toki モバイルアプリ設定
// ========================================
// 
// このファイルでアプリ全体の設定を管理します。
// 環境変数やAPIキーは、このファイルで一元管理してください。

class AppConfig {
  // ========================================
  // API設定
  // ========================================
  static const String apiBaseUrl = 'http://localhost:4000';
  static const String graphqlEndpoint = '$apiBaseUrl/graphql';
  static const int apiTimeout = 10000; // 10秒

  // ========================================
  // OpenAI設定
  // ========================================
  // 注意: 本番環境では、APIキーをサーバーサイドで管理し、
  // クライアントサイドでは直接使用しないでください
  static const String openaiApiKey = 'YOUR_OPENAI_API_KEY';
  static const String openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  static const String openaiModel = 'gpt-4';

  // ========================================
  // Firebase設定
  // ========================================
  // これらの値は、Firebase Consoleから取得してください
  static const String firebaseApiKey = 'YOUR_FIREBASE_API_KEY';
  static const String firebaseAuthDomain = 'your-project-id.firebaseapp.com';
  static const String firebaseProjectId = 'your-project-id';
  static const String firebaseStorageBucket = 'your-project-id.appspot.com';
  static const String firebaseMessagingSenderId = '123456789';
  static const String firebaseAppId = '1:123456789:android:abcdef123456';

  // ========================================
  // アプリ設定
  // ========================================
  static const String appName = 'Toki';
  static const String appVersion = '1.0.0';
  static const String appDescription = 'AI日記アプリ';

  // ========================================
  // 機能設定
  // ========================================
  static const bool enableAIAnalysis = true;
  static const bool enableLocationTracking = true;
  static const bool enablePhotoIntegration = true;
  static const bool enableCalendarIntegration = true;

  // ========================================
  // UI設定
  // ========================================
  static const int maxDiaryLength = 10000;
  static const int minDiaryLength = 10;
  static const int maxPhotosPerDiary = 10;
  static const int autoSaveInterval = 30000; // 30秒

  // ========================================
  // ストレージキー
  // ========================================
  static const String authTokenKey = 'toki_auth_token';
  static const String userPreferencesKey = 'toki_user_preferences';
  static const String themeKey = 'toki_theme';

  // ========================================
  // 開発環境設定
  // ========================================
  static const bool isDebugMode = true;
  static const String logLevel = 'debug';

  // ========================================
  // 本番環境設定
  // ========================================
  // 本番環境では以下の値を適切に設定してください
  // static const String productionApiBaseUrl = 'https://your-api-domain.com';
  // static const String productionGraphqlEndpoint = 'https://your-api-domain.com/graphql';
} 