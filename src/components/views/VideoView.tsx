/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, memo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Rocket as RocketIcon, Download, Search, CheckCircle, X } from 'lucide-react';

const VideoShort = memo(({ url, title, storeName }: { url: string; title: string; storeName?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-screen md:h-auto snap-start flex items-center justify-center bg-slate-50 md:bg-transparent overflow-hidden md:py-10">
      <video
        ref={videoRef}
        src={url || undefined}
        className="w-full h-full object-cover md:max-w-[400px] md:rounded-[2.5rem] md:h-[85vh] md:border md:border-slate-200 md:shadow-2xl shadow-slate-200/50 bg-black cursor-pointer"
        loop
        playsInline
        onClick={togglePlay}
        loading="lazy"
      />
      <div className="absolute bottom-24 md:bottom-20 left-4 right-4 z-10 pointer-events-none md:max-w-[360px] md:left-1/2 md:-translate-x-1/2">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              <RocketIcon className="w-4 h-4 text-[var(--theme-text-main)]" />
            </div>
            <span className="text-slate-900 font-bold text-sm">{storeName || "Store"}</span>
          </div>
          <h3 className="text-slate-700 text-xs font-medium line-clamp-2 leading-relaxed">{title}</h3>
        </div>
      </div>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-xl">
            <Play className="w-10 h-10 text-[var(--theme-text-main)] fill-white ml-2" />
          </div>
        </div>
      )}
    </div>
  );
});

const DownloaderView = () => {
  const [downloaderUrl, setDownloaderUrl] = useState("");
  const [downloadMode, setDownloadMode] = useState("video");
  const [downloaderLoading, setDownloaderLoading] = useState(false);
  const [downloaderError, setDownloaderError] = useState("");
  const [downloaderResult, setDownloaderResult] = useState<any>(null);

  function normalizeDownloaderUrl(url: string) {
    const clean = String(url || "").trim();
    if (!clean) return "";
    if (!/^https?:\/\//i.test(clean)) {
      return "https://" + clean;
    }
    return clean;
  }

  function detectDownloaderPlatform(url: string) {
    try {
      const parsed = new URL(normalizeDownloaderUrl(url));
      const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
      const path = parsed.pathname.toLowerCase();

      if (host.includes("tiktok.com") || host.includes("vm.tiktok.com") || host.includes("vt.tiktok.com")) return "TikTok";
      if (host.includes("instagram.com")) return "Instagram";
      if (host.includes("facebook.com") || host.includes("fb.watch") || host.includes("m.facebook.com")) return "Facebook";
      if (host.includes("youtube.com") || host.includes("youtu.be") || host.includes("m.youtube.com")) {
        if (path.includes("/shorts/")) return "YouTube Shorts";
        return "YouTube";
      }
      if (host.includes("x.com") || host.includes("twitter.com") || host.includes("mobile.twitter.com")) return "Twitter/X";
      if (host.includes("reddit.com")) return "Reddit";
      if (host.includes("vimeo.com")) return "Vimeo";
      if (host.includes("soundcloud.com")) return "SoundCloud";

      return "Unknown";
    } catch {
      return "Invalid";
    }
  }

  function isSupportedDownloaderUrl(url: string) {
    const platform = detectDownloaderPlatform(url);
    return platform !== "Invalid" && platform !== "Unknown";
  }

  async function handleDownloadVideo() {
    const cleanUrl = normalizeDownloaderUrl(downloaderUrl);

    setDownloaderError("");
    setDownloaderResult(null);

    if (!cleanUrl) {
      setDownloaderError("Link wajib diisi.");
      return;
    }

    if (!isSupportedDownloaderUrl(cleanUrl)) {
      setDownloaderError("Link tidak didukung. Gunakan TikTok, Instagram, Facebook, YouTube, X/Twitter, Reddit, Vimeo, atau SoundCloud.");
      return;
    }

    try {
      setDownloaderLoading(true);

      const res = await fetch("/api/downloader", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: cleanUrl,
          mode: downloadMode
        })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Downloader gagal memproses link.");
      }

      setDownloaderResult(data.result);
    } catch (error: any) {
      console.error("DOWNLOADER FRONTEND ERROR:", error);
      setDownloaderError(error.message || "Downloader gagal.");
    } finally {
      setDownloaderLoading(false);
    }
  }

  function getDownloadFileName(result: any) {
    const title = String(result?.title || "sanz-store-download")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);

    let ext = "mp4";

    if (result?.type === "audio") ext = "mp3";
    if (result?.type === "thumbnail") ext = "jpg";

    return `${title || "sanz-store-download"}.${ext}`;
  }

  async function handleDirectDownload(result: any) {
    try {
      if (!result?.downloadUrl) {
        setDownloaderError("Link download tidak ditemukan.");
        return;
      }

      const fileName = getDownloadFileName(result);
      const proxyUrl = `/api/download-file?url=${encodeURIComponent(result.downloadUrl)}&filename=${encodeURIComponent(fileName)}`;

      const anchor = document.createElement("a");
      anchor.href = proxyUrl;
      anchor.download = fileName;
      anchor.style.display = "none";

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.error("DIRECT DOWNLOAD ERROR:", error);
      setDownloaderError("Gagal memulai download.");
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="video-downloader-card">
        <div className="video-downloader-header">
          <h2>Downloader Video</h2>
          <p>Tempel link video dari TikTok, Instagram, Facebook, YouTube, X, Reddit, Vimeo, atau SoundCloud.</p>
        </div>

        <input
          className="video-downloader-input"
          value={downloaderUrl}
          onChange={(e) => setDownloaderUrl(e.target.value)}
          placeholder="Tempel link video di sini..."
        />

        <select
          className="video-downloader-select"
          value={downloadMode}
          onChange={(e) => setDownloadMode(e.target.value)}
        >
          <option value="video">Video</option>
          <option value="audio">Audio MP3</option>
          <option value="thumbnail">Thumbnail</option>
        </select>

        <button
          className="video-downloader-button"
          onClick={handleDownloadVideo}
          disabled={downloaderLoading}
        >
          {downloaderLoading ? "Memproses..." : "Proses Link"}
        </button>

        {downloaderError && (
          <div className="video-downloader-error">
            <strong>Downloader gagal</strong>
            <p>{downloaderError}</p>
          </div>
        )}

        {downloaderResult && (
          <div className="video-downloader-result">
            {downloaderResult.thumbnail && (
              <img src={downloaderResult.thumbnail} alt="Thumbnail" />
            )}

            <h3>{downloaderResult.title || "Hasil Downloader"}</h3>

            <button
              className="video-downloader-download-link"
              onClick={() => handleDirectDownload(downloaderResult)}
            >
              Download Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface VideoViewProps {
  videoData?: Array<{ url: string; title: string; }>;
  storeName?: string;
}

const VideoView: React.FC<VideoViewProps> = ({ videoData = [], storeName }) => {
  const [activeTab, setActiveTab] = useState<'shorts' | 'downloader'>('downloader');

  return (
    <div className="flex flex-col min-h-screen pt-4 pb-20">
      <div className="flex justify-center mb-8 px-6 sticky top-20 z-40">
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full flex gap-2 border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('downloader')}
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'downloader' ? 'bg-[var(--theme-bg-main)] text-[var(--theme-text-main)] shadow-md' : 'text-[var(--theme-text-soft)] hover:text-slate-800'}`}
          >
            Downloader
          </button>
          <button
            onClick={() => setActiveTab('shorts')}
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'shorts' ? 'bg-[var(--theme-bg-main)] text-[var(--theme-text-main)] shadow-md' : 'text-[var(--theme-text-soft)] hover:text-slate-800'}`}
          >
            Shorts
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'downloader' ? (
          <motion.div key="downloader" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <DownloaderView />
          </motion.div>
        ) : (
          <motion.div key="shorts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-screen md:h-auto snap-y snap-mandatory overflow-y-auto no-scrollbar pb-24 md:flex md:flex-wrap md:justify-center md:gap-8 md:px-6">
             {videoData.length > 0 ? (
                 videoData.map((v, i) => (
                    <VideoShort key={i} url={v.url} title={v.title} storeName={storeName} />
                 ))
             ) : (
                 <div className="w-full text-center py-20 text-[var(--theme-text-soft)]">Belum ada video pendek tersedia.</div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(VideoView);
