import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  const [planItems, setPlanItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timelineTitle, setTimelineTitle] = useState('Love Timeline');

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ time: '', activity: '', details: '' });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Handle form submission
  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!newItem.time || !newItem.activity) {
      alert('Please fill in Time and Activity fields! 💖');
      return;
    }

    setSaving(true);
    try {
      const order = planItems.length; // Add to end
      await axios.post(`${API_URL}/timeline`, {
        time: newItem.time,
        activity: newItem.activity,
        details: newItem.details,
        order: order
      });

      // Reset form and refresh data
      setNewItem({ time: '', activity: '', details: '' });
      setShowAddForm(false);
      setSuccessMessage('✨ Your moment has been added! 💖');

      // Refresh timeline
      await fetchData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding timeline item:', error);
      alert('Failed to add timeline item. Please try again! 😢');
    } finally {
      setSaving(false);
    }
  };

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

  // Form styles
  const formBg = nightMode
    ? "linear-gradient(135deg, #1a1530 0%, #2d1f4e 100%)"
    : "linear-gradient(135deg, #fff5f9 0%, #ffe8f3 100%)";
  const inputBg = nightMode ? "#2a2045" : "#fff";
  const inputBorder = nightMode ? "#6d44b5" : "#ff69b4";
  const inputColor = nightMode ? "#e8e0ff" : "#333";
  const labelColor = nightMode ? "#b993ff" : "#ff69b4";

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
          {timelineTitle}
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

      {/* Success Message */}
      {successMessage && (
        <div
          style={{
            textAlign: 'center',
            padding: '12px 20px',
            marginBottom: 16,
            background: nightMode
              ? 'linear-gradient(135deg, #1e3a2f 0%, #2d4a3e 100%)'
              : 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
            borderRadius: 12,
            color: nightMode ? '#90ee90' : '#155724',
            fontWeight: 600,
            fontSize: '1rem',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Add New Item Button */}
      <div className="text-center mb-3">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '10px 24px',
            borderRadius: 25,
            border: 'none',
            background: showAddForm
              ? (nightMode ? 'linear-gradient(135deg, #4a3070, #3d2560)' : 'linear-gradient(135deg, #ff8fab, #ff69b4)')
              : (nightMode ? 'linear-gradient(135deg, #6d44b5, #8b5cf6)' : 'linear-gradient(135deg, #ff69b4, #ff1493)'),
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: nightMode
              ? '0 4px 15px rgba(139, 92, 246, 0.4)'
              : '0 4px 15px rgba(255, 105, 180, 0.4)',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
          }}
        >
          {showAddForm ? '✖️ Cancel' : '➕ Add Your Moment'}
        </button>
      </div>

      {/* Add New Item Form */}
      {showAddForm && (
        <div
          style={{
            background: formBg,
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 20,
            border: `2px solid ${inputBorder}`,
            boxShadow: nightMode
              ? '0 8px 32px rgba(109, 68, 181, 0.3)'
              : '0 8px 32px rgba(255, 105, 180, 0.2)',
          }}
          data-aos="fade-down"
        >
          <h4
            style={{
              margin: '0 0 16px',
              color: labelColor,
              fontWeight: 700,
              fontSize: '1.1rem',
              textAlign: 'center',
            }}
          >
            ✨ Add Your Special Moment 💕
          </h4>

          <form onSubmit={handleAddItem}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {/* Time Field */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 6,
                    color: labelColor,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  ⏰ Time
                </label>
                <input
                  type="text"
                  placeholder="e.g., 09:00 AM"
                  value={newItem.time}
                  onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `2px solid ${inputBorder}`,
                    background: inputBg,
                    color: inputColor,
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 3px ${nightMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 105, 180, 0.3)'}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Activity Field */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 6,
                    color: labelColor,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  💫 Activity
                </label>
                <input
                  type="text"
                  placeholder="e.g., Coffee Date ☕"
                  value={newItem.activity}
                  onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `2px solid ${inputBorder}`,
                    background: inputBg,
                    color: inputColor,
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 3px ${nightMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 105, 180, 0.3)'}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Details Field */}
            <div style={{ marginTop: 16 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: 6,
                  color: labelColor,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                📝 Details (Optional)
              </label>
              <textarea
                placeholder="Describe your special moment..."
                value={newItem.details}
                onChange={(e) => setNewItem({ ...newItem, details: e.target.value })}
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: `2px solid ${inputBorder}`,
                  background: inputBg,
                  color: inputColor,
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: "'Montserrat', sans-serif",
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 3px ${nightMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 105, 180, 0.3)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '12px 32px',
                  borderRadius: 25,
                  border: 'none',
                  background: nightMode
                    ? 'linear-gradient(135deg, #8b5cf6, #6d44b5)'
                    : 'linear-gradient(135deg, #ff69b4, #ff1493)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  boxShadow: nightMode
                    ? '0 4px 20px rgba(139, 92, 246, 0.5)'
                    : '0 4px 20px rgba(255, 105, 180, 0.5)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {saving ? '💫 Adding...' : '💖 Add to Timeline'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💖✨</div>
          <p style={{ color: nightMode ? '#b993ff' : '#ff69b4', fontSize: '1.1rem' }}>
            Loading {timelineTitle}...
          </p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {planItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💕</div>
              <p style={{ color: nightMode ? '#b993ff' : '#ff69b4', fontSize: '1.1rem' }}>
                No moments yet! Be the first to add one 💖
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
          )}
        </>
      )}
    </div>
  );
}

export default Plan;
