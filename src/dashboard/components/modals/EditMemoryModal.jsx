import { theme } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight } = theme;

const EditMemoryModal = ({ show, onClose, editMemory, setEditMemory, onUpdate, saving, isMobile }) => {
    if (!show || !editMemory) return null;

    const inputStyle = {
        width: '100%',
        padding: spacing.md,
        borderRadius: radius.md,
        border: `2px solid ${colors.border}`,
        boxSizing: 'border-box',
        fontSize: '16px',
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: spacing.lg }} onClick={onClose}>
            <div style={{ background: colors.white, borderRadius: radius.xxl, padding: isMobile ? spacing.xl : spacing.xxxl, width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                <h2 style={{ margin: `0 0 ${spacing.xl}px`, color: colors.textPrimary, fontSize: fontSize.xxl }}>Edit Memory</h2>

                {editMemory.imageUrl && <img src={editMemory.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 100, borderRadius: radius.md, marginBottom: spacing.lg }} />}

                <div style={{ marginBottom: spacing.lg }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md }}>Title *</label>
                    <input type="text" value={editMemory.title} onChange={(e) => setEditMemory({ ...editMemory, title: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ marginBottom: spacing.xl }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md }}>Description</label>
                    <textarea value={editMemory.description} onChange={(e) => setEditMemory({ ...editMemory, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', gap: spacing.md }}>
                    <button onClick={onClose} style={{ flex: 1, padding: spacing.lg - 2, borderRadius: radius.lg, border: `2px solid ${colors.border}`, background: colors.white, fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.md }}>Cancel</button>
                    <button onClick={onUpdate} disabled={saving} style={{ flex: 1, padding: spacing.lg - 2, borderRadius: radius.lg, border: 'none', background: gradients.primary, color: colors.textWhite, fontWeight: fontWeight.semibold, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: fontSize.md }}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditMemoryModal;
