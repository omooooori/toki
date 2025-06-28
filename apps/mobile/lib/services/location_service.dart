import 'dart:async';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:location/location.dart' as location_package;
import 'package:permission_handler/permission_handler.dart';

class LocationData {
  final double latitude;
  final double longitude;
  final String? address;
  final String? placeName;
  final String? buildingName;
  final String? streetName;
  final String? neighborhood;
  final String? formattedAddress;
  final DateTime timestamp;

  LocationData({
    required this.latitude,
    required this.longitude,
    this.address,
    this.placeName,
    this.buildingName,
    this.streetName,
    this.neighborhood,
    this.formattedAddress,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() {
    return {
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'placeName': placeName,
      'buildingName': buildingName,
      'streetName': streetName,
      'neighborhood': neighborhood,
      'formattedAddress': formattedAddress,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory LocationData.fromJson(Map<String, dynamic> json) {
    return LocationData(
      latitude: json['latitude'],
      longitude: json['longitude'],
      address: json['address'],
      placeName: json['placeName'],
      buildingName: json['buildingName'],
      streetName: json['streetName'],
      neighborhood: json['neighborhood'],
      formattedAddress: json['formattedAddress'],
      timestamp: DateTime.parse(json['timestamp']),
    );
  }

  /// 表示用の場所名を取得
  String get displayName {
    if (buildingName?.isNotEmpty == true) {
      return buildingName!;
    }
    if (placeName?.isNotEmpty == true) {
      return placeName!;
    }
    if (streetName?.isNotEmpty == true) {
      return streetName!;
    }
    if (neighborhood?.isNotEmpty == true) {
      return neighborhood!;
    }
    if (address?.isNotEmpty == true) {
      return address!;
    }
    return '${latitude.toStringAsFixed(6)}, ${longitude.toStringAsFixed(6)}';
  }

  /// 詳細な場所情報を取得
  String get detailedInfo {
    final parts = <String>[];
    
    if (buildingName?.isNotEmpty == true) {
      parts.add(buildingName!);
    }
    if (streetName?.isNotEmpty == true) {
      parts.add(streetName!);
    }
    if (neighborhood?.isNotEmpty == true) {
      parts.add(neighborhood!);
    }
    if (address?.isNotEmpty == true) {
      parts.add(address!);
    }
    
    return parts.isNotEmpty ? parts.join(', ') : displayName;
  }
}

class LocationService {
  static final LocationService _instance = LocationService._internal();
  factory LocationService() => _instance;
  LocationService._internal();

  final location_package.Location _location = location_package.Location();

  Future<location_package.LocationData?> getCurrentLocation() async {
    final hasPermission = await _location.hasPermission();
    if (hasPermission == location_package.PermissionStatus.denied) {
      final permission = await _location.requestPermission();
      if (permission != location_package.PermissionStatus.granted) {
        return null;
      }
    }
    return await _location.getLocation();
  }

  Stream<location_package.LocationData> onLocationChanged() {
    return _location.onLocationChanged;
  }

  bool isValidLocation(location_package.LocationData location) {
    return (location.latitude ?? 0) != 0 && (location.longitude ?? 0) != 0;
  }

  /// 逆ジオコーディングで詳細な場所情報を取得
  Future<LocationData> getDetailedLocationData(
    double latitude, 
    double longitude,
    DateTime timestamp,
  ) async {
    String? address;
    String? placeName;
    String? buildingName;
    String? streetName;
    String? neighborhood;
    String? formattedAddress;

    try {
      // 複数の逆ジオコーディング結果を取得
      final placemarks = await placemarkFromCoordinates(latitude, longitude);
      
      if (placemarks.isNotEmpty) {
        final placemark = placemarks.first;
        
        // 基本住所情報
        address = [
          placemark.administrativeArea,
          placemark.locality,
          placemark.subLocality,
        ].where((e) => e != null && e.isNotEmpty).join(', ');
        
        // 場所名（建物名やランドマーク名）
        placeName = placemark.name?.isNotEmpty == true 
          ? placemark.name 
          : placemark.locality;
        
        // 建物名（nameフィールドが建物名の場合）
        if (placemark.name?.isNotEmpty == true && 
            placemark.name != placemark.locality &&
            placemark.name != placemark.administrativeArea) {
          buildingName = placemark.name;
        }
        
        // 通り名
        streetName = placemark.thoroughfare?.isNotEmpty == true 
          ? placemark.thoroughfare 
          : null;
        
        // 近隣地域
        neighborhood = placemark.subLocality?.isNotEmpty == true 
          ? placemark.subLocality 
          : null;
        
        // フォーマット済み住所
        final addressParts = <String>[];
        if (placemark.street?.isNotEmpty == true) {
          addressParts.add(placemark.street!);
        }
        if (placemark.subLocality?.isNotEmpty == true) {
          addressParts.add(placemark.subLocality!);
        }
        if (placemark.locality?.isNotEmpty == true) {
          addressParts.add(placemark.locality!);
        }
        if (placemark.administrativeArea?.isNotEmpty == true) {
          addressParts.add(placemark.administrativeArea!);
        }
        
        formattedAddress = addressParts.isNotEmpty 
          ? addressParts.join(', ') 
          : address;
      }
    } catch (e) {
      print('逆ジオコーディングエラー: $e');
    }

    return LocationData(
      latitude: latitude,
      longitude: longitude,
      address: address,
      placeName: placeName,
      buildingName: buildingName,
      streetName: streetName,
      neighborhood: neighborhood,
      formattedAddress: formattedAddress,
      timestamp: timestamp,
    );
  }
} 