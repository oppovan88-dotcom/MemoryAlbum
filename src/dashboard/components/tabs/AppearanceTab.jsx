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
        { id: 'homepage', label: '🏠 Homepage' },
        { id: 'social', label: '📱 Social' },
        { id: 'footer', label: '📝 Footer' },
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

                {/* Homepage Section */}
                {activeSection === 'homepage' && (
                    <div>
                        <h3 style={{ margin: `0 0 ${spacing.lg}px`, color: colors.textPrimary, fontSize: fontSize.lg }}>Homepage Content</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: spacing.md }}>
                            <TextInput label="Hero Title" value={appearance.heroTitle} onChange={(v) => updateField('heroTitle', v)} placeholder="Our Love Story" />
                            <TextInput label="Button Text" value={appearance.heroButtonText} onChange={(v) => updateField('heroButtonText', v)} placeholder="View Memories" />
                            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                                <TextInput label="Hero Subtitle" value={appearance.heroSubtitle} onChange={(v) => updateField('heroSubtitle', v)} placeholder="A journey through our memories together" />
                            </div>
                            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                                <TextInput label="Hero Background URL" value={appearance.heroBackgroundUrl} onChange={(v) => updateField('heroBackgroundUrl', v)} placeholder="https://..." />
                            </div>
                            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                                <TextInput label="Welcome Message" value={appearance.homepageWelcome} onChange={(v) => updateField('homepageWelcome', v)} placeholder="Welcome to our memory album!" />
                            </div>
                        </div>

                        <h4 style={{ margin: `${spacing.xl}px 0 ${spacing.md}px`, color: colors.textSecondary, fontSize: fontSize.md }}>About Section</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: spacing.md }}>
                            <TextInput label="About Title" value={appearance.aboutTitle} onChange={(v) => updateField('aboutTitle', v)} placeholder="About Us" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl }}>
                                <input type="checkbox" checked={appearance.showAboutSection !== false} onChange={(e) => updateField('showAboutSection', e.target.checked)} id="showAbout" />
                                <label htmlFor="showAbout" style={{ fontSize: fontSize.sm }}>Show About Section</label>
                            </div>
                            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                                <TextInput label="About Description" value={appearance.aboutDescription} onChange={(v) => updateField('aboutDescription', v)} placeholder="Two hearts, one love story." />
                            </div>
                        </div>

                        <h4 style={{ margin: `${spacing.xl}px 0 ${spacing.md}px`, color: colors.textSecondary, fontSize: fontSize.md }}>Contact Section</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: spacing.md }}>
                            <TextInput label="Contact Email" value={appearance.contactEmail} onChange={(v) => updateField('contactEmail', v)} placeholder="email@example.com" />
                            <TextInput label="Contact Phone" value={appearance.contactPhone} onChange={(v) => updateField('contactPhone', v)} placeholder="+855 ..." />
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                                <input type="checkbox" checked={appearance.showContactSection !== false} onChange={(e) => updateField('showContactSection', e.target.checked)} id="showContact" />
                                <label htmlFor="showContact" style={{ fontSize: fontSize.sm }}>Show Contact Section</label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Social Links Section */}
                {activeSection === 'social' && (
                    <div>
                        <h3 style={{ margin: `0 0 ${spacing.lg}px`, color: colors.textPrimary, fontSize: fontSize.lg }}>Social Media Links</h3>
                        <p style={{ marginBottom: spacing.md, color: colors.textSecondary, fontSize: fontSize.sm }}>Add your social media profile links.</p>
                        <div style={{ display: 'grid', gap: spacing.md }}>
                            {(appearance.socialLinks || []).map((link, index) => (
                                <div key={index} style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', padding: spacing.md, background: colors.light, borderRadius: radius.lg }}>
                                    <input type="text" value={link.icon || ''} onChange={(e) => {
                                        const newLinks = [...(appearance.socialLinks || [])];
                                        newLinks[index] = { ...newLinks[index], icon: e.target.value };
                                        setAppearance({ ...appearance, socialLinks: newLinks });
                                    }} style={{ width: 50, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, textAlign: 'center', fontSize: '18px' }} />
                                    <input type="text" value={link.name || ''} onChange={(e) => {
                                        const newLinks = [...(appearance.socialLinks || [])];
                                        newLinks[index] = { ...newLinks[index], name: e.target.value };
                                        setAppearance({ ...appearance, socialLinks: newLinks });
                                    }} style={{ width: 100, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '14px' }} placeholder="Name" />
                                    <input type="text" value={link.url || ''} onChange={(e) => {
                                        const newLinks = [...(appearance.socialLinks || [])];
                                        newLinks[index] = { ...newLinks[index], url: e.target.value };
                                        setAppearance({ ...appearance, socialLinks: newLinks });
                                    }} style={{ flex: 1, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '14px' }} placeholder="https://..." />
                                    <button onClick={() => {
                                        const newLinks = (appearance.socialLinks || []).filter((_, i) => i !== index);
                                        setAppearance({ ...appearance, socialLinks: newLinks });
                                    }} style={{ padding: spacing.sm, border: 'none', background: colors.danger, color: '#fff', borderRadius: radius.sm, cursor: 'pointer' }}>🗑️</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => {
                            const newLinks = [...(appearance.socialLinks || []), { name: 'New Link', url: '', icon: '🔗' }];
                            setAppearance({ ...appearance, socialLinks: newLinks });
                        }} style={{ marginTop: spacing.md, padding: `${spacing.sm}px ${spacing.lg}px`, borderRadius: radius.md, border: 'none', background: gradients.secondary, color: '#fff', fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.sm }}>➕ Add Social Link</button>
                    </div>
                )}

                {/* Footer Section */}
                {activeSection === 'footer' && (
                    <div>
                        <h3 style={{ margin: `0 0 ${spacing.lg}px`, color: colors.textPrimary, fontSize: fontSize.lg }}>Footer Content</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: spacing.md }}>
                            <TextInput label="Footer Text" value={appearance.footerText} onChange={(v) => updateField('footerText', v)} placeholder="Made with ❤️" />
                            <TextInput label="Copyright Year" value={appearance.footerYear} onChange={(v) => updateField('footerYear', v)} placeholder="2024" />
                        </div>

                        <h4 style={{ margin: `${spacing.xl}px 0 ${spacing.md}px`, color: colors.textSecondary, fontSize: fontSize.md }}>Footer Links</h4>
                        <div style={{ display: 'grid', gap: spacing.sm }}>
                            {(appearance.footerLinks || []).map((link, index) => (
                                <div key={index} style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', padding: spacing.sm, background: colors.light, borderRadius: radius.md }}>
                                    <input type="text" value={link.label || ''} onChange={(e) => {
                                        const newLinks = [...(appearance.footerLinks || [])];
                                        newLinks[index] = { ...newLinks[index], label: e.target.value };
                                        setAppearance({ ...appearance, footerLinks: newLinks });
                                    }} style={{ width: 100, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '14px' }} placeholder="Label" />
                                    <input type="text" value={link.url || ''} onChange={(e) => {
                                        const newLinks = [...(appearance.footerLinks || [])];
                                        newLinks[index] = { ...newLinks[index], url: e.target.value };
                                        setAppearance({ ...appearance, footerLinks: newLinks });
                                    }} style={{ flex: 1, padding: spacing.sm, borderRadius: radius.sm, border: `1px solid ${colors.border}`, fontSize: '14px' }} placeholder="/page or https://..." />
                                    <button onClick={() => {
                                        const newLinks = (appearance.footerLinks || []).filter((_, i) => i !== index);
                                        setAppearance({ ...appearance, footerLinks: newLinks });
                                    }} style={{ padding: spacing.sm, border: 'none', background: colors.danger, color: '#fff', borderRadius: radius.sm, cursor: 'pointer' }}>🗑️</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => {
                            const newLinks = [...(appearance.footerLinks || []), { label: 'New Link', url: '/' }];
                            setAppearance({ ...appearance, footerLinks: newLinks });
                        }} style={{ marginTop: spacing.md, padding: `${spacing.sm}px ${spacing.lg}px`, borderRadius: radius.md, border: 'none', background: gradients.secondary, color: '#fff', fontWeight: fontWeight.semibold, cursor: 'pointer', fontSize: fontSize.sm }}>➕ Add Footer Link</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppearanceTab;
