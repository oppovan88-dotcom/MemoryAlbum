import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Calculate age from birth date
const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Calculate zodiac sign from birth date
const calculateZodiac = (birthDate) => {
  if (!birthDate) return { sign: 'Unknown', emoji: '✨' };
  const birth = new Date(birthDate);
  const month = birth.getMonth() + 1; // JavaScript months are 0-indexed
  const day = birth.getDate();

  // Zodiac signs based on the zodiac chart
  if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) return { sign: 'Aries', emoji: '♈' };
  if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return { sign: 'Taurus', emoji: '♉' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: 'Gemini', emoji: '♊' };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: 'Cancer', emoji: '♋' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Leo', emoji: '♌' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Virgo', emoji: '♍' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: 'Libra', emoji: '♎' };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 22)) return { sign: 'Scorpio', emoji: '♏' };
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return { sign: 'Sagittarius', emoji: '♐' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: 'Capricorn', emoji: '♑' };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 19)) return { sign: 'Aquarius', emoji: '♒' };
  if ((month === 2 && day >= 20) || (month === 3 && day <= 20)) return { sign: 'Pisces', emoji: '♓' };

  return { sign: 'Unknown', emoji: '✨' };
};

export default function Relationship({ nightMode }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 60,
    });

    // Fetch settings from API
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/settings`);
        setSettings(res.data);
      } catch (err) {
        console.log("Using default settings");
        // Use defaults if API fails
        setSettings({
          person1Name: 'Rith',
          person1BirthDate: '2005-03-15',
          person1Gender: '♂',
          person1Photo: './assets/images/1.jpg',
          person1Tagline: 'Rith Ft Ry',
          person2Name: 'Chanry',
          person2BirthDate: '2006-04-01',
          person2Gender: '♀',
          person2Photo: './assets/images/7.jpg',
          person2Tagline: 'Ry Ft Rith',
          relationshipDate: '2025-05-13',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading || !settings) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <span style={{ fontSize: 40 }}>💕</span>
        <p>Loading...</p>
      </div>
    );
  }

  // Calculate age and zodiac from birth dates
  const person1Age = calculateAge(settings.person1BirthDate);
  const person1Zodiac = calculateZodiac(settings.person1BirthDate);
  const person2Age = calculateAge(settings.person2BirthDate);
  const person2Zodiac = calculateZodiac(settings.person2BirthDate);

  const since = settings.relationshipDate;
  const days = Math.floor(
    (Date.now() - new Date(since)) / (1000 * 60 * 60 * 24)
  );

  // Colors based on night mode
  const heartColor = nightMode ? "#b993ff" : "#ff69b4";
  const headingColor = nightMode ? "#b993ff" : "#ff69b4";
  const shadow = nightMode ? "0 2px 32px #8f6dfb26" : "0 2px 24px #ffb3c65c";
  const bubbleColor = nightMode ? "#d3c6fc" : "#ea4c89";
  const badgeBgRith = nightMode ? "#443264" : "#ffb3c6";
  const badgeBgChanry = nightMode ? "#6958b9" : "#FFD6E0";
  const badgeBgPisces = nightMode ? "#7f53ff" : "#A0C4FF";
  const badgeBgAries = nightMode ? "#b993ff" : "#BDB2FF";
  const badgeColor = "#fff";
  const nameColor = bubbleColor;

  // Text style for single line text below images
  const singleLineTextStyle = {
    color: bubbleColor,
    fontFamily: "'Caveat', cursive",
    fontSize: "1.1rem",
    whiteSpace: "nowrap",
    marginTop: "8px",
    fontWeight: 600,
    textAlign: "center",
  };

  return (
    <div
      className="relationship-main-card mx-auto"
      style={{
        borderRadius: 22,
        boxShadow: "none",
        padding: "0 0 10px 0",
        marginBottom: 28,
        maxWidth: 1200,
        transition: "box-shadow 0.3s",
      }}
    >
      {/* Relationship Heading */}
      <h2
        className="fw-bold mb-4 text-center"
        style={{
          fontFamily: "'Quicksand', cursive, sans-serif",
          fontWeight: 700,
          fontSize: "2.5rem",
          letterSpacing: "1px",
          color: headingColor,
          textShadow: nightMode
            ? "0 2px 22px #7f53ff77, 0 1px 0 #fff"
            : "0 2px 16px #fff4, 0 1px 0 #fff",
        }}
        data-aos="fade-down"
      >
        <span role="img" aria-label="sparkle">
          ✨
        </span>{" "}
        Relationship{" "}
        <span role="img" aria-label="sparkle">
          ✨
        </span>
      </h2>
      <div className="container-fluid py-4">
        <div className="row flex-nowrap justify-content-center align-items-end relationship-row-scroll">
          {/* Person 1 */}
          <div
            className="col-12 col-md-4 d-flex flex-column align-items-center px-3 py-3"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <img
              src={settings.person1Photo}
              alt={settings.person1Name}
              className="rounded-circle shadow"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                border: "6px solid #fff",
                background: "#fff",
                boxShadow: shadow,
              }}
            />
            <div
              style={{
                color: nameColor,
                fontFamily: "'Caveat', cursive",
                fontSize: "2rem",
                textShadow: "0 2px 8px #fff8",
                margin: "16px 0 8px 0",
                fontWeight: 700,
              }}
            >
              {settings.person1Name}
            </div>
            <div className="d-flex gap-2 mb-3">
              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background: badgeBgRith,
                  color: badgeColor,
                  fontSize: 18,
                  letterSpacing: 1,
                }}
              >
                {settings.person1Gender} {person1Age}
              </span>
              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background: badgeBgPisces,
                  color: badgeColor,
                  fontSize: 18,
                  letterSpacing: 1,
                }}
              >
                {person1Zodiac.emoji} {person1Zodiac.sign}
              </span>
            </div>
            {/* Single line text below image */}
            <div
              style={singleLineTextStyle}
              data-aos="fade-right"
              data-aos-delay="300"
            >
              {settings.person1Tagline}
            </div>
          </div>
          {/* Center Heart/Date */}
          <div
            className="col-12 col-md-4 d-flex flex-column align-items-center justify-content-center py-4"
            data-aos="zoom-in"
            data-aos-delay="250"
          >
            <span
              style={{
                fontSize: "60px",
                color: heartColor,
                textShadow: nightMode
                  ? "0 4px 28px #7f53ff77"
                  : "0 4px 20px #fff6",
                marginBottom: 10,
                marginTop: 6,
                animation: "beat 1.2s infinite",
                display: "block",
              }}
              role="img"
              aria-label="heart"
            >
              💖
            </span>
            <div className="since-cute" style={{ textAlign: "center" }}>
              <span className="since-date" style={{ fontWeight: 700 }}>
                {since}
              </span>
              <br />
              <span
                className="since-days"
                style={{
                  fontSize: "1rem",
                  color: nightMode ? "#d6ccff" : "#a376c8",
                }}
              >
                ({days} days)
              </span>
            </div>
            <div style={{ fontSize: "1.8rem", marginTop: 8 }}>🧑‍🤝‍🧑</div>
          </div>
          {/* Person 2 */}
          <div
            className="col-12 col-md-4 d-flex flex-column align-items-center px-3 py-3"
            data-aos="fade-up"
            data-aos-delay="170"
          >
            <img
              src={settings.person2Photo}
              alt={settings.person2Name}
              className="rounded-circle shadow"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                border: "6px solid #fff",
                background: "#fff",
                boxShadow: shadow,
              }}
            />
            <div
              style={{
                color: nameColor,
                fontFamily: "'Caveat', cursive",
                fontSize: "2rem",
                textShadow: "0 2px 8px #fff8",
                margin: "16px 0 8px 0",
                fontWeight: 700,
              }}
            >
              {settings.person2Name}
            </div>
            <div className="d-flex gap-2 mb-3">
              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background: badgeBgChanry,
                  color: badgeColor,
                  fontSize: 18,
                  letterSpacing: 1,
                }}
              >
                {settings.person2Gender} {person2Age}
              </span>
              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background: badgeBgAries,
                  color: badgeColor,
                  fontSize: 18,
                  letterSpacing: 1,
                }}
              >
                {person2Zodiac.emoji} {person2Zodiac.sign}
              </span>
            </div>
            {/* Single line text below image */}
            <div
              style={singleLineTextStyle}
              data-aos="fade-left"
              data-aos-delay="350"
            >
              {settings.person2Tagline}
            </div>
          </div>
        </div>
      </div>
      {/* Google Fonts link (optional if not in index.html) */}
      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700&family=Caveat:wght@700&display=swap"
        rel="stylesheet"
      />
      {/* Heart Beat Animation */}
      <style>{`
        @keyframes beat {
          0%, 100% { transform: scale(1);}
          20% { transform: scale(1.12);}
          40% { transform: scale(0.96);}
          60% { transform: scale(1.10);}
          80% { transform: scale(0.97);}
        }
      `}</style>
    </div>
  );
}
