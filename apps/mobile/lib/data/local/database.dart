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

@DriftDatabase(tables: [DiaryEntries])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
        // 将来的なマイグレーション処理
      },
    );
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'toki_diary.db'));
    return NativeDatabase.createInBackground(file);
  });
} 