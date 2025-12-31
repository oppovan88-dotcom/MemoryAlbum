import { theme, appConfig } from '../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight } = theme;

const Header = ({ searchQuery, setSearchQuery, title, isMobile, onLogout, appearance }) => {
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
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            minHeight: isMobile ? 56 : 'auto',
        }}>
            <h1 style={{
                margin: 0,
                fontSize: isMobile ? fontSize.xl : fontSize.display,
                fontWeight: fontWeight.bold,
                color: colors.textPrimary,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: isMobile ? '0 0 auto' : 'none',
            }}>{title}</h1>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                flex: isMobile ? 1 : 'none',
                justifyContent: 'flex-end',
            }}>
                {/* Search - hide on mobile or show smaller */}
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

                {/* Mobile: minimal search icon and logout */}
                {isMobile && (
                    <>
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
                            }}
                        >{appConfig.icons.search}</button>
                        <button onClick={onLogout} style={{
                            padding: spacing.sm,
                            borderRadius: radius.md,
                            border: 'none',
                            background: colors.danger,
                            color: colors.textWhite,
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>{appConfig.icons.logout}</button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
