"use client";

import { countryFlag } from "@/lib/format";

type MatchPlayer = {
  name: string;
  score: string | number;
  isWinner: boolean;
  country: string;
};

type MatchProps = {
  roundName: string;
  p1: MatchPlayer;
  p2: MatchPlayer;
  status?: string;
};

function FlagImage({ country }: { country: string }) {
  const code = (country || "PK").toUpperCase();
  const flagUrl = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  return (
    <span className="inline-flex items-center shrink-0">
      <img
        src={flagUrl}
        alt={code}
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = "none";
          const sibling = e.currentTarget.nextElementSibling as HTMLElement;
          if (sibling) sibling.style.display = "inline";
        }}
        className="h-2.5 w-3.5 object-cover border border-stone-3/40 rounded-[1px]"
      />
      <span className="hidden font-mono text-[9px] leading-none">{countryFlag(code) || "🇵🇰"}</span>
    </span>
  );
}

function MatchCard({ roundName, p1, p2, status }: MatchProps) {
  return (
    <div className="bracket-frame border border-stone-3/60 bg-stone/40 p-2.5 w-[160px] shrink-0 transition-all hover:border-neon/40 card-depth">
      <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-ash mb-1.5 border-b border-stone-3/20 pb-0.5 flex justify-between">
        <span className="truncate max-w-[100px]">{roundName}</span>
        {status && <span className="text-neon font-semibold text-[6px] shrink-0">{status}</span>}
      </div>
      <div className="space-y-1 font-mono text-[10px]">
        {/* Player 1 */}
        <div className={`flex items-center justify-between px-1.5 py-0.5 ${p1.isWinner ? "bg-neon/5 text-bone font-semibold border-l-2 border-neon" : "text-bone/50"}`}>
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <FlagImage country={p1.country} />
            <span className="truncate max-w-[105px]">{p1.name}</span>
          </div>
          <span className={p1.isWinner ? "text-neon" : ""}>{p1.score}</span>
        </div>
        {/* Player 2 */}
        <div className={`flex items-center justify-between px-1.5 py-0.5 ${p2.isWinner ? "bg-neon/5 text-bone font-semibold border-l-2 border-neon" : "text-bone/50"}`}>
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <FlagImage country={p2.country} />
            <span className="truncate max-w-[105px]">{p2.name}</span>
          </div>
          <span className={p2.isWinner ? "text-neon" : ""}>{p2.score}</span>
        </div>
      </div>
    </div>
  );
}

export function TournamentBracket({ game = "tekken-7", eventSlug }: { game?: string; eventSlug?: string }) {
  const isKof = game === "kof-xv";
  const isT8 = game === "tekken-8";
  const isFF = game === "fatal-fury";
  const isGauntlet = eventSlug === "baaz-gauntlet-2024";
  const isTakedown25 = eventSlug === "takedown-2025-t8";

  // UB Quarterfinals (Only for Gauntlet)
  const ubQuartersT8 = [
    {
      roundName: "UB Quarters",
      p1: { name: "Hafiz Adeel", score: 2, isWinner: false, country: "PK" },
      p2: { name: "Ahsan Ali", score: 3, isWinner: true, country: "PK" },
    },
    {
      roundName: "UB Quarters",
      p1: { name: "ATIF", score: 2, isWinner: false, country: "PK" },
      p2: { name: "JoKa", score: 3, isWinner: true, country: "GB" },
    },
    {
      roundName: "UB Quarters",
      p1: { name: "THE JON", score: 1, isWinner: false, country: "PK" },
      p2: { name: "Arslan Ash", score: 3, isWinner: true, country: "PK" },
    },
    {
      roundName: "UB Quarters",
      p1: { name: "Numan Ch", score: 2, isWinner: false, country: "PK" },
      p2: { name: "Farzeen", score: 3, isWinner: true, country: "PK" },
    }
  ];

  // UB Semifinals
  const ubSemis = isFF ? [
    {
      roundName: "UB Semifinals",
      p1: { name: "Hazz", score: 2, isWinner: true, country: "PK" },
      p2: { name: "Xuni X", score: 0, isWinner: false, country: "PK" },
    },
    {
      roundName: "UB Semifinals",
      p1: { name: "Baberzaki", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Ahmer kyo", score: 2, isWinner: true, country: "PK" },
    }
  ] : isTakedown25 ? [
    {
      roundName: "UB Semifinals",
      p1: { name: "Mohsin Shooter", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Usama Abbasi", score: 2, isWinner: true, country: "PK" },
    },
    {
      roundName: "UB Semifinals",
      p1: { name: "M. Zubair", score: 0, isWinner: false, country: "PK" },
      p2: { name: "THE JON", score: 2, isWinner: true, country: "PK" },
    }
  ] : isGauntlet ? [
    {
      roundName: "UB Semis",
      p1: { name: "Ahsan Ali", score: 1, isWinner: false, country: "PK" },
      p2: { name: "JoKa", score: 3, isWinner: true, country: "GB" },
    },
    {
      roundName: "UB Semis",
      p1: { name: "Arslan Ash", score: 3, isWinner: true, country: "PK" },
      p2: { name: "Farzeen", score: 0, isWinner: false, country: "PK" },
    }
  ] : isKof ? [
    {
      roundName: "UB Semis",
      p1: { name: "Kami jones", score: 2, isWinner: true, country: "PK" },
      p2: { name: "Hazz", score: 0, isWinner: false, country: "PK" },
    },
    {
      roundName: "UB Semis",
      p1: { name: "Xuni X", score: 1, isWinner: false, country: "PK" },
      p2: { name: "Imran Champ", score: 2, isWinner: true, country: "PK" },
    },
  ] : [
    {
      roundName: "UB Semis",
      p1: { name: "ATIF", score: 2, isWinner: true, country: "PK" },
      p2: { name: "Dawood Sikandar", score: 0, isWinner: false, country: "PK" },
    },
    {
      roundName: "UB Semis",
      p1: { name: "Arslan Ash", score: 2, isWinner: true, country: "PK" },
      p2: { name: "Farzeen", score: 0, isWinner: false, country: "PK" },
    },
  ];

  // UB Final
  const ubFinal = isFF ? {
    roundName: "Upper Bracket Final",
    p1: { name: "Hazz", score: 3, isWinner: true, country: "PK" },
    p2: { name: "Ahmer kyo", score: 1, isWinner: false, country: "PK" },
  } : isTakedown25 ? {
    roundName: "Upper Bracket Final",
    p1: { name: "Usama Abbasi", score: 3, isWinner: true, country: "PK" },
    p2: { name: "THE JON", score: 2, isWinner: false, country: "PK" },
  } : isGauntlet ? {
    roundName: "Winners Final",
    p1: { name: "JoKa", score: 3, isWinner: true, country: "GB" },
    p2: { name: "Arslan Ash", score: 0, isWinner: false, country: "PK" },
  } : isKof ? {
    roundName: "Winners Final",
    p1: { name: "Kami jones", score: 3, isWinner: true, country: "PK" },
    p2: { name: "Imran Champ", score: 0, isWinner: false, country: "PK" },
  } : {
    roundName: "Upper Bracket Final",
    p1: { name: "ATIF", score: 2, isWinner: false, country: "PK" },
    p2: { name: "Arslan Ash", score: 3, isWinner: true, country: "PK" },
  };

  // Grand Final
  const grandFinal = isFF ? {
    roundName: "Grand Final",
    p1: { name: "Hazz", score: "1 / 3", isWinner: true, country: "PK" },
    p2: { name: "Baberzaki", score: "3 / 1", isWinner: false, country: "PK" },
    status: "RESET / HAZZ WINS"
  } : isTakedown25 ? {
    roundName: "Grand Final",
    p1: { name: "Usama Abbasi", score: "0 / 3", isWinner: true, country: "PK" },
    p2: { name: "Farzeen", score: "3 / 1", isWinner: false, country: "PK" },
    status: "RESET / USAMA WINS"
  } : isGauntlet ? {
    roundName: "Grand Final",
    p1: { name: "JoKa", score: 3, isWinner: true, country: "GB" },
    p2: { name: "Ahsan Ali", score: 2, isWinner: false, country: "PK" },
    status: "JOKA WINS"
  } : isKof ? {
    roundName: "Grand Final",
    p1: { name: "Kami jones", score: 3, isWinner: true, country: "PK" },
    p2: { name: "Hazz", score: 2, isWinner: false, country: "PK" },
    status: "KAMI JONES WINS"
  } : {
    roundName: "Grand Final",
    p1: { name: "Arslan Ash", score: "2 / 0", isWinner: false, country: "PK" },
    p2: { name: "ATIF", score: "3 / 3", isWinner: true, country: "PK" },
    status: "RESET / ATIF WINS"
  };

  // LB Round 4 / LB Round 1 (T8 / FF)
  const lbR4 = isFF ? [
    {
      roundName: "LB Round 1",
      p1: { name: "Kashif yagami", score: 0, isWinner: false, country: "PK" },
      p2: { name: "VincentBlade", score: 2, isWinner: true, country: "PK" },
    },
    {
      roundName: "LB Round 1",
      p1: { name: "NoMiiAegis", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Awais OP", score: 2, isWinner: true, country: "PK" },
    },
  ] : isTakedown25 ? [
    {
      roundName: "LB Round 1",
      p1: { name: "Hafeez", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Heera Malik", score: 2, isWinner: true, country: "PK" },
    },
    {
      roundName: "LB Round 1",
      p1: { name: "Amar Xr", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Farzeen", score: 2, isWinner: true, country: "PK" },
    },
  ] : isGauntlet ? [
    {
      roundName: "Losers R1",
      p1: { name: "THE JON", score: 3, isWinner: true, country: "PK" },
      p2: { name: "Numan Ch", score: 1, isWinner: false, country: "PK" },
    },
    {
      roundName: "Losers R1",
      p1: { name: "ATIF", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Hafiz Adeel", score: 3, isWinner: true, country: "PK" },
    },
  ] : isKof ? [
    {
      roundName: "Losers R1",
      p1: { name: "FoulTOX", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Muz", score: 2, isWinner: true, country: "PK" },
    },
    {
      roundName: "Losers R1",
      p1: { name: "Geoffrey Mark", score: 0, isWinner: false, country: "PK" },
      p2: { name: "THE JON", score: 2, isWinner: true, country: "PK" },
    },
  ] : [
    {
      roundName: "LB Round 4",
      p1: { name: "ULSAN", score: 0, isWinner: false, country: "KR" },
      p2: { name: "Heera", score: 2, isWinner: true, country: "PK" },
    },
    {
      roundName: "LB Round 4",
      p1: { name: "AK", score: 2, isWinner: true, country: "PH" },
      p2: { name: "Numan Ch", score: 1, isWinner: false, country: "PK" },
    },
  ];

  // LB Quarterfinals / LB Round 2 (T8)
  const lbQuarters = isFF ? [
    {
      roundName: "LB Quarterfinals",
      p1: { name: "Baberzaki", score: 2, isWinner: true, country: "PK" },
      p2: { name: "VincentBlade", score: 1, isWinner: false, country: "PK" },
    },
    {
      roundName: "LB Quarterfinals",
      p1: { name: "Xuni X", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Awais OP", score: 2, isWinner: true, country: "PK" },
    },
  ] : isTakedown25 ? [
    {
      roundName: "LB Quarterfinals",
      p1: { name: "M. Zubair", score: 1, isWinner: false, country: "PK" },
      p2: { name: "Heera Malik", score: 2, isWinner: true, country: "PK" },
    },
    {
      roundName: "LB Quarterfinals",
      p1: { name: "Mohsin Shooter", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Farzeen", score: 2, isWinner: true, country: "PK" },
    },
  ] : isGauntlet ? [
    {
      roundName: "Losers R2",
      p1: { name: "Ahsan Ali", score: 3, isWinner: true, country: "PK" },
      p2: { name: "THE JON", score: 1, isWinner: false, country: "PK" },
    },
    {
      roundName: "Losers R2",
      p1: { name: "Farzeen", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Hafiz Adeel", score: 3, isWinner: true, country: "PK" },
    },
  ] : isKof ? [
    {
      roundName: "Losers R2",
      p1: { name: "Xuni X", score: 2, isWinner: true, country: "PK" },
      p2: { name: "Muz", score: 0, isWinner: false, country: "PK" },
    },
    {
      roundName: "Losers R2",
      p1: { name: "Hazz", score: 2, isWinner: true, country: "PK" },
      p2: { name: "THE JON", score: 1, isWinner: false, country: "PK" },
    },
  ] : [
    {
      roundName: "LB Quarterfinals",
      p1: { name: "Farzeen", score: 0, isWinner: false, country: "PK" },
      p2: { name: "Heera", score: 2, isWinner: true, country: "PK" },
    },
    {
      roundName: "LB Quarterfinals",
      p1: { name: "Dawood Sikandar", score: 2, isWinner: true, country: "PK" },
      p2: { name: "AK", score: 1, isWinner: false, country: "PH" },
    },
  ];

  // LB Semifinal / LB Round 3 (T8)
  const lbSemi = isFF ? {
    roundName: "LB Semifinal",
    p1: { name: "Baberzaki", score: 3, isWinner: true, country: "PK" },
    p2: { name: "Awais OP", score: 1, isWinner: false, country: "PK" },
  } : isTakedown25 ? {
    roundName: "LB Semifinal",
    p1: { name: "Heera Malik", score: 1, isWinner: false, country: "PK" },
    p2: { name: "Farzeen", score: 3, isWinner: true, country: "PK" },
  } : isGauntlet ? {
    roundName: "Losers R3",
    p1: { name: "Ahsan Ali", score: 3, isWinner: true, country: "PK" },
    p2: { name: "Hafiz Adeel", score: 2, isWinner: false, country: "PK" },
  } : isKof ? {
    roundName: "Losers R3",
    p1: { name: "Xuni X", score: 0, isWinner: false, country: "PK" },
    p2: { name: "Hazz", score: 2, isWinner: true, country: "PK" },
  } : {
    roundName: "LB Semifinal",
    p1: { name: "Heera", score: 2, isWinner: true, country: "PK" },
    p2: { name: "Dawood Sikandar", score: 0, isWinner: false, country: "PK" },
  };

  // LB Final
  const lbFinal = isFF ? {
    roundName: "Lower Bracket Final",
    p1: { name: "Ahmer kyo", score: 1, isWinner: false, country: "PK" },
    p2: { name: "Baberzaki", score: 3, isWinner: true, country: "PK" },
  } : isTakedown25 ? {
    roundName: "Lower Bracket Final",
    p1: { name: "THE JON", score: 2, isWinner: false, country: "PK" },
    p2: { name: "Farzeen", score: 3, isWinner: true, country: "PK" },
  } : isGauntlet ? {
    roundName: "Losers Final",
    p1: { name: "Arslan Ash", score: 1, isWinner: false, country: "PK" },
    p2: { name: "Ahsan Ali", score: 3, isWinner: true, country: "PK" },
  } : isKof ? {
    roundName: "Losers Final",
    p1: { name: "Imran Champ", score: 1, isWinner: false, country: "PK" },
    p2: { name: "Hazz", score: 3, isWinner: true, country: "PK" },
  } : {
    roundName: "Lower Bracket Final",
    p1: { name: "ATIF", score: 3, isWinner: true, country: "PK" },
    p2: { name: "Heera", score: 2, isWinner: false, country: "PK" },
  };

  return (
    <div className="border border-stone-3/60 bg-stone/20 p-5 md:p-6">
      {/* Title Header */}
      <div className="mb-6 flex items-center justify-between border-b border-stone-3/30 pb-3">
        <h3 className="display text-xl md:text-2xl text-bone">Finals Bracket</h3>
      </div>

      {/* Unified Bracket Layout */}
      <div className="flex flex-row justify-between gap-1 items-stretch select-none w-full overflow-hidden">
        
        {/* Column 1: LB Round 4 / LB Round 1 (T8 / FF) */}
        <div className="flex flex-col justify-between py-1 w-[160px] shrink-0">
          {/* Winners top half: spacer or UB Quarters for Gauntlet */}
          {isGauntlet ? (
            <div className="flex flex-col gap-2 justify-center min-h-[150px]">
              <div className="text-[8px] font-mono text-neon font-semibold uppercase tracking-widest text-center mb-0.5">UB Quarters</div>
              <MatchCard {...ubQuartersT8[0]} />
              <MatchCard {...ubQuartersT8[1]} />
              <MatchCard {...ubQuartersT8[2]} />
              <MatchCard {...ubQuartersT8[3]} />
            </div>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-[8px] font-mono text-bone/30 tracking-wider uppercase border border-dashed border-stone-3/20">
              Winners (Col 2)
            </div>
          )}
          
          <div className="border-t border-dashed border-stone-3/30 my-4" />
          
          {/* Losers bottom half */}
          <div className="flex flex-col gap-4 justify-center min-h-[150px]">
            <div className="text-[8px] font-mono text-neon font-semibold uppercase tracking-widest text-center mb-0.5">
              {isT8 || isFF ? "LB Round 1" : "LB Round 4"}
            </div>
            <MatchCard {...lbR4[0]} />
            <MatchCard {...lbR4[1]} />
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-between py-1 text-white font-mono text-xs shrink-0 select-none">
          <div className="h-[150px] flex items-center"></div>
          <div className="my-4"></div>
          <div className="min-h-[150px] flex flex-col justify-around text-neon/80 font-bold">
            <span>─►</span>
            <span>─►</span>
          </div>
        </div>

        {/* Column 2: UB Semis & LB Quarters */}
        <div className="flex flex-col justify-between py-1 w-[160px] shrink-0">
          {/* Winners top half */}
          <div className="flex flex-col gap-4 justify-center min-h-[150px]">
            <div className="text-[8px] font-mono text-neon font-semibold uppercase tracking-widest text-center mb-0.5">
              {isTakedown25 || isFF ? "UB Semifinals" : "UB Semis"}
            </div>
            <MatchCard {...ubSemis[0]} />
            <MatchCard {...ubSemis[1]} />
          </div>

          <div className="border-t border-dashed border-stone-3/30 my-4" />

          {/* Losers bottom half */}
          <div className="flex flex-col gap-4 justify-center min-h-[150px]">
            <div className="text-[8px] font-mono text-neon font-semibold uppercase tracking-widest text-center mb-0.5">
              LB Quarters
            </div>
            <MatchCard {...lbQuarters[0]} />
            <MatchCard {...lbQuarters[1]} />
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-between py-1 text-white font-mono text-xs shrink-0 select-none">
          <div className="h-[150px] flex flex-col justify-around text-neon/80 font-bold">
            <span>──►</span>
          </div>
          <div className="my-4"></div>
          <div className="min-h-[150px] flex flex-col justify-around text-neon/80 font-bold">
            <span>──►</span>
          </div>
        </div>

        {/* Column 3: UB connection & LB Semis */}
        <div className="flex flex-col justify-between py-1 w-[160px] shrink-0">
          {/* Winners top half: spacer */}
          <div className="h-[150px] flex items-center justify-center text-[8px] font-mono text-bone/30 tracking-wider uppercase border border-dashed border-stone-3/20">
            UB Final (Col 4)
          </div>

          <div className="border-t border-dashed border-stone-3/30 my-4" />

          {/* Losers bottom half */}
          <div className="flex flex-col justify-center min-h-[150px]">
            <div className="text-[8px] font-mono text-neon font-semibold uppercase tracking-widest text-center mb-1">
              LB Semifinal
            </div>
            <div className="flex h-full items-center justify-center">
              <MatchCard {...lbSemi} />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-between py-1 text-white font-mono text-xs shrink-0 select-none">
          <div className="h-[150px] flex items-center"></div>
          <div className="my-4"></div>
          <div className="min-h-[150px] flex flex-col justify-center text-neon/80 font-bold">
            <span>──►</span>
          </div>
        </div>

        {/* Column 4: UB Finals & LB Finals */}
        <div className="flex flex-col justify-between py-1 w-[160px] shrink-0">
          {/* Winners top half */}
          <div className="flex flex-col justify-center min-h-[150px]">
            <div className="text-[8px] font-mono text-neon font-semibold uppercase tracking-widest text-center mb-1">
              {isGauntlet ? "Winners Final" : "Upper Bracket Final"}
            </div>
            <div className="flex h-full items-center justify-center">
              <MatchCard {...ubFinal} />
            </div>
          </div>

          <div className="border-t border-dashed border-stone-3/30 my-4" />

          {/* Losers bottom half */}
          <div className="flex flex-col justify-center min-h-[150px]">
            <div className="text-[8px] font-mono text-neon font-semibold uppercase tracking-widest text-center mb-1">
              {isGauntlet ? "Losers Final" : "Lower Bracket Final"}
            </div>
            <div className="flex h-full items-center justify-center">
              <MatchCard {...lbFinal} />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-center text-neon/80 font-mono text-xs font-bold shrink-0 select-none py-1">
          <span>──►</span>
        </div>

        {/* Column 5: Grand Finals */}
        <div className="flex flex-col justify-center py-1 w-[160px] shrink-0">
          <div className="text-[8px] font-mono text-neon font-semibold uppercase tracking-widest text-center mb-1">Grand Final</div>
          <div className="flex h-full items-center justify-center">
            <MatchCard {...grandFinal} />
          </div>
        </div>

      </div>
    </div>
  );
}
