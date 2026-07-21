"use client";

import { countryFlag } from "@/lib/format";
import { findPlayerByTag, findSponsorBySlug, getMediaUrl } from "@/lib/content";
import type { Player, Sponsor, TournamentEntry } from "@/lib/types";
import { Medal, Trophy } from "lucide-react";
import { Tilt3D } from "@/components/Tilt3D";

const placementColor: Record<string, string> = {
  "1st": "text-signal",
  "2nd": "text-bone",
  "3rd": "text-blood",
  "4th": "text-bone/80",
};

// Known character assets in the system
const CHARACTER_ASSETS: Record<string, string> = {
  "AKUMA": "/assets/AKUMA.png",
  "ALISA": "/assets/ALISA.png",
  "ANNA": "/assets/ANNA.png",
  "ARMOUR KING": "/assets/ARMOUR KING.png",
  "ASUKA": "/assets/ASUKA.png",
  "AZUCENA": "/assets/AZUCENA.png",
  "BOB": "/assets/BOB.png",
  "BRYAN": "/assets/BRYAN.png",
  "CLAUDIO": "/assets/CLAUDIO.png",
  "CLIVE": "/assets/CLIVE.png",
  "DEVIL JIN": "/assets/DEVIL JIN.png",
  "DRAGUNOV": "/assets/DARGUNOV.png",
  "EDDY": "/assets/EDDY.png",
  "FAHKUMRAM": "/assets/FAHKUMRAM.png",
  "FENG": "/assets/FENG.png",
  "HEIHACHI": "/assets/HEIHACHI.png",
  "HWORANG": "/assets/HWORANG.png",
  "JACK8": "/assets/JACK8.png",
  "JIN": "/assets/JIN.png",
  "JULIA": "/assets/JULIA.png",
  "JUN": "/assets/JUN.png",
  "KAZUMI": "/assets/KAZUMI.png",
  "KAZUYA": "/assets/KAZUYA.png",
  "KING": "/assets/KING.png",
  "KUMA": "/assets/KUMA.png",
  "KUNIMITSU": "/assets/KUNIMITSU.png",
  "LARS": "/assets/LARS.png",
  "LAW": "/assets/LAW.png",
  "LEE": "/assets/LEE.png",
  "LEO": "/assets/LEO.png",
  "LEROY": "/assets/LEROY.png",
  "LIDIA": "/assets/LIDIA.png",
  "LILI": "/assets/LILI.png",
  "NINA": "/assets/NINA.png",
  "PANDA": "/assets/PANDA.png",
  "PAUL": "/assets/PAUL.png",
  "RAVEN": "/assets/RAVEN.png",
  "REINA": "/assets/REINA.png",
  "SHAHEEN": "/assets/SHAHEEN.png",
  "STEVE": "/assets/STEVE.png",
  "VICTOR": "/assets/VICTOR.png",
  "XIAOYU": "/assets/XIAOYU.png",
  "YOSHIMITSU": "/assets/YOSHIMITSU.png",
  "ZAFINA": "/assets/ZAFINA.png"
};

// Component to handle character portrait with graceful fallback to text
export function CharacterPortrait({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const key = name.toUpperCase();
  const assetPath = CHARACTER_ASSETS[key];
  const sizeClasses = size === "md" ? "h-9 w-9 text-[10px]" : "h-8 w-8 text-[9px]";

  if (!assetPath) {
    return <span className="chip py-1 px-2.5 text-[9px] uppercase font-semibold font-mono border border-stone-3/40 bg-stone/20">{name}</span>;
  }

  return (
    <div className={`relative ${sizeClasses} overflow-hidden rounded-[2px] border border-stone-3/80 bg-stone-2/50 shadow-inner group/char shrink-0`} title={name}>
      <img
        src={assetPath}
        alt={name}
        className="w-full h-full object-cover object-center transition-transform group-hover/char:scale-115 filter brightness-[1.05] contrast-[1.05]"
      />
    </div>
  );
}

// Function to fetch flag images from FlagCDN for cross-platform rendering
function getFlagUrl(code: string) {
  if (!code || code.length !== 2) return "";
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

export function Top8Table({ entries, players, sponsors }: { entries: TournamentEntry[]; players?: Player[]; sponsors?: Sponsor[] }) {
  const hasPodium = entries && entries.length >= 3;
  
  const podiumEntries = hasPodium ? entries.slice(0, 3) : [];
  const listEntries = hasPodium ? entries.slice(3) : entries;

  const renderPodiumCard = (entry: TournamentEntry, place: "1st" | "2nd" | "3rd") => {
    const player = players ? findPlayerByTag(entry.player, players) : undefined;
    const teamSlug = entry.team || player?.team;
    const team = teamSlug && sponsors ? findSponsorBySlug(teamSlug, sponsors) : undefined;
    
    const config = {
      "1st": {
        borderColor: "border-yellow-500/40 hover:border-yellow-400",
        bgGradient: "bg-gradient-to-b from-yellow-500/10 via-stone-900/40 to-stone-950/80 backdrop-blur-md",
        glowColor: "shadow-[0_0_30px_rgba(234,179,8,0.2)]",
        badgeBg: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
        avatarBg: "from-yellow-500/20 to-void text-yellow-400",
        avatarSize: "h-[108px] w-[108px]",
        avatarRing: "ring-4 ring-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.25)]",
        nameText: "text-2xl font-bold tracking-tight text-white",
        icon: <Trophy className="h-4.5 w-4.5 text-yellow-400" />,
        heightClass: "h-80 md:h-88",
        orderClass: "order-first md:order-2",
        scale: 1.04
      },
      "2nd": {
        borderColor: "border-stone-400/30 hover:border-stone-300",
        bgGradient: "bg-gradient-to-b from-stone-400/8 via-stone-900/40 to-stone-950/80 backdrop-blur-md",
        glowColor: "shadow-[0_0_25px_rgba(212,212,216,0.12)]",
        badgeBg: "bg-stone-300/10 text-stone-300 border-stone-300/20",
        avatarBg: "from-stone-300/10 to-void text-stone-300",
        avatarSize: "h-[92px] w-[92px]",
        avatarRing: "ring-4 ring-stone-300/20 shadow-[0_0_12px_rgba(212,212,216,0.15)]",
        nameText: "text-xl font-bold tracking-tight text-bone",
        icon: <Medal className="h-4 w-4 text-stone-300" />,
        heightClass: "h-72 md:h-80",
        orderClass: "order-1 md:order-1",
        scale: 1.01
      },
      "3rd": {
        borderColor: "border-orange-600/35 hover:border-orange-500",
        bgGradient: "bg-gradient-to-b from-orange-600/8 via-stone-900/40 to-stone-950/80 backdrop-blur-md",
        glowColor: "shadow-[0_0_25px_rgba(234,88,12,0.12)]",
        badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        avatarBg: "from-orange-500/10 to-void text-orange-400",
        avatarSize: "h-[84px] w-[84px]",
        avatarRing: "ring-4 ring-orange-500/20 shadow-[0_0_12px_rgba(234,88,12,0.15)]",
        nameText: "text-lg font-bold tracking-tight text-bone/90",
        icon: <Medal className="h-4 w-4 text-orange-400" />,
        heightClass: "h-68 md:h-74",
        orderClass: "order-2 md:order-3",
        scale: 1.00
      }
    }[place];

    const initial = entry.player.trim().charAt(0).toUpperCase();

    return (
      <div className={`w-full ${config.orderClass} mt-4 md:mt-0`}>
        <Tilt3D max={4} scale={config.scale}>
          <div className={`bracket-frame card-depth flex flex-col justify-between p-6 border text-bone transition-all duration-300 ${config.borderColor} ${config.bgGradient} ${config.glowColor} ${config.heightClass}`}>
            
            {/* Header / Placement Badge */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] border ${config.badgeBg}`}>
                {config.icon}
                {place}
              </span>
              <div className="flex flex-col items-end gap-0.5 text-right shrink-0">
                {entry.prize && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neon font-semibold">
                    {entry.prize}
                  </span>
                )}
                {entry.points !== undefined && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-bone/60">
                    {entry.points} PTS
                  </span>
                )}
              </div>
            </div>

            {/* Middle: Player Photo or Initial Avatar */}
            <div className="flex flex-col items-center justify-center my-2.5">
              {player && player.photo ? (
                <div className={`relative ${config.avatarSize} overflow-hidden rounded-full border border-stone-3/80 bg-stone-2/50 shrink-0 ${config.avatarRing}`}>
                  <img
                    src={getMediaUrl(player.photo)}
                    alt={entry.player}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ) : (
                <div className={`flex ${config.avatarSize} items-center justify-center rounded-full bg-gradient-to-br border border-stone-3/60 font-display text-2xl font-semibold shadow-inner ${config.avatarBg} ${config.avatarRing}`}>
                  {initial}
                </div>
              )}
            </div>

            {/* Bottom: Player Info */}
            <div className="text-center">
              <div className={`${config.nameText} uppercase group-hover:text-neon transition-colors leading-none`}>
                {entry.player}
              </div>
              {player && player.realName && (
                <div className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-ash">
                  {player.realName}
                </div>
              )}
              <div className="mt-2.5 flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ash">
                {player ? (
                  <img src={getFlagUrl(player.country)} alt={player.country} className="h-3 w-4.5 object-cover border border-stone-3/40 rounded-[1px] shrink-0" />
                ) : (
                  <span>Competitor</span>
                )}
                {team?.name && (
                  <>
                    <span className="text-stone-3">•</span>
                    {team.logoDark && (
                      <img src={team.logoDark} alt={team.name} className="h-3.5 max-w-[20px] object-contain opacity-90 shrink-0" />
                    )}
                    <span className="text-neon/90 font-semibold">{team.name}</span>
                  </>
                )}
              </div>

              {/* Mains Characters as portraits with fallback */}
              {entry.characters && entry.characters.length > 0 && (
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5">
                  {entry.characters.slice(0, 3).map((c) => (
                    <CharacterPortrait key={c} name={c} size="md" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Tilt3D>
      </div>
    );
  };

  const hasPoints = entries.some((e) => e.points !== undefined);

  return (
    <div>
      {hasPodium && (
        <div className="mb-10 flex flex-col md:grid md:grid-cols-3 md:gap-5 md:items-end">
          {renderPodiumCard(podiumEntries[1], "2nd")}
          {renderPodiumCard(podiumEntries[0], "1st")}
          {renderPodiumCard(podiumEntries[2], "3rd")}
        </div>
      )}

      {listEntries.length > 0 && (
        <div className="overflow-hidden border border-stone-3/40 bg-stone/20">
          <div className="grid grid-cols-12 gap-3 border-b border-stone-3/60 bg-stone/50 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-ash">
            <div className={hasPoints ? "col-span-1" : "col-span-2"}>Place</div>
            <div className="col-span-4">Player</div>
            <div className={hasPoints ? "col-span-2" : "col-span-3"}>Team</div>
            <div className="col-span-2">Mains</div>
            <div className={hasPoints ? "col-span-2 text-right" : "col-span-1 text-right"}>Prize</div>
            {hasPoints && <div className="col-span-1 text-right">Points</div>}
          </div>
          {listEntries.map((e, idx) => {
            const player = players ? findPlayerByTag(e.player, players) : undefined;
            const teamSlug = e.team || player?.team;
            const team = teamSlug && sponsors ? findSponsorBySlug(teamSlug, sponsors) : undefined;
            return (
              <div
                key={`${e.player}-${idx}`}
                className="grid grid-cols-12 items-center gap-3 border-b border-stone-3/20 px-5 py-3 transition-colors hover:bg-stone/30 last:border-b-0"
              >
                <div className={`${hasPoints ? "col-span-1" : "col-span-2"} flex items-center gap-1.5 font-mono text-xs ${placementColor[e.placement] ?? "text-bone/60"}`}>
                  <span className="font-semibold">{e.placement}</span>
                </div>
                <div className="col-span-4">
                  <div className="display text-lg leading-none text-bone">{e.player}</div>
                  {player && (
                    <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-ash">
                      <img src={getFlagUrl(player.country)} alt={player.country} className="h-3 w-4.5 object-cover border border-stone-3/40 rounded-[1px]" />
                    </div>
                  )}
                </div>
                <div className={`${hasPoints ? "col-span-2" : "col-span-3"} flex items-center`}>
                  {team?.logoDark ? (
                    <img src={team.logoDark} alt={team.name} className="h-6 max-w-[32px] object-contain opacity-95 shrink-0" />
                  ) : (
                    <span className="text-ash/40 font-mono text-[10px]">—</span>
                  )}
                </div>
                <div className="col-span-2 flex flex-wrap gap-1.5">
                  {e.characters?.slice(0, 3).map((c) => (
                    <CharacterPortrait key={c} name={c} size="sm" />
                  ))}
                </div>
                <div className={`${hasPoints ? "col-span-2" : "col-span-1"} text-right font-mono text-[10px] uppercase tracking-[0.15em] text-neon`}>
                  {e.prize ?? "—"}
                </div>
                {hasPoints && (
                  <div className="col-span-1 text-right font-mono text-[10px] font-bold text-bone">
                    {e.points ?? "—"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
