import 'package:flutter_riverpod/flutter_riverpod.dart';

class SettingsViewModel extends StateNotifier<SettingsState> {
  SettingsViewModel() : super(SettingsState());

  void toggleDarkMode() {
    state = state.copyWith(isDarkMode: !state.isDarkMode);
  }

  void setDarkMode(bool isDarkMode) {
    state = state.copyWith(isDarkMode: isDarkMode);
  }

  void exportData() {
    // モック機能：実際のデータエクスポートは後で実装
    state = state.copyWith(isExporting: true);
    // 実際の実装では非同期処理を行う
    Future.delayed(const Duration(seconds: 2), () {
      state = state.copyWith(isExporting: false);
    });
  }

  void logout() {
    // モック機能：実際のログアウトは後で実装
    state = state.copyWith(isLoggingOut: true);
    // 実際の実装では非同期処理を行う
    Future.delayed(const Duration(seconds: 1), () {
      state = state.copyWith(isLoggingOut: false);
    });
  }
}

class SettingsState {
  final bool isDarkMode;
  final bool isExporting;
  final bool isLoggingOut;
  final String userName;

  SettingsState({
    this.isDarkMode = false,
    this.isExporting = false,
    this.isLoggingOut = false,
    this.userName = 'ユーザー太郎', // モックユーザー名
  });

  SettingsState copyWith({
    bool? isDarkMode,
    bool? isExporting,
    bool? isLoggingOut,
    String? userName,
  }) {
    return SettingsState(
      isDarkMode: isDarkMode ?? this.isDarkMode,
      isExporting: isExporting ?? this.isExporting,
      isLoggingOut: isLoggingOut ?? this.isLoggingOut,
      userName: userName ?? this.userName,
    );
  }
}

final settingsViewModelProvider = StateNotifierProvider<SettingsViewModel, SettingsState>((ref) {
  return SettingsViewModel();
}); 