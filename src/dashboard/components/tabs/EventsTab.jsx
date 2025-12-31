import { useState } from 'react';
import { theme, appConfig, API_URL } from '../../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = theme;
const { icons } = appConfig;

// Event type icons
const eventIcons = {
    anniversary: '💖',
    birthday: '🎂',
    milestone: '🌟',
    holiday: '🎄',
    custom: '🎉'
};

// Priority colors
const priorityColors = {
    high: { bg: '#fef2f2', border: '#ef4444', text: '#dc2626' },
    medium: { bg: '#fffbeb', border: '#f59e0b', text: '#d97706' },
    low: { bg: '#f0fdf4', border: '#22c55e', text: '#16a34a' }
};

const EventsTab = ({ events = [], setEvents, isMobile, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showTelegramModal, setShowTelegramModal] = useState(false);
    const [telegramConfig, setTelegramConfig] = useState({
        botToken: '',
        chatId: '',
        isConnected: false
    });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, upcoming, today, completed

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: '🎉',
        eventType: 'custom',
        eventDate: '',
        isRecurring: false,
        recurringType: 'yearly',
        reminderEnabled: true,
        reminderDaysBefore: [7, 3, 1, 0],
        color: '#ec4899',
        category: 'General',
        priority: 'medium',
        associatedPerson: 'none',
        celebrationMode: {
            enabled: true,
            animation: 'confetti',
            specialMessage: ''
        }
    });

    // Filter events
    const filteredEvents = events.filter(event => {
        if (filter === 'upcoming') return event.daysUntil >= 0 && event.daysUntil <= 30;
        if (filter === 'today') return event.daysUntil === 0;
        if (filter === 'completed') return event.isCompleted;
        return true;
    });

    // Sort events by days until
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (a.daysUntil === b.daysUntil) return 0;
        if (a.daysUntil < 0) return 1;
        if (b.daysUntil < 0) return -1;
        return a.daysUntil - b.daysUntil;
    });

    const handleSubmit = async () => {
        if (!formData.title || !formData.eventDate) {
            alert('Please fill in title and date');
            return;
        }

        setLoading(true);
        try {
            const url = editingEvent
                ? `${API_URL}/events/${editingEvent._id}`
                : `${API_URL}/events`;

            const response = await fetch(url, {
                method: editingEvent ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const savedEvent = await response.json();
                if (editingEvent) {
                    setEvents(prev => prev.map(e => e._id === savedEvent._id ? savedEvent : e));
                } else {
                    setEvents(prev => [...prev, savedEvent]);
                }
                closeModal();
                onRefresh?.();
            }
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;

        try {
            await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
            setEvents(prev => prev.filter(e => e._id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleSendReminder = async (event) => {
        try {
            const response = await fetch(`${API_URL}/events/${event._id}/remind`, {
                method: 'POST'
            });
            const result = await response.json();
            if (result.success) {
                alert('✅ Reminder sent to Telegram!');
            } else {
                alert('❌ Failed: ' + result.error);
            }
        } catch (error) {
            alert('Error sending reminder');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            icon: '🎉',
            eventType: 'custom',
            eventDate: '',
            isRecurring: false,
            recurringType: 'yearly',
            reminderEnabled: true,
            reminderDaysBefore: [7, 3, 1, 0],
            color: '#ec4899',
            category: 'General',
            priority: 'medium',
            associatedPerson: 'none',
            celebrationMode: {
                enabled: true,
                animation: 'confetti',
                specialMessage: ''
            }
        });
    };

    const openEditModal = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            icon: event.icon || '🎉',
            eventType: event.eventType || 'custom',
            eventDate: event.eventDate?.split('T')[0] || '',
            isRecurring: event.isRecurring || false,
            recurringType: event.recurringType || 'yearly',
            reminderEnabled: event.reminderEnabled !== false,
            reminderDaysBefore: event.reminderDaysBefore || [7, 3, 1, 0],
            color: event.color || '#ec4899',
            category: event.category || 'General',
            priority: event.priority || 'medium',
            associatedPerson: event.associatedPerson || 'none',
            celebrationMode: event.celebrationMode || {
                enabled: true,
                animation: 'confetti',
                specialMessage: ''
            }
        });
        setShowModal(true);
    };

    // Load Telegram config
    const loadTelegramConfig = async () => {
        try {
            const response = await fetch(`${API_URL}/telegram`);
            const data = await response.json();
            setTelegramConfig({
                botToken: data.botToken || '',
                chatId: data.chatId || '',
                isConnected: data.isConnected || false,
                botUsername: data.botUsername || '',
                chatTitle: data.chatTitle || ''
            });
        } catch (error) {
            console.error('Error loading telegram config:', error);
        }
    };

    const saveTelegramConfig = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/telegram/quick-setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    botToken: telegramConfig.botToken,
                    chatId: telegramConfig.chatId
                })
            });
            const result = await response.json();
            if (result.success) {
                alert('✅ Telegram connected! Check your group for a welcome message.');
                setTelegramConfig(prev => ({ ...prev, isConnected: true }));
                setShowTelegramModal(false);
            } else {
                alert('❌ Failed: ' + result.error);
            }
        } catch (error) {
            alert('Error connecting Telegram');
        }
        setLoading(false);
    };

    const testTelegramMessage = async () => {
        try {
            const response = await fetch(`${API_URL}/telegram/test-message`, {
                method: 'POST'
            });
            const result = await response.json();
            if (result.success) {
                alert('✅ Test message sent!');
            } else {
                alert('❌ Failed: ' + result.error);
            }
        } catch (error) {
            alert('Error sending test message');
        }
    };

    // Styles
    const cardStyle = {
        background: colors.white,
        borderRadius: radius.xl,
        padding: isMobile ? spacing.md : spacing.lg,
        boxShadow: shadows.sm,
        marginBottom: spacing.md,
        border: '1px solid #f1f5f9'
    };

    const buttonStyle = (bg, hover = false) => ({
        padding: `${spacing.sm}px ${spacing.lg}px`,
        borderRadius: radius.lg,
        border: 'none',
        background: bg,
        color: colors.textWhite,
        fontWeight: fontWeight.semibold,
        cursor: 'pointer',
        fontSize: fontSize.sm,
        transition: 'all 0.2s ease'
    });

    const inputStyle = {
        width: '100%',
        padding: `${spacing.sm + 2}px ${spacing.md}px`,
        borderRadius: radius.md,
        border: `1px solid ${colors.border}`,
        fontSize: fontSize.base,
        outline: 'none',
        marginBottom: spacing.md
    };

    const labelStyle = {
        display: 'block',
        marginBottom: spacing.xs,
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium
    };

    return (
        <div>
            {/* Header */}
            <div style={{
                ...cardStyle,
                background: gradients.primary,
                color: colors.textWhite,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: spacing.md
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: isMobile ? fontSize.xl : fontSize.xxl }}>
                        🎉 Special Events & Milestones
                    </h2>
                    <p style={{ margin: `${spacing.xs}px 0 0`, opacity: 0.9 }}>
                        Manage anniversaries, birthdays & important dates with Telegram reminders
                    </p>
                </div>
                <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                    <button
                        onClick={() => { loadTelegramConfig(); setShowTelegramModal(true); }}
                        style={buttonStyle('rgba(255,255,255,0.2)')}
                    >
                        📱 Telegram
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        style={buttonStyle('#fff')}
                    >
                        <span style={{ color: colors.primary }}>➕ Add Event</span>
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: spacing.sm,
                marginBottom: spacing.lg,
                flexWrap: 'wrap'
            }}>
                {[
                    { key: 'all', label: '📋 All', count: events.length },
                    { key: 'upcoming', label: '📅 Upcoming', count: events.filter(e => e.daysUntil >= 0 && e.daysUntil <= 30).length },
                    { key: 'today', label: '🔴 Today', count: events.filter(e => e.daysUntil === 0).length },
                    { key: 'completed', label: '✅ Done', count: events.filter(e => e.isCompleted).length }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        style={{
                            padding: `${spacing.sm}px ${spacing.md}px`,
                            borderRadius: radius.round,
                            border: 'none',
                            background: filter === tab.key ? colors.primary : colors.bgSecondary,
                            color: filter === tab.key ? colors.textWhite : colors.textSecondary,
                            fontWeight: fontWeight.medium,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Events List */}
            {sortedEvents.length === 0 ? (
                <div style={{
                    ...cardStyle,
                    textAlign: 'center',
                    padding: spacing.xxl
                }}>
                    <span style={{ fontSize: 48, display: 'block', marginBottom: spacing.md }}>🎊</span>
                    <h3 style={{ color: colors.textPrimary, margin: 0 }}>No events found</h3>
                    <p style={{ color: colors.textSecondary }}>Add your first special event!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {sortedEvents.map(event => {
                        const priorityStyle = priorityColors[event.priority] || priorityColors.medium;
                        const isToday = event.daysUntil === 0;
                        const isPast = event.daysUntil < 0;

                        return (
                            <div key={event._id} style={{
                                ...cardStyle,
                                borderLeft: `4px solid ${event.color || colors.accent}`,
                                opacity: isPast && !event.isRecurring ? 0.6 : 1,
                                animation: isToday ? 'pulse 2s infinite' : 'none'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexWrap: 'wrap',
                                    gap: spacing.md
                                }}>
                                    {/* Event Info */}
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                                            <span style={{ fontSize: 28 }}>{event.icon || eventIcons[event.eventType]}</span>
                                            <div>
                                                <h3 style={{
                                                    margin: 0,
                                                    color: colors.textPrimary,
                                                    fontSize: fontSize.lg
                                                }}>
                                                    {event.title}
                                                </h3>
                                                <span style={{
                                                    fontSize: fontSize.xs,
                                                    color: colors.textMuted,
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {event.eventType} • {event.category}
                                                </span>
                                            </div>
                                        </div>

                                        {event.description && (
                                            <p style={{
                                                margin: `0 0 ${spacing.sm}px`,
                                                color: colors.textSecondary,
                                                fontSize: fontSize.sm
                                            }}>
                                                {event.description}
                                            </p>
                                        )}

                                        {/* Tags */}
                                        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                                            <span style={{
                                                ...priorityStyle,
                                                padding: `${spacing.xs - 2}px ${spacing.sm}px`,
                                                borderRadius: radius.round,
                                                fontSize: fontSize.xs,
                                                fontWeight: fontWeight.medium,
                                                background: priorityStyle.bg,
                                                color: priorityStyle.text,
                                                border: `1px solid ${priorityStyle.border}`
                                            }}>
                                                {event.priority}
                                            </span>
                                            {event.isRecurring && (
                                                <span style={{
                                                    padding: `${spacing.xs - 2}px ${spacing.sm}px`,
                                                    borderRadius: radius.round,
                                                    fontSize: fontSize.xs,
                                                    background: '#e0f2fe',
                                                    color: '#0284c7'
                                                }}>
                                                    🔄 {event.recurringType}
                                                </span>
                                            )}
                                            {event.reminderEnabled && (
                                                <span style={{
                                                    padding: `${spacing.xs - 2}px ${spacing.sm}px`,
                                                    borderRadius: radius.round,
                                                    fontSize: fontSize.xs,
                                                    background: '#f0fdf4',
                                                    color: '#16a34a'
                                                }}>
                                                    🔔 Reminders
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date & Countdown */}
                                    <div style={{
                                        textAlign: 'right',
                                        minWidth: 120
                                    }}>
                                        <div style={{
                                            background: isToday ? gradients.accent : colors.bgSecondary,
                                            color: isToday ? colors.textWhite : colors.textPrimary,
                                            padding: spacing.md,
                                            borderRadius: radius.lg,
                                            marginBottom: spacing.sm
                                        }}>
                                            <div style={{
                                                fontSize: fontSize.xxl,
                                                fontWeight: fontWeight.bold,
                                                lineHeight: 1
                                            }}>
                                                {isToday ? '🎉' : (isPast ? '✓' : event.daysUntil)}
                                            </div>
                                            <div style={{ fontSize: fontSize.xs, marginTop: spacing.xs }}>
                                                {isToday ? 'TODAY!' : (isPast ? 'Passed' : 'days left')}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: fontSize.sm,
                                            color: colors.textSecondary
                                        }}>
                                            📅 {new Date(event.eventDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: event.isRecurring ? undefined : 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: isMobile ? 'row' : 'column',
                                        gap: spacing.xs,
                                        flexWrap: 'wrap'
                                    }}>
                                        <button
                                            onClick={() => handleSendReminder(event)}
                                            style={{
                                                ...buttonStyle(colors.info),
                                                padding: `${spacing.xs}px ${spacing.sm}px`,
                                                fontSize: fontSize.xs
                                            }}
                                            title="Send Telegram Reminder"
                                        >
                                            📱
                                        </button>
                                        <button
                                            onClick={() => openEditModal(event)}
                                            style={{
                                                ...buttonStyle(colors.success),
                                                padding: `${spacing.xs}px ${spacing.sm}px`,
                                                fontSize: fontSize.xs
                                            }}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            style={{
                                                ...buttonStyle(colors.danger),
                                                padding: `${spacing.xs}px ${spacing.sm}px`,
                                                fontSize: fontSize.xs
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Event Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: spacing.md,
                    overflow: 'auto'
                }}>
                    <div style={{
                        background: colors.white,
                        borderRadius: radius.xxl,
                        padding: spacing.xl,
                        width: '100%',
                        maxWidth: 500,
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <h2 style={{ margin: `0 0 ${spacing.lg}px`, color: colors.textPrimary }}>
                            {editingEvent ? '✏️ Edit Event' : '🎉 Add New Event'}
                        </h2>

                        <label style={labelStyle}>Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            style={inputStyle}
                            placeholder="e.g. Our Anniversary"
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                            <div>
                                <label style={labelStyle}>Icon</label>
                                <select
                                    value={formData.icon}
                                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="🎉">🎉 Party</option>
                                    <option value="💖">💖 Heart</option>
                                    <option value="🎂">🎂 Birthday</option>
                                    <option value="💍">💍 Ring</option>
                                    <option value="🌟">🌟 Star</option>
                                    <option value="🎄">🎄 Holiday</option>
                                    <option value="✈️">✈️ Travel</option>
                                    <option value="🏠">🏠 Home</option>
                                    <option value="💼">💼 Work</option>
                                    <option value="🎓">🎓 Graduation</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Type</label>
                                <select
                                    value={formData.eventType}
                                    onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="anniversary">Anniversary</option>
                                    <option value="birthday">Birthday</option>
                                    <option value="milestone">Milestone</option>
                                    <option value="holiday">Holiday</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                        </div>

                        <label style={labelStyle}>Event Date *</label>
                        <input
                            type="date"
                            value={formData.eventDate}
                            onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                            placeholder="Add some notes..."
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                            <div>
                                <label style={labelStyle}>Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="high">🔴 High</option>
                                    <option value="medium">🟡 Medium</option>
                                    <option value="low">🟢 Low</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Color</label>
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                    style={{ ...inputStyle, height: 42, padding: spacing.xs }}
                                />
                            </div>
                        </div>

                        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                            <input
                                type="checkbox"
                                checked={formData.isRecurring}
                                onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })}
                            />
                            🔄 Recurring Event
                        </label>

                        {formData.isRecurring && (
                            <>
                                <label style={labelStyle}>Repeat</label>
                                <select
                                    value={formData.recurringType}
                                    onChange={e => setFormData({ ...formData, recurringType: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="yearly">Yearly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </>
                        )}

                        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                            <input
                                type="checkbox"
                                checked={formData.reminderEnabled}
                                onChange={e => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                            />
                            🔔 Enable Telegram Reminders
                        </label>

                        <label style={labelStyle}>Celebration Message</label>
                        <input
                            type="text"
                            value={formData.celebrationMode.specialMessage}
                            onChange={e => setFormData({
                                ...formData,
                                celebrationMode: { ...formData.celebrationMode, specialMessage: e.target.value }
                            })}
                            style={inputStyle}
                            placeholder="Special message for the day!"
                        />

                        <div style={{
                            display: 'flex',
                            gap: spacing.md,
                            marginTop: spacing.lg,
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    ...buttonStyle(colors.bgSecondary),
                                    color: colors.textSecondary
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                style={buttonStyle(gradients.primary)}
                            >
                                {loading ? '⏳ Saving...' : (editingEvent ? '💾 Update' : '➕ Add Event')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Telegram Config Modal */}
            {showTelegramModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: spacing.md
                }}>
                    <div style={{
                        background: colors.white,
                        borderRadius: radius.xxl,
                        padding: spacing.xl,
                        width: '100%',
                        maxWidth: 450
                    }}>
                        <h2 style={{ margin: `0 0 ${spacing.lg}px`, color: colors.textPrimary }}>
                            📱 Telegram Integration
                        </h2>

                        {telegramConfig.isConnected && (
                            <div style={{
                                background: '#f0fdf4',
                                border: '1px solid #22c55e',
                                borderRadius: radius.lg,
                                padding: spacing.md,
                                marginBottom: spacing.lg
                            }}>
                                <p style={{ margin: 0, color: '#16a34a', fontWeight: fontWeight.medium }}>
                                    ✅ Connected to: {telegramConfig.chatTitle || 'Telegram'}
                                </p>
                                <p style={{ margin: `${spacing.xs}px 0 0`, color: '#166534', fontSize: fontSize.sm }}>
                                    Bot: @{telegramConfig.botUsername}
                                </p>
                            </div>
                        )}

                        <label style={labelStyle}>Bot Token</label>
                        <input
                            type="text"
                            value={telegramConfig.botToken}
                            onChange={e => setTelegramConfig({ ...telegramConfig, botToken: e.target.value })}
                            style={inputStyle}
                            placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
                        />
                        <p style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: -spacing.sm, marginBottom: spacing.md }}>
                            Get from @BotFather on Telegram
                        </p>

                        <label style={labelStyle}>Chat/Group ID</label>
                        <input
                            type="text"
                            value={telegramConfig.chatId}
                            onChange={e => setTelegramConfig({ ...telegramConfig, chatId: e.target.value })}
                            style={inputStyle}
                            placeholder="-1001234567890"
                        />
                        <p style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: -spacing.sm, marginBottom: spacing.md }}>
                            Add bot to group, then send /start and get ID from @userinfobot
                        </p>

                        <div style={{
                            display: 'flex',
                            gap: spacing.md,
                            marginTop: spacing.lg,
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => setShowTelegramModal(false)}
                                style={{
                                    ...buttonStyle(colors.bgSecondary),
                                    color: colors.textSecondary
                                }}
                            >
                                Close
                            </button>
                            {telegramConfig.isConnected && (
                                <button
                                    onClick={testTelegramMessage}
                                    style={buttonStyle(colors.info)}
                                >
                                    🧪 Test
                                </button>
                            )}
                            <button
                                onClick={saveTelegramConfig}
                                disabled={loading || !telegramConfig.botToken || !telegramConfig.chatId}
                                style={buttonStyle(gradients.primary)}
                            >
                                {loading ? '⏳...' : '🔗 Connect'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pulse animation style */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                    50% { box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.4); }
                }
            `}</style>
        </div>
    );
};

export default EventsTab;
