function Footer({ nightMode, currentTheme, appearance }) {
  // Use dynamic settings
  const footerText = appearance?.footerText || "Made with ❤️";
  const footerYear = appearance?.footerYear || new Date().getFullYear();
  const socialLinks = appearance?.socialLinks || [];

  // Get theme colors or fallback to nightMode defaults
  const primaryColor = currentTheme?.colors?.primary || (nightMode ? "#a77dfd" : "#ff69b4");
  const accentColor = currentTheme?.colors?.accent || (nightMode ? "#bfa7fc" : "#ffb3d6");

  // Check if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 500;

  const style = nightMode
    ? {
      background: `linear-gradient(90deg, ${currentTheme?.colors?.headerBg || 'rgba(32, 25, 70, 0.95)'} 60%, rgba(57, 32, 92, 0.95) 100%)`,
      color: currentTheme?.colors?.titleColor || "#cfaeff",
      borderTop: `1px solid ${primaryColor}40`,
      padding: isMobile ? "1rem 0 0.8rem 0" : "1.5rem 0 1rem 0",
      boxShadow: `0 -2px 24px 0 ${primaryColor}29`,
      transition: "all 0.3s cubic-bezier(.45,.07,.7,1)",
    }
    : {
      background: `linear-gradient(90deg, ${currentTheme?.colors?.headerBg || 'rgba(255, 224, 244, 0.95)'} 60%, rgba(255, 246, 251, 0.95) 100%)`,
      color: currentTheme?.colors?.titleColor || "#db339b",
      borderTop: `1px solid ${accentColor}`,
      padding: isMobile ? "1rem 0 0.8rem 0" : "1.5rem 0 1rem 0",
      boxShadow: `0 -2px 24px 0 ${primaryColor}30`,
      transition: "all 0.3s cubic-bezier(.45,.07,.7,1)",
    };

  return (
    <footer style={style}>
      {/* Social Links */}
      {socialLinks.length > 0 && socialLinks.some(link => link.url) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          {socialLinks.filter(link => link.url).map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "1.5rem",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
              title={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
      )}

      {/* Footer Text */}
      <div
        style={{
          fontWeight: 600,
          fontFamily: "inherit",
          fontSize: isMobile ? "1rem" : "1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "0.03em",
          marginBottom: isMobile ? 6 : 8,
          gap: isMobile ? 6 : 8,
        }}
      >
        {footerText}
      </div>

      {/* Copyright */}
      <div
        className="text-center"
        style={{
          color: nightMode ? "#c5bff2" : "#ba7bc9",
          fontSize: isMobile ? "0.8em" : "0.9em",
          fontWeight: 600,
          opacity: 0.75,
          letterSpacing: "0.02em",
        }}
      >
        © {footerYear} {appearance?.appName || "Memory Album"}
      </div>
    </footer>
  );
}

export default Footer;
