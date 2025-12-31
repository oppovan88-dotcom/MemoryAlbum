import { theme, appConfig } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = theme;
const { icons, messages } = appConfig;

const TimelineTab = ({ timelineItems, isMobile, onShowAddModal, onEdit, onDelete, onMove }) => {
    const btnStyle = (disabled, bg) => ({
        padding: `${spacing.xs}px ${spacing.sm}px`,
        borderRadius: radius.sm,
        border: 'none',
        background: disabled ? colors.border : bg,
        color: colors.textWhite,
        fontSize: fontSize.xs,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: fontWeight.bold,
    });

    return (
        <div style={{
            background: colors.white,
            borderRadius: radius.xxl,
            padding: isMobile ? spacing.lg : spacing.xxl,
            boxShadow: shadows.sm,
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.xl,
                flexWrap: 'wrap',
                gap: spacing.md,
            }}>
                <h2 style={{ margin: 0, color: colors.textPrimary, fontSize: isMobile ? fontSize.xl : fontSize.xxl }}>
                    {icons.heart} Timeline Manager
                </h2>
                <button onClick={onShowAddModal} style={{
                    padding: `${spacing.sm + 2}px ${spacing.xl}px`,
                    borderRadius: radius.lg,
                    border: 'none',
                    background: gradients.accent,
                    color: colors.textWhite,
                    fontWeight: fontWeight.semibold,
                    cursor: 'pointer',
                    fontSize: fontSize.md,
                    boxShadow: shadows.accent,
                }}>{icons.add} Add Moment</button>
            </div>

            {timelineItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: colors.textSecondary }}>
                    <span style={{ fontSize: 40, display: 'block', marginBottom: spacing.md }}>{icons.timeline}</span>
                    <p>{messages.noTimeline}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {timelineItems.map((item, idx) => (
                        <div key={item._id} style={{
                            padding: isMobile ? spacing.md : spacing.lg,
                            background: gradients.timeline,
                            borderRadius: radius.xl,
                            borderLeft: `4px solid ${colors.accent}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: spacing.md,
                        }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm + 2, marginBottom: spacing.xs, flexWrap: 'wrap' }}>
                                    <span style={{
                                        background: gradients.accent,
                                        color: colors.textWhite,
                                        padding: `${spacing.xs}px ${spacing.sm + 2}px`,
                                        borderRadius: radius.round,
                                        fontSize: fontSize.sm,
                                        fontWeight: fontWeight.semibold,
                                    }}>{icons.time} {item.time}</span>
                                    <span style={{ color: colors.textMuted, fontSize: fontSize.xs }}>#{idx + 1}</span>
                                </div>
                                <h4 style={{ margin: `${spacing.sm - 2}px 0 ${spacing.xs}px`, color: colors.accentDark, fontSize: fontSize.lg }}>{item.activity}</h4>
                                {item.details && <p style={{ margin: 0, color: colors.textSecondary, fontSize: fontSize.base }}>{item.details}</p>}
                            </div>
                            <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                                    <button onClick={() => onMove(idx, 'up')} disabled={idx === 0} style={btnStyle(idx === 0, colors.primaryDark)}>{icons.up}</button>
                                    <button onClick={() => onMove(idx, 'down')} disabled={idx === timelineItems.length - 1} style={btnStyle(idx === timelineItems.length - 1, colors.primaryDark)}>{icons.down}</button>
                                </div>
                                <button onClick={() => onEdit(item)} style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.md, border: 'none', background: colors.success, color: colors.textWhite, fontSize: fontSize.sm, cursor: 'pointer', fontWeight: fontWeight.semibold }}>Edit</button>
                                <button onClick={() => onDelete(item._id)} style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.md, border: 'none', background: colors.danger, color: colors.textWhite, fontSize: fontSize.sm, cursor: 'pointer', fontWeight: fontWeight.semibold }}>{icons.delete}</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimelineTab;
