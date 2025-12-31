import { theme, appConfig } from '../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight } = theme;

const Header = ({ searchQuery, setSearchQuery, title, isMobile, onLogout }) => (
    <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? `${spacing.md}px ${spacing.lg}px` : `${spacing.lg}px ${spacing.xxxl}px`,
        background: colors.white,
        borderBottom: `1px solid ${colors.border}`,
        gap: spacing.md,
        flexWrap: 'wrap',
    }}>
        <h1 style={{
            margin: 0,
            fontSize: isMobile ? fontSize.xxl : fontSize.display,
            fontWeight: fontWeight.bold,
            color: colors.textPrimary,
        }}>{title}</h1>

        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            flex: isMobile ? '1 1 100%' : 'none',
            order: isMobile ? 1 : 0,
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm + 2,
                padding: `${spacing.sm + 2}px ${spacing.lg - 2}px`,
                background: colors.light,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border}`,
                flex: 1,
                maxWidth: isMobile ? '100%' : 280,
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
                        minWidth: 0,
                    }}
                />
            </div>
            {isMobile && (
                <button onClick={onLogout} style={{
                    padding: `${spacing.sm + 2}px ${spacing.lg - 2}px`,
                    borderRadius: radius.lg,
                    border: 'none',
                    background: colors.danger,
                    color: colors.textWhite,
                    fontSize: fontSize.base,
                    cursor: 'pointer',
                }}>{appConfig.icons.logout}</button>
            )}
        </div>
    </header>
);

export default Header;
