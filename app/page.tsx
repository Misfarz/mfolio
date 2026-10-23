"use client";

import { useEffect, useRef, useState } from "react";
import AutoplayVideo from "@/components/AutoplayVideo";
import { getCloudinaryVideoUrl } from "@/lib/cloudinary";

/* =====================================================================
   CONTENT & MEDIA CONFIGURATION
   ===================================================================== */
export const CLOUDINARY_VIDEOS = {
  // Video 1: Featured Showreel (Slot 01)
  hero: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791300389/hero2.mov",

  // Videos 2, 3, 4: Portrait / Vertical Slots
  slot2: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1792755524/adidas.mp4",
  slot3: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1792755883/effort.mp4",
  slot4: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791303926/slot_4.mov",

  // Videos 5, 6, 7: Portrait / Vertical Slots
  slot5: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791302786/slot333.mov",
  slot6: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791300961/slot_2.mov",
  slot7: "https://res.cloudinary.com/oc4pkoeu/video/upload/v1791305821/jifan.mov",
};

const stats = [
  { n: "25+", l: "Projects done" },
  { n: "2+", l: "Years of experience" },
  { n: "12+", l: "Recognitions" },
  { n: "98%", l: "Happy clients" },
];

const steps = [
  {
    t: "Discover and analysis",
    d: "We begin by immersing ourselves in your story, vision, and goals. Through thoughtful conversations and collaborative brainstorming, we uncover the unique elements that make you stand out. This step focuses on understanding your audience and crafting a strategic plan tailored to your personal or professional brand.",
  },
  {
    t: "Concept and direction",
    d: "Moodboards, style frames, pacing references and interactive prototypes turn the plan into a clear visual direction you can react to before anything is finalized.",
  },
  {
    t: "Create and deliver",
    d: "Shooting, editing, color grading, UI/UX and frontend engineering are finished to precision and delivered in every format you need for web, cinema and digital platforms.",
  },
];

const experience = [
  { co: "Decathlon", role: "Media content creator", yr: "2023 - 2024" },
  { co: "Frontend & UI/UX", role: "Frontend engineer & UI designer", yr: "2023 - Present" },
  { co: "Freelance", role: "Video editor & colorist", yr: "2023 - Present" },
];

const services = [
  { n: "01", t: "Videography & Editing", d: "Cinematic cuts, short-form reels, pacing & sound design" },
  { n: "02", t: "Color Grading", d: "DaVinci Resolve finishing, color science & film mood matching" },
  { n: "03", t: "Graphic Design", d: "High-CTR thumbnails, posters, brand marks & typography" },
  { n: "04", t: "UI/UX (Frontend Engineer)", d: "Modern web interfaces, responsive design, React & Next.js engineering" },
];

const verticalVideos = [
  { id: "02", label: "Adidas Commercial", sub: "Motion & Rhythm", src: CLOUDINARY_VIDEOS.slot2 },
  { id: "03", label: "Effort Narrative", sub: "Color Science", src: CLOUDINARY_VIDEOS.slot3 },
  { id: "04", label: "Short Film Cut", sub: "Character Narrative", src: CLOUDINARY_VIDEOS.slot4 },
  { id: "05", label: "Brand Narrative", sub: "Dynamic Flow", src: CLOUDINARY_VIDEOS.slot5 },
  { id: "06", label: "Creative Montage", sub: "Kinetic Pace", src: CLOUDINARY_VIDEOS.slot6 },
  { id: "07", label: "Visual Storytelling", sub: "High Contrast", src: CLOUDINARY_VIDEOS.slot7 },
];

/* =====================================================================
   SMALL REUSABLE PIECES
   ===================================================================== */
const Rule = () => <div className="mx-[1.5vw] h-px bg-[var(--line)]" />;

function Clock() {
  const [t, setT] = useState("00:00:00");
  useEffect(() => {
    const tick = () =>
      setT(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="f-md text-[clamp(13px,1vw,18px)] uppercase text-[var(--mute)]">
      Local/<span className="tabular-nums text-white/90">{t}</span>
    </span>
  );
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const m = (e: MouseEvent) => {
      if (ref.current)
        ref.current.style.transform = `translate(${e.clientX - 10}px,${e.clientY - 10}px)`;
    };
    addEventListener("mousemove", m);
    return () => removeEventListener("mousemove", m);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-5 w-5 rounded-full bg-white mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block"
    />
  );
}

function Float({
  speed,
  className,
  children,
}: {
  speed: number;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      el.style.transform = `translate3d(0,${
        (r.top + r.height / 2 - window.innerHeight / 2) * speed
      }px,0)`;
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [speed]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

const Photo = ({
  src,
  className = "",
  alt = "Portfolio Visual",
}: {
  src: string;
  className?: string;
  alt?: string;
}) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={`rounded-[24px] bg-[#161616] object-cover shadow-2xl border border-[var(--line)] ${className}`}
  />
);

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const PinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[26px] w-[26px] text-[#22c55e]" {...stroke}>
    <path d="M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z" />
    <circle cx="12" cy="11" r="2.2" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 48 24" className="h-[26px] w-[52px] text-white" {...stroke}>
    <ellipse cx="24" cy="12" rx="22" ry="10" />
    <ellipse cx="24" cy="12" rx="10" ry="10" />
    <ellipse cx="24" cy="12" rx="4" ry="10" />
    <path d="M2 12h44M5 7h38M5 17h38M24 2v20" />
  </svg>
);

const BadgeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[26px] w-[26px] text-[#0ea5e9]" {...stroke}>
    <path d="M12 2l2.4 1.7 2.9-.2 1.2 2.7 2.4 1.7-.7 2.8.7 2.8-2.4 1.7-1.2 2.7-2.9-.2L12 22l-2.4-1.7-2.9.2-1.2-2.7-2.4-1.7.7-2.8-.7-2.8 2.4-1.7 1.2-2.7 2.9.2z" />
    <path d="M8 12l2.7 2.7L16 9.5" />
  </svg>
);

/* =====================================================================
   HERO — dynamic sizing to auto-fit viewport width
   ===================================================================== */
function Hero() {
  const m = useRef<HTMLSpanElement>(null);
  const [fs, setFs] = useState(0);

  useEffect(() => {
    const fit = () => {
      const w = m.current?.getBoundingClientRect().width;
      if (w) setFs((100 * document.documentElement.clientWidth * 0.955) / w);
    };
    fit();
    document.fonts?.ready?.then(fit);
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  return (
    <section className="relative px-[1.5vw] pb-[3vw] pt-[4.2vw]">
      {/* Measure target (widest word) */}
      <span
        ref={m}
        aria-hidden
        className="f-xl invisible absolute left-0 top-0 whitespace-nowrap text-[100px]"
      >
        MISFAR
      </span>
      <h1
        className="f-xl select-none text-center leading-[0.84]"
        style={{ fontSize: fs ? `${fs}px` : "16vw" }}
      >
        <span className="block">MOHD.</span>
        <span className="block">MISFAR</span>
      </h1>
    </section>
  );
}

/* =====================================================================
   MAIN PAGE
   ===================================================================== */
export default function Home() {
  const [step, setStep] = useState(0);

  return (
    <div className="tex relative min-h-screen overflow-x-clip text-white antialiased selection:bg-white selection:text-black">
      <Cursor />

      {/* Subtle vertical grid lines (behind everything) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <i className="absolute inset-y-0 left-1/2 w-px bg-[var(--line)]" />
        <i className="absolute inset-y-0 left-[23.6%] hidden w-px bg-[var(--line)] md:block" />
        <i className="absolute inset-y-0 left-[76.4%] hidden w-px bg-[var(--line)] md:block" />
      </div>

      <div className="relative z-10">
        {/* ---------- Header ---------- */}
        <header className="flex items-center justify-between px-[3.3vw] py-[0.8vw] max-md:py-3.5">
          <Clock />

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#films"
              className="f-md text-[clamp(12px,0.86vw,15px)] uppercase text-[var(--mute)] hover:text-white transition-colors"
            >
              Films
            </a>
            <a
              href="#services"
              className="f-md text-[clamp(12px,0.86vw,15px)] uppercase text-[var(--mute)] hover:text-white transition-colors"
            >
              Services
            </a>
            <a
              href="#experience"
              className="f-md text-[clamp(12px,0.86vw,15px)] uppercase text-[var(--mute)] hover:text-white transition-colors"
            >
              Experience
            </a>
            <a
              href="#about"
              className="f-md text-[clamp(12px,0.86vw,15px)] uppercase text-[var(--mute)] hover:text-white transition-colors"
            >
              About
            </a>
          </nav>

          <a
            href="#contact"
            className="f-md flex h-[clamp(40px,2.8vw,54px)] items-center rounded-full border border-white px-[clamp(18px,1.4vw,28px)] text-[clamp(13px,1vw,18px)] uppercase transition-all duration-300 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Contact now
          </a>
        </header>
        <Rule />

        {/* ---------- Hero ---------- */}
        <Hero />
        <Rule />

        {/* ---------- Info strip ---------- */}
        <section className="relative flex flex-col items-center gap-8 py-10 md:block md:h-[9.2vw] md:py-0">
          {[
            { i: <PinIcon />, a: "Based in Kerala,", b: "India", x: "13.8%" },
            { i: <GlobeIcon />, a: "Available all around", b: "Worldwide", x: "50%" },
            { i: <BadgeIcon />, a: "Video Editor &", b: "UI/UX (Frontend Engineer)", x: "86.2%" },
          ].map((s) => (
            <div
              key={s.a}
              style={{ left: s.x }}
              className="flex flex-col items-center gap-[0.8vw] text-center max-md:gap-3 md:absolute md:top-[2.2vw] md:-translate-x-1/2"
            >
              {s.i}
              <p className="f-md text-[clamp(13px,0.86vw,16px)] uppercase leading-[1.18]">
                {s.a}
                <br />
                <span className="text-[var(--mute)]">{s.b}</span>
              </p>
            </div>
          ))}
        </section>
        <Rule />

        {/* ---------- Intro ---------- */}
        <section id="about" className="grid px-[3.3vw] pb-[8vw] pt-[10vw] md:grid-cols-4 scroll-mt-6">
          <h2 className="f-xl text-[10.5vw] leading-[0.86] md:col-span-3 md:text-[5.2vw]">
            I'm Mohd. Misfar<br className="hidden md:block" /> based in Kerala,<br className="hidden md:block" /> India.
          </h2>
          <p className="f-tx mt-8 max-w-[19rem] self-end pl-0 text-[clamp(16px,1.16vw,22px)] leading-[1.2] text-[var(--mute)] md:col-start-4 md:mt-0 md:pl-[0.6vw]">
            Focused on creating clean, engaging, and visually impactful digital experiences across video editing, cinematic color grading, and UI/UX frontend engineering.
          </p>
        </section>

        {/* ---------- Process (Interactive tab dots) ---------- */}
        <section className="pb-[12vw] max-md:px-[3.3vw] md:grid md:grid-cols-[47.6vw_1fr]">
          <div
            role="tablist"
            aria-label="Process steps"
            className="flex h-fit gap-[10px] pt-3 max-md:mb-6 md:pl-[33.3vw]"
          >
            {steps.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={step === i}
                aria-label={`Step ${i + 1}`}
                onClick={() => setStep(i)}
                className={`h-[11px] w-[11px] rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  step === i ? "bg-white scale-125" : "bg-[#333333] hover:bg-[#666666]"
                }`}
              />
            ))}
          </div>
          <div className="max-w-[46vw] pr-[3.3vw] max-md:max-w-none">
            <h3 className="f-xl text-[clamp(20px,1.6vw,30px)] leading-none">
              {steps[step].t}
            </h3>
            <p className="f-tx mt-[1.4vw] text-[clamp(16px,1.2vw,22px)] font-medium leading-[1.26] text-[var(--mute)] max-md:mt-4">
              {steps[step].d}
            </p>
          </div>
        </section>

        {/* ---------- Statement with floating photos & signature ---------- */}
        <section className="flex flex-col items-center px-[4vw] pb-[10vw] pt-[6vw]">
          <div className="relative w-full">
            <Float
              speed={0.1}
              className="absolute -top-[6vw] left-[16.2vw] z-10 hidden md:block"
            >
              <Photo src="/images/planet.jpg" className="h-[13vw] w-[17.4vw]" />
            </Float>
            <Float
              speed={-0.14}
              className="absolute -top-[11.6vw] left-[66.5vw] z-10 hidden md:block"
            >
              <Photo src="/images/car.jpg" className="h-[18.4vw] w-[17.4vw]" />
            </Float>
            <p className="f-xl mx-auto max-w-[82vw] text-center text-[7.4vw] leading-[0.84] md:text-[3.05vw]">
              Freelance creative professional based in
              <br className="hidden md:block" /> Kerala, India, guiding
              <br className="hidden md:block" /> creators &amp; brands achieve their vision in
              <br className="hidden md:block" /> video, UI/UX and frontend engineering.
            </p>
          </div>

          {/* Minimal Cursive Signature */}
          <div
            className="mt-[3.6vw] select-none text-[clamp(56px,5.2vw,100px)] leading-none text-white/95"
            style={{ fontFamily: "'Mrs Saint Delafield', cursive" }}
          >
            Misfar
          </div>

          <div className="relative mt-[2.5vw] h-[13vw] w-[17.4vw] max-md:h-48 max-md:w-64">
            <Float speed={0.06} className="absolute inset-0">
              <Photo src="/images/gallery.jpg" className="h-full w-full" />
            </Float>
          </div>
        </section>

        {/* ---------- Stats ---------- */}
        <section className="overflow-hidden">
          <div className="grid grid-cols-2 gap-y-10 px-[4.6vw] pb-[2.6vw] pt-[4vw] md:grid-cols-[repeat(3,25.1vw)_auto] md:pr-0">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="f-xl text-[14vw] leading-[0.9] md:text-[5.6vw]">
                  {s.n}
                </div>
                <div className="f-md mt-[1.9vw] text-[clamp(12px,0.85vw,16px)] uppercase text-[var(--mute)] max-md:mt-3">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </section>
        <Rule />

        {/* ==============================================================
            SELECTED FILMS (ALL 7 CURRENT VIDEOS MATCHING NEW AESTHETICS)
            ============================================================== */}
        <section id="films" className="px-[3.3vw] pb-[10vw] pt-[10vw] scroll-mt-6">
          <div className="grid pb-[5vw] md:grid-cols-4">
            <h2 className="f-xl text-[14vw] leading-[0.82] md:col-span-3 md:text-[7vw]">
              Selected<br />Films
            </h2>
            <p className="f-tx mt-6 max-w-[20rem] self-end pl-0 text-[clamp(16px,1.16vw,22px)] leading-[1.2] text-[var(--mute)] md:col-start-4 md:mt-0 md:pl-[0.3vw]">
              Direction, editing, and cinematic color grading across commercials, short-form reels, and brand stories.
            </p>
          </div>

          {/* 1. Featured Widescreen Reel (Slot 01) */}
          <div className="relative mb-[4vw] overflow-hidden rounded-[24px] border border-[var(--line)] bg-[#0c0c0c]">
            <div className="relative aspect-[16/9] w-full max-h-[780px]">
              <AutoplayVideo
                src={getCloudinaryVideoUrl(CLOUDINARY_VIDEOS.hero)}
                loop
                muted
                showSoundButton={true}
                className="h-full w-full object-cover"
                containerClassName="absolute inset-0 h-full w-full"
              />
              {/* Minimal Top Badges */}
              <div className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-3 sm:top-6 sm:left-6">
                <span className="f-md rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] sm:text-xs tracking-wider uppercase backdrop-blur-md">
                  01 / Featured Reel
                </span>
                <span className="f-md hidden sm:inline-block rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] tracking-wider uppercase text-[var(--mute)] backdrop-blur-md">
                  4K Master Cut
                </span>
              </div>
            </div>
          </div>

          {/* 2. Vertical / Portrait Videos Grid (Slots 02 to 07) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2vw]">
            {verticalVideos.map((v) => (
              <div
                key={v.id}
                className="group relative flex flex-col rounded-[22px] border border-[var(--line)] bg-[#0a0a0a] overflow-hidden transition-all duration-300 hover:border-white/30"
              >
                {/* Header Bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)] bg-[#070707]">
                  <span className="f-md text-xs sm:text-sm text-[var(--mute)]">
                    {v.id}
                  </span>
                  <span className="f-md text-[11px] sm:text-xs uppercase tracking-wider text-white/90">
                    {v.label}
                  </span>
                </div>

                {/* Vertical Video Viewport */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#000000]">
                  <AutoplayVideo
                    src={getCloudinaryVideoUrl(v.src)}
                    loop
                    muted
                    showSoundButton={true}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    containerClassName="absolute inset-0 h-full w-full"
                  />
                </div>

                {/* Footer Subtitle */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--line)] bg-[#070707]">
                  <span className="f-tx text-xs text-[var(--mute)]">
                    {v.sub}
                  </span>
                  <span className="f-md text-[10px] uppercase tracking-widest text-white/50">
                    Vertical Reel
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Rule />

        {/* ---------- Experience ---------- */}
        <section id="experience" className="grid px-[3.3vw] pb-[8vw] pt-[12vw] max-md:pt-[14vw] md:grid-cols-[36.4vw_1fr] scroll-mt-6">
          <h2 className="f-xl text-[clamp(28px,2.25vw,44px)] leading-none max-md:mb-8">
            Experience
          </h2>
          <div className="tex md:-mr-[3.3vw] md:pr-[3.3vw]">
            {experience.map((e) => (
              <div
                key={e.co + e.role}
                className="flex flex-wrap items-start justify-between gap-6 border-t border-[var(--line)] pb-[3.4vw] pt-[3.9vw] max-md:pt-8"
              >
                <div>
                  <h3 className="f-xl text-[clamp(24px,1.7vw,32px)] leading-none">
                    {e.co}
                  </h3>
                  <p className="f-md mt-[2.4vw] max-w-[14em] text-[clamp(12px,0.86vw,16px)] uppercase leading-[1.2] text-[var(--mute)] max-md:mt-5">
                    {e.role}
                  </p>
                </div>
                <span className="f-md mt-[2.7vw] text-[clamp(12px,0.86vw,16px)] tracking-[.04em] text-[var(--mute)] max-md:mt-0">
                  {e.yr}
                </span>
              </div>
            ))}
          </div>
        </section>
        <Rule />

        {/* ---------- Services ---------- */}
        <section id="services" className="scroll-mt-6">
          <div className="grid px-[3.3vw] pb-[5.4vw] pt-[11vw] md:grid-cols-4">
            <h2 className="f-xl text-[17vw] leading-[0.8] md:col-span-3 md:text-[7.4vw]">
              Pro<br />Services
            </h2>
            <p className="f-tx mt-8 max-w-[19rem] self-end pl-0 text-[clamp(16px,1.27vw,24px)] leading-[1.15] text-[var(--mute)] md:col-start-4 md:mt-0 md:pl-[0.3vw]">
              Discover our range of creative and engineering services tailored to elevate your personal or brand vision to the next level.
            </p>
          </div>
          <ul className="tex mx-[3.3vw] mb-[10vw] md:ml-[40.6vw]">
            {services.map((s) => (
              <li
                key={s.n + s.t}
                className="grid grid-cols-[3.5rem_1fr] border-t border-[var(--line)] pb-[2.4vw] pt-[2vw] max-md:py-6 md:grid-cols-[7.95vw_1fr]"
              >
                <span className="f-md text-[clamp(12px,0.86vw,16px)] text-[var(--mute)]">
                  {s.n}
                </span>
                <div>
                  <h3 className="f-tx text-[clamp(20px,1.27vw,24px)] font-medium leading-[1.05]">
                    {s.t}
                  </h3>
                  <p className="f-md mt-[0.35vw] text-[clamp(11px,0.82vw,16px)] font-medium uppercase tracking-[.02em] text-[var(--mute)]">
                    {s.d}
                  </p>
                </div>
              </li>
            ))}
            <li className="border-t border-[var(--line)]" aria-hidden />
          </ul>
        </section>
        <Rule />

        {/* ---------- Footer / Contact ---------- */}
        <footer id="contact" className="px-[3.3vw] pb-12 pt-[8vw] scroll-mt-6">
          <a
            href="mailto:misfaryusaf@gmail.com"
            className="f-xl block text-[12vw] leading-[0.82] transition-colors hover:text-[var(--mute)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white"
          >
            Let's talk
          </a>

          {/* Quick Communication Actions */}
          <div className="mt-[4vw] flex flex-wrap items-center gap-4">
            <a
              href="https://wa.me/918136902028?text=Hi%20Misfar!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="f-md flex h-12 items-center rounded-full border border-white/30 px-6 text-sm uppercase tracking-wider transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              WhatsApp (+91 81369 02028)
            </a>
            <a
              href="mailto:misfaryusaf@gmail.com?subject=Project%20Inquiry%20-%20Mohd.%20Misfar"
              className="f-md flex h-12 items-center rounded-full border border-white/30 px-6 text-sm uppercase tracking-wider transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Email (misfaryusaf@gmail.com)
            </a>
          </div>

          <div className="f-md mt-[6vw] flex flex-wrap justify-between gap-4 text-[clamp(12px,0.86vw,16px)] uppercase text-[var(--mute)] border-t border-[var(--line)] pt-6">
            <span>&copy; {new Date().getFullYear()} Mohd. Misfar</span>
            <span>Video Editor &bull; Colorist &bull; UI/UX &bull; Frontend Engineer</span>
            <span>Kerala, India</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
