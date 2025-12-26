function Footer({ nightMode }) {
  const style = nightMode
    ? {
        background: "linear-gradient(90deg,#201946 60%,#39205c 100%)",
        color: "#cfaeff",
        borderTop: "1px solid #45336b",
        padding: "1.1rem 0 0.8rem 0",
        boxShadow: "0 -2px 24px 0 #7d53d229",
        transition: "all 0.3s cubic-bezier(.45,.07,.7,1)",
      }
    : {
        background: "linear-gradient(90deg,#ffe0f4 60%,#fff6fb 100%)",
        color: "#db339b",
        borderTop: "1px solid #ffd5ea",
        padding: "1.1rem 0 0.8rem 0",
        boxShadow: "0 -2px 24px 0 #ffe6fa77",
        transition: "all 0.3s cubic-bezier(.45,.07,.7,1)",
      };

  // You can tweak the style below if you want, or keep it as is!
  return (
    <footer style={style}>
      <div
        style={{
          fontWeight: 600,
          fontFamily: "inherit",
          fontSize: "1.3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "0.03em",
          marginBottom: 8,
          gap: 8,
        }}
      >
        Sovan Narith{" "}
        <span
          style={{
            fontSize: "1.6em",
            verticalAlign: "middle",
            margin: "0 4px",
            filter: nightMode
              ? "drop-shadow(0 0 8px #bb69d6)"
              : "drop-shadow(0 0 5px #ffb5e7)",
            transition: "filter 0.2s",
          }}
        >
          ❤️
        </span>{" "}
        Vy Chanry
      </div>
      <div
        className="text-center"
        style={{
          color: nightMode ? "#c5bff2" : "#ba7bc9",
          fontSize: "1em",
          fontWeight: 600,
          opacity: 0.75,
          letterSpacing: "0.02em",
        }}
      >
        © 2025 by rith dev
      </div>
    </footer>
  );
}

export default Footer;
