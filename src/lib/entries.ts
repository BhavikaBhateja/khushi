export interface Entry {
  id: string;
  title: string;
  body: string;
  date: string;
  mood: string;
  color: string;
  rotate: number;
  tape: string;
}

export const INITIAL_ENTRIES: Entry[] = [
  {
    id: "1",
    title: "Happy Birthday 🎂",
    body: "I never told you how much you mean to me. I hope this birthday brings you all the joy you quietly give everyone else.",
    date: "Sept 24, 2026",
    mood: "🥰",
    color: "#fff9f0",
    rotate: -1.5,
    tape: "rgba(255,200,100,0.55)",
  },
  {
    id: "2",
    title: "The Thing About You",
    body: "You always know when somebody is low without them saying a word. That's a superpower, you know. I've noticed. I've always noticed.",
    date: "Sept 24, 2026",
    mood: "🌟",
    color: "#f0fff4",
    rotate: 1.2,
    tape: "rgba(150,200,255,0.5)",
  },
  {
    id: "3",
    title: "I Should've Said This Sooner",
    body: "Thank you. For being patient with me. For showing up even when it was hard. I never said it enough — thank you.",
    date: "Sept 24, 2026",
    mood: "🙏",
    color: "#fff0f5",
    rotate: -0.8,
    tape: "rgba(255,180,200,0.55)",
  },
  {
    id: "4",
    title: "One More Thing ❤️",
    body: " I'm glad you exist. Genuinely, deeply glad.Love you bitch",
    date: "Sept 24, 2026",
    mood: "💖",
    color: "#fffdf0",
    rotate: 2.1,
    tape: "rgba(255,220,80,0.5)",
  },
];
