import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getMediaUrl, getPostBySlug } from "@/lib/content";

type BodyBlock = { type?: string; text?: string };
type BodyShape = { text?: string; blocks?: BodyBlock[] };
type CtaShape = { label?: string; href?: string };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post ? `${post.title} - BAAZ GG` : "Post - BAAZ GG" };
}

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const cover = getMediaUrl(post.coverImage?.url);
  const body = bodyBlocks(post.body);
  const cta = ctaFromPost(post.cta);

  return (
    <>
      <section className="relative border-b border-stone-3/60">
        <div className="light-leak absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash hover:text-neon">
            <ArrowLeft size={14} /> Back to site
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,520px)]">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon slash">
                {post.eyebrow || post.templateKey.replace(/-/g, " ")}
              </div>
              <h1 className="display mt-4 text-6xl leading-[0.9] text-bone md:text-8xl lg:text-9xl">
                {post.title}
              </h1>
              {post.excerpt && <p className="mt-6 max-w-3xl text-lg leading-8 text-bone/80">{post.excerpt}</p>}
              {cta && (
                <Link href={cta.href} className="mt-8 inline-flex items-center gap-3 bg-neon px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-void transition-transform hover:-translate-y-0.5">
                  {cta.label} <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {cover && (
              <div className="bracket-frame h-fit overflow-hidden border border-stone-3/60 bg-stone/40 p-2">
                <img src={cover} alt={post.coverImage?.alt || post.title} className="aspect-[4/3] w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {body.length > 0 && (
        <section className="mx-auto max-w-4xl px-5 py-20 lg:px-10">
          <div className="space-y-6 text-lg leading-9 text-bone/75">
            {body.map((block, index) => (
              <p key={`${block}-${index}`}>{block}</p>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function bodyBlocks(body: unknown) {
  if (!body) return [];
  if (typeof body === "string") return [body];

  const record = body as BodyShape;
  if (record.text) return [record.text];
  if (!Array.isArray(record.blocks)) return [];

  return record.blocks
    .map((block) => (typeof block.text === "string" ? block.text.trim() : ""))
    .filter(Boolean);
}

function ctaFromPost(cta: unknown) {
  const record = cta as CtaShape | undefined;
  if (!record?.href) return undefined;
  return { href: record.href, label: record.label || "Open" };
}
