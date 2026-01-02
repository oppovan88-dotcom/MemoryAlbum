import { useState, useRef } from 'react';
import axios from 'axios';
import { theme, appConfig } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = theme;
const { settingsFields } = appConfig;

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'https://memoryalbum-wi0j.onrender.com/api';

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

// Calculate zodiac sign from birth date
const calculateZodiac = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const month = birth.getMonth() + 1;
    const day = birth.getDate();

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
    const [uploadingPerson1, setUploadingPerson1] = useState(false);
    const [uploadingPerson2, setUploadingPerson2] = useState(false);
    const person1FileRef = useRef(null);
    const person2FileRef = useRef(null);

    if (!settings) return null;

    const inputStyle = {
        width: '100%',
        padding: `${spacing.sm + 2}px ${spacing.md}px`,
        borderRadius: radius.sm,
        border: `1px solid ${colors.border}`,
        boxSizing: 'border-box',
        fontSize: '16px',
    };

    // Handle photo upload for Person 1
    const handlePerson1Upload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPerson1(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post(`${API_URL}/settings/upload/person1`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.imageUrl) {
                setSettings({ ...settings, person1Photo: response.data.imageUrl });
                alert('✅ Photo uploaded successfully!');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('❌ Upload failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingPerson1(false);
        }
    };

    // Handle photo upload for Person 2
    const handlePerson2Upload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPerson2(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post(`${API_URL}/settings/upload/person2`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.imageUrl) {
                setSettings({ ...settings, person2Photo: response.data.imageUrl });
                alert('✅ Photo uploaded successfully!');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('❌ Upload failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploadingPerson2(false);
        }
    };

    const person1Age = calculateAge(settings.person1BirthDate);
    const person1Zodiac = calculateZodiac(settings.person1BirthDate);
    const person2Age = calculateAge(settings.person2BirthDate);
    const person2Zodiac = calculateZodiac(settings.person2BirthDate);

    const renderPersonCard = (config, personKey, personNum) => {
        const age = personKey === 'person1' ? person1Age : person2Age;
        const zodiac = personKey === 'person1' ? person1Zodiac : person2Zodiac;
        const photoKey = `${personKey}Photo`;
        const currentPhoto = settings[photoKey];
        const isUploading = personKey === 'person1' ? uploadingPerson1 : uploadingPerson2;
        const fileRef = personKey === 'person1' ? person1FileRef : person2FileRef;
        const handleUpload = personKey === 'person1' ? handlePerson1Upload : handlePerson2Upload;

        // Filter fields to exclude photo (we'll render it separately with upload)
        const fieldsWithoutPhoto = config.fields.filter(f => !f.key.includes('Photo'));

        return (
            <div style={{
                padding: spacing.lg,
                background: config.bgColor,
                borderRadius: radius.xl,
                border: `2px solid ${config.borderColor}`,
            }}>
                <h3 style={{ margin: `0 0 ${spacing.md}px`, color: config.titleColor, fontSize: fontSize.xl }}>{config.title}</h3>

                {/* Photo Upload Section */}
                <div style={{ marginBottom: spacing.lg }}>
                    <label style={{
                        display: 'block',
                        marginBottom: spacing.sm,
                        fontWeight: fontWeight.semibold,
                        fontSize: fontSize.base,
                    }}>
                        📷 Profile Photo
                    </label>

                    {/* Current Photo Preview */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        marginBottom: spacing.sm,
                    }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: `3px solid ${config.borderColor}`,
                            background: colors.white,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {currentPhoto ? (
                                <img
                                    src={currentPhoto}
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <span style={{
                                fontSize: 32,
                                display: currentPhoto ? 'none' : 'block',
                            }}>👤</span>
                        </div>

                        {/* Upload Button */}
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileRef}
                                onChange={handleUpload}
                                style={{ display: 'none' }}
                            />
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={isUploading}
                                style={{
                                    padding: `${spacing.sm}px ${spacing.md}px`,
                                    borderRadius: radius.md,
                                    border: `2px solid ${config.borderColor}`,
                                    background: isUploading ? colors.disabled : colors.white,
                                    color: config.titleColor,
                                    fontWeight: fontWeight.semibold,
                                    cursor: isUploading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.xs,
                                    fontSize: fontSize.sm,
                                }}
                            >
                                {isUploading ? (
                                    <>
                                        <span className="spinner" style={{
                                            width: 16,
                                            height: 16,
                                            border: '2px solid transparent',
                                            borderTop: `2px solid ${config.titleColor}`,
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                        }}></span>
                                        Uploading...
                                    </>
                                ) : (
                                    <>📤 Upload Photo</>
                                )}
                            </button>
                            <p style={{
                                margin: `${spacing.xs}px 0 0`,
                                fontSize: fontSize.xs,
                                color: colors.textSecondary,
                            }}>
                                JPG, PNG up to 5MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Other Fields (Name, Birth Date) */}
                {fieldsWithoutPhoto.map((field) => (
                    <div key={field.key} style={{ marginBottom: spacing.sm + 2 }}>
                        <label style={{
                            display: 'block',
                            marginBottom: spacing.xs,
                            fontWeight: fontWeight.semibold,
                            fontSize: fontSize.base,
                        }}>{field.label}</label>
                        <input
                            type={field.type}
                            value={settings[field.key] || ''}
                            onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                ))}

                {/* Auto-calculated Age & Zodiac */}
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
            {/* Spinner Animation CSS */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

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
                }}>{saving ? 'Saving...' : '💾 Save'}</button>
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
                {renderPersonCard(settingsFields.person1, 'person1', 1)}
                {renderPersonCard(settingsFields.person2, 'person2', 2)}
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
                    <strong>Age</strong> and <strong>Zodiac</strong> are automatically calculated based on the Date of Birth. Photos are uploaded to cloud storage.
                </p>
            </div>
        </div>
    );
};

export default SettingsTab;
