import React, { useState, useRef, useEffect } from "react";
import { getThemeOptions } from "@/config/themes";

// Responsive header height based on screen size
const getHeaderHeight = (screenSize) => {
  switch (screenSize) {
    case 'xs': return 50;
    case 'sm': return 52;
    case 'md': return 56;
    default: return 60;
  }
};

const Header = ({ nightMode, currentTheme, setTheme, appearance }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const audioRef = useRef(null);
  const dropdownRef = useRef(null);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 380) setScreenSize('xs');
      else if (width < 500) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else setScreenSize('desktop');
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const HEADER_HEIGHT = getHeaderHeight(screenSize);
  const isMobile = screenSize === 'xs' || screenSize === 'sm';

  // Use dynamic appearance settings
  const appName = appearance?.appName || "Love Memory";

  // Get all theme options
  const themeOptions = getThemeOptions();

  // Play or pause audio based on isPlaying state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Pause audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic styles based on current theme
  const bg = currentTheme?.colors?.headerBg || (nightMode
    ? "rgba(40,26,80,0.84)"
    : "rgba(255,255,255,0.68)");
  const border = currentTheme?.colors?.headerBorder || (nightMode ? "1.5px solid #6742b7" : "1.5px solid #ffb3d6");
  const boxShadow = currentTheme?.colors?.headerShadow || (nightMode ? "0 4px 22px #41277670" : "0 4px 18px #ff69b420");
  const titleColor = currentTheme?.colors?.titleColor || (nightMode ? "#bfa7fc" : "#d72660");
  const iconColor = currentTheme?.colors?.iconColor || (nightMode ? "#a77dfd" : "#ff69b4");
  const iconShadow = currentTheme?.colors?.iconShadow || (nightMode
    ? "drop-shadow(0 1px 10px #8f6dfbb2)"
    : "drop-shadow(0 1px 7px #ffb3d6a8)");
  const primaryColor = currentTheme?.colors?.primary || "#ff69b4";

  // Responsive sizes
  const sizes = {
    xs: { iconSize: 18, titleSize: '0.9rem', buttonHeight: 26, buttonPadding: '0 8px', fontSize: '0.75rem', musicWidth: 36 },
    sm: { iconSize: 20, titleSize: '1rem', buttonHeight: 28, buttonPadding: '0 10px', fontSize: '0.8rem', musicWidth: 40 },
    md: { iconSize: 22, titleSize: '1.1rem', buttonHeight: 30, buttonPadding: '0 11px', fontSize: '0.85rem', musicWidth: 44 },
    desktop: { iconSize: 26, titleSize: '1.28rem', buttonHeight: 32, buttonPadding: '0 12px', fontSize: '0.9rem', musicWidth: 48 },
  };
  const s = sizes[screenSize] || sizes.desktop;

  // Music button styles
  const musicButtonStyle = {
    width: `${s.musicWidth}px`,
    height: `${s.buttonHeight}px`,
    fontSize: isMobile ? '1rem' : '1.3rem',
    cursor: "pointer",
    borderRadius: "20px",
    border: `2px solid ${primaryColor}40`,
    background: bg,
    color: titleColor,
    boxShadow: `0 2px 10px ${primaryColor}33`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  };

  // Theme button styles
  const themeButtonStyle = {
    height: `${s.buttonHeight}px`,
    padding: s.buttonPadding,
    fontSize: s.fontSize,
    cursor: "pointer",
    borderRadius: "20px",
    border: `2px solid ${primaryColor}40`,
    background: bg,
    color: titleColor,
    boxShadow: `0 2px 10px ${primaryColor}33`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: isMobile ? "3px" : "6px",
    transition: "all 0.3s ease",
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 600,
    marginRight: isMobile ? "4px" : "8px",
  };

  // Dropdown styles - use fixed positioning on mobile for better UX
  const dropdownStyle = isMobile ? {
    position: "fixed",
    top: `${HEADER_HEIGHT + 8}px`,
    left: "50%",
    transform: "translateX(-50%)",
    background: nightMode ? "rgba(30, 20, 60, 0.98)" : "rgba(255, 255, 255, 0.98)",
    border: border,
    borderRadius: "14px",
    boxShadow: `0 8px 32px ${primaryColor}40`,
    padding: "8px",
    width: "calc(100vw - 24px)",
    maxWidth: "320px",
    maxHeight: "60vh",
    overflowY: "auto",
    zIndex: 1001,
    backdropFilter: "blur(12px)",
  } : {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    background: nightMode ? "rgba(30, 20, 60, 0.98)" : "rgba(255, 255, 255, 0.98)",
    border: border,
    borderRadius: "16px",
    boxShadow: `0 8px 32px ${primaryColor}30`,
    padding: "8px",
    minWidth: "240px",
    maxWidth: "320px",
    maxHeight: "400px",
    overflowY: "auto",
    zIndex: 1001,
    backdropFilter: "blur(10px)",
  };

  const themeOptionStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "6px" : "10px",
    padding: isMobile ? "8px 10px" : "10px 14px",
    borderRadius: isMobile ? "8px" : "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: isActive
      ? `${primaryColor}30`
      : "transparent",
    border: isActive ? `2px solid ${primaryColor}` : "2px solid transparent",
    marginBottom: isMobile ? "2px" : "4px",
  });

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Caveat:wght@700&display=swap"
        rel="stylesheet"
      />

      <nav
        className="navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          minHeight: HEADER_HEIGHT,
          background: bg,
          backdropFilter: "blur(10px)",
          boxShadow: boxShadow,
          borderBottom: border,
        }}
      >
        <div className="container d-flex align-items-center justify-content-between" style={{ padding: isMobile ? '0 10px' : undefined }}>
          {/* Left side: Icon & Title */}
          <div className="d-flex align-items-center">
            <span
              style={{
                fontSize: s.iconSize,
                color: iconColor,
                marginRight: isMobile ? 6 : 12,
                filter: iconShadow,
                animation: "pulseHeart 1.5s infinite",
                display: "inline-block",
                verticalAlign: "middle",
              }}
              role="img"
              aria-label="love-mail"
            >
              💌
            </span>
            <span
              style={{
                fontFamily: "'Quicksand', cursive, sans-serif",
                fontWeight: 700,
                fontSize: s.titleSize,
                color: titleColor,
                letterSpacing: isMobile ? "0.5px" : "1.3px",
                textShadow: nightMode
                  ? "0 2px 12px #45227988"
                  : "0 2px 8px #fff6",
              }}
            >
              {appName}
            </span>
          </div>

          {/* Right side: Theme selector and Music button */}
          <div className="d-flex align-items-center" style={{ position: "relative" }} ref={dropdownRef}>
            {/* Theme Selector Button */}
            <button
              type="button"
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              style={themeButtonStyle}
              aria-label="Change theme"
              aria-expanded={isThemeDropdownOpen}
            >
              <span style={{ fontSize: isMobile ? "0.85rem" : "1.1rem" }}>
                {currentTheme?.name?.split(' ')[0] || '🎨'}
              </span>
              {!isMobile && <span>Theme</span>}
              <span style={{
                transform: isThemeDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                fontSize: isMobile ? "0.5rem" : "0.7rem",
              }}>
                ▼
              </span>
            </button>

            {/* Mobile Backdrop */}
            {isMobile && isThemeDropdownOpen && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.4)",
                  zIndex: 1000,
                }}
                onClick={() => setIsThemeDropdownOpen(false)}
              />
            )}

            {/* Theme Dropdown */}
            {isThemeDropdownOpen && (
              <div style={dropdownStyle}>
                <div style={{
                  padding: isMobile ? "10px 12px" : "8px 14px",
                  fontSize: isMobile ? "0.75rem" : "0.8rem",
                  color: nightMode ? "#9ca3af" : "#6b7280",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: `1px solid ${primaryColor}20`,
                  marginBottom: "8px",
                  textAlign: isMobile ? "center" : "left",
                }}>
                  Choose Theme
                </div>
                {themeOptions.map((theme) => (
                  <div
                    key={theme.id}
                    style={themeOptionStyle(currentTheme?.id === theme.id)}
                    onClick={() => {
                      setTheme(theme.id);
                      setIsThemeDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      if (currentTheme?.id !== theme.id) {
                        e.currentTarget.style.background = `${primaryColor}15`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentTheme?.id !== theme.id) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setTheme(theme.id);
                        setIsThemeDropdownOpen(false);
                      }
                    }}
                  >
                    <span style={{ fontSize: isMobile ? "1rem" : "1.2rem" }}>
                      {theme.name.split(' ')[0]}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        color: titleColor,
                        fontWeight: 600,
                        fontSize: isMobile ? "0.8rem" : "0.9rem",
                        fontFamily: "'Quicksand', sans-serif",
                      }}>
                        {theme.name.split(' ').slice(1).join(' ')}
                      </div>
                      <div style={{
                        color: nightMode ? "#9ca3af" : "#6b7280",
                        fontSize: isMobile ? "0.65rem" : "0.75rem",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}>
                        {theme.description}
                      </div>
                    </div>
                    {currentTheme?.id === theme.id && (
                      <span style={{
                        color: primaryColor,
                        fontSize: isMobile ? "0.85rem" : "1rem",
                      }}>
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Music Button */}
            <button
              aria-label={isPlaying ? "Pause music" : "Play music"}
              onClick={() => setIsPlaying((prev) => !prev)}
              style={musicButtonStyle}
              type="button"
            >
              {isPlaying ? "🔊" : "🔈"}
            </button>
            <audio ref={audioRef} loop preload="none">
              <source src="/assets/music/anniversary-song.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content hidden behind fixed header */}
      <div style={{ height: HEADER_HEIGHT }} />

      {/* Heart/Envelope animation keyframes */}
      <style>{`
        @keyframes pulseHeart {
          0%, 100% { transform: scale(1);}
          32% { transform: scale(1.16);}
          60% { transform: scale(0.95);}
        }
      `}</style>
    </>
  );
};

export default Header;
