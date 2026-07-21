import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { Trophy, Target, Shield, Calendar, Users, Cpu } from "lucide-react";
import Lightfall from "@/components/Lightfall";
import { ElectricBorder } from "@/components/ElectricBorder";
import danyalImg from "@/assets/DANYAL.png";
import baazLogo from "@/assets/BAAZ WHITE.png";

export const metadata: Metadata = {
  title: "About BAAZ GG — Pakistan's Esports Pioneer",
  description:
    "Discover the story of BAAZ GG, founded by CEO Danyal Chishty, dedicated to transforming Pakistan into a global competitive gaming powerhouse.",
};

export default function AboutPage() {
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_75%)] z-0" />
          
          <div className="relative mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28 z-10">
            <div className="grid gap-12 md:grid-cols-12 items-center">
              
              {/* LEFT COLUMN: TEXT */}
              <div className="col-span-12 md:col-span-7 flex flex-col items-start gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">
                  Who We Are // The Stage Builders
                </span>
                <h1 className="font-display text-5xl uppercase tracking-tighter text-white md:text-8xl leading-none">
                  Transforming Pakistani Esports
                </h1>
                <p className="mt-4 max-w-xl text-base md:text-lg text-ash leading-relaxed">
                  BAAZ is a premier Pakistani esports startup dedicated to transforming Pakistan into a global competitive gaming powerhouse. We build the infrastructure, support the talent, and host the arenas where our players prove themselves.
                </p>
              </div>

              {/* RIGHT COLUMN: BAAZ FALCON LOGO WRAPPED WITH ELECTRIC BORDER */}
              <div className="col-span-12 md:col-span-5 flex justify-center items-center relative">
                <ElectricBorder
                  color="#C9FF2D"
                  speed={1}
                  chaos={0.04}
                  borderRadius={9999}
                  className="p-1"
                >
                  <div className="relative group p-10 md:p-12 rounded-full border border-stone-3/40 bg-gradient-to-br from-stone-900/80 via-stone-950/90 to-stone/40 backdrop-blur-md shadow-[0_0_50px_rgba(200,255,45,0.15)] hover:border-neon hover:shadow-[0_0_70px_rgba(200,255,45,0.25)] transition-all duration-700 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-neon/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <img
                      src={baazLogo.src}
                      alt="BAAZ Falcon"
                      className="h-44 md:h-56 lg:h-64 w-auto object-contain brightness-125 drop-shadow-[0_0_35px_rgba(200,255,45,0.4)] group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </ElectricBorder>
              </div>
              
            </div>
          </div>
        </section>

        {/* FOUNDER PROFILE: DANYAL CHISHTY */}
        <section className="bg-stone/30 py-12">
          <div className="relative mx-auto max-w-[1400px] px-5 py-24 lg:px-10 z-10">
            <div className="grid gap-12 md:grid-cols-12 items-center">
              
              {/* LEFT COLUMN: DANYAL IMAGE BLENDING IN */}
              <div className="col-span-12 md:col-span-5 flex justify-center relative">
                <div className="relative w-full max-w-[380px] aspect-[3/4] border border-stone-3 bg-stone-2/45 overflow-hidden rounded-md group">
                  {/* Brutalist framing corners */}
                  <div className="bracket-frame absolute inset-0 text-neon z-20 pointer-events-none group-hover:scale-102 transition-transform duration-300" />
                  <img
                    src={danyalImg.src}
                    alt="Danyal Chishty - BAAZ Founder & CEO"
                    className="w-full h-full object-cover object-top filter brightness-105 contrast-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void to-transparent pointer-events-none z-10" />
                </div>
              </div>

              {/* RIGHT COLUMN: DETAIL */}
              <div className="col-span-12 md:col-span-7 flex flex-col items-start gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-dim slash">
                  Leadership
                </span>
                <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wider text-white">
                  Danyal Chishty
                </h2>
                <div className="font-mono text-xs uppercase tracking-widest text-ash -mt-2">
                  Founder & Chief Executive Officer
                </div>
                <p className="text-sm md:text-base text-ash leading-relaxed">
                  Under the strategic vision of CEO Danyal Chishty, BAAZ has led the initiative to structuralize Pakistani esports from the ground up. By resolving travel complications, securing international media partnerships, and championing local stars, Danyal has steered BAAZ to become a catalyst for competitive gaming across the nation.
                </p>
                <div className="flex items-center gap-6 font-mono text-[11px] text-ash/80 mt-2 bg-stone-900/60 border border-stone-3/15 px-4 py-2.5 rounded-sm">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-neon" />
                    <span>Esports Startup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-neon" />
                    <span>Lahore, Pakistan</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* THE GENESIS SECTION */}
        <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
          <div className="grid gap-16 md:grid-cols-12 items-start">
            <div className="md:col-span-5">
              <SectionHeader
                eyebrow="The Genesis"
                title="Solving Stagnancy"
                subtitle="Esports in Pakistan had historically suffered from underfunding, a lack of institutional backing, and logistical hurdles. BAAZ was founded to solve these issues."
              />
            </div>
            <div className="md:col-span-7 grid gap-8 sm:grid-cols-2">
              <div className="border border-stone-3/40 bg-stone/25 p-6 rounded-sm hover:border-neon/35 transition-colors backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon/10 border border-neon/30 text-neon mb-4">
                  <Target size={18} />
                </div>
                <h3 className="font-display text-xl text-white uppercase tracking-wide mb-2">Our Mission</h3>
                <p className="text-sm text-ash leading-relaxed">
                  Empowering elite domestic players with standard platforms, infrastructure, and visibility to show the world the depth of Pakistani competitive gaming.
                </p>
              </div>

              <div className="border border-stone-3/40 bg-stone/25 p-6 rounded-sm hover:border-neon/35 transition-colors backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon/10 border border-neon/30 text-neon mb-4">
                  <Cpu size={18} />
                </div>
                <h3 className="font-display text-xl text-white uppercase tracking-wide mb-2">Logistical Focus</h3>
                <p className="text-sm text-ash leading-relaxed">
                  Tackling critical operational bottlenecks directly, including securing travel visas, arranging logistics, and providing clean high-performance bootcamps.
                </p>
              </div>

              <div className="border border-stone-3/40 bg-stone/25 p-6 rounded-sm hover:border-neon/35 transition-colors backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon/10 border border-neon/30 text-neon mb-4">
                  <Users size={18} />
                </div>
                <h3 className="font-display text-xl text-white uppercase tracking-wide mb-2">Demographic Legacy</h3>
                <p className="text-sm text-ash leading-relaxed">
                  Connecting top brands and networks with millions of young digital media consumers and FGC loyalists in Pakistan and South Asia.
                </p>
              </div>

              <div className="border border-stone-3/40 bg-stone/25 p-6 rounded-sm hover:border-neon/35 transition-colors backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon/10 border border-neon/30 text-neon mb-4">
                  <Trophy size={18} />
                </div>
                <h3 className="font-display text-xl text-white uppercase tracking-wide mb-2">Global Platform</h3>
                <p className="text-sm text-ash leading-relaxed">
                  Hosting world-class tournaments locally and bridging international invitationals to build global media properties out of South Asia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FLAGSHIP TOURNAMENTS SECTION */}
        <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
          <div className="flex flex-col gap-3 mb-16">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-dim slash">
              Our Legacy Events
            </div>
            <h2 className="font-display text-4xl uppercase tracking-wider text-white">
              Flagship Tournaments
            </h2>
            <p className="text-sm text-ash max-w-xl">
              We establish our presence on the international stage by organizing Pakistan's most-watched, highly-attended esports broadcasts.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* TAKEDOWN CARD */}
            <div className="group border border-stone-3/60 bg-stone/20 rounded-md p-6 relative overflow-hidden card-depth backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-neon/0 via-neon/0 to-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="flex items-center justify-between font-mono text-[10px] text-ash uppercase tracking-widest mb-4">
                <span>FGC MAJOR SERIES</span>
                <span className="text-neon">OFFICIALLY TWT RECOGNIZED</span>
              </div>
              <h3 className="font-display text-3xl text-white group-hover:text-neon transition-colors mb-4">
                TAKEDOWN
              </h3>
              <p className="text-sm text-ash leading-relaxed mb-6">
                As Pakistan's largest-attended esports event, Takedown has drawn hundreds of local and international competitors, including top players from South Korea, the Philippines, Japan, and Europe. Takedown has been officially recognized and included in the Bandai Namco Tekken World Tour (TWT) circuit.
              </p>
              <div className="flex flex-wrap gap-4 border-t border-stone-3/30 pt-4 font-mono text-[10px] text-ash uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-neon" />
                  <span>500+ Entrants</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy size={12} className="text-neon" />
                  <span>Rs 2.5M+ Prize Pools</span>
                </div>
              </div>
            </div>

            {/* THE BAAZ GAUNTLET CARD */}
            <div className="group border border-stone-3/60 bg-stone/20 rounded-md p-6 relative overflow-hidden card-depth backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-neon/0 via-neon/0 to-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="flex items-center justify-between font-mono text-[10px] text-ash uppercase tracking-widest mb-4">
                <span>INVITATIONAL SERIES</span>
                <span className="text-neon">RECORD VIEWERSHIP</span>
              </div>
              <h3 className="font-display text-3xl text-white group-hover:text-neon transition-colors mb-4">
                THE BAAZ GAUNTLET
              </h3>
              <p className="text-sm text-ash leading-relaxed mb-6">
                This massive regional and international invitational is one of the most-watched esports broadcasts in Pakistan's history. Featuring top-tier international champions matching up against Pakistani esports legends, the event acts as a proving ground for the country's best.
              </p>
              <div className="flex flex-wrap gap-4 border-t border-stone-3/30 pt-4 font-mono text-[10px] text-ash uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-neon" />
                  <span>Annual Showcase</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-neon" />
                  <span>International Invites</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAMPIONING THE PAKISTANI FGC */}
        <section className="bg-stone/30 py-12">
          <div className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
            <div className="grid gap-12 md:grid-cols-12 items-center">
              
              {/* LEFT COLUMN: DETAILS */}
              <div className="col-span-12 md:col-span-7 flex flex-col items-start gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-dim slash">
                  Global Competitors
                </span>
                <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wider text-white">
                  Championing the FGC
                </h2>
                <p className="text-sm md:text-base text-ash leading-relaxed">
                  Pakistan has solidified its reputation as one of the best regions in the world for Tekken. BAAZ actively works to elevate domestic talent, supporting legendary players like Arslan Ash, Atif Butt, and Khan by pitting them against elite international competitors on home soil. By hosting world-class tournaments in hubs like Lahore, BAAZ bridges the gap between local prodigies and the global esports scene.
                </p>
              </div>

              {/* RIGHT COLUMN: BULLET highlights */}
              <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
                <div className="border border-stone-3/45 bg-stone-2/30 p-4 rounded-sm backdrop-blur-sm">
                  <div className="font-mono text-xs text-neon uppercase tracking-widest mb-1">ARSLAN ASH</div>
                  <p className="text-xs text-ash">Supporting Pakistan's most decorated 4-time EVO champion in national invitationals.</p>
                </div>
                <div className="border border-stone-3/45 bg-stone-2/30 p-4 rounded-sm backdrop-blur-sm">
                  <div className="font-mono text-xs text-neon uppercase tracking-widest mb-1">ATIF BUTT</div>
                  <p className="text-xs text-ash">Providing local arenas to showcase the 2022 Tekken World Tour champion's skill.</p>
                </div>
                <div className="border border-stone-3/45 bg-stone-2/30 p-4 rounded-sm backdrop-blur-sm">
                  <div className="font-mono text-xs text-neon uppercase tracking-widest mb-1">LOCAL PRODIGIES</div>
                  <p className="text-xs text-ash">Discovering next-generation talent and giving them competitive exposure.</p>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
