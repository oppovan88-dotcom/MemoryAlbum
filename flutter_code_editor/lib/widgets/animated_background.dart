import 'package:flutter/material.dart';
import '../providers/theme_provider.dart';

class AnimatedBackground extends StatelessWidget {
  final AppTheme theme;
  final AnimationController animationController;

  const AnimatedBackground({
    super.key,
    required this.theme,
    required this.animationController,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animationController,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment(
                -1.0 + animationController.value * 0.5,
                -1.0 + animationController.value * 0.3,
              ),
              end: Alignment(
                1.0 - animationController.value * 0.3,
                1.0 - animationController.value * 0.5,
              ),
              colors: theme.gradientColors,
              stops: const [0.0, 0.5, 1.0],
            ),
          ),
        );
      },
    );
  }
}
