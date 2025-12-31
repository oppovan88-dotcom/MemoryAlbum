import { theme, appConfig } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight } = theme;
const { timeOptions, icons } = appConfig;

const EditTimelineModal = ({ show, onClose, editTimelineItem, setEditTimelineItem, onUpdate, saving, isMobile }) => {
    if (!show || !editTimelineItem) return null;

    const inputStyle = {
        width: '100%',
        padding: spacing.md,
        borderRadius: radius.md,
        border: `2px solid ${colors.accent}`,
        boxSizing: 'border-box',
        fontSize: '16px',
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: spacing.lg }} onClick={onClose}>
            <div style={{ background: colors.white, borderRadius: radius.xxl, padding: isMobile ? spacing.xl : spacing.xxxl, width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                <h2 style={{ margin: `0 0 ${spacing.xl}px`, color: colors.accentDark, fontSize: fontSize.xxl, textAlign: 'center' }}>{icons.edit} Edit Moment</h2>

                <div style={{ marginBottom: spacing.lg }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: colors.accentDark }}>{icons.time} Time *</label>
                    <select value={editTimelineItem.time} onChange={(e) => setEditTimelineItem({ ...editTimelineItem, time: e.target.value })} style={{ ...inputStyle, background: colors.white }}>
                        {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: colors.accentDark }}>{icons.activity} Activity *</label>
                    <input type="text" value={editTimelineItem.activity} onChange={(e) => setEditTimelineItem({ ...editTimelineItem, activity: e.target.value })} placeholder="e.g., Coffee Date ☕" style={inputStyle} />
                </div>

                <div style={{ marginBottom: spacing.xl }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: colors.accentDark }}>{icons.details} Details (Optional)</label>
                    <textarea value={editTimelineItem.details} onChange={(e) => setEditTimelineItem({ ...editTimelineItem, details: e.target.value })} placeholder="Describe this moment..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', gap: spacing.md }}>
                    <button onClick={() => { onClose(); setEditTimelineItem(null); }} style={{ flex: 1, padding: spacing.lg - 2, borderRadius: radius.lg, border: `2px solid ${colors.border}`, background: colors.white, fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.md }}>Cancel</button>
                    <button onClick={onUpdate} disabled={saving} style={{ flex: 1, padding: spacing.lg - 2, borderRadius: radius.lg, border: 'none', background: gradients.success, color: colors.textWhite, fontWeight: fontWeight.semibold, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: fontSize.md }}>
                        {saving ? 'Saving...' : `${icons.save} Save`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTimelineModal;
