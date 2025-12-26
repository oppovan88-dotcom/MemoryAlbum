import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const planItems = [
  {
    time: "07:00 AM",
    activity: "Messenger and TikTok 📱",
    details: "Good Morning",
  },
  {
    time: "08:30 AM",
    activity: "Make Up 💄",
    details: "Repair Yourself to go",
  },
  {
    time: "09:00 AM",
    activity: "Arrived 🚗",
    details: "Go To Chip Mong (Watched Movie)",
  },
  { time: "10:00 AM", activity: "Movie Time 🎬", details: "រឿង សងដៃខ្ញុំវិញ" },
  { time: "12:00 PM", activity: "Movie Time 🍿", details: "F1 Hall Gaint" },
  {
    time: "03:00 PM",
    activity: "Relaxed 🎮",
    details: "Play Games and Eating some Food",
  },
  {
    time: "05:00 PM",
    activity: "Back Home 🏠",
    details: "We go home and talking some fun",
  },
];

const BlueTick = ({ nightMode }) => (
  <span
    role="img"
    aria-label="success"
    style={{
      color: nightMode ? "#b993ff" : "#249af7",
      fontWeight: "bold",
      fontSize: 17,
      verticalAlign: "middle",
      marginLeft: 6,
      filter: nightMode
        ? "drop-shadow(0 1px 4px #b993ff88)"
        : "drop-shadow(0 1px 2px #9cd4ff77)",
    }}
  >
    ✔️
  </span>
);

function Plan({ nightMode }) {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 60 });
  }, []);

  // Card background: pink in light mode, galaxy in night mode
  const cardBg = nightMode
    ? "linear-gradient(135deg, #221c3d 60%, #311c50 100%)"
    : "linear-gradient(135deg, #fff0fa 70%, #ffd6e9 100%)";
  const cardBorder = nightMode ? "2.5px solid #6d44b5" : "3px solid #ff69b4";
  const cardShadow = nightMode ? "0 2px 12px #7f53ff33" : "0 2px 8px #ffe6ee22";
  const cardShadowHover = nightMode
    ? "0 6px 28px #b993ff44"
    : "0 6px 20px #ffd6e480";
  const timeColor = nightMode ? "#c3b2ff" : "#ff69b4";
  const activityColor = nightMode ? "#b993ff" : "#fd2d6c";
  const detailsColor = nightMode ? "#b9b6d6" : "#474747";

  return (
    <div
      className="container pt-2 pb-2"
      style={{ maxWidth: 920, fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Header */}
      <div className="text-center mb-3">
        <span
          style={{
            fontFamily: "'Montserrat', 'Poppins', cursive, sans-serif",
            fontWeight: 800,
            fontSize: "1.35rem",
            letterSpacing: "1.5px",
            color: nightMode ? "#b993ff" : "#ff69b4",
            textShadow: nightMode
              ? "0 2px 12px #7f53ff22"
              : "0 2px 8px #ff69b410",
            filter: nightMode
              ? "drop-shadow(0 2px 10px #a07cff11)"
              : "drop-shadow(0 2px 10px #fff3)",
            opacity: 0.97,
          }}
        >
          <span
            role="img"
            aria-label="heart"
            style={{
              fontSize: 22,
              verticalAlign: "middle",
              marginRight: 7,
              filter: nightMode ? "drop-shadow(0 0 8px #b993ff33)" : undefined,
            }}
          >
            💖
          </span>
          Love Timeline
          <span
            role="img"
            aria-label="sparkle"
            style={{
              fontSize: 19,
              verticalAlign: "middle",
              marginLeft: 7,
              filter: nightMode ? "drop-shadow(0 0 6px #b993ff44)" : undefined,
            }}
          >
            ✨
          </span>
        </span>
      </div>

      {/* Timeline Cards */}
      <div className="row g-2">
        {planItems.map((item, idx) => (
          <div
            key={idx}
            className="col-12 col-md-4 d-flex"
            data-aos="fade-up"
            data-aos-delay={idx * 60}
          >
            <div
              className="w-100"
              style={{
                borderLeft: cardBorder,
                background: cardBg,
                borderRadius: 12,
                padding: "11px 14px",
                marginBottom: 2,
                minHeight: 80,
                fontFamily: "'Montserrat', sans-serif",
                boxShadow: cardShadow,
                transition: "box-shadow 0.14s, transform 0.14s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = cardShadowHover;
                e.currentTarget.style.transform =
                  "translateY(-2px) scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = cardShadow;
                e.currentTarget.style.transform = "none";
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: timeColor,
                  fontSize: 14.2,
                  marginBottom: 1,
                  letterSpacing: 0.7,
                }}
              >
                {item.time}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: activityColor,
                  fontSize: 13.8,
                  marginBottom: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span>{item.activity}</span>
                <BlueTick nightMode={nightMode} />
              </div>
              <div
                style={{
                  color: detailsColor,
                  fontSize: 12.8,
                  marginTop: 1,
                  opacity: 0.94,
                  fontWeight: 500,
                }}
              >
                {item.details}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Plan;
