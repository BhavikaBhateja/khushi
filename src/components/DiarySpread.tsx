"use client";

import { useState, useEffect } from "react";

/* ─── Track tabs (left spine) ─── */
const TRACKS = [
  { num: "01", label: "K" },
  { num: "02", label: "K" },
  { num: "03", label: "M" },
  { num: "04", label: "T" },
  { num: "05", label: "S" },
  { num: "06", label: "Y" },
  { num: "07", label: "N" },
  { num: "08", label: "S" },
  { num: "09", label: "B" },
  { num: "10", label: "T" },
];

/* ─── Right page tabs ─── */
const RIGHT_TABS = ["C", "O", "H"];

/* ─── Lyrics lines ─── */
const LYRICS_LEFT = [
  "Dancing through every fractured memory tonight,",
  "Where are we running so breathlessly in the dark?",
  "I wanted to pause, but the city kept spinning on,",
  "Reaching out to call your name before you walked away.",
  "",
  "Our little world was richer than we ever knew,",
  "Filled with miracles I never saw without you near.",
  "Wounded and rescued by the simplest words unsaid,",
  "So let us stay awake together until the morning comes.",
  "",
  "All the strange thoughts I kept locked in my chest,",
  "Hoping someone would understand without asking,",
  "Even if time turns and turns without stopping,",
  "I will keep these memories alive right here.",
];

const LYRICS_RIGHT = [
  "lights up my loneliness",
  "",
  "another ordinary night",
  "one of those buildings",
  "of myself",
  "",
  "",
  "long way around",
  "",
  "",
  "fic light",
  "",
  "nonstop",
  "",
  "elping",
  "award",
  "",
  "eatly",
  "ing mode",
  "to live barefly",
  "Brothers...",
  "Plan for barely holding on",
  "",
  "Still, it turns and turns",
];

const CREDITS = `Lyrics: THINGS I NEVER SAID
Music: Khushi
Sound Produced by Yaffie
Guitar by Sho Ogawa
Recorded by Yuta Kumagai
Mixed by Shimohito Komori
Project Management: Yuki Aihara
(prod.)`;

/* ─── Cassette component ─── */
function CassetteTape({
  isPlaying,
  onPrev,
  onStop,
  onNext,
}: {
  isPlaying: boolean;
  onPrev: () => void;
  onStop: () => void;
  onNext: () => void;
}) {
  return (
    <div style={{
      position: "relative",
      width: 320,
      height: 160,
      filter: "drop-shadow(4px 8px 16px rgba(0,0,0,0.55))",
      transform: "rotate(-1.5deg)",
      flexShrink: 0,
    }}>
      {/* Cassette body */}
      <div style={{
        width: "100%", height: "100%",
        background: "linear-gradient(170deg, #3d8c6e 0%, #2d7a5c 40%, #1f6647 100%)",
        borderRadius: "8px",
        position: "relative",
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3)",
        border: "1.5px solid #1a5c3a",
      }}>
        {/* Top screw holes */}
        {[18, 290].map((x, i) => (
          <div key={i} style={{
            position: "absolute", top: 8, left: x,
            width: 10, height: 10, borderRadius: "50%",
            background: "#1a5c3a",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
          }} />
        ))}
        {/* Bottom screw holes */}
        {[18, 290].map((x, i) => (
          <div key={i} style={{
            position: "absolute", bottom: 28, left: x,
            width: 10, height: 10, borderRadius: "50%",
            background: "#1a5c3a",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
          }} />
        ))}

        {/* White label */}
        <div style={{
          position: "absolute",
          top: 12, left: 36, right: 36,
          height: 96,
          background: "linear-gradient(180deg, #f5f0e2 0%, #ede8d8 100%)",
          borderRadius: "4px",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          padding: "6px 8px",
          gap: 2,
        }}>
          {/* Label top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{
              background: "#e8a020",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 900,
              padding: "1px 5px",
              borderRadius: 2,
              fontFamily: "Arial Black, sans-serif",
            }}>①</div>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "0.85rem",
              color: "#1a1a1a",
              fontWeight: 700,
            }}>MIDNIGHT</div>
            <div style={{ fontSize: "0.45rem", color: "#888", fontFamily: "Arial, sans-serif" }}>℗</div>
          </div>

          {/* LISTEN NOW / MUSIC VIDEO */}
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 2 }}>
            <span style={{
              fontSize: "0.45rem", background: "#2d7a5c", color: "#fff",
              padding: "1px 4px", borderRadius: 2, fontFamily: "Arial, sans-serif",
              letterSpacing: "0.04em",
            }}>LISTEN NOW ♪</span>
            <span style={{
              fontSize: "0.45rem", background: "#555", color: "#fff",
              padding: "1px 4px", borderRadius: 2, fontFamily: "Arial, sans-serif",
              letterSpacing: "0.04em",
            }}>MUSIC VIDEO ▶</span>
          </div>

          {/* Reels row */}
          <div style={{
            display: "flex", justifyContent: "space-around", alignItems: "center",
            flex: 1, position: "relative",
          }}>
            {/* Left reel */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #888 0%, #555 50%, #333 100%)",
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: isPlaying ? "spinReel 1.2s linear infinite" : "none",
              position: "relative",
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: "#ccc",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
              }} />
              {/* Reel spokes */}
              {[0,60,120,180,240,300].map((deg) => (
                <div key={deg} style={{
                  position: "absolute",
                  width: 2, height: 14,
                  background: "#666",
                  transform: `rotate(${deg}deg) translateY(-7px)`,
                  top: "50%", left: "calc(50% - 1px)",
                  transformOrigin: "bottom center",
                }} />
              ))}
            </div>

            {/* Center tape window */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              fontSize: "0.35rem", color: "#888", fontFamily: "Arial, sans-serif",
              textAlign: "center",
            }}>
              <div>11 Songs</div>
              <div>all 4 Records</div>
            </div>

            {/* Right reel */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #777 0%, #444 50%, #222 100%)",
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: isPlaying ? "spinReel 2s linear infinite reverse" : "none",
              position: "relative",
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: "#ccc",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
              }} />
              {[0,60,120,180,240,300].map((deg) => (
                <div key={deg} style={{
                  position: "absolute",
                  width: 2, height: 14,
                  background: "#555",
                  transform: `rotate(${deg}deg) translateY(-7px)`,
                  top: "50%", left: "calc(50% - 1px)",
                  transformOrigin: "bottom center",
                }} />
              ))}
            </div>
          </div>

          {/* Track listing tiny text */}
          <div style={{
            fontSize: "0.35rem", color: "#666",
            fontFamily: "Arial, sans-serif",
            textAlign: "left",
            lineHeight: 1.4,
          }}>
            A1. Things I Never Said &nbsp; A2. Birthday Letters
          </div>
        </div>

        {/* Bottom strip - SIRUP */}
        <div style={{
          position: "absolute", bottom: 6, left: 0, right: 0,
          textAlign: "center",
          fontFamily: "'Permanent Marker', cursive",
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
        }}>
          THINGS I NEVER SAID
        </div>

        {/* Tape hole bottom */}
        <div style={{
          position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
          width: 60, height: 8,
          background: "#1a5c3a",
          borderRadius: 4,
        }} />
      </div>

      {/* Control buttons strip below cassette */}
      <div style={{
        position: "absolute",
        bottom: -36, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 0,
        background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
        borderRadius: "0 0 6px 6px",
        overflow: "hidden",
        border: "1.5px solid #1a1a1a",
        borderTop: "none",
      }}>
        {[
          { label: "◀ PREV", action: onPrev },
          { label: "■ STOP", action: onStop },
          { label: "NEXT ▶", action: onNext },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            style={{
              flex: 1, padding: "7px 0",
              background: "transparent",
              border: "none",
              borderRight: "1px solid #333",
              color: "#ccc",
              fontSize: "0.55rem",
              fontFamily: "Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = "#3d8c6e"; (e.target as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "#ccc"; }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Pen SVG ─── */
function Pen() {
  return (
    <div style={{
      position: "absolute",
      top: -30, left: -40,
      width: 280,
      transform: "rotate(35deg)",
      zIndex: 8,
      pointerEvents: "none",
      filter: "drop-shadow(2px 4px 8px rgba(0,0,0,0.4))",
    }}>
      <svg viewBox="0 0 280 28" xmlns="http://www.w3.org/2000/svg">
        {/* Pen clip */}
        <rect x="22" y="3" width="4" height="60" rx="1" fill="#c8a830" />
        {/* Pen body - black barrel */}
        <rect x="0" y="8" width="230" height="12" rx="6" fill="#1a1a1a" />
        {/* Gold trim rings */}
        <rect x="20" y="8" width="8" height="12" rx="1" fill="#c8a830" />
        <rect x="32" y="8" width="3" height="12" fill="#c8a830" />
        <rect x="200" y="8" width="12" height="12" rx="1" fill="#c8a830" />
        {/* Grip section */}
        <rect x="212" y="8" width="30" height="12" rx="3" fill="#2a2a2a" />
        {/* Tip */}
        <polygon points="242,10 270,14 242,18" fill="#888" />
        <polygon points="268,13 278,14 268,15" fill="#ddd" />
        {/* Sheen */}
        <rect x="40" y="9" width="150" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
      </svg>
    </div>
  );
}

/* ─── Paper clip SVG ─── */
function PaperClip({ top, left, rotate = 0 }: { top: number | string; left: number | string; rotate?: number }) {
  return (
    <div style={{
      position: "absolute", top, left,
      transform: `rotate(${rotate}deg)`,
      zIndex: 12,
      pointerEvents: "none",
      filter: "drop-shadow(1px 2px 4px rgba(0,0,0,0.35))",
    }}>
      <svg width="28" height="48" viewBox="0 0 28 48">
        <path d="M14 4 C6 4 2 10 2 16 L2 36 C2 44 6 46 14 46 C22 46 26 44 26 36 L26 20 C26 14 22 12 18 12 C14 12 10 14 10 20 L10 34 C10 38 14 40 14 40"
          fill="none" stroke="#b8c8d8" strokeWidth="3" strokeLinecap="round"
          style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.2))" }}
        />
      </svg>
    </div>
  );
}

/* ─── Washi tape strip ─── */
function WashiTape({ top, left, width = 70, color = "rgba(255,200,100,0.55)", rotate = -2 }:
  { top: number|string; left: number|string; width?: number; color?: string; rotate?: number }) {
  return (
    <div style={{
      position: "absolute", top, left,
      width, height: 18,
      background: color,
      transform: `rotate(${rotate}deg)`,
      borderRadius: 2,
      zIndex: 9,
      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    }} />
  );
}

/* ─── Main component ─── */
export default function DiarySpread({ onEnter }: { onEnter: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);

  // Auto-play simulation
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      // just spin reels — no actual audio
    }, 100);
    return () => clearInterval(id);
  }, [isPlaying]);

  const handleStop = () => setIsPlaying(false);
  const handlePrev = () => { setTrackIdx(i => Math.max(0, i - 1)); setIsPlaying(true); };
  const handleNext = () => { setTrackIdx(i => Math.min(TRACKS.length - 1, i + 1)); setIsPlaying(true); };

  return (
    <>
      <style>{`
        @keyframes spinReel {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .diary-spread {
          animation: fadeIn 0.6s ease forwards;
        }
        .cassette-hover:hover {
          filter: drop-shadow(4px 8px 20px rgba(0,0,0,0.7)) brightness(1.05) !important;
          transform: rotate(-1.5deg) translateY(-2px) !important;
          transition: all 0.2s ease !important;
        }
        .enter-btn:hover {
          background: #8b2020 !important;
          transform: scale(1.04) !important;
          box-shadow: 0 6px 20px rgba(139,32,32,0.5) !important;
        }
        .nav-link:hover { text-decoration: underline; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        // Wood grain desk background
        background: `
          linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.2) 100%),
          repeating-linear-gradient(
            92deg,
            rgba(60,30,10,0.03) 0px, rgba(60,30,10,0.03) 1px,
            transparent 1px, transparent 12px
          ),
          repeating-linear-gradient(
            88deg,
            rgba(40,20,5,0.04) 0px, rgba(40,20,5,0.04) 2px,
            transparent 2px, transparent 30px
          ),
          linear-gradient(180deg,
            #8B6035 0%, #7a5228 10%, #9a6a3a 20%, #8a5c2e 30%,
            #a07040 40%, #8c6232 50%, #9a6a3c 60%, #7e5028 70%,
            #8a5e32 80%, #9c6e40 90%, #7a5030 100%
          )
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0",
        overflow: "hidden",
      }}>
        {/* ── Top navigation ── */}
        <nav style={{
          width: "100%",
          padding: "14px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 30,
        }}>
          <h1 style={{
            fontFamily: "'Permanent Marker', cursive",
            color: "#f5e8c8",
            fontSize: "clamp(0.9rem, 2vw, 1.3rem)",
            letterSpacing: "0.45em",
            textShadow: "0 2px 4px rgba(0,0,0,0.4)",
            margin: 0,
          }}>
            T H I N G S &nbsp; I &nbsp; N E V E R &nbsp; S A I D
          </h1>
        </nav>

        {/* ── Open Diary Book ── */}
        <div className="diary-spread" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: "0 20px 20px",
          width: "100%",
          maxWidth: "1100px",
        }}>
          <div style={{
            display: "flex",
            width: "100%",
            maxWidth: "980px",
            minHeight: "500px",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 8px 20px rgba(0,0,0,0.4)",
            borderRadius: "4px 6px 6px 4px",
          }}>

            {/* ═══════════════════════════
                LEFT PAGE
            ═══════════════════════════ */}
            <div style={{
              flex: "0 0 48%",
              background: "linear-gradient(180deg, #f0e8d8 0%, #e8dfc8 100%)",
              position: "relative",
              borderRadius: "4px 0 0 4px",
              overflow: "visible",
              padding: "24px 20px 24px 56px",
              // Paper texture via gradient
              backgroundImage: `
                linear-gradient(180deg, #f0e8d8 0%, #e8dfc8 100%)
              `,
            }}>
              {/* Red fabric binding (left edge) */}
              <div style={{
                position: "absolute", top: 0, left: 0, bottom: 0, width: 44,
                background: "linear-gradient(to right, #7a0c0c, #9a1a1a, #8a1212)",
                borderRadius: "4px 0 0 4px",
                zIndex: 5,
                boxShadow: "inset -4px 0 8px rgba(0,0,0,0.3), 2px 0 6px rgba(0,0,0,0.2)",
              }}>
                {/* Fabric texture lines */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    top: `${(i / 30) * 100}%`,
                    left: 2, right: 2,
                    height: "1px",
                    background: i % 3 === 0 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
                  }} />
                ))}

                {/* Track tabs */}
                {TRACKS.map((track, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    top: `${8 + i * 8.5}%`,
                    right: -28,
                    width: 36,
                    height: 20,
                    background: trackIdx === i
                      ? "linear-gradient(to right, #f5e8c8, #e8d8b0)"
                      : "linear-gradient(to right, #d4c4a0, #c0b090)",
                    borderRadius: "0 3px 3px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "2px 1px 4px rgba(0,0,0,0.3)",
                    cursor: "pointer",
                    zIndex: 6,
                    border: trackIdx === i ? "1px solid #c8a830" : "none",
                    borderLeft: "none",
                  }} onClick={() => { setTrackIdx(i); setIsPlaying(true); }}>
                    <span style={{ fontSize: "0.35rem", color: "#666", fontFamily: "Arial, sans-serif", lineHeight: 1 }}>{track.num}</span>
                    <span style={{ fontSize: "0.45rem", color: "#333", fontFamily: "Arial, sans-serif", fontWeight: 700 }}>{track.label}</span>
                  </div>
                ))}

                {/* NOW text at bottom */}
                <div style={{
                  position: "absolute", bottom: 12, left: 0, right: 0,
                  writingMode: "vertical-rl",
                  textAlign: "center",
                  fontFamily: "'Permanent Marker', cursive",
                  color: "rgba(255,230,180,0.5)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                }}>NOW PLAYING</div>
              </div>

              {/* Pen */}
              <Pen />

              {/* Paper clip top */}
              <PaperClip top={-8} left={60} rotate={90} />

              {/* ── MIDNIGHT collage title card ── */}
              <div style={{
                position: "absolute",
                top: 40, left: 70,
                zIndex: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}>
                {/* Yellow collage piece */}
                <div style={{
                  width: 72,
                  padding: "8px 10px",
                  background: "#F5C842",
                  transform: "rotate(-1.5deg)",
                  boxShadow: "2px 3px 8px rgba(0,0,0,0.35)",
                  clipPath: "polygon(1% 0%, 99% 1%, 100% 99%, 0% 100%)",
                }}>
                  <span style={{
                    fontFamily: "'Permanent Marker', cursive",
                    fontSize: "2rem",
                    color: "#2A9D8F",
                    lineHeight: 1,
                    display: "block",
                    textAlign: "center",
                  }}>MID</span>
                </div>
                {/* Blue collage piece */}
                <div style={{
                  width: 72,
                  padding: "8px 10px",
                  background: "#E8F4F0",
                  transform: "rotate(1deg)",
                  boxShadow: "2px 3px 8px rgba(0,0,0,0.3)",
                  clipPath: "polygon(0% 1%, 100% 0%, 99% 100%, 1% 99%)",
                }}>
                  <span style={{
                    fontFamily: "'Permanent Marker', cursive",
                    fontSize: "1.9rem",
                    color: "#1a3a8a",
                    lineHeight: 1,
                    display: "block",
                    textAlign: "center",
                  }}>NIGHT</span>
                </div>
              </div>

              {/* Polaroid photo */}
              <div style={{
                position: "absolute",
                top: 36, left: 158,
                width: 120,
                background: "#f0ece0",
                padding: "8px 8px 28px 8px",
                boxShadow: "3px 4px 12px rgba(0,0,0,0.4)",
                transform: "rotate(0.5deg)",
                zIndex: 7,
              }}>
                <div style={{
                  width: "100%",
                  paddingBottom: "90%",
                  background: "linear-gradient(135deg, #888 0%, #555 30%, #333 60%, #666 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Silhouette figure */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, #c8c8c8 0%, #a0a0a0 40%, #606060 100%)",
                  }} />
                  <div style={{
                    position: "absolute",
                    bottom: 0, left: "50%",
                    transform: "translateX(-50%)",
                    width: 40, height: 70,
                    background: "#1a1a1a",
                    clipPath: "polygon(35% 0%, 65% 0%, 80% 40%, 60% 100%, 40% 100%, 20% 40%)",
                  }} />
                  {/* Grid overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "repeating-linear-gradient(0deg, rgba(200,200,200,0.15) 0px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, rgba(200,200,200,0.15) 0px, transparent 1px, transparent 12px)",
                  }} />
                </div>
                <div style={{
                  fontSize: "0.5rem",
                  fontFamily: "'Kalam', cursive",
                  color: "#666",
                  textAlign: "center",
                  marginTop: 6,
                }}>Prod. Yaffie</div>
              </div>

              {/* WashiTape on polaroid */}
              <WashiTape top={30} left={158} width={50} color="rgba(255,200,100,0.45)" rotate={-2} />

              {/* Handwritten production note */}
              <div style={{
                position: "absolute",
                top: 180, left: 70,
                fontFamily: "'Kalam', cursive",
                fontSize: "0.62rem",
                color: "#3a2a18",
                lineHeight: 1.6,
                zIndex: 7,
                maxWidth: 120,
                transform: "rotate(-0.5deg)",
              }}>
                <em>Prod. Yaffie</em>
              </div>

              {/* Credits block */}
              <div style={{
                position: "absolute",
                bottom: 40, left: 58,
                fontFamily: "'Kalam', cursive",
                fontSize: "0.58rem",
                color: "#4a3a28",
                lineHeight: 1.7,
                zIndex: 7,
                whiteSpace: "pre-line",
                maxWidth: 160,
              }}>{CREDITS}</div>

              {/* Hand-scrawled Japanese text (left-center area) */}
              <div style={{
                position: "absolute",
                top: 210, left: 180,
                fontFamily: "'Kalam', cursive",
                fontSize: "0.55rem",
                color: "#3a2a1a",
                lineHeight: 2,
                zIndex: 7,
                maxWidth: 130,
                transform: "rotate(0.3deg)",
                opacity: 0.85,
              }}>
                {`Written in the quiet hours\nof midnight with Yaffie.\nThis song captures\nthe silence between thoughts\nand the search for peace\nin an ordinary night.`}
              </div>

              {/* ESIRUP collage logo */}
              <div style={{
                position: "absolute",
                bottom: 90, left: 170,
                zIndex: 8,
                transform: "rotate(-2deg)",
              }}>
                <div style={{
                  display: "flex",
                  background: "#F5C842",
                  padding: "4px 10px",
                  clipPath: "polygon(0% 3%, 97% 0%, 100% 97%, 3% 100%)",
                  boxShadow: "2px 3px 6px rgba(0,0,0,0.35)",
                }}>
                  {"ESIRUP".split("").map((c, i) => (
                    <span key={i} style={{
                      fontFamily: i % 2 === 0 ? "'Permanent Marker', cursive" : "'Impact', sans-serif",
                      fontSize: i === 0 ? "1.1rem" : "0.85rem",
                      color: i % 3 === 0 ? "#8B2020" : i % 3 === 1 ? "#2A9D8F" : "#1a1a1a",
                      transform: `rotate(${(i % 3) * 3 - 3}deg)`,
                      display: "inline-block",
                    }}>{c}</span>
                  ))}
                </div>
              </div>

              {/* Page crease shadow (right edge) */}
              <div style={{
                position: "absolute", top: 0, right: 0, bottom: 0, width: 24,
                background: "linear-gradient(to right, transparent, rgba(0,0,0,0.12))",
                pointerEvents: "none",
                zIndex: 3,
              }} />
            </div>

            {/* ═══════════════════════════
                SPINE (center crease)
            ═══════════════════════════ */}
            <div style={{
              flex: "0 0 4px",
              background: "linear-gradient(to right, rgba(0,0,0,0.25), rgba(0,0,0,0.05), rgba(0,0,0,0.3))",
              zIndex: 10,
            }} />

            {/* ═══════════════════════════
                RIGHT PAGE
            ═══════════════════════════ */}
            <div style={{
              flex: "0 0 52%",
              position: "relative",
              borderRadius: "0 6px 6px 0",
              overflow: "visible",
              padding: "20px 48px 20px 20px",
              // Lined paper
              background: "#f2ead8",
              backgroundImage: `
                repeating-linear-gradient(
                  transparent, transparent 27px,
                  #d4c8a8 27px, #d4c8a8 28px
                )
              `,
              backgroundPosition: "0 36px",
            }}>
              {/* Right edge tabs */}
              <div style={{
                position: "absolute", top: 0, right: 0, bottom: 0,
                width: 42,
                background: "linear-gradient(to left, #7a0c0c, #9a1a1a, #8a1212)",
                borderRadius: "0 6px 6px 0",
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 20,
                gap: 2,
              }}>
                {RIGHT_TABS.map((t, i) => (
                  <div key={i} style={{
                    width: 28,
                    height: 20,
                    background: "linear-gradient(to left, #d4c4a0, #c0b090)",
                    borderRadius: "3px 0 0 3px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    color: "#444",
                    fontFamily: "Arial, sans-serif",
                    boxShadow: "-2px 1px 4px rgba(0,0,0,0.25)",
                    marginTop: i === 0 ? 10 : 0,
                  }}>{t}</div>
                ))}
                {/* Vertical text */}
                <div style={{
                  writingMode: "vertical-rl",
                  fontFamily: "'Permanent Marker', cursive",
                  color: "rgba(255,230,180,0.4)",
                  fontSize: "0.4rem",
                  letterSpacing: "0.2em",
                  marginTop: 20,
                }}>TOTAL WAR DIARY</div>
              </div>

              {/* Paper clip top right */}
              <PaperClip top={-10} left="55%" rotate={88} />

              {/* Prod. Yaffie sticky note top right */}
              <div style={{
                position: "absolute", top: 12, right: 55,
                background: "#f5f0e0",
                padding: "4px 10px",
                fontSize: "0.55rem",
                fontFamily: "'Kalam', cursive",
                color: "#444",
                transform: "rotate(-1deg)",
                boxShadow: "1px 2px 6px rgba(0,0,0,0.25)",
                zIndex: 7,
                borderTop: "3px solid #2A9D8F",
              }}>Prod. Yaffie</div>

              {/* Sticky note top — MIDNIGHT */}
              <div style={{
                position: "absolute", top: 10, left: 22,
                background: "#f5f0e0",
                padding: "5px 16px",
                fontFamily: "'Caveat', cursive",
                fontSize: "1rem",
                color: "#1a1a1a",
                fontWeight: 700,
                transform: "rotate(0.5deg)",
                boxShadow: "1px 2px 5px rgba(0,0,0,0.2)",
                zIndex: 7,
              }}>MIDNIGHT</div>

              {/* Lyrics columns */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "55% 45%",
                gap: "0 12px",
                marginTop: 40,
                height: "calc(100% - 140px)",
              }}>
                {/* Left lyrics column */}
                <div style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: "0.58rem",
                  color: "#2a1a0a",
                  lineHeight: "28px",
                  whiteSpace: "pre-line",
                  opacity: 0.88,
                }}>
                  {LYRICS_LEFT.join("\n")}
                </div>

                {/* Right lyrics column (English) */}
                <div style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: "0.58rem",
                  color: "#3a2a1a",
                  lineHeight: "28px",
                  whiteSpace: "pre-line",
                  opacity: 0.75,
                }}>
                  {LYRICS_RIGHT.join("\n")}
                </div>
              </div>

              {/* ── Cassette tape ── */}
              <div
                className="cassette-hover"
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: "20%",
                  zIndex: 15,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  filter: "drop-shadow(4px 8px 16px rgba(0,0,0,0.55))",
                  transform: "rotate(-1.5deg)",
                }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <CassetteTape
                  isPlaying={isPlaying}
                  onPrev={handlePrev}
                  onStop={handleStop}
                  onNext={handleNext}
                />
              </div>

              {/* Scattered text around cassette */}
              <div style={{
                position: "absolute",
                bottom: 155, right: 55,
                fontFamily: "'Kalam', cursive",
                fontSize: "0.55rem",
                color: "#4a3a28",
                lineHeight: 1.8,
                textAlign: "right",
                zIndex: 7,
              }}>
                {`breathe\nleaving mode\ntrying to live barely\nBrothers...\nPlan for barely holding on`}
              </div>

              <div style={{
                position: "absolute",
                bottom: 12, right: 56,
                fontFamily: "'Kalam', cursive",
                fontSize: "0.6rem",
                color: "#3a2a1a",
                fontStyle: "italic",
                zIndex: 7,
              }}>Still, it turns and turns</div>

              {/* Page crease shadow (left edge) */}
              <div style={{
                position: "absolute", top: 0, left: 0, bottom: 0, width: 20,
                background: "linear-gradient(to left, transparent, rgba(0,0,0,0.10))",
                pointerEvents: "none", zIndex: 3,
              }} />
            </div>
          </div>
        </div>

        {/* ── Bottom nav / Enter button ── */}
        <div style={{
          width: "100%",
          padding: "10px 40px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          position: "relative",
          zIndex: 30,
        }}>
          {["HP", "APP", "𝕏", "YouTube", "♫", "@SIRUP"].map((link) => (
            <span key={link} className="nav-link" style={{
              fontFamily: "'Kalam', cursive",
              color: "rgba(245,232,200,0.65)",
              fontSize: "0.65rem",
              cursor: "pointer",
              letterSpacing: "0.06em",
              transition: "color 0.2s",
            }}>{link}</span>
          ))}

          <button
            className="enter-btn"
            onClick={onEnter}
            style={{
              padding: "8px 24px",
              background: "#6B0F0F",
              border: "1px solid #c4511a",
              color: "#f5e8c8",
              borderRadius: "999px",
              fontFamily: "'Caveat', cursive",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(107,15,15,0.45)",
              transition: "all 0.2s ease",
              marginLeft: 16,
            }}
          >
            open scrapbook 📖
          </button>
        </div>
      </div>
    </>
  );
}
