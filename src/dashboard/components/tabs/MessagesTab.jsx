import { theme, appConfig } from '../../config';

const { colors, radius, spacing, fontSize, fontWeight, shadows } = theme;
const { icons, messages } = appConfig;

const MessagesTab = ({ messages: messageList, isMobile, onMarkAsRead, onDelete }) => (
    <div style={{
        background: colors.white,
        borderRadius: radius.xxl,
        padding: isMobile ? spacing.lg : spacing.xxl,
        boxShadow: shadows.sm,
    }}>
        <h2 style={{
            margin: `0 0 ${spacing.xl}px`,
            color: colors.textPrimary,
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
        }}>Messages ({messageList.length})</h2>

        {messageList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: colors.textSecondary }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: spacing.md }}>{icons.messages}</span>
                <p>{messages.noMessages}</p>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {messageList.map(msg => (
                    <div key={msg._id} style={{
                        padding: isMobile ? spacing.md : spacing.lg,
                        background: msg.isRead ? colors.light : '#fef3c7',
                        borderRadius: radius.xl,
                        border: `2px solid ${msg.isRead ? colors.border : '#fcd34d'}`,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: spacing.sm }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ margin: '0 0 4px', color: colors.textPrimary, fontSize: fontSize.lg }}>
                                    {!msg.isRead && `${icons.unread} `}{msg.name}
                                </h4>
                                <p style={{ margin: `0 0 ${spacing.sm}px`, fontSize: fontSize.sm, color: colors.textSecondary }}>
                                    {msg.email} • {new Date(msg.createdAt).toLocaleString()}
                                </p>
                                <p style={{ margin: 0, color: colors.textPrimary, fontSize: fontSize.md }}>{msg.message}</p>
                            </div>
                            <div style={{ display: 'flex', gap: spacing.sm }}>
                                {!msg.isRead && (
                                    <button onClick={() => onMarkAsRead(msg._id)} style={{
                                        padding: `${spacing.sm}px ${spacing.sm + 2}px`,
                                        borderRadius: radius.md,
                                        border: 'none',
                                        background: colors.success,
                                        color: colors.textWhite,
                                        fontSize: fontSize.sm,
                                        cursor: 'pointer',
                                    }}>{icons.check}</button>
                                )}
                                <button onClick={() => onDelete(msg._id)} style={{
                                    padding: `${spacing.sm}px ${spacing.sm + 2}px`,
                                    borderRadius: radius.md,
                                    border: 'none',
                                    background: colors.danger,
                                    color: colors.textWhite,
                                    fontSize: fontSize.sm,
                                    cursor: 'pointer',
                                }}>{icons.delete}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default MessagesTab;
