import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============== NAVIGATION ITEMS ==============
const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'memories', icon: '📷', label: 'Memories' },
    { id: 'timeline', icon: '💖', label: 'Timeline' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
];

// ============== RESPONSIVE HOOK ==============
const useResponsive = () => {
    const [screen, setScreen] = useState({
        isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
        isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
        isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreen({
                isMobile: window.innerWidth < 768,
                isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
                isDesktop: window.innerWidth >= 1024,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screen;
};

// ============== LOGIN COMPONENT ==============
const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('adminData', JSON.stringify(res.data.admin));
            onLogin(res.data.admin);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: 20,
        }}>
            <div style={{
                background: '#fff',
                borderRadius: 20,
                padding: '32px 24px',
                width: '100%',
                maxWidth: 400,
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: 16,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, color: '#fff', fontWeight: 700, marginBottom: 16,
                    }}>M</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: '0 0 4px' }}>
                        Memory Album
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Admin Dashboard</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2', color: '#dc2626', padding: 12,
                        borderRadius: 10, marginBottom: 20, fontSize: '0.9rem',
                    }}>❌ {error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                            Email
                        </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@memoryalbum.com" required
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: 10,
                                border: '2px solid #e5e7eb', fontSize: '16px', outline: 'none',
                                boxSizing: 'border-box', transition: 'border-color 0.2s',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                            Password
                        </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" required
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: 10,
                                border: '2px solid #e5e7eb', fontSize: '16px', outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: 16, borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                        fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                    }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ============== MOBILE BOTTOM NAV ==============
const MobileBottomNav = ({ activeTab, setActiveTab }) => (
    <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#1e293b',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0 12px',
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
    }}>
        {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 16px', border: 'none', background: 'transparent',
                color: activeTab === item.id ? '#8b5cf6' : 'rgba(255,255,255,0.5)',
                fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
            }}>
                <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                {item.label}
            </button>
        ))}
    </nav>
);

// ============== SIDEBAR COMPONENT ==============
const Sidebar = ({ activeTab, setActiveTab, admin, onLogout, isOpen, setIsOpen, isMobile }) => {
    if (isMobile) return null;

    return (
        <aside style={{
            width: 260, minHeight: '100vh',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            display: 'flex', flexDirection: 'column', position: 'fixed',
            left: 0, top: 0, bottom: 0, zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', fontWeight: 700, color: '#fff',
                    }}>M</div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Memory Album</span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '20px 12px' }}>
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px', marginBottom: 6, borderRadius: 10, border: 'none',
                        background: activeTab === item.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                        color: activeTab === item.id ? '#fff' : 'rgba(255,255,255,0.6)',
                        fontSize: '0.95rem', fontWeight: activeTab === item.id ? 600 : 500,
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    }}>
                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', color: '#fff', fontWeight: 600,
                    }}>AD</div>
                    <div>
                        <p style={{ margin: 0, color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
                            {admin?.name || 'Admin User'}
                        </p>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                            Administrator
                        </p>
                    </div>
                </div>
                <button onClick={onLogout} style={{
                    width: '100%', padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                }}>🚪 Logout</button>
            </div>
        </aside>
    );
};

// ============== HEADER COMPONENT ==============
const Header = ({ searchQuery, setSearchQuery, title, isMobile, onLogout }) => (
    <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '12px 16px' : '16px 32px',
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        gap: 12, flexWrap: 'wrap',
    }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '1.5rem', fontWeight: 700, color: '#1e293b' }}>{title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: isMobile ? '1 1 100%' : 'none', order: isMobile ? 1 : 0 }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                background: '#f8fafc', borderRadius: 10, border: '1px solid #e5e7eb',
                flex: 1, maxWidth: isMobile ? '100%' : 280,
            }}>
                <span style={{ color: '#9ca3af' }}>🔍</span>
                <input type="text" placeholder="Search..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '16px', outline: 'none', minWidth: 0 }}
                />
            </div>
            {isMobile && (
                <button onClick={onLogout} style={{
                    padding: '10px 14px', borderRadius: 10, border: 'none',
                    background: '#ef4444', color: '#fff', fontSize: '0.85rem', cursor: 'pointer',
                }}>�</button>
            )}
        </div>
    </header>
);

// ============== STAT CARD ==============
const StatCard = ({ icon, label, value, color, subValue, isMobile }) => (
    <div style={{
        background: '#fff', borderRadius: 16, padding: isMobile ? 16 : 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ minWidth: 0 }}>
                <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
                <p style={{ margin: 0, fontSize: isMobile ? '1.4rem' : '1.75rem', fontWeight: 700, color: '#1e293b' }}>{value}</p>
                {subValue && <span style={{ fontSize: '0.75rem', color: '#10b981' }}>{subValue}</span>}
            </div>
            <div style={{
                width: isMobile ? 44 : 52, height: isMobile ? 44 : 52, borderRadius: 12, background: `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '1.2rem' : '1.5rem', flexShrink: 0,
            }}>{icon}</div>
        </div>
    </div>
);

// ============== DRAGGABLE MEMORY CARD (Mobile) ==============
const MemoryCard = ({ memory, index, onEdit, onDelete, onDragStart, onDragOver, onDrop, isDragging, dragOverIndex }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={(e) => onDrop(e, index)}
        onDragEnd={(e) => e.currentTarget.style.opacity = '1'}
        style={{
            background: '#fff', borderRadius: 12, overflow: 'hidden',
            border: dragOverIndex === index ? '2px dashed #6366f1' : '1px solid #e5e7eb',
            marginBottom: 12,
            opacity: isDragging === index ? 0.5 : 1,
            cursor: 'grab',
            transition: 'all 0.2s',
            transform: dragOverIndex === index ? 'scale(1.02)' : 'scale(1)',
        }}
    >
        <div style={{ display: 'flex', gap: 12, padding: 12, alignItems: 'center' }}>
            {/* Drag Handle */}
            <div style={{ fontSize: '1.2rem', color: '#9ca3af', cursor: 'grab', padding: '0 4px' }}>⋮⋮</div>
            {memory.imageUrl ? (
                <img src={memory.imageUrl} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            ) : <div style={{ width: 60, height: 60, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🖼️</div>}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{memory.title}</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>
                    📅 {new Date(memory.date || memory.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#6366f1', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>🗑️</button>
            </div>
        </div>
    </div>
);

// ============== MAIN DASHBOARD COMPONENT ==============
const Dashboard = ({ admin, onLogout }) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [memories, setMemories] = useState([]);
    const [messages, setMessages] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Drag and drop states
    const [dragIndex, setDragIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMemory, setNewMemory] = useState({ title: '', description: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMemory, setEditMemory] = useState(null);

    const token = localStorage.getItem('adminToken') || 'no-auth-required';
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [statsRes, memoriesRes, messagesRes, settingsRes] = await Promise.all([
                axios.get(`${API_URL}/dashboard/stats`, authHeader),
                axios.get(`${API_URL}/memories`),
                axios.get(`${API_URL}/messages`, authHeader),
                axios.get(`${API_URL}/settings`),
            ]);
            setStats(statsRes.data);
            setMemories(memoriesRes.data);
            setMessages(messagesRes.data);
            setSettings(settingsRes.data);
        } catch (err) { console.error('Error fetching data:', err); }
        finally { setLoading(false); }
    };

    const uploadToCloudinary = async (file) => {
        const cloudName = 'dbkdd1wrl';
        const uploadPreset = 'memoryalbum_unsigned';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'memoryalbum');
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
            onUploadProgress: (progressEvent) => {
                setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            },
        });
        return response.data.secure_url;
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const addMemory = async () => {
        if (!newMemory.title || !selectedFile) { alert('Please fill title and select image'); return; }
        setSaving(true); setUploadProgress(0);
        try {
            const imageUrl = await uploadToCloudinary(selectedFile);
            await axios.post(`${API_URL}/memories`, { ...newMemory, imageUrl }, authHeader);
            setShowAddModal(false); setNewMemory({ title: '', description: '' });
            setSelectedFile(null); setPreviewUrl(''); fetchData();
        } catch (err) { alert('Failed to add memory'); }
        finally { setSaving(false); }
    };

    const deleteMemory = async (id) => {
        if (!confirm('Delete this memory?')) return;
        try { await axios.delete(`${API_URL}/memories/${id}`, authHeader); fetchData(); }
        catch (err) { console.error(err); }
    };

    const updateMemory = async () => {
        if (!editMemory?.title) { alert('Please enter title'); return; }
        setSaving(true);
        try {
            await axios.put(`${API_URL}/memories/${editMemory._id}`, editMemory, authHeader);
            setShowEditModal(false); setEditMemory(null); fetchData();
        } catch (err) { alert('Failed to update'); }
        finally { setSaving(false); }
    };

    // Drag and drop handlers
    const handleDragStart = (e, index) => {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault();
        setDragOverIndex(null);

        if (dragIndex === null || dragIndex === dropIndex) {
            setDragIndex(null);
            return;
        }

        const draggedMemory = filteredMemories[dragIndex];
        const targetMemory = filteredMemories[dropIndex];

        if (!draggedMemory || !targetMemory) {
            setDragIndex(null);
            return;
        }

        // Create new array with proper reordering
        const newFilteredMemories = [...filteredMemories];
        const [movedItem] = newFilteredMemories.splice(dragIndex, 1);
        newFilteredMemories.splice(dropIndex, 0, movedItem);

        // Update order values for all memories based on new positions
        const updatedMemories = newFilteredMemories.map((m, index) => ({
            ...m,
            order: index
        }));

        // Immediately update UI with new order
        setMemories(updatedMemories);

        // Save to backend - send all the new order values
        try {
            await axios.put(`${API_URL}/memories/reorder-all`, {
                orders: updatedMemories.map(m => ({ id: m._id, order: m.order }))
            }, authHeader);
        } catch (err) {
            console.error('Reorder failed:', err);
            // Refresh on error to get correct state from server
            fetchData();
        }

        setDragIndex(null);
    };

    const handleDragEnd = () => {
        setDragIndex(null);
        setDragOverIndex(null);
    };

    const markAsRead = async (id) => { try { await axios.put(`${API_URL}/messages/${id}/read`, {}, authHeader); fetchData(); } catch (err) { console.error(err); } };
    const deleteMessage = async (id) => { if (!confirm('Delete?')) return; try { await axios.delete(`${API_URL}/messages/${id}`, authHeader); fetchData(); } catch (err) { console.error(err); } };

    const saveSettings = async () => {
        setSettingsSaving(true);
        try { await axios.put(`${API_URL}/settings`, settings, authHeader); alert('Settings saved!'); }
        catch (err) { alert('Failed to save'); }
        finally { setSettingsSaving(false); }
    };

    // Timeline functions
    const addTimelineItem = async () => {
        if (!newTimelineItem.time || !newTimelineItem.activity) { alert('Please fill time and activity'); return; }
        setSaving(true);
        try {
            await axios.post(`${API_URL}/timeline`, newTimelineItem, authHeader);
            setShowAddTimelineModal(false);
            setNewTimelineItem({ time: '', activity: '', details: '' });
            fetchData();
        } catch (err) { alert('Failed to add timeline item'); }
        finally { setSaving(false); }
    };

    const deleteTimelineItem = async (id) => {
        if (!confirm('Delete this timeline item?')) return;
        try { await axios.delete(`${API_URL}/timeline/${id}`, authHeader); fetchData(); }
        catch (err) { console.error(err); }
    };

    const updateTimelineItem = async () => {
        if (!editTimelineItem?.time || !editTimelineItem?.activity) { alert('Please fill time and activity'); return; }
        setSaving(true);
        try {
            await axios.put(`${API_URL}/timeline/${editTimelineItem._id}`, editTimelineItem, authHeader);
            setShowEditTimelineModal(false);
            setEditTimelineItem(null);
            fetchData();
        } catch (err) { alert('Failed to update timeline item'); }
        finally { setSaving(false); }
    };

    const filteredMemories = memories.filter(m =>
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📷</span>
                    <p style={{ color: '#64748b' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Dashboard';
            case 'memories': return 'Memories';
            case 'messages': return 'Messages';
            case 'settings': return 'Settings';
            default: return 'Dashboard';
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} admin={admin} onLogout={onLogout} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />

            <div style={{ flex: 1, marginLeft: isMobile ? 0 : 260, display: 'flex', flexDirection: 'column', paddingBottom: isMobile ? 80 : 0 }}>
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} title={getTitle()} isMobile={isMobile} onLogout={onLogout} />

                <main style={{ padding: isMobile ? '16px' : '28px 32px', flex: 1 }}>
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && stats && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: isMobile ? 12 : 20, marginBottom: isMobile ? 16 : 28 }}>
                                <StatCard icon="📷" label="Memories" value={stats.totalMemories} color="#6366f1" isMobile={isMobile} />
                                <StatCard icon="👥" label="Visitors" value={stats.totalVisitors} color="#10b981" subValue={`${stats.todayVisitors} today`} isMobile={isMobile} />
                                <StatCard icon="💬" label="Messages" value={stats.totalMessages} color="#f59e0b" subValue={`${stats.unreadMessages} unread`} isMobile={isMobile} />
                                <StatCard icon="📈" label="Today" value={stats.todayVisitors} color="#ec4899" isMobile={isMobile} />
                            </div>

                            <div style={{ background: '#fff', borderRadius: 16, padding: isMobile ? 16 : 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: isMobile ? '1rem' : '1.1rem' }}>💬 Recent Messages</h3>
                                {stats.recentMessages?.length === 0 ? (
                                    <p style={{ color: '#64748b', textAlign: 'center', padding: 24 }}>No messages yet</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {stats.recentMessages?.slice(0, 4).map((msg, i) => (
                                            <div key={i} style={{ padding: 12, background: msg.isRead ? '#f8fafc' : '#fef3c7', borderRadius: 10, borderLeft: `4px solid ${msg.isRead ? '#e5e7eb' : '#f59e0b'}` }}>
                                                <p style={{ fontWeight: 600, color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>{msg.name}</p>
                                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0' }}>{msg.message?.substring(0, 50)}...</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Memories Tab */}
                    {activeTab === 'memories' && (
                        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <div style={{ padding: isMobile ? '16px' : '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Memories ({filteredMemories.length})</h2>
                                <button onClick={() => setShowAddModal(true)} style={{
                                    padding: '10px 16px', borderRadius: 10, border: 'none',
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                                    fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                                }}>➕ Add</button>
                            </div>

                            {filteredMemories.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
                                    <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>📷</span>
                                    <p>No memories found</p>
                                </div>
                            ) : isMobile ? (
                                <div style={{ padding: 16 }}>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 12, textAlign: 'center' }}>✋ Drag cards to reorder</p>
                                    {filteredMemories.map((memory, index) => (
                                        <MemoryCard
                                            key={memory._id}
                                            memory={memory}
                                            index={index}
                                            onEdit={() => { setEditMemory({ ...memory }); setShowEditModal(true); }}
                                            onDelete={() => deleteMemory(memory._id)}
                                            onDragStart={handleDragStart}
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            isDragging={dragIndex}
                                            dragOverIndex={dragOverIndex}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                                        <thead>
                                            <tr style={{ background: '#fafafa' }}>
                                                <th style={{ textAlign: 'left', padding: '14px 24px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Image</th>
                                                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Title</th>
                                                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Description</th>
                                                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                                                <th style={{ textAlign: 'left', padding: '14px 24px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMemories.map((memory, idx) => (
                                                <tr
                                                    key={memory._id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, idx)}
                                                    onDragOver={(e) => handleDragOver(e, idx)}
                                                    onDrop={(e) => handleDrop(e, idx)}
                                                    onDragEnd={handleDragEnd}
                                                    style={{
                                                        borderBottom: idx < filteredMemories.length - 1 ? '1px solid #f3f4f6' : 'none',
                                                        background: dragOverIndex === idx ? '#f0f9ff' : 'transparent',
                                                        opacity: dragIndex === idx ? 0.5 : 1,
                                                        cursor: 'grab',
                                                        transition: 'all 0.15s',
                                                    }}
                                                >
                                                    <td style={{ padding: '12px 24px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <span style={{ fontSize: '1.2rem', color: '#9ca3af', cursor: 'grab' }}>⋮⋮</span>
                                                            {memory.imageUrl ? (
                                                                <img src={memory.imageUrl} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                                                            ) : <span style={{ fontSize: 24 }}>🖼️</span>}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e293b' }}>{memory.title}</td>
                                                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.9rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{memory.description || '-'}</td>
                                                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.85rem' }}>
                                                        {new Date(memory.date || memory.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '12px 24px' }}>
                                                        <div style={{ display: 'flex', gap: 6 }}>
                                                            <button onClick={() => { setEditMemory({ ...memory }); setShowEditModal(true); }} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#6366f1', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                                                            <button onClick={() => deleteMemory(memory._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#ef4444', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Messages Tab */}
                    {activeTab === 'messages' && (
                        <div style={{ background: '#fff', borderRadius: 16, padding: isMobile ? 16 : 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ margin: '0 0 20px', color: '#1e293b', fontSize: isMobile ? '1rem' : '1.1rem' }}>Messages ({messages.length})</h2>
                            {messages.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
                                    <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>💬</span>
                                    <p>No messages yet</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {messages.map(msg => (
                                        <div key={msg._id} style={{ padding: isMobile ? 12 : 16, background: msg.isRead ? '#f8fafc' : '#fef3c7', borderRadius: 12, border: `2px solid ${msg.isRead ? '#e5e7eb' : '#fcd34d'}` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 8 }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h4 style={{ margin: '0 0 4px', color: '#1e293b', fontSize: '0.95rem' }}>{!msg.isRead && '🔔 '}{msg.name}</h4>
                                                    <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#64748b' }}>{msg.email} • {new Date(msg.createdAt).toLocaleString()}</p>
                                                    <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem' }}>{msg.message}</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    {!msg.isRead && <button onClick={() => markAsRead(msg._id)} style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: '#22c55e', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>✓</button>}
                                                    <button onClick={() => deleteMessage(msg._id)} style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && settings && (
                        <div style={{ background: '#fff', borderRadius: 16, padding: isMobile ? 16 : 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                                <h2 style={{ margin: 0, color: '#1e293b', fontSize: isMobile ? '1rem' : '1.1rem' }}>Relationship Profile</h2>
                                <button onClick={saveSettings} disabled={settingsSaving} style={{
                                    padding: '10px 20px', borderRadius: 10, border: 'none',
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                                    fontWeight: 600, cursor: settingsSaving ? 'not-allowed' : 'pointer', opacity: settingsSaving ? 0.7 : 1, fontSize: '0.9rem',
                                }}>{settingsSaving ? 'Saving...' : '💾 Save'}</button>
                            </div>

                            <div style={{ marginBottom: 20, padding: 16, background: '#fef3c7', borderRadius: 12 }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#b45309', fontSize: '0.9rem' }}>💕 Start Date</label>
                                <input type="date" value={settings.relationshipDate} onChange={(e) => setSettings({ ...settings, relationshipDate: e.target.value })}
                                    style={{ padding: '10px 14px', borderRadius: 8, border: '2px solid #fbbf24', fontSize: '16px', width: '100%', maxWidth: 200, boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                                {/* Person 1 */}
                                <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12, border: '2px solid #22c55e' }}>
                                    <h3 style={{ margin: '0 0 12px', color: '#166534', fontSize: '1rem' }}>👤 Person 1</h3>
                                    <div style={{ marginBottom: 10 }}>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.85rem' }}>Name</label>
                                        <input type="text" value={settings.person1Name} onChange={(e) => setSettings({ ...settings, person1Name: e.target.value })}
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '16px' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.85rem' }}>Age</label>
                                            <input type="number" value={settings.person1Age} onChange={(e) => setSettings({ ...settings, person1Age: parseInt(e.target.value) })}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '16px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.85rem' }}>Zodiac</label>
                                            <input type="text" value={settings.person1Zodiac} onChange={(e) => setSettings({ ...settings, person1Zodiac: e.target.value })}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '16px' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.85rem' }}>Photo URL</label>
                                        <input type="text" value={settings.person1Photo} onChange={(e) => setSettings({ ...settings, person1Photo: e.target.value })}
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '16px' }} />
                                    </div>
                                </div>

                                {/* Person 2 */}
                                <div style={{ padding: 16, background: '#fdf2f8', borderRadius: 12, border: '2px solid #ec4899' }}>
                                    <h3 style={{ margin: '0 0 12px', color: '#be185d', fontSize: '1rem' }}>👤 Person 2</h3>
                                    <div style={{ marginBottom: 10 }}>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.85rem' }}>Name</label>
                                        <input type="text" value={settings.person2Name} onChange={(e) => setSettings({ ...settings, person2Name: e.target.value })}
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '16px' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.85rem' }}>Age</label>
                                            <input type="number" value={settings.person2Age} onChange={(e) => setSettings({ ...settings, person2Age: parseInt(e.target.value) })}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '16px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.85rem' }}>Zodiac</label>
                                            <input type="text" value={settings.person2Zodiac} onChange={(e) => setSettings({ ...settings, person2Zodiac: e.target.value })}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '16px' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.85rem' }}>Photo URL</label>
                                        <input type="text" value={settings.person2Photo} onChange={(e) => setSettings({ ...settings, person2Photo: e.target.value })}
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '16px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}

            {/* Add Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: 16 }} onClick={() => setShowAddModal(false)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: isMobile ? 20 : 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ margin: '0 0 20px', color: '#1e293b', fontSize: '1.1rem' }}>Add New Memory</h2>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Title *</label>
                            <input type="text" value={newMemory.title} onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '2px solid #e5e7eb', boxSizing: 'border-box', fontSize: '16px' }} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                            <textarea value={newMemory.description} onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })} rows={3}
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '2px solid #e5e7eb', boxSizing: 'border-box', resize: 'vertical', fontSize: '16px' }} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Image *</label>
                            <input type="file" accept="image/*" onChange={handleFileSelect}
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '2px dashed #6366f1', background: '#f8fafc', boxSizing: 'border-box' }} />
                            {previewUrl && <img src={previewUrl} alt="Preview" style={{ marginTop: 12, maxWidth: '100%', maxHeight: 150, borderRadius: 8 }} />}
                            {saving && uploadProgress > 0 && (
                                <div style={{ marginTop: 12, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ width: `${uploadProgress}%`, height: 6, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: 14, borderRadius: 10, border: '2px solid #e5e7eb', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                            <button onClick={addMemory} disabled={saving} style={{ flex: 1, padding: 14, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: '0.9rem' }}>
                                {saving ? 'Uploading...' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editMemory && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: 16 }} onClick={() => setShowEditModal(false)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: isMobile ? 20 : 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ margin: '0 0 20px', color: '#1e293b', fontSize: '1.1rem' }}>Edit Memory</h2>
                        {editMemory.imageUrl && <img src={editMemory.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 100, borderRadius: 8, marginBottom: 16 }} />}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Title *</label>
                            <input type="text" value={editMemory.title} onChange={(e) => setEditMemory({ ...editMemory, title: e.target.value })}
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '2px solid #e5e7eb', boxSizing: 'border-box', fontSize: '16px' }} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                            <textarea value={editMemory.description} onChange={(e) => setEditMemory({ ...editMemory, description: e.target.value })} rows={3}
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '2px solid #e5e7eb', boxSizing: 'border-box', resize: 'vertical', fontSize: '16px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: 14, borderRadius: 10, border: '2px solid #e5e7eb', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                            <button onClick={updateMemory} disabled={saving} style={{ flex: 1, padding: 14, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: '0.9rem' }}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============== MAIN COMPONENT ==============
const AdminDashboardNexus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const savedAdmin = localStorage.getItem('adminData');
        if (token && savedAdmin) {
            try { setAdmin(JSON.parse(savedAdmin)); setIsLoggedIn(true); }
            catch (e) { localStorage.removeItem('adminToken'); localStorage.removeItem('adminData'); }
        }
    }, []);

    const handleLogin = (adminData) => { setAdmin(adminData); setIsLoggedIn(true); };
    const handleLogout = () => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminData'); setIsLoggedIn(false); setAdmin(null); };

    if (!isLoggedIn) return <LoginForm onLogin={handleLogin} />;
    return <Dashboard admin={admin} onLogout={handleLogout} />;
};

export default AdminDashboardNexus;
