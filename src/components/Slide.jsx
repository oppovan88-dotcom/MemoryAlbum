import { Carousel } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";

const images = [
  { src: "assets/images/slide_1.jpg", alt: "First slide" },
  { src: "assets/images/11.jpg", alt: "Second slide" },
  { src: "assets/images/10.jpg", alt: "Third slide" },
];

const SLIDE_TIME = 2000;

const Slide = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const timer = useRef();

  useEffect(() => {
    timer.current = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % images.length);
    }, SLIDE_TIME);
    return () => clearTimeout(timer.current);
  }, [activeIdx]);

  return (
    <div
      className="container py-4"
      style={{
        maxWidth: 520,
        position: "relative",
        minHeight: 340,
      }}
    >
      {/* Rainbow border carousel */}
      <Carousel
        activeIndex={activeIdx}
        onSelect={setActiveIdx}
        fade
        controls={false}
        indicators={false}
        interval={null}
      >
        {images.map((img, idx) => (
          <Carousel.Item key={img.src}>
            <div
              className="rainbow-border mx-auto"
              style={{
                borderRadius: 36,
                margin: "0 auto",
                maxWidth: 410,
                boxShadow: "0 10px 38px #ffb3d640, 0 3px 18px #fff6",
                padding: 0,
                position: "relative",
                // For best effect, use some margin for the rainbow
              }}
            >
              <img
                className="d-block w-100 carousel-img-fit"
                src={img.src}
                alt={img.alt}
                style={{
                  borderRadius: 32,
                  objectFit: "cover",
                  height: 315,
                  background: "#fff8fc",
                  position: "relative",
                  zIndex: 2,
                  boxShadow: "0 2px 16px #fff7",
                }}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Rainbow border CSS */}
      <style>{`
        .rainbow-border {
          position: relative;
          width: 100%;
          padding: 0.35rem;
          box-sizing: border-box;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rainbow-border::before {
          content: "";
          position: absolute;
          inset: -6px; /* makes the rainbow outside the image */
          z-index: 1;
          border-radius: 38px;
          background: conic-gradient(
            #ff4d4d, #ffcc00, #33cc33, #00ccff, #cc66ff, #ff4d4d
          );
          filter: blur(8px) brightness(1.07) saturate(1.5);
          animation: rainbow-spin 4.2s linear infinite;
        }
        @keyframes rainbow-spin {
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default Slide;
