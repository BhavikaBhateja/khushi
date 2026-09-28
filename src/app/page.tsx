"use client";

import { useState } from "react";
import DiaryBook from "@/components/DiaryBook";
import ScrapbookFeed from "@/components/ScrapbookFeed";
import WriteEntry from "@/components/WriteEntry";
import Nav from "@/components/Nav";

type Page = "diary" | "feed" | "write";

export default function Home() {
  const [page, setPage] = useState<Page>("diary");

  return (
    <main className="min-h-screen bg-[#1a0a00]">
      {page === "diary" && (
        <DiaryBook onEnter={() => setPage("feed")} />
      )}
      {(page === "feed" || page === "write") && (
        <>
          <Nav page={page as "feed" | "write"} setPage={(p) => setPage(p as Page)} />
          <div className="pt-20">
            {page === "feed" && <ScrapbookFeed />}
            {page === "write" && <WriteEntry onSave={() => setPage("feed")} />}
          </div>
        </>
      )}
    </main>
  );
}
