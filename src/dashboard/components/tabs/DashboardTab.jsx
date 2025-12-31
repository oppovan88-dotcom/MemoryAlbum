import StatCard from '../StatCard';
import { theme, appConfig } from '../../config';

const { colors, radius, spacing, fontSize, fontWeight, shadows } = theme;

const DashboardTab = ({ stats, isMobile }) => {
    if (!stats) return null;

    return (
        <>
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: isMobile ? spacing.md : spacing.xl,
                marginBottom: isMobile ? spacing.lg : spacing.xxl + 4,
            }}>
                {appConfig.statsCards.map(card => (
                    <StatCard
                        key={card.key}
                        icon={card.icon}
                        label={card.label}
                        value={stats[card.key]}
                        color={card.color}
                        subValue={card.subKey ? `${stats[card.subKey]} ${card.subLabel}` : undefined}
                        isMobile={isMobile}
                    />
                ))}
            </div>

            <div style={{
                background: colors.white,
                borderRadius: radius.xxl,
                padding: isMobile ? spacing.lg : spacing.xxl,
                boxShadow: shadows.sm,
            }}>
                <h3 style={{
                    margin: `0 0 ${spacing.lg}px`,
                    color: colors.textPrimary,
                    fontSize: isMobile ? fontSize.xl : fontSize.xxl,
                }}>{appConfig.icons.messages} Recent Messages</h3>

                {stats.recentMessages?.length === 0 ? (
                    <p style={{ color: colors.textSecondary, textAlign: 'center', padding: spacing.xxl }}>{appConfig.messages.noMessages}</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm + 2 }}>
                        {stats.recentMessages?.slice(0, 4).map((msg, i) => (
                            <div key={i} style={{
                                padding: spacing.md,
                                background: msg.isRead ? colors.light : '#fef3c7',
                                borderRadius: radius.lg,
                                borderLeft: `4px solid ${msg.isRead ? colors.border : colors.warning}`,
                            }}>
                                <p style={{ fontWeight: fontWeight.semibold, color: colors.textPrimary, margin: 0, fontSize: fontSize.md }}>{msg.name}</p>
                                <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, margin: '4px 0 0' }}>{msg.message?.substring(0, 50)}...</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default DashboardTab;
