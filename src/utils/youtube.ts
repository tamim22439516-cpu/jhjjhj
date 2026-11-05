/**
 * YouTube Utility Helpers for TAWZOON NEXUS
 * Extracts video IDs, builds responsive embeds, and generates auto-thumbnails
 */

export function extractYouTubeId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const cleaned = url.trim();
  
  // Direct 11-char ID
  if (/^[\w-]{11}$/.test(cleaned)) {
    return cleaned;
  }
  
  // Standard, Shortened, Embed, and Shorts URLs
  const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i;
  const match = cleaned.match(regex);
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(videoIdOrUrl?: string | null): string | null {
  const id = extractYouTubeId(videoIdOrUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function getYouTubeEmbedUrl(videoIdOrUrl?: string | null, autoplay = false): string | null {
  const id = extractYouTubeId(videoIdOrUrl);
  return id ? `https://www.youtube.com/embed/${id}${autoplay ? '?autoplay=1&rel=0' : '?rel=0'}` : null;
}
