import { useEffect, useState } from "react";
import axios from "axios";
import Content from "@/components/Content";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AdminDashboard from "@/dashboard";
import { getTheme, DEFAULT_THEME } from "@/config/themes";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Storage key for theme preference
const THEME_STORAGE_KEY = 'memoryalbum_theme';

// Custom hook to detect desktop/tablet
function useIsDesktopOrTablet() {
  const [isWide, setIsWide] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isWide;
}

// Starfield for night themes
function randomStarStyle() {
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const size = 0.7 + Math.random() * 1.7;
  const opacity = 0.3 + Math.random() * 0.7;
  const duration = 2 + Math.random() * 2;
  return {
    position: "absolute",
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: "white",
    borderRadius: "50%",
    opacity: opacity,
    boxShadow: `0 0 ${4 + Math.random() * 12}px 2px #fff8`,
    animation: `starTwinkle ${duration}s infinite alternate`,
    pointerEvents: "none",
    zIndex: 0,
  };
}

function StarField({ count = 90 }) {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    setStars(Array.from({ length: count }, () => randomStarStyle()));
  }, [count]);
  return (
    <>
      {stars.map((style, idx) => (
        <span key={idx} style={style}></span>
      ))}
    </>
  );
}

// Snow effect for Christmas theme
function SnowField({ count = 50 }) {
  const [flakes, setFlakes] = useState([]);
  useEffect(() => {
    setFlakes(Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      size: 4 + Math.random() * 8,
    })));
  }, [count]);
  return (
    <>
      {flakes.map((flake, idx) => (
        <span
          key={idx}
          style={{
            position: "absolute",
            left: `${flake.left}%`,
            top: "-20px",
            fontSize: `${flake.size}px`,
            animation: `snowFall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          ❄️
        </span>
      ))}
    </>
  );
}

// Bubble effect for Ocean theme
function BubbleField({ count = 30 }) {
  const [bubbles, setBubbles] = useState([]);
  useEffect(() => {
    setBubbles(Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 6 + Math.random() * 12,
    })));
  }, [count]);
  return (
    <>
      {bubbles.map((bubble, idx) => (
        <span
          key={idx}
          style={{
            position: "absolute",
            left: `${bubble.left}%`,
            bottom: "-30px",
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: "rgba(255,255,255,0.4)",
            borderRadius: "50%",
            animation: `bubbleRise ${bubble.duration}s ease-in infinite`,
            animationDelay: `${bubble.delay}s`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

// Petal effect for Sakura theme
function PetalField({ count = 25 }) {
  const [petals, setPetals] = useState([]);
  useEffect(() => {
    setPetals(Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 5,
      size: 12 + Math.random() * 8,
    })));
  }, [count]);
  return (
    <>
      {petals.map((petal, idx) => (
        <span
          key={idx}
          style={{
            position: "absolute",
            left: `${petal.left}%`,
            top: "-30px",
            fontSize: `${petal.size}px`,
            animation: `petalFall ${petal.duration}s ease-in-out infinite`,
            animationDelay: `${petal.delay}s`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          🌸
        </span>
      ))}
    </>
  );
}

// Leaf effect for Forest theme
function LeafField({ count = 20 }) {
  const [leaves, setLeaves] = useState([]);
  useEffect(() => {
    const leafIcons = ['🍃', '🌿', '🍂'];
    setLeaves(Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 7,
      duration: 7 + Math.random() * 5,
      icon: leafIcons[Math.floor(Math.random() * leafIcons.length)],
      size: 14 + Math.random() * 8,
    })));
  }, [count]);
  return (
    <>
      {leaves.map((leaf, idx) => (
        <span
          key={idx}
          style={{
            position: "absolute",
            left: `${leaf.left}%`,
            top: "-30px",
            fontSize: `${leaf.size}px`,
            animation: `leafFall ${leaf.duration}s ease-in-out infinite`,
            animationDelay: `${leaf.delay}s`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {leaf.icon}
        </span>
      ))}
    </>
  );
}

// Sparkle effect for Luxury theme
function SparkleField({ count = 40 }) {
  const [sparkles, setSparkles] = useState([]);
  useEffect(() => {
    setSparkles(Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 1 + Math.random() * 2,
    })));
  }, [count]);
  return (
    <>
      {sparkles.map((sparkle, idx) => (
        <span
          key={idx}
          style={{
            position: "absolute",
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            fontSize: "12px",
            animation: `sparkleGlow ${sparkle.duration}s ease-in-out infinite`,
            animationDelay: `${sparkle.delay}s`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          ✨
        </span>
      ))}
    </>
  );
}

// Aurora effect
function AuroraEffect() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
          linear-gradient(180deg, transparent 0%, rgba(100, 255, 218, 0.1) 20%, transparent 40%),
          linear-gradient(180deg, transparent 30%, rgba(187, 134, 252, 0.1) 50%, transparent 70%),
          linear-gradient(180deg, transparent 60%, rgba(3, 218, 198, 0.08) 80%, transparent 100%)
        `,
        animation: "auroraWave 8s ease-in-out infinite",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function App() {
  // Check for admin route
  const checkIsAdmin = () => {
    return window.location.pathname.includes('/admin') ||
      window.location.hash === '#admin';
  };

  const [isAdmin, setIsAdmin] = useState(checkIsAdmin());
  const [appearance, setAppearance] = useState(null);

  // Theme state - load from localStorage or use default
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
    }
    return DEFAULT_THEME;
  });

  // Get the current theme object
  const currentTheme = getTheme(currentThemeId);

  // Save theme preference to localStorage
  const setTheme = (themeId) => {
    setCurrentThemeId(themeId);
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  };

  // Fetch appearance settings
  useEffect(() => {
    const fetchAppearance = async () => {
      try {
        const res = await axios.get(`${API_URL}/appearance`);
        setAppearance(res.data);
      } catch (error) {
        console.log('Using default appearance');
      }
    };
    fetchAppearance();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const handleWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Listen for hash and path changes
    const handleRouteChange = () => {
      setIsAdmin(checkIsAdmin());
    };
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    // Check on mount
    setIsAdmin(checkIsAdmin());

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // If admin route, show admin dashboard
  if (isAdmin) {
    return <AdminDashboard />;
  }

  const isDesktopOrTablet = useIsDesktopOrTablet();

  // For backward compatibility, nightMode is derived from theme
  const nightMode = currentTheme.isNight;

  // Add class for mode to root container
  const modeClass = nightMode ? "night" : "light";

  return (
    <div
      className={`${modeClass} ${currentTheme.cssClass}`}
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* BACKGROUND & FLOATING DECOR */}
      <div
        aria-hidden
        style={{
          zIndex: 0,
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          overflow: "hidden",
          background: currentTheme.colors.background,
          backgroundSize: "400% 400%",
          animation: nightMode ? "galaxyGradientMove 30s ease-in-out infinite alternate" : "gradientMove 15s ease infinite",
        }}
      >
        {/* Stars for night themes */}
        {currentTheme.hasStars && <StarField count={100} />}

        {/* Snow for Christmas theme */}
        {currentTheme.hasSnow && <SnowField count={50} />}

        {/* Bubbles for Ocean theme */}
        {currentTheme.hasBubbles && <BubbleField count={30} />}

        {/* Petals for Sakura theme */}
        {currentTheme.hasPetals && <PetalField count={25} />}

        {/* Leaves for Forest theme */}
        {currentTheme.hasLeaves && <LeafField count={20} />}

        {/* Sparkles for Luxury theme */}
        {currentTheme.hasSparkles && <SparkleField count={40} />}

        {/* Aurora effect */}
        {currentTheme.hasAurora && <AuroraEffect />}

        {/* Floating icons */}
        {currentTheme.floatingIcons.map(({ icon, cls }, idx) => (
          <span
            className={`floating-bg-heart ${cls}`}
            key={cls + idx}
            style={{
              color: currentTheme.colors.accent,
            }}
          >
            {icon}
          </span>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ position: "relative", zIndex: 2, paddingTop: 16 }}>
        {/* Sticky Header with theme props */}
        <div
          className="sticky-top"
          style={{ zIndex: 100, background: "transparent" }}
        >
          <Header
            nightMode={nightMode}
            currentTheme={currentTheme}
            setTheme={setTheme}
            appearance={appearance}
          />
        </div>
        <Content nightMode={nightMode} currentTheme={currentTheme} appearance={appearance} />
        <Footer nightMode={nightMode} currentTheme={currentTheme} appearance={appearance} />
      </div>
    </div>
  );
}

export default App;
