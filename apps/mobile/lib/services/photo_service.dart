import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:photo_manager/photo_manager.dart';
import 'package:permission_handler/permission_handler.dart';

class PhotoData {
  final String id;
  final String path;
  final String? thumbnailPath;
  final DateTime? takenAt;
  final double? latitude;
  final double? longitude;
  final String? address;

  PhotoData({
    required this.id,
    required this.path,
    this.thumbnailPath,
    this.takenAt,
    this.latitude,
    this.longitude,
    this.address,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'path': path,
      'thumbnailPath': thumbnailPath,
      'takenAt': takenAt?.toIso8601String(),
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
    };
  }

  factory PhotoData.fromJson(Map<String, dynamic> json) {
    return PhotoData(
      id: json['id'],
      path: json['path'],
      thumbnailPath: json['thumbnailPath'],
      takenAt: json['takenAt'] != null ? DateTime.parse(json['takenAt']) : null,
      latitude: json['latitude'],
      longitude: json['longitude'],
      address: json['address'],
    );
  }
}

class PhotoService {
  static final PhotoService _instance = PhotoService._internal();
  factory PhotoService() => _instance;
  PhotoService._internal();

  final ImagePicker _picker = ImagePicker();

  /// 写真の権限を確認・要求
  Future<bool> requestPhotoPermission() async {
    final status = await Permission.photos.request();
    return status.isGranted;
  }

  /// カメラで写真を撮影
  Future<PhotoData?> takePhoto() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 80,
        maxWidth: 1920,
        maxHeight: 1920,
      );

      if (image == null) return null;

      return PhotoData(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        path: image.path,
        takenAt: DateTime.now(),
      );
    } catch (e) {
      print('写真撮影エラー: $e');
      return null;
    }
  }

  /// ギャラリーから写真を選択
  Future<PhotoData?> pickPhoto() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80,
        maxWidth: 1920,
        maxHeight: 1920,
      );

      if (image == null) return null;

      return PhotoData(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        path: image.path,
        takenAt: DateTime.now(),
      );
    } catch (e) {
      print('写真選択エラー: $e');
      return null;
    }
  }

  /// 複数の写真を選択
  Future<List<PhotoData>> pickMultiplePhotos({int maxCount = 10}) async {
    try {
      final albums = await PhotoManager.getAssetPathList(
        type: RequestType.image,
        onlyAll: true,
      );
      if (albums.isEmpty) return [];
      final recentAlbum = albums.first;
      final assets = await recentAlbum.getAssetListPaged(page: 0, size: maxCount);
      
      final photoDataList = <PhotoData>[];
      for (final asset in assets) {
        final file = await asset.file;
        if (file != null) {
          photoDataList.add(PhotoData(
            id: asset.id,
            path: file.path,
            takenAt: asset.createDateTime,
          ));
        }
      }
      return photoDataList;
    } catch (e) {
      print('複数写真選択エラー: $e');
      return [];
    }
  }

  /// 写真の存在確認
  Future<bool> photoExists(String path) async {
    try {
      final file = File(path);
      return await file.exists();
    } catch (e) {
      return false;
    }
  }

  /// 写真ファイルを削除
  Future<bool> deletePhoto(String path) async {
    try {
      final file = File(path);
      if (await file.exists()) {
        await file.delete();
        return true;
      }
      return false;
    } catch (e) {
      print('写真削除エラー: $e');
      return false;
    }
  }
} 