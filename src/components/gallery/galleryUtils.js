export const TIER_OPTIONS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis', 'capital'];
export const TERRAIN_OPTIONS = ['forest', 'plains', 'hills', 'mountains', 'coast', 'river', 'desert', 'swamp', 'tundra', 'underground'];
export const GOVERNMENT_OPTIONS = ['monarchy', 'council', 'elder council', 'oligarchy', 'guild', 'theocracy', 'military', 'assembly', 'criminal'];
export const MAGIC_OPTIONS = ['none', 'low', 'medium', 'high', 'wild', 'forbidden'];
export const STABILITY_OPTIONS = ['stable', 'strained', 'unstable', 'crisis', 'collapsing'];

export const REPORT_REASON_OPTIONS = [
  ['unsafe_content', 'Unsafe content'],
  ['private_information', 'Private information'],
  ['spam', 'Spam'],
  ['copyright', 'Copyright concern'],
  ['other', 'Other'],
];

export const GALLERY_RESPONSIVE_CSS = `
  .gallery-main-layout {
    grid-template-columns: 260px minmax(0, 1fr);
  }

  .gallery-sidebar-panel {
    position: sticky;
    top: 16px;
  }

  .gallery-topbar {
    grid-template-columns: minmax(0, 1fr) minmax(170px, 230px);
  }

  .gallery-detail-hero {
    grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
  }

  .gallery-detail-body {
    grid-template-columns: minmax(0, 1fr) minmax(260px, 330px);
  }

  @media (max-width: 860px) {
    .gallery-main-layout,
    .gallery-topbar,
    .gallery-detail-hero,
    .gallery-detail-body {
      grid-template-columns: 1fr;
    }

    .gallery-sidebar-panel {
      position: static;
    }
  }
`;

export function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

/**
 * Map the gallery stability vocabulary (stable/strained/unstable/crisis/
 * collapsing) onto BandPill's five color tiers + an uppercase label. Stability
 * is the one living-world anomaly a GM scans for, so it renders through the
 * canonical multi-channel BandPill (color + glyph + label) instead of as a flat
 * grey tag. Returns null for unknown/empty so callers can omit the pill.
 */
const STABILITY_BAND = Object.freeze({
  stable:     { band: 'surplus',   label: 'Stable' },
  strained:   { band: 'strained',  label: 'Strained' },
  unstable:   { band: 'critical',  label: 'Unstable' },
  crisis:     { band: 'critical',  label: 'Crisis' },
  collapsing: { band: 'collapsed', label: 'Collapsing' },
});

export function stabilityBand(stability) {
  const key = String(stability || '').trim().toLowerCase();
  return STABILITY_BAND[key] || null;
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatNumber(value) {
  const n = Number(value) || 0;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}m`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.max(0, Math.round(n)));
}

export function fallbackInitial(name) {
  return String(name || '?').trim().charAt(0).toUpperCase() || '?';
}

export function activeFilterCount(filters = {}) {
  return Object.values(filters).reduce((sum, value) => {
    if (Array.isArray(value)) return sum + value.length;
    return sum + (value ? 1 : 0);
  }, 0);
}

/** Public URL for a gallery dossier slug (matches ShareToGallery's link form). */
export function galleryUrlFor(slug) {
  const path = `/gallery?slug=${encodeURIComponent(slug || '')}`;
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
}

/**
 * Share a gallery dossier: Web Share API when available, else copy the
 * public URL to clipboard. Never throws — returns { ok, method } so callers can
 * show success/failure feedback. A cancelled native share sheet is { ok:false,
 * cancelled:true } (not an error to surface).
 */
export async function shareGalleryDossier({ slug, name } = {}) {
  if (!slug) return { ok: false, method: null };
  const url = galleryUrlFor(slug);
  const title = name ? `${name} (SettlementForge)` : 'SettlementForge dossier';
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text: title, url });
      return { ok: true, method: 'share' };
    } catch (err) {
      if (err && err.name === 'AbortError') return { ok: false, method: 'share', cancelled: true };
      // fall through to clipboard
    }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return { ok: true, method: 'copy' };
    } catch {
      return { ok: false, method: 'copy' };
    }
  }
  return { ok: false, method: null };
}
