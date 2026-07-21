import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { events, games, players, ptl2026, sponsors } from "../../src/lib/seed";

const prisma = new PrismaClient();

const templates = [
  {
    key: "event-announcement",
    name: "Event Announcement",
    description: "Announce a new tournament, circuit stage, registration window, or venue update.",
    defaultEyebrow: "EVENT",
    defaultCtaLabel: "View event",
    recommendedSlots: ["events/featured", "home/hero", "home/featured-posts"],
    previewKind: "registration",
    blockOrder: ["eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Use a strong date/location lead, one hero image, and a clear registration or details CTA.",
  },
  {
    key: "results-recap",
    name: "Results Recap",
    description: "Publish event results, top 8 notes, winner storylines, and bracket links.",
    defaultEyebrow: "RESULTS",
    defaultCtaLabel: "View results",
    recommendedSlots: ["home/featured-posts", "events/featured"],
    previewKind: "results",
    blockOrder: ["eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Lead with champion, event name, game, and a concise top 8 summary.",
  },
  {
    key: "player-spotlight",
    name: "Player Spotlight",
    description: "Feature a player profile, roster note, or competitive story.",
    defaultEyebrow: "PLAYER",
    defaultCtaLabel: "View player",
    recommendedSlots: ["players/featured-players", "home/featured-posts"],
    previewKind: "player",
    blockOrder: ["image", "eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Use a portrait when available and connect the story to recent or upcoming events.",
  },
  {
    key: "sponsor-announcement",
    name: "Sponsor Announcement",
    description: "Announce partners, team organizations, broadcast sponsors, or campaign support.",
    defaultEyebrow: "PARTNER",
    defaultCtaLabel: "View partner",
    recommendedSlots: ["sponsors/partner-blocks", "home/featured-posts"],
    previewKind: "sponsor",
    blockOrder: ["eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Keep brand names exact and include sponsor links only when approved.",
  },
  {
    key: "broadcast-vod",
    name: "Broadcast / VOD",
    description: "Promote a live stream, upcoming broadcast, replay, highlight, or VOD.",
    defaultEyebrow: "WATCH",
    defaultCtaLabel: "Watch now",
    recommendedSlots: ["watch/vod", "home/featured-posts"],
    previewKind: "video",
    blockOrder: ["image", "eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Use the platform, stream time, and direct watch URL clearly.",
  },
  {
    key: "general-news",
    name: "General News",
    description: "Flexible post template for announcements that do not fit a specific category.",
    defaultEyebrow: "NEWS",
    defaultCtaLabel: "Read more",
    recommendedSlots: ["home/featured-posts"],
    previewKind: "news",
    blockOrder: ["eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Keep this for miscellaneous updates; use a specific template whenever possible.",
  },
  {
    key: "ptl-update",
    name: "PTL Update",
    description: "Publish PTL season, stage, standings, registration, or bracket updates.",
    defaultEyebrow: "PTL",
    defaultCtaLabel: "View PTL",
    recommendedSlots: ["ptl-2026/hero", "ptl-2026/ptl-stages", "ptl-2026/ptl-standings"],
    previewKind: "ptl",
    blockOrder: ["eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Use this for PTL-specific updates that need to appear on the PTL 2026 tab.",
  },
  {
    key: "about-story-block",
    name: "About / Story Block",
    description: "Add a brand story, timeline, mission, or contact block to the About page.",
    defaultEyebrow: "ABOUT",
    defaultCtaLabel: "Learn more",
    recommendedSlots: ["about/contact-blocks"],
    previewKind: "about",
    blockOrder: ["eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Keep copy concise and use approved contact links.",
  },
  {
    key: "hero-feature",
    name: "Hero Feature",
    description: "Feature a high-priority announcement in a hero or top-of-page slot.",
    defaultEyebrow: "FEATURE",
    defaultCtaLabel: "Open",
    recommendedSlots: ["home/hero", "ptl-2026/hero", "events/featured"],
    previewKind: "hero",
    blockOrder: ["image", "eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Use only for the most important live or upcoming content.",
  },
  {
    key: "full-width-feature",
    name: "Full Width Feature",
    description: "Create a wide editorial feature with headline, body copy, CTA, and supporting stat cards.",
    defaultEyebrow: "WHY BAAZ",
    defaultCtaLabel: "Open",
    recommendedSlots: ["home/hero", "ptl-2026/featured", "sponsors/partner-blocks"],
    previewKind: "fullWidth",
    blockOrder: ["eyebrow", "title", "excerpt", "bodyText", "facts", "cta"],
    editorGuidance: "Use this for large section-style posts such as partner pitches, brand stories, and major campaign announcements.",
  },
  {
    key: "stats-callout",
    name: "Stats Callout",
    description: "Highlight milestone numbers, entrant counts, payouts, season stats, or sponsor proof points.",
    defaultEyebrow: "NUMBERS",
    defaultCtaLabel: "View details",
    recommendedSlots: ["home/featured-posts", "ptl-2026/featured", "sponsors/partner-blocks"],
    previewKind: "stats",
    blockOrder: ["eyebrow", "title", "excerpt", "facts", "cta"],
    editorGuidance: "Keep the title short and put the strongest number in the first sentence.",
  },
  {
    key: "image-feature",
    name: "Image Feature",
    description: "Lead with a strong cover image for event moments, galleries, roster photos, and announcements.",
    defaultEyebrow: "FEATURE",
    defaultCtaLabel: "Open",
    recommendedSlots: ["home/featured-posts", "events/featured", "ptl-2026/featured-posts"],
    previewKind: "imageFeature",
    blockOrder: ["image", "eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Upload a clear cover image first, then keep the excerpt concise.",
  },
  {
    key: "registration-alert",
    name: "Registration Alert",
    description: "Focused signup, deadline, venue, check-in, or bracket alert with a clear action button.",
    defaultEyebrow: "REGISTRATION",
    defaultCtaLabel: "Register now",
    recommendedSlots: ["events/featured", "ptl-2026/hero", "home/featured-posts"],
    previewKind: "registration",
    blockOrder: ["eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Use a deadline, location or online status, and the direct registration link.",
  },
  {
    key: "watch-feature",
    name: "Watch Feature",
    description: "Feature a live stream, VOD playlist, watch party, replay, or episode drop.",
    defaultEyebrow: "WATCH",
    defaultCtaLabel: "Watch",
    recommendedSlots: ["watch/vod", "home/featured-posts"],
    previewKind: "video",
    blockOrder: ["image", "eyebrow", "title", "excerpt", "bodyText", "cta"],
    editorGuidance: "Include platform, start time if relevant, and a direct watch link.",
  },
];

type PageSectionSeed = {
  pageKey: string;
  sectionKey: string;
  title?: string;
  eyebrow?: string;
  bodyText?: string;
  items?: Array<Record<string, string>>;
  cta?: { label: string; href: string };
  variant?: string;
  order?: number;
};

const pageSections: PageSectionSeed[] = [
  {
    pageKey: "site",
    sectionKey: "brand",
    title: "BAAZ",
    bodyText: "Pakistan's home for the FGC",
  },
  {
    pageKey: "site",
    sectionKey: "navigation",
    items: [
      { label: "PTL 2026", title: "PTL 2026", href: "/ptl-2026", type: "link", accent: "true" },
      { label: "ENC 2026", title: "ENC 2026", href: "/enc-2026", type: "link", accent: "true" },
      { label: "Rankings", title: "Rankings", href: "/rankings", type: "link" },
      { label: "Events", title: "Events", href: "/events", type: "link" },
      { label: "Contact", title: "Contact", href: "/contact", type: "link" },
    ],
  },
  {
    pageKey: "site",
    sectionKey: "footer",
    eyebrow: "BAAZ GG",
    bodyText: "We build the stages where Pakistan's fighting-game scene proves itself - from packed local opens to international invitationals.",
    cta: { label: "partners@baaz.gg", href: "mailto:partners@baaz.gg" },
    items: [{ label: "BAAZ GG. Lahore, Pakistan.", title: "// EAT. SLEEP. COMBO. REPEAT.", type: "card" }],
  },
  {
    pageKey: "site",
    sectionKey: "footer-links",
    items: [
      { label: "PTL 2026", title: "PTL 2026", href: "/ptl-2026", type: "link", accent: "true" },
      { label: "ENC 2026", title: "ENC 2026", href: "/enc-2026", type: "link", accent: "true" },
      { label: "Rankings", title: "Rankings", href: "/rankings", type: "link" },
      { label: "Events", title: "Events", href: "/events", type: "link" },
      { label: "Contact", title: "Contact", href: "/contact", type: "link" },
    ],
  },
  {
    pageKey: "site",
    sectionKey: "watch-links",
    items: [
      { label: "twitch.tv/baaz_gg", title: "Twitch", href: "https://twitch.tv/baaz_gg", type: "link" },
      { label: "youtube.com/@baazgg", title: "YouTube", href: "https://youtube.com/@baazgg", type: "link" },
    ],
  },
  {
    pageKey: "home",
    sectionKey: "hero-carousel",
    items: [
      {
        label: "NATIONAL TEAM - ESPORTS NATIONS CUP 2026",
        title: "DANYAL CHISHTY\nNAMED PAKISTAN'S\nNATIONAL TEAM MANAGER",
        body: "BAAZ founder Danyal Chishty will lead Team Pakistan at the inaugural Esports Nations Cup - the country-based world championship hosted in Riyadh, Saudi Arabia this November.",
        href: "/about",
        meta: "RIYADH, KSA - NOV 2026",
        type: "card",
        ctaLabel: "The Baaz story",
        accent: "neon",
        imageKey: "enc-2026",
      },
      {
        label: "PTL 2026 - REGULAR SEASON",
        title: "FOUR STAGES.\nONE CIRCUIT.\nEIGHT SLOTS.",
        body: "The Pakistan Tekken League's regular season runs four stages from April to July - every stage win punches a ticket to the national finale.",
        href: "/ptl-2026",
        meta: "APR - JUL '26 - LAHORE",
        type: "card",
        ctaLabel: "Explore the circuit",
        accent: "signal",
        imageKey: "ptl-stage",
      },
      {
        label: "TAKEDOWN 2026",
        title: "THE BIGGEST\nTEKKEN OPEN\nPAKISTAN HAS SEEN",
        body: "554 entrants broke the record in 2025. Takedown returns in 2026 as the defining stage of the national circuit - bigger field, bigger stakes.",
        href: "/events",
        meta: "LAHORE, PAKISTAN",
        type: "card",
        ctaLabel: "Save the date",
        accent: "blood",
        imageKey: "takedown-2026",
      },
    ],
  },
  {
    pageKey: "home",
    sectionKey: "marquee",
    items: ["TEKKEN 8", "TWT 2025 CHALLENGER", "LAHORE", "554 ENTRANTS", "SEOUL TAKEDOWN", "PAK 2 - KOR 0", "PTL 2026 INCOMING", "EAT SLEEP COMBO"].map((label) => ({ label })),
  },
  {
    pageKey: "home",
    sectionKey: "intro",
    eyebrow: "WHO WE ARE",
    title: "We build the stage.",
    bodyText: "Baaz is Pakistan's leading FGC esports organization. From Takedown to The Baaz Gauntlet to international invitationals against Korea, we've put Pakistani fighters in front of the world.",
  },
  {
    pageKey: "home",
    sectionKey: "stats",
    items: [
      { label: "EVENTS", value: "6", sub: "2023 -> 2026" },
      { label: "ENTRANTS", value: "1,235", sub: "across all opens" },
      { label: "PRIZE", value: "Rs58.0M", sub: "payouts distributed" },
      { label: "GAMES", value: "3", sub: "T7 - T8 - KoF XV" },
      { label: "COUNTRIES", value: "6", sub: "competitors hosted" },
      { label: "CIRCUITS", value: "01", sub: "PTL launching 2026" },
    ],
  },
  {
    pageKey: "home",
    sectionKey: "ptl-teaser",
    eyebrow: "THE 2026 ROAD",
    title: "Eight slots.\nOne finale.",
    bodyText: "Every path to the PTL 2026 final. Stage wins, the national Takedown, the LCQ, the points race, and one wild card chosen by Baaz.",
    cta: { label: "Full circuit page", href: "/ptl-2026" },
  },
  {
    pageKey: "home",
    sectionKey: "legacy-events",
    eyebrow: "THE LEGACY",
    title: "Three years. Six majors.",
    bodyText: "From Pakistan's first major Tekken showcase to a clean sweep in Seoul, every event Baaz has put on the map.",
  },
  {
    pageKey: "home",
    sectionKey: "players-preview",
    eyebrow: "THE ROSTER",
    title: "The fighters.",
    bodyText: "National champs, regional studs, and international guests. The names making Pakistani Tekken impossible to ignore.",
  },
  {
    pageKey: "home",
    sectionKey: "watch-links",
    items: [
      { label: "TWITCH", title: "-> BAAZ_GG", href: "https://twitch.tv/baaz_gg" },
      { label: "YOUTUBE", title: "-> BAAZGG", href: "https://youtube.com/@baazgg" },
    ],
  },
  {
    pageKey: "events",
    sectionKey: "intro",
    eyebrow: "THE ARCHIVE",
    title: "Every event we've put on the map.",
    bodyText: "Open majors, invitationals, international challenges - every show Baaz has produced, in chronological order.",
  },
  {
    pageKey: "players",
    sectionKey: "intro",
    eyebrow: "THE ROSTER",
    title: "The fighters.",
    bodyText: "Every competitor who's stepped onto a Baaz stage - Pakistani regulars, Korean visitors, and international guests.",
  },
  {
    pageKey: "sponsors",
    sectionKey: "intro",
    eyebrow: "PARTNERS",
    title: "Brands that fight alongside us.",
    bodyText: "Esports orgs, broadcasters, and brands who showed up for the Pakistani FGC. The list keeps growing.",
  },
  {
    pageKey: "sponsors",
    sectionKey: "partner-pitch",
    eyebrow: "WHY BAAZ",
    title: "A captive, growing audience.",
    bodyText: "Baaz events sit at the intersection of the world's most-watched fighting game and Pakistan's fastest-growing youth audience. From a 517-entrant first major to 554 entrants at Takedown 2025, every show grows.",
    cta: { label: "partners@baaz.gg", href: "mailto:partners@baaz.gg" },
    items: [
      { label: "CUMULATIVE ENTRANTS", value: "1,235+", type: "users" },
      { label: "MAJOR EVENTS", value: "6", type: "trophy" },
      { label: "COUNTRIES HOSTED", value: "06", type: "globe" },
      { label: "TEKKEN WORLD TOUR CIRCUIT", value: "TWT", type: "text" },
    ],
  },
  { pageKey: "sponsors", sectionKey: "team-organizations", eyebrow: "TEAM ORGANIZATIONS", title: "Orgs repping at Baaz events." },
  { pageKey: "sponsors", sectionKey: "broadcast", eyebrow: "BROADCAST + DISTRIBUTION", title: "Where Baaz lives." },
  {
    pageKey: "watch",
    sectionKey: "intro",
    eyebrow: "LIVE + ON-DEMAND",
    title: "Where to watch Baaz.",
    bodyText: "Live shows on Twitch. VODs, hype reels, and recaps on YouTube. Subscribe both - the action moves between them.",
  },
  {
    pageKey: "watch",
    sectionKey: "watch-channels",
    items: [
      { label: "TWITCH", title: "-> BAAZ_GG", body: "Live broadcast of every Baaz event in English.", href: "https://twitch.tv/baaz_gg" },
      { label: "YOUTUBE", title: "-> BAAZGG", body: "Highlights, recaps, top 8 VODs, hype trailers.", href: "https://youtube.com/@baazgg" },
    ],
  },
  {
    pageKey: "watch",
    sectionKey: "recent-broadcasts",
    eyebrow: "FEATURED",
    title: "Recent broadcasts.",
    items: [
      { title: "Takedown 2025 - Grand Finals", meta: "YOUTUBE - BAAZGG" },
      { title: "Pak vs Korea - Match 2", meta: "YOUTUBE - BAAZGG" },
      { title: "Gauntlet 2024 - Top 8", meta: "YOUTUBE - BAAZGG" },
    ],
  },
  {
    pageKey: "about",
    sectionKey: "intro",
    eyebrow: "WHO IS BAAZ",
    title: "We build the stages where Pakistan's FGC proves itself.",
    bodyText: "Baaz - the Urdu word for falcon - has produced every major fighting-game event in Pakistan since 2023. Local opens. International invitationals. And now, the country's first full Tekken circuit.",
  },
  {
    pageKey: "about",
    sectionKey: "timeline",
    eyebrow: "THE BAAZ STORY",
    title: "Three years. One trajectory.",
    items: [
      { label: "2023", title: "TAKEDOWN 1", body: "Pakistan's first major Tekken showcase. 517 entrants, KoF XV's South Asia debut alongside. Expo Center Lahore." },
      { label: "2024", title: "THE BAAZ GAUNTLET", body: "16-player Tekken 8 invitational. Swiss-stage format. Rs1M+ on the line. JoKa takes the title." },
      { label: "2025", title: "PAKISTAN VS KOREA", body: "Co-produced with SOOP TEKKEN League. Seoul. Pakistan sweeps 2-0 on Korean soil." },
      { label: "2025", title: "GAUNTLET 2 + TAKEDOWN 2025", body: "Two more T8 majors in a single year. Takedown grows to 554 entrants - the biggest Tekken open Pakistan has ever seen." },
      { label: "2026", title: "PAKISTAN TEKKEN LEAGUE", body: "Pakistan's first multi-stage Tekken circuit. Four regular-season stages, a Takedown, an LCQ, points race, wild card. Eight slots. One winter finale." },
    ],
  },
  {
    pageKey: "about",
    sectionKey: "mission",
    eyebrow: "MISSION",
    title: "Bigger stages.\nBetter fighters.",
    bodyText: "Pakistan has been producing world-class Tekken players for years - Arslan Ash, ATIF, Farzeen, Usama Abbasi.\n\nBaaz exists to close that gap. We build the production, secure the partners, host the international talent, and put Pakistani Tekken on a global stage - every show bigger than the last.\n\nThe Pakistan Tekken League is the next step. A full circuit. A real season. A finale that decides who's the best in the country, on the country's biggest stage.",
  },
  {
    pageKey: "about",
    sectionKey: "contact-cards",
    items: [
      { label: "PARTNERSHIPS", title: "partners@baaz.gg", body: "SPONSOR - BROADCAST", href: "mailto:partners@baaz.gg" },
      { label: "PRESS + GENERAL", title: "hello@baaz.gg", body: "MEDIA - INTERVIEWS", href: "mailto:hello@baaz.gg" },
      { label: "PLAYERS + ENTRY", title: "players@baaz.gg", body: "REGISTRATION - LCQ", href: "mailto:players@baaz.gg" },
    ],
  },
  {
    pageKey: "ptl-2026",
    sectionKey: "intro",
    eyebrow: "BAAZ x TEKKEN 8 - SEASON 2026",
    title: "PAKISTAN\nTEKKEN\nLEAGUE",
    bodyText: "Pakistan's first major Tekken circuit",
    cta: { label: "See the road to the final", href: "#slots" },
  },
  {
    pageKey: "ptl-2026",
    sectionKey: "hero-stats",
    items: [
      { label: "SEASON", value: "APR - DEC '26", type: "calendar" },
      { label: "HOST", value: "LAHORE", type: "map" },
      { label: "SLOTS", value: "8 FINALISTS", type: "trophy" },
      { label: "WATCH", value: "BAAZ_GG", type: "tv" },
    ],
  },
  {
    pageKey: "ptl-2026",
    sectionKey: "slots-intro",
    eyebrow: "THE ROAD",
    title: "Eight slots.\nEvery path leads to the same stage.",
    bodyText: "Win a stage outright, take Takedown, survive the LCQ, top the points race, or get a Baaz wild-card invite. Only the eight best of the season fight for the title.",
  },
  {
    pageKey: "ptl-2026",
    sectionKey: "stage-timeline",
    eyebrow: "THE CALENDAR",
    title: "Seven shows. One season.",
    bodyText: "The full PTL 2026 calendar. Stages and venues finalize as the season approaches - registration opens once details are confirmed.",
    items: [
      { label: "01", title: "STAGE 1", meta: "APR '26", body: "Lahore" },
      { label: "02", title: "STAGE 2", meta: "MAY '26", body: "Karachi" },
      { label: "03", title: "STAGE 3", meta: "JUN '26", body: "Islamabad" },
      { label: "04", title: "STAGE 4", meta: "JUL '26", body: "Lahore" },
      { label: "TD", title: "TAKEDOWN", meta: "OCT '26", body: "Packages Mall, Lahore" },
      { label: "LCQ", title: "LCQ", meta: "NOV '26", body: "Lahore" },
      { label: "F", title: "FINALE", meta: "WINTER '26", body: "Lahore" },
    ],
  },
  {
    pageKey: "ptl-2026",
    sectionKey: "bracket-placeholder",
    eyebrow: "STAGE RESULTS",
    title: "Three stages down.\nOne to go.",
    bodyText: "Pulled live from start.gg. Full brackets stay on start.gg itself - that page can't be embedded here, so each card links out.",
    items: [],
  },
  {
    pageKey: "ptl-2026",
    sectionKey: "standings",
    eyebrow: "POINTS RACE",
    title: "The standing earns the seventh slot.",
    bodyText: "Performance across all four stages and Takedown adds up. The points leader at season's end claims slot 7 - the most consistent fighter of the year.",
    items: [{ body: "Standings update after Stage 1 (APR '26)." }],
  },
  {
    pageKey: "ptl-2026",
    sectionKey: "watch-links",
    eyebrow: "LIVE STREAM",
    title: "Every match. English broadcast.",
    bodyText: "Baaz produces every PTL show end-to-end - talent, replays, hype. Subscribe so you don't miss a slot.",
    items: [
      { label: "TWITCH", title: "-> BAAZ_GG", href: "https://twitch.tv/baaz_gg" },
      { label: "YOUTUBE", title: "-> BAAZGG", href: "https://youtube.com/@baazgg" },
    ],
  },
];

async function main() {
  for (const template of templates) {
    await prisma.postTemplate.upsert({
      where: { key: template.key },
      update: { ...template, enabled: true },
      create: { ...template, enabled: true },
    });
  }

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: game,
      create: game,
    });
  }

  for (const sponsor of sponsors) {
    await prisma.sponsor.upsert({
      where: { slug: sponsor.slug },
      update: {
        name: sponsor.name,
        tier: sponsor.tier,
        url: sponsor.url,
        logoLight: sponsor.logoLight,
        logoDark: sponsor.logoDark,
        enabled: true,
      },
      create: {
        slug: sponsor.slug,
        name: sponsor.name,
        tier: sponsor.tier,
        url: sponsor.url,
        logoLight: sponsor.logoLight,
        logoDark: sponsor.logoDark,
        enabled: true,
      },
    });
  }

  for (const player of players) {
    await prisma.player.upsert({
      where: { slug: player.slug },
      update: {
        tag: player.tag,
        realName: player.realName,
        country: player.country,
        teamId: player.team,
        mains: player.mains,
        photo: player.photo,
        enabled: true,
      },
      create: {
        slug: player.slug,
        tag: player.tag,
        realName: player.realName,
        country: player.country,
        teamId: player.team,
        mains: player.mains,
        photo: player.photo,
        enabled: true,
      },
    });
  }

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        name: event.name,
        edition: event.edition,
        tagline: event.tagline,
        status: event.status,
        enabled: true,
        startDate: event.startDate ? new Date(event.startDate) : undefined,
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        venue: event.venue,
        city: event.city,
        country: event.country,
        prizePool: event.prizePool,
        games: event.games,
        participants: event.participants,
        format: event.format,
        tier: event.tier,
        organizer: event.organizer,
        sponsors: event.sponsors,
        broadcastTalent: event.broadcastTalent,
        liquipedia: event.liquipedia,
        poster: event.poster,
        results: event.top8,
        registrationClosed: event.registrationClosed,
      },
      create: {
        slug: event.slug,
        name: event.name,
        edition: event.edition,
        tagline: event.tagline,
        status: event.status,
        enabled: true,
        startDate: event.startDate ? new Date(event.startDate) : undefined,
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        venue: event.venue,
        city: event.city,
        country: event.country,
        prizePool: event.prizePool,
        games: event.games,
        participants: event.participants,
        format: event.format,
        tier: event.tier,
        organizer: event.organizer,
        sponsors: event.sponsors,
        broadcastTalent: event.broadcastTalent,
        liquipedia: event.liquipedia,
        poster: event.poster,
        results: event.top8,
        registrationClosed: event.registrationClosed,
      },
    });
  }

  await prisma.circuit.upsert({
    where: { slug: ptl2026.slug },
    update: {
      name: ptl2026.name,
      edition: ptl2026.edition,
      gameSlug: ptl2026.game,
      status: ptl2026.status,
      enabled: true,
      startDate: new Date(ptl2026.startDate),
      endDate: new Date(ptl2026.endDate),
      city: ptl2026.city,
      country: ptl2026.country,
      tagline: ptl2026.tagline,
      prizePool: ptl2026.prizePool,
      slots: ptl2026.slots,
    },
    create: {
      slug: ptl2026.slug,
      name: ptl2026.name,
      edition: ptl2026.edition,
      gameSlug: ptl2026.game,
      status: ptl2026.status,
      enabled: true,
      startDate: new Date(ptl2026.startDate),
      endDate: new Date(ptl2026.endDate),
      city: ptl2026.city,
      country: ptl2026.country,
      tagline: ptl2026.tagline,
      prizePool: ptl2026.prizePool,
      slots: ptl2026.slots,
    },
  });

  for (const section of pageSections) {
    await upsertPageSection(section);
  }

  const email = process.env.SEED_ADMIN_EMAIL || "admin@baaz.gg";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123456";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, active: true, role: "SUPER_ADMIN" },
    create: {
      email,
      name: "BAAZ Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      active: true,
    },
  });

  console.log(`Seed complete. Admin email: ${email}`);
}

async function upsertPageSection(section: PageSectionSeed) {
  const body = buildBody(section.bodyText, section.items);
  const existing = await prisma.pageContent.findFirst({
    where: {
      pageKey: section.pageKey,
      sectionKey: section.sectionKey,
      variant: section.variant || "default",
      order: section.order || 0,
    },
  });
  const data = {
    pageKey: section.pageKey,
    sectionKey: section.sectionKey,
    title: section.title,
    eyebrow: section.eyebrow,
    body,
    cta: section.cta,
    variant: section.variant || "default",
    order: section.order || 0,
    enabled: true,
  };

  if (existing) {
    await prisma.pageContent.update({ where: { id: existing.id }, data });
  } else {
    await prisma.pageContent.create({ data });
  }
}

function buildBody(bodyText?: string, items?: Array<Record<string, string>>) {
  const blocks = (bodyText || "")
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ type: "paragraph", text }));

  if (blocks.length === 0 && (!items || items.length === 0)) return undefined;
  return {
    blocks,
    ...(items && items.length > 0 ? { items } : {}),
  };
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
