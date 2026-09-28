"use client";

import { useState } from "react";
import { INITIAL_ENTRIES, type Entry } from "@/lib/entries";
import ScrapbookCard from "./ScrapbookCard";

export default function ScrapbookFeed() {
  const [entries, setEntries] = useState<Entry[]>(INITIAL_ENTRIES);

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen px-4 py-10">
      {/* Section header */}
      <div className="text-center mb-12">
        <div
          className="inline-block text-[#f5d9a8] text-4xl md:text-5xl mb-2"
          style={{ fontFamily: "'Permanent Marker', cursive" }}
        >
          📖 the scrapbook
        </div>
        <p
          className="text-[#c9a87c] text-lg"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          words i finally found the courage to write ✨
        </p>
        {/* Decorative tape strip */}
        <div className="mt-4 flex justify-center gap-3 text-xl">
          {"★✦★✦★".split("").map((c, i) => (
            <span key={i} className={i % 2 === 0 ? "text-yellow-400" : "text-white/30"}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Masonry-style grid */}
      {entries.length === 0 ? (
        <div className="text-center py-20">
          <p
            className="text-[#c9a87c] text-2xl"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            the scrapbook is empty... write something 💌
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-5xl mx-auto">
          {entries.map((entry) => (
            <div key={entry.id} className="mb-6 break-inside-avoid">
              <ScrapbookCard entry={entry} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
