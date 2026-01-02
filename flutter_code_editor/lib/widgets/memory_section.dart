import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../providers/theme_provider.dart';
import '../services/api_service.dart';

class MemorySection extends StatefulWidget {
  final AppTheme theme;

  const MemorySection({super.key, required this.theme});

  @override
  State<MemorySection> createState() => _MemorySectionState();
}

class _MemorySectionState extends State<MemorySection> {
  List<MemoryModel> _memories = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchMemories();
  }

  Future<void> _fetchMemories() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final memories = await ApiService.getMemories();
      setState(() {
        _memories = memories;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = widget.theme;

    return Column(
      children: [
        // Section Title
        _buildSectionTitle(theme),

        const SizedBox(height: 16),

        // Loading state
        if (_isLoading)
          Padding(
            padding: const EdgeInsets.all(40),
            child: Column(
              children: [
                CircularProgressIndicator(
                  color: theme.primary,
                  strokeWidth: 3,
                ),
                const SizedBox(height: 16),
                Text(
                  'Loading memories...',
                  style: GoogleFonts.quicksand(
                    color: theme.primary,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          )
        // Error state
        else if (_error != null)
          Padding(
            padding: const EdgeInsets.all(40),
            child: Column(
              children: [
                Icon(Icons.cloud_off, color: theme.primary, size: 48),
                const SizedBox(height: 12),
                Text(
                  'Could not load memories',
                  style: GoogleFonts.quicksand(
                    color: theme.isNight ? Colors.white60 : Colors.black54,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: _fetchMemories,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Retry'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.primary,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          )
        // Empty state
        else if (_memories.isEmpty)
          Padding(
            padding: const EdgeInsets.all(40),
            child: Column(
              children: [
                Text('📸', style: TextStyle(fontSize: 48, shadows: [
                  Shadow(color: theme.primary.withAlpha(100), blurRadius: 10),
                ])),
                const SizedBox(height: 12),
                Text(
                  'No memories yet',
                  style: GoogleFonts.quicksand(
                    color: theme.isNight ? Colors.white60 : Colors.black54,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          )
        // Memory Grid
        else
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.8,
              ),
              itemCount: _memories.length,
              itemBuilder: (context, index) {
                return _buildMemoryCard(_memories[index], index, theme);
              },
            ),
          ),
      ],
    );
  }

  Widget _buildSectionTitle(AppTheme theme) {
    return Column(
      children: [
        // Decorative top
        Text(
          '✨',
          style: TextStyle(
            fontSize: 18,
            shadows: [
              Shadow(color: theme.accent, blurRadius: 8),
            ],
          ),
        ),
        const SizedBox(height: 8),

        // Title container
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                theme.primary.withAlpha(50),
                theme.secondary.withAlpha(40),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: theme.primary.withAlpha(100),
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: theme.primary.withAlpha(40),
                blurRadius: 15,
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('💖', style: TextStyle(fontSize: 16)),
              const SizedBox(width: 8),
              ShaderMask(
                shaderCallback: (bounds) => LinearGradient(
                  colors: [theme.primary, theme.secondary, theme.primary],
                ).createShader(bounds),
                child: Text(
                  'Top Memory Album',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: 1,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              const Text('💖', style: TextStyle(fontSize: 16)),
            ],
          ),
        ),

        const SizedBox(height: 8),

        // Subtitle with count
        Text(
          _memories.isEmpty 
              ? '✨ Our precious moments together ✨'
              : '✨ ${_memories.length} precious memories ✨',
          style: GoogleFonts.quicksand(
            fontSize: 12,
            color: theme.primary.withAlpha(200),
          ),
        ),
      ],
    );
  }

  Widget _buildMemoryCard(MemoryModel memory, int index, AppTheme theme) {
    final decorations = ['💖', '⭐', '✨'];
    final decoration = decorations[index % 3];

    return GestureDetector(
      onTap: () => _openMemoryViewer(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: theme.primary.withAlpha(100),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: theme.primary.withAlpha(40),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Image with caching
              if (memory.imageUrl != null && memory.imageUrl!.isNotEmpty)
                CachedNetworkImage(
                  imageUrl: memory.imageUrl!,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    color: theme.isNight 
                        ? const Color(0xFF1E1E30) 
                        : const Color(0xFFF0F0F0),
                    child: Center(
                      child: CircularProgressIndicator(
                        color: theme.primary,
                        strokeWidth: 2,
                      ),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    color: theme.primary.withAlpha(20),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.image_not_supported,
                          color: theme.primary,
                          size: 32,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          memory.title,
                          style: GoogleFonts.quicksand(
                            fontSize: 12,
                            color: theme.primary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                )
              else
                Container(
                  color: theme.primary.withAlpha(20),
                  child: Center(
                    child: Text(
                      '📷',
                      style: TextStyle(fontSize: 40, shadows: [
                        Shadow(color: theme.primary, blurRadius: 10),
                      ]),
                    ),
                  ),
                ),

              // Corner decoration
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: theme.isNight 
                        ? Colors.black38 
                        : Colors.white54,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    decoration,
                    style: TextStyle(
                      fontSize: 16,
                      shadows: [
                        Shadow(color: theme.primary.withAlpha(150), blurRadius: 6),
                      ],
                    ),
                  ),
                ),
              ),

              // Featured badge
              if (memory.isFeatured)
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: theme.accent,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      '⭐ Featured',
                      style: GoogleFonts.quicksand(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),

              // Bottom gradient overlay with title
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        theme.isNight 
                            ? const Color(0xFF1E1E3C).withAlpha(240)
                            : theme.secondary.withAlpha(180),
                        Colors.transparent,
                      ],
                    ),
                  ),
                  child: Text(
                    memory.title,
                    style: GoogleFonts.quicksand(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _openMemoryViewer(int index) {
    final theme = widget.theme;
    
    showDialog(
      context: context,
      barrierColor: theme.isNight 
          ? const Color(0xFF0F1628).withAlpha(245)
          : theme.primary.withAlpha(40),
      builder: (context) => MemoryViewer(
        memories: _memories,
        initialIndex: index,
        theme: theme,
      ),
    );
  }
}

class MemoryViewer extends StatefulWidget {
  final List<MemoryModel> memories;
  final int initialIndex;
  final AppTheme theme;

  const MemoryViewer({
    super.key,
    required this.memories,
    required this.initialIndex,
    required this.theme,
  });

  @override
  State<MemoryViewer> createState() => _MemoryViewerState();
}

class _MemoryViewerState extends State<MemoryViewer> {
  late int _currentIndex;
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: _currentIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = widget.theme;
    final currentMemory = widget.memories[_currentIndex];

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: GestureDetector(
        onTap: () => Navigator.pop(context),
        child: Stack(
          children: [
            // Main content
            Center(
              child: GestureDetector(
                onTap: () {}, // Prevent close when tapping image
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Top decoration
                    Text(
                      '✨',
                      style: TextStyle(
                        fontSize: 28,
                        shadows: [
                          Shadow(color: theme.accent, blurRadius: 10),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Image viewer
                    SizedBox(
                      width: MediaQuery.of(context).size.width * 0.9,
                      height: MediaQuery.of(context).size.height * 0.55,
                      child: PageView.builder(
                        controller: _pageController,
                        onPageChanged: (index) {
                          setState(() => _currentIndex = index);
                        },
                        itemCount: widget.memories.length,
                        itemBuilder: (context, index) {
                          final memory = widget.memories[index];
                          return Container(
                            margin: const EdgeInsets.symmetric(horizontal: 8),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(22),
                              border: Border.all(
                                color: theme.primary,
                                width: 4,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: theme.primary.withAlpha(100),
                                  blurRadius: 30,
                                ),
                              ],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(18),
                              child: memory.imageUrl != null
                                  ? CachedNetworkImage(
                                      imageUrl: memory.imageUrl!,
                                      fit: BoxFit.cover,
                                      placeholder: (context, url) => Container(
                                        color: theme.primary.withAlpha(30),
                                        child: Center(
                                          child: CircularProgressIndicator(
                                            color: theme.primary,
                                          ),
                                        ),
                                      ),
                                      errorWidget: (context, url, error) => Container(
                                        color: theme.primary.withAlpha(20),
                                        child: Center(
                                          child: Icon(
                                            Icons.image_not_supported,
                                            color: theme.primary,
                                            size: 48,
                                          ),
                                        ),
                                      ),
                                    )
                                  : Container(
                                      color: theme.primary.withAlpha(20),
                                      child: const Center(
                                        child: Text('📷', style: TextStyle(fontSize: 60)),
                                      ),
                                    ),
                            ),
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Title
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      decoration: BoxDecoration(
                        color: theme.isNight
                            ? Colors.black38
                            : Colors.white70,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        currentMemory.title,
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: theme.titleColor,
                        ),
                      ),
                    ),

                    if (currentMemory.description != null && 
                        currentMemory.description!.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.of(context).size.width * 0.8,
                        ),
                        child: Text(
                          currentMemory.description!,
                          style: GoogleFonts.quicksand(
                            fontSize: 13,
                            color: theme.isNight ? Colors.white70 : Colors.black54,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],

                    const SizedBox(height: 12),

                    // Counter
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: theme.primary.withAlpha(100),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: theme.accent.withAlpha(150),
                        ),
                      ),
                      child: Text(
                        '📷 ${_currentIndex + 1} / ${widget.memories.length}',
                        style: GoogleFonts.quicksand(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Close button
            Positioned(
              top: 50,
              right: 20,
              child: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: theme.primary,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: theme.accent.withAlpha(200),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: theme.primary.withAlpha(100),
                        blurRadius: 15,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.close,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
              ),
            ),

            // Navigation arrows
            if (_currentIndex > 0)
              Positioned(
                left: 10,
                top: MediaQuery.of(context).size.height / 2 - 24,
                child: _buildNavButton(
                  Icons.arrow_back_ios,
                  () => _pageController.previousPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  ),
                  theme,
                ),
              ),

            if (_currentIndex < widget.memories.length - 1)
              Positioned(
                right: 10,
                top: MediaQuery.of(context).size.height / 2 - 24,
                child: _buildNavButton(
                  Icons.arrow_forward_ios,
                  () => _pageController.nextPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  ),
                  theme,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavButton(IconData icon, VoidCallback onTap, AppTheme theme) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: theme.primary.withAlpha(230),
          shape: BoxShape.circle,
          border: Border.all(
            color: theme.accent.withAlpha(200),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: theme.primary.withAlpha(100),
              blurRadius: 15,
            ),
          ],
        ),
        child: Icon(icon, color: Colors.white, size: 22),
      ),
    );
  }
}
