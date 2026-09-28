"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────
   Ransom-note letter definitions
   Each letter has its own bg, color, font,
   size, rotation, and padding.
───────────────────────────────────────────── */
const LINES: { letter: string; bg: string; color: string; font: string; size: string; rotate: string; px: string; py: string; mt?: string }[][] = [
  // Line 1: T H i N G S
  [
    { letter: "T", bg: "#F5C842", color: "#1a1a1a", font: "'Georgia', serif",           size: "2.4rem", rotate: "rotate(2deg)",   px: "10px", py: "4px" },
    { letter: "H", bg: "#2A9D8F", color: "#ffffff", font: "'Arial Black', sans-serif",  size: "2rem",   rotate: "rotate(-3deg)",  px: "9px",  py: "5px" },
    { letter: "i", bg: "#F1E8D0", color: "#8B1A1A", font: "'Times New Roman', serif",   size: "2.6rem", rotate: "rotate(1deg)",   px: "11px", py: "3px" },
    { letter: "N", bg: "#ffffff", color: "#1a1a1a", font: "'Impact', sans-serif",       size: "2.1rem", rotate: "rotate(-2deg)",  px: "8px",  py: "5px" },
    { letter: "G", bg: "#C1121F", color: "#ffffff", font: "'Verdana', sans-serif",      size: "2.3rem", rotate: "rotate(3deg)",   px: "9px",  py: "4px" },
    { letter: "S", bg: "#1a1a1a", color: "#F5C842", font: "'Arial Black', sans-serif",  size: "2rem",   rotate: "rotate(-1deg)",  px: "10px", py: "5px" },
  ],
  // Line 2: I
  [
    { letter: "I", bg: "#2A9D8F", color: "#F1E8D0", font: "'Georgia', serif",           size: "2.5rem", rotate: "rotate(-2deg)",  px: "18px", py: "4px" },
  ],
  // Line 3: N E V E R
  [
    { letter: "N", bg: "#F1E8D0", color: "#1a1a1a", font: "'Courier New', monospace",   size: "2rem",   rotate: "rotate(2deg)",   px: "9px",  py: "5px" },
    { letter: "E", bg: "#F5C842", color: "#1a1a1a", font: "'Impact', sans-serif",       size: "2.2rem", rotate: "rotate(-3deg)",  px: "10px", py: "4px" },
    { letter: "V", bg: "#ffffff", color: "#2A9D8F", font: "'Georgia', serif",           size: "2.3rem", rotate: "rotate(2deg)",   px: "9px",  py: "4px" },
    { letter: "E", bg: "#C1121F", color: "#ffffff", font: "'Arial Black', sans-serif",  size: "2rem",   rotate: "rotate(-1deg)",  px: "10px", py: "5px" },
    { letter: "R", bg: "#F1E8D0", color: "#1a1a1a", font: "'Times New Roman', serif",   size: "2.4rem", rotate: "rotate(3deg)",   px: "10px", py: "4px" },
  ],
  // Line 4: S A i D ❤
  [
    { letter: "S", bg: "#F5C842", color: "#1a1a1a", font: "'Arial Black', sans-serif",  size: "2.1rem", rotate: "rotate(-2deg)",  px: "10px", py: "5px" },
    { letter: "A", bg: "#ffffff", color: "#C1121F", font: "'Georgia', serif",           size: "2.3rem", rotate: "rotate(2deg)",   px: "9px",  py: "4px" },
    { letter: "i", bg: "#2A9D8F", color: "#F1E8D0", font: "'Courier New', monospace",   size: "2.5rem", rotate: "rotate(-1deg)",  px: "11px", py: "3px" },
    { letter: "D", bg: "#F1E8D0", color: "#1a1a1a", font: "'Times New Roman', serif",   size: "2.2rem", rotate: "rotate(3deg)",   px: "9px",  py: "5px" },
  ],
];

/* ─────────────────────────────────────────────
   Star sticker positions
───────────────────────────────────────────── */
const STARS = [
  { top: "6%",  left: "10%", size: 18, color: "#FFD700", rotate: 15  },
  { top: "4%",  left: "42%", size: 11, color: "#ffffff", rotate: -20 },
  { top: "7%",  left: "68%", size: 15, color: "#FFD700", rotate: 35  },
  { top: "5%",  left: "82%", size: 13, color: "#1a1a1a", rotate: -10 },
  { top: "13%", left: "88%", size: 10, color: "#FFD700", rotate: 50  },
  { top: "80%", left: "8%",  size: 16, color: "#FFD700", rotate: -15 },
  { top: "87%", left: "28%", size: 10, color: "#1a1a1a", rotate: 20  },
  { top: "84%", left: "55%", size: 12, color: "#ffffff", rotate: -30 },
  { top: "89%", left: "72%", size: 14, color: "#FFD700", rotate: 10  },
  { top: "82%", left: "88%", size: 11, color: "#1a1a1a", rotate: 45  },
  { top: "91%", left: "92%", size: 16, color: "#ffffff", rotate: -5  },
  { top: "50%", left: "5%",  size: 9,  color: "#FFD700", rotate: 30  },
  { top: "35%", left: "92%", size: 11, color: "#1a1a1a", rotate: -25 },
  { top: "65%", left: "90%", size: 8,  color: "#FFD700", rotate: 55  },
];

/* ─────────────────────────────────────────────
   Water stain blob positions
───────────────────────────────────────────── */
const STAINS = [
  { top: "8%",  left: "60%", w: 70,  h: 55,  opacity: 0.12 },
  { top: "18%", left: "64%", w: 50,  h: 40,  opacity: 0.08 },
  { top: "70%", left: "15%", w: 60,  h: 45,  opacity: 0.10 },
  { top: "60%", left: "72%", w: 40,  h: 30,  opacity: 0.07 },
];

/* ─────────────────────────────────────────────
   Page content (what shows when book opens)
───────────────────────────────────────────── */
const PAGE_ENTRIES = [
  { emoji: "🎂", title: "Happy Birthday!", body: "I never told you how much your laugh lights up every room — every single time, without fail." },
  { emoji: "🌟", title: "The Thing About You", body: "You always know when someone needs a hug without them saying a word. That's a superpower." },
  { emoji: "🙏", title: "I Should've Said This", body: "Thank you. For being patient. For showing up even when it was hard. I never said it enough." },
  { emoji: "💖", title: "One More Thing", body: "You make ordinary days feel worth remembering. I'm genuinely, deeply glad you exist." },
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function StarSticker({ top, left, size, color, rotate }: typeof STARS[0]) {
  return (
    <span
      style={{
        position: "absolute",
        top, left,
        fontSize: size,
        color,
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
        userSelect: "none",
        pointerEvents: "none",
        animation: "starContinuousSpin 4s linear infinite",
        animationDelay: `${Math.random() * 2}s`,
        lineHeight: 1,
        zIndex: 4,
        display: "inline-block",
        transformOrigin: "center center",
      }}
    >★</span>
  );
}

function WaterStain({ top, left, w, h, opacity }: typeof STAINS[0]) {
  return (
    <div
      style={{
        position: "absolute",
        top, left,
        width: w,
        height: h,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(60,20,10,1) 0%, transparent 70%)",
        opacity,
        transform: `rotate(${Math.random() * 30 - 15}deg) scale(1, 0.6)`,
        pointerEvents: "none",
        zIndex: 1,
        filter: "blur(2px)",
      }}
    />
  );
}

function CollageLetters() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      position: "relative",
      zIndex: 3,
    }}>
      {LINES.map((line, li) => (
        <div key={li} style={{ display: "flex", gap: "5px", alignItems: "flex-end", justifyContent: "center" }}>
          {line.map((l, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                background: l.bg,
                color: l.color,
                fontFamily: l.font,
                fontSize: l.size,
                fontWeight: "bold",
                transform: l.rotate,
                padding: `${l.py} ${l.px}`,
                boxShadow: "2px 3px 6px rgba(0,0,0,0.5), 1px 1px 0 rgba(0,0,0,0.2)",
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
                // Simulate slightly rough cut edges
                clipPath: i % 3 === 0
                  ? "polygon(1% 0%, 99% 1%, 100% 99%, 0% 100%)"
                  : i % 3 === 1
                  ? "polygon(0% 1%, 100% 0%, 99% 100%, 1% 99%)"
                  : "polygon(1% 1%, 99% 0%, 100% 100%, 0% 99%)",
              }}
            >
              {l.letter}
            </span>
          ))}
          {/* Heart beside last line */}
          {li === LINES.length - 1 && (
            <span style={{
              fontSize: "2rem",
              color: "#C1121F",
              filter: "drop-shadow(1px 2px 3px rgba(0,0,0,0.5))",
              animation: "heartbeat 1.8s ease-in-out infinite",
              marginLeft: "4px",
              alignSelf: "center",
            }}>❤</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   The actual cover face (HTML/CSS replica)
───────────────────────────────────────────── */
function CoverFace() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      borderRadius: "2px 6px 6px 2px",
      overflow: "hidden",
      // Deep brick red → burnt orange gradient
      background: "linear-gradient(160deg, #6B0F0F 0%, #8B2020 20%, #A63320 45%, #C4511A 75%, #B84A15 100%)",
    }}>
      {/* Paper grain overlay (SVG noise) */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
        mixBlendMode: "overlay",
      }} />

      {/* Faded vignette edges */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
      }} />

      {/* Top edge fade */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60px", zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)" }} />
      {/* Bottom edge fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
      {/* Right edge fade */}
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "40px", zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to left, rgba(0,0,0,0.25), transparent)" }} />

      {/* Water stains */}
      {STAINS.map((s, i) => <WaterStain key={i} {...s} />)}

      {/* Star stickers */}
      {STARS.map((s, i) => <StarSticker key={i} {...s} />)}

      {/* Elastic band — horizontal */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: "50%",
        transform: "translateY(-50%)",
        height: "12px",
        background: "linear-gradient(to bottom, #8a1a1a, #6a0e0e, #8a1a1a)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.1)",
        zIndex: 5,
        borderRadius: "2px",
      }} />

      {/* Title collage letters */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        marginTop: "-10px",
      }}>
        <CollageLetters />
      </div>

      {/* Worn corner peels */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "28px", height: "28px", zIndex: 7,
        background: "linear-gradient(135deg, #d4c5a0 0%, #b8a882 50%, transparent 50%)",
        opacity: 0.6,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: "30px", width: "20px", height: "20px", zIndex: 7,
        background: "linear-gradient(315deg, #d4c5a0 0%, #b8a882 50%, transparent 50%)",
        opacity: 0.5,
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page inside the book
───────────────────────────────────────────── */
function PageContent({ pageIndex }: { pageIndex: number }) {
  const entry = PAGE_ENTRIES[pageIndex % PAGE_ENTRIES.length];
  const bgColors = ["#fff9f0", "#f0fff4", "#fff0f5", "#f5f0ff"];
  const tapeColors = ["rgba(255,200,100,0.55)", "rgba(150,200,255,0.5)", "rgba(255,180,200,0.55)", "rgba(200,220,255,0.5)"];

  return (
    <div style={{
      width: "100%", height: "100%",
      background: bgColors[pageIndex % bgColors.length],
      padding: "32px 24px 24px",
      position: "relative",
      fontFamily: "'Kalam', 'Caveat', cursive",
      // Lined paper
      backgroundImage: `${bgColors[pageIndex % bgColors.length]}, repeating-linear-gradient(transparent, transparent 31px, #c9b99a 31px, #c9b99a 32px)`,
      backgroundPosition: "0 0, 0 40px",
    }}>
      {/* Washi tape top */}
      <div style={{
        position: "absolute", top: -8, left: "50%", transform: "translateX(-50%) rotate(-2deg)",
        width: 70, height: 18,
        background: tapeColors[pageIndex % tapeColors.length],
        borderRadius: 2, zIndex: 2,
      }} />
      {/* Star sticker (Continuously Rotating) */}
      <span style={{ position: "absolute", top: 10, right: 14, fontSize: 14, color: "#FFD700", display: "inline-block", transformOrigin: "center center", animation: "starContinuousSpin 4s linear infinite" }}>★</span>
      <span style={{ position: "absolute", bottom: 16, left: 10, fontSize: 10, color: "#1a1a1a", display: "inline-block", transformOrigin: "center center", animation: "starContinuousSpin 5s linear infinite reverse" }}>★</span>

      <div style={{ fontSize: "2.5rem", marginBottom: 8, lineHeight: 1 }}>{entry.emoji}</div>
      <h3 style={{
        fontFamily: "'Permanent Marker', cursive",
        fontSize: "1.1rem", color: "#2c1810",
        marginBottom: 12, lineHeight: 1.3,
      }}>{entry.title}</h3>
      <p style={{
        fontSize: "0.95rem", color: "#3a2010",
        lineHeight: "32px", fontFamily: "'Kalam', cursive",
      }}>{entry.body}</p>
      <div style={{
        position: "absolute", bottom: 16, right: 16,
        fontSize: "1.2rem",
        animation: "heartbeat 1.8s ease-in-out infinite",
      }}>❤️</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main BookCover export
───────────────────────────────────────────── */
export default function BookCover({ onFullyOpen }: { onFullyOpen: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [flippedPages, setFlippedPages] = useState<number[]>([]);

  const totalPages = PAGE_ENTRIES.length;

  const openBook = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const flipNextPage = () => {
    if (currentPage < totalPages) {
      setFlippedPages((prev) => [...prev, currentPage]);
      setCurrentPage((p) => p + 1);
      if (currentPage === totalPages - 1) {
        setTimeout(onFullyOpen, 600);
      }
    }
  };

  const flipPrevPage = () => {
    if (currentPage > 0) {
      setFlippedPages((prev) => prev.filter((p) => p !== currentPage - 1));
      setCurrentPage((p) => p - 1);
    }
  };

  return (
    <>
      {/* Inject keyframes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(var(--r, 0deg)); }
          50%       { opacity: 0.5; transform: scale(0.8) rotate(var(--r, 0deg)); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14%       { transform: scale(1.25); }
          28%       { transform: scale(1); }
          42%       { transform: scale(1.15); }
        }
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .page-flip {
          position: absolute; inset: 0;
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.645, 0.045, 0.355, 1.000);
          cursor: pointer;
        }
        .page-flip.flipped {
          transform: rotateY(-180deg);
        }
        .page-face, .page-back {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 0 4px 4px 0;
          overflow: hidden;
        }
        .page-back {
          transform: rotateY(180deg);
          background: #f5f0e8;
        }
        .cover-flip {
          position: absolute; inset: 0;
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1.000);
          cursor: pointer;
          border-radius: 2px 6px 6px 2px;
        }
        .cover-flip.open {
          transform: rotateY(-165deg);
        }
        .cover-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 2px 6px 6px 2px;
          overflow: hidden;
        }
        .cover-inner {
          position: absolute; inset: 0;
          transform: rotateY(180deg);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          background: #2c1a0e;
          border-radius: 2px 0 0 2px;
          overflow: hidden;
        }
        .book-hint {
          animation: floatUp 0.5s ease forwards;
        }
        .page-shadow {
          position: absolute; inset: 0;
          pointer-events: none;
          background: linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 20%);
          z-index: 1;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#1a0a00",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        gap: "32px",
      }}>

        {/* Ambient glow */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(90,16,16,0.3) 0%, transparent 65%)",
        }} />

        {/* ── Book scene ── */}
        <div style={{
          perspective: "1800px",
          perspectiveOrigin: "center center",
          animation: "floatUp 0.6s ease forwards",
        }}>
          <div style={{
            position: "relative",
            width: "clamp(280px, 42vw, 360px)",
            height: "clamp(370px, 56vw, 480px)",
            transformStyle: "preserve-3d",
          }}>

            {/* ── BACK COVER (static, always visible at bottom) ── */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(160deg, #4a0c0c, #6B1a1a)",
              borderRadius: "2px 6px 6px 2px",
              boxShadow: "6px 10px 30px rgba(0,0,0,0.7)",
            }}>
              {/* Binding */}
              <div style={{
                position: "absolute", top: 0, left: 0, bottom: 0, width: "22px",
                background: "linear-gradient(to right, #2a0808, #5a1212, #3a0a0a)",
                borderRadius: "2px 0 0 2px",
                boxShadow: "inset -2px 0 4px rgba(0,0,0,0.4)",
              }}>
                {/* Binding lines */}
                {[15, 35, 55, 75].map((pct) => (
                  <div key={pct} style={{
                    position: "absolute", top: `${pct}%`, left: 2, right: 2,
                    height: "2px",
                    background: "rgba(255,200,100,0.25)",
                    borderRadius: 1,
                  }} />
                ))}
              </div>
            </div>

            {/* ── PAGES STACK (visible when cover is open) ── */}
            {PAGE_ENTRIES.map((_, i) => {
              const isFlipped = flippedPages.includes(i);
              const zIndex = isOpen ? (isFlipped ? 5 + i : 10 + (totalPages - i)) : 0;
              const opacity = isOpen ? 1 : 0;

              return (
                <div
                  key={i}
                  className={`page-flip ${isFlipped ? "flipped" : ""}`}
                  style={{
                    zIndex,
                    opacity,
                    transition: isOpen
                      ? `transform 0.7s cubic-bezier(0.645,0.045,0.355,1), opacity 0.3s`
                      : "none",
                    // Slight offset for page stack effect
                    marginRight: isFlipped ? 0 : `${(totalPages - i - 1) * 0.5}px`,
                  }}
                  onClick={!isFlipped ? flipNextPage : undefined}
                >
                  {/* Front of page */}
                  <div className="page-face" style={{
                    boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
                    background: "#f5f0e8",
                  }}>
                    <div className="page-shadow" />
                    <PageContent pageIndex={i} />
                  </div>
                  {/* Back of page (shows next page or blank) */}
                  <div className="page-back">
                    <div className="page-shadow" />
                    {i + 1 < totalPages
                      ? <PageContent pageIndex={i + 1} />
                      : (
                        <div style={{
                          width: "100%", height: "100%",
                          background: "#f5f0e8",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Caveat', cursive",
                          color: "#c9b99a", fontSize: "1.2rem",
                          textAlign: "center", padding: 24,
                        }}>
                          ~ the end ~<br />💌
                        </div>
                      )
                    }
                  </div>
                </div>
              );
            })}

            {/* ── FRONT COVER (flips open) ── */}
            <div
              className={`cover-flip ${isOpen ? "open" : ""}`}
              style={{ zIndex: 20 }}
              onClick={!isOpen ? openBook : undefined}
            >
              {/* Front face = diary cover replica */}
              <div className="cover-face">
                {/* Book spine/binding */}
                <div style={{
                  position: "absolute", top: 0, left: 0, bottom: 0, width: "22px", zIndex: 10,
                  background: "linear-gradient(to right, #4a0c0c, #8a2020, #5a1010)",
                  boxShadow: "inset -3px 0 6px rgba(0,0,0,0.5), 2px 0 4px rgba(0,0,0,0.3)",
                }}>
                  {[15, 35, 55, 75].map((pct) => (
                    <div key={pct} style={{
                      position: "absolute", top: `${pct}%`, left: 3, right: 3,
                      height: "2px",
                      background: "rgba(255,200,100,0.3)",
                      borderRadius: 1,
                    }} />
                  ))}
                </div>
                {/* Gold trim line along spine */}
                <div style={{
                  position: "absolute", top: 0, left: "22px", bottom: 0, width: "3px", zIndex: 10,
                  background: "linear-gradient(to bottom, #c8a84b, #8a6a20, #c8a84b, #8a6a20, #c8a84b)",
                }} />

                <CoverFace />
              </div>

              {/* Inner face of cover (dark endpaper) */}
              <div className="cover-inner">
                <div style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(135deg, #1a0a04, #2c1208)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Caveat', cursive",
                  color: "rgba(200,168,75,0.3)",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  padding: 20,
                  letterSpacing: "0.05em",
                }}>
                  things I never said<br />but always felt ❤
                </div>
                {/* Marbled endpaper pattern */}
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.15,
                  backgroundImage: "repeating-linear-gradient(45deg, rgba(200,168,75,0.3) 0px, transparent 2px, transparent 10px)",
                }} />
              </div>
            </div>

            {/* Drop shadow beneath book */}
            <div style={{
              position: "absolute",
              bottom: "-20px", left: "10%", right: "5%",
              height: "20px",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)",
              filter: "blur(8px)",
              zIndex: 0,
            }} />
          </div>
        </div>

        {/* ── Controls ── */}
        {!isOpen ? (
          <div className="book-hint" style={{
            textAlign: "center",
            fontFamily: "'Caveat', cursive",
            color: "rgba(245,217,168,0.8)",
            fontSize: "1.2rem",
          }}>
            <div style={{ animation: "floatUp 0.8s ease 0.3s both forwards", opacity: 0 }}>
              tap to open the diary ✨
            </div>
            <div style={{
              width: 1, height: 32, background: "linear-gradient(to bottom, rgba(245,217,168,0.5), transparent)",
              margin: "8px auto 0",
            }} />
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            animation: "floatUp 0.5s ease forwards",
          }}>
            {/* Page indicator */}
            <div style={{
              display: "flex", gap: "6px", alignItems: "center",
            }}>
              {PAGE_ENTRIES.map((_, i) => (
                <div key={i} style={{
                  width: flippedPages.includes(i) ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: flippedPages.includes(i) ? "#C1121F" : "rgba(245,217,168,0.3)",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>

            {/* Page turn buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              {currentPage > 0 && (
                <button
                  onClick={flipPrevPage}
                  style={{
                    padding: "10px 22px",
                    background: "transparent",
                    border: "1px solid rgba(139,32,32,0.6)",
                    color: "rgba(245,217,168,0.7)",
                    borderRadius: "999px",
                    fontFamily: "'Caveat', cursive",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  ← prev page
                </button>
              )}
              {currentPage < totalPages && (
                <button
                  onClick={flipNextPage}
                  style={{
                    padding: "10px 28px",
                    background: "#8b2020",
                    border: "1px solid #c4511a",
                    color: "#fdf6e3",
                    borderRadius: "999px",
                    fontFamily: "'Caveat', cursive",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(139,32,32,0.4)",
                    transition: "all 0.2s",
                  }}
                >
                  turn page →
                </button>
              )}
              {currentPage === totalPages && (
                <button
                  onClick={onFullyOpen}
                  style={{
                    padding: "10px 28px",
                    background: "#8b2020",
                    border: "1px solid #c4511a",
                    color: "#fdf6e3",
                    borderRadius: "999px",
                    fontFamily: "'Caveat', cursive",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(139,32,32,0.4)",
                  }}
                >
                  enter the scrapbook 💌
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
