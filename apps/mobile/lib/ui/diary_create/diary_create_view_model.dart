import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';

class DiaryCreateViewModel extends StateNotifier<DiaryCreateState> {
  DiaryCreateViewModel() : super(DiaryCreateState());

  void setDate(DateTime date) {
    state = state.copyWith(selectedDate: date);
  }

  void setDiaryText(String text) {
    state = state.copyWith(diaryText: text);
  }

  void addPhoto(String photoPath) {
    final updatedPhotos = List<String>.from(state.photos)..add(photoPath);
    state = state.copyWith(photos: updatedPhotos);
  }

  void removePhoto(int index) {
    final updatedPhotos = List<String>.from(state.photos)..removeAt(index);
    state = state.copyWith(photos: updatedPhotos);
  }

  void clearAll() {
    state = DiaryCreateState();
  }

  bool get canSave => state.diaryText.trim().isNotEmpty;
}

class DiaryCreateState {
  final DateTime selectedDate;
  final String diaryText;
  final List<String> photos;
  final bool isLoading;

  DiaryCreateState({
    DateTime? selectedDate,
    this.diaryText = '',
    List<String>? photos,
    this.isLoading = false,
  }) : selectedDate = selectedDate ?? DateTime.now(),
       photos = photos ?? [];

  DiaryCreateState copyWith({
    DateTime? selectedDate,
    String? diaryText,
    List<String>? photos,
    bool? isLoading,
  }) {
    return DiaryCreateState(
      selectedDate: selectedDate ?? this.selectedDate,
      diaryText: diaryText ?? this.diaryText,
      photos: photos ?? this.photos,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

final diaryCreateViewModelProvider = StateNotifierProvider<DiaryCreateViewModel, DiaryCreateState>((ref) {
  return DiaryCreateViewModel();
}); 