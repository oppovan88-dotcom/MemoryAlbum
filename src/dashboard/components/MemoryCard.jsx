import { theme, appConfig } from '../config';

const { colors, radius, spacing, fontSize, fontWeight } = theme;
const { icons } = appConfig;

const MemoryCard = ({ memory, index, onEdit, onDelete, onDragStart, onDragOver, onDrop, isDragging, dragOverIndex, totalItems, onMove }) => {
    const btnStyle = (disabled, bg) => ({
        padding: `${spacing.sm - 2}px ${spacing.sm}px`,
        borderRadius: radius.sm,
        border: 'none',
        background: disabled ? colors.border : bg,
        color: colors.textWhite,
        fontSize: fontSize.xs,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: fontWeight.bold,
    });

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={(e) => e.currentTarget.style.opacity = '1'}
            style={{
                background: colors.white,
                borderRadius: radius.xl,
                overflow: 'hidden',
                border: dragOverIndex === index ? `2px dashed ${colors.primary}` : `1px solid ${colors.border}`,
                marginBottom: spacing.md,
                opacity: isDragging === index ? 0.5 : 1,
                cursor: 'grab',
                transition: `all ${theme.transitions.normal}`,
                transform: dragOverIndex === index ? 'scale(1.02)' : 'scale(1)',
            }}
        >
            <div style={{ display: 'flex', gap: spacing.md, padding: spacing.md, alignItems: 'center' }}>
                {/* Drag Handle & Move Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, alignItems: 'center' }}>
                    <div style={{ fontSize: fontSize.xl, color: colors.textMuted, cursor: 'grab' }}>{icons.drag}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <button onClick={(e) => { e.stopPropagation(); onMove(index, 'up'); }} disabled={index === 0} style={btnStyle(index === 0, colors.primaryDark)}>{icons.up}</button>
                        <button onClick={(e) => { e.stopPropagation(); onMove(index, 'down'); }} disabled={index === totalItems - 1} style={btnStyle(index === totalItems - 1, colors.primaryDark)}>{icons.down}</button>
                    </div>
                </div>

                {memory.imageUrl ? (
                    <img src={memory.imageUrl} alt="" style={{ width: 60, height: 60, borderRadius: radius.md, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                    <div style={{ width: 60, height: 60, borderRadius: radius.md, background: colors.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icons.memories}</div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textPrimary }}>{memory.title}</h4>
                    <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted }}>
                        {icons.date} {new Date(memory.date || memory.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0, flexDirection: 'column' }}>
                    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ padding: `${spacing.sm}px ${spacing.sm + 2}px`, borderRadius: radius.md, border: 'none', background: colors.primary, color: colors.textWhite, fontSize: fontSize.xs, fontWeight: fontWeight.semibold }}>Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ padding: `${spacing.sm}px ${spacing.sm + 2}px`, borderRadius: radius.md, border: 'none', background: colors.danger, color: colors.textWhite, fontSize: fontSize.xs, fontWeight: fontWeight.semibold }}>{icons.delete}</button>
                </div>
            </div>
        </div>
    );
};

export default MemoryCard;
