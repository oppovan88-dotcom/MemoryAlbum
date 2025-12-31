import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://memoryalbum-wi0j.onrender.com/api';

const BlueTick = ({ nightMode, primaryColor }) => (
  <span
    role="img"
    aria-label="success"
    style={{
      color: primaryColor || (nightMode ? "#b993ff" : "#249af7"),
      fontWeight: "bold",
      fontSize: 17,
      verticalAlign: "middle",
      marginLeft: 6,
      filter: `drop-shadow(0 1px 4px ${primaryColor}88)`,
    }}
  >
    ✔️
  </span>
);

function Plan({ nightMode, currentTheme }) {
  const [planItems, setPlanItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timelineTitle, setTimelineTitle] = useState('Love Timeline');

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 60 });
  }, []);

  const fetchData = async () => {
    try {
      // Fetch both timeline items and settings in parallel
      const [timelineResponse, settingsResponse] = await Promise.all([
        axios.get(`${API_URL}/timeline`),
        axios.get(`${API_URL}/settings`)
      ]);

      setPlanItems(timelineResponse.data);

      // Use the dynamic timeline title from settings
      if (settingsResponse.data?.timelineTitle) {
        setTimelineTitle(settingsResponse.data.timelineTitle);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to empty array if API fails
      setPlanItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get theme colors with fallbacks
  const primaryColor = currentTheme?.colors?.primary || (nightMode ? "#b993ff" : "#ff69b4");
  const accentColor = currentTheme?.colors?.accent || (nightMode ? "#7f53ff" : "#fd2d6c");
  const titleColor = currentTheme?.colors?.titleColor || primaryColor;

  // Card styles based on theme
  const cardBg = nightMode
    ? `linear-gradient(135deg, ${accentColor}15 60%, ${primaryColor}20 100%)`
    : `linear-gradient(135deg, ${primaryColor}10 70%, ${accentColor}15 100%)`;
  const cardBorder = `2.5px solid ${primaryColor}`;
  const cardShadow = `0 2px 12px ${primaryColor}33`;
  const cardShadowHover = `0 6px 28px ${primaryColor}55`;
  const timeColor = nightMode ? primaryColor : accentColor;
  const activityColor = primaryColor;
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
            color: titleColor,
            textShadow: `0 2px 12px ${primaryColor}22`,
            filter: `drop-shadow(0 2px 10px ${primaryColor}15)`,
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
              filter: `drop-shadow(0 0 8px ${primaryColor}33)`,
            }}
          >
            💖
          </span>
          {timelineTitle}
          <span
            role="img"
            aria-label="sparkle"
            style={{
              fontSize: 19,
              verticalAlign: "middle",
              marginLeft: 7,
              filter: `drop-shadow(0 0 6px ${primaryColor}44)`,
            }}
          >
            ✨
          </span>
        </span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💖✨</div>
          <p style={{ color: primaryColor, fontSize: '1.1rem' }}>
            Loading {timelineTitle}...
          </p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {planItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💕</div>
              <p style={{ color: primaryColor, fontSize: '1.1rem' }}>
                No moments yet! Check back soon 💖
              </p>
            </div>
          ) : (
            /* Timeline Cards */
            <div className="row g-2">
              {planItems.map((item, idx) => (
                <div
                  key={item._id || idx}
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
                      <BlueTick nightMode={nightMode} primaryColor={primaryColor} />
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
          )}
        </>
      )}
    </div>
  );
}

export default Plan;
