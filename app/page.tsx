import Link from "next/link";
import { Anton, Pacifico, Plus_Jakarta_Sans } from "next/font/google";
import { getCloudinaryVideoUrl } from "@/lib/cloudinary";
import AutoplayVideo from "@/components/AutoplayVideo";
import GraphicDesignsSection, { GraphicDesignItem } from "@/components/GraphicDesignsSection";
import ConnectButton from "@/components/ConnectButton";

// ==============================================================
// CLOUDINARY VIDEOS CONFIGURATION
// Paste your Cloudinary video URLs (or Public IDs) here!
// ==============================================================
export const CLOUDINARY_VIDEOS = {
  // Video 1: Full-width Hero Banner (Slot 01)
  hero: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791300389/hero2.mov", // Paste Cloudinary URL here, e.g. "https://res.cloudinary.com/oc4pkoeu/video/upload/..."

  // Videos 2, 3, 4: Portrait/Vertical Slots (Slots 02, 03, 04)
  slot2: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791302786/slot333.mov", // Paste Cloudinary URL for Video 2 (Portrait)
  slot3: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791300961/slot_2.mov", // Paste Cloudinary URL for Video 3 (Portrait)
  slot4: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791305821/jifan.mov", // Paste Cloudinary URL for Video 4 (Portrait)

  // Videos 5, 6, 7: Portrait/Vertical Slots (Slots 05, 06, 07)
  slot5: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791910051/slot_00.mov", // Paste Cloudinary URL for Video 5 (Portrait)
  slot6: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791910063/slot_66.mov", // Paste Cloudinary URL for Video 6 (Portrait)
  slot7: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791303926/slot_4.mov", // Paste Cloudinary URL for Video 7 (Portrait)
};

// ==============================================================
// GRAPHIC DESIGNS CONFIGURATION
// You can replace the src paths with your Cloudinary image URLs or local files!
// ==============================================================
export const GRAPHIC_DESIGNS: GraphicDesignItem[] = [
  {
    id: "1",
    title: "Brutalist Swiss Editorial",
    category: "Posters & Covers",
    subtitle: "Experimental Typography Poster",
    tool: "Photoshop & Illustrator",
    year: "2026",
    src: "/designs/design-1.jpg",
    description:
      "High-contrast editorial typography poster exploring Swiss international style, geometric abstraction, and bold chromatic layout.",
  },
  {
    id: "2",
    title: "High-Energy Cyber Visuals",
    category: "Thumbnails",
    subtitle: "Cinematic YouTube Key Art",
    tool: "Photoshop & After Effects",
    year: "2026",
    src: "/designs/design-2.jpg",
    description:
      "Dynamic YouTube thumbnail and digital cover featuring dramatic dual-tone neon rim lighting, stylized character silhouette, and high-CTR title treatments.",
  },
  {
    id: "3",
    title: "Aurora Design Studio",
    category: "Brand Identity",
    subtitle: "Luxury Monogram & Stationery",
    tool: "Illustrator & InDesign",
    year: "2025",
    src: "/designs/design-3.jpg",
    description:
      "Complete corporate identity system including embossed copper-foil business cards, letterheads, and minimalist monogram logo mark.",
  },
  {
    id: "4",
    title: "Harmonic Chaos",
    category: "Posters & Covers",
    subtitle: "Avant-Garde Vinyl Album Art",
    tool: "Cinema 4D & Photoshop",
    year: "2026",
    src: "/designs/design-4.jpg",
    description:
      "Experimental album packaging showcasing iridescent metallic fluid ribbons, holographic ripple textures, and cosmic nocturnal atmosphere.",
  },
  {
    id: "5",
    title: "Nightfall: The Eclipse Protocol",
    category: "Posters & Covers",
    subtitle: "Cinematic Thriller Movie Poster",
    tool: "Photoshop & Lightroom",
    year: "2025",
    src: "/designs/design-5.jpg",
    description:
      "Theatrical key art poster with dramatic sunset rim lighting, duotone color grading, billing credits block, and gritty analog film grain.",
  },
  {
    id: "6",
    title: "Creative Flow Kinetic Poster",
    category: "Typography",
    subtitle: "Risograph Retro Pop Art",
    tool: "Illustrator & Procreate",
    year: "2026",
    src: "/designs/design-6.jpg",
    description:
      "Playful cut-paper typographic poster with halftones, custom lettering curves, risograph textures, and energetic visual motion.",
  },
];

const display = Anton({
  weight: "400",
  subsets: ["latin"],
});

const script = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

const sans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const NAV = [
  { label: "Videos", href: "#videos" },
  { label: "Designs", href: "#designs" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    id: "services",
    title: "Videographer",
    sub: "& editor",
    bg: "#f6efe0",
    fg: "#ff8a00",
    ghost: "#e2d6bd",
    side: "right",
  },
  {
    id: "colorist",
    title: "Colorist",
    sub: "color grading",
    bg: "#ff8a00",
    fg: "#0050c8",
    ghost: "#ff9d2e",
    side: "left",
  },
  {
    id: "design",
    title: "Graphic",
    sub: "designer",
    bg: "#0a1a3a",
    fg: "#f6efe0",
    ghost: "#12285a",
    side: "right",
  },
] as const;

export default function HomePage() {
  return (
    <main
      className={`${sans.className} relative min-h-screen overflow-x-hidden bg-[#0050c8] text-[#f6efe0] selection:bg-[#ff8a00] selection:text-[#0050c8]`}
    >
      {/* ============================================================== */}
      {/* 1. HERO SECTION */}
      {/* ============================================================== */}
      <section className="relative flex min-h-screen flex-col justify-between overflow-hidden">
        {/* Wavy background */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <path
            d="M0 520 C220 380 360 640 620 560 C880 480 960 220 1200 240 C1320 250 1400 160 1440 100 L1440 0 L0 0 Z"
            fill="#003f9e"
          />
          <path
            d="M0 900 L0 700 C240 640 420 820 700 780 C980 740 1160 600 1440 680 L1440 900 Z"
            fill="#003f9e"
          />
        </svg>

        {/* Inner frame */}
        <div className="pointer-events-none absolute inset-2.5 rounded-[1.5rem] border-2 border-[#f6efe0]/90 sm:inset-4 sm:rounded-[2rem] md:inset-8 md:rounded-[2.5rem]" />

        {/* Nav */}
        <header className="relative z-10 flex items-center justify-end px-6 py-6 sm:px-10 sm:py-8 md:px-16 md:py-10">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-5 text-sm font-medium tracking-wide sm:gap-8 sm:text-base md:gap-12">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="rounded px-1 py-1 transition-colors hover:text-[#ff8a00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a00]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* Hero Title */}
        <div className="relative z-10 my-auto flex flex-1 items-center justify-center px-6 py-8 sm:px-10 md:px-16">
          <div className="w-full max-w-4xl">
            <h1 className="relative leading-none">
              {/* Top row: Name & Year */}
              <div className="mb-1 flex items-baseline justify-between gap-4 sm:mb-2">
                <span className="block text-base font-medium tracking-wider sm:text-xl md:text-3xl">
                  Mohd. Misfar
                </span>
                <span className="text-sm font-semibold tracking-wider text-[#f6efe0]/90 sm:text-xl md:text-3xl">
                  2026
                </span>
              </div>

              {/* PORT */}
              <span
                className={`${display.className} block text-[20vw] uppercase leading-[0.88] tracking-tight sm:text-[18vw] md:text-[11rem] lg:text-[13rem] select-none`}
              >
                Port
              </span>

              {/* folio */}
              <span
                className={`${script.className} -mt-3 block pl-[12vw] text-[16vw] leading-[0.88] text-[#ff8a00] sm:-mt-6 sm:pl-[16vw] sm:text-[14vw] md:-mt-12 md:pl-36 md:text-[8.5rem] lg:-mt-16 lg:pl-48 lg:text-[10rem] select-none`}
              >
                folio
              </span>

              {/* Tagline */}
              <span className="mt-4 block text-sm font-normal tracking-wide text-[#f6efe0]/95 sm:mt-6 sm:text-lg md:mt-8 md:text-2xl">
                Video editor &amp; designer
              </span>
            </h1>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-6 sm:h-8" />
      </section>

      {/* ============================================================== */}
      {/* 2. SERVICES SECTION (BEHANCE-STYLE BANDS) */}
      {/* ============================================================== */}
      <section aria-label="What I do" className="relative z-10">
        {SERVICES.map((s, i) => (
          <Band
            key={s.title}
            {...s}
            n={i + 1}
            prev={i === 0 ? "#0050c8" : SERVICES[i - 1].bg}
          />
        ))}
      </section>

      {/* ============================================================== */}
      {/* 3. ABOUT / BIO SECTION */}
      {/* ============================================================== */}
      <section id="about" style={{ background: "#0a1a3a" }} className="scroll-mt-4">
        {/* Wavy transition from navy into cream */}
        <svg
          aria-hidden
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="-mb-px block h-16 w-full sm:h-20 md:h-28 lg:h-36"
        >
          <path
            d="M0 60 C240 0 480 120 760 70 C1040 20 1240 100 1440 40 L1440 120 L0 120 Z"
            fill="#f6efe0"
          />
        </svg>

        {/* About Canvas */}
        <div className="relative bg-[#f6efe0] text-[#0a1a3a] px-8 py-16 sm:px-14 sm:py-24 md:px-20 md:py-32 lg:px-28 lg:py-36">
          <div className="mx-auto max-w-7xl">
            {/* Top Bar with Circle Monogram */}
            <div className="mb-10 sm:mb-16 flex items-center justify-between">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-[#0a1a3a] text-lg sm:text-xl font-bold tracking-tighter select-none">
                M
              </div>
              <span className="text-xs uppercase tracking-widest text-[#0a1a3a]/60 hidden sm:block">
                Mohd. Misfar &bull; Profile
              </span>
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column: Typographic Headline */}
              <div className="lg:col-span-5 select-none">
                <div className="relative inline-block">
                  <span
                    className={`${display.className} block text-7xl uppercase leading-[0.85] tracking-tight text-[#0a1a3a] sm:text-8xl md:text-9xl lg:text-[9.5rem]`}
                  >
                    About
                  </span>
                  <span
                    className={`${script.className} -mt-3 sm:-mt-5 md:-mt-8 block pl-10 sm:pl-16 md:pl-20 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none text-[#ff8a00]`}
                  >
                    me
                  </span>
                </div>
              </div>

              {/* Right Column: Narrative with Orange Highlighted Phrases */}
              <div className="lg:col-span-7">
                <p className="text-xl font-medium leading-relaxed sm:text-2xl md:text-3xl lg:text-[2rem] lg:leading-[1.4] text-[#0a1a3a]">
                  I&apos;m a{" "}
                  <span className="font-bold text-[#ff8a00]">
                    Video Editor, Graphic Designer, and Colorist
                  </span>{" "}
                  focused on creating{" "}
                  <span className="font-bold text-[#ff8a00]">
                    clean, engaging, and visually impactful content
                  </span>
                  .
                </p>

                <p className="mt-6 text-base font-normal leading-relaxed text-[#0a1a3a]/90 sm:text-lg md:text-xl lg:text-2xl">
                  I work with{" "}
                  <span className="font-semibold text-[#ff8a00]">
                    DaVinci Resolve, Adobe Premiere Pro, Photoshop, After Effects
                  </span>
                  , and other creative tools for video editing, color grading, motion graphics, and graphic design.
                </p>
              </div>
            </div>

            {/* Bottom Row with 3 Geometric Diamonds */}
            <div className="mt-14 sm:mt-20 flex justify-end items-center gap-2 text-[#0a1a3a] text-lg sm:text-2xl select-none">
              <span className="inline-block transform rotate-45 h-3 w-3 sm:h-4 sm:w-4 bg-[#0a1a3a]" />
              <span className="inline-block transform rotate-45 h-3 w-3 sm:h-4 sm:w-4 bg-[#0a1a3a]" />
              <span className="inline-block transform rotate-45 h-3 w-3 sm:h-4 sm:w-4 bg-[#0a1a3a]" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. VIDEO SHOWCASE SECTION (EXACT ORDER: IMG 2 -> IMG 3 -> IMG 1) */}
      {/* ============================================================== */}
      <section id="videos" className="relative z-10 scroll-mt-4 bg-[#0d141f]">
        {/* ------------------------------------------------------------ */}
        {/* PART 1 (FROM 2ND IMAGE): HERO VIDEO BANNER WITH TITLE OVERLAY */}
        {/* ------------------------------------------------------------ */}
        <div className="relative w-full overflow-hidden bg-black">
          {/* VIDEO SLOT 1 (Featured Hero Video - Fully contained inside wavy frame) */}
          <div className="group relative aspect-[16/9] min-h-[520px] w-full sm:min-h-[640px] md:min-h-[760px] lg:min-h-[860px] bg-black overflow-hidden">
            {/* Background Video */}
            <AutoplayVideo
              src={getCloudinaryVideoUrl(CLOUDINARY_VIDEOS.hero)}
              loop
              muted
              showSoundButton={true}
              containerClassName="absolute inset-0 h-full w-full z-0"
              className="h-full w-full object-cover"
            />

            {/* Top Cream Wave cutting directly over the video (Zero gap / fully contained) */}
            <div className="pointer-events-none absolute -top-1 left-0 z-20 w-full">
              <svg
                aria-hidden
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                className="block h-16 w-full sm:h-20 md:h-28 lg:h-36"
              >
                <path
                  d="M0 0 L1440 0 L1440 40 C1220 90 1020 10 740 60 C460 110 240 20 0 60 Z"
                  fill="#f6efe0"
                />
              </svg>
            </div>

            {/* Subtle dark gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 z-10 pointer-events-none" />

            {/* Typography Overlay Matching Image 2 */}
            <div className="pointer-events-none absolute left-6 top-16 z-20 select-none sm:left-12 sm:top-24 md:left-20 md:top-36">
              <div className="relative leading-none">
                {/* Line 1: Fram + es */}
                <div className="flex items-baseline">
                  <span
                    className={`${display.className} text-6xl uppercase tracking-tight text-[#f6efe0] sm:text-8xl md:text-9xl lg:text-[11rem] drop-shadow-lg`}
                  >
                    Fram
                  </span>
                  <span
                    className={`${script.className} -ml-4 sm:-ml-8 md:-ml-12 text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] text-[#ff8a00] drop-shadow-md`}
                  >
                    es
                  </span>
                </div>

                {/* Line 2: By + Me */}
                <div className="-mt-3 sm:-mt-6 md:-mt-10 lg:-mt-14 flex items-baseline">
                  <span
                    className={`${display.className} text-6xl uppercase tracking-tight text-[#f6efe0] sm:text-8xl md:text-9xl lg:text-[11rem] drop-shadow-lg`}
                  >
                    By
                  </span>
                  <span
                    className={`${script.className} -ml-2 sm:-ml-6 md:-ml-8 text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] text-[#ff8a00] drop-shadow-md`}
                  >
                    Me
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Wave Divider in Orange (Exact Image 2 Footer Shape) */}
            <div className="pointer-events-none absolute -bottom-1 left-0 z-20 w-full">
              <svg
                aria-hidden
                viewBox="0 0 1440 160"
                preserveAspectRatio="none"
                className="block h-20 w-full sm:h-28 md:h-36 lg:h-44"
              >
                <path
                  d="M0 160 L0 120 C180 140 320 40 520 70 C720 100 860 0 1060 20 C1240 40 1360 110 1440 90 L1440 160 Z"
                  fill="#ff8a00"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* PART 2 (FROM 3RD IMAGE): 3 PORTRAIT/VERTICAL VIDEOS UNDER ORANGE WAVE */}
        {/* ------------------------------------------------------------ */}
        <div className="relative w-full bg-[#ff8a00] p-0">
          {/* 3 Side-by-Side Video Cards - Flush with no gap, no rounded corners, no borders */}
          <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 w-full">
            {/* VIDEO SLOT 2 (Portrait Video 1) */}
            <div className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-none border-0 bg-[#0f172a] flex items-center justify-center">
              {CLOUDINARY_VIDEOS.slot2 ? (
                <AutoplayVideo
                  src={getCloudinaryVideoUrl(CLOUDINARY_VIDEOS.slot2)}
                  loop
                  muted
                  showSoundButton={true}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 50% 50%, rgba(255, 138, 0, 0.3) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105 text-center px-4">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#ff8a00] text-[#0a1a3a] shadow-lg">
                      <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                      Video Slot 02
                    </span>
                    <span className="text-[11px] text-white/70">
                      Portrait 4:5 &bull; Paste Cloudinary URL in CLOUDINARY_VIDEOS.slot2
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/80">
                    4K Vertical
                  </div>
                </>
              )}
            </div>

            {/* VIDEO SLOT 3 (Portrait Video 2 - Center) */}
            <div className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-none border-0 bg-[#0f172a] flex items-center justify-center">
              {CLOUDINARY_VIDEOS.slot3 ? (
                <AutoplayVideo
                  src={getCloudinaryVideoUrl(CLOUDINARY_VIDEOS.slot3)}
                  loop
                  muted
                  showSoundButton={true}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 50% 50%, rgba(0, 80, 200, 0.35) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105 text-center px-4">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white text-[#0a1a3a] shadow-lg">
                      <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                      Video Slot 03
                    </span>
                    <span className="text-[11px] text-white/70">
                      Portrait 4:5 &bull; Paste Cloudinary URL in CLOUDINARY_VIDEOS.slot3
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/80">
                    4K Vertical
                  </div>
                </>
              )}
            </div>

            {/* VIDEO SLOT 4 (Portrait Video 3 - Right) */}
            <div className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-none border-0 bg-[#0f172a] flex items-center justify-center">
              {CLOUDINARY_VIDEOS.slot4 ? (
                <AutoplayVideo
                  src={getCloudinaryVideoUrl(CLOUDINARY_VIDEOS.slot4)}
                  loop
                  muted
                  showSoundButton={true}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 50% 50%, rgba(255, 138, 0, 0.3) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105 text-center px-4">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#ff8a00] text-[#0a1a3a] shadow-lg">
                      <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                      Video Slot 04
                    </span>
                    <span className="text-[11px] text-white/70">
                      Portrait 4:5 &bull; Paste Cloudinary URL in CLOUDINARY_VIDEOS.slot4
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/80">
                    4K Vertical
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* PART 3: 3 VERTICAL VIDEOS SIDE-BY-SIDE (ROW 2) */}
        {/* ------------------------------------------------------------ */}
        <div className="relative w-full bg-[#0a1424] px-0 py-0">
          {/* 3 Side-by-Side Vertical Videos - Flush with no gap, no rounded corners, no borders */}
          <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 w-full">
            {/* VIDEO SLOT 5 (Portrait Video 1) */}
            <div className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-none border-0 bg-[#0f172a] flex items-center justify-center">
              {CLOUDINARY_VIDEOS.slot5 ? (
                <AutoplayVideo
                  src={getCloudinaryVideoUrl(CLOUDINARY_VIDEOS.slot5)}
                  loop
                  muted
                  showSoundButton={true}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 50% 50%, rgba(0, 80, 200, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105 text-center px-4">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#ff8a00] text-[#0a1a3a] shadow-lg">
                      <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                      Video Slot 05
                    </span>
                    <span className="text-[11px] text-white/70">
                      Portrait 4:5 &bull; Paste Cloudinary URL in CLOUDINARY_VIDEOS.slot5
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/80">
                    4K Vertical
                  </div>
                </>
              )}
            </div>

            {/* VIDEO SLOT 6 (Portrait Video 2 - Center) */}
            <div className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-none border-0 bg-[#0f172a] flex items-center justify-center">
              {CLOUDINARY_VIDEOS.slot6 ? (
                <AutoplayVideo
                  src={getCloudinaryVideoUrl(CLOUDINARY_VIDEOS.slot6)}
                  loop
                  muted
                  showSoundButton={true}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 50% 50%, rgba(255, 138, 0, 0.35) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105 text-center px-4">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white text-[#0a1a3a] shadow-lg">
                      <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                      Video Slot 06
                    </span>
                    <span className="text-[11px] text-white/70">
                      Portrait 4:5 &bull; Paste Cloudinary URL in CLOUDINARY_VIDEOS.slot6
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/80">
                    4K Vertical
                  </div>
                </>
              )}
            </div>

            {/* VIDEO SLOT 7 (Portrait Video 3 - Right) */}
            <div className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-none border-0 bg-[#0f172a] flex items-center justify-center">
              {CLOUDINARY_VIDEOS.slot7 ? (
                <AutoplayVideo
                  src={getCloudinaryVideoUrl(CLOUDINARY_VIDEOS.slot7)}
                  loop
                  muted
                  showSoundButton={true}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 50% 50%, rgba(255, 138, 0, 0.3) 0%, rgba(15, 23, 42, 0.95) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105 text-center px-4">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#ff8a00] text-[#0a1a3a] shadow-lg">
                      <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                      Video Slot 07
                    </span>
                    <span className="text-[11px] text-white/70">
                      Portrait 4:5 &bull; Paste Cloudinary URL in CLOUDINARY_VIDEOS.slot7
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/80">
                    4K Vertical
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom decorative cream curve matching Image 1 footer */}
          <div className="pointer-events-none mt-8 flex justify-center">
            <div className="h-6 w-36 sm:h-8 sm:w-52 rounded-t-full bg-[#f6efe0] opacity-80" />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. GRAPHIC DESIGNS SECTION */}
      {/* ============================================================== */}
      <GraphicDesignsSection
        designs={GRAPHIC_DESIGNS}
        displayClassName={display.className}
        scriptClassName={script.className}
      />

      {/* ============================================================== */}
      {/* 6. CONTACT / FOOTER */}
      {/* ============================================================== */}
      <footer
        id="contact"
        style={{ background: "#f6efe0" }}
        className="relative z-10 scroll-mt-4"
      >
        {/* Wave transition from cream graphic designs section into dark navy footer */}
        <svg
          aria-hidden
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="-mb-px block h-16 w-full sm:h-20 md:h-28"
        >
          <path
            d="M0 60 C240 0 480 120 760 70 C1040 20 1240 100 1440 40 L1440 120 L0 120 Z"
            fill="#0a1a3a"
          />
        </svg>

        <div className="bg-[#0a1a3a] px-6 py-16 text-[#f6efe0] sm:px-12 sm:py-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#ff8a00]">
                Let&apos;s Connect
              </span>
              <h3 className={`${display.className} mt-2 text-3xl uppercase tracking-tight sm:text-5xl`}>
                Mohd. Misfar
              </h3>
              <p className="mt-2 text-sm text-[#f6efe0]/80">
                Video Editor &bull; Colorist &bull; Graphic Designer
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 sm:items-end">
              <ConnectButton
                whatsappNumber="918136902028"
                email="misfaryusaf@gmail.com"
              />
              <span className="text-xs text-[#f6efe0]/60">
                &copy; 2026 Mohd. Misfar &bull; All Rights Reserved
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Band({
  id,
  title,
  sub,
  bg,
  fg,
  ghost,
  side,
  n,
  prev,
}: (typeof SERVICES)[number] & { n: number; prev: string }) {
  const isRight = side === "right";

  return (
    <div id={id} style={{ background: prev }} className="scroll-mt-4">
      {/* Smooth Wavy Connecting SVG */}
      <svg
        aria-hidden
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="-mb-px block h-16 w-full sm:h-20 md:h-28 lg:h-36"
      >
        <path
          d="M0 60 C240 0 480 120 760 70 C1040 20 1240 100 1440 40 L1440 120 L0 120 Z"
          fill={bg}
        />
      </svg>

      {/* Band Body */}
      <div
        style={{ background: bg, color: fg }}
        className="relative overflow-hidden px-6 py-20 sm:px-12 sm:py-28 md:px-20 md:py-36 lg:px-28 lg:py-44"
      >
        <div className="relative mx-auto flex w-full max-w-7xl items-center">
          {/* Giant Ghost Number - Positioned on the active side */}
          <span
            aria-hidden
            style={{ color: ghost }}
            className={`${display.className} pointer-events-none absolute top-1/2 -translate-y-1/2 select-none text-[18rem] font-bold leading-none sm:text-[24rem] md:text-[32rem] lg:text-[40rem] ${isRight
              ? "right-0 sm:right-4 md:right-12 lg:right-20"
              : "left-0 sm:left-4 md:left-12 lg:left-20"
              }`}
          >
            {n}
          </span>

          {/* Text Lockup - Anchored to the exact same side as the Ghost Number */}
          <div
            className={`relative z-10 flex w-full ${isRight
              ? "justify-end pr-2 sm:pr-6 md:pr-16 lg:pr-24"
              : "justify-start pl-2 sm:pl-6 md:pl-16 lg:pl-24"
              }`}
          >
            <h2 className="relative flex flex-col items-start select-none">
              <span
                className={`${display.className} text-6xl uppercase tracking-tight sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9]`}
              >
                {title}
              </span>
              <span
                className={`${script.className} -mt-2 sm:-mt-4 md:-mt-6 lg:-mt-8 pl-6 sm:pl-10 md:pl-16 lg:pl-20 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none`}
              >
                {sub}
              </span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
