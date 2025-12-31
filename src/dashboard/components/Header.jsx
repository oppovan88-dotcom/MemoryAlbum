import { theme, appConfig } from '../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight } = theme;

const Header = ({ searchQuery, setSearchQuery, title, isMobile, onLogout, appearance, onToggleSidebar }) => {
    // Use dynamic appearance colors
    const primaryColor = appearance?.colorPrimary || colors.primary;

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? `${spacing.md}px ${spacing.lg}px` : `${spacing.lg}px ${spacing.xxxl}px`,
            background: colors.white,
            borderBottom: `1px solid ${colors.border}`,
            gap: spacing.sm,
            flexWrap: 'nowrap',
            minHeight: isMobile ? 56 : 'auto',
        }}>
            {/* Left side: Menu button (mobile) + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flex: 1, minWidth: 0 }}>
                {/* Hamburger Menu Button - Mobile Only */}
                {isMobile && (
                    <button
                        onClick={onToggleSidebar}
                        style={{
                            padding: spacing.sm,
                            borderRadius: radius.md,
                            border: 'none',
                            background: colors.dark,
                            color: colors.textWhite,
                            fontSize: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            flexShrink: 0,
                        }}
                    >☰</button>
                )}

                <h1 style={{
                    margin: 0,
                    fontSize: isMobile ? fontSize.lg : fontSize.display,
                    fontWeight: fontWeight.bold,
                    color: colors.textPrimary,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>{title}</h1>
            </div>

            {/* Right side: Search + Actions */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                flexShrink: 0,
            }}>
                {/* Search - Desktop */}
                {!isMobile && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm + 2,
                        padding: `${spacing.sm + 2}px ${spacing.lg - 2}px`,
                        background: colors.light,
                        borderRadius: radius.lg,
                        border: `1px solid ${colors.border}`,
                        maxWidth: 280,
                    }}>
                        <span style={{ color: colors.textMuted }}>{appConfig.icons.search}</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                border: 'none',
                                background: 'transparent',
                                fontSize: '16px',
                                outline: 'none',
                                minWidth: 100,
                            }}
                        />
                    </div>
                )}

                {/* Mobile: Search icon */}
                {isMobile && (
                    <button
                        onClick={() => {
                            const query = prompt('Search:');
                            if (query !== null) setSearchQuery(query);
                        }}
                        style={{
                            padding: spacing.sm,
                            borderRadius: radius.md,
                            border: `1px solid ${colors.border}`,
                            background: colors.light,
                            color: colors.textSecondary,
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                        }}
                    >{appConfig.icons.search}</button>
                )}
            </div>
        </header>
    );
};

export default Header;
