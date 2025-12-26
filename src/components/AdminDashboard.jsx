import { useState, useEffect } from 'react';
import axios from 'axios';

// Use environment variable for production, localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
            console.log('Attempting login with:', { email, password: '***' });
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            console.log('Login successful:', res.data);
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('adminData', JSON.stringify(res.data.admin));
            onLogin(res.data.admin);
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message || err);
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
            background: 'linear-gradient(135deg, #1a472a 0%, #0d2818 50%, #c41e3a 100%)',
            padding: 20,
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 24,
                padding: 40,
                width: '100%',
                maxWidth: 420,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <span style={{ fontSize: 50 }}>🎄</span>
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        color: '#1a472a',
                        margin: '10px 0 5px',
                    }}>Admin Dashboard</h1>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Memory Album Management</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px 16px',
                        borderRadius: 12,
                        marginBottom: 20,
                        fontSize: '0.9rem',
                    }}>
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                            📧 Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@memoryalbum.com"
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: 12,
                                border: '2px solid #e5e7eb',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 30 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                            🔒 Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: 12,
                                border: '2px solid #e5e7eb',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: 12,
                            border: 'none',
                            background: 'linear-gradient(135deg, #c41e3a, #8b0000)',
                            color: '#fff',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 15px rgba(196, 30, 58, 0.4)',
                        }}
                    >
                        {loading ? '⏳ Signing in...' : '🎅 Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, color: '#888', fontSize: '0.8rem' }}>
                    Default: admin@memoryalbum.com / admin123
                </p>
            </div>
        </div>
    );
};

// ============== STAT CARD COMPONENT ==============
const StatCard = ({ icon, label, value, color, subValue }) => (
    <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: `2px solid ${color}20`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 8px 30px ${color}30`;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: 8 }}>{label}</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: color, margin: 0 }}>{value}</p>
                {subValue && <p style={{ color: '#888', fontSize: '0.8rem', marginTop: 4 }}>{subValue}</p>}
            </div>
            <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
            }}>
                {icon}
            </div>
        </div>
    </div>
);

// ============== DASHBOARD COMPONENT ==============
const Dashboard = ({ admin, onLogout }) => {
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [memories, setMemories] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Settings (Relationship Profile)
    const [settings, setSettings] = useState(null);
    const [settingsSaving, setSettingsSaving] = useState(false);

    // Add Memory Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMemory, setNewMemory] = useState({
        title: '',
        description: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const token = localStorage.getItem('adminToken') || 'no-auth-required';
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchData();
    }, []);

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
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Save settings
    const saveSettings = async () => {
        setSettingsSaving(true);
        try {
            await axios.put(`${API_URL}/settings`, settings, authHeader);
            alert('✅ Settings saved successfully!');
        } catch (err) {
            console.error('Error saving settings:', err);
            alert('Failed to save settings');
        } finally {
            setSettingsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        onLogout();
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addMemory = async () => {
        if (!newMemory.title) {
            alert('Please enter a title');
            return;
        }
        if (!selectedFile) {
            alert('Please select an image');
            return;
        }

        setSaving(true);
        setUploadProgress(0);

        try {
            // First upload the image
            const formData = new FormData();
            formData.append('image', selectedFile);

            const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });

            // Then create the memory with the image URL
            await axios.post(`${API_URL}/memories`, {
                title: newMemory.title,
                description: newMemory.description,
                imageUrl: uploadRes.data.imageUrl,
            }, authHeader);

            setShowAddModal(false);
            setNewMemory({ title: '', description: '' });
            setSelectedFile(null);
            setPreviewUrl('');
            setUploadProgress(0);
            fetchData();
        } catch (err) {
            console.error('Error adding memory:', err);
            console.error('Error response:', err.response?.data);
            alert('Failed to add memory: ' + (err.response?.data?.error || err.message));
        } finally {
            setSaving(false);
        }
    };

    const deleteMemory = async (id) => {
        if (!confirm('🗑️ Delete this memory?')) return;
        try {
            await axios.delete(`${API_URL}/memories/${id}`, authHeader);
            fetchData();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    // Edit Memory Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMemory, setEditMemory] = useState(null);

    const openEditModal = (memory) => {
        setEditMemory({
            _id: memory._id,
            title: memory.title,
            description: memory.description || '',
            imageUrl: memory.imageUrl,
        });
        setShowEditModal(true);
    };

    const updateMemory = async () => {
        if (!editMemory.title) {
            alert('Please enter a title');
            return;
        }
        setSaving(true);
        try {
            await axios.put(`${API_URL}/memories/${editMemory._id}`, {
                title: editMemory.title,
                description: editMemory.description,
                imageUrl: editMemory.imageUrl,
            }, authHeader);
            setShowEditModal(false);
            setEditMemory(null);
            fetchData();
        } catch (err) {
            console.error('Error updating memory:', err);
            alert('Failed to update memory');
        } finally {
            setSaving(false);
        }
    };

    // Move memory to first position
    const moveToFirst = async (id) => {
        try {
            await axios.put(`${API_URL}/memories/${id}/move-first`, {}, authHeader);
            fetchData();
        } catch (err) {
            console.error('Error moving:', err);
        }
    };

    // Move memory up
    const moveUp = async (id) => {
        try {
            await axios.put(`${API_URL}/memories/${id}/move-up`, {}, authHeader);
            fetchData();
        } catch (err) {
            console.error('Error moving:', err);
        }
    };

    // Move memory down
    const moveDown = async (id) => {
        try {
            await axios.put(`${API_URL}/memories/${id}/move-down`, {}, authHeader);
            fetchData();
        } catch (err) {
            console.error('Error moving:', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${API_URL}/messages/${id}/read`, {}, authHeader);
            fetchData();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            await axios.delete(`${API_URL}/messages/${id}`, authHeader);
            fetchData();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 60, display: 'block', marginBottom: 20 }}>🎄</span>
                    <p style={{ color: '#666' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, #1a472a 0%, #0d2818 100%)',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 32 }}>🎄</span>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '1.3rem', margin: 0, fontWeight: 700 }}>
                            Memory Album
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: 0 }}>
                            Admin Dashboard
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ color: '#fff', fontSize: '0.9rem' }}>
                        👋 Welcome, {admin?.name || 'Admin'}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 10,
                            border: '2px solid rgba(255,255,255,0.3)',
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <nav style={{
                background: '#fff',
                padding: '12px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                gap: 8,
            }}>
                {[
                    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
                    { id: 'memories', icon: '📷', label: 'Memories' },
                    { id: 'messages', icon: '💬', label: 'Messages' },
                    { id: 'settings', icon: '⚙️', label: 'Settings' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 10,
                            border: 'none',
                            background: activeTab === tab.id ? '#1a472a' : 'transparent',
                            color: activeTab === tab.id ? '#fff' : '#666',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </nav>

            {/* Main Content */}
            <main style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && stats && (
                    <>
                        {/* Stats Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: 20,
                            marginBottom: 30,
                        }}>
                            <StatCard
                                icon="📷"
                                label="Total Memories"
                                value={stats.totalMemories}
                                color="#c41e3a"
                            />
                            <StatCard
                                icon="👥"
                                label="Total Visitors"
                                value={stats.totalVisitors}
                                color="#228b22"
                                subValue={`${stats.todayVisitors} today`}
                            />
                            <StatCard
                                icon="💬"
                                label="Messages"
                                value={stats.totalMessages}
                                color="#ffd700"
                                subValue={`${stats.unreadMessages} unread`}
                            />
                            <StatCard
                                icon="🎄"
                                label="Today's Views"
                                value={stats.todayVisitors}
                                color="#8b0000"
                            />
                        </div>

                        {/* Charts & Recent Activity */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                            {/* Visitor Chart */}
                            <div style={{
                                background: '#fff',
                                borderRadius: 16,
                                padding: 24,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            }}>
                                <h3 style={{ margin: '0 0 20px', color: '#333' }}>📈 Visitors (Last 7 Days)</h3>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200 }}>
                                    {stats.last7Days.map((day, i) => (
                                        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                            <div
                                                style={{
                                                    height: Math.max(20, (day.visitors / Math.max(...stats.last7Days.map(d => d.visitors || 1))) * 150),
                                                    background: 'linear-gradient(180deg, #c41e3a, #8b0000)',
                                                    borderRadius: '8px 8px 0 0',
                                                    transition: 'height 0.3s',
                                                    minHeight: 20,
                                                }}
                                            />
                                            <p style={{ fontSize: '0.7rem', color: '#888', marginTop: 8 }}>
                                                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: '#333', fontWeight: 600 }}>
                                                {day.visitors}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Messages */}
                            <div style={{
                                background: '#fff',
                                borderRadius: 16,
                                padding: 24,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            }}>
                                <h3 style={{ margin: '0 0 20px', color: '#333' }}>💬 Recent Messages</h3>
                                {stats.recentMessages.length === 0 ? (
                                    <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>
                                        No messages yet
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {stats.recentMessages.slice(0, 4).map((msg, i) => (
                                            <div key={i} style={{
                                                padding: 12,
                                                background: msg.isRead ? '#f8fafc' : '#fef3c7',
                                                borderRadius: 10,
                                                borderLeft: `4px solid ${msg.isRead ? '#e5e7eb' : '#ffd700'}`,
                                            }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333', margin: 0 }}>
                                                    {msg.name}
                                                </p>
                                                <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0' }}>
                                                    {msg.message.substring(0, 50)}...
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Memories Tab */}
                {activeTab === 'memories' && (
                    <div style={{
                        background: '#fff',
                        borderRadius: 16,
                        padding: 24,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ margin: 0, color: '#333' }}>📷 Memory Manager</h2>
                            <button
                                onClick={() => setShowAddModal(true)}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: 10,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #228b22, #1a472a)',
                                    color: '#fff',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}>
                                ➕ Add Memory
                            </button>
                        </div>

                        {memories.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
                                <span style={{ fontSize: 60, display: 'block', marginBottom: 16 }}>📷</span>
                                <p>No memories in database. Click "Add Memory" to create one!</p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: 16,
                            }}>
                                {memories.map(memory => (
                                    <div key={memory._id} style={{
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        border: '2px solid #e5e7eb',
                                        transition: 'all 0.3s',
                                        position: 'relative',
                                        background: '#fff',
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {/* Action Buttons */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            display: 'flex',
                                            gap: 6,
                                            zIndex: 2,
                                        }}>
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => openEditModal(memory)}
                                                title="Edit"
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    background: 'rgba(34, 139, 34, 0.9)',
                                                    color: '#fff',
                                                    fontSize: 14,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'transform 0.2s',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                ✏️
                                            </button>
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => deleteMemory(memory._id)}
                                                title="Delete"
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    background: 'rgba(239, 68, 68, 0.9)',
                                                    color: '#fff',
                                                    fontSize: 14,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'transform 0.2s',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        <div style={{
                                            height: 150,
                                            background: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {memory.imageUrl ? (
                                                <img src={memory.imageUrl} alt={memory.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: 40 }}>🖼️</span>
                                            )}
                                        </div>
                                        <div style={{ padding: 12 }}>
                                            <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', color: '#333' }}>{memory.title}</h4>
                                            {memory.description && (
                                                <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#666' }}>
                                                    {memory.description.substring(0, 30)}...
                                                </p>
                                            )}
                                            <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#888' }}>
                                                📅 {new Date(memory.date || memory.createdAt).toLocaleDateString()}
                                            </p>

                                            {/* Move Buttons */}
                                            <div style={{
                                                display: 'flex',
                                                gap: 4,
                                                justifyContent: 'center',
                                                borderTop: '1px solid #e5e7eb',
                                                paddingTop: 8,
                                                marginTop: 4,
                                            }}>
                                                <button
                                                    onClick={() => moveToFirst(memory._id)}
                                                    title="Move to First"
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: 6,
                                                        border: '1px solid #ffd700',
                                                        background: '#fffbeb',
                                                        color: '#b45309',
                                                        fontSize: 12,
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    ⭐ First
                                                </button>
                                                <button
                                                    onClick={() => moveUp(memory._id)}
                                                    title="Move Up"
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: 6,
                                                        border: '1px solid #22c55e',
                                                        background: '#f0fdf4',
                                                        color: '#166534',
                                                        fontSize: 12,
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    ⬆️ Up
                                                </button>
                                                <button
                                                    onClick={() => moveDown(memory._id)}
                                                    title="Move Down"
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: 6,
                                                        border: '1px solid #3b82f6',
                                                        background: '#eff6ff',
                                                        color: '#1d4ed8',
                                                        fontSize: 12,
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    ⬇️ Down
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <div style={{
                        background: '#fff',
                        borderRadius: 16,
                        padding: 24,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    }}>
                        <h2 style={{ margin: '0 0 24px', color: '#333' }}>💬 Messages ({messages.length})</h2>

                        {messages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
                                <span style={{ fontSize: 60, display: 'block', marginBottom: 16 }}>💬</span>
                                <p>No messages yet. They'll appear when visitors leave messages!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {messages.map(msg => (
                                    <div key={msg._id} style={{
                                        padding: 20,
                                        background: msg.isRead ? '#f8fafc' : '#fffbeb',
                                        borderRadius: 12,
                                        border: `2px solid ${msg.isRead ? '#e5e7eb' : '#fcd34d'}`,
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px', color: '#333' }}>
                                                    {!msg.isRead && '🔔 '}{msg.name}
                                                </h4>
                                                <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#888' }}>
                                                    {msg.email} • {new Date(msg.createdAt).toLocaleString()}
                                                </p>
                                                <p style={{ margin: 0, color: '#555' }}>{msg.message}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {!msg.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(msg._id)}
                                                        style={{
                                                            padding: '8px 12px',
                                                            borderRadius: 8,
                                                            border: 'none',
                                                            background: '#22c55e',
                                                            color: '#fff',
                                                            fontSize: '0.8rem',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        ✓ Read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteMessage(msg._id)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderRadius: 8,
                                                        border: 'none',
                                                        background: '#ef4444',
                                                        color: '#fff',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    🗑️
                                                </button>
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
                    <div style={{
                        background: '#fff',
                        borderRadius: 16,
                        padding: 24,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ margin: 0, color: '#333' }}>⚙️ Relationship Profile Settings</h2>
                            <button
                                onClick={saveSettings}
                                disabled={settingsSaving}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: 10,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #228b22, #1a472a)',
                                    color: '#fff',
                                    fontWeight: 600,
                                    cursor: settingsSaving ? 'not-allowed' : 'pointer',
                                    opacity: settingsSaving ? 0.7 : 1,
                                }}
                            >
                                {settingsSaving ? '⏳ Saving...' : '💾 Save Settings'}
                            </button>
                        </div>

                        {/* Relationship Date */}
                        <div style={{ marginBottom: 24, padding: 16, background: '#fef3c7', borderRadius: 12 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#b45309' }}>
                                💕 Relationship Start Date
                            </label>
                            <input
                                type="date"
                                value={settings.relationshipDate}
                                onChange={(e) => setSettings({ ...settings, relationshipDate: e.target.value })}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: 8,
                                    border: '2px solid #fbbf24',
                                    fontSize: '1rem',
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                            {/* Person 1 */}
                            <div style={{ padding: 20, background: '#f0fdf4', borderRadius: 12, border: '2px solid #22c55e' }}>
                                <h3 style={{ margin: '0 0 16px', color: '#166534' }}>👤 Person 1 (Left)</h3>

                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Name</label>
                                    <input
                                        type="text"
                                        value={settings.person1Name}
                                        onChange={(e) => setSettings({ ...settings, person1Name: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Age</label>
                                        <input
                                            type="number"
                                            value={settings.person1Age}
                                            onChange={(e) => setSettings({ ...settings, person1Age: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Gender</label>
                                        <select
                                            value={settings.person1Gender}
                                            onChange={(e) => setSettings({ ...settings, person1Gender: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                        >
                                            <option value="♂">♂ Male</option>
                                            <option value="♀">♀ Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Zodiac</label>
                                        <input
                                            type="text"
                                            value={settings.person1Zodiac}
                                            onChange={(e) => setSettings({ ...settings, person1Zodiac: e.target.value })}
                                            placeholder="Pisces"
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Zodiac Symbol</label>
                                        <input
                                            type="text"
                                            value={settings.person1ZodiacSymbol}
                                            onChange={(e) => setSettings({ ...settings, person1ZodiacSymbol: e.target.value })}
                                            placeholder="♓"
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>📷 Profile Photo</label>

                                    {/* Current Photo Preview */}
                                    {settings.person1Photo && (
                                        <div style={{ marginBottom: 8, textAlign: 'center' }}>
                                            <img
                                                src={settings.person1Photo}
                                                alt="Current"
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    border: '3px solid #22c55e',
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append('image', file);

                                            try {
                                                const res = await axios.post(`${API_URL}/upload`, formData, {
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data',
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                });
                                                setSettings({ ...settings, person1Photo: res.data.imageUrl });
                                            } catch (err) {
                                                alert('Failed to upload image');
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: 6,
                                            border: '2px dashed #22c55e',
                                            background: '#f0fdf4',
                                            cursor: 'pointer',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>Or enter URL:</p>
                                    <input
                                        type="text"
                                        value={settings.person1Photo}
                                        onChange={(e) => setSettings({ ...settings, person1Photo: e.target.value })}
                                        placeholder="./assets/images/1.jpg"
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Tagline</label>
                                    <input
                                        type="text"
                                        value={settings.person1Tagline}
                                        onChange={(e) => setSettings({ ...settings, person1Tagline: e.target.value })}
                                        placeholder="Rith Ft Ry"
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            {/* Person 2 */}
                            <div style={{ padding: 20, background: '#fdf2f8', borderRadius: 12, border: '2px solid #ec4899' }}>
                                <h3 style={{ margin: '0 0 16px', color: '#be185d' }}>👤 Person 2 (Right)</h3>

                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Name</label>
                                    <input
                                        type="text"
                                        value={settings.person2Name}
                                        onChange={(e) => setSettings({ ...settings, person2Name: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Age</label>
                                        <input
                                            type="number"
                                            value={settings.person2Age}
                                            onChange={(e) => setSettings({ ...settings, person2Age: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Gender</label>
                                        <select
                                            value={settings.person2Gender}
                                            onChange={(e) => setSettings({ ...settings, person2Gender: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                        >
                                            <option value="♂">♂ Male</option>
                                            <option value="♀">♀ Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Zodiac</label>
                                        <input
                                            type="text"
                                            value={settings.person2Zodiac}
                                            onChange={(e) => setSettings({ ...settings, person2Zodiac: e.target.value })}
                                            placeholder="Aries"
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Zodiac Symbol</label>
                                        <input
                                            type="text"
                                            value={settings.person2ZodiacSymbol}
                                            onChange={(e) => setSettings({ ...settings, person2ZodiacSymbol: e.target.value })}
                                            placeholder="♈"
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>📷 Profile Photo</label>

                                    {/* Current Photo Preview */}
                                    {settings.person2Photo && (
                                        <div style={{ marginBottom: 8, textAlign: 'center' }}>
                                            <img
                                                src={settings.person2Photo}
                                                alt="Current"
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    border: '3px solid #ec4899',
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append('image', file);

                                            try {
                                                const res = await axios.post(`${API_URL}/upload`, formData, {
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data',
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                });
                                                setSettings({ ...settings, person2Photo: res.data.imageUrl });
                                            } catch (err) {
                                                alert('Failed to upload image');
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: 6,
                                            border: '2px dashed #ec4899',
                                            background: '#fdf2f8',
                                            cursor: 'pointer',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>Or enter URL:</p>
                                    <input
                                        type="text"
                                        value={settings.person2Photo}
                                        onChange={(e) => setSettings({ ...settings, person2Photo: e.target.value })}
                                        placeholder="./assets/images/7.jpg"
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' }}>Tagline</label>
                                    <input
                                        type="text"
                                        value={settings.person2Tagline}
                                        onChange={(e) => setSettings({ ...settings, person2Tagline: e.target.value })}
                                        placeholder="Ry Ft Rith"
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                padding: 20,
                color: '#888',
                fontSize: '0.85rem',
            }}>
                🎄 Memory Album Admin Dashboard • Made with ❤️
            </footer>

            {/* Add Memory Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: 20,
                }}
                    onClick={() => setShowAddModal(false)}
                >
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 20,
                            padding: 32,
                            width: '100%',
                            maxWidth: 500,
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ margin: '0 0 24px', color: '#333', textAlign: 'center' }}>
                            📷 Add New Memory
                        </h2>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                                Title *
                            </label>
                            <input
                                type="text"
                                value={newMemory.title}
                                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                                placeholder="Enter memory title"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 10,
                                    border: '2px solid #e5e7eb',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                                Description
                            </label>
                            <textarea
                                value={newMemory.description}
                                onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                                placeholder="Describe this memory..."
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 10,
                                    border: '2px solid #e5e7eb',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                                📷 Select Image *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: 10,
                                    border: '2px dashed #228b22',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    boxSizing: 'border-box',
                                    background: '#f0fff0',
                                }}
                            />

                            {/* Image Preview */}
                            {previewUrl && (
                                <div style={{ marginTop: 16, textAlign: 'center' }}>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: 200,
                                            borderRadius: 12,
                                            border: '2px solid #e5e7eb',
                                        }}
                                    />
                                    <p style={{ color: '#666', fontSize: '0.85rem', marginTop: 8 }}>
                                        ✅ Image selected: {selectedFile?.name}
                                    </p>
                                </div>
                            )}

                            {/* Upload Progress */}
                            {saving && uploadProgress > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    <div style={{
                                        width: '100%',
                                        height: 8,
                                        background: '#e5e7eb',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            width: `${uploadProgress}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #228b22, #1a472a)',
                                            transition: 'width 0.3s',
                                        }} />
                                    </div>
                                    <p style={{ textAlign: 'center', color: '#666', fontSize: '0.85rem', marginTop: 4 }}>
                                        Uploading... {uploadProgress}%
                                    </p>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: 10,
                                    border: '2px solid #e5e7eb',
                                    background: '#fff',
                                    color: '#666',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addMemory}
                                disabled={saving}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: 10,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #228b22, #1a472a)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    opacity: saving ? 0.7 : 1,
                                }}
                            >
                                {saving ? '⏳ Saving...' : '✅ Add Memory'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Memory Modal */}
            {showEditModal && editMemory && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: 20,
                }}
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 20,
                            padding: 32,
                            width: '100%',
                            maxWidth: 500,
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ margin: '0 0 24px', color: '#333', textAlign: 'center' }}>
                            ✏️ Edit Memory
                        </h2>

                        {/* Current Image */}
                        {editMemory.imageUrl && (
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <img
                                    src={editMemory.imageUrl}
                                    alt="Current"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: 150,
                                        borderRadius: 12,
                                        border: '2px solid #e5e7eb',
                                    }}
                                />
                                <p style={{ color: '#888', fontSize: '0.8rem', marginTop: 8 }}>Current Image</p>
                            </div>
                        )}

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                                📝 Title *
                            </label>
                            <input
                                type="text"
                                value={editMemory.title}
                                onChange={(e) => setEditMemory({ ...editMemory, title: e.target.value })}
                                placeholder="Enter memory title"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 10,
                                    border: '2px solid #e5e7eb',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                                📄 Description
                            </label>
                            <textarea
                                value={editMemory.description}
                                onChange={(e) => setEditMemory({ ...editMemory, description: e.target.value })}
                                placeholder="Describe this memory..."
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 10,
                                    border: '2px solid #e5e7eb',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditMemory(null);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: 10,
                                    border: '2px solid #e5e7eb',
                                    background: '#fff',
                                    color: '#666',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                ❌ Cancel
                            </button>
                            <button
                                onClick={updateMemory}
                                disabled={saving}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: 10,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #228b22, #1a472a)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    opacity: saving ? 0.7 : 1,
                                }}
                            >
                                {saving ? '⏳ Saving...' : '💾 Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============== MAIN ADMIN COMPONENT ==============
const AdminDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [admin, setAdmin] = useState(null);

    // Check if already logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const savedAdmin = localStorage.getItem('adminData');
        if (token && savedAdmin) {
            try {
                setAdmin(JSON.parse(savedAdmin));
                setIsLoggedIn(true);
            } catch (e) {
                // Invalid data, clear it
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminData');
            }
        }
    }, []);

    const handleLogin = (adminData) => {
        setAdmin(adminData);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setIsLoggedIn(false);
        setAdmin(null);
    };

    // Show login form if not logged in
    if (!isLoggedIn) {
        return <LoginForm onLogin={handleLogin} />;
    }

    // Show dashboard if logged in
    return <Dashboard admin={admin} onLogout={handleLogout} />;
};

export default AdminDashboard;
