import 'package:flutter_riverpod/flutter_riverpod.dart';

class DiaryEntry {
  final String id;
  final String content;
  final DateTime createdAt;
  final String? location;
  final List<String> photoUrls;
  final String? sentiment;
  final List<String> topics;

  DiaryEntry({
    required this.id,
    required this.content,
    required this.createdAt,
    this.location,
    this.photoUrls = const [],
    this.sentiment,
    this.topics = const [],
  });
}

class HomeState {
  final bool isLoading;
  final String? error;
  final List<DiaryEntry> diaries;
  final bool isRefreshing;

  HomeState({
    this.isLoading = false,
    this.error,
    this.diaries = const [],
    this.isRefreshing = false,
  });

  HomeState copyWith({
    bool? isLoading,
    String? error,
    List<DiaryEntry>? diaries,
    bool? isRefreshing,
  }) {
    return HomeState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      diaries: diaries ?? this.diaries,
      isRefreshing: isRefreshing ?? this.isRefreshing,
    );
  }
}

class HomeViewModel extends StateNotifier<HomeState> {
  HomeViewModel() : super(HomeState()) {
    _loadDiaries();
  }

  Future<void> _loadDiaries() async {
    try {
      state = state.copyWith(isLoading: true, error: null);

      // TODO: APIから日記を取得
      // 現在はモックデータ
      await Future.delayed(const Duration(seconds: 1));
      
      final mockDiaries = [
        DiaryEntry(
          id: '1',
          content: '今日は素晴らしい一日でした。新しいカフェで美味しいコーヒーを飲みました。',
          createdAt: DateTime.now().subtract(const Duration(days: 1)),
          location: '渋谷区, 東京都',
          photoUrls: [],
          sentiment: 'POSITIVE',
          topics: ['カフェ', 'コーヒー'],
        ),
        DiaryEntry(
          id: '2',
          content: '仕事が忙しくて疲れた一日でした。でも、夕方に散歩してリフレッシュできました。',
          createdAt: DateTime.now().subtract(const Duration(days: 2)),
          location: '新宿区, 東京都',
          photoUrls: [],
          sentiment: 'NEUTRAL',
          topics: ['仕事', '散歩'],
        ),
        DiaryEntry(
          id: '3',
          content: '友達と久しぶりに会って、楽しい時間を過ごしました。',
          createdAt: DateTime.now().subtract(const Duration(days: 3)),
          location: '原宿, 東京都',
          photoUrls: [],
          sentiment: 'POSITIVE',
          topics: ['友達', '楽しい'],
        ),
      ];

      state = state.copyWith(
        diaries: mockDiaries,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        error: '日記の読み込みに失敗しました: $e',
        isLoading: false,
      );
    }
  }

  Future<void> refreshDiaries() async {
    try {
      state = state.copyWith(isRefreshing: true, error: null);
      await _loadDiaries();
      state = state.copyWith(isRefreshing: false);
    } catch (e) {
      state = state.copyWith(
        error: '日記の更新に失敗しました: $e',
        isRefreshing: false,
      );
    }
  }

  Future<void> deleteDiary(String id) async {
    try {
      // TODO: APIで日記を削除
      await Future.delayed(const Duration(milliseconds: 500));
      
      final newDiaries = state.diaries.where((diary) => diary.id != id).toList();
      state = state.copyWith(diaries: newDiaries);
    } catch (e) {
      state = state.copyWith(error: '日記の削除に失敗しました: $e');
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  List<DiaryEntry> getDiariesByDate(DateTime date) {
    return state.diaries.where((diary) {
      return diary.createdAt.year == date.year &&
             diary.createdAt.month == date.month &&
             diary.createdAt.day == date.day;
    }).toList();
  }

  List<DiaryEntry> getRecentDiaries({int limit = 10}) {
    final sortedDiaries = List<DiaryEntry>.from(state.diaries)
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    
    return sortedDiaries.take(limit).toList();
  }
}

final homeViewModelProvider = StateNotifierProvider<HomeViewModel, HomeState>((ref) {
  return HomeViewModel();
});

// 日記リストのFutureProvider（既存のコードとの互換性のため）
final diaryListProvider = FutureProvider<List<DiaryEntry>>((ref) async {
  // TODO: 実際のAPIから日記を取得
  // 現在はモックデータを返す
  await Future.delayed(const Duration(seconds: 1));
  return [
    DiaryEntry(
      id: '1',
      content: '今日は素晴らしい一日でした。',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
      location: '渋谷区, 東京都',
      photoUrls: [],
      sentiment: 'POSITIVE',
      topics: ['カフェ', 'コーヒー'],
    ),
  ];
}); 