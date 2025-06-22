import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../home/home_screen.dart';
import '../settings/settings_screen.dart';
import '../home/home_view_model.dart';
import 'custom_bottom_navigation.dart';

class MainLayout extends ConsumerStatefulWidget {
  const MainLayout({super.key});

  @override
  ConsumerState<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends ConsumerState<MainLayout> {
  final List<BottomNavigationItem> _navigationItems = const [
    BottomNavigationItem(
      icon: Icons.home,
      label: 'ホーム',
    ),
    BottomNavigationItem(
      icon: Icons.settings,
      label: '設定',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(homeViewModelProvider);
    final viewModel = ref.read(homeViewModelProvider.notifier);

    return Scaffold(
      body: IndexedStack(
        index: state.selectedTabIndex,
        children: const [
          HomeScreen(),
          SettingsScreen(),
        ],
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: state.selectedTabIndex,
        onTap: (index) {
          viewModel.setSelectedTab(index);
        },
        items: _navigationItems,
      ),
    );
  }
} 