import 'dart:async';
import 'package:flutter/material.dart';
import 'package:android_alarm_manager_plus/android_alarm_manager_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import '../data/local/database.dart';
import 'ai_diary_service.dart';

class AutoDiaryService {
  static final AutoDiaryService _instance = AutoDiaryService._internal();
  factory AutoDiaryService() => _instance;
  AutoDiaryService._internal();

  static const int _alarmId = 1001;
  static const String _alarmTimeKey = 'auto_diary_alarm_time';

  /// 自動日記生成サービスを初期化
  Future<void> initialize() async {
    await AndroidAlarmManager.initialize();
    print('自動日記生成サービスを初期化しました');
  }

  /// 自動日記生成アラームを設定
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

  /// 自動日記生成アラームをキャンセル
  Future<void> cancelAutoDiaryGeneration() async {
    try {
      await AndroidAlarmManager.cancel(_alarmId);
      
      // 設定時刻を削除
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_alarmTimeKey);
      
      print('自動日記生成アラームをキャンセルしました');
    } catch (e) {
      print('自動日記生成アラームキャンセルエラー: $e');
    }
  }

  /// 現在のアラーム設定時刻を取得
  Future<TimeOfDay?> getCurrentAlarmTime() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final timeString = prefs.getString(_alarmTimeKey);
      
      if (timeString != null) {
        final parts = timeString.split(':');
        if (parts.length == 2) {
          final hour = int.parse(parts[0]);
          final minute = int.parse(parts[1]);
          return TimeOfDay(hour: hour, minute: minute);
        }
      }
      
      return null;
    } catch (e) {
      print('アラーム時刻取得エラー: $e');
      return null;
    }
  }

  /// 手動で日記生成を実行（テスト用）
  Future<void> generateDiaryManually() async {
    await _generateDiaryForYesterday();
  }
}

/// バックグラウンドで実行される日記生成コールバック
@pragma('vm:entry-point')
Future<void> _generateDiaryCallback() async {
  print('自動日記生成を開始します');
  await _generateDiaryForYesterday();
}

/// 昨日の日記を生成
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