"use client";

type Page = "cover" | "feed" | "write";

interface NavProps {
  page: Page;
  setPage: (p: Page) => void;
}

export default function Nav({ page, setPage }: NavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{ background: "linear-gradient(to bottom, #1a0a00ee, transparent)" }}
    >
      {/* Logo */}
      <div
        className="text-[#f5d9a8] text-xl cursor-pointer select-none"
        style={{ fontFamily: "'Permanent Marker', cursive" }}
        onClick={() => setPage("feed")}
      >
        💌 things i never said
      </div>

      {/* Nav links */}
      <div className="flex gap-3">
        <NavBtn active={page === "feed"} onClick={() => setPage("feed")} emoji="📖" label="Scrapbook" />
        <NavBtn active={page === "write"} onClick={() => setPage("write")} emoji="✏️" label="Write" />
      </div>
    </nav>
  );
}

function NavBtn({
  active,
  onClick,
  emoji,
  label,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
        active
          ? "bg-[#8b2020] border-[#c4511a] text-[#fdf6e3] shadow-lg shadow-red-900/40"
          : "bg-transparent border-[#8b2020]/50 text-[#f5d9a8]/70 hover:bg-[#8b2020]/30 hover:text-[#f5d9a8]"
      }`}
      style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem" }}
    >
      {emoji} {label}
    </button>
  );
}
