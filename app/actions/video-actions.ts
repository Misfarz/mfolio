"use server";

import { revalidatePath } from "next/cache";
import { redis, REDIS_VIDEOS_KEY, getVideoSlots, VideoSlot, DEFAULT_VIDEOS } from "@/lib/redis";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

/**
 * Verify admin password
 */
export async function verifyAdminPasswordAction(password: string) {
  return { valid: password === ADMIN_PASSWORD };
}

/**
 * Add a new video slot
 */
export async function addVideoSlotAction(data: {
  url: string;
  label: string;
  sub: string;
  orientation?: "vertical" | "landscape";
  password?: string;
}) {
  const { url, label, sub, orientation = "vertical", password } = data;

  // Simple password check
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Unauthorized: Invalid password" };
  }

  // Validation: non-optional fields
  if (!url || !url.trim()) {
    return { success: false, error: "Cloudinary video link is required." };
  }
  if (!label || !label.trim()) {
    return { success: false, error: "Label / Title is required." };
  }
  if (!sub || !sub.trim()) {
    return { success: false, error: "Subtitle / Sub description is required." };
  }

  const cleanUrl = url.trim();

  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    return { success: false, error: "Please enter a valid URL (starting with https://)" };
  }

  try {
    const currentVideos = await getVideoSlots();

    // Determine the next numerical ID formatted with leading zero
    let maxNum = 0;
    for (const v of currentVideos) {
      const parsed = parseInt(v.id, 10);
      if (!isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }
    const nextNum = maxNum + 1;
    const nextId = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;

    const newVideo: VideoSlot = {
      id: nextId,
      label: label.trim(),
      sub: sub.trim(),
      src: cleanUrl,
      orientation: orientation === "landscape" ? "landscape" : "vertical",
      createdAt: Date.now(),
    };

    const updatedVideos = [...currentVideos, newVideo];

    await redis.set(REDIS_VIDEOS_KEY, updatedVideos);

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Video slot ${nextId} added successfully!`,
      videos: updatedVideos,
    };
  } catch (error) {
    console.error("Failed to add video slot:", error);
    return { success: false, error: "Failed to save video to database. Please try again." };
  }
}

/**
 * Edit an existing video slot (url, label, sub, orientation)
 */
export async function editVideoSlotAction(data: {
  id: string;
  url: string;
  label: string;
  sub: string;
  orientation?: "vertical" | "landscape";
  password?: string;
}) {
  const { id, url, label, sub, orientation = "vertical", password } = data;

  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Unauthorized: Invalid password" };
  }

  if (!url || !url.trim()) {
    return { success: false, error: "Cloudinary link cannot be empty." };
  }
  if (!label || !label.trim()) {
    return { success: false, error: "Label cannot be empty." };
  }
  if (!sub || !sub.trim()) {
    return { success: false, error: "Subtitle cannot be empty." };
  }

  try {
    const currentVideos = await getVideoSlots();
    const index = currentVideos.findIndex((v) => v.id === id);

    if (index === -1) {
      return { success: false, error: `Video slot ${id} not found.` };
    }

    const updatedVideos = [...currentVideos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      src: url.trim(),
      label: label.trim(),
      sub: sub.trim(),
      orientation: orientation === "landscape" ? "landscape" : "vertical",
    };

    await redis.set(REDIS_VIDEOS_KEY, updatedVideos);

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Slot ${id} updated successfully!`,
      videos: updatedVideos,
    };
  } catch (error) {
    console.error("Failed to edit video slot:", error);
    return { success: false, error: "Failed to update slot in database." };
  }
}

/**
 * Delete a video slot
 */
export async function deleteVideoSlotAction(id: string, password?: string) {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Unauthorized: Invalid password" };
  }

  try {
    const currentVideos = await getVideoSlots();
    const updatedVideos = currentVideos.filter((v) => v.id !== id);

    await redis.set(REDIS_VIDEOS_KEY, updatedVideos);

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, videos: updatedVideos };
  } catch (error) {
    console.error("Failed to delete video slot:", error);
    return { success: false, error: "Failed to delete video slot." };
  }
}

/**
 * Reorder video slots
 */
export async function reorderVideoSlotsAction(
  newVideos: VideoSlot[],
  password?: string
) {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Unauthorized: Invalid password" };
  }

  try {
    // Re-index slots starting from 01 sequentially
    const reindexed = newVideos.map((v, i) => ({
      ...v,
      id: i + 1 < 10 ? `0${i + 1}` : `${i + 1}`,
    }));

    await redis.set(REDIS_VIDEOS_KEY, reindexed);
    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, videos: reindexed };
  } catch (error) {
    console.error("Failed to reorder video slots:", error);
    return { success: false, error: "Failed to update slot order." };
  }
}

/**
 * Reset to default initial 7 videos (Emergency reset if needed)
 */
export async function resetToDefaultVideosAction(password?: string) {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Unauthorized" };
  }

  await redis.set(REDIS_VIDEOS_KEY, DEFAULT_VIDEOS);
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, videos: DEFAULT_VIDEOS };
}
