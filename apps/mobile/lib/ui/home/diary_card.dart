import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'home_view_model.dart';

class DiaryCard extends StatelessWidget {
  final DiaryEntry diary;
  final VoidCallback? onDelete;

  const DiaryCard({
    super.key,
    required this.diary,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () => context.go('/diary/${diary.id}'),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ヘッダー部分
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          DateFormat('M月d日 (E)', 'ja_JP').format(diary.createdAt),
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey,
                          ),
                        ),
                        if (diary.location != null) ...[
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(
                                Icons.location_on,
                                size: 16,
                                color: Colors.grey,
                              ),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  diary.location!,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                  if (onDelete != null)
                    IconButton(
                      onPressed: onDelete,
                      icon: const Icon(Icons.delete_outline),
                      color: Colors.grey,
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // 日記内容
              Text(
                diary.content,
                style: const TextStyle(
                  fontSize: 16,
                  height: 1.5,
                ),
                maxLines: 4,
                overflow: TextOverflow.ellipsis,
              ),
              
              const SizedBox(height: 12),
              
              // フッター部分
              Row(
                children: [
                  // 感情分析
                  if (diary.sentiment != null) ...[
                    _buildSentimentChip(diary.sentiment!),
                    const SizedBox(width: 8),
                  ],
                  
                  // トピックタグ
                  if (diary.topics.isNotEmpty) ...[
                    ...diary.topics.take(2).map((topic) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Chip(
                        label: Text(
                          topic,
                          style: const TextStyle(fontSize: 12),
                        ),
                        backgroundColor: Colors.blue.shade50,
                        labelPadding: const EdgeInsets.symmetric(horizontal: 8),
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        visualDensity: VisualDensity.compact,
                      ),
                    )),
                  ],
                  
                  const Spacer(),
                  
                  // 写真数
                  if (diary.photoUrls.isNotEmpty)
                    Row(
                      children: [
                        const Icon(
                          Icons.photo,
                          size: 16,
                          color: Colors.grey,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${diary.photoUrls.length}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ],
          ),
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
      labelPadding: const EdgeInsets.symmetric(horizontal: 8),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
    );
  }
} 