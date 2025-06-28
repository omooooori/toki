import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'home_view_model.dart';
import 'diary_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(homeViewModelProvider);
    final viewModel = ref.read(homeViewModelProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Toki'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => viewModel.refreshDiaries(),
            icon: state.isRefreshing
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.refresh),
          ),
        ],
      ),
      body: Stack(
        children: [
          if (state.isLoading && state.diaries.isEmpty)
            const Center(
              child: CircularProgressIndicator(),
            )
          else if (state.diaries.isEmpty)
            _buildEmptyState(context)
          else
            _buildDiaryList(state, viewModel),
          
          // エラー表示
          if (state.error != null)
            Positioned(
              top: 16,
              left: 16,
              right: 16,
              child: _buildErrorCard(state.error!, viewModel),
            ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.book_outlined,
            size: 80,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'まだ日記がありません',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '自動で日記が生成されます',
            style: TextStyle(
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDiaryList(HomeState state, HomeViewModel viewModel) {
    final recentDiaries = viewModel.getRecentDiaries();

    return RefreshIndicator(
      onRefresh: viewModel.refreshDiaries,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: recentDiaries.length,
        itemBuilder: (context, index) {
          final diary = recentDiaries[index];
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: DiaryCard(
              diary: diary,
              onDelete: () {
                _showDeleteDialog(context, diary.id, viewModel);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildErrorCard(String error, HomeViewModel viewModel) {
    return Card(
      color: Colors.red.shade50,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Icon(Icons.error, color: Colors.red.shade700),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                error,
                style: TextStyle(color: Colors.red.shade700),
              ),
            ),
            IconButton(
              onPressed: viewModel.clearError,
              icon: Icon(Icons.close, color: Colors.red.shade700),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
          ],
        ),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, String diaryId, HomeViewModel viewModel) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('日記を削除'),
          content: const Text('この日記を削除しますか？\nこの操作は取り消せません。'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('キャンセル'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                viewModel.deleteDiary(diaryId);
              },
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('削除'),
            ),
          ],
        );
      },
    );
  }
} 