import { Calendar, MapPin, Trophy, LayoutGrid, Users, Globe, Flame, Gamepad2, Zap, Award } from "lucide-react";
import { Tilt3D } from "@/components/Tilt3D";

type Props = { label: string; value: string | number; sub?: string };

const getIcon = (label: string) => {
  const l = label.toUpperCase();
  if (l.includes("DATE")) return <Calendar className="h-4 w-4 text-neon shrink-0" />;
  if (l.includes("VENUE") || l.includes("LOCATION")) return <MapPin className="h-4 w-4 text-neon shrink-0" />;
  if (l.includes("PRIZE")) return <Trophy className="h-4 w-4 text-neon shrink-0" />;
  if (l.includes("FORMAT")) return <LayoutGrid className="h-4 w-4 text-neon shrink-0" />;
  if (l.includes("EVENT")) return <Award className="h-4 w-4 text-neon shrink-0" />;
  if (l.includes("ENTRANT") || l.includes("PLAYER")) return <Users className="h-4 w-4 text-neon shrink-0" />;
  if (l.includes("GAME")) return <Gamepad2 className="h-4 w-4 text-neon shrink-0" />;
  if (l.includes("COUNTRY") || l.includes("NATION")) return <Globe className="h-4 w-4 text-neon shrink-0" />;
  if (l.includes("CIRCUIT")) return <Zap className="h-4 w-4 text-neon shrink-0" />;
  return <Flame className="h-4 w-4 text-neon/60 shrink-0" />;
};

export function StatBlock({ label, value, sub }: Props) {
  const icon = getIcon(label);

  return (
    <Tilt3D max={6}>
      <div className="relative group overflow-hidden h-full border border-neon/40 bg-gradient-to-br from-stone-900/80 via-stone-950/90 to-stone/30 p-6 text-bone transition-all duration-300 hover:border-neon hover:shadow-[0_0_35px_rgba(200,255,45,0.15)] shadow-[0_0_20px_rgba(200,255,45,0.06)] card-depth rounded-[2px]">
        {/* Futuristic Top Glowing Accent Line - Permanent */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-neon shadow-[0_0_10px_rgba(200,255,45,0.8)]" />

        {/* Side Glowing Accent Lines - Permanent */}
        <div className="absolute top-0 left-0 w-[1.5px] h-full bg-gradient-to-b from-neon via-neon/30 to-transparent shadow-[0_0_8px_rgba(200,255,45,0.6)]" />
        <div className="absolute top-0 right-0 w-[1.5px] h-full bg-gradient-to-b from-neon via-neon/30 to-transparent shadow-[0_0_8px_rgba(200,255,45,0.6)]" />

        {/* Corner tech lines */}
        <div className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-neon/80 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-neon/80 transition-colors duration-300" />

        {/* Corner radial glow leak - Permanent */}
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-neon/15 rounded-full blur-2xl opacity-75 pointer-events-none" />

        <div className="flex items-center justify-between border-b border-stone-3/20 pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ash/90 font-bold group-hover:text-neon transition-colors">{label}</span>
          {icon}
        </div>

        <div className="display mt-5 break-words text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-bone to-neon/90 leading-none font-bold uppercase tracking-tight transition-all">
          {value}
        </div>

        {sub && (
          <div className="mt-3.5 font-mono text-[9.5px] uppercase tracking-wider text-ash/70 group-hover:text-bone/80 transition-colors flex items-center gap-1.5">
            <span className="text-neon/60">•</span>
            <span>{sub}</span>
          </div>
        )}
      </div>
    </Tilt3D>
  );
}
