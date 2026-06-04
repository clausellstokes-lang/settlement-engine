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
