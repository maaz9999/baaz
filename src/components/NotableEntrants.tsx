"use client";

import { CharacterPortrait } from "./Top8Table";

type EntrantProps = {
  name: string;
  country: string;
  team?: string;
  character?: string;
  characters?: string[];
};

// Map team slug to asset path
const TEAM_LOGOS: Record<string, string> = {
  "twisted-minds": "/assets/TWISTED MINDS.png",
  "fate": "/assets/FATE.png",
  "team-falcons": "/assets/FALCONS.png",
  "big": "/assets/BIG.png",
  "playbook": "/assets/PBE.png",
  "freecs": "/assets/FREECS.png",
  "m5host": "/assets/M5 HOST.png",
  "ashes": "/assets/ASHES.png",
  "cyber-ninjas": "/assets/CYBER NINJAS.png",
  "al-qadsiah": "/assets/QADSIAH.png",
  "alliance": "/assets/Alliance.png",
  "ag": "/assets/AG.png",
  "vicious": "/assets/VICIOUS.png",
  "drx": "/assets/DRX.png",
  "venary": "/assets/VENARY.png"
};

const NOTABLE_ENTRANTS: EntrantProps[] = [
  { name: "Arslan Ash", country: "PK", team: "twisted-minds", characters: ["Nina", "Anna"] },
  { name: "ATIF", country: "PK", team: "team-falcons", characters: ["Dragunov", "Anna"] },
  { name: "Farzeen", country: "PK", team: "team-falcons", characters: ["Lidia", "Victor"] },
  { name: "Tibetano", country: "ES", team: "alliance", characters: ["Asuka"] },
  { name: "Usama Abbasi", country: "PK", team: "roc", characters: ["Eddy", "Asuka"] },
  { name: "Book", country: "TH", characters: ["Jin"] },
  { name: "Hafiz Tanveer", country: "PK", team: "twisted-minds", characters: ["Claudio", "Nina"] },
  { name: "Bilal", country: "PK", characters: ["Bryan"] },
  { name: "Dawood Sikandar", country: "PK", team: "m5host", characters: ["Alisa"] },
  { name: "M. Zubair", country: "PK", team: "ag", characters: ["Paul", "Dragunov"] },
  { name: "THE JON", country: "PK", team: "al-qadsiah", characters: ["King"] },
  { name: "Numan Ch", country: "PK", team: "team-falcons", characters: ["Steve", "Paul"] },
  { name: "Esharib", country: "PK", characters: ["Alisa"] },
  { name: "Ahsan Ali", country: "PK", team: "cyber-ninjas", characters: ["Shaheen", "King"] },
  { name: "Mohsin Shooter", country: "PK", characters: ["Nina", "Clive"] },
  { name: "Qasim Meer", country: "PK", team: "vicious", characters: ["Asuka", "Zafina"] },
  { name: "KHAN", country: "PK", team: "drx", characters: ["Leroy", "Feng"] },
  { name: "Heera Malik", country: "PK", characters: ["Steve"] },
  { name: "Kashi Snake", country: "PK", characters: ["Jack8", "Yoshimitsu"] },
  { name: "Malik Ash", country: "PK", team: "venary", characters: ["Leo"] },
  { name: "Hafiz Adeel", country: "PK", team: "m5host", characters: ["Lars", "Nina"] },
  { name: "Sajawal", country: "PK", characters: ["Yoshimitsu"] },
  { name: "Hammad", country: "PK", characters: ["Bryan"] },
  { name: "Awais Honey", country: "PK", characters: ["Heihachi"] },
  { name: "Hassan Naruto", country: "PK", characters: ["Dragunov", "Feng"] },
  { name: "Irtaxa", country: "PK", characters: ["Jun"] },
  { name: "Abid Rajpoot", country: "PK", characters: ["Reina"] },
  { name: "Awais Liaqat", country: "PK", characters: ["Shaheen"] },
  { name: "Asad mughal", country: "PK", characters: ["Panda"] },
  { name: "Ramzan", country: "PK", characters: ["Victor", "Zafina"] },
  { name: "Amar Xr", country: "PK", characters: ["King"] },
  { name: "Shehram", country: "PK", characters: ["Zafina"] },
  { name: "Nobita", country: "PK", characters: ["Leo"] },
  { name: "Usman Baloch", country: "PK", characters: ["Claudio", "Law", "Paul"] },
  { name: "Zulfi", country: "PK", team: "ashes", characters: ["Claudio"] },
  { name: "Devilster", country: "PK", characters: ["Jin"] }
];

const KOF_NOTABLE_ENTRANTS: EntrantProps[] = [
  { name: "Kami jones", country: "PK", team: "ashes" },
  { name: "Awais Honey", country: "PK", team: "cyber-ninjas" },
  { name: "THE JON", country: "PK" },
  { name: "Hazz", country: "PK" },
  { name: "Imran champ", country: "PK" },
  { name: "FoulTOX", country: "PK" },
  { name: "Xuni X", country: "PK" },
  { name: "Muz", country: "PK" },
  { name: "Awais op", country: "PK" },
  { name: "DepthOfGnosis", country: "PK" },
  { name: "Sami9", country: "PK" },
  { name: "Mohsin Pak FGC", country: "PK" }
];

function EntrantCard({ name, country, team, character, characters }: EntrantProps) {
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
        
        {/* Character Portraits */}
        {characters && characters.length > 0 ? (
          <div className="flex items-center gap-1 shrink-0">
            {characters.map((c) => (
              <CharacterPortrait key={c} name={c} size="sm" />
            ))}
          </div>
        ) : character ? (
          <CharacterPortrait name={character} size="sm" />
        ) : null}
        
        {/* Name */}
        <span className="font-mono text-xs font-semibold text-bone truncate">{name}</span>
      </div>
      
      {/* Team Logo */}
      {teamLogo && (
        <img
          src={teamLogo}
          alt={team || "team"}
          className="h-4 max-w-[35px] object-contain opacity-80 transition-opacity hover:opacity-100"
        />
      )}
    </div>
  );
}

const FATAL_FURY_NOTABLE_ENTRANTS: EntrantProps[] = [
  { name: "Farzeen", country: "PK", team: "team-falcons" },
  { name: "THE JON", country: "PK", team: "al-qadsiah" },
  { name: "Usama Abbasi", country: "PK", team: "roc" },
  { name: "Heera Malik", country: "PK", team: "ashes" },
  { name: "Dawood Sikandar", country: "PK", team: "m5host" },
  { name: "M. Zubair", country: "PK" },
  { name: "Mohsin Shooter", country: "PK" },
  { name: "Hafeez", country: "PK" },
  { name: "Amar Xr", country: "PK" }
];

export function NotableEntrants({ game = "tekken-7" }: { game?: string }) {
  const entrants =
    game === "kof-xv"
      ? KOF_NOTABLE_ENTRANTS
      : game === "fatal-fury"
      ? FATAL_FURY_NOTABLE_ENTRANTS
      : NOTABLE_ENTRANTS;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {entrants.map((entrant, idx) => (
        <EntrantCard key={`${entrant.name}-${idx}`} {...entrant} />
      ))}
    </div>
  );
}
