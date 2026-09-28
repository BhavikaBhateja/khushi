"use client";

import { useState } from "react";
import { type Entry } from "@/lib/entries";

interface ScrapbookCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
}

const STAR_POSITIONS = [
  { top: "-8px", right: "20px", size: 14, color: "#FFD700", rotate: 20 },
  { top: "10px", right: "-6px", size: 10, color: "#fff", rotate: -15 },
  { bottom: "12px", left: "-4px", size: 12, color: "#222", rotate: 40 },
];

export default function ScrapbookCard({ entry, onDelete }: ScrapbookCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className="scrapbook-card washi-tape relative paper-texture rounded-sm p-5 pb-6"
      style={{
        background: entry.color,
        transform: `rotate(${entry.rotate}deg)`,
        boxShadow: "3px 6px 18px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)",
      }}
    >
      {/* Washi tape override (colored) */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-sm z-10"
        style={{
          background: entry.tape,
          transform: `translateX(-50%) rotate(-1.5deg)`,
        }}
      />

      {/* Star stickers */}
      {STAR_POSITIONS.map((s, i) => (
        <span
          key={i}
          className="star-sticker absolute pointer-events-none select-none"
          style={{
            ...s,
            fontSize: s.size,
            color: s.color,
            "--r": `${s.rotate}deg`,
            "--delay": `${i * 0.4}s`,
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))",
          } as unknown as React.CSSProperties}
        >
          ★
        </span>
      ))}

      {/* Date + mood */}
      <div className="flex justify-between items-center mb-2 text-sm text-gray-500"
        style={{ fontFamily: "'Kalam', cursive" }}>
        <span>{entry.date}</span>
        <span className="text-lg">{entry.mood}</span>
      </div>

      {/* Title */}
      <h2
        className="text-xl font-bold text-[#2c1810] mb-3 leading-tight"
        style={{ fontFamily: "'Permanent Marker', cursive" }}
      >
        {entry.title}
      </h2>

      {/* Body on lined paper */}
      <div
        className="lined-paper min-h-[80px] text-[#3a2010] text-base leading-8 pt-1"
        style={{ fontFamily: "'Kalam', cursive" }}
      >
        {entry.body}
      </div>

      {/* Heart */}
      <div className="mt-4 flex items-center justify-between">
        <span className="heart-pulse text-red-500 text-xl">❤️</span>

        {/* Delete */}
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            style={{ fontFamily: "'Kalam', cursive" }}
          >
            ✂️ remove
          </button>
        ) : (
          <div className="flex gap-2 text-xs" style={{ fontFamily: "'Kalam', cursive" }}>
            <button onClick={() => onDelete(entry.id)} className="text-red-500 font-bold">yes</button>
            <button onClick={() => setConfirming(false)} className="text-gray-500">no</button>
          </div>
        )}
      </div>
    </div>
  );
}
