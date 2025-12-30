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
            minHeight: 380,
            titleSize: "2.2rem",
            countdownSize: "1.5rem",
            labelSize: "0.6rem",
            gap: "10px",
        },
        tablet: {
            minHeight: 400,
            titleSize: "3rem",
            countdownSize: "2rem",
            labelSize: "0.8rem",
            gap: "20px",
        },
        desktop: {
            minHeight: 450,
            titleSize: "4.5rem",
            countdownSize: "3rem",
            labelSize: "1rem",
            gap: "30px",
        }
    }[screen === "mobile" ? "mobile" : screen === "tablet" ? "tablet" : "desktop"];

    const TimeUnit = ({ value, label }) => (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: screen === "mobile" ? "10px" : "15px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            minWidth: screen === "mobile" ? "65px" : "90px",
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
                letterSpacing: "1px",
                marginTop: "4px",
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

            <div style={{ position: "relative", zIndex: 2, padding: screen === "mobile" ? "15px" : "20px" }}>
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🥂✨🎊</div>

                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: s.titleSize,
                    fontWeight: 900,
                    margin: "0 0 20px",
                    background: "linear-gradient(to bottom, #fff, #ddd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 10px 20px rgba(0,0,0,0.3)",
                }}>
                    HAPPY NEW YEAR 2026
                </h1>

                <p style={{
                    fontSize: "1.1rem",
                    opacity: 0.9,
                    marginBottom: "30px",
                    letterSpacing: "2px",
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
                    marginTop: "40px",
                    padding: "15px 30px",
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "50px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    display: "inline-block",
                }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
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
