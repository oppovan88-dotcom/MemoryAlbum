import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/theme_provider.dart';
import '../services/api_service.dart';

class FooterWidget extends StatefulWidget {
  final AppTheme theme;

  const FooterWidget({super.key, required this.theme});

  @override
  State<FooterWidget> createState() => _FooterWidgetState();
}

class _FooterWidgetState extends State<FooterWidget> {
  AppearanceSettings? _appearance;

  @override
  void initState() {
    super.initState();
    _fetchAppearance();
  }

  Future<void> _fetchAppearance() async {
    final appearance = await ApiService.getAppearance();
    if (mounted) {
      setState(() {
        _appearance = appearance;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = widget.theme;
    
    // Dynamic content from appearance settings
    final footerText = _appearance?.footerText ?? 'Made with ❤️';
    final appName = _appearance?.appName ?? 'Memory Album';
    final currentYear = DateTime.now().year;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            theme.headerBg,
            theme.isNight 
                ? const Color(0xFF39205C).withAlpha(240)
                : const Color(0xFFFFF6FB).withAlpha(240),
          ],
        ),
        border: Border(
          top: BorderSide(
            color: theme.primary.withAlpha(100),
            width: 1.5,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: theme.primary.withAlpha(40),
            blurRadius: 24,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Footer decorative line
          Container(
            width: 60,
            height: 3,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  theme.primary,
                  theme.secondary,
                  theme.primary,
                ],
              ),
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Footer Text with heart
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '💕',
                style: TextStyle(
                  fontSize: 16,
                  shadows: [
                    Shadow(color: theme.primary.withAlpha(150), blurRadius: 6),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text(
                footerText,
                style: GoogleFonts.quicksand(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: theme.titleColor,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '💕',
                style: TextStyle(
                  fontSize: 16,
                  shadows: [
                    Shadow(color: theme.primary.withAlpha(150), blurRadius: 6),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Copyright
          Text(
            '© $currentYear $appName',
            style: GoogleFonts.quicksand(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: theme.isNight 
                  ? const Color(0xFFC5BFF2).withAlpha(190)
                  : const Color(0xFFBA7BC9).withAlpha(190),
              letterSpacing: 0.3,
            ),
          ),

          const SizedBox(height: 12),

          // Version badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: theme.primary.withAlpha(30),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: theme.primary.withAlpha(60),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '📱',
                  style: TextStyle(
                    fontSize: 12,
                    shadows: [
                      Shadow(color: theme.accent.withAlpha(100), blurRadius: 4),
                    ],
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  'Flutter App v1.0.0',
                  style: GoogleFonts.quicksand(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: theme.isNight ? Colors.white60 : Colors.black45,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
