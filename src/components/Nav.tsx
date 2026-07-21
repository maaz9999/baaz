"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SiteShellSettings } from "@/lib/content";

const links = [
  { href: "/ptl-2026", label: "PTL 2026", accent: true },
  { href: "/enc-2026", label: "ENC 2026", accent: true },
  { href: "/rankings", label: "Rankings" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
];

import BaazLogo from "@/assets/BAAZ WHITE.png";

export function Nav({ settings }: { settings?: SiteShellSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rawNavLinks = settings?.navLinks?.length ? settings.navLinks : links;
  const navLinks = rawNavLinks.filter((link) => link.href !== "/contact" && link.label.toLowerCase() !== "contact");
  const brandName = settings?.brandName || "BAAZ";

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-3/60 bg-void/80 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-center h-10 w-10 overflow-hidden scale-135">
            <img src={BaazLogo.src} alt="BAAZ" className="h-full w-auto object-contain brightness-150" />
          </div>
          <span className="display text-3xl tracking-tight text-white">{brandName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:text-neon",
                  isActive ? "text-neon" : "text-bone/80",
                  isActive && "after:absolute after:inset-x-3 after:-bottom-[1px] after:h-[2px] after:bg-neon"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden text-bone"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-3/60 bg-void md:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col px-5 py-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "border-b border-stone-3/30 py-3 font-mono text-xs uppercase tracking-[0.18em]",
                    isActive ? "text-neon" : "text-bone/80"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
