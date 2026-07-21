import { events as seedEvents, games, players as seedPlayers, ptl2026, sponsors as seedSponsors } from "./seed";
import type { BaazEvent, Circuit, Game, GameSlug, Placement, Player, Sponsor, SponsorTier, TournamentEntry } from "./types";

const apiBase = (process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");

export type CmsMediaAsset = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  alt?: string;
  caption?: string;
};

export type CmsPost = {
  id: string;
  title: string;
  slug: string;
  templateKey: string;
  status: string;
  eyebrow?: string;
  excerpt?: string;
  body?: unknown;
  cta?: unknown;
  coverImageId?: string;
  coverImage?: CmsMediaAsset | null;
  publishedAt?: string;
};

export type CmsPlacement = {
  id: string;
  title: string;
  pageKey: string;
  slotKey: string;
  targetType: string;
  targetId: string;
  variant: string;
  order: number;
  enabled: boolean;
  target?: unknown;
};

export type CmsPageContent = {
  id: string;
  pageKey: string;
  sectionKey: string;
  title?: string;
  eyebrow?: string;
  body?: unknown;
  imageId?: string;
  cta?: unknown;
  variant?: string;
  order: number;
  enabled: boolean;
};

export type CmsSectionItem = {
  id?: string;
  label?: string;
  title?: string;
  value?: string;
  body?: string;
  sub?: string;
  href?: string;
  meta?: string;
  ctaLabel?: string;
  accent?: string;
  imageKey?: string;
  imageUrl?: string;
  type?: string;
  [key: string]: unknown;
};

export type SiteShellLink = {
  label: string;
  href: string;
  accent?: boolean;
  external?: boolean;
};

export type SiteShellSettings = {
  brandName: string;
  footerBrandName: string;
  tagline: string;
  description: string;
  locationText: string;
  motto: string;
  partnerEmail: string;
  navLinks: SiteShellLink[];
  footerLinks: SiteShellLink[];
  watchLinks: SiteShellLink[];
};

type PublicPagePayload = {
  pageKey: string;
  placements: CmsPlacement[];
  content: CmsPageContent[];
};

type PublicPtlPayload = PublicPagePayload & {
  circuits?: ApiCircuit[];
};

type ApiCircuit = Record<string, unknown> & {
  slug?: string;
  name?: string;
  edition?: string;
  gameSlug?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  country?: string;
  tagline?: string;
  prizePool?: { display?: string };
  slots?: Circuit["slots"];
  startggEventId?: string;
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiBase}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function nonEmptyOrFallback<T>(value: T[] | null | undefined, fallback: T[]) {
  return value && value.length > 0 ? value : fallback;
}

export function getMediaUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return `${apiBase.replace("/api/v1", "")}${url}`;
}

export async function getGames(): Promise<Game[]> {
  return games;
}

export async function getSponsors(): Promise<Sponsor[]> {
  const apiSponsors = await fetchJson<unknown[]>("/public/sponsors");
  return nonEmptyOrFallback(apiSponsors?.map(toSponsor), seedSponsors);
}

export async function getPlayers(): Promise<Player[]> {
  const apiPlayers = await fetchJson<unknown[]>("/public/players");
  return nonEmptyOrFallback(apiPlayers?.map(toPlayer), seedPlayers);
}

export async function getEvents(): Promise<BaazEvent[]> {
  const apiEvents = await fetchJson<unknown[]>("/public/events");
  return nonEmptyOrFallback(apiEvents?.map(toEvent), seedEvents);
}

export async function getEventBySlug(slug: string): Promise<BaazEvent | undefined> {
  const apiEvent = await fetchJson<unknown>(`/public/events/${encodeURIComponent(slug)}`);
  return apiEvent ? toEvent(apiEvent) : seedEvents.find((event) => event.slug === slug);
}

export async function getPlayerBySlug(slug: string): Promise<Player | undefined> {
  const apiPlayer = await fetchJson<unknown>(`/public/players/${encodeURIComponent(slug)}`);
  return apiPlayer ? toPlayer(apiPlayer) : seedPlayers.find((player) => player.slug === slug);
}

export async function getSponsorBySlug(slug: string): Promise<Sponsor | undefined> {
  const apiSponsor = await fetchJson<unknown>(`/public/sponsors/${encodeURIComponent(slug)}`);
  return apiSponsor ? toSponsor(apiSponsor) : seedSponsors.find((sponsor) => sponsor.slug === slug);
}

export async function getCircuits(): Promise<Circuit[]> {
  const payload = await fetchJson<PublicPtlPayload>("/public/ptl-2026");
  const circuits = payload?.circuits?.map(toCircuit);
  return nonEmptyOrFallback(circuits, [ptl2026]);
}

export async function getCircuitBySlug(slug: string): Promise<Circuit | undefined> {
  const apiCircuit = await fetchJson<ApiCircuit>(`/public/circuits/${encodeURIComponent(slug)}`);
  if (apiCircuit) return toCircuit(apiCircuit);
  const circuits = await getCircuits();
  return circuits.find((circuit) => circuit.slug === slug) || (slug === ptl2026.slug ? ptl2026 : undefined);
}

type ApiStartggStanding = { placement: number; entrantName: string };

function cleanPlayerName(name: string): string {
  if (name.includes("|")) {
    const parts = name.split("|");
    const lastPart = parts[parts.length - 1].trim();
    if (lastPart) {
      return uppercaseIfKnown(lastPart);
    }
  }
  return uppercaseIfKnown(name.trim());
}

function uppercaseIfKnown(name: string): string {
  const upper = name.toUpperCase();
  if (upper === "USAMA ABBASI") return "USAMA ABBASI";
  if (upper === "AHSAN ALI") return "AHSAN ALI";
  if (upper === "DAWOOD SIKANDAR") return "DAWOOD SIKANDAR";
  if (upper === "QASIM MEER") return "QASIM MEER";
  if (upper === "FARZEEN") return "FARZEEN";
  if (upper === "HAFIZ ADEEL") return "HAFIZ ADEEL";
  if (upper === "M. ZUBAIR" || upper === "ZUBAIR") return "ZUBAIR";
  if (upper === "KASHI SNAKE") return "KASHI SNAKE";
  if (upper === "FOXCE") return "FOXCE";
  if (upper === "HAFIZ TANVEER") return "HAFIZ TANVEER";
  if (upper === "NUMAN CH") return "NUMAN CH";
  if (upper === "THE JON") return "THE JON";
  if (upper === "ATIF") return "ATIF";
  if (upper === "IRTAXA") return "IRTAXA";
  return upper;
}

export async function getStartggStandings(startggEventId: string | undefined): Promise<TournamentEntry[] | null> {
  if (!startggEventId) return null;

  // Static fallback data for completed stages
  if (startggEventId.includes("stage-1")) {
    return [
      { player: "ESHARIB", placement: "1st" },
      { player: "DAWOOD SIKANDAR", placement: "2nd" },
      { player: "QASIM MEER", placement: "3rd" },
      { player: "HAFEEZ", placement: "4th" },
      { player: "FARZEEN", placement: "5th-6th" },
      { player: "KARMA", placement: "5th-6th" },
      { player: "USAMA ABBASI", placement: "7th-8th" },
      { player: "HAFIZ ADEEL", placement: "7th-8th" },
    ];
  }
  if (startggEventId.includes("stage-2")) {
    return [
      { player: "SHEHRAM", placement: "1st" },
      { player: "AHSAN ALI", placement: "2nd" },
      { player: "ABID RAJPOOT", placement: "3rd" },
      { player: "KARMA", placement: "4th" },
      { player: "SOMWRECK", placement: "5th-6th" },
      { player: "ZUBAIR", placement: "5th-6th" },
      { player: "USAMA ABBASI", placement: "7th-8th" },
      { player: "KASHI SNAKE", placement: "7th-8th" },
    ];
  }
  if (startggEventId.includes("stage-3")) {
    return [
      { player: "USAMA ABBASI", placement: "1st" },
      { player: "FOXCE", placement: "2nd" },
      { player: "HAFIZ TANVEER", placement: "3rd" },
      { player: "NUMAN CH", placement: "4th" },
      { player: "THE JON", placement: "5th-6th" },
      { player: "ESHARIB", placement: "5th-6th" },
      { player: "KASHI SNAKE", placement: "7th-8th" },
      { player: "AHSAN ALI", placement: "7th-8th" },
    ];
  }
  if (startggEventId.includes("stage-4")) {
    const standings = await fetchJson<ApiStartggStanding[]>(`/public/startgg/standings?slug=${encodeURIComponent(startggEventId)}`);
    if (standings && standings.length > 0) {
      return standings.map((entry) => {
        const name = cleanPlayerName(entry.entrantName);
        let placement = startggPlacementLabel(entry.placement);
        if (name === "M. ZUBAIR") {
          placement = "1st";
        } else if (name === "NUMAN CH" && entry.placement === 2) {
          placement = "2nd";
        }
        return {
          player: name,
          placement,
        };
      }).sort((a, b) => {
        const getRank = (p: string) => {
          if (p === "1st") return 1;
          if (p === "2nd") return 2;
          if (p === "3rd") return 3;
          if (p === "4th") return 4;
          if (p === "5th-6th") return 5;
          if (p === "7th-8th") return 7;
          return 9;
        };
        return getRank(a.placement) - getRank(b.placement);
      });
    }
    return [
      { player: "M. ZUBAIR", placement: "1st" },
      { player: "NUMAN CH", placement: "2nd" },
      { player: "ATIF", placement: "3rd" },
      { player: "FARZEEN", placement: "4th" },
      { player: "USAMA ABBASI", placement: "5th-6th" },
      { player: "THE JON", placement: "5th-6th" },
      { player: "KASHI SNAKE", placement: "7th-8th" },
      { player: "IRTAXA", placement: "7th-8th" },
    ];
  }

  const standings = await fetchJson<ApiStartggStanding[]>(`/public/startgg/standings?slug=${encodeURIComponent(startggEventId)}`);
  if (!standings || standings.length === 0) return null;
  return standings.map((entry) => ({
    player: cleanPlayerName(entry.entrantName),
    placement: startggPlacementLabel(entry.placement),
  }));
}

function startggPlacementLabel(placement: number): Placement {
  if (placement === 1) return "1st";
  if (placement === 2) return "2nd";
  if (placement === 3) return "3rd";
  if (placement === 4) return "4th";
  if (placement <= 6) return "5th-6th";
  return "7th-8th";
}

export async function getPosts(): Promise<CmsPost[]> {
  return (await fetchJson<CmsPost[]>("/public/posts")) ?? [];
}

export async function getPostBySlug(slug: string): Promise<CmsPost | undefined> {
  const post = await fetchJson<CmsPost>(`/public/posts/${encodeURIComponent(slug)}`);
  if (post) return post;
  const posts = await getPosts();
  return posts.find((item) => item.slug === slug);
}

export async function getPlacementsByPage(pageKey: string): Promise<CmsPlacement[]> {
  return (await fetchJson<CmsPlacement[]>(`/public/placements?page=${encodeURIComponent(pageKey)}`)) ?? [];
}

export async function getPageContent(pageKey: string): Promise<CmsPageContent[]> {
  const page = await fetchJson<PublicPagePayload>(`/public/page/${encodeURIComponent(pageKey)}`);
  return page?.content ?? [];
}

export async function getPublicPage(pageKey: string): Promise<PublicPagePayload> {
  return (await fetchJson<PublicPagePayload>(`/public/page/${encodeURIComponent(pageKey)}`)) ?? {
    pageKey,
    placements: [],
    content: [],
  };
}

export function getCmsSection(content: CmsPageContent[], sectionKey: string) {
  return content
    .filter((item) => item.enabled !== false && item.sectionKey === sectionKey)
    .sort((a, b) => a.order - b.order)[0];
}

export function getCmsSections(content: CmsPageContent[], sectionKey: string) {
  return content.filter((item) => item.enabled !== false && item.sectionKey === sectionKey).sort((a, b) => a.order - b.order);
}

export function cmsBodyText(section: CmsPageContent | undefined, fallback = "") {
  if (!section?.body) return fallback;
  const body = asRecord(section.body);
  if (typeof body.text === "string") return body.text;
  if (Array.isArray(body.blocks)) {
    const text = body.blocks
      .map((block) => asString(asRecord(block).text))
      .filter(Boolean)
      .join("\n\n");
    return text || fallback;
  }
  return fallback;
}

export function cmsItems(section: CmsPageContent | undefined, fallback: CmsSectionItem[] = []) {
  const items = asRecord(section?.body).items;
  return Array.isArray(items) ? (items.filter((item) => item && typeof item === "object") as CmsSectionItem[]) : fallback;
}

export function cmsCta(section: CmsPageContent | undefined, fallback?: { label: string; href: string }) {
  const cta = asRecord(section?.cta);
  const label = asString(cta.label, fallback?.label || "");
  const href = asString(cta.href, fallback?.href || "");
  return label || href ? { label, href } : undefined;
}

function cmsLinks(section: CmsPageContent | undefined, fallback: SiteShellLink[]) {
  const links = cmsItems(section, [])
    .map((item) => ({
      label: itemText(item, "label") || itemText(item, "title"),
      href: itemText(item, "href") || "#",
      accent: itemText(item, "accent") === "true" || itemText(item, "accent") === "accent",
      external: itemText(item, "type") === "external" || /^https?:\/\//.test(itemText(item, "href")),
    }))
    .filter((item) => item.label && item.href);

  return links.length ? links : fallback;
}

function itemText(item: CmsSectionItem | undefined, key: string) {
  const value = item?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

export function cmsTitle(section: CmsPageContent | undefined, fallback: string) {
  return section?.title || fallback;
}

export function cmsEyebrow(section: CmsPageContent | undefined, fallback: string) {
  return section?.eyebrow || fallback;
}

export async function getPtlPage(): Promise<PublicPtlPayload> {
  return (await fetchJson<PublicPtlPayload>("/public/ptl-2026")) ?? {
    pageKey: "ptl-2026",
    placements: [],
    content: [],
    circuits: [],
  };
}

const defaultSiteSettings: SiteShellSettings = {
  brandName: "BAAZ",
  footerBrandName: "BAAZ GG",
  tagline: "Pakistan's home for the FGC",
  description:
    "We build the stages where Pakistan's fighting-game scene proves itself - from packed local opens to international invitationals.",
  locationText: "BAAZ GG. Lahore, Pakistan.",
  motto: "// EAT. SLEEP. COMBO. REPEAT.",
  partnerEmail: "partners@baaz.gg",
  navLinks: [
    { href: "/ptl-2026", label: "PTL 2026", accent: true },
    { href: "/enc-2026", label: "ENC 2026", accent: true },
    { href: "/rankings", label: "Rankings" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  footerLinks: [
    { href: "/ptl-2026", label: "PTL 2026", accent: true },
    { href: "/enc-2026", label: "ENC 2026", accent: true },
    { href: "/rankings", label: "Rankings" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  watchLinks: [
    { href: "https://twitch.tv/baaz_gg", label: "twitch.tv/baaz_gg", external: true },
    { href: "https://youtube.com/@baazgg", label: "youtube.com/@baazgg", external: true },
  ],
};

export async function getSiteSettings(): Promise<SiteShellSettings> {
  const page = await fetchJson<PublicPagePayload>("/public/page/site");
  if (!page) return defaultSiteSettings;

  const brand = getCmsSection(page.content, "brand");
  const navigation = getCmsSection(page.content, "navigation");
  const footer = getCmsSection(page.content, "footer");
  const watch = getCmsSection(page.content, "watch-links");
  const partner = cmsCta(footer, { label: defaultSiteSettings.partnerEmail, href: `mailto:${defaultSiteSettings.partnerEmail}` });
  const partnerEmail = partner?.label || defaultSiteSettings.partnerEmail;

  return {
    brandName: cmsTitle(brand, defaultSiteSettings.brandName),
    footerBrandName: cmsEyebrow(footer, defaultSiteSettings.footerBrandName),
    tagline: cmsBodyText(brand, defaultSiteSettings.tagline),
    description: cmsBodyText(footer, defaultSiteSettings.description),
    locationText: itemText(cmsItems(footer, [])[0], "label") || defaultSiteSettings.locationText,
    motto: itemText(cmsItems(footer, [])[0], "title") || defaultSiteSettings.motto,
    partnerEmail,
    navLinks: cmsLinks(navigation, defaultSiteSettings.navLinks),
    footerLinks: cmsLinks(getCmsSection(page.content, "footer-links"), defaultSiteSettings.footerLinks),
    watchLinks: cmsLinks(watch, defaultSiteSettings.watchLinks),
  };
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

export function findSponsorBySlug(slug: string, sponsorList: Sponsor[] = seedSponsors): Sponsor | undefined {
  return sponsorList.find((sponsor) => sponsor.slug === slug);
}

export function findPlayerByTag(tag: string, playerList: Player[] = seedPlayers): Player | undefined {
  return playerList.find((player) => player.tag === tag);
}

export async function getPlayerHistory(playerTag: string) {
  const playerEvents = await getEvents();
  const history: Array<{
    event: BaazEvent;
    gameSlug: string;
    placement: string;
    prize?: string;
    characters?: string[];
  }> = [];

  for (const event of playerEvents) {
    if (!event.top8) continue;
    for (const [gameSlug, top8] of Object.entries(event.top8)) {
      const entry = top8?.find((item) => item.player === playerTag);
      if (!entry) continue;
      history.push({
        event,
        gameSlug,
        placement: entry.placement,
        prize: entry.prize,
        characters: entry.characters,
      });
    }
  }

  return history.sort((a, b) => b.event.startDate.localeCompare(a.event.startDate));
}

function asRecord(value: unknown) {
  return (value || {}) as Record<string, unknown>;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value ? value : fallback;
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function toEvent(value: unknown): BaazEvent {
  const row = asRecord(value);
  const startDate = asString(row.startDate, new Date().toISOString());
  const year = startDate ? new Date(startDate).getFullYear().toString() : "";
  const prizePool = asRecord(row.prizePool);

  return {
    slug: asString(row.slug, asString(row.id, "event")),
    name: asString(row.name, "Untitled event"),
    edition: asString(row.edition, year),
    status: asString(row.status, "upcoming") as BaazEvent["status"],
    startDate,
    endDate: asString(row.endDate, startDate),
    venue: asString(row.venue, "TBA"),
    city: asString(row.city, "TBA"),
    country: asString(row.country, "PK"),
    prizePool: {
      pkr: asNumber(prizePool.pkr),
      usd: asNumber(prizePool.usd),
      display: asString(prizePool.display, "TBA"),
    },
    games: asGameSlugs(row.games),
    participants: asNumber(row.participants),
    format: asString(row.format, "TBA"),
    tier: asString(row.tier, undefined as unknown as string),
    organizer: asString(row.organizer, "BAAZ"),
    sponsors: asStringArray(row.sponsors),
    broadcastTalent: asStringArray(row.broadcastTalent),
    liquipedia: asString(row.liquipedia, undefined as unknown as string),
    startggEventId: asString(row.startggEventId, undefined as unknown as string),
    poster: toMediaString(row.poster),
    tagline: asString(row.tagline, undefined as unknown as string),
    top8: asRecord(row.results) as BaazEvent["top8"],
    registrationClosed: typeof row.registrationClosed === "boolean" ? row.registrationClosed : undefined,
    registrationUrl: asString(row.registrationUrl, undefined as unknown as string),
  };
}

function toPlayer(value: unknown): Player {
  const row = asRecord(value);
  return {
    tag: asString(row.tag, "Unknown"),
    slug: asString(row.slug, asString(row.id, "player")),
    realName: asString(row.realName, undefined as unknown as string),
    country: asString(row.country, "PK"),
    team: asString(row.teamId, undefined as unknown as string),
    mains: asRecord(row.mains) as Player["mains"],
    photo: toMediaString(row.photo),
  };
}

function toSponsor(value: unknown): Sponsor {
  const row = asRecord(value);
  return {
    slug: asString(row.slug, asString(row.id, "sponsor")),
    name: asString(row.name, "Sponsor"),
    tier: asString(row.tier, "partner") as SponsorTier,
    url: asString(row.url, undefined as unknown as string),
    logoLight: toMediaString(row.logoLight),
    logoDark: toMediaString(row.logoDark),
  };
}

function toCircuit(value: ApiCircuit): Circuit {
  return {
    slug: asString(value.slug, "ptl-2026"),
    name: asString(value.name, "Pakistan Tekken League"),
    edition: asString(value.edition, "2026"),
    game: asString(value.gameSlug, "tekken-8") as GameSlug,
    status: asString(value.status, "upcoming") as Circuit["status"],
    startDate: asString(value.startDate, ptl2026.startDate),
    endDate: asString(value.endDate, ptl2026.endDate),
    city: asString(value.city, ptl2026.city),
    country: asString(value.country, ptl2026.country),
    tagline: asString(value.tagline, ptl2026.tagline),
    prizePool: { display: asString(value.prizePool?.display, ptl2026.prizePool?.display || "TBA") },
    slots: Array.isArray(value.slots) ? value.slots : ptl2026.slots,
    startggEventId: typeof value.startggEventId === "string" && value.startggEventId ? value.startggEventId : undefined,
  };
}

function asGameSlugs(value: unknown): GameSlug[] {
  const values = asStringArray(value).filter((game): game is GameSlug => ["tekken-7", "tekken-8", "kof-xv", "sf-6", "fatal-fury", "fc-26"].includes(game));
  return values.length ? values : ["tekken-8"];
}

function toMediaString(value: unknown) {
  if (typeof value === "string") return value;
  const row = asRecord(value);
  return asString(row.url, undefined as unknown as string);
}
