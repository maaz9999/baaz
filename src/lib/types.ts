export type GameSlug = "tekken-7" | "tekken-8" | "kof-xv" | "sf-6" | "fatal-fury" | "fc-26";

export type Game = {
  slug: GameSlug;
  name: string;
  short: string;
  publisher: string;
};

export type SponsorTier = "title" | "gold" | "silver" | "partner" | "broadcast" | "team";

export type Sponsor = {
  slug: string;
  name: string;
  tier: SponsorTier;
  url?: string;
  logoLight?: string;
  logoDark?: string;
};

export type Player = {
  tag: string;
  slug: string;
  realName?: string;
  country: string;
  team?: string;
  mains?: Partial<Record<GameSlug, string[]>>;
  photo?: string;
};

export type Placement =
  | "1st"
  | "2nd"
  | "3rd"
  | "4th"
  | "5th-6th"
  | "7th-8th";

export type TournamentEntry = {
  player: string; // player tag
  placement: Placement;
  prize?: string;
  team?: string;
  characters?: string[];
  points?: number | string;
};

export type EventStatus = "past" | "upcoming" | "live";

export type BaazEvent = {
  slug: string;
  name: string;
  edition: string;
  status: EventStatus;
  startDate: string; // ISO
  endDate: string;
  venue: string;
  city: string;
  country: string;
  prizePool: { pkr?: number; usd?: number; display: string };
  games: GameSlug[];
  participants?: number;
  format: string;
  tier?: string;
  organizer: string;
  sponsors: string[]; // sponsor slugs
  broadcastTalent?: string[];
  liquipedia?: string;
  startggEventId?: string;
  poster?: string;
  tagline?: string;
  top8?: Partial<Record<GameSlug, TournamentEntry[]>>;
  registrationClosed?: boolean;
  registrationUrl?: string;
};

export type CircuitSlotType =
  | "stage-winner"
  | "takedown-winner"
  | "lcq-winner"
  | "points-leader"
  | "wild-card";

export type CircuitSlot = {
  slotNumber: number;
  label: string;
  sublabel: string;
  type: CircuitSlotType;
  filledBy?: string; // player tag
};

export type Circuit = {
  slug: string;
  name: string;
  edition: string;
  game: GameSlug;
  status: EventStatus;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  tagline: string;
  prizePool?: { display: string };
  slots: CircuitSlot[];
  startggEventId?: string;
};
