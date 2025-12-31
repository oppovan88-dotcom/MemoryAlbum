import { theme, appConfig } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight } = theme;
const { timeOptions, icons } = appConfig;

const AddTimelineModal = ({ show, onClose, newTimelineItem, setNewTimelineItem, onAdd, saving, isMobile }) => {
    if (!show) return null;

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
                <h2 style={{ margin: `0 0 ${spacing.xl}px`, color: colors.accentDark, fontSize: fontSize.xxl, textAlign: 'center' }}>{icons.heart} Add New Moment</h2>

                <div style={{ marginBottom: spacing.lg }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: colors.accentDark }}>{icons.time} Time *</label>
                    <select value={newTimelineItem.time} onChange={(e) => setNewTimelineItem({ ...newTimelineItem, time: e.target.value })} style={{ ...inputStyle, background: colors.white }}>
                        <option value="">Select Time</option>
                        {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: colors.accentDark }}>{icons.activity} Activity *</label>
                    <input type="text" value={newTimelineItem.activity} onChange={(e) => setNewTimelineItem({ ...newTimelineItem, activity: e.target.value })} placeholder="e.g., Coffee Date ☕" style={inputStyle} />
                </div>

                <div style={{ marginBottom: spacing.xl }}>
                    <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: colors.accentDark }}>{icons.details} Details (Optional)</label>
                    <textarea value={newTimelineItem.details} onChange={(e) => setNewTimelineItem({ ...newTimelineItem, details: e.target.value })} placeholder="Describe this moment..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', gap: spacing.md }}>
                    <button onClick={() => { onClose(); setNewTimelineItem({ time: '', activity: '', details: '' }); }} style={{ flex: 1, padding: spacing.lg - 2, borderRadius: radius.lg, border: `2px solid ${colors.border}`, background: colors.white, fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.md }}>Cancel</button>
                    <button onClick={onAdd} disabled={saving} style={{ flex: 1, padding: spacing.lg - 2, borderRadius: radius.lg, border: 'none', background: gradients.accent, color: colors.textWhite, fontWeight: fontWeight.semibold, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: fontSize.md }}>
                        {saving ? 'Adding...' : `${icons.heart} Add`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTimelineModal;
