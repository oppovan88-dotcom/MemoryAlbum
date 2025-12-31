// ============================================
// THEME CONFIGURATION - Easy to customize!
// ============================================

export const theme = {
    // Brand Colors
    colors: {
        primary: '#6366f1',        // Main brand color (indigo)
        primaryDark: '#8b5cf6',    // Darker variant (violet)
        secondary: '#10b981',      // Success/secondary (emerald)
        secondaryDark: '#059669',
        accent: '#ec4899',         // Accent color (pink)
        accentDark: '#db2777',
        warning: '#f59e0b',        // Warning (amber)
        danger: '#ef4444',         // Danger/error (red)
        success: '#22c55e',        // Success (green)

        // Neutrals
        dark: '#1e293b',           // Dark background
        darker: '#0f172a',         // Darker background
        light: '#f8fafc',          // Light background
        white: '#ffffff',

        // Text colors
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        textMuted: '#9ca3af',
        textLight: 'rgba(255,255,255,0.7)',
        textWhite: '#ffffff',

        // Borders
        border: '#e5e7eb',
        borderLight: '#f3f4f6',
        borderDark: 'rgba(255,255,255,0.08)',
    },

    // Gradients
    gradients: {
        primary: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        secondary: 'linear-gradient(135deg, #10b981, #059669)',
        accent: 'linear-gradient(135deg, #ec4899, #db2777)',
        success: 'linear-gradient(135deg, #22c55e, #16a34a)',
        sidebar: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        timeline: 'linear-gradient(135deg, #fff5f9 0%, #ffe8f3 100%)',
    },

    // Shadows
    shadows: {
        sm: '0 1px 3px rgba(0,0,0,0.05)',
        md: '0 4px 15px rgba(0,0,0,0.1)',
        lg: '0 25px 50px rgba(0,0,0,0.25)',
        accent: '0 4px 15px rgba(236, 72, 153, 0.4)',
        primary: '0 4px 15px rgba(99, 102, 241, 0.4)',
        nav: '0 -4px 20px rgba(0,0,0,0.15)',
    },

    // Border Radius
    radius: {
        sm: 6,
        md: 8,
        lg: 10,
        xl: 12,
        xxl: 16,
        round: 20,
        full: '50%',
    },

    // Spacing
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },

    // Font sizes
    fontSize: {
        xs: '0.7rem',
        sm: '0.75rem',
        base: '0.85rem',
        md: '0.9rem',
        lg: '0.95rem',
        xl: '1rem',
        xxl: '1.1rem',
        xxxl: '1.25rem',
        display: '1.5rem',
        hero: '1.75rem',
    },

    // Font weights
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    // Transitions
    transitions: {
        fast: '0.15s',
        normal: '0.2s',
        slow: '0.3s',
    },

    // Breakpoints
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280,
    },

    // Sidebar
    sidebar: {
        width: 260,
    },
};

// Helper function to get color with opacity
export const withOpacity = (color, opacity) => {
    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
};

export default theme;
