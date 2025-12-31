import { useState, useEffect } from 'react';
import axios from 'axios';
import { theme, appConfig, API_URL, CLOUDINARY } from './config';
import { useResponsive } from './hooks/useResponsive';
import { Sidebar, Header, MobileBottomNav } from './components';
import { DashboardTab, MemoriesTab, MessagesTab, TimelineTab, SettingsTab, AppearanceTab } from './components/tabs';
import { AddMemoryModal, EditMemoryModal, AddTimelineModal, EditTimelineModal } from './components/modals';

const { colors, shadows } = theme;
const { messages, icons } = appConfig;

const Dashboard = ({ admin, onLogout }) => {
    const { isMobile } = useResponsive();
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [memories, setMemories] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [backendStatus, setBackendStatus] = useState('checking');
    const [dragIndex, setDragIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMemory, setNewMemory] = useState({ title: '', description: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMemory, setEditMemory] = useState(null);
    const [timelineItems, setTimelineItems] = useState([]);
    const [showAddTimelineModal, setShowAddTimelineModal] = useState(false);
    const [newTimelineItem, setNewTimelineItem] = useState({ time: '', activity: '', details: '' });
    const [showEditTimelineModal, setShowEditTimelineModal] = useState(false);
    const [editTimelineItem, setEditTimelineItem] = useState(null);
    const [timelineSaving, setTimelineSaving] = useState(false);

    // Appearance state
    const [appearance, setAppearance] = useState(null);
    const [appearanceSaving, setAppearanceSaving] = useState(false);

    const token = localStorage.getItem('adminToken') || 'no-auth-required';
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        checkHealth();
        fetchData();
        const healthInterval = setInterval(checkHealth, appConfig.api.healthCheckInterval);
        return () => clearInterval(healthInterval);
    }, []);

    const checkHealth = async () => {
        try { await axios.get(`${API_URL.replace('/api', '')}/api/health`); setBackendStatus('online'); }
        catch (e) { setBackendStatus('offline'); }
    };

    const fetchData = async () => {
        try {
            const results = await Promise.allSettled([
                axios.get(`${API_URL}/dashboard/stats`, authHeader),
                axios.get(`${API_URL}/memories`),
                axios.get(`${API_URL}/messages`, authHeader),
                axios.get(`${API_URL}/settings`),
                axios.get(`${API_URL}/timeline`),
                axios.get(`${API_URL}/appearance`),
            ]);
            if (results[0].status === 'fulfilled') setStats(results[0].value.data);
            if (results[1].status === 'fulfilled') setMemories(results[1].value.data);
            if (results[2].status === 'fulfilled') setMessageList(results[2].value.data);
            if (results[3].status === 'fulfilled') setSettings(results[3].value.data);
            if (results[4].status === 'fulfilled') setTimelineItems(results[4].value.data);
            if (results[5].status === 'fulfilled') setAppearance(results[5].value.data);
        } catch (err) { console.error('Error fetching data:', err); }
        finally { setLoading(false); }
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY.uploadPreset);
        formData.append('folder', CLOUDINARY.folder);
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`, formData, {
            onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)),
        });
        return response.data.secure_url;
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) { setSelectedFile(file); const reader = new FileReader(); reader.onloadend = () => setPreviewUrl(reader.result); reader.readAsDataURL(file); }
    };

    const addMemory = async () => {
        if (!newMemory.title || !selectedFile) { alert('Please fill title and select image'); return; }
        setSaving(true); setUploadProgress(0);
        try {
            const imageUrl = await uploadToCloudinary(selectedFile);
            await axios.post(`${API_URL}/memories`, { title: newMemory.title, description: newMemory.description || '', imageUrl, date: new Date().toISOString() }, authHeader);
            setShowAddModal(false); setNewMemory({ title: '', description: '' }); setSelectedFile(null); setPreviewUrl(''); fetchData();
        } catch (err) { alert('Failed to add memory: ' + (err.response?.data?.error || err.message)); }
        finally { setSaving(false); }
    };

    const deleteMemory = async (id) => { if (!confirm(messages.confirmDelete)) return; try { await axios.delete(`${API_URL}/memories/${id}`, authHeader); fetchData(); } catch (err) { console.error(err); } };

    const updateMemory = async () => {
        if (!editMemory?.title) { alert('Please enter title'); return; }
        setSaving(true);
        try { await axios.put(`${API_URL}/memories/${editMemory._id}`, editMemory, authHeader); setShowEditModal(false); setEditMemory(null); fetchData(); }
        catch (err) { alert('Failed to update'); }
        finally { setSaving(false); }
    };

    const handleDragStart = (e, index) => { setDragIndex(index); e.dataTransfer.effectAllowed = 'move'; e.currentTarget.style.opacity = '0.5'; };
    const handleDragOver = (e, index) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (dragOverIndex !== index) setDragOverIndex(index); };
    const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault(); setDragOverIndex(null);
        if (dragIndex === null || dragIndex === dropIndex) { setDragIndex(null); return; }
        const newMems = [...memories];
        const draggedItem = filteredMemories[dragIndex], targetItem = filteredMemories[dropIndex];
        const realDragIdx = newMems.findIndex(m => m._id === draggedItem._id), realDropIdx = newMems.findIndex(m => m._id === targetItem._id);
        if (realDragIdx === -1 || realDropIdx === -1) return;
        const [moved] = newMems.splice(realDragIdx, 1); newMems.splice(realDropIdx, 0, moved);
        const updated = newMems.map((m, i) => ({ ...m, order: i })); setMemories(updated);
        try { await axios.put(`${API_URL}/memories/reorder-all`, { orders: updated.map(m => ({ id: m._id, order: m.order })) }, authHeader); } catch (err) { console.error('Reorder failed:', err); }
        setDragIndex(null);
    };

    const markAsRead = async (id) => { try { await axios.put(`${API_URL}/messages/${id}/read`, {}, authHeader); fetchData(); } catch (err) { console.error(err); } };
    const deleteMessage = async (id) => { if (!confirm(messages.confirmDelete)) return; try { await axios.delete(`${API_URL}/messages/${id}`, authHeader); fetchData(); } catch (err) { console.error(err); } };
    const saveSettings = async () => { setSettingsSaving(true); try { await axios.put(`${API_URL}/settings`, settings, authHeader); alert('Settings saved!'); } catch (err) { alert('Failed to save'); } finally { setSettingsSaving(false); } };

    // Appearance save
    const saveAppearance = async () => {
        setAppearanceSaving(true);
        try {
            await axios.put(`${API_URL}/appearance`, appearance, authHeader);
            alert('Appearance settings saved! Refresh the page to see changes.');
        } catch (err) { alert('Failed to save appearance: ' + (err.response?.data?.error || err.message)); }
        finally { setAppearanceSaving(false); }
    };

    const addTimelineItem = async () => {
        if (!newTimelineItem.time || !newTimelineItem.activity) { alert('Please fill time and activity'); return; }
        setTimelineSaving(true);
        try { await axios.post(`${API_URL}/timeline`, newTimelineItem, authHeader); setShowAddTimelineModal(false); setNewTimelineItem({ time: '', activity: '', details: '' }); fetchData(); }
        catch (err) { alert('Failed to add: ' + (err.response?.data?.error || err.message)); }
        finally { setTimelineSaving(false); }
    };

    const deleteTimelineItem = async (id) => { if (!confirm(messages.confirmDelete)) return; try { await axios.delete(`${API_URL}/timeline/${id}`, authHeader); fetchData(); } catch (err) { console.error(err); } };

    const updateTimelineItem = async () => {
        if (!editTimelineItem?.time || !editTimelineItem?.activity) { alert('Please fill time and activity'); return; }
        setTimelineSaving(true);
        try { await axios.put(`${API_URL}/timeline/${editTimelineItem._id}`, editTimelineItem, authHeader); setShowEditTimelineModal(false); setEditTimelineItem(null); fetchData(); }
        catch (err) { alert('Failed to update'); }
        finally { setTimelineSaving(false); }
    };

    const moveTimelineItem = async (index, direction) => {
        const newItems = [...timelineItems];
        if (direction === 'up' && index > 0) [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        else if (direction === 'down' && index < newItems.length - 1) [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        else return;
        const reordered = newItems.map((item, idx) => ({ ...item, order: idx })); setTimelineItems(reordered);
        try { await axios.put(`${API_URL}/timeline/reorder-all`, { orders: reordered.map(item => ({ id: item._id, order: item.order })) }, authHeader); } catch (err) { console.error('Failed to reorder:', err); }
    };

    const moveMemoryItem = async (index, direction) => {
        const item = filteredMemories[index], indexInAll = memories.findIndex(m => m._id === item._id);
        const newMems = [...memories];
        if (direction === 'up' && indexInAll > 0) [newMems[indexInAll], newMems[indexInAll - 1]] = [newMems[indexInAll - 1], newMems[indexInAll]];
        else if (direction === 'down' && indexInAll < newMems.length - 1) [newMems[indexInAll], newMems[indexInAll + 1]] = [newMems[indexInAll + 1], newMems[indexInAll]];
        else return;
        const reordered = newMems.map((m, idx) => ({ ...m, order: idx })); setMemories(reordered);
        try { await axios.put(`${API_URL}/memories/reorder-all`, { orders: reordered.map(m => ({ id: m._id, order: m.order })) }, authHeader); } catch (err) { console.error('Failed to reorder:', err); }
    };

    const filteredMemories = memories.filter(m => m.title?.toLowerCase().includes(searchQuery.toLowerCase()) || m.description?.toLowerCase().includes(searchQuery.toLowerCase()));

    // Use dynamic navigation from appearance or fallback to config
    const navItems = appearance?.navItems || appConfig.navigation;

    const getTitle = () => {
        const nav = navItems.find(n => n.id === activeTab);
        return nav?.label || 'Dashboard';
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.light }}>
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>{icons.loading}</span>
                <p style={{ color: colors.textSecondary }}>{messages.loading}</p>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: colors.light, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} admin={admin} onLogout={onLogout} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} backendStatus={backendStatus} appearance={appearance} />
            <div style={{ flex: 1, marginLeft: isMobile ? 0 : theme.sidebar.width, display: 'flex', flexDirection: 'column', paddingBottom: isMobile ? 80 : 0 }}>
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} title={getTitle()} isMobile={isMobile} onLogout={onLogout} appearance={appearance} />
                <main style={{ padding: isMobile ? theme.spacing.lg : `${theme.spacing.xxl + 4}px ${theme.spacing.xxxl}px`, flex: 1 }}>
                    {activeTab === 'dashboard' && <DashboardTab stats={stats} isMobile={isMobile} />}
                    {activeTab === 'memories' && <MemoriesTab filteredMemories={filteredMemories} memories={memories} isMobile={isMobile} onShowAddModal={() => setShowAddModal(true)} onEdit={(m) => { setEditMemory({ ...m }); setShowEditModal(true); }} onDelete={deleteMemory} onMove={moveMemoryItem} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} onDragEnd={handleDragEnd} dragIndex={dragIndex} dragOverIndex={dragOverIndex} />}
                    {activeTab === 'messages' && <MessagesTab messages={messageList} isMobile={isMobile} onMarkAsRead={markAsRead} onDelete={deleteMessage} />}
                    {activeTab === 'timeline' && <TimelineTab timelineItems={timelineItems} isMobile={isMobile} onShowAddModal={() => setShowAddTimelineModal(true)} onEdit={(item) => { setEditTimelineItem({ ...item }); setShowEditTimelineModal(true); }} onDelete={deleteTimelineItem} onMove={moveTimelineItem} />}
                    {activeTab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} isMobile={isMobile} onSave={saveSettings} saving={settingsSaving} />}
                    {activeTab === 'appearance' && <AppearanceTab appearance={appearance} setAppearance={setAppearance} isMobile={isMobile} onSave={saveAppearance} saving={appearanceSaving} />}
                </main>
            </div>
            {isMobile && <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} appearance={appearance} />}
            <AddMemoryModal show={showAddModal} onClose={() => setShowAddModal(false)} newMemory={newMemory} setNewMemory={setNewMemory} previewUrl={previewUrl} onFileSelect={handleFileSelect} onAdd={addMemory} saving={saving} uploadProgress={uploadProgress} isMobile={isMobile} />
            <EditMemoryModal show={showEditModal} onClose={() => setShowEditModal(false)} editMemory={editMemory} setEditMemory={setEditMemory} onUpdate={updateMemory} saving={saving} isMobile={isMobile} />
            <AddTimelineModal show={showAddTimelineModal} onClose={() => setShowAddTimelineModal(false)} newTimelineItem={newTimelineItem} setNewTimelineItem={setNewTimelineItem} onAdd={addTimelineItem} saving={timelineSaving} isMobile={isMobile} />
            <EditTimelineModal show={showEditTimelineModal} onClose={() => setShowEditTimelineModal(false)} editTimelineItem={editTimelineItem} setEditTimelineItem={setEditTimelineItem} onUpdate={updateTimelineItem} saving={timelineSaving} isMobile={isMobile} />
        </div>
    );
};

export default Dashboard;
