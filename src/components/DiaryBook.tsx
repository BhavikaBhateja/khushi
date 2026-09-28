"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { playClickVoice, playPageFlipVoice, playUncrumpleSound, playChapterClickSound } from "@/utils/soundEffects";

/* ══════════════════════════════════════════════════
   TYPES & DATA (EXACT 11 TRACKS MATCHING THE ALBUM)
══════════════════════════════════════════════════ */
type BookMode =
  | "front_cover"          // Closed book showing front cover
  | "intro_open"           // Front cover swings open (0 -> -180deg)
  | "intro_flip"           // Real pages visibly flip one by one from right to left, final flip reveals back cover
  | "back_cover"           // Exact back cover matching user's photo
  | "open_book";           // Tall open book with left tabs & crumpled papers

type AnimPhase = "idle" | "compress" | "flip" | "unfold";

interface Paper {
  id: string;
  title: string;
  prod?: string;
  lines: string[];
  bgColor: string;
  rotate: number;
  offsetX: number;
  offsetY: number;
  hasPattern?: "diamonds" | "stars" | "music";
}

interface Chapter {
  id: number;
  trackNum: string;
  title: string;
  feat?: string;
  displayTitle: string;
  subtitle: string;
  prod: string;
  titleLetters: { ch: string; bg: string; color: string; font: string; rotate: number }[];
  leftPapers: Paper[];
  rightLyrics: string[];
  rightLyricsEn: string[];
  cassetteBg: string;
  cassetteTitle: string;
  backLeftStickers: { emoji: string; top: string; left: string; size: number; rotate: number }[];
  backRightColors: string[];
  leftStoryLines: string[];
  rightStoryLines: string[];
  tapeColor?: string;
  stampEmoji?: string;
  dateTag?: string;
  polaroidCaption?: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 0,
    trackNum: "01",
    title: "WE HAD NO IDEA",
    displayTitle: "01. WE HAD NO IDEA",
    subtitle: "Same college. Same world. Zero idea that we'd ever matter to each other.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#d94030",
    cassetteTitle: "TAPE #01 // WE HAD NO IDEA",
    tapeColor: "#f7d070",
    stampEmoji: "💌",
    dateTag: "ENTRY #01",
    polaroidCaption: " strangers in college hallways \ud83c\udf92",
    titleLetters: [{"ch": "W", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "E", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "H", "bg": "#1f5f8b", "color": "#ffffff", "font": "'Arial Black',sans-serif", "rotate": 3}, {"ch": "A", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "D", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "N", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch01-p1", "title": "WE HAD NO IDEA", "prod": "Bhavika & Khushi Scrapbook", "lines": ["Same college. Same world. Zero idea that we'd ever matter to each other.", "", "We were in the same college and somehow managed to remain complete strangers.", "", "No friendship.", "No conversations.", "Not even a proper \u201cHi.\u201d"], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "stars"}],
    rightLyrics: ["Just two people existing in the same place, completely unaware that a few months later we'd be sharing a PG, fighting over stupid things, crying over life and eventually becoming flatmates.", "", "Honestly, the universe had already decided.", "", "We were just too clueless to notice."],
    rightLyricsEn: ["Just two people existing in the same place, completely unaware that a few months later we'd be sharing a PG, fighting over stupid things, crying over life and eventually becoming flatmates.", "", "Honestly, the universe had already decided.", "", "We were just too clueless to notice."],
    leftStoryLines: ["Same college. Same world. Zero idea that we'd ever matter to each other.", "", "We were in the same college and somehow managed to remain complete strangers.", "", "No friendship.", "No conversations.", "Not even a proper \u201cHi.\u201d"],
    rightStoryLines: ["Just two people existing in the same place, completely unaware that a few months later we'd be sharing a PG, fighting over stupid things, crying over life and eventually becoming flatmates.", "", "Honestly, the universe had already decided.", "", "We were just too clueless to notice."],
    backLeftStickers: [{"emoji": "\ud83d\udc8c", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#d94030", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 1,
    trackNum: "02",
    title: "CAN I BORROW YOUR CHARGER?",
    displayTitle: "02. CAN I BORROW YOUR CHARGER?",
    subtitle: "Our first interaction wasn't deep. It wasn't cute. It was an iPhone charger.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#2A9D8F",
    cassetteTitle: "TAPE #02 // CAN I BORROW Y",
    tapeColor: "#e76f51",
    stampEmoji: "📮",
    dateTag: "ENTRY #02",
    polaroidCaption: "\u201cexcuse me, iphone charger milega?\u201d \ud83d\udd0c",
    titleLetters: [{"ch": "C", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "A", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "N", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "I", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "B", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "O", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch02-p1", "title": "CAN I BORROW YOUR CHARGER?", "prod": "Bhavika & Khushi Scrapbook", "lines": ["Our first interaction wasn't deep.", "", "It wasn't cute.", "", "It wasn't memorable.", "", "I saw you had an iPhone charger.", "", "So naturally, I came to you and asked for it."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "diamonds"}],
    rightLyrics: ["Meanwhile, you were sitting in front of me with your guy friend, preparing him for his interview.", "", "And I was standing there pretending I wasn't listening to all the interview questions you were giving him.", "", "Very normal behaviour.", "Very subtle.", "Very future-best-friend material."],
    rightLyricsEn: ["Meanwhile, you were sitting in front of me with your guy friend, preparing him for his interview.", "", "And I was standing there pretending I wasn't listening to all the interview questions you were giving him.", "", "Very normal behaviour.", "Very subtle.", "Very future-best-friend material."],
    leftStoryLines: ["Our first interaction wasn't deep.", "", "It wasn't cute.", "", "It wasn't memorable.", "", "I saw you had an iPhone charger.", "", "So naturally, I came to you and asked for it."],
    rightStoryLines: ["Meanwhile, you were sitting in front of me with your guy friend, preparing him for his interview.", "", "And I was standing there pretending I wasn't listening to all the interview questions you were giving him.", "", "Very normal behaviour.", "Very subtle.", "Very future-best-friend material."],
    backLeftStickers: [{"emoji": "\ud83d\udcee", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#2A9D8F", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 2,
    trackNum: "03",
    title: "WHO IS THIS GIRL?",
    displayTitle: "03. WHO IS THIS GIRL?",
    subtitle: "Straight to business: What did they ask? What was the interview like?",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#e5b72e",
    cassetteTitle: "TAPE #03 // WHO IS THIS GI",
    tapeColor: "#264653",
    stampEmoji: "✨",
    dateTag: "ENTRY #03",
    polaroidCaption: "interrogating strangers 101 \ud83d\udcdd",
    titleLetters: [{"ch": "W", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "H", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "O", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "I", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "S", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "T", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch03-p1", "title": "WHO IS THIS GIRL?", "prod": "Bhavika & Khushi Scrapbook", "lines": ["You were sitting there with your friend.", "", "I already knew him, so I walked over to him and started asking about the interview.", "", "No proper greeting. No introduction.", "No \u201cHi, I'm Bhavika.\u201d", "", "Just straight to business:", "\u201cWhat did they ask? What should I prepare? What was the interview like?\u201d"], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "stars"}],
    rightLyrics: ["And you were just sitting there watching me like...", "\u201cWho is this girl and why does she care so much?\u201d", "", "Apparently, my complete lack of interest in anything happening around me except the interview was funny to you.", "", "And honestly, looking back... I can see why.", "", "You had absolutely no idea that the random girl who walked up to your friend and immediately started interrogating him would eventually become your flatmate, your emergency contact, your biggest headache...", "", "and somehow, your friend."],
    rightLyricsEn: ["And you were just sitting there watching me like...", "\u201cWho is this girl and why does she care so much?\u201d", "", "Apparently, my complete lack of interest in anything happening around me except the interview was funny to you.", "", "And honestly, looking back... I can see why.", "", "You had absolutely no idea that the random girl who walked up to your friend and immediately started interrogating him would eventually become your flatmate, your emergency contact, your biggest headache...", "", "and somehow, your friend."],
    leftStoryLines: ["You were sitting there with your friend.", "", "I already knew him, so I walked over to him and started asking about the interview.", "", "No proper greeting. No introduction.", "No \u201cHi, I'm Bhavika.\u201d", "", "Just straight to business:", "\u201cWhat did they ask? What should I prepare? What was the interview like?\u201d"],
    rightStoryLines: ["And you were just sitting there watching me like...", "\u201cWho is this girl and why does she care so much?\u201d", "", "Apparently, my complete lack of interest in anything happening around me except the interview was funny to you.", "", "And honestly, looking back... I can see why.", "", "You had absolutely no idea that the random girl who walked up to your friend and immediately started interrogating him would eventually become your flatmate, your emergency contact, your biggest headache...", "", "and somehow, your friend."],
    backLeftStickers: [{"emoji": "\u2728", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#e5b72e", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 3,
    trackNum: "04",
    title: "THREE STRANGERS. ONE COMPANY.",
    displayTitle: "04. THREE STRANGERS. ONE COMPANY.",
    subtitle: "The universe was doing some very aggressive matchmaking.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#E76F51",
    cassetteTitle: "TAPE #04 // THREE STRANGER",
    tapeColor: "#2A9D8F",
    stampEmoji: "☕",
    dateTag: "ENTRY #04",
    polaroidCaption: "offer letters & destined chaos \ud83d\udcbc",
    titleLetters: [{"ch": "T", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "H", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "R", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "E", "bg": "#1f5f8b", "color": "#ffffff", "font": "'Arial Black',sans-serif", "rotate": 3}, {"ch": "E", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "S", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "T", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch04-p1", "title": "THREE STRANGERS. ONE COMPANY.", "prod": "Bhavika & Khushi Scrapbook", "lines": ["And then somehow...", "", "all three of us got selected.", "", "You.", "Me.", "And the guy whose interview preparation I was secretly listening to."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "diamonds"}],
    rightLyrics: ["And the funniest part?", "We still barely knew each other's names.", "", "Imagine being selected into the same company and not realizing that the person you were going to spend the next six months with was literally the girl you had just met.", "", "The universe was doing some very aggressive matchmaking."],
    rightLyricsEn: ["And the funniest part?", "We still barely knew each other's names.", "", "Imagine being selected into the same company and not realizing that the person you were going to spend the next six months with was literally the girl you had just met.", "", "The universe was doing some very aggressive matchmaking."],
    leftStoryLines: ["And then somehow...", "", "all three of us got selected.", "", "You.", "Me.", "And the guy whose interview preparation I was secretly listening to."],
    rightStoryLines: ["And the funniest part?", "We still barely knew each other's names.", "", "Imagine being selected into the same company and not realizing that the person you were going to spend the next six months with was literally the girl you had just met.", "", "The universe was doing some very aggressive matchmaking."],
    backLeftStickers: [{"emoji": "\u2615", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#E76F51", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 4,
    trackNum: "05",
    title: "WAIT. YOU'RE THAT GIRL.",
    displayTitle: "05. WAIT. YOU'RE THAT GIRL.",
    subtitle: "Our friendship technically started before either of us knew it had started.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#4CC9F0",
    cassetteTitle: "TAPE #05 // WAIT. YOU'RE T",
    tapeColor: "#f72585",
    stampEmoji: "🎧",
    dateTag: "ENTRY #05",
    polaroidCaption: "wait... YOU'RE the charger girl?! \ud83e\udd2f",
    titleLetters: [{"ch": "W", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "A", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "I", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "T", "bg": "#1f5f8b", "color": "#ffffff", "font": "'Arial Black',sans-serif", "rotate": 3}, {"ch": ".", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "Y", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "O", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch05-p1", "title": "WAIT. YOU'RE THAT GIRL.", "prod": "Bhavika & Khushi Scrapbook", "lines": ["Then came the PG conversation.", "", "You called me.", "We decided we'd stay in the same PG.", "", "And then came the first day of office."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "stars"}],
    rightLyrics: ["And suddenly it clicked.", "", "YOU.", "The charger girl.", "The interview girl.", "The girl I had been talking to on the phone without even realizing I had already met you.", "", "At that point, our friendship had technically started before either of us knew it had started."],
    rightLyricsEn: ["And suddenly it clicked.", "", "YOU.", "The charger girl.", "The interview girl.", "The girl I had been talking to on the phone without even realizing I had already met you.", "", "At that point, our friendship had technically started before either of us knew it had started."],
    leftStoryLines: ["Then came the PG conversation.", "", "You called me.", "We decided we'd stay in the same PG.", "", "And then came the first day of office."],
    rightStoryLines: ["And suddenly it clicked.", "", "YOU.", "The charger girl.", "The interview girl.", "The girl I had been talking to on the phone without even realizing I had already met you.", "", "At that point, our friendship had technically started before either of us knew it had started."],
    backLeftStickers: [{"emoji": "\ud83c\udfa7", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#4CC9F0", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 5,
    trackNum: "06",
    title: "VODKA & VULNERABILITY",
    displayTitle: "06. VODKA & VULNERABILITY",
    subtitle: "First day in the PG. One bottle of vodka. Zero emotional regulation.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#9D4EDD",
    cassetteTitle: "TAPE #06 // VODKA & VULNER",
    tapeColor: "#ffb703",
    stampEmoji: "🍸",
    dateTag: "ENTRY #06",
    polaroidCaption: "night one: tears, tea & vodka \ud83c\udf78",
    titleLetters: [{"ch": "V", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "O", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "D", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "K", "bg": "#1f5f8b", "color": "#ffffff", "font": "'Arial Black',sans-serif", "rotate": 3}, {"ch": "A", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "&", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}],
    leftPapers: [{"id": "ch06-p1", "title": "VODKA & VULNERABILITY", "prod": "Bhavika & Khushi Scrapbook", "lines": ["First day in the PG.", "", "One bottle of vodka.", "", "And apparently absolutely no emotional regulation.", "", "We drank.", "We cried.", "We talked."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "diamonds"}],
    rightLyrics: ["We told each other things we probably shouldn't have told someone we'd just met.", "", "You told me about your ex.", "I learned your complicated relationship history.", "", "And somewhere between the alcohol and the tears, two strangers started becoming friends.", "", "A very questionable beginning.", "But somehow, it worked."],
    rightLyricsEn: ["We told each other things we probably shouldn't have told someone we'd just met.", "", "You told me about your ex.", "I learned your complicated relationship history.", "", "And somewhere between the alcohol and the tears, two strangers started becoming friends.", "", "A very questionable beginning.", "But somehow, it worked."],
    leftStoryLines: ["First day in the PG.", "", "One bottle of vodka.", "", "And apparently absolutely no emotional regulation.", "", "We drank.", "We cried.", "We talked."],
    rightStoryLines: ["We told each other things we probably shouldn't have told someone we'd just met.", "", "You told me about your ex.", "I learned your complicated relationship history.", "", "And somewhere between the alcohol and the tears, two strangers started becoming friends.", "", "A very questionable beginning.", "But somehow, it worked."],
    backLeftStickers: [{"emoji": "\ud83c\udf78", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#9D4EDD", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 6,
    trackNum: "07",
    title: "CERTIFIED BITCH. SECRETLY SOFT.",
    displayTitle: "07. CERTIFIED BITCH. SECRETLY SOFT.",
    subtitle: "You act like \u201cI don't care.\u201d But actually, you care A LOT.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#e63946",
    cassetteTitle: "TAPE #07 // CERTIFIED BITC",
    tapeColor: "#f1faee",
    stampEmoji: "🧸",
    dateTag: "ENTRY #07",
    polaroidCaption: "mean exterior, marshmallow interior \ud83e\uddf8",
    titleLetters: [{"ch": "C", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "E", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "R", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "T", "bg": "#1f5f8b", "color": "#ffffff", "font": "'Arial Black',sans-serif", "rotate": 3}, {"ch": "I", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "F", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "I", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "E", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch07-p1", "title": "CERTIFIED BITCH. SECRETLY SOFT.", "prod": "Bhavika & Khushi Scrapbook", "lines": ["You have spent a significant amount of time convincing people that you are a mean person.", "", "And honestly?", "You are.", "Sometimes.", "", "But unfortunately for your reputation, I know there's a tiny soft-hearted human hiding somewhere inside that attitude."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "stars"}],
    rightLyrics: ["You act like:", "\u201cI don't care.\u201d", "", "But actually:", "you care A LOT.", "", "You just don't want anyone to know.", "", "So yes, you are a bitch.", "But you're my bitch.", "", "And unfortunately, you have a heart."],
    rightLyricsEn: ["You act like:", "\u201cI don't care.\u201d", "", "But actually:", "you care A LOT.", "", "You just don't want anyone to know.", "", "So yes, you are a bitch.", "But you're my bitch.", "", "And unfortunately, you have a heart."],
    leftStoryLines: ["You have spent a significant amount of time convincing people that you are a mean person.", "", "And honestly?", "You are.", "Sometimes.", "", "But unfortunately for your reputation, I know there's a tiny soft-hearted human hiding somewhere inside that attitude."],
    rightStoryLines: ["You act like:", "\u201cI don't care.\u201d", "", "But actually:", "you care A LOT.", "", "You just don't want anyone to know.", "", "So yes, you are a bitch.", "But you're my bitch.", "", "And unfortunately, you have a heart."],
    backLeftStickers: [{"emoji": "\ud83e\uddf8", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#e63946", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 7,
    trackNum: "08",
    title: "SIX MONTHS OF NONSENSE",
    displayTitle: "08. SIX MONTHS OF NONSENSE",
    subtitle: "You were the disciplined one. I was the reason discipline was required.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#3A86FF",
    cassetteTitle: "TAPE #08 // SIX MONTHS OF ",
    tapeColor: "#ff006e",
    stampEmoji: "⏰",
    dateTag: "ENTRY #08",
    polaroidCaption: "running 20 mins late, as always \u23f0",
    titleLetters: [{"ch": "S", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "I", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "X", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "M", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "O", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "N", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "T", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch08-p1", "title": "SIX MONTHS OF NONSENSE", "prod": "Bhavika & Khushi Scrapbook", "lines": ["Then came the actual friendship.", "", "Office.", "PG.", "Late mornings.", "Random conversations.", "Crying.", "Laughing.", "Complaining.", "Oversharing."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "diamonds"}],
    rightLyrics: ["And me being late.", "Very late.", "", "You were the disciplined one.", "I was the reason discipline was required.", "", "I made you late enough times that eventually...", "", "you snapped."],
    rightLyricsEn: ["And me being late.", "Very late.", "", "You were the disciplined one.", "I was the reason discipline was required.", "", "I made you late enough times that eventually...", "", "you snapped."],
    leftStoryLines: ["Then came the actual friendship.", "", "Office.", "PG.", "Late mornings.", "Random conversations.", "Crying.", "Laughing.", "Complaining.", "Oversharing."],
    rightStoryLines: ["And me being late.", "Very late.", "", "You were the disciplined one.", "I was the reason discipline was required.", "", "I made you late enough times that eventually...", "", "you snapped."],
    backLeftStickers: [{"emoji": "\u23f0", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#3A86FF", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 8,
    trackNum: "09",
    title: "THE DAY YOU SHOUTED",
    displayTitle: "09. THE DAY YOU SHOUTED",
    subtitle: "Something that started with a charger had reached the silent-treatment era.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#d00000",
    cassetteTitle: "TAPE #09 // THE DAY YOU SH",
    tapeColor: "#ffba08",
    stampEmoji: "⚡",
    dateTag: "ENTRY #09",
    polaroidCaption: "the quiet storm in the hallway \u26a1",
    titleLetters: [{"ch": "T", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "H", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "E", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "D", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "A", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "Y", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}],
    leftPapers: [{"id": "ch09-p1", "title": "THE DAY YOU SHOUTED", "prod": "Bhavika & Khushi Scrapbook", "lines": ["You shouted.", "I got hurt.", "", "You were angry because I kept doing the same thing.", "I was angry because you shouted at me."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "stars"}],
    rightLyrics: ["And instead of solving it like mature adults...", "we stopped talking.", "", "I avoided you.", "You stayed angry.", "", "And suddenly something that started with a charger had reached the silent-treatment era."],
    rightLyricsEn: ["And instead of solving it like mature adults...", "we stopped talking.", "", "I avoided you.", "You stayed angry.", "", "And suddenly something that started with a charger had reached the silent-treatment era."],
    leftStoryLines: ["You shouted.", "I got hurt.", "", "You were angry because I kept doing the same thing.", "I was angry because you shouted at me."],
    rightStoryLines: ["And instead of solving it like mature adults...", "we stopped talking.", "", "I avoided you.", "You stayed angry.", "", "And suddenly something that started with a charger had reached the silent-treatment era."],
    backLeftStickers: [{"emoji": "\u26a1", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#d00000", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 9,
    trackNum: "10",
    title: "THE CAB CONVERSATION",
    displayTitle: "10. THE CAB CONVERSATION",
    subtitle: "\u201cDon't shout at me.\u201d And somehow, we find our way back.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#38b000",
    cassetteTitle: "TAPE #10 // THE CAB CONVER",
    tapeColor: "#ccff33",
    stampEmoji: "🚖",
    dateTag: "ENTRY #10",
    polaroidCaption: "cab ride truce \ud83d\ude96",
    titleLetters: [{"ch": "T", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "H", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "E", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "C", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "A", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "B", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}],
    leftPapers: [{"id": "ch10-p1", "title": "THE CAB CONVERSATION", "prod": "Bhavika & Khushi Scrapbook", "lines": ["A few days later, in a cab, I finally told you:", "", "\u201cDon't shout at me.\u201d", "", "And somehow, that tiny conversation fixed something.", "", "We talked. We got okay. And we moved on."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "diamonds"}],
    rightLyrics: ["Maybe that was one of the first things I learned about us:", "", "We can fight.", "We can piss each other off.", "We can misunderstand each other.", "", "But somehow...", "we find our way back."],
    rightLyricsEn: ["Maybe that was one of the first things I learned about us:", "", "We can fight.", "We can piss each other off.", "We can misunderstand each other.", "", "But somehow...", "we find our way back."],
    leftStoryLines: ["A few days later, in a cab, I finally told you:", "", "\u201cDon't shout at me.\u201d", "", "And somehow, that tiny conversation fixed something.", "", "We talked. We got okay. And we moved on."],
    rightStoryLines: ["Maybe that was one of the first things I learned about us:", "", "We can fight.", "We can piss each other off.", "We can misunderstand each other.", "", "But somehow...", "we find our way back."],
    backLeftStickers: [{"emoji": "\ud83d\ude96", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#38b000", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 10,
    trackNum: "11",
    title: "NEW FLATS. NEW PROBLEMS.",
    displayTitle: "11. NEW FLATS. NEW PROBLEMS.",
    subtitle: "New phase of life. And neither of us saying what we actually felt.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#fb8500",
    cassetteTitle: "TAPE #11 // NEW FLATS. NEW",
    tapeColor: "#219ebc",
    stampEmoji: "📦",
    dateTag: "ENTRY #11",
    polaroidCaption: "shifting boxes & unspoken thoughts \ud83d\udce6",
    titleLetters: [{"ch": "N", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "E", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "W", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "F", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "L", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "A", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "T", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch11-p1", "title": "NEW FLATS. NEW PROBLEMS.", "prod": "Bhavika & Khushi Scrapbook", "lines": ["We shifted out of the PG.", "", "New flat.", "New flatmate.", "New phase of life.", "", "And then things got complicated.", "I got a boyfriend.", "My attention shifted.", "There were new people around.", "You started feeling left out."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "stars"}],
    rightLyrics: ["I thought: \u201cShe's my friend. I trust her. She'll understand.\u201d", "", "You thought: \u201cApparently I have been replaced.\u201d", "", "And neither of us was really saying what we actually felt.", "", "Which, as you can imagine, worked out beautifully.", "", "It did not."],
    rightLyricsEn: ["I thought: \u201cShe's my friend. I trust her. She'll understand.\u201d", "", "You thought: \u201cApparently I have been replaced.\u201d", "", "And neither of us was really saying what we actually felt.", "", "Which, as you can imagine, worked out beautifully.", "", "It did not."],
    leftStoryLines: ["We shifted out of the PG.", "", "New flat.", "New flatmate.", "New phase of life.", "", "And then things got complicated.", "I got a boyfriend.", "My attention shifted.", "There were new people around.", "You started feeling left out."],
    rightStoryLines: ["I thought: \u201cShe's my friend. I trust her. She'll understand.\u201d", "", "You thought: \u201cApparently I have been replaced.\u201d", "", "And neither of us was really saying what we actually felt.", "", "Which, as you can imagine, worked out beautifully.", "", "It did not."],
    backLeftStickers: [{"emoji": "\ud83d\udce6", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#fb8500", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 11,
    trackNum: "12",
    title: "THE SILENT TREATMENT ERA\u2122",
    displayTitle: "12. THE SILENT TREATMENT ERA™",
    subtitle: "Both caring about the friendship, but doing a spectacularly bad job protecting it.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#5a189a",
    cassetteTitle: "TAPE #12 // THE SILENT TRE",
    tapeColor: "#e0aaff",
    stampEmoji: "🧊",
    dateTag: "ENTRY #12",
    polaroidCaption: "walking on eggshells \ud83e\uddca",
    titleLetters: [{"ch": "T", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "H", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "E", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "S", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "I", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "L", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "E", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch12-p1", "title": "THE SILENT TREATMENT ERA\u2122", "prod": "Bhavika & Khushi Scrapbook", "lines": ["You became more negative.", "I became more irritated.", "", "You felt I wasn't giving you enough importance.", "I felt you were becoming controlling and toxic."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "diamonds"}],
    rightLyrics: ["I kept my anger inside because I didn't want another fight.", "You kept pushing.", "I kept avoiding.", "", "And somewhere in between all of that, we both cared about the friendship but were doing a spectacularly bad job of protecting it."],
    rightLyricsEn: ["I kept my anger inside because I didn't want another fight.", "You kept pushing.", "I kept avoiding.", "", "And somewhere in between all of that, we both cared about the friendship but were doing a spectacularly bad job of protecting it."],
    leftStoryLines: ["You became more negative.", "I became more irritated.", "", "You felt I wasn't giving you enough importance.", "I felt you were becoming controlling and toxic."],
    rightStoryLines: ["I kept my anger inside because I didn't want another fight.", "You kept pushing.", "I kept avoiding.", "", "And somewhere in between all of that, we both cared about the friendship but were doing a spectacularly bad job of protecting it."],
    backLeftStickers: [{"emoji": "\ud83e\uddca", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#5a189a", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 12,
    trackNum: "13",
    title: "THE DRESS INCIDENT",
    displayTitle: "13. THE DRESS INCIDENT",
    subtitle: "One dress. One fight. And I chose you.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#d90429",
    cassetteTitle: "TAPE #13 // THE DRESS INCI",
    tapeColor: "#ef233c",
    stampEmoji: "👗",
    dateTag: "ENTRY #13",
    polaroidCaption: "through every explosion, still you \ud83d\udc57",
    titleLetters: [{"ch": "T", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "H", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "E", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "D", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "R", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "E", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "S", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch13-p1", "title": "THE DRESS INCIDENT", "prod": "Bhavika & Khushi Scrapbook", "lines": ["And then came that night.", "", "One dress.", "One fight.", "Two people who had already accumulated enough frustration.", "", "And suddenly everything exploded.", "", "I had to make a choice."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "stars"}],
    rightLyrics: ["And I chose you.", "", "Not because I believe every single thing you do is right.", "Not because you are always right.", "Let's be very clear about that. \ud83d\ude02", "", "But because when everything actually mattered, I remembered something:", "", "You had been there for me when I wasn't okay.", "And that mattered more."],
    rightLyricsEn: ["And I chose you.", "", "Not because I believe every single thing you do is right.", "Not because you are always right.", "Let's be very clear about that. \ud83d\ude02", "", "But because when everything actually mattered, I remembered something:", "", "You had been there for me when I wasn't okay.", "And that mattered more."],
    leftStoryLines: ["And then came that night.", "", "One dress.", "One fight.", "Two people who had already accumulated enough frustration.", "", "And suddenly everything exploded.", "", "I had to make a choice."],
    rightStoryLines: ["And I chose you.", "", "Not because I believe every single thing you do is right.", "Not because you are always right.", "Let's be very clear about that. \ud83d\ude02", "", "But because when everything actually mattered, I remembered something:", "", "You had been there for me when I wasn't okay.", "And that mattered more."],
    backLeftStickers: [{"emoji": "\ud83d\udc57", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#d90429", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 13,
    trackNum: "14",
    title: "WHEN I LOST MY JOB",
    displayTitle: "14. WHEN I LOST MY JOB",
    subtitle: "Not a motivational speech. You actually opened a door for me.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#0077b6",
    cassetteTitle: "TAPE #14 // WHEN I LOST MY",
    tapeColor: "#90e0ef",
    stampEmoji: "🚪",
    dateTag: "ENTRY #14",
    polaroidCaption: "the friend who actually shows up \ud83d\udeaa\u2728",
    titleLetters: [{"ch": "W", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "H", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "E", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "N", "bg": "#1f5f8b", "color": "#ffffff", "font": "'Arial Black',sans-serif", "rotate": 3}, {"ch": "I", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "L", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch14-p1", "title": "WHEN I LOST MY JOB", "prod": "Bhavika & Khushi Scrapbook", "lines": ["Then life actually tested that friendship.", "", "I lost my job.", "", "And when things got bad...", "you showed up.", "", "Not with some motivational speech.", "Not with: \u201cEverything will be fine.\u201d"], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "diamonds"}],
    rightLyrics: ["You actually worked to help me get into your company.", "", "You opened a door for me.", "And I worked hard to walk through it.", "", "That's probably when I understood something I hadn't fully understood before:", "", "Maybe I don't always say it.", "Maybe I don't always show it properly.", "But I know who has my back."],
    rightLyricsEn: ["You actually worked to help me get into your company.", "", "You opened a door for me.", "And I worked hard to walk through it.", "", "That's probably when I understood something I hadn't fully understood before:", "", "Maybe I don't always say it.", "Maybe I don't always show it properly.", "But I know who has my back."],
    leftStoryLines: ["Then life actually tested that friendship.", "", "I lost my job.", "", "And when things got bad...", "you showed up.", "", "Not with some motivational speech.", "Not with: \u201cEverything will be fine.\u201d"],
    rightStoryLines: ["You actually worked to help me get into your company.", "", "You opened a door for me.", "And I worked hard to walk through it.", "", "That's probably when I understood something I hadn't fully understood before:", "", "Maybe I don't always say it.", "Maybe I don't always show it properly.", "But I know who has my back."],
    backLeftStickers: [{"emoji": "\ud83d\udeaa", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#0077b6", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 14,
    trackNum: "15",
    title: "AND SOMEHOW, HERE AGAIN",
    displayTitle: "15. AND SOMEHOW, HERE AGAIN",
    subtitle: "New company. New flat. Same two idiots.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#2b9348",
    cassetteTitle: "TAPE #15 // AND SOMEHOW, H",
    tapeColor: "#80b918",
    stampEmoji: "🔑",
    dateTag: "ENTRY #15",
    polaroidCaption: "flatmates again: round 2 \ud83d\udd11\ud83c\udfe0",
    titleLetters: [{"ch": "A", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "N", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "D", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "S", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "O", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "M", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "E", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch15-p1", "title": "AND SOMEHOW, HERE AGAIN", "prod": "Bhavika & Khushi Scrapbook", "lines": ["New company.", "New flat.", "Same two idiots.", "", "After all the fights.", "After the PG.", "After changing flats.", "After new people.", "After relationships."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "stars"}],
    rightLyrics: ["After misunderstandings.", "After silent treatments.", "After the dress.", "After losing a job.", "After everything...", "", "we somehow ended up living together again.", "", "And honestly? That feels very us.", "", "Because apparently no matter how many times life gives us a chance to separate... we somehow end up back in the same place."],
    rightLyricsEn: ["After misunderstandings.", "After silent treatments.", "After the dress.", "After losing a job.", "After everything...", "", "we somehow ended up living together again.", "", "And honestly? That feels very us.", "", "Because apparently no matter how many times life gives us a chance to separate... we somehow end up back in the same place."],
    leftStoryLines: ["New company.", "New flat.", "Same two idiots.", "", "After all the fights.", "After the PG.", "After changing flats.", "After new people.", "After relationships."],
    rightStoryLines: ["After misunderstandings.", "After silent treatments.", "After the dress.", "After losing a job.", "After everything...", "", "we somehow ended up living together again.", "", "And honestly? That feels very us.", "", "Because apparently no matter how many times life gives us a chance to separate... we somehow end up back in the same place."],
    backLeftStickers: [{"emoji": "\ud83d\udd11", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#2b9348", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 15,
    trackNum: "16",
    title: "THINGS UNSAID",
    displayTitle: "16. THINGS UNSAID",
    subtitle: "The emergency contact for problems I probably created myself.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#b5179e",
    cassetteTitle: "TAPE #16 // THINGS UNSAID",
    tapeColor: "#7209b7",
    stampEmoji: "🧠",
    dateTag: "ENTRY #16",
    polaroidCaption: "operating on 2% common sense \ud83e\udde0\ud83d\ude02",
    titleLetters: [{"ch": "T", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "H", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "I", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "N", "bg": "#1f5f8b", "color": "#ffffff", "font": "'Arial Black',sans-serif", "rotate": 3}, {"ch": "G", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "S", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "U", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch16-p1", "title": "THINGS UNSAID", "prod": "Bhavika & Khushi Scrapbook", "lines": ["And now comes the part I never really say.", "", "No matter what the problem is...", "I know I have you.", "", "If something goes wrong, you're there.", "If I don't know what to do, you're there.", "If I need help getting out of some ridiculous situation I have somehow created for myself... you're there.", "", "You have this irritating ability to somehow become the emergency contact for problems that I probably created because I wasn't thinking."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "diamonds"}],
    rightLyrics: ["And yes... you constantly tell me that I have no brain. That I'm dumb. That I do the stupidest things.", "", "And honestly, sometimes... fair. I do silly things. I make questionable decisions. I occasionally operate on approximately 2% common sense.", "", "BUT. You should also remember one small thing:", "You consider yourself WAY too smart to believe that someone without a brain could somehow survive all this time.", "", "So either... I actually have a brain.", "OR you have been spending all this time babysitting a brainless idiot.", "", "And if it's the second one... well... congratulations. You chose this. \ud83d\ude02"],
    rightLyricsEn: ["And yes... you constantly tell me that I have no brain. That I'm dumb. That I do the stupidest things.", "", "And honestly, sometimes... fair. I do silly things. I make questionable decisions. I occasionally operate on approximately 2% common sense.", "", "BUT. You should also remember one small thing:", "You consider yourself WAY too smart to believe that someone without a brain could somehow survive all this time.", "", "So either... I actually have a brain.", "OR you have been spending all this time babysitting a brainless idiot.", "", "And if it's the second one... well... congratulations. You chose this. \ud83d\ude02"],
    leftStoryLines: ["And now comes the part I never really say.", "", "No matter what the problem is...", "I know I have you.", "", "If something goes wrong, you're there.", "If I don't know what to do, you're there.", "If I need help getting out of some ridiculous situation I have somehow created for myself... you're there.", "", "You have this irritating ability to somehow become the emergency contact for problems that I probably created because I wasn't thinking."],
    rightStoryLines: ["And yes... you constantly tell me that I have no brain. That I'm dumb. That I do the stupidest things.", "", "And honestly, sometimes... fair. I do silly things. I make questionable decisions. I occasionally operate on approximately 2% common sense.", "", "BUT. You should also remember one small thing:", "You consider yourself WAY too smart to believe that someone without a brain could somehow survive all this time.", "", "So either... I actually have a brain.", "OR you have been spending all this time babysitting a brainless idiot.", "", "And if it's the second one... well... congratulations. You chose this. \ud83d\ude02"],
    backLeftStickers: [{"emoji": "\ud83e\udde0", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#b5179e", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
  {
    id: 16,
    trackNum: "17",
    title: "AND FINALLY...",
    displayTitle: "17. AND FINALLY...",
    subtitle: "Happy Birthday, idiot. Thank you for having my back.",
    prod: "Archived with ❤️ by Bhavika",
    cassetteBg: "#e63946",
    cassetteTitle: "TAPE #17 // AND FINALLY...",
    tapeColor: "#ffd166",
    stampEmoji: "🎂",
    dateTag: "ENTRY #17",
    polaroidCaption: "happy birthday to my idiot \u2764\ufe0f\ud83c\udf82",
    titleLetters: [{"ch": "A", "bg": "#d93829", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": -3}, {"ch": "N", "bg": "#e5b72e", "color": "#111111", "font": "'Impact',sans-serif", "rotate": -1}, {"ch": "D", "bg": "#259385", "color": "#ffffff", "font": "'Georgia',serif", "rotate": 1}, {"ch": "F", "bg": "#264653", "color": "#111111", "font": "'Courier New',monospace", "rotate": -2}, {"ch": "I", "bg": "#e76f51", "color": "#ffffff", "font": "'Permanent Marker',cursive", "rotate": 0}, {"ch": "N", "bg": "#9d4edd", "color": "#ffffff", "font": "'Impact',sans-serif", "rotate": 2}, {"ch": "A", "bg": "#f4a261", "color": "#111111", "font": "'Georgia',serif", "rotate": -3}],
    leftPapers: [{"id": "ch17-p1", "title": "AND FINALLY...", "prod": "Bhavika & Khushi Scrapbook", "lines": ["You made a comic about us last birthday.", "I remember that.", "", "And I don't think I ever properly told you what it meant to me.", "", "So this is my version.", "", "Not because our story is perfect. It isn't.", "We've hurt each other. We've annoyed each other. We've misunderstood each other.", "", "We've probably both thought \u201cbas ab nahi jhel sakti isko\u201d more times than we'd like to admit."], "bgColor": "#faf6ec", "rotate": -1.5, "offsetX": 0, "offsetY": 0, "hasPattern": "stars"}],
    rightLyrics: ["But somehow... we're still here.", "", "And maybe that's the best part of our story.", "", "Happy Birthday, idiot. \ud83c\udf82\u2764\ufe0f", "", "Thank you for being the person I know I can call when everything goes wrong.", "", "And thank you for continuing to have my back."],
    rightLyricsEn: ["But somehow... we're still here.", "", "And maybe that's the best part of our story.", "", "Happy Birthday, idiot. \ud83c\udf82\u2764\ufe0f", "", "Thank you for being the person I know I can call when everything goes wrong.", "", "And thank you for continuing to have my back."],
    leftStoryLines: ["You made a comic about us last birthday.", "I remember that.", "", "And I don't think I ever properly told you what it meant to me.", "", "So this is my version.", "", "Not because our story is perfect. It isn't.", "We've hurt each other. We've annoyed each other. We've misunderstood each other.", "", "We've probably both thought \u201cbas ab nahi jhel sakti isko\u201d more times than we'd like to admit."],
    rightStoryLines: ["But somehow... we're still here.", "", "And maybe that's the best part of our story.", "", "Happy Birthday, idiot. \ud83c\udf82\u2764\ufe0f", "", "Thank you for being the person I know I can call when everything goes wrong.", "", "And thank you for continuing to have my back."],
    backLeftStickers: [{"emoji": "\ud83c\udf82", "top": "18%", "left": "75%", "size": 42, "rotate": -6}, {"emoji": "\u2b50", "top": "78%", "left": "12%", "size": 36, "rotate": 12}, {"emoji": "\u2764\ufe0f", "top": "68%", "left": "82%", "size": 38, "rotate": -8}],
    backRightColors: ["#e63946", "#2A9D8F", "#E63946", "#264653", "#F5C842", "#ffffff", "#F4A261", "#4CC9F0"]
  },
];

/* ══════════════════════════════════════════════════
   BAUHAUS GEOMETRIC ART
══════════════════════════════════════════════════ */
const GEO_SHAPES = [
  { type: "rect", x: 0, y: 0, w: 40, h: 40 },
  { type: "circle", x: 40, y: 0, w: 40, h: 40 },
  { type: "rect", x: 80, y: 0, w: 40, h: 40 },
  { type: "triangle", x: 120, y: 0, w: 40, h: 40 },
  { type: "heart", x: 80, y: 40, w: 40, h: 40 },
  { type: "rect", x: 0, y: 40, w: 80, h: 40 },
  { type: "triangle", x: 0, y: 80, w: 40, h: 40 },
  { type: "rect", x: 40, y: 80, w: 80, h: 40 },
  { type: "circle", x: 120, y: 40, w: 40, h: 80 },
  { type: "rect", x: 0, y: 120, w: 40, h: 40 },
  { type: "triangle", x: 40, y: 120, w: 40, h: 40 },
  { type: "rect", x: 80, y: 120, w: 80, h: 40 },
  { type: "rect", x: 0, y: 160, w: 80, h: 40 },
  { type: "circle", x: 80, y: 160, w: 40, h: 40 },
  { type: "triangle", x: 120, y: 160, w: 40, h: 40 },
];

function BauhausArt({ colors }: { colors: string[] }) {
  return (
    <svg viewBox="0 0 160 200" style={{ width: "100%", height: "100%", display: "block" }}>
      {GEO_SHAPES.map((s, i) => {
        const c = colors[i % colors.length];
        if (s.type === "rect") return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={c} />;
        if (s.type === "circle") return <ellipse key={i} cx={s.x + s.w / 2} cy={s.y + s.h / 2} rx={s.w / 2} ry={s.h / 2} fill={c} />;
        if (s.type === "triangle") return <polygon key={i} points={`${s.x},${s.y + s.h} ${s.x + s.w / 2},${s.y} ${s.x + s.w},${s.y + s.h}`} fill={c} />;
        if (s.type === "heart")
          return (
            <path
              key={i}
              d={`M${s.x + s.w / 2},${s.y + s.h * 0.35} C${s.x + s.w / 2},${s.y + s.h * 0.1} ${s.x},${s.y + s.h * 0.1} ${s.x},${s.y + s.h * 0.35} C${s.x},${s.y + s.h * 0.6} ${s.x + s.w / 2},${s.y + s.h * 0.8} ${s.x + s.w / 2},${s.y + s.h} C${s.x + s.w / 2},${s.y + s.h * 0.8} ${s.x + s.w},${s.y + s.h * 0.6} ${s.x + s.w},${s.y + s.h * 0.35} C${s.x + s.w},${s.y + s.h * 0.1} ${s.x + s.w / 2},${s.y + s.h * 0.1} ${s.x + s.w / 2},${s.y + s.h * 0.35}`}
              fill={c}
            />
          );
        return null;
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   HAND-FOLDED & CRUMPLED PAPER
══════════════════════════════════════════════════ */
function CrumpledFoldedPaper({
  paper,
  phase,
  stackIndex,
  totalStack,
  onExpand,
}: {
  paper: Paper;
  phase: AnimPhase;
  stackIndex: number;
  totalStack: number;
  onExpand: (paper: Paper) => void;
}) {
  const delay = stackIndex * 0.08;

  let transform = `rotate(${paper.rotate}deg)`;
  let opacity = 1;
  let transition = `transform ${0.45 + delay}s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease`;

  if (phase === "compress") {
    const compressY = stackIndex * -8;
    transform = `rotate(${paper.rotate - 3}deg) scaleX(0.08) translateY(${compressY}px) scaleY(0.9)`;
    opacity = 0.5;
    transition = `transform ${0.3 + delay * 0.4}s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.2s ease`;
  } else if (phase === "unfold") {
    transform = `rotate(${paper.rotate}deg) scaleX(1) scaleY(1)`;
    opacity = 1;
    transition = `transform ${0.45 + delay}s cubic-bezier(0.34, 1.45, 0.64, 1) ${delay}s, opacity 0.3s ease ${delay * 0.5}s`;
  }

  return (
    <div
      onClick={() => onExpand(paper)}
      style={{
        position: "absolute",
        top: paper.offsetY,
        left: paper.offsetX,
        right: 0,
        bottom: 0,
        background: paper.bgColor,
        backgroundImage: `
          repeating-linear-gradient(transparent, transparent 27px, rgba(180,160,120,0.38) 27px, rgba(180,160,120,0.38) 28px),
          linear-gradient(to bottom, transparent 48.5%, rgba(0,0,0,0.12) 49.5%, rgba(255,255,255,0.45) 50.5%, transparent 52%),
          linear-gradient(to right, transparent 48.5%, rgba(0,0,0,0.10) 49.5%, rgba(255,255,255,0.4) 50.5%, transparent 52%),
          linear-gradient(35deg, transparent 41%, rgba(0,0,0,0.08) 42.5%, rgba(255,255,255,0.32) 43.5%, transparent 45%),
          linear-gradient(-38deg, transparent 58%, rgba(0,0,0,0.09) 59.5%, rgba(255,255,255,0.28) 60.5%, transparent 62%)
        `,
        backgroundPosition: "0 34px, 0 0, 0 0, 0 0, 0 0",
        transform,
        transformOrigin: "left center",
        opacity,
        transition,
        boxShadow: `
          ${2 + stackIndex * 2}px ${3 + stackIndex * 2}px ${8 + stackIndex * 4}px rgba(0,0,0,0.25),
          inset 0 0 16px rgba(160,130,90,0.12)
        `,
        borderRadius: "2px",
        cursor: "pointer",
        zIndex: totalStack - stackIndex,
        overflow: "hidden",
        padding: "22px 14px 14px",
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: `translateX(-50%) rotate(${stackIndex % 2 === 0 ? -2 : 2.5}deg)`,
          width: 60,
          height: 16,
          background:
            stackIndex % 3 === 0
              ? "rgba(255,200,100,0.6)"
              : stackIndex % 3 === 1
              ? "rgba(150,200,255,0.55)"
              : "rgba(255,180,200,0.6)",
          borderRadius: 2,
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 16,
          height: 16,
          background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.12) 50%, rgba(255,255,255,0.4) 52%, rgba(220,200,170,0.85) 60%)",
          zIndex: 8,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: "'Kalam', cursive",
          fontSize: "0.7rem",
          color: "#2c1c0a",
          fontWeight: 700,
          marginBottom: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{paper.title}</span>
        {paper.prod && <span style={{ fontSize: "0.52rem", color: "#777", fontStyle: "italic" }}>{paper.prod}</span>}
      </div>

      <div
        style={{
          fontFamily: "'Kalam', cursive",
          fontSize: "0.6rem",
          color: "#2a1a08",
          lineHeight: "26px",
          whiteSpace: "pre-line",
          overflow: "hidden",
        }}
      >
        {paper.lines.slice(0, 7).join("\n")}
        {paper.lines.length > 7 && "\n..."}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 5,
          right: 8,
          fontSize: "0.48rem",
          fontFamily: "'Caveat', cursive",
          color: "#8a6a40",
          opacity: 0.8,
        }}
      >
        folded note ↗ tap
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   EXPANDED PAPER MODAL
══════════════════════════════════════════════════ */
function ExpandedPaperModal({ paper, onClose }: { paper: Paper; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: visible ? "rgba(15,5,0,0.7)" : "rgba(15,5,0,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        transition: "background 0.35s ease",
      }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(680px, 92vw)",
          maxHeight: "88vh",
          background: paper.bgColor,
          backgroundImage: `
            repeating-linear-gradient(transparent, transparent 29px, rgba(180,160,120,0.45) 29px, rgba(180,160,120,0.45) 30px),
            linear-gradient(to bottom, transparent 49%, rgba(0,0,0,0.12) 50%, rgba(255,255,255,0.4) 51%, transparent 52%),
            linear-gradient(to right, transparent 49%, rgba(0,0,0,0.10) 50%, rgba(255,255,255,0.4) 51%, transparent 52%)
          `,
          backgroundPosition: "0 40px, 0 0, 0 0",
          borderRadius: "3px",
          padding: "36px 36px 60px",
          overflowY: "auto",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.7) translateY(40px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.38s cubic-bezier(0.34, 1.36, 0.64, 1), opacity 0.3s ease",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 6px 20px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -10,
            left: "50%",
            transform: "translateX(-50%) rotate(-1deg)",
            width: 85,
            height: 22,
            background: "rgba(255,200,100,0.65)",
            borderRadius: 3,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
            borderBottom: "1.5px solid rgba(180,160,120,0.45)",
            paddingBottom: 14,
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Permanent Marker', cursive",
                fontSize: "clamp(1.2rem, 3.5vw, 1.7rem)",
                color: "#1a1a1a",
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: "0.02em",
              }}
            >
              {paper.title}
            </h2>
            {paper.prod && (
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.95rem", color: "#8a5d3b", fontWeight: 700 }}>
                {paper.prod}
              </span>
            )}
          </div>

          {/* ── RANSOM CUT-OUT "CLOSE" BUTTON DIRECTLY ON THE EXPANDED LETTER ── */}
          <div
            onClick={handleClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              cursor: "pointer",
              padding: "4px 6px",
              borderRadius: "4px",
              transition: "transform 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1) rotate(1deg)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}
            title="Click to close letter"
          >
            {[
              { ch: "C", bg: "#F5C842", color: "#1a1a1a", rotate: -3 },
              { ch: "L", bg: "#2A9D8F", color: "#ffffff", rotate: 2 },
              { ch: "O", bg: "#F1E8D0", color: "#8B1A1A", rotate: -2 },
              { ch: "S", bg: "#C1121F", color: "#ffffff", rotate: 3 },
              { ch: "E", bg: "#1a1a1a", color: "#F5C842", rotate: -1 },
            ].map((l, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  background: l.bg,
                  color: l.color,
                  fontFamily: "'Permanent Marker', 'Impact', cursive",
                  fontSize: "clamp(1.0rem, 2.2vw, 1.35rem)",
                  fontWeight: 900,
                  padding: "4px 8px",
                  transform: `rotate(${l.rotate}deg)`,
                  boxShadow: "2px 3px 6px rgba(0,0,0,0.45)",
                  lineHeight: 1.1,
                  userSelect: "none",
                }}
              >
                {l.ch}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "clamp(0.92rem, 2.2vw, 1.12rem)",
            color: "#1a0a00",
            lineHeight: "32px",
            whiteSpace: "pre-line",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {paper.lines.join("\n")}
        </div>
      </div>

      {/* Floating Bottom CLOSE button */}
     
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CASSETTE TAPE
══════════════════════════════════════════════════ */
function Cassette({
  trackNum,
  title,
  bg,
  isPlaying,
  onPrev,
  onStop,
  onNext,
}: {
  trackNum: string;
  title: string;
  bg: string;
  isPlaying: boolean;
  onPrev: () => void;
  onStop: () => void;
  onNext: () => void;
}) {
  return (
    <div
      style={{
        width: 310,
        filter: "drop-shadow(3px 6px 14px rgba(0,0,0,0.55))",
        transform: "rotate(-1.5deg)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 135,
          background: `linear-gradient(160deg, ${bg}ee, ${bg}aa)`,
          borderRadius: "7px",
          position: "relative",
          border: `1.5px solid ${bg}88`,
          boxShadow: `inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3)`,
        }}
      >
        {[16, 282].map((x) =>
          [10, 105].map((y) => (
            <div
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.3)",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
              }}
            />
          ))
        )}

        <div
          style={{
            position: "absolute",
            top: 10,
            left: 30,
            right: 30,
            height: 88,
            background: "linear-gradient(180deg,#f5f0e0,#ede8d0)",
            borderRadius: 3,
            padding: "5px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                background: "#e8a020",
                color: "#fff",
                fontSize: "0.55rem",
                fontWeight: 900,
                padding: "1px 5px",
                borderRadius: 2,
                fontFamily: "Arial Black,sans-serif",
              }}
            >
              {trackNum}
            </div>
            <div
              style={{
                fontFamily: "'Caveat',cursive",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: "0.4rem", color: "#aaa" }}>℗</div>
          </div>

          <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
            {["LISTEN NOW ♪", "AUDIO MEMO ▶"].map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.4rem",
                  padding: "1px 4px",
                  borderRadius: 2,
                  background: i === 0 ? bg : "#555",
                  color: "#fff",
                  fontFamily: "Arial,sans-serif",
                  letterSpacing: "0.04em",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flex: 1 }}>
            {[0, 1].map((ri) => (
              <div
                key={ri}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: `linear-gradient(${ri * 90}deg,#999,#555,#333)`,
                  boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  animation: isPlaying ? `spinReelF ${1.2 + ri * 0.7}s linear infinite` : "none",
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ccc" }} />
                {[0, 60, 120, 180, 240, 300].map((d) => (
                  <div
                    key={d}
                    style={{
                      position: "absolute",
                      width: 2,
                      height: 12,
                      background: "#666",
                      transform: `rotate(${d}deg) translateY(-6px)`,
                      top: "50%",
                      left: "calc(50% - 1px)",
                      transformOrigin: "bottom center",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "'Permanent Marker',cursive",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
          }}
        >
          THINGS I NEVER SAID
        </div>
      </div>

      <div
        style={{
          display: "flex",
          background: "linear-gradient(180deg,#2a2a2a,#1a1a1a)",
          borderRadius: "0 0 6px 6px",
          border: "1.5px solid #111",
          borderTop: "none",
          overflow: "hidden",
        }}
      >
        {[
          ["◀ PREV", onPrev],
          ["■ STOP", onStop],
          ["NEXT ▶", onNext],
        ].map(([label, fn]) => (
          <button
            key={label as string}
            onClick={fn as () => void}
            style={{
              flex: 1,
              padding: "5px 0",
              background: "transparent",
              border: "none",
              borderRight: "1px solid #333",
              color: "#ccc",
              fontSize: "0.5rem",
              fontFamily: "Arial,sans-serif",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {label as string}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PEN SVG
══════════════════════════════════════════════════ */
function Pen() {
  return (
    <div
      style={{
        position: "absolute",
        top: -24,
        left: -34,
        width: 240,
        transform: "rotate(36deg)",
        zIndex: 20,
        pointerEvents: "none",
        filter: "drop-shadow(2px 4px 8px rgba(0,0,0,0.4))",
      }}
    >
      <svg viewBox="0 0 260 26" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="7" width="215" height="12" rx="6" fill="#1a1a1a" />
        <rect x="18" y="7" width="7" height="12" rx="1" fill="#c8a830" />
        <rect x="28" y="7" width="3" height="12" fill="#c8a830" />
        <rect x="192" y="7" width="12" height="12" rx="1" fill="#c8a830" />
        <rect x="204" y="7" width="28" height="12" rx="3" fill="#2a2a2a" />
        <polygon points="232,9 256,13 232,17" fill="#888" />
        <polygon points="254,12.5 260,13 254,13.5" fill="#ddd" />
        <rect x="38" y="8" width="140" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
        <text x="10" y="18" fontFamily="Arial" fontSize="4" fill="rgba(255,255,255,0.25)" letterSpacing="0.5">
          THINGS I NEVER SAID
        </text>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CONTINUOUSLY ROTATING STAR COMPONENT
   "jitne bh stars h they should keep rotating"
══════════════════════════════════════════════════ */
function RotatingStar({
  color = "#FFD700",
  size = "1.2rem",
  speed = 6,
  reverse = false,
  style,
}: {
  color?: string;
  size?: string | number;
  speed?: number;
  reverse?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        transformOrigin: "center center",
        animation: `${reverse ? "rotateStarCounter" : "rotateStarClockwise"} ${speed}s linear infinite`,
        color,
        fontSize: size,
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    >
      ★
    </span>
  );
}

/* ══════════════════════════════════════════════════
   TRANSLUCENT 3D GUMMY BEAR COMPONENT
   Matches reference image: Red (upper-right), Blue (lower-left), Yellow (lower-right)
══════════════════════════════════════════════════ */
function GummyBear({
  color,
  rotate = 0,
  scale = 1,
}: {
  color: "red" | "blue" | "yellow";
  rotate?: number;
  scale?: number;
}) {
  const configs = {
    red: {
      grad1: "#ff3b56",
      grad2: "#c60021",
      spec: "rgba(255,255,255,0.85)",
      shadow: "rgba(180,0,30,0.45)",
    },
    blue: {
      grad1: "#00d4ff",
      grad2: "#0277bd",
      spec: "rgba(255,255,255,0.85)",
      shadow: "rgba(0,100,180,0.45)",
    },
    yellow: {
      grad1: "#ffe600",
      grad2: "#f59e0b",
      spec: "rgba(255,255,255,0.9)",
      shadow: "rgba(190,130,0,0.45)",
    },
  };
  const cfg = configs[color];
  const uid = `bear-${color}-${Math.floor(rotate * 100)}`;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `rotate(${rotate}deg) scale(${scale})`,
        filter: "drop-shadow(2px 5px 7px rgba(0,0,0,0.42))",
        pointerEvents: "none",
      }}
    >
      <svg width="34" height="48" viewBox="0 0 34 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${uid}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={cfg.grad1} stopOpacity="0.94" />
            <stop offset="100%" stopColor={cfg.grad2} stopOpacity="0.98" />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="100%" stopColor={cfg.grad1} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Left Ear */}
        <circle cx="8" cy="8" r="4.8" fill={`url(#${uid}-body)`} />
        <circle cx="8" cy="8" r="2.4" fill={cfg.grad2} opacity="0.6" />

        {/* Right Ear */}
        <circle cx="26" cy="8" r="4.8" fill={`url(#${uid}-body)`} />
        <circle cx="26" cy="8" r="2.4" fill={cfg.grad2} opacity="0.6" />

        {/* Head */}
        <rect x="7" y="6" width="20" height="15" rx="7.5" fill={`url(#${uid}-body)`} />

        {/* Snout */}
        <ellipse cx="17" cy="14" rx="4.8" ry="3.8" fill={`url(#${uid}-body)`} />
        <ellipse cx="17" cy="13" rx="2" ry="1.2" fill={cfg.grad2} opacity="0.7" />

        {/* Eyes */}
        <circle cx="12.5" cy="11.5" r="1.3" fill={cfg.grad2} opacity="0.8" />
        <circle cx="21.5" cy="11.5" r="1.3" fill={cfg.grad2} opacity="0.8" />

        {/* Chubby Body */}
        <path
          d="M 9 18 C 6 22, 5 31, 8 36 C 9 38, 12 39, 17 39 C 22 39, 25 38, 26 36 C 29 31, 28 22, 25 18 Z"
          fill={`url(#${uid}-body)`}
        />

        {/* Left Arm */}
        <ellipse cx="6.5" cy="24" rx="3.5" ry="5.5" transform="rotate(22 6.5 24)" fill={`url(#${uid}-body)`} />

        {/* Right Arm */}
        <ellipse cx="27.5" cy="24" rx="3.5" ry="5.5" transform="rotate(-22 27.5 24)" fill={`url(#${uid}-body)`} />

        {/* Left Leg */}
        <ellipse cx="10" cy="38" rx="4.5" ry="6.5" fill={`url(#${uid}-body)`} />

        {/* Right Leg */}
        <ellipse cx="24" cy="38" rx="4.5" ry="6.5" fill={`url(#${uid}-body)`} />

        {/* Gloss Highlights / Specular Reflection Sheen */}
        <ellipse cx="13.5" cy="9.5" rx="4" ry="2" fill={cfg.spec} opacity="0.65" />
        <ellipse cx="16" cy="26" rx="5" ry="7" fill={`url(#${uid}-glow)`} />
        <path d="M 12 23 Q 15 20 18 23" stroke={cfg.spec} strokeWidth="1.2" strokeLinecap="round" opacity="0.65" fill="none" />
        <ellipse cx="9" cy="38" rx="2" ry="1.5" fill={cfg.spec} opacity="0.55" />
        <ellipse cx="23" cy="38" rx="2" ry="1.5" fill={cfg.spec} opacity="0.55" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TRICYCLE BOY STICKER (PANEL 2)
   Kid in red hoodie crouching on bright green tricycle, die-cut white outline
══════════════════════════════════════════════════ */
function TricycleBoySticker({ size = 110 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.38))",
        transform: "rotate(-2deg)",
        pointerEvents: "none",
      }}
    >
      <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Die-cut white sticker backing border */}
        <path
          d="M 38 12 C 48 8, 62 10, 68 18 C 74 26, 76 38, 75 48 C 76 56, 82 66, 80 78 C 78 88, 72 98, 68 108 C 64 116, 50 118, 40 116 C 30 114, 20 108, 16 98 C 12 88, 16 76, 22 66 C 26 56, 28 44, 28 32 C 28 20, 32 14, 38 12 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="3"
        />

        {/* Tricycle Wheels */}
        {/* Rear Wheel Left */}
        <circle cx="28" cy="98" r="10" fill="#222" />
        <circle cx="28" cy="98" r="6" fill="#76c820" />
        <circle cx="28" cy="98" r="2.5" fill="#333" />

        {/* Rear Wheel Right */}
        <circle cx="68" cy="98" r="10" fill="#222" />
        <circle cx="68" cy="98" r="6" fill="#76c820" />
        <circle cx="68" cy="98" r="2.5" fill="#333" />

        {/* Front Wheel */}
        <circle cx="48" cy="104" r="12" fill="#222" />
        <circle cx="48" cy="104" r="7" fill="#76c820" />
        <circle cx="48" cy="104" r="3" fill="#111" />

        {/* Green Tricycle Frame & Fork */}
        <path d="M 28 98 L 48 90 L 68 98" stroke="#76c820" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 48 90 L 48 76" stroke="#76c820" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 44 76 L 52 76" stroke="#111" strokeWidth="4" strokeLinecap="round" />

        {/* Boy Shoes - Lime Green Sneakers */}
        <ellipse cx="36" cy="95" rx="7" ry="4" fill="#a4e022" transform="rotate(-15 36 95)" />
        <ellipse cx="60" cy="95" rx="7" ry="4" fill="#a4e022" transform="rotate(15 60 95)" />
        <path d="M 32 94 L 38 92" stroke="#fff" strokeWidth="1" />
        <path d="M 58 92 L 64 94" stroke="#fff" strokeWidth="1" />

        {/* Blue Denim Jeans */}
        <path d="M 32 68 C 28 76, 28 88, 34 93 C 38 88, 44 80, 46 72 Z" fill="#2b4c7e" />
        <path d="M 64 68 C 68 76, 68 88, 62 93 C 58 88, 52 80, 50 72 Z" fill="#233e66" />

        {/* Red Oversized Hoodie (Crouching pose) */}
        <path
          d="M 34 38 C 30 48, 28 64, 36 72 C 44 76, 54 76, 62 72 C 70 64, 68 48, 64 38 C 60 30, 38 30, 34 38 Z"
          fill="#d32f2f"
        />
        {/* Hoodie folds and shadows */}
        <path d="M 36 46 C 42 54, 56 54, 62 46" stroke="#b71c1c" strokeWidth="2.5" fill="none" />
        <path d="M 40 56 C 46 62, 54 62, 58 56" stroke="#b71c1c" strokeWidth="2" fill="none" />

        {/* Hood Head */}
        <path d="M 36 28 C 34 18, 44 14, 49 14 C 54 14, 64 18, 62 28 C 60 36, 38 36, 36 28 Z" fill="#e53935" />
        {/* Inner hood face shadow */}
        <ellipse cx="49" cy="27" rx="6.5" ry="6" fill="#1a1a1a" opacity="0.75" />
        {/* Subtle face profile */}
        <ellipse cx="49" cy="28" rx="3.5" ry="3.5" fill="#f5c298" opacity="0.6" />
        {/* White hoodie drawstrings */}
        <path d="M 45 34 L 44 44" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 53 34 L 54 44" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MATTE BLACK HEART WALLPAPER (PANEL 4)
   Staggered vertical columns of subtle hearts
══════════════════════════════════════════════════ */
function HeartWallpaper() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#161616",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="heartPattern" width="28" height="34" patternUnits="userSpaceOnUse">
            <path
              d="M 14 8 C 14 8, 10 3, 5 5 C 1 7, 0 12, 3 17 C 6 22, 14 27, 14 27 C 14 27, 22 22, 25 17 C 28 12, 27 7, 23 5 C 18 3, 14 8, 14 8 Z"
              fill="rgba(255,255,255,0.09)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heartPattern)" />
      </svg>
      {/* Subtle edge vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PHOTO FILMSTRIP (PANEL 6)
   Vertical stack of 5 snapshots (Lawn, Night Lounge, Green Hedge, Bedroom, Ocean)
══════════════════════════════════════════════════ */
function PhotoFilmstrip({ _chapter }: { _chapter?: Chapter }) {
  const photos = [
    {
      label: "Lawn",
      bg: "linear-gradient(180deg, #7cb9e8 0%, #4d8c2f 70%)",
      svg: (
        <svg viewBox="0 0 100 80" width="100%" height="100%">
          <rect width="100" height="40" fill="#7cb9e8" />
          <circle cx="85" cy="14" r="8" fill="#fff9d2" opacity="0.85" />
          <path d="M 0 35 Q 50 25 100 38 L 100 80 L 0 80 Z" fill="#4d8c2f" />
          <ellipse cx="50" cy="55" rx="16" ry="8" fill="#e6d5b8" />
          <circle cx="48" cy="48" r="4" fill="#333" />
          <ellipse cx="50" cy="53" rx="6" ry="3" fill="#d32f2f" />
        </svg>
      ),
    },
    {
      label: "Night lounge",
      bg: "#120a1e",
      svg: (
        <svg viewBox="0 0 100 80" width="100%" height="100%">
          <rect width="100" height="80" fill="#120a1e" />
          <ellipse cx="70" cy="30" rx="35" ry="25" fill="#8a2be2" opacity="0.45" />
          <ellipse cx="30" cy="50" rx="25" ry="18" fill="#ff1493" opacity="0.3" />
          <rect x="0" y="55" width="100" height="25" fill="#08040d" />
          <ellipse cx="40" cy="55" rx="8" ry="2" fill="#1f1133" />
          <rect x="38" y="44" width="4" height="11" fill="#2d1747" />
          <ellipse cx="40" cy="44" rx="3" ry="1" fill="#ff69b4" opacity="0.7" />
        </svg>
      ),
    },
    {
      label: "Green garden hedge",
      bg: "#1c4718",
      svg: (
        <svg viewBox="0 0 100 80" width="100%" height="100%">
          <rect width="100" height="30" fill="#b0d8e8" />
          <path d="M 0 25 Q 30 18 60 26 Q 85 20 100 24 L 100 80 L 0 80 Z" fill="#1c4718" />
          <ellipse cx="30" cy="45" rx="20" ry="12" fill="#2d6e24" />
          <ellipse cx="75" cy="42" rx="22" ry="14" fill="#388e3c" />
          <path d="M 38 80 L 46 55 L 56 55 L 64 80 Z" fill="#c2b280" />
        </svg>
      ),
    },
    {
      label: "Morning bedroom",
      bg: "#ece6dc",
      svg: (
        <svg viewBox="0 0 100 80" width="100%" height="100%">
          <rect width="100" height="80" fill="#d9d0c5" />
          <polygon points="10,0 45,0 75,80 15,80" fill="#fff" opacity="0.25" />
          <rect x="15" y="40" width="70" height="36" rx="2" fill="#fdfcf8" />
          <path d="M 15 50 Q 50 44 85 52 L 85 76 L 15 76 Z" fill="#ece6dc" />
          <ellipse cx="35" cy="46" rx="10" ry="5" fill="#fcfaf6" />
        </svg>
      ),
    },
    {
      label: "Ocean horizon",
      bg: "#0288d1",
      svg: (
        <svg viewBox="0 0 100 80" width="100%" height="100%">
          <rect width="100" height="36" fill="#81d4fa" />
          <rect x="0" y="36" width="100" height="26" fill="#0288d1" />
          <ellipse cx="80" cy="44" rx="10" ry="4" fill="#546e7a" />
          <path d="M 0 60 Q 50 54 100 58 L 100 80 L 0 80 Z" fill="#d7ccc8" />
          <path d="M 0 60 Q 50 54 100 58" stroke="#ffffff" strokeWidth="2" opacity="0.8" fill="none" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0f0f0f",
        padding: "6px 5px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "5px",
        boxShadow: "inset 2px 0 6px rgba(0,0,0,0.5)",
      }}
    >
      {photos.map((p, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            background: "#ffffff",
            padding: "2.5px 2.5px 3.5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.45)",
            borderRadius: "1px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              width: "100%",
              overflow: "hidden",
              borderRadius: "1px",
              background: p.bg,
              position: "relative",
            }}
          >
            {p.svg}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle, transparent 65%, rgba(0,0,0,0.25) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   INTERACTIVE PROTRUDING SIDE TABS (RIGHT EDGE)
   All 17 Chapters + Index with train marquee scrolling on hover
══════════════════════════════════════════════════ */
function SideTabs({
  currentIdx,
  onSelectChapter,
  onOpenIndex,
}: {
  currentIdx: number;
  onSelectChapter: (id: number) => void;
  onOpenIndex: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 6,
        right: -48,
        bottom: 6,
        width: 48,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 90,
        pointerEvents: "auto",
        gap: 1.5,
      }}
    >
      {/* INDEX / BACK COVER TAB AT TOP */}
      <div
        onClick={() => {
          playChapterClickSound();
          onOpenIndex();
        }}
        className="side-tab-pill"
        style={{
          width: 50,
          height: 19,
          background: "linear-gradient(to right, #b8860b, #d4af37)",
          color: "#fff",
          borderRadius: "0 5px 5px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.52rem",
          fontWeight: 900,
          fontFamily: "'Arial Black', sans-serif",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.45)",
          cursor: "pointer",
          borderTop: "1px solid #ffe082",
          borderRight: "1px solid #ffe082",
          borderBottom: "1px solid #ffe082",
          borderLeft: "none",
          overflow: "hidden",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        title="View Back Cover & Full Tracklist"
      >
        <span style={{ letterSpacing: "0.04em" }}>INDEX 📑</span>
      </div>

      {/* 17 CHAPTER TABS */}
      {CHAPTERS.map((ch) => {
        const isActive = currentIdx === ch.id;
        return (
          <div
            key={ch.id}
            onClick={() => {
              playChapterClickSound();
              onSelectChapter(ch.id);
            }}
            className="side-tab-pill"
            style={{
              position: "relative",
              width: isActive ? 54 : 48,
              height: 19,
              background: isActive
                ? "linear-gradient(to right, #fcf4db, #f5ebd0)"
                : "linear-gradient(to right, #d4c29c, #c0af88)",
              borderRadius: "0 5px 5px 0",
              display: "flex",
              alignItems: "center",
              paddingLeft: 4,
              boxShadow: isActive
                ? "3px 2px 7px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.7)"
                : "2px 1px 4px rgba(0,0,0,0.25)",
              cursor: "pointer",
              zIndex: isActive ? 20 : 10,
              borderTop: isActive ? "1.5px solid #d4af37" : "1px solid rgba(0,0,0,0.2)",
              borderRight: isActive ? "1.5px solid #d4af37" : "1px solid rgba(0,0,0,0.2)",
              borderBottom: isActive ? "1.5px solid #d4af37" : "1px solid rgba(0,0,0,0.2)",
              borderLeft: "none",
              overflow: "hidden",
              flexShrink: 0,
            }}
            title={`Read Chapter ${ch.trackNum}: ${ch.title}`}
          >
            <div className="tab-train-viewport" style={{ width: "100%", overflow: "hidden" }}>
              <div
                className="tab-train-scroll"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  fontFamily: "'Courier New', monospace, sans-serif",
                  fontSize: "0.48rem",
                  fontWeight: 800,
                  color: isActive ? "#8B2020" : "#2b1d0c",
                }}
              >
                <span>
                  <strong style={{ color: "#a62020" }}>{ch.trackNum}</strong> {ch.title} &nbsp;🚂&nbsp;&nbsp;
                </span>
                <span>
                  <strong style={{ color: "#a62020" }}>{ch.trackNum}</strong> {ch.title} &nbsp;🚂&nbsp;&nbsp;
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CRUMPLED & UNCRUMPLING LETTER PAPER
   Uncrumples on page unfolding, crumbles on page flip
══════════════════════════════════════════════════ */
function CrumpledLetterPaper({
  title,
  subtitle,
  lines,
  side = "left",
  tapeColor = "#e8c97e",
  tapeRotate = -3,
  stampEmoji = "💌",
  dateTag,
  initialDelay = 220,
  onExpand,
}: {
  title: string;
  subtitle?: string;
  lines: string[];
  side?: "left" | "right";
  tapeColor?: string;
  tapeRotate?: number;
  stampEmoji?: string;
  dateTag?: string;
  initialDelay?: number;
  onExpand?: () => void;
}) {
  const [paperState, setPaperState] = useState<"ball" | "uncrumpling" | "open" | "crumpling">("ball");

  // On mount (chapter load or page flip), starts as crumpled ball then automatically uncrumples silently
  useEffect(() => {
    const uncrumpleTimer = setTimeout(() => {
      setPaperState("uncrumpling");
      const settleTimer = setTimeout(() => {
        setPaperState("open");
      }, 750);
      return () => clearTimeout(settleTimer);
    }, initialDelay);

    return () => clearTimeout(uncrumpleTimer);
  }, [initialDelay]);

  const handleClickBall = () => {
    if (paperState === "ball") {
      setPaperState("uncrumpling");
      playUncrumpleSound();
      setTimeout(() => setPaperState("open"), 750);
    }
  };

  const handleLetterClick = () => {
    if (paperState === "open" && onExpand) {
      playUncrumpleSound();
      playChapterClickSound();
      onExpand();
    } else if (paperState === "ball") {
      setPaperState("uncrumpling");
      playUncrumpleSound();
      setTimeout(() => setPaperState("open"), 750);
    }
  };

  // When crumpled: Show ONLY the realistic 3D crumpled paper ball
  if (paperState === "ball") {
    return (
      <div
        onClick={handleClickBall}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: "16px 20px",
          userSelect: "none",
          zIndex: 15,
        }}
        title="Click to uncrumple this letter"
      >
        <div
          style={{
            width: 145,
            height: 145,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformOrigin: "center center",
            transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08) rotate(4deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
          }}
        >
          <img
            src="/cutouts/crumpled_paper_ball.png"
            alt="Crumpled letter"
            style={{
              width: "100%",
              height: "auto",
              filter: "drop-shadow(0 14px 20px rgba(0,0,0,0.65)) contrast(110%)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: "'Caveat', cursive",
            fontSize: "0.95rem",
            color: "#8B2020",
            fontWeight: 700,
            background: "rgba(255, 252, 240, 0.95)",
            padding: "3px 12px",
            borderRadius: "14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            border: "1px dashed rgba(160, 100, 60, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span>📜</span>
          <span>Click to uncrumple letter</span>
        </div>
      </div>
    );
  }

  const isUncrumpling = paperState === "uncrumpling";
  const isCrumpling = paperState === "crumpling";

  return (
    <div
      onClick={handleLetterClick}
      className="letter-paper-sheet"
      title="Click to expand letter in large view"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        backgroundColor: "#fbf7ee",
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 25px, rgba(160, 130, 95, 0.13) 25px, rgba(160, 130, 95, 0.13) 26px),
          radial-gradient(circle at 85% 15%, rgba(215, 185, 140, 0.22) 0%, transparent 60%),
          linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(250, 242, 225, 0.95) 50%, rgba(238, 225, 200, 0.92) 100%)
        `,
        borderRadius: "3px",
        padding: "18px 18px 14px 20px",
        boxShadow: "3px 8px 22px rgba(0,0,0,0.28), 0 2px 5px rgba(0,0,0,0.15), inset 0 0 15px rgba(220,195,155,0.25)",
        transformOrigin: "center center",
        cursor: "pointer",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        animation: isUncrumpling
          ? "uncrumpleLetterRealistic 0.75s cubic-bezier(0.18, 0.9, 0.32, 1.2) forwards"
          : isCrumpling
          ? "crumpleLetterRealistic 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          : undefined,
        zIndex: 15,
        userSelect: "none",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (paperState === "open") {
          e.currentTarget.style.transform = "scale(1.025)";
          e.currentTarget.style.boxShadow = "4px 12px 28px rgba(0,0,0,0.35)";
        }
      }}
      onMouseLeave={(e) => {
        if (paperState === "open") {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "3px 8px 22px rgba(0,0,0,0.28)";
        }
      }}
    >
      {/* Washi Tape */}
      <div
        style={{
          position: "absolute",
          top: -9,
          left: side === "left" ? "12%" : "68%",
          width: 60,
          height: 20,
          background: tapeColor,
          opacity: 0.88,
          transform: `rotate(${tapeRotate}deg)`,
          boxShadow: "0 2px 4px rgba(0,0,0,0.22)",
          borderRadius: 2,
          borderLeft: "2px dashed rgba(255,255,255,0.5)",
          borderRight: "2px dashed rgba(255,255,255,0.5)",
          zIndex: 20,
          pointerEvents: "none",
          animation: isUncrumpling ? "tapePopIn 0.35s ease-out 0.4s backwards" : undefined,
        }}
      />

      {/* Postage Stamp or Seal */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 12,
          display: "flex",
          alignItems: "center",
          gap: 4,
          opacity: 0.88,
          pointerEvents: "none",
          zIndex: 20,
          animation: isUncrumpling ? "tapePopIn 0.35s ease-out 0.45s backwards" : undefined,
        }}
      >
        <span style={{ fontSize: "1.2rem", filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.3))" }}>
          {stampEmoji}
        </span>
        {dateTag && (
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.55rem",
              fontWeight: 800,
              color: "#8B4513",
              border: "1px dashed #8B4513",
              padding: "1px 4px",
              borderRadius: 2,
              letterSpacing: "0.08em",
            }}
          >
            {dateTag}
          </span>
        )}
      </div>

      {/* Header Title */}
      <div style={{ marginBottom: 8, borderBottom: "1px solid rgba(140, 100, 60, 0.22)", paddingBottom: 4 }}>
        <h4
          style={{
            fontFamily: "'Permanent Marker', 'Courier New', sans-serif",
            fontSize: "clamp(0.80rem, 1.22vw, 1.0rem)",
            color: "#6b1414",
            margin: 0,
            letterSpacing: "0.04em",
            lineHeight: 1.25,
          }}
        >
          {title}
        </h4>
        {subtitle && (
          <p
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "clamp(0.70rem, 0.98vw, 0.84rem)",
              color: "#6f5b45",
              margin: "2px 0 0 0",
              fontWeight: 600,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Story Lines in Authentic Typewriter typography */}
      <div
        style={{
          fontFamily: "'Courier New', Courier, monospace, serif",
          fontSize: "clamp(0.64rem, 0.95vw, 0.77rem)",
          lineHeight: "22px",
          color: "#24180d",
          whiteSpace: "pre-line",
          letterSpacing: "0.02em",
          fontWeight: 600,
          userSelect: "none",
          animation: isUncrumpling ? "textUncrumpleFade 0.75s ease-out forwards" : undefined,
        }}
      >
        {lines.map((paragraph, pIdx) => {
          if (!paragraph) return <div key={pIdx} style={{ height: 6 }} />;
          return (
            <p key={pIdx} style={{ margin: "0 0 5px 0", textIndent: pIdx > 0 ? "0.6em" : 0 }}>
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tap to expand hint */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 4,
          marginTop: 6,
          paddingTop: 3,
          borderTop: "1px dashed rgba(160, 130, 95, 0.22)",
        }}
      >
        <span
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "0.82rem",
            color: "#8B2020",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            background: "rgba(255, 248, 235, 0.92)",
            padding: "1px 8px",
            borderRadius: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          <span>🔍</span>
          <span>Click to expand letter</span>
          <span>↗</span>
        </span>
      </div>

      {/* Realistic paper crease fold lines overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(118deg, transparent 38%, rgba(0,0,0,0.06) 40%, rgba(255,255,255,0.22) 41%, transparent 43%),
            linear-gradient(42deg, transparent 52%, rgba(0,0,0,0.05) 54%, rgba(255,255,255,0.18) 55%, transparent 57%),
            linear-gradient(-55deg, transparent 35%, rgba(0,0,0,0.04) 37%, rgba(255,255,255,0.2) 38%, transparent 40%),
            linear-gradient(170deg, transparent 66%, rgba(0,0,0,0.05) 68%, rgba(255,255,255,0.22) 69%, transparent 71%)
          `,
          borderRadius: "inherit",
          opacity: 0.9,
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PINTEREST SCRAPBOOK CUTOUTS & EPHEMERA CONFIGURATION
   Massive hero cutouts (120px-240px) with white die-cut borders,
   placed in the middle of pages below letters (zIndex 5 vs 14),
   leaving virtually zero empty space.
══════════════════════════════════════════════════ */
interface CutoutConfig {
  src: string;
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  width?: number;
  rotate?: number;
  label?: string;
  zIndex?: number;
}

type CornerStyle = "leopard" | "red_net";
type CornerPosition = "top-right" | "bottom-right" | "top-left" | "bottom-left";

interface ChapterScrapbookTheme {
  id: number;
  animClass: string;
  themeColor: string;
  highlighterColor: string;
  ribbonColor: string;
 
  leftArrow: string;
  rightArrow: string;
  leftCornerStyle: CornerStyle;
  leftScallopCorner: CornerPosition;
  rightCornerStyle: CornerStyle;
  rightScallopCorner: CornerPosition;
  leftCutouts: CutoutConfig[];
  rightCutouts: CutoutConfig[];
}

const SCRAPBOOK_THEMES: Record<number, ChapterScrapbookTheme> = {
  0: {
    id: 0,
    animClass: "anim-ch-01",
    themeColor: "#8B0000",
    highlighterColor: "#d90429",
    ribbonColor: "#58111A",
    
    leftArrow: "\u2014> complete strangers in the college hallway",
    rightArrow: "\u2014> clueless that we would ever matter to each other \ud83c\udf92",
    leftCornerStyle: "leopard",
    leftScallopCorner: "bottom-left",
    rightCornerStyle: "red_net",
    rightScallopCorner: "top-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 155, "rotate": 8, "zIndex": 12, "src": "/cutouts/bitch_heart.png", "label": "Embroidered Bitch heart patch"}, {"top": "11%", "left": "2%", "width": 160, "rotate": -12, "zIndex": 5, "src": "/cutouts/grill_lips.png", "label": "Cherry lips with gold grills"}, {"top": "44%", "left": "0%", "width": 140, "rotate": -8, "zIndex": 6, "src": "/cutouts/wine_glass_hands.png", "label": "Photo card with wine glasses"}, {"top": "42%", "right": "0%", "width": 140, "rotate": 8, "zIndex": 6, "src": "/cutouts/cherry_leopard.png", "label": "Cherries with leopard bow"}, {"bottom": "8%", "left": "26%", "width": 155, "rotate": -6, "zIndex": 8, "src": "/cutouts/crushed_coke.png", "label": "Crushed Coca-Cola can"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 145, "rotate": 12, "zIndex": 5, "src": "/cutouts/red_velvet_rose.png", "label": "Velvet dark red rose"}, {"top": "15%", "left": "1%", "width": 135, "rotate": -10, "zIndex": 6, "src": "/cutouts/heart_balloons_bow.png", "label": "Metallic heart balloons with bow"}, {"top": "44%", "left": "0%", "width": 140, "rotate": 10, "zIndex": 6, "src": "/cutouts/matchbook_flame.png", "label": "Burning matchbook flame"}, {"top": "42%", "right": "0%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/cherry_martini.png", "label": "Martini glass with cherries"}, {"bottom": "7%", "right": "6%", "width": 175, "rotate": 10, "zIndex": 12, "src": "/cutouts/lipstick_kiss.png", "label": "Dark red lipstick kiss"}]
  },
  1: {
    id: 1,
    animClass: "anim-ch-02",
    themeColor: "#720026",
    highlighterColor: "#c9184a",
    ribbonColor: "#4f0019",

    leftArrow: "\u2014> \u201cexcuse me, iphone charger milega?\u201d \ud83d\udd0c",
    rightArrow: "\u2014> secretly listening to interview questions \ud83d\udc42",
    leftCornerStyle: "red_net",
    leftScallopCorner: "top-left",
    rightCornerStyle: "leopard",
    rightScallopCorner: "bottom-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 125, "rotate": 8, "zIndex": 12, "src": "/cutouts/flip_phone.png", "label": "Y2K flip phone sticker"}, {"top": "11%", "left": "2%", "width": 135, "rotate": -12, "zIndex": 5, "src": "/cutouts/tic_tac_toe_hearts.png", "label": "Tic-tac-toe hearts doodle"}, {"top": "44%", "left": "0%", "width": 145, "rotate": -8, "zIndex": 6, "src": "/cutouts/watercolor_heart_eye.png", "label": "Watercolor crimson heart eye"}, {"top": "42%", "right": "0%", "width": 145, "rotate": 8, "zIndex": 6, "src": "/cutouts/heart_sunglasses.png", "label": "Red heart sunglasses"}, {"bottom": "8%", "left": "26%", "width": 145, "rotate": -6, "zIndex": 8, "src": "/cutouts/studded_cow_star.png", "label": "Cowhide studded star"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 145, "rotate": 12, "zIndex": 5, "src": "/cutouts/leopard_bow.png", "label": "Satin leopard ribbon bow"}, {"top": "15%", "left": "1%", "width": 135, "rotate": -10, "zIndex": 6, "src": "/cutouts/tarot_lovers.png", "label": "The Lovers vintage tarot card"}, {"top": "44%", "left": "0%", "width": 140, "rotate": 10, "zIndex": 6, "src": "/cutouts/leopard_heart.png", "label": "Plush leopard heart"}, {"top": "42%", "right": "0%", "width": 175, "rotate": -10, "zIndex": 6, "src": "/cutouts/safety_pins.png", "label": "Safety pin chain with beads"}, {"bottom": "7%", "right": "6%", "width": 175, "rotate": 10, "zIndex": 12, "src": "/cutouts/gold_glitter_butterfly.png", "label": "Shimmering gold glitter butterfly"}]
  },
  2: {
    id: 2,
    animClass: "anim-ch-03",
    themeColor: "#9b2226",
    highlighterColor: "#ae2012",
    ribbonColor: "#660708",

    leftArrow: "\u2014> straight to business, zero greetings",
    rightArrow: "\u2014> \u201cwho is this girl and why does she care?!\u201d \ud83d\ude02",
    leftCornerStyle: "leopard",
    leftScallopCorner: "bottom-left",
    rightCornerStyle: "red_net",
    rightScallopCorner: "top-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 155, "rotate": 8, "zIndex": 12, "src": "/cutouts/favorite_person_note.png", "label": "Favorite person paper note"}, {"top": "11%", "left": "2%", "width": 140, "rotate": -12, "zIndex": 5, "src": "/cutouts/spiked_silver_heart.png", "label": "Spiked silver metallic heart"}, {"top": "44%", "left": "0%", "width": 145, "rotate": -8, "zIndex": 6, "src": "/cutouts/cd_disc.png", "label": "Y2K holographic CD disc"}, {"top": "42%", "right": "0%", "width": 145, "rotate": 8, "zIndex": 6, "src": "/cutouts/dripping_candle.png", "label": "Dripping red wax candle"}, {"bottom": "8%", "left": "26%", "width": 145, "rotate": -6, "zIndex": 8, "src": "/cutouts/red_dice_pair.png", "label": "Red casino dice pair"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 145, "rotate": 12, "zIndex": 5, "src": "/cutouts/red_stiletto.png", "label": "Red stiletto high heel"}, {"top": "15%", "left": "1%", "width": 140, "rotate": -10, "zIndex": 6, "src": "/cutouts/cherry_cola.png", "label": "Dark cherry cola bottle"}, {"top": "44%", "left": "0%", "width": 140, "rotate": 10, "zIndex": 6, "src": "/cutouts/candle_flowers.png", "label": "Wax candle with crimson blossoms"}, {"top": "42%", "right": "0%", "width": 135, "rotate": -10, "zIndex": 6, "src": "/cutouts/gothic_cross_ruby.png", "label": "Gothic cross with ruby gem"}, {"bottom": "7%", "right": "6%", "width": 175, "rotate": 10, "zIndex": 12, "src": "/cutouts/spider_lily.png", "label": "Crimson spider lily"}]
  },
  3: {
    id: 3,
    animClass: "anim-ch-04",
    themeColor: "#a4161a",
    highlighterColor: "#ba181b",
    ribbonColor: "#660708",
   
    leftArrow: "\u2014> all 3 selected into the same company",
    rightArrow: "\u2014> aggressive universe matchmaking in action \u2728",
    leftCornerStyle: "red_net",
    leftScallopCorner: "top-left",
    rightCornerStyle: "leopard",
    rightScallopCorner: "bottom-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 145, "rotate": 8, "zIndex": 12, "src": "/cutouts/chrome_lighter.png", "label": "Chrome flip lighter"}, {"top": "11%", "left": "2%", "width": 110, "rotate": -12, "zIndex": 5, "src": "/cutouts/love_you_letters.png", "label": "LOVE YOU notebook letters"}, {"top": "44%", "left": "0%", "width": 140, "rotate": -8, "zIndex": 6, "src": "/cutouts/disco_ball_red.png", "label": "Red glitter disco ball"}, {"top": "42%", "right": "0%", "width": 125, "rotate": 8, "zIndex": 6, "src": "/cutouts/tamagotchi.png", "label": "Retro tamagotchi keychain"}, {"bottom": "8%", "left": "26%", "width": 145, "rotate": -6, "zIndex": 8, "src": "/cutouts/padlock_heart.png", "label": "Gold heart padlock"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 135, "rotate": 12, "zIndex": 5, "src": "/cutouts/pink_heart_bow.png", "label": "Coquette pink heart bow"}, {"top": "15%", "left": "1%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/lace_corset.png", "label": "Black lace corset"}, {"top": "44%", "left": "0%", "width": 140, "rotate": 10, "zIndex": 6, "src": "/cutouts/wax_seal_rose.png", "label": "Red rose wax seal stamp"}, {"top": "42%", "right": "0%", "width": 140, "rotate": -10, "zIndex": 6, "src": "/cutouts/bleeding_heart.png", "label": "Sacred bleeding heart"}, {"bottom": "7%", "right": "6%", "width": 130, "rotate": 10, "zIndex": 12, "src": "/cutouts/gold_sparkle_stars.png", "label": "3D golden sparkle stars"}]
  },
  4: {
    id: 4,
    animClass: "anim-ch-05",
    themeColor: "#720026",
    highlighterColor: "#ff0a54",
    ribbonColor: "#4f0019",
  
    leftArrow: "\u2014> the phone call before PG shifting",
    rightArrow: "\u2014> wait... YOU are the charger girl?! \ud83e\udd2f",
    leftCornerStyle: "leopard",
    leftScallopCorner: "bottom-left",
    rightCornerStyle: "red_net",
    rightScallopCorner: "top-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 155, "rotate": 8, "zIndex": 12, "src": "/cutouts/favorite_person_note.png", "label": "Favorite person paper note"}, {"top": "11%", "left": "2%", "width": 145, "rotate": -12, "zIndex": 5, "src": "/cutouts/vintage_roses_ribbon.png", "label": "Vintage roses bouquet with ribbon"}, {"top": "44%", "left": "0%", "width": 145, "rotate": -8, "zIndex": 6, "src": "/cutouts/leopard_claw_clip.png", "label": "Leopard hair claw clip"}, {"top": "42%", "right": "0%", "width": 145, "rotate": 8, "zIndex": 6, "src": "/cutouts/red_gingham_bow.png", "label": "Red gingham ribbon bow"}, {"bottom": "8%", "left": "26%", "width": 145, "rotate": -6, "zIndex": 8, "src": "/cutouts/studded_leather_star.png", "label": "Studded black leather star"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 140, "rotate": 12, "zIndex": 5, "src": "/cutouts/poison_bottle.png", "label": "Vintage poison elixir bottle"}, {"top": "15%", "left": "1%", "width": 155, "rotate": -10, "zIndex": 6, "src": "/cutouts/bitch_heart.png", "label": "Embroidered Bitch heart patch"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/heart_sunglasses.png", "label": "Red heart sunglasses"}, {"top": "42%", "right": "0%", "width": 125, "rotate": -10, "zIndex": 6, "src": "/cutouts/flip_phone.png", "label": "Y2K flip phone sticker"}, {"bottom": "7%", "right": "6%", "width": 175, "rotate": 10, "zIndex": 12, "src": "/cutouts/lipstick_kiss.png", "label": "Dark red lipstick kiss"}]
  },
  5: {
    id: 5,
    animClass: "anim-ch-06",
    themeColor: "#800020",
    highlighterColor: "#b5179e",
    ribbonColor: "#4a0014",
   
    leftArrow: "—> night 1: 1 bottle of vodka & zero filter",
    rightArrow: "—> telling each other all the exes & tears 🍸",
    leftCornerStyle: "red_net",
    leftScallopCorner: "top-left",
    rightCornerStyle: "leopard",
    rightScallopCorner: "bottom-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 140, "rotate": 8, "zIndex": 12, "src": "/cutouts/wine_glass_hands.png", "label": "Photo card with wine glasses"}, {"top": "11%", "left": "2%", "width": 145, "rotate": -12, "zIndex": 5, "src": "/cutouts/cherry_martini.png", "label": "Martini glass with cherries"}, {"top": "44%", "left": "0%", "width": 155, "rotate": -8, "zIndex": 6, "src": "/cutouts/crushed_coke.png", "label": "Crushed Coca-Cola can"}, {"top": "42%", "right": "0%", "width": 130, "rotate": 8, "zIndex": 6, "src": "/cutouts/gold_sparkle_stars.png", "label": "3D golden sparkle stars"}, {"bottom": "8%", "left": "26%", "width": 145, "rotate": -6, "zIndex": 8, "src": "/cutouts/red_velvet_rose.png", "label": "Velvet dark red rose"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 140, "rotate": 12, "zIndex": 5, "src": "/cutouts/cherry_cola.png", "label": "Dark cherry cola bottle"}, {"top": "15%", "left": "1%", "width": 160, "rotate": -10, "zIndex": 6, "src": "/cutouts/grill_lips.png", "label": "Cherry lips with gold grills"}, {"top": "44%", "left": "0%", "width": 135, "rotate": 10, "zIndex": 6, "src": "/cutouts/tarot_lovers.png", "label": "The Lovers vintage tarot card"}, {"top": "42%", "right": "0%", "width": 140, "rotate": -10, "zIndex": 6, "src": "/cutouts/matchbook_flame.png", "label": "Burning matchbook flame"}, {"bottom": "7%", "right": "6%", "width": 140, "rotate": 10, "zIndex": 12, "src": "/cutouts/leopard_heart.png", "label": "Plush leopard heart"}]
  },
  6: {
    id: 6,
    animClass: "anim-ch-07",
    themeColor: "#a4161a",
    highlighterColor: "#d90429",
    ribbonColor: "#660708",

    leftArrow: "\u2014> acts like \u201ci don\u2019t care at all\u201d",
    rightArrow: "\u2014> secretly soft marshmallow heart \ud83e\uddf8",
    leftCornerStyle: "leopard",
    leftScallopCorner: "bottom-left",
    rightCornerStyle: "red_net",
    rightScallopCorner: "top-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 135, "rotate": 8, "zIndex": 12, "src": "/cutouts/tic_tac_toe_hearts.png", "label": "Tic-tac-toe hearts doodle"}, {"top": "11%", "left": "2%", "width": 135, "rotate": -12, "zIndex": 5, "src": "/cutouts/pink_heart_bow.png", "label": "Coquette pink heart bow"}, {"top": "44%", "left": "0%", "width": 140, "rotate": -8, "zIndex": 6, "src": "/cutouts/bleeding_heart.png", "label": "Sacred bleeding heart"}, {"top": "42%", "right": "0%", "width": 145, "rotate": 8, "zIndex": 6, "src": "/cutouts/studded_cow_star.png", "label": "Cowhide studded star"}, {"bottom": "8%", "left": "26%", "width": 140, "rotate": -6, "zIndex": 8, "src": "/cutouts/cherry_leopard.png", "label": "Cherries with leopard bow"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 140, "rotate": 12, "zIndex": 5, "src": "/cutouts/spiked_silver_heart.png", "label": "Spiked silver metallic heart"}, {"top": "15%", "left": "1%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/watercolor_heart_eye.png", "label": "Watercolor crimson heart eye"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/red_stiletto.png", "label": "Red stiletto high heel"}, {"top": "42%", "right": "0%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/leopard_bow.png", "label": "Satin leopard ribbon bow"}, {"bottom": "7%", "right": "6%", "width": 175, "rotate": 10, "zIndex": 12, "src": "/cutouts/gold_glitter_butterfly.png", "label": "Shimmering gold glitter butterfly"}]
  },
  7: {
    id: 7,
    animClass: "anim-ch-08",
    themeColor: "#9b2226",
    highlighterColor: "#ff4d6d",
    ribbonColor: "#590d22",
 
    leftArrow: "\u2014> running 25 mins late as usual \u23f0",
    rightArrow: "\u2014> she was the discipline, i was the chaos",
    leftCornerStyle: "red_net",
    leftScallopCorner: "top-left",
    rightCornerStyle: "leopard",
    rightScallopCorner: "bottom-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 140, "rotate": 8, "zIndex": 12, "src": "/cutouts/wine_glass_hands.png", "label": "Photo card with wine glasses"}, {"top": "11%", "left": "2%", "width": 140, "rotate": -12, "zIndex": 5, "src": "/cutouts/candle_flowers.png", "label": "Wax candle with crimson blossoms"}, {"top": "44%", "left": "0%", "width": 145, "rotate": -8, "zIndex": 6, "src": "/cutouts/dripping_candle.png", "label": "Dripping red wax candle"}, {"top": "42%", "right": "0%", "width": 145, "rotate": 8, "zIndex": 6, "src": "/cutouts/cd_disc.png", "label": "Y2K holographic CD disc"}, {"bottom": "8%", "left": "26%", "width": 175, "rotate": -6, "zIndex": 8, "src": "/cutouts/spider_lily.png", "label": "Crimson spider lily"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 145, "rotate": 12, "zIndex": 5, "src": "/cutouts/chrome_lighter.png", "label": "Chrome flip lighter"}, {"top": "15%", "left": "1%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/padlock_heart.png", "label": "Gold heart padlock"}, {"top": "44%", "left": "0%", "width": 125, "rotate": 10, "zIndex": 6, "src": "/cutouts/tamagotchi.png", "label": "Retro tamagotchi keychain"}, {"top": "42%", "right": "0%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/red_dice_pair.png", "label": "Red casino dice pair"}, {"bottom": "7%", "right": "6%", "width": 175, "rotate": 10, "zIndex": 12, "src": "/cutouts/safety_pins.png", "label": "Safety pin chain with beads"}]
  },
  8: {
    id: 8,
    animClass: "anim-ch-09",
    themeColor: "#800f2f",
    highlighterColor: "#a4161a",
 ribbonColor: "#590d22",
    leftArrow: "\u2014> the shouting match in the PG hallway",
    rightArrow: "\u2014> entered the official silent-treatment era",
    leftCornerStyle: "leopard",
    leftScallopCorner: "bottom-left",
    rightCornerStyle: "red_net",
    rightScallopCorner: "top-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 135, "rotate": 8, "zIndex": 12, "src": "/cutouts/tic_tac_toe_hearts.png", "label": "Tic-tac-toe hearts doodle"}, {"top": "11%", "left": "2%", "width": 135, "rotate": -12, "zIndex": 5, "src": "/cutouts/gothic_cross_ruby.png", "label": "Gothic cross with ruby gem"}, {"top": "44%", "left": "0%", "width": 140, "rotate": -8, "zIndex": 6, "src": "/cutouts/spiked_silver_heart.png", "label": "Spiked silver metallic heart"}, {"top": "42%", "right": "0%", "width": 155, "rotate": 8, "zIndex": 6, "src": "/cutouts/bitch_heart.png", "label": "Embroidered Bitch heart patch"}, {"bottom": "8%", "left": "26%", "width": 140, "rotate": -6, "zIndex": 8, "src": "/cutouts/poison_bottle.png", "label": "Vintage poison elixir bottle"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 140, "rotate": 12, "zIndex": 5, "src": "/cutouts/matchbook_flame.png", "label": "Burning matchbook flame"}, {"top": "15%", "left": "1%", "width": 140, "rotate": -10, "zIndex": 6, "src": "/cutouts/disco_ball_red.png", "label": "Red glitter disco ball"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/lace_corset.png", "label": "Black lace corset"}, {"top": "42%", "right": "0%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/leopard_claw_clip.png", "label": "Leopard hair claw clip"}, {"bottom": "7%", "right": "6%", "width": 145, "rotate": 10, "zIndex": 12, "src": "/cutouts/red_velvet_rose.png", "label": "Velvet dark red rose"}]
  },
  9: {
    id: 9,
    animClass: "anim-ch-10",
    themeColor: "#58111A",
    highlighterColor: "#c9182b",
    ribbonColor: "#38040E",
   
    leftArrow: "\u2014> \u201cdon\u2019t shout at me.\u201d simple words",
    rightArrow: "\u2014> cab ride truce: we find our way back \ud83d\ude96",
    leftCornerStyle: "red_net",
    leftScallopCorner: "top-left",
    rightCornerStyle: "leopard",
    rightScallopCorner: "bottom-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 110, "rotate": 8, "zIndex": 12, "src": "/cutouts/love_you_letters.png", "label": "LOVE YOU notebook letters"}, {"top": "11%", "left": "2%", "width": 145, "rotate": -12, "zIndex": 5, "src": "/cutouts/red_gingham_bow.png", "label": "Red gingham ribbon bow"}, {"top": "44%", "left": "0%", "width": 145, "rotate": -8, "zIndex": 6, "src": "/cutouts/vintage_roses_ribbon.png", "label": "Vintage roses bouquet with ribbon"}, {"top": "42%", "right": "0%", "width": 145, "rotate": 8, "zIndex": 6, "src": "/cutouts/studded_leather_star.png", "label": "Studded black leather star"}, {"bottom": "8%", "left": "26%", "width": 140, "rotate": -6, "zIndex": 8, "src": "/cutouts/wax_seal_rose.png", "label": "Red rose wax seal stamp"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 135, "rotate": 12, "zIndex": 5, "src": "/cutouts/tarot_lovers.png", "label": "The Lovers vintage tarot card"}, {"top": "15%", "left": "1%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/cherry_martini.png", "label": "Martini glass with cherries"}, {"top": "44%", "left": "0%", "width": 130, "rotate": 10, "zIndex": 6, "src": "/cutouts/gold_sparkle_stars.png", "label": "3D golden sparkle stars"}, {"top": "42%", "right": "0%", "width": 175, "rotate": -10, "zIndex": 6, "src": "/cutouts/lipstick_kiss.png", "label": "Dark red lipstick kiss"}, {"bottom": "7%", "right": "6%", "width": 135, "rotate": 10, "zIndex": 12, "src": "/cutouts/pink_heart_bow.png", "label": "Coquette pink heart bow"}]
  },
  10: {
    id: 10,
    animClass: "anim-ch-11",
    themeColor: "#800020",
    highlighterColor: "#d90429",
    ribbonColor: "#4a0014",
    
    leftArrow: "—> packing boxes & shifting out of PG",
    rightArrow: "—> unspoken thoughts & misunderstandings 📦",
    leftCornerStyle: "leopard",
    leftScallopCorner: "bottom-left",
    rightCornerStyle: "red_net",
    rightScallopCorner: "top-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 135, "rotate": 8, "zIndex": 12, "src": "/cutouts/heart_balloons_bow.png", "label": "Metallic heart balloons with bow"}, {"top": "11%", "left": "2%", "width": 155, "rotate": -12, "zIndex": 5, "src": "/cutouts/crushed_coke.png", "label": "Crushed Coca-Cola can"}, {"top": "44%", "left": "0%", "width": 145, "rotate": -8, "zIndex": 6, "src": "/cutouts/watercolor_heart_eye.png", "label": "Watercolor crimson heart eye"}, {"top": "42%", "right": "0%", "width": 140, "rotate": 8, "zIndex": 6, "src": "/cutouts/cherry_cola.png", "label": "Dark cherry cola bottle"}, {"bottom": "8%", "left": "26%", "width": 145, "rotate": -6, "zIndex": 8, "src": "/cutouts/leopard_bow.png", "label": "Satin leopard ribbon bow"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 140, "rotate": 12, "zIndex": 5, "src": "/cutouts/bleeding_heart.png", "label": "Sacred bleeding heart"}, {"top": "15%", "left": "1%", "width": 160, "rotate": -10, "zIndex": 6, "src": "/cutouts/grill_lips.png", "label": "Cherry lips with gold grills"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/studded_cow_star.png", "label": "Cowhide studded star"}, {"top": "42%", "right": "0%", "width": 125, "rotate": -10, "zIndex": 6, "src": "/cutouts/flip_phone.png", "label": "Y2K flip phone sticker"}, {"bottom": "7%", "right": "6%", "width": 175, "rotate": 10, "zIndex": 12, "src": "/cutouts/gold_glitter_butterfly.png", "label": "Shimmering gold glitter butterfly"}]
  },
  11: {
    id: 11,
    animClass: "anim-ch-12",
    themeColor: "#4a0e17",
    highlighterColor: "#c9184a",
    ribbonColor: "#2b060d",
 
    leftArrow: "\u2014> holding anger inside, walking on ice \ud83e\uddca",
    rightArrow: "\u2014> caring so much but doing a bad job",
    leftCornerStyle: "red_net",
    leftScallopCorner: "top-left",
    rightCornerStyle: "leopard",
    rightScallopCorner: "bottom-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 155, "rotate": 8, "zIndex": 12, "src": "/cutouts/favorite_person_note.png", "label": "Favorite person paper note"}, {"top": "11%", "left": "2%", "width": 145, "rotate": -12, "zIndex": 5, "src": "/cutouts/dripping_candle.png", "label": "Dripping red wax candle"}, {"top": "44%", "left": "0%", "width": 140, "rotate": -8, "zIndex": 6, "src": "/cutouts/cherry_leopard.png", "label": "Cherries with leopard bow"}, {"top": "42%", "right": "0%", "width": 175, "rotate": 8, "zIndex": 6, "src": "/cutouts/spider_lily.png", "label": "Crimson spider lily"}, {"bottom": "8%", "left": "26%", "width": 140, "rotate": -6, "zIndex": 8, "src": "/cutouts/leopard_heart.png", "label": "Plush leopard heart"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 140, "rotate": 12, "zIndex": 5, "src": "/cutouts/poison_bottle.png", "label": "Vintage poison elixir bottle"}, {"top": "15%", "left": "1%", "width": 140, "rotate": -10, "zIndex": 6, "src": "/cutouts/candle_flowers.png", "label": "Wax candle with crimson blossoms"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/heart_sunglasses.png", "label": "Red heart sunglasses"}, {"top": "42%", "right": "0%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/red_stiletto.png", "label": "Red stiletto high heel"}, {"bottom": "7%", "right": "6%", "width": 145, "rotate": 10, "zIndex": 12, "src": "/cutouts/padlock_heart.png", "label": "Gold heart padlock"}]
  },
  12: {
    id: 12,
    animClass: "anim-ch-13",
    themeColor: "#8B0000",
    highlighterColor: "#ff4d6d",
    ribbonColor: "#58111A",

    leftArrow: "\u2014> one dress, one night, everything exploded \ud83d\udc57",
    rightArrow: "\u2014> i chose you, because you matter more",
    leftCornerStyle: "leopard",
    leftScallopCorner: "bottom-left",
    rightCornerStyle: "red_net",
    rightScallopCorner: "top-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 140, "rotate": 8, "zIndex": 12, "src": "/cutouts/wine_glass_hands.png", "label": "Photo card with wine glasses"}, {"top": "11%", "left": "2%", "width": 145, "rotate": -12, "zIndex": 5, "src": "/cutouts/lace_corset.png", "label": "Black lace corset"}, {"top": "44%", "left": "0%", "width": 145, "rotate": -8, "zIndex": 6, "src": "/cutouts/red_dice_pair.png", "label": "Red casino dice pair"}, {"top": "42%", "right": "0%", "width": 175, "rotate": 8, "zIndex": 6, "src": "/cutouts/lipstick_kiss.png", "label": "Dark red lipstick kiss"}, {"bottom": "8%", "left": "26%", "width": 140, "rotate": -6, "zIndex": 8, "src": "/cutouts/disco_ball_red.png", "label": "Red glitter disco ball"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 110, "rotate": 12, "zIndex": 5, "src": "/cutouts/love_you_letters.png", "label": "LOVE YOU notebook letters"}, {"top": "15%", "left": "1%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/red_velvet_rose.png", "label": "Velvet dark red rose"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/chrome_lighter.png", "label": "Chrome flip lighter"}, {"top": "42%", "right": "0%", "width": 135, "rotate": -10, "zIndex": 6, "src": "/cutouts/gothic_cross_ruby.png", "label": "Gothic cross with ruby gem"}, {"bottom": "7%", "right": "6%", "width": 175, "rotate": 10, "zIndex": 12, "src": "/cutouts/safety_pins.png", "label": "Safety pin chain with beads"}]
  },
  13: {
    id: 13,
    animClass: "anim-ch-14",
    themeColor: "#720026",
    highlighterColor: "#d90429",
    ribbonColor: "#4f0019",

    leftArrow: "\u2014> you showed up when everything fell apart",
    rightArrow: "\u2014> you opened the door, i walked through \ud83d\udeaa\u2728",
    leftCornerStyle: "red_net",
    leftScallopCorner: "top-left",
    rightCornerStyle: "leopard",
    rightScallopCorner: "bottom-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 135, "rotate": 8, "zIndex": 12, "src": "/cutouts/tic_tac_toe_hearts.png", "label": "Tic-tac-toe hearts doodle"}, {"top": "11%", "left": "2%", "width": 145, "rotate": -12, "zIndex": 5, "src": "/cutouts/vintage_roses_ribbon.png", "label": "Vintage roses bouquet with ribbon"}, {"top": "44%", "left": "0%", "width": 145, "rotate": -8, "zIndex": 6, "src": "/cutouts/cd_disc.png", "label": "Y2K holographic CD disc"}, {"top": "42%", "right": "0%", "width": 140, "rotate": 8, "zIndex": 6, "src": "/cutouts/wax_seal_rose.png", "label": "Red rose wax seal stamp"}, {"bottom": "8%", "left": "26%", "width": 140, "rotate": -6, "zIndex": 8, "src": "/cutouts/spiked_silver_heart.png", "label": "Spiked silver metallic heart"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 135, "rotate": 12, "zIndex": 5, "src": "/cutouts/tarot_lovers.png", "label": "The Lovers vintage tarot card"}, {"top": "15%", "left": "1%", "width": 135, "rotate": -10, "zIndex": 6, "src": "/cutouts/pink_heart_bow.png", "label": "Coquette pink heart bow"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/leopard_claw_clip.png", "label": "Leopard hair claw clip"}, {"top": "42%", "right": "0%", "width": 155, "rotate": -10, "zIndex": 6, "src": "/cutouts/bitch_heart.png", "label": "Embroidered Bitch heart patch"}, {"bottom": "7%", "right": "6%", "width": 130, "rotate": 10, "zIndex": 12, "src": "/cutouts/gold_sparkle_stars.png", "label": "3D golden sparkle stars"}]
  },
  14: {
    id: 14,
    animClass: "anim-ch-15",
    themeColor: "#6a040f",
    highlighterColor: "#f72585",
    ribbonColor: "#370617",

    leftArrow: "\u2014> new company, new flat, same 2 idiots",
    rightArrow: "\u2014> life keeps putting us back together \ud83d\udd11\ud83c\udfe0",
    leftCornerStyle: "leopard",
    leftScallopCorner: "bottom-left",
    rightCornerStyle: "red_net",
    rightScallopCorner: "top-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 135, "rotate": 8, "zIndex": 12, "src": "/cutouts/heart_balloons_bow.png", "label": "Metallic heart balloons with bow"}, {"top": "11%", "left": "2%", "width": 145, "rotate": -12, "zIndex": 5, "src": "/cutouts/padlock_heart.png", "label": "Gold heart padlock"}, {"top": "44%", "left": "0%", "width": 125, "rotate": -8, "zIndex": 6, "src": "/cutouts/tamagotchi.png", "label": "Retro tamagotchi keychain"}, {"top": "42%", "right": "0%", "width": 145, "rotate": 8, "zIndex": 6, "src": "/cutouts/red_gingham_bow.png", "label": "Red gingham ribbon bow"}, {"bottom": "8%", "left": "26%", "width": 145, "rotate": -6, "zIndex": 8, "src": "/cutouts/cherry_martini.png", "label": "Martini glass with cherries"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 155, "rotate": 12, "zIndex": 5, "src": "/cutouts/favorite_person_note.png", "label": "Favorite person paper note"}, {"top": "15%", "left": "1%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/watercolor_heart_eye.png", "label": "Watercolor crimson heart eye"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/studded_leather_star.png", "label": "Studded black leather star"}, {"top": "42%", "right": "0%", "width": 140, "rotate": -10, "zIndex": 6, "src": "/cutouts/matchbook_flame.png", "label": "Burning matchbook flame"}, {"bottom": "7%", "right": "6%", "width": 140, "rotate": 10, "zIndex": 12, "src": "/cutouts/cherry_cola.png", "label": "Dark cherry cola bottle"}]
  },
  15: {
    id: 15,
    animClass: "anim-ch-16",
    themeColor: "#800f2f",
    highlighterColor: "#c9184a",
    ribbonColor: "#4f0019",

    leftArrow: "\u2014> operating on approximately 2% common sense \ud83e\udde0",
    rightArrow: "\u2014> congratulations, you chose to babysit me! \ud83d\ude02",
    leftCornerStyle: "red_net",
    leftScallopCorner: "top-left",
    rightCornerStyle: "leopard",
    rightScallopCorner: "bottom-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 135, "rotate": 8, "zIndex": 12, "src": "/cutouts/tic_tac_toe_hearts.png", "label": "Tic-tac-toe hearts doodle"}, {"top": "11%", "left": "2%", "width": 155, "rotate": -12, "zIndex": 5, "src": "/cutouts/crushed_coke.png", "label": "Crushed Coca-Cola can"}, {"top": "44%", "left": "0%", "width": 140, "rotate": -8, "zIndex": 6, "src": "/cutouts/bleeding_heart.png", "label": "Sacred bleeding heart"}, {"top": "42%", "right": "0%", "width": 125, "rotate": 8, "zIndex": 6, "src": "/cutouts/flip_phone.png", "label": "Y2K flip phone sticker"}, {"bottom": "8%", "left": "26%", "width": 160, "rotate": -6, "zIndex": 8, "src": "/cutouts/grill_lips.png", "label": "Cherry lips with gold grills"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 145, "rotate": 12, "zIndex": 5, "src": "/cutouts/studded_cow_star.png", "label": "Cowhide studded star"}, {"top": "15%", "left": "1%", "width": 145, "rotate": -10, "zIndex": 6, "src": "/cutouts/leopard_bow.png", "label": "Satin leopard ribbon bow"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/heart_sunglasses.png", "label": "Red heart sunglasses"}, {"top": "42%", "right": "0%", "width": 175, "rotate": -10, "zIndex": 6, "src": "/cutouts/gold_glitter_butterfly.png", "label": "Shimmering gold glitter butterfly"}, {"bottom": "7%", "right": "6%", "width": 140, "rotate": 10, "zIndex": 12, "src": "/cutouts/candle_flowers.png", "label": "Wax candle with crimson blossoms"}]
  },
  16: {
    id: 16,
    animClass: "anim-ch-17",
    themeColor: "#8B0000",
    highlighterColor: "#ff0054",
    ribbonColor: "#58111A",
  
    leftArrow: "—> last birthday comic, this year scrapbook",
    rightArrow: "—> happy birthday idiot, thank you for having my back ❤️🎂",
    leftCornerStyle: "leopard",
    leftScallopCorner: "bottom-left",
    rightCornerStyle: "red_net",
    rightScallopCorner: "top-right",
    leftCutouts: [{"top": "4%", "right": "6%", "width": 155, "rotate": 8, "zIndex": 12, "src": "/cutouts/favorite_person_note.png", "label": "Favorite person paper note"}, {"top": "11%", "left": "2%", "width": 140, "rotate": -12, "zIndex": 5, "src": "/cutouts/wine_glass_hands.png", "label": "Photo card with wine glasses"}, {"top": "44%", "left": "0%", "width": 140, "rotate": -8, "zIndex": 6, "src": "/cutouts/wax_seal_rose.png", "label": "Red rose wax seal stamp"}, {"top": "42%", "right": "0%", "width": 130, "rotate": 8, "zIndex": 6, "src": "/cutouts/gold_sparkle_stars.png", "label": "3D golden sparkle stars"}, {"bottom": "8%", "left": "26%", "width": 145, "rotate": -6, "zIndex": 8, "src": "/cutouts/vintage_roses_ribbon.png", "label": "Vintage roses bouquet with ribbon"}],
    rightCutouts: [{"top": "4%", "right": "4%", "width": 135, "rotate": 12, "zIndex": 5, "src": "/cutouts/heart_balloons_bow.png", "label": "Metallic heart balloons with bow"}, {"top": "15%", "left": "1%", "width": 110, "rotate": -10, "zIndex": 6, "src": "/cutouts/love_you_letters.png", "label": "LOVE YOU notebook letters"}, {"top": "44%", "left": "0%", "width": 145, "rotate": 10, "zIndex": 6, "src": "/cutouts/red_velvet_rose.png", "label": "Velvet dark red rose"}, {"top": "42%", "right": "0%", "width": 140, "rotate": -10, "zIndex": 6, "src": "/cutouts/disco_ball_red.png", "label": "Red glitter disco ball"}, {"bottom": "7%", "right": "6%", "width": 175, "rotate": 10, "zIndex": 12, "src": "/cutouts/lipstick_kiss.png", "label": "Dark red lipstick kiss"}]
  },
};

/* ══════════════════════════════════════════════════
   PAGE CORNER ACCENT: LEOPARD OR RED NET / LACE
   Standardized 90° outer corner at top-right, flipped via scale matrix:
   - top-right: transform: "none"
   - bottom-right: transform: "scaleY(-1)"
   - top-left: transform: "scaleX(-1)"
   - bottom-left: transform: "scale(-1, -1)"
══════════════════════════════════════════════════ */
function PageCornerAccent({
  corner,
  style = "leopard",
  width = 225,
}: {
  corner: CornerPosition;
  style?: CornerStyle;
  width?: number;
}) {
  const isTop = corner.startsWith("top");
  const isRight = corner.endsWith("right");

  let imgTransform = "none";
  if (corner === "top-right") {
    imgTransform = "none";
  } else if (corner === "bottom-right") {
    imgTransform = "scaleY(-1)";
  } else if (corner === "top-left") {
    imgTransform = "scaleX(-1)";
  } else if (corner === "bottom-left") {
    imgTransform = "scale(-1, -1)";
  }

  const src = style === "leopard" ? "/cutouts/leopard_corner.png" : "/cutouts/red_net_corner.png";

  return (
    <div
      style={{
        position: "absolute",
        top: isTop ? 0 : undefined,
        bottom: !isTop ? 0 : undefined,
        left: !isRight ? 0 : undefined,
        right: isRight ? 0 : undefined,
        width,
        zIndex: 3,
        pointerEvents: "none",
        lineHeight: 0,
      }}
    >
      <img
        src={src}
        alt={`${style} corner accent`}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          transform: imgTransform,
          filter: "drop-shadow(2px 4px 10px rgba(0,0,0,0.38))",
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   RETRO CD PLAYER / JEWEL CASE COMPONENT
   Features spinning iridescent CD disc (/cutouts/cd_disc.png),
   smoky acrylic jewel case, digital LED track display, and controls.
══════════════════════════════════════════════════ */
function CDPlayer({
  trackNum,
  title,
  bg: _bg,
  isPlaying,
  onPrev,
  onStop,
  onNext,
}: {
  trackNum: string;
  title: string;
  bg: string;
  isPlaying: boolean;
  onPrev: () => void;
  onStop: () => void;
  onNext: () => void;
}) {
  return (
    <div
      style={{
        width: 320,
        filter: "drop-shadow(3px 8px 18px rgba(0,0,0,0.65))",
        transform: "rotate(-1.2deg)",
        userSelect: "none",
      }}
    >
      {/* Smoky Acrylic CD Jewel Case Outer Box */}
      <div
        style={{
          width: "100%",
          height: 124,
          background: "linear-gradient(135deg, rgba(32,30,35,0.94) 0%, rgba(16,14,18,0.97) 100%)",
          borderRadius: "8px",
          position: "relative",
          border: "1.5px solid rgba(255,255,255,0.18)",
          boxShadow: "inset 0 1px 3px rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          padding: "6px 12px 6px 10px",
          gap: 12,
          overflow: "hidden",
        }}
      >
        {/* Jewel case left hinge spine */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 9,
            background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(255,255,255,0.15), rgba(0,0,0,0.7))",
            borderRight: "1px solid rgba(0,0,0,0.8)",
            zIndex: 4,
          }}
        />

        {/* LEFT: Realistic Circular CD Disc on spindle with continuous spin animation when playing */}
        <div
          style={{
            width: 104,
            height: 104,
            position: "relative",
            flexShrink: 0,
            marginLeft: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Circular CD disc tray depression */}
          <div
            style={{
              position: "absolute",
              width: 102,
              height: 102,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(10,10,12,0.9) 0%, rgba(25,25,30,0.9) 100%)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9)",
            }}
          />

          {/* The Spinning CD Disc - ALWAYS AUTOROTATING */}
          <div
            style={{
              width: 98,
              height: 98,
              position: "relative",
              borderRadius: "50%",
              animation: "spinDisc 2.8s linear infinite",
              transition: "transform 0.4s ease-out",
              boxShadow: "0 3px 10px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src="/cutouts/cd_disc.png"
              alt="Holographic CD Disc"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                display: "block",
                pointerEvents: "none",
              }}
              draggable={false}
            />

            {/* Holographic Rainbow Light Sheen overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "50%",
                background: "conic-gradient(from 45deg, transparent 0deg, rgba(255,0,80,0.18) 60deg, rgba(0,255,200,0.18) 120deg, transparent 180deg, rgba(255,220,0,0.18) 240deg, rgba(255,0,120,0.18) 300deg, transparent 360deg)",
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Center spindle clamp teeth */}
          <div
            style={{
              position: "absolute",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "radial-gradient(circle, #333 40%, #111 80%)",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.8)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0a0a0c" }} />
          </div>
        </div>

        {/* RIGHT: Compact Digital LCD Display & Controls */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "3px 0",
            zIndex: 3,
          }}
        >
          {/* Digital LCD Track Screen */}
          <div
            style={{
              background: "rgba(10, 10, 14, 0.88)",
              border: "1px solid rgba(220, 20, 60, 0.35)",
              borderRadius: 4,
              padding: "3px 8px",
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.62rem",
                  fontWeight: 900,
                  color: "#ff2a4b",
                  textShadow: "0 0 6px rgba(255, 42, 75, 0.7)",
                  letterSpacing: "0.08em",
                }}
              >
                DISC • {trackNum}
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  color: isPlaying ? "#00ff88" : "#888",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  textShadow: isPlaying ? "0 0 6px #00ff88" : "none",
                }}
              >
                {isPlaying ? "PLAY ►" : "PAUSE ❚❚"}
              </span>
            </div>

            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "0.88rem",
                fontWeight: 700,
                color: "#f5f0eb",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginTop: 1,
              }}
              title={title}
            >
              {title}
            </div>
          </div>

          {/* Subtitle / CD Badge */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span
              style={{
                fontSize: "0.5rem",
                padding: "1px 5px",
                borderRadius: 2,
                background: "#8B0000",
                color: "#fff",
                fontWeight: 800,
                letterSpacing: "0.05em",
                fontFamily: "monospace",
              }}
            >
              COMPACT DISC
            </span>
            <span
              style={{
                fontSize: "0.5rem",
                padding: "1px 4px",
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                color: "#bbb",
                fontFamily: "monospace",
              }}
            >
              STEREO
            </span>
          </div>

          {/* Playback Button Row */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              onClick={onPrev}
              style={{
                flex: 1,
                padding: "3px 0",
                background: "linear-gradient(180deg, #2a2a30 0%, #1a1a20 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 3,
                color: "#eee",
                fontSize: "0.62rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
              title="Previous Track"
            >
              ⏮
            </button>
            <button
              onClick={onStop}
              style={{
                flex: 1.3,
                padding: "3px 0",
                background: isPlaying
                  ? "linear-gradient(180deg, #b00020 0%, #700010 100%)"
                  : "linear-gradient(180deg, #2a2a30 0%, #1a1a20 100%)",
                border: isPlaying ? "1px solid #ff3355" : "1px solid rgba(255,255,255,0.15)",
                borderRadius: 3,
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.6)",
              }}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "❚❚" : "►"}
            </button>
            <button
              onClick={onNext}
              style={{
                flex: 1,
                padding: "3px 0",
                background: "linear-gradient(180deg, #2a2a30 0%, #1a1a20 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 3,
                color: "#eee",
                fontSize: "0.62rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
              title="Next Track"
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MASSIVE BLENDED SCRAPBOOK CUTOUT COMPONENT
   Large (135px-225px), layered below letters (zIndex 5 vs 14),
   blended into vintage paper with soft contrast and tactile drop shadow
══════════════════════════════════════════════════ */
function ScrapbookCutout({
  item,
  animClass,
}: {
  item: CutoutConfig;
  animClass: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: item.top,
        bottom: item.bottom,
        left: item.left,
        right: item.right,
        width: item.width || 155,
        transform: `rotate(${item.rotate || 0}deg)`,
        zIndex: item.zIndex || 5, // Behind letters (zIndex: 14)
        opacity: 0.95,
        filter: "contrast(106%) brightness(0.96) drop-shadow(2px 6px 14px rgba(0,0,0,0.35))",
        cursor: "pointer",
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.22s ease",
        pointerEvents: "auto",
      }}
      title={item.label || "Scrapbook cutout"}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `rotate(${(item.rotate || 0) + 5}deg) scale(1.08)`;
        (e.currentTarget as HTMLElement).style.filter = "contrast(110%) brightness(1) drop-shadow(3px 10px 20px rgba(0,0,0,0.48))";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `rotate(${item.rotate || 0}deg) scale(1)`;
        (e.currentTarget as HTMLElement).style.filter = "contrast(106%) brightness(0.96) drop-shadow(2px 6px 14px rgba(0,0,0,0.35))";
      }}
    >
      <div className={`scrapbook-cutout-hero ${animClass}`}>
        <img
          src={item.src}
          alt={item.label || "scrapbook cutout"}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════
   LEFT PAGE COMPONENT (OLD BROWN PAPER TEXTURE & CRUMPLED LETTER)
══════════════════════════════════════════════════ */
function LeftPageContent({
  chapter,
  phase: _phase,
  currentIdx: _currentIdx,
  onSelectChapter: _onSelectChapter,
  onOpenIndex: _onOpenIndex,
  onExpandPaper: _onExpandPaper,
  isFlipping = false,
}: {
  chapter: Chapter;
  phase?: AnimPhase;
  currentIdx?: number;
  onSelectChapter?: (id: number) => void;
  onOpenIndex?: () => void;
  onExpandPaper?: (p: Paper) => void;
  isFlipping?: boolean;
}) {
  const theme = SCRAPBOOK_THEMES[chapter.id] || SCRAPBOOK_THEMES[0];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#c5a472",
        backgroundImage: `
          radial-gradient(ellipse at 15% 20%, rgba(110, 65, 20, 0.16) 0%, transparent 60%),
          radial-gradient(ellipse at 85% 80%, rgba(90, 50, 15, 0.2) 0%, transparent 65%),
          radial-gradient(circle at 50% 50%, rgba(150, 100, 45, 0.12) 0%, transparent 70%),
          repeating-radial-gradient(circle at 25% 65%, rgba(95, 55, 20, 0.035) 0px, transparent 2px, rgba(95, 55, 20, 0.035) 5px),
          linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.08) 100%)
        `,
        boxShadow: "inset 0 0 50px rgba(65, 35, 10, 0.42), inset 0 0 15px rgba(45, 20, 5, 0.6)",
        borderRadius: "6px 0 0 6px",
        padding: "16px 20px 14px 22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* ═══ VERTICAL DARK VELVET / LACE STRIP ALONG LEFT EDGE ═══ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 52,
          backgroundColor: theme.ribbonColor || theme.themeColor || "#58111A",
          backgroundImage: `
            repeating-conic-gradient(#ffffff22 0% 25%, transparent 0% 50%) 0 0 / 16px 16px,
            repeating-conic-gradient(#00000028 0% 25%, transparent 0% 50%) 8px 8px / 16px 16px,
            linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 80%, rgba(0,0,0,0.2) 100%)
          `,
          boxShadow: "2px 0 6px rgba(0,0,0,0.4)",
          borderRight: "1px dashed rgba(255,255,255,0.4)",
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      {/* ═══ CORNER ACCENT: LEOPARD OR RED NET (FLUSH WITH PAGE EDGES) ═══ */}
      {theme.leftScallopCorner && (
        <PageCornerAccent corner={theme.leftScallopCorner} style={theme.leftCornerStyle} />
      )}

      {/* ═══ LARGE HERO SCRAPBOOK DIE-CUT CUTOUTS (LEFT PAGE) ═══ */}
      {theme.leftCutouts.map((item, idx) => (
        <ScrapbookCutout key={`left-cutout-${chapter.id}-${idx}`} item={item} animClass={theme.animClass} />
      ))}

      {/* Center spine gutter shadow on right edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 28,
          background: "linear-gradient(to right, transparent, rgba(0,0,0,0.32))",
          pointerEvents: "none",
          zIndex: 25,
        }}
      />

      {/* Book outer binding rim on far left */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 6,
          background: "linear-gradient(to right, rgba(90,20,10,0.8), rgba(130,35,15,0.4))",
          pointerEvents: "none",
          zIndex: 30,
        }}
      />

      {/* Continuously Rotating Stars in Margin */}
      <div style={{ position: "absolute", top: 16, left: 14, zIndex: 26, pointerEvents: "none" }}>
        <RotatingStar color="#ff2a4b" size="1.35rem" speed={5} />
      </div>
      <div style={{ position: "absolute", bottom: 18, left: 14, zIndex: 26, pointerEvents: "none" }}>
        <RotatingStar color="#FFD700" size="1.2rem" speed={6.5} reverse />
      </div>
      <div style={{ position: "absolute", top: "50%", left: 8, zIndex: 26, pointerEvents: "none" }}>
        <RotatingStar color="#ffffff" size="0.95rem" speed={4.2} />
      </div>

      {/* ═══ TOP: DATE HEADER WITH HIGHLIGHTER STROKE (MATCHING PHOTO) ═══ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, zIndex: 12, paddingLeft: 42 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.78rem",
              fontWeight: 900,
              color: "#2a1508",
              letterSpacing: "0.06em",
              position: "relative",
              zIndex: 3,
            }}
          >
          
          </span>
          {/* Highlighter marker stroke underneath */}
          <div
            style={{
              position: "absolute",
              bottom: 2,
              left: -4,
              right: -4,
              height: 8,
              background: theme.highlighterColor,
              opacity: 0.85,
              borderRadius: 2,
              transform: "rotate(-1deg)",
              zIndex: 2,
            }}
          />
        </div>

        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "0.88rem", color: "#5a4025", fontWeight: 700 }}>
          {chapter.dateTag || `Entry #${chapter.trackNum}`}
        </div>
      </div>

      {/* ═══ CENTER: CRUMPLED STORY LETTER (PART I) ═══ */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 14, paddingLeft: 16 }}>
        <CrumpledLetterPaper
          key={`left-${chapter.id}`}
          title={chapter.title}
          subtitle={chapter.subtitle}
          lines={chapter.leftStoryLines && chapter.leftStoryLines.length ? chapter.leftStoryLines : (chapter.leftPapers[0]?.lines || [])}
          side="left"
          tapeColor={chapter.tapeColor || "#f4a261"}
          stampEmoji={chapter.stampEmoji || "💌"}
          dateTag={`CH ${chapter.trackNum}`}
          initialDelay={180}
          onExpand={() => {
            if (_onExpandPaper) {
              _onExpandPaper({
                id: `ch-${chapter.id}-left`,
                title: chapter.title,
                prod: `Chapter ${chapter.trackNum} • Part I • By Bhavika`,
                lines: chapter.leftStoryLines && chapter.leftStoryLines.length ? chapter.leftStoryLines : (chapter.leftPapers[0]?.lines || []),
                bgColor: "#faf6ec",
                rotate: 0,
                offsetX: 0,
                offsetY: 0,
              });
            }
          }}
        />
      </div>

      {/* ═══ BOTTOM: BALLPOINT DOODLE ARROW & PHOTO MEMO ACCENT ═══ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4, zIndex: 20, paddingLeft: 44 }}>
        <div
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "0.88rem",
            color: "#182c4d",
            fontWeight: 700,
            textShadow: "0 1px 1px rgba(255,255,255,0.7)",
            transform: "rotate(-1.5deg)",
          }}
        >
          {theme.leftArrow}
        </div>
      </div>
    </div>
  );
}

function RightPageContent({
  chapter,
  isPlaying = false,
  onPrev = () => {},
  onStop = () => {},
  onNext = () => {},
  onTogglePlay,
  isFlipping = false,
  onExpandPaper,
}: {
  chapter: Chapter;
  isPlaying?: boolean;
  onPrev?: () => void;
  onStop?: () => void;
  onNext?: () => void;
  onTogglePlay?: () => void;
  isFlipping?: boolean;
  onExpandPaper?: (p: Paper) => void;
}) {
  const theme = SCRAPBOOK_THEMES[chapter.id] || SCRAPBOOK_THEMES[0];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#c5a472",
        backgroundImage: `
          radial-gradient(ellipse at 85% 20%, rgba(110, 65, 20, 0.16) 0%, transparent 60%),
          radial-gradient(ellipse at 15% 80%, rgba(90, 50, 15, 0.2) 0%, transparent 65%),
          radial-gradient(circle at 50% 50%, rgba(150, 100, 45, 0.12) 0%, transparent 70%),
          repeating-radial-gradient(circle at 75% 35%, rgba(95, 55, 20, 0.035) 0px, transparent 2px, rgba(95, 55, 20, 0.035) 5px),
          linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.08) 100%)
        `,
        boxShadow: "inset 0 0 50px rgba(65, 35, 10, 0.42), inset 0 0 15px rgba(45, 20, 5, 0.6)",
        borderRadius: "0 6px 6px 0",
        padding: "14px 18px 12px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* ═══ CORNER ACCENT: LEOPARD OR RED NET (FLUSH WITH PAGE EDGES) ═══ */}
      {theme.rightScallopCorner && (
        <PageCornerAccent corner={theme.rightScallopCorner} style={theme.rightCornerStyle} />
      )}

      {/* ═══ LARGE HERO SCRAPBOOK DIE-CUT CUTOUTS (RIGHT PAGE) ═══ */}
      {theme.rightCutouts.map((item, idx) => (
        <ScrapbookCutout key={`right-cutout-${chapter.id}-${idx}`} item={item} animClass={theme.animClass} />
      ))}

      {/* Center spine gutter shadow on left edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 28,
          background: "linear-gradient(to left, transparent, rgba(0,0,0,0.32))",
          pointerEvents: "none",
          zIndex: 25,
        }}
      />


      {/* Continuously Rotating Stars */}
      <div style={{ position: "absolute", top: 14, right: 16, zIndex: 26, pointerEvents: "none" }}>
        <RotatingStar color="#ff2a4b" size="1.35rem" speed={5.2} />
      </div>
      <div style={{ position: "absolute", top: "54%", right: 8, zIndex: 26, pointerEvents: "none" }}>
        <RotatingStar color="#ffd700" size="1.05rem" speed={7} reverse />
      </div>

      {/* ── TOP: RETRO HOLOGRAPHIC CD JEWEL CASE PLAYER ── */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4, zIndex: 14 }}>
        <CDPlayer
          trackNum={chapter.trackNum}
          title={chapter.title}
          bg={chapter.cassetteBg}
          isPlaying={isPlaying}
          onPrev={onPrev}
          onStop={onStop}
          onNext={onNext}
        />
      </div>

      {/* ── CENTER: CRUMPLED STORY LETTER (PART II / CLIMAX) ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 14 }}>
        <CrumpledLetterPaper
          key={`right-${chapter.id}`}
          title={`Chapter ${chapter.trackNum} • Continued`}
          lines={chapter.rightStoryLines && chapter.rightStoryLines.length ? chapter.rightStoryLines : (chapter.rightLyrics || [])}
          side="right"
          tapeColor={chapter.tapeColor || "#2A9D8F"}
          stampEmoji="✨"
          dateTag="SIDE B"
          initialDelay={260}
          onExpand={() => {
            if (onExpandPaper) {
              onExpandPaper({
                id: `ch-${chapter.id}-right`,
                title: `${chapter.title} (Part II)`,
                prod: `Chapter ${chapter.trackNum} • Continued • For Khushi`,
                lines: chapter.rightStoryLines && chapter.rightStoryLines.length ? chapter.rightStoryLines : (chapter.rightLyrics || []),
                bgColor: "#faf6ec",
                rotate: 0,
                offsetX: 0,
                offsetY: 0,
              });
            }
          }}
        />
      </div>

      {/* ── BOTTOM: POLAROID MEMORY SNAPSHOT WITH WHITE BORDER + DOODLE ARROW ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, zIndex: 20, paddingRight: 6 }}>
        {/* Authentic Polaroid Photo Frame matching reference */}
        <div
          style={{
            background: "#ffffff",
            padding: "5px 6px 16px 6px",
            boxShadow: "3px 6px 16px rgba(0,0,0,0.38), 0 1px 3px rgba(0,0,0,0.2)",
            transform: "rotate(-2.5deg)",
            borderRadius: 2,
            maxWidth: 155,
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              width: 136,
              height: 56,
              backgroundColor: chapter.cassetteBg,
              backgroundImage: `
                radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%),
                linear-gradient(45deg, rgba(0,0,0,0.22) 0%, transparent 100%)
              `,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.45rem",
              borderRadius: 1,
            }}
          >
            {chapter.stampEmoji || "📷"}
          </div>
          <div
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "0.72rem",
              color: "#182c4d",
              textAlign: "center",
              marginTop: 4,
              fontWeight: 800,
            }}
          >
            {chapter.polaroidCaption || "memory recorded 🎞️"}
          </div>
        </div>

        {/* Right handwritten doodle arrow annotation */}
        <div
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "0.88rem",
            color: "#182c4d",
            fontWeight: 700,
            maxWidth: 165,
            lineHeight: 1.25,
            textShadow: "0 1px 1px rgba(255,255,255,0.7)",
            transform: "rotate(1deg)",
            textAlign: "right",
          }}
        >
          {theme.rightArrow}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   FRONT COVER
══════════════════════════════════════════════════ */
function FrontCoverView({ onOpenBook }: { onOpenBook: () => void }) {
  const STARS = [
    { top: "6%", left: "10%", size: 18, color: "#FFD700", rotate: 15 },
    { top: "5%", left: "75%", size: 15, color: "#FFD700", rotate: 35 },
    { top: "14%", left: "86%", size: 12, color: "#ffffff", rotate: -15 },
    { top: "82%", left: "8%", size: 16, color: "#FFD700", rotate: -15 },
    { top: "86%", left: "70%", size: 14, color: "#FFD700", rotate: 10 },
    { top: "88%", left: "90%", size: 16, color: "#ffffff", rotate: -5 },
  ];

  return (
    <div
      onClick={onOpenBook}
      style={{
        position: "relative",
        width: "clamp(300px, 36vw, 380px)",
        height: "clamp(460px, 68vh, 600px)",
        borderRadius: "4px 8px 8px 4px",
        background: "linear-gradient(160deg, #6B0F0F 0%, #8B2020 25%, #A63320 50%, #C4511A 80%, #B84A15 100%)",
        boxShadow: "0 28px 80px rgba(0,0,0,0.8), 0 8px 24px rgba(139,32,32,0.45)",
        cursor: "pointer",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 32,
          background: "linear-gradient(to right, #4a0c0c, #7a1515, #5a1010)",
          boxShadow: "inset -3px 0 8px rgba(0,0,0,0.5)",
          zIndex: 5,
        }}
      >
        {[15, 35, 55, 75].map((pct) => (
          <div
            key={pct}
            style={{
              position: "absolute",
              top: `${pct}%`,
              left: 4,
              right: 4,
              height: 2,
              background: "rgba(255,200,100,0.35)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "52%",
          transform: "translateY(-50%)",
          height: 14,
          background: "linear-gradient(to bottom, #7a1515, #550a0a, #7a1515)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
          zIndex: 4,
        }}
      />

      {STARS.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))",
            zIndex: 3,
          }}
        >
          <RotatingStar
            color={s.color}
            size={s.size}
            speed={5 + (i % 3) * 1.8}
            reverse={i % 2 === 1}
          />
        </span>
      ))}

      <div style={{ position: "relative", zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["T", "H", "I", "N", "G", "S"].map((l, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                background: ["#F5C842", "#2A9D8F", "#F1E8D0", "#ffffff", "#C1121F", "#1a1a1a"][i],
                color: [0, 1].includes(i) ? (i === 0 ? "#1a1a1a" : "#ffffff") : i === 4 ? "#ffffff" : i === 5 ? "#F5C842" : "#8B1A1A",
                fontFamily: "'Permanent Marker', cursive",
                fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
                fontWeight: 900,
                padding: "4px 8px",
                transform: `rotate(${[-2, 3, -1, 2, -3, 1][i]}deg)`,
                boxShadow: "2px 3px 6px rgba(0,0,0,0.5)",
              }}
            >
              {l}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          <span
            style={{
              display: "inline-block",
              background: "#2A9D8F",
              color: "#F1E8D0",
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
              fontWeight: 900,
              padding: "4px 14px",
              transform: "rotate(-2deg)",
              boxShadow: "2px 3px 6px rgba(0,0,0,0.5)",
            }}
          >
            I
          </span>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {["N", "E", "V", "E", "R"].map((l, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                background: ["#F1E8D0", "#F5C842", "#ffffff", "#C1121F", "#F1E8D0"][i],
                color: i === 3 ? "#ffffff" : i === 2 ? "#2A9D8F" : "#1a1a1a",
                fontFamily: "'Impact', sans-serif",
                fontSize: "clamp(1.3rem, 2.6vw, 2rem)",
                fontWeight: 900,
                padding: "4px 8px",
                transform: `rotate(${[2, -3, 2, -1, 3][i]}deg)`,
                boxShadow: "2px 3px 6px rgba(0,0,0,0.5)",
              }}
            >
              {l}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {["S", "A", "I", "D"].map((l, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                background: ["#F5C842", "#ffffff", "#2A9D8F", "#F1E8D0"][i],
                color: i === 1 ? "#C1121F" : i === 2 ? "#F1E8D0" : "#1a1a1a",
                fontFamily: "'Permanent Marker', cursive",
                fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
                fontWeight: 900,
                padding: "4px 8px",
                transform: `rotate(${[-2, 2, -1, 3][i]}deg)`,
                boxShadow: "2px 3px 6px rgba(0,0,0,0.5)",
              }}
            >
              {l}
            </span>
          ))}
          <span style={{ fontSize: "1.8rem", color: "#C1121F", filter: "drop-shadow(1px 2px 3px rgba(0,0,0,0.5))" }}>❤️</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 22,
          fontFamily: "'Caveat', cursive",
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "#FFD700",
          textAlign: "center",
          letterSpacing: "0.06em",
          background: "rgba(0, 0, 0, 0.65)",
          padding: "5px 16px",
          borderRadius: "999px",
          border: "1.5px solid rgba(255, 215, 0, 0.7)",
          boxShadow: "0 0 15px rgba(255, 215, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          animation: "tapPulse 1.8s ease-in-out infinite",
        }}
      >
        <span style={{ animation: "handBounce 1.2s ease-in-out infinite" }}>👆</span>
        <span>TAP TO OPEN DIARY</span>
        <span>✨</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   EXACT REPLICA OF THE BACK OF THE BOOK (USER'S IMAGE)
══════════════════════════════════════════════════ */
function AuthenticBackCover({
  onSelectTrack,
  onReplayIntro,
  onViewFront,
}: {
  onSelectTrack: (id: number) => void;
  onReplayIntro: () => void;
  onViewFront: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "16px 0",
      }}
    >
      {/* Wooden Desk Pen on Upper-Left */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "max(12px, calc(50% - 310px))",
          width: 220,
          transform: "rotate(-38deg)",
          zIndex: 25,
          pointerEvents: "none",
          filter: "drop-shadow(6px 12px 16px rgba(0,0,0,0.65))",
        }}
      >
        <svg viewBox="0 0 240 24" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,12 28,6 28,18" fill="#d4af37" />
          <polygon points="0,12 8,10 8,14" fill="#333" />
          <rect x="28" y="7" width="12" height="10" rx="1" fill="#c8a830" />
          <rect x="40" y="7.5" width="170" height="9" rx="3" fill="#1a1a1a" />
          <rect x="65" y="4" width="75" height="2.5" rx="1" fill="#c8a830" />
          <rect x="180" y="7" width="8" height="10" fill="#c8a830" />
          <rect x="188" y="7.5" width="36" height="9" rx="2" fill="#222" />
        </svg>
      </div>

      {/* Faint wood watermark */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "1.1rem",
          letterSpacing: "0.55em",
          color: "rgba(30,12,4,0.45)",
          fontWeight: 900,
          marginBottom: 10,
          textShadow: "0 1px 1px rgba(255,255,255,0.08)",
        }}
      >
        B H A V I K A   &   K H U S H I
      </div>

      {/* ── THE BOOK BACK COVER CARD ── */}
      <BackCoverBookCard onSelectTrack={onSelectTrack} onViewFront={onViewFront} />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   AUTHENTIC BOOK BACK COVER CARD (REUSABLE)
   Used both in AuthenticBackCover and in 3D Closing Leaf
══════════════════════════════════════════════════ */
function BackCoverBookCard({
  onSelectTrack,
  onViewFront,
  isClosingCover = false,
}: {
  onSelectTrack: (id: number) => void;
  onViewFront?: () => void;
  isClosingCover?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: isClosingCover ? "100%" : "min(500px, 47.5vw)",
        height: isClosingCover ? "100%" : "clamp(620px, 80vh, 760px)",
        minHeight: isClosingCover ? "100%" : "clamp(620px, 80vh, 760px)",
        background: `
          radial-gradient(ellipse at 50% 40%, rgba(225,85,35,0.85) 0%, rgba(185,50,20,0.92) 50%, rgba(130,25,10,0.98) 100%),
          repeating-radial-gradient(circle at 30% 20%, rgba(0,0,0,0.18) 0px, transparent 4px, rgba(0,0,0,0.08) 8px),
          #a63319
        `,
        boxShadow: isClosingCover
          ? "inset 0 0 50px rgba(0,0,0,0.6)"
          : `
          0 25px 70px rgba(0,0,0,0.85),
          0 10px 25px rgba(0,0,0,0.5),
          inset 0 0 60px rgba(0,0,0,0.5)
        `,
        borderRadius: "6px 0 0 6px",
        borderLeft: "2px solid rgba(255,240,220,0.4)",
        borderTop: "2px solid rgba(255,240,220,0.3)",
        borderBottom: "2px solid rgba(255,240,220,0.3)",
        borderRight: "4px solid #7a1508",
        padding: "26px 22px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Right binding edge seam */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 14,
          background: "linear-gradient(to left, rgba(200,30,80,0.4), rgba(120,20,10,0.6))",
          borderLeft: "1px solid rgba(0,0,0,0.25)",
          pointerEvents: "none",
        }}
      />

      {/* Mottled rust texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(60,10,0,0.25) 0%, transparent 40%),
            radial-gradient(circle at 85% 75%, rgba(60,10,0,0.3) 0%, transparent 45%),
            radial-gradient(circle at 50% 60%, rgba(0,0,0,0.2) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── TOP: RANSOM COLLAGE LOGO "❤️ THINGS I NEVER SAID" ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginBottom: 6,
          filter: "drop-shadow(1px 2px 4px rgba(0,0,0,0.5))",
          cursor: "pointer",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 420,
        }}
        onClick={onViewFront}
        title="Click to view front cover"
      >
        <span style={{ fontSize: "1.15rem", marginRight: 2, filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.5))" }}>
          ❤️
        </span>

        {/* THINGS */}
        {[
          { ch: "T", bg: "#d93829", color: "#fff", rotate: -3 },
          { ch: "H", bg: "#e5b72e", color: "#111", rotate: 2 },
          { ch: "I", bg: "#259385", color: "#fff", rotate: -2 },
          { ch: "N", bg: "#f3eedc", color: "#222", rotate: 1 },
          { ch: "G", bg: "#1f5f8b", color: "#fff", rotate: -1 },
          { ch: "S", bg: "#d93829", color: "#fff", rotate: 3 },
        ].map((l, idx) => (
          <span
            key={`things-${idx}`}
            style={{
              display: "inline-block",
              background: l.bg,
              color: l.color,
              fontFamily: "'Permanent Marker', 'Impact', sans-serif",
              fontSize: "0.82rem",
              fontWeight: 900,
              padding: "2px 4px",
              transform: `rotate(${l.rotate}deg)`,
              boxShadow: "1px 2px 4px rgba(0,0,0,0.4)",
              lineHeight: 1.1,
            }}
          >
            {l.ch}
          </span>
        ))}

        <span style={{ width: 4 }} />

        {/* I */}
        <span
          style={{
            display: "inline-block",
            background: "#259385",
            color: "#fff",
            fontFamily: "'Permanent Marker', 'Impact', sans-serif",
            fontSize: "0.82rem",
            fontWeight: 900,
            padding: "2px 5px",
            transform: "rotate(-1deg)",
            boxShadow: "1px 2px 4px rgba(0,0,0,0.4)",
            lineHeight: 1.1,
          }}
        >
          I
        </span>

        <span style={{ width: 4 }} />

        {/* NEVER */}
        {[
          { ch: "N", bg: "#1e3a5f", color: "#f3eedc", rotate: 1 },
          { ch: "E", bg: "#e5b72e", color: "#111", rotate: -2 },
          { ch: "V", bg: "#d93829", color: "#fff", rotate: 2 },
          { ch: "E", bg: "#259385", color: "#fff", rotate: -1 },
          { ch: "R", bg: "#f4a261", color: "#111", rotate: 1 },
        ].map((l, idx) => (
          <span
            key={`never-${idx}`}
            style={{
              display: "inline-block",
              background: l.bg,
              color: l.color,
              fontFamily: "'Permanent Marker', 'Impact', sans-serif",
              fontSize: "0.82rem",
              fontWeight: 900,
              padding: "2px 4px",
              transform: `rotate(${l.rotate}deg)`,
              boxShadow: "1px 2px 4px rgba(0,0,0,0.4)",
              lineHeight: 1.1,
            }}
          >
            {l.ch}
          </span>
        ))}

        <span style={{ width: 4 }} />

        {/* SAID */}
        {[
          { ch: "S", bg: "#1f5f8b", color: "#fff", rotate: -2 },
          { ch: "A", bg: "#d93829", color: "#fff", rotate: 1 },
          { ch: "I", bg: "#e5b72e", color: "#111", rotate: -1 },
          { ch: "D", bg: "#259385", color: "#fff", rotate: 2 },
        ].map((l, idx) => (
          <span
            key={`said-${idx}`}
            style={{
              display: "inline-block",
              background: l.bg,
              color: l.color,
              fontFamily: "'Permanent Marker', 'Impact', sans-serif",
              fontSize: "0.82rem",
              fontWeight: 900,
              padding: "2px 4px",
              transform: `rotate(${l.rotate}deg)`,
              boxShadow: "1px 2px 4px rgba(0,0,0,0.4)",
              lineHeight: 1.1,
            }}
          >
            {l.ch}
          </span>
        ))}
      </div>

      {/* ── SUBTITLE HEADER ── */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.72rem",
          color: "#f6e4cc",
          letterSpacing: "0.22em",
          fontWeight: 700,
          textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          marginBottom: 6,
        }}
      >
        A SCRAPBOOK BY BHAVIKA FOR KHUSHI
      </div>

      {/* ── STAR STICKERS (EXACT POSITIONS FROM USER'S PHOTO, CONTINUOUSLY ROTATING) ── */}
      <div style={{ position: "absolute", top: "35%", left: "12%", pointerEvents: "none", zIndex: 10, display: "flex", gap: 3 }}>
        <RotatingStar color="#e8c038" size="1.4rem" speed={6} style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.5))" }} />
        <RotatingStar color="#e8c038" size="1.1rem" speed={4.5} reverse style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.5))" }} />
      </div>

      <div style={{ position: "absolute", top: "28%", right: "12%", pointerEvents: "none", zIndex: 10 }}>
        <RotatingStar color="#e8c038" size="1.8rem" speed={7.5} style={{ filter: "drop-shadow(1px 2px 3px rgba(0,0,0,0.5))" }} />
      </div>

      <div style={{ position: "absolute", bottom: "35%", left: "15%", pointerEvents: "none", zIndex: 10 }}>
        <RotatingStar color="#e8c038" size="1.5rem" speed={5.5} reverse style={{ filter: "drop-shadow(1px 2px 3px rgba(0,0,0,0.5))" }} />
      </div>

      <div style={{ position: "absolute", bottom: "36%", right: "16%", pointerEvents: "none", zIndex: 10, display: "flex", gap: 2 }}>
        <RotatingStar color="#111111" size="1.1rem" speed={5} style={{ filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.2))" }} />
        <RotatingStar color="#e8c038" size="1.3rem" speed={4} reverse style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.5))" }} />
        <RotatingStar color="#111111" size="1.0rem" speed={6.5} style={{ filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.2))" }} />
      </div>

      {/* ── TRACKLIST (ALL 17 CHAPTERS IN 2-COLUMN RETRO TYPEWRITER TRACKLIST) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3px 10px",
          width: "100%",
          maxWidth: 440,
          zIndex: 12,
          marginBottom: 8,
          padding: "0 6px",
        }}
      >
        {CHAPTERS.map((ch, idx) => (
          <div
            key={ch.id}
            onClick={() => onSelectTrack(ch.id)}
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "clamp(0.56rem, 0.88vw, 0.72rem)",
              fontWeight: idx === 0 ? 900 : 700,
              color: idx === 0 ? "#FFD700" : "#f6e4cc",
              letterSpacing: "0.03em",
              textShadow: idx === 0 ? "0 0 8px rgba(255,215,0,0.8)" : "0 1px 3px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.9)",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: 4,
              transition: "all 0.15s ease",
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              background: idx === 0 ? "rgba(255,215,0,0.18)" : "transparent",
              border: idx === 0 ? "1px solid rgba(255,215,0,0.6)" : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#FFD700";
              (e.currentTarget as HTMLElement).style.textShadow = "0 0 8px rgba(255,215,0,0.7)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = idx === 0 ? "#FFD700" : "#f6e4cc";
              (e.currentTarget as HTMLElement).style.textShadow = idx === 0 ? "0 0 8px rgba(255,215,0,0.8)" : "0 1px 3px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.9)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            title={`Click to read Chapter ${ch.trackNum}: ${ch.title}`}
          >
            {ch.displayTitle} {idx === 0 && <span style={{ fontSize: "0.65rem", marginLeft: 2, color: "#FFD700" }}>👈 START</span>}
          </div>
        ))}
      </div>

      {/* ── BIRTHDAY DEDICATION BANNER (From Chapter 17 & 16) ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          marginBottom: 6,
          zIndex: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
          {["H", "A", "P", "P", "Y"].map((c, i) => (
            <span
              key={`h-${i}`}
              style={{
                background: ["#d93829", "#e5b72e", "#259385", "#1f5f8b", "#f4a261"][i],
                color: i === 1 ? "#111" : "#fff",
                fontFamily: "'Permanent Marker', cursive",
                fontSize: "0.68rem",
                padding: "1px 4px",
                fontWeight: 900,
                transform: `rotate(${[-2, 1, -1, 2, -2][i]}deg)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
              }}
            >
              {c}
            </span>
          ))}
          <span style={{ width: 4 }} />
          {["B", "I", "R", "T", "H", "D", "A", "Y"].map((c, i) => (
            <span
              key={`b-${i}`}
              style={{
                background: ["#e63946", "#2A9D8F", "#F5C842", "#1f5f8b", "#9d4edd", "#264653", "#d93829", "#e5b72e"][i],
                color: [2, 7].includes(i) ? "#111" : "#fff",
                fontFamily: "'Permanent Marker', cursive",
                fontSize: "0.68rem",
                padding: "1px 4px",
                fontWeight: 900,
                transform: `rotate(${[1, -2, 2, -1, 1, -2, 2, -1][i]}deg)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
              }}
            >
              {c}
            </span>
          ))}
        </div>
        <span
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "0.86rem",
            color: "rgba(255, 235, 205, 0.95)",
            letterSpacing: "0.03em",
            textShadow: "0 1px 2px rgba(0,0,0,0.7)",
            textAlign: "center",
          }}
        >
          “not because our story is perfect... but because we're still here ❤️”
        </span>
      </div>

      {/* ── BOTTOM SECTION: 2 MINI POLAROID CARDS + FINAL ENTRY NOTE + OPEN SCRAPBOOK ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 12,
          paddingTop: 2,
        }}
      >
        {/* Left mini photo card: Khushi */}
        <div
          onClick={() => onSelectTrack(16)}
          style={{
            width: "clamp(62px, 8.5vw, 82px)",
            height: "clamp(78px, 11vw, 98px)",
            background: "#b83818",
            border: "1.5px solid rgba(255,255,255,0.45)",
            boxShadow: "2px 4px 10px rgba(0,0,0,0.55)",
            transform: "rotate(-3deg)",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "rotate(-3deg) scale(1.06)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "rotate(-3deg) scale(1)")}
          title="Jump to Chapter 17 (And Finally...)"
        >
          <div style={{ fontSize: "0.75rem", marginBottom: 1 }}>🎂</div>
          <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: "0.58rem", color: "#fff", lineHeight: 1 }}>
            KHUSHI
          </div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "0.52rem", color: "#ffd166", textAlign: "center", lineHeight: 1.1, marginTop: 2 }}>
            emergency contact
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
            <RotatingStar color="#e8c038" size="0.45rem" speed={4} />
            <RotatingStar color="#fff" size="0.42rem" speed={5} reverse />
          </div>
        </div>

        {/* Center info & washi tape */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
            padding: "0 6px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", gap: 3, marginBottom: 1, alignItems: "center" }}>
            <RotatingStar color="#111" size="0.75rem" speed={6} reverse style={{ filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.2))" }} />
            <span style={{ fontSize: "0.75rem" }}>💌</span>
            <RotatingStar color="#e8c038" size="0.85rem" speed={5} style={{ filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.5))" }} />
          </div>

          <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: "0.74rem", color: "#FFD700", letterSpacing: "0.06em", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
            FINAL ENTRY
          </div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "0.86rem", color: "#fff", lineHeight: 1.2, maxWidth: 220, textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
            “Thank you for having my back. Happy Birthday, idiot!”
          </div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: "0.56rem", color: "rgba(246,228,204,0.8)", letterSpacing: "0.06em", marginTop: 1 }}>
            BHAVIKA & KHUSHI • 2026
          </div>

          {/* Washi tape: Read From Start */}
          <div
            onClick={() => onSelectTrack(0)}
            style={{
              background: "linear-gradient(135deg, #cde35b, #b8d440)",
              padding: "3px 10px",
              marginTop: 3,
              transform: "rotate(-1.5deg)",
              boxShadow: "1px 2px 6px rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              clipPath: "polygon(2% 0%, 98% 3%, 100% 97%, 0% 100%)",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "rotate(-1.5deg) scale(1.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "rotate(-1.5deg) scale(1)")}
            title="Read from Chapter 01"
          >
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.62rem", fontWeight: 800, color: "#111" }}>
              Read From Start
            </span>
            <span
              style={{
                background: "#1f5f8b",
                color: "#fff",
                fontFamily: "'Impact', sans-serif",
                fontSize: "0.62rem",
                padding: "0 3px",
                borderRadius: 2,
              }}
            >
              📖 Ch 01
            </span>
          </div>
        </div>

        {/* Right mini photo card: Bhavika */}
        <div
          onClick={() => onSelectTrack(15)}
          style={{
            width: "clamp(62px, 8.5vw, 82px)",
            height: "clamp(78px, 11vw, 98px)",
            background: "#a62c10",
            border: "1.5px solid rgba(255,255,255,0.45)",
            boxShadow: "2px 4px 10px rgba(0,0,0,0.55)",
            transform: "rotate(2.5deg)",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "rotate(2.5deg) scale(1.06)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "rotate(2.5deg) scale(1)")}
          title="Jump to Chapter 16 (Things Unsaid)"
        >
          <div style={{ fontSize: "0.75rem", marginBottom: 1 }}>💌</div>
          <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: "0.58rem", color: "#f6e4cc", lineHeight: 1 }}>
            BHAVIKA
          </div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "0.52rem", color: "#ffd166", textAlign: "center", lineHeight: 1.1, marginTop: 2 }}>
            with all my love
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
            <RotatingStar color="#e8c038" size="0.42rem" speed={4} />
            <RotatingStar color="#111" size="0.42rem" speed={5} reverse />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   BACKGROUND YOUTUBE AUDIO PLAYER (Video ID: nl7BV3sgGV4)
══════════════════════════════════════════════════ */
function YouTubeAudioPlayer({ isPlaying }: { isPlaying: boolean }) {
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      const oldCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (oldCallback) oldCallback();
        initYT();
      };
    } else if (typeof window !== "undefined" && (window as any).YT && (window as any).YT.Player) {
      initYT();
    }

    function initYT() {
      if (playerRef.current) return;
      try {
        playerRef.current = new (window as any).YT.Player("yt-bg-audio-iframe", {
          events: {
            onReady: (event: any) => {
              if (isPlaying) {
                event.target.playVideo();
              }
            },
          },
        });
      } catch (err) {
        console.error("YT Player init error:", err);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const sendCommand = (cmd: "playVideo" | "pauseVideo") => {
      if (playerRef.current && typeof playerRef.current[cmd] === "function") {
        try {
          playerRef.current[cmd]();
        } catch (e) {
          // ignore
        }
      }
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: cmd,
            args: [],
          }),
          "*"
        );
      }
    };

    if (isPlaying) {
      sendCommand("playVideo");
      const t1 = setTimeout(() => sendCommand("playVideo"), 300);
      const t2 = setTimeout(() => sendCommand("playVideo"), 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      sendCommand("pauseVideo");
    }
  }, [isPlaying]);

  return (
    <div
      style={{
        position: "fixed",
        top: -9999,
        left: -9999,
        width: 1,
        height: 1,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <iframe
        ref={iframeRef}
        id="yt-bg-audio-iframe"
        src="https://www.youtube.com/embed/nl7BV3sgGV4?enablejsapi=1&autoplay=0&loop=1&playlist=nl7BV3sgGV4&controls=0&playsinline=1"
        title="Background Music Player"
        allow="autoplay"
        style={{ width: 1, height: 1, border: "none" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   LETTER UNCRUMPLE YOUTUBE AUDIO PLAYER (Video ID: jGiIZX7pgQo)
══════════════════════════════════════════════════ */
function UncrumpleAudioPlayer() {
  return (
    <div
      style={{
        position: "fixed",
        top: -9999,
        left: -9999,
        width: 1,
        height: 1,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <iframe
        id="yt-uncrumple-audio-iframe"
        src="https://www.youtube.com/embed/jGiIZX7pgQo?enablejsapi=1&autoplay=0&controls=0&playsinline=1"
        title="Letter Uncrumple Sound"
        allow="autoplay"
        style={{ width: 1, height: 1, border: "none" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN DIARY BOOK COMPONENT
══════════════════════════════════════════════════ */
export default function DiaryBook({ onEnter }: { onEnter: () => void }) {
  const [bookMode, setBookMode] = useState<BookMode>("front_cover");

  // Intro rapid sequence step (0 to 9)
  const [introStep, setIntroStep] = useState<number>(0);

  // Normal reading state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipState, setFlipState] = useState<{
    fromIdx: number;
    toIdx: number;
    dir: "forward" | "backward";
  } | null>(null);

  const [expandedPaper, setExpandedPaper] = useState<Paper | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentChapter = CHAPTERS[currentIdx] || CHAPTERS[0];

  /* ──────────────────────────────────────────────────
     AUTHENTIC 3D INTRO SEQUENCE:
     1. Front Cover on table (1.0s)
     2. Front Cover swings open in 3D (0.7s)
     3. Rapid 3D page flips through all 11 chapters (210ms each)
     4. Track 11 reached -> Book physically and visibly slams shut in 3D
     5. Settles flat on desk displaying Authentic Back Cover
  ────────────────────────────────────────────────── */
  const handleTapToOpen = useCallback(() => {
    setBookMode("intro_open");
    setIntroStep(0);
    setIsFlipping(false);
    setFlipState(null);
    setIsPlaying(true); // Auto play bg music on tap!

    setTimeout(() => {
      setBookMode("intro_flip");
      setIntroStep(0);
    }, 550);
  }, []);

  const startIntro = useCallback(() => {
    setBookMode("front_cover");
    setIntroStep(0);
    setIsFlipping(false);
    setFlipState(null);
    setTimeout(() => {
      handleTapToOpen();
    }, 300);
  }, [handleTapToOpen]);

  // Rapid snappy page flips in intro — last cover flips EXACTLY like a page!
  useEffect(() => {
    if (bookMode !== "intro_flip") return;

    if (introStep < CHAPTERS.length - 1) {
      const timer = setTimeout(() => {
        setIntroStep((prev) => prev + 1);
      }, 280); // 280ms per page flip (smooth & delightful reading pace)
      return () => clearTimeout(timer);
    } else {
      // Final step: the back cover flips over just like a page, then directly opens back cover!
      const timer = setTimeout(() => {
        setBookMode("back_cover");
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [bookMode, introStep]);

  // Tab navigation in open book or direct chapter selection from index
  const handleSelectChapter = useCallback(
    (targetIdx: number) => {
      playChapterClickSound();
      playPageFlipVoice(0.28);
      if (bookMode !== "open_book") {
        setCurrentIdx(targetIdx);
        setBookMode("open_book");
        return;
      }

      if (isFlipping || targetIdx === currentIdx) return;
      const dir = targetIdx > currentIdx ? "forward" : "backward";

      setIsFlipping(true);
      setFlipState({
        fromIdx: currentIdx,
        toIdx: targetIdx,
        dir,
      });

      // Realistic 440ms smooth physical page turn
      setTimeout(() => {
        setCurrentIdx(targetIdx);
        setIsFlipping(false);
        setFlipState(null);
      }, 440);
    },
    [bookMode, isFlipping, currentIdx]
  );

  const handleOpenIndex = useCallback(() => {
    setBookMode("back_cover");
  }, []);

  return (
    <>
      <style>{`
        @keyframes spinReelF { to { transform: rotate(360deg); } }
        @keyframes spinDisc { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @keyframes tapPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(255, 215, 0, 0.4); }
          50% { transform: scale(1.04); box-shadow: 0 0 30px rgba(255, 215, 0, 0.75); }
        }

        @keyframes handBounce {
          0%, 100% { transform: translateY(0px) rotate(-8deg); }
          50% { transform: translateY(-5px) rotate(6deg); }
        }

        @keyframes msgFadePulse {
          0%, 100% { transform: translateY(0px); opacity: 0.92; }
          50% { transform: translateY(-4px); opacity: 1; }
        }

        /* ══════════════════════════════════════════════════
           17 UNIQUE CHAPTER SCRAPBOOK CUTOUT ANIMATIONS
        ══════════════════════════════════════════════════ */
        /* Chapter 01: Nostalgic floating drift */
        @keyframes chAnim01_drift {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(4deg); }
        }
        .anim-ch-01 { animation: chAnim01_drift 4.2s ease-in-out infinite; }

        /* Chapter 02: Playful telephone buzz / ring pulse */
        @keyframes chAnim02_buzz {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10%, 30% { transform: translate(-1.5px, 1px) rotate(-1.5deg); }
          20%, 40% { transform: translate(1.5px, -1px) rotate(1.5deg); }
          50% { transform: translate(0, 0) rotate(0deg); }
        }
        .anim-ch-02 { animation: chAnim02_buzz 3.2s ease-in-out infinite; }

        /* Chapter 03: Inquisitive curiosity bounce */
        @keyframes chAnim03_curiosity {
          0%, 100% { transform: translateY(0) scale(1); }
          35% { transform: translateY(-8px) scale(1.06) rotate(3deg); }
          70% { transform: translateY(1px) scale(0.97) rotate(-2deg); }
        }
        .anim-ch-03 { animation: chAnim03_curiosity 2.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }

        /* Chapter 04: Destiny orbital sway / magnetic pull */
        @keyframes chAnim04_orbit {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(3px, -3px) rotate(2deg); }
          50% { transform: translate(0, -6px) rotate(0deg); }
          75% { transform: translate(-3px, -3px) rotate(-2deg); }
        }
        .anim-ch-04 { animation: chAnim04_orbit 4.8s ease-in-out infinite; }

        /* Chapter 05: Shock pop & heartbeat thump */
        @keyframes chAnim05_pop {
          0%, 100% { transform: scale(1) rotate(0deg); }
          15% { transform: scale(1.10) rotate(-3deg); }
          30% { transform: scale(0.96) rotate(2deg); }
          45% { transform: scale(1.05) rotate(-1deg); }
          60% { transform: scale(1) rotate(0deg); }
        }
        .anim-ch-05 { animation: chAnim05_pop 2.4s ease-in-out infinite; }

        /* Chapter 06: Tipsy wobble & liquid sway */
        @keyframes chAnim06_wobble {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-6deg) translateY(-3px); }
          75% { transform: rotate(6deg) translateY(3px); }
        }
        .anim-ch-06 { animation: chAnim06_wobble 3.6s ease-in-out infinite; }

        /* Chapter 07: Tsundere twirl & sparkle pulse */
        @keyframes chAnim07_twirl {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(12deg) scale(1.08); }
        }
        .anim-ch-07 { animation: chAnim07_twirl 3.8s ease-in-out infinite; }

        /* Chapter 08: Morning rush & tick-tock swing */
        @keyframes chAnim08_rush {
          0%, 100% { transform: rotate(-7deg); }
          50% { transform: rotate(7deg); }
        }
        .anim-ch-08 { animation: chAnim08_rush 1.8s ease-in-out infinite; }

        /* Chapter 09: Storm tremor & electric jitter */
        @keyframes chAnim09_tremor {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 2px) rotate(-2deg); }
          40% { transform: translate(2px, -1px) rotate(2deg); }
          60% { transform: translate(-1px, -2px) rotate(1deg); }
          80% { transform: translate(2px, 1px) rotate(-1deg); }
        }
        .anim-ch-09 { animation: chAnim09_tremor 2.6s ease-in-out infinite; }

        /* Chapter 10: Smooth cab cruising glide */
        @keyframes chAnim10_glide {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(5px) translateY(-4px); }
        }
        .anim-ch-10 { animation: chAnim10_glide 4.5s ease-in-out infinite; }

        /* Chapter 11: Moving flat breeze drift */
        @keyframes chAnim11_breeze {
          0%, 100% { transform: translateY(0) skewX(0deg); }
          50% { transform: translateY(-7px) skewX(4deg); }
        }
        .anim-ch-11 { animation: chAnim11_breeze 4.8s ease-in-out infinite; }

        /* Chapter 12: Slow crystalline frost shimmer */
        @keyframes chAnim12_frost {
          0%, 100% { transform: scale(1); opacity: 0.94; }
          50% { transform: scale(1.06); opacity: 1; filter: drop-shadow(0 0 10px rgba(180,215,255,0.7)); }
        }
        .anim-ch-12 { animation: chAnim12_frost 3.5s ease-in-out infinite; }

        /* Chapter 13: Passionate heart bloom */
        @keyframes chAnim13_bloom {
          0%, 100% { transform: scale(1) rotate(0deg); }
          30% { transform: scale(1.12) rotate(4deg); }
          60% { transform: scale(0.96) rotate(-2deg); }
        }
        .anim-ch-13 { animation: chAnim13_bloom 3s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite; }

        /* Chapter 14: Golden glimmer rising */
        @keyframes chAnim14_rise {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-9px) scale(1.06); }
        }
        .anim-ch-14 { animation: chAnim14_rise 4.0s ease-in-out infinite; }

        /* Chapter 15: Harmonic cyclic infinity bob */
        @keyframes chAnim15_harmonic {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(3deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(5px) rotate(-3deg); }
        }
        .anim-ch-15 { animation: chAnim15_harmonic 4.4s ease-in-out infinite; }

        /* Chapter 16: Playful 2% brain giggly shake */
        @keyframes chAnim16_giggly {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-8deg) scale(1.05); }
          50% { transform: rotate(6deg) scale(0.98); }
          75% { transform: rotate(-5deg) scale(1.04); }
        }
        .anim-ch-16 { animation: chAnim16_giggly 2.5s ease-in-out infinite; }

        /* Chapter 17: Joyous birthday celebration spiral */
        @keyframes chAnim17_celebrate {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          35% { transform: translateY(-10px) rotate(-7deg) scale(1.12); }
          70% { transform: translateY(2px) rotate(5deg) scale(0.98); }
        }
        .anim-ch-17 { animation: chAnim17_celebrate 2.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }


        /* CRUMPLED LETTER UNCRUMPLE / CRUMBLE ANIMATIONS */
        @keyframes uncrumpleLetter {
          0% {
            transform: scale(0.66) rotate(-7deg) skew(7deg);
            filter: contrast(140%) brightness(0.92) drop-shadow(0 18px 22px rgba(0,0,0,0.5));
            border-radius: 24px;
          }
          35% {
            transform: scale(0.86) rotate(3deg) skew(-3deg);
            filter: contrast(120%) brightness(0.96) drop-shadow(0 12px 16px rgba(0,0,0,0.35));
            border-radius: 12px;
          }
          70% {
            transform: scale(1.02) rotate(-1deg) skew(1deg);
            border-radius: 5px;
          }
          100% {
            transform: scale(1) rotate(0deg) skew(0deg);
            filter: contrast(100%) brightness(1) drop-shadow(3px 8px 22px rgba(0,0,0,0.3));
            border-radius: 3px;
          }
        }

        @keyframes crumbleLetter {
          0% {
            transform: scale(1) rotate(0deg) skew(0deg);
            filter: contrast(100%) brightness(1) drop-shadow(3px 8px 22px rgba(0,0,0,0.3));
            border-radius: 3px;
          }
          35% {
            transform: scale(0.9) rotate(-3deg) skew(3deg);
            filter: contrast(118%) brightness(0.97) drop-shadow(0 10px 15px rgba(0,0,0,0.35));
            border-radius: 10px;
          }
          100% {
            transform: scale(0.65) rotate(8deg) skew(-7deg);
            filter: contrast(145%) brightness(0.9) drop-shadow(0 20px 25px rgba(0,0,0,0.55));
            border-radius: 24px;
          }
        }

        @keyframes spinReelR { to { transform: rotate(-360deg); } }

        /* TRAIN MARQUEE ON HOVER FOR TABS */
        @keyframes trainMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .tab-train-viewport {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }

        .tab-item:hover .tab-train-scroll {
          animation: trainMarquee 3.5s linear infinite;
        }

        .side-tab-pill {
          transition: width 0.26s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.2s ease, transform 0.2s ease;
        }
        .side-tab-pill:hover {
          width: 145px !important;
          background: linear-gradient(to right, #fffdf2, #f5ebd0) !important;
          box-shadow: 6px 3px 14px rgba(0,0,0,0.5) !important;
          z-index: 50 !important;
        }
        .side-tab-pill:hover .tab-train-scroll {
          animation: trainMarquee 3.2s linear infinite;
        }

        @keyframes openBookSpread {
          0% {
            transform: scale(0.96);
            opacity: 0.85;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .open-book-spread {
          animation: openBookSpread 0.36s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* ══════════════════════════════════════════════════
           CONTINUOUS STAR ROTATION ANIMATIONS
        ══════════════════════════════════════════════════ */
        @keyframes rotateStarClockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes rotateStarCounter {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        /* ══════════════════════════════════════════════════
           REALISTIC 3D PAGE FLIP: FORWARD (Right to Left: 0deg to -180deg)
           Paper flexes with realistic skew & scale during turnover
        ══════════════════════════════════════════════════ */
        @keyframes realisticPageFlipFwd {
          0% {
            transform: rotateY(0deg) skewY(0deg) scaleX(1);
            box-shadow: 0 4px 15px rgba(0,0,0,0.18);
          }
          26% {
            transform: rotateY(-48deg) skewY(2.2deg) scaleX(0.96);
            box-shadow: -16px 12px 35px rgba(0,0,0,0.36);
          }
          60% {
            transform: rotateY(-112deg) skewY(-2.2deg) scaleX(0.96);
            box-shadow: -28px 18px 45px rgba(0,0,0,0.42);
          }
          85% {
            transform: rotateY(-164deg) skewY(-0.8deg) scaleX(0.99);
            box-shadow: -12px 8px 25px rgba(0,0,0,0.25);
          }
          100% {
            transform: rotateY(-180deg) skewY(0deg) scaleX(1);
            box-shadow: -4px 4px 12px rgba(0,0,0,0.18);
          }
        }

        /* ══════════════════════════════════════════════════
           REALISTIC 3D PAGE FLIP: BACKWARD (Left to Right: -180deg to 0deg)
        ══════════════════════════════════════════════════ */
        @keyframes realisticPageFlipBwd {
          0% {
            transform: rotateY(-180deg) skewY(0deg) scaleX(1);
            box-shadow: -4px 4px 12px rgba(0,0,0,0.18);
          }
          26% {
            transform: rotateY(-132deg) skewY(-2.2deg) scaleX(0.96);
            box-shadow: -28px 18px 45px rgba(0,0,0,0.42);
          }
          60% {
            transform: rotateY(-68deg) skewY(2.2deg) scaleX(0.96);
            box-shadow: 16px 12px 35px rgba(0,0,0,0.36);
          }
          85% {
            transform: rotateY(-16deg) skewY(0.8deg) scaleX(0.99);
            box-shadow: 12px 8px 25px rgba(0,0,0,0.25);
          }
          100% {
            transform: rotateY(0deg) skewY(0deg) scaleX(1);
            box-shadow: 0 4px 15px rgba(0,0,0,0.18);
          }
        }

        /* Dynamic shading for front face turning forward */
        @keyframes frontShadingFwd {
          0% { opacity: 0; }
          45% { opacity: 0.5; }
          100% { opacity: 0.7; }
        }

        /* Dynamic shading for back face turning forward */
        @keyframes backShadingFwd {
          0% { opacity: 0.65; }
          55% { opacity: 0.35; }
          100% { opacity: 0; }
        }

        /* Dynamic shading for back face turning backward */
        @keyframes backShadingBwd {
          0% { opacity: 0; }
          45% { opacity: 0.5; }
          100% { opacity: 0.7; }
        }

        /* Dynamic shading for front face turning backward */
        @keyframes frontShadingBwd {
          0% { opacity: 0.65; }
          55% { opacity: 0.35; }
          100% { opacity: 0; }
        }

        /* Front Cover opening 3D - Fast & Snappy */
        .cover-open-anim {
          transform-origin: left center;
          transform-style: preserve-3d;
          animation: openFrontCover 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes openFrontCover {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); }
        }

        /* Smooth centering of closing book into dead-center of desk */
        .book-close-container-anim {
          animation: centerClosingBook 0.42s cubic-bezier(0.35, 0, 0.25, 1) forwards;
        }
        @keyframes centerClosingBook {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(25%);
          }
        }

        /* "lagna chahiye book band hui h" — Physical 3D Book Closing Shut */
        .book-shut-anim {
          transform-origin: left center;
          transform-style: preserve-3d;
          animation: bookSlamShut 0.42s cubic-bezier(0.5, 0, 0.3, 1) forwards;
        }
        @keyframes bookSlamShut {
          0% {
            transform: rotateY(0deg);
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          }
          40% {
            transform: rotateY(-75deg) scale(1.02);
            box-shadow: -25px 20px 60px rgba(0,0,0,0.65);
          }
          75% {
            transform: rotateY(-145deg) scale(1.01);
            box-shadow: -35px 25px 75px rgba(0,0,0,0.75);
          }
          92% {
            transform: rotateY(-181deg) scale(0.995);
            box-shadow: -10px 15px 50px rgba(0,0,0,0.85);
          }
          100% {
            transform: rotateY(-180deg);
            box-shadow: -8px 25px 70px rgba(0,0,0,0.85);
          }
        }

        /* ══════════════════════════════════════════════════
           CRUMPLED PAPER REALISTIC UNCRUMPLE & CRUMPLE
           Transforms between tight 3D paper ball & flat sheet
        ══════════════════════════════════════════════════ */
        @keyframes uncrumpleLetterRealistic {
          0% {
            transform: scale(0.2) rotate(-22deg) skew(12deg, -8deg);
            opacity: 0.15;
            clip-path: polygon(32% 4%, 68% 2%, 96% 32%, 92% 76%, 66% 98%, 24% 94%, 4% 64%, 8% 26%);
            box-shadow: 0 24px 38px rgba(0,0,0,0.7), inset 0 0 35px rgba(0,0,0,0.5);
            border-radius: 44px;
            filter: brightness(0.85) contrast(140%);
          }
          24% {
            transform: scale(0.42) rotate(14deg) skew(-6deg, 6deg);
            opacity: 0.85;
            clip-path: polygon(18% 2%, 84% 4%, 98% 40%, 90% 86%, 56% 98%, 14% 92%, 2% 54%, 6% 16%);
            box-shadow: 0 20px 30px rgba(0,0,0,0.55), inset 0 0 25px rgba(0,0,0,0.38);
            border-radius: 22px;
            filter: brightness(0.92) contrast(125%);
          }
          50% {
            transform: scale(0.74) rotate(-5deg) skew(3deg, -2deg);
            opacity: 0.95;
            clip-path: polygon(6% 0%, 94% 2%, 100% 65%, 96% 96%, 42% 100%, 4% 95%, 0% 42%, 2% 6%);
            box-shadow: 0 14px 24px rgba(0,0,0,0.4), inset 0 0 18px rgba(0,0,0,0.22);
            border-radius: 10px;
            filter: brightness(0.96) contrast(112%);
          }
          74% {
            transform: scale(1.05) rotate(1.8deg) skew(-1deg, 1deg);
            opacity: 1;
            clip-path: polygon(1% 0%, 99% 0%, 100% 92%, 99% 99%, 20% 100%, 0% 98%, 0% 12%, 1% 1%);
            box-shadow: 3px 12px 26px rgba(0,0,0,0.34), inset 0 0 10px rgba(220,195,155,0.3);
            border-radius: 4px;
            filter: brightness(1) contrast(105%);
          }
          88% {
            transform: scale(0.99) rotate(-0.5deg);
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
            box-shadow: 3px 9px 22px rgba(0,0,0,0.28);
            border-radius: 3px;
            filter: brightness(1) contrast(100%);
          }
          100% {
            transform: scale(1) rotate(0deg);
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
            box-shadow: 3px 8px 22px rgba(0,0,0,0.28), 0 2px 5px rgba(0,0,0,0.15), inset 0 0 15px rgba(220,195,155,0.25);
            border-radius: 3px;
            filter: brightness(1) contrast(100%);
          }
        }

        @keyframes crumpleLetterRealistic {
          0% {
            transform: scale(1) rotate(0deg);
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
            box-shadow: 3px 8px 22px rgba(0,0,0,0.28);
            border-radius: 3px;
          }
          30% {
            transform: scale(0.82) rotate(-5deg) skew(3deg, -3deg);
            clip-path: polygon(6% 0%, 94% 2%, 100% 65%, 96% 96%, 42% 100%, 4% 95%, 0% 42%, 2% 6%);
            border-radius: 12px;
          }
          65% {
            transform: scale(0.44) rotate(16deg) skew(-7deg, 6deg);
            clip-path: polygon(18% 2%, 84% 4%, 98% 40%, 90% 86%, 56% 98%, 14% 92%, 2% 54%, 6% 16%);
            border-radius: 26px;
          }
          100% {
            transform: scale(0.2) rotate(-22deg) skew(12deg, -8deg);
            opacity: 0.15;
            clip-path: polygon(32% 4%, 68% 2%, 96% 32%, 92% 76%, 66% 98%, 24% 94%, 4% 64%, 8% 26%);
            box-shadow: 0 24px 38px rgba(0,0,0,0.7), inset 0 0 35px rgba(0,0,0,0.5);
            border-radius: 44px;
          }
        }

        @keyframes ballUncrumpleOverlay {
          0% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 14px 20px rgba(0,0,0,0.75));
          }
          28% {
            opacity: 0.95;
            transform: scale(1.15) rotate(18deg);
            filter: drop-shadow(0 18px 25px rgba(0,0,0,0.6));
          }
          55% {
            opacity: 0.45;
            transform: scale(1.45) rotate(-10deg);
          }
          80% {
            opacity: 0.1;
            transform: scale(1.8) rotate(20deg);
          }
          100% {
            opacity: 0;
            transform: scale(2.1) rotate(35deg);
            pointer-events: none;
          }
        }

        @keyframes ballCrumpleOverlay {
          0% {
            opacity: 0;
            transform: scale(2.1) rotate(35deg);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.35) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 14px 20px rgba(0,0,0,0.75));
          }
        }

        @keyframes textUncrumpleFade {
          0%, 30% {
            opacity: 0;
            filter: blur(4px);
            transform: scale(0.88);
          }
          60% {
            opacity: 0.6;
            filter: blur(1.5px);
            transform: scale(0.96);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
          }
        }

        @keyframes tapePopIn {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.6);
          }
          70% {
            opacity: 0.95;
            transform: translateY(1px) scale(1.08);
          }
          100% {
            opacity: 0.88;
            transform: translateY(0) scale(1);
          }
        }

        /* ══════════════════════════════════════════════════
           REVERSE BOOK OPENING: BACK COVER SWINGS OPEN IN 3D
        ══════════════════════════════════════════════════ */
        .book-open-back-anim {
          transform-origin: left center;
          transform-style: preserve-3d;
          animation: bookSwingOpenBack 0.75s cubic-bezier(0.25, 1, 0.4, 1) forwards;
        }

        @keyframes bookSwingOpenBack {
          0% {
            transform: rotateY(-180deg);
            box-shadow: -8px 25px 70px rgba(0,0,0,0.85);
          }
          18% {
            transform: rotateY(-165deg) scale(1.015);
            box-shadow: -25px 25px 65px rgba(0,0,0,0.75);
          }
          48% {
            transform: rotateY(-95deg) scale(1.02);
            box-shadow: -38px 22px 60px rgba(0,0,0,0.6);
          }
          78% {
            transform: rotateY(-22deg) scale(1.01);
            box-shadow: -15px 15px 40px rgba(0,0,0,0.45);
          }
          92% {
            transform: rotateY(3deg) scale(0.998);
            box-shadow: 0 12px 35px rgba(0,0,0,0.38);
          }
          100% {
            transform: rotateY(0deg) scale(1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.35);
          }
        }
      `}</style>

      {/* Expanded folded paper modal */}
      {expandedPaper && (
        <ExpandedPaperModal paper={expandedPaper} onClose={() => setExpandedPaper(null)} />
      )}

      <div
        style={{
          minHeight: "100vh",
          background: `
            repeating-linear-gradient(92deg, rgba(60,30,10,0.04) 0px, rgba(60,30,10,0.04) 1px, transparent 1px, transparent 14px),
            repeating-linear-gradient(88deg, rgba(40,20,5,0.05) 0px, rgba(40,20,5,0.05) 2px, transparent 2px, transparent 35px),
            linear-gradient(180deg, #8B6035 0%, #7a5228 12%, #9a6a3a 25%, #8a5c2e 38%, #a07040 50%, #8c6232 62%, #9a6a3c 75%, #7e5028 88%, #8a5e32 100%)
          `,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {/* Top Navbar */}
        <nav
          style={{
            width: "100%",
            padding: "10px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 30,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)",
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span
              onClick={() => setBookMode("front_cover")}
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "1rem",
                color: bookMode === "front_cover" ? "#FFD700" : "rgba(245,230,180,0.75)",
                cursor: "pointer",
              }}
            >
              📕 Front Cover
            </span>
            <span
              onClick={() => setBookMode("back_cover")}
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "1rem",
                color: bookMode === "back_cover" ? "#FFD700" : "rgba(245,230,180,0.75)",
                cursor: "pointer",
              }}
            >
              📑 Back Cover (Tracklist)
            </span>
            <span
              onClick={() => setBookMode("open_book")}
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "1rem",
                color: bookMode === "open_book" ? "#FFD700" : "rgba(245,230,180,0.75)",
                cursor: "pointer",
              }}
            >
              📖 Open Book
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Permanent Marker',cursive",
              color: "#f5e8c8",
              fontSize: "clamp(0.8rem, 2vw, 1.15rem)",
              letterSpacing: "0.35em",
              textShadow: "0 2px 6px rgba(0,0,0,0.5)",
              margin: 0,
            }}
          >
            T H I N G S &nbsp; I &nbsp; N E V E R &nbsp; S A I D
          </h1>

          <button
            onClick={onEnter}
            style={{
              padding: "4px 14px",
              background: "#6B0F0F",
              border: "1px solid #c4511a",
              color: "#f5e8c8",
              borderRadius: "999px",
              fontFamily: "'Caveat', cursive",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Scrapbook Wall 💌
          </button>
        </nav>

        {/* ── MAIN SCENE CONTAINER ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 16px",
            width: "100%",
            maxWidth: "1040px",
            position: "relative",
          }}
        >
          {/* ══════════════════════════════════════
              STAGE 1: FRONT COVER ON TABLE WITH TAP TO START SIGN
          ══════════════════════════════════════ */}
          {bookMode === "front_cover" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                cursor: "pointer",
              }}
              onClick={handleTapToOpen}
            >
              <FrontCoverView onOpenBook={handleTapToOpen} />

              {/* Tap to open sign indicator */}
              
            </div>
          )}

          {/* ══════════════════════════════════════
              STAGE 2: INTRO OPENING (COVER SWINGS OPEN IN 3D)
          ══════════════════════════════════════ */}
          {bookMode === "intro_open" && (
            <div
              style={{
                perspective: "2600px",
                width: "min(1000px, 95vw)",
                height: "clamp(620px, 80vh, 760px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.75)",
                  borderRadius: "6px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Left Page underneath */}
                <div style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", borderRadius: "6px 0 0 6px", overflow: "hidden" }}>
                  <LeftPageContent
                    chapter={CHAPTERS[0]}
                    phase="idle"
                    currentIdx={0}
                    onSelectChapter={handleSelectChapter}
                    onOpenIndex={handleOpenIndex}
                    onExpandPaper={setExpandedPaper}
                  />
                </div>

                {/* Center Spine Seam */}
                <div
                  style={{
                    position: "absolute",
                    left: "calc(50% - 6px)",
                    top: 0,
                    width: 12,
                    height: "100%",
                    zIndex: 40,
                    pointerEvents: "none",
                    background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.06) 40%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.06) 60%, rgba(0,0,0,0.3) 100%)",
                  }}
                />

                {/* Right Page underneath */}
                <div style={{ position: "absolute", left: "50%", top: 0, width: "50%", height: "100%", borderRadius: "0 6px 6px 0", overflow: "hidden" }}>
                  <RightPageContent
                    chapter={CHAPTERS[0]}
                    isPlaying={false}
                    onPrev={() => {}}
                    onStop={() => {}}
                    onNext={() => {}}
                    onExpandPaper={setExpandedPaper}
                  />
                </div>

                {/* Cover swinging open to left in 3D */}
                <div
                  className="cover-open-anim"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: "50%",
                    zIndex: 60,
                    borderRadius: "0 6px 6px 0",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <FrontCoverView onOpenBook={() => {}} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderRadius: "6px 0 0 6px",
                      overflow: "hidden",
                    }}
                  >
                    <LeftPageContent
                      chapter={CHAPTERS[0]}
                      phase="idle"
                      currentIdx={0}
                      onSelectChapter={handleSelectChapter}
                      onOpenIndex={handleOpenIndex}
                      onExpandPaper={setExpandedPaper}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              STAGE 3: RAPID 3D PAGES VISIBLY FLIPPING IN SEQUENCE
              Realistic physical page turns through all chapters 1-11
          ══════════════════════════════════════ */}
          {bookMode === "intro_flip" && (
            <div
              style={{
                perspective: "2600px",
                width: "min(1000px, 95vw)",
                height: "clamp(620px, 80vh, 760px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.75)",
                  borderRadius: "6px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* LEFT BASE: Shows current chapter left page */}
                <div style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", borderRadius: "6px 0 0 6px", overflow: "hidden" }}>
                  <LeftPageContent
                    chapter={CHAPTERS[introStep]}
                    phase="idle"
                    currentIdx={introStep}
                    onSelectChapter={handleSelectChapter}
                    onOpenIndex={handleOpenIndex}
                    onExpandPaper={setExpandedPaper}
                  />
                </div>

                {/* CENTER SPINE SEAM */}
                <div
                  style={{
                    position: "absolute",
                    left: "calc(50% - 6px)",
                    top: 0,
                    width: 12,
                    height: "100%",
                    zIndex: 40,
                    pointerEvents: "none",
                    background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.06) 40%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.06) 60%, rgba(0,0,0,0.3) 100%)",
                  }}
                />

                {/* RIGHT BASE: Next chapter is already waiting underneath! */}
                <div style={{ position: "absolute", left: "50%", top: 0, width: "50%", height: "100%", borderRadius: "0 6px 6px 0", overflow: "hidden" }}>
                  <RightPageContent
                    chapter={CHAPTERS[Math.min(introStep + 1, CHAPTERS.length - 1)]}
                    isPlaying={false}
                    onPrev={() => {}}
                    onStop={() => {}}
                    onNext={() => {}}
                  />
                </div>

                {/* AUTHENTIC 3D FLIPPING LEAF (Flips pages AND the final cover flips over just like a page!) */}
                <div
                  key={`intro-leaf-${introStep}`}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    width: "50%",
                    height: "100%",
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                    zIndex: 50,
                    pointerEvents: "none",
                    animation: introStep < CHAPTERS.length - 1
                      ? "realisticPageFlipFwd 0.08s linear forwards"
                      : "realisticPageFlipFwd 0.16s cubic-bezier(0.38, 0, 0.22, 1) forwards",
                  }}
                >
                  {/* Front of leaf: current chapter right page */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      borderRadius: "0 6px 6px 0",
                      overflow: "hidden",
                      transform: "rotateY(0deg)",
                    }}
                  >
                    <RightPageContent
                      chapter={CHAPTERS[introStep]}
                      isPlaying={false}
                      onPrev={() => {}}
                      onStop={() => {}}
                      onNext={() => {}}
                    />
                    {/* Dynamic shading */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 60%)",
                        animation: "frontShadingFwd 0.08s ease-in forwards",
                      }}
                    />
                  </div>

                  {/* Back of leaf: next chapter left page OR THE AUTHENTIC BACK COVER! */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      borderRadius: "6px 0 0 6px",
                      overflow: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: introStep >= CHAPTERS.length - 1 ? "0 25px 70px rgba(0,0,0,0.85)" : undefined,
                    }}
                  >
                    {introStep < CHAPTERS.length - 1 ? (
                      <LeftPageContent
                        chapter={CHAPTERS[introStep + 1]}
                        phase="idle"
                        currentIdx={introStep + 1}
                        onSelectChapter={() => {}}
                        onOpenIndex={() => {}}
                        onExpandPaper={() => {}}
                      />
                    ) : (
                      <BackCoverBookCard
                        isClosingCover={true}
                        onSelectTrack={handleSelectChapter}
                        onViewFront={() => setBookMode("front_cover")}
                      />
                    )}
                    {/* Dynamic shading */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background: "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 60%)",
                        animation: "backShadingFwd 0.08s ease-out forwards",
                      }}
                    />
                  </div>
                </div>

                {/* Side Tabs visible on right edge */}
                <SideTabs
                  currentIdx={introStep}
                  onSelectChapter={handleSelectChapter}
                  onOpenIndex={handleOpenIndex}
                />
              </div>

              {/* Status indicator */}
              <div
                style={{
                  position: "absolute",
                  bottom: -32,
                  fontFamily: "'Caveat', cursive",
                  color: "#FFD700",
                  fontSize: "1.1rem",
                }}
              >
                Flipping page: Track {CHAPTERS[introStep].trackNum} ➔ Track {CHAPTERS[Math.min(introStep + 1, CHAPTERS.length - 1)].trackNum} ({CHAPTERS[Math.min(introStep + 1, CHAPTERS.length - 1)].title})...
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              STAGE 5: EXACT REPLICA OF THE BACK OF THE BOOK
          ══════════════════════════════════════ */}
          {bookMode === "back_cover" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", position: "relative" }}>
              {/* Subtle top floating notification message */}
             

              <AuthenticBackCover
                onSelectTrack={(id) => handleSelectChapter(id)}
                onReplayIntro={startIntro}
                onViewFront={() => setBookMode("front_cover")}
              />
            </div>
          )}

          {/* ══════════════════════════════════════
              STAGE 6: TALL OPEN BOOK (Normal reading with authentic 3D page flips)
          ══════════════════════════════════════ */}
          {bookMode === "open_book" && (
            <div
              className="open-book-spread"
              style={{
                perspective: "2600px",
                width: "min(1000px, 95vw)",
                height: "clamp(620px, 80vh, 760px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Luxury fountain pen lying on the left desk */}
              <div
                style={{
                  position: "absolute",
                  left: "max(-55px, calc(50% - 550px))",
                  top: 32,
                  width: 210,
                  transform: "rotate(-38deg)",
                  zIndex: 25,
                  pointerEvents: "none",
                  filter: "drop-shadow(6px 14px 18px rgba(0,0,0,0.65))",
                }}
              >
                <svg viewBox="0 0 240 24" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="0,12 28,6 28,18" fill="#d4af37" />
                  <polygon points="0,12 8,10 8,14" fill="#333" />
                  <rect x="28" y="7" width="12" height="10" rx="1" fill="#c8a830" />
                  <rect x="40" y="7.5" width="170" height="9" rx="3" fill="#1a1a1a" />
                  <rect x="65" y="4" width="75" height="2.5" rx="1" fill="#c8a830" />
                  <rect x="180" y="7" width="8" height="10" fill="#c8a830" />
                  <rect x="188" y="7.5" width="36" height="9" rx="2" fill="#222" />
                </svg>
              </div>

              {/* Faint desk release date text */}
              <div
                style={{
                  position: "absolute",
                  left: "max(8px, calc(50% - 540px))",
                  top: "36%",
                  writingMode: "vertical-rl",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.24em",
                  color: "rgba(255,255,255,0.24)",
                  pointerEvents: "none",
                }}
              >
                2023.09.03 RELEASE
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.75), 0 8px 24px rgba(0,0,0,0.5)",
                  borderRadius: "6px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* LEFT BASE PAGE */}
                <div style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", borderRadius: "6px 0 0 6px", overflow: "hidden" }}>
                  <LeftPageContent
                    chapter={
                      isFlipping && flipState
                        ? flipState.dir === "forward"
                          ? CHAPTERS[flipState.fromIdx]
                          : CHAPTERS[flipState.toIdx]
                        : currentChapter
                    }
                    phase="idle"
                    currentIdx={currentIdx}
                    isFlipping={isFlipping}
                    onSelectChapter={handleSelectChapter}
                    onOpenIndex={handleOpenIndex}
                    onExpandPaper={setExpandedPaper}
                  />
                </div>

                {/* CENTER SPINE SEAM */}
                <div
                  style={{
                    position: "absolute",
                    left: "calc(50% - 6px)",
                    top: 0,
                    width: 12,
                    height: "100%",
                    zIndex: 40,
                    pointerEvents: "none",
                    background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.06) 40%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.06) 60%, rgba(0,0,0,0.3) 100%)",
                  }}
                />

                {/* RIGHT BASE PAGE */}
                <div style={{ position: "absolute", left: "50%", top: 0, width: "50%", height: "100%", borderRadius: "0 6px 6px 0", overflow: "hidden" }}>
                  <RightPageContent
                    chapter={
                      isFlipping && flipState
                        ? flipState.dir === "forward"
                          ? CHAPTERS[flipState.toIdx]
                          : CHAPTERS[flipState.fromIdx]
                        : currentChapter
                    }
                    isPlaying={isPlaying}
                    isFlipping={isFlipping}
                    onPrev={() => {
                      setIsPlaying(true);
                      handleSelectChapter(Math.max(0, currentIdx - 1));
                    }}
                    onStop={() => setIsPlaying((prev) => !prev)}
                    onNext={() => {
                      setIsPlaying(true);
                      handleSelectChapter(Math.min(CHAPTERS.length - 1, currentIdx + 1));
                    }}
                    onTogglePlay={() => setIsPlaying((prev) => !prev)}
                    onExpandPaper={setExpandedPaper}
                  />
                </div>

                {/* ═══ 3D FLIPPING PAGE ON TAB SELECTION ═══ */}
                {isFlipping && flipState && (
                  <div
                    key={`flip-${flipState.fromIdx}-${flipState.toIdx}-${flipState.dir}`}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      width: "50%",
                      height: "100%",
                      transformOrigin: "left center",
                      transformStyle: "preserve-3d",
                      zIndex: 50,
                      pointerEvents: "none",
                      animation:
                        flipState.dir === "forward"
                          ? "realisticPageFlipFwd 0.44s cubic-bezier(0.38, 0, 0.22, 1) forwards"
                          : "realisticPageFlipBwd 0.44s cubic-bezier(0.38, 0, 0.22, 1) forwards",
                    }}
                  >
                    {/* Front of leaf: facing right */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        borderRadius: "0 6px 6px 0",
                        overflow: "hidden",
                        transform: "rotateY(0deg)",
                      }}
                    >
                      <RightPageContent
                        chapter={
                          flipState.dir === "forward"
                            ? CHAPTERS[flipState.fromIdx]
                            : CHAPTERS[flipState.toIdx]
                        }
                        isPlaying={false}
                        isFlipping={true}
                        onPrev={() => {}}
                        onStop={() => {}}
                        onNext={() => {}}
                      />
                      {/* Dynamic shading */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 60%)",
                          animation:
                            flipState.dir === "forward"
                              ? "frontShadingFwd 0.44s ease-in forwards"
                              : "frontShadingBwd 0.44s ease-out forwards",
                        }}
                      />
                    </div>

                    {/* Back of leaf: facing left */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        borderRadius: "6px 0 0 6px",
                        overflow: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <LeftPageContent
                        chapter={
                          flipState.dir === "forward"
                            ? CHAPTERS[flipState.toIdx]
                            : CHAPTERS[flipState.fromIdx]
                        }
                        phase="idle"
                        currentIdx={flipState.toIdx}
                        isFlipping={true}
                        onSelectChapter={() => {}}
                        onOpenIndex={() => {}}
                        onExpandPaper={() => {}}
                      />
                      {/* Dynamic shading */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          background: "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 60%)",
                          animation:
                            flipState.dir === "forward"
                              ? "backShadingFwd 0.44s ease-out forwards"
                              : "backShadingBwd 0.44s ease-in forwards",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* ═══ PROTRUDING INTERACTIVE SIDE TABS ON RIGHT EDGE ═══ */}
                <SideTabs
                  currentIdx={currentIdx}
                  onSelectChapter={handleSelectChapter}
                  onOpenIndex={handleOpenIndex}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div
          style={{
            width: "100%",
            padding: "8px 32px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 30,
            background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)",
          }}
        >
          <span style={{ fontFamily: "'Kalam', cursive", color: "rgba(245,232,200,0.75)", fontSize: "0.74rem" }}>
            {bookMode === "open_book"
              ? `Currently reading: Track ${currentChapter.trackNum} — ${currentChapter.title} • Hover tabs on left to see full titles`
              : "Things I Never Said — Interactive Scrapbook & Diary"}
          </span>
          <button
            onClick={() => setBookMode("back_cover")}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,200,100,0.4)",
              color: "#f5e8c8",
              borderRadius: "999px",
              padding: "2px 12px",
              fontFamily: "'Caveat', cursive",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            📑 View Back Cover (Tracklist)
          </button>
        </div>
      </div>

      {/* Background YouTube Audio Player */}
      <YouTubeAudioPlayer isPlaying={isPlaying} />
      <UncrumpleAudioPlayer />

      {/* Floating Background Music Control Badge */}
      <div
        onClick={() => setIsPlaying((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: 18,
          right: 20,
          zIndex: 100,
          background: isPlaying
            ? "linear-gradient(135deg, rgba(20,60,35,0.94) 0%, rgba(10,35,18,0.96) 100%)"
            : "linear-gradient(135deg, rgba(45,20,20,0.94) 0%, rgba(20,10,10,0.96) 100%)",
          border: isPlaying ? "1.5px solid #00ff88" : "1.5px solid rgba(255,100,100,0.6)",
          boxShadow: isPlaying ? "0 0 15px rgba(0,255,136,0.45), 0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.5)",
          borderRadius: "999px",
          padding: "6px 16px",
          color: "#fff",
          fontFamily: "'Caveat', cursive",
          fontSize: "0.95rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          userSelect: "none",
          transition: "all 0.2s ease",
        }}
        title={isPlaying ? "Click to Pause Music" : "Click to Play Music"}
      >
        <span style={{ fontSize: "1.1rem" }}>{isPlaying ? "🎵" : "🔇"}</span>
        <span>{isPlaying ? "Background Music Playing" : "Music Paused"}</span>
        <span
          style={{
            fontSize: "0.75rem",
            background: "rgba(255,255,255,0.2)",
            padding: "2px 8px",
            borderRadius: 4,
            fontFamily: "monospace",
            letterSpacing: "0.05em",
          }}
        >
          {isPlaying ? "PAUSE ❚❚" : "PLAY ►"}
        </span>
      </div>
    </>
  );
}
