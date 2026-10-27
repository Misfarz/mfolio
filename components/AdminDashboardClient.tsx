"use client";

import { useState, useTransition } from "react";
import { VideoSlot } from "@/lib/redis";
import {
  addVideoSlotAction,
  deleteVideoSlotAction,
  editVideoSlotAction,
  reorderVideoSlotsAction,
  verifyAdminPasswordAction,
} from "@/app/actions/video-actions";
import { getCloudinaryVideoUrl } from "@/lib/cloudinary";

interface Props {
  initialVideos: VideoSlot[];
}

export default function AdminDashboardClient({ initialVideos }: Props) {
  // Authentication State
  const [password, setPassword] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("mfolio_admin_pw") || "";
    }
    return "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("mfolio_admin_authed") === "true";
    }
    return false;
  });
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Video State
  const [videos, setVideos] = useState<VideoSlot[]>(initialVideos);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [sub, setSub] = useState("");
  const [orientation, setOrientation] = useState<"vertical" | "landscape">("vertical");

  // Editing State
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editSub, setEditSub] = useState("");
  const [editOrientation, setEditOrientation] = useState<"vertical" | "landscape">("vertical");

  // Status & Feedback
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Handle Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await verifyAdminPasswordAction(loginInput);
    if (res.valid) {
      setPassword(loginInput);
      setIsAuthenticated(true);
      sessionStorage.setItem("mfolio_admin_pw", loginInput);
      sessionStorage.setItem("mfolio_admin_authed", "true");
    } else {
      setLoginError("Invalid password. Please check your .env.local setting.");
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPassword("");
    sessionStorage.removeItem("mfolio_admin_pw");
    sessionStorage.removeItem("mfolio_admin_authed");
  }

  // Handle Video Upload Form
  function handleAddVideo(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!url.trim()) {
      setMessage({ text: "Cloudinary link is required", isError: true });
      return;
    }
    if (!label.trim()) {
      setMessage({ text: "Label is required", isError: true });
      return;
    }
    if (!sub.trim()) {
      setMessage({ text: "Sub is required", isError: true });
      return;
    }

    startTransition(async () => {
      const res = await addVideoSlotAction({
        url,
        label,
        sub,
        orientation,
        password,
      });

      if (res.success && res.videos) {
        setVideos(res.videos);
        setUrl("");
        setLabel("");
        setSub("");
        setOrientation("vertical");
        setMessage({ text: res.message || "Video slot added successfully!" });
      } else {
        setMessage({ text: res.error || "Failed to add video slot", isError: true });
      }
    });
  }

  // Start Editing a Slot
  function startEditing(slot: VideoSlot) {
    setEditingSlotId(slot.id);
    setEditUrl(slot.src);
    setEditLabel(slot.label);
    setEditSub(slot.sub);
    setEditOrientation(slot.orientation || "vertical");
  }

  function cancelEditing() {
    setEditingSlotId(null);
  }

  // Save Slot Edit
  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSlotId) return;
    setMessage(null);

    startTransition(async () => {
      const res = await editVideoSlotAction({
        id: editingSlotId,
        url: editUrl,
        label: editLabel,
        sub: editSub,
        orientation: editOrientation,
        password,
      });

      if (res.success && res.videos) {
        setVideos(res.videos);
        setEditingSlotId(null);
        setMessage({ text: res.message || "Slot updated successfully!" });
      } else {
        setMessage({ text: res.error || "Failed to update slot", isError: true });
      }
    });
  }

  // Handle Reorder: Move Slot Earlier (up/left) or Later (down/right)
  function handleMove(currentIndex: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const newVideos = [...videos];
    const [movedItem] = newVideos.splice(currentIndex, 1);
    newVideos.splice(targetIndex, 0, movedItem);

    // Re-index slots starting from 01 sequentially
    const reindexed = newVideos.map((v, i) => ({
      ...v,
      id: i + 1 < 10 ? `0${i + 1}` : `${i + 1}`,
    }));

    setVideos(reindexed);

    startTransition(async () => {
      const res = await reorderVideoSlotsAction(reindexed, password);
      if (res.success && res.videos) {
        setVideos(res.videos);
        setMessage({ text: "Slot order updated successfully!" });
      } else {
        setMessage({ text: res.error || "Failed to update order", isError: true });
      }
    });
  }

  // Handle Delete
  function handleDelete(id: string) {
    if (!confirm(`Are you sure you want to delete video slot ${id}?`)) return;

    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteVideoSlotAction(id, password);
      if (res.success && res.videos) {
        setVideos(res.videos);
        setMessage({ text: `Video slot ${id} deleted.` });
      } else {
        setMessage({ text: res.error || "Failed to delete slot", isError: true });
      }
      setDeletingId(null);
    });
  }

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-root min-h-screen bg-[#070707] text-white flex items-center justify-center p-4">
        <style jsx global>{`
          .admin-root, .admin-root * {
            cursor: auto !important;
          }
        `}</style>
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#8b8b8b]">
              Admin Access
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
              Portfolio Dashboard
            </h1>
            <p className="mt-1 text-xs text-[#8b8b8b]">
              Enter admin password to manage video slots
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b8b8b] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors"
              />
            </div>

            {loginError && (
              <p className="text-xs font-medium text-red-400 bg-red-950/40 border border-red-800/40 rounded-lg p-2.5">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-white py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-neutral-200 active:scale-[0.98]"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-[#8b8b8b] hover:text-white transition-colors underline underline-offset-4"
            >
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root min-h-screen bg-[#070707] text-white pb-20">
      <style jsx global>{`
        .admin-root, .admin-root * {
          cursor: auto !important;
        }
      `}</style>

      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070707]/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-sm sm:text-base">
              Misfar / Admin
            </span>
            <span className="hidden sm:inline-block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-[#8b8b8b]">
              All Slots (Vertical & Landscape)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white hover:text-black transition-all flex items-center gap-1.5"
            >
              <span>View Portfolio</span>
              <span className="text-[10px]">↗</span>
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-[#8b8b8b] hover:text-white hover:bg-white/10 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10 space-y-8">
        {/* Upload Form Card */}
        <section className="rounded-2xl border border-white/10 bg-[#0e0e0e] p-5 sm:p-7 shadow-xl">
          <div className="mb-5 pb-3 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                Add New Video Slot
              </h2>
              <p className="text-xs text-[#8b8b8b] mt-0.5">
                Paste Cloudinary link, choose Vertical or Landscape, add label & sub.
              </p>
            </div>
            <span className="text-[11px] font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded">
              Next Slot: #{videos.length < 9 ? `0${videos.length + 1}` : `${videos.length + 1}`}
            </span>
          </div>

          <form onSubmit={handleAddVideo} className="space-y-4">
            {/* 1. Orientation Selector (Vertical / Landscape) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b8b8b] mb-1.5">
                Slot Format / Orientation <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrientation("vertical")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs sm:text-sm font-semibold transition-all ${
                    orientation === "vertical"
                      ? "border-white bg-white text-black shadow-md"
                      : "border-white/10 bg-black/40 text-neutral-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="text-base leading-none">▯</span>
                  <span>Vertical (Reel / 4:5)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrientation("landscape")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs sm:text-sm font-semibold transition-all ${
                    orientation === "landscape"
                      ? "border-white bg-white text-black shadow-md"
                      : "border-white/10 bg-black/40 text-neutral-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="text-base leading-none">▭</span>
                  <span>Landscape (Widescreen / 16:9)</span>
                </button>
              </div>
            </div>

            {/* 2. Cloudinary Link Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b8b8b] mb-1.5">
                Cloudinary Link <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/oc4pkoeu/video/upload/..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs sm:text-sm text-white placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors font-mono"
              />
            </div>

            {/* 3. Label & Sub */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b8b8b] mb-1.5">
                  Label (Title) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Kinetic Master Cut"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs sm:text-sm text-white placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8b8b8b] mb-1.5">
                  Sub (Description) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  placeholder="e.g. Motion & Rhythm"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs sm:text-sm text-white placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Feedback Message */}
            {message && (
              <div
                className={`p-3 rounded-xl text-xs font-medium border ${
                  message.isError
                    ? "bg-red-950/40 border-red-800/40 text-red-300"
                    : "bg-emerald-950/40 border-emerald-800/40 text-emerald-300"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-white py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span>Uploading to Portfolio...</span>
                </>
              ) : (
                <>
                  <span>+ Upload Video Slot</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Current Active Video Slots Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>All Portfolio Slots</span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-neutral-300">
                {videos.length}
              </span>
            </h3>
            <span className="text-[11px] text-[#8b8b8b]">
              Use ↑ ↓ to reorder &bull; Click "Edit" to modify
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
            {videos.map((item, index) => {
              const isLandscape = item.orientation === "landscape";
              const isEditing = editingSlotId === item.id;

              return (
                <div
                  key={item.id + item.src}
                  className={`group relative flex flex-col h-fit rounded-xl border bg-[#0d0d0d] overflow-hidden transition-all col-span-1 ${
                    isEditing
                      ? "border-emerald-500/60 ring-2 ring-emerald-500/20"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  {/* Clean Header Bar: Slot ID + Format Tag + Reorder Buttons */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-[#080808]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-neutral-200">
                        Slot {item.id}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        #{index + 1}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                          isLandscape
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                            : "bg-blue-500/15 text-blue-300 border border-blue-500/25"
                        }`}
                      >
                        {isLandscape ? "16:9" : "4:5"}
                      </span>
                    </div>

                    {/* Compact Reorder Arrows */}
                    <div className="flex items-center rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0 || isPending}
                        className="h-6 w-6 flex items-center justify-center text-xs text-neutral-300 hover:bg-white hover:text-black transition-colors disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-neutral-300 active:scale-90"
                        title={index === 0 ? "First slot" : "Move earlier"}
                      >
                        ↑
                      </button>
                      <div className="h-3 w-px bg-white/10" />
                      <button
                        type="button"
                        onClick={() => handleMove(index, "down")}
                        disabled={index === videos.length - 1 || isPending}
                        className="h-6 w-6 flex items-center justify-center text-xs text-neutral-300 hover:bg-white hover:text-black transition-colors disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-neutral-300 active:scale-90"
                        title={index === videos.length - 1 ? "Last slot" : "Move later"}
                      >
                        ↓
                      </button>
                    </div>
                  </div>

                  {/* Inline Edit Form OR Video Preview & Controls */}
                  {isEditing ? (
                    <form onSubmit={handleSaveEdit} className="p-3.5 bg-[#111111] space-y-3">
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Edit Slot {item.id}
                        </span>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="text-[11px] text-[#8b8b8b] hover:text-white"
                        >
                          ✕ Close
                        </button>
                      </div>

                      {/* Format Selector */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8b8b8b] mb-1">
                          Orientation
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditOrientation("vertical")}
                            className={`rounded-lg border py-1.5 text-xs font-medium transition-all ${
                              editOrientation === "vertical"
                                ? "border-white bg-white text-black font-semibold"
                                : "border-white/10 bg-black/40 text-neutral-400"
                            }`}
                          >
                            ▯ 4:5 Vertical
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditOrientation("landscape")}
                            className={`rounded-lg border py-1.5 text-xs font-medium transition-all ${
                              editOrientation === "landscape"
                                ? "border-white bg-white text-black font-semibold"
                                : "border-white/10 bg-black/40 text-neutral-400"
                            }`}
                          >
                            ▭ 16:9 Landscape
                          </button>
                        </div>
                      </div>

                      {/* Link */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8b8b8b] mb-1">
                          Cloudinary URL
                        </label>
                        <input
                          type="text"
                          required
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:border-white/40 focus:outline-none font-mono"
                        />
                      </div>

                      {/* Label & Sub */}
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8b8b8b] mb-0.5">
                            Label
                          </label>
                          <input
                            type="text"
                            required
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:border-white/40 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8b8b8b] mb-0.5">
                            Sub
                          </label>
                          <input
                            type="text"
                            required
                            value={editSub}
                            onChange={(e) => setEditSub(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:border-white/40 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Save & Cancel */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={isPending}
                          className="flex-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black py-2 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                        >
                          {isPending ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {/* Compact Video Preview: small & controlled height */}
                      <div
                        className={`relative w-full bg-black overflow-hidden ${
                          isLandscape ? "aspect-[16/9] max-h-[160px]" : "aspect-[4/5] max-h-[220px]"
                        }`}
                      >
                        <video
                          src={getCloudinaryVideoUrl(item.src)}
                          muted
                          loop
                          playsInline
                          autoPlay
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Content & Action Toolbar */}
                      <div className="p-3 border-t border-white/5 bg-[#090909] space-y-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white truncate">
                            {item.label}
                          </h4>
                          <p className="text-[11px] text-[#8b8b8b] truncate">
                            {item.sub}
                          </p>
                        </div>

                        {/* Dedicated Bottom Action Bar */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => startEditing(item)}
                            disabled={isPending}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-white/10 text-white/90 hover:bg-white hover:text-black transition-all active:scale-95"
                          >
                            <span>✏ Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id || isPending}
                            className="flex items-center gap-1 text-[11px] font-medium text-red-400/80 hover:text-red-300 hover:bg-red-950/40 px-2 py-1 rounded-md transition-colors disabled:opacity-40"
                            title="Delete slot"
                          >
                            <span>{deletingId === item.id ? "..." : "✕ Delete"}</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {videos.length === 0 && (
            <div className="p-8 text-center rounded-xl border border-white/5 bg-[#0e0e0e] text-[#8b8b8b] text-xs">
              No video slots found. Add your first video slot above.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
