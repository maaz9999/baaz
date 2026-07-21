"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Max tilt rotation in degrees. */
  max?: number;
  /** How far the card lifts toward the viewer on hover (px). */
  lift?: number;
  /** Hover scale amount. */
  scale?: number;
};

export function Tilt3D({ children, className, max = 8, lift = 16, scale = 1.02 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 300, damping: 30 });
  const springY = useSpring(py, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [0, 1], [max, -max]);
  const rotateY = useTransform(springX, [0, 1], [-max, max]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }
  function onMouseLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  if (reduceMotion) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: 900 }}
      className={cn("h-full", className)}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale, z: lift }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
