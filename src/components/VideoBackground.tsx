"use client";

import { useEffect, useRef } from "react";

export function VideoBackground({ src, opacity = 40 }: { src: string; opacity?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was blocked — silently ignore
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[-20%_top]"
      style={{ opacity: opacity / 100 }}
    >
      <source
        src={src}
        type="video/mp4"
      />
    </video>
  );
}
