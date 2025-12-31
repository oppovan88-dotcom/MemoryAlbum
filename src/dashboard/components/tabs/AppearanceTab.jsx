import { useState } from 'react';
import { theme as defaultTheme } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = defaultTheme;

// ============ Reusable Components ============

// Color picker with preview
const ColorInput = ({ label, value, onChange, isMobile }) => (
    <div style={{ marginBottom: spacing.md }}>
        <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: fontWeight.medium, fontSize: fontSize.sm }}>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} style={{ width: isMobile ? 36 : 44, height: isMobile ? 32 : 36, border: 'none', borderRadius: radius.sm, cursor: 'pointer', flexShrink: 0 }} />
            <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '12px', fontFamily: 'monospace', minWidth: 0 }} />
        </div>
    </div>
);

// Text input field
const TextInput = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <div style={{ marginBottom: spacing.md }}>
        <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: fontWeight.medium, fontSize: fontSize.sm }}>{label}</label>
        <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '14px', boxSizing: 'border-box' }} />
    </div>
);

// Number input field
const NumberInput = ({ label, value, onChange, min, max }) => (
    <div style={{ marginBottom: spacing.md }}>
        <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: fontWeight.medium, fontSize: fontSize.sm }}>{label}</label>
        <input type="number" value={value || 0} onChange={(e) => onChange(parseInt(e.target.value) || 0)} min={min} max={max} style={{ width: '100%', padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '14px', boxSizing: 'border-box' }} />
    </div>
);

// Navigation item editor
const NavItemEditor = ({ item, index, onUpdate, onDelete, onMove, totalItems, isMobile }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: spacing.sm, padding: spacing.md, background: colors.light, borderRadius: radius.lg, marginBottom: spacing.sm }}>
        <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', flex: 1, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            {!isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button onClick={() => onMove(index, 'up')} disabled={index === 0} style={{ padding: '4px 6px', border: 'none', background: index === 0 ? colors.border : colors.primaryDark, color: '#fff', borderRadius: 4, cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: '10px' }}>↑</button>
                    <button onClick={() => onMove(index, 'down')} disabled={index === totalItems - 1} style={{ padding: '4px 6px', border: 'none', background: index === totalItems - 1 ? colors.border : colors.primaryDark, color: '#fff', borderRadius: 4, cursor: index === totalItems - 1 ? 'not-allowed' : 'pointer', fontSize: '10px' }}>↓</button>
                </div>
            )}
            <input type="text" value={item.icon || ''} onChange={(e) => onUpdate(index, 'icon', e.target.value)} style={{ width: 50, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, textAlign: 'center', fontSize: '18px', flexShrink: 0 }} placeholder="📌" />
            <input type="text" value={item.id || ''} onChange={(e) => onUpdate(index, 'id', e.target.value)} style={{ width: isMobile ? 70 : 90, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '12px', flexShrink: 0 }} placeholder="tab_id" />
            <input type="text" value={item.label || ''} onChange={(e) => onUpdate(index, 'label', e.target.value)} style={{ flex: 1, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '14px', minWidth: 60 }} placeholder="Tab Label" />
            {!isMobile && <button onClick={() => onDelete(index)} style={{ padding: `${spacing.sm}px ${spacing.md}px`, border: 'none', background: colors.danger, color: '#fff', borderRadius: radius.sm, cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}>🗑️</button>}
        </div>
        {isMobile && (
            <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'flex-end' }}>
                <button onClick={() => onMove(index, 'up')} disabled={index === 0} style={{ padding: '6px 10px', border: 'none', background: index === 0 ? colors.border : colors.primaryDark, color: '#fff', borderRadius: 4, cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: '11px' }}>↑ Up</button>
                <button onClick={() => onMove(index, 'down')} disabled={index === totalItems - 1} style={{ padding: '6px 10px', border: 'none', background: index === totalItems - 1 ? colors.border : colors.primaryDark, color: '#fff', borderRadius: 4, cursor: index === totalItems - 1 ? 'not-allowed' : 'pointer', fontSize: '11px' }}>↓ Down</button>
                <button onClick={() => onDelete(index)} style={{ padding: '6px 10px', border: 'none', background: colors.danger, color: '#fff', borderRadius: radius.sm, cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
            </div>
        )}
    </div>
);

// Stats card editor
const StatsCardEditor = ({ card, index, onUpdate, onDelete, isMobile }) => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: spacing.sm, padding: spacing.md, background: colors.light, borderRadius: radius.lg, marginBottom: spacing.sm }}>
        <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
            <input type="text" value={card.icon || ''} onChange={(e) => onUpdate(index, 'icon', e.target.value)} style={{ width: 50, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, textAlign: 'center', fontSize: '18px' }} placeholder="📊" />
            <input type="text" value={card.key || ''} onChange={(e) => onUpdate(index, 'key', e.target.value)} style={{ width: isMobile ? 100 : 120, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '12px' }} placeholder="key" />
            <input type="text" value={card.label || ''} onChange={(e) => onUpdate(index, 'label', e.target.value)} style={{ flex: 1, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '14px', minWidth: 60 }} placeholder="Label" />
            <input type="color" value={card.color || '#6366f1'} onChange={(e) => onUpdate(index, 'color', e.target.value)} style={{ width: 40, height: 32, border: 'none', borderRadius: radius.sm, cursor: 'pointer' }} />
            <button onClick={() => onDelete(index)} style={{ padding: `${spacing.sm}px`, border: 'none', background: colors.danger, color: '#fff', borderRadius: radius.sm, cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
        </div>
    </div>
);

// ============ Main Component ============

const AppearanceTab = ({ appearance, setAppearance, isMobile, onSave, saving }) => {
    const [activeSection, setActiveSection] = useState('branding');

    if (!appearance) return <div style={{ padding: 48, textAlign: 'center', color: colors.textSecondary }}>Loading appearance settings...</div>;

    // Helper functions
    const updateField = (key, value) => setAppearance({ ...appearance, [key]: value });

    const updateNavItem = (index, field, value) => {
        const newItems = [...(appearance.navItems || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        setAppearance({ ...appearance, navItems: newItems });
    };

    const deleteNavItem = (index) => {
        if (!confirm('Delete this navigation item?')) return;
        const newItems = (appearance.navItems || []).filter((_, i) => i !== index);
        setAppearance({ ...appearance, navItems: newItems });
    };

    const addNavItem = () => {
        const newItems = [...(appearance.navItems || []), { id: `tab_${Date.now()}`, icon: '📌', label: 'New Tab' }];
        setAppearance({ ...appearance, navItems: newItems });
    };

    const moveNavItem = (index, direction) => {
        const newItems = [...(appearance.navItems || [])];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        setAppearance({ ...appearance, navItems: newItems });
    };

    const updateStatsCard = (index, field, value) => {
        const newCards = [...(appearance.statsCards || [])];
        newCards[index] = { ...newCards[index], [field]: value };
        setAppearance({ ...appearance, statsCards: newCards });
    };

    const deleteStatsCard = (index) => {
        if (!confirm('Delete this stats card?')) return;
        const newCards = (appearance.statsCards || []).filter((_, i) => i !== index);
        setAppearance({ ...appearance, statsCards: newCards });
    };

    const addStatsCard = () => {
        const newCards = [...(appearance.statsCards || []), { key: `stat_${Date.now()}`, icon: '📊', label: 'New Stat', color: '#6366f1' }];
        setAppearance({ ...appearance, statsCards: newCards });
    };

    const updateIcon = (key, value) => {
        setAppearance({ ...appearance, icons: { ...(appearance.icons || {}), [key]: value } });
    };

    const updateMessage = (key, value) => {
        setAppearance({ ...appearance, messages: { ...(appearance.messages || {}), [key]: value } });
    };

    const sections = [
        { id: 'branding', label: '🏷️ Branding' },
        { id: 'colors', label: '🎨 Colors' },
        { id: 'navigation', label: '📍 Navigation' },
        { id: 'stats', label: '📊 Stats Cards' },
    ];

    return (
        <div style={{ background: colors.white, borderRadius: radius.xxl, boxShadow: shadows.sm, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: isMobile ? spacing.lg : `${spacing.xl}px ${spacing.xxl}px`, borderBottom: `1px solid ${colors.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md }}>
                <h2 style={{ margin: 0, fontSize: isMobile ? fontSize.xl : fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textPrimary }}>🎨 Appearance</h2>
                <button onClick={onSave} disabled={saving} style={{ padding: `${spacing.sm}px ${spacing.lg}px`, borderRadius: radius.lg, border: 'none', background: gradients.primary, color: colors.textWhite, fontWeight: fontWeight.semibold, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontSize: fontSize.md }}>{saving ? 'Saving...' : '💾 Save'}</button>
            </div>

            {/* Section Tabs */}
            <div style={{ display: 'flex', gap: spacing.xs, padding: isMobile ? `${spacing.sm}px ${spacing.md}px` : `${spacing.md}px ${spacing.xxl}px`, borderBottom: `1px solid ${colors.borderLight}`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {sections.map(section => (
                    <button key={section.id} onClick={() => setActiveSection(section.id)} style={{
                        padding: `${spacing.xs}px ${isMobile ? spacing.sm : spacing.md}px`,
                        borderRadius: radius.md,
                        border: 'none',
                        background: activeSection === section.id ? gradients.primary : colors.light,
                        color: activeSection === section.id ? colors.textWhite : colors.textSecondary,
                        fontWeight: fontWeight.semibold,
                        cursor: 'pointer',
                        fontSize: isMobile ? fontSize.xs : fontSize.sm,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}>{section.label}</button>
                ))}
            </div>

            <div style={{ padding: isMobile ? spacing.lg : spacing.xxl, maxHeight: '60vh', overflowY: 'auto' }}>

                {/* Branding Section */}
                {activeSection === 'branding' && (
                    <div>
                        <h3 style={{ margin: `0 0 ${spacing.lg}px`, color: colors.textPrimary, fontSize: fontSize.lg }}>App Branding</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: spacing.md }}>
                            <TextInput label="App Name" value={appearance.appName} onChange={(v) => updateField('appName', v)} placeholder="Memory Album" />
                            <TextInput label="Short Name (Logo)" value={appearance.appShortName} onChange={(v) => updateField('appShortName', v)} placeholder="M" />
                            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                                <TextInput label="Description" value={appearance.appDescription} onChange={(v) => updateField('appDescription', v)} placeholder="Admin Dashboard" />
                            </div>
                            <TextInput label="Logo URL (optional)" value={appearance.appLogoUrl} onChange={(v) => updateField('appLogoUrl', v)} placeholder="https://..." />
                            <TextInput label="Favicon URL (optional)" value={appearance.appFaviconUrl} onChange={(v) => updateField('appFaviconUrl', v)} placeholder="https://..." />
                        </div>

                        {/* Preview */}
                        <div style={{ marginTop: spacing.xl, padding: spacing.lg, background: appearance.colorDark || colors.dark, borderRadius: radius.lg }}>
                            <p style={{ color: colors.textLight, marginBottom: spacing.sm, fontSize: fontSize.xs }}>Preview:</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                                <div style={{ width: 40, height: 40, borderRadius: radius.lg, background: `linear-gradient(135deg, ${appearance.colorPrimary || colors.primary}, ${appearance.colorPrimaryDark || colors.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{appearance.appShortName || 'M'}</div>
                                <div>
                                    <p style={{ margin: 0, color: '#fff', fontSize: fontSize.xl, fontWeight: fontWeight.bold }}>{appearance.appName || 'Memory Album'}</p>
                                    <p style={{ margin: 0, color: colors.textLight, fontSize: fontSize.sm }}>{appearance.appDescription || 'Admin Dashboard'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Colors Section */}
                {activeSection === 'colors' && (
                    <div>
                        <h3 style={{ margin: `0 0 ${spacing.lg}px`, color: colors.textPrimary, fontSize: fontSize.lg }}>Theme Colors</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: spacing.md }}>
                            <div>
                                <h4 style={{ margin: `0 0 ${spacing.md}px`, color: colors.textSecondary, fontSize: fontSize.sm }}>Brand</h4>
                                <ColorInput label="Primary" value={appearance.colorPrimary} onChange={(v) => updateField('colorPrimary', v)} isMobile={isMobile} />
                                <ColorInput label="Primary Dark" value={appearance.colorPrimaryDark} onChange={(v) => updateField('colorPrimaryDark', v)} isMobile={isMobile} />
                                <ColorInput label="Secondary" value={appearance.colorSecondary} onChange={(v) => updateField('colorSecondary', v)} isMobile={isMobile} />
                                <ColorInput label="Accent" value={appearance.colorAccent} onChange={(v) => updateField('colorAccent', v)} isMobile={isMobile} />
                            </div>
                            <div>
                                <h4 style={{ margin: `0 0 ${spacing.md}px`, color: colors.textSecondary, fontSize: fontSize.sm }}>Status</h4>
                                <ColorInput label="Success" value={appearance.colorSuccess} onChange={(v) => updateField('colorSuccess', v)} isMobile={isMobile} />
                                <ColorInput label="Warning" value={appearance.colorWarning} onChange={(v) => updateField('colorWarning', v)} isMobile={isMobile} />
                                <ColorInput label="Danger" value={appearance.colorDanger} onChange={(v) => updateField('colorDanger', v)} isMobile={isMobile} />
                            </div>
                            <div>
                                <h4 style={{ margin: `0 0 ${spacing.md}px`, color: colors.textSecondary, fontSize: fontSize.sm }}>Background</h4>
                                <ColorInput label="Dark" value={appearance.colorDark} onChange={(v) => updateField('colorDark', v)} isMobile={isMobile} />
                                <ColorInput label="Darker" value={appearance.colorDarker} onChange={(v) => updateField('colorDarker', v)} isMobile={isMobile} />
                                <ColorInput label="Light" value={appearance.colorLight} onChange={(v) => updateField('colorLight', v)} isMobile={isMobile} />
                                <ColorInput label="White" value={appearance.colorWhite} onChange={(v) => updateField('colorWhite', v)} isMobile={isMobile} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Section */}
                {activeSection === 'navigation' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
                            <h3 style={{ margin: 0, color: colors.textPrimary, fontSize: fontSize.lg }}>Navigation Items</h3>
                            <button onClick={addNavItem} style={{ padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.md, border: 'none', background: gradients.secondary, color: '#fff', fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.sm }}>➕ Add</button>
                        </div>
                        <p style={{ marginBottom: spacing.md, color: colors.textSecondary, fontSize: fontSize.sm }}>Edit navigation tabs. Only built-in tabs (dashboard, memories, timeline, messages, settings, appearance) will work.</p>
                        {(appearance.navItems || []).map((item, index) => (
                            <NavItemEditor key={item.id || index} item={item} index={index} onUpdate={updateNavItem} onDelete={deleteNavItem} onMove={moveNavItem} totalItems={(appearance.navItems || []).length} isMobile={isMobile} />
                        ))}
                    </div>
                )}

                {/* Stats Cards Section */}
                {activeSection === 'stats' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
                            <h3 style={{ margin: 0, color: colors.textPrimary, fontSize: fontSize.lg }}>Dashboard Stats Cards</h3>
                            <button onClick={addStatsCard} style={{ padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.md, border: 'none', background: gradients.secondary, color: '#fff', fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.sm }}>➕ Add</button>
                        </div>
                        <p style={{ marginBottom: spacing.md, color: colors.textSecondary, fontSize: fontSize.sm }}>Configure dashboard statistics cards. Key must match a stats field from the API.</p>
                        {(appearance.statsCards || []).map((card, index) => (
                            <StatsCardEditor key={card.key || index} card={card} index={index} onUpdate={updateStatsCard} onDelete={deleteStatsCard} isMobile={isMobile} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppearanceTab;
