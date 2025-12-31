import { useState } from 'react';
import { theme as defaultTheme } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = defaultTheme;

// Color picker with preview - mobile responsive
const ColorInput = ({ label, value, onChange, description, isMobile }) => (
    <div style={{ marginBottom: spacing.lg }}>
        <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: fontWeight.semibold, fontSize: isMobile ? fontSize.sm : fontSize.md }}>{label}</label>
        {description && !isMobile && <p style={{ margin: `0 0 ${spacing.sm}px`, fontSize: fontSize.sm, color: colors.textSecondary }}>{description}</p>}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: isMobile ? 40 : 50, height: isMobile ? 36 : 40, border: 'none', borderRadius: radius.md, cursor: 'pointer', flexShrink: 0 }} />
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, padding: `${spacing.sm}px`, borderRadius: radius.md, border: `1px solid ${colors.border}`, fontSize: isMobile ? '12px' : '14px', fontFamily: 'monospace', minWidth: 0 }} />
            <div style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, background: value, borderRadius: radius.md, border: `1px solid ${colors.border}`, flexShrink: 0 }} />
        </div>
    </div>
);

// Navigation item editor - mobile responsive with stacked layout
const NavItemEditor = ({ item, index, onUpdate, onDelete, onMove, totalItems, isMobile }) => (
    <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: spacing.sm,
        padding: spacing.md,
        background: colors.light,
        borderRadius: radius.lg,
        marginBottom: spacing.sm
    }}>
        {/* Top row on mobile: Icon, ID, Label */}
        <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', flex: 1, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            {!isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button onClick={() => onMove(index, 'up')} disabled={index === 0} style={{ padding: '4px 6px', border: 'none', background: index === 0 ? colors.border : colors.primaryDark, color: '#fff', borderRadius: 4, cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: '10px' }}>↑</button>
                    <button onClick={() => onMove(index, 'down')} disabled={index === totalItems - 1} style={{ padding: '4px 6px', border: 'none', background: index === totalItems - 1 ? colors.border : colors.primaryDark, color: '#fff', borderRadius: 4, cursor: index === totalItems - 1 ? 'not-allowed' : 'pointer', fontSize: '10px' }}>↓</button>
                </div>
            )}
            <input
                type="text"
                value={item.icon || ''}
                onChange={(e) => onUpdate(index, 'icon', e.target.value)}
                style={{
                    width: isMobile ? 50 : 60,
                    padding: spacing.sm,
                    borderRadius: radius.sm,
                    border: `1px solid ${colors.border}`,
                    textAlign: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                }}
                placeholder="📌"
            />
            <input type="text" value={item.id || ''} onChange={(e) => onUpdate(index, 'id', e.target.value)} style={{ width: isMobile ? 80 : 100, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '12px', flexShrink: 0 }} placeholder="tab_id" />
            <input type="text" value={item.label || ''} onChange={(e) => onUpdate(index, 'label', e.target.value)} style={{ flex: 1, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '14px', minWidth: isMobile ? 80 : 100 }} placeholder="Tab Label" />
            {!isMobile && <button onClick={() => onDelete(index)} style={{ padding: `${spacing.sm}px ${spacing.md}px`, border: 'none', background: colors.danger, color: '#fff', borderRadius: radius.sm, cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}>🗑️</button>}
        </div>

        {/* Bottom row on mobile: Move buttons & Delete */}
        {isMobile && (
            <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'flex-end' }}>
                <button onClick={() => onMove(index, 'up')} disabled={index === 0} style={{ padding: '6px 10px', border: 'none', background: index === 0 ? colors.border : colors.primaryDark, color: '#fff', borderRadius: 4, cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: '12px' }}>↑ Up</button>
                <button onClick={() => onMove(index, 'down')} disabled={index === totalItems - 1} style={{ padding: '6px 10px', border: 'none', background: index === totalItems - 1 ? colors.border : colors.primaryDark, color: '#fff', borderRadius: 4, cursor: index === totalItems - 1 ? 'not-allowed' : 'pointer', fontSize: '12px' }}>↓ Down</button>
                <button onClick={() => onDelete(index)} style={{ padding: '6px 10px', border: 'none', background: colors.danger, color: '#fff', borderRadius: radius.sm, cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
            </div>
        )}
    </div>
);

const AppearanceTab = ({ appearance, setAppearance, isMobile, onSave, saving }) => {
    const [activeSection, setActiveSection] = useState('branding');

    if (!appearance) return <div style={{ padding: 48, textAlign: 'center', color: colors.textSecondary }}>Loading appearance settings...</div>;

    const updateColor = (key, value) => setAppearance({ ...appearance, [key]: value });

    const updateNavItem = (index, field, value) => {
        const newItems = [...appearance.navItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setAppearance({ ...appearance, navItems: newItems });
    };

    const deleteNavItem = (index) => {
        if (!confirm('Delete this navigation item?')) return;
        const newItems = appearance.navItems.filter((_, i) => i !== index);
        setAppearance({ ...appearance, navItems: newItems });
    };

    const addNavItem = () => {
        const newItems = [...appearance.navItems, { id: `tab_${Date.now()}`, icon: '📌', label: 'New Tab' }];
        setAppearance({ ...appearance, navItems: newItems });
    };

    const moveNavItem = (index, direction) => {
        const newItems = [...appearance.navItems];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        setAppearance({ ...appearance, navItems: newItems });
    };

    const sections = [
        { id: 'branding', label: '🏷️ Branding' },
        { id: 'colors', label: '🎨 Colors' },
        { id: 'navigation', label: '📍 Navigation' },
        { id: 'icons', label: '😀 Icons' },
    ];

    return (
        <div style={{ background: colors.white, borderRadius: radius.xxl, boxShadow: shadows.sm, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: isMobile ? spacing.lg : `${spacing.xl}px ${spacing.xxl}px`, borderBottom: `1px solid ${colors.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md }}>
                <h2 style={{ margin: 0, fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textPrimary }}>🎨 Appearance Settings</h2>
                <button onClick={onSave} disabled={saving} style={{ padding: `${spacing.sm + 2}px ${spacing.xl}px`, borderRadius: radius.lg, border: 'none', background: gradients.primary, color: colors.textWhite, fontWeight: fontWeight.semibold, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontSize: fontSize.md }}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
            </div>

            {/* Section Tabs */}
            <div style={{
                display: 'flex',
                gap: spacing.xs,
                padding: isMobile ? `${spacing.md}px ${spacing.lg}px` : `${spacing.lg}px ${spacing.xxl}px`,
                borderBottom: `1px solid ${colors.borderLight}`,
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}>
                {sections.map(section => (
                    <button key={section.id} onClick={() => setActiveSection(section.id)} style={{
                        padding: isMobile ? `${spacing.sm}px ${spacing.md}px` : `${spacing.sm}px ${spacing.lg}px`,
                        borderRadius: radius.lg,
                        border: 'none',
                        background: activeSection === section.id ? gradients.primary : colors.light,
                        color: activeSection === section.id ? colors.textWhite : colors.textSecondary,
                        fontWeight: fontWeight.semibold,
                        cursor: 'pointer',
                        fontSize: isMobile ? fontSize.sm : fontSize.md,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}>{section.label}</button>
                ))}
            </div>

            <div style={{ padding: isMobile ? spacing.lg : spacing.xxl }}>
                {/* Branding Section */}
                {activeSection === 'branding' && (
                    <div>
                        <h3 style={{ margin: `0 0 ${spacing.xl}px`, color: colors.textPrimary, fontSize: fontSize.xl }}>App Branding</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: spacing.lg }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold }}>App Name</label>
                                <input type="text" value={appearance.appName} onChange={(e) => setAppearance({ ...appearance, appName: e.target.value })} style={{ width: '100%', padding: spacing.md, borderRadius: radius.md, border: `1px solid ${colors.border}`, fontSize: '16px', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold }}>Short Name (Logo)</label>
                                <input type="text" value={appearance.appShortName} onChange={(e) => setAppearance({ ...appearance, appShortName: e.target.value })} style={{ width: '100%', padding: spacing.md, borderRadius: radius.md, border: `1px solid ${colors.border}`, fontSize: '16px', boxSizing: 'border-box' }} maxLength={2} />
                            </div>
                            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: fontWeight.semibold }}>Description</label>
                                <input type="text" value={appearance.appDescription} onChange={(e) => setAppearance({ ...appearance, appDescription: e.target.value })} style={{ width: '100%', padding: spacing.md, borderRadius: radius.md, border: `1px solid ${colors.border}`, fontSize: '16px', boxSizing: 'border-box' }} />
                            </div>
                        </div>

                        {/* Preview */}
                        <div style={{ marginTop: spacing.xxl, padding: spacing.xl, background: colors.dark, borderRadius: radius.xl }}>
                            <p style={{ color: colors.textLight, marginBottom: spacing.md, fontSize: fontSize.sm }}>Preview:</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                                <div style={{ width: 48, height: 48, borderRadius: radius.lg, background: `linear-gradient(135deg, ${appearance.colorPrimary}, ${appearance.colorPrimaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{appearance.appShortName}</div>
                                <div>
                                    <p style={{ margin: 0, color: '#fff', fontSize: fontSize.xxxl, fontWeight: fontWeight.bold }}>{appearance.appName}</p>
                                    <p style={{ margin: 0, color: colors.textLight, fontSize: fontSize.md }}>{appearance.appDescription}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Colors Section */}
                {activeSection === 'colors' && (
                    <div>
                        <h3 style={{ margin: `0 0 ${spacing.xl}px`, color: colors.textPrimary, fontSize: fontSize.xl }}>Theme Colors</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: spacing.xl }}>
                            <div>
                                <h4 style={{ margin: `0 0 ${spacing.lg}px`, color: colors.textSecondary, fontSize: fontSize.md }}>Brand Colors</h4>
                                <ColorInput label="Primary Color" value={appearance.colorPrimary} onChange={(v) => updateColor('colorPrimary', v)} description="Main brand color for buttons and highlights" isMobile={isMobile} />
                                <ColorInput label="Primary Dark" value={appearance.colorPrimaryDark} onChange={(v) => updateColor('colorPrimaryDark', v)} description="Darker variant for gradients" isMobile={isMobile} />
                                <ColorInput label="Secondary Color" value={appearance.colorSecondary} onChange={(v) => updateColor('colorSecondary', v)} description="Secondary accent color" isMobile={isMobile} />
                                <ColorInput label="Accent Color" value={appearance.colorAccent} onChange={(v) => updateColor('colorAccent', v)} description="Special highlight color (pink)" isMobile={isMobile} />
                            </div>
                            <div>
                                <h4 style={{ margin: `0 0 ${spacing.lg}px`, color: colors.textSecondary, fontSize: fontSize.md }}>Status Colors</h4>
                                <ColorInput label="Success Color" value={appearance.colorSuccess} onChange={(v) => updateColor('colorSuccess', v)} description="Success states and confirmations" isMobile={isMobile} />
                                <ColorInput label="Warning Color" value={appearance.colorWarning} onChange={(v) => updateColor('colorWarning', v)} description="Warning states" isMobile={isMobile} />
                                <ColorInput label="Danger Color" value={appearance.colorDanger} onChange={(v) => updateColor('colorDanger', v)} description="Error and delete actions" isMobile={isMobile} />
                            </div>
                        </div>

                        <h4 style={{ margin: `${spacing.xxl}px 0 ${spacing.lg}px`, color: colors.textSecondary, fontSize: fontSize.md }}>Background Colors</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: spacing.lg }}>
                            <ColorInput label="Dark Background" value={appearance.colorDark} onChange={(v) => updateColor('colorDark', v)} isMobile={isMobile} />
                            <ColorInput label="Darker Background" value={appearance.colorDarker} onChange={(v) => updateColor('colorDarker', v)} isMobile={isMobile} />
                            <ColorInput label="Light Background" value={appearance.colorLight} onChange={(v) => updateColor('colorLight', v)} isMobile={isMobile} />
                        </div>
                    </div>
                )}

                {/* Navigation Section */}
                {activeSection === 'navigation' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
                            <h3 style={{ margin: 0, color: colors.textPrimary, fontSize: fontSize.xl }}>Navigation Items</h3>
                            <button onClick={addNavItem} style={{ padding: `${spacing.sm}px ${spacing.lg}px`, borderRadius: radius.lg, border: 'none', background: gradients.secondary, color: '#fff', fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.md }}>➕ Add Tab</button>
                        </div>
                        <p style={{ marginBottom: spacing.lg, color: colors.textSecondary, fontSize: fontSize.md }}>Drag to reorder, edit icons and labels. Note: Only existing tab components will work.</p>
                        {appearance.navItems?.map((item, index) => (
                            <NavItemEditor key={item.id} item={item} index={index} onUpdate={updateNavItem} onDelete={deleteNavItem} onMove={moveNavItem} totalItems={appearance.navItems.length} isMobile={isMobile} />
                        ))}
                    </div>
                )}

                {/* Icons Section */}
                {activeSection === 'icons' && (
                    <div>
                        <h3 style={{ margin: `0 0 ${spacing.xl}px`, color: colors.textPrimary, fontSize: fontSize.xl }}>App Icons</h3>
                        <p style={{ marginBottom: spacing.lg, color: colors.textSecondary, fontSize: fontSize.md }}>Customize the emoji icons used throughout the dashboard.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: spacing.md }}>
                            {Object.entries(appearance.icons || {}).map(([key, value]) => (
                                <div key={key} style={{ padding: spacing.md, background: colors.light, borderRadius: radius.lg }}>
                                    <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: fontWeight.semibold, fontSize: fontSize.sm, textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <input type="text" value={value} onChange={(e) => setAppearance({ ...appearance, icons: { ...appearance.icons, [key]: e.target.value } })} style={{ width: '100%', padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '20px', textAlign: 'center', boxSizing: 'border-box' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppearanceTab;
