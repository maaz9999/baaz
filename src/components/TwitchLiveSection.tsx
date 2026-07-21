"use client";

import { useState, useEffect } from "react";
import { Twitch, Radio, AlertCircle, Play, Calendar } from "lucide-react";

export function TwitchLiveSection() {
  const [isLive, setIsLive] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full aspect-video bg-stone/20 border border-stone-3/60 rounded-md animate-pulse flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-widest text-ash">Loading Broadcast Panel...</span>
      </div>
    );
  }

  return (
    <div className="relative border border-stone-3/60 bg-stone/30 rounded-md p-6 overflow-hidden card-depth">
      {/* Light leakage background */}
      <div className="absolute inset-0 bg-radial-gradient(circle_at_bottom_right,rgba(200,255,45,0.03)_0%,transparent_70%) pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-3/40 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-stone-3/30 border border-stone-3/60">
            <Twitch size={16} className={isLive ? "text-neon" : "text-ash"} />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">Official Broadcast Channel</span>
            <h3 className="font-display text-xl uppercase tracking-wider text-white">twitch.tv/baaz_gg</h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span className={`relative flex h-2.5 w-2.5`}>
              {isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blood opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? "bg-blood" : "bg-ash/50"}`}></span>
            </span>
            <span className={`font-mono text-xs uppercase tracking-wider ${isLive ? "text-blood font-bold" : "text-ash"}`}>
              {isLive ? "Live Now" : "Offline"}
            </span>
          </div>

          {/* Dev/Demo mode switcher */}
          <button
            onClick={() => setIsLive((l) => !l)}
            className="flex items-center gap-1.5 border border-stone-3/40 bg-stone-2/30 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-ash/80 rounded-sm hover:border-neon hover:text-neon transition-all"
            title="Toggle Live Status for Demo"
          >
            <Radio size={10} />
            <span>Simulate {isLive ? "Offline" : "Live"}</span>
          </button>
        </div>
      </div>

      {/* Body Content */}
      {isLive ? (
        <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-stone-3/60 bg-void shadow-2xl">
          {/* Embed Stream Player */}
          <iframe
            src="https://player.twitch.tv/?channel=baaz_gg&parent=localhost&parent=baaz.gg&autoplay=false&muted=true"
            height="100%"
            width="100%"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          ></iframe>
        </div>
      ) : (
        <div className="scanline relative flex flex-col items-center justify-center py-16 px-6 text-center border border-stone-3/30 bg-stone-2/10 rounded-sm min-h-[300px]">
          <AlertCircle size={40} className="text-ash/60 mb-4" />
          <h4 className="font-display text-lg uppercase tracking-wider text-white mb-2">Stream is currently offline</h4>
          <p className="text-sm text-ash max-w-md mb-6">
            We are not hosting any live broadcasts at this moment. Follow our Twitch channel to get notified instantly when we go live with the next tournament stage!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://twitch.tv/baaz_gg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-neon text-void px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] font-bold rounded-sm hover:scale-102 hover:shadow-[0_0_15px_rgba(200,255,45,0.25)] transition-all duration-300"
            >
              <Twitch size={14} />
              <span>Follow on Twitch</span>
            </a>
            
            <div className="flex items-center gap-2 border border-stone-3/45 bg-stone-3/10 px-4 py-3 rounded-sm font-mono text-[10px] text-ash uppercase tracking-wider">
              <Calendar size={14} className="text-neon" />
              <span>Next Event: Takedown 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
