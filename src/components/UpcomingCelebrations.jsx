import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Hook for responsive sizing
const useResponsive = () => {
    const [screen, setScreen] = useState("desktop");

    useEffect(() => {
        const checkSize = () => {
            const width = window.innerWidth;
            if (width < 480) setScreen("mobile");
            else if (width < 768) setScreen("tablet");
            else if (width < 1024) setScreen("laptop");
            else setScreen("desktop");
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    return screen;
};

// Khmer holidays and celebrations (fixed dates)
const KHMER_HOLIDAYS = [
    { name: "Khmer New Year", date: "04-14", icon: "🎊", type: "khmer", duration: 3 },
    { name: "International New Year", date: "01-01", icon: "🎆", type: "holiday" },
    { name: "Valentine's Day", date: "02-14", icon: "💕", type: "holiday" },
    { name: "International Women's Day", date: "03-08", icon: "👩", type: "holiday" },
    { name: "Khmer Labor Day", date: "05-01", icon: "👷", type: "khmer" },
    { name: "King's Birthday", date: "05-14", icon: "👑", type: "khmer" },
    { name: "Constitution Day", date: "09-24", icon: "📜", type: "khmer" },
    { name: "Independence Day", date: "11-09", icon: "🇰🇭", type: "khmer" },
    { name: "Water Festival", date: "11-15", icon: "🚣", type: "khmer", approx: true },
    { name: "Christmas", date: "12-25", icon: "🎄", type: "holiday" },
];

// Calculate days until next occurrence
const getDaysUntil = (monthDay, fromDate = new Date()) => {
    const [month, day] = monthDay.split('-').map(Number);
    const targetDate = new Date(fromDate.getFullYear(), month - 1, day);

    // If the date has passed this year, calculate for next year
    if (targetDate <= fromDate) {
        targetDate.setFullYear(fromDate.getFullYear() + 1);
    }

    const diffTime = targetDate - fromDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Calculate next birthday
const getNextBirthday = (birthDate, name, fromDate = new Date()) => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const monthDay = `${String(birth.getMonth() + 1).padStart(2, '0')}-${String(birth.getDate()).padStart(2, '0')}`;
    const daysUntil = getDaysUntil(monthDay, fromDate);

    // Calculate age they will turn
    let nextAge = fromDate.getFullYear() - birth.getFullYear();
    const currentYearBirthday = new Date(fromDate.getFullYear(), birth.getMonth(), birth.getDate());
    if (currentYearBirthday <= fromDate) {
        nextAge += 1;
    }

    return {
        name: `${name}'s Birthday`,
        date: monthDay,
        daysUntil,
        icon: "🎂",
        type: "birthday",
        details: `Turning ${nextAge}`,
        isToday: daysUntil === 0,
    };
};

// Calculate next anniversary
const getNextAnniversary = (anniversaryDate, fromDate = new Date()) => {
    if (!anniversaryDate) return null;

    const anniv = new Date(anniversaryDate);
    const monthDay = `${String(anniv.getMonth() + 1).padStart(2, '0')}-${String(anniv.getDate()).padStart(2, '0')}`;
    const daysUntil = getDaysUntil(monthDay, fromDate);

    // Calculate which anniversary it will be
    let years = fromDate.getFullYear() - anniv.getFullYear();
    const currentYearAnniv = new Date(fromDate.getFullYear(), anniv.getMonth(), anniv.getDate());
    if (currentYearAnniv <= fromDate) {
        years += 1;
    }

    return {
        name: "Anniversary",
        date: monthDay,
        daysUntil,
        icon: "💖",
        type: "anniversary",
        details: `${years === 1 ? '1st' : years === 2 ? '2nd' : years === 3 ? '3rd' : `${years}th`} Anniversary`,
        isToday: daysUntil === 0,
    };
};

// Calculate time components from days
const getTimeFromDays = (totalDays) => {
    const now = new Date();
    const targetDate = new Date(now.getTime() + (totalDays * 24 * 60 * 60 * 1000));
    targetDate.setHours(0, 0, 0, 0);

    const diff = targetDate - now;

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
};

const UpcomingCelebrations = ({ nightMode, currentTheme }) => {
    const screen = useResponsive();
    const [settings, setSettings] = useState(null);
    const [celebrations, setCelebrations] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState("upcoming");

    // Get theme colors
    const primaryColor = currentTheme?.colors?.primary || (nightMode ? "#b993ff" : "#ec4899");
    const accentColor = currentTheme?.colors?.accent || (nightMode ? "#7f53ff" : "#8b5cf6");
    const bgGradient = currentTheme?.colors?.background || (nightMode
        ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
        : "linear-gradient(135deg, #fdf2f8 0%, #f5f3ff 100%)");
    const cardBg = nightMode ? "rgba(30, 27, 75, 0.8)" : "rgba(255, 255, 255, 0.9)";
    const textColor = nightMode ? "#e0e0ff" : "#374151";
    const subTextColor = nightMode ? "#a0a0d0" : "#6b7280";

    // Fetch settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_URL}/settings`);
                setSettings(res.data);
            } catch (err) {
                console.log("Using default settings");
                setSettings({
                    person1Name: 'Rith',
                    person1BirthDate: '2005-03-15',
                    person2Name: 'Chanry',
                    person2BirthDate: '2006-04-01',
                    relationshipDate: '2025-05-13',
                });
            }
        };
        fetchSettings();
    }, []);

    // Update countdown every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Calculate all celebrations
    useEffect(() => {
        if (!settings) return;

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const allCelebrations = [];

        // Add birthdays
        const birthday1 = getNextBirthday(settings.person1BirthDate, settings.person1Name || 'Person 1', now);
        const birthday2 = getNextBirthday(settings.person2BirthDate, settings.person2Name || 'Person 2', now);
        if (birthday1) allCelebrations.push(birthday1);
        if (birthday2) allCelebrations.push(birthday2);

        // Add anniversary
        const anniversary = getNextAnniversary(settings.relationshipDate, now);
        if (anniversary) allCelebrations.push(anniversary);

        // Add holidays
        KHMER_HOLIDAYS.forEach(holiday => {
            const daysUntil = getDaysUntil(holiday.date, now);
            allCelebrations.push({
                ...holiday,
                daysUntil,
                isToday: daysUntil === 0,
            });
        });

        // Sort by days until
        allCelebrations.sort((a, b) => a.daysUntil - b.daysUntil);
        setCelebrations(allCelebrations);
    }, [settings]);

    // Responsive sizes
    const s = {
        mobile: {
            padding: "10px",
            titleSize: "1.1rem",
            cardPadding: "8px",
            iconSize: "1.5rem",
            nameSize: "0.8rem",
            daysSize: "1.4rem",
            detailSize: "0.65rem",
            gap: "6px",
            countdownSize: "0.75rem",
            countdownLabelSize: "0.45rem",
        },
        tablet: {
            padding: "20px",
            titleSize: "1.6rem",
            cardPadding: "16px",
            iconSize: "2.5rem",
            nameSize: "1rem",
            daysSize: "2.2rem",
            detailSize: "0.8rem",
            gap: "14px",
            countdownSize: "1.1rem",
            countdownLabelSize: "0.55rem",
        },
        laptop: {
            padding: "24px",
            titleSize: "1.8rem",
            cardPadding: "20px",
            iconSize: "3rem",
            nameSize: "1.1rem",
            daysSize: "2.5rem",
            detailSize: "0.85rem",
            gap: "18px",
            countdownSize: "1.3rem",
            countdownLabelSize: "0.6rem",
        },
        desktop: {
            padding: "30px",
            titleSize: "2rem",
            cardPadding: "24px",
            iconSize: "3.5rem",
            nameSize: "1.2rem",
            daysSize: "3rem",
            detailSize: "0.9rem",
            gap: "20px",
            countdownSize: "1.5rem",
            countdownLabelSize: "0.65rem",
        }
    }[screen];

    // Get the nearest celebration for featured display
    const nearestCelebration = celebrations[0];
    const nearestTime = nearestCelebration ? getTimeFromDays(nearestCelebration.daysUntil) : null;

    // Filter celebrations by tab
    const filteredCelebrations = celebrations.filter(c => {
        if (activeTab === "upcoming") return c.daysUntil <= 30;
        if (activeTab === "birthdays") return c.type === "birthday";
        if (activeTab === "anniversary") return c.type === "anniversary";
        if (activeTab === "holidays") return c.type === "holiday" || c.type === "khmer";
        return true;
    });

    // Time unit component
    const TimeUnit = ({ value, label }) => (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: screen === "mobile" ? "4px 6px" : "10px 14px",
            background: `${primaryColor}25`,
            borderRadius: screen === "mobile" ? "6px" : "10px",
            minWidth: screen === "mobile" ? "36px" : "60px",
            border: `1px solid ${primaryColor}40`,
        }}>
            <span style={{
                fontSize: s.countdownSize,
                fontWeight: "bold",
                color: primaryColor,
            }}>{String(value).padStart(2, '0')}</span>
            <span style={{
                fontSize: s.countdownLabelSize,
                color: subTextColor,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
            }}>{label}</span>
        </div>
    );

    // Celebration card component
    const CelebrationCard = ({ celebration, index, isFeatured }) => {
        const typeColors = {
            birthday: "#ec4899",
            anniversary: "#ef4444",
            holiday: "#10b981",
            khmer: "#f59e0b",
        };
        const typeColor = typeColors[celebration.type] || primaryColor;

        return (
            <div
                style={{
                    background: isFeatured
                        ? `linear-gradient(135deg, ${typeColor}15 0%, ${typeColor}25 100%)`
                        : cardBg,
                    borderRadius: screen === "mobile" ? (isFeatured ? "12px" : "10px") : (isFeatured ? "20px" : "16px"),
                    padding: screen === "mobile" ? (isFeatured ? "10px" : "8px 10px") : (isFeatured ? s.cardPadding : "12px 16px"),
                    border: `1px solid ${typeColor}40`,
                    display: "flex",
                    alignItems: isFeatured ? "center" : "center",
                    flexDirection: isFeatured ? "column" : "row",
                    gap: screen === "mobile" ? (isFeatured ? "8px" : "8px") : (isFeatured ? "16px" : "12px"),
                    boxShadow: isFeatured
                        ? `0 10px 20px -5px ${typeColor}30`
                        : `0 2px 8px -2px ${typeColor}20`,
                    transform: isFeatured ? "scale(1)" : "scale(1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 12px 30px -5px ${typeColor}40`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = isFeatured
                        ? `0 20px 40px -10px ${typeColor}30`
                        : `0 4px 15px -3px ${typeColor}20`;
                }}
            >
                {/* Today/Soon Badge */}
                {celebration.isToday && (
                    <div style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: `linear-gradient(135deg, ${typeColor}, ${typeColor}cc)`,
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        animation: "pulse 1.5s infinite",
                    }}>
                        🎉 TODAY!
                    </div>
                )}

                {celebration.daysUntil <= 7 && !celebration.isToday && (
                    <div style={{
                        position: "absolute",
                        top: isFeatured ? "10px" : "50%",
                        right: "10px",
                        transform: isFeatured ? "none" : "translateY(-50%)",
                        background: `linear-gradient(135deg, ${typeColor}ee, ${typeColor}aa)`,
                        color: "#fff",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "0.65rem",
                        fontWeight: "600",
                    }}>
                        ⏰ Soon!
                    </div>
                )}

                {/* Icon */}
                <div style={{
                    fontSize: screen === "mobile" ? (isFeatured ? "1.5rem" : "1.4rem") : (isFeatured ? s.iconSize : "1.8rem"),
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}>
                    {celebration.icon}
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    textAlign: isFeatured ? "center" : "left",
                    minWidth: 0,
                }}>
                    <div style={{
                        fontSize: isFeatured ? s.nameSize : "0.95rem",
                        fontWeight: "600",
                        color: textColor,
                        marginBottom: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                        {celebration.name}
                    </div>

                    {celebration.details && (
                        <div style={{
                            fontSize: s.detailSize,
                            color: subTextColor,
                            marginBottom: isFeatured ? "12px" : "0",
                        }}>
                            {celebration.details}
                        </div>
                    )}

                    {/* Featured countdown */}
                    {isFeatured && nearestTime && !celebration.isToday && (
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: screen === "mobile" ? "4px" : "8px",
                            marginTop: screen === "mobile" ? "6px" : "12px",
                            flexWrap: "wrap",
                        }}>
                            <TimeUnit value={nearestTime.days} label="Days" />
                            <TimeUnit value={nearestTime.hours} label="Hrs" />
                            <TimeUnit value={nearestTime.minutes} label="Min" />
                            <TimeUnit value={nearestTime.seconds} label="Sec" />
                        </div>
                    )}
                </div>

                {/* Days until (for non-featured cards) */}
                {!isFeatured && !celebration.isToday && (
                    <div style={{
                        textAlign: "right",
                        minWidth: screen === "mobile" ? "50px" : "70px",
                    }}>
                        <div style={{
                            fontSize: screen === "mobile" ? "1.1rem" : "1.4rem",
                            fontWeight: "bold",
                            color: typeColor,
                            lineHeight: 1,
                        }}>
                            {celebration.daysUntil}
                        </div>
                        <div style={{
                            fontSize: screen === "mobile" ? "0.55rem" : "0.65rem",
                            color: subTextColor,
                            textTransform: "uppercase",
                        }}>
                            days
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Tab button component
    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                padding: screen === "mobile" ? "8px 12px" : "10px 18px",
                borderRadius: "25px",
                border: "none",
                background: activeTab === id
                    ? `linear-gradient(135deg, ${primaryColor}, ${accentColor})`
                    : `${primaryColor}15`,
                color: activeTab === id ? "#fff" : textColor,
                fontSize: screen === "mobile" ? "0.75rem" : "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
            }}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </button>
    );

    if (!settings) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <span style={{ fontSize: 40 }}>📅</span>
                <p>Loading celebrations...</p>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: "1000px",
            margin: screen === "mobile" ? "6px auto" : "20px auto",
            padding: s.padding,
            width: screen === "mobile" ? "96%" : "95%",
            borderRadius: screen === "mobile" ? "14px" : "30px",
            background: bgGradient,
            boxShadow: `0 15px 30px -8px ${primaryColor}25`,
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Decorative elements */}
            <div style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${primaryColor}20, transparent 70%)`,
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute",
                bottom: "-30px",
                left: "-30px",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${accentColor}15, transparent 70%)`,
                pointerEvents: "none",
            }} />

            {/* Header */}
            <div style={{
                textAlign: "center",
                marginBottom: screen === "mobile" ? "10px" : "20px",
                position: "relative",
                zIndex: 1,
            }}>
                <h2 style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: s.titleSize,
                    fontWeight: 700,
                    color: textColor,
                    margin: "0 0 4px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: screen === "mobile" ? "4px" : "8px",
                }}>
                    <span>🎉</span>
                    Upcoming Celebrations
                    <span>🎊</span>
                </h2>
                <p style={{
                    color: subTextColor,
                    fontSize: screen === "mobile" ? "0.7rem" : "0.9rem",
                    margin: 0,
                }}>
                    Never miss a special moment!
                </p>
            </div>

            {/* Tabs */}
            <div style={{
                display: "flex",
                gap: screen === "mobile" ? "4px" : "8px",
                marginBottom: screen === "mobile" ? "10px" : "20px",
                overflowX: "auto",
                paddingBottom: "6px",
                justifyContent: screen === "mobile" ? "flex-start" : "center",
            }}>
                <TabButton id="upcoming" label="Upcoming" icon="📅" />
                <TabButton id="anniversary" label="💖" icon="" />
                <TabButton id="birthdays" label="Birthdays" icon="🎂" />
                <TabButton id="holidays" label="Holidays" icon="🎊" />
            </div>

            {/* Featured nearest celebration */}
            {nearestCelebration && activeTab === "upcoming" && (
                <div style={{ marginBottom: screen === "mobile" ? "10px" : "20px" }}>
                    <div style={{
                        fontSize: screen === "mobile" ? "0.7rem" : "0.8rem",
                        color: subTextColor,
                        marginBottom: screen === "mobile" ? "6px" : "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }}>
                        <span>⭐</span>
                        <span>Coming Up Next</span>
                    </div>
                    <CelebrationCard celebration={nearestCelebration} index={0} isFeatured={true} />
                </div>
            )}

            {/* Celebrations list */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: s.gap,
            }}>
                {activeTab === "upcoming" && (
                    <div style={{
                        fontSize: "0.8rem",
                        color: subTextColor,
                        marginBottom: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}>
                        <span>📋</span>
                        <span>Within 30 days</span>
                    </div>
                )}

                {(activeTab === "upcoming" ? filteredCelebrations.slice(1) : filteredCelebrations).map((celebration, index) => (
                    <CelebrationCard
                        key={`${celebration.name}-${celebration.date}`}
                        celebration={celebration}
                        index={index}
                        isFeatured={false}
                    />
                ))}

                {filteredCelebrations.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color: subTextColor,
                    }}>
                        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📭</div>
                        <p>No celebrations in this category</p>
                    </div>
                )}

                {activeTab === "upcoming" && filteredCelebrations.length <= 1 && celebrations.length > 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "20px",
                        color: subTextColor,
                        fontSize: "0.85rem",
                    }}>
                        <p>No other celebrations within 30 days.</p>
                        <button
                            onClick={() => setActiveTab("all")}
                            style={{
                                marginTop: "10px",
                                padding: "8px 20px",
                                borderRadius: "20px",
                                border: `1px solid ${primaryColor}50`,
                                background: "transparent",
                                color: primaryColor,
                                cursor: "pointer",
                                fontWeight: "600",
                            }}
                        >
                            View All Celebrations →
                        </button>
                    </div>
                )}
            </div>

            {/* Pulse animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');
            `}</style>
        </div>
    );
};

export default UpcomingCelebrations;
