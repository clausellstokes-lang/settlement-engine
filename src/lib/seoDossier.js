/**
 * seoDossier.js — per-shared-dossier document head enrichment.
 *
 * Split out of seo.js so it loads LAZILY with the gallery surface instead of
 * riding the first-paint entry: applyDocumentHead (eager, in seo.js) already
 * points a gallery item's og:image at the dynamic card from the slug alone; this
 * upgrades the title + description to the settlement's real name and coarse facts
 * and emits its CreativeWork JSON-LD once the (already public, sanitized) dossier
 * has loaded. Called from GalleryDetail.
 *
 * Seed-secret doctrine: only the public name + coarse enums the gallery page
 * already renders reach the head. No seed, DM note, or raw settlement blob.
 */
import { ORIGIN, SITE_NAME, upsertMeta, upsertJsonLd, setSocialImage, galleryCardImage } from './seo.js';

/** Minimal humanizer for slug/enum values (river_valley → River Valley). */
function humanize(v) {
  if (!v || typeof v !== 'string') return '';
  return v.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

/**
 * Enrich the head for a specific shared dossier. Upgrades the title + OG/Twitter
 * title and description to the settlement's real name and coarse facts, and emits
 * a CreativeWork JSON-LD node linked to the site graph. Safe no-op for a missing
 * or nameless dossier. The next route change's applyDocumentHead resets it.
 * @param {{ name?: string, slug?: string, tier?: string, terrain?: string,
 *           publishedAt?: string, settlement?: object }} dossier
 */
export function setSharedDossierMeta(dossier) {
  if (typeof document === 'undefined' || !dossier) return;
  const name = dossier.name || dossier.settlement?.name;
  if (!name) return;

  const slug = dossier.slug;
  const tier = humanize(dossier.tier);
  const terrain = humanize(
    dossier.terrain || dossier.settlement?.config?.terrain || dossier.settlement?.terrain,
  );
  const population = Number(dossier.settlement?.population) || null;

  const facts = [
    tier ? `a ${tier.toLowerCase()}` : '',
    terrain ? `on ${terrain.toLowerCase()} terrain` : '',
    population ? `with about ${population.toLocaleString('en-US')} people` : '',
  ].filter(Boolean);
  const description = facts.length
    ? `${name}, ${facts.join(', ')}. A living settlement generated and shared on SettlementForge.`
    : `${name}, a living settlement generated and shared on SettlementForge.`;

  const pageTitle = `${name} · ${SITE_NAME}`;
  const canonical = slug ? `${ORIGIN}/gallery/${encodeURIComponent(slug)}` : `${ORIGIN}/gallery`;
  const image = galleryCardImage(slug);

  document.title = pageTitle;
  upsertMeta('property', 'og:title', pageTitle);
  upsertMeta('name', 'twitter:title', pageTitle);
  upsertMeta('property', 'og:description', description);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'description', description);
  setSocialImage(image, `${name}: a settlement shared on SettlementForge`);

  upsertJsonLd('ld-gallery-item', {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    headline: name,
    url: canonical,
    image,
    description,
    genre: 'Tabletop RPG settlement',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${ORIGIN}/` },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: `${ORIGIN}/` },
    ...(dossier.publishedAt ? { datePublished: dossier.publishedAt } : {}),
  });
}

/**
 * Enrich the head for a gallery FACET HUB (GALLERY-2 phase 2). applyDocumentHead
 * already canonicalized to the hub's own path (viewToPath's hub branch) with the
 * generic gallery title; this upgrades the title/description to the hub's copy
 * and emits a CollectionPage JSON-LD node. Safe no-op for a null hub. The next
 * route change's applyDocumentHead resets everything.
 * @param {{ path?: string, title?: string, blurb?: string } | null} hub
 */
export function setGalleryHubMeta(hub) {
  if (typeof document === 'undefined' || !hub?.title || !hub?.path) return;
  const pageTitle = `${hub.title} · ${SITE_NAME}`;
  const description = hub.blurb || '';
  const canonical = `${ORIGIN}${hub.path}`;

  document.title = pageTitle;
  upsertMeta('property', 'og:title', pageTitle);
  upsertMeta('name', 'twitter:title', pageTitle);
  if (description) {
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'description', description);
  }

  upsertJsonLd('ld-gallery-item', {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.title,
    url: canonical,
    description,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${ORIGIN}/` },
  });
}
