import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Grain } from "@/components/Grain";
import { getSiteSettings } from "@/lib/content";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BAAZ GG — Pakistan's home for the FGC",
  description:
    "Pakistan's leading fighting-game esports organization. Home of Takedown, The Baaz Gauntlet, and the Pakistan Tekken League.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "BAAZ GG",
    description: "Pakistan's home for the FGC.",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en" className={cn(anton.variable, inter.variable, jetbrains.variable, "font-sans", geist.variable)}>
      <body suppressHydrationWarning>
        <Grain />
        <Nav settings={siteSettings} />
        <main>{children}</main>
        <Footer settings={siteSettings} />
      </body>
    </html>
  );
}
