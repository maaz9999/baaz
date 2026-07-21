"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { StartggSet } from "@/lib/startgg";
import { FlagImage, getPlayerCountry } from "@/components/FlagImage";

interface BracketTabsProps {
  sets: StartggSet[];
}

function cleanName(name: string): string {
  if (!name) return "";
  const parts = name.split("|");
  return parts[parts.length - 1].trim().toUpperCase();
}

export function BracketTabs({ sets }: BracketTabsProps) {
  const validSets = sets.filter((s) => s?.slots?.some((sl) => sl.entrant));

  // Extract Top 8 Sets using robust phase-name and round filters
  let top8Sets = validSets.filter((set) => {
    const phaseName = set.phaseGroup?.phase?.name?.toLowerCase() || "";
    if (phaseName.includes("top 8")) return true;

    const name = set.fullRoundText?.toLowerCase() || "";
    return (
      name.includes("winners semi") ||
      name.includes("winners final") ||
      name.includes("grand final") ||
      name.includes("losers round 1") ||
      name.includes("losers quarter") ||
      name.includes("losers semi") ||
      name.includes("losers final") ||
      set.round === 1 ||
      set.round === 2 ||
      set.round === 3 ||
      set.round === -3 ||
      set.round === -4 ||
      set.round === -5 ||
      set.round === -6
    );
  });

  // Map to individual match positions
  const wSemis = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("winners semi"));
  const wFinal = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("winners final"));
  const gFinals = top8Sets
    .filter((s) => s.fullRoundText?.toLowerCase().includes("grand final"))
    .sort((a, b) => Number(a.id) - Number(b.id));
  const gf1 = gFinals.find((s) => !s.fullRoundText?.toLowerCase().includes("reset")) || gFinals[0] || null;
  const gf2 = gFinals.find((s) => s.fullRoundText?.toLowerCase().includes("reset")) || (gFinals.length > 1 ? gFinals[1] : null);

  const lRound1 = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("losers round 1"));
  const lQuarters = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("losers quarter"));
  const lSemis = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("losers semi"));
  const lFinal = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("losers final"));

  const renderMatchCard = (set: StartggSet | null, letter: string) => {
    if (!set) {
      return (
        <div className="relative border border-dashed border-stone-3/20 bg-stone/5 p-4 rounded-sm min-w-[280px] h-[100px] flex items-center justify-center">
          <span className="font-mono text-[9px] uppercase tracking-wider text-ash/40">TBD Match {letter}</span>
        </div>
      );
    }

    const isLive = set.state === 2;
    const isCompleted = set.state === 3;
    const slots = set.slots || [];
    const p1Entrant = slots[0]?.entrant;
    const p2Entrant = slots[1]?.entrant;
    const p1 = p1Entrant ? cleanName(p1Entrant.name) : "TBA";
    const p2 = p2Entrant ? cleanName(p2Entrant.name) : "TBA";
    const p1Score = slots[0]?.standing?.stats?.score?.value ?? "-";
    const p2Score = slots[1]?.standing?.stats?.score?.value ?? "-";
    
    const p1Winner = isCompleted && p1Entrant && set.winnerId === p1Entrant.id;
    const p2Winner = isCompleted && p2Entrant && set.winnerId === p2Entrant.id;

    return (
      <div
        className={cn(
          "relative overflow-hidden border p-4 pl-6 rounded-sm transition-all duration-300 shadow-md min-w-[280px]",
          isLive
            ? "border-neon bg-neon/5 shadow-[0_0_12px_rgba(200,255,45,0.08)]"
            : "border-stone-3/15 bg-stone-2/10 hover:border-stone-3/45"
        )}
      >
        {/* Letter Identifier Circle Badge */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-stone-3/60 text-white font-mono text-[9px] font-bold flex items-center justify-center border border-stone-3/80 shadow-md">
          {letter}
        </div>

        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.15em] text-ash/60 mb-2.5">
          <span className="text-white font-bold">Match {set.id}</span>
          {isLive ? (
            <span className="flex items-center gap-1 text-neon font-bold">
              <span className="h-1 w-1 rounded-full bg-neon animate-pulse" />
              LIVE
            </span>
          ) : isCompleted ? (
            <span className="flex items-center gap-0.5 text-ash/80">
              <CheckCircle2 size={8} className="text-neon-dim" />
              DONE
            </span>
          ) : (
            <span>WAITING</span>
          )}
        </div>

        <div className="flex flex-col gap-2 font-mono text-xs">
          <div className="flex justify-between items-center gap-3">
            <span className={cn(
              "truncate max-w-[170px] flex items-center gap-1.5",
              p1Winner ? "text-neon font-bold" : "text-bone"
            )}>
              <FlagImage country={getPlayerCountry(p1)} />
              <span className="truncate">{p1}</span>
            </span>
            <span className={cn(
              "font-mono text-xs font-bold px-2 py-0.5 rounded-sm min-w-[20px] text-center",
              p1Winner ? "text-neon bg-neon/10" : "text-ash bg-void/50"
            )}>
              {p1Score}
            </span>
          </div>
          <div className="flex justify-between items-center gap-3">
            <span className={cn(
              "truncate max-w-[170px] flex items-center gap-1.5",
              p2Winner ? "text-neon font-bold" : "text-bone"
            )}>
              <FlagImage country={getPlayerCountry(p2)} />
              <span className="truncate">{p2}</span>
            </span>
            <span className={cn(
              "font-mono text-xs font-bold px-2 py-0.5 rounded-sm min-w-[20px] text-center",
              p2Winner ? "text-neon bg-neon/10" : "text-ash bg-void/50"
            )}>
              {p2Score}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const winnersColumns = [
    { name: "Winners Semi-Final", matches: [ { set: wSemis[0] || null, letter: "A" }, { set: wSemis[1] || null, letter: "B" } ] },
    { name: "Winners Final", matches: [ { set: wFinal[0] || null, letter: "C" } ] },
    { name: "Grand Final", matches: [ { set: gf1, letter: "D" } ] },
    { name: "Grand Final Reset", matches: [ { set: gf2, letter: "E" } ] },
  ];

  const losersColumns = [
    { name: "Losers Round 1", matches: [ { set: lRound1[0] || null, letter: "F" }, { set: lRound1[1] || null, letter: "G" } ] },
    { name: "Losers Quarter-Final", matches: [ { set: lQuarters[0] || null, letter: "H" }, { set: lQuarters[1] || null, letter: "I" } ] },
    { name: "Losers Semi-Final", matches: [ { set: lSemis[0] || null, letter: "J" } ] },
    { name: "Losers Final", matches: [ { set: lFinal[0] || null, letter: "K" } ] },
  ];

  if (top8Sets.length === 0) {
    return (
      <div className="border border-dashed border-stone-3/60 p-12 text-center rounded-sm font-mono text-[10px] uppercase tracking-wider text-ash">
        No Top 8 bracket data found for this stage yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-stone-3/30 scrollbar-track-transparent">
      {/* ROW 1: WINNERS BRACKET */}
      <div className="flex flex-col gap-4">
        <div className="border-b border-stone-3/30 pb-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-dim font-bold">
            Winners Bracket
          </span>
        </div>
        
        <div className="flex gap-8">
          {winnersColumns.map((col) => {
            // Hide Reset column if not played / not present
            if (col.name === "Grand Final Reset" && !col.matches[0].set) return null;

            return (
              <div key={col.name} className="flex flex-col gap-5 min-w-[280px] shrink-0">
                <div className="bg-stone/60 border border-stone-3/30 px-4 py-2 rounded-sm text-center">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
                    {col.name}
                  </span>
                </div>
                
                <div className="flex flex-col justify-around flex-1 gap-6 min-h-[240px] py-2">
                  {col.matches.map((m) => (
                    <div key={m.letter}>
                      {renderMatchCard(m.set, m.letter)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROW 2: LOSERS BRACKET */}
      <div className="flex flex-col gap-4">
        <div className="border-b border-stone-3/30 pb-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-dim font-bold">
            Losers Bracket
          </span>
        </div>
        
        <div className="flex gap-8">
          {losersColumns.map((col) => (
            <div key={col.name} className="flex flex-col gap-5 min-w-[280px] shrink-0">
              <div className="bg-stone/60 border border-stone-3/30 px-4 py-2 rounded-sm text-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
                  {col.name}
                </span>
              </div>
              
              <div className="flex flex-col justify-around flex-1 gap-6 min-h-[240px] py-2">
                {col.matches.map((m) => (
                  <div key={m.letter}>
                    {renderMatchCard(m.set, m.letter)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
