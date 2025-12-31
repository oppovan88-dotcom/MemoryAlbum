import { theme, appConfig } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight } = theme;
const { icons } = appConfig;

const AddMemoryModal = ({ show, onClose, newMemory, setNewMemory, previewUrl, onFileSelect, onAdd, saving, uploadProgress, isMobile }) => {
    if (!show) return null;

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
                <h2 style={{ margin: `0 0 ${spacing.xl}px`, color: colors.textPrimary, fontSize: fontSize.xxl }}>Add New Memory</h2>

                <div style={{ marginBottom: spacing.lg }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md }}>Title *</label>
                    <input type="text" value={newMemory.title} onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md }}>Description</label>
                    <textarea value={newMemory.description} onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <div style={{ marginBottom: spacing.xl }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md }}>Image *</label>
                    <input type="file" accept="image/*" onChange={onFileSelect} style={{ ...inputStyle, border: `2px dashed ${colors.primary}`, background: colors.light }} />
                    {previewUrl && <img src={previewUrl} alt="Preview" style={{ marginTop: spacing.md, maxWidth: '100%', maxHeight: 150, borderRadius: radius.md }} />}
                    {saving && uploadProgress > 0 && (
                        <div style={{ marginTop: spacing.md, background: colors.border, borderRadius: radius.xs, overflow: 'hidden' }}>
                            <div style={{ width: `${uploadProgress}%`, height: 6, background: gradients.primary }} />
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: spacing.md }}>
                    <button onClick={onClose} style={{ flex: 1, padding: spacing.lg - 2, borderRadius: radius.lg, border: `2px solid ${colors.border}`, background: colors.white, fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.md }}>Cancel</button>
                    <button onClick={onAdd} disabled={saving} style={{ flex: 1, padding: spacing.lg - 2, borderRadius: radius.lg, border: 'none', background: gradients.primary, color: colors.textWhite, fontWeight: fontWeight.semibold, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: fontSize.md }}>
                        {saving ? 'Uploading...' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemoryModal;
