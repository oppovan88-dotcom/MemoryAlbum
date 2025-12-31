import MemoryCard from '../MemoryCard';
import { theme, appConfig } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = theme;
const { icons, messages } = appConfig;

const MemoriesTab = ({ filteredMemories, memories, isMobile, onShowAddModal, onEdit, onDelete, onMove, onDragStart, onDragOver, onDrop, onDragEnd, dragIndex, dragOverIndex }) => {
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
        <div style={{ background: colors.white, borderRadius: radius.xxl, boxShadow: shadows.sm, overflow: 'hidden' }}>
            <div style={{ padding: isMobile ? spacing.lg : `${spacing.xl}px ${spacing.xxl}px`, borderBottom: `1px solid ${colors.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md }}>
                <h2 style={{ margin: 0, fontSize: fontSize.xl, fontWeight: fontWeight.semibold, color: colors.textPrimary }}>Memories ({filteredMemories.length})</h2>
                <button onClick={onShowAddModal} style={{ padding: `${spacing.sm + 2}px ${spacing.lg}px`, borderRadius: radius.lg, border: 'none', background: gradients.primary, color: colors.textWhite, fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.base }}>{icons.add} Add</button>
            </div>

            {filteredMemories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: colors.textSecondary }}>
                    <span style={{ fontSize: 40, display: 'block', marginBottom: spacing.md }}>{icons.memories}</span>
                    <p>{messages.noMemories}</p>
                </div>
            ) : isMobile ? (
                <div style={{ padding: spacing.lg }}>
                    <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md, textAlign: 'center' }}>{messages.dragHint}</p>
                    {filteredMemories.map((memory, index) => (
                        <MemoryCard key={memory._id} memory={memory} index={index} totalItems={filteredMemories.length} onMove={onMove} onEdit={() => onEdit(memory)} onDelete={() => onDelete(memory._id)} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} isDragging={dragIndex} dragOverIndex={dragOverIndex} />
                    ))}
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                        <thead><tr style={{ background: colors.light }}>
                            {['Image', 'Title', 'Description', 'Date', 'Actions'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: `${spacing.lg - 2}px ${h === 'Image' || h === 'Actions' ? spacing.xxl : spacing.lg}px`, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSecondary, textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {filteredMemories.map((memory, idx) => (
                                <tr key={memory._id} draggable onDragStart={(e) => onDragStart(e, idx)} onDragOver={(e) => onDragOver(e, idx)} onDrop={(e) => onDrop(e, idx)} onDragEnd={onDragEnd} style={{ borderBottom: idx < filteredMemories.length - 1 ? `1px solid ${colors.borderLight}` : 'none', background: dragOverIndex === idx ? '#f0f9ff' : 'transparent', opacity: dragIndex === idx ? 0.5 : 1, cursor: 'grab', transition: `all ${theme.transitions.fast}` }}>
                                    <td style={{ padding: `${spacing.md}px ${spacing.xxl}px` }}><div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}><span style={{ fontSize: fontSize.xxl, color: colors.textMuted, cursor: 'grab' }}>{icons.drag}</span>{memory.imageUrl ? <img src={memory.imageUrl} alt="" style={{ width: 50, height: 50, borderRadius: radius.md, objectFit: 'cover' }} /> : <span style={{ fontSize: 24 }}>{icons.memories}</span>}</div></td>
                                    <td style={{ padding: `${spacing.md}px ${spacing.lg}px`, fontWeight: fontWeight.medium, color: colors.textPrimary }}>{memory.title}</td>
                                    <td style={{ padding: `${spacing.md}px ${spacing.lg}px`, color: colors.textSecondary, fontSize: fontSize.md, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{memory.description || '-'}</td>
                                    <td style={{ padding: `${spacing.md}px ${spacing.lg}px`, color: colors.textSecondary, fontSize: fontSize.base }}>{new Date(memory.date || memory.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: `${spacing.md}px ${spacing.xxl}px` }}><div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}><div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}><button onClick={() => onMove(idx, 'up')} disabled={idx === 0} style={btnStyle(idx === 0, colors.primaryDark)}>{icons.up}</button><button onClick={() => onMove(idx, 'down')} disabled={idx === memories.length - 1} style={btnStyle(idx === memories.length - 1, colors.primaryDark)}>{icons.down}</button></div><button onClick={() => onEdit(memory)} style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.sm, border: 'none', background: colors.primary, color: colors.textWhite, fontSize: fontSize.sm, cursor: 'pointer', fontWeight: fontWeight.medium }}>Edit</button><button onClick={() => onDelete(memory._id)} style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.sm, border: 'none', background: colors.danger, color: colors.textWhite, fontSize: fontSize.sm, cursor: 'pointer', fontWeight: fontWeight.medium }}>Delete</button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MemoriesTab;
