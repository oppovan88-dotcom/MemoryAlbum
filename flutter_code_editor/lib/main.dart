import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'providers/theme_provider.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const MemoryAlbumApp(),
    ),
  );
}

class MemoryAlbumApp extends StatelessWidget {
  const MemoryAlbumApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        final theme = themeProvider.currentTheme;
        return MaterialApp(
          title: 'Love Memory',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            brightness: theme.isNight ? Brightness.dark : Brightness.light,
            scaffoldBackgroundColor: Colors.transparent,
            primaryColor: theme.primary,
            colorScheme: ColorScheme.fromSeed(
              seedColor: theme.primary,
              brightness: theme.isNight ? Brightness.dark : Brightness.light,
            ),
            textTheme: GoogleFonts.quicksandTextTheme(),
          ),
          home: const HomeScreen(),
        );
      },
    );
  }
}
