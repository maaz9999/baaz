"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides, type HeroAccent, type HeroSlide } from "@/lib/heroSlides";
import encImg from "@/assets/ENC.png";
import ptlImg from "@/assets/PTL STAGE 4.png";
import takedownImg from "@/assets/TAKEDOWN.jpg";
import { cn } from "@/lib/cn";
import { Tilt3D } from "@/components/Tilt3D";

const SLIDE_MS = 6000;

const bannerImages: Record<string, typeof encImg> = {
  "enc-2026": encImg,
  "ptl-stage": ptlImg,
  "takedown-2026": takedownImg,
};

const accentBg: Record<HeroAccent, string> = {
  neon: "bg-neon",
  signal: "bg-signal",
  blood: "bg-blood",
};

export function Hero({ slides }: { slides?: HeroSlide[] }) {
  const activeSlides = slides?.length ? slides : heroSlides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = activeSlides[active] || activeSlides[0] || heroSlides[0];
  const slideImageKey = slide.imageKey || slide.id;
  const staticImage = bannerImages[slideImageKey] || bannerImages[slide.id] || bannerImages[heroSlides[0].id];

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const goTo = useCallback((i: number) => {
    const slideCount = activeSlides.length || 1;
    setActive(((i % slideCount) + slideCount) % slideCount);
  }, [activeSlides.length]);

  useEffect(() => {
    if (active >= activeSlides.length) setActive(0);
  }, [active, activeSlides.length]);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => goTo(active + 1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, paused, goTo]);

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-stone-3/60 bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        style={{ y: parallaxY, scale: parallaxScale }}
        className="relative aspect-[2172/724] w-full overflow-hidden"
      >
        <Tilt3D max={5} className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute inset-0"
            >
              <Link href={slide.cta.href} aria-label={slide.eyebrow} className="relative block h-full w-full">
                {slide.imageUrl ? (
                  <img src={slide.imageUrl} alt={slide.eyebrow} className="h-full w-full object-contain" />
                ) : (
                  <Image
                    src={staticImage}
                    alt={slide.eyebrow}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={active === 0}
                  />
                )}
              </Link>
            </motion.div>
          </AnimatePresence>
        </Tilt3D>

        {/* Prev / next arrows */}
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-10 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center border border-bone/20 bg-void/50 text-bone/80 backdrop-blur-sm transition-colors hover:border-neon hover:text-neon sm:left-4"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-10 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center border border-bone/20 bg-void/50 text-bone/80 backdrop-blur-sm transition-colors hover:border-neon hover:text-neon sm:right-4"
        >
          <ChevronRight size={18} />
        </button>
      </motion.div>

      {/* Slide navigation */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-5 lg:px-10">
        {activeSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            className="group flex flex-col gap-2"
            aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
            aria-current={i === active}
          >
            <span className="h-[2px] w-16 overflow-hidden bg-stone-3/60 md:w-24">
              {i === active && (
                <motion.span
                  key={`${s.id}-${active}-${paused}`}
                  className={cn("block h-full", accentBg[s.accent])}
                  initial={{ width: "0%" }}
                  animate={{ width: paused ? undefined : "100%" }}
                  transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                />
              )}
            </span>
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.2em] transition-colors",
                i === active ? "text-bone" : "text-ash group-hover:text-bone/80"
              )}
            >
              0{i + 1}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
