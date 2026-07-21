import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMediaUrl, type CmsPageContent, type CmsPlacement, type CmsPost } from "@/lib/content";
import { cn } from "@/lib/cn";

type TargetRecord = Record<string, unknown>;

export function CmsPlacementSection({
  placements,
  slotKey,
  title,
  className,
}: {
  placements: CmsPlacement[];
  slotKey: string;
  title?: string;
  className?: string;
}) {
  const items = placements.filter((placement) => placement.slotKey === slotKey);
  if (items.length === 0) return null;
  const wideItems = items.filter(isWidePlacement);
  const cardItems = items.filter((placement) => !isWidePlacement(placement));

  return (
    <section className={cn("mx-auto max-w-[1400px] px-5 py-16 lg:px-10", className)}>
      {title && (
        <div className="mb-8 flex items-center gap-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon slash">{title}</div>
          <div className="h-px flex-1 bg-stone-3/60" />
        </div>
      )}
      <div className="grid gap-5">
        {wideItems.map((placement) => (
          <WidePlacementCard key={placement.id} placement={placement} />
        ))}
        {cardItems.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cardItems.map((placement) => (
              <PlacementCard key={placement.id} placement={placement} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function CmsContentBlocks({
  content,
  sectionKey,
  className,
}: {
  content: CmsPageContent[];
  sectionKey: string;
  className?: string;
}) {
  const items = content.filter((item) => item.sectionKey === sectionKey);
  if (items.length === 0) return null;

  return (
    <section className={cn("mx-auto max-w-[1400px] px-5 py-16 lg:px-10", className)}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="scanline border border-stone-3 bg-stone/40 p-6">
            {item.eyebrow && <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">{item.eyebrow}</div>}
            {item.title && <div className="display mt-3 text-3xl text-bone">{item.title}</div>}
            <BodyText body={item.body} />
            <Cta cta={item.cta} />
          </div>
        ))}
      </div>
    </section>
  );
}

function PlacementCard({ placement }: { placement: CmsPlacement }) {
  const target = (placement.target || {}) as TargetRecord;
  const post = target as CmsPost;
  const title = readString(target.title) || readString(target.name) || readString(target.tag) || placement.title;
  const eyebrow = readString(target.eyebrow) || placement.targetType;
  const excerpt = readString(target.excerpt) || readString(target.tagline) || readString(target.realName) || readString(target.url);
  const cover = post.coverImage ? getMediaUrl(post.coverImage.url) : undefined;
  const href = linkFor(placement.targetType, target);
  const ctaLabel = ctaFor(target)?.label || "Open";

  const body = (
    <article className="scanline group h-full border border-stone-3 bg-stone/50 p-5 transition-colors hover:border-neon">
      {cover && <img src={cover} alt={post.coverImage?.alt || title} className="mb-5 aspect-video w-full border border-stone-3 object-cover" />}
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{eyebrow}</div>
      <div className="display mt-3 text-2xl text-bone group-hover:text-neon">{title}</div>
      {excerpt && <p className="mt-3 text-sm text-ash">{excerpt}</p>}
      {href && (
        <div className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
          {ctaLabel} <ArrowRight size={12} />
        </div>
      )}
    </article>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

function WidePlacementCard({ placement }: { placement: CmsPlacement }) {
  const target = (placement.target || {}) as TargetRecord;
  const post = target as CmsPost;
  const title = readString(target.title) || placement.title;
  const eyebrow = readString(target.eyebrow) || templateLabel(placement, target);
  const excerpt = readString(target.excerpt) || readString(target.tagline);
  const cover = post.coverImage ? getMediaUrl(post.coverImage.url) : undefined;
  const href = linkFor(placement.targetType, target);
  const cta = ctaFor(target);
  const facts = bodyItems(post.body);

  return (
    <article className="scanline overflow-hidden border border-stone-3 bg-stone/45">
      <div className={cn("grid gap-8 p-6 md:p-8 lg:p-10", cover || facts.length > 0 ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]" : "")}>
        <div className="flex min-h-[260px] flex-col justify-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon slash">{eyebrow}</div>
          <h2 className="display mt-4 max-w-4xl text-5xl leading-[0.9] text-bone md:text-7xl">{title}</h2>
          {excerpt && <p className="mt-6 max-w-3xl text-lg leading-8 text-bone/75">{excerpt}</p>}
          <BodyText body={post.body} className="max-w-3xl text-base leading-8 text-ash" />
          {href && (
            <Link href={href} className="mt-8 inline-flex w-fit items-center gap-3 bg-neon px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-void transition-transform hover:-translate-y-0.5">
              {cta?.label || "Open"} <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {(cover || facts.length > 0) && (
          <div className="grid content-center gap-4">
            {cover && <img src={cover} alt={post.coverImage?.alt || title} className="aspect-[16/10] w-full border border-stone-3 object-cover" />}
            {facts.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {facts.slice(0, 4).map((fact, index) => (
                  <div key={`${fact.label}-${index}`} className="border border-stone-3 bg-void/35 p-5">
                    <div className="display text-3xl text-bone">{fact.value || fact.title || fact.label}</div>
                    {(fact.label || fact.body) && (
                      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                        {fact.body || fact.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function BodyText({ body, className }: { body: unknown; className?: string }) {
  if (!body) return null;
  if (typeof body === "string") return <p className={cn("mt-3 text-sm text-ash", className)}>{body}</p>;

  const record = body as { text?: string; blocks?: Array<{ text?: string }> };
  const text = record.text || record.blocks?.map((block) => block.text).filter(Boolean).join(" ");
  return text ? <p className={cn("mt-3 text-sm text-ash", className)}>{text}</p> : null;
}

function Cta({ cta }: { cta: unknown }) {
  const record = (cta || {}) as { href?: string; label?: string };
  if (!record.href || !record.label) return null;

  return (
    <Link href={record.href} className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
      {record.label} <ArrowRight size={12} />
    </Link>
  );
}

function linkFor(targetType: string, target: TargetRecord) {
  const slug = readString(target.slug);
  const cta = ctaFor(target);
  if (targetType === "post" && cta?.href) return cta.href;
  if (!slug) return undefined;
  if (targetType === "event") return `/events/${slug}`;
  if (targetType === "player") return `/players/${slug}`;
  if (targetType === "post") return `/posts/${slug}`;
  return undefined;
}

function readString(value: unknown) {
  return typeof value === "string" && value ? value : "";
}

function ctaFor(target: TargetRecord) {
  const cta = target.cta as { label?: unknown; href?: unknown } | undefined;
  const label = readString(cta?.label);
  const href = readString(cta?.href);
  return label || href ? { label, href } : undefined;
}

function bodyItems(body: unknown) {
  const record = body as { items?: Array<Record<string, unknown>> } | undefined;
  if (!Array.isArray(record?.items)) return [];
  return record.items.map((item) => ({
    label: readString(item.label),
    title: readString(item.title),
    value: readString(item.value),
    body: readString(item.body),
  }));
}

function isWidePlacement(placement: CmsPlacement) {
  const target = (placement.target || {}) as TargetRecord;
  const templateKey = readString(target.templateKey) || placement.variant;
  return ["full-width-feature", "hero-feature", "stats-callout"].includes(templateKey);
}

function templateLabel(placement: CmsPlacement, target: TargetRecord) {
  const key = readString(target.templateKey) || placement.variant || placement.targetType;
  return key.replace(/-/g, " ");
}
