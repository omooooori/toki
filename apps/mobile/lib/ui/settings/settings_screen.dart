import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'settings_view_model.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(settingsViewModelProvider);
    final viewModel = ref.read(settingsViewModelProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('設定'),
        centerTitle: true,
      ),
      body: ListView(
        children: [
          // ユーザー情報セクション
          _buildSectionHeader('ユーザー情報'),
          ListTile(
            leading: const CircleAvatar(
              child: Icon(Icons.person),
            ),
            title: Text(state.userName),
            subtitle: const Text('ログイン中'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // ユーザープロフィール編集画面への遷移（後で実装）
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('プロフィール編集（モック）')),
              );
            },
          ),
          const Divider(),

          // アプリ設定セクション
          _buildSectionHeader('アプリ設定'),
          ListTile(
            leading: const Icon(Icons.dark_mode),
            title: const Text('ダークモード'),
            subtitle: const Text('テーマを切り替えます'),
            trailing: Switch(
              value: state.isDarkMode,
              onChanged: (value) {
                viewModel.setDarkMode(value);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(value ? 'ダークモードを有効にしました' : 'ライトモードを有効にしました'),
                  ),
                );
              },
            ),
          ),
          const Divider(),

          // データ管理セクション
          _buildSectionHeader('データ管理'),
          ListTile(
            leading: const Icon(Icons.download),
            title: const Text('データエクスポート'),
            subtitle: const Text('日記データをエクスポートします'),
            trailing: state.isExporting
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.chevron_right),
            onTap: state.isExporting
                ? null
                : () {
                    viewModel.exportData();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('データエクスポートを開始しました（モック）')),
                    );
                  },
          ),
          ListTile(
            leading: const Icon(Icons.backup),
            title: const Text('バックアップ'),
            subtitle: const Text('データをバックアップします'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('バックアップ機能（モック）')),
              );
            },
          ),
          const Divider(),

          // アプリ情報セクション
          _buildSectionHeader('アプリ情報'),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text('バージョン'),
            subtitle: const Text('1.0.0'),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('アプリ情報（モック）')),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.privacy_tip),
            title: const Text('プライバシーポリシー'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('プライバシーポリシー（モック）')),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.description),
            title: const Text('利用規約'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('利用規約（モック）')),
              );
            },
          ),
          const Divider(),

          // ログアウトセクション
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: state.isLoggingOut
                    ? null
                    : () {
                        _showLogoutDialog(context, viewModel);
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: state.isLoggingOut
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text(
                        'ログアウト',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
        ),
      ),
    );
  }

  void _showLogoutDialog(BuildContext context, SettingsViewModel viewModel) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('ログアウト'),
          content: const Text('本当にログアウトしますか？'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('キャンセル'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                viewModel.logout();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('ログアウトしました（モック）')),
                );
              },
              child: const Text('ログアウト'),
            ),
          ],
        );
      },
    );
  }
} 