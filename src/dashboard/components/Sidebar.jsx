import { theme, appConfig } from '../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = theme;
const { name, shortName, description, navigation } = appConfig;

const Sidebar = ({ activeTab, setActiveTab, admin, onLogout, isMobile, isOpen, setIsOpen, backendStatus, appearance }) => {
    // Use dynamic appearance settings or fallback to defaults
    const appName = appearance?.appName || name;
    const appShortName = appearance?.appShortName || shortName;
    const navItems = appearance?.navItems || navigation;
    const primaryColor = appearance?.colorPrimary || colors.primary;
    const primaryDarkColor = appearance?.colorPrimaryDark || colors.primaryDark;
    const darkColor = appearance?.colorDark || colors.dark;
    const darkerColor = appearance?.colorDarker || colors.darker;

    const handleNavClick = (tabId) => {
        setActiveTab(tabId);
        if (isMobile) setIsOpen(false); // Close sidebar on mobile when clicking a menu item
    };

    // Mobile: Overlay + Drawer
    if (isMobile) {
        return (
            <>
                {/* Overlay */}
                {isOpen && (
                    <div
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 999,
                            transition: 'opacity 0.3s ease',
                        }}
                    />
                )}

                {/* Slide-in Drawer */}
                <aside style={{
                    position: 'fixed',
                    left: isOpen ? 0 : -280,
                    top: 0,
                    bottom: 0,
                    width: 280,
                    background: `linear-gradient(180deg, ${darkColor} 0%, ${darkerColor} 100%)`,
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    transition: 'left 0.3s ease',
                    boxShadow: isOpen ? shadows.lg : 'none',
                }}>
                    {/* Logo */}
                    <div style={{ padding: `${spacing.xl}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.borderDark}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: radius.lg,
                                background: `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: fontSize.xl,
                                fontWeight: fontWeight.bold,
                                color: colors.textWhite,
                            }}>{appShortName}</div>
                            <span style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textWhite }}>{appName}</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav style={{ flex: 1, padding: `${spacing.lg}px ${spacing.md}px`, overflowY: 'auto' }}>
                        {navItems.map(item => (
                            <button key={item.id} onClick={() => handleNavClick(item.id)} style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing.md,
                                padding: `${spacing.md}px ${spacing.lg}px`,
                                marginBottom: spacing.xs,
                                borderRadius: radius.lg,
                                border: 'none',
                                background: activeTab === item.id ? `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})` : 'transparent',
                                color: activeTab === item.id ? colors.textWhite : colors.textLight,
                                fontSize: fontSize.md,
                                fontWeight: activeTab === item.id ? fontWeight.semibold : fontWeight.medium,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: `all ${theme.transitions.normal}`,
                            }}>
                                <span style={{ fontSize: fontSize.xl }}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* User Profile & Logout */}
                    <div style={{ padding: `${spacing.md}px ${spacing.lg}px`, borderTop: `1px solid ${colors.borderDark}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: radius.full,
                                background: gradients.secondary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: fontSize.md,
                                color: colors.textWhite,
                                fontWeight: fontWeight.semibold,
                            }}>AD</div>
                            <div>
                                <p style={{ margin: 0, color: colors.textWhite, fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
                                    {admin?.name || 'Admin'}
                                </p>
                                <p style={{ margin: 0, color: colors.textLight, fontSize: fontSize.xs }}>Administrator</p>
                            </div>
                        </div>

                        <button onClick={onLogout} style={{
                            width: '100%',
                            padding: `${spacing.sm}px`,
                            borderRadius: radius.md,
                            border: `1px solid ${colors.borderDark}`,
                            background: 'rgba(255,255,255,0.05)',
                            color: colors.textLight,
                            fontSize: fontSize.sm,
                            cursor: 'pointer',
                            marginBottom: spacing.sm,
                        }}>{appConfig.icons.logout} Logout</button>

                        {/* Connection Status */}
                        <div style={{
                            padding: `${spacing.xs}px ${spacing.sm}px`,
                            borderRadius: radius.md,
                            background: backendStatus === 'online' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${backendStatus === 'online' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.xs,
                        }}>
                            <div style={{
                                width: 6,
                                height: 6,
                                borderRadius: radius.full,
                                background: backendStatus === 'online' ? colors.success : colors.danger,
                            }} />
                            <span style={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: backendStatus === 'online' ? colors.success : colors.danger }}>
                                {backendStatus === 'online' ? 'CONNECTED' : 'OFFLINE'}
                            </span>
                        </div>
                    </div>
                </aside>
            </>
        );
    }

    // Desktop: Fixed Sidebar
    return (
        <aside style={{
            width: theme.sidebar.width,
            minHeight: '100vh',
            background: `linear-gradient(180deg, ${darkColor} 0%, ${darkerColor} 100%)`,
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ padding: `${spacing.xxl}px ${spacing.xl}px`, borderBottom: `1px solid ${colors.borderDark}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: radius.lg,
                        background: `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: fontSize.xxl,
                        fontWeight: fontWeight.bold,
                        color: colors.textWhite,
                    }}>{appShortName}</div>
                    <span style={{ fontSize: fontSize.xxxl, fontWeight: fontWeight.bold, color: colors.textWhite }}>{appName}</span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: `${spacing.xl}px ${spacing.md}px` }}>
                {navItems.map(item => (
                    <button key={item.id} onClick={() => handleNavClick(item.id)} style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: `${spacing.lg - 2}px ${spacing.lg}px`,
                        marginBottom: spacing.sm - 2,
                        borderRadius: radius.lg,
                        border: 'none',
                        background: activeTab === item.id ? `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})` : 'transparent',
                        color: activeTab === item.id ? colors.textWhite : colors.textLight,
                        fontSize: fontSize.lg,
                        fontWeight: activeTab === item.id ? fontWeight.semibold : fontWeight.medium,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: `all ${theme.transitions.normal}`,
                    }}>
                        <span style={{ fontSize: fontSize.xxl }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div style={{ padding: `${spacing.lg}px ${spacing.xl}px`, borderTop: `1px solid ${colors.borderDark}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
                    <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        background: gradients.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: fontSize.xl,
                        color: colors.textWhite,
                        fontWeight: fontWeight.semibold,
                    }}>AD</div>
                    <div>
                        <p style={{ margin: 0, color: colors.textWhite, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}>
                            {admin?.name || 'Admin User'}
                        </p>
                        <p style={{ margin: 0, color: colors.textLight, fontSize: fontSize.sm }}>Administrator</p>
                    </div>
                </div>

                <button onClick={onLogout} style={{
                    width: '100%',
                    padding: `${spacing.sm + 2}px`,
                    borderRadius: radius.md,
                    border: `1px solid ${colors.borderDark}`,
                    background: 'rgba(255,255,255,0.05)',
                    color: colors.textLight,
                    fontSize: fontSize.base,
                    cursor: 'pointer',
                    transition: `all ${theme.transitions.normal}`,
                    marginBottom: spacing.md,
                }}>{appConfig.icons.logout} Logout</button>

                {/* Connection Status Badge */}
                <div style={{
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    borderRadius: radius.md,
                    background: backendStatus === 'online' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${backendStatus === 'online' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                }}>
                    <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: radius.full,
                        background: backendStatus === 'online' ? colors.success : colors.danger,
                        boxShadow: `0 0 8px ${backendStatus === 'online' ? colors.success : colors.danger}`,
                    }} />
                    <span style={{
                        fontSize: fontSize.sm,
                        fontWeight: fontWeight.semibold,
                        color: backendStatus === 'online' ? colors.success : colors.danger,
                    }}>
                        Server: {backendStatus === 'online' ? 'CONNECTED' : 'OFFLINE'}
                    </span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
