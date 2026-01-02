import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';

class HeaderWidget extends StatefulWidget {
  final AppTheme theme;

  const HeaderWidget({super.key, required this.theme});

  @override
  State<HeaderWidget> createState() => _HeaderWidgetState();
}

class _HeaderWidgetState extends State<HeaderWidget> {
  bool _isThemeMenuOpen = false;

  @override
  Widget build(BuildContext context) {
    final theme = widget.theme;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: theme.headerBg,
        boxShadow: [
          BoxShadow(
            color: theme.primary.withAlpha(40),
            blurRadius: 15,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border(
          bottom: BorderSide(
            color: theme.primary.withAlpha(100),
            width: 1.5,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Logo and Title
          Row(
            children: [
              // Animated heart icon
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 1.0, end: 1.15),
                duration: const Duration(milliseconds: 800),
                curve: Curves.easeInOut,
                builder: (context, scale, child) {
                  return Transform.scale(
                    scale: scale,
                    child: Text(
                      '💌',
                      style: TextStyle(
                        fontSize: 24,
                        shadows: [
                          Shadow(
                            color: theme.primary.withAlpha(150),
                            blurRadius: 10,
                          ),
                        ],
                      ),
                    ),
                  );
                },
                onEnd: () => setState(() {}),
              ),
              const SizedBox(width: 10),
              Text(
                'Love Memory',
                style: GoogleFonts.quicksand(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: theme.titleColor,
                  letterSpacing: 1.2,
                  shadows: [
                    Shadow(
                      color: theme.isNight 
                          ? Colors.black38 
                          : Colors.white60,
                      blurRadius: 8,
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Theme selector button
          Row(
            children: [
              GestureDetector(
                onTap: () => _showThemeSelector(context),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: theme.headerBg,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: theme.primary.withAlpha(100),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: theme.primary.withAlpha(50),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Text(
                        theme.name.split(' ')[0],
                        style: const TextStyle(fontSize: 16),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.arrow_drop_down,
                        color: theme.titleColor,
                        size: 20,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              // Music button
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: theme.headerBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: theme.primary.withAlpha(100),
                    width: 1.5,
                  ),
                ),
                child: Icon(
                  Icons.music_note,
                  color: theme.titleColor,
                  size: 20,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showThemeSelector(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
    final currentTheme = themeProvider.currentTheme;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.7,
        ),
        decoration: BoxDecoration(
          color: currentTheme.isNight 
              ? const Color(0xFF1E1433).withAlpha(250)
              : Colors.white.withAlpha(250),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          boxShadow: [
            BoxShadow(
              color: currentTheme.primary.withAlpha(60),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: currentTheme.primary.withAlpha(100),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            
            // Title
            Padding(
              padding: const EdgeInsets.all(20),
              child: Text(
                'Choose Theme',
                style: GoogleFonts.quicksand(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: currentTheme.titleColor,
                  letterSpacing: 1,
                ),
              ),
            ),

            // Theme list
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: AppThemes.all.length,
                itemBuilder: (context, index) {
                  final theme = AppThemes.all[index];
                  final isSelected = theme.id == currentTheme.id;

                  return GestureDetector(
                    onTap: () {
                      themeProvider.setTheme(theme);
                      Navigator.pop(context);
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isSelected 
                            ? theme.primary.withAlpha(50)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected 
                              ? theme.primary 
                              : theme.primary.withAlpha(30),
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Text(
                            theme.name.split(' ')[0],
                            style: const TextStyle(fontSize: 24),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  theme.name.split(' ').skip(1).join(' '),
                                  style: GoogleFonts.quicksand(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: currentTheme.isNight 
                                        ? Colors.white 
                                        : const Color(0xFF333333),
                                  ),
                                ),
                                Text(
                                  theme.description,
                                  style: GoogleFonts.quicksand(
                                    fontSize: 12,
                                    color: currentTheme.isNight 
                                        ? Colors.white60 
                                        : Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (isSelected)
                            Icon(
                              Icons.check_circle,
                              color: theme.primary,
                              size: 22,
                            ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
