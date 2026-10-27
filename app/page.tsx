import { getVideoSlots } from "@/lib/redis";
import PortfolioClient from "@/components/PortfolioClient";

// Ensure changes via revalidatePath reflect immediately on the portfolio
export const dynamic = "force-dynamic";

export default async function Page() {
  const videos = await getVideoSlots();

  return <PortfolioClient initialVideos={videos} />;
}
