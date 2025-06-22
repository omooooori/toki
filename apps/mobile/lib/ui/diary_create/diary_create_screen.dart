import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'diary_create_view_model.dart';

class DiaryCreateScreen extends ConsumerStatefulWidget {
  const DiaryCreateScreen({super.key});

  @override
  ConsumerState<DiaryCreateScreen> createState() => _DiaryCreateScreenState();
}

class _DiaryCreateScreenState extends ConsumerState<DiaryCreateScreen> {
  final TextEditingController _textController = TextEditingController();

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: ref.read(diaryCreateViewModelProvider.notifier).state.selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      ref.read(diaryCreateViewModelProvider.notifier).setDate(picked);
    }
  }

  void _addPhoto() {
    // モック機能：実際の写真選択は後で実装
    final mockPhotoPath = 'mock_photo_${DateTime.now().millisecondsSinceEpoch}.jpg';
    ref.read(diaryCreateViewModelProvider.notifier).addPhoto(mockPhotoPath);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('写真が追加されました（モック）')),
    );
  }

  void _saveDiary() {
    final viewModel = ref.read(diaryCreateViewModelProvider.notifier);
    if (viewModel.canSave) {
      // モック機能：実際の保存は後で実装
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('日記が保存されました（モック）')),
      );
      // ホーム画面に戻る
      context.go('/');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('日記の内容を入力してください')),
      );
    }
  }

  void _goBack() {
    // 入力内容がある場合は確認ダイアログを表示
    final state = ref.read(diaryCreateViewModelProvider);
    if (state.diaryText.trim().isNotEmpty || state.photos.isNotEmpty) {
      _showDiscardDialog();
    } else {
      // 入力内容がない場合は直接ホーム画面に戻る
      _navigateToHome();
    }
  }

  void _navigateToHome() {
    // 入力内容をクリアしてホーム画面に戻る
    ref.read(diaryCreateViewModelProvider.notifier).clearAll();
    context.go('/');
  }

  void _showDiscardDialog() {
    showDialog(
      context: context,
      barrierDismissible: false, // ダイアログ外タップで閉じない
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('変更を破棄'),
          content: const Text('入力した内容は保存されません。\n本当に戻りますか？'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('キャンセル'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                _navigateToHome();
              },
              child: const Text('破棄'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(diaryCreateViewModelProvider);
    final viewModel = ref.read(diaryCreateViewModelProvider.notifier);

    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) {
        if (!didPop) {
          _goBack();
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('新しい日記'),
          centerTitle: true,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: _goBack,
          ),
          actions: [
            TextButton(
              onPressed: viewModel.canSave ? _saveDiary : null,
              child: const Text('保存'),
            ),
          ],
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 日付選択
              Card(
                child: ListTile(
                  leading: const Icon(Icons.calendar_today),
                  title: Text(
                    '${state.selectedDate.year}年${state.selectedDate.month}月${state.selectedDate.day}日',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  trailing: const Icon(Icons.arrow_drop_down),
                  onTap: () => _selectDate(context),
                ),
              ),
              const SizedBox(height: 16),

              // 日記テキスト入力
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '今日の出来事',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Expanded(
                          child: TextField(
                            controller: _textController,
                            maxLines: null,
                            expands: true,
                            decoration: const InputDecoration(
                              hintText: '今日あったことを書いてみましょう...',
                              border: InputBorder.none,
                            ),
                            onChanged: (value) {
                              viewModel.setDiaryText(value);
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // 写真セクション
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '写真',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      if (state.photos.isNotEmpty) ...[
                        SizedBox(
                          height: 100,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: state.photos.length,
                            itemBuilder: (context, index) {
                              return Padding(
                                padding: const EdgeInsets.only(right: 8.0),
                                child: Stack(
                                  children: [
                                    Container(
                                      width: 100,
                                      height: 100,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[300],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Icon(
                                        Icons.photo,
                                        size: 40,
                                        color: Colors.grey,
                                      ),
                                    ),
                                    Positioned(
                                      top: 4,
                                      right: 4,
                                      child: GestureDetector(
                                        onTap: () => viewModel.removePhoto(index),
                                        child: Container(
                                          padding: const EdgeInsets.all(4),
                                          decoration: const BoxDecoration(
                                            color: Colors.red,
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(
                                            Icons.close,
                                            size: 16,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 8),
                      ],
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: _addPhoto,
                          icon: const Icon(Icons.add_a_photo),
                          label: const Text('写真を追加'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // 保存ボタン
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: viewModel.canSave ? _saveDiary : null,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    '保存',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}