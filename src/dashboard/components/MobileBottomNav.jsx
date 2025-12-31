import { theme, appConfig } from '../config';

const { colors, radius, spacing, fontSize, fontWeight } = theme;
const { navigation } = appConfig;

const MobileBottomNav = ({ activeTab, setActiveTab, appearance }) => {
    // Use dynamic navigation from appearance or fallback to config
    const navItems = appearance?.navItems || navigation;
    const primaryDarkColor = appearance?.colorPrimaryDark || colors.primaryDark;
    const darkColor = appearance?.colorDark || colors.dark;

    // Limit to 5 items max for better mobile UX, or make scrollable
    const visibleItems = navItems.slice(0, 6);

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: darkColor,
            display: 'flex',
            justifyContent: visibleItems.length <= 5 ? 'space-around' : 'flex-start',
            padding: `${spacing.sm}px 0`,
            paddingBottom: `max(${spacing.md}px, env(safe-area-inset-bottom))`,
            zIndex: 1000,
            boxShadow: theme.shadows.nav,
            overflowX: visibleItems.length > 5 ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
        }}>
            {visibleItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        padding: `${spacing.xs}px ${visibleItems.length > 5 ? spacing.md : spacing.sm}px`,
                        minWidth: visibleItems.length > 5 ? 60 : 'auto',
                        flex: visibleItems.length <= 5 ? 1 : 'none',
                        border: 'none',
                        background: activeTab === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: activeTab === item.id ? primaryDarkColor : colors.textLight,
                        fontSize: 10,
                        fontWeight: fontWeight.semibold,
                        cursor: 'pointer',
                        borderRadius: radius.md,
                        transition: `all ${theme.transitions.fast}`,
                    }}
                >
                    <span style={{
                        fontSize: 20,
                        lineHeight: 1,
                    }}>{item.icon}</span>
                    <span style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 60,
                    }}>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default MobileBottomNav;
