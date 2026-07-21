"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";
import "@/components/ScrollReveal.css";

interface ScrollRevealProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
  as: Component = "div",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const splitText = useMemo(() => {
    let wordCounter = 0;

    function processNode(node: React.ReactNode, extraClass = ""): React.ReactNode {
      if (typeof node === "string" || typeof node === "number") {
        const textStr = String(node);
        return textStr.split(/(\s+)/).map((word) => {
          if (word.match(/^\s+$/)) return word;
          const key = `w-${wordCounter++}`;
          return (
            <span className={cn("scroll-reveal-word inline-block", extraClass)} key={key}>
              {word}
            </span>
          );
        });
      }

      if (Array.isArray(node)) {
        return node.map((child, idx) => (
          <React.Fragment key={idx}>{processNode(child, extraClass)}</React.Fragment>
        ));
      }

      if (React.isValidElement(node)) {
        const element = node as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
        if (typeof element.type === "string") {
          return React.cloneElement(
            element,
            { ...element.props, className: cn(element.props.className, extraClass) },
            processNode(element.props.children)
          );
        }
        const combinedClass = cn(extraClass, element.props.className);
        return processNode(element.props.children, combinedClass);
      }

      return node;
    }

    return processNode(children);
  }, [children]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const ctx = gsap.context(() => {
      // Rotation animation
      if (baseRotation !== 0) {
        gsap.fromTo(
          el,
          { transformOrigin: "0% 50%", rotate: baseRotation },
          {
            ease: "none",
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top bottom",
              end: rotationEnd,
              scrub: true,
            },
          }
        );
      }

      const wordElements = el.querySelectorAll(".scroll-reveal-word");
      if (wordElements.length > 0) {
        // Opacity animation
        gsap.fromTo(
          wordElements,
          { opacity: baseOpacity, willChange: "opacity" },
          {
            ease: "none",
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top bottom-=15%",
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        );

        // Blur animation
        if (enableBlur) {
          gsap.fromTo(
            wordElements,
            { filter: `blur(${blurStrength}px)` },
            {
              ease: "none",
              filter: "blur(0px)",
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                scroller,
                start: "top bottom-=15%",
                end: wordAnimationEnd,
                scrub: true,
              },
            }
          );
        }
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  const Tag = Component as any;

  return (
    <Tag ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <div className={`scroll-reveal-text ${textClassName}`}>{splitText}</div>
    </Tag>
  );
}

export default ScrollReveal;
