import type { Metadata } from "next";
import { AdminDashboard } from "./AdminDashboard";

export const metadata: Metadata = {
  title: "BAAZ CMS Admin",
  description: "BAAZ CMS admin dashboard.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
