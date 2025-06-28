import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../home/home_view_model.dart' show DiaryEntry, homeViewModelProvider;
import '../../data/local/database.dart' hide DiaryEntry;
import '../../services/location_service.dart';

// 位置情報履歴を取得するプロバイダー
final locationHistoryProvider = FutureProvider.family<List<LocationHistoryData>, DateTime>((ref, date) async {
  final database = AppDatabase();
  final startOfDay = DateTime(date.year, date.month, date.day);
  final endOfDay = startOfDay.add(const Duration(days: 1));
  
  try {
    final history = await database.getLocationHistory(
      startDate: startOfDay,
      endDate: endOfDay,
    );
    return history;
  } finally {
    await database.close();
  }
});

class DiaryDetailScreen extends ConsumerWidget {
  final String diaryId;

  const DiaryDetailScreen({
    super.key,
    required this.diaryId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(homeViewModelProvider);
    final diary = state.diaries.firstWhere(
      (d) => d.id == diaryId,
      orElse: () => DiaryEntry(
        id: '',
        content: '日記が見つかりません',
        createdAt: DateTime.now(),
      ),
    );

    // その日の位置情報履歴を取得
    final locationHistoryAsync = ref.watch(locationHistoryProvider(diary.createdAt));

    return Scaffold(
      appBar: AppBar(
        title: Text(DateFormat('M月d日 (E)', 'ja_JP').format(diary.createdAt)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.of(context).pop(),
          icon: const Icon(Icons.arrow_back),
        ),
        actions: [
          IconButton(
            onPressed: () => _showDeleteDialog(context, diary.id, ref),
            icon: const Icon(Icons.delete_outline),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 日付と場所
            Row(
              children: [
                Icon(Icons.calendar_today, color: Colors.grey[600]),
                const SizedBox(width: 8),
                Text(
                  DateFormat('yyyy年M月d日 (E)', 'ja_JP').format(diary.createdAt),
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
            
            if (diary.location != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.location_on, color: Colors.grey[600]),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      diary.location!,
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                ],
              ),
            ],
            
            const SizedBox(height: 24),
            
            // 位置情報履歴
            locationHistoryAsync.when(
              data: (locationHistory) {
                if (locationHistory.isEmpty) {
                  return const SizedBox.shrink();
                }
                
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '移動履歴',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey[800],
                      ),
                    ),
                    const SizedBox(height: 12),
                    ...locationHistory.map((location) => _buildLocationCard(location)),
                    const SizedBox(height: 24),
                  ],
                );
              },
              loading: () => const SizedBox.shrink(),
              error: (error, stack) => const SizedBox.shrink(),
            ),
            
            // 感情分析とトピック
            if (diary.sentiment != null || diary.topics.isNotEmpty) ...[
              Row(
                children: [
                  if (diary.sentiment != null) ...[
                    _buildSentimentChip(diary.sentiment!),
                    const SizedBox(width: 8),
                  ],
                  if (diary.topics.isNotEmpty) ...[
                    ...diary.topics.map((topic) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Chip(
                        label: Text(topic),
                        backgroundColor: Colors.blue.shade50,
                      ),
                    )),
                  ],
                ],
              ),
              const SizedBox(height: 24),
            ],
            
            // 日記内容
            Text(
              '日記',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800],
              ),
            ),
            const SizedBox(height: 12),
            Text(
              diary.content,
              style: const TextStyle(
                fontSize: 16,
                height: 1.6,
              ),
            ),
            
            // 写真
            if (diary.photoUrls.isNotEmpty) ...[
              const SizedBox(height: 24),
              Text(
                '写真',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[800],
                ),
              ),
              const SizedBox(height: 12),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                ),
                itemCount: diary.photoUrls.length,
                itemBuilder: (context, index) {
                  return ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      color: Colors.grey[200],
                      child: Center(
                        child: Icon(
                          Icons.photo,
                          color: Colors.grey[400],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildLocationCard(LocationHistoryData location) {
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

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.location_on, color: Colors.blue[600], size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    locationData.displayName,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                Text(
                  DateFormat('HH:mm').format(location.timestamp),
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
            if (locationData.detailedInfo != locationData.displayName) ...[
              const SizedBox(height: 4),
              Text(
                locationData.detailedInfo,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSentimentChip(String sentiment) {
    Color color;
    IconData icon;
    String label;

    switch (sentiment.toUpperCase()) {
      case 'POSITIVE':
        color = Colors.green;
        icon = Icons.sentiment_satisfied;
        label = 'ポジティブ';
        break;
      case 'NEGATIVE':
        color = Colors.red;
        icon = Icons.sentiment_dissatisfied;
        label = 'ネガティブ';
        break;
      case 'NEUTRAL':
      default:
        color = Colors.grey;
        icon = Icons.sentiment_neutral;
        label = 'ニュートラル';
        break;
    }

    return Chip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: color,
            ),
          ),
        ],
      ),
      backgroundColor: color.withOpacity(0.1),
    );
  }

  void _showDeleteDialog(BuildContext context, String diaryId, WidgetRef ref) {
    final viewModel = ref.read(homeViewModelProvider.notifier);
    
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
                Navigator.of(context).pop(); // 詳細画面を閉じる
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