"use client";

import { useEffect, useRef, useState } from "react";

interface AutoplayVideoProps {
  src: string;
  className?: string;
  containerClassName?: string;
  loop?: boolean;
  muted?: boolean;
  showSoundButton?: boolean;
  hoverPlaySound?: boolean;
}

export default function AutoplayVideo({
  src,
  className = "h-full w-full object-cover",
  containerClassName = "absolute inset-0 h-full w-full",
  loop = true,
  muted = true,
  showSoundButton = true,
  hoverPlaySound = false,
}: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Autoplay handler: Works reliably across both desktop and mobile iOS/Android
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attributes required for iOS Safari & Android Chrome autoplay policies
    video.muted = isMuted;
    video.defaultMuted = isMuted;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Attempt autoplay
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch(() => {
                  // Fallback: Ensure strictly muted and retry (required by mobile browsers)
                  video.muted = true;
                  video.defaultMuted = true;
                  setIsMuted(true);
                  video
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(() => {});
                });
            }
          } else {
            // Pause when scrolled out of view to save battery and memory
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, isMuted]);

  // Desktop Hover: Unmute audio on hover
  const handleMouseEnter = async () => {
    if (!hoverPlaySound) return;
    setIsHovered(true);

    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      setIsMuted(false);
      await video.play();
      setIsPlaying(true);
    } catch {
      // If browser blocks unmuted audio before user interaction:
      try {
        if (video) {
          video.muted = true;
          setIsMuted(true);
          await video.play();
          setIsPlaying(true);
        }
      } catch {
        // Silently catch autoplay errors
      }
    }
  };

  // Desktop Hover Leave: Mute audio when mouse leaves
  const handleMouseLeave = () => {
    if (!hoverPlaySound) return;
    setIsHovered(false);

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    setIsMuted(true);
  };

  // Tap on mobile or click to toggle audio
  const handleContainerClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      setIsMuted(false);
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      // Toggle sound
      const nextMuted = !isMuted;
      video.muted = nextMuted;
      video.defaultMuted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    videoRef.current.defaultMuted = nextMuted;
    setIsMuted(nextMuted);
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  if (!src) return null;

  return (
    <div
      className={`relative cursor-pointer select-none overflow-hidden ${containerClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop={loop}
        muted={isMuted}
        playsInline
        preload="auto"
        className={className}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Audio Status Indicator (Desktop Hover or Mobile Unmute) */}
      {!isMuted && isPlaying && (
        <div className="pointer-events-none absolute bottom-3 right-3 z-30 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase text-white backdrop-blur-md transition-all duration-300">
          <span className="flex h-2 w-2 items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          </span>
          <span>Audio On</span>
        </div>
      )}

      {/* Floating Sound Toggle Button */}
      {showSoundButton && isMuted && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label="Tap to unmute"
          title="Tap to unmute"
          className="absolute bottom-3 right-3 z-30 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:border-white shadow-md"
        >
          <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        </button>
      )}
    </div>
  );
}
