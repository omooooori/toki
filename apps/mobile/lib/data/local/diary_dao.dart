import 'package:drift/drift.dart';
import 'database.dart';

part 'diary_dao.g.dart';

@DriftAccessor(tables: [DiaryEntries])
class DiaryDao extends DatabaseAccessor<AppDatabase> with _$DiaryDaoMixin {
  DiaryDao(super.db);

  Future<List<DiaryEntryData>> getAllDiaryEntries() async {
    final query = select(diaryEntries);
    final results = await query.get();
    return results.map((row) => DiaryEntryData.fromCompanion(row)).toList();
  }

  Future<DiaryEntryData?> getDiaryEntryById(int id) async {
    final query = select(diaryEntries)..where((tbl) => tbl.id.equals(id));
    final result = await query.getSingleOrNull();
    return result != null ? DiaryEntryData.fromCompanion(result) : null;
  }

  Future<int> insertDiaryEntry(DiaryEntryData entry) async {
    return into(diaryEntries).insert(entry.toCompanion());
  }

  Future<bool> updateDiaryEntry(DiaryEntryData entry) async {
    return update(diaryEntries).replace(entry.toCompanion());
  }

  Future<int> deleteDiaryEntry(int id) async {
    return (delete(diaryEntries)..where((tbl) => tbl.id.equals(id))).go();
  }
} 