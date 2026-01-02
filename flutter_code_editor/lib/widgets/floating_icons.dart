import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../providers/theme_provider.dart';

class FloatingIcons extends StatefulWidget {
  final AppTheme theme;

  const FloatingIcons({super.key, required this.theme});

  @override
  State<FloatingIcons> createState() => _FloatingIconsState();
}

class _FloatingIconsState extends State<FloatingIcons> with TickerProviderStateMixin {
  late List<AnimationController> _controllers;
  late List<FloatingIconData> _icons;

  @override
  void initState() {
    super.initState();
    _initializeIcons();
  }

  void _initializeIcons() {
    _controllers = [];
    _icons = [];

    final iconsList = widget.theme.floatingIcons;
    
    for (int i = 0; i < iconsList.length; i++) {
      final controller = AnimationController(
        duration: Duration(seconds: 15 + i * 3),
        vsync: this,
      )..repeat();
      
      _controllers.add(controller);
      
      _icons.add(FloatingIconData(
        icon: iconsList[i],
        startX: (i * 0.15 + 0.05) % 0.9,
        startY: 0.1 + (i * 0.12) % 0.8,
        size: 20 + (i % 3) * 8.0,
        animationOffset: i * 0.3,
      ));
    }
  }

  @override
  void dispose() {
    for (var controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Stack(
      children: List.generate(_icons.length, (i) {
        final icon = _icons[i];
        final controller = _controllers[i];

        return AnimatedBuilder(
          animation: controller,
          builder: (context, child) {
            final value = controller.value;
            final xOffset = math.sin((value + icon.animationOffset) * math.pi * 2) * 30;
            final yOffset = math.cos((value + icon.animationOffset) * math.pi * 4) * 20;

            return Positioned(
              left: icon.startX * size.width + xOffset,
              top: icon.startY * size.height + yOffset,
              child: Opacity(
                opacity: 0.4 + math.sin(value * math.pi * 2) * 0.2,
                child: Transform.rotate(
                  angle: math.sin(value * math.pi * 2) * 0.2,
                  child: Text(
                    icon.icon,
                    style: TextStyle(
                      fontSize: icon.size,
                      shadows: [
                        Shadow(
                          color: widget.theme.accent.withAlpha(100),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        );
      }),
    );
  }
}

class FloatingIconData {
  final String icon;
  final double startX;
  final double startY;
  final double size;
  final double animationOffset;

  FloatingIconData({
    required this.icon,
    required this.startX,
    required this.startY,
    required this.size,
    required this.animationOffset,
  });
}
