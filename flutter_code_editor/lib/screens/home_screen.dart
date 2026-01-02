import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'dart:math' as math;
import '../providers/theme_provider.dart';
import '../widgets/header_widget.dart';
import '../widgets/memory_section.dart';
import '../widgets/relationship_section.dart';
import '../widgets/floating_icons.dart';
import '../widgets/animated_background.dart';
import '../widgets/footer_widget.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late AnimationController _bgAnimationController;

  @override
  void initState() {
    super.initState();
    _bgAnimationController = AnimationController(
      duration: const Duration(seconds: 15),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _bgAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final theme = themeProvider.currentTheme;

    return Scaffold(
      body: Stack(
        children: [
          // Animated gradient background
          AnimatedBackground(
            theme: theme,
            animationController: _bgAnimationController,
          ),

          // Floating icons overlay
          FloatingIcons(theme: theme),

          // Stars effect for night themes
          if (theme.hasStars) const StarField(),

          // Snow effect for Christmas
          if (theme.hasSnow) const SnowField(),

          // Petals for Sakura
          if (theme.hasPetals) const PetalField(),

          // Main content
          SafeArea(
            child: Column(
              children: [
                // Header
                HeaderWidget(theme: theme),

                // Scrollable content
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Column(
                      children: [
                        const SizedBox(height: 20),
                        
                        // Relationship Section (Sweetie)
                        RelationshipSection(theme: theme),

                        const SizedBox(height: 24),

                        // Memory Album Section
                        MemorySection(theme: theme),

                        const SizedBox(height: 40),

                        // Footer
                        FooterWidget(theme: theme),

                        const SizedBox(height: 20),
                      ],
                    ),
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

// Star field effect
class StarField extends StatefulWidget {
  const StarField({super.key});

  @override
  State<StarField> createState() => _StarFieldState();
}

class _StarFieldState extends State<StarField> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Star> _stars = [];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    // Generate random stars
    for (int i = 0; i < 60; i++) {
      _stars.add(Star(
        x: math.Random().nextDouble(),
        y: math.Random().nextDouble(),
        size: 0.7 + math.Random().nextDouble() * 1.5,
        opacity: 0.3 + math.Random().nextDouble() * 0.7,
      ));
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          size: MediaQuery.of(context).size,
          painter: StarPainter(_stars, _controller.value),
        );
      },
    );
  }
}

class Star {
  final double x, y, size, opacity;
  Star({required this.x, required this.y, required this.size, required this.opacity});
}

class StarPainter extends CustomPainter {
  final List<Star> stars;
  final double animValue;

  StarPainter(this.stars, this.animValue);

  @override
  void paint(Canvas canvas, Size size) {
    for (var star in stars) {
      final paint = Paint()
        ..color = Colors.white.withAlpha((star.opacity * 255 * (0.5 + animValue * 0.5)).toInt())
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);
      
      canvas.drawCircle(
        Offset(star.x * size.width, star.y * size.height),
        star.size,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

// Snow field effect
class SnowField extends StatefulWidget {
  const SnowField({super.key});

  @override
  State<SnowField> createState() => _SnowFieldState();
}

class _SnowFieldState extends State<SnowField> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Snowflake> _flakes = [];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    )..repeat();

    for (int i = 0; i < 40; i++) {
      _flakes.add(Snowflake(
        x: math.Random().nextDouble(),
        delay: math.Random().nextDouble(),
        speed: 0.5 + math.Random().nextDouble() * 0.5,
        size: 8 + math.Random().nextDouble() * 12,
      ));
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: _flakes.map((flake) {
            final y = ((_controller.value + flake.delay) % 1.0);
            return Positioned(
              left: flake.x * MediaQuery.of(context).size.width,
              top: y * MediaQuery.of(context).size.height,
              child: Opacity(
                opacity: 0.6,
                child: Text(
                  '❄️',
                  style: TextStyle(fontSize: flake.size),
                ),
              ),
            );
          }).toList(),
        );
      },
    );
  }
}

class Snowflake {
  final double x, delay, speed, size;
  Snowflake({required this.x, required this.delay, required this.speed, required this.size});
}

// Petal field effect
class PetalField extends StatefulWidget {
  const PetalField({super.key});

  @override
  State<PetalField> createState() => _PetalFieldState();
}

class _PetalFieldState extends State<PetalField> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Petal> _petals = [];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 8),
      vsync: this,
    )..repeat();

    for (int i = 0; i < 20; i++) {
      _petals.add(Petal(
        x: math.Random().nextDouble(),
        delay: math.Random().nextDouble(),
        size: 12 + math.Random().nextDouble() * 10,
      ));
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: _petals.map((petal) {
            final y = ((_controller.value + petal.delay) % 1.0);
            final xOffset = math.sin(y * math.pi * 4) * 30;
            return Positioned(
              left: petal.x * MediaQuery.of(context).size.width + xOffset,
              top: y * MediaQuery.of(context).size.height,
              child: Opacity(
                opacity: 0.7,
                child: Transform.rotate(
                  angle: y * math.pi * 2,
                  child: Text(
                    '🌸',
                    style: TextStyle(fontSize: petal.size),
                  ),
                ),
              ),
            );
          }).toList(),
        );
      },
    );
  }
}

class Petal {
  final double x, delay, size;
  Petal({required this.x, required this.delay, required this.size});
}
