import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Your production API URL
  static const String baseUrl = 'https://memoryalbum-wi0j.onrender.com/api';
  
  // Timeout for API requests (Render free tier may take up to 60s+ to wake up)
  static const Duration apiTimeout = Duration(seconds: 90);
  
  // Auth token storage key
  static const String _authTokenKey = 'auth_token';

  // Get stored auth token
  static Future<String?> getAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_authTokenKey);
  }

  // Store auth token
  static Future<void> setAuthToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_authTokenKey, token);
  }

  // Login to get auth token
  static Future<bool> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'username': username, 'password': password}),
      ).timeout(apiTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['token'] != null) {
          await setAuthToken(data['token']);
          return true;
        }
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }

  // Check if logged in
  static Future<bool> isLoggedIn() async {
    final token = await getAuthToken();
    return token != null && token.isNotEmpty;
  }

  // Logout
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_authTokenKey);
  }

  // Upload Person 1 Photo
  static Future<String?> uploadPerson1Photo(File imageFile) async {
    try {
      final token = await getAuthToken();
      if (token == null) {
        print('Not authorized');
        return null;
      }

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/settings/upload/person1'),
      );
      
      request.headers['Authorization'] = 'Bearer $token';
      request.files.add(await http.MultipartFile.fromPath('image', imageFile.path));

      final streamedResponse = await request.send().timeout(apiTimeout);
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('✅ Person1 photo uploaded: ${data['imageUrl']}');
        return data['imageUrl'];
      } else {
        print('❌ Upload failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Upload error: $e');
      return null;
    }
  }

  // Upload Person 2 Photo
  static Future<String?> uploadPerson2Photo(File imageFile) async {
    try {
      final token = await getAuthToken();
      if (token == null) {
        print('Not authorized');
        return null;
      }

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/settings/upload/person2'),
      );
      
      request.headers['Authorization'] = 'Bearer $token';
      request.files.add(await http.MultipartFile.fromPath('image', imageFile.path));

      final streamedResponse = await request.send().timeout(apiTimeout);
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('✅ Person2 photo uploaded: ${data['imageUrl']}');
        return data['imageUrl'];
      } else {
        print('❌ Upload failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Upload error: $e');
      return null;
    }
  }

  // Upload Memory Photo (returns URL to use when creating memory)
  static Future<String?> uploadMemoryPhoto(File imageFile) async {
    try {
      final token = await getAuthToken();
      if (token == null) {
        print('Not authorized');
        return null;
      }

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/upload'),
      );
      
      request.headers['Authorization'] = 'Bearer $token';
      request.files.add(await http.MultipartFile.fromPath('image', imageFile.path));

      final streamedResponse = await request.send().timeout(apiTimeout);
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('✅ Memory photo uploaded: ${data['imageUrl']}');
        return data['imageUrl'];
      } else {
        print('❌ Upload failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Upload error: $e');
      return null;
    }
  }

  // Create a new memory
  static Future<MemoryModel?> createMemory({
    required String title,
    String? description,
    String? imageUrl,
  }) async {
    try {
      final token = await getAuthToken();
      if (token == null) {
        print('Not authorized');
        return null;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/memories'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'title': title,
          'description': description ?? '',
          'imageUrl': imageUrl,
        }),
      ).timeout(apiTimeout);

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);
        print('✅ Memory created: ${data['_id']}');
        return MemoryModel.fromJson(data);
      } else {
        print('❌ Create memory failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Create memory error: $e');
      return null;
    }
  }

  // Delete a memory
  static Future<bool> deleteMemory(String memoryId) async {
    try {
      final token = await getAuthToken();
      if (token == null) return false;

      final response = await http.delete(
        Uri.parse('$baseUrl/memories/$memoryId'),
        headers: {'Authorization': 'Bearer $token'},
      ).timeout(apiTimeout);

      return response.statusCode == 200;
    } catch (e) {
      print('Delete memory error: $e');
      return false;
    }
  }

  // Get memories from MongoDB
  static Future<List<MemoryModel>> getMemories() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/memories'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(apiTimeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((item) => MemoryModel.fromJson(item)).toList();
      } else {
        print('Failed to load memories: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching memories: $e');
      return [];
    }
  }

  // Get site settings (relationship data)
  static Future<SiteSettings?> getSettings() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/settings'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(apiTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return SiteSettings.fromJson(data);
      } else {
        print('Failed to load settings: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Error fetching settings: $e');
      return null;
    }
  }

  // Get appearance settings
  static Future<AppearanceSettings?> getAppearance() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/appearance'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(apiTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return AppearanceSettings.fromJson(data);
      } else {
        print('Failed to load appearance: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Error fetching appearance: $e');
      return null;
    }
  }

  // Get timeline items
  static Future<List<TimelineItem>> getTimeline() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/timeline'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(apiTimeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((item) => TimelineItem.fromJson(item)).toList();
      } else {
        print('Failed to load timeline: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching timeline: $e');
      return [];
    }
  }
}

// Data Models
class MemoryModel {
  final String id;
  final String title;
  final String? description;
  final String? imageUrl;
  final DateTime? date;
  final int order;
  final bool isFeatured;

  MemoryModel({
    required this.id,
    required this.title,
    this.description,
    this.imageUrl,
    this.date,
    this.order = 0,
    this.isFeatured = false,
  });

  factory MemoryModel.fromJson(Map<String, dynamic> json) {
    return MemoryModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      imageUrl: json['imageUrl'],
      date: json['date'] != null ? DateTime.tryParse(json['date']) : null,
      order: json['order'] ?? 0,
      isFeatured: json['isFeatured'] ?? false,
    );
  }
}

class SiteSettings {
  // Person 1
  final String person1Name;
  final String? person1BirthDate;
  final String person1Gender;
  final String? person1Photo;
  final String? person1Tagline;
  
  // Person 2
  final String person2Name;
  final String? person2BirthDate;
  final String person2Gender;
  final String? person2Photo;
  final String? person2Tagline;
  
  // Relationship
  final String? relationshipDate;
  final String? timelineTitle;

  SiteSettings({
    required this.person1Name,
    this.person1BirthDate,
    required this.person1Gender,
    this.person1Photo,
    this.person1Tagline,
    required this.person2Name,
    this.person2BirthDate,
    required this.person2Gender,
    this.person2Photo,
    this.person2Tagline,
    this.relationshipDate,
    this.timelineTitle,
  });

  factory SiteSettings.fromJson(Map<String, dynamic> json) {
    return SiteSettings(
      person1Name: json['person1Name'] ?? 'Person 1',
      person1BirthDate: json['person1BirthDate'],
      person1Gender: json['person1Gender'] ?? '♂',
      person1Photo: json['person1Photo'],
      person1Tagline: json['person1Tagline'],
      person2Name: json['person2Name'] ?? 'Person 2',
      person2BirthDate: json['person2BirthDate'],
      person2Gender: json['person2Gender'] ?? '♀',
      person2Photo: json['person2Photo'],
      person2Tagline: json['person2Tagline'],
      relationshipDate: json['relationshipDate'],
      timelineTitle: json['timelineTitle'],
    );
  }

  // Calculate days together
  int get daysTogether {
    if (relationshipDate == null) return 0;
    final startDate = DateTime.tryParse(relationshipDate!);
    if (startDate == null) return 0;
    return DateTime.now().difference(startDate).inDays;
  }

  // Calculate months together
  int get monthsTogether {
    if (relationshipDate == null) return 0;
    final startDate = DateTime.tryParse(relationshipDate!);
    if (startDate == null) return 0;
    final now = DateTime.now();
    return ((now.year - startDate.year) * 12) + (now.month - startDate.month);
  }

  // Calculate years together
  int get yearsTogether {
    return monthsTogether ~/ 12;
  }
}

class AppearanceSettings {
  final String? appName;
  final String? logo;
  final String? headerTitle;
  final String? footerText;

  AppearanceSettings({
    this.appName,
    this.logo,
    this.headerTitle,
    this.footerText,
  });

  factory AppearanceSettings.fromJson(Map<String, dynamic> json) {
    return AppearanceSettings(
      appName: json['appName'],
      logo: json['logo'],
      headerTitle: json['headerTitle'],
      footerText: json['footerText'],
    );
  }
}

class TimelineItem {
  final String id;
  final String title;
  final String? description;
  final String? icon;
  final String? date;
  final int order;

  TimelineItem({
    required this.id,
    required this.title,
    this.description,
    this.icon,
    this.date,
    this.order = 0,
  });

  factory TimelineItem.fromJson(Map<String, dynamic> json) {
    return TimelineItem(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      icon: json['icon'],
      date: json['date'],
      order: json['order'] ?? 0,
    );
  }
}
