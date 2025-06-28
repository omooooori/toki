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
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Stack(
        children: [
          if (state.isLoading)
            const Center(
              child: CircularProgressIndicator(),
            )
          else
            ListView(
              children: [
                // 機能設定セクション
                _buildSectionHeader('機能設定'),
                _buildSwitchTile(
                  title: '位置情報',
                  subtitle: '現在地を自動で記録します',
                  value: state.locationEnabled,
                  onChanged: (value) => viewModel.toggleLocationEnabled(),
                  icon: Icons.location_on,
                ),
                _buildSwitchTile(
                  title: '写真',
                  subtitle: '写真を日記に追加できます',
                  value: state.photoEnabled,
                  onChanged: (value) => viewModel.togglePhotoEnabled(),
                  icon: Icons.photo,
                ),
                _buildSwitchTile(
                  title: 'AI生成',
                  subtitle: 'AIで日記を自動生成します',
                  value: state.aiEnabled,
                  onChanged: (value) => viewModel.toggleAiEnabled(),
                  icon: Icons.auto_awesome,
                ),
                
                const Divider(),
                
                // 通知設定セクション
                _buildSectionHeader('通知'),
                _buildSwitchTile(
                  title: 'プッシュ通知',
                  subtitle: '日記作成のリマインダーを受け取ります',
                  value: state.notificationsEnabled,
                  onChanged: (value) => viewModel.toggleNotificationsEnabled(),
                  icon: Icons.notifications,
                ),
                
                const Divider(),

                // 自動日記生成時刻セクション
                _buildSectionHeader('自動日記生成'),
                ListTile(
                  leading: const Icon(Icons.schedule, color: Colors.blue),
                  title: const Text('日記生成時刻'),
                  subtitle: Text('${state.autoDiaryTime.format(context)} にAI日記を自動生成'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () async {
                    final picked = await showTimePicker(
                      context: context,
                      initialTime: state.autoDiaryTime,
                    );
                    if (picked != null) {
                      await viewModel.setAutoDiaryTime(picked);
                    }
                  },
                ),

                const Divider(),
                
                const SizedBox(height: 32),
              ],
            ),
          
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

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    required IconData icon,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.blue),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: Colors.blue,
      ),
    );
  }

  Widget _buildErrorCard(String error, SettingsViewModel viewModel) {
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
} 