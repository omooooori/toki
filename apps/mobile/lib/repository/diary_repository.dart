import '../data/local/database.dart';

class DiaryRepository {
  Future<List<DiaryEntryData>> fetchDiaryEntries() async {
    // モックデータ
    return [
      DiaryEntryData(
        id: 1,
        date: '2024-07-24',
        summary: '今日は都心で探検と発見の一日でした。',
        imageUrl: null,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ),
      DiaryEntryData(
        id: 2,
        date: '2024-07-23',
        summary: '友人とカフェでゆっくり過ごしました。',
        imageUrl: 'https://placehold.jp/150x150.png',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ),
      DiaryEntryData(
        id: 3,
        date: '2024-07-22',
        summary: '仕事が忙しかったけど充実感あり。',
        imageUrl: null,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ),
    ];
  }
} 