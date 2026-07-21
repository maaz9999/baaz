"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { CmsTitleText } from "@/components/CmsTitleText";
import { Calendar, MapPin, Shield } from "lucide-react";
import Lightfall from "@/components/Lightfall";

// Import game assets
import dotaImg from "@/assets/DOTA_2_Logo_Black_horizontal_56d4e6d93e.webp";
import chessImg from "@/assets/Chess_dark_3_2dd7797264.webp";
import rlImg from "@/assets/Rocket_League_dark_no_feature_219e1c359f.webp";
import pubgImg from "@/assets/PUBG_Mobile_Simple_Black_1024px_0d4b5d9817.webp";
import valImg from "@/assets/Valorant_Logo_Black_1b1286c6af.webp";
import ffImg from "@/assets/fatalfury_cotw_Logo_Black_f35e6e9faf.webp";
import r6Img from "@/assets/R6_Siege_R6_Lockup_Horizontal_Black_6240da8ef5.webp";
import lolImg from "@/assets/Logo_League_of_Legends_bc079feb7e.webp";
import mlbbImg from "@/assets/MLBB_Logo_Black_a27963d4ef_b6b0b9e3db.svg";

// Import Danyal image asset
import danyalImg from "@/assets/DANYAL.png";

export default function EncPage() {
  const games = [
    { name: "Dota 2", src: dotaImg },
    { name: "Chess", src: chessImg },
    { name: "Rocket League", src: rlImg },
    { name: "PUBG Mobile", src: pubgImg },
    { name: "Valorant", src: valImg },
    { name: "Fatal Fury", src: ffImg },
    { name: "R6 Siege", src: r6Img },
    { name: "League of Legends", src: lolImg },
    { name: "Mobile Legends", src: mlbbImg },
  ];

  return (
    <div className="relative overflow-hidden w-full bg-void min-h-screen">
      {/* Single Seamless Unified Page Background */}
      <div className="absolute inset-0 pointer-events-none opacity-35 z-0">
        <Lightfall
          colors={["#C9FF2D", "#FFFFFF", "#C9FF2D"]}
          backgroundColor="#090A0C"
          speed={0.4}
          streakCount={4}
          streakWidth={1.2}
          streakLength={1}
          glow={1}
          density={0.55}
          twinkle={1}
          zoom={2.5}
          backgroundGlow={0.35}
          opacity={0.85}
          mouseInteraction={true}
          mouseStrength={0.4}
          mouseRadius={1}
        />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-void/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_75%)]" />
          
          <div className="relative mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-20 z-10">
            <div className="grid gap-12 md:grid-cols-12 items-center">
              
              {/* LEFT COLUMN: DANYAL IMAGE BLENDING IN */}
              <div className="col-span-12 md:col-span-6 flex justify-center md:justify-end relative">
                <div className="relative w-full max-w-[500px] h-[400px] md:h-[600px] overflow-hidden flex items-start -mt-16 md:-mt-24">
                  <img
                    src={danyalImg.src}
                    alt="Danyal Chishty - Team Manager"
                    onError={(e) => {
                      console.error("Danyal image failed to load");
                      e.preventDefault();
                    }}
                    className="w-full h-full object-contain object-top filter brightness-105 contrast-105 mix-blend-screen"
                    style={{ mixBlendMode: "screen" }}
                  />
                  {/* Horizontal blend fade on the right side */}
                  <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent pointer-events-none" />
                  {/* Horizontal blend fade on the left side */}
                  <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-void to-transparent pointer-events-none" />
                  {/* Vertical blend fade at the bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void to-transparent pointer-events-none" />
                  {/* Vertical blend fade at the top */}
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-void to-transparent pointer-events-none" />
                </div>
              </div>

              {/* RIGHT COLUMN: TEXT DETAILS */}
              <div className="col-span-12 md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">
                  Representing Pakistan
                </span>
                <h1 className="font-display text-5xl uppercase tracking-tighter text-white md:text-7xl">
                  Esports Nations Cup
                </h1>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 font-mono text-[11px] text-ash/80 mt-2 bg-stone-900/60 border border-stone-3/15 backdrop-blur-sm px-4 py-2.5 rounded-sm shadow-md">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-neon" />
                    <span>November 2 - November 29, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-neon" />
                    <span>Riyadh, Saudi Arabia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-neon" />
                    <span>Team Pakistan</span>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-sm md:text-base text-ash/80 leading-relaxed">
                  Pakistan's finest esports competitors unite under the national banner to compete in the Esports Nations Cup in Riyadh. Spanning nine elite global competitive titles, our players face off against the world's best for the ultimate glory.
                </p>
              </div>
              
            </div>
          </div>
        </section>

        {/* GAME ROSTER GRID */}
        <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-dim mb-3 slash">
            Official Representation
          </div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-white mb-10">
            Championship Games
          </h2>

          {/* White boxes with black logos */}
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {games.map((g) => (
              <div
                key={g.name}
                className="group relative bg-white border border-stone-3/20 rounded-md p-6 flex items-center justify-center shadow-md hover:scale-105 hover:shadow-2xl transition-all duration-300 min-h-[90px]"
              >
                <div className="relative w-full h-12 flex items-center justify-center">
                  <img
                    src={g.src?.src || (g.src as unknown as string) || ""}
                    alt={`${g.name} Logo`}
                    onError={(e) => {
                      console.error(`Failed to load logo for ${g.name}`);
                      e.preventDefault();
                    }}
                    className="object-contain max-w-[85%] max-h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
