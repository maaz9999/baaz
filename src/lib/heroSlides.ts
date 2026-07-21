export type HeroAccent = "neon" | "signal" | "blood";

export type HeroSlide = {
  id: string;
  accent: HeroAccent;
  eyebrow: string;
  meta: string;
  title: string[];
  description: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageKey?: string;
  imageUrl?: string;
  /** True when a portrait/poster image exists for this slide (wired up in Hero.tsx by id). */
  hasImage?: boolean;
  /** ISO datetime — when set, the slide renders a live countdown instead of static meta. */
  countdownTo?: string;
};

/**
 * NOTE: Danyal/ENC copy confirmed against public listings (Esports Nations Cup site,
 * Liquipedia). Takedown 2026 date (Sep 4-6) is sourced from third-party tournament
 * listings, not a BAAZ-issued announcement — confirm before this ships.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "enc-2026",
    accent: "neon",
    eyebrow: "NATIONAL TEAM · ESPORTS NATIONS CUP 2026",
    meta: "RIYADH, KSA · NOV 2026",
    title: ["DANYAL CHISHTY", "NAMED PAKISTAN'S", "NATIONAL TEAM MANAGER"],
    description:
      "BAAZ founder Danyal Chishty will lead Team Pakistan at the inaugural Esports Nations Cup — the country-based world championship hosted in Riyadh, Saudi Arabia this November.",
    cta: { label: "The Baaz story", href: "/about" },
    hasImage: true,
  },
  {
    id: "ptl-stage",
    accent: "signal",
    eyebrow: "PTL 2026 · REGULAR SEASON",
    meta: "APR — JUL '26 · LAHORE",
    title: ["FOUR STAGES.", "ONE CIRCUIT.", "EIGHT SLOTS."],
    description:
      "The Pakistan Tekken League's regular season runs four stages from April to July — every stage win punches a ticket to the national finale.",
    cta: { label: "Explore the circuit", href: "/ptl-2026" },
  },
  {
    id: "takedown-2026",
    accent: "blood",
    eyebrow: "TAKEDOWN 2026",
    meta: "LAHORE, PAKISTAN",
    title: ["THE BIGGEST", "TEKKEN OPEN", "PAKISTAN HAS SEEN"],
    description:
      "554 entrants broke the record in 2025. Takedown returns in 2026 as the defining stage of the national circuit — bigger field, bigger stakes.",
    cta: { label: "Save the date", href: "/events" },
    countdownTo: "2026-09-04T00:00:00+05:00",
  },
];
