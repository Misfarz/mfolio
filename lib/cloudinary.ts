export const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "oc4pkoeu";

/**
 * Generates an optimized Cloudinary video delivery URL.
 * Automatically handles either a full Cloudinary URL, a public ID, or a local path.
 *
 * @param pathOrUrl Public ID (e.g. "hero-banner"), full URL, or local path
 * @param options Optional transformations (e.g. quality, format, resize)
 */
export function getCloudinaryVideoUrl(
  pathOrUrl: string,
  options: {
    quality?: "auto" | "good" | "best";
    format?: "auto" | "mp4" | "webm";
    crop?: string;
  } = {}
): string {
  if (!pathOrUrl) return "";

  // If already a full URL or local path (/videos/...)
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    let url = pathOrUrl;
    // If it's a Cloudinary URL without optimizations, inject f_auto,q_auto
    if (url.includes("res.cloudinary.com")) {
      if (!url.includes("f_auto")) {
        url = url.replace("/upload/", "/upload/f_auto,q_auto/");
      }
      // Replace .mov with .mp4 so browsers don't fail MIME type checks
      url = url.replace(/\.mov$/i, ".mp4");
    }
    return url;
  }

  // If it's a local static path
  if (pathOrUrl.startsWith("/")) {
    return pathOrUrl;
  }

  // If it's a Cloudinary Public ID (e.g. "hero-banner" or "portfolio/video1")
  const { quality = "auto", format = "auto" } = options;
  const transformations = `f_${format},q_${quality}`;

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transformations}/${pathOrUrl}`;
}
