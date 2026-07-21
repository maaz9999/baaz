"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { SiteShellSettings } from "@/lib/content";

const fallbackFooterLinks = [
  { href: "/ptl-2026", label: "PTL 2026", accent: true },
  { href: "/enc-2026", label: "ENC 2026", accent: true },
  { href: "/rankings", label: "Rankings" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

const fallbackWatchLinks = [
  { href: "https://twitch.tv/baaz_gg", label: "twitch.tv/baaz_gg", external: true },
  { href: "https://youtube.com/@baazgg", label: "youtube.com/@baazgg", external: true },
];

import BaazLogo from "@/assets/BAAZ WHITE.png";

export function Footer({ settings }: { settings?: SiteShellSettings }) {
  const pathname = usePathname();
  const rawFooterLinks = settings?.footerLinks?.length ? settings.footerLinks : fallbackFooterLinks;
  const footerLinks = rawFooterLinks.filter((link) => link.href !== "/contact" && link.label.toLowerCase() !== "contact");
  const watchLinks = settings?.watchLinks?.length ? settings.watchLinks : fallbackWatchLinks;
  const footerBrandName = settings?.footerBrandName || "BAAZ GG";
  const tagline = settings?.tagline || "Pakistan's home for the FGC";
  const description =
    settings?.description ||
    "We build the stages where Pakistan's fighting-game scene proves itself - from packed local opens to international invitationals.";
  const locationText = settings?.locationText || "BAAZ GG. Lahore, Pakistan.";
  const motto = settings?.motto || "// EAT. SLEEP. COMBO. REPEAT.";
  const partnerEmail = settings?.partnerEmail || "partners@baaz.gg";

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-16 border-t border-stone-3/60 bg-stone/40 shadow-[0_-20px_40px_-30px_rgba(0,0,0,0.7)]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-16 w-16 overflow-hidden">
                <img src={BaazLogo.src} alt="BAAZ" className="h-full w-auto object-contain brightness-150" />
              </div>
              <div>
                <div className="display text-3xl text-white">{footerBrandName}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{tagline}</div>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm text-ash">{description}</p>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Explore</div>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className={cn(link.accent ? "text-neon hover:underline" : "hover:text-neon")}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Watch live</div>
            <ul className="mt-4 space-y-2 text-sm">
              {watchLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <a href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener" : undefined} className="hover:text-neon">
                    {link.label} {link.external ? "->" : ""}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Partner</div>
            <a href={`mailto:${partnerEmail}`} className="mt-2 inline-block text-sm hover:text-neon">
              {partnerEmail}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-stone-3/40 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ash md:flex-row">
          <div>&copy; {new Date().getFullYear()} {locationText}</div>
          <div>{motto}</div>
        </div>
      </div>
    </footer>
  );
}
