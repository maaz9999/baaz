import Link from "next/link";
import { countryFlag } from "@/lib/format";
import { findSponsorBySlug, getMediaUrl } from "@/lib/content";
import type { Player, Sponsor } from "@/lib/types";
import { Tilt3D } from "@/components/Tilt3D";

// Player Photos
import ArslanPhoto from "@/assets/ARSLAN.png";
import AtifPhoto from "@/assets/ATIF.png";
import FarzeenPhoto from "@/assets/FARZEEN.png";
import JonPhoto from "@/assets/JON.png";
import NumanPhoto from "@/assets/NUMAN.png";
import KneePhoto from "@/assets/KNEE.png";
import DawoodPhoto from "@/assets/DAWOOD.png";
import AkPhoto from "@/assets/AK.png";
import UsamaPhoto from "@/assets/USAMA.png";
import ShehramPhoto from "@/assets/SHEHRAM.png";
import EsharibPhoto from "@/assets/ESHARIB.png";

// Country Flags
import PakFlag from "@/assets/PAK.png";
import KorFlag from "@/assets/KOR.png";
import PhilFlag from "@/assets/PHILIPINES.png";
import UsaFlag from "@/assets/USA.png";
import JpFlag from "@/assets/JAPAN.png";

// Sponsor Logos
import TwistedMindsLogo from "@/assets/TWISTED MINDS.png";
import FalconsLogo from "@/assets/FALCONS.png";
import DrxLogo from "@/assets/DRX.png";
import QadsiahLogo from "@/assets/QADSIAH.png";
import RedbullLogo from "@/assets/REDBULL.png";
import OrchidLogo from "@/assets/ORCHID.png";

// Character Images
import BryanChar from "@/assets/BRYAN.png";
import DragunovChar from "@/assets/DARGUNOV.png";
import VictorChar from "@/assets/VICTOR.png";
import LidiaChar from "@/assets/LIDIA.png";
import KingChar from "@/assets/KING.png";
import ArmourKingChar from "@/assets/ARMOUR KING.png";
import AlisaChar from "@/assets/ALISA.png";
import ShaheenChar from "@/assets/SHAHEEN.png";
import NinaChar from "@/assets/NINA.png";
import SteveChar from "@/assets/STEVE.png";
import FengChar from "@/assets/FENG.png";
import KumaChar from "@/assets/KUMA.png";
import KunimitsuChar from "@/assets/KUNIMITSU.png";
import ZafinaChar from "@/assets/ZAFINA.png";

const playerImageMap: Record<string, any> = {
  "arslan-ash": ArslanPhoto.src,
  "atif": AtifPhoto.src,
  "farzeen": FarzeenPhoto.src,
  "the-jon": JonPhoto.src,
  "numan-ch": NumanPhoto.src,
  "knee": KneePhoto.src,
  "dawood-sikandar": DawoodPhoto.src,
  "ak": AkPhoto.src,
  "usama-abbasi": UsamaPhoto.src,
  "shehram": ShehramPhoto.src,
  "esharib": EsharibPhoto.src,
};

const flagMap: Record<string, string> = {
  PK: PakFlag.src,
  KR: KorFlag.src,
  PH: PhilFlag.src,
  US: UsaFlag.src,
  JP: JpFlag.src,
};

const sponsorLogoMap: Record<string, string> = {
  "twisted-minds": TwistedMindsLogo.src,
  "team-falcons": FalconsLogo.src,
  "drx": DrxLogo.src,
  "al-qadsiah": QadsiahLogo.src,
  "redbull": RedbullLogo.src,
  "orchid": OrchidLogo.src,
};

const charMap: Record<string, string> = {
  bryan: BryanChar.src,
  dragunov: DragunovChar.src,
  dragnov: DragunovChar.src,
  dargunov: DragunovChar.src,
  victor: VictorChar.src,
  lidia: LidiaChar.src,
  king: KingChar.src,
  "armour king": ArmourKingChar.src,
  alisa: AlisaChar.src,
  shaheen: ShaheenChar.src,
  zafina: ZafinaChar.src,
  kunimitsu: KunimitsuChar.src,
  nina: NinaChar.src,
  steve: SteveChar.src,
  feng: FengChar.src,
  kuma: KumaChar.src,
};

export function PlayerCard({ player, sponsors }: { player: Player; sponsors?: Sponsor[] }) {
  const teamId = player.slug === "numan-ch" ? "team-falcons" : player.team;
  const team = teamId ? findSponsorBySlug(teamId, sponsors) : undefined;
  const photo = getMediaUrl(player.photo);

  const localPhoto = playerImageMap[player.slug];
  const displayPhoto = localPhoto || photo;

  const flagImg = flagMap[player.country];

  // Resolve Sponsor Logos (multi-sponsor support)
  const getPlayerSponsorLogos = (slug: string, primaryTeam?: string) => {
    const logos: string[] = [];
    if (slug === "arslan-ash") {
      if (sponsorLogoMap["twisted-minds"]) logos.push(sponsorLogoMap["twisted-minds"]);
      if (sponsorLogoMap["redbull"]) logos.push(sponsorLogoMap["redbull"]);
    } else if (slug === "dawood-sikandar" || slug === "dawood") {
      if (sponsorLogoMap["orchid"]) logos.push(sponsorLogoMap["orchid"]);
    } else if (primaryTeam && sponsorLogoMap[primaryTeam]) {
      logos.push(sponsorLogoMap[primaryTeam]);
    }
    return logos;
  };

  const sponsorLogos = getPlayerSponsorLogos(player.slug, teamId);

  // Characters logic
  const getPlayerCharacters = (slug: string, mains?: Player["mains"]) => {
    const normSlug = slug.toLowerCase();
    if (normSlug === "atif") return ["bryan", "dragunov"];
    if (normSlug === "farzeen") return ["victor", "lidia"];
    if (normSlug === "the-jon" || normSlug === "jon") return ["king", "armour king"];
    if (normSlug === "dawood-sikandar" || normSlug === "dawood") return ["alisa", "kuma"];
    if (normSlug === "knee") return ["bryan"];
    if (normSlug === "ak") return ["shaheen"];
    if (normSlug === "numan-ch" || normSlug === "numan") return ["steve"];

    if (!mains) return [];
    const allChars = [...new Set(Object.values(mains).flat())].map((c) => c.toLowerCase());
    return allChars.filter((c) => charMap[c] !== undefined);
  };

  const characterKeys = getPlayerCharacters(player.slug, player.mains);

  return (
    <Tilt3D max={9}>
    <Link
      href={`/players/${player.slug}`}
      className="card-depth group block h-full scanline border border-neon bg-stone/40 p-5 transition-all"
    >
      <div className="flex items-center justify-between min-h-[24px]">
        <div>
          {flagImg ? (
            <img src={flagImg} alt={player.country} className="h-4 w-auto object-contain border border-stone-3/30" />
          ) : (
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
              {countryFlag(player.country)} {player.country}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {sponsorLogos.map((logo, idx) => (
            <img key={idx} src={logo} alt="Sponsor" className="h-5 w-auto object-contain brightness-95 group-hover:brightness-110 transition-all" />
          ))}
          {sponsorLogos.length === 0 && team && (
            <div className="text-right font-mono text-[9px] uppercase tracking-[0.2em] text-bone/60 group-hover:text-neon">
              {team.name}
            </div>
          )}
        </div>
      </div>

      <div 
        className="mt-4 flex h-44 items-center justify-center overflow-hidden relative border border-stone-3/40 rounded-sm transition-all duration-300 group-hover:border-neon/30"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(200, 255, 45, 0.22) 0%, rgba(22, 25, 15, 0.98) 100%)"
        }}
      >
        {/* Dynamic Hover Glow Layer */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 40%, rgba(200, 255, 45, 0.35) 0%, rgba(22, 25, 15, 0.98) 100%)"
          }}
        />
        {/* Beautiful cyberpunk grid background */}
        <div 
          className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,var(--color-stone-3)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-stone-3)_1px,transparent_1px)] bg-[size:14px_24px]" 
        />
        {displayPhoto ? (
          <img 
            src={displayPhoto} 
            alt={player.tag} 
            className={`h-full w-auto object-contain object-bottom transition-transform duration-300 scale-110 group-hover:scale-115 relative z-10 ${
              player.slug === "dawood-sikandar" ? "translate-x-[-14px]" : 
              player.slug === "usama-abbasi" ? "translate-x-[18px]" : ""
            }`} 
          />
        ) : (
          <div className="display text-4xl text-bone/50 group-hover:text-neon relative z-10">
            {player.tag.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="display text-2xl leading-none text-bone group-hover:text-neon">
          {player.tag}
        </div>
        {player.realName && (
          <div className="mt-1 text-xs text-ash">{player.realName}</div>
        )}
        
        {characterKeys.length > 0 && (
          <div className="mt-3 flex gap-2">
            {characterKeys.map((char, index) => {
              const charImg = charMap[char];
              if (!charImg) return null;
              return (
                <div
                  key={`${char}-${index}`}
                  className="group/char relative h-12 w-12 overflow-hidden border border-stone-3 bg-stone-2/40 hover:border-neon transition-colors rounded-sm"
                  title={char.toUpperCase()}
                >
                  <img
                    src={charImg}
                    alt={char}
                    className="h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover/char:scale-110"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {characterKeys.length === 0 && player.mains && Object.keys(player.mains).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[...new Set(Object.values(player.mains).flat())]
            .slice(0, 4)
            .map((c, i) => (
              <span key={`${c}-${i}`} className="chip">{c}</span>
            ))}
        </div>
      )}
    </Link>
    </Tilt3D>
  );
}

