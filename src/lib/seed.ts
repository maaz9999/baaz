/**
 * Seed data — sourced from Liquipedia. Used until Sanity is populated.
 */
import type { BaazEvent, Circuit, Game, Player, Sponsor } from "./types";

export const games: Game[] = [
  { slug: "tekken-7", name: "Tekken 7", short: "T7", publisher: "Bandai Namco" },
  { slug: "tekken-8", name: "Tekken 8", short: "T8", publisher: "Bandai Namco" },
  { slug: "kof-xv", name: "The King of Fighters XV", short: "KoF XV", publisher: "SNK" },
  { slug: "sf-6", name: "Street Fighter 6", short: "SF6", publisher: "Capcom" },
  { slug: "fatal-fury", name: "Fatal Fury: City of the Wolves", short: "FF COTW", publisher: "SNK" },
  { slug: "fc-26", name: "EA Sports FC 26", short: "FC26", publisher: "EA Sports" },
];

export const sponsors: Sponsor[] = [
  { slug: "fate", name: "FATE eSports", tier: "team", logoDark: "/assets/FATE.png" },
  { slug: "redbull", name: "Red Bull eSports", tier: "team", logoDark: "/assets/REDBULL.png" },
  { slug: "ashes", name: "Ashes Gaming", tier: "team", logoDark: "/assets/ASHES.png" },
  { slug: "m5host", name: "M5Host", tier: "team", logoDark: "/assets/M5 HOST.png" },
  { slug: "playbook", name: "PlayBook Esports", tier: "team", logoDark: "/assets/PBE.png" },
  { slug: "freecs", name: "Freecs", tier: "team", logoDark: "/assets/FREECS.png" },
  { slug: "pathan", name: "PATHAN ESPORTS", tier: "team", logoDark: "/assets/PATHAN.png" },
  { slug: "cyber-ninjas", name: "7 Cities", tier: "team", logoDark: "/assets/C7.png" },
  { slug: "venary", name: "Venary", tier: "team", logoDark: "/assets/VENARY.png" },
  { slug: "big", name: "BIG", tier: "team", logoDark: "/assets/BIG.png" },
  { slug: "team-falcons", name: "Team Falcons", tier: "team", logoDark: "/assets/FALCONS.png" },
  { slug: "twisted-minds", name: "Twisted Minds", tier: "team", logoDark: "/assets/TWISTED MINDS.png" },
  { slug: "al-qadsiah", name: "Al Qadsiah", tier: "team", logoDark: "/assets/QADSIAH.png" },
  { slug: "roc", name: "ROC Esports", tier: "team" },
  { slug: "r8", name: "R8 Esports", tier: "team", logoDark: "/assets/R8 ESPORTS.png" },
  { slug: "t1", name: "T1", tier: "team" },
  { slug: "nova", name: "Nova Esports", tier: "team" },
  { slug: "varrel", name: "VARREL", tier: "team" },
  { slug: "drx", name: "DRX", tier: "team", logoDark: "/assets/DRX.png" },
  { slug: "vitality", name: "Team Vitality", tier: "team" },
  { slug: "cloud9", name: "Cloud9", tier: "team", logoDark: "/assets/Cloud9.png" },
  { slug: "alliance", name: "Alliance", tier: "team", logoDark: "/assets/Alliance.png" },
  { slug: "ag", name: "AG", tier: "team", logoDark: "/assets/AG.png" },
  { slug: "vicious", name: "Vicious", tier: "team", logoDark: "/assets/VICIOUS.png" },
  { slug: "twitch", name: "Twitch", tier: "broadcast", url: "https://twitch.tv/baaz_gg" },
  { slug: "youtube", name: "YouTube", tier: "broadcast", url: "https://youtube.com/@baazgg" },
  { slug: "soop", name: "SOOP TEKKEN League", tier: "partner" },
];

export const players: Player[] = [
  { tag: "Arslan Ash", slug: "arslan-ash", realName: "Arslan Siddique", country: "PK", team: "twisted-minds", photo: "/assets/ARSLAN.png", mains: { "tekken-7": ["Zafina", "Kunimitsu"], "tekken-8": ["Nina", "Anna"] } },
  { tag: "ATIF", slug: "atif", realName: "Atif Butt", country: "PK", team: "team-falcons", photo: "/assets/ATIF.png", mains: { "tekken-7": ["Akuma", "Feng", "Jin"], "tekken-8": ["Dragunov", "Anna"] } },
  { tag: "Farzeen", slug: "farzeen", country: "PK", team: "team-falcons", photo: "/assets/FARZEEN.png", mains: { "tekken-7": ["Akuma"], "tekken-8": ["Lidia", "Victor"] } },
  { tag: "THE JON", slug: "the-jon", country: "PK", team: "al-qadsiah", photo: "/assets/JON.png", mains: { "tekken-8": ["King"] } },
  { tag: "Numan Ch", slug: "numan-ch", country: "PK", team: "team-falcons", photo: "/assets/NUMAN.png", mains: { "tekken-7": ["Steve"], "tekken-8": ["Steve", "Paul"] } },
  { tag: "Knee", slug: "knee", country: "KR", team: "drx", photo: "/assets/KNEE.png" },
  { tag: "Dawood Sikandar", slug: "dawood-sikandar", country: "PK", team: "m5host", photo: "/assets/DAWOOD.png", mains: { "tekken-7": ["Alisa", "Julia"], "tekken-8": ["Alisa"] } },
  { tag: "AK", slug: "ak", country: "PH", team: "playbook", mains: { "tekken-7": ["Akuma", "Shaheen"] } },
  { tag: "ULSAN", slug: "ulsan", country: "KR", team: "freecs", mains: { "tekken-7": ["Kazumi"] } },
  { tag: "Usama Abbasi", slug: "usama-abbasi", country: "PK", team: "roc", photo: "/assets/USAMA_SQUARE.png", mains: { "tekken-8": ["Eddy", "Asuka"] } },
  { tag: "Hafiz Tanveer", slug: "hafiz-tanveer", country: "PK", team: "twisted-minds", mains: { "tekken-8": ["Claudio", "Nina"] } },
  { tag: "Hafiz Adeel", slug: "hafiz-adeel", country: "PK", mains: { "tekken-8": ["Lars", "Nina"] } },
  { tag: "Ahsan Ali", slug: "ahsan-ali", country: "PK", mains: { "tekken-8": ["Shaheen", "King"] } },
  { tag: "JoKa", slug: "joka", country: "GB", team: "team-falcons", photo: "/assets/JOKA.png" },
  { tag: "M. Zubair", slug: "m-zubair", country: "PK", mains: { "tekken-8": ["Paul", "Dragunov"] } },
  { tag: "Mohsin Shooter", slug: "mohsin-shooter", country: "PK", mains: { "tekken-8": ["Nina", "Clive"] } },
  { tag: "Hafeez", slug: "hafeez", country: "PK", mains: { "tekken-8": ["Devil Jin", "Kazuya"] } },
  { tag: "Amar Xr", slug: "amar-xr", country: "PK", mains: { "tekken-8": ["King"] } },
  { tag: "Kami jones", slug: "kami-jones", country: "PK", team: "ashes" },
  { tag: "Hazz", slug: "hazz", country: "PK", team: "fate" },
  { tag: "Imran Champ", slug: "imran-champ", country: "PK" },
  { tag: "Xuni X", slug: "xuni-x", country: "PK" },
  { tag: "Baberzaki", slug: "baberzaki", country: "PK" },
  { tag: "Ahmer kyo", slug: "ahmer-kyo", country: "PK" },
  { tag: "Awais OP", slug: "awais-op", country: "PK" },
  { tag: "VincentBlade", slug: "vincentblade", country: "PK" },
  { tag: "Kashif yagami", slug: "kashif-yagami", country: "PK" },
  { tag: "NoMiiAegis", slug: "nomiiaegis", country: "PK" },
  { tag: "Heera", slug: "heera", realName: "Heera Malik", country: "PK", team: "ashes", mains: { "tekken-7": ["Steve", "Feng"], "tekken-8": ["Steve"] } },
  { tag: "Rangchu", slug: "rangchu", country: "KR", team: "varrel" },
  { tag: "CBM", slug: "cbm", realName: "CherryBerryMango", country: "KR", team: "freecs" },
  { tag: "JeonDDing", slug: "jeondding", country: "KR", team: "vitality" },
  { tag: "Mulgold", slug: "mulgold", country: "KR", team: "freecs", mains: { "tekken-8": ["Claudio", "Feng"] } },
  { tag: "Chanel", slug: "chanel", country: "KR", team: "drx" },
  { tag: "LowHigh", slug: "lowhigh", country: "KR", team: "drx" },
  { tag: "Muz", slug: "muz", country: "PK" },
  { tag: "FoulTOX", slug: "foultox", country: "PK" },
  { tag: "Geoffrey Mark", slug: "geoffrey-mark", country: "PK" },
  { tag: "Team Pakistan", slug: "team-pakistan", country: "PK" },
  { tag: "Team South Korea", slug: "team-south-korea", country: "KR" },
];

export const events: BaazEvent[] = [
  {
    slug: "takedown-2026",
    name: "TAKEDOWN 2026",
    edition: "2026",
    status: "upcoming",
    startDate: "2026-09-04",
    endDate: "2026-09-06",
    venue: "Packages Mall",
    city: "Lahore",
    country: "Pakistan",
    prizePool: { pkr: 5000000, display: "Rs 5,000,000" },
    games: ["tekken-8", "fatal-fury", "sf-6", "fc-26"],
    format: "Double-elimination",
    tier: "Tekken World Tour 2026 — Challenger / SNK World Championship — Master 2",
    organizer: "BAAZ",
    sponsors: ["twitch", "youtube"],
    liquipedia: "https://liquipedia.net/fighters/Takedown/2026",
    poster: "/assets/TAKDOWN 26.png",
    tagline: "TWT 2026 Challenger & SNK World Championship Master 2. Pakistan's ultimate fighting stage.",
    registrationUrl: "https://ticketwala.pk/event/takedown-2026-baaz-6253",
  },
  {
    slug: "ptl-stage-4",
    name: "PTL STAGE 4",
    edition: "2026",
    status: "past",
    startDate: "2026-07-18",
    endDate: "2026-07-19",
    venue: "Lahore",
    city: "Lahore",
    country: "Pakistan",
    prizePool: { display: "Points" },
    games: ["tekken-8"],
    format: "Double-elimination",
    tier: "Pakistan Tekken League 2026 — Stage 4",
    organizer: "BAAZ",
    sponsors: ["twitch", "youtube"],
    liquipedia: "https://liquipedia.net/fighters/Pakistan_Tekken_League/2026/Stage_4",
    poster: "/assets/PTL STAGE 4.png",
    tagline: "The final regular stage of the Pakistan Tekken League 2026.",
    participants: 108,
    registrationClosed: false,
  },
  {
    slug: "takedown-2023-t7",
    name: "TAKEDOWN 23",
    edition: "2023",
    status: "past",
    startDate: "2023-05-06",
    endDate: "2023-05-07",
    venue: "Expo Center Lahore",
    city: "Lahore",
    country: "Pakistan",
    prizePool: { pkr: 2000000, usd: 7062, display: "Rs 2,000,000" },
    games: ["tekken-7", "kof-xv"],
    participants: 517,
    format: "Double-elimination",
    tier: "Tekken World Tour 2023 — Dojo",
    organizer: "BAAZ",
    sponsors: ["fate", "redbull", "ashes", "m5host", "playbook", "freecs", "pathan", "cyber-ninjas", "venary", "big", "twitch", "youtube"],
    broadcastTalent: ["Infanax", "Rip", "SamDDing", "SilverFox", "Soul Dragger", "Spag", "Tasty Steve"],
    liquipedia: "https://liquipedia.net/fighters/Takedown/2023/T7",
    startggEventId: "886096",
    poster: "/assets/TAKEDOWN 23.jpg",
    tagline: "Pakistan's first major Tekken showcase",
    top8: {
      "tekken-7": [
        { player: "ATIF", placement: "1st", team: "fate", prize: "Rs 1,000,000", characters: ["Akuma", "Feng", "Jin"] },
        { player: "Arslan Ash", placement: "2nd", team: "redbull", prize: "Rs 400,000", characters: ["Zafina", "Kunimitsu"] },
        { player: "Heera", placement: "3rd", team: "ashes", prize: "Rs 200,000", characters: ["Steve", "Feng"] },
        { player: "Dawood Sikandar", placement: "4th", team: "m5host", prize: "Rs 150,000", characters: ["Alisa", "Julia"] },
        { player: "Farzeen", placement: "5th-6th", team: "fate", prize: "Rs 70,000", characters: ["Akuma"] },
        { player: "AK", placement: "5th-6th", team: "playbook", prize: "Rs 70,000", characters: ["Akuma", "Shaheen"] },
        { player: "ULSAN", placement: "7th-8th", team: "freecs", prize: "Rs 40,000", characters: ["Kazumi"] },
        { player: "Numan Ch", placement: "7th-8th", team: "roc", prize: "Rs 40,000", characters: ["Steve"] },
      ],
      "kof-xv": [
        { player: "Kami jones", placement: "1st", team: "ashes", prize: "Rs 125,000" },
        { player: "Hazz", placement: "2nd", prize: "Rs 50,000" },
        { player: "Imran Champ", placement: "3rd", prize: "Rs 25,000" },
        { player: "Xuni X", placement: "4th", prize: "Rs 20,000" },
        { player: "Muz", placement: "5th-6th", prize: "Rs 10,000" },
        { player: "THE JON", placement: "5th-6th", prize: "Rs 10,000" },
        { player: "FoulTOX", placement: "7th-8th", prize: "Rs 5,000" },
        { player: "Geoffrey Mark", placement: "7th-8th", prize: "Rs 5,000" },
      ],
    },
  },

  {
    slug: "baaz-gauntlet-2024",
    name: "THE BAAZ GAUNTLET",
    poster: "/assets/GAUNTLET.png",
    edition: "2024",
    status: "past",
    startDate: "2024-05-10",
    endDate: "2024-05-12",
    venue: "HUFC Club Pakistan",
    city: "Lahore",
    country: "Pakistan",
    prizePool: { pkr: 1045000, usd: 3762, display: "₨ 1,045,000" },
    games: ["tekken-8"],
    participants: 16,
    format: "Swiss → Double-elim Finals",
    organizer: "BAAZ",
    sponsors: ["team-falcons", "cyber-ninjas", "redbull", "r8", "drx", "cloud9", "ashes", "pathan", "fate", "twitch", "youtube"],
    broadcastTalent: ["DNM", "AyanoHisako", "Chop", "Infanax", "Sikki", "SilverFox", "Soul Dragger", "Spag"],
    liquipedia: "https://liquipedia.net/fighters/THE_BAAZ_GAUNTLET/2024",
    tagline: "16 invited. One trophy. No safety net.",
    top8: {
      "tekken-8": [
        { player: "JoKa", placement: "1st", team: "team-falcons", prize: "₨500,000" },
        { player: "Ahsan Ali", placement: "2nd", team: "cyber-ninjas", prize: "₨200,000" },
        { player: "Arslan Ash", placement: "3rd", team: "redbull", prize: "₨100,000" },
        { player: "Hafiz Adeel", placement: "4th", team: "r8", prize: "₨50,000" },
        { player: "THE JON", placement: "5th-6th", team: "ashes" },
        { player: "Farzeen", placement: "5th-6th" },
        { player: "Numan Ch", placement: "7th-8th", team: "pathan" },
        { player: "ATIF", placement: "7th-8th", team: "fate" },
      ],
    },
  },
  {
    slug: "pak-vs-korea-2025",
    name: "Pakistan vs Korea",
    edition: "2025",
    status: "past",
    startDate: "2025-03-14",
    endDate: "2025-03-16",
    venue: "Seoul",
    city: "Seoul",
    country: "South Korea",
    prizePool: { display: "Invitational" },
    games: ["tekken-8"],
    format: "Team vs Team — Waseda + Unleashed",
    organizer: "BAAZ × SOOP TEKKEN League",
    sponsors: ["twisted-minds", "team-falcons", "al-qadsiah", "fate", "roc", "drx", "freecs", "varrel", "vitality", "soop", "youtube"],
    broadcastTalent: ["Brownman", "Gerald Lee", "Majin Obama", "Spag"],
    liquipedia: "https://liquipedia.net/fighters/Pakistan_vs_Korea/2025",
    poster: "/assets/PAK VS KOR.png",
    tagline: "Pakistan 2 — Korea 0. On Korean soil.",
    participants: 15,
    top8: {
      "tekken-8": [
        { player: "Team Pakistan", placement: "1st", prize: "Winner" },
        { player: "Team South Korea", placement: "2nd", prize: "Runner-up" }
      ]
    }
  },

  {
    slug: "takedown-2025-t8",
    name: "TAKEDOWN 2025",
    poster: "/assets/TAKEDOWN 25.png",
    edition: "2025",
    status: "past",
    startDate: "2025-10-24",
    endDate: "2025-10-26",
    venue: "Nishtar Park Sports Complex",
    city: "Lahore",
    country: "Pakistan",
    prizePool: { pkr: 2500000, usd: 8897, display: "₨ 2,500,000" },
    games: ["tekken-8", "fatal-fury"],
    participants: 554,
    format: "Double-elimination",
    tier: "Tekken World Tour 2025 — Challenger",
    organizer: "BAAZ",
    sponsors: ["twisted-minds", "team-falcons", "al-qadsiah", "ashes", "m5host", "drx", "venary", "alliance", "ag", "vicious", "twitch", "youtube"],
    broadcastTalent: ["DNM", "Brownman", "Isti", "Sikki", "SilverFox", "Soul Dragger", "Spag"],
    liquipedia: "https://liquipedia.net/fighters/Takedown/2025/T8",
    tagline: "554 entrants. The biggest Tekken open Pakistan has ever seen.",
    top8: {
      "tekken-8": [
        { player: "Usama Abbasi", placement: "1st", team: "roc", characters: ["Eddy", "Asuka"], prize: "₨ 1,250,000", points: 300 },
        { player: "Farzeen", placement: "2nd", team: "team-falcons", characters: ["Lidia", "Victor"], prize: "₨ 500,000", points: 220 },
        { player: "THE JON", placement: "3rd", team: "al-qadsiah", characters: ["King"], prize: "₨ 250,000", points: 180 },
        { player: "Heera", placement: "4th", characters: ["Steve"], prize: "₨ 100,000", points: 150 },
        { player: "M. Zubair", placement: "5th-6th", characters: ["Paul", "Dragunov"], prize: "₨ 75,000", points: 120 },
        { player: "Mohsin Shooter", placement: "5th-6th", characters: ["Clive", "Nina"], prize: "₨ 75,000", points: 120 },
        { player: "Hafeez", placement: "7th-8th", characters: ["Devil Jin", "Kazuya"], prize: "₨ 45,000", points: 90 },
        { player: "Amar Xr", placement: "7th-8th", characters: ["King"], prize: "₨ 45,000", points: 90 },
      ],
      "fatal-fury": [
        { player: "Hazz", placement: "1st", team: "fate", characters: ["Terry", "B. Jenet", "Vox Reaper"], prize: "₨ 250,000" },
        { player: "Baberzaki", placement: "2nd", characters: ["B. Jenet"], prize: "₨ 100,000" },
        { player: "Ahmer kyo", placement: "3rd", characters: ["Terry", "Marco"], prize: "₨ 60,000" },
        { player: "Awais OP", placement: "4th", characters: ["Vox Reaper"], prize: "₨ 30,000" },
        { player: "VincentBlade", placement: "5th-6th", characters: ["Rock"], prize: "₨ 20,000" },
        { player: "Xuni X", placement: "5th-6th", characters: ["Mai", "Andy", "Terry"], prize: "₨ 20,000" },
        { player: "Kashif yagami", placement: "7th-8th", characters: ["Andy"], prize: "₨ 10,000" },
        { player: "NoMiiAegis", placement: "7th-8th", characters: ["Terry", "Andy"], prize: "₨ 10,000" }
      ]
    },
  },
];

export const ptl2026: Circuit = {
  slug: "ptl-2026",
  name: "Pakistan Tekken League",
  edition: "2026",
  game: "tekken-8",
  status: "upcoming",
  startDate: "2026-04-01",
  endDate: "2026-12-31",
  city: "Lahore",
  country: "Pakistan",
  tagline: "Pakistan's first major Tekken circuit",
  slots: [
    { slotNumber: 1, label: "Stage 1", sublabel: "Winner", type: "stage-winner", filledBy: "ESHARIB" },
    { slotNumber: 2, label: "Stage 2", sublabel: "Winner", type: "stage-winner", filledBy: "SHEHRAM" },
    { slotNumber: 3, label: "Stage 3", sublabel: "Winner", type: "stage-winner", filledBy: "USAMA" },
    { slotNumber: 4, label: "Stage 4", sublabel: "Winner", type: "stage-winner" },
    { slotNumber: 5, label: "Takedown", sublabel: "Winner", type: "takedown-winner" },
    { slotNumber: 6, label: "LCQ", sublabel: "Winner", type: "lcq-winner" },
    { slotNumber: 7, label: "Points", sublabel: "Standing", type: "points-leader" },
    { slotNumber: 8, label: "Wild", sublabel: "Card", type: "wild-card" },
  ],
};

export function getEventBySlug(slug: string): BaazEvent | undefined {
  return events.find((e) => e.slug === slug);
}

export function getPlayerByTag(tag: string): Player | undefined {
  return players.find((p) => p.tag === tag);
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return players.find((p) => p.slug === slug);
}

export function getSponsorBySlug(slug: string): Sponsor | undefined {
  return sponsors.find((s) => s.slug === slug);
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

/** All events a player has appeared in, with placement. */
export function getPlayerHistory(playerTag: string) {
  const history: Array<{
    event: BaazEvent;
    gameSlug: string;
    placement: string;
    prize?: string;
    characters?: string[];
  }> = [];
  for (const event of events) {
    if (!event.top8) continue;
    for (const [gameSlug, top8] of Object.entries(event.top8)) {
      const entry = top8?.find((e) => e.player === playerTag);
      if (entry) {
        history.push({
          event,
          gameSlug,
          placement: entry.placement,
          prize: entry.prize,
          characters: entry.characters,
        });
      }
    }
  }
  return history.sort((a, b) => b.event.startDate.localeCompare(a.event.startDate));
}
