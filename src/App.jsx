import { useEffect, useState } from "react";
import axios from "axios";
import Content from "@/components/Content";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AdminDashboard from "@/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

// Starfield for galaxy mode
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

function App() {
  // Check for admin route
  const checkIsAdmin = () => {
    return window.location.pathname.includes('/admin') ||
      window.location.hash === '#admin';
  };

  const [isAdmin, setIsAdmin] = useState(checkIsAdmin());
  const [appearance, setAppearance] = useState(null);

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
  const [nightMode, setNightMode] = useState(false);

  // Add class for mode to root container
  const modeClass = nightMode ? "night" : "light";

  // Remove inline background styles — use CSS classes instead
  const bgClass = nightMode ? "bg-night" : "bg-light";

  // Animated icons by mode - Updated light mode with nature/crystal theme
  const heartSet = nightMode
    ? [
      { icon: "💜", cls: "h1" },
      { icon: "💙", cls: "h2" },
      { icon: "💫", cls: "h3" },
      { icon: "🌌", cls: "h4" },
      { icon: "💖", cls: "h5" },
      { icon: "🌠", cls: "h6" },
    ]
    : [
      { icon: "🎆", cls: "h1" },
      { icon: "🥂", cls: "h2" },
      { icon: "⭐", cls: "h3" },
      { icon: "🎊", cls: "h4" },
      { icon: "✨", cls: "h5" },
      { icon: "🥂", cls: "h6" },
    ];

  return (
    <div
      className={`${modeClass}`}
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
        className={bgClass}
        style={{
          zIndex: 0,
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Stars for galaxy mode */}
        {nightMode && <StarField count={100} />}

        {/* Floating hearts / cosmic icons */}
        {heartSet.map(({ icon, cls }, idx) => (
          <span className={`floating-bg-heart ${cls}`} key={cls + idx}>
            {icon}
          </span>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ position: "relative", zIndex: 2, paddingTop: 16 }}>
        {/* Sticky Header with toggle props */}
        <div
          className="sticky-top"
          style={{ zIndex: 100, background: "transparent" }}
        >
          <Header nightMode={nightMode} setNightMode={setNightMode} appearance={appearance} />
        </div>
        <Content nightMode={nightMode} appearance={appearance} />
        <Footer nightMode={nightMode} appearance={appearance} />
      </div>
    </div>
  );
}

export default App;
