import { theme, appConfig } from '../config';

const { colors, radius, spacing, fontSize, fontWeight } = theme;
const { navigation } = appConfig;

const MobileBottomNav = ({ activeTab, setActiveTab, appearance }) => {
    // Use dynamic navigation from appearance or fallback to config
    const navItems = appearance?.navItems || navigation;
    const primaryDarkColor = appearance?.colorPrimaryDark || colors.primaryDark;
    const darkColor = appearance?.colorDark || colors.dark;

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: darkColor,
            display: 'flex',
            justifyContent: 'space-around',
            padding: `${spacing.sm}px 0 ${spacing.md}px`,
            zIndex: 1000,
            boxShadow: theme.shadows.nav,
        }}>
            {navItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: `${spacing.sm}px ${spacing.lg}px`,
                    border: 'none',
                    background: 'transparent',
                    color: activeTab === item.id ? primaryDarkColor : colors.textLight,
                    fontSize: fontSize.xs,
                    fontWeight: fontWeight.semibold,
                    cursor: 'pointer',
                }}>
                    <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </nav>
    );
};

export default MobileBottomNav;
