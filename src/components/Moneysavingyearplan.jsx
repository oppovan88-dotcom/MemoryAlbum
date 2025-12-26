import React from "react";
import { addDays, getDay, getDaysInMonth } from "date-fns";

// --- CONFIGURATION ---
const YEAR = 2025;
const WEEKS = 26;
const FIRST_PAY_DATE = new Date(2025, 6, 6);

const months = [
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const daysShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getPayDates() {
  let payDates = [];
  for (let i = 0; i < WEEKS; i++) {
    payDates.push(addDays(FIRST_PAY_DATE, i * 7));
  }
  return payDates;
}
const payDates = getPayDates();

const BlueTick = ({ nightMode }) => (
  <span
    style={{
      color: nightMode ? "#b993ff" : "#2196f3",
      fontWeight: 900,
      fontSize: "1.2em",
      marginLeft: 1,
      filter: nightMode ? "drop-shadow(0 1px 4px #b993ff88)" : undefined,
    }}
  >
    ✔️
  </span>
);

function Calendar2025WithTicks({ nightMode }) {
  // Only card background is set, everything else is transparent!
  const cardBg = nightMode
    ? "linear-gradient(135deg, #231d44 80%, #41296b 100%)"
    : "#fff";
  const accent = nightMode ? "#b993ff" : "#ff69b4";
  const tickBg = nightMode ? "rgba(185,147,255,0.07)" : "#e3f4fd";
  const tickColor = nightMode ? "#b993ff" : "#1c90ff";
  const border = nightMode ? "1.5px solid #634e99" : "1.5px solid #ffd5ea";
  const shadow = nightMode ? "0 3px 18px #7f53ff2c" : "0 3px 18px #bcd7e530";
  const textColor = nightMode ? "#d3c6fc" : "#935246";
  const subColor = nightMode ? "#9a85c6" : "#b68a7b";

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "30px auto",
        fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif",
        padding: 10,
        background: "transparent", // main container has no bg
        borderRadius: 16,
        transition: "background 0.3s",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.1rem",
          letterSpacing: "4px",
          fontWeight: 900,
          marginBottom: 12,
          color: textColor,
          textShadow: nightMode ? "0 2px 8px #7f53ff44" : "0 2px 8px #ff69b422",
        }}
      >
        2025
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
        }}
      >
        {months.map((month, mi) => {
          const jsMonthIndex = mi + 6;
          return (
            <div
              key={month}
              style={{
                width: 270,
                minWidth: 180,
                background: cardBg, // only this has bg!
                borderRadius: 12,
                boxShadow: shadow,
                marginBottom: 20,
                padding: "10px 8px 20px 8px",
                border: border,
                transition: "background 0.3s, border 0.3s",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1.09rem",
                  color: accent,
                  marginBottom: 5,
                  letterSpacing: "1px",
                }}
              >
                {month}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  fontSize: "1.05em",
                  marginBottom: 2,
                }}
              >
                {daysShort.map((d) => (
                  <div
                    key={d}
                    style={{
                      textAlign: "center",
                      color: subColor,
                      fontWeight: 500,
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  fontSize: "1em",
                }}
              >
                {(() => {
                  const firstDayOfMonth = new Date(YEAR, jsMonthIndex, 1);
                  const blanks = getDay(firstDayOfMonth);
                  let items = [];
                  for (let i = 0; i < blanks; i++) {
                    items.push(<div key={"b" + i}></div>);
                  }
                  const daysInMonth = getDaysInMonth(firstDayOfMonth);
                  for (let d = 1; d <= daysInMonth; d++) {
                    const thisDay = new Date(YEAR, jsMonthIndex, d);
                    const tick = payDates.find(
                      (pd) =>
                        pd.getFullYear() === thisDay.getFullYear() &&
                        pd.getMonth() === thisDay.getMonth() &&
                        pd.getDate() === thisDay.getDate()
                    );
                    items.push(
                      <div
                        key={d}
                        style={{
                          padding: "2.5px 0",
                          borderRadius: tick ? 7 : 0,
                          background: tick ? tickBg : undefined,
                          color: tick
                            ? tickColor
                            : nightMode
                            ? "#b9b9da"
                            : "#444",
                          fontWeight: tick ? 700 : 400,
                          textAlign: "center",
                          position: "relative",
                          border: tick ? `1.5px solid ${accent}` : undefined,
                          transition: "all 0.3s",
                        }}
                      >
                        {d}
                        {tick && <BlueTick nightMode={nightMode} />}
                      </div>
                    );
                  }
                  return items;
                })()}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 15,
          color: subColor,
        }}
      >
        <b style={{ color: accent }}>✔️</b> = Payment date for saving plan
        <br />
        <span style={{ color: textColor }}>
          Start: {FIRST_PAY_DATE.toLocaleDateString("en-GB")}
        </span>
      </div>
    </div>
  );
}

export default Calendar2025WithTicks;
