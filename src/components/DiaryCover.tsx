"use client";

import Image from "next/image";

const stars = [
  { top: "8%", left: "12%", size: 20, color: "#FFD700", rotate: 15, delay: "0s" },
  { top: "5%", left: "72%", size: 14, color: "#fff", rotate: -20, delay: "0.3s" },
  { top: "15%", left: "88%", size: 18, color: "#222", rotate: 30, delay: "0.7s" },
  { top: "78%", left: "6%", size: 16, color: "#FFD700", rotate: -10, delay: "0.5s" },
  { top: "85%", left: "80%", size: 22, color: "#fff", rotate: 25, delay: "1s" },
  { top: "90%", left: "45%", size: 12, color: "#222", rotate: -5, delay: "0.2s" },
  { top: "60%", left: "92%", size: 15, color: "#FFD700", rotate: 45, delay: "0.8s" },
  { top: "45%", left: "3%", size: 10, color: "#fff", rotate: -35, delay: "1.2s" },
];

function Star({ top, left, size, color, rotate, delay }: typeof stars[0]) {
  return (
    <div
      className="star-sticker absolute pointer-events-none select-none"
      style={{
        top,
        left,
        "--r": `${rotate}deg`,
        "--delay": delay,
        fontSize: size,
        color,
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
      } as React.CSSProperties}
    >
      ★
    </div>
  );
}

interface DiaryCoverkProps {
  onOpen: () => void;
}

export default function Diarycover({ onOpen }: DiaryCoverkProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0a00] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-[#5a1010]/30 via-transparent to-transparent pointer-events-none" />

      {/* Desk surface */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 opacity-40"
        style={{
          background: "linear-gradient(to bottom, #3d2b1f, #1a0d06)",
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Diary cover */}
        <div
          className="clickable-cover relative w-[320px] sm:w-[380px] md:w-[420px]"
          onClick={onOpen}
          style={{
            filter:
              "drop-shadow(0 30px 60px rgba(0,0,0,0.8)) drop-shadow(0 8px 20px rgba(139,32,32,0.4))",
          }}
        >
          {/* Scattered stars over the image */}
          <div className="relative">
            <Image
              src="/diary-cover.jpg"
              alt="Things I Never Said — Birthday Scrapbook"
              width={420}
              height={560}
              className="w-full rounded-sm"
              style={{ height: "auto" }}
              priority
            />
            {stars.map((s, i) => (
              <Star key={i} {...s} />
            ))}
          </div>
        </div>

        {/* Open hint */}
        <div className="flex flex-col items-center gap-3 animate-bounce">
          <p
            className="text-[#f5d9a8] text-lg tracking-wider opacity-80"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            tap to open ✨
          </p>
          <div className="w-px h-8 bg-gradient-to-b from-[#f5d9a8]/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}
