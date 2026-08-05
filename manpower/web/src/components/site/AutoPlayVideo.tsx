import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import {
  extractYouTubeId,
  fetchYouTubeOEmbed,
  toYouTubeEmbedSrc,
  youtubeThumbnailUrl,
} from "@/lib/video";

type AutoPlayVideoProps = {
  /** Watch, short, or embed URL from CMS (YouTube or direct MP4). */
  url: string;
  /** Fallback title before oEmbed resolves. */
  title?: string;
  /** Optional CMS poster; otherwise YouTube thumbnail is used. */
  posterUrl?: string | null;
  className?: string;
  /** Start muted autoplay once the player is in view. Defaults to true. */
  autoPlay?: boolean;
};

/**
 * Responsive video player. YouTube URLs are converted to privacy-enhanced
 * embeds with autoplay (muted). Direct media URLs use a native <video> tag.
 * Metadata (title / poster) is loaded dynamically via YouTube oEmbed.
 */
export function AutoPlayVideo({
  url,
  title,
  posterUrl,
  className = "",
  autoPlay = true,
}: AutoPlayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(!autoPlay);
  const youtubeId = extractYouTubeId(url);
  const isDirect = /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith("blob:");

  const { data: meta } = useQuery({
    queryKey: ["youtube-oembed", youtubeId],
    queryFn: () => fetchYouTubeOEmbed(url),
    enabled: Boolean(youtubeId),
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (!autoPlay || !containerRef.current) {
      setInView(true);
      return;
    }

    const node = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px", threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (!isDirect || !autoPlay || !inView || !videoRef.current) return;
    const el = videoRef.current;
    el.muted = true;
    void el.play().catch(() => {
      /* Autoplay may be blocked until a gesture; controls remain available. */
    });
  }, [isDirect, autoPlay, inView]);

  const resolvedTitle = meta?.title || title || "Video";
  const poster =
    posterUrl || meta?.thumbnail_url || (youtubeId ? youtubeThumbnailUrl(url) : null) || undefined;
  const embedSrc =
    youtubeId && inView
      ? toYouTubeEmbedSrc(url, { autoplay: autoPlay, mute: true, loop: true })
      : null;

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full overflow-hidden bg-brand-blue-dark shadow-lg ${className}`}
    >
      {isDirect ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={url}
          poster={poster}
          muted
          playsInline
          loop
          controls
          autoPlay={autoPlay && inView}
          aria-label={resolvedTitle}
        />
      ) : embedSrc ? (
        <iframe
          title={resolvedTitle}
          src={embedSrc}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <>
          {poster ? (
            <img
              src={poster}
              alt={resolvedTitle}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
          <div className="absolute inset-0 bg-brand-blue-dark/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            {title ? <p className="text-sm font-bold uppercase tracking-wide text-white/90">{title}</p> : null}
            <div
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95"
            >
              <Play className="h-6 w-6 fill-primary text-primary" />
            </div>
            <span className="sr-only">Loading video…</span>
          </div>
        </>
      )}
    </div>
  );
}
