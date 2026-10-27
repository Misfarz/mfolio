import { Redis } from "@upstash/redis";

export interface VideoSlot {
  id: string;
  label: string;
  sub: string;
  src: string;
  orientation?: "vertical" | "landscape";
  createdAt?: number;
}

export const DEFAULT_VIDEOS: VideoSlot[] = [
  {
    id: "01",
    label: "Featured Reel",
    sub: "4K Master Cut",
    src: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1792777369/kinetic_edit.mov",
    orientation: "landscape",
    createdAt: 1714000000000,
  },
  {
    id: "02",
    label: "Adidas Commercial",
    sub: "Motion & Rhythm",
    src: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1792755524/adidas.mp4",
    orientation: "vertical",
    createdAt: 1714000001000,
  },
  {
    id: "03",
    label: "Effort Narrative",
    sub: "Story Telling",
    src: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1792775833/effort.mp4",
    orientation: "vertical",
    createdAt: 1714000002000,
  },
  {
    id: "04",
    label: "Short Film Cut",
    sub: "Aesthetics",
    src: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791303926/slot_4.mov",
    orientation: "vertical",
    createdAt: 1714000003000,
  },
  {
    id: "05",
    label: "Brand Narrative",
    sub: "Frames",
    src: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791302786/slot333.mov",
    orientation: "vertical",
    createdAt: 1714000004000,
  },
  {
    id: "06",
    label: "Creative Montage",
    sub: "Color Science",
    src: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791300961/slot_2.mov",
    orientation: "vertical",
    createdAt: 1714000005000,
  },
  {
    id: "07",
    label: "Visual Storytelling",
    sub: "Cinematic.",
    src: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791305821/jifan.mov",
    orientation: "vertical",
    createdAt: 1714000006000,
  },
];

export const REDIS_VIDEOS_KEY = "portfolio_videos";

// Upstash Redis connection with safe credentials resolution
const UPSTASH_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  "https://charming-narwhal-240929.upstash.io";

const UPSTASH_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  "gQAAAAAAA60hAAIgcDJlNDYyYTQ5ZDJlYmM0ODZkYTc4OWNjNTFjMmI3MzI3Yw";

export const redis = new Redis({
  url: UPSTASH_URL,
  token: UPSTASH_TOKEN,
});

/**
 * Get all video slots. If Redis has no data yet, seeds and returns the default videos.
 */
export async function getVideoSlots(): Promise<VideoSlot[]> {
  try {
    const data = await redis.get<VideoSlot[]>(REDIS_VIDEOS_KEY);
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map((item, idx) => ({
        ...item,
        orientation:
          item.orientation ||
          (idx === 0 || item.id === "01" ? "landscape" : "vertical"),
      }));
    }
    // Seed default videos into Redis so they are never lost
    await redis.set(REDIS_VIDEOS_KEY, DEFAULT_VIDEOS);
    return DEFAULT_VIDEOS;
  } catch (error) {
    console.error("Error retrieving videos from Upstash Redis:", error);
    return DEFAULT_VIDEOS;
  }
}
