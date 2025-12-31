import { theme, appConfig } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = theme;
const { icons, settingsFields } = appConfig;

const SettingsTab = ({ settings, setSettings, isMobile, onSave, saving }) => {
    if (!settings) return null;

    const inputStyle = {
        width: '100%',
        padding: `${spacing.sm + 2}px ${spacing.md}px`,
        borderRadius: radius.sm,
        border: `1px solid ${colors.border}`,
        boxSizing: 'border-box',
        fontSize: '16px',
    };

    const renderPersonCard = (config) => (
        <div style={{
            padding: spacing.lg,
            background: config.bgColor,
            borderRadius: radius.xl,
            border: `2px solid ${config.borderColor}`,
        }}>
            <h3 style={{ margin: `0 0 ${spacing.md}px`, color: config.titleColor, fontSize: fontSize.xl }}>{config.title}</h3>

            {config.fields.map((field, idx) => {
                const isHalf = field.half;
                const nextField = config.fields[idx + 1];
                const isPairStart = isHalf && nextField?.half;
                const isPairEnd = isHalf && config.fields[idx - 1]?.half;

                if (isPairEnd) return null; // Skip, already rendered with pair start

                if (isPairStart) {
                    return (
                        <div key={field.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm + 2, marginBottom: spacing.sm + 2 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: fontWeight.semibold, fontSize: fontSize.base }}>{field.label}</label>
                                <input
                                    type={field.type}
                                    value={settings[field.key] || ''}
                                    onChange={(e) => setSettings({ ...settings, [field.key]: field.type === 'number' ? parseInt(e.target.value) : e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: fontWeight.semibold, fontSize: fontSize.base }}>{nextField.label}</label>
                                <input
                                    type={nextField.type}
                                    value={settings[nextField.key] || ''}
                                    onChange={(e) => setSettings({ ...settings, [nextField.key]: nextField.type === 'number' ? parseInt(e.target.value) : e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={field.key} style={{ marginBottom: spacing.sm + 2 }}>
                        <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: fontWeight.semibold, fontSize: fontSize.base }}>{field.label}</label>
                        <input
                            type={field.type}
                            value={settings[field.key] || ''}
                            onChange={(e) => setSettings({ ...settings, [field.key]: field.type === 'number' ? parseInt(e.target.value) : e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                );
            })}
        </div>
    );

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
                <h2 style={{ margin: 0, color: colors.textPrimary, fontSize: isMobile ? fontSize.xl : fontSize.xxl }}>Relationship Profile</h2>
                <button onClick={onSave} disabled={saving} style={{
                    padding: `${spacing.sm + 2}px ${spacing.xl}px`,
                    borderRadius: radius.lg,
                    border: 'none',
                    background: gradients.primary,
                    color: colors.textWhite,
                    fontWeight: fontWeight.semibold,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    fontSize: fontSize.md,
                }}>{saving ? 'Saving...' : `${icons.save} Save`}</button>
            </div>

            {/* Start Date */}
            <div style={{ marginBottom: spacing.xl, padding: spacing.lg, background: '#fef3c7', borderRadius: radius.xl }}>
                <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold, color: '#b45309', fontSize: fontSize.md }}>💕 Start Date</label>
                <input
                    type="date"
                    value={settings.relationshipDate || ''}
                    onChange={(e) => setSettings({ ...settings, relationshipDate: e.target.value })}
                    style={{
                        padding: `${spacing.sm + 2}px ${spacing.lg - 2}px`,
                        borderRadius: radius.md,
                        border: `2px solid ${colors.warning}`,
                        fontSize: '16px',
                        width: '100%',
                        maxWidth: 200,
                        boxSizing: 'border-box',
                    }}
                />
            </div>

            {/* Person Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: spacing.lg,
            }}>
                {renderPersonCard(settingsFields.person1)}
                {renderPersonCard(settingsFields.person2)}
            </div>
        </div>
    );
};

export default SettingsTab;
