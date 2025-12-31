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

// Khmer holidays and celebrations
const CELEBRATIONS = [
    { name: "Khmer New Year", date: "04-14", icon: "🎊", type: "khmer" },
    { name: "New Year", date: "01-01", icon: "🎆", type: "holiday" },
    { name: "Valentine's Day", date: "02-14", icon: "💕", type: "holiday" },
    { name: "Women's Day", date: "03-08", icon: "👩", type: "holiday" },
    { name: "Labor Day", date: "05-01", icon: "👷", type: "khmer" },
    { name: "King's Birthday", date: "05-14", icon: "👑", type: "khmer" },
    { name: "Water Festival", date: "11-15", icon: "🚣", type: "khmer" },
    { name: "Independence Day", date: "11-09", icon: "🇰🇭", type: "khmer" },
    { name: "Christmas", date: "12-25", icon: "🎄", type: "holiday" },
];

// Calculate days until next occurrence
const getDaysUntil = (monthDay, fromDate = new Date()) => {
    const [month, day] = monthDay.split('-').map(Number);
    const targetDate = new Date(fromDate.getFullYear(), month - 1, day);

    if (targetDate <= fromDate) {
        targetDate.setFullYear(fromDate.getFullYear() + 1);
    }

    const diffTime = targetDate - fromDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get next birthday
const getNextBirthday = (birthDate, name, fromDate = new Date()) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const monthDay = `${String(birth.getMonth() + 1).padStart(2, '0')}-${String(birth.getDate()).padStart(2, '0')}`;
    const daysUntil = getDaysUntil(monthDay, fromDate);

    let nextAge = fromDate.getFullYear() - birth.getFullYear();
    const currentYearBirthday = new Date(fromDate.getFullYear(), birth.getMonth(), birth.getDate());
    if (currentYearBirthday <= fromDate) nextAge += 1;

    return { name: `${name}'s Birthday`, date: monthDay, daysUntil, icon: "🎂", type: "birthday", details: `Turning ${nextAge}` };
};

// Get next anniversary
const getNextAnniversary = (anniversaryDate, fromDate = new Date()) => {
    if (!anniversaryDate) return null;
    const anniv = new Date(anniversaryDate);
    const monthDay = `${String(anniv.getMonth() + 1).padStart(2, '0')}-${String(anniv.getDate()).padStart(2, '0')}`;
    const daysUntil = getDaysUntil(monthDay, fromDate);

    let years = fromDate.getFullYear() - anniv.getFullYear();
    const currentYearAnniv = new Date(fromDate.getFullYear(), anniv.getMonth(), anniv.getDate());
    if (currentYearAnniv <= fromDate) years += 1;

    const suffix = years === 1 ? '1st' : years === 2 ? '2nd' : years === 3 ? '3rd' : `${years}th`;
    return { name: "Anniversary", date: monthDay, daysUntil, icon: "💖", type: "anniversary", details: `${suffix} Anniversary` };
};

const NewYear = ({ nightMode, currentTheme }) => {
    const screen = useResponsive();
    const [settings, setSettings] = useState(null);
    const [upcomingCelebrations, setUpcomingCelebrations] = useState([]);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Get theme colors - Dynamically from currentTheme
    const primaryColor = currentTheme?.colors?.primary || (nightMode ? "#b993ff" : "#db2777");
    const secondaryColor = currentTheme?.colors?.secondary || (nightMode ? "#7f53ff" : "#7c3aed");
    const accentColor = currentTheme?.colors?.accent || (nightMode ? "#bfa7fc" : "#ffb3d6");
    const titleColor = currentTheme?.colors?.titleColor || primaryColor;

    // Create gradient from theme colors for the banner background
    const bannerGradient = nightMode
        ? `linear-gradient(135deg, ${secondaryColor}dd 0%, ${primaryColor}cc 50%, ${secondaryColor}ee 100%)`
        : `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${primaryColor}dd 100%)`;

    // Text colors - white for night mode, dark for light mode with colored accents
    const textColor = nightMode ? "#ffffff" : "#ffffff";
    const subTextColor = nightMode ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.95)";

    // Box background based on theme
    const boxBg = "rgba(255, 255, 255, 0.2)";
    const boxBorder = "rgba(255, 255, 255, 0.35)";

    // Fetch settings for birthdays and anniversary
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_URL}/settings`);
                setSettings(res.data);
            } catch (err) {
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

    // Calculate upcoming celebrations
    useEffect(() => {
        if (!settings) return;

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const allCelebrations = [];

        // Add birthdays
        const b1 = getNextBirthday(settings.person1BirthDate, settings.person1Name || 'Person 1', now);
        const b2 = getNextBirthday(settings.person2BirthDate, settings.person2Name || 'Person 2', now);
        if (b1) allCelebrations.push(b1);
        if (b2) allCelebrations.push(b2);

        // Add anniversary
        const anniv = getNextAnniversary(settings.relationshipDate, now);
        if (anniv) allCelebrations.push(anniv);

        // Add holidays
        CELEBRATIONS.forEach(c => {
            allCelebrations.push({ ...c, daysUntil: getDaysUntil(c.date, now) });
        });

        // Sort and get top 3 (excluding New Year since it's already shown)
        allCelebrations.sort((a, b) => a.daysUntil - b.daysUntil);
        const filtered = allCelebrations.filter(c => c.name !== "New Year").slice(0, 3);
        setUpcomingCelebrations(filtered);
    }, [settings]);

    // New Year countdown
    useEffect(() => {
        const targetDate = new Date("January 1, 2026 00:00:00").getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const s = {
        mobile: {
            minHeight: 400,
            titleSize: "1.8rem",
            countdownSize: "1.3rem",
            labelSize: "0.55rem",
            gap: "8px",
            messageSize: "0.75rem",
            messagePadding: "10px 16px",
            upcomingSize: "0.7rem",
        },
        tablet: {
            minHeight: 440,
            titleSize: "2.5rem",
            countdownSize: "1.8rem",
            labelSize: "0.7rem",
            gap: "14px",
            messageSize: "0.85rem",
            messagePadding: "12px 22px",
            upcomingSize: "0.8rem",
        },
        laptop: {
            minHeight: 480,
            titleSize: "3.5rem",
            countdownSize: "2.5rem",
            labelSize: "0.9rem",
            gap: "25px",
            messageSize: "0.9rem",
            messagePadding: "15px 28px",
            upcomingSize: "0.85rem",
        },
        desktop: {
            minHeight: 520,
            titleSize: "4.5rem",
            countdownSize: "3rem",
            labelSize: "1rem",
            gap: "30px",
            messageSize: "0.9rem",
            messagePadding: "15px 30px",
            upcomingSize: "0.9rem",
        }
    }[screen];

    const TimeUnit = ({ value, label }) => (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: screen === "mobile" ? "10px 8px" : screen === "tablet" ? "12px" : "16px",
            background: boxBg,
            borderRadius: screen === "mobile" ? "12px" : "14px",
            minWidth: screen === "mobile" ? "58px" : screen === "tablet" ? "75px" : "95px",
            border: `1px solid ${boxBorder}`,
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
        }}>
            <span style={{
                fontSize: s.countdownSize,
                fontWeight: "bold",
                color: textColor,
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}>{value.toString().padStart(2, '0')}</span>
            <span style={{
                fontSize: s.labelSize,
                color: subTextColor,
                textTransform: "uppercase",
                letterSpacing: screen === "mobile" ? "0.5px" : "1px",
                marginTop: screen === "mobile" ? "2px" : "4px",
                fontWeight: "600",
            }}>{label}</span>
        </div>
    );

    // Upcoming celebration badge
    const UpcomingBadge = ({ celebration }) => {
        const isToday = celebration.daysUntil === 0;
        const isSoon = celebration.daysUntil <= 7;

        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: screen === "mobile" ? "8px 12px" : "10px 16px",
                background: isToday
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : isSoon
                        ? "linear-gradient(135deg, #f59e0b, #d97706)"
                        : boxBg,
                borderRadius: "30px",
                border: `1px solid ${boxBorder}`,
                backdropFilter: "blur(10px)",
                boxShadow: isToday || isSoon
                    ? "0 4px 20px rgba(0, 0, 0, 0.25)"
                    : "0 2px 10px rgba(0, 0, 0, 0.15)",
                animation: isToday ? "pulseNewYear 1.5s infinite" : "none",
            }}>
                <span style={{ fontSize: screen === "mobile" ? "1.1rem" : "1.3rem" }}>{celebration.icon}</span>
                <div style={{ textAlign: "left" }}>
                    <div style={{
                        fontSize: s.upcomingSize,
                        fontWeight: "700",
                        color: textColor,
                        lineHeight: 1.2,
                        textShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    }}>
                        {celebration.name}
                    </div>
                    <div style={{
                        fontSize: screen === "mobile" ? "0.65rem" : "0.75rem",
                        color: subTextColor,
                        fontWeight: "600",
                    }}>
                        {isToday ? "🎉 TODAY!" : isSoon ? `⏰ ${celebration.daysUntil} days` : `${celebration.daysUntil} days`}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            style={{
                position: "relative",
                minHeight: s.minHeight,
                borderRadius: screen === "mobile" ? "20px" : "30px",
                margin: screen === "mobile" ? "10px auto" : "20px auto",
                maxWidth: 1000,
                width: screen === "mobile" ? "96%" : "95%",
                overflow: "hidden",
                background: bannerGradient,
                boxShadow: `0 25px 50px -12px ${primaryColor}50`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: textColor,
                zIndex: 10,
            }}
        >
            {/* Animated Background Sparkles - themed */}
            <div
                className="sparkles-newyear"
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `radial-gradient(${accentColor}cc, ${accentColor}55 2px, transparent 40px)`,
                    backgroundSize: "80px 80px",
                    animation: "moveSparklesNY 10s linear infinite",
                    opacity: 0.5,
                }}
            />

            <div style={{ position: "relative", zIndex: 2, padding: screen === "mobile" ? "20px 12px" : "30px" }}>
                <div style={{ fontSize: screen === "mobile" ? "1.8rem" : "2.5rem", marginBottom: screen === "mobile" ? "8px" : "12px" }}>🥂✨🎊</div>

                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: s.titleSize,
                    fontWeight: 900,
                    margin: screen === "mobile" ? "0 0 12px" : "0 0 20px",
                    color: textColor,
                    textShadow: `0 4px 20px rgba(0,0,0,0.35), 0 2px 10px ${secondaryColor}80`,
                    lineHeight: 1.2,
                }}>
                    HAPPY NEW YEAR 2026
                </h1>

                <p style={{
                    fontSize: screen === "mobile" ? "0.9rem" : "1.1rem",
                    color: subTextColor,
                    marginBottom: screen === "mobile" ? "18px" : "30px",
                    letterSpacing: screen === "mobile" ? "1px" : "2px",
                    fontWeight: "600",
                    textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}>THE COUNTDOWN BEGINS</p>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: s.gap,
                    flexWrap: "wrap",
                }}>
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <TimeUnit value={timeLeft.minutes} label="Mins" />
                    <TimeUnit value={timeLeft.seconds} label="Secs" />
                </div>

                <div style={{
                    marginTop: screen === "mobile" ? "20px" : "30px",
                    padding: s.messagePadding,
                    background: boxBg,
                    borderRadius: "50px",
                    border: `1px solid ${boxBorder}`,
                    display: "inline-block",
                    maxWidth: screen === "mobile" ? "90%" : "auto",
                    backdropFilter: "blur(10px)",
                }}>
                    <span style={{
                        fontSize: s.messageSize,
                        fontWeight: "600",
                        color: textColor,
                        textShadow: "0 1px 5px rgba(0,0,0,0.25)",
                    }}>
                        ✨ Cheers to a year of health, wealth, and memories ✨
                    </span>
                </div>

                {/* Upcoming Celebrations Section */}
                {upcomingCelebrations.length > 0 && (
                    <div style={{
                        marginTop: screen === "mobile" ? "24px" : "35px",
                        paddingTop: screen === "mobile" ? "18px" : "24px",
                        borderTop: `1px solid ${boxBorder}`,
                    }}>
                        <div style={{
                            fontSize: screen === "mobile" ? "0.8rem" : "0.9rem",
                            color: subTextColor,
                            marginBottom: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            fontWeight: "600",
                            textShadow: "0 1px 5px rgba(0,0,0,0.25)",
                        }}>
                            <span>📅</span>
                            <span>Coming Up Next</span>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: screen === "mobile" ? "8px" : "14px",
                            flexWrap: "wrap",
                        }}>
                            {upcomingCelebrations.map((celebration, idx) => (
                                <UpcomingBadge key={idx} celebration={celebration} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Quicksand:wght@400;600&display=swap');
                
                @keyframes moveSparklesNY {
                    from { background-position: 0 0; }
                    to { background-position: 80px 80px; }
                }

                @keyframes pulseNewYear {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
                    50% { transform: scale(1.03); box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); }
                }
            `}</style>
        </div>
    );
};

export default NewYear;
