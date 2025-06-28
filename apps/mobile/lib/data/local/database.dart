import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'database.g.dart';

class DiaryEntries extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get date => text()();
  TextColumn get summary => text()();
  TextColumn? get imageUrl => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
}

class LocationHistory extends Table {
  IntColumn get id => integer().autoIncrement()();
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  TextColumn? get address => text().nullable()();
  TextColumn? get placeName => text().nullable()();
  TextColumn? get buildingName => text().nullable()();
  TextColumn? get streetName => text().nullable()();
  TextColumn? get neighborhood => text().nullable()();
  TextColumn? get formattedAddress => text().nullable()();
  DateTimeColumn get timestamp => dateTime()();
}

class DiaryEntryData {
  final int? id;
  final String date;
  final String summary;
  final String? imageUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  DiaryEntryData({
    this.id,
    required this.date,
    required this.summary,
    this.imageUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory DiaryEntryData.fromCompanion(DiaryEntriesCompanion companion) {
    return DiaryEntryData(
      id: companion.id.value,
      date: companion.date.value,
      summary: companion.summary.value,
      imageUrl: companion.imageUrl.value,
      createdAt: companion.createdAt.value,
      updatedAt: companion.updatedAt.value,
    );
  }

  DiaryEntriesCompanion toCompanion() {
    return DiaryEntriesCompanion(
      id: id == null ? const Value.absent() : Value(id!),
      date: Value(date),
      summary: Value(summary),
      imageUrl: imageUrl == null ? const Value.absent() : Value(imageUrl!),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
    );
  }
}

@DriftDatabase(tables: [DiaryEntries, LocationHistory])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 3;

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
        if (from < 2) {
          // LocationHistoryテーブルを追加
          await m.createTable(locationHistory);
        }
        if (from < 3) {
          // LocationHistoryテーブルに新しいカラムを追加
          await m.addColumn(locationHistory, locationHistory.buildingName);
          await m.addColumn(locationHistory, locationHistory.streetName);
          await m.addColumn(locationHistory, locationHistory.neighborhood);
          await m.addColumn(locationHistory, locationHistory.formattedAddress);
        }
      },
    );
  }

  // 位置情報履歴の操作
  Future<int> insertLocationHistory(LocationHistoryData data) {
    return into(locationHistory).insert(data);
  }

  Future<List<LocationHistoryData>> getLocationHistory({
    DateTime? startDate,
    DateTime? endDate,
    int? limit,
  }) {
    final query = select(locationHistory);
    
    if (startDate != null) {
      query.where((tbl) => tbl.timestamp.isBiggerOrEqualValue(startDate));
    }
    
    if (endDate != null) {
      query.where((tbl) => tbl.timestamp.isSmallerOrEqualValue(endDate));
    }
    
    query.orderBy([(tbl) => OrderingTerm.desc(tbl.timestamp)]);
    
    if (limit != null) {
      query.limit(limit);
    }
    
    return query.get();
  }

  Future<void> deleteOldLocationHistory(DateTime before) {
    return (delete(locationHistory)..where((tbl) => tbl.timestamp.isSmallerThanValue(before))).go();
  }

  // 日記の保存
  Future<int> insertDiaryEntry(DiaryEntryData data) {
    return into(diaryEntries).insert(data.toCompanion());
  }

  // 日付で日記を取得
  Future<DiaryEntry?> getDiaryEntryByDate(String date) async {
    final query = select(diaryEntries)..where((tbl) => tbl.date.equals(date));
    final results = await query.get();
    return results.isNotEmpty ? results.first : null;
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'toki_diary.db'));
    return NativeDatabase.createInBackground(file);
  });
} 