import { useEffect, useState } from "react";
import AOS from "aos";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ---- FALLBACK LOCAL DATA (when no DB memories) ----
const localMemories = [
  { id: 1, title: "Beach Day", image: "../assets/images/1.jpg" },
  { id: 2, title: "Mountain Hike", image: "../assets/images/2.jpg" },
  { id: 3, title: "City Nightlife", image: "../assets/images/3.jpg" },
  { id: 4, title: "Picnic", image: "../assets/images/4.jpg" },
  { id: 5, title: "Concert", image: "../assets/images/5.jpg" },
  { id: 6, title: "Road Trip", image: "../assets/images/6.jpg" },
  { id: 7, title: "Concert", image: "../assets/images/7.jpg" },
  { id: 8, title: "Road Trip", image: "../assets/images/8.jpg" },
  { id: 9, title: "Road Trip", image: "../assets/images/10.jpg" },
  { id: 10, title: "Road Trip", image: "../assets/images/11.jpg" },
  { id: 11, title: "Road Trip", image: "../assets/images/12.jpg" },
  { id: 12, title: "Road Trip", image: "../assets/images/13.jpg" },
  { id: 13, title: "Road Trip", image: "../assets/images/14.jpg" },
  { id: 14, title: "Road Trip", image: "../assets/images/15.jpg" },
];

// ---- MAIN COMPONENT ----
const Memory = ({ nightMode, currentTheme }) => {
  const [memories, setMemories] = useState(localMemories);
  const [viewerIdx, setViewerIdx] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch memories from MongoDB
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await axios.get(`${API_URL}/memories`);
        if (res.data && res.data.length > 0) {
          // Transform DB memories to match local format
          const dbMemories = res.data.map((m, idx) => ({
            id: m._id,
            title: m.title,
            image: m.imageUrl,
            description: m.description,
          }));
          // Combine: DB memories first, then local memories
          setMemories([...dbMemories, ...localMemories]);
        }
      } catch (err) {
        console.log("Using local memories (API not available)");
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (viewerIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [viewerIdx]);

  // Swipe/scroll/modal navigation logic...
  useEffect(() => {
    if (viewerIdx === null) return;
    const handleWheel = (e) => {
      if (e.deltaY > 0 && viewerIdx < memories.length - 1)
        setViewerIdx((idx) => idx + 1);
      else if (e.deltaY < 0 && viewerIdx > 0) setViewerIdx((idx) => idx - 1);
    };
    let startY = null;
    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      if (startY === null) return;
      const endY = e.changedTouches[0].clientY;
      if (endY - startY > 50 && viewerIdx > 0) setViewerIdx((idx) => idx - 1);
      if (startY - endY > 50 && viewerIdx < memories.length - 1)
        setViewerIdx((idx) => idx + 1);
      startY = null;
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [viewerIdx, memories.length]);

  useEffect(() => {
    if (viewerIdx === null) return;
    const handleKey = (e) => {
      if (e.key === "ArrowDown" && viewerIdx < memories.length - 1)
        setViewerIdx((idx) => idx + 1);
      if (e.key === "ArrowUp" && viewerIdx > 0) setViewerIdx((idx) => idx - 1);
      if (e.key === "Escape") setViewerIdx(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewerIdx, memories.length]);

  // Get theme colors with fallbacks
  const primaryColor = currentTheme?.colors?.primary || (nightMode ? "#b993ff" : "#ff69b4");
  const secondaryColor = currentTheme?.colors?.secondary || (nightMode ? "#7f53ff" : "#d72660");
  const accentColor = currentTheme?.colors?.accent || (nightMode ? "#bfa7fc" : "#ffd700");
  const titleColor = currentTheme?.colors?.titleColor || primaryColor;

  // Theme-based colors for cards
  const themeColors = {
    primary: primaryColor,
    secondary: secondaryColor,
    gold: accentColor,
    cardBg: nightMode
      ? `rgba(30, 30, 60, 0.85)`
      : `rgba(255, 255, 255, 0.92)`,
    cardBorder: `${primaryColor}40`,
    cardShadow: `0 8px 30px ${primaryColor}25`,
    cardHoverShadow: `0 16px 42px ${primaryColor}40`,
  };

  return (
    <div className="container pb-3">
      {/* Theme-Styled Title */}
      <div className="text-center mb-3 mb-md-4" style={{ marginTop: 16 }}>
        {/* Decorative top ornaments - hidden on small mobile */}
        <div style={{ marginBottom: 4 }} className="d-none d-sm-block">
          <span style={{ fontSize: 18, filter: `drop-shadow(0 2px 8px ${accentColor}80)` }}>
            ✨
          </span>
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "8px 16px",
            background: `linear-gradient(135deg, ${primaryColor}20 0%, ${secondaryColor}15 100%)`,
            borderRadius: 14,
            border: `2px solid ${primaryColor}40`,
            boxShadow: `0 4px 15px ${primaryColor}25`,
          }}
        >
          <span
            style={{
              fontFamily: "'Poppins', 'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "1px",
              backgroundImage: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            <span style={{ fontSize: 14, marginRight: 4 }}>💖</span>
            Top Memory Album
            <span style={{ fontSize: 14, marginLeft: 4 }}>💖</span>
          </span>
        </div>

        {/* Subtitle - smaller on mobile */}
        <div style={{ marginTop: 6 }} className="d-none d-sm-block">
          <span
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "0.75rem",
              color: `${primaryColor}cc`,
              letterSpacing: 0.5,
            }}
          >
            ✨ Our precious moments together ✨
          </span>
        </div>
      </div>

      {/* ---- Grid ---- */}
      <div className="container pb-5">
        <div className="row g-4">
          {memories.map((memory, idx) => (
            <div
              key={memory.id}
              className="col-6 col-md-3 col-lg-2"
              data-aos="fade-up"
              data-aos-delay={idx * 50}
              style={{ cursor: "pointer" }}
              onClick={() => setViewerIdx(idx)}
            >
              <div
                className="memory-polaroid"
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  background: themeColors.cardBg,
                  boxShadow: themeColors.cardShadow,
                  border: `2px solid ${themeColors.cardBorder}`,
                  transition: "transform 0.2s ease, box-shadow 0.25s ease",
                  height: 186,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
                  e.currentTarget.style.boxShadow = themeColors.cardHoverShadow;
                  e.currentTarget.style.borderColor = themeColors.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = themeColors.cardShadow;
                  e.currentTarget.style.borderColor = themeColors.cardBorder;
                }}
              >
                {/* Corner decoration */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    fontSize: 16,
                    zIndex: 3,
                    filter: `drop-shadow(0 2px 4px ${primaryColor}40)`,
                    animation: "gentlePulse 2s ease-in-out infinite",
                  }}
                >
                  {idx % 3 === 0 ? "💖" : idx % 3 === 1 ? "⭐" : "✨"}
                </div>

                <img
                  src={memory.image}
                  alt={memory.title}
                  className="card-img-top"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "14px",
                    transition: "filter 0.2s, transform 0.3s",
                  }}
                />

                {/* Bottom Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 50,
                    background: nightMode
                      ? "linear-gradient(0deg, rgba(30, 30, 60, 0.9) 0%, transparent 100%)"
                      : "linear-gradient(0deg, rgba(196, 30, 58, 0.15) 0%, transparent 100%)",
                    borderRadius: "0 0 14px 14px",
                    zIndex: 2,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Modal/Viewer with Christmas Theme ---- */}
      {viewerIdx !== null && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: nightMode
              ? `rgba(15, 22, 40, 0.96)`
              : `${primaryColor}15`,
            backdropFilter: "blur(8px) saturate(1.2)",
            zIndex: 2000,
          }}
          onClick={() => setViewerIdx(null)}
        >
          {/* Sparkles in modal */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {[...Array(15)].map((_, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${Math.random() * 100}%`,
                  top: "-20px",
                  fontSize: `${8 + Math.random() * 12}px`,
                  opacity: 0.6,
                  animation: `modalSnowfall ${8 + Math.random() * 8}s linear ${Math.random() * 5}s infinite`,
                  color: primaryColor,
                }}
              >
                ✨
              </span>
            ))}
          </div>

          <div
            className="d-flex flex-column align-items-center justify-content-center w-100 position-relative"
            style={{ maxWidth: 430, margin: "0 auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="btn position-absolute"
              style={{
                top: -40,
                right: 10,
                zIndex: 2,
                fontSize: "1.8rem",
                color: "#fff",
                background: `${primaryColor}cc`,
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${accentColor}80`,
                boxShadow: `0 4px 15px ${primaryColor}40`,
              }}
              aria-label="Close"
              onClick={() => setViewerIdx(null)}
            >
              ×
            </button>

            {/* Prev Button */}
            <button
              className="btn position-absolute start-0 top-50 translate-middle-y"
              style={{
                left: -50,
                zIndex: 3,
                opacity: viewerIdx > 0 ? 1 : 0.3,
                pointerEvents: viewerIdx > 0 ? "auto" : "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                fontWeight: 700,
                fontSize: 22,
                boxShadow: `0 4px 15px ${primaryColor}40`,
                border: `2px solid ${accentColor}80`,
                background: `${primaryColor}e6`,
                color: "#fff",
                transition: "all 0.2s ease",
              }}
              disabled={viewerIdx === 0}
              onClick={() => setViewerIdx((idx) => idx - 1)}
            >
              ←
            </button>

            {/* Next Button */}
            <button
              className="btn position-absolute end-0 top-50 translate-middle-y"
              style={{
                right: -50,
                zIndex: 3,
                opacity: viewerIdx < memories.length - 1 ? 1 : 0.3,
                pointerEvents: viewerIdx < memories.length - 1 ? "auto" : "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                fontWeight: 700,
                fontSize: 22,
                boxShadow: `0 4px 15px ${primaryColor}40`,
                border: `2px solid ${accentColor}80`,
                background: `${primaryColor}e6`,
                color: "#fff",
                transition: "all 0.2s ease",
              }}
              disabled={viewerIdx === memories.length - 1}
              onClick={() => setViewerIdx((idx) => idx + 1)}
            >
              →
            </button>

            {/* Image Viewer */}
            <div
              className="position-relative w-100 d-flex flex-column align-items-center"
              style={{ maxWidth: 400 }}
            >
              {/* Decorative frame */}
              <div
                style={{
                  position: "absolute",
                  top: -15,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 28,
                  zIndex: 5,
                  filter: `drop-shadow(0 2px 8px ${accentColor}99)`,
                }}
              >
                ✨
              </div>

              <img
                src={memories[viewerIdx].image}
                alt=""
                className="rounded-4 shadow"
                style={{
                  width: "100%",
                  maxWidth: 400,
                  height: "60vh",
                  objectFit: "cover",
                  borderRadius: "22px",
                  boxShadow: `0 8px 40px ${primaryColor}66`,
                  border: `4px solid ${primaryColor}80`,
                  transition: "all 0.3s ease",
                }}
              />

              {/* Image Counter */}
              <div
                style={{
                  marginTop: 16,
                  padding: "8px 20px",
                  background: `${primaryColor}40`,
                  borderRadius: 20,
                  border: `1px solid ${accentColor}66`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "0.95rem",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  📷 {viewerIdx + 1} / {memories.length}
                </span>
              </div>
            </div>
          </div>

          {/* Animations */}
          <style>{`
            @keyframes gentlePulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.15); }
            }
            
            @keyframes modalSnowfall {
              0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0.6;
              }
              100% {
                transform: translateY(100vh) translateX(30px) rotate(360deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Memory;
