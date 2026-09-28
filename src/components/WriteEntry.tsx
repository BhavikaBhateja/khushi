"use client";

import { useState } from "react";

const MOODS = ["🥰", "🌟", "😢", "🙏", "💖", "😤", "🥺", "✨", "🎂", "💌"];
const COLORS = [
  { label: "Cream", value: "#fff9f0" },
  { label: "Mint", value: "#f0fff4" },
  { label: "Rose", value: "#fff0f5" },
  { label: "Lemon", value: "#fffdf0" },
  { label: "Lavender", value: "#f5f0ff" },
  { label: "Sky", value: "#f0f8ff" },
];
const TAPES = [
  "rgba(255,200,100,0.55)",
  "rgba(150,200,255,0.5)",
  "rgba(255,180,200,0.55)",
  "rgba(200,255,200,0.5)",
  "rgba(220,180,255,0.5)",
];

interface WriteEntryProps {
  onSave: () => void;
}

export default function WriteEntry({ onSave }: WriteEntryProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("💌");
  const [color, setColor] = useState(COLORS[0].value);
  const [tape, setTape] = useState(TAPES[0]);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !body.trim()) return;
    // In a real app you'd persist this; for now we animate & go back
    setSaved(true);
    setTimeout(() => {
      onSave();
    }, 1200);
  };

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl text-[#f5d9a8] mb-2"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          ✏️ write it down
        </h1>
        <p className="text-[#c9a87c]" style={{ fontFamily: "'Caveat', cursive" }}>
          say the thing you&apos;ve been keeping inside 💌
        </p>
      </div>

      {/* Paper card preview */}
      <div
        className="w-full max-w-lg rounded-sm p-7 relative paper-texture"
        style={{
          background: color,
          transform: "rotate(-0.5deg)",
          boxShadow: "4px 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        {/* Tape strip */}
        <div
          className="absolute -top-3 left-1/2 w-24 h-5 rounded-sm z-10"
          style={{ background: tape, transform: "translateX(-50%) rotate(-1deg)" }}
        />

        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="give this page a title..."
          maxLength={60}
          className="w-full bg-transparent border-b-2 border-[#c9b99a] text-[#2c1810] text-xl outline-none pb-1 mb-6 placeholder:text-[#c9b99a]/60"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        />

        {/* Body textarea on lined paper */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="write what you never said..."
          rows={8}
          className="w-full bg-transparent outline-none resize-none text-[#3a2010] text-lg lined-paper placeholder:text-[#c9b99a]/60 pt-1"
          style={{ fontFamily: "'Kalam', cursive", lineHeight: "32px" }}
        />

        {/* Mood + char count */}
        <div className="flex justify-between items-center mt-4">
          <span className="heart-pulse text-red-500 text-xl">❤️</span>
          <span className="text-xs text-[#c9b99a]" style={{ fontFamily: "'Kalam', cursive" }}>
            {body.length} / 500
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 w-full max-w-lg space-y-6">
        {/* Mood picker */}
        <div>
          <p className="text-[#c9a87c] mb-2 text-sm" style={{ fontFamily: "'Caveat', cursive" }}>
            pick a mood sticker:
          </p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`text-2xl p-2 rounded-full transition-all ${
                  mood === m
                    ? "bg-[#8b2020]/80 scale-125 shadow-lg"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <p className="text-[#c9a87c] mb-2 text-sm" style={{ fontFamily: "'Caveat', cursive" }}>
            paper color:
          </p>
          <div className="flex gap-3">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                title={c.label}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === c.value ? "border-[#f5d9a8] scale-125" : "border-transparent"
                }`}
                style={{ background: c.value }}
              />
            ))}
          </div>
        </div>

        {/* Tape picker */}
        <div>
          <p className="text-[#c9a87c] mb-2 text-sm" style={{ fontFamily: "'Caveat', cursive" }}>
            washi tape:
          </p>
          <div className="flex gap-3">
            {TAPES.map((t) => (
              <button
                key={t}
                onClick={() => setTape(t)}
                className={`w-16 h-5 rounded-sm border-2 transition-all ${
                  tape === t ? "border-[#f5d9a8] scale-110" : "border-transparent"
                }`}
                style={{ background: t }}
              />
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!title.trim() || !body.trim() || saved}
          className={`w-full py-4 rounded-sm text-xl font-bold transition-all duration-300 ${
            saved
              ? "bg-green-600 text-white scale-95"
              : !title.trim() || !body.trim()
              ? "bg-[#4a1010]/50 text-[#c9a87c]/50 cursor-not-allowed"
              : "bg-[#8b2020] hover:bg-[#c4511a] text-[#fdf6e3] hover:scale-[1.02] shadow-lg shadow-red-900/40"
          }`}
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          {saved ? "✅ saved to scrapbook!" : "📌 stick it in the scrapbook"}
        </button>
      </div>
    </div>
  );
}
