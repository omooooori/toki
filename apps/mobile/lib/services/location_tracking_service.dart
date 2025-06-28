import 'dart:async';
import 'dart:io';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:location/location.dart' as location_package;
import 'package:permission_handler/permission_handler.dart';
import '../data/local/database.dart';
import 'location_service.dart';

class LocationTrackingService {
  static final LocationTrackingService _instance = LocationTrackingService._internal();
  factory LocationTrackingService() => _instance;
  LocationTrackingService._internal();

  final location_package.Location _location = location_package.Location();
  StreamSubscription<location_package.LocationData>? _locationSubscription;
  final AppDatabase _database = AppDatabase();
  
  // 追跡設定
  static const Duration _trackingInterval = Duration(minutes: 5); // 5分間隔
  static const double _minDistanceMeters = 100; // 100m以上移動した場合のみ記録
  
  bool _isTracking = false;
  DateTime? _lastLocationTime;
  LocationData? _lastLocation;

  /// 位置情報追跡を開始
  Future<void> startTracking() async {
    if (_isTracking) return;

    // 権限チェック
    final hasPermission = await _location.hasPermission();
    if (hasPermission == location_package.PermissionStatus.denied) {
      final permission = await _location.requestPermission();
      if (permission != location_package.PermissionStatus.granted) {
        throw Exception('位置情報の権限が許可されていません');
      }
    }

    // 位置情報サービスが有効かチェック
    final isEnabled = await _location.serviceEnabled();
    if (!isEnabled) {
      final enabled = await _location.requestService();
      if (!enabled) {
        throw Exception('位置情報サービスが有効になっていません');
      }
    }

    _isTracking = true;
    
    // 位置情報の変更を監視
    _locationSubscription = _location.onLocationChanged.listen(_onLocationChanged);
    
    print('位置情報追跡を開始しました');
  }

  /// 位置情報追跡を停止
  Future<void> stopTracking() async {
    if (!_isTracking) return;

    await _locationSubscription?.cancel();
    _locationSubscription = null;
    _isTracking = false;
    _lastLocationTime = null;
    _lastLocation = null;
    
    print('位置情報追跡を停止しました');
  }

  /// 位置情報が変更された時の処理
  Future<void> _onLocationChanged(location_package.LocationData packageLocationData) async {
    if (!_isTracking) return;

    final now = DateTime.now();
    
    // 前回の位置情報と比較して、移動距離を計算
    if (_lastLocation != null) {
      final distance = Geolocator.distanceBetween(
        _lastLocation!.latitude,
        _lastLocation!.longitude,
        packageLocationData.latitude ?? 0,
        packageLocationData.longitude ?? 0,
      );
      
      // 最小移動距離未満の場合は記録しない
      if (distance < _minDistanceMeters) {
        return;
      }
    }

    try {
      // 詳細な位置情報を取得
      final locationService = LocationService();
      final locationData = await locationService.getDetailedLocationData(
        packageLocationData.latitude ?? 0,
        packageLocationData.longitude ?? 0,
        now,
      );

      await _saveLocationData(locationData);
      
      _lastLocation = locationData;
      _lastLocationTime = now;
      
      print('位置情報を記録しました: ${locationData.displayName}');
      
    } catch (e) {
      print('位置情報の保存に失敗しました: $e');
    }
  }

  /// 位置情報をデータベースに保存
  Future<void> _saveLocationData(LocationData locationData) async {
    try {
      final locationHistoryData = LocationHistoryData(
        id: 0, // 自動インクリメントされるため0を設定
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        placeName: locationData.placeName,
        buildingName: locationData.buildingName,
        streetName: locationData.streetName,
        neighborhood: locationData.neighborhood,
        formattedAddress: locationData.formattedAddress,
        timestamp: locationData.timestamp,
      );
      
      await _database.insertLocationHistory(locationHistoryData);
      print('位置情報をデータベースに保存しました: ${locationData.displayName}');
    } catch (e) {
      print('位置情報のデータベース保存に失敗しました: $e');
    }
  }

  /// 現在の追跡状態を取得
  bool get isTracking => _isTracking;

  /// 最後に記録された位置情報を取得
  LocationData? get lastLocation => _lastLocation;

  /// 最後に記録された時間を取得
  DateTime? get lastLocationTime => _lastLocationTime;

  /// サービスを破棄
  Future<void> dispose() async {
    await stopTracking();
    await _database.close();
  }
} 