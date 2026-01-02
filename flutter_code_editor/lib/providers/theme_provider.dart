import 'package:flutter/material.dart';

// Theme data model matching the React themes.js
class AppTheme {
  final String id;
  final String name;
  final String description;
  final bool isNight;
  final Color primary;
  final Color secondary;
  final Color accent;
  final Color titleColor;
  final Color headerBg;
  final List<Color> gradientColors;
  final List<String> floatingIcons;
  final bool hasStars;
  final bool hasSnow;
  final bool hasPetals;
  final bool hasSparkles;

  const AppTheme({
    required this.id,
    required this.name,
    required this.description,
    required this.isNight,
    required this.primary,
    required this.secondary,
    required this.accent,
    required this.titleColor,
    required this.headerBg,
    required this.gradientColors,
    required this.floatingIcons,
    this.hasStars = false,
    this.hasSnow = false,
    this.hasPetals = false,
    this.hasSparkles = false,
  });
}

// All themes from the React web app
class AppThemes {
  static const romance = AppTheme(
    id: 'romance',
    name: '💕 Romance',
    description: 'Soft pink and warm vibes',
    isNight: false,
    primary: Color(0xFFFF69B4),
    secondary: Color(0xFFD72660),
    accent: Color(0xFFFFB3D6),
    titleColor: Color(0xFFD72660),
    headerBg: Color(0xB0FFFFFF),
    gradientColors: [Color(0xFFFFEEF8), Color(0xFFFFF0F5), Color(0xFFFFE4EC)],
    floatingIcons: ['💕', '💗', '💖', '💞', '🌸', '✨'],
  );

  static const galaxy = AppTheme(
    id: 'galaxy',
    name: '🌌 Galaxy',
    description: 'Deep space purple vibes',
    isNight: true,
    primary: Color(0xFFA77DFD),
    secondary: Color(0xFF7F53FF),
    accent: Color(0xFFBFA7FC),
    titleColor: Color(0xFFBFA7FC),
    headerBg: Color(0xD6281A50),
    gradientColors: [Color(0xFF1B2346), Color(0xFF3D194E), Color(0xFF0A1338)],
    floatingIcons: ['💜', '💙', '💫', '🌌', '💖', '🌠'],
    hasStars: true,
  );

  static const christmas = AppTheme(
    id: 'christmas',
    name: '🎄 Christmas',
    description: 'Festive holiday spirit',
    isNight: false,
    primary: Color(0xFFC41E3A),
    secondary: Color(0xFF228B22),
    accent: Color(0xFFFFD700),
    titleColor: Color(0xFFFFD700),
    headerBg: Color(0xD91A472A),
    gradientColors: [Color(0xFF1A472A), Color(0xFFC41E3A), Color(0xFF228B22)],
    floatingIcons: ['🎄', '⭐', '🎁', '❄️', '🔔', '✨'],
    hasSnow: true,
  );

  static const ocean = AppTheme(
    id: 'ocean',
    name: '🌊 Ocean',
    description: 'Calm blue waters',
    isNight: false,
    primary: Color(0xFF00BCD4),
    secondary: Color(0xFF0097A7),
    accent: Color(0xFF80DEEA),
    titleColor: Color(0xFF0097A7),
    headerBg: Color(0xBFFFFFFF),
    gradientColors: [Color(0xFFE0F7FA), Color(0xFFB2EBF2), Color(0xFF80DEEA)],
    floatingIcons: ['🌊', '🐚', '🐬', '🦋', '💎', '✨'],
  );

  static const sakura = AppTheme(
    id: 'sakura',
    name: '🌸 Sakura',
    description: 'Japanese cherry blossom',
    isNight: false,
    primary: Color(0xFFF48FB1),
    secondary: Color(0xFFC2185B),
    accent: Color(0xFFFCE4EC),
    titleColor: Color(0xFFC2185B),
    headerBg: Color(0xBFFFFFFF),
    gradientColors: [Color(0xFFFCE4EC), Color(0xFFF8BBD9), Color(0xFFF48FB1)],
    floatingIcons: ['🌸', '🎀', '💮', '🌷', '🦋', '✨'],
    hasPetals: true,
  );

  static const luxury = AppTheme(
    id: 'luxury',
    name: '👑 Luxury',
    description: 'Elegant black and gold',
    isNight: true,
    primary: Color(0xFFFFD700),
    secondary: Color(0xFFB8860B),
    accent: Color(0xFFFFFACD),
    titleColor: Color(0xFFFFD700),
    headerBg: Color(0xEB1A1A2E),
    gradientColors: [Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460)],
    floatingIcons: ['👑', '💎', '⭐', '🏆', '✨', '💫'],
    hasSparkles: true,
  );

  static const naruto = AppTheme(
    id: 'naruto',
    name: '🍥 Naruto',
    description: 'Sage Mode chakra energy',
    isNight: true,
    primary: Color(0xFFFF8C00),
    secondary: Color(0xFFFF4757),
    accent: Color(0xFFFFD700),
    titleColor: Color(0xFFFF8C00),
    headerBg: Color(0xEB1A1A2E),
    gradientColors: [Color(0xFF1A1A2E), Color(0xFF2D2D44), Color(0xFF1A1A2E)],
    floatingIcons: ['🍥', '🌀', '🔥', '⚡', '🌙', '✨'],
  );

  static const jujutsuKaisen = AppTheme(
    id: 'jujutsuKaisen',
    name: '👁️ Jujutsu Kaisen',
    description: 'Cursed energy flows',
    isNight: true,
    primary: Color(0xFFA855F7),
    secondary: Color(0xFFDC2626),
    accent: Color(0xFFEC4899),
    titleColor: Color(0xFFA855F7),
    headerBg: Color(0xF20A0A0A),
    gradientColors: [Color(0xFF0A0A0A), Color(0xFF1A0A1A), Color(0xFF0D0D0D)],
    floatingIcons: ['👁️', '💀', '🔮', '⚡', '🖤', '✨'],
  );

  static List<AppTheme> get all => [
    romance,
    galaxy,
    christmas,
    ocean,
    sakura,
    luxury,
    naruto,
    jujutsuKaisen,
  ];
}

class ThemeProvider extends ChangeNotifier {
  AppTheme _currentTheme = AppThemes.romance;
  
  AppTheme get currentTheme => _currentTheme;
  bool get isNightMode => _currentTheme.isNight;

  void setTheme(AppTheme theme) {
    _currentTheme = theme;
    notifyListeners();
  }

  void setThemeById(String id) {
    final theme = AppThemes.all.firstWhere(
      (t) => t.id == id,
      orElse: () => AppThemes.romance,
    );
    setTheme(theme);
  }
}
