import 'package:flutter/material.dart';
import '../../data/local/database.dart';

class DiaryCard extends StatelessWidget {
  final DiaryEntryData entry;
  const DiaryCard({super.key, required this.entry});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _formatDate(entry.date),
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    entry.summary,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
            if (entry.imageUrl != null)
              Padding(
                padding: const EdgeInsets.only(left: 12),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    entry.imageUrl!,
                    width: 64,
                    height: 64,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String date) {
    // 例: "2024-07-24" → "2024年7月24日"
    try {
      final d = DateTime.parse(date);
      return '${d.year}年${d.month}月${d.day}日';
    } catch (_) {
      return date;
    }
  }
} 