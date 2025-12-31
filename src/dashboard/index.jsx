import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './Dashboard';

const AdminDashboardNexus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const savedAdmin = localStorage.getItem('adminData');
        if (token && savedAdmin) {
            try {
                setAdmin(JSON.parse(savedAdmin));
                setIsLoggedIn(true);
            } catch (e) {
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

    if (!isLoggedIn) return <LoginForm onLogin={handleLogin} />;
    return <Dashboard admin={admin} onLogout={handleLogout} />;
};

export default AdminDashboardNexus;
