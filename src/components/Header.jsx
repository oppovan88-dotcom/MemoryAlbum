import React, { useState, useRef, useEffect } from "react";

const HEADER_HEIGHT = 60;

const Header = ({ nightMode, setNightMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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

  // Dynamic styles based on nightMode
  const bg = nightMode
    ? "rgba(40,26,80,0.84)" // dark with some transparency
    : "rgba(255,255,255,0.68)";
  const border = nightMode ? "1.5px solid #6742b7" : "1.5px solid #ffb3d6";
  const boxShadow = nightMode ? "0 4px 22px #41277670" : "0 4px 18px #ff69b420";
  const titleColor = nightMode ? "#bfa7fc" : "#d72660";
  const iconColor = nightMode ? "#a77dfd" : "#ff69b4";
  const iconShadow = nightMode
    ? "drop-shadow(0 1px 10px #8f6dfbb2)"
    : "drop-shadow(0 1px 7px #ffb3d6a8)";

  // Toggle switch styles
  const switchStyle = {
    width: 56,
    height: 32,
    borderRadius: 20,
    background: nightMode
      ? "linear-gradient(90deg,#3d194e,#0a1338 100%)"
      : "linear-gradient(90deg,#ffe0f4 0%, #ffd4ec 100%)",
    border: nightMode ? "2px solid #463c58" : "2px solid #ffb6d5",
    display: "flex",
    alignItems: "center",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.3s",
    boxShadow: nightMode ? "0 2px 10px #6e41a633" : "0 2px 16px #ffb6d560",
    marginRight: 12,
  };

  const thumbStyle = {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: nightMode
      ? "linear-gradient(135deg, #9f53f9 40%, #3d194e 100%)"
      : "linear-gradient(135deg, #fff0fa 60%, #ffb6d5 100%)",
    boxShadow: nightMode ? "0 2px 8px #c17cff88" : "0 2px 10px #ffc8dd90",
    position: "absolute",
    top: 2,
    left: nightMode ? 26 : 2,
    transition: "left 0.27s cubic-bezier(.48,1.32,.33,.99), background 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    border: nightMode ? "none" : "1.5px solid #ffafd8",
  };

  // Music button styles
  const musicButtonStyle = {
    width: "48px",
    height: "32px",
    fontSize: "1.3rem",
    cursor: "pointer",
    borderRadius: "20px",
    border: nightMode ? "2px solid #463c58" : "2px solid #ffb6d5",
    background: nightMode
      ? "linear-gradient(90deg,#3d194e,#0a1338 100%)"
      : "linear-gradient(90deg,#ffe0f4 0%, #ffd4ec 100%)",
    color: nightMode ? "#bfa7fc" : "#d72660",
    boxShadow: nightMode ? "0 2px 10px #6e41a633" : "0 2px 16px #ffb6d560",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700&family=Caveat:wght@700&display=swap"
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
              Love Memory
            </span>
          </div>

          {/* Right side: Music button and Toggle button */}
          <div className="d-flex align-items-center">
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

            {/* Night Mode Toggle */}
            <div
              role="button"
              aria-pressed={nightMode}
              tabIndex={0}
              onClick={() => setNightMode(!nightMode)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setNightMode(!nightMode);
              }}
              style={switchStyle}
            >
              <div style={thumbStyle}>
                {nightMode ? (
                  <span role="img" aria-label="moon" style={{ color: "#fff" }}>
                    🌙
                  </span>
                ) : (
                  <span
                    role="img"
                    aria-label="sun"
                    style={{ color: "#ff69b4" }}
                  >
                    ☀️
                  </span>
                )}
              </div>
            </div>
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
