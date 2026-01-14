import { useState, useEffect } from 'react';
import axios from 'axios';
import { theme, API_URL } from '../../config';

const { colors, shadows, spacing } = theme;

const AnalyticsTab = ({ isMobile }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('all');
    const [selectedPage, setSelectedPage] = useState('all');

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const params = {};

            // Set date range
            if (dateRange !== 'all') {
                const end = new Date();
                const start = new Date();

                switch (dateRange) {
                    case 'today':
                        start.setHours(0, 0, 0, 0);
                        break;
                    case 'week':
                        start.setDate(start.getDate() - 7);
                        break;
                    case 'month':
                        start.setDate(start.getDate() - 30);
                        break;
                }

                params.startDate = start.toISOString();
                params.endDate = end.toISOString();
            }

            if (selectedPage !== 'all') {
                params.page = selectedPage;
            }

            const res = await axios.get(`${API_URL}/track/analytics`, { params });
            setAnalytics(res.data.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange, selectedPage]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: spacing.xxxl }}>
                <div style={{ fontSize: 48, marginBottom: spacing.md }}>📊</div>
                <p style={{ color: colors.textSecondary }}>Loading analytics...</p>
            </div>
        );
    }

    const pages = analytics?.visitsByPage?.map(p => p._id) || [];
    const maxVisits = Math.max(...(analytics?.visitsByDate?.map(d => d.count) || [1]), 1);

    return (
        <div>
            {/* Header with filters */}
            <div style={{
                marginBottom: spacing.xl,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: spacing.md,
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{
                        fontSize: isMobile ? 24 : 32,
                        fontWeight: 700,
                        color: colors.textPrimary,
                        marginBottom: spacing.sm
                    }}>
                        📊 Website Analytics
                    </h2>
                    <p style={{ color: colors.textSecondary }}>Track visitor insights and trends</p>
                </div>

                <div style={{
                    display: 'flex',
                    gap: spacing.md,
                    flexDirection: isMobile ? 'column' : 'row',
                    width: isMobile ? '100%' : 'auto'
                }}>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{
                            padding: `${spacing.sm}px ${spacing.md}px`,
                            borderRadius: 12,
                            border: `2px solid ${colors.border}`,
                            background: colors.white,
                            color: colors.textPrimary,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: shadows.sm,
                            minWidth: isMobile ? '100%' : 150
                        }}
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                    </select>

                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        style={{
                            padding: `${spacing.sm}px ${spacing.md}px`,
                            borderRadius: 12,
                            border: `2px solid ${colors.border}`,
                            background: colors.white,
                            color: colors.textPrimary,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: shadows.sm,
                            minWidth: isMobile ? '100%' : 150
                        }}
                    >
                        <option value="all">All Pages</option>
                        {pages.map(page => (
                            <option key={page} value={page}>{page || 'Home'}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: spacing.lg,
                marginBottom: spacing.xl
            }}>
                <StatsCard
                    icon="👥"
                    title="Total Visits"
                    value={analytics?.totalVisits || 0}
                    color="#6366f1"
                />
                <StatsCard
                    icon="🌟"
                    title="Unique Visitors"
                    value={analytics?.uniqueVisitors || 0}
                    color="#ec4899"
                />
                <StatsCard
                    icon="📄"
                    title="Pages Tracked"
                    value={analytics?.visitsByPage?.length || 0}
                    color="#8b5cf6"
                />
                <StatsCard
                    icon="📈"
                    title="Avg. Daily Views"
                    value={Math.round((analytics?.totalVisits || 0) / 30)}
                    color="#14b8a6"
                />
            </div>

            {/* Visits by Date Chart */}
            <div style={{
                background: colors.white,
                borderRadius: 20,
                padding: isMobile ? spacing.lg : spacing.xl,
                boxShadow: shadows.md,
                marginBottom: spacing.xl
            }}>
                <h3 style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    marginBottom: spacing.lg,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm
                }}>
                    📈 Visitor Trend (Last 30 Days)
                </h3>

                {analytics?.visitsByDate?.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: spacing.sm,
                        height: 200,
                        padding: `${spacing.md}px 0`,
                        overflowX: 'auto'
                    }}>
                        {analytics.visitsByDate.map((day, idx) => {
                            const height = (day.count / maxVisits) * 160;
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        flex: '1 0 auto',
                                        minWidth: isMobile ? 20 : 30,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: spacing.xs
                                    }}
                                >
                                    <div style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: colors.textPrimary,
                                        marginBottom: spacing.xs
                                    }}>
                                        {day.count}
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: height || 5,
                                        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                                        borderRadius: 8,
                                        transition: 'all 0.3s ease',
                                        boxShadow: shadows.sm
                                    }} />
                                    <div style={{
                                        fontSize: 9,
                                        color: colors.textSecondary,
                                        transform: 'rotate(-45deg)',
                                        marginTop: spacing.xs,
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p style={{ color: colors.textSecondary, textAlign: 'center', padding: spacing.xl }}>
                        No data available for this period
                    </p>
                )}
            </div>

            {/* Visits by Page */}
            <div style={{
                background: colors.white,
                borderRadius: 20,
                padding: isMobile ? spacing.lg : spacing.xl,
                boxShadow: shadows.md,
                marginBottom: spacing.xl
            }}>
                <h3 style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    marginBottom: spacing.lg,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm
                }}>
                    📄 Popular Pages
                </h3>

                {analytics?.visitsByPage?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                        {analytics.visitsByPage.map((page, idx) => {
                            const percentage = (page.count / analytics.totalVisits) * 100;
                            return (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.md
                                }}>
                                    <div style={{
                                        minWidth: isMobile ? 100 : 150,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: colors.textPrimary
                                    }}>
                                        {page._id || 'Home'}
                                    </div>
                                    <div style={{ flex: 1, position: 'relative', height: 36 }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            height: '100%',
                                            width: `${percentage}%`,
                                            background: `linear-gradient(90deg, #667eea 0%, #764ba2 100%)`,
                                            borderRadius: 10,
                                            transition: 'width 0.5s ease',
                                            boxShadow: shadows.sm
                                        }} />
                                        <div style={{
                                            position: 'absolute',
                                            left: spacing.md,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: colors.white,
                                            zIndex: 1
                                        }}>
                                            {page.count} visits ({percentage.toFixed(1)}%)
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p style={{ color: colors.textSecondary, textAlign: 'center', padding: spacing.xl }}>
                        No page visits recorded yet
                    </p>
                )}
            </div>

            {/* Recent Visits */}
            <div style={{
                background: colors.white,
                borderRadius: 20,
                padding: isMobile ? spacing.lg : spacing.xl,
                boxShadow: shadows.md
            }}>
                <h3 style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    marginBottom: spacing.lg,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm
                }}>
                    🕐 Recent Visits
                </h3>

                {analytics?.recentVisits?.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.sm,
                        maxHeight: 400,
                        overflowY: 'auto'
                    }}>
                        {analytics.recentVisits.map((visit, idx) => (
                            <div key={idx} style={{
                                padding: spacing.md,
                                background: colors.light,
                                borderRadius: 12,
                                display: isMobile ? 'block' : 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: spacing.md
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: colors.textPrimary,
                                        marginBottom: 4
                                    }}>
                                        {visit.page || 'Home'}
                                    </div>
                                    <div style={{
                                        fontSize: 12,
                                        color: colors.textSecondary
                                    }}>
                                        {visit.ip}
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: 12,
                                    color: colors.textSecondary,
                                    marginTop: isMobile ? spacing.sm : 0
                                }}>
                                    {new Date(visit.visitedAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: colors.textSecondary, textAlign: 'center', padding: spacing.xl }}>
                        No recent visits
                    </p>
                )}
            </div>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ icon, title, value, color }) => (
    <div style={{
        background: colors.white,
        borderRadius: 20,
        padding: spacing.xl,
        boxShadow: shadows.md,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.lg,
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    }}>
        <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32
        }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: colors.textSecondary,
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {title}
            </div>
            <div style={{
                fontSize: 32,
                fontWeight: 800,
                color: colors.textPrimary,
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                {value.toLocaleString()}
            </div>
        </div>
    </div>
);

export default AnalyticsTab;
