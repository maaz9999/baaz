import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Esports Nations Cup 2026 — BAAZ GG",
  description: "Representing Pakistan at the Esports Nations Cup 2026 in Riyadh.",
};

export default function EncLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}