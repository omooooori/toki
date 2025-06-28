import 'dart:convert';
import 'dart:math';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import '../data/local/database.dart';
import 'location_service.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AIDiaryService {
  static final AIDiaryService _instance = AIDiaryService._internal();
  factory AIDiaryService() => _instance;
  AIDiaryService._internal();

  // OpenAI API設定
  String get _openaiApiKey => dotenv.env['OPENAI_API_KEY'] ?? '';
  String get _openaiApiUrl => dotenv.env['OPENAI_API_URL'] ?? 'https://api.openai.com/v1/chat/completions';
  String get _openaiModel => dotenv.env['OPENAI_MODEL'] ?? 'gpt-4';

  /// 指定日の位置情報履歴を基にAI日記を生成
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

  /// 位置情報履歴をテキスト形式に変換
  String _formatLocationHistory(List<LocationHistoryData> locations) {
    final locationService = LocationService();
    final buffer = StringBuffer();
    
    for (int i = 0; i < locations.length; i++) {
      final location = locations[i];
      final locationData = LocationData(
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        placeName: location.placeName,
        buildingName: location.buildingName,
        streetName: location.streetName,
        neighborhood: location.neighborhood,
        formattedAddress: location.formattedAddress,
        timestamp: location.timestamp,
      );

      final time = DateFormat('HH:mm').format(location.timestamp);
      final placeName = locationData.displayName;
      final details = locationData.detailedInfo;
      
      buffer.writeln('$time: $placeName');
      if (details != placeName) {
        buffer.writeln('  ($details)');
      }
      
      // 移動距離を計算（次の位置情報がある場合）
      if (i < locations.length - 1) {
        final nextLocation = locations[i + 1];
        final distance = _calculateDistance(
          location.latitude, location.longitude,
          nextLocation.latitude, nextLocation.longitude,
        );
        final duration = nextLocation.timestamp.difference(location.timestamp);
        
        if (distance > 100) { // 100m以上移動した場合
          buffer.writeln('  → ${distance.toStringAsFixed(0)}m移動 (${duration.inMinutes}分)');
        }
      }
      buffer.writeln();
    }
    
    return buffer.toString();
  }

  /// 2点間の距離を計算（メートル）
  double _calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    const double earthRadius = 6371000; // 地球の半径（メートル）
    
    final lat1Rad = lat1 * (pi / 180);
    final lat2Rad = lat2 * (pi / 180);
    final deltaLat = (lat2 - lat1) * (pi / 180);
    final deltaLon = (lon2 - lon1) * (pi / 180);
    
    final a = sin(deltaLat / 2) * sin(deltaLat / 2) +
              cos(lat1Rad) * cos(lat2Rad) *
              sin(deltaLon / 2) * sin(deltaLon / 2);
    final c = 2 * atan(sqrt(a) / sqrt(1 - a));
    
    return earthRadius * c;
  }

  /// AI日記生成用のプロンプトを作成
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

  /// OpenAI APIを呼び出し
  Future<String?> _callOpenAI(String prompt) async {
    if (_openaiApiKey.isEmpty) {
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
          'model': _openaiModel,
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
        print('OpenAI API エラー: \\${response.statusCode} - \\${response.body}');
        return _generateMockDiary(prompt);
      }
    } catch (e) {
      print('OpenAI API 呼び出しエラー: \\${e}');
      return _generateMockDiary(prompt);
    }
  }

  /// モック日記生成（APIキーが設定されていない場合）
  String _generateMockDiary(String prompt) {
    return '''
今日は忙しい一日でした。朝から外出して、様々な場所を訪れました。
位置情報から見ると、複数の場所を移動していたようですね。
それぞれの場所で何かしらの活動をしていたのでしょう。
一日の終わりには、充実した気持ちで帰宅できたと思います。
''';
  }
} 