"use client";

import { useState, useRef, useEffect } from "react";

interface ConnectButtonProps {
  whatsappNumber?: string;
  email?: string;
}

export default function ConnectButton({
  whatsappNumber = "918136902028",
  email = "misfaryusaf@gmail.com",
}: ConnectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // WhatsApp formatted link
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hi Misfar! I saw your portfolio and would like to discuss a project."
  )}`;
  const mailUrl = `mailto:${email}?subject=${encodeURIComponent(
    "Project Inquiry - Mohd. Misfar Portfolio"
  )}`;

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Popover / Options Menu (Opens upwards above the button) */}
      <div
        className={`absolute bottom-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mb-3 z-40 w-72 rounded-2xl border border-white/15 bg-[#070e1b]/95 p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 origin-bottom ${
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto translate-y-0"
            : "scale-95 opacity-0 pointer-events-none translate-y-2"
        }`}
      >
        <div className="px-2 pt-1 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Choose Communication
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* WhatsApp Option */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/item flex items-center gap-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 transition-all hover:border-emerald-400 hover:bg-emerald-500/20 hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white shadow-md">
              {/* WhatsApp SVG Icon */}
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.761.815 2.796.815 3.182 0 5.77-2.587 5.77-5.767 0-3.18-2.587-5.766-5.77-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.385-.45-4.821-1.238l-4.679 1.226 1.251-4.557c-.895-1.493-1.42-3.237-1.42-5.101 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1 text-left">
              <span className="block text-xs font-bold text-white group-hover/item:text-emerald-300">
                WhatsApp
              </span>
              <span className="block truncate text-[11px] text-white/70">
                +91 81369 02028
              </span>
            </div>
            <svg
              className="h-4 w-4 text-white/40 transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-emerald-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>

          {/* Email Option */}
          <a
            href={mailUrl}
            className="group/item flex items-center gap-3.5 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 transition-all hover:border-sky-400 hover:bg-sky-500/20 hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EA4335] text-white shadow-md">
              {/* Mail / Gmail SVG Icon */}
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1 text-left">
              <span className="block text-xs font-bold text-white group-hover/item:text-sky-300">
                Email
              </span>
              <span className="block truncate text-[11px] text-white/70">
                {email}
              </span>
            </div>
            <svg
              className="h-4 w-4 text-white/40 transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-sky-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        {/* Small downward pointer triangle */}
        <div className="absolute -bottom-1.5 right-8 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 h-3 w-3 rotate-45 border-r border-b border-white/15 bg-[#070e1b]" />
      </div>

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="group relative inline-flex items-center gap-2.5 rounded-full bg-[#ff8a00] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[#0050c8] shadow-lg transition-all hover:bg-[#f6efe0] hover:scale-105 active:scale-95"
      >
        <span>Get In Touch</span>
        <svg
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#0050c8]" : "text-[#0050c8]"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
}
