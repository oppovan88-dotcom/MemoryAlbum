import { theme, appConfig } from '../config';

const { colors, radius, spacing, fontSize, fontWeight, shadows } = theme;

const StatCard = ({ icon, label, value, color, subValue, isMobile }) => (
    <div style={{
        background: colors.white,
        borderRadius: radius.xxl,
        padding: isMobile ? spacing.lg : spacing.xxl,
        boxShadow: shadows.sm,
        transition: `all ${theme.transitions.normal}`,
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ minWidth: 0 }}>
                <p style={{
                    margin: '0 0 4px',
                    color: colors.textSecondary,
                    fontSize: fontSize.sm,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>{label}</p>
                <p style={{
                    margin: 0,
                    fontSize: isMobile ? '1.4rem' : fontSize.hero,
                    fontWeight: fontWeight.bold,
                    color: colors.textPrimary,
                }}>{value}</p>
                {subValue && (
                    <span style={{ fontSize: fontSize.sm, color: colors.secondary }}>{subValue}</span>
                )}
            </div>
            <div style={{
                width: isMobile ? 44 : 52,
                height: isMobile ? 44 : 52,
                borderRadius: radius.xl,
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? fontSize.xxl : fontSize.display,
                flexShrink: 0,
            }}>{icon}</div>
        </div>
    </div>
);

export default StatCard;
