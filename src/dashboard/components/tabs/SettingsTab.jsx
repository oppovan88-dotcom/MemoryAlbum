import { theme, appConfig } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = theme;
const { icons, settingsFields } = appConfig;

// Calculate age from birth date
const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

// Calculate zodiac sign from birth date based on the zodiac chart
const calculateZodiac = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const month = birth.getMonth() + 1; // JavaScript months are 0-indexed
    const day = birth.getDate();

    // Zodiac signs based on the provided chart
    if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) return { sign: 'Aries', emoji: '♈' };
    if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return { sign: 'Taurus', emoji: '♉' };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: 'Gemini', emoji: '♊' };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: 'Cancer', emoji: '♋' };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Leo', emoji: '♌' };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Virgo', emoji: '♍' };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: 'Libra', emoji: '♎' };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 22)) return { sign: 'Scorpio', emoji: '♏' };
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return { sign: 'Sagittarius', emoji: '♐' };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: 'Capricorn', emoji: '♑' };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 19)) return { sign: 'Aquarius', emoji: '♒' };
    if ((month === 2 && day >= 20) || (month === 3 && day <= 20)) return { sign: 'Pisces', emoji: '♓' };

    return null;
};

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

    // Get calculated age and zodiac for display
    const person1Age = calculateAge(settings.person1BirthDate);
    const person1Zodiac = calculateZodiac(settings.person1BirthDate);
    const person2Age = calculateAge(settings.person2BirthDate);
    const person2Zodiac = calculateZodiac(settings.person2BirthDate);

    const renderPersonCard = (config, personKey) => {
        const age = personKey === 'person1' ? person1Age : person2Age;
        const zodiac = personKey === 'person1' ? person1Zodiac : person2Zodiac;

        return (
            <div style={{
                padding: spacing.lg,
                background: config.bgColor,
                borderRadius: radius.xl,
                border: `2px solid ${config.borderColor}`,
            }}>
                <h3 style={{ margin: `0 0 ${spacing.md}px`, color: config.titleColor, fontSize: fontSize.xl }}>{config.title}</h3>

                {config.fields.map((field) => (
                    <div key={field.key} style={{ marginBottom: spacing.sm + 2 }}>
                        <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: fontWeight.semibold, fontSize: fontSize.base }}>{field.label}</label>
                        <input
                            type={field.type}
                            value={settings[field.key] || ''}
                            onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                ))}

                {/* Auto-calculated Age & Zodiac Display */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.sm + 2,
                    marginTop: spacing.md,
                    padding: spacing.md,
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: radius.md,
                    backdropFilter: 'blur(4px)',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: fontSize.xs,
                            color: colors.textSecondary,
                            fontWeight: fontWeight.medium,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}>Age</div>
                        <div style={{
                            fontSize: fontSize.xxl,
                            fontWeight: fontWeight.bold,
                            color: config.titleColor,
                        }}>
                            {age !== null ? age : '—'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: fontSize.xs,
                            color: colors.textSecondary,
                            fontWeight: fontWeight.medium,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}>Zodiac</div>
                        <div style={{
                            fontSize: fontSize.lg,
                            fontWeight: fontWeight.bold,
                            color: config.titleColor,
                        }}>
                            {zodiac ? `${zodiac.emoji} ${zodiac.sign}` : '—'}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
                {renderPersonCard(settingsFields.person1, 'person1')}
                {renderPersonCard(settingsFields.person2, 'person2')}
            </div>

            {/* Info Note */}
            <div style={{
                marginTop: spacing.xl,
                padding: spacing.md,
                background: '#e0f2fe',
                borderRadius: radius.lg,
                border: '1px solid #7dd3fc',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
            }}>
                <span style={{ fontSize: fontSize.xl }}>ℹ️</span>
                <p style={{ margin: 0, fontSize: fontSize.sm, color: '#0369a1' }}>
                    <strong>Age</strong> and <strong>Zodiac</strong> are automatically calculated based on the Date of Birth you entered.
                </p>
            </div>
        </div>
    );
};

export default SettingsTab;
