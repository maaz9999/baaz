"use client";

import { useState } from "react";
import { CharacterPortrait } from "./Top8Table";

type MatchRecord = {
  p1: string;
  p1Char: string;
  p1Score: number;
  p1Winner: boolean;
  p1Country: string;
  p2: string;
  p2Char: string;
  p2Score: number;
  p2Winner: boolean;
  p2Country: string;
};

const MATCH_1_WASEDA: MatchRecord[] = [
  { p1: "Numan Ch", p1Char: "Steve", p1Score: 3, p1Winner: true, p1Country: "PK", p2: "Chanel", p2Char: "Alisa", p2Score: 0, p2Winner: false, p2Country: "KR" },
  { p1: "Hafiz Tanveer", p1Char: "Claudio", p1Score: 3, p1Winner: true, p1Country: "PK", p2: "CBM", p2Char: "Jin", p2Score: 0, p2Winner: false, p2Country: "KR" },
  { p1: "Usama Abbasi", p1Char: "Jun", p1Score: 3, p1Winner: true, p1Country: "PK", p2: "JeonDDing", p2Char: "Eddy", p2Score: 1, p2Winner: false, p2Country: "KR" },
  { p1: "Farzeen", p1Char: "Lidia", p1Score: 3, p1Winner: true, p1Country: "PK", p2: "Mulgold", p2Char: "Claudio", p2Score: 1, p2Winner: false, p2Country: "KR" },
  { p1: "Arslan Ash", p1Char: "Nina", p1Score: 3, p1Winner: true, p1Country: "PK", p2: "Rangchu", p2Char: "Panda", p2Score: 2, p2Winner: false, p2Country: "KR" },
  { p1: "ATIF", p1Char: "Dragunov", p1Score: 2, p1Winner: false, p1Country: "PK", p2: "Ulsan", p2Char: "Dragunov", p2Score: 3, p2Winner: true, p2Country: "KR" },
  { p1: "THE JON", p1Char: "King", p1Score: 2, p1Winner: false, p1Country: "PK", p2: "Knee", p2Char: "Steve", p2Score: 3, p2Winner: true, p2Country: "KR" },
  { p1: "Numan Ch", p1Char: "Steve", p1Score: 3, p1Winner: true, p1Country: "PK", p2: "Ulsan", p2Char: "Dragunov", p2Score: 0, p2Winner: false, p2Country: "KR" },
  { p1: "Usama Abbasi", p1Char: "Jun", p1Score: 2, p1Winner: false, p1Country: "PK", p2: "Knee", p2Char: "Steve", p2Score: 3, p2Winner: true, p2Country: "KR" },
  { p1: "Hafiz Tanveer", p1Char: "Claudio", p1Score: 3, p1Winner: true, p1Country: "PK", p2: "Knee", p2Char: "Steve", p2Score: 1, p2Winner: false, p2Country: "KR" }
];

const MATCH_2_UNLEASHED: MatchRecord[] = [
  { p1: "ATIF", p1Char: "Dragunov", p1Score: 2, p1Winner: true, p1Country: "PK", p2: "Rangchu", p2Char: "Panda", p2Score: 0, p2Winner: false, p2Country: "KR" },
  { p1: "ATIF", p1Char: "Dragunov", p1Score: 2, p1Winner: true, p1Country: "PK", p2: "Mulgold", p2Char: "Claudio", p2Score: 0, p2Winner: false, p2Country: "KR" },
  { p1: "Hafiz Tanveer", p1Char: "Claudio", p1Score: 1, p1Winner: false, p1Country: "PK", p2: "CBM", p2Char: "Jin", p2Score: 2, p2Winner: true, p2Country: "KR" },
  { p1: "Numan Ch", p1Char: "Steve", p1Score: 2, p1Winner: true, p1Country: "PK", p2: "CBM", p2Char: "Jin", p2Score: 1, p2Winner: false, p2Country: "KR" },
  { p1: "Numan Ch", p1Char: "Steve", p1Score: 2, p1Winner: true, p1Country: "PK", p2: "Knee", p2Char: "Steve", p2Score: 0, p2Winner: false, p2Country: "KR" },
  { p1: "Usama Abbasi", p1Char: "Jun", p1Score: 0, p1Winner: false, p1Country: "PK", p2: "LowHigh", p2Char: "Steve", p2Score: 2, p2Winner: true, p2Country: "KR" },
  { p1: "Farzeen", p1Char: "Lidia", p1Score: 2, p1Winner: true, p1Country: "PK", p2: "LowHigh", p2Char: "Steve", p2Score: 1, p2Winner: false, p2Country: "KR" },
  { p1: "Farzeen", p1Char: "Lidia", p1Score: 0, p1Winner: false, p1Country: "PK", p2: "JeonDDing", p2Char: "Eddy", p2Score: 2, p2Winner: true, p2Country: "KR" },
  { p1: "Arslan Ash", p1Char: "Nina", p1Score: 2, p1Winner: true, p1Country: "PK", p2: "JeonDDing", p2Char: "Eddy", p2Score: 1, p2Winner: false, p2Country: "KR" },
  { p1: "Arslan Ash", p1Char: "Nina", p1Score: 0, p1Winner: false, p1Country: "PK", p2: "Ulsan", p2Char: "Dragunov", p2Score: 2, p2Winner: true, p2Country: "KR" },
  { p1: "THE JON", p1Char: "King", p1Score: 2, p1Winner: true, p1Country: "PK", p2: "Ulsan", p2Char: "Dragunov", p2Score: 0, p2Winner: false, p2Country: "KR" },
  { p1: "THE JON", p1Char: "King", p1Score: 2, p1Winner: true, p1Country: "PK", p2: "Knee", p2Char: "Steve", p2Score: 1, p2Winner: false, p2Country: "KR" }
];

function getFlagUrl(code: string) {
  if (!code || code.length !== 2) return "";
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

export function TeamMatchShowcase() {
  const [activeTab, setActiveTab] = useState<"waseda" | "unleashed">("waseda");

  const records = activeTab === "waseda" ? MATCH_1_WASEDA : MATCH_2_UNLEASHED;
  const scorePak = activeTab === "waseda" ? 7 : 13;
  const scoreKor = activeTab === "waseda" ? 3 : 9;
  const formatName = activeTab === "waseda" ? "Waseda Format (Bo13)" : "Unleashed Format (Bo25)";
  const dateStr = activeTab === "waseda" ? "March 15, 2025" : "March 16, 2025";

  return (
    <div className="border border-stone-3/60 bg-stone/20 p-5 md:p-6">
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-stone-3/20 pb-4">
        <button
          onClick={() => setActiveTab("waseda")}
          className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-all cursor-pointer ${
            activeTab === "waseda"
              ? "bg-neon/10 border-neon text-neon font-bold"
              : "border-stone-3/40 bg-stone/20 text-bone/50 hover:border-stone-3/80 hover:text-bone"
          }`}
        >
          Match 1 - Waseda Format
        </button>
        <button
          onClick={() => setActiveTab("unleashed")}
          className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-all cursor-pointer ${
            activeTab === "unleashed"
              ? "bg-neon/10 border-neon text-neon font-bold"
              : "border-stone-3/40 bg-stone/20 text-bone/50 hover:border-stone-3/80 hover:text-bone"
          }`}
        >
          Match 2 - Unleashed Format
        </button>
      </div>

      {/* Header Info */}
      <div className="mb-8 text-center bg-stone/30 p-4 border border-stone-3/30 rounded-[1px]">
        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ash mb-1.5">{formatName}</div>
        <div className="font-mono text-[10px] text-neon mb-4">{dateStr}</div>

        <div className="flex justify-center items-center gap-6 md:gap-10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-bone text-base md:text-xl">Pakistan</span>
            <img
              src={getFlagUrl("PK")}
              alt="Pakistan"
              className="h-3.5 w-5 object-cover border border-stone-3/40 rounded-[1px]"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl md:text-3xl font-extrabold text-neon">{scorePak}</span>
            <span className="text-ash/60 font-mono text-sm">:</span>
            <span className="text-xl md:text-3xl font-extrabold text-bone/70">{scoreKor}</span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={getFlagUrl("KR")}
              alt="South Korea"
              className="h-3.5 w-5 object-cover border border-stone-3/40 rounded-[1px]"
            />
            <span className="font-bold text-bone/80 text-base md:text-xl">South Korea</span>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-2 max-w-3xl mx-auto">
        {records.map((r, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border border-stone-3/40 bg-stone/15 px-4 py-2.5 rounded-[1px] hover:border-stone-3/70 transition-colors"
          >
            {/* Player 1 (Pakistan) */}
            <div className="flex items-center gap-2 md:gap-3.5 w-[42%]">
              {/* PK Flag Box */}
              <div className="flex items-center justify-center p-1 bg-stone/40 border border-stone-3/30 rounded-[1px] shrink-0">
                <img
                  src={getFlagUrl(r.p1Country)}
                  alt={r.p1Country}
                  className="h-2.5 w-4 object-cover border border-stone-3/40 rounded-[1px] shrink-0"
                />
              </div>
              
              {r.p1Char && <CharacterPortrait name={r.p1Char} size="sm" />}
              <span className="font-mono text-xs text-bone truncate font-semibold">{r.p1}</span>
            </div>

            {/* Score Center */}
            <div className="flex items-center gap-2 md:gap-3 justify-center w-[16%] font-mono text-xs select-none">
              <span
                className={`px-1.5 py-0.5 rounded-[1px] text-[9px] font-bold ${
                  r.p1Winner ? "bg-neon/15 text-neon border border-neon/30" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {r.p1Winner ? "W" : "L"}
              </span>
              <span className="font-semibold text-bone">{r.p1Score} - {r.p2Score}</span>
              <span
                className={`px-1.5 py-0.5 rounded-[1px] text-[9px] font-bold ${
                  r.p2Winner ? "bg-neon/15 text-neon border border-neon/30" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {r.p2Winner ? "W" : "L"}
              </span>
            </div>

            {/* Player 2 (Korea) */}
            <div className="flex items-center gap-2 md:gap-3.5 justify-end w-[42%] text-right">
              <span className="font-mono text-xs text-bone/80 truncate font-semibold">{r.p2}</span>
              {r.p2Char && <CharacterPortrait name={r.p2Char} size="sm" />}
              
              {/* KR Flag Box */}
              <div className="flex items-center justify-center p-1 bg-stone/40 border border-stone-3/30 rounded-[1px] shrink-0">
                <img
                  src={getFlagUrl(r.p2Country)}
                  alt={r.p2Country}
                  className="h-2.5 w-4 object-cover border border-stone-3/40 rounded-[1px] shrink-0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
