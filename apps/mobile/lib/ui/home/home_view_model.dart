import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../repository/diary_repository.dart';
import '../../data/local/database.dart';

class HomeViewModel extends StateNotifier<HomeState> {
  HomeViewModel() : super(HomeState());

  void setSelectedTab(int index) {
    state = state.copyWith(selectedTabIndex: index);
  }

  Future<void> loadDiaryEntries() async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final repository = DiaryRepository();
      final entries = await repository.fetchDiaryEntries();
      state = state.copyWith(
        diaryEntries: entries,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }

  void refreshDiaryEntries() {
    loadDiaryEntries();
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

class HomeState {
  final int selectedTabIndex;
  final List<DiaryEntryData> diaryEntries;
  final bool isLoading;
  final String? error;

  HomeState({
    this.selectedTabIndex = 0,
    this.diaryEntries = const [],
    this.isLoading = false,
    this.error,
  });

  HomeState copyWith({
    int? selectedTabIndex,
    List<DiaryEntryData>? diaryEntries,
    bool? isLoading,
    String? error,
  }) {
    return HomeState(
      selectedTabIndex: selectedTabIndex ?? this.selectedTabIndex,
      diaryEntries: diaryEntries ?? this.diaryEntries,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

final homeViewModelProvider = StateNotifierProvider<HomeViewModel, HomeState>((ref) {
  return HomeViewModel();
});

// 日記リストのFutureProvider（既存のコードとの互換性のため）
final diaryListProvider = FutureProvider<List<DiaryEntryData>>((ref) async {
  final repo = DiaryRepository();
  return repo.fetchDiaryEntries();
}); 