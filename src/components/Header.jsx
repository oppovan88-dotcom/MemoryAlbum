import React, { useState, useRef, useEffect } from "react";
import { getThemeOptions } from "@/config/themes";

const HEADER_HEIGHT = 60;

const Header = ({ nightMode, currentTheme, setTheme, appearance }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const audioRef = useRef(null);
  const dropdownRef = useRef(null);

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

  // Music button styles
  const musicButtonStyle = {
    width: "48px",
    height: "32px",
    fontSize: "1.3rem",
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
    height: "32px",
    padding: "0 12px",
    fontSize: "0.9rem",
    cursor: "pointer",
    borderRadius: "20px",
    border: `2px solid ${primaryColor}40`,
    background: bg,
    color: titleColor,
    boxShadow: `0 2px 10px ${primaryColor}33`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.3s ease",
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 600,
    marginRight: "8px",
  };

  // Dropdown styles
  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    background: nightMode ? "rgba(30, 20, 60, 0.98)" : "rgba(255, 255, 255, 0.98)",
    border: border,
    borderRadius: "16px",
    boxShadow: `0 8px 32px ${primaryColor}30`,
    padding: "8px",
    minWidth: "200px",
    maxHeight: "400px",
    overflowY: "auto",
    zIndex: 1001,
    backdropFilter: "blur(10px)",
  };

  const themeOptionStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: isActive
      ? `${primaryColor}30`
      : "transparent",
    border: isActive ? `2px solid ${primaryColor}` : "2px solid transparent",
    marginBottom: "4px",
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
        <div className="container d-flex align-items-center justify-content-between">
          {/* Left side: Icon & Title */}
          <div className="d-flex align-items-center">
            <span
              style={{
                fontSize: 26,
                color: iconColor,
                marginRight: 12,
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
                fontSize: "1.28rem",
                color: titleColor,
                letterSpacing: "1.3px",
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
              <span style={{ fontSize: "1.1rem" }}>
                {currentTheme?.name?.split(' ')[0] || '🎨'}
              </span>
              <span className="d-none d-sm-inline">Theme</span>
              <span style={{
                transform: isThemeDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                fontSize: "0.7rem",
              }}>
                ▼
              </span>
            </button>

            {/* Theme Dropdown */}
            {isThemeDropdownOpen && (
              <div style={dropdownStyle}>
                <div style={{
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  color: nightMode ? "#9ca3af" : "#6b7280",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: `1px solid ${primaryColor}20`,
                  marginBottom: "8px",
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
                    <span style={{ fontSize: "1.2rem" }}>
                      {theme.name.split(' ')[0]}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: titleColor,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        fontFamily: "'Quicksand', sans-serif",
                      }}>
                        {theme.name.split(' ').slice(1).join(' ')}
                      </div>
                      <div style={{
                        color: nightMode ? "#9ca3af" : "#6b7280",
                        fontSize: "0.75rem",
                      }}>
                        {theme.description}
                      </div>
                    </div>
                    {currentTheme?.id === theme.id && (
                      <span style={{
                        color: primaryColor,
                        fontSize: "1rem",
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
