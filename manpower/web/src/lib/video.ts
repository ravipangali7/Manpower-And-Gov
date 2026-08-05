/** Normalize watch / share / embed YouTube URLs into an 11-char video id. */
export function extractYouTubeId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;

      const parts = url.pathname.split("/").filter(Boolean);
      const embedIdx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live");
      if (embedIdx >= 0) {
        const id = parts[embedIdx + 1];
        return id && /^[\w-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export type YouTubeEmbedOptions = {
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  modestBranding?: boolean;
  rel?: boolean;
};

/** Build a privacy-enhanced YouTube embed URL with playback flags. */
export function toYouTubeEmbedSrc(
  input: string,
  options: YouTubeEmbedOptions = {},
): string | null {
  const id = extractYouTubeId(input);
  if (!id) return null;

  const {
    autoplay = true,
    mute = true,
    loop = true,
    controls = true,
    playsInline = true,
    modestBranding = true,
    rel = false,
  } = options;

  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    loop: loop ? "1" : "0",
    controls: controls ? "1" : "0",
    playsinline: playsInline ? "1" : "0",
    modestbranding: modestBranding ? "1" : "0",
    rel: rel ? "1" : "0",
    enablejsapi: "1",
  });

  // Loop requires playlist=VIDEO_ID for a single video.
  if (loop) params.set("playlist", id);

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export type YouTubeOEmbed = {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  html: string;
  provider_name: string;
};

/** Fetch public oEmbed metadata for a YouTube URL (no API key). */
export async function fetchYouTubeOEmbed(videoUrl: string): Promise<YouTubeOEmbed | null> {
  const id = extractYouTubeId(videoUrl);
  if (!id) return null;

  const canonical = `https://www.youtube.com/watch?v=${id}`;
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonical)}&format=json`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) return null;
    return (await res.json()) as YouTubeOEmbed;
  } catch {
    return null;
  }
}

export function youtubeThumbnailUrl(videoUrl: string, quality: "hqdefault" | "maxresdefault" = "hqdefault") {
  const id = extractYouTubeId(videoUrl);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null;
}
