// ============================================
// THEME SYSTEM - 10 Beautiful Themes
// ============================================

export const themes = {
    // 1. Light Pink Romance
    romance: {
        id: 'romance',
        name: '💕 Romance',
        description: 'Soft pink and warm vibes',
        isNight: false,
        colors: {
            background: 'linear-gradient(-45deg, #ffeef8, #fff0f5, #ffe4ec, #fff5f8)',
            headerBg: 'rgba(255,255,255,0.68)',
            headerBorder: '1.5px solid #ffb3d6',
            headerShadow: '0 4px 18px #ff69b420',
            titleColor: '#d72660',
            iconColor: '#ff69b4',
            iconShadow: 'drop-shadow(0 1px 7px #ffb3d6a8)',
            primary: '#ff69b4',
            secondary: '#d72660',
            accent: '#ffb3d6',
        },
        floatingIcons: [
            { icon: '💕', cls: 'h1' },
            { icon: '💗', cls: 'h2' },
            { icon: '💖', cls: 'h3' },
            { icon: '💞', cls: 'h4' },
            { icon: '🌸', cls: 'h5' },
            { icon: '✨', cls: 'h6' },
        ],
        cssClass: 'theme-romance',
    },

    // 2. Galaxy Night
    galaxy: {
        id: 'galaxy',
        name: '🌌 Galaxy',
        description: 'Deep space purple vibes',
        isNight: true,
        colors: {
            background: 'radial-gradient(ellipse at 80% 10%, #7f53ff 0%, transparent 45%), radial-gradient(ellipse at 20% 80%, #0abcf9 0%, transparent 50%), radial-gradient(ellipse at 50% 30%, #e664fa55 0%, transparent 55%), linear-gradient(135deg, #1b2346 0%, #3d194e 50%, #0a1338 100%)',
            headerBg: 'rgba(40,26,80,0.84)',
            headerBorder: '1.5px solid #6742b7',
            headerShadow: '0 4px 22px #41277670',
            titleColor: '#bfa7fc',
            iconColor: '#a77dfd',
            iconShadow: 'drop-shadow(0 1px 10px #8f6dfbb2)',
            primary: '#a77dfd',
            secondary: '#7f53ff',
            accent: '#bfa7fc',
        },
        floatingIcons: [
            { icon: '💜', cls: 'h1' },
            { icon: '💙', cls: 'h2' },
            { icon: '💫', cls: 'h3' },
            { icon: '🌌', cls: 'h4' },
            { icon: '💖', cls: 'h5' },
            { icon: '🌠', cls: 'h6' },
        ],
        hasStars: true,
        cssClass: 'theme-galaxy',
    },

    // 3. Christmas
    christmas: {
        id: 'christmas',
        name: '🎄 Christmas',
        description: 'Festive holiday spirit',
        isNight: false,
        colors: {
            background: 'linear-gradient(-45deg, #1a472a, #c41e3a, #2d5a3c, #ffd700, #8b0000, #228b22)',
            headerBg: 'rgba(26, 71, 42, 0.85)',
            headerBorder: '1.5px solid #ffd700',
            headerShadow: '0 4px 22px rgba(196, 30, 58, 0.3)',
            titleColor: '#ffd700',
            iconColor: '#c41e3a',
            iconShadow: 'drop-shadow(0 1px 7px #ffd70088)',
            primary: '#c41e3a',
            secondary: '#228b22',
            accent: '#ffd700',
        },
        floatingIcons: [
            { icon: '🎄', cls: 'h1' },
            { icon: '⭐', cls: 'h2' },
            { icon: '🎁', cls: 'h3' },
            { icon: '❄️', cls: 'h4' },
            { icon: '🔔', cls: 'h5' },
            { icon: '✨', cls: 'h6' },
        ],
        hasSnow: true,
        cssClass: 'theme-christmas',
    },

    // 4. Ocean Breeze
    ocean: {
        id: 'ocean',
        name: '🌊 Ocean',
        description: 'Calm blue waters',
        isNight: false,
        colors: {
            background: 'linear-gradient(-45deg, #e0f7fa, #b2ebf2, #80deea, #4dd0e1, #26c6da, #00bcd4)',
            headerBg: 'rgba(255,255,255,0.75)',
            headerBorder: '1.5px solid #4dd0e1',
            headerShadow: '0 4px 18px rgba(38, 198, 218, 0.25)',
            titleColor: '#0097a7',
            iconColor: '#00bcd4',
            iconShadow: 'drop-shadow(0 1px 7px #4dd0e188)',
            primary: '#00bcd4',
            secondary: '#0097a7',
            accent: '#80deea',
        },
        floatingIcons: [
            { icon: '🌊', cls: 'h1' },
            { icon: '🐚', cls: 'h2' },
            { icon: '🐬', cls: 'h3' },
            { icon: '🦋', cls: 'h4' },
            { icon: '💎', cls: 'h5' },
            { icon: '✨', cls: 'h6' },
        ],
        hasBubbles: true,
        cssClass: 'theme-ocean',
    },

    // 5. Sunset Glow
    sunset: {
        id: 'sunset',
        name: '🌅 Sunset',
        description: 'Warm orange and pink hues',
        isNight: false,
        colors: {
            background: 'linear-gradient(-45deg, #ff9a9e, #fad0c4, #ffecd2, #fcb69f, #ff9a9e, #fad390)',
            headerBg: 'rgba(255, 250, 245, 0.8)',
            headerBorder: '1.5px solid #ff9a9e',
            headerShadow: '0 4px 18px rgba(255, 154, 158, 0.3)',
            titleColor: '#e55039',
            iconColor: '#ff9a9e',
            iconShadow: 'drop-shadow(0 1px 7px #fcb69f88)',
            primary: '#ff9a9e',
            secondary: '#e55039',
            accent: '#fad0c4',
        },
        floatingIcons: [
            { icon: '🌅', cls: 'h1' },
            { icon: '🌻', cls: 'h2' },
            { icon: '🧡', cls: 'h3' },
            { icon: '🦋', cls: 'h4' },
            { icon: '✨', cls: 'h5' },
            { icon: '🌸', cls: 'h6' },
        ],
        cssClass: 'theme-sunset',
    },

    // 6. Forest Dream
    forest: {
        id: 'forest',
        name: '🌲 Forest',
        description: 'Natural green serenity',
        isNight: false,
        colors: {
            background: 'linear-gradient(-45deg, #c8e6c9, #a5d6a7, #81c784, #66bb6a, #4caf50, #43a047)',
            headerBg: 'rgba(255, 255, 255, 0.75)',
            headerBorder: '1.5px solid #81c784',
            headerShadow: '0 4px 18px rgba(76, 175, 80, 0.25)',
            titleColor: '#2e7d32',
            iconColor: '#4caf50',
            iconShadow: 'drop-shadow(0 1px 7px #81c78488)',
            primary: '#4caf50',
            secondary: '#2e7d32',
            accent: '#a5d6a7',
        },
        floatingIcons: [
            { icon: '🌲', cls: 'h1' },
            { icon: '🍃', cls: 'h2' },
            { icon: '🌿', cls: 'h3' },
            { icon: '🦋', cls: 'h4' },
            { icon: '🌻', cls: 'h5' },
            { icon: '✨', cls: 'h6' },
        ],
        hasLeaves: true,
        cssClass: 'theme-forest',
    },

    // 7. Midnight Blue
    midnight: {
        id: 'midnight',
        name: '🌙 Midnight',
        description: 'Deep blue night sky',
        isNight: true,
        colors: {
            background: 'linear-gradient(-45deg, #0c2461, #1e3799, #4a69bd, #1e3799, #0c2461, #0a3d62)',
            headerBg: 'rgba(12, 36, 97, 0.9)',
            headerBorder: '1.5px solid #4a69bd',
            headerShadow: '0 4px 22px rgba(74, 105, 189, 0.4)',
            titleColor: '#82ccdd',
            iconColor: '#4a69bd',
            iconShadow: 'drop-shadow(0 1px 10px #82ccdd88)',
            primary: '#4a69bd',
            secondary: '#1e3799',
            accent: '#82ccdd',
        },
        floatingIcons: [
            { icon: '🌙', cls: 'h1' },
            { icon: '⭐', cls: 'h2' },
            { icon: '💙', cls: 'h3' },
            { icon: '🌟', cls: 'h4' },
            { icon: '✨', cls: 'h5' },
            { icon: '🔮', cls: 'h6' },
        ],
        hasStars: true,
        cssClass: 'theme-midnight',
    },

    // 8. Cherry Blossom
    sakura: {
        id: 'sakura',
        name: '🌸 Sakura',
        description: 'Japanese cherry blossom',
        isNight: false,
        colors: {
            background: 'linear-gradient(-45deg, #fce4ec, #f8bbd9, #f48fb1, #f8bbd9, #fce4ec, #fff0f5)',
            headerBg: 'rgba(255, 255, 255, 0.75)',
            headerBorder: '1.5px solid #f48fb1',
            headerShadow: '0 4px 18px rgba(244, 143, 177, 0.3)',
            titleColor: '#c2185b',
            iconColor: '#f48fb1',
            iconShadow: 'drop-shadow(0 1px 7px #f8bbd988)',
            primary: '#f48fb1',
            secondary: '#c2185b',
            accent: '#fce4ec',
        },
        floatingIcons: [
            { icon: '🌸', cls: 'h1' },
            { icon: '🎀', cls: 'h2' },
            { icon: '💮', cls: 'h3' },
            { icon: '🌷', cls: 'h4' },
            { icon: '🦋', cls: 'h5' },
            { icon: '✨', cls: 'h6' },
        ],
        hasPetals: true,
        cssClass: 'theme-sakura',
    },

    // 9. Golden Luxury
    luxury: {
        id: 'luxury',
        name: '👑 Luxury',
        description: 'Elegant black and gold',
        isNight: true,
        colors: {
            background: 'linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #16213e, #1a1a2e, #0f0f1a)',
            headerBg: 'rgba(26, 26, 46, 0.92)',
            headerBorder: '1.5px solid #ffd700',
            headerShadow: '0 4px 22px rgba(255, 215, 0, 0.25)',
            titleColor: '#ffd700',
            iconColor: '#ffd700',
            iconShadow: 'drop-shadow(0 1px 10px #ffd70088)',
            primary: '#ffd700',
            secondary: '#b8860b',
            accent: '#fffacd',
        },
        floatingIcons: [
            { icon: '👑', cls: 'h1' },
            { icon: '💎', cls: 'h2' },
            { icon: '⭐', cls: 'h3' },
            { icon: '🏆', cls: 'h4' },
            { icon: '✨', cls: 'h5' },
            { icon: '💫', cls: 'h6' },
        ],
        hasSparkles: true,
        cssClass: 'theme-luxury',
    },

    // 10. Aurora Borealis
    aurora: {
        id: 'aurora',
        name: '🌌 Aurora',
        description: 'Northern lights magic',
        isNight: true,
        colors: {
            background: 'linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #1a1a2e, #0f0c29, #1d1d3b)',
            headerBg: 'rgba(15, 12, 41, 0.9)',
            headerBorder: '1.5px solid #64ffda',
            headerShadow: '0 4px 22px rgba(100, 255, 218, 0.25)',
            titleColor: '#64ffda',
            iconColor: '#64ffda',
            iconShadow: 'drop-shadow(0 1px 10px #64ffda88)',
            primary: '#64ffda',
            secondary: '#bb86fc',
            accent: '#03dac6',
        },
        floatingIcons: [
            { icon: '🌌', cls: 'h1' },
            { icon: '💜', cls: 'h2' },
            { icon: '💚', cls: 'h3' },
            { icon: '💙', cls: 'h4' },
            { icon: '✨', cls: 'h5' },
            { icon: '🌟', cls: 'h6' },
        ],
        hasAurora: true,
        hasStars: true,
        cssClass: 'theme-aurora',
    },
};

// Get theme by ID (with fallback to romance)
export const getTheme = (themeId) => {
    return themes[themeId] || themes.romance;
};

// Get all theme options for the selector
export const getThemeOptions = () => {
    return Object.values(themes).map(theme => ({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        isNight: theme.isNight,
    }));
};

// Default theme
export const DEFAULT_THEME = 'romance';

export default themes;
