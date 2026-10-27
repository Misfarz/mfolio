"use client";

import { useEffect, useId, useRef, useState, useCallback } from "react";

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
  const instanceId = useId();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mute video helper
  const muteVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    setIsMuted(true);
  }, []);

  // Unmute and play helper (with automatic audio coordination across slots)
  const unmuteAndPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    // Coordinate: tell all other video slots on the page to mute
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio-video-audio-activated", {
          detail: { id: instanceId },
        })
      );
    }

    video.muted = false;
    video.defaultMuted = false;
    setIsMuted(false);

    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      // If mobile browser blocks unmuted playback before first touch:
      // Play muted immediately, and unlock audio as soon as the user touches/scrolls the screen
      try {
        video.muted = true;
        video.defaultMuted = true;
        setIsMuted(true);
        await video.play();
        setIsPlaying(true);

        const unlockOnTouch = () => {
          window.removeEventListener("touchstart", unlockOnTouch);
          window.removeEventListener("pointerdown", unlockOnTouch);
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.muted = false;
            videoRef.current.defaultMuted = false;
            setIsMuted(false);
          }
        };

        window.addEventListener("touchstart", unlockOnTouch, {
          once: true,
          passive: true,
        });
        window.addEventListener("pointerdown", unlockOnTouch, {
          once: true,
          passive: true,
        });
      } catch {
        // Silently catch autoplay errors
      }
    }
  }, [instanceId]);

  // Listen for audio activation from other slots -> mute this one to prevent sound overlap
  useEffect(() => {
    const handleOtherAudio = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id !== instanceId) {
        if (videoRef.current && !videoRef.current.muted) {
          videoRef.current.muted = true;
          videoRef.current.defaultMuted = true;
          setIsMuted(true);
        }
      }
    };

    window.addEventListener("portfolio-video-audio-activated", handleOtherAudio);
    return () => {
      window.removeEventListener("portfolio-video-audio-activated", handleOtherAudio);
    };
  }, [instanceId]);

  // 1. Base Autoplay & Viewport Intersection (Play when in view, pause when scrolled away)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.defaultMuted = isMuted;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch(() => {
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
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, isMuted]);

  // 2. Mobile View Scroll Detection: Auto-play with audio when centered in mobile viewport
  useEffect(() => {
    if (!hoverPlaySound) return;
    const container = containerRef.current;
    if (!container) return;

    const isMobileDevice = () => {
      if (typeof window === "undefined") return false;
      return (
        window.innerWidth < 1024 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window
      );
    };

    // Observer focused on the middle 50% of the mobile screen
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!isMobileDevice()) return;

          if (entry.isIntersecting) {
            // Scrolled into central focus on mobile -> Play with audio!
            unmuteAndPlay();
          } else {
            // Scrolled out of central focus on mobile -> Mute immediately
            muteVideo();
          }
        });
      },
      {
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0.2,
      }
    );

    scrollObserver.observe(container);
    return () => scrollObserver.disconnect();
  }, [hoverPlaySound, unmuteAndPlay, muteVideo]);

  // Desktop Hover Handlers (Only active on fine pointer devices / desktop)
  const handleMouseEnter = () => {
    if (!hoverPlaySound) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    unmuteAndPlay();
  };

  const handleMouseLeave = () => {
    if (!hoverPlaySound) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    muteVideo();
  };

  // Direct Tap / Click Toggle
  const handleContainerClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted || video.paused) {
      unmuteAndPlay();
    } else {
      muteVideo();
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      unmuteAndPlay();
    } else {
      muteVideo();
    }
  };

  if (!src) return null;

  return (
    <div
      ref={containerRef}
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



      {/* Floating Sound Button when Muted */}
      {showSoundButton && isMuted && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label="Tap to unmute"
          title="Tap to unmute"
          className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md transition-all hover:bg-white hover:text-black hover:border-white shadow-md active:scale-95"
        >
          <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
          <span className="text-[10px] uppercase font-mono tracking-wider">Sound</span>
        </button>
      )}
    </div>
  );
}
