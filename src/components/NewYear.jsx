import { useEffect, useState } from "react";

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

// Firework particle component
const Firework = ({ delay, color, left, top }) => (
    <div
        className="firework"
        style={{
            position: "absolute",
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            color: color,
        }}
    />
);

const NewYear = ({ nightMode }) => {
    const screen = useResponsive();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

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
            minHeight: 340,
            titleSize: "1.8rem",
            countdownSize: "1.3rem",
            labelSize: "0.55rem",
            gap: "8px",
            messageSize: "0.75rem",
            messagePadding: "10px 16px",
        },
        tablet: {
            minHeight: 380,
            titleSize: "2.5rem",
            countdownSize: "1.8rem",
            labelSize: "0.7rem",
            gap: "14px",
            messageSize: "0.85rem",
            messagePadding: "12px 22px",
        },
        laptop: {
            minHeight: 420,
            titleSize: "3.5rem",
            countdownSize: "2.5rem",
            labelSize: "0.9rem",
            gap: "25px",
            messageSize: "0.9rem",
            messagePadding: "15px 28px",
        },
        desktop: {
            minHeight: 450,
            titleSize: "4.5rem",
            countdownSize: "3rem",
            labelSize: "1rem",
            gap: "30px",
            messageSize: "0.9rem",
            messagePadding: "15px 30px",
        }
    }[screen];

    const TimeUnit = ({ value, label }) => (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: screen === "mobile" ? "8px 6px" : screen === "tablet" ? "10px" : "15px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: screen === "mobile" ? "10px" : "12px",
            minWidth: screen === "mobile" ? "55px" : screen === "tablet" ? "70px" : "90px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(5px)",
        }}>
            <span style={{
                fontSize: s.countdownSize,
                fontWeight: "bold",
                color: "#fff",
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
            }}>{value.toString().padStart(2, '0')}</span>
            <span style={{
                fontSize: s.labelSize,
                color: "rgba(255,255,255,0.8)",
                textTransform: "uppercase",
                letterSpacing: screen === "mobile" ? "0.5px" : "1px",
                marginTop: screen === "mobile" ? "2px" : "4px",
            }}>{label}</span>
        </div>
    );

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
                background: nightMode
                    ? "linear-gradient(135deg, #020617 0%, #1e1b4b 100%)"
                    : "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#fff",
                zIndex: 10,
            }}
        >
            {/* Animated Background Sparkles */}
            <div className="sparkles" />

            <div style={{ position: "relative", zIndex: 2, padding: screen === "mobile" ? "12px 8px" : "20px" }}>
                <div style={{ fontSize: screen === "mobile" ? "1.5rem" : "2rem", marginBottom: screen === "mobile" ? "6px" : "10px" }}>🥂✨🎊</div>

                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: s.titleSize,
                    fontWeight: 900,
                    margin: screen === "mobile" ? "0 0 12px" : "0 0 20px",
                    background: "linear-gradient(to bottom, #fff, #ddd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 10px 20px rgba(0,0,0,0.3)",
                    lineHeight: 1.2,
                }}>
                    HAPPY NEW YEAR 2026
                </h1>

                <p style={{
                    fontSize: screen === "mobile" ? "0.85rem" : "1.1rem",
                    opacity: 0.9,
                    marginBottom: screen === "mobile" ? "16px" : "30px",
                    letterSpacing: screen === "mobile" ? "1px" : "2px",
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
                    marginTop: screen === "mobile" ? "20px" : "40px",
                    padding: s.messagePadding,
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "50px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    display: "inline-block",
                    maxWidth: screen === "mobile" ? "90%" : "auto",
                }}>
                    <span style={{ fontSize: s.messageSize, fontWeight: "600" }}>
                        ✨ Cheers to a year of health, wealth, and memories ✨
                    </span>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Quicksand:wght@400;600&display=swap');
                
                .sparkles {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px);
                    background-size: 100px 100px;
                    animation: moveSparkles 8s linear infinite;
                    opacity: 0.3;
                }

                @keyframes moveSparkles {
                    from { background-position: 0 0; }
                    to { background-position: 100px 100px; }
                }

                @keyframes firework {
                    0% { transform: scale(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default NewYear;
