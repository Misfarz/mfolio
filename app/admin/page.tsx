import { Metadata } from "next";
import { getVideoSlots } from "@/lib/redis";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard — Portfolio Content Manager",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const videos = await getVideoSlots();

  return <AdminDashboardClient initialVideos={videos} />;
}
