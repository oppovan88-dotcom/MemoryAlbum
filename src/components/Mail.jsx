import { useState, useRef } from "react";

function Mail({ nightMode }) {
  const [open, setOpen] = useState(false);
  const [isAnniversary, setIsAnniversary] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Colors & styles for night and light mode
  const pink = "#ff69b4";
  const galaxyPink = "#a36dfc";
  const nightBorder = "2.8px solid #a77dfd";
  const lightBorder = "2.8px solid #fd2d6c";
  const cardBg = "transparent";
  const noteBg = "transparent";
  const noteBorder = nightMode ? "2px dashed #b993ff" : "2px dashed #ff69b4";
  const noteColor = nightMode ? "#ebdafd" : "#a8235d";
  const subColor = nightMode ? "#d6ccff" : "#ba7bc9";
  const shadow = nightMode ? "0 8px 40px #7f53ff40" : "0 8px 40px #fd2d6c33";
  const buttonColor = nightMode ? "#b993ff" : pink;

  // Anniversary colors
  const anniversaryGold = "#ffd700";
  const anniversaryBorder = nightMode ? "2.8px solid #ffd700" : "2.8px solid #ff8c00";
  const anniversaryNoteBorder = nightMode ? "2px dashed #ffd700" : "2px dashed #ff8c00";

  const handleSongPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log("Audio play failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className="container d-flex flex-column align-items-center"
      style={{
        minHeight: 380,
        paddingTop: 36,
        paddingBottom: 40,
        position: "relative",
      }}
    >
      {/* Mode Toggle */}
      <div className="mb-3">
        <button
          className="btn btn-sm me-2"
          style={{
            color: !isAnniversary ? buttonColor : "#666",
            borderColor: !isAnniversary ? buttonColor : "#ddd",
            borderWidth: 1,
            borderStyle: "solid",
            background: !isAnniversary ? (nightMode ? "#b993ff22" : "#ff69b422") : "transparent",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: 12,
          }}
          onClick={() => setIsAnniversary(false)}
        >
          Regular
        </button>
        <button
          className="btn btn-sm"
          style={{
            color: isAnniversary ? anniversaryGold : "#666",
            borderColor: isAnniversary ? anniversaryGold : "#ddd",
            borderWidth: 1,
            borderStyle: "solid",
            background: isAnniversary ? (nightMode ? "#ffd70022" : "#ff8c0022") : "transparent",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: 12,
          }}
          onClick={() => setIsAnniversary(true)}
        >
          Anniversary ✨
        </button>
      </div>

      {/* Centered Top Title */}
      <h2
        className="fw-bold"
        style={{
          fontFamily: "'Pacifico', 'Caveat', cursive",
          fontWeight: 700,
          fontSize: "1.22rem",
          letterSpacing: "1.2px",
          color: isAnniversary ? anniversaryGold : (nightMode ? "#cfaeff" : pink),
          textShadow: isAnniversary 
            ? "0 2px 18px #ffd70055, 0 1px 0 #fff"
            : nightMode
            ? "0 2px 18px #7645b955, 0 1px 0 #fff"
            : "0 1px 10px #ffb3d633, 0 1px 0 #fff",
          opacity: 0.96,
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        {isAnniversary ? "Our Anniversary 💍" : "My Sweetie 💌"}
      </h2>

      {/* Envelope Button */}
      {!open && (
        <button
          className="btn btn-light shadow-lg rounded-circle position-relative"
          style={{
            width: 112,
            height: 112,
            fontSize: 45,
            border: isAnniversary ? anniversaryBorder : (nightMode ? nightBorder : lightBorder),
            color: isAnniversary ? anniversaryGold : (nightMode ? galaxyPink : "#fd2d6c"),
            background: cardBg,
            transition: "all 0.32s",
            boxShadow: isAnniversary 
              ? (nightMode ? "0 8px 40px #ffd70040" : "0 8px 40px #ff8c0033")
              : shadow,
            animation: "mailBounce 1.3s infinite",
            marginBottom: 18,
            outline: "none",
          }}
          onClick={() => setOpen(true)}
        >
          <span role="img" aria-label="mail">
            {isAnniversary ? "💍" : "✉️"}
          </span>
          {/* Cute ribbon */}
          <span
            style={{
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 22,
              color: isAnniversary ? anniversaryGold : (nightMode ? "#b993ff" : pink),
              pointerEvents: "none",
              filter: isAnniversary
                ? "drop-shadow(0 1.5px 8px #ffd70088)"
                : nightMode
                ? "drop-shadow(0 1.5px 8px #a77dfd88)"
                : "drop-shadow(0 1.5px 6px #ffb3d688)",
            }}
            role="img"
            aria-label="ribbon"
          >
            {isAnniversary ? "✨" : "🎀"}
          </span>
        </button>
      )}

      {/* Letter Card */}
      {open && (
        <div
          className="d-flex flex-column align-items-center"
          style={{ animation: "fadeinUp 0.65s" }}
        >
          {/* Open Envelope */}
          <div
            className="mb-3"
            style={{
              width: 108,
              height: 108,
              fontSize: 50,
              background: isAnniversary 
                ? (nightMode 
                  ? "radial-gradient(circle, #4a3c0a 40%, #2a2205 100%)"
                  : "radial-gradient(circle, #fff9e6, #fff2cc 75%)")
                : (nightMode
                  ? "radial-gradient(circle, #34235a 40%, #211241 100%)"
                  : "radial-gradient(circle, #fff, #ffeaf5 75%)"),
              borderRadius: "18px",
              boxShadow: isAnniversary
                ? (nightMode ? "0 8px 36px #ffd70040" : "0 8px 36px #ff8c0022")
                : (nightMode ? "0 8px 36px #9f53f940" : "0 8px 36px #fd2d6c22"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isAnniversary ? anniversaryGold : (nightMode ? galaxyPink : "#fd2d6c"),
              border: isAnniversary 
                ? (nightMode ? "2.5px solid #ffd700" : "2.5px solid #ff8c00")
                : (nightMode ? "2.5px solid #b993ff" : "2.5px solid #ffe6ef"),
              marginBottom: -30,
              transform: "rotateX(18deg) scaleY(0.97)",
              animation: "mailPop 0.7s cubic-bezier(.23,1.02,.32,1) both",
            }}
          >
            <span role="img" aria-label="open-mail">
              {isAnniversary ? "💝" : "📬"}
            </span>
          </div>

          {/* Ribbon */}
          <div
            style={{
              width: 80,
              height: 15,
              background: isAnniversary
                ? (nightMode 
                  ? "linear-gradient(90deg, #b8860b 40%, #ffd700 100%)"
                  : "linear-gradient(90deg, #ff8c00 40%, #ffd700 100%)")
                : (nightMode
                  ? "linear-gradient(90deg, #7645b9 40%, #b993ff 100%)"
                  : "linear-gradient(90deg, #fd2d6c 40%, #ffb3d6 100%)"),
              borderRadius: 8,
              position: "relative",
              top: -7,
              marginBottom: 3,
              boxShadow: isAnniversary
                ? (nightMode ? "0 2px 10px #ffd70044" : "0 2px 10px #ff8c0044")
                : (nightMode ? "0 2px 10px #8f6dfb44" : "0 2px 10px #fd2d6c44"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontFamily: "'Pacifico', cursive",
                fontSize: 13,
                letterSpacing: 1,
                fontWeight: 700,
              }}
            >
              {isAnniversary ? "Special" : "For you"}
            </span>
          </div>

          {/* Sweet Note */}
          <div
            className="rounded-4 shadow-lg px-4 py-3"
            style={{
              minWidth: 300,
              maxWidth: 420,
              marginTop: 0,
              border: isAnniversary ? anniversaryNoteBorder : noteBorder,
              textAlign: "left",
              animation: "fadeinUp 0.65s 0.09s both",
              fontFamily:
                "'Caveat', 'Pacifico', cursive, 'Poppins', sans-serif",
              boxShadow: isAnniversary
                ? (nightMode ? "0 4px 32px #ffd70025" : "0 4px 32px #ff8c0025")
                : (nightMode ? "0 4px 32px #7f53ff25" : "0 4px 32px #fd2d6c25"),
              fontSize: 18,
              color: isAnniversary ? (nightMode ? "#fff3cd" : "#8b4513") : noteColor,
              position: "relative",
              background: noteBg,
              transition: "all 0.3s",
            }}
          >
            <div className="mb-2" style={{ fontSize: 16, color: isAnniversary ? (nightMode ? "#ffd700" : "#d2691e") : subColor }}>
              <span role="img" aria-label="star">
                {isAnniversary ? "💫" : "🌟"}
              </span>{" "}
              To: Vy Chanry
            </div>
            <div>
              <i>
                {isAnniversary ? (
                  <>
                    Happy Anniversary, my love! Today marks another month of our beautiful journey together.
                    <br />
                    From our first date to this moment, every day with you has been a gift.
                    <br />
                    Here's two months of love, laughter, and adventures together.
                    <br />
                    <br />
                    <b>With all my love, Rith 💕</b>
                  </>
                ) : (
                  <>
                    My sweetie, you light up my world every day with your love and
                    kindness.
                    <br />
                    I cherish every moment we share and look forward to many more.
                    <br />
                    Thank you for being my everything.
                    <br />
                    <br />
                    <b>Forever yours, Rith 💖</b>
                  </>
                )}
              </i>
            </div>

            {/* Anniversary Song Section */}
            {isAnniversary && (
              <div className="mt-3 p-3 rounded-3" style={{
                background: nightMode ? "#ffd70011" : "#fff9e6",
                border: nightMode ? "1px solid #ffd70033" : "1px solid #ff8c0033",
              }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isAnniversary ? (nightMode ? "#ffd700" : "#d2691e") : subColor }}>
                      🎵 Our Anniversary Song
                    </div>
                    <div style={{ fontSize: 12, color: isAnniversary ? (nightMode ? "#fff3cd" : "#8b4513") : noteColor }}>
                      "Perfect" - Ed Sheeran
                    </div>
                  </div>
                  <button
                    className="btn btn-sm"
                    style={{
                      color: anniversaryGold,
                      borderColor: anniversaryGold,
                      borderWidth: 1,
                      borderStyle: "solid",
                      background: "transparent",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: 12,
                      padding: "4px 12px",
                    }}
                    onClick={handleSongPlay}
                  >
                    {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                  </button>
                </div>
                {isPlaying && (
                  <div className="mt-2">
                    <div style={{ fontSize: 12, color: isAnniversary ? (nightMode ? "#fff3cd" : "#8b4513") : noteColor }}>
                      🎶 Now playing our special song... 🎶
                    </div>
                    <div className="mt-1" style={{ 
                      height: 3, 
                      background: nightMode ? "#ffd70033" : "#ff8c0033",
                      borderRadius: 2,
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        width: "100%",
                        background: anniversaryGold,
                        animation: "songProgress 4s linear infinite"
                      }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 text-end">
              <button
                className="btn btn-sm"
                style={{
                  color: isAnniversary ? anniversaryGold : buttonColor,
                  borderColor: isAnniversary ? anniversaryGold : buttonColor,
                  borderWidth: 1,
                  borderStyle: "solid",
                  background: "transparent",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                }}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      >
        <source src="./assets/music/anniversary-song.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Animations & Cute font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Pacifico:wght@400&family=Caveat:wght@700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes fadeinUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: none;}
        }
        @keyframes mailPop {
          0% { transform: scale(0.82) rotateX(35deg);}
          80% { transform: scale(1.06) rotateX(18deg);}
          100% { transform: scale(1) rotateX(18deg);}
        }
        @keyframes mailBounce {
          0%, 100% { transform: translateY(0);}
          16% { transform: translateY(-8px);}
          35% { transform: translateY(5px);}
          60% { transform: translateY(-2px);}
          80% { transform: translateY(2px);}
        }
        @keyframes songProgress {
          0% { transform: translateX(-100%);}
          100% { transform: translateX(100%);}
        }
      `}</style>
    </div>
  );
}

export default Mail;