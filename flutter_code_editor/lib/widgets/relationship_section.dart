import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../providers/theme_provider.dart';
import '../services/api_service.dart';

class RelationshipSection extends StatefulWidget {
  final AppTheme theme;

  const RelationshipSection({super.key, required this.theme});

  @override
  State<RelationshipSection> createState() => _RelationshipSectionState();
}

class _RelationshipSectionState extends State<RelationshipSection> {
  SiteSettings? _settings;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchSettings();
  }

  Future<void> _fetchSettings() async {
    try {
      final settings = await ApiService.getSettings();
      setState(() {
        _settings = settings;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = widget.theme;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.isNight
            ? const Color(0xFF1E1E3C).withAlpha(200)
            : Colors.white.withAlpha(220),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: theme.primary.withAlpha(100),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: theme.primary.withAlpha(40),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: _isLoading
          ? _buildLoading(theme)
          : _buildContent(theme),
    );
  }

  Widget _buildLoading(AppTheme theme) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 40),
      child: Column(
        children: [
          CircularProgressIndicator(color: theme.primary, strokeWidth: 3),
          const SizedBox(height: 16),
          Text(
            'Loading...',
            style: GoogleFonts.quicksand(
              color: theme.primary,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContent(AppTheme theme) {
    // Use API data or fallbacks
    final person1Name = _settings?.person1Name ?? 'Person 1';
    final person2Name = _settings?.person2Name ?? 'Person 2';
    final person1Photo = _settings?.person1Photo;
    final person2Photo = _settings?.person2Photo;
    final person1Tagline = _settings?.person1Tagline;
    final person2Tagline = _settings?.person2Tagline;
    
    final daysTogether = _settings?.daysTogether ?? 0;
    final monthsTogether = _settings?.monthsTogether ?? 0;
    final yearsTogether = _settings?.yearsTogether ?? 0;

    return Column(
      children: [
        // Section title with heart animation
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('💕', style: TextStyle(fontSize: 20, shadows: [
              Shadow(color: theme.primary.withAlpha(150), blurRadius: 8),
            ])),
            const SizedBox(width: 8),
            ShaderMask(
              shaderCallback: (bounds) => LinearGradient(
                colors: [theme.primary, theme.secondary, theme.primary],
              ).createShader(bounds),
              child: Text(
                'Sweetie',
                style: GoogleFonts.poppins(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  letterSpacing: 1.5,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Text('💕', style: TextStyle(fontSize: 20, shadows: [
              Shadow(color: theme.primary.withAlpha(150), blurRadius: 8),
            ])),
          ],
        ),

        const SizedBox(height: 20),

        // Profile cards row
        Row(
          children: [
            // Person 1
            Expanded(
              child: _buildPersonCard(
                name: person1Name,
                imageUrl: person1Photo,
                tagline: person1Tagline,
                isLeft: true,
              ),
            ),

            // Heart connector with animation
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: _AnimatedHeart(theme: theme),
            ),

            // Person 2
            Expanded(
              child: _buildPersonCard(
                name: person2Name,
                imageUrl: person2Photo,
                tagline: person2Tagline,
                isLeft: false,
              ),
            ),
          ],
        ),

        const SizedBox(height: 20),

        // Relationship stats from API
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                theme.primary.withAlpha(30),
                theme.secondary.withAlpha(20),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: theme.primary.withAlpha(60),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStat('Days', '$daysTogether', '💕'),
              Container(
                width: 1,
                height: 40,
                color: theme.primary.withAlpha(60),
              ),
              _buildStat('Months', '$monthsTogether', '📅'),
              Container(
                width: 1,
                height: 40,
                color: theme.primary.withAlpha(60),
              ),
              _buildStat('Years', '$yearsTogether', '🎉'),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Love quote
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.primary.withAlpha(20),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: theme.accent.withAlpha(80),
            ),
          ),
          child: Row(
            children: [
              Text('💬', style: TextStyle(fontSize: 24, shadows: [
                Shadow(color: theme.primary.withAlpha(100), blurRadius: 6),
              ])),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  '"Every love story is beautiful, but ours is my favorite."',
                  style: GoogleFonts.caveat(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: theme.isNight ? Colors.white70 : theme.secondary,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPersonCard({
    required String name,
    String? imageUrl,
    String? tagline,
    required bool isLeft,
  }) {
    final theme = widget.theme;
    
    // Determine badge based on gender or position
    final badge = isLeft ? '👑 King' : '👸 Queen';

    return Column(
      children: [
        // Avatar with gradient border
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              colors: [theme.primary, theme.secondary],
              begin: isLeft ? Alignment.topLeft : Alignment.topRight,
              end: isLeft ? Alignment.bottomRight : Alignment.bottomLeft,
            ),
            boxShadow: [
              BoxShadow(
                color: theme.primary.withAlpha(80),
                blurRadius: 15,
              ),
            ],
          ),
          child: Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: theme.isNight 
                  ? const Color(0xFF1E1E3C) 
                  : Colors.white,
            ),
            child: CircleAvatar(
              radius: 40,
              backgroundColor: theme.primary.withAlpha(30),
              child: _buildProfileImage(imageUrl),
            ),
          ),
        ),
        const SizedBox(height: 10),
        // Name
        Text(
          name,
          style: GoogleFonts.quicksand(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: theme.isNight ? Colors.white : theme.secondary,
          ),
        ),
        // Tagline if available
        if (tagline != null && tagline.isNotEmpty) ...[
          const SizedBox(height: 2),
          Text(
            tagline,
            style: GoogleFonts.quicksand(
              fontSize: 10,
              color: theme.isNight ? Colors.white54 : Colors.black45,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
        const SizedBox(height: 4),
        // Badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: theme.primary.withAlpha(40),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            badge,
            style: GoogleFonts.quicksand(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: theme.primary,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildProfileImage(String? imageUrl) {
    final theme = widget.theme;
    
    if (imageUrl == null || imageUrl.isEmpty) {
      return Text(
        '👤',
        style: TextStyle(
          fontSize: 36,
          shadows: [Shadow(color: theme.primary, blurRadius: 5)],
        ),
      );
    }

    // Handle relative URLs from backend
    final fullUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : 'https://memoryalbum-wi0j.onrender.com$imageUrl';

    return ClipOval(
      child: CachedNetworkImage(
        imageUrl: fullUrl,
        width: 80,
        height: 80,
        fit: BoxFit.cover,
        placeholder: (context, url) => Container(
          color: theme.primary.withAlpha(30),
          child: Icon(Icons.person, color: theme.primary, size: 40),
        ),
        errorWidget: (context, url, error) => Container(
          color: theme.primary.withAlpha(30),
          child: Text(
            '👤',
            style: TextStyle(
              fontSize: 36,
              shadows: [Shadow(color: theme.primary, blurRadius: 5)],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStat(String label, String value, String emoji) {
    final theme = widget.theme;
    return Column(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 20)),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: theme.primary,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.quicksand(
            fontSize: 12,
            color: theme.isNight ? Colors.white60 : Colors.black54,
          ),
        ),
      ],
    );
  }
}

// Animated heart widget
class _AnimatedHeart extends StatefulWidget {
  final AppTheme theme;
  const _AnimatedHeart({required this.theme});

  @override
  State<_AnimatedHeart> createState() => _AnimatedHeartState();
}

class _AnimatedHeartState extends State<_AnimatedHeart>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = widget.theme;

    return ScaleTransition(
      scale: _scaleAnimation,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          gradient: RadialGradient(
            colors: [
              theme.primary.withAlpha(100),
              theme.primary.withAlpha(30),
            ],
          ),
          shape: BoxShape.circle,
        ),
        child: Text(
          '❤️',
          style: TextStyle(
            fontSize: 28,
            shadows: [
              Shadow(
                color: theme.primary,
                blurRadius: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
