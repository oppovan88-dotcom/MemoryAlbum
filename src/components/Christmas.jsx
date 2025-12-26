import { useEffect, useState } from "react";

// Generate random snowflake styles
const createSnowflake = (id) => ({
    id,
    left: Math.random() * 100,
    size: 4 + Math.random() * 12,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 8,
    opacity: 0.4 + Math.random() * 0.6,
});

// Snowflake Component
const Snowflake = ({ flake }) => (
    <div
        style={{
            position: "absolute",
            left: `${flake.left}%`,
            top: "-20px",
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
            pointerEvents: "none",
            filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
            zIndex: 10,
        }}
    >
        ❄
    </div>
);

// Christmas Light Bulb - Responsive
const LightBulb = ({ color, delay, size }) => (
    <div
        style={{
            width: size,
            height: size * 1.4,
            background: color,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            boxShadow: `0 0 ${size * 0.75}px ${size * 0.25}px ${color}, 0 0 ${size * 1.5}px ${size * 0.5}px ${color}50`,
            animation: `twinkle 1.5s ease-in-out ${delay}s infinite alternate`,
            position: "relative",
            marginTop: size * 0.5,
            flexShrink: 0,
        }}
    >
        {/* Wire connector */}
        <div
            style={{
                position: "absolute",
                top: -size * 0.5,
                left: "50%",
                transform: "translateX(-50%)",
                width: size * 0.25,
                height: size * 0.5,
                background: "#4a4a4a",
                borderRadius: "2px 2px 0 0",
            }}
        />
    </div>
);

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

// Christmas Lights String - Responsive
const ChristmasLights = ({ screen }) => {
    const colors = ["#ff0000", "#00ff00", "#ffd700", "#00bfff", "#ff69b4", "#ff8c00"];

    // Adjust number of lights based on screen size
    const lightCount = screen === "mobile" ? 10 : screen === "tablet" ? 14 : screen === "laptop" ? 18 : 22;
    const bulbSize = screen === "mobile" ? 10 : screen === "tablet" ? 12 : screen === "laptop" ? 14 : 16;

    const lights = Array.from({ length: lightCount }, (_, i) => ({
        color: colors[i % colors.length],
        delay: i * 0.12,
    }));

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "flex-start",
                padding: "0 5px",
                zIndex: 5,
            }}
        >
            {/* Wire */}
            <div
                style={{
                    position: "absolute",
                    top: bulbSize * 0.5,
                    left: 0,
                    right: 0,
                    height: screen === "mobile" ? 2 : 3,
                    background: "linear-gradient(90deg, #2d2d2d 0%, #4a4a4a 50%, #2d2d2d 100%)",
                    borderRadius: 2,
                }}
            />
            {lights.map((light, i) => (
                <LightBulb key={i} color={light.color} delay={light.delay} size={bulbSize} />
            ))}
        </div>
    );
};

// Main Christmas Component
const Christmas = ({ nightMode }) => {
    const [snowflakes, setSnowflakes] = useState([]);
    const screen = useResponsive();

    useEffect(() => {
        // Fewer snowflakes on mobile for performance
        const count = screen === "mobile" ? 30 : screen === "tablet" ? 40 : 50;
        const flakes = Array.from({ length: count }, (_, i) => createSnowflake(i));
        setSnowflakes(flakes);
    }, [screen]);

    // Responsive sizing
    const sizes = {
        mobile: {
            minHeight: 340,
            padding: "50px 15px 30px",
            starSize: 36,
            titleSize: "2rem",
            subtitleSize: "0.85rem",
            ornamentSize: 26,
            ornamentGap: 12,
            messageSize: "0.8rem",
            messagePadding: "12px 18px",
            borderRadius: 20,
            margin: "12px auto",
        },
        tablet: {
            minHeight: 380,
            padding: "55px 20px 35px",
            starSize: 42,
            titleSize: "2.8rem",
            subtitleSize: "1rem",
            ornamentSize: 30,
            ornamentGap: 16,
            messageSize: "0.9rem",
            messagePadding: "13px 22px",
            borderRadius: 24,
            margin: "16px auto",
        },
        laptop: {
            minHeight: 400,
            padding: "58px 25px 38px",
            starSize: 46,
            titleSize: "3.5rem",
            subtitleSize: "1.2rem",
            ornamentSize: 32,
            ornamentGap: 18,
            messageSize: "1rem",
            messagePadding: "14px 26px",
            borderRadius: 26,
            margin: "18px auto",
        },
        desktop: {
            minHeight: 420,
            padding: "60px 30px 40px",
            starSize: 50,
            titleSize: "4rem",
            subtitleSize: "1.3rem",
            ornamentSize: 35,
            ornamentGap: 20,
            messageSize: "1.1rem",
            messagePadding: "15px 30px",
            borderRadius: 28,
            margin: "20px auto",
        },
    };

    const s = sizes[screen];

    return (
        <div
            style={{
                position: "relative",
                minHeight: s.minHeight,
                borderRadius: s.borderRadius,
                margin: s.margin,
                maxWidth: screen === "mobile" ? "98%" : screen === "tablet" ? "95%" : 900,
                width: screen === "desktop" ? "95%" : "auto",
                overflow: "hidden",
                background: nightMode
                    ? "linear-gradient(180deg, #0f1628 0%, #1a1a3e 50%, #0d1421 100%)"
                    : "linear-gradient(180deg, #1a472a 0%, #0d2818 50%, #1e5631 100%)",
                boxShadow: nightMode
                    ? "0 15px 50px rgba(111, 81, 255, 0.3), inset 0 0 80px rgba(185, 147, 255, 0.1)"
                    : "0 15px 50px rgba(196, 30, 58, 0.3), inset 0 0 80px rgba(255, 215, 0, 0.1)",
                border: nightMode
                    ? "2px solid rgba(185, 147, 255, 0.3)"
                    : "2px solid rgba(255, 215, 0, 0.4)",
            }}
        >
            {/* Christmas Lights at top */}
            <ChristmasLights screen={screen} />

            {/* Snowfall */}
            {snowflakes.map((flake) => (
                <Snowflake key={flake.id} flake={flake} />
            ))}

            {/* Main Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: s.minHeight,
                    padding: s.padding,
                    textAlign: "center",
                }}
            >
                {/* Star on top */}
                <div
                    style={{
                        fontSize: s.starSize,
                        marginBottom: screen === "mobile" ? 6 : 10,
                        animation: "starGlow 2s ease-in-out infinite alternate",
                        filter: "drop-shadow(0 0 20px #ffd700)",
                    }}
                >
                    ⭐
                </div>

                {/* Merry Christmas Text */}
                <h1
                    style={{
                        fontFamily: "'Great Vibes', 'Dancing Script', cursive, serif",
                        fontSize: s.titleSize,
                        fontWeight: 400,
                        color: "#fff",
                        textShadow: `
              0 0 10px rgba(255, 215, 0, 0.8),
              0 0 20px rgba(255, 215, 0, 0.6),
              0 0 40px rgba(255, 215, 0, 0.4),
              0 4px 8px rgba(0, 0, 0, 0.5)
            `,
                        margin: screen === "mobile" ? "6px 0" : "10px 0",
                        letterSpacing: screen === "mobile" ? 1 : 2,
                        lineHeight: 1.2,
                    }}
                >
                    🎄 Merry Christmas 🎄
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontFamily: "'Poppins', 'Montserrat', sans-serif",
                        fontSize: s.subtitleSize,
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                        margin: screen === "mobile" ? "10px 0" : "15px 0",
                        letterSpacing: screen === "mobile" ? 1.5 : 3,
                        textTransform: "uppercase",
                    }}
                >
                    & Happy New Year 2025
                </p>

                {/* Decorative ornaments */}
                <div
                    style={{
                        display: "flex",
                        gap: s.ornamentGap,
                        marginTop: screen === "mobile" ? 14 : 20,
                        fontSize: s.ornamentSize,
                        filter: "drop-shadow(0 4px 15px rgba(0, 0, 0, 0.4))",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <span style={{ animation: "bounce 2s ease-in-out infinite" }}>🎅</span>
                    <span style={{ animation: "bounce 2s ease-in-out 0.3s infinite" }}>🎁</span>
                    <span style={{ animation: "bounce 2s ease-in-out 0.6s infinite" }}>🦌</span>
                    <span style={{ animation: "bounce 2s ease-in-out 0.9s infinite" }}>🎄</span>
                    <span style={{ animation: "bounce 2s ease-in-out 1.2s infinite" }}>🔔</span>
                </div>

                {/* Warm wishes message */}
                <div
                    style={{
                        marginTop: screen === "mobile" ? 20 : 30,
                        padding: s.messagePadding,
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        borderRadius: screen === "mobile" ? 14 : 20,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        maxWidth: screen === "mobile" ? "90%" : "auto",
                    }}
                >
                    <p
                        style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: s.messageSize,
                            color: "rgba(255, 255, 255, 0.95)",
                            margin: 0,
                            lineHeight: 1.6,
                        }}
                    >
                        ✨ Wishing you peace, joy, and love this holiday season ✨
                    </p>
                </div>
            </div>

            {/* Bottom snow pile effect */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: screen === "mobile" ? 25 : screen === "tablet" ? 30 : 40,
                    background: "linear-gradient(0deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)",
                    borderRadius: `0 0 ${s.borderRadius - 2}px ${s.borderRadius - 2}px`,
                    zIndex: 15,
                }}
            />

            {/* CSS Animations */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script:wght@400;700&display=swap');
        
        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) translateX(20px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(-15px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(25px) rotate(270deg);
          }
          100% {
            transform: translateY(100vh) translateX(-10px) rotate(360deg);
            opacity: 0.3;
          }
        }

        @keyframes twinkle {
          0% {
            opacity: 0.4;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes starGlow {
          0% {
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 15px #ffd700);
          }
          100% {
            transform: scale(1.15) rotate(10deg);
            filter: drop-shadow(0 0 30px #ffd700) drop-shadow(0 0 50px #ff8c00);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
        </div>
    );
};

export default Christmas;
