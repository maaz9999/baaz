import { cn } from "@/lib/cn";
import Image, { type StaticImageData } from "next/image";
import type { CircuitSlot } from "@/lib/types";
import { Tilt3D } from "@/components/Tilt3D";
import esharibImg from "@/assets/ESHARIB_SQUARE.png";
import shehramImg from "@/assets/SHEHRAM_SQUARE.png";
import usamaImg from "@/assets/USAMA_SQUARE.png";
import slotImg from "@/assets/SLOT.png";

const typeColor: Record<string, string> = {
  "stage-winner": "text-bone",
  "takedown-winner": "text-blood",
  "lcq-winner": "text-signal",
  "points-leader": "text-neon",
  "wild-card": "text-bone",
};

const slotPhotos: Record<string, StaticImageData> = {
  ESHARIB: esharibImg,
  SHEHRAM: shehramImg,
  USAMA: usamaImg,
};

export function SlotCard({ slot }: { slot: CircuitSlot }) {
  const filled = !!slot.filledBy;
  const photo = slot.filledBy ? slotPhotos[slot.filledBy.toUpperCase()] : undefined;

  return (
    <Tilt3D max={10}>
      <div
        className={cn(
          "bracket-frame card-depth scanline group relative overflow-hidden border border-neon bg-stone/60 transition-colors",
          typeColor[slot.type]
        )}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-stone-2/60">
          {photo ? (
            <Image
              src={photo}
              alt={slot.filledBy || ""}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Image
              src={slotImg}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover opacity-25"
            />
          )}

          <div className="absolute left-2 top-2 z-10 inline-flex items-center border border-bone/25 bg-void/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone backdrop-blur-sm">
            {filled ? slot.filledBy : `SLOT : ${slot.slotNumber}`}
          </div>
        </div>

        <div className="p-4">
          <div className="display text-2xl leading-none">{slot.label}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            {slot.sublabel}
          </div>
        </div>
      </div>
    </Tilt3D>
  );
}
