"use client";

import { countryFlag } from "@/lib/format";

type EntrantProps = {
  name: string;
  country: string;
  team?: string;
};

const TEAM_LOGOS: Record<string, string> = {
  "fate": "/assets/FATE.png",
  "team-falcons": "/assets/FALCONS.png",
  "ashes": "/assets/ASHES.png",
  "cyber-ninjas": "/assets/C7.png",
  "r8": "/assets/R8 ESPORTS.png",
  "drx": "/assets/DRX.png",
  "cloud9": "/assets/Cloud9.png",
  "pathan": "/assets/PATHAN.png",
  "redbull": "/assets/REDBULL.png"
};

const INVITED: EntrantProps[] = [
  { name: "ATIF", country: "PK", team: "team-falcons" },
  { name: "Arslan Ash", country: "PK", team: "redbull" },
  { name: "KNEE", country: "KR", team: "drx" },
  { name: "LowHigh", country: "KR", team: "drx" },
  { name: "KHAN", country: "PK", team: "fate" },
  { name: "YUYU", country: "JP", team: "cloud9" },
  { name: "JoKa", country: "GB", team: "team-falcons" },
  { name: "Hafiz Adeel", country: "PK", team: "r8" },
  { name: "THE JON", country: "PK", team: "ashes" },
  { name: "K-Wiss", country: "GB" },
  { name: "Ahsan Ali", country: "PK", team: "cyber-ninjas" },
  { name: "Devilster", country: "PK" }
];

const DOJO: EntrantProps[] = [
  { name: "Farzeen", country: "PK" },
  { name: "Dawood Sikandar", country: "PK" },
  { name: "Numan Ch", country: "PK", team: "pathan" }
];

const LCQ: EntrantProps[] = [
  { name: "Mohsin Shooter", country: "PK" }
];

function EntrantCard({ name, country, team }: EntrantProps) {
  const flagUrl = `https://flagcdn.com/w40/${country.toLowerCase()}.png`;
  const teamLogo = team ? TEAM_LOGOS[team] : undefined;

  return (
    <div className="flex items-center justify-between border border-stone-3/40 bg-stone/20 px-3 py-2 transition-all duration-200 hover:border-neon/40 hover:bg-stone/30 card-depth">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Flag */}
        <img
          src={flagUrl}
          alt={country}
          className="h-3 w-4.5 object-cover border border-stone-3/40 rounded-[1px] shrink-0"
        />
        
        {/* Name */}
        <span className="font-mono text-xs font-semibold text-bone truncate">{name}</span>
      </div>
      
      {/* Team Logo */}
      {teamLogo && (
        <img
          src={teamLogo}
          alt={team || "team"}
          className="h-4 max-w-[35px] object-contain opacity-85 transition-opacity hover:opacity-100"
        />
      )}
    </div>
  );
}

export function GauntletParticipants() {
  return (
    <div className="space-y-10">
      {/* Invited Group */}
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ash border-b border-stone-3/20 pb-2 mb-4">INVITED PLAYERS</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {INVITED.map((entrant, idx) => (
            <EntrantCard key={`${entrant.name}-${idx}`} {...entrant} />
          ))}
        </div>
      </div>

      {/* Dojo Qualifiers Group */}
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ash border-b border-stone-3/20 pb-2 mb-4">DOJO QUALIFIERS</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {DOJO.map((entrant, idx) => (
            <EntrantCard key={`${entrant.name}-${idx}`} {...entrant} />
          ))}
        </div>
      </div>

      {/* Last Chance Qualifier Group */}
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ash border-b border-stone-3/20 pb-2 mb-4">LAST CHANCE QUALIFIER</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {LCQ.map((entrant, idx) => (
            <EntrantCard key={`${entrant.name}-${idx}`} {...entrant} />
          ))}
        </div>
      </div>
    </div>
  );
}
