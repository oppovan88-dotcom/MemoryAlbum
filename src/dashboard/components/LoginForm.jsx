import { useState } from 'react';
import axios from 'axios';
import { theme, appConfig, API_URL } from '../config';

const { colors, gradients, radius, spacing, fontSize, fontWeight, shadows } = theme;
const { name, shortName, description } = appConfig;

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

    const inputStyle = {
        width: '100%',
        padding: `${spacing.lg - 2}px ${spacing.lg}px`,
        borderRadius: radius.lg,
        border: `2px solid ${colors.border}`,
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: `border-color ${theme.transitions.normal}`,
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: gradients.sidebar,
            padding: spacing.xl,
        }}>
            <div style={{
                background: colors.white,
                borderRadius: radius.round,
                padding: `${spacing.xxxl}px ${spacing.xxl}px`,
                width: '100%',
                maxWidth: 400,
                boxShadow: shadows.lg,
            }}>
                <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: radius.xxl,
                        background: gradients.primary,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        color: colors.textWhite,
                        fontWeight: fontWeight.bold,
                        marginBottom: spacing.lg,
                    }}>{shortName}</div>
                    <h1 style={{
                        fontSize: fontSize.display,
                        fontWeight: fontWeight.bold,
                        color: colors.textPrimary,
                        margin: '0 0 4px',
                    }}>{name}</h1>
                    <p style={{ color: colors.textSecondary, fontSize: fontSize.md, margin: 0 }}>{description}</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        color: colors.danger,
                        padding: spacing.md,
                        borderRadius: radius.lg,
                        marginBottom: spacing.xl,
                        fontSize: fontSize.md,
                    }}>❌ {error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: spacing.xl }}>
                        <label style={{
                            display: 'block',
                            marginBottom: spacing.sm,
                            fontWeight: fontWeight.semibold,
                            color: colors.textPrimary,
                            fontSize: fontSize.md,
                        }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@memoryalbum.com"
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: spacing.xxl }}>
                        <label style={{
                            display: 'block',
                            marginBottom: spacing.sm,
                            fontWeight: fontWeight.semibold,
                            color: colors.textPrimary,
                            fontSize: fontSize.md,
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={inputStyle}
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{
                        width: '100%',
                        padding: spacing.lg,
                        borderRadius: radius.lg,
                        border: 'none',
                        background: gradients.primary,
                        color: colors.textWhite,
                        fontSize: fontSize.xl,
                        fontWeight: fontWeight.semibold,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                    }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
