"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleSlash,
  Copy,
  FileText,
  GripVertical,
  ImagePlus,
  Images,
  LayoutDashboard,
  Loader2,
  LogOut,
  MousePointer2,
  Newspaper,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Type,
  UploadCloud,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

const apiBase = (process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");
const tokenKey = "baaz-admin-token";

type AdminUser = { id: string; email: string; name?: string; role: string };
type LoginResponse = { accessToken: string; user: AdminUser };
type Row = Record<string, unknown> & { id: string; title?: string; name?: string; slug?: string; updatedAt?: string; createdAt?: string };

type PostTemplate = Row & {
  key: string;
  name: string;
  description?: string;
  defaultEyebrow?: string;
  defaultCtaLabel?: string;
  recommendedSlots?: string[];
  previewKind?: TemplatePreviewKind | string;
  blockOrder?: string[];
  editorGuidance?: string;
  enabled?: boolean;
};

type CmsPost = Row & {
  title: string;
  slug: string;
  templateKey: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  eyebrow?: string;
  excerpt?: string;
  coverImageId?: string;
  publishedAt?: string;
};

type ContentPlacement = Row & {
  title: string;
  pageKey: string;
  slotKey: string;
  targetType: string;
  targetId: string;
  variant: string;
  order: number;
  enabled: boolean;
  visibleFrom?: string;
  visibleUntil?: string;
};

type MediaAsset = Row & {
  filename: string;
  originalName: string;
  mimeType?: string;
  size?: number;
  url: string;
  alt?: string;
  caption?: string;
};

type TabKey =
  | "dashboard"
  | "posts"
  | "pages"
  | "templates"
  | "media"
  | "placements"
  | "events"
  | "players"
  | "sponsors"
  | "ptl"
  | "watch"
  | "about";

type FieldType = "text" | "textarea" | "select" | "checkbox" | "number" | "datetime" | "csv";
type SelectOption = { value: string; label: string };
type FormState = Record<string, string | boolean>;
type PlacementTargetType = "post" | "event" | "player" | "sponsor" | "circuit" | "stream";
type FieldDef = {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: SelectOption[] | ((form: FormState) => SelectOption[]);
  placeholder?: string;
  span?: "full" | "half";
};

type TemplatePreviewKind =
  | "hero"
  | "fullWidth"
  | "results"
  | "player"
  | "sponsor"
  | "video"
  | "news"
  | "ptl"
  | "about"
  | "stats"
  | "imageFeature"
  | "registration";

type TemplateExample = {
  kind: TemplatePreviewKind;
  title: string;
  excerpt: string;
  eyebrow?: string;
  ctaLabel?: string;
  imageLabel?: string;
  body?: string;
  points?: string[];
  stats?: Array<{ value: string; label: string }>;
};

type EditablePostBlockKey = "image" | "eyebrow" | "title" | "excerpt" | "bodyText" | "facts" | "cta";
type ImageAssignment = { formKey: string; fieldKey: string; value?: "id" | "url" };
type SectionItemType = "card" | "stat" | "link" | "timeline";
type PageSectionPreviewKind = "hero" | "stats" | "timeline" | "links" | "cards" | "placeholder";
type SectionStarter = { key: string; label: string; help: string; items: Array<Record<string, string>> };
type VisualEntitySpec = {
  titleKey?: string;
  eyebrowKey?: string;
  excerptKey?: string;
  bodyKey?: string;
  imageKey?: string;
  imageMode?: "id" | "url";
  itemKey?: string;
  heroLabel: string;
};

type EntityConfig = {
  key: string;
  title: string;
  icon: ReactNode;
  endpoint: string;
  rows: Row[];
  fields: FieldDef[];
  defaults: FormState;
  label: (row: Row) => string;
  description?: (row: Row) => string;
  filter?: (row: Row) => boolean;
};

const tabs: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { key: "posts", label: "Posts", icon: <Newspaper size={17} /> },
  { key: "pages", label: "Pages", icon: <LayoutDashboard size={17} /> },
  { key: "templates", label: "Templates", icon: <Sparkles size={17} /> },
  { key: "media", label: "Media", icon: <ImagePlus size={17} /> },
  { key: "placements", label: "Placements", icon: <LayoutDashboard size={17} /> },
  { key: "events", label: "Events", icon: <CalendarDays size={17} /> },
  { key: "players", label: "Players", icon: <Users size={17} /> },
  { key: "sponsors", label: "Sponsors", icon: <ShieldCheck size={17} /> },
  { key: "ptl", label: "PTL 2026", icon: <LayoutDashboard size={17} /> },
  { key: "watch", label: "Watch", icon: <FileText size={17} /> },
  { key: "about", label: "About", icon: <FileText size={17} /> },
];

const tabGroups: Array<{ label: string; keys: TabKey[] }> = [
  { label: "Start", keys: ["dashboard"] },
  { label: "Create", keys: ["posts", "pages", "media"] },
  { label: "Website Tabs", keys: ["ptl", "events", "players", "sponsors", "watch", "about"] },
  { label: "System", keys: ["templates", "placements"] },
];

const tabDescriptions: Record<TabKey, string> = {
  dashboard: "Start here: see what is live, what needs attention, and jump into the right editor.",
  posts: "Create updates, choose a template, upload images, preview, and publish to a page.",
  pages: "Edit the real content sections already used on Home, PTL 2026, Events, Players, Sponsors, Watch, and About.",
  templates: "Control reusable post shapes and editor guidance.",
  media: "Upload and manage images used across the site.",
  placements: "Advanced control for where published content appears.",
  events: "Create and update tournaments, venues, dates, and event cards.",
  players: "Manage player profiles and featured player placements.",
  sponsors: "Manage partners, logos, tiers, and sponsor placements.",
  ptl: "Control PTL 2026 circuit content and page blocks.",
  watch: "Manage streams, VODs, and watch-page content.",
  about: "Manage story, timeline, mission, and contact-page blocks.",
};

const pageOptions = [
  option("site", "Site Shell"),
  option("home", "Home"),
  option("ptl-2026", "PTL 2026"),
  option("events", "Events"),
  option("players", "Players"),
  option("sponsors", "Sponsors"),
  option("watch", "Watch"),
  option("about", "About"),
];

const sectionItemTypeOptions: Array<{ value: SectionItemType; label: string; help: string }> = [
  { value: "card", label: "Card", help: "Use for story, sponsor, or content cards." },
  { value: "stat", label: "Stat", help: "Use for number/value tiles." },
  { value: "link", label: "Link", help: "Use for watch, contact, or CTA rows." },
  { value: "timeline", label: "Timeline", help: "Use for dated milestones or schedule rows." },
];

const heroSlideAccentOptions = [option("neon", "Neon"), option("signal", "Signal"), option("blood", "Blood")];

const heroSlideImageOptions = [
  option("enc-2026", "ENC / National team"),
  option("ptl-stage", "PTL stage"),
  option("takedown-2026", "Takedown 2026"),
];

const pageContentSectionsByPage: Record<string, SelectOption[]> = {
  site: [
    option("brand", "Brand name + tagline"),
    option("navigation", "Main navigation"),
    option("footer", "Footer copy"),
    option("footer-links", "Footer explore links"),
    option("watch-links", "Footer watch links"),
  ],
  home: [
    option("hero-carousel", "Hero carousel slides"),
    option("marquee", "Hero marquee"),
    option("intro", "Intro / Who we are"),
    option("stats", "Stats row"),
    option("ptl-teaser", "PTL teaser"),
    option("legacy-events", "Legacy events heading"),
    option("players-preview", "Players preview heading"),
    option("watch-links", "Watch links"),
  ],
  "ptl-2026": [
    option("intro", "PTL hero"),
    option("hero-stats", "PTL hero stats"),
    option("slots-intro", "Eight slots intro"),
    option("stage-timeline", "Stage timeline"),
    option("bracket-placeholder", "Bracket placeholder"),
    option("standings", "Standings placeholder"),
    option("watch-links", "PTL watch links"),
  ],
  events: [option("intro", "Events intro")],
  players: [option("intro", "Players intro")],
  sponsors: [
    option("intro", "Sponsors hero"),
    option("partner-pitch", "Partner pitch + stats"),
    option("team-organizations", "Team organizations heading"),
    option("broadcast", "Broadcast heading"),
  ],
  watch: [
    option("intro", "Watch intro"),
    option("watch-channels", "Watch channel cards"),
    option("recent-broadcasts", "Recent broadcast cards"),
  ],
  about: [
    option("intro", "About hero"),
    option("timeline", "About timeline"),
    option("mission", "Mission block"),
    option("contact-cards", "Contact cards"),
  ],
};

const renderedPlacementOptions = [
  { pageKey: "home", slotKey: "hero", label: "Home / Hero", targetTypes: ["post", "event", "player", "sponsor", "circuit", "stream"] },
  { pageKey: "home", slotKey: "featured-posts", label: "Home / Updates", targetTypes: ["post", "event", "player", "sponsor", "circuit", "stream"] },
  { pageKey: "ptl-2026", slotKey: "hero", label: "PTL 2026 / Hero", targetTypes: ["post", "circuit"] },
  { pageKey: "ptl-2026", slotKey: "featured-posts", label: "PTL 2026 / Latest posts", targetTypes: ["post"] },
  { pageKey: "ptl-2026", slotKey: "featured", label: "PTL 2026 / Featured", targetTypes: ["post", "circuit"] },
  { pageKey: "ptl-2026", slotKey: "ptl-stages", label: "PTL 2026 / Stage updates", targetTypes: ["post", "circuit"] },
  { pageKey: "ptl-2026", slotKey: "ptl-standings", label: "PTL 2026 / Standings updates", targetTypes: ["post", "circuit"] },
  { pageKey: "events", slotKey: "featured", label: "Events / Featured", targetTypes: ["post", "event"] },
  { pageKey: "players", slotKey: "featured-players", label: "Players / Featured players", targetTypes: ["post", "player"] },
  { pageKey: "sponsors", slotKey: "partner-blocks", label: "Sponsors / Partner updates", targetTypes: ["post", "sponsor"] },
  { pageKey: "watch", slotKey: "vod", label: "Watch / VODs", targetTypes: ["post", "stream"] },
  { pageKey: "about", slotKey: "contact-blocks", label: "About / Contact blocks", targetTypes: ["post", "sponsor"] },
].map((item) => ({ ...item, targetTypes: item.targetTypes as PlacementTargetType[] }));

const slotOptions = Array.from(
  new Map(renderedPlacementOptions.map((item) => [item.slotKey, option(item.slotKey, slotLabel(item.slotKey))])).values()
);

const targetTypeByEntityKey: Record<string, PlacementTargetType> = {
  posts: "post",
  events: "event",
  players: "player",
  sponsors: "sponsor",
  circuits: "circuit",
  streams: "stream",
};

const defaultPlacementByEntityKey: Record<string, { pageKey: string; slotKey: string }> = {
  posts: { pageKey: "home", slotKey: "featured-posts" },
  events: { pageKey: "events", slotKey: "featured" },
  players: { pageKey: "players", slotKey: "featured-players" },
  sponsors: { pageKey: "sponsors", slotKey: "partner-blocks" },
  circuits: { pageKey: "ptl-2026", slotKey: "hero" },
  streams: { pageKey: "watch", slotKey: "vod" },
};

const defaultPlacementByTemplate: Record<string, { pageKey: string; slotKey: string }> = {
  "event-announcement": { pageKey: "events", slotKey: "featured" },
  "results-recap": { pageKey: "home", slotKey: "featured-posts" },
  "player-spotlight": { pageKey: "players", slotKey: "featured-players" },
  "sponsor-announcement": { pageKey: "sponsors", slotKey: "partner-blocks" },
  "broadcast-vod": { pageKey: "watch", slotKey: "vod" },
  "general-news": { pageKey: "home", slotKey: "featured-posts" },
  "ptl-update": { pageKey: "ptl-2026", slotKey: "hero" },
  "about-story-block": { pageKey: "about", slotKey: "contact-blocks" },
  "hero-feature": { pageKey: "home", slotKey: "hero" },
  "full-width-feature": { pageKey: "home", slotKey: "hero" },
  "stats-callout": { pageKey: "home", slotKey: "featured-posts" },
  "image-feature": { pageKey: "home", slotKey: "featured-posts" },
  "registration-alert": { pageKey: "events", slotKey: "featured" },
  "watch-feature": { pageKey: "watch", slotKey: "vod" },
};

const templateExamples: Record<string, TemplateExample> = {
  "event-announcement": {
    kind: "registration",
    eyebrow: "EVENT",
    title: "Stage 1 Registration Opens",
    excerpt: "Announce the date, city, venue, and registration link for an upcoming event.",
    ctaLabel: "Register",
    points: ["Date and city", "Venue or online format", "Registration CTA"],
  },
  "results-recap": {
    kind: "results",
    eyebrow: "RESULTS",
    title: "Top 8 Results Recap",
    excerpt: "Summarize the champion, top placements, and strongest storylines after an event.",
    ctaLabel: "View results",
    points: ["Champion", "Runner-up", "Top 8 notes"],
  },
  "player-spotlight": {
    kind: "player",
    eyebrow: "PLAYER",
    title: "Player Spotlight",
    excerpt: "Feature a player, their recent form, characters, and upcoming matches.",
    ctaLabel: "View player",
    points: ["Main characters", "Recent result", "Next match"],
  },
  "sponsor-announcement": {
    kind: "sponsor",
    eyebrow: "PARTNER",
    title: "New Partner Announcement",
    excerpt: "Introduce a sponsor or organization with approved brand copy and links.",
    ctaLabel: "View partner",
    points: ["Partner name", "Offer or support", "Approved link"],
  },
  "broadcast-vod": {
    kind: "video",
    eyebrow: "WATCH",
    title: "Grand Finals VOD Live",
    excerpt: "Promote a stream, replay, highlight package, or watch link.",
    ctaLabel: "Watch now",
    points: ["Platform", "Episode or match", "Direct link"],
  },
  "general-news": {
    kind: "news",
    eyebrow: "NEWS",
    title: "BAAZ Update",
    excerpt: "Post flexible news that does not fit a specific event, player, partner, or PTL update.",
    ctaLabel: "Read more",
  },
  "ptl-update": {
    kind: "ptl",
    eyebrow: "PTL",
    title: "PTL 2026 Format Revealed",
    excerpt: "Share PTL season, stage, standings, registration, or bracket updates.",
    ctaLabel: "View PTL",
    points: ["Stage", "Points", "Registration"],
  },
  "about-story-block": {
    kind: "about",
    eyebrow: "ABOUT",
    title: "BAAZ Story Update",
    excerpt: "Add a concise brand story, mission, timeline, or contact update.",
    ctaLabel: "Learn more",
  },
  "hero-feature": {
    kind: "hero",
    eyebrow: "FEATURE",
    title: "Featured Announcement",
    excerpt: "Push a high-priority item into a top-of-page area.",
    ctaLabel: "Open",
    imageLabel: "Hero image",
  },
  "full-width-feature": {
    kind: "fullWidth",
    eyebrow: "WHY BAAZ",
    title: "A Captive, Growing Audience.",
    excerpt: "Create a wide editorial block with headline, body copy, CTA, and supporting stat cards.",
    ctaLabel: "Partners@baaz.gg",
    stats: [
      { value: "1,235+", label: "Cumulative entrants" },
      { value: "6", label: "Major events" },
      { value: "06", label: "Countries hosted" },
      { value: "TWT", label: "Circuit signal" },
    ],
  },
  "stats-callout": {
    kind: "stats",
    eyebrow: "NUMBERS",
    title: "Community Growth Snapshot",
    excerpt: "Use this for milestone numbers, season stats, prize pool updates, and sponsor proof points.",
    ctaLabel: "View details",
    stats: [
      { value: "554", label: "Entrants" },
      { value: "3", label: "Games" },
      { value: "Rs58M", label: "Payouts" },
    ],
  },
  "image-feature": {
    kind: "imageFeature",
    eyebrow: "FEATURE",
    title: "Image-Led Story",
    excerpt: "Use a strong cover image with short copy for event moments, announcements, and gallery highlights.",
    ctaLabel: "Open",
    imageLabel: "Cover story",
  },
  "registration-alert": {
    kind: "registration",
    eyebrow: "REGISTRATION",
    title: "Registration Closes Soon",
    excerpt: "A focused CTA post for signup deadlines, bracket check-in, venue notes, or urgent updates.",
    ctaLabel: "Register now",
    points: ["Deadline", "Game or stage", "Signup link"],
  },
  "watch-feature": {
    kind: "video",
    eyebrow: "WATCH",
    title: "Live Broadcast Feature",
    excerpt: "Feature a live stream, VOD playlist, watch party, or episode drop on the Watch tab.",
    ctaLabel: "Watch",
    points: ["Platform", "Start time", "Host channel"],
  },
};

const postBlockLabels: Record<EditablePostBlockKey, string> = {
  image: "Image",
  eyebrow: "Eyebrow",
  title: "Title",
  excerpt: "Excerpt",
  bodyText: "Body",
  facts: "Facts / stats",
  cta: "Button",
};

const defaultEditablePostBlocks: EditablePostBlockKey[] = ["image", "eyebrow", "title", "excerpt", "bodyText", "cta"];
const requiredTemplateBlocks = new Set<EditablePostBlockKey>(["title"]);

const templateKindOptions: Array<{ value: TemplatePreviewKind; label: string; help: string }> = [
  { value: "hero", label: "Hero Feature", help: "Large image-led announcement for top page areas." },
  { value: "fullWidth", label: "Full Width Feature", help: "Wide editorial section with supporting stats." },
  { value: "results", label: "Results Recap", help: "Event result summary with placement rows." },
  { value: "player", label: "Player Spotlight", help: "Portrait/profile layout for player stories." },
  { value: "sponsor", label: "Sponsor Block", help: "Partner announcement with approved brand copy." },
  { value: "video", label: "Watch / VOD", help: "Stream, VOD, replay, or broadcast promotion." },
  { value: "news", label: "General News", help: "Flexible update card for regular posts." },
  { value: "ptl", label: "PTL Update", help: "Season, bracket, points, or stage update." },
  { value: "about", label: "About / Story", help: "Mission, timeline, contact, or brand story." },
  { value: "stats", label: "Stats Callout", help: "Milestone numbers and proof-point cards." },
  { value: "imageFeature", label: "Image Feature", help: "Strong cover image with compact story copy." },
  { value: "registration", label: "Registration Alert", help: "Signup, deadline, venue, or check-in update." },
];

const advancedSummary = "Advanced options";

const placeableEntityKeys = new Set(Object.keys(targetTypeByEntityKey));

const placementFieldDefaults = {
  placementEnabled: true,
  placementPageKey: "",
  placementSlotKey: "",
  placementOrder: "0",
  placementVisibleFrom: "",
  placementVisibleUntil: "",
};

const placeableSyntheticFieldKeys = Object.keys(placementFieldDefaults);

const pageLabel = (pageKey: string) => pageOptions.find((page) => page.value === pageKey)?.label || pageKey;

function slotLabel(slotKey: string) {
  const labels: Record<string, string> = {
    hero: "Hero",
    featured: "Featured",
    "featured-posts": "Featured posts",
    "featured-players": "Featured players",
    "partner-blocks": "Partner blocks",
    "ptl-stages": "PTL stages",
    "ptl-standings": "PTL standings",
    "contact-blocks": "Contact blocks",
    timeline: "Timeline",
    intro: "Intro",
    vod: "VODs",
  };

  return labels[slotKey] || slotKey;
}

function tabForPageKey(pageKey: string): TabKey {
  const map: Record<string, TabKey> = {
    home: "pages",
    "ptl-2026": "ptl",
    events: "events",
    players: "players",
    sponsors: "sponsors",
    watch: "watch",
    about: "about",
  };
  return map[pageKey] || "pages";
}

function publicPathForPageKey(pageKey: string) {
  const map: Record<string, string> = {
    home: "/",
    "ptl-2026": "/ptl-2026",
    events: "/events",
    players: "/players",
    sponsors: "/sponsors",
    watch: "/watch",
    about: "/about",
  };
  return map[pageKey] || "/";
}

function placementHelp(pageKey: string, slotKey: string) {
  const help: Record<string, string> = {
    "home/hero": "Top hero position on the homepage.",
    "home/featured-posts": "Homepage update cards below the intro.",
    "ptl-2026/hero": "Main PTL 2026 hero area.",
    "ptl-2026/featured-posts": "Latest PTL update cards.",
    "ptl-2026/featured": "Featured PTL story block.",
    "ptl-2026/ptl-stages": "PTL stage and calendar updates.",
    "ptl-2026/ptl-standings": "PTL standings and points-race updates.",
    "events/featured": "Featured event card area.",
    "players/featured-players": "Featured player area.",
    "sponsors/partner-blocks": "Sponsor and partner update area.",
    "watch/vod": "Watch page stream or VOD area.",
    "about/contact-blocks": "About page contact and story card area.",
  };

  return help[`${pageKey}/${slotKey}`] || "Approved public page area.";
}

function placementOptionsFor(targetType: PlacementTargetType, pageKey?: string) {
  return renderedPlacementOptions.filter((item) => item.targetTypes.includes(targetType) && (!pageKey || item.pageKey === pageKey));
}

function slotOptionsFor(targetType: PlacementTargetType, pageKey: string) {
  const options = placementOptionsFor(targetType, pageKey).map((item) => option(item.slotKey, slotLabel(item.slotKey)));
  return options.length ? options : slotOptions;
}

function defaultPlacementFor(entityKey: string, templateKey?: string) {
  if (entityKey === "posts" && templateKey && defaultPlacementByTemplate[templateKey]) return defaultPlacementByTemplate[templateKey];
  return defaultPlacementByEntityKey[entityKey] || { pageKey: "home", slotKey: "featured-posts" };
}

function readablePlacement(pageKey?: string | boolean, slotKey?: string | boolean) {
  const page = String(pageKey || "");
  const slot = String(slotKey || "");
  if (!page && !slot) return "Not placed yet";
  return `${pageLabel(page)} / ${slotLabel(slot)}`;
}

function recommendedPlacementLabels(template: PostTemplate) {
  const fallback = defaultPlacementFor("posts", template.key);
  const raw = Array.isArray(template.recommendedSlots) ? template.recommendedSlots.map(String) : [];
  const normalized = raw
    .map((slot) => normalizeRecommendedSlot(slot, template.key))
    .filter((item): item is { pageKey: string; slotKey: string } => Boolean(item))
    .slice(0, 3);

  const labels = normalized.length ? normalized : [fallback];
  return labels.map((item) => readablePlacement(item.pageKey, item.slotKey));
}

function normalizeRecommendedSlot(slot: string, templateKey: string) {
  const clean = slot.toLowerCase().trim();
  const templateDefault = defaultPlacementFor("posts", templateKey);
  const [pageCandidate, slotCandidate] = clean.includes("/") ? clean.split("/") : clean.split(":");
  if (pageCandidate && slotCandidate) {
    const match = renderedPlacementOptions.find((item) => item.pageKey === pageCandidate && item.slotKey === slotCandidate);
    if (match) return { pageKey: match.pageKey, slotKey: match.slotKey };
  }

  const aliases: Record<string, { pageKey: string; slotKey: string }> = {
    "hero-carousel": { pageKey: "home", slotKey: "hero" },
    "ptl-hero": { pageKey: "ptl-2026", slotKey: "hero" },
    "featured-events": { pageKey: "events", slotKey: "featured" },
    "featured-players": { pageKey: "players", slotKey: "featured-players" },
    "partner-tiers": { pageKey: "sponsors", slotKey: "partner-blocks" },
    "stream-block": { pageKey: "watch", slotKey: "vod" },
    "featured-vods": { pageKey: "watch", slotKey: "vod" },
    "watch-ctas": { pageKey: "watch", slotKey: "vod" },
    "about-timeline": { pageKey: "about", slotKey: "contact-blocks" },
    "about-mission": { pageKey: "about", slotKey: "contact-blocks" },
    "related-posts": templateDefault,
    "archive-cards": templateDefault,
  };

  if (aliases[clean]) return aliases[clean];
  const optionMatch = renderedPlacementOptions.find((item) => item.slotKey === clean);
  return optionMatch ? { pageKey: optionMatch.pageKey, slotKey: optionMatch.slotKey } : undefined;
}

const emptyForms: Record<string, FormState> = {
  posts: {
    title: "",
    slug: "",
    templateKey: "",
    status: "DRAFT",
    eyebrow: "",
    excerpt: "",
    coverImageId: "",
    bodyText: "",
    itemsText: "",
    ctaLabel: "",
    ctaHref: "",
    templateBlockOrder: "",
    relatedEventId: "",
    relatedPlayerId: "",
    relatedSponsorId: "",
    relatedCircuitId: "",
    publishedAt: "",
    ...placementFieldDefaults,
    placementEnabled: true,
    placementPageKey: "ptl-2026",
    placementSlotKey: "hero",
  },
  templates: {
    key: "",
    name: "",
    description: "",
    defaultEyebrow: "",
    defaultCtaLabel: "",
    recommendedSlots: "",
    previewKind: "news",
    blockOrder: "",
    editorGuidance: "",
    enabled: true,
  },
  placements: {
    title: "",
    pageKey: "home",
    slotKey: "hero",
    targetType: "post",
    targetId: "",
    variant: "default",
    order: "0",
    enabled: true,
    visibleFrom: "",
    visibleUntil: "",
  },
  events: {
    name: "",
    slug: "",
    edition: "",
    tagline: "",
    status: "upcoming",
    enabled: true,
    startDate: "",
    endDate: "",
    venue: "",
    city: "",
    country: "",
    participants: "",
    format: "",
    tier: "",
    organizer: "BAAZ",
    prizePoolDisplay: "",
    prizePoolPkr: "",
    prizePoolUsd: "",
    games: "",
    sponsors: "",
    broadcastTalent: "",
    liquipedia: "",
    posterUrl: "",
    galleryUrls: "",
    recapVideo: "",
    startggEventId: "",
    ...placementFieldDefaults,
    placementPageKey: "events",
    placementSlotKey: "featured",
  },
  players: {
    tag: "",
    slug: "",
    realName: "",
    country: "PK",
    teamId: "",
    enabled: true,
    photoUrl: "",
    mainsText: "",
    socialsText: "",
    ...placementFieldDefaults,
    placementPageKey: "players",
    placementSlotKey: "featured-players",
  },
  sponsors: {
    name: "",
    slug: "",
    tier: "partner",
    url: "",
    enabled: true,
    logoLightUrl: "",
    logoDarkUrl: "",
    ...placementFieldDefaults,
    placementPageKey: "sponsors",
    placementSlotKey: "partner-blocks",
  },
  circuits: {
    name: "",
    slug: "ptl-2026",
    edition: "2026",
    gameSlug: "tekken-8",
    status: "upcoming",
    enabled: true,
    startDate: "",
    endDate: "",
    city: "",
    country: "PK",
    tagline: "",
    prizePoolDisplay: "",
    prizePoolPkr: "",
    prizePoolUsd: "",
    slotsText: "",
    pointsRules: "",
    registrationOpen: false,
    registrationUrl: "",
    startggEventId: "",
    ...placementFieldDefaults,
    placementPageKey: "ptl-2026",
    placementSlotKey: "hero",
  },
  streams: {
    title: "",
    platform: "youtube",
    channel: "",
    url: "",
    scheduledStart: "",
    isLive: false,
    enabled: true,
    eventId: "",
    ...placementFieldDefaults,
    placementPageKey: "watch",
    placementSlotKey: "vod",
  },
  pageContent: {
    pageKey: "home",
    sectionKey: "intro",
    title: "",
    eyebrow: "",
    bodyText: "",
    itemsText: "",
    imageId: "",
    ctaLabel: "",
    ctaHref: "",
    variant: "default",
    order: "0",
    enabled: true,
    visibleFrom: "",
    visibleUntil: "",
  },
};

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("admin@baaz.gg");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [selectedIds, setSelectedIds] = useState<Record<string, string | null>>({});
  const [forms, setForms] = useState<Record<string, FormState>>(emptyForms);
  const [rows, setRows] = useState<Record<string, Row[]>>({
    posts: [],
    templates: [],
    placements: [],
    events: [],
    players: [],
    sponsors: [],
    circuits: [],
    streams: [],
    pageContent: [],
    media: [],
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [filters, setFilters] = useState({ search: "", page: "all", status: "all", template: "all", slot: "all" });
  const [dirtyKeys, setDirtyKeys] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasUnsavedChanges = Object.values(dirtyKeys).some(Boolean);

  useEffect(() => {
    const savedToken = window.localStorage.getItem(tokenKey);
    if (!savedToken) {
      setLoading(false);
      return;
    }

    void restoreSession(savedToken);
  }, []);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const templates = rows.templates as PostTemplate[];
    const selectedTemplate = templates.find((template) => template.key === forms.posts.templateKey);

    if (templates.length && !forms.posts.templateKey) {
      const firstTemplate = templates[0];
      const placement = defaultPlacementFor("posts", firstTemplate.key);
      setFormValue("posts", {
        templateKey: firstTemplate.key,
        eyebrow: firstTemplate.defaultEyebrow || "",
        ctaLabel: firstTemplate.defaultCtaLabel || "",
        templateBlockOrder: defaultPostBlockOrder(firstTemplate).join(","),
        placementEnabled: true,
        placementPageKey: placement.pageKey,
        placementSlotKey: placement.slotKey,
      }, { dirty: false });
      return;
    }

    if (!selectedTemplate || selectedIds.posts) return;

    const next: FormState = {};
    if (!forms.posts.eyebrow && selectedTemplate.defaultEyebrow) next.eyebrow = selectedTemplate.defaultEyebrow;
    if (!forms.posts.ctaLabel && selectedTemplate.defaultCtaLabel) next.ctaLabel = selectedTemplate.defaultCtaLabel;
    if (!forms.posts.templateBlockOrder) next.templateBlockOrder = defaultPostBlockOrder(selectedTemplate).join(",");
    const placement = defaultPlacementFor("posts", selectedTemplate.key);
    next.placementEnabled = true;
    next.placementPageKey = placement.pageKey;
    next.placementSlotKey = placement.slotKey;

    if (Object.keys(next).length > 0) setFormValue("posts", next, { dirty: false });
  }, [forms.posts.ctaLabel, forms.posts.eyebrow, forms.posts.templateBlockOrder, forms.posts.templateKey, rows.templates, selectedIds.posts]);

  const mediaOptions = useMemo(
    () => [option("", "No image"), ...rows.media.map((asset) => option(asset.id, String(asset.originalName || asset.filename || asset.id)))],
    [rows.media]
  );

  const entityOptions = useMemo(
    () => ({
      post: rows.posts.filter((row) => row.status === "PUBLISHED").map((row) => option(row.id, String(row.title || row.slug || row.id))),
      event: rows.events.map((row) => option(row.id, String(row.name || row.slug || row.id))),
      player: rows.players.map((row) => option(row.id, String(row.tag || row.slug || row.id))),
      sponsor: rows.sponsors.map((row) => option(row.id, String(row.name || row.slug || row.id))),
      circuit: rows.circuits.map((row) => option(row.id, String(row.name || row.slug || row.id))),
      stream: rows.streams.map((row) => option(row.id, String(row.title || row.url || row.id))),
    }),
    [rows]
  );

  const fieldSets = useMemo(
    () => ({
      posts: [
        textField("title", "Title", true),
        textField("slug", "Slug"),
        selectField("templateKey", "Template", () =>
          (rows.templates as PostTemplate[]).filter((template) => template.enabled !== false).map((template) => option(template.key, template.name))
        ),
        selectField("status", "Status", [option("DRAFT", "Draft"), option("PUBLISHED", "Published"), option("ARCHIVED", "Archived")]),
        textField("eyebrow", "Eyebrow"),
        selectField("coverImageId", "Cover image", mediaOptions),
        textareaField("excerpt", "Excerpt"),
        textareaField("bodyText", "Post body"),
        textField("ctaLabel", "Button label"),
        textField("ctaHref", "Button link"),
        selectField("relatedEventId", "Related event", [option("", "None"), ...entityOptions.event]),
        selectField("relatedPlayerId", "Related player", [option("", "None"), ...entityOptions.player]),
        selectField("relatedSponsorId", "Related sponsor", [option("", "None"), ...entityOptions.sponsor]),
        selectField("relatedCircuitId", "Related circuit", [option("", "None"), ...entityOptions.circuit]),
        datetimeField("publishedAt", "Publish date"),
        checkboxField("placementEnabled", "Show this post on a page"),
        selectField("placementPageKey", "Show on page", pageOptions),
        selectField("placementSlotKey", "Page area", slotOptions),
        numberField("placementOrder", "Placement order"),
      ],
      templates: [
        textField("key", "Template key", true),
        textField("name", "Name", true),
        textareaField("description", "Description"),
        textField("defaultEyebrow", "Default eyebrow"),
        textField("defaultCtaLabel", "Default CTA label"),
        csvField("recommendedSlots", "Recommended page areas"),
        selectField("previewKind", "Template style", templateKindOptions.map((kind) => option(kind.value, kind.label))),
        csvField("blockOrder", "Allowed canvas blocks"),
        textareaField("editorGuidance", "Editor guidance"),
        checkboxField("enabled", "Enabled"),
      ],
      placements: [
        textField("title", "Title", true),
        selectField("pageKey", "Page", pageOptions),
        selectField("slotKey", "Slot", slotOptions),
        selectField("targetType", "Target type", [
          option("post", "Post"),
          option("event", "Event"),
          option("player", "Player"),
          option("sponsor", "Sponsor"),
          option("circuit", "PTL / Circuit"),
          option("stream", "Stream / VOD"),
        ]),
        selectField("targetId", "Target", (form) => [option("", "Select target"), ...(entityOptions[String(form.targetType) as keyof typeof entityOptions] || [])]),
        textField("variant", "Variant"),
        numberField("order", "Order"),
        checkboxField("enabled", "Enabled"),
        datetimeField("visibleFrom", "Visible from"),
        datetimeField("visibleUntil", "Visible until"),
      ],
      events: [
        textField("name", "Name", true),
        textField("slug", "Slug"),
        textField("edition", "Edition"),
        textField("tagline", "Tagline"),
        selectField("status", "Status", [option("upcoming", "Upcoming"), option("live", "Live"), option("past", "Past"), option("draft", "Draft"), option("archived", "Archived")]),
        checkboxField("enabled", "Enabled"),
        datetimeField("startDate", "Start date"),
        datetimeField("endDate", "End date"),
        textField("venue", "Venue"),
        textField("city", "City"),
        textField("country", "Country"),
        numberField("participants", "Participants"),
        textField("format", "Format"),
        textField("tier", "Tier"),
        textField("organizer", "Organizer"),
        textField("prizePoolDisplay", "Prize pool"),
        numberField("prizePoolPkr", "Prize PKR"),
        numberField("prizePoolUsd", "Prize USD"),
        csvField("games", "Games"),
        csvField("sponsors", "Sponsor names"),
        csvField("broadcastTalent", "Broadcast talent"),
        textField("liquipedia", "Liquipedia URL"),
        textField("posterUrl", "Poster image"),
        csvField("galleryUrls", "Gallery images"),
        textField("recapVideo", "Recap video URL"),
        textField("startggEventId", "start.gg event ID"),
      ],
      players: [
        textField("tag", "Tag", true),
        textField("slug", "Slug"),
        textField("realName", "Real name"),
        textField("country", "Country"),
        textField("teamId", "Team"),
        checkboxField("enabled", "Enabled"),
        textField("photoUrl", "Player photo"),
        textareaField("mainsText", "Mains"),
        textareaField("socialsText", "Social links"),
      ],
      sponsors: [
        textField("name", "Name", true),
        textField("slug", "Slug"),
        selectField("tier", "Tier", [
          option("title", "Title"),
          option("gold", "Gold"),
          option("silver", "Silver"),
          option("partner", "Partner"),
          option("broadcast", "Broadcast"),
          option("team", "Team"),
        ]),
        textField("url", "URL"),
        checkboxField("enabled", "Enabled"),
        textField("logoLightUrl", "Main logo"),
        textField("logoDarkUrl", "Alternate logo"),
      ],
      circuits: [
        textField("name", "Name", true),
        textField("slug", "Slug", true),
        textField("edition", "Edition"),
        textField("gameSlug", "Game"),
        selectField("status", "Status", [option("upcoming", "Upcoming"), option("live", "Live"), option("past", "Past"), option("draft", "Draft"), option("archived", "Archived")]),
        checkboxField("enabled", "Enabled"),
        datetimeField("startDate", "Start date"),
        datetimeField("endDate", "End date"),
        textField("city", "City"),
        textField("country", "Country"),
        textField("tagline", "Tagline"),
        textField("prizePoolDisplay", "Prize pool"),
        numberField("prizePoolPkr", "Prize PKR"),
        numberField("prizePoolUsd", "Prize USD"),
        textareaField("slotsText", "Slots"),
        textareaField("pointsRules", "Points rules"),
        checkboxField("registrationOpen", "Registration open"),
        textField("registrationUrl", "Registration URL"),
        textField("startggEventId", "start.gg event slug (e.g. tournament/xyz/event/singles) - shows live standings when set"),
      ],
      streams: [
        textField("title", "Title", true),
        selectField("platform", "Platform", [option("twitch", "Twitch"), option("youtube", "YouTube"), option("startgg", "start.gg"), option("other", "Other")]),
        textField("channel", "Channel"),
        textField("url", "URL"),
        datetimeField("scheduledStart", "Scheduled start"),
        checkboxField("isLive", "Live now"),
        checkboxField("enabled", "Enabled"),
        selectField("eventId", "Related event", [option("", "None"), ...entityOptions.event]),
      ],
      pageContent: [
        selectField("pageKey", "Page", pageOptions),
        selectField("sectionKey", "Section", (form) => pageContentSectionOptions(String(form.pageKey || "home"))),
        textField("title", "Title"),
        textField("eyebrow", "Eyebrow"),
        textareaField("bodyText", "Body"),
        textareaField("itemsText", "Section blocks"),
        selectField("imageId", "Image", mediaOptions),
        textField("ctaLabel", "Button label"),
        textField("ctaHref", "Button link"),
        textField("variant", "Variant"),
        numberField("order", "Order"),
        checkboxField("enabled", "Enabled"),
        datetimeField("visibleFrom", "Visible from"),
        datetimeField("visibleUntil", "Visible until"),
      ],
    }),
    [entityOptions, mediaOptions, rows.templates]
  );

  const configs: Record<string, EntityConfig> = {
    posts: config("posts", "Posts", <Newspaper size={18} />, "/posts", rows.posts, fieldSets.posts, emptyForms.posts, (row) => String(row.title || row.slug || row.id), (row) => `${row.status || "DRAFT"} / ${row.templateKey || "template"}`),
    templates: config("templates", "Templates", <Sparkles size={18} />, "/post-templates", rows.templates, fieldSets.templates, emptyForms.templates, (row) => String(row.name || row.key || row.id), (row) => `${row.key || ""}${row.enabled === false ? " / disabled" : ""}`),
    placements: config("placements", "Placements", <LayoutDashboard size={18} />, "/placements", rows.placements, fieldSets.placements, emptyForms.placements, (row) => String(row.title || row.id), (row) => `${row.pageKey || ""} / ${row.slotKey || ""} / ${row.targetType || ""}`),
    events: config("events", "Events", <CalendarDays size={18} />, "/events", rows.events, fieldSets.events, emptyForms.events, (row) => String(row.name || row.slug || row.id), (row) => `${row.status || "upcoming"} / ${row.city || "city"}`),
    players: config("players", "Players", <Users size={18} />, "/players", rows.players, fieldSets.players, emptyForms.players, (row) => String(row.tag || row.slug || row.id), (row) => `${row.country || "country"}${row.realName ? ` / ${row.realName}` : ""}`),
    sponsors: config("sponsors", "Sponsors", <ShieldCheck size={18} />, "/sponsors", rows.sponsors, fieldSets.sponsors, emptyForms.sponsors, (row) => String(row.name || row.slug || row.id), (row) => String(row.tier || "partner")),
    circuits: config("circuits", "PTL / Circuits", <LayoutDashboard size={18} />, "/circuits", rows.circuits, fieldSets.circuits, emptyForms.circuits, (row) => String(row.name || row.slug || row.id), (row) => `${row.edition || ""} / ${row.status || "upcoming"}`),
    streams: config("streams", "Streams / VODs", <FileText size={18} />, "/streams", rows.streams, fieldSets.streams, emptyForms.streams, (row) => String(row.title || row.url || row.id), (row) => `${row.platform || "platform"}${row.isLive ? " / live" : ""}`),
    pageContent: config("pageContent", "Page Content Blocks", <FileText size={18} />, "/page-content", rows.pageContent, fieldSets.pageContent, emptyForms.pageContent, (row) => String(row.title || row.sectionKey || row.id), (row) => `${row.pageKey || ""} / ${row.sectionKey || ""}`),
  };

  async function restoreSession(savedToken: string) {
    try {
      const me = await api<AdminUser>("/me", {}, savedToken);
      setToken(savedToken);
      setUser(me);
      await loadData(savedToken);
    } catch {
      window.localStorage.removeItem(tokenKey);
    } finally {
      setLoading(false);
    }
  }

  async function api<T>(path: string, init: RequestInit = {}, authToken = token): Promise<T> {
    const headers = new Headers(init.headers);
    const hasFormData = init.body instanceof FormData;

    if (!hasFormData && init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

    const response = await fetch(`${apiBase}${path}`, { ...init, headers });
    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401) logout();
      const detail = apiErrorMessage(data, response.status);
      throw new Error(detail);
    }

    return data as T;
  }

  async function loadData(authToken = token) {
    if (!authToken) return;
    const [templates, posts, placements, events, players, sponsors, circuits, streams, pageContent, media] = await Promise.all([
      api<Row[]>("/post-templates", {}, authToken),
      api<Row[]>("/posts", {}, authToken),
      api<Row[]>("/placements", {}, authToken),
      api<Row[]>("/events", {}, authToken),
      api<Row[]>("/players", {}, authToken),
      api<Row[]>("/sponsors", {}, authToken),
      api<Row[]>("/circuits", {}, authToken),
      api<Row[]>("/streams", {}, authToken),
      api<Row[]>("/page-content", {}, authToken),
      api<Row[]>("/media", {}, authToken),
    ]);
    setRows({ templates, posts, placements, events, players, sponsors, circuits, streams, pageContent, media });
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runTask(async () => {
      const login = await api<LoginResponse>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) },
        null
      );
      window.localStorage.setItem(tokenKey, login.accessToken);
      setToken(login.accessToken);
      setUser(login.user);
      setPassword("");
      await loadData(login.accessToken);
      setMessage("Signed in.");
    }, "Could not sign in.");
  }

  async function saveEntity(config: EntityConfig, formOverrides: FormState = {}) {
    await runTask(async () => {
      const workingForm = { ...forms[config.key], ...formOverrides };
      const validationErrors = validateEntityForm(config, workingForm);
      if (validationErrors.length > 0) throw new Error(validationErrors.join(" "));
      const payload = buildPayload(config.key, config.fields, workingForm);
      const selectedId = selectedIds[config.key];
      const row = selectedId
        ? await api<Row>(`${config.endpoint}/${selectedId}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await api<Row>(config.endpoint, { method: "POST", body: JSON.stringify(payload) });

      if (placeableEntityKeys.has(config.key)) {
        await saveContentPlacement(config.key, row, workingForm);
      }

      setSelectedIds((current) => ({ ...current, [config.key]: row.id }));
      setForms((current) => ({
        ...current,
        [config.key]: savedRowToForm(config, row, workingForm, rows.placements),
      }));
      await loadData();
      setDirtyKeys((current) => ({ ...current, [config.key]: false }));
      setMessage(`${config.title.slice(0, -1) || config.title} saved.`);
    }, `Could not save ${config.title.toLowerCase()}.`);
  }

  async function saveContentPlacement(entityKey: string, row: Row, form: FormState) {
    const targetType = targetTypeByEntityKey[entityKey];
    if (!targetType) return;

    const matchingPlacements = rows.placements.filter((placement) => placement.targetType === targetType && placement.targetId === row.id);

    if (!form.placementEnabled) {
      await Promise.all(
        matchingPlacements
          .filter((placement) => placement.enabled)
          .map((placement) => api<Row>(`/placements/${placement.id}`, { method: "PATCH", body: JSON.stringify({ enabled: false }) }))
      );
      return;
    }

    const defaults = defaultPlacementFor(entityKey, entityKey === "posts" ? String(form.templateKey || "") : undefined);
    const pageKey = String(form.placementPageKey || defaults.pageKey);
    const slotKey = String(form.placementSlotKey || defaults.slotKey);
    const existing = matchingPlacements.find((placement) => placement.pageKey === pageKey && placement.slotKey === slotKey) || matchingPlacements[0];
    const payload = {
      title: previewTitle(entityKey, form, row),
      pageKey,
      slotKey,
      targetType,
      targetId: row.id,
      variant: entityKey === "posts" ? String(form.templateKey || "default") : "default",
      order: Number(form.placementOrder || 0),
      enabled: true,
      visibleFrom: form.placementVisibleFrom || undefined,
      visibleUntil: form.placementVisibleUntil || undefined,
    };

    if (existing) {
      await api<Row>(`/placements/${existing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      await api<Row>("/placements", { method: "POST", body: JSON.stringify(payload) });
    }
  }

  async function deleteEntity(config: EntityConfig, row: Row) {
    if (!window.confirm(`Delete "${config.label(row)}"?`)) return;
    await runTask(async () => {
      await api<Row>(`${config.endpoint}/${row.id}`, { method: "DELETE" });
      if (selectedIds[config.key] === row.id) resetForm(config.key);
      await loadData();
      setMessage("Deleted.");
    }, `Could not delete ${config.title.toLowerCase()}.`);
  }

  async function updatePostStatus(post: CmsPost, status: CmsPost["status"]) {
    await runTask(async () => {
      await api<CmsPost>(`/posts/${post.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          publishedAt: status === "PUBLISHED" ? post.publishedAt || new Date().toISOString() : undefined,
        }),
      });
      await loadData();
      setMessage(`Post moved to ${status.toLowerCase()}.`);
    }, "Could not update post status.");
  }

  async function togglePlacement(placement: ContentPlacement) {
    await runTask(async () => {
      await api<Row>(`/placements/${placement.id}`, {
        method: "PATCH",
        body: JSON.stringify({ enabled: !placement.enabled }),
      });
      await loadData();
      setMessage(placement.enabled ? "Placement disabled." : "Placement enabled.");
    }, "Could not update placement.");
  }

  async function reorderPlacements(orderedRows: Row[]) {
    await runTask(async () => {
      await Promise.all(
        orderedRows.map((placement, index) =>
          api<Row>(`/placements/${placement.id}`, {
            method: "PATCH",
            body: JSON.stringify({ order: index }),
          })
        )
      );
      await loadData();
      setMessage("Placement order saved.");
    }, "Could not reorder placements.");
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await uploadSelectedImage();
  }

  async function uploadSelectedImage(assignTo?: ImageAssignment) {
    if (!uploadFile) {
      setError("Choose an image first.");
      return;
    }

    await uploadImageFile(uploadFile, assignTo, uploadAlt, uploadCaption);
  }

  async function uploadImageFile(file: File, assignTo?: ImageAssignment, alt = "", caption = "") {
    await runTask(async () => {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", alt);
      form.append("caption", caption);
      const asset = await api<MediaAsset>("/media/upload", { method: "POST", body: form });
      setUploadFile(null);
      setUploadAlt("");
      setUploadCaption("");
      if (assignTo) setFormValue(assignTo.formKey, { [assignTo.fieldKey]: assignTo.value === "url" ? asset.url : asset.id });
      await loadData();
      setMessage("Image uploaded.");
    }, "Could not upload image.");
  }

  async function updateMedia(asset: MediaAsset) {
    await runTask(async () => {
      await api<MediaAsset>(`/media/asset/${asset.id}`, {
        method: "PATCH",
        body: JSON.stringify({ alt: asset.alt || "", caption: asset.caption || "" }),
      });
      await loadData();
      setMessage("Image metadata updated.");
    }, "Could not update image.");
  }

  async function deleteMedia(asset: MediaAsset) {
    if (!window.confirm(`Delete image "${asset.originalName}"?`)) return;
    await runTask(async () => {
      await api<MediaAsset>(`/media/asset/${asset.id}`, { method: "DELETE" });
      await loadData();
      setMessage("Image deleted.");
    }, "Could not delete image.");
  }

  async function runTask(action: () => Promise<void>, fallbackError: string) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
    } catch (taskError) {
      setError(taskError instanceof Error ? taskError.message : fallbackError);
    } finally {
      setBusy(false);
    }
  }

  function selectEntity(config: EntityConfig, row: Row) {
    setSelectedIds((current) => ({ ...current, [config.key]: row.id }));
    setForms((current) => ({ ...current, [config.key]: rowToForm(row, config.fields, config.defaults, config.key, rows.placements) }));
    setDirtyKeys((current) => ({ ...current, [config.key]: false }));
  }

  function resetForm(key: string, overrides: FormState = {}) {
    setSelectedIds((current) => ({ ...current, [key]: null }));
    setForms((current) => ({ ...current, [key]: { ...emptyForms[key], ...overrides } }));
    setDirtyKeys((current) => ({ ...current, [key]: false }));
  }

  function setFormValue(key: string, patch: FormState, options: { dirty?: boolean } = {}) {
    setForms((current) => {
      const nextPatch = { ...patch };
      if (key === "pageContent" && typeof patch.pageKey === "string") {
        const sections = pageContentSectionOptions(patch.pageKey);
        const currentSection = String(current.pageContent?.sectionKey || "");
        if (!sections.some((section) => section.value === currentSection)) {
          nextPatch.sectionKey = sections[0]?.value || "intro";
        }
      }
      const changed = Object.entries(nextPatch).some(([patchKey, value]) => current[key]?.[patchKey] !== value);
      if (changed && options.dirty !== false) {
        setDirtyKeys((dirtyCurrent) => ({ ...dirtyCurrent, [key]: true }));
      }
      return { ...current, [key]: { ...current[key], ...nextPatch } };
    });
  }

  function selectPostTemplate(template: PostTemplate) {
    const templates = rows.templates as PostTemplate[];
    const previousTemplate = templates.find((item) => item.key === forms.posts.templateKey);
    const shouldUseTemplateEyebrow = !forms.posts.eyebrow || forms.posts.eyebrow === previousTemplate?.defaultEyebrow;
    const shouldUseTemplateCta = !forms.posts.ctaLabel || forms.posts.ctaLabel === previousTemplate?.defaultCtaLabel;
    const placement = defaultPlacementFor("posts", template.key);
    setFormValue("posts", {
      templateKey: template.key,
      eyebrow: shouldUseTemplateEyebrow ? template.defaultEyebrow || "" : forms.posts.eyebrow,
      ctaLabel: shouldUseTemplateCta ? template.defaultCtaLabel || "" : forms.posts.ctaLabel,
      templateBlockOrder: defaultPostBlockOrder(template).join(","),
      placementEnabled: true,
      placementPageKey: placement.pageKey,
      placementSlotKey: placement.slotKey,
    });
    setDirtyKeys((current) => ({ ...current, posts: true }));
  }

  function logout() {
    window.localStorage.removeItem(tokenKey);
    setToken(null);
    setUser(null);
    setDirtyKeys({});
    setRows({ posts: [], templates: [], placements: [], events: [], players: [], sponsors: [], circuits: [], streams: [], pageContent: [], media: [] });
  }

  const filteredPosts = filterRows(rows.posts, filters).filter((row) => {
    if (filters.status !== "all" && row.status !== filters.status) return false;
    if (filters.template !== "all" && row.templateKey !== filters.template) return false;
    return true;
  });
  const filteredPlacements = filterRows(rows.placements, filters).filter((row) => {
    if (filters.page !== "all" && row.pageKey !== filters.page) return false;
    if (filters.slot !== "all" && row.slotKey !== filters.slot) return false;
    return true;
  });
  const activeTabMeta = tabs.find((tab) => tab.key === activeTab) || tabs[0];

  if (loading) {
    return (
      <main className="grid min-h-dvh place-items-center bg-void px-5 text-bone">
        <Loader2 className="h-8 w-8 animate-spin text-neon" aria-label="Loading admin dashboard" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="grid min-h-dvh place-items-center bg-void px-5 py-12 text-bone">
        <section className="w-full max-w-md border border-stone-3 bg-stone/90 p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center border border-neon/70 bg-neon text-void">
              <ShieldCheck size={22} aria-hidden />
            </div>
            <div>
              <h1 className="display text-4xl text-bone">BAAZ Admin</h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">Content control</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-8 grid gap-5">
            <Field label="Email">
              <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} required />
            </Field>
            <Field label="Password">
              <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} required />
            </Field>
            {error && <StatusMessage tone="error" text={error} />}
            <button type="submit" disabled={busy} className={primaryButtonClass}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck size={16} />}
              Sign in
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-void text-bone">
      <header className="sticky top-0 z-30 border-b border-stone-3 bg-void/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center border border-neon bg-neon text-void">
              <LayoutDashboard size={20} aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-normal text-bone">BAAZ Admin</h1>
              <p className="truncate text-xs text-ash">
                {activeTabMeta.label} / {user.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void loadData()} disabled={busy} className={secondaryButtonClass}>
              <RefreshCw size={15} />
              Refresh
            </button>
            <Link href="/" className={secondaryButtonClass}>
              <ArrowUpRight size={15} />
              Public site
            </Link>
            <button type="button" onClick={logout} className={secondaryButtonClass}>
              <LogOut size={15} />
              Sign out
            </button>
          </div>
          <div className="grid gap-2 lg:hidden">
            <label htmlFor="mobile-admin-section" className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              Admin section
            </label>
            <select
              id="mobile-admin-section"
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value as TabKey)}
              className={inputClass}
            >
              {tabGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.keys.map((key) => {
                    const tab = tabs.find((item) => item.key === key);
                    return tab ? (
                      <option key={tab.key} value={tab.key}>
                        {tab.label}
                      </option>
                    ) : null;
                  })}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1680px] gap-5 px-4 py-5 lg:grid-cols-[230px_minmax(0,1fr)] lg:px-6">
        <aside className="hidden h-fit border border-stone-3 bg-stone/40 p-3 lg:sticky lg:top-24 lg:block">
          <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">Admin sections</div>
          <nav className="mt-2 grid gap-4" aria-label="Admin sections">
            {tabGroups.map((group) => (
              <div key={group.label} className="grid gap-1">
                <div className="px-2 font-mono text-[9px] uppercase tracking-[0.18em] text-bone/45">{group.label}</div>
                {group.keys.map((key) => {
                  const tab = tabs.find((item) => item.key === key);
                  if (!tab) return null;
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "flex min-h-11 items-center gap-3 border px-3 text-left text-sm transition-colors",
                        active ? "border-neon bg-neon/12 text-neon" : "border-transparent bg-transparent text-bone/75 hover:border-stone-3 hover:bg-void/35 hover:text-bone"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className={cn("grid h-7 w-7 place-items-center border", active ? "border-neon/70 bg-neon text-void" : "border-stone-3 bg-void/50 text-ash")}>{tab.icon}</span>
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        <section className="grid min-w-0 gap-5">
          {(message || error) && (
            <div className="grid gap-2" aria-live="polite">
              {message && <StatusMessage tone="success" text={message} />}
              {error && <StatusMessage tone="error" text={error} />}
            </div>
          )}

          <section className="border border-stone-3 bg-stone/35 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-neon/70 bg-neon/10 text-neon">
                  {activeTabMeta.icon}
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-bone">{activeTabMeta.label}</h2>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-ash">{tabDescriptions[activeTab]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-ash">
                <span className="h-2 w-2 bg-neon" />
                Connected
                {hasUnsavedChanges && (
                  <span className="ml-2 border border-neon/45 bg-neon/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-neon">
                    Unsaved changes
                  </span>
                )}
              </div>
            </div>
          </section>

          {activeTab !== "dashboard" && (
            <>
              <section className="grid gap-3 md:grid-cols-4">
                <Metric label="Posts" value={rows.posts.length} sub={`${rows.posts.filter((row) => row.status === "PUBLISHED").length} published`} />
                <Metric label="Placements" value={rows.placements.length} sub={`${rows.placements.filter((row) => row.enabled).length} enabled`} />
                <Metric label="Media" value={rows.media.length} sub="uploaded assets" />
                <Metric label="Templates" value={rows.templates.length} sub={`${rows.templates.filter((row) => row.enabled !== false).length} enabled`} />
              </section>

              <Toolbar filters={filters} setFilters={setFilters} templates={rows.templates as PostTemplate[]} />
            </>
          )}

          {activeTab === "dashboard" && (
            <DashboardOverview
              rows={rows}
              onNavigate={setActiveTab}
              onNewPost={() => {
                resetForm("posts", { templateKey: forms.posts.templateKey || "", status: "DRAFT" });
                setActiveTab("posts");
              }}
            />
          )}

          {activeTab === "posts" && (
            <PostWorkflow
              config={{ ...configs.posts, rows: filteredPosts }}
              form={forms.posts}
              selectedId={selectedIds.posts}
              templates={rows.templates as PostTemplate[]}
              media={rows.media as MediaAsset[]}
              busy={busy}
              dirty={Boolean(dirtyKeys.posts)}
              uploadFile={uploadFile}
              uploadAlt={uploadAlt}
              uploadCaption={uploadCaption}
              entityOptions={entityOptions}
              onFormChange={(patch) => setFormValue("posts", patch)}
              onTemplateSelect={selectPostTemplate}
              onSaveDraft={() => void saveEntity(configs.posts, { status: "DRAFT" })}
              onPublish={() => void saveEntity(configs.posts, { status: "PUBLISHED", publishedAt: forms.posts.publishedAt || new Date().toISOString() })}
              onNew={() => resetForm("posts", { templateKey: forms.posts.templateKey || "", status: "DRAFT" })}
              onSelect={(row) => selectEntity(configs.posts, row)}
              onDelete={(row) => void deleteEntity(configs.posts, row)}
              onFileChange={(event) => setUploadFile(event.target.files?.[0] || null)}
              onAltChange={setUploadAlt}
              onCaptionChange={setUploadCaption}
              onInlineUpload={() => void uploadSelectedImage({ formKey: "posts", fieldKey: "coverImageId" })}
              onDropUpload={(file) => void uploadImageFile(file, { formKey: "posts", fieldKey: "coverImageId" })}
              rowActions={(row) => (
                <>
                  {row.status !== "PUBLISHED" && <MiniButton onClick={() => void updatePostStatus(row as CmsPost, "PUBLISHED")}>Publish</MiniButton>}
                  {row.status !== "DRAFT" && <MiniButton onClick={() => void updatePostStatus(row as CmsPost, "DRAFT")}>Draft</MiniButton>}
                  {row.status !== "ARCHIVED" && <MiniButton onClick={() => void updatePostStatus(row as CmsPost, "ARCHIVED")}>Archive</MiniButton>}
                </>
              )}
            />
          )}

          {activeTab === "pages" && (
            <PageContentWorkspace
              config={configs.pageContent}
              form={forms.pageContent}
              selectedId={selectedIds.pageContent}
              busy={busy}
              dirtyKeys={dirtyKeys}
              media={rows.media as MediaAsset[]}
              onImageDrop={(file, target) => void uploadImageFile(file, target)}
              setFormValue={setFormValue}
              saveEntity={saveEntity}
              resetForm={resetForm}
              selectEntity={selectEntity}
              deleteEntity={deleteEntity}
            />
          )}

          {activeTab === "templates" && (
            <TemplateManager
              config={configs.templates}
              form={forms.templates}
              selectedId={selectedIds.templates}
              templates={rows.templates as PostTemplate[]}
              busy={busy}
              dirty={Boolean(dirtyKeys.templates)}
              onFormChange={(patch) => setFormValue("templates", patch)}
              onSave={() => void saveEntity(configs.templates)}
              onNew={() => resetForm("templates")}
              onSelect={(row) => selectEntity(configs.templates, row)}
              onDelete={(row) => void deleteEntity(configs.templates, row)}
            />
          )}

          {activeTab === "media" && (
            <MediaManager
              media={rows.media as MediaAsset[]}
              busy={busy}
              uploadFile={uploadFile}
              uploadAlt={uploadAlt}
              uploadCaption={uploadCaption}
              onUpload={handleUpload}
              onFileChange={(event) => setUploadFile(event.target.files?.[0] || null)}
              onDropFile={setUploadFile}
              onAltChange={setUploadAlt}
              onCaptionChange={setUploadCaption}
              onPatch={(asset) => setRows((current) => ({ ...current, media: current.media.map((row) => (row.id === asset.id ? asset : row)) }))}
              onSave={(asset) => void updateMedia(asset)}
              onDelete={(asset) => void deleteMedia(asset)}
            />
          )}

          {activeTab === "placements" && (
            <PlacementManager
              config={{ ...configs.placements, rows: filteredPlacements }}
              form={forms.placements}
              selectedId={selectedIds.placements}
              busy={busy}
              dirty={Boolean(dirtyKeys.placements)}
              entityOptions={entityOptions}
              onFormChange={(patch) => setFormValue("placements", patch)}
              onSave={() => void saveEntity(configs.placements)}
              onNew={() => resetForm("placements")}
              onSelect={(row) => selectEntity(configs.placements, row)}
              onDelete={(row) => void deleteEntity(configs.placements, row)}
              onToggle={(row) => void togglePlacement(row as ContentPlacement)}
              onReorder={(orderedRows) => void reorderPlacements(orderedRows)}
            />
          )}

          {activeTab === "events" && <GuidedEntityManager config={configs.events} form={forms.events} selectedId={selectedIds.events} busy={busy} dirty={Boolean(dirtyKeys.events)} media={rows.media as MediaAsset[]} onImageDrop={(file, target) => void uploadImageFile(file, target)} primaryKeys={["name", "tagline", "status", "startDate", "endDate", "city", "country", "posterUrl"]} advancedKeys={["slug", "edition", "venue", "participants", "format", "tier", "organizer", "prizePoolDisplay", "prizePoolPkr", "prizePoolUsd", "games", "sponsors", "broadcastTalent", "liquipedia", "galleryUrls", "recapVideo", "startggEventId"]} setFormValue={setFormValue} saveEntity={saveEntity} resetForm={resetForm} selectEntity={selectEntity} deleteEntity={deleteEntity} />}
          {activeTab === "players" && <GuidedEntityManager config={configs.players} form={forms.players} selectedId={selectedIds.players} busy={busy} dirty={Boolean(dirtyKeys.players)} media={rows.media as MediaAsset[]} onImageDrop={(file, target) => void uploadImageFile(file, target)} primaryKeys={["tag", "realName", "country", "photoUrl", "enabled"]} advancedKeys={["slug", "teamId", "mainsText", "socialsText"]} setFormValue={setFormValue} saveEntity={saveEntity} resetForm={resetForm} selectEntity={selectEntity} deleteEntity={deleteEntity} />}
          {activeTab === "sponsors" && <GuidedEntityManager config={configs.sponsors} form={forms.sponsors} selectedId={selectedIds.sponsors} busy={busy} dirty={Boolean(dirtyKeys.sponsors)} media={rows.media as MediaAsset[]} onImageDrop={(file, target) => void uploadImageFile(file, target)} primaryKeys={["name", "tier", "url", "logoLightUrl", "enabled"]} advancedKeys={["slug", "logoDarkUrl"]} setFormValue={setFormValue} saveEntity={saveEntity} resetForm={resetForm} selectEntity={selectEntity} deleteEntity={deleteEntity} />}

          {activeTab === "ptl" && (
            <div className="grid gap-6">
              <GuidedEntityManager config={configs.circuits} form={forms.circuits} selectedId={selectedIds.circuits} busy={busy} dirty={Boolean(dirtyKeys.circuits)} media={rows.media as MediaAsset[]} onImageDrop={(file, target) => void uploadImageFile(file, target)} primaryKeys={["name", "tagline", "status", "startDate", "endDate", "city", "country", "registrationOpen", "registrationUrl", "startggEventId"]} advancedKeys={["slug", "edition", "gameSlug", "prizePoolDisplay", "prizePoolPkr", "prizePoolUsd", "slotsText", "pointsRules"]} setFormValue={setFormValue} saveEntity={saveEntity} resetForm={resetForm} selectEntity={selectEntity} deleteEntity={deleteEntity} />
              <PageContentManager pageKey="ptl-2026" config={configs.pageContent} form={forms.pageContent} selectedId={selectedIds.pageContent} busy={busy} dirtyKeys={dirtyKeys} media={rows.media as MediaAsset[]} onImageDrop={(file, target) => void uploadImageFile(file, target)} setFormValue={setFormValue} saveEntity={saveEntity} resetForm={resetForm} selectEntity={selectEntity} deleteEntity={deleteEntity} />
            </div>
          )}

          {activeTab === "watch" && (
            <div className="grid gap-6">
              <GuidedEntityManager config={configs.streams} form={forms.streams} selectedId={selectedIds.streams} busy={busy} dirty={Boolean(dirtyKeys.streams)} media={rows.media as MediaAsset[]} onImageDrop={(file, target) => void uploadImageFile(file, target)} primaryKeys={["title", "platform", "url", "scheduledStart", "isLive", "enabled"]} advancedKeys={["channel", "eventId"]} setFormValue={setFormValue} saveEntity={saveEntity} resetForm={resetForm} selectEntity={selectEntity} deleteEntity={deleteEntity} />
              <PageContentManager pageKey="watch" config={configs.pageContent} form={forms.pageContent} selectedId={selectedIds.pageContent} busy={busy} dirtyKeys={dirtyKeys} media={rows.media as MediaAsset[]} onImageDrop={(file, target) => void uploadImageFile(file, target)} setFormValue={setFormValue} saveEntity={saveEntity} resetForm={resetForm} selectEntity={selectEntity} deleteEntity={deleteEntity} />
            </div>
          )}

          {activeTab === "about" && (
            <PageContentManager pageKey="about" config={configs.pageContent} form={forms.pageContent} selectedId={selectedIds.pageContent} busy={busy} dirtyKeys={dirtyKeys} media={rows.media as MediaAsset[]} onImageDrop={(file, target) => void uploadImageFile(file, target)} setFormValue={setFormValue} saveEntity={saveEntity} resetForm={resetForm} selectEntity={selectEntity} deleteEntity={deleteEntity} />
          )}
        </section>
      </div>
    </main>
  );
}

function DashboardOverview({
  rows,
  onNavigate,
  onNewPost,
}: {
  rows: Record<string, Row[]>;
  onNavigate: (tab: TabKey) => void;
  onNewPost: () => void;
}) {
  const posts = rows.posts;
  const drafts = posts.filter((row) => row.status === "DRAFT").length;
  const published = posts.filter((row) => row.status === "PUBLISHED").length;
  const enabledPlacements = rows.placements.filter((row) => row.enabled !== false).length;
  const disabledPlacements = rows.placements.filter((row) => row.enabled === false).length;
  const enabledTemplates = rows.templates.filter((row) => row.enabled !== false).length;
  const pageCoverage = pageOptions.map((page) => {
    const definedSections = pageContentSectionOptions(page.value).length;
    const pageSections = rows.pageContent.filter((row) => row.pageKey === page.value);
    const enabledSections = pageSections.filter((row) => row.enabled !== false).length;
    const livePlacements = rows.placements.filter((row) => row.pageKey === page.value && row.enabled !== false).length;
    return {
      ...page,
      definedSections,
      editableSections: pageSections.length,
      enabledSections,
      livePlacements,
      percent: definedSections > 0 ? Math.min(100, Math.round((enabledSections / definedSections) * 100)) : 0,
    };
  });
  const openAreas = renderedPlacementOptions
    .filter((slot) => !rows.placements.some((row) => row.pageKey === slot.pageKey && row.slotKey === slot.slotKey && row.enabled !== false))
    .slice(0, 6);
  const recentRows = [
    ...posts.map((row) => ({ row, type: "Post", label: String(row.title || row.slug || row.id), tab: "posts" as TabKey })),
    ...rows.pageContent.map((row) => ({ row, type: "Page", label: `${pageLabel(String(row.pageKey || ""))} / ${pageContentSectionLabel(String(row.pageKey || ""), String(row.sectionKey || ""))}`, tab: "pages" as TabKey })),
    ...rows.events.map((row) => ({ row, type: "Event", label: String(row.name || row.slug || row.id), tab: "events" as TabKey })),
    ...rows.players.map((row) => ({ row, type: "Player", label: String(row.tag || row.slug || row.id), tab: "players" as TabKey })),
    ...rows.sponsors.map((row) => ({ row, type: "Sponsor", label: String(row.name || row.slug || row.id), tab: "sponsors" as TabKey })),
  ]
    .sort((a, b) => new Date(String(b.row.updatedAt || b.row.createdAt || 0)).getTime() - new Date(String(a.row.updatedAt || a.row.createdAt || 0)).getTime())
    .slice(0, 8);

  return (
    <div className="grid gap-5">
      <section className="grid gap-3 md:grid-cols-4">
        <Metric label="Published posts" value={published} sub={`${drafts} drafts waiting`} />
        <Metric label="Live placements" value={enabledPlacements} sub={`${disabledPlacements} disabled`} />
        <Metric label="Media assets" value={rows.media.length} sub="shared image library" />
        <Metric label="Templates" value={rows.templates.length} sub={`${enabledTemplates} available`} />
      </section>

      <Panel title="Editable Public Pages" icon={<LayoutDashboard size={18} />}>
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
          {pageCoverage.map((page) => (
            <button
              key={page.value}
              type="button"
              onClick={() => onNavigate(tabForPageKey(page.value))}
              className="grid gap-4 border border-stone-3 bg-void/30 p-4 text-left transition-colors hover:border-neon hover:bg-neon/5"
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-base font-semibold text-bone">{page.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-ash">
                    {page.editableSections} editable sections / {page.livePlacements} live placements
                  </span>
                </span>
                <ArrowUpRight size={15} className="shrink-0 text-neon" aria-hidden />
              </span>
              <span className="grid gap-2">
                <span className="h-2 overflow-hidden border border-stone-3 bg-stone/60">
                  <span className="block h-full bg-neon" style={{ width: `${page.percent}%` }} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                  {page.enabledSections}/{page.definedSections} enabled section areas
                </span>
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel title="Quick Actions" icon={<LayoutDashboard size={18} />}>
          <div className="grid gap-3 md:grid-cols-2">
            <DashboardAction title="Create a post" detail="Write on the template canvas, choose placement, publish." icon={<Newspaper size={18} />} onClick={onNewPost} />
            <DashboardAction title="Edit a page section" detail="Open the visual section map for Home, PTL, About, Watch, and more." icon={<LayoutDashboard size={18} />} onClick={() => onNavigate("pages")} />
            <DashboardAction title="Upload images" detail="Add media once and reuse it across posts, pages, events, and players." icon={<ImagePlus size={18} />} onClick={() => onNavigate("media")} />
            <DashboardAction title="Control placements" detail="See every page area and decide what appears where." icon={<LayoutDashboard size={18} />} onClick={() => onNavigate("placements")} />
          </div>
        </Panel>

        <Panel title="Needs Attention" icon={<AlertCircle size={18} />}>
          <div className="grid gap-3">
            <DashboardAttentionItem label="Draft posts" value={String(drafts)} detail={drafts ? "Review and publish when ready." : "No draft posts waiting."} ok={!drafts} onClick={() => onNavigate("posts")} />
            <DashboardAttentionItem label="Open page areas" value={String(openAreas.length)} detail={openAreas.length ? "Some approved slots are empty." : "All approved slots have enabled content."} ok={!openAreas.length} onClick={() => onNavigate("placements")} />
            <DashboardAttentionItem label="Media library" value={String(rows.media.length)} detail={rows.media.length ? "Images are available for editors." : "Upload brand and event images."} ok={rows.media.length > 0} onClick={() => onNavigate("media")} />
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel title="Recent Content" icon={<FileText size={18} />}>
          {recentRows.length === 0 ? (
            <EmptyState text="No content has been edited yet." />
          ) : (
            <div className="grid gap-2">
              {recentRows.map((item) => (
                <button
                  key={`${item.type}-${item.row.id}`}
                  type="button"
                  onClick={() => onNavigate(item.tab)}
                  className="flex min-h-14 items-center justify-between gap-3 border border-stone-3 bg-void/30 px-3 text-left transition-colors hover:border-neon hover:text-neon"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-bone">{item.label}</span>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ash">{item.type}</span>
                  </span>
                  <ArrowUpRight size={14} className="shrink-0 text-neon" aria-hidden />
                </button>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Open Page Areas" icon={<LayoutDashboard size={18} />}>
          {openAreas.length === 0 ? (
            <EmptyState text="Every approved page area has enabled content." />
          ) : (
            <div className="grid gap-2">
              {openAreas.map((area) => (
                <button
                  key={`${area.pageKey}-${area.slotKey}`}
                  type="button"
                  onClick={() => onNavigate("placements")}
                  className="border border-stone-3 bg-void/30 p-3 text-left transition-colors hover:border-neon"
                >
                  <div className="text-sm font-semibold text-bone">{area.label}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">{pageLabel(area.pageKey)} / {slotLabel(area.slotKey)}</div>
                </button>
              ))}
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}

function DashboardAction({ title, detail, icon, onClick }: { title: string; detail: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="grid min-h-32 gap-3 border border-stone-3 bg-void/30 p-4 text-left transition-colors hover:border-neon hover:bg-neon/5">
      <span className="grid h-10 w-10 place-items-center border border-neon/60 bg-neon/10 text-neon">{icon}</span>
      <span>
        <span className="block text-base font-semibold text-bone">{title}</span>
        <span className="mt-2 block text-sm leading-6 text-ash">{detail}</span>
      </span>
    </button>
  );
}

function DashboardAttentionItem({ label, value, detail, ok, onClick }: { label: string; value: string; detail: string; ok: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-start gap-3 border border-stone-3 bg-void/30 p-3 text-left transition-colors hover:border-neon">
      <span className={cn("grid h-8 w-8 shrink-0 place-items-center border font-mono text-[10px]", ok ? "border-neon/50 bg-neon/10 text-neon" : "border-blood/60 bg-blood/10 text-bone")}>{value}</span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-bone">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-ash">{detail}</span>
      </span>
    </button>
  );
}

function PostWorkflow({
  config,
  form,
  selectedId,
  templates,
  media,
  busy,
  dirty,
  uploadFile,
  uploadAlt,
  uploadCaption,
  entityOptions,
  onFormChange,
  onTemplateSelect,
  onSaveDraft,
  onPublish,
  onNew,
  onSelect,
  onDelete,
  onFileChange,
  onAltChange,
  onCaptionChange,
  onInlineUpload,
  onDropUpload,
  rowActions,
}: {
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  templates: PostTemplate[];
  media: MediaAsset[];
  busy: boolean;
  dirty: boolean;
  uploadFile: File | null;
  uploadAlt: string;
  uploadCaption: string;
  entityOptions: Record<string, SelectOption[]>;
  onFormChange: (patch: FormState) => void;
  onTemplateSelect: (template: PostTemplate) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onNew: () => void;
  onSelect: (row: Row) => void;
  onDelete: (row: Row) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAltChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onInlineUpload: () => void;
  onDropUpload: (file: File) => void;
  rowActions?: (row: Row) => ReactNode;
}) {
  const selectedTemplate = templates.find((template) => template.key === form.templateKey);
  const advancedFields = fieldsByKeys(config.fields, ["slug", "relatedEventId", "relatedPlayerId", "relatedSponsorId", "relatedCircuitId", "publishedAt"]);

  return (
    <section className="grid gap-5">
      <PostLibraryStrip
        title="Posts"
        icon={config.icon}
        rows={config.rows}
        selectedId={selectedId}
        label={config.label}
        description={config.description}
        onNew={onNew}
        onSelect={onSelect}
        onDelete={onDelete}
        rowActions={rowActions}
        newLabel="Create new post"
        newSubLabel="Template canvas"
      />

      <PostTemplateChooser templates={templates} selectedKey={String(form.templateKey || "")} onSelect={onTemplateSelect} />

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(560px,1fr)_400px] 2xl:grid-cols-[minmax(640px,1fr)_430px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSaveDraft();
          }}
          className="grid content-start gap-5"
        >
          <PostFlowBar form={form} template={selectedTemplate} media={media} dirty={dirty} />

          <VisualPostComposer
            selectedId={selectedId}
            selectedTemplate={selectedTemplate}
            form={form}
            media={media}
            uploadFile={uploadFile}
            uploadAlt={uploadAlt}
            uploadCaption={uploadCaption}
            busy={busy}
            onFormChange={onFormChange}
            onFileChange={onFileChange}
            onAltChange={onAltChange}
            onCaptionChange={onCaptionChange}
            onInlineUpload={onInlineUpload}
            onDropUpload={onDropUpload}
          />

          <PublishPanel entityKey="posts" form={form} onChange={onFormChange} />

          <AdvancedPanel fields={advancedFields} form={form} onChange={onFormChange} />

          <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 border border-stone-3 bg-void/90 p-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur">
            <DirtyStateBadge dirty={dirty} />
            <div className="flex flex-wrap justify-end gap-2">
              <button type="submit" disabled={busy} className={cn(secondaryButtonClass, "min-w-32")}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                Save draft
              </button>
              <button type="button" disabled={busy} onClick={onPublish} className={cn(primaryButtonClass, "min-w-32")}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 size={16} />}
                Publish
              </button>
            </div>
          </div>
        </form>

        <aside className="grid h-fit gap-5 xl:sticky xl:top-24">
          <LiveContentPreview entityKey="posts" form={form} templates={templates} media={media} selectedTemplate={selectedTemplate} />
          <EditorReadinessPanel entityKey="posts" form={form} media={media} template={selectedTemplate} dirty={dirty} />
          <TemplateGuidePanel template={selectedTemplate} />
        </aside>
      </section>
    </section>
  );
}

function PostLibraryStrip({
  title,
  icon,
  rows,
  selectedId,
  label,
  description,
  onNew,
  onSelect,
  onDelete,
  rowActions,
  newLabel = "Create new",
  newSubLabel = "Visual editor",
}: {
  title: string;
  icon: ReactNode;
  rows: Row[];
  selectedId?: string | null;
  label: (row: Row) => string;
  description?: (row: Row) => string;
  onNew: () => void;
  onSelect: (row: Row) => void;
  onDelete: (row: Row) => void;
  rowActions?: (row: Row) => ReactNode;
  newLabel?: string;
  newSubLabel?: string;
}) {
  return (
    <Panel title={title} icon={icon}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <button
          type="button"
          onClick={onNew}
          className="grid min-h-28 w-full shrink-0 place-items-center border border-neon bg-neon/10 p-4 text-center text-neon transition-colors hover:bg-neon hover:text-void lg:w-56"
        >
          <span className="grid justify-items-center gap-2">
            <Plus size={20} aria-hidden />
            <span className="text-sm font-semibold">{newLabel}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-80">{newSubLabel}</span>
          </span>
        </button>

        {rows.length === 0 ? (
          <div className="min-h-28 flex-1">
            <EmptyState text="No posts yet. Create one, choose where it appears, then publish." />
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1">
            {rows.map((row) => {
              const active = selectedId === row.id;
              return (
                <article
                  key={row.id}
                  className={cn(
                    "grid min-h-28 w-[280px] shrink-0 content-between gap-3 border bg-void/30 p-3 transition-colors",
                    active ? "border-neon bg-neon/5" : "border-stone-3 hover:border-bone/30"
                  )}
                >
                  <button type="button" onClick={() => onSelect(row)} className="min-w-0 text-left">
                    <span className="line-clamp-2 text-sm font-semibold leading-tight text-bone">{label(row)}</span>
                    <span className="mt-2 block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                      {description?.(row) || row.id}
                    </span>
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {rowActions?.(row)}
                    <button type="button" onClick={() => onSelect(row)} className={miniButtonClass}>Edit</button>
                    <button type="button" onClick={() => onDelete(row)} className={iconButtonClass} aria-label={`Delete ${label(row)}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Panel>
  );
}

function PostFlowBar({
  form,
  template,
  media,
  dirty,
}: {
  form: FormState;
  template?: PostTemplate;
  media: MediaAsset[];
  dirty: boolean;
}) {
  const hasTemplate = Boolean(template);
  const hasTitle = Boolean(String(form.title || "").trim());
  const hasImage = Boolean(previewImage("posts", form, media));
  const hasPlacement = Boolean(form.placementPageKey && form.placementSlotKey);
  const isPublished = form.status === "PUBLISHED";
  const steps = [
    { label: "Template", ok: hasTemplate, detail: template?.name || "Choose shape" },
    { label: "Content", ok: hasTitle, detail: hasTitle ? "Title ready" : "Add title" },
    { label: "Image", ok: hasImage, detail: hasImage ? "Selected" : "Optional" },
    { label: "Placement", ok: hasPlacement, detail: hasPlacement ? readablePlacement(form.placementPageKey, form.placementSlotKey) : "Pick page area" },
    { label: "Publish", ok: isPublished, detail: isPublished ? "Live status" : "Draft mode" },
  ];

  return (
    <section className="border border-stone-3 bg-stone/35 p-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">Visual post builder</div>
          <p className="mt-1 text-sm leading-6 text-ash">Choose a template, edit directly on the canvas, place it, then publish.</p>
        </div>
        <DirtyStateBadge dirty={dirty} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.label} className={cn("border p-3", step.ok ? "border-neon/45 bg-neon/10" : "border-stone-3 bg-void/35")}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">{String(index + 1).padStart(2, "0")}</span>
              <span className={cn("grid h-5 w-5 place-items-center border", step.ok ? "border-neon text-neon" : "border-stone-3 text-ash")}>
                {step.ok ? <CheckCircle2 size={13} /> : <CircleSlash size={12} />}
              </span>
            </div>
            <div className="mt-3 text-sm font-semibold text-bone">{step.label}</div>
            <div className="mt-1 truncate text-xs text-ash">{step.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EntityFlowBar({
  entityKey,
  form,
  media,
  dirty,
}: {
  entityKey: string;
  form: FormState;
  media: MediaAsset[];
  dirty: boolean;
}) {
  const title = previewTitle(entityKey, form);
  const spec = visualEntitySpec(entityKey, form);
  const image = previewImage(entityKey, form, media);
  const hasUsefulTitle = Boolean(title.trim()) && title !== "Untitled";
  const hasCopy = Boolean(previewExcerpt(entityKey, form).trim() || String(form.bodyText || form.pointsRules || form.mainsText || form.channel || form.url || "").trim());
  const needsImage = Boolean(spec?.imageKey);
  const hasPlacement = !placeableEntityKeys.has(entityKey) || Boolean(form.placementPageKey && form.placementSlotKey);
  const visible = entityKey === "streams" ? form.enabled !== false : form.enabled !== false && form.status !== "archived";
  const steps = [
    { label: "Title", ok: hasUsefulTitle, detail: hasUsefulTitle ? title : `Add ${entitySingularLabel(entityKey)} title` },
    { label: "Content", ok: hasCopy || entityKey === "sponsors", detail: hasCopy ? "Copy is ready" : entityKey === "sponsors" ? "Partner name can be enough" : "Add short copy" },
    { label: "Image", ok: needsImage ? Boolean(image) : true, detail: needsImage ? (image ? "Image selected" : "Drop or choose image") : "No image required" },
    { label: "Placement", ok: hasPlacement, detail: placeableEntityKeys.has(entityKey) ? readablePlacement(form.placementPageKey, form.placementSlotKey) : "Managed here" },
    { label: "Visibility", ok: visible, detail: entityVisibilityDetail(entityKey, form) },
  ];

  return (
    <section className="border border-stone-3 bg-stone/35 p-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">{entitySingularLabel(entityKey)} builder</div>
          <p className="mt-1 text-sm leading-6 text-ash">{entityBuilderHelp(entityKey)}</p>
        </div>
        <DirtyStateBadge dirty={dirty} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.label} className={cn("border p-3", step.ok ? "border-neon/45 bg-neon/10" : "border-stone-3 bg-void/35")}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">{String(index + 1).padStart(2, "0")}</span>
              <span className={cn("grid h-5 w-5 place-items-center border", step.ok ? "border-neon text-neon" : "border-stone-3 text-ash")}>
                {step.ok ? <CheckCircle2 size={13} /> : <CircleSlash size={12} />}
              </span>
            </div>
            <div className="mt-3 text-sm font-semibold text-bone">{step.label}</div>
            <div className="mt-1 truncate text-xs text-ash">{step.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GuidedEntityManager({
  config,
  form,
  selectedId,
  busy,
  dirty = false,
  media,
  onImageDrop,
  primaryKeys,
  advancedKeys,
  newOverrides,
  setFormValue,
  saveEntity,
  resetForm,
  selectEntity,
  deleteEntity,
}: {
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  busy: boolean;
  dirty?: boolean;
  media: MediaAsset[];
  onImageDrop?: (file: File, target: ImageAssignment) => void;
  primaryKeys: string[];
  advancedKeys: string[];
  newOverrides?: FormState;
  setFormValue: (key: string, patch: FormState) => void;
  saveEntity: (config: EntityConfig, formOverrides?: FormState) => Promise<void>;
  resetForm: (key: string, overrides?: FormState) => void;
  selectEntity: (config: EntityConfig, row: Row) => void;
  deleteEntity: (config: EntityConfig, row: Row) => Promise<void>;
}) {
  const primaryFields = fieldsByKeys(config.fields, primaryKeys);
  const advancedFields = fieldsByKeys(config.fields, advancedKeys);
  const placeable = placeableEntityKeys.has(config.key);
  const defaults = placeable ? defaultPlacementFor(config.key) : undefined;
  const placementDefaults: FormState = defaults ? { placementPageKey: defaults.pageKey, placementSlotKey: defaults.slotKey } : {};
  const resetToNew = () => resetForm(config.key, { ...placementDefaults, ...newOverrides });

  return (
    <section className="grid gap-5">
      <PostLibraryStrip
        title={config.title}
        icon={config.icon}
        rows={config.rows}
        selectedId={selectedId}
        label={config.label}
        description={config.description}
        onNew={resetToNew}
        onSelect={(row) => selectEntity(config, row)}
        onDelete={(row) => void deleteEntity(config, row)}
        newLabel={`Create new ${entitySingularLabel(config.key)}`}
        newSubLabel="Visual canvas"
      />

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(560px,1fr)_400px] 2xl:grid-cols-[minmax(640px,1fr)_430px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void saveEntity(config);
          }}
          className="grid content-start gap-5"
        >
          <EntityFlowBar entityKey={config.key} form={form} media={media} dirty={dirty} />

          <VisualEntityEditor
            config={config}
            form={form}
            selectedId={selectedId}
            media={media}
            primaryFields={primaryFields}
            onChange={(patch) => setFormValue(config.key, patch)}
            onImageDrop={onImageDrop}
          />

          {placeable && <PublishPanel entityKey={config.key} form={form} onChange={(patch) => setFormValue(config.key, patch)} />}

          <AdvancedPanel fields={advancedFields} form={form} onChange={(patch) => setFormValue(config.key, patch)} />

          <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 border border-stone-3 bg-void/90 p-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur">
            <DirtyStateBadge dirty={dirty} />
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={busy} className={primaryButtonClass}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                {selectedId ? "Save changes" : "Create"}
              </button>
              <button type="button" onClick={resetToNew} className={secondaryButtonClass}>
                <Plus size={15} />
                New
              </button>
            </div>
          </div>
        </form>

        <aside className="grid h-fit gap-5 xl:sticky xl:top-24">
          <LiveContentPreview entityKey={config.key} form={form} media={media} />
          <EditorReadinessPanel entityKey={config.key} form={form} media={media} dirty={dirty} />
        </aside>
      </section>
    </section>
  );
}

function TemplateManager({
  config,
  form,
  selectedId,
  templates,
  busy,
  dirty = false,
  onFormChange,
  onSave,
  onNew,
  onSelect,
  onDelete,
}: {
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  templates: PostTemplate[];
  busy: boolean;
  dirty?: boolean;
  onFormChange: (patch: FormState) => void;
  onSave: () => void;
  onNew: () => void;
  onSelect: (row: Row) => void;
  onDelete: (row: Row) => void;
}) {
  const selectedTemplate = templates.find((template) => template.key === form.key);
  const draftTemplate = templateFromForm(form, selectedTemplate);

  return (
    <section className="grid gap-5 2xl:grid-cols-[300px_minmax(460px,1fr)_380px]">
      <ItemList
        title="Templates"
        icon={config.icon}
        rows={config.rows}
        selectedId={selectedId}
        label={config.label}
        description={config.description}
        onNew={onNew}
        onSelect={onSelect}
        onDelete={onDelete}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="grid gap-5"
      >
        <TemplateVisualEditor form={form} selectedId={selectedId} template={draftTemplate} onChange={onFormChange} />

        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-2 border border-stone-3 bg-void/85 p-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur">
          <DirtyStateBadge dirty={dirty} />
          <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
            Save template
          </button>
          <button type="button" onClick={onNew} className={secondaryButtonClass}>
            <Plus size={15} />
            New
          </button>
          </div>
        </div>
      </form>

      <Panel title="Template Preview" icon={<Sparkles size={18} />}>
        {draftTemplate ? (
          <TemplatePreviewCard template={draftTemplate} selected />
        ) : (
          <EmptyState text="Select a template to preview it." />
        )}
      </Panel>
    </section>
  );
}

function TemplateVisualEditor({
  form,
  selectedId,
  template,
  onChange,
}: {
  form: FormState;
  selectedId?: string | null;
  template: PostTemplate;
  onChange: (patch: FormState) => void;
}) {
  const previewKind = templatePreviewKind(template);

  return (
    <Panel title={selectedId ? "Edit Template Visually" : "Create Template Visually"} icon={<Sparkles size={18} />}>
      <div className="grid gap-5">
        <TemplateLayoutPicker
          value={previewKind}
          onChange={(nextKind) => onChange({ previewKind: nextKind, blockOrder: defaultBlockOrderForKind(nextKind).join(",") })}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="scanline border border-stone-3 bg-stone/35 p-4">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neon">Sample preview</div>
            <TemplateVisualPreview template={template} mode="sample" selected />
          </div>
          <TemplateBlockBuilder
            kind={previewKind}
            value={String(form.blockOrder || "")}
            onChange={(blockOrder) => onChange({ blockOrder })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Template key">
            <input value={String(form.key || "")} onChange={(event) => onChange({ key: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Name">
            <input value={String(form.name || "")} onChange={(event) => onChange({ name: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Default eyebrow">
            <input value={String(form.defaultEyebrow || "")} onChange={(event) => onChange({ defaultEyebrow: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Default button">
            <input value={String(form.defaultCtaLabel || "")} onChange={(event) => onChange({ defaultCtaLabel: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Description" span="full">
            <textarea value={String(form.description || "")} onChange={(event) => onChange({ description: event.target.value })} className={cn(inputClass, "min-h-28 resize-y")} />
          </Field>
          <Field label="Editor guidance" span="full">
            <textarea value={String(form.editorGuidance || "")} onChange={(event) => onChange({ editorGuidance: event.target.value })} className={cn(inputClass, "min-h-28 resize-y")} />
          </Field>
          <Field label="Enabled" span="full">
            <label className="flex min-h-11 items-center gap-3 border border-stone-3 bg-void/45 px-3 text-sm text-bone transition-colors hover:border-bone/30">
              <input type="checkbox" checked={Boolean(form.enabled)} onChange={(event) => onChange({ enabled: event.target.checked })} className="h-4 w-4 accent-neon" />
              Template is available in Posts
            </label>
          </Field>
        </div>

        <TemplateSlotPicker value={String(form.recommendedSlots || "")} onChange={(recommendedSlots) => onChange({ recommendedSlots })} />
      </div>
    </Panel>
  );
}

function TemplateLayoutPicker({ value, onChange }: { value: TemplatePreviewKind; onChange: (value: TemplatePreviewKind) => void }) {
  return (
    <section className="grid gap-3 border border-stone-3 bg-void/30 p-4">
      <div className="flex flex-col gap-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">1. Choose the approved template shape</div>
        <p className="text-sm leading-6 text-bone/70">This controls the sample preview and which blocks editors can drag inside posts.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {templateKindOptions.map((kind) => (
          <button
            key={kind.value}
            type="button"
            onClick={() => onChange(kind.value)}
            className={cn(
              "grid min-h-28 gap-2 border p-3 text-left transition-colors",
              value === kind.value ? "border-neon bg-neon/10 text-neon" : "border-stone-3 bg-void/35 text-bone hover:border-bone/35"
            )}
          >
            <span className="text-sm font-semibold">{kind.label}</span>
            <span className="text-xs leading-5 text-ash">{kind.help}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function TemplateBlockBuilder({
  kind,
  value,
  onChange,
}: {
  kind: TemplatePreviewKind;
  value: string;
  onChange: (value: string) => void;
}) {
  const activeBlocks = normalizeTemplateBlockOrder(value, kind, { fillMissing: !value.trim() });
  const allowedBlocks = allowedBlocksForKind(kind);
  const inactiveBlocks = allowedBlocks.filter((block) => !activeBlocks.includes(block));

  function commit(nextBlocks: EditablePostBlockKey[]) {
    const normalized = normalizeTemplateBlockOrder(nextBlocks.join(","), kind, { fillMissing: false });
    onChange(normalized.join(","));
  }

  function moveBlockTo(sourceKey: EditablePostBlockKey, targetKey: EditablePostBlockKey) {
    if (sourceKey === targetKey) return;
    const sourceIndex = activeBlocks.indexOf(sourceKey);
    const targetIndex = activeBlocks.indexOf(targetKey);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const next = [...activeBlocks];
    const [item] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, item);
    commit(next);
  }

  function removeBlock(block: EditablePostBlockKey) {
    if (requiredTemplateBlocks.has(block)) return;
    commit(activeBlocks.filter((item) => item !== block));
  }

  return (
    <section className="grid content-start gap-3 border border-stone-3 bg-void/30 p-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">2. Drag approved blocks</div>
        <p className="mt-1 text-sm leading-6 text-bone/70">These are the only areas editors can move when creating a post.</p>
      </div>

      <div className="grid gap-2">
        {activeBlocks.map((block) => (
          <div
            key={block}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/x-baaz-template-block", block);
              event.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const sourceKey = event.dataTransfer.getData("application/x-baaz-template-block") as EditablePostBlockKey;
              if (postBlockLabels[sourceKey]) moveBlockTo(sourceKey, block);
            }}
            className="flex min-h-11 items-center justify-between gap-3 border border-stone-3 bg-stone/35 px-3 transition-colors hover:border-bone/35"
          >
            <div className="flex min-w-0 cursor-grab items-center gap-2 active:cursor-grabbing">
              <GripVertical size={14} className="shrink-0 text-neon" aria-hidden />
              <span className="truncate text-sm font-medium text-bone">{postBlockLabels[block]}</span>
            </div>
            {requiredTemplateBlocks.has(block) ? (
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ash">Required</span>
            ) : (
              <button type="button" onClick={() => removeBlock(block)} className={miniButtonClass}>Remove</button>
            )}
          </div>
        ))}
      </div>

      {inactiveBlocks.length > 0 && (
        <div className="grid gap-2 border-t border-stone-3 pt-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Add block</div>
          <div className="flex flex-wrap gap-2">
            {inactiveBlocks.map((block) => (
              <button key={block} type="button" onClick={() => commit([...activeBlocks, block])} className={miniButtonClass}>
                <Plus size={13} />
                {postBlockLabels[block]}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function TemplateSlotPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const selectedValues = new Set(csvValues(value));
  const optionsByPage = pageOptions
    .map((page) => ({
      page,
      options: renderedPlacementOptions.filter((item) => item.pageKey === page.value && item.targetTypes.includes("post")),
    }))
    .filter((group) => group.options.length > 0);

  function toggle(slotValue: string) {
    const next = new Set(selectedValues);
    if (next.has(slotValue)) next.delete(slotValue);
    else next.add(slotValue);
    onChange(Array.from(next).join(", "));
  }

  return (
    <section className="grid gap-3 border border-stone-3 bg-void/30 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">Recommended page areas</div>
      <div className="grid gap-4">
        {optionsByPage.map((group) => (
          <div key={group.page.value} className="grid gap-2">
            <div className="text-sm font-semibold text-bone">{group.page.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.options.map((slot) => {
                const slotValue = recommendedSlotValue(slot);
                const active = selectedValues.has(slotValue);
                return (
                  <button
                    key={slotValue}
                    type="button"
                    onClick={() => toggle(slotValue)}
                    className={cn(
                      "min-h-10 border px-3 text-left text-xs font-medium transition-colors",
                      active ? "border-neon bg-neon/10 text-neon" : "border-stone-3 bg-void/35 text-bone hover:border-bone/35"
                    )}
                  >
                    {slotLabel(slot.slotKey)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function templateFromForm(form: FormState, fallback?: PostTemplate): PostTemplate {
  const previewKind = asTemplatePreviewKind(form.previewKind) || asTemplatePreviewKind(fallback?.previewKind) || templatePreviewKind(fallback) || "news";
  const blockOrderValue = String(form.blockOrder || (Array.isArray(fallback?.blockOrder) ? fallback.blockOrder.join(",") : ""));
  const blockOrder = normalizeTemplateBlockOrder(blockOrderValue, previewKind, { fillMissing: false });

  return {
    id: String(fallback?.id || form.key || "template-preview"),
    key: String(form.key || fallback?.key || "custom-template"),
    name: String(form.name || fallback?.name || "Template preview"),
    description: String(form.description || fallback?.description || ""),
    defaultEyebrow: String(form.defaultEyebrow || fallback?.defaultEyebrow || ""),
    defaultCtaLabel: String(form.defaultCtaLabel || fallback?.defaultCtaLabel || ""),
    recommendedSlots: csvValues(form.recommendedSlots),
    previewKind,
    blockOrder,
    editorGuidance: String(form.editorGuidance || fallback?.editorGuidance || ""),
    enabled: Boolean(form.enabled),
  };
}

function recommendedSlotValue(slot: { pageKey: string; slotKey: string }) {
  return `${slot.pageKey}/${slot.slotKey}`;
}

function VisualEntityEditor({
  config,
  form,
  selectedId,
  media,
  primaryFields,
  onChange,
  onImageDrop,
}: {
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  media: MediaAsset[];
  primaryFields: FieldDef[];
  onChange: (patch: FormState) => void;
  onImageDrop?: (file: File, target: ImageAssignment) => void;
}) {
  const spec = visualEntitySpec(config.key, form);
  if (!spec) {
    return (
      <Panel title={selectedId ? `Edit ${config.title}` : `Create ${config.title}`} icon={config.icon}>
        <FieldGrid fields={primaryFields} form={form} onChange={onChange} />
      </Panel>
    );
  }

  const usedKeys = new Set([spec.titleKey, spec.eyebrowKey, spec.excerptKey, spec.bodyKey, spec.imageKey, spec.itemKey, "ctaLabel", "ctaHref"].filter(Boolean));
  const detailFields = primaryFields.filter((field) => !usedKeys.has(field.key));

  return (
    <Panel title={selectedId ? `Edit ${config.title} Visually` : `Create ${config.title} Visually`} icon={<MousePointer2 size={18} />}>
      <div className="grid gap-5">
        <div className="border border-stone-3 bg-void/30 p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">{spec.heroLabel}</div>
          <p className="mt-1 text-sm leading-6 text-ash">Click into the content blocks below. Image areas accept dropped images and existing media.</p>
        </div>

        <div className="scanline border border-stone-3 bg-stone/35 p-4">
          <div className="grid gap-4">
            {spec.imageKey && (
              <VisualEntityImage
                formKey={config.key}
                fieldKey={spec.imageKey}
                mode={spec.imageMode || "url"}
                value={String(form[spec.imageKey] || "")}
                media={media}
                onChange={onChange}
                onImageDrop={onImageDrop}
              />
            )}

            <div className="grid gap-3">
              {spec.eyebrowKey && (
                <VisualEntityTextArea
                  label="Eyebrow"
                  value={String(form[spec.eyebrowKey] || "")}
                  fallback={visualEntityFallback(config.key, "eyebrow")}
                  tone="eyebrow"
                  rows={1}
                  onChange={(value) => onChange({ [spec.eyebrowKey!]: value })}
                />
              )}
              {spec.titleKey && (
                <VisualEntityTextArea
                  label="Title"
                  value={String(form[spec.titleKey] || "")}
                  fallback={visualEntityFallback(config.key, "title")}
                  tone="title"
                  rows={2}
                  onChange={(value) => onChange({ [spec.titleKey!]: value })}
                />
              )}
              {spec.excerptKey && (
                <VisualEntityTextArea
                  label="Short text"
                  value={String(form[spec.excerptKey] || "")}
                  fallback={visualEntityFallback(config.key, "excerpt")}
                  tone="excerpt"
                  rows={3}
                  onChange={(value) => onChange({ [spec.excerptKey!]: value })}
                />
              )}
              {spec.bodyKey && (
                <VisualEntityTextArea
                  label="Body"
                  value={String(form[spec.bodyKey] || "")}
                  fallback={visualEntityFallback(config.key, "body")}
                  tone="body"
                  rows={5}
                  onChange={(value) => onChange({ [spec.bodyKey!]: value })}
                />
              )}
              {spec.itemKey && (
                <FriendlyItemsEditor
                  value={String(form[spec.itemKey] || "")}
                  pageKey={String(form.pageKey || "")}
                  sectionKey={String(form.sectionKey || "")}
                  showStarters={config.key !== "pageContent"}
                  onChange={(value) => onChange({ [spec.itemKey!]: value })}
                />
              )}
            </div>
          </div>
        </div>

        {detailFields.length > 0 && (
          <details className="border border-stone-3 bg-void/30">
            <summary className="cursor-pointer px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Page controls and details</summary>
            <div className="border-t border-stone-3 p-4">
              <FieldGrid fields={detailFields} form={form} onChange={onChange} />
            </div>
          </details>
        )}
      </div>
    </Panel>
  );
}

function VisualEntityTextArea({
  label,
  value,
  fallback,
  tone,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  tone: "eyebrow" | "title" | "excerpt" | "body";
  rows: number;
  onChange: (value: string) => void;
}) {
  const toneClass: Record<typeof tone, string> = {
    eyebrow: "font-mono text-[11px] uppercase tracking-[0.22em] text-neon",
    title: "text-3xl font-semibold uppercase leading-none text-bone md:text-5xl",
    excerpt: "text-base leading-7 text-ash",
    body: "text-sm leading-7 text-bone/75",
  };

  return (
    <label className="grid gap-2 border border-stone-3 bg-void/35 p-3">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
        <Type size={13} className="text-neon" aria-hidden />
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={fallback}
        rows={rows}
        className={cn("w-full resize-y border border-transparent bg-transparent p-2 outline-none transition-colors placeholder:text-bone/35 hover:border-stone-3 focus:border-neon focus:bg-void/45", toneClass[tone])}
      />
    </label>
  );
}

function VisualEntityImage({
  formKey,
  fieldKey,
  mode,
  value,
  media,
  onChange,
  onImageDrop,
}: {
  formKey: string;
  fieldKey: string;
  mode: "id" | "url";
  value: string;
  media: MediaAsset[];
  onChange: (patch: FormState) => void;
  onImageDrop?: (file: File, target: ImageAssignment) => void;
}) {
  const selectedAsset = mode === "id" ? media.find((asset) => asset.id === value) : media.find((asset) => asset.url === value);
  const imageSrc = mode === "id" ? mediaUrl(selectedAsset?.url || "") : displayImageUrl(value);
  const selectedMediaValue = selectedAsset?.id || "";

  return (
    <section className="grid gap-3 border border-stone-3 bg-void/35 p-3">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
        <Images size={14} className="text-neon" aria-hidden />
        Image
      </div>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file && onImageDrop) onImageDrop(file, { formKey, fieldKey, value: mode });
        }}
        className="grid min-h-[220px] place-items-center overflow-hidden border border-dashed border-stone-3 bg-void/50"
      >
        {imageSrc ? (
          <div className="relative h-full w-full">
            <img src={imageSrc} alt="" className="h-full max-h-[360px] w-full object-cover" />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 border border-stone-3 bg-void/80 p-2 backdrop-blur">
              <div className="min-w-0 truncate text-xs text-bone">{selectedAsset?.originalName || "Current image"}</div>
              <button type="button" onClick={() => onChange({ [fieldKey]: "" })} className={miniButtonClass}>
                Remove image
              </button>
            </div>
          </div>
        ) : (
          <div className="grid justify-items-center gap-3 p-6 text-center">
            <Images className="h-8 w-8 text-neon" aria-hidden />
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">Drop image here</div>
            <div className="max-w-sm text-sm leading-6 text-bone/70">Use this for posters, portraits, sponsor logos, or page block images.</div>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Choose from media">
          <select
            value={selectedMediaValue}
            onChange={(event) => {
              const asset = media.find((item) => item.id === event.target.value);
              onChange({ [fieldKey]: asset ? (mode === "id" ? asset.id : asset.url) : "" });
            }}
            className={inputClass}
          >
            <option value="">No image</option>
            {media.map((asset) => (
              <option key={asset.id} value={asset.id}>{asset.originalName || asset.filename}</option>
            ))}
          </select>
        </Field>
        <Field label="Upload new image">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file && onImageDrop) onImageDrop(file, { formKey, fieldKey, value: mode });
              event.currentTarget.value = "";
            }}
            className={fileInputClass}
          />
        </Field>
      </div>

      {mode === "url" && (
        <details className="border border-stone-3 bg-void/30">
          <summary className="cursor-pointer px-3 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Paste image URL instead</summary>
          <div className="border-t border-stone-3 p-3">
            <Field label="Image URL" span="full">
              <input value={value} onChange={(event) => onChange({ [fieldKey]: event.target.value })} className={inputClass} />
            </Field>
          </div>
        </details>
      )}
    </section>
  );
}

function FriendlyItemsEditor({
  value,
  pageKey,
  sectionKey,
  showStarters = true,
  onChange,
}: {
  value: string;
  pageKey?: string;
  sectionKey?: string;
  showStarters?: boolean;
  onChange: (value: string) => void;
}) {
  const items: Array<Record<string, string>> = itemsFromText(value);
  const starters = sectionStartersFor(String(pageKey || ""), String(sectionKey || ""));
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) {
      if (selectedBlockIndex !== 0) setSelectedBlockIndex(0);
      return;
    }

    if (selectedBlockIndex >= items.length) setSelectedBlockIndex(items.length - 1);
  }, [items.length, selectedBlockIndex]);

  function commit(nextItems: Array<Record<string, string>>) {
    onChange(itemsToFriendlyText(nextItems));
  }

  function updateItem(index: number, patch: Record<string, string>) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    commit(next);
  }

  function addItem(type: SectionItemType = "card") {
    commit([...items, sectionItemDefaults(type)]);
    setSelectedBlockIndex(items.length);
  }

  function insertItem(type: SectionItemType, index = items.length) {
    const next = [...items];
    next.splice(index, 0, sectionItemDefaults(type));
    commit(next);
    setSelectedBlockIndex(index);
  }

  function addStarter(starter: SectionStarter) {
    commit([...items, ...starter.items.map((item) => ({ ...item }))]);
    setSelectedBlockIndex(items.length);
  }

  function replaceWithStarter(starter: SectionStarter) {
    commit(starter.items.map((item) => ({ ...item })));
    setSelectedBlockIndex(0);
  }

  function removeItem(index: number) {
    commit(items.filter((_, itemIndex) => itemIndex !== index));
    setSelectedBlockIndex(Math.max(0, Math.min(index, items.length - 2)));
  }

  function duplicateItem(index: number) {
    const copy = { ...items[index] };
    const next = [...items];
    next.splice(index + 1, 0, copy);
    commit(next);
    setSelectedBlockIndex(index + 1);
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    commit(next);
    setSelectedBlockIndex(nextIndex);
  }

  function moveItemTo(sourceIndex: number, targetIndex: number) {
    if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0 || sourceIndex >= items.length || targetIndex >= items.length) return;
    const next = [...items];
    const [item] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, item);
    commit(next);
    setSelectedBlockIndex(targetIndex);
  }

  function dropBlockAt(event: DragEvent<HTMLElement>, index: number) {
    event.preventDefault();
    event.stopPropagation();
    const blockType = draggedSectionBlockType(event.dataTransfer);
    if (blockType) {
      insertItem(blockType, index);
      return;
    }

    const sourceRaw = event.dataTransfer.getData("application/x-baaz-item-index");
    if (!sourceRaw) return;
    moveItemTo(Number(sourceRaw), index);
  }

  function dropBlockAtEnd(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const blockType = draggedSectionBlockType(event.dataTransfer);
    if (blockType) {
      insertItem(blockType);
      return;
    }

    const sourceRaw = event.dataTransfer.getData("application/x-baaz-item-index");
    if (!sourceRaw) return;
    moveItemTo(Number(sourceRaw), Math.max(items.length - 1, 0));
  }

  return (
    <section className="grid gap-4 border border-stone-3 bg-void/35 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Drag-and-drop section canvas</div>
          <p className="mt-1 text-xs leading-5 text-bone/65">Drag a block type into the canvas, or click one to add it. Drag existing blocks to reorder.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {sectionItemTypeOptions.map((type) => (
            <button
              key={type.value}
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/x-baaz-block-type", type.value);
                event.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => addItem(type.value)}
              className="min-h-16 cursor-grab border border-stone-3 bg-void/40 p-3 text-left transition-colors hover:border-neon hover:text-neon active:cursor-grabbing"
              title={`Drag or click to add ${type.label}`}
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-bone">
                <GripVertical size={13} className="text-neon" aria-hidden />
                {type.label}
              </span>
              <span className="mt-1 block text-[11px] leading-4 text-ash">{type.help}</span>
            </button>
          ))}
        </div>
      </div>

      {showStarters && starters.length > 0 && (
        <div className="grid gap-3 border border-stone-3 bg-void/30 p-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neon">Section templates</div>
              <p className="mt-1 text-xs leading-5 text-ash">Pick the block layout for this exact public section, then edit the text directly.</p>
            </div>
            {items.length > 0 && <span className="text-[11px] text-ash">Use template replaces current blocks</span>}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {starters.map((starter) => (
              <section
                key={starter.key}
                className="grid gap-3 border border-stone-3 bg-stone/35 p-3 transition-colors hover:border-neon/70"
              >
                <SectionStarterPreview starter={starter} />
                <div>
                  <div className="font-semibold text-bone">{starter.label}</div>
                  <p className="mt-1 text-xs leading-5 text-ash">{starter.help}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => replaceWithStarter(starter)} className={cn(primaryButtonClass, "min-h-10 px-3 text-xs")}>
                    <CheckCircle2 size={14} />
                    Use template
                  </button>
                  <button type="button" onClick={() => addStarter(starter)} className={cn(secondaryButtonClass, "min-h-10 px-3 text-xs")}>
                    <Plus size={14} />
                    Add below
                  </button>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div onDragOver={(event) => event.preventDefault()} onDrop={dropBlockAtEnd} className="border border-dashed border-stone-3 bg-void/25 p-4">
          <EmptyState text="No blocks yet. Drag a block type here or click Card, Stat, Link, or Timeline above." />
        </div>
      ) : (
        <div className="grid gap-4" onDragOver={(event) => event.preventDefault()} onDrop={dropBlockAtEnd}>
          {items.map((item, index) => {
            const itemType = normalizeSectionItemType(item.type);
            const active = selectedBlockIndex === index;
            const showHeroSlideFields = pageKey === "home" && sectionKey === "hero-carousel";
            const showSiteShellLinkFields = pageKey === "site" && ["navigation", "footer-links"].includes(String(sectionKey || ""));
            return (
              <div
                key={index}
                data-friendly-item={index}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => dropBlockAt(event, index)}
                className={cn(
                  "grid gap-4 border bg-stone/35 p-3 transition-colors xl:grid-cols-[240px_minmax(0,1fr)]",
                  active ? "border-neon bg-neon/5" : "border-stone-3 hover:border-bone/35"
                )}
              >
                <button type="button" onClick={() => setSelectedBlockIndex(index)} className="block text-left">
                  <SectionItemPreview item={item} index={index} type={itemType} />
                </button>
                <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <div
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("application/x-baaz-item-index", String(index));
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  className="flex cursor-grab items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neon active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVertical size={13} aria-hidden />
                  Block {index + 1}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} className={miniButtonClass} aria-label={`Move item ${index + 1} up`}>
                    <ArrowUp size={13} />
                    Up
                  </button>
                  <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className={miniButtonClass} aria-label={`Move item ${index + 1} down`}>
                    <ArrowDown size={13} />
                    Down
                  </button>
                  <button type="button" onClick={() => duplicateItem(index)} className={miniButtonClass}>
                    <Copy size={13} />
                    Duplicate
                  </button>
                  {!active && (
                    <button type="button" onClick={() => setSelectedBlockIndex(index)} className={miniButtonClass}>
                      Edit
                    </button>
                  )}
                  <button type="button" onClick={() => removeItem(index)} className={miniButtonClass}>Remove</button>
                </div>
              </div>

              {active ? (
                <>
                  <div className="grid gap-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Block type</div>
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                      {sectionItemTypeOptions.map((type) => {
                        const typeActive = type.value === itemType;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => updateItem(index, { type: type.value })}
                            className={cn(
                              "min-h-16 border p-2 text-left transition-colors",
                              typeActive ? "border-neon bg-neon/10 text-neon" : "border-stone-3 bg-void/35 text-bone hover:border-bone/35"
                            )}
                            aria-pressed={typeActive}
                          >
                            <span className="block text-xs font-semibold">{type.label}</span>
                            <span className="mt-1 block text-[11px] leading-4 text-ash">{type.help}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Label">
                      <input value={item.label || ""} onChange={(event) => updateItem(index, { label: event.target.value })} className={inputClass} />
                    </Field>
                    <Field label={itemType === "stat" ? "Number / value" : "Title / value"}>
                      <input value={item.title || item.value || ""} onChange={(event) => updateItem(index, { title: event.target.value, value: event.target.value })} className={inputClass} />
                    </Field>
                    <Field label={itemType === "timeline" ? "Description" : itemType === "stat" ? "Subtext" : "Body / subtext"} span="full">
                      <textarea value={item.body || item.sub || ""} onChange={(event) => updateItem(index, { body: event.target.value, sub: event.target.value })} className={cn(inputClass, "min-h-24 resize-y")} />
                    </Field>
                    <Field label="Link">
                      <input value={item.href || ""} onChange={(event) => updateItem(index, { href: event.target.value })} className={inputClass} />
                    </Field>
                    <Field label={itemType === "timeline" ? "Date / meta" : "Meta"}>
                      <input value={item.meta || ""} onChange={(event) => updateItem(index, { meta: event.target.value })} className={inputClass} />
                    </Field>
                    {showHeroSlideFields && (
                      <>
                        <Field label="Button label">
                          <input value={item.ctaLabel || ""} onChange={(event) => updateItem(index, { ctaLabel: event.target.value })} className={inputClass} />
                        </Field>
                        <Field label="Accent">
                          <select value={item.accent || ""} onChange={(event) => updateItem(index, { accent: event.target.value })} className={inputClass}>
                            <option value="">Use slide default</option>
                            {heroSlideAccentOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Current banner image">
                          <select value={item.imageKey || ""} onChange={(event) => updateItem(index, { imageKey: event.target.value })} className={inputClass}>
                            <option value="">Use matching slide image</option>
                            {heroSlideImageOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Custom image URL">
                          <input value={item.imageUrl || ""} onChange={(event) => updateItem(index, { imageUrl: event.target.value })} className={inputClass} placeholder="Optional Cloudinary or uploaded image URL" />
                        </Field>
                      </>
                    )}
                    {showSiteShellLinkFields && (
                      <Field label="Highlighted link">
                        <select value={item.accent || ""} onChange={(event) => updateItem(index, { accent: event.target.value })} className={inputClass}>
                          <option value="">Normal</option>
                          <option value="true">Highlighted</option>
                        </select>
                      </Field>
                    )}
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedBlockIndex(index)}
                  className="min-h-16 border border-stone-3 bg-void/30 px-4 py-3 text-left text-sm text-ash transition-colors hover:border-neon hover:text-bone"
                >
                  Select this block to edit its type, text, link, and metadata.
                </button>
              )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SectionItemPreview({ item, index, type }: { item: Record<string, string>; index: number; type: SectionItemType }) {
  const label = item.label || (type === "timeline" ? "Milestone" : type === "stat" ? "Metric" : "Label");
  const title = item.title || item.value || (type === "stat" ? "0" : "Untitled");
  const body = item.body || item.sub || "";
  const meta = item.meta || "";

  if (type === "stat") {
    return (
      <div className="grid content-between gap-4 border border-stone-3 bg-void/45 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neon">Stat {String(index + 1).padStart(2, "0")}</span>
          <Type size={14} className="text-ash" aria-hidden />
        </div>
        <div>
          <div className="text-3xl font-semibold leading-none text-bone">{title}</div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">{label}</div>
          {body && <p className="mt-3 text-xs leading-5 text-bone/65">{body}</p>}
        </div>
      </div>
    );
  }

  if (type === "link") {
    return (
      <div className="grid content-between gap-4 border border-stone-3 bg-void/45 p-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neon">{label}</div>
        <div>
          <div className="text-base font-semibold leading-tight text-bone">{title}</div>
          {body && <p className="mt-2 text-xs leading-5 text-ash">{body}</p>}
          <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
            {meta || "Open"}
            <ArrowUpRight size={13} aria-hidden />
          </div>
        </div>
      </div>
    );
  }

  if (type === "timeline") {
    return (
      <div className="grid gap-3 border border-stone-3 bg-void/45 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center border border-neon/60 bg-neon/10 font-mono text-[10px] text-neon">{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ash">{meta || label}</div>
            <div className="mt-1 text-base font-semibold leading-tight text-bone">{title}</div>
            {body && <p className="mt-2 text-xs leading-5 text-ash">{body}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid content-between gap-4 border border-stone-3 bg-void/45 p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neon">{label}</div>
      <div>
        <div className="text-base font-semibold leading-tight text-bone">{title}</div>
        {body && <p className="mt-2 text-xs leading-5 text-ash">{body}</p>}
        {meta && <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-ash">{meta}</div>}
      </div>
    </div>
  );
}

function SectionStarterPreview({ starter }: { starter: SectionStarter }) {
  const previewItems = starter.items.slice(0, 4);
  const firstType = normalizeSectionItemType(previewItems[0]?.type);
  const gridClass = firstType === "stat" ? "grid-cols-2" : firstType === "timeline" ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className={cn("grid gap-2 border border-stone-3 bg-void/35 p-3", gridClass)}>
      {previewItems.map((item, index) => {
        const itemType = normalizeSectionItemType(item.type);
        const label = item.label || `Block ${index + 1}`;
        const title = item.title || item.value || "Untitled";
        const body = item.body || item.sub || "";
        const meta = item.meta || "";

        if (itemType === "stat") {
          return (
            <div key={`${starter.key}-${index}`} className="border border-stone-3 bg-stone/35 p-3">
              <div className="text-xl font-semibold leading-none text-bone">{title}</div>
              <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-ash">{label}</div>
            </div>
          );
        }

        if (itemType === "timeline") {
          return (
            <div key={`${starter.key}-${index}`} className="flex items-start gap-2 border border-stone-3 bg-stone/35 p-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center border border-neon/50 font-mono text-[9px] text-neon">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold text-bone">{title}</span>
                <span className="mt-1 block truncate font-mono text-[8px] uppercase tracking-[0.14em] text-ash">{meta || label}</span>
              </span>
            </div>
          );
        }

        if (itemType === "link") {
          return (
            <div key={`${starter.key}-${index}`} className="border border-stone-3 bg-stone/35 p-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-neon">{label}</div>
              <div className="mt-1 truncate text-xs font-semibold text-bone">{title}</div>
              <div className="mt-2 inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.14em] text-ash">
                {meta || "Open"} <ArrowUpRight size={10} />
              </div>
            </div>
          );
        }

        return (
          <div key={`${starter.key}-${index}`} className="border border-stone-3 bg-stone/35 p-3">
            <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-neon">{label}</div>
            <div className="mt-1 line-clamp-2 text-xs font-semibold leading-tight text-bone">{title}</div>
            {body && <div className="mt-1 line-clamp-2 text-[11px] leading-4 text-ash">{body}</div>}
          </div>
        );
      })}
    </div>
  );
}

function normalizeSectionItemType(value: string | undefined): SectionItemType {
  return sectionItemTypeOptions.some((option) => option.value === value) ? (value as SectionItemType) : "card";
}

function draggedSectionBlockType(dataTransfer: DataTransfer): SectionItemType | undefined {
  const value = dataTransfer.getData("application/x-baaz-block-type");
  return sectionItemTypeOptions.some((option) => option.value === value) ? (value as SectionItemType) : undefined;
}

function sectionItemDefaults(type: SectionItemType): Record<string, string> {
  const defaults: Record<SectionItemType, Record<string, string>> = {
    card: {
      label: "Feature",
      title: "New card",
      value: "New card",
      body: "",
      sub: "",
      href: "",
      meta: "",
      type: "card",
    },
    stat: {
      label: "Metric label",
      title: "0",
      value: "0",
      body: "Short metric note",
      sub: "Short metric note",
      href: "",
      meta: "",
      type: "stat",
    },
    link: {
      label: "Link",
      title: "New link",
      value: "New link",
      body: "",
      sub: "",
      href: "",
      meta: "Open",
      type: "link",
    },
    timeline: {
      label: "Milestone",
      title: "Timeline item",
      value: "Timeline item",
      body: "What happened here.",
      sub: "What happened here.",
      href: "",
      meta: "2026",
      type: "timeline",
    },
  };

  return defaults[type];
}

function sectionStartersFor(pageKey: string, sectionKey: string): SectionStarter[] {
  const normalizedSection = sectionKey || defaultPageContentSection(pageKey || "home");
  if (pageKey === "posts" && normalizedSection === "facts") {
    return [
      {
        key: "feature-stat-grid",
        label: "Four stat tiles",
        help: "Use this for full-width proof points like entrants, events, countries, and circuit notes.",
        items: [
          { label: "Cumulative entrants", title: "1,235+", value: "1,235+", body: "", type: "stat" },
          { label: "Major events", title: "6", value: "6", body: "", type: "stat" },
          { label: "Countries hosted", title: "06", value: "06", body: "", type: "stat" },
          { label: "Circuit signal", title: "TWT", value: "TWT", body: "", type: "stat" },
        ],
      },
    ];
  }
  if (pageKey === "site") return siteShellStartersFor(normalizedSection);
  const starterMap: Record<string, SectionStarter[]> = {
    "hero-carousel": [heroCarouselStarter()],
    marquee: [makeStarter("feature-cards", "Add hero marquee cards", "Good for homepage rotating labels or headline chips.", "card", 4, "Marquee")],
    stats: [makeStarter("stats-row", "Add stat row", "Matches homepage metric tiles.", "stat", 4, "Metric")],
    "hero-stats": [makeStarter("hero-stats", "Add PTL hero stats", "Matches the stat tiles beside the PTL hero.", "stat", 4, "PTL stat")],
    "partner-pitch": [makeStarter("partner-stats", "Add sponsor stats", "Useful for the full-width sponsor pitch area.", "stat", 4, "Audience stat")],
    "stage-timeline": [makeStarter("stage-timeline", "Add PTL timeline rows", "Use for stages, dates, venues, and schedule notes.", "timeline", 4, "Stage")],
    timeline: [makeStarter("about-timeline", "Add story timeline rows", "Use for the About page history timeline.", "timeline", 4, "Milestone")],
    "watch-links": [makeStarter("watch-links", "Add watch link cards", "Use for Twitch, YouTube, stream, and VOD links.", "link", 2, "Watch link")],
    "watch-channels": [makeStarter("watch-channels", "Add channel cards", "Use for live channel destinations.", "link", 2, "Channel")],
    "recent-broadcasts": [makeStarter("recent-broadcasts", "Add broadcast cards", "Use for recent VODs, recaps, and stream archives.", "link", 3, "Broadcast")],
    "contact-cards": [makeStarter("contact-cards", "Add contact cards", "Use for email, socials, partnerships, and inquiry blocks.", "link", 3, "Contact")],
    "bracket-placeholder": [makeStarter("bracket-info", "Add bracket info card", "Use for start.gg status, embed notes, and live bracket messaging.", "card", 1, "Bracket")],
    standings: [makeStarter("standings-info", "Add standings info card", "Use for points-race copy or standings availability.", "card", 1, "Standings")],
    "legacy-events": [makeStarter("feature-cards", "Add event feature cards", "Use when this section needs event story cards.", "card", 3, "Event")],
    "players-preview": [makeStarter("player-cards", "Add player cards", "Use when this section needs highlighted player cards.", "card", 3, "Player")],
    "team-organizations": [makeStarter("team-cards", "Add team cards", "Use for sponsor or organization groups.", "card", 3, "Team")],
    broadcast: [makeStarter("broadcast-cards", "Add broadcast cards", "Use for broadcast partners and distribution blocks.", "link", 3, "Broadcast")],
  };

  if (starterMap[normalizedSection]) return starterMap[normalizedSection];

  if (normalizedSection.includes("stats")) return [makeStarter(`${normalizedSection}-stats`, "Add stat blocks", "Best for values, numbers, and compact metric cards.", "stat", 3, "Metric")];
  if (normalizedSection.includes("timeline") || normalizedSection.includes("stage")) return [makeStarter(`${normalizedSection}-timeline`, "Add timeline rows", "Best for ordered milestones, dates, and schedule rows.", "timeline", 3, "Milestone")];
  if (normalizedSection.includes("watch") || normalizedSection.includes("contact")) return [makeStarter(`${normalizedSection}-links`, "Add link blocks", "Best for destinations, emails, streams, and CTAs.", "link", 2, "Link")];
  return [makeStarter(`${normalizedSection}-cards`, "Add content cards", "Best for general cards in this section.", "card", 2, "Card")];
}

function siteShellStartersFor(sectionKey: string): SectionStarter[] {
  if (sectionKey === "navigation") {
    return [
      {
        key: "current-main-navigation",
        label: "Use current main navigation",
        help: "Editable links for the top navigation bar. Set Accent to true for the highlighted item.",
        items: [
          { label: "PTL 2026", title: "PTL 2026", href: "/ptl-2026", type: "link", accent: "true" },
          { label: "Events", title: "Events", href: "/events", type: "link" },
          { label: "Players", title: "Players", href: "/players", type: "link" },
          { label: "Sponsors", title: "Sponsors", href: "/sponsors", type: "link" },
          { label: "Watch", title: "Watch", href: "/watch", type: "link" },
          { label: "About", title: "About", href: "/about", type: "link" },
        ],
      },
    ];
  }

  if (sectionKey === "footer-links") {
    return [
      {
        key: "current-footer-links",
        label: "Use current footer links",
        help: "Editable links shown in the footer Explore column.",
        items: [
          { label: "PTL 2026", title: "PTL 2026", href: "/ptl-2026", type: "link", accent: "true" },
          { label: "Events", title: "Events", href: "/events", type: "link" },
          { label: "Players", title: "Players", href: "/players", type: "link" },
          { label: "Sponsors", title: "Sponsors", href: "/sponsors", type: "link" },
          { label: "Watch", title: "Watch", href: "/watch", type: "link" },
        ],
      },
    ];
  }

  if (sectionKey === "watch-links") {
    return [
      {
        key: "current-footer-watch-links",
        label: "Use current watch links",
        help: "Editable external links shown in the footer Watch live column.",
        items: [
          { label: "twitch.tv/baaz_gg", title: "Twitch", href: "https://twitch.tv/baaz_gg", type: "link" },
          { label: "youtube.com/@baazgg", title: "YouTube", href: "https://youtube.com/@baazgg", type: "link" },
        ],
      },
    ];
  }

  if (sectionKey === "footer") {
    return [
      {
        key: "current-footer-bottom-line",
        label: "Use current footer bottom line",
        help: "Stores the copyright location line and the small footer motto.",
        items: [{ label: "BAAZ GG. Lahore, Pakistan.", title: "// EAT. SLEEP. COMBO. REPEAT.", type: "card" }],
      },
    ];
  }

  return [makeStarter(`${sectionKey}-links`, "Add editable rows", "Use rows for shell links, footer copy, or brand notes.", "link", 2, "Shell")];
}

function heroCarouselStarter(): SectionStarter {
  return {
    key: "current-home-hero",
    label: "Use current homepage hero slides",
    help: "Starts with the three live carousel banners, then you can edit copy, links, order, or image URL overrides.",
    items: [
      {
        label: "NATIONAL TEAM - ESPORTS NATIONS CUP 2026",
        title: "DANYAL CHISHTY\nNAMED PAKISTAN'S\nNATIONAL TEAM MANAGER",
        body: "BAAZ founder Danyal Chishty will lead Team Pakistan at the inaugural Esports Nations Cup.",
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
        body: "The Pakistan Tekken League regular season runs four stages from April to July.",
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
        body: "Takedown returns in 2026 as the defining stage of the national circuit.",
        href: "/events",
        meta: "LAHORE, PAKISTAN",
        type: "card",
        ctaLabel: "Save the date",
        accent: "blood",
        imageKey: "takedown-2026",
      },
    ],
  };
}

function makeStarter(key: string, label: string, help: string, type: SectionItemType, count: number, prefix: string): SectionStarter {
  return {
    key,
    label,
    help,
    items: Array.from({ length: count }, (_, index) => {
      const item = sectionItemDefaults(type);
      const number = index + 1;
      return {
        ...item,
        label: `${prefix} ${number}`,
        title: type === "stat" ? "0" : `${prefix} ${number}`,
        value: type === "stat" ? "0" : `${prefix} ${number}`,
        body: type === "stat" ? "Short stat note" : type === "timeline" ? "Add the detail for this row." : "",
        sub: type === "stat" ? "Short stat note" : type === "timeline" ? "Add the detail for this row." : "",
        meta: type === "timeline" ? "Date" : item.meta,
      };
    }),
  };
}

function VisualPostComposer({
  selectedId,
  selectedTemplate,
  form,
  media,
  uploadFile,
  uploadAlt,
  uploadCaption,
  busy,
  onFormChange,
  onFileChange,
  onAltChange,
  onCaptionChange,
  onInlineUpload,
  onDropUpload,
}: {
  selectedId?: string | null;
  selectedTemplate?: PostTemplate;
  form: FormState;
  media: MediaAsset[];
  uploadFile: File | null;
  uploadAlt: string;
  uploadCaption: string;
  busy: boolean;
  onFormChange: (patch: FormState) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAltChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onInlineUpload: () => void;
  onDropUpload: (file: File) => void;
}) {
  return (
    <Panel title={selectedId ? "Edit Post Visually" : "Create Post Visually"} icon={<MousePointer2 size={18} />}>
      <div className="grid gap-5">
        {selectedTemplate ? (
          <EditableTemplateCanvas
            template={selectedTemplate}
            form={form}
            media={media}
            uploadFile={uploadFile}
            uploadAlt={uploadAlt}
            uploadCaption={uploadCaption}
            busy={busy}
            onFormChange={onFormChange}
            onFileChange={onFileChange}
            onAltChange={onAltChange}
            onCaptionChange={onCaptionChange}
            onInlineUpload={onInlineUpload}
            onDropUpload={onDropUpload}
          />
        ) : (
          <EmptyState text="Choose a template from the right panel to start editing directly on the design." />
        )}
      </div>
    </Panel>
  );
}

function EditableTemplateCanvas({
  template,
  form,
  media,
  uploadFile,
  uploadAlt,
  uploadCaption,
  busy,
  onFormChange,
  onFileChange,
  onAltChange,
  onCaptionChange,
  onInlineUpload,
  onDropUpload,
}: {
  template: PostTemplate;
  form: FormState;
  media: MediaAsset[];
  uploadFile: File | null;
  uploadAlt: string;
  uploadCaption: string;
  busy: boolean;
  onFormChange: (patch: FormState) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAltChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onInlineUpload: () => void;
  onDropUpload: (file: File) => void;
}) {
  const example = exampleForTemplate(template);
  const order = normalizePostBlockOrder(form.templateBlockOrder, template);
  const approvedBlocks = defaultPostBlockOrder(template);
  const hiddenBlocks = approvedBlocks.filter((block) => !order.includes(block));
  const selectedImage = media.find((asset) => asset.id === form.coverImageId);

  function moveBlock(draggedKey: EditablePostBlockKey, targetKey: EditablePostBlockKey) {
    if (draggedKey === targetKey) return;
    const fromIndex = order.indexOf(draggedKey);
    const toIndex = order.indexOf(targetKey);
    if (fromIndex < 0 || toIndex < 0) return;
    const nextOrder = [...order];
    nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, draggedKey);
    onFormChange({ templateBlockOrder: nextOrder.join(",") });
  }

  function removeBlock(blockKey: EditablePostBlockKey) {
    if (requiredTemplateBlocks.has(blockKey)) return;
    const nextOrder = order.filter((block) => block !== blockKey);
    onFormChange({ templateBlockOrder: nextOrder.join(",") });
  }

  function addBlock(blockKey: EditablePostBlockKey) {
    if (!approvedBlocks.includes(blockKey) || order.includes(blockKey)) return;
    onFormChange({ templateBlockOrder: [...order, blockKey].join(",") });
  }

  function resetOrder() {
    onFormChange({ templateBlockOrder: defaultPostBlockOrder(template).join(",") });
  }

  const blockRenderer = (blockKey: EditablePostBlockKey) => (
    <EditablePostBlock
      key={blockKey}
      blockKey={blockKey}
      template={template}
      example={example}
      form={form}
      media={media}
      selectedImage={selectedImage}
      uploadFile={uploadFile}
      uploadAlt={uploadAlt}
      uploadCaption={uploadCaption}
      busy={busy}
      onFormChange={onFormChange}
      onFileChange={onFileChange}
      onAltChange={onAltChange}
      onCaptionChange={onCaptionChange}
      onInlineUpload={onInlineUpload}
      onDropUpload={onDropUpload}
      onMoveBlock={moveBlock}
      onRemoveBlock={removeBlock}
    />
  );

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 border border-stone-3 bg-void/30 p-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">Direct template editor</div>
          <p className="mt-1 text-sm leading-6 text-ash">
            Click inside the design to edit. Drag approved blocks by the handle to reorder them safely.
          </p>
        </div>
        <button type="button" onClick={resetOrder} className={miniButtonClass}>
          Reset order
        </button>
      </div>

      <CanvasBlockShelf order={order} hiddenBlocks={hiddenBlocks} onAdd={addBlock} />

      <div className="scanline border border-stone-3 bg-stone/35 p-4">
        <EditableTemplateShell template={template} order={order} renderBlock={blockRenderer} />
      </div>

      <details className="border border-stone-3 bg-void/30">
        <summary className="cursor-pointer px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
          Pick existing image instead
        </summary>
        <div className="border-t border-stone-3 p-4">
          <MediaPicker
            media={media}
            selectedId={String(form.coverImageId || "")}
            uploadFile={uploadFile}
            uploadAlt={uploadAlt}
            uploadCaption={uploadCaption}
            busy={busy}
            onSelect={(id) => onFormChange({ coverImageId: id })}
            onFileChange={onFileChange}
            onAltChange={onAltChange}
            onCaptionChange={onCaptionChange}
            onUpload={onInlineUpload}
          />
        </div>
      </details>
    </section>
  );
}

function EditableTemplateShell({
  template,
  order,
  renderBlock,
}: {
  template: PostTemplate;
  order: EditablePostBlockKey[];
  renderBlock: (blockKey: EditablePostBlockKey) => ReactNode;
}) {
  const kind = exampleForTemplate(template).kind;
  const image = order.includes("image") ? renderBlock("image") : null;
  const facts = order.includes("facts") ? renderBlock("facts") : null;
  const textBlocks = order.filter((key) => key !== "image" && key !== "facts").map(renderBlock);

  if (kind === "fullWidth") {
    return (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid content-start gap-3">{textBlocks}</div>
        <div className="grid content-start gap-3">{facts || image}</div>
      </div>
    );
  }

  if (kind === "stats") {
    return (
      <div className="grid gap-4">
        <div className="grid gap-3">{textBlocks}</div>
        {facts}
      </div>
    );
  }

  if (kind === "player") {
    return (
      <div className="grid gap-5 lg:grid-cols-[170px_minmax(0,1fr)]">
        <div>{image}</div>
        <div className="grid content-start gap-3">{textBlocks}</div>
      </div>
    );
  }

  if (kind === "hero" || kind === "imageFeature" || kind === "video") {
    return (
      <div className="grid gap-4">
        {image}
        <div className="grid gap-3">{textBlocks}</div>
      </div>
    );
  }

  return <div className="grid gap-3">{order.map(renderBlock)}</div>;
}

function CanvasBlockShelf({
  order,
  hiddenBlocks,
  onAdd,
}: {
  order: EditablePostBlockKey[];
  hiddenBlocks: EditablePostBlockKey[];
  onAdd: (blockKey: EditablePostBlockKey) => void;
}) {
  return (
    <section className="grid gap-3 border border-stone-3 bg-void/30 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neon">Canvas blocks</div>
          <p className="mt-1 text-xs leading-5 text-ash">Drag blocks on the canvas. Hide optional blocks or add them back from this approved shelf.</p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
          {order.length} active / {hiddenBlocks.length} hidden
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {order.map((block) => (
          <span key={block} className="inline-flex min-h-9 items-center gap-2 border border-neon/35 bg-neon/10 px-3 text-xs font-medium text-bone">
            <GripVertical size={13} className="text-neon" aria-hidden />
            {postBlockLabels[block]}
          </span>
        ))}
        {hiddenBlocks.map((block) => (
          <button key={block} type="button" onClick={() => onAdd(block)} className={miniButtonClass}>
            <Plus size={13} />
            Add {postBlockLabels[block]}
          </button>
        ))}
        {hiddenBlocks.length === 0 && (
          <span className="inline-flex min-h-9 items-center border border-stone-3 bg-void/35 px-3 text-xs text-ash">
            All approved blocks are visible.
          </span>
        )}
      </div>
    </section>
  );
}

function EditablePostBlock({
  blockKey,
  template,
  example,
  form,
  media,
  selectedImage,
  uploadFile,
  uploadAlt,
  uploadCaption,
  busy,
  onFormChange,
  onFileChange,
  onAltChange,
  onCaptionChange,
  onInlineUpload,
  onDropUpload,
  onMoveBlock,
  onRemoveBlock,
}: {
  blockKey: EditablePostBlockKey;
  template: PostTemplate;
  example: TemplateExample;
  form: FormState;
  media: MediaAsset[];
  selectedImage?: MediaAsset;
  uploadFile: File | null;
  uploadAlt: string;
  uploadCaption: string;
  busy: boolean;
  onFormChange: (patch: FormState) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAltChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onInlineUpload: () => void;
  onDropUpload: (file: File) => void;
  onMoveBlock: (draggedKey: EditablePostBlockKey, targetKey: EditablePostBlockKey) => void;
  onRemoveBlock: (blockKey: EditablePostBlockKey) => void;
}) {
  const label = postBlockLabels[blockKey];
  const canRemove = !requiredTemplateBlocks.has(blockKey);

  return (
    <section
      data-editor-block={blockKey}
      draggable
      onDragStart={(event) => event.dataTransfer.setData("text/plain", blockKey)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const draggedKey = event.dataTransfer.getData("text/plain") as EditablePostBlockKey;
        if (postBlockLabels[draggedKey]) onMoveBlock(draggedKey, blockKey);
      }}
      className="group border border-stone-3 bg-void/40 p-3 transition-colors hover:border-bone/35"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
          <GripVertical size={14} className="text-neon" aria-hidden />
          {label}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-ash opacity-0 transition-opacity group-hover:opacity-100">Drag to reorder</div>
          {canRemove && (
            <button type="button" onClick={() => onRemoveBlock(blockKey)} className={miniButtonClass}>
              Hide
            </button>
          )}
        </div>
      </div>

      {blockKey === "image" ? (
        <EditableImageBlock
          media={media}
          selectedImage={selectedImage}
          selectedId={String(form.coverImageId || "")}
          uploadFile={uploadFile}
          uploadAlt={uploadAlt}
          uploadCaption={uploadCaption}
          busy={busy}
          onSelect={(id) => onFormChange({ coverImageId: id })}
          onFileChange={onFileChange}
          onAltChange={onAltChange}
          onCaptionChange={onCaptionChange}
          onInlineUpload={onInlineUpload}
          onDropUpload={onDropUpload}
        />
      ) : blockKey === "facts" ? (
        <PostFactsBlock value={String(form.itemsText || "")} onChange={(itemsText) => onFormChange({ itemsText })} />
      ) : blockKey === "cta" ? (
        <EditableCtaFields
          label={String(form.ctaLabel || template.defaultCtaLabel || example.ctaLabel || "")}
          href={String(form.ctaHref || "")}
          onChange={onFormChange}
        />
      ) : (
        <EditableTextField
          blockKey={blockKey}
          template={template}
          example={example}
          form={form}
          onChange={onFormChange}
        />
      )}
    </section>
  );
}

function EditableTextField({
  blockKey,
  template,
  example,
  form,
  onChange,
}: {
  blockKey: Exclude<EditablePostBlockKey, "image" | "facts" | "cta">;
  template: PostTemplate;
  example: TemplateExample;
  form: FormState;
  onChange: (patch: FormState) => void;
}) {
  const configByKey: Record<Exclude<EditablePostBlockKey, "image" | "facts" | "cta">, { field: keyof FormState; fallback: string; className: string; rows: number }> = {
    eyebrow: {
      field: "eyebrow",
      fallback: String(template.defaultEyebrow || example.eyebrow || "POST"),
      className: "font-mono text-[11px] uppercase tracking-[0.22em] text-neon",
      rows: 1,
    },
    title: {
      field: "title",
      fallback: example.title,
      className: "text-3xl font-semibold uppercase leading-none text-bone md:text-5xl",
      rows: 2,
    },
    excerpt: {
      field: "excerpt",
      fallback: example.excerpt,
      className: "text-base leading-7 text-ash",
      rows: 3,
    },
    bodyText: {
      field: "bodyText",
      fallback: example.body || example.excerpt,
      className: "text-sm leading-7 text-bone/75",
      rows: 5,
    },
  };
  const config = configByKey[blockKey];
  const value = String(form[config.field] || "");

  return (
    <textarea
      value={value}
      onChange={(event) => onChange({ [config.field]: event.target.value })}
      placeholder={config.fallback}
      rows={config.rows}
      className={cn(
        "min-h-11 w-full resize-y border border-transparent bg-transparent p-2 outline-none transition-colors placeholder:text-bone/35 hover:border-stone-3 focus:border-neon focus:bg-void/45",
        config.className
      )}
    />
  );
}

function PostFactsBlock({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <section className="grid gap-3">
      <div className="border border-stone-3 bg-void/35 p-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neon">Feature facts</div>
        <p className="mt-1 text-xs leading-5 text-ash">
          Add the number tiles for wide posts, proof points, sponsor pitches, and stats callouts. Use Stat blocks for the screenshot-style layout.
        </p>
      </div>
      <FriendlyItemsEditor value={value} pageKey="posts" sectionKey="facts" showStarters onChange={onChange} />
    </section>
  );
}

function EditableCtaFields({ label, href, onChange }: { label: string; href: string; onChange: (patch: FormState) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <input
        value={label}
        onChange={(event) => onChange({ ctaLabel: event.target.value })}
        placeholder="Button label"
        className="min-h-12 border border-neon/70 bg-neon px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-void outline-none placeholder:text-void/45"
      />
      <input
        value={href}
        onChange={(event) => onChange({ ctaHref: event.target.value })}
        placeholder="Button link"
        className={inputClass}
      />
    </div>
  );
}

function EditableImageBlock({
  media,
  selectedImage,
  selectedId,
  uploadFile,
  uploadAlt,
  uploadCaption,
  busy,
  onSelect,
  onFileChange,
  onAltChange,
  onCaptionChange,
  onInlineUpload,
  onDropUpload,
}: {
  media: MediaAsset[];
  selectedImage?: MediaAsset;
  selectedId: string;
  uploadFile: File | null;
  uploadAlt: string;
  uploadCaption: string;
  busy: boolean;
  onSelect: (id: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAltChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onInlineUpload: () => void;
  onDropUpload: (file: File) => void;
}) {
  const imageSrc = mediaUrl(selectedImage?.url || "");

  return (
    <div className="grid gap-3">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file) onDropUpload(file);
        }}
        className="grid min-h-[220px] place-items-center overflow-hidden border border-dashed border-stone-3 bg-void/50"
      >
        {imageSrc ? (
          <div className="relative h-full w-full">
            <img src={imageSrc} alt={selectedImage?.alt || selectedImage?.originalName || ""} className="h-full max-h-[360px] w-full object-cover" />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 border border-stone-3 bg-void/80 p-2 backdrop-blur">
              <div className="min-w-0 truncate text-xs text-bone">{selectedImage?.originalName || "Current image"}</div>
              <button type="button" onClick={() => onSelect("")} className={miniButtonClass}>
                Remove image
              </button>
            </div>
          </div>
        ) : (
          <div className="grid justify-items-center gap-3 p-6 text-center">
            <Images className="h-8 w-8 text-neon" aria-hidden />
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">Drop image here</div>
            <div className="max-w-sm text-sm leading-6 text-bone/70">Drag a post image onto this area, or choose an uploaded image below.</div>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Use uploaded image">
          <select value={selectedId} onChange={(event) => onSelect(event.target.value)} className={inputClass}>
            <option value="">No image</option>
            {media.map((asset) => (
              <option key={asset.id} value={asset.id}>{asset.originalName || asset.filename}</option>
            ))}
          </select>
        </Field>
        <Field label="Upload new image">
          <input type="file" accept="image/*" onChange={onFileChange} className={fileInputClass} />
        </Field>
      </div>

      {uploadFile && (
        <div className="grid gap-3 border border-stone-3 bg-void/35 p-3">
          <div className="text-sm font-medium text-bone">{uploadFile.name}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Alt text">
              <input value={uploadAlt} onChange={(event) => onAltChange(event.target.value)} className={inputClass} />
            </Field>
            <Field label="Caption">
              <input value={uploadCaption} onChange={(event) => onCaptionChange(event.target.value)} className={inputClass} />
            </Field>
          </div>
          <button type="button" disabled={busy} onClick={onInlineUpload} className={secondaryButtonClass}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud size={16} />}
            Upload and use image
          </button>
        </div>
      )}
    </div>
  );
}

function ItemList({
  title,
  icon,
  rows,
  selectedId,
  label,
  description,
  onNew,
  onSelect,
  onDelete,
  rowActions,
}: {
  title: string;
  icon: ReactNode;
  rows: Row[];
  selectedId?: string | null;
  label: (row: Row) => string;
  description?: (row: Row) => string;
  onNew: () => void;
  onSelect: (row: Row) => void;
  onDelete: (row: Row) => void;
  rowActions?: (row: Row) => ReactNode;
}) {
  return (
    <Panel title={title} icon={icon}>
      <button type="button" onClick={onNew} className={cn(primaryButtonClass, "mb-4 w-full justify-center")}>
        <Plus size={15} />
        New
      </button>
      {rows.length === 0 ? (
        <EmptyState text={`No ${title.toLowerCase()} yet.`} />
      ) : (
        <div className="grid max-h-[680px] gap-2 overflow-y-auto pr-1">
          {rows.map((row) => (
            <div key={row.id} className={cn("border bg-void/30 p-3 transition-colors", selectedId === row.id ? "border-neon bg-neon/5" : "border-stone-3 hover:border-bone/25")}>
              <button type="button" onClick={() => onSelect(row)} className="block w-full min-w-0 text-left">
                <div className="truncate text-sm font-medium text-bone">{label(row)}</div>
                <div className="mt-1 truncate text-xs text-ash">{description?.(row) || row.id}</div>
              </button>
              <div className="mt-3 flex flex-wrap gap-2">
                {rowActions?.(row)}
                <button type="button" onClick={() => onSelect(row)} className={miniButtonClass}>Edit</button>
                <button type="button" onClick={() => onDelete(row)} className={iconButtonClass} aria-label={`Delete ${label(row)}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function TemplateVisualPreview({
  template,
  form,
  media = [],
  mode,
  compact = false,
  selected = false,
}: {
  template: PostTemplate;
  form?: FormState;
  media?: MediaAsset[];
  mode: "sample" | "live";
  compact?: boolean;
  selected?: boolean;
}) {
  const example = exampleForTemplate(template);
  const isLive = mode === "live";
  const title = isLive ? String(form?.title || example.title) : example.title;
  const eyebrow = isLive ? String(form?.eyebrow || template.defaultEyebrow || example.eyebrow || template.name) : String(example.eyebrow || template.defaultEyebrow || template.key);
  const excerpt = isLive ? String(form?.excerpt || form?.bodyText || example.excerpt) : example.excerpt;
  const ctaLabel = isLive ? String(form?.ctaLabel || template.defaultCtaLabel || example.ctaLabel || "") : String(example.ctaLabel || template.defaultCtaLabel || "");
  const imageSrc = isLive && form ? previewImage("posts", form, media) : undefined;
  const approvedBlocks = defaultPostBlockOrder(template);
  const showEyebrow = approvedBlocks.includes("eyebrow");
  const showExcerpt = approvedBlocks.includes("excerpt") || approvedBlocks.includes("bodyText");
  const showImage = approvedBlocks.includes("image");
  const showCta = approvedBlocks.includes("cta");
  const liveStats = isLive && form ? itemsFromText(form.itemsText).map((item) => ({ value: item.value || item.title || item.label, label: item.label || item.body || "Fact" })) : [];
  const stats = liveStats.length > 0 ? liveStats : example.stats || defaultTemplateStats(example.kind);
  const points = example.points || defaultTemplatePoints(example.kind);
  const shellClass = cn(
    "h-full overflow-hidden border bg-stone/35 transition-colors",
    compact ? "p-3" : "p-4",
    selected ? "border-neon bg-neon/5 shadow-[inset_0_1px_0_rgba(200,255,45,0.18)]" : "border-stone-3 hover:border-bone/35"
  );
  const headingClass = compact ? "text-base" : "text-xl";
  const bodyClass = compact ? "text-xs leading-5" : "text-sm leading-6";

  if (example.kind === "fullWidth") {
    return (
      <article className={shellClass}>
        <div className={cn("grid gap-4", compact ? "" : "lg:grid-cols-[minmax(0,1fr)_minmax(180px,0.9fr)]")}>
          <div className="min-w-0">
            {showEyebrow && <TemplatePreviewEyebrow value={eyebrow} selected={selected} />}
            <h3 className={cn("mt-2 font-semibold uppercase leading-none text-bone", compact ? "text-lg" : "text-3xl")}>{title}</h3>
            {showExcerpt && <p className={cn("mt-3 text-ash", bodyClass)}>{excerpt}</p>}
            {showCta && ctaLabel && <TemplatePreviewCta label={ctaLabel} />}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {stats.slice(0, 4).map((stat) => (
              <div key={`${stat.value}-${stat.label}`} className="border border-stone-3 bg-void/35 p-3">
                <div className={cn("font-semibold text-bone", compact ? "text-lg" : "text-2xl")}>{stat.value}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ash">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </article>
    );
  }

  if (example.kind === "stats") {
    return (
      <article className={shellClass}>
        {showEyebrow && <TemplatePreviewEyebrow value={eyebrow} selected={selected} />}
        <h3 className={cn("mt-2 font-semibold leading-tight text-bone", headingClass)}>{title}</h3>
        {showExcerpt && <p className={cn("mt-2 text-ash", bodyClass)}>{excerpt}</p>}
        <div className={cn("mt-4 grid gap-2", compact ? "grid-cols-3" : "grid-cols-3")}>
          {stats.slice(0, 3).map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className="border border-stone-3 bg-void/35 p-3">
              <div className={cn("font-semibold text-neon", compact ? "text-base" : "text-2xl")}>{stat.value}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ash">{stat.label}</div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (example.kind === "results") {
    return (
      <article className={shellClass}>
        {showEyebrow && <TemplatePreviewEyebrow value={eyebrow} selected={selected} />}
        <h3 className={cn("mt-2 font-semibold leading-tight text-bone", headingClass)}>{title}</h3>
        {showExcerpt && <p className={cn("mt-2 text-ash", bodyClass)}>{excerpt}</p>}
        <div className="mt-4 grid gap-2">
          {["Champion", "Runner-up", "Third place"].map((label, index) => (
            <div key={label} className="flex items-center justify-between gap-3 border border-stone-3 bg-void/35 px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-sm font-semibold text-bone">{points[index] || label}</span>
            </div>
          ))}
        </div>
        {showCta && ctaLabel && <TemplatePreviewCta label={ctaLabel} />}
      </article>
    );
  }

  if (example.kind === "player") {
    return (
      <article className={shellClass}>
        <div className={cn("grid gap-4", showImage && (compact ? "grid-cols-[82px_minmax(0,1fr)]" : "sm:grid-cols-[120px_minmax(0,1fr)]"))}>
          {showImage && <TemplatePreviewImageSlot imageSrc={imageSrc} label={example.imageLabel || "Player image"} compact={compact} portrait />}
          <div className="min-w-0">
            {showEyebrow && <TemplatePreviewEyebrow value={eyebrow} selected={selected} />}
            <h3 className={cn("mt-2 font-semibold leading-tight text-bone", headingClass)}>{title}</h3>
            {showExcerpt && <p className={cn("mt-2 text-ash", bodyClass)}>{excerpt}</p>}
            <TemplatePointList points={points} compact={compact} />
          </div>
        </div>
      </article>
    );
  }

  if (example.kind === "sponsor") {
    return (
      <article className={shellClass}>
        {showEyebrow && <TemplatePreviewEyebrow value={eyebrow} selected={selected} />}
        <div className="mt-3 border border-stone-3 bg-void/40 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon">Partner block</div>
          <h3 className={cn("mt-3 font-semibold leading-tight text-bone", headingClass)}>{title}</h3>
          {showExcerpt && <p className={cn("mt-2 text-ash", bodyClass)}>{excerpt}</p>}
        </div>
        {showCta && ctaLabel && <TemplatePreviewCta label={ctaLabel} />}
      </article>
    );
  }

  if (example.kind === "video") {
    return (
      <article className={shellClass}>
        {showImage && <TemplatePreviewImageSlot imageSrc={imageSrc} label={example.imageLabel || "Video preview"} compact={compact} />}
        {showEyebrow && <TemplatePreviewEyebrow value={eyebrow} selected={selected} />}
        <h3 className={cn("mt-2 font-semibold leading-tight text-bone", headingClass)}>{title}</h3>
        {showExcerpt && <p className={cn("mt-2 text-ash", bodyClass)}>{excerpt}</p>}
        {showCta && ctaLabel && <TemplatePreviewCta label={ctaLabel} />}
      </article>
    );
  }

  if (example.kind === "ptl" || example.kind === "registration") {
    return (
      <article className={shellClass}>
        <div className="border border-neon/45 bg-neon/10 p-3">
          {showEyebrow && <TemplatePreviewEyebrow value={eyebrow} selected />}
          <h3 className={cn("mt-2 font-semibold leading-tight text-bone", headingClass)}>{title}</h3>
        </div>
        {showExcerpt && <p className={cn("mt-3 text-ash", bodyClass)}>{excerpt}</p>}
        <TemplatePointList points={points} compact={compact} />
        {showCta && ctaLabel && <TemplatePreviewCta label={ctaLabel} />}
      </article>
    );
  }

  if (example.kind === "hero" || example.kind === "imageFeature") {
    return (
      <article className={shellClass}>
        {showImage && <TemplatePreviewImageSlot imageSrc={imageSrc} label={example.imageLabel || "Image preview"} compact={compact} />}
        {showEyebrow && <TemplatePreviewEyebrow value={eyebrow} selected={selected} />}
        <h3 className={cn("mt-2 font-semibold leading-tight text-bone", headingClass)}>{title}</h3>
        {showExcerpt && <p className={cn("mt-2 text-ash", bodyClass)}>{excerpt}</p>}
        {showCta && ctaLabel && <TemplatePreviewCta label={ctaLabel} />}
      </article>
    );
  }

  return (
    <article className={shellClass}>
      {showEyebrow && <TemplatePreviewEyebrow value={eyebrow} selected={selected} />}
      <h3 className={cn("mt-2 font-semibold leading-tight text-bone", headingClass)}>{title}</h3>
      {showExcerpt && <p className={cn("mt-2 text-ash", bodyClass)}>{excerpt}</p>}
      {example.kind === "about" && <TemplatePointList points={points} compact={compact} />}
      {showCta && ctaLabel && <TemplatePreviewCta label={ctaLabel} />}
    </article>
  );
}

function TemplatePreviewEyebrow({ value, selected = false }: { value: string; selected?: boolean }) {
  return (
    <div className={cn("font-mono text-[10px] uppercase tracking-[0.22em]", selected ? "text-neon" : "text-ash")}>
      {value}
    </div>
  );
}

function TemplatePreviewCta({ label }: { label: string }) {
  return (
    <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neon">
      {label} <ArrowUpRight size={12} />
    </div>
  );
}

function TemplatePointList({ points, compact }: { points: string[]; compact: boolean }) {
  if (points.length === 0) return null;

  return (
    <div className={cn("mt-4 grid gap-2", compact ? "" : "sm:grid-cols-3")}>
      {points.slice(0, 3).map((point) => (
        <div key={point} className="border border-stone-3 bg-void/35 px-3 py-2 text-xs text-bone/80">
          {point}
        </div>
      ))}
    </div>
  );
}

function TemplatePreviewImageSlot({
  imageSrc,
  label,
  compact,
  portrait = false,
}: {
  imageSrc?: string;
  label: string;
  compact: boolean;
  portrait?: boolean;
}) {
  const sizeClass = portrait ? (compact ? "aspect-[3/4]" : "aspect-[3/4]") : compact ? "aspect-[16/8]" : "aspect-video";

  if (imageSrc) {
    return <img src={imageSrc} alt="" className={cn("mb-4 w-full border border-stone-3 object-cover", sizeClass)} />;
  }

  return (
    <div className={cn("mb-4 grid w-full place-items-center border border-dashed border-stone-3 bg-void/40 px-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ash", sizeClass)}>
      {label}
    </div>
  );
}

function exampleForTemplate(template: PostTemplate): TemplateExample {
  const configured = templateExamples[template.key];
  const kind = templatePreviewKind(template);
  if (configured) return { ...configured, kind };

  return {
    kind,
    eyebrow: template.defaultEyebrow || "POST",
    title: template.name || "Template preview",
    excerpt: template.description || "Reusable post shape for approved website areas.",
    ctaLabel: template.defaultCtaLabel || "Open",
  };
}

function templatePreviewKind(template?: PostTemplate): TemplatePreviewKind {
  return asTemplatePreviewKind(template?.previewKind) || (template ? inferTemplateKind(template) : "news");
}

function asTemplatePreviewKind(value: unknown): TemplatePreviewKind | undefined {
  return templateKindOptions.some((kind) => kind.value === value) ? (value as TemplatePreviewKind) : undefined;
}

function inferTemplateKind(template: PostTemplate): TemplatePreviewKind {
  const key = `${template.key} ${template.name} ${template.description || ""}`.toLowerCase();
  if (key.includes("full") || key.includes("wide")) return "fullWidth";
  if (key.includes("stat") || key.includes("metric")) return "stats";
  if (key.includes("result") || key.includes("recap")) return "results";
  if (key.includes("player")) return "player";
  if (key.includes("sponsor") || key.includes("partner")) return "sponsor";
  if (key.includes("vod") || key.includes("watch") || key.includes("broadcast") || key.includes("stream")) return "video";
  if (key.includes("ptl")) return "ptl";
  if (key.includes("registration") || key.includes("event")) return "registration";
  if (key.includes("hero")) return "hero";
  if (key.includes("image") || key.includes("gallery")) return "imageFeature";
  if (key.includes("about") || key.includes("story")) return "about";
  return "news";
}

function defaultTemplateStats(kind: TemplatePreviewKind) {
  if (kind === "stats") {
    return [
      { value: "554", label: "Entrants" },
      { value: "3", label: "Games" },
      { value: "Rs58M", label: "Payouts" },
    ];
  }

  return [
    { value: "01", label: "Main slot" },
    { value: "02", label: "Story points" },
    { value: "03", label: "CTA ready" },
    { value: "04", label: "Image optional" },
  ];
}

function defaultTemplatePoints(kind: TemplatePreviewKind) {
  const pointsByKind: Record<TemplatePreviewKind, string[]> = {
    hero: ["Big headline", "Hero image", "Primary CTA"],
    fullWidth: ["Headline", "Story copy", "Stat cards"],
    results: ["Champion", "Top 8", "Bracket link"],
    player: ["Player tag", "Characters", "Recent form"],
    sponsor: ["Brand name", "Approved copy", "Partner link"],
    video: ["Platform", "Match title", "Watch link"],
    news: ["Short title", "Clean excerpt", "Optional CTA"],
    ptl: ["Stage", "Standing", "Registration"],
    about: ["Mission", "Timeline", "Contact"],
    stats: ["Number", "Label", "Proof point"],
    imageFeature: ["Cover image", "Short story", "CTA"],
    registration: ["Deadline", "Location", "Signup link"],
  };

  return pointsByKind[kind];
}

function PostTemplateChooser({
  templates,
  selectedKey,
  onSelect,
}: {
  templates: PostTemplate[];
  selectedKey: string;
  onSelect: (template: PostTemplate) => void;
}) {
  const enabledTemplates = templates.filter((template) => template.enabled !== false);
  const selectedTemplate = enabledTemplates.find((template) => template.key === selectedKey);
  const placements = selectedTemplate ? recommendedPlacementLabels(selectedTemplate).slice(0, 3) : [];

  return (
    <Panel title="Choose Template" icon={<Sparkles size={18} />}>
      {enabledTemplates.length === 0 ? (
        <EmptyState text="No templates enabled." />
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <section className="grid content-between gap-4 border border-stone-3 bg-void/35 p-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">Selected shape</div>
                <h3 className="mt-2 text-xl font-semibold leading-tight text-bone">{selectedTemplate?.name || "Choose a template"}</h3>
                <p className="mt-2 text-sm leading-6 text-ash">
                  {selectedTemplate?.description || "Pick the closest post shape. The canvas below updates immediately."}
                </p>
              </div>

              <div className="grid gap-3">
                <Field label="Quick switch" span="full">
                  <select
                    value={selectedKey}
                    onChange={(event) => {
                      const nextTemplate = enabledTemplates.find((template) => template.key === event.target.value);
                      if (nextTemplate) onSelect(nextTemplate);
                    }}
                    className={inputClass}
                  >
                    {enabledTemplates.map((template) => (
                      <option key={template.id} value={template.key}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </Field>
                {placements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {placements.map((placement) => (
                      <span key={placement} className="border border-stone-3 bg-stone/45 px-2 py-1 text-[11px] text-ash">
                        {placement}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="min-w-0">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">Template previews with sample data</div>
                  <p className="mt-1 text-xs leading-5 text-bone/60">Click a card to update the editor and live preview.</p>
                </div>
                <div className="shrink-0 text-xs text-ash">{enabledTemplates.length} choices</div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {enabledTemplates.map((template) => {
                  const active = template.key === selectedKey;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => onSelect(template)}
                      className={cn(
                        "w-[280px] shrink-0 border p-1 text-left transition-colors",
                        active ? "border-neon bg-neon/10" : "border-stone-3 bg-void/30 hover:border-bone/35"
                      )}
                      aria-pressed={active}
                    >
                      <TemplateVisualPreview template={template} mode="sample" compact selected={active} />
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}
    </Panel>
  );
}

function TemplateGuidePanel({ template }: { template?: PostTemplate }) {
  if (!template) {
    return (
      <Panel title="Template Guide" icon={<Sparkles size={18} />}>
        <EmptyState text="Choose a template to see guidance." />
      </Panel>
    );
  }

  const placements = recommendedPlacementLabels(template);

  return (
    <Panel title="Template Guide" icon={<Sparkles size={18} />}>
      <div className="border border-stone-3 bg-void/30 p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon">{template.defaultEyebrow || template.key}</div>
        <h3 className="mt-2 text-lg font-semibold leading-tight text-bone">{template.name}</h3>
        {template.description && <p className="mt-3 text-sm leading-6 text-ash">{template.description}</p>}
      </div>

      {template.editorGuidance && <p className="mt-3 text-sm leading-6 text-bone/75">{template.editorGuidance}</p>}

      {placements.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {placements.map((placement) => (
            <span key={placement} className="border border-stone-3 bg-void/45 px-2 py-1 text-[11px] text-ash">
              {placement}
            </span>
          ))}
        </div>
      )}
    </Panel>
  );
}

function TemplatePreviewCard({ template, selected = false }: { template: PostTemplate; selected?: boolean }) {
  const placements = recommendedPlacementLabels(template);

  return (
    <article className="grid gap-4">
      <TemplateVisualPreview template={template} mode="sample" selected={selected} />
      {template.editorGuidance && <p className="text-sm leading-6 text-bone/70">{template.editorGuidance}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {placements.map((placement) => (
          <span key={placement} className="border border-stone-3 bg-void/45 px-2 py-1 text-[11px] text-ash">
            {placement}
          </span>
        ))}
      </div>
    </article>
  );
}

function FieldGrid({
  fields,
  form,
  onChange,
}: {
  fields: FieldDef[];
  form: FormState;
  onChange: (patch: FormState) => void;
}) {
  if (fields.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <Field key={field.key} label={field.label} span={field.span || (field.type === "textarea" ? "full" : "half")}>
          <InputField field={field} form={form} onChange={(value) => onChange({ [field.key]: value })} />
        </Field>
      ))}
    </div>
  );
}

function AdvancedPanel({
  fields,
  form,
  onChange,
}: {
  fields: FieldDef[];
  form: FormState;
  onChange: (patch: FormState) => void;
}) {
  if (fields.length === 0) return null;

  return (
    <details className="border border-stone-3 bg-stone/35">
      <summary className="cursor-pointer px-4 py-4 text-sm font-medium text-bone">
        {advancedSummary}
      </summary>
      <div className="border-t border-stone-3 p-4">
        <FieldGrid fields={fields} form={form} onChange={onChange} />
      </div>
    </details>
  );
}

function MediaPicker({
  media,
  selectedId,
  uploadFile,
  uploadAlt,
  uploadCaption,
  busy,
  onSelect,
  onFileChange,
  onAltChange,
  onCaptionChange,
  onUpload,
}: {
  media: MediaAsset[];
  selectedId: string;
  uploadFile: File | null;
  uploadAlt: string;
  uploadCaption: string;
  busy: boolean;
  onSelect: (id: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAltChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onUpload: () => void;
}) {
  const selected = media.find((asset) => asset.id === selectedId);

  return (
    <section className="grid gap-4">
      <Field label="Cover image" span="full">
        <select value={selectedId} onChange={(event) => onSelect(event.target.value)} className={inputClass}>
          <option value="">No image</option>
          {media.map((asset) => (
            <option key={asset.id} value={asset.id}>{asset.originalName || asset.filename}</option>
          ))}
        </select>
      </Field>

      {selected && (
        <img src={mediaUrl(selected.url)} alt={selected.alt || selected.originalName} className="aspect-video w-full border border-stone-3 object-cover" />
      )}

      <div className="grid gap-3 border border-stone-3 bg-void/30 p-3">
        <Field label="Upload image" span="full">
          <input type="file" accept="image/*" onChange={onFileChange} className={fileInputClass} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Alt text">
            <input value={uploadAlt} onChange={(event) => onAltChange(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Caption">
            <input value={uploadCaption} onChange={(event) => onCaptionChange(event.target.value)} className={inputClass} />
          </Field>
        </div>
        <button type="button" disabled={busy || !uploadFile} onClick={onUpload} className={secondaryButtonClass}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud size={16} />}
          Upload and use image
        </button>
      </div>
    </section>
  );
}

function PublishPanel({ entityKey, form, onChange }: { entityKey: string; form: FormState; onChange: (patch: FormState) => void }) {
  const targetType = targetTypeByEntityKey[entityKey];
  if (!targetType) return null;

  const defaults = defaultPlacementFor(entityKey, entityKey === "posts" ? String(form.templateKey || "") : undefined);
  const pageKey = String(form.placementPageKey || defaults.pageKey);
  const slotKey = String(form.placementSlotKey || defaults.slotKey);
  const placementGroups = pageOptions
    .map((page) => ({
      page,
      slots: placementOptionsFor(targetType, page.value),
    }))
    .filter((group) => group.slots.length > 0);

  function pickPlacement(nextPageKey: string, nextSlotKey: string) {
    onChange({
      placementPageKey: nextPageKey,
      placementSlotKey: nextSlotKey,
      placementEnabled: form.placementEnabled === undefined ? true : form.placementEnabled,
    });
  }

  return (
    <Panel title="Publish Placement" icon={<LayoutDashboard size={18} />}>
      <div className="grid gap-4">
        <div className="flex flex-col gap-3 border border-stone-3 bg-void/30 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neon">Current destination</div>
            <div className="mt-1 text-sm font-semibold text-bone">{readablePlacement(pageKey, slotKey)}</div>
          </div>
          <label className="inline-flex min-h-11 items-center gap-3 border border-stone-3 bg-void/45 px-3 text-sm text-bone">
            <input type="checkbox" checked={Boolean(form.placementEnabled)} onChange={(event) => onChange({ placementEnabled: event.target.checked })} className="h-4 w-4 accent-neon" />
            Show on website
          </label>
        </div>

        <div className="grid gap-4">
          {placementGroups.map((group) => (
            <section key={group.page.value} className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-bone">{group.page.label}</h4>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ash">{group.slots.length} areas</span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {group.slots.map((slot) => {
                  const active = pageKey === slot.pageKey && slotKey === slot.slotKey;
                  return (
                    <button
                      key={`${slot.pageKey}-${slot.slotKey}`}
                      type="button"
                      onClick={() => pickPlacement(slot.pageKey, slot.slotKey)}
                      className={cn(
                        "min-h-24 border p-3 text-left transition-colors",
                        active ? "border-neon bg-neon/10 text-neon" : "border-stone-3 bg-void/35 text-bone hover:border-bone/35"
                      )}
                      aria-pressed={active}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-semibold">{slotLabel(slot.slotKey)}</span>
                        {active && <CheckCircle2 size={16} className="shrink-0" aria-hidden />}
                      </span>
                      <span className="mt-2 block text-xs leading-5 text-ash">{placementHelp(slot.pageKey, slot.slotKey)}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
      <details className="mt-4 border border-stone-3 bg-void/30">
        <summary className="cursor-pointer px-3 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Schedule and order</summary>
        <div className="grid gap-4 border-t border-stone-3 p-3 sm:grid-cols-2">
          <Field label="Order">
            <input type="number" value={String(form.placementOrder || "0")} onChange={(event) => onChange({ placementOrder: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Visible from">
            <input type="datetime-local" value={String(form.placementVisibleFrom || "")} onChange={(event) => onChange({ placementVisibleFrom: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Visible until">
            <input type="datetime-local" value={String(form.placementVisibleUntil || "")} onChange={(event) => onChange({ placementVisibleUntil: event.target.value })} className={inputClass} />
          </Field>
        </div>
      </details>
    </Panel>
  );
}

function LiveContentPreview({
  entityKey,
  form,
  templates = [],
  media,
  selectedTemplate,
}: {
  entityKey: string;
  form: FormState;
  templates?: PostTemplate[];
  media: MediaAsset[];
  selectedTemplate?: PostTemplate;
}) {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const template = selectedTemplate || templates.find((item) => item.key === form.templateKey);
  const title = previewTitle(entityKey, form);
  const eyebrow = previewEyebrow(entityKey, form, template);
  const excerpt = previewExcerpt(entityKey, form);
  const imageSrc = previewImage(entityKey, form, media);
  const ctaLabel = String(form.ctaLabel || defaultCtaFor(entityKey, template));
  const status = previewStatus(entityKey, form);
  const placement = readablePlacement(form.placementPageKey, form.placementSlotKey);
  const facts = previewFacts(entityKey, form);
  const compactPreview = previewDevice === "mobile";
  const publicContext = previewPublicContext(entityKey, form);
  const visibilityChecks = previewVisibilityChecks(entityKey, form);

  return (
    <div>
      <Panel title="Live Preview" icon={<FileText size={18} />}>
        <PreviewDeviceToggle value={previewDevice} onChange={setPreviewDevice} />
        <PreviewPlacementFrame context={publicContext} status={status} />
        <PreviewVisibilityChecklist checks={visibilityChecks} />

        <div className={cn("mt-4 transition-[max-width] duration-200", compactPreview ? "mx-auto max-w-[330px]" : "max-w-none")}>
          {entityKey === "posts" && template ? (
            <TemplateVisualPreview template={template} form={form} media={media} mode="live" compact={compactPreview} />
          ) : entityKey === "pageContent" ? (
            <PageSectionLivePreview form={form} media={media} compact={compactPreview} />
          ) : (
            <article className={cn("scanline border border-stone-3 bg-stone/45", compactPreview ? "p-4" : "p-5")}>
              {imageSrc ? (
                <img src={imageSrc} alt="" className="mb-5 aspect-video w-full border border-stone-3 object-cover" />
              ) : (
                <div className="mb-5 grid aspect-video place-items-center border border-dashed border-stone-3 bg-void/40 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                  Image preview
                </div>
              )}
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{eyebrow}</div>
              <div className={cn("mt-3 font-semibold leading-tight text-bone", compactPreview ? "text-lg" : "text-xl")}>{title}</div>
              {excerpt && <p className={cn("mt-3 text-ash", compactPreview ? "text-xs leading-5" : "text-sm leading-6")}>{excerpt}</p>}
              {facts.length > 0 && <PreviewFactGrid facts={facts} compact={compactPreview} />}
              {ctaLabel && (
                <div className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
                  {ctaLabel} <ArrowUpRight size={12} />
                </div>
              )}
            </article>
          )}
        </div>

        <div className="mt-4 grid gap-2 border border-stone-3 bg-void/30 p-3">
          <PreviewMeta label="Status" value={status} />
          {entityKey === "pageContent" && <PreviewMeta label="Page" value={pageLabel(String(form.pageKey || ""))} />}
          {entityKey === "pageContent" && <PreviewMeta label="Section" value={pageContentSectionLabel(String(form.pageKey || ""), String(form.sectionKey || ""))} />}
          {placeableEntityKeys.has(entityKey) && <PreviewMeta label="Placement" value={placement} />}
          {template && <PreviewMeta label="Template" value={template.name} />}
        </div>
      </Panel>
    </div>
  );
}

function PreviewDeviceToggle({
  value,
  onChange,
}: {
  value: "desktop" | "mobile";
  onChange: (value: "desktop" | "mobile") => void;
}) {
  const options: Array<{ value: "desktop" | "mobile"; label: string }> = [
    { value: "desktop", label: "Desktop" },
    { value: "mobile", label: "Mobile" },
  ];

  return (
    <div className="flex items-center justify-between gap-3 border border-stone-3 bg-void/30 p-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Preview size</span>
      <div className="grid grid-cols-2 border border-stone-3">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-9 px-3 text-xs font-semibold transition-colors",
                active ? "bg-neon text-void" : "bg-void/40 text-bone hover:text-neon"
              )}
              aria-pressed={active}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PreviewPlacementFrame({
  context,
  status,
}: {
  context?: { label: string; detail: string; href: string; enabled: boolean };
  status: string;
}) {
  if (!context) {
    return (
      <div className="mt-3 border border-stone-3 bg-void/30 p-3">
        <PreviewMeta label="Public page" value="Not connected to a page area" />
      </div>
    );
  }

  return (
    <div className="mt-3 grid gap-3 border border-stone-3 bg-void/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Appears on</div>
          <div className="mt-1 text-sm font-semibold text-bone">{context.label}</div>
          <div className="mt-1 text-xs leading-5 text-ash">{context.detail}</div>
        </div>
        <span className={cn("shrink-0 border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em]", context.enabled ? "border-neon/45 bg-neon/10 text-neon" : "border-stone-3 text-ash")}>
          {context.enabled ? "Visible" : "Hidden"}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PreviewMeta label="Status" value={status} />
        <Link href={context.href} className={cn(miniButtonClass, "min-h-9")}>
          View page <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}

function PreviewVisibilityChecklist({ checks }: { checks: Array<{ label: string; ok: boolean; detail: string }> }) {
  if (checks.length === 0) return null;

  const allOk = checks.every((check) => check.ok);

  return (
    <div className={cn("mt-3 grid gap-2 border p-3", allOk ? "border-neon/45 bg-neon/10" : "border-stone-3 bg-void/30")}>
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Public visibility</div>
        <span className={cn("border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em]", allOk ? "border-neon/45 text-neon" : "border-blood/50 text-bone")}>
          {allOk ? "Ready" : "Needs fix"}
        </span>
      </div>
      <div className="grid gap-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-start gap-2">
            <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center border", check.ok ? "border-neon text-neon" : "border-blood text-blood")}>
              {check.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-bone">{check.label}</span>
              <span className="mt-0.5 block text-[11px] leading-4 text-ash">{check.detail}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageSectionLivePreview({ form, media, compact = false }: { form: FormState; media: MediaAsset[]; compact?: boolean }) {
  const pageKey = String(form.pageKey || "home");
  const sectionKey = String(form.sectionKey || defaultPageContentSection(pageKey));
  const title = String(form.title || pageContentSectionLabel(pageKey, sectionKey));
  const eyebrow = String(form.eyebrow || sectionKey);
  const body = String(form.bodyText || "");
  const items = itemsFromText(form.itemsText).slice(0, 8);
  const imageSrc = pageSectionPreviewImageSrc(pageKey, sectionKey, form, media, items);
  const previewKind = pageSectionPreviewKind(pageKey, sectionKey, items);
  const ctaLabel = String(form.ctaLabel || "");
  const sectionLabel = pageContentSectionLabel(pageKey, sectionKey);
  const label = `${pageLabel(pageKey)} / ${sectionLabel}`;
  const hasItems = items.length > 0;
  const firstBody = firstLine(body);

  return (
    <article className={cn("scanline border border-stone-3 bg-stone/45", compact ? "p-4" : "p-5")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon">{label}</div>
        <span className="border border-stone-3 bg-void/35 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ash">
          {sectionPreviewKindLabel(previewKind)}
        </span>
      </div>

      {previewKind === "hero" && (
        <div>
          <div className={cn("mt-4 grid gap-5", compact ? "grid-cols-1" : "lg:grid-cols-[1.1fr_0.9fr]")}>
            <div className="min-w-0 self-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{eyebrow}</div>
              <h3 className={cn("mt-3 font-semibold uppercase leading-[0.95] text-bone", compact ? "text-2xl" : "text-4xl")}>{title}</h3>
              {firstBody && <p className={cn("mt-4 max-w-xl text-ash", compact ? "text-xs leading-5" : "text-sm leading-6")}>{firstBody}</p>}
              {ctaLabel && <PageSectionPreviewCta label={ctaLabel} />}
            </div>
            <div className="min-w-0">
              {imageSrc ? (
                <img src={imageSrc} alt="" className="aspect-video w-full border border-stone-3 object-cover" />
              ) : (
                <div className="grid aspect-video w-full place-items-center border border-dashed border-stone-3 bg-void/35 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
                  Hero image
                </div>
              )}
            </div>
          </div>
          {pageKey === "home" && sectionKey === "hero-carousel" && hasItems && (
            <div className={cn("mt-5 grid gap-3", compact ? "grid-cols-1" : "md:grid-cols-3")}>
              {items.slice(0, 3).map((item, index) => (
                <div key={pageSectionPreviewItemKey(item, index)} className="border border-stone-3 bg-void/35 p-3">
                  <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neon">Slide {String(index + 1).padStart(2, "0")}</div>
                  <div className="mt-2 text-sm font-semibold leading-tight text-bone">{itemTextPreview(item.label || item.title || "Untitled slide")}</div>
                  <div className="mt-2 text-[11px] leading-4 text-ash">{itemTextPreview(item.meta || item.ctaLabel || item.imageKey || "")}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {previewKind === "stats" && (
        <div className="mt-4">
          <div className={cn("grid gap-5", compact ? "grid-cols-1" : "lg:grid-cols-[0.95fr_1.05fr]")}>
            <div className="min-w-0 self-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">{eyebrow}</div>
              <h3 className={cn("mt-3 font-semibold leading-tight text-bone", compact ? "text-xl" : "text-3xl")}>{title}</h3>
              {firstBody && <p className={cn("mt-3 text-ash", compact ? "text-xs leading-5" : "text-sm leading-6")}>{firstBody}</p>}
              {ctaLabel && <PageSectionPreviewCta label={ctaLabel} />}
            </div>
            <div className={cn("grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
              {hasItems ? (
                items.map((item, index) => (
                  <PageSectionPreviewItem key={pageSectionPreviewItemKey(item, index)} item={item} index={index} type="stat" />
                ))
              ) : (
                <PageSectionPreviewEmpty label="Add stat blocks to fill this section." />
              )}
            </div>
          </div>
        </div>
      )}

      {previewKind === "timeline" && (
        <div className="mt-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">{eyebrow}</div>
          <h3 className={cn("mt-3 font-semibold leading-tight text-bone", compact ? "text-xl" : "text-3xl")}>{title}</h3>
          {firstBody && <p className={cn("mt-3 max-w-2xl text-ash", compact ? "text-xs leading-5" : "text-sm leading-6")}>{firstBody}</p>}
          <div className="mt-5 grid gap-3">
            {hasItems ? (
              items.map((item, index) => (
                <PageSectionPreviewItem key={pageSectionPreviewItemKey(item, index)} item={item} index={index} type="timeline" />
              ))
            ) : (
              <PageSectionPreviewEmpty label="Add timeline blocks to show stages or milestones." />
            )}
          </div>
        </div>
      )}

      {previewKind === "links" && (
        <div className="mt-4">
          {imageSrc && <img src={imageSrc} alt="" className="mb-4 aspect-video w-full border border-stone-3 object-cover" />}
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">{eyebrow}</div>
          <h3 className={cn("mt-3 font-semibold leading-tight text-bone", compact ? "text-xl" : "text-3xl")}>{title}</h3>
          {firstBody && <p className={cn("mt-3 max-w-2xl text-ash", compact ? "text-xs leading-5" : "text-sm leading-6")}>{firstBody}</p>}
          <div className={cn("mt-5 grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
            {hasItems ? (
              items.map((item, index) => (
                <PageSectionPreviewItem key={pageSectionPreviewItemKey(item, index)} item={item} index={index} type="link" />
              ))
            ) : (
              <PageSectionPreviewEmpty label="Add link blocks for channels, contacts, or actions." />
            )}
          </div>
        </div>
      )}

      {previewKind === "placeholder" && (
        <div className="mt-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">{eyebrow}</div>
          <div className="mt-3 border border-stone-3 bg-void/40 p-5">
            <h3 className={cn("font-semibold leading-tight text-bone", compact ? "text-xl" : "text-3xl")}>{title}</h3>
            {firstBody && <p className={cn("mt-3 max-w-2xl text-ash", compact ? "text-xs leading-5" : "text-sm leading-6")}>{firstBody}</p>}
            <div className="mt-5 grid min-h-40 place-items-center border border-dashed border-stone-3 bg-stone/25 p-5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              {sectionLabel}
            </div>
          </div>
        </div>
      )}

      {previewKind === "cards" && (
        <div className="mt-4">
          {imageSrc && <img src={imageSrc} alt="" className="mb-4 aspect-video w-full border border-stone-3 object-cover" />}
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">{eyebrow}</div>
          <h3 className={cn("mt-3 font-semibold leading-tight text-bone", compact ? "text-xl" : "text-3xl")}>{title}</h3>
          {firstBody && <p className={cn("mt-3 max-w-2xl text-ash", compact ? "text-xs leading-5" : "text-sm leading-6")}>{firstBody}</p>}
          <div className={cn("mt-5 grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
            {hasItems ? (
              items.map((item, index) => (
                <PageSectionPreviewItem key={pageSectionPreviewItemKey(item, index)} item={item} index={index} type={sectionItemTypeOf(item)} />
              ))
            ) : (
              <PageSectionPreviewEmpty label="Add cards to build this section." />
            )}
          </div>
          {ctaLabel && <PageSectionPreviewCta label={ctaLabel} />}
        </div>
      )}
    </article>
  );
}

function PageSectionPreviewCta({ label }: { label: string }) {
  return (
    <div className="mt-5 inline-flex items-center gap-2 border border-neon bg-neon px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-void">
      {label} <ArrowUpRight size={12} />
    </div>
  );
}

function PageSectionPreviewEmpty({ label }: { label: string }) {
  return (
    <div className="col-span-full grid min-h-28 place-items-center border border-dashed border-stone-3 bg-void/30 p-4 text-center text-xs leading-5 text-ash">
      {label}
    </div>
  );
}

function pageSectionPreviewKind(pageKey: string, sectionKey: string, items: Array<Record<string, unknown>>): PageSectionPreviewKind {
  const key = `${pageKey}:${sectionKey}`;
  const itemTypes = items.map(sectionItemTypeOf);

  if (["home:hero-carousel", "home:intro", "home:ptl-teaser", "ptl-2026:intro", "ptl-2026:slots-intro", "sponsors:intro", "about:intro"].includes(key)) return "hero";
  if (sectionKey.includes("stats") || itemTypes.includes("stat") || sectionKey === "partner-pitch") return "stats";
  if (sectionKey.includes("timeline") || itemTypes.includes("timeline")) return "timeline";
  if (sectionKey.includes("watch") || sectionKey.includes("contact") || sectionKey.includes("broadcast") || itemTypes.includes("link")) return "links";
  if (sectionKey.includes("bracket") || sectionKey.includes("standings")) return "placeholder";

  return "cards";
}

function pageSectionPreviewImageSrc(pageKey: string, sectionKey: string, form: FormState, media: MediaAsset[], items: Array<Record<string, unknown>>) {
  if (pageKey === "home" && sectionKey === "hero-carousel") {
    const firstImageUrl = itemTextPreview(items.find((item) => itemTextPreview(item.imageUrl))?.imageUrl);
    if (firstImageUrl) return mediaUrl(firstImageUrl);
  }

  return previewImage("pageContent", form, media);
}

function sectionPreviewKindLabel(kind: PageSectionPreviewKind) {
  const labels: Record<PageSectionPreviewKind, string> = {
    hero: "Full-width hero",
    stats: "Stats section",
    timeline: "Timeline",
    links: "Action links",
    cards: "Card grid",
    placeholder: "Structured block",
  };

  return labels[kind];
}

function sectionItemTypeOf(item: Record<string, unknown>): SectionItemType {
  return normalizeSectionItemType(typeof item.type === "string" ? item.type : undefined);
}

function pageSectionPreviewItemKey(item: Record<string, unknown>, index: number) {
  return `${itemTextPreview(item.label || item.title || item.value || item.meta)}-${index}`;
}

function PageSectionPreviewItem({ item, index, type }: { item: Record<string, unknown>; index: number; type: SectionItemType }) {
  const label = itemTextPreview(item.label || (type === "timeline" ? `Step ${index + 1}` : "Label"));
  const title = itemTextPreview(item.title || item.value || "Untitled");
  const body = itemTextPreview(item.body || item.sub || "");
  const meta = itemTextPreview(item.meta || "");

  if (type === "stat") {
    return (
      <div className="border border-stone-3 bg-void/35 p-4">
        <div className="text-2xl font-semibold leading-none text-bone">{title}</div>
        <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ash">{label}</div>
        {body && <p className="mt-3 text-xs leading-5 text-bone/65">{body}</p>}
      </div>
    );
  }

  if (type === "timeline") {
    return (
      <div className="flex items-start gap-3 border border-stone-3 bg-void/35 p-4">
        <span className="grid h-8 w-8 shrink-0 place-items-center border border-neon/60 bg-neon/10 font-mono text-[10px] text-neon">{String(index + 1).padStart(2, "0")}</span>
        <span className="min-w-0">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-ash">{meta || label}</span>
          <span className="mt-1 block text-sm font-semibold leading-tight text-bone">{title}</span>
          {body && <span className="mt-2 block text-xs leading-5 text-ash">{body}</span>}
        </span>
      </div>
    );
  }

  if (type === "link") {
    return (
      <div className="border border-stone-3 bg-void/35 p-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neon">{label}</div>
        <div className="mt-2 text-sm font-semibold leading-tight text-bone">{title}</div>
        {body && <p className="mt-2 text-xs leading-5 text-ash">{body}</p>}
        <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
          {meta || "Open"} <ArrowUpRight size={12} />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-stone-3 bg-void/35 p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neon">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-tight text-bone">{title}</div>
      {body && <p className="mt-2 text-xs leading-5 text-ash">{body}</p>}
      {meta && <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-ash">{meta}</div>}
    </div>
  );
}

function itemTextPreview(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function EditorReadinessPanel({
  entityKey,
  form,
  media,
  template,
  dirty = false,
}: {
  entityKey: string;
  form: FormState;
  media: MediaAsset[];
  template?: PostTemplate;
  dirty?: boolean;
}) {
  const title = previewTitle(entityKey, form);
  const image = previewImage(entityKey, form, media);
  const spec = visualEntitySpec(entityKey, form);
  const status = previewStatus(entityKey, form);
  const hasUsefulTitle = Boolean(title.trim()) && title !== "Untitled";
  const hasText = Boolean(previewExcerpt(entityKey, form).trim() || String(form.bodyText || form.pointsRules || form.mainsText || form.channel || "").trim());
  const checks = [
    {
      label: entityKey === "players" ? "Profile name" : "Main title",
      ok: hasUsefulTitle,
      detail: hasUsefulTitle ? title : "Add a clear title.",
    },
    {
      label: "Content",
      ok: hasText || entityKey === "sponsors",
      detail: hasText ? "Copy is ready." : "Add short copy or body text.",
    },
    {
      label: "Image",
      ok: Boolean(image) || !spec?.imageKey,
      detail: spec?.imageKey ? (image ? "Image selected." : "Optional, but recommended.") : "No image needed.",
      soft: Boolean(spec?.imageKey),
    },
    {
      label: placeableEntityKeys.has(entityKey) ? "Placement" : entityKey === "pageContent" ? "Page section" : "Visibility",
      ok: placeableEntityKeys.has(entityKey)
        ? Boolean(form.placementPageKey && form.placementSlotKey)
        : entityKey === "pageContent"
          ? Boolean(form.pageKey && form.sectionKey)
          : true,
      detail: placeableEntityKeys.has(entityKey)
        ? readablePlacement(form.placementPageKey, form.placementSlotKey)
        : entityKey === "pageContent"
          ? `${pageLabel(String(form.pageKey || ""))} / ${pageContentSectionLabel(String(form.pageKey || ""), String(form.sectionKey || ""))}`
          : "Managed by enabled/status fields.",
    },
  ];

  return (
    <Panel title="Editor Readiness" icon={<CheckCircle2 size={18} />}>
      <div className="grid gap-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-start gap-3 border border-stone-3 bg-void/30 p-3">
            <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center border", check.ok ? "border-neon text-neon" : check.soft ? "border-ash text-ash" : "border-blood text-blood")}>
              {check.ok ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-bone">{check.label}</div>
              <div className="mt-1 break-words text-xs leading-5 text-ash">{check.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 border border-stone-3 bg-stone/35 p-3">
        <PreviewMeta label="Save state" value={dirty ? "Unsaved changes" : "Saved"} />
        <PreviewMeta label="Status" value={status} />
        {template && <PreviewMeta label="Template" value={template.name} />}
      </div>
    </Panel>
  );
}

function DirtyStateBadge({ dirty }: { dirty: boolean }) {
  return (
    <div className={cn("inline-flex min-h-9 items-center gap-2 border px-3 font-mono text-[10px] uppercase tracking-[0.14em]", dirty ? "border-neon/50 bg-neon/10 text-neon" : "border-stone-3 bg-void/35 text-ash")}>
      {dirty ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
      {dirty ? "Unsaved changes" : "Saved"}
    </div>
  );
}

function PreviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em]">
      <span className="text-ash">{label}</span>
      <span className="text-bone">{value}</span>
    </div>
  );
}

function PreviewFactGrid({ facts, compact = false }: { facts: Array<{ label: string; value: string }>; compact?: boolean }) {
  if (facts.length === 0) return null;

  return (
    <div className={cn("mt-5 grid gap-2", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
      {facts.map((fact) => (
        <div key={`${fact.label}-${fact.value}`} className="border border-stone-3 bg-void/35 p-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ash">{fact.label}</div>
          <div className="mt-1 truncate text-sm font-semibold text-bone">{fact.value}</div>
        </div>
      ))}
    </div>
  );
}

function GenericManager(props: {
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  busy: boolean;
  setFormValue: (key: string, patch: FormState) => void;
  saveEntity: (config: EntityConfig) => Promise<void>;
  resetForm: (key: string, overrides?: FormState) => void;
  selectEntity: (config: EntityConfig, row: Row) => void;
  deleteEntity: (config: EntityConfig, row: Row) => Promise<void>;
}) {
  return (
    <EntityManager
      config={props.config}
      form={props.form}
      selectedId={props.selectedId}
      busy={props.busy}
      onFormChange={(patch) => props.setFormValue(props.config.key, patch)}
      onSave={() => void props.saveEntity(props.config)}
      onNew={() => props.resetForm(props.config.key)}
      onSelect={(row) => props.selectEntity(props.config, row)}
      onDelete={(row) => void props.deleteEntity(props.config, row)}
    />
  );
}

function PlacementManager({
  config,
  form,
  selectedId,
  busy,
  dirty,
  entityOptions,
  onFormChange,
  onSave,
  onNew,
  onSelect,
  onDelete,
  onToggle,
  onReorder,
}: {
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  busy: boolean;
  dirty: boolean;
  entityOptions: Record<string, SelectOption[]>;
  onFormChange: (patch: FormState) => void;
  onSave: () => void;
  onNew: () => void;
  onSelect: (row: Row) => void;
  onDelete: (row: Row) => void;
  onToggle: (row: Row) => void;
  onReorder: (orderedRows: Row[]) => void;
}) {
  const [pageKey, setPageKey] = useState(String(form.pageKey || "home"));
  const pageRows = config.rows.filter((row) => row.pageKey === pageKey);
  const pageSlots = renderedPlacementOptions.filter((slot) => slot.pageKey === pageKey);

  function choosePage(nextPageKey: string) {
    setPageKey(nextPageKey);
    const firstSlot = renderedPlacementOptions.find((slot) => slot.pageKey === nextPageKey);
    onFormChange({ pageKey: nextPageKey, slotKey: firstSlot?.slotKey || "hero" });
  }

  function targetLabel(row: Row) {
    const targetType = String(row.targetType || "");
    const targetId = String(row.targetId || "");
    return entityOptions[targetType]?.find((item) => item.value === targetId)?.label || targetId || "No target selected";
  }

  function reorderSlotRows(slotRows: Row[], draggedId: string, targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    const sourceIndex = slotRows.findIndex((row) => row.id === draggedId);
    const targetIndex = slotRows.findIndex((row) => row.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const nextRows = [...slotRows];
    const [draggedRow] = nextRows.splice(sourceIndex, 1);
    nextRows.splice(targetIndex, 0, draggedRow);
    onReorder(nextRows);
  }

  return (
    <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_430px]">
      <div className="grid content-start gap-5">
        <Panel title="Placement Board" icon={<LayoutDashboard size={18} />}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pageOptions.map((page) => (
              <button
                key={page.value}
                type="button"
                onClick={() => choosePage(page.value)}
                className={cn(
                  "min-h-12 border px-3 text-left text-sm font-semibold transition-colors",
                  pageKey === page.value ? "border-neon bg-neon/10 text-neon" : "border-stone-3 bg-void/35 text-bone hover:border-bone/35"
                )}
              >
                {page.label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title={`${pageLabel(pageKey)} Page Areas`} icon={<LayoutDashboard size={18} />}>
          <div className="grid gap-4 xl:grid-cols-2">
            {pageSlots.map((slot) => {
              const slotRows = pageRows
                .filter((row) => row.slotKey === slot.slotKey)
                .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

              return (
                <section key={`${slot.pageKey}-${slot.slotKey}`} className="grid content-start gap-3 border border-stone-3 bg-void/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neon">{slotLabel(slot.slotKey)}</div>
                      <div className="mt-1 text-xs leading-5 text-ash">{slot.label}</div>
                      {slotRows.length > 1 && <div className="mt-2 text-[11px] leading-4 text-ash">Drag cards to reorder. The order saves automatically.</div>}
                    </div>
                    <span className="border border-stone-3 bg-stone/35 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ash">
                      {slotRows.length} items
                    </span>
                  </div>

                  {slotRows.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        onNew();
                        onFormChange({ pageKey, slotKey: slot.slotKey });
                      }}
                      className="grid min-h-24 place-items-center border border-dashed border-stone-3 bg-void/35 p-4 text-center text-sm text-ash transition-colors hover:border-neon hover:text-neon"
                    >
                      Add content to this area
                    </button>
                  ) : (
                    <div className="grid gap-3">
                      {slotRows.map((row, rowIndex) => {
                        const enabled = row.enabled !== false;
                        return (
                          <article
                            key={row.id}
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.setData("application/x-baaz-placement-id", row.id);
                              event.dataTransfer.effectAllowed = "move";
                            }}
                            onDragOver={(event) => {
                              event.preventDefault();
                              event.dataTransfer.dropEffect = "move";
                            }}
                            onDrop={(event) => {
                              event.preventDefault();
                              const draggedId = event.dataTransfer.getData("application/x-baaz-placement-id");
                              reorderSlotRows(slotRows, draggedId, row.id);
                            }}
                            className={cn(
                              "grid gap-3 border bg-stone/35 p-3 transition-colors",
                              row.id === selectedId ? "border-neon bg-neon/5" : "border-stone-3 hover:border-bone/30"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex cursor-grab items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-neon active:cursor-grabbing" title="Drag to reorder">
                                <GripVertical size={14} aria-hidden />
                                {String(rowIndex + 1).padStart(2, "0")}
                              </div>
                              <button type="button" onClick={() => onSelect(row)} className="min-w-0 flex-1 text-left">
                                <div className="truncate text-sm font-semibold text-bone">{String(row.title || "Untitled placement")}</div>
                                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                                  {String(row.targetType || "target")} / order {String(row.order ?? 0)}
                                </div>
                                <div className="mt-2 line-clamp-2 text-xs leading-5 text-ash">{targetLabel(row)}</div>
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => onToggle(row)} className={miniButtonClass}>
                                {enabled ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                {enabled ? "Enabled" : "Disabled"}
                              </button>
                              <button type="button" onClick={() => onSelect(row)} className={miniButtonClass}>Edit</button>
                              <button type="button" onClick={() => onDelete(row)} className={iconButtonClass} aria-label={`Delete ${String(row.title || "placement")}`}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </Panel>
      </div>

      <aside className="grid h-fit gap-5 2xl:sticky 2xl:top-24">
        <PlacementEditor
          config={config}
          form={form}
          selectedId={selectedId}
          busy={busy}
          dirty={dirty}
          entityOptions={entityOptions}
          onChange={onFormChange}
          onSave={onSave}
          onNew={onNew}
        />
      </aside>
    </section>
  );
}

function PlacementEditor({
  config,
  form,
  selectedId,
  busy,
  dirty,
  entityOptions,
  onChange,
  onSave,
  onNew,
}: {
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  busy: boolean;
  dirty: boolean;
  entityOptions: Record<string, SelectOption[]>;
  onChange: (patch: FormState) => void;
  onSave: () => void;
  onNew: () => void;
}) {
  const targetType = String(form.targetType || "post") as PlacementTargetType;
  const pageKey = String(form.pageKey || "home");
  const slots = renderedPlacementOptions.filter((slot) => slot.pageKey === pageKey && slot.targetTypes.includes(targetType));
  const slotKey = String(form.slotKey || slots[0]?.slotKey || "hero");
  const placementGroups = pageOptions
    .map((page) => ({
      page,
      slots: renderedPlacementOptions.filter((slot) => slot.pageKey === page.value && slot.targetTypes.includes(targetType)),
    }))
    .filter((group) => group.slots.length > 0);
  const targetChoices = entityOptions[targetType] || [];

  function changeTargetType(nextType: PlacementTargetType) {
    const nextSlots = renderedPlacementOptions.filter((slot) => slot.pageKey === pageKey && slot.targetTypes.includes(nextType));
    onChange({ targetType: nextType, targetId: "", slotKey: nextSlots[0]?.slotKey || String(form.slotKey || "hero") });
  }

  function pickPlacement(nextPageKey: string, nextSlotKey: string) {
    onChange({ pageKey: nextPageKey, slotKey: nextSlotKey });
  }

  return (
    <Panel title={selectedId ? "Edit Placement" : "Create Placement"} icon={<LayoutDashboard size={18} />}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="grid gap-4"
      >
        <Field label="Placement title" span="full">
          <input value={String(form.title || "")} onChange={(event) => onChange({ title: event.target.value })} className={inputClass} required />
        </Field>

        <Field label="Content type" span="full">
          <select value={targetType} onChange={(event) => changeTargetType(event.target.value as PlacementTargetType)} className={inputClass}>
            <option value="post">Post</option>
            <option value="event">Event</option>
            <option value="player">Player</option>
            <option value="sponsor">Sponsor</option>
            <option value="circuit">PTL / Circuit</option>
            <option value="stream">Stream / VOD</option>
          </select>
        </Field>

        <Field label="Content item" span="full">
          <select value={String(form.targetId || "")} onChange={(event) => onChange({ targetId: event.target.value })} className={inputClass}>
            <option value="">Choose content</option>
            {targetChoices.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </Field>

        <section className="grid gap-4 border border-stone-3 bg-void/30 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neon">Page area</div>
              <div className="mt-1 text-sm font-semibold text-bone">{readablePlacement(pageKey, slotKey)}</div>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ash">Click to place</span>
          </div>

          <div className="grid gap-4">
            {placementGroups.map((group) => (
              <div key={group.page.value} className="grid gap-2">
                <div className="text-sm font-semibold text-bone">{group.page.label}</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {group.slots.map((slot) => {
                    const active = pageKey === slot.pageKey && slotKey === slot.slotKey;
                    return (
                      <button
                        key={`${slot.pageKey}-${slot.slotKey}`}
                        type="button"
                        onClick={() => pickPlacement(slot.pageKey, slot.slotKey)}
                        className={cn(
                          "min-h-20 border p-3 text-left transition-colors",
                          active ? "border-neon bg-neon/10 text-neon" : "border-stone-3 bg-void/35 text-bone hover:border-bone/35"
                        )}
                        aria-pressed={active}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-semibold">{slotLabel(slot.slotKey)}</span>
                          {active && <CheckCircle2 size={16} className="shrink-0" aria-hidden />}
                        </span>
                        <span className="mt-2 block text-xs leading-5 text-ash">{placementHelp(slot.pageKey, slot.slotKey)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Field label="Show on website" span="full">
          <label className="flex min-h-11 items-center gap-3 border border-stone-3 bg-void/40 px-3 text-sm text-bone">
            <input type="checkbox" checked={Boolean(form.enabled)} onChange={(event) => onChange({ enabled: event.target.checked })} className="h-4 w-4 accent-neon" />
            Enabled
          </label>
        </Field>

        <details className="border border-stone-3 bg-void/30">
          <summary className="cursor-pointer px-3 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">Schedule and order</summary>
          <div className="grid gap-4 border-t border-stone-3 p-3">
            <Field label="Order" span="full">
              <input type="number" value={String(form.order || "0")} onChange={(event) => onChange({ order: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Visible from" span="full">
              <input type="datetime-local" value={String(form.visibleFrom || "")} onChange={(event) => onChange({ visibleFrom: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Visible until" span="full">
              <input type="datetime-local" value={String(form.visibleUntil || "")} onChange={(event) => onChange({ visibleUntil: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Variant" span="full">
              <input value={String(form.variant || "default")} onChange={(event) => onChange({ variant: event.target.value })} className={inputClass} />
            </Field>
          </div>
        </details>

        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-2 border border-stone-3 bg-void/85 p-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur">
          <DirtyStateBadge dirty={dirty} />
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className={primaryButtonClass}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
              {selectedId ? "Save placement" : "Create placement"}
            </button>
            <button type="button" onClick={onNew} className={secondaryButtonClass}>
              <Plus size={15} />
              New
            </button>
          </div>
        </div>
      </form>
    </Panel>
  );
}

function PageContentWorkspace(props: {
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  busy: boolean;
  dirtyKeys?: Record<string, boolean>;
  media: MediaAsset[];
  onImageDrop?: (file: File, target: ImageAssignment) => void;
  setFormValue: (key: string, patch: FormState) => void;
  saveEntity: (config: EntityConfig, formOverrides?: FormState) => Promise<void>;
  resetForm: (key: string, overrides?: FormState) => void;
  selectEntity: (config: EntityConfig, row: Row) => void;
  deleteEntity: (config: EntityConfig, row: Row) => Promise<void>;
}) {
  const [pageKey, setPageKey] = useState(String(props.form.pageKey || "home"));
  const pageRows = props.config.rows.filter((row) => row.pageKey === pageKey);

  function choosePage(nextPageKey: string) {
    const sectionKey = defaultPageContentSection(nextPageKey);
    setPageKey(nextPageKey);
    props.resetForm("pageContent", { pageKey: nextPageKey, sectionKey });
  }

  return (
    <div className="grid gap-5">
      <Panel title="Editable Website Pages" icon={<LayoutDashboard size={18} />}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pageOptions.map((page) => (
            <button
              key={page.value}
              type="button"
              onClick={() => choosePage(page.value)}
              className={cn(
                "min-h-12 border px-3 text-left text-sm font-semibold transition-colors",
                pageKey === page.value ? "border-neon bg-neon/10 text-neon" : "border-stone-3 bg-void/35 text-bone hover:border-bone/35"
              )}
            >
              {page.label}
            </button>
          ))}
        </div>
      </Panel>

      <PageSectionMap
        pageKey={pageKey}
        rows={pageRows}
        selectedId={props.selectedId}
        config={props.config}
        onSelect={(row) => props.selectEntity(props.config, row)}
        onCreate={(sectionKey) => props.resetForm("pageContent", { pageKey, sectionKey })}
      />

      <PageContentManager {...props} pageKey={pageKey} showSectionPicker={false} />
    </div>
  );
}

function PageSectionMap({
  pageKey,
  rows,
  selectedId,
  config,
  onSelect,
  onCreate,
}: {
  pageKey: string;
  rows: Row[];
  selectedId?: string | null;
  config: EntityConfig;
  onSelect: (row: Row) => void;
  onCreate: (sectionKey: string) => void;
}) {
  const definedSections = pageContentSectionOptions(pageKey);
  const knownKeys = new Set(definedSections.map((section) => section.value));
  const extraSections = rows
    .filter((row) => !knownKeys.has(String(row.sectionKey || "")))
    .map((row) => option(String(row.sectionKey || row.id), pageContentSectionLabel(pageKey, String(row.sectionKey || row.id))));
  const sections = [...definedSections, ...extraSections];

  function rowForSection(sectionKey: string) {
    return rows
      .filter((row) => row.sectionKey === sectionKey)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))[0];
  }

  return (
    <Panel title={`${pageLabel(pageKey)} Section Map`} icon={<LayoutDashboard size={18} />}>
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {sections.map((section, index) => {
          const row = rowForSection(section.value);
          const title = row ? previewTitle("pageContent", rowToForm(row, config.fields, config.defaults, "pageContent")) : "";
          const excerpt = row ? previewExcerpt("pageContent", rowToForm(row, config.fields, config.defaults, "pageContent")) : "";
          const itemCount = row ? itemsFromText(itemsToText(row.body)).length : 0;
          const enabled = row ? row.enabled !== false : false;
          const active = row?.id === selectedId;

          return (
            <article
              key={`${section.value}-${row?.id || "empty"}`}
              className={cn(
                "grid gap-3 border bg-void/30 p-4 transition-colors",
                active ? "border-neon bg-neon/5" : row ? "border-stone-3 hover:border-bone/30" : "border-dashed border-stone-3"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neon">
                    {String(index + 1).padStart(2, "0")} / {section.label}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-tight text-bone">
                    {title || "Empty section"}
                  </h3>
                </div>
                <span className={cn("shrink-0 border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em]", enabled ? "border-neon/45 bg-neon/10 text-neon" : "border-stone-3 text-ash")}>
                  {row ? (enabled ? "Live" : "Off") : "Empty"}
                </span>
              </div>

              {excerpt ? (
                <p className="line-clamp-3 text-xs leading-5 text-ash">{excerpt}</p>
              ) : (
                <p className="text-xs leading-5 text-ash">Create or select this block to control the matching public section.</p>
              )}

              <div className="flex flex-wrap gap-2 text-[11px] text-ash">
                <span className="border border-stone-3 bg-stone/35 px-2 py-1">{sectionShapeLabel(pageKey, section.value)}</span>
                {Boolean(row?.eyebrow) && <span className="border border-stone-3 bg-stone/35 px-2 py-1">{String(row?.eyebrow)}</span>}
                {itemCount > 0 && <span className="border border-stone-3 bg-stone/35 px-2 py-1">{itemCount} items</span>}
                {Boolean(row?.imageId) && <span className="border border-stone-3 bg-stone/35 px-2 py-1">Image</span>}
              </div>

              <div className="flex flex-wrap gap-2">
                {row ? (
                  <button type="button" onClick={() => onSelect(row)} className={cn(primaryButtonClass, "min-h-10 px-3 text-xs")}>
                    Edit section
                  </button>
                ) : (
                  <button type="button" onClick={() => onCreate(section.value)} className={cn(secondaryButtonClass, "min-h-10 px-3 text-xs")}>
                    <Plus size={14} />
                    Create section
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function sectionShapeLabel(pageKey: string, sectionKey: string) {
  const starters = sectionStartersFor(pageKey, sectionKey);
  const type = normalizeSectionItemType(starters[0]?.items[0]?.type);
  const labels: Record<SectionItemType, string> = {
    card: "Card template",
    stat: "Stats template",
    link: "Links template",
    timeline: "Timeline template",
  };
  return labels[type];
}

function PageContentManager(props: {
  pageKey: string;
  showSectionPicker?: boolean;
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  busy: boolean;
  dirtyKeys?: Record<string, boolean>;
  media: MediaAsset[];
  onImageDrop?: (file: File, target: ImageAssignment) => void;
  setFormValue: (key: string, patch: FormState) => void;
  saveEntity: (config: EntityConfig, formOverrides?: FormState) => Promise<void>;
  resetForm: (key: string, overrides?: FormState) => void;
  selectEntity: (config: EntityConfig, row: Row) => void;
  deleteEntity: (config: EntityConfig, row: Row) => Promise<void>;
}) {
  const filteredConfig = {
    ...props.config,
    title: `${pageOptions.find((page) => page.value === props.pageKey)?.label || props.pageKey} Content Blocks`,
    rows: props.config.rows.filter((row) => row.pageKey === props.pageKey),
  };
  const primaryFields = fieldsByKeys(filteredConfig.fields, ["title", "eyebrow", "bodyText", "itemsText", "imageId", "enabled"]);
  const advancedFields = fieldsByKeys(filteredConfig.fields, ["ctaLabel", "ctaHref", "variant", "order", "visibleFrom", "visibleUntil"]);
  const dirty = Boolean(props.dirtyKeys?.pageContent);
  const selectedRow = filteredConfig.rows.find((row) => row.id === props.selectedId);
  const currentSection = String(props.form.sectionKey || defaultPageContentSection(props.pageKey));
  const sectionStarters = sectionStartersFor(props.pageKey, currentSection);

  useEffect(() => {
    if (String(props.form.pageKey || "") === props.pageKey) return;
    props.resetForm("pageContent", { pageKey: props.pageKey, sectionKey: defaultPageContentSection(props.pageKey) });
  }, [props.form.pageKey, props.pageKey, props.resetForm]);

  function setPageContentForm(patch: FormState) {
    props.setFormValue("pageContent", patch);
  }

  function chooseSection(sectionKey: string) {
    const existing = filteredConfig.rows
      .filter((row) => row.sectionKey === sectionKey)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))[0];

    if (existing) props.selectEntity(filteredConfig, existing);
    else props.resetForm("pageContent", { pageKey: props.pageKey, sectionKey });
  }

  function createNewSection() {
    props.resetForm("pageContent", { pageKey: props.pageKey, sectionKey: defaultPageContentSection(props.pageKey) });
  }

  function useSectionTemplate(starter: SectionStarter, mode: "replace" | "append") {
    const existingItems = itemsFromText(props.form.itemsText);
    const starterItems = starter.items.map((item) => ({ ...item }));
    const nextItems = mode === "replace" ? starterItems : [...existingItems, ...starterItems];
    setPageContentForm({ itemsText: itemsToFriendlyText(nextItems) });
  }

  return (
    <section className="grid items-start gap-5 2xl:grid-cols-[minmax(640px,1fr)_400px]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void props.saveEntity(filteredConfig);
        }}
        className="grid content-start gap-5"
      >
        {props.showSectionPicker !== false && (
          <Panel title={`${pageLabel(props.pageKey)} Sections`} icon={<LayoutDashboard size={18} />}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {pageContentSectionOptions(props.pageKey).map((section) => {
                const hasContent = filteredConfig.rows.some((row) => row.sectionKey === section.value);
                const active = currentSection === section.value;

                return (
                  <button
                    key={section.value}
                    type="button"
                    onClick={() => chooseSection(section.value)}
                    className={cn(
                      "min-h-20 border p-3 text-left transition-colors",
                      active ? "border-neon bg-neon/10 text-neon" : "border-stone-3 bg-void/35 text-bone hover:border-bone/35"
                    )}
                    aria-pressed={active}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-semibold">{section.label}</span>
                      {active && <CheckCircle2 size={16} className="shrink-0" aria-hidden />}
                    </span>
                    <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-ash">
                      {hasContent ? "Editable content" : "Empty section"}
                    </span>
                  </button>
                );
              })}
            </div>
          </Panel>
        )}

        <PageContentFlowBar
          pageKey={props.pageKey}
          sectionKey={currentSection}
          form={props.form}
          media={props.media}
          dirty={dirty}
        />

        <PageSectionTemplateShelf
          pageKey={props.pageKey}
          sectionKey={currentSection}
          starters={sectionStarters}
          currentItemCount={itemsFromText(props.form.itemsText).length}
          onUse={(starter) => useSectionTemplate(starter, "replace")}
          onAppend={(starter) => useSectionTemplate(starter, "append")}
        />

        <VisualEntityEditor
          config={filteredConfig}
          form={props.form}
          selectedId={props.selectedId}
          media={props.media}
          primaryFields={primaryFields}
          onChange={setPageContentForm}
          onImageDrop={props.onImageDrop}
        />

        <AdvancedPanel fields={advancedFields} form={props.form} onChange={setPageContentForm} />

        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-2 border border-stone-3 bg-void/85 p-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur">
          <DirtyStateBadge dirty={dirty} />
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={props.busy} className={primaryButtonClass}>
              {props.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
              {props.selectedId ? "Save section" : "Create section"}
            </button>
            <button type="button" onClick={createNewSection} className={secondaryButtonClass}>
              <Plus size={15} />
              New section
            </button>
            {selectedRow && (
              <button type="button" onClick={() => void props.deleteEntity(filteredConfig, selectedRow)} className={secondaryButtonClass}>
                <Trash2 size={15} />
                Delete
              </button>
            )}
          </div>
        </div>
      </form>

      <aside className="grid h-fit gap-5 2xl:sticky 2xl:top-24">
        <LiveContentPreview entityKey="pageContent" form={props.form} media={props.media} />
        <EditorReadinessPanel entityKey="pageContent" form={props.form} media={props.media} dirty={dirty} />
      </aside>
    </section>
  );
}

function PageContentFlowBar({
  pageKey,
  sectionKey,
  form,
  media,
  dirty,
}: {
  pageKey: string;
  sectionKey: string;
  form: FormState;
  media: MediaAsset[];
  dirty: boolean;
}) {
  const items = itemsFromText(form.itemsText);
  const hasTitle = Boolean(String(form.title || "").trim());
  const hasBody = Boolean(String(form.bodyText || "").trim());
  const hasImage = Boolean(previewImage("pageContent", form, media));
  const sectionLabel = pageContentSectionLabel(pageKey, sectionKey);
  const steps = [
    { label: "Section", ok: Boolean(pageKey && sectionKey), detail: `${pageLabel(pageKey)} / ${sectionLabel}` },
    { label: "Headline", ok: hasTitle, detail: hasTitle ? String(form.title) : "Add section heading" },
    { label: "Blocks", ok: items.length > 0 || hasBody, detail: items.length > 0 ? `${items.length} draggable blocks` : hasBody ? "Body copy ready" : "Add blocks or copy" },
    { label: "Image", ok: hasImage, detail: hasImage ? "Image selected" : "Optional" },
    { label: "Visibility", ok: form.enabled !== false, detail: form.enabled !== false ? "Visible when saved" : "Off" },
  ];

  return (
    <section className="border border-stone-3 bg-stone/35 p-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">Visual section builder</div>
          <p className="mt-1 text-sm leading-6 text-ash">Edit the public section content, choose its block template, then save it into this page area.</p>
        </div>
        <DirtyStateBadge dirty={dirty} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.label} className={cn("border p-3", step.ok ? "border-neon/45 bg-neon/10" : "border-stone-3 bg-void/35")}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">{String(index + 1).padStart(2, "0")}</span>
              <span className={cn("grid h-5 w-5 place-items-center border", step.ok ? "border-neon text-neon" : "border-stone-3 text-ash")}>
                {step.ok ? <CheckCircle2 size={13} /> : <CircleSlash size={12} />}
              </span>
            </div>
            <div className="mt-3 text-sm font-semibold text-bone">{step.label}</div>
            <div className="mt-1 truncate text-xs text-ash">{step.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PageSectionTemplateShelf({
  pageKey,
  sectionKey,
  starters,
  currentItemCount,
  onUse,
  onAppend,
}: {
  pageKey: string;
  sectionKey: string;
  starters: SectionStarter[];
  currentItemCount: number;
  onUse: (starter: SectionStarter) => void;
  onAppend: (starter: SectionStarter) => void;
}) {
  if (starters.length === 0) return null;

  return (
    <Panel title="Section Templates" icon={<Sparkles size={18} />}>
      <div className="grid gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neon">
              {pageLabel(pageKey)} / {pageContentSectionLabel(pageKey, sectionKey)}
            </div>
            <p className="mt-1 text-sm leading-6 text-ash">Choose the approved block layout for this exact public section, then edit the blocks directly below.</p>
          </div>
          <span className="w-fit border border-stone-3 bg-void/35 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
            {currentItemCount} active blocks
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {starters.map((starter) => (
            <section key={starter.key} className="grid gap-3 border border-stone-3 bg-void/30 p-3 transition-colors hover:border-neon/70">
              <SectionStarterPreview starter={starter} />
              <div>
                <h3 className="text-sm font-semibold text-bone">{starter.label}</h3>
                <p className="mt-1 text-xs leading-5 text-ash">{starter.help}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => onUse(starter)} className={cn(primaryButtonClass, "min-h-10 px-3 text-xs")}>
                  <CheckCircle2 size={14} />
                  Use template
                </button>
                <button type="button" onClick={() => onAppend(starter)} className={cn(secondaryButtonClass, "min-h-10 px-3 text-xs")}>
                  <Plus size={14} />
                  Add below
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function EntityManager({
  config,
  form,
  selectedId,
  busy,
  onFormChange,
  onSave,
  onNew,
  onSelect,
  onDelete,
  extraRowActions,
}: {
  config: EntityConfig;
  form: FormState;
  selectedId?: string | null;
  busy: boolean;
  onFormChange: (patch: FormState) => void;
  onSave: () => void;
  onNew: () => void;
  onSelect: (row: Row) => void;
  onDelete: (row: Row) => void;
  extraRowActions?: (row: Row) => ReactNode;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(360px,460px)_minmax(0,1fr)]">
      <Panel title={selectedId ? `Edit ${config.title}` : `Create ${config.title}`} icon={config.icon}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
          className="grid gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {config.fields.map((field) => (
              <Field key={field.key} label={field.label} span={field.span || (field.type === "textarea" ? "full" : "half")}>
                <InputField field={field} form={form} onChange={(value) => onFormChange({ [field.key]: value })} />
              </Field>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className={primaryButtonClass}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
              {selectedId ? "Save changes" : "Create"}
            </button>
            <button type="button" onClick={onNew} className={secondaryButtonClass}>
              <Plus size={15} />
              New
            </button>
          </div>
        </form>
      </Panel>

      <Panel title={config.title} icon={config.icon}>
        {config.rows.length === 0 ? (
          <EmptyState text={`No ${config.title.toLowerCase()} yet.`} />
        ) : (
          <div className="grid gap-3">
            {config.rows.map((row) => (
              <div key={row.id} className={cn("border bg-void/35 p-4", selectedId === row.id ? "border-neon" : "border-stone-3")}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <button type="button" onClick={() => onSelect(row)} className="min-w-0 text-left">
                    <div className="truncate text-sm font-medium text-bone">{config.label(row)}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ash">{config.description?.(row) || row.id}</div>
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {extraRowActions?.(row)}
                    <button type="button" onClick={() => onSelect(row)} className={miniButtonClass}>Edit</button>
                    <button type="button" onClick={() => onDelete(row)} className={iconButtonClass} aria-label={`Delete ${config.label(row)}`}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </section>
  );
}

function MediaManager({
  media,
  busy,
  uploadFile,
  uploadAlt,
  uploadCaption,
  onUpload,
  onFileChange,
  onDropFile,
  onAltChange,
  onCaptionChange,
  onPatch,
  onSave,
  onDelete,
}: {
  media: MediaAsset[];
  busy: boolean;
  uploadFile: File | null;
  uploadAlt: string;
  uploadCaption: string;
  onUpload: (event: FormEvent<HTMLFormElement>) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDropFile: (file: File | null) => void;
  onAltChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onPatch: (asset: MediaAsset) => void;
  onSave: (asset: MediaAsset) => void;
  onDelete: (asset: MediaAsset) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const uploadPreviewUrl = useMemo(() => (uploadFile ? URL.createObjectURL(uploadFile) : ""), [uploadFile]);

  useEffect(() => {
    return () => {
      if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
    };
  }, [uploadPreviewUrl]);

  return (
    <section className="grid gap-6 2xl:grid-cols-[minmax(420px,520px)_minmax(0,1fr)]">
      <Panel title="Upload Image" icon={<ImagePlus size={18} />}>
        <form onSubmit={onUpload} className="grid gap-4">
          <label
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              onDropFile(event.dataTransfer.files?.[0] || null);
            }}
            className={cn(
              "grid min-h-[280px] cursor-pointer place-items-center overflow-hidden border border-dashed bg-void/45 transition-colors",
              isDragging ? "border-neon bg-neon/10" : "border-stone-3 hover:border-neon/70"
            )}
          >
            {uploadPreviewUrl ? (
              <div className="grid h-full w-full gap-3 p-3">
                <img src={uploadPreviewUrl} alt="" className="max-h-[300px] w-full border border-stone-3 object-contain" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-bone">{uploadFile?.name}</div>
                    <div className="mt-1 text-xs text-ash">{uploadFile ? formatBytes(uploadFile.size) : ""}</div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      onDropFile(null);
                    }}
                    className={miniButtonClass}
                  >
                    Remove file
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid justify-items-center gap-3 p-6 text-center">
                <UploadCloud className="h-9 w-9 text-neon" aria-hidden />
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon">Drop image here</div>
                <p className="max-w-sm text-sm leading-6 text-ash">Upload posters, players, sponsor logos, page images, and post covers into one shared library.</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={onFileChange} className="sr-only" />
          </label>

          <Field label="Alt text">
            <input value={uploadAlt} onChange={(event) => onAltChange(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Caption">
            <input value={uploadCaption} onChange={(event) => onCaptionChange(event.target.value)} className={inputClass} />
          </Field>
          <button type="submit" disabled={busy || !uploadFile} className={primaryButtonClass}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud size={16} />}
            Upload image
          </button>
        </form>
      </Panel>

      <Panel title="Media Library" icon={<UploadCloud size={18} />}>
        {media.length === 0 ? (
          <EmptyState text="No images uploaded." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {media.map((asset) => (
              <article key={asset.id} className="grid gap-3 border border-stone-3 bg-void/30 p-3 transition-colors hover:border-bone/30">
                <img src={mediaUrl(asset.url)} alt={asset.alt || asset.originalName} className="aspect-video w-full border border-stone-3 object-cover" />
                <div className="grid gap-3">
                  <div>
                    <div className="truncate text-sm font-medium text-bone">{asset.originalName}</div>
                    <div className="mt-1 truncate text-xs text-ash">{asset.mimeType || "image"} / {formatBytes(Number(asset.size || 0))}</div>
                  </div>
                  <Field label="Alt text" span="full">
                    <input value={asset.alt || ""} onChange={(event) => onPatch({ ...asset, alt: event.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Caption" span="full">
                    <input value={asset.caption || ""} onChange={(event) => onPatch({ ...asset, caption: event.target.value })} className={inputClass} />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onSave(asset)} className={miniButtonClass}>Save</button>
                    <button type="button" onClick={() => onDelete(asset)} className={iconButtonClass} aria-label={`Delete ${asset.originalName}`}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </section>
  );
}

function Toolbar({
  filters,
  setFilters,
  templates,
}: {
  filters: { search: string; page: string; status: string; template: string; slot: string };
  setFilters: (filters: { search: string; page: string; status: string; template: string; slot: string }) => void;
  templates: PostTemplate[];
}) {
  return (
    <section className="grid gap-3 border border-stone-3 bg-stone/35 p-3 md:grid-cols-[minmax(220px,1fr)_repeat(4,minmax(130px,170px))]">
      <label className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" aria-hidden />
        <input
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          className={cn(inputClass, "pl-9")}
          placeholder="Search"
          aria-label="Search admin content"
        />
      </label>
      <select value={filters.page} onChange={(event) => setFilters({ ...filters, page: event.target.value })} className={inputClass} aria-label="Filter by page">
        <option value="all">All pages</option>
        {pageOptions.map((page) => <option key={page.value} value={page.value}>{page.label}</option>)}
      </select>
      <select value={filters.slot} onChange={(event) => setFilters({ ...filters, slot: event.target.value })} className={inputClass} aria-label="Filter by slot">
        <option value="all">All slots</option>
        {slotOptions.map((slot) => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
      </select>
      <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className={inputClass} aria-label="Filter by status">
        <option value="all">All statuses</option>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>
      <select value={filters.template} onChange={(event) => setFilters({ ...filters, template: event.target.value })} className={inputClass} aria-label="Filter by template">
        <option value="all">All templates</option>
        {templates.map((template) => <option key={template.id} value={template.key}>{template.name}</option>)}
      </select>
    </section>
  );
}

function InputField({ field, form, onChange }: { field: FieldDef; form: FormState; onChange: (value: string | boolean) => void }) {
  const value = form[field.key] ?? "";
  const options = typeof field.options === "function" ? field.options(form) : field.options || [];

  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputClass, "min-h-28 resize-y")}
        placeholder={field.placeholder}
        required={field.required}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select value={String(value)} onChange={(event) => onChange(event.target.value)} className={inputClass} required={field.required}>
        {options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-11 items-center gap-3 border border-stone-3 bg-void/45 px-3 text-sm text-bone transition-colors hover:border-bone/30">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-neon" />
        {field.label}
      </label>
    );
  }

  return (
    <input
      type={field.type === "number" ? "number" : field.type === "datetime" ? "datetime-local" : "text"}
      value={String(value)}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
      placeholder={field.placeholder}
      required={field.required}
    />
  );
}

function Field({ label, children, span = "half" }: { label: string; children: ReactNode; span?: "full" | "half" }) {
  return (
    <label className={cn("grid gap-2", span === "full" && "sm:col-span-2")}>
      <span className="text-xs font-medium text-ash">{label}</span>
      {children}
    </label>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="border border-stone-3 bg-stone/40 shadow-[0_18px_60px_-46px_rgba(0,0,0,0.9)]">
      <div className="flex min-h-12 items-center gap-3 border-b border-stone-3 px-4">
        <span className="text-neon">{icon}</span>
        <h2 className="text-sm font-semibold text-bone">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Metric({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="border border-stone-3 bg-stone/35 p-4">
      <div className="text-xs font-medium text-ash">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-bone">{value}</div>
      <div className="mt-1 text-xs text-ash">{sub}</div>
    </div>
  );
}

function StatusMessage({ tone, text }: { tone: "success" | "error"; text: string }) {
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className={cn("flex min-h-11 items-center gap-3 border px-3 text-sm", tone === "success" ? "border-neon/50 bg-neon/10 text-neon" : "border-blood/60 bg-blood/10 text-bone")}>
      <Icon size={17} aria-hidden />
      {text}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="grid place-items-center gap-2 border border-dashed border-stone-3 bg-void/25 p-8 text-center text-sm text-ash">
      <CircleSlash size={20} />
      {text}
    </div>
  );
}

function MiniButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={miniButtonClass}>
      {children}
    </button>
  );
}

function option(value: string, label: string): SelectOption {
  return { value, label };
}

function entitySingularLabel(entityKey: string) {
  const labels: Record<string, string> = {
    events: "Event",
    players: "Player",
    sponsors: "Sponsor",
    circuits: "PTL item",
    streams: "Watch item",
    posts: "Post",
    pageContent: "Section",
    templates: "Template",
    placements: "Placement",
  };
  return labels[entityKey] || "Content";
}

function entityBuilderHelp(entityKey: string) {
  const help: Record<string, string> = {
    events: "Edit the event card directly, add poster art, choose its page placement, and save.",
    players: "Build the player profile from the visual card: tag, country, image, mains, and placement.",
    sponsors: "Create sponsor blocks with logo, tier, link, visibility, and placement.",
    circuits: "Control PTL season details, registration, dates, and PTL page placement.",
    streams: "Create live streams or VOD cards for the Watch tab with URL and schedule.",
  };
  return help[entityKey] || "Edit this content visually, then place and save it.";
}

function entityVisibilityDetail(entityKey: string, form: FormState) {
  if (entityKey === "streams") return form.isLive ? "Live now" : form.enabled !== false ? "Enabled" : "Off";
  if (typeof form.status === "string" && form.status) return String(form.status);
  return form.enabled === false ? "Off" : "Enabled";
}

function visualEntitySpec(entityKey: string, form: FormState): VisualEntitySpec | undefined {
  const specs: Record<string, VisualEntitySpec> = {
    events: {
      titleKey: "name",
      eyebrowKey: "status",
      excerptKey: "tagline",
      imageKey: "posterUrl",
      imageMode: "url",
      heroLabel: "Event visual editor",
    },
    players: {
      titleKey: "tag",
      eyebrowKey: "country",
      excerptKey: "realName",
      bodyKey: "mainsText",
      imageKey: "photoUrl",
      imageMode: "url",
      heroLabel: "Player profile editor",
    },
    sponsors: {
      titleKey: "name",
      eyebrowKey: "tier",
      excerptKey: "url",
      imageKey: "logoLightUrl",
      imageMode: "url",
      heroLabel: "Sponsor block editor",
    },
    circuits: {
      titleKey: "name",
      eyebrowKey: "status",
      excerptKey: "tagline",
      bodyKey: "pointsRules",
      heroLabel: "PTL circuit editor",
    },
    streams: {
      titleKey: "title",
      eyebrowKey: "platform",
      excerptKey: "url",
      bodyKey: "channel",
      heroLabel: "Watch item editor",
    },
    pageContent: {
      titleKey: "title",
      eyebrowKey: "eyebrow",
      excerptKey: "bodyText",
      imageKey: "imageId",
      imageMode: "id",
      itemKey: "itemsText",
      heroLabel: `${pageLabel(String(form.pageKey || "home"))} / ${pageContentSectionLabel(String(form.pageKey || "home"), String(form.sectionKey || "intro"))}`,
    },
  };

  return specs[entityKey];
}

function visualEntityFallback(entityKey: string, field: "eyebrow" | "title" | "excerpt" | "body") {
  const fallbacks: Record<string, Record<typeof field, string>> = {
    events: {
      eyebrow: "upcoming",
      title: "Tournament title",
      excerpt: "Short event description, city, or registration message.",
      body: "Event details.",
    },
    players: {
      eyebrow: "PK",
      title: "Player tag",
      excerpt: "Real name or short profile line.",
      body: "TEKKEN 8: Character 1, Character 2",
    },
    sponsors: {
      eyebrow: "partner",
      title: "Sponsor name",
      excerpt: "Sponsor website or campaign note.",
      body: "Partner details.",
    },
    circuits: {
      eyebrow: "upcoming",
      title: "Pakistan Tekken League",
      excerpt: "PTL season tagline.",
      body: "Points rules or format notes.",
    },
    streams: {
      eyebrow: "youtube",
      title: "Broadcast title",
      excerpt: "Watch URL",
      body: "Channel or stream note.",
    },
    pageContent: {
      eyebrow: "Section label",
      title: "Section heading",
      excerpt: "Section body copy.",
      body: "Section body copy.",
    },
  };

  return fallbacks[entityKey]?.[field] || "";
}

function config(
  key: string,
  title: string,
  icon: ReactNode,
  endpoint: string,
  rows: Row[],
  fields: FieldDef[],
  defaults: FormState,
  label: (row: Row) => string,
  description?: (row: Row) => string
): EntityConfig {
  return { key, title, icon, endpoint, rows, fields, defaults, label, description };
}

function textField(key: string, label: string, required = false): FieldDef {
  return { key, label, required };
}

function textareaField(key: string, label: string): FieldDef {
  return { key, label, type: "textarea", span: "full" };
}

function csvField(key: string, label: string): FieldDef {
  return { key, label, type: "csv", span: "full" };
}

function numberField(key: string, label: string): FieldDef {
  return { key, label, type: "number" };
}

function datetimeField(key: string, label: string): FieldDef {
  return { key, label, type: "datetime" };
}

function checkboxField(key: string, label: string): FieldDef {
  return { key, label, type: "checkbox" };
}

function selectField(key: string, label: string, options: FieldDef["options"]): FieldDef {
  return { key, label, type: "select", options };
}

function fieldsByKeys(fields: FieldDef[], keys: string[]) {
  return keys
    .map((key) => fields.find((field) => field.key === key))
    .filter((field): field is FieldDef => Boolean(field));
}

function defaultPostBlockOrder(template?: PostTemplate): EditablePostBlockKey[] {
  if (!template) return defaultEditablePostBlocks;
  const kind = templatePreviewKind(template);
  const saved = normalizeTemplateBlockOrder(Array.isArray(template.blockOrder) ? template.blockOrder.join(",") : "", kind, { fillMissing: false });
  return saved.length ? saved : defaultBlockOrderForKind(kind);
}

function normalizePostBlockOrder(value: string | boolean | undefined, template?: PostTemplate): EditablePostBlockKey[] {
  const allowed = defaultPostBlockOrder(template);
  const raw = String(value || "").trim();
  if (!raw) return allowed;

  const requested = raw
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is EditablePostBlockKey => Boolean(postBlockLabels[item as EditablePostBlockKey]) && allowed.includes(item as EditablePostBlockKey));
  const deduped = Array.from(new Set(requested));
  for (const block of allowed) {
    if (requiredTemplateBlocks.has(block) && !deduped.includes(block)) deduped.unshift(block);
  }
  return deduped.length ? deduped : allowed;
}

function allowedBlocksForKind(kind: TemplatePreviewKind): EditablePostBlockKey[] {
  if (kind === "fullWidth") return ["eyebrow", "title", "excerpt", "bodyText", "facts", "cta", "image"];
  if (kind === "stats") return ["eyebrow", "title", "excerpt", "bodyText", "facts", "cta"];
  if (kind === "player" || kind === "hero" || kind === "imageFeature" || kind === "video") {
    return defaultEditablePostBlocks.filter((block) => block !== "facts");
  }
  return ["eyebrow", "title", "excerpt", "bodyText", "cta"];
}

function defaultBlockOrderForKind(kind: TemplatePreviewKind): EditablePostBlockKey[] {
  if (kind === "fullWidth") return ["eyebrow", "title", "excerpt", "bodyText", "facts", "cta"];
  if (kind === "stats") return ["eyebrow", "title", "excerpt", "facts", "cta"];
  if (kind === "player" || kind === "hero" || kind === "imageFeature" || kind === "video") {
    return defaultEditablePostBlocks.filter((block) => block !== "facts");
  }
  return ["eyebrow", "title", "excerpt", "bodyText", "cta"];
}

function normalizeTemplateBlockOrder(value: string | boolean | undefined, kind: TemplatePreviewKind, options: { fillMissing: boolean }) {
  const allowed = allowedBlocksForKind(kind);
  const raw = String(value || "").trim();
  if (!raw) return options.fillMissing ? defaultBlockOrderForKind(kind) : defaultBlockOrderForKind(kind);
  const requested = raw
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is EditablePostBlockKey => Boolean(postBlockLabels[item as EditablePostBlockKey]) && allowed.includes(item as EditablePostBlockKey));
  const deduped = Array.from(new Set(requested));
  const withRequired = [...deduped];

  for (const block of allowed) {
    if (requiredTemplateBlocks.has(block) && !withRequired.includes(block)) withRequired.push(block);
  }

  if (!withRequired.length || options.fillMissing) {
    return [...withRequired, ...allowed.filter((item) => !withRequired.includes(item))];
  }

  return withRequired;
}

function previewTitle(entityKey: string, form: FormState, row?: Row) {
  const fallback = row?.title || row?.name || row?.tag || row?.slug || "Untitled";
  const valueByKey: Record<string, unknown> = {
    posts: form.title,
    events: form.name,
    players: form.tag,
    sponsors: form.name,
    circuits: form.name,
    streams: form.title,
    pageContent: form.title,
    placements: form.title,
  };

  return String(valueByKey[entityKey] || fallback);
}

function previewEyebrow(entityKey: string, form: FormState, template?: PostTemplate) {
  if (entityKey === "posts") return String(form.eyebrow || template?.defaultEyebrow || template?.name || "POST");
  if (entityKey === "events") return String(form.status || "EVENT");
  if (entityKey === "players") return String(form.country || "PLAYER");
  if (entityKey === "sponsors") return String(form.tier || "PARTNER");
  if (entityKey === "circuits") return "PTL 2026";
  if (entityKey === "streams") return String(form.platform || "WATCH");
  if (entityKey === "pageContent") return String(form.eyebrow || form.sectionKey || "PAGE BLOCK");
  return "CMS";
}

function previewExcerpt(entityKey: string, form: FormState) {
  if (entityKey === "posts") return String(form.excerpt || form.bodyText || "");
  if (entityKey === "events") return String(form.tagline || [form.city, form.country].filter(Boolean).join(", "));
  if (entityKey === "players") return String(form.realName || form.mainsText || "");
  if (entityKey === "sponsors") return String(form.url || "");
  if (entityKey === "circuits") return String(form.tagline || form.pointsRules || "");
  if (entityKey === "streams") return String(form.url || form.channel || "");
  if (entityKey === "pageContent") return String(form.bodyText || "");
  return "";
}

function previewStatus(entityKey: string, form: FormState) {
  if (entityKey === "posts") return String(form.status || "DRAFT");
  if (entityKey === "streams") return form.isLive ? "LIVE" : form.enabled ? "ENABLED" : "DISABLED";
  if ("enabled" in form) return form.enabled ? "ENABLED" : "DISABLED";
  if (form.status) return String(form.status);
  return "READY";
}

function previewPublicContext(entityKey: string, form: FormState) {
  if (entityKey === "pageContent") {
    const pageKey = String(form.pageKey || "home");
    const sectionKey = String(form.sectionKey || defaultPageContentSection(pageKey));
    return {
      label: pageLabel(pageKey),
      detail: pageContentSectionLabel(pageKey, sectionKey),
      href: publicPathForPageKey(pageKey),
      enabled: form.enabled !== false,
    };
  }

  if (!placeableEntityKeys.has(entityKey)) return undefined;

  const defaults = defaultPlacementFor(entityKey, entityKey === "posts" ? String(form.templateKey || "") : undefined);
  const pageKey = String(form.placementPageKey || defaults.pageKey);
  const slotKey = String(form.placementSlotKey || defaults.slotKey);

  return {
    label: pageLabel(pageKey),
    detail: slotLabel(slotKey),
    href: publicPathForPageKey(pageKey),
    enabled: form.placementEnabled !== false,
  };
}

function previewVisibilityChecks(entityKey: string, form: FormState) {
  const checks: Array<{ label: string; ok: boolean; detail: string }> = [];
  const add = (label: string, ok: boolean, detail: string) => checks.push({ label, ok, detail });
  const schedule = visibilityScheduleState(form);

  if (entityKey === "posts") {
    const published = form.status === "PUBLISHED";
    add("Published status", published, published ? "Post status is published." : "Save as Publish before expecting it on the public site.");
  }

  if (entityKey === "pageContent") {
    const enabled = form.enabled !== false;
    add("Section enabled", enabled, enabled ? "This page section is enabled." : "Turn this section on before it appears publicly.");
  }

  if (placeableEntityKeys.has(entityKey)) {
    const hasPlacement = Boolean(form.placementPageKey && form.placementSlotKey);
    const enabled = form.placementEnabled !== false;
    add("Placement selected", hasPlacement, hasPlacement ? readablePlacement(form.placementPageKey, form.placementSlotKey) : "Choose a page and page area.");
    add("Placement enabled", enabled, enabled ? "This item is allowed to show in the selected page area." : "Turn on Show on website in Publish Placement.");
  }

  if (["events", "circuits"].includes(entityKey)) {
    const status = String(form.status || "").toLowerCase();
    const ok = status !== "draft" && status !== "archived";
    add("Content status", ok, ok ? `Status is ${status || "ready"}.` : "Draft or archived content is hidden publicly.");
  }

  if (["players", "sponsors", "streams"].includes(entityKey)) {
    const enabled = form.enabled !== false;
    add("Enabled", enabled, enabled ? "This item is enabled." : "Turn this item on before it appears publicly.");
  }

  add("Schedule window", schedule.ok, schedule.detail);
  return checks;
}

function visibilityScheduleState(form: FormState) {
  const from = String(form.placementVisibleFrom || form.visibleFrom || "").trim();
  const until = String(form.placementVisibleUntil || form.visibleUntil || "").trim();
  const now = Date.now();
  const fromTime = from ? new Date(from).getTime() : undefined;
  const untilTime = until ? new Date(until).getTime() : undefined;

  if (fromTime && !Number.isNaN(fromTime) && fromTime > now) {
    return { ok: false, detail: `Scheduled for ${formatPreviewDate(from)}.` };
  }

  if (untilTime && !Number.isNaN(untilTime) && untilTime < now) {
    return { ok: false, detail: `Expired on ${formatPreviewDate(until)}.` };
  }

  if (from || until) {
    const fromLabel = from ? formatPreviewDate(from) : "now";
    const untilLabel = until ? formatPreviewDate(until) : "no end date";
    return { ok: true, detail: `Visible from ${fromLabel} to ${untilLabel}.` };
  }

  return { ok: true, detail: "No schedule limit is blocking this content." };
}

function previewFacts(entityKey: string, form: FormState) {
  const facts: Array<{ label: string; value: string }> = [];
  const add = (label: string, value: unknown) => {
    const text = String(value || "").trim();
    if (text) facts.push({ label, value: text });
  };

  if (entityKey === "events") {
    add("Date", formatPreviewDateRange(form.startDate, form.endDate));
    add("Location", [form.city, form.country].filter(Boolean).join(", "));
    add("Entrants", form.participants);
    add("Games", form.games);
  }

  if (entityKey === "players") {
    add("Real name", form.realName);
    add("Country", form.country);
    add("Mains", firstLine(form.mainsText));
    add("Team", form.teamId);
  }

  if (entityKey === "sponsors") {
    add("Tier", form.tier);
    add("Website", form.url);
    add("Status", form.enabled === false ? "Off" : "Enabled");
  }

  if (entityKey === "circuits") {
    add("Season", form.edition);
    add("Date", formatPreviewDateRange(form.startDate, form.endDate));
    add("Location", [form.city, form.country].filter(Boolean).join(", "));
    add("Registration", form.registrationOpen ? "Open" : "Closed");
  }

  if (entityKey === "streams") {
    add("Platform", form.platform);
    add("Schedule", formatPreviewDateRange(form.scheduledStart));
    add("Channel", form.channel);
    add("Status", form.isLive ? "Live now" : form.enabled === false ? "Off" : "Enabled");
  }

  return facts.slice(0, 4);
}

function defaultCtaFor(entityKey: string, template?: PostTemplate) {
  if (entityKey === "posts") return template?.defaultCtaLabel || "";
  if (entityKey === "events") return "View event";
  if (entityKey === "players") return "View player";
  if (entityKey === "sponsors") return "View partner";
  if (entityKey === "streams") return "Watch now";
  if (entityKey === "circuits") return "View PTL";
  return "";
}

function previewImage(entityKey: string, form: FormState, media: MediaAsset[]) {
  if (entityKey === "posts") return mediaUrl(media.find((asset) => asset.id === form.coverImageId)?.url || "");
  if (entityKey === "pageContent") return mediaUrl(media.find((asset) => asset.id === form.imageId)?.url || "");
  if (entityKey === "events") return displayImageUrl(String(form.posterUrl || ""));
  if (entityKey === "players") return displayImageUrl(String(form.photoUrl || ""));
  if (entityKey === "sponsors") return displayImageUrl(String(form.logoLightUrl || form.logoDarkUrl || ""));
  return undefined;
}

function displayImageUrl(value: string) {
  const url = value.trim();
  if (!url) return undefined;
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.startsWith("/")) return mediaUrl(url);
  return url;
}

function defaultPageContentSection(pageKey: string) {
  return pageContentSectionOptions(pageKey)[0]?.value || "intro";
}

function pageContentSectionOptions(pageKey: string) {
  return pageContentSectionsByPage[pageKey] || [option("intro", "Intro")];
}

function pageContentSectionLabel(pageKey: string, sectionKey: string) {
  return pageContentSectionOptions(pageKey).find((section) => section.value === sectionKey)?.label || sectionKey || "Section";
}

function apiErrorMessage(data: unknown, status: number) {
  const record = asPlainRecord(data);
  const message = record.message;

  if (Array.isArray(message)) {
    const clean = message.map((item) => String(item || "").trim()).filter(Boolean);
    if (clean.length > 0) return clean.join(" ");
  }

  if (typeof message === "string" && message.trim()) return message;
  if (typeof record.error === "string" && record.error.trim()) return record.error;
  return `Could not save right now. The server returned ${status}.`;
}

function validateEntityForm(config: EntityConfig, form: FormState) {
  const errors: string[] = [];
  const missingRequired = config.fields
    .filter((field) => field.required && !hasFieldValue(form[field.key]))
    .map((field) => field.label);

  if (missingRequired.length > 0) {
    errors.push(`Add ${missingRequired.join(", ")} before saving.`);
  }

  if (config.key === "posts") {
    if (!hasFieldValue(form.templateKey)) errors.push("Choose a template before saving the post.");

    if (form.status === "PUBLISHED") {
      if (form.placementEnabled === false) errors.push("Turn on Show on website before publishing, or save it as a draft.");
      if (!hasFieldValue(form.placementPageKey) || !hasFieldValue(form.placementSlotKey)) {
        errors.push("Choose the page and page area before publishing.");
      }
    }
  }

  if (config.key === "placements") {
    if (!hasFieldValue(form.targetType) || !hasFieldValue(form.targetId)) errors.push("Choose what this placement should show.");
    if (!hasFieldValue(form.pageKey) || !hasFieldValue(form.slotKey)) errors.push("Choose the page and area for this placement.");
  }

  return errors;
}

function hasFieldValue(value: unknown) {
  if (typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  return typeof value === "string" ? value.trim().length > 0 : value !== null && typeof value !== "undefined";
}

const syntheticFieldKeys = new Set([
  "bodyText",
  "itemsText",
  "templateBlockOrder",
  "ctaLabel",
  "ctaHref",
  ...placeableSyntheticFieldKeys,
  "prizePoolDisplay",
  "prizePoolPkr",
  "prizePoolUsd",
  "posterUrl",
  "galleryUrls",
  "photoUrl",
  "mainsText",
  "socialsText",
  "logoLightUrl",
  "logoDarkUrl",
  "slotsText",
]);

function buildPayload(entityKey: string, fields: FieldDef[], form: FormState) {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    if (syntheticFieldKeys.has(field.key)) continue;
    const raw = form[field.key];
    if (field.type !== "checkbox" && (raw === "" || typeof raw === "undefined")) continue;

    if (field.type === "number") payload[field.key] = Number(raw);
    else if (field.type === "checkbox") payload[field.key] = Boolean(raw);
    else if (field.type === "csv") payload[field.key] = String(raw).split(",").map((item) => item.trim()).filter(Boolean);
    else payload[field.key] = raw;
  }

  applyFriendlyFields(entityKey, payload, form);
  return payload;
}

function applyFriendlyFields(entityKey: string, payload: Record<string, unknown>, form: FormState) {
  if (entityKey === "posts") {
    payload.body = textToBody(form.bodyText, itemsFromText(form.itemsText), blockLayoutFromForm(form));
    payload.cta = ctaFromForm(form);
  }

  if (entityKey === "events") {
    payload.prizePool = prizePoolFromForm(form);
    payload.poster = urlJson(form.posterUrl);
    payload.gallery = csvValues(form.galleryUrls);
  }

  if (entityKey === "players") {
    payload.photo = urlJson(form.photoUrl);
    payload.mains = mainsFromText(form.mainsText);
    payload.socials = linksFromText(form.socialsText);
  }

  if (entityKey === "sponsors") {
    payload.logoLight = urlJson(form.logoLightUrl);
    payload.logoDark = urlJson(form.logoDarkUrl);
  }

  if (entityKey === "circuits") {
    payload.prizePool = prizePoolFromForm(form);
    payload.slots = slotsFromText(form.slotsText);
  }

  if (entityKey === "pageContent") {
    payload.body = textToBody(form.bodyText, itemsFromText(form.itemsText));
    payload.cta = ctaFromForm(form);
  }
}

function textToBody(value: string | boolean | undefined, items?: Array<Record<string, string>>, layout?: Record<string, unknown>) {
  const text = String(value || "").trim();
  if (!text && (!items || items.length === 0) && !layout) return undefined;
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => ({ type: "paragraph", text: block }));
  return { blocks, ...(items && items.length > 0 ? { items } : {}), ...(layout ? { layout } : {}) };
}

function blockLayoutFromForm(form: FormState) {
  const blockOrder = String(form.templateBlockOrder || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is EditablePostBlockKey => Boolean(postBlockLabels[item as EditablePostBlockKey]));
  return blockOrder.length > 0 ? { blockOrder } : undefined;
}

function bodyToText(value: unknown) {
  if (typeof value === "string") return value;
  const record = asPlainRecord(value);
  if (typeof record.text === "string") return record.text;
  if (Array.isArray(record.blocks)) {
    return record.blocks
      .map((block) => asPlainRecord(block).text)
      .filter((text): text is string => typeof text === "string" && text.length > 0)
      .join("\n\n");
  }
  return "";
}

function bodyToBlockOrder(value: unknown) {
  const layout = asPlainRecord(asPlainRecord(value).layout);
  if (!Array.isArray(layout.blockOrder)) return "";
  return layout.blockOrder
    .map((item) => String(item || ""))
    .filter((item): item is EditablePostBlockKey => Boolean(postBlockLabels[item as EditablePostBlockKey]))
    .join(",");
}

function itemsFromText(value: string | boolean | undefined) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", titleOrValue = "", bodyOrSub = "", href = "", meta = "", type = "", ctaLabel = "", accent = "", imageKey = "", imageUrl = ""] = line.split("|").map((part) => part.trim());
      return {
        label,
        title: titleOrValue,
        value: titleOrValue,
        body: bodyOrSub,
        sub: bodyOrSub,
        href,
        meta,
        type,
        ctaLabel,
        accent,
        imageKey,
        imageUrl,
      };
    });
}

function itemsToText(value: unknown) {
  const record = asPlainRecord(value);
  if (!Array.isArray(record.items)) return "";
  return record.items
    .map((item) => {
      const row = asPlainRecord(item);
      return [row.label, row.title || row.value, row.body || row.sub, row.href, row.meta, row.type, row.ctaLabel, row.accent, row.imageKey, row.imageUrl]
        .map((part) => String(part || ""))
        .join(" | ")
        .replace(/(\s\|\s)*$/g, "");
    })
    .join("\n");
}

function itemsToFriendlyText(items: Array<Record<string, string>>) {
  return items
    .map((item) => [item.label, item.title || item.value, item.body || item.sub, item.href, item.meta, item.type, item.ctaLabel, item.accent, item.imageKey, item.imageUrl]
      .map((part) => String(part || ""))
      .join(" | ")
      .replace(/(\s\|\s)*$/g, ""))
    .join("\n");
}

function ctaFromForm(form: FormState) {
  const label = String(form.ctaLabel || "").trim();
  const href = String(form.ctaHref || "").trim();
  return label || href ? { label, href } : undefined;
}

function prizePoolFromForm(form: FormState) {
  const display = String(form.prizePoolDisplay || "").trim();
  const pkr = numberOrUndefined(form.prizePoolPkr);
  const usd = numberOrUndefined(form.prizePoolUsd);
  return display || typeof pkr === "number" || typeof usd === "number" ? { display, pkr, usd } : undefined;
}

function urlJson(value: string | boolean | undefined) {
  const url = String(value || "").trim();
  return url ? { url } : undefined;
}

function csvValues(value: string | boolean | undefined) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mainsFromText(value: string | boolean | undefined) {
  const lines = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const mains: Record<string, string[]> = {};
  for (const line of lines) {
    const [game, characters] = line.split(":");
    if (!game || !characters) continue;
    mains[game.trim()] = characters.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return Object.keys(mains).length ? mains : undefined;
}

function mainsToText(value: unknown) {
  const record = asPlainRecord(value);
  return Object.entries(record)
    .map(([game, characters]) => `${game}: ${Array.isArray(characters) ? characters.join(", ") : String(characters || "")}`)
    .join("\n");
}

function linksFromText(value: string | boolean | undefined) {
  const lines = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const links: Record<string, string> = {};
  for (const line of lines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 1) continue;
    const label = line.slice(0, separatorIndex).trim();
    const href = line.slice(separatorIndex + 1).trim();
    if (!label || !href) continue;
    links[label] = href;
  }
  return Object.keys(links).length ? links : undefined;
}

function linksToText(value: unknown) {
  const record = asPlainRecord(value);
  return Object.entries(record)
    .map(([label, href]) => `${label}: ${String(href || "")}`)
    .join("\n");
}

function slotsFromText(value: string | boolean | undefined) {
  const lines = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const slots = lines.map((line, index) => {
    const [label, sublabel = "", type = "stage-winner", filledBy = ""] = line.split("|").map((part) => part.trim());
    return {
      slotNumber: index + 1,
      label: label || `Slot ${index + 1}`,
      sublabel,
      type,
      filledBy: filledBy || undefined,
    };
  });
  return slots.length ? slots : undefined;
}

function slotsToText(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      const slot = asPlainRecord(item);
      return [slot.label, slot.sublabel, slot.type, slot.filledBy].map((part) => String(part || "")).join(" | ");
    })
    .join("\n");
}

function jsonUrlToForm(value: unknown) {
  if (typeof value === "string") return value;
  return readString(asPlainRecord(value).url);
}

function asPlainRecord(value: unknown) {
  return (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberOrUndefined(value: string | boolean | undefined) {
  const number = Number(value);
  return Number.isFinite(number) && String(value || "").trim() !== "" ? number : undefined;
}

function numberToForm(value: unknown) {
  return typeof value === "number" ? String(value) : "";
}

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const amount = value / 1024 ** index;
  return `${amount >= 10 || index === 0 ? Math.round(amount) : amount.toFixed(1)} ${units[index]}`;
}

function rowToForm(row: Row, fields: FieldDef[], defaults: FormState, entityKey?: string, placements: Row[] = []): FormState {
  const next = { ...defaults };
  for (const field of fields) {
    const value = row[field.key];
    if (typeof value === "undefined" || value === null) {
      next[field.key] = field.type === "checkbox" ? false : "";
    } else if (field.type === "csv" && Array.isArray(value)) {
      next[field.key] = value.join(", ");
    } else if (field.type === "datetime") {
      next[field.key] = toDateTimeLocal(String(value));
    } else if (field.type === "checkbox") {
      next[field.key] = Boolean(value);
    } else {
      next[field.key] = String(value);
    }
  }
  applyFriendlyRowValues(entityKey, row, next, placements);
  return next;
}

function savedRowToForm(config: EntityConfig, row: Row, workingForm: FormState, placements: Row[]) {
  const next = rowToForm(row, config.fields, config.defaults, config.key, placements);
  if (!placeableEntityKeys.has(config.key)) return next;

  return {
    ...next,
    placementEnabled: workingForm.placementEnabled,
    placementPageKey: workingForm.placementPageKey,
    placementSlotKey: workingForm.placementSlotKey,
    placementOrder: workingForm.placementOrder,
    placementVisibleFrom: workingForm.placementVisibleFrom,
    placementVisibleUntil: workingForm.placementVisibleUntil,
  };
}

function applyFriendlyRowValues(entityKey: string | undefined, row: Row, next: FormState, placements: Row[]) {
  if (entityKey && placeableEntityKeys.has(entityKey)) {
    const targetType = targetTypeByEntityKey[entityKey];
    const defaults = defaultPlacementFor(entityKey, entityKey === "posts" ? readString(row.templateKey) : undefined);
    const placement = placements.find((item) => item.targetType === targetType && item.targetId === row.id);
    next.placementEnabled = Boolean(placement?.enabled);
    next.placementPageKey = readString(placement?.pageKey) || defaults.pageKey;
    next.placementSlotKey = readString(placement?.slotKey) || defaults.slotKey;
    next.placementOrder = typeof placement?.order === "number" ? String(placement.order) : "0";
    next.placementVisibleFrom = placement?.visibleFrom ? toDateTimeLocal(String(placement.visibleFrom)) : "";
    next.placementVisibleUntil = placement?.visibleUntil ? toDateTimeLocal(String(placement.visibleUntil)) : "";
  }

  if (entityKey === "posts") {
    next.bodyText = bodyToText(row.body);
    next.itemsText = itemsToText(row.body);
    next.templateBlockOrder = bodyToBlockOrder(row.body);
    const cta = asPlainRecord(row.cta);
    next.ctaLabel = readString(cta.label);
    next.ctaHref = readString(cta.href);
  }

  if (entityKey === "events") {
    const prizePool = asPlainRecord(row.prizePool);
    next.prizePoolDisplay = readString(prizePool.display);
    next.prizePoolPkr = numberToForm(prizePool.pkr);
    next.prizePoolUsd = numberToForm(prizePool.usd);
    next.posterUrl = jsonUrlToForm(row.poster);
    next.galleryUrls = Array.isArray(row.gallery) ? row.gallery.map((item) => jsonUrlToForm(item)).filter(Boolean).join(", ") : "";
  }

  if (entityKey === "players") {
    next.photoUrl = jsonUrlToForm(row.photo);
    next.mainsText = mainsToText(row.mains);
    next.socialsText = linksToText(row.socials);
  }

  if (entityKey === "sponsors") {
    next.logoLightUrl = jsonUrlToForm(row.logoLight);
    next.logoDarkUrl = jsonUrlToForm(row.logoDark);
  }

  if (entityKey === "circuits") {
    const prizePool = asPlainRecord(row.prizePool);
    next.prizePoolDisplay = readString(prizePool.display);
    next.prizePoolPkr = numberToForm(prizePool.pkr);
    next.prizePoolUsd = numberToForm(prizePool.usd);
    next.slotsText = slotsToText(row.slots);
  }

  if (entityKey === "pageContent") {
    next.bodyText = bodyToText(row.body);
    next.itemsText = itemsToText(row.body);
    const cta = asPlainRecord(row.cta);
    next.ctaLabel = readString(cta.label);
    next.ctaHref = readString(cta.href);
  }
}

function filterRows(rows: Row[], filters: { search: string }) {
  const query = filters.search.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query));
}

function toDateTimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function formatPreviewDateRange(start: string | boolean | undefined, end?: string | boolean | undefined) {
  const startText = formatPreviewDate(start);
  const endText = formatPreviewDate(end);
  if (startText && endText && startText !== endText) return `${startText} to ${endText}`;
  return startText || endText || "";
}

function formatPreviewDate(value: string | boolean | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function firstLine(value: string | boolean | undefined) {
  return String(value || "").split(/\r?\n/).map((line) => line.trim()).find(Boolean) || "";
}

function mediaUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  return `${apiBase.replace("/api/v1", "")}${url}`;
}

const inputClass =
  "min-h-11 w-full border border-stone-3 bg-void/65 px-3 py-2 text-sm text-bone outline-none transition-colors placeholder:text-ash hover:border-bone/30 focus:border-neon focus:bg-void";
const fileInputClass =
  "w-full border border-stone-3 bg-void/65 px-3 py-2 text-sm text-bone file:mr-3 file:min-h-9 file:border-0 file:bg-neon file:px-3 file:text-xs file:font-semibold file:text-void hover:border-bone/30";
const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-neon bg-neon px-4 text-sm font-semibold text-void transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-stone-3 bg-void/35 px-3 text-sm font-medium text-bone transition-colors hover:border-neon hover:text-neon disabled:cursor-not-allowed disabled:opacity-50";
const miniButtonClass =
  "inline-flex min-h-9 items-center justify-center gap-1.5 border border-stone-3 bg-void/40 px-3 text-xs font-medium text-bone transition-colors hover:border-neon hover:text-neon disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-stone-3 disabled:hover:text-bone";
const iconButtonClass =
  "grid h-10 w-10 place-items-center border border-stone-3 bg-void/40 text-bone transition-colors hover:border-neon hover:text-neon";
