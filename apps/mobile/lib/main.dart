import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:android_alarm_manager_plus/android_alarm_manager_plus.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'app.dart';
import 'services/auto_diary_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load();

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
