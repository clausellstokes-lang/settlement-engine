/**
 * api/_galleryMeta.js — pure Open-Graph meta builder + injector for the
 * per-slug gallery prerender (Wave 4h unfurl pass).
 *
 * WHY: /gallery/:slug is a client-rendered SPA route. A non-JS scraper
 * (Reddit / Discord / Slack / Twitter / iMessage unfurlers) fetches the raw
 * HTML and never runs the bundle, so every shared dossier link previewed with
 * the SAME generic index.html card (site title + default image). The
 * `api/gallery-meta.js` edge function rewrites /gallery/:slug through here to
 * stamp the per-slug title / description / image / canonical INTO the served
 * HTML before handing the SPA to the browser — the scraper now sees a real
 * per-settlement card, and the browser still boots the app normally.
 *
 * This module is the PURE, deploy-independent half: no fetch, no fs, no env —
 * just string transforms — so it is unit-testable in isolation
 * (tests/build/injectGalleryMeta.test.js). The `_` filename prefix keeps Vercel
 * from treating it as its own function route.
 *
 * Seed-secret doctrine (mirrors seoDossier.js): only the public name + coarse
 * enums the gallery page already renders reach the head — no seed, DM note, or
 * raw settlement blob. The dossier record is the already-sanitized
 * get_gallery_dossier RPC row; a nameless/absent row degrades to a generic
 * (still per-slug URL + image) card rather than leaking anything.
 */

export const ORIGIN = 'https://settlementforge.com';
export const SITE_NAME = 'SettlementForge';
const OG_IMAGE_DEFAULT = `${ORIGIN}/og-default.png`;

/** river_valley → River Valley (matches seoDossier.humanize). */
function humanize(v) {
  if (!v || typeof v !== 'string') return '';
  return v.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

/**
 * The dynamic per-settlement OG card (Supabase `og-image` edge function), keyed
 * on the slug alone — so a valid card exists even without the DB row. Falls back
 * to the static default when no Supabase origin is configured.
 * @param {string} slug
 * @param {string} [supabaseUrl]
 * @returns {string}
 */
export function galleryCardImage(slug, supabaseUrl) {
  if (supabaseUrl && slug) {
    return `${supabaseUrl}/functions/v1/og-image?slug=${encodeURIComponent(slug)}`;
  }
  return OG_IMAGE_DEFAULT;
}

/**
 * Build the per-slug OG meta from a (possibly null) sanitized gallery dossier row.
 * Image + URL are ALWAYS per-slug (slug-derived, no DB needed); title/description
 * upgrade to the real settlement name + coarse facts only when the row is present.
 *
 * @param {string} slug
 * @param {{ name?: string, tier?: string, terrain?: string, publishedAt?: string,
 *           settlement?: { name?: string, population?: number, terrain?: string,
 *           config?: { terrain?: string } } } | null} dossier
 * @param {{ origin?: string, supabaseUrl?: string }} [opts]
 * @returns {{ title: string, description: string, image: string, url: string, type: string }}
 */
export function buildGalleryMeta(slug, dossier, opts = {}) {
  const origin = opts.origin || ORIGIN;
  const supabaseUrl = opts.supabaseUrl || '';
  const url = slug ? `${origin}/gallery/${encodeURIComponent(slug)}` : `${origin}/gallery`;
  const image = galleryCardImage(slug, supabaseUrl);

  const name = dossier?.name || dossier?.settlement?.name || '';
  if (!name) {
    return {
      title: `Shared settlement · ${SITE_NAME}`,
      description: 'A living settlement generated and shared on SettlementForge.',
      image,
      url,
      type: 'article',
    };
  }

  const tier = humanize(dossier.tier);
  const terrain = humanize(
    dossier.terrain || dossier.settlement?.config?.terrain || dossier.settlement?.terrain,
  );
  const population = Number(dossier.settlement?.population) || null;
  const facts = [
    tier ? `a ${tier.toLowerCase()}` : '',
    terrain ? `on ${terrain.toLowerCase()} terrain` : '',
    // Node-side, an EXPLICIT 'en-US' locale is device-stable (the display-locale
    // ruling in domain/formatNumber.js) — never a bare/host toLocaleString.
    population ? `with about ${population.toLocaleString('en-US')} people` : '',
  ].filter(Boolean);
  const description = facts.length
    ? `${name}, ${facts.join(', ')}. A living settlement generated and shared on SettlementForge.`
    : `${name}, a living settlement generated and shared on SettlementForge.`;

  return {
    title: `${name} · ${SITE_NAME}`,
    description,
    image,
    url,
    type: 'article',
  };
}

/** Escape a value for an HTML attribute (content="…"). */
function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escape a value for HTML text content (between tags). */
function escapeText(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Replace the `content="…"` of an existing `<meta {attr}="{key}" …>` tag, in
 * either attribute order; if the tag is absent, insert a fresh one before
 * `</head>`. Only the FIRST match is rewritten (there is one per key).
 */
function upsertMeta(html, attr, key, value) {
  const esc = escapeAttr(value);
  // <meta … attr="key" … content="…" …>  (key attr before content — our index.html order)
  const keyThenContent = new RegExp(
    `(<meta\\s+[^>]*\\b${attr}=["']${key}["'][^>]*\\bcontent=["'])[^"']*(["'])`,
    'i',
  );
  if (keyThenContent.test(html)) return html.replace(keyThenContent, `$1${esc}$2`);
  // <meta … content="…" … attr="key" …>  (content before key attr)
  const contentThenKey = new RegExp(
    `(<meta\\s+[^>]*\\bcontent=["'])[^"']*(["'][^>]*\\b${attr}=["']${key}["'])`,
    'i',
  );
  if (contentThenKey.test(html)) return html.replace(contentThenKey, `$1${esc}$2`);
  // Absent — inject before </head>.
  return html.replace(/<\/head>/i, `    <meta ${attr}="${key}" content="${esc}" />\n  </head>`);
}

/**
 * Inject per-slug OG/Twitter meta into a full index.html string. Rewrites the
 * document <title>, description, and the og:/twitter: title/description/image plus
 * og:url/og:type. Pure: same input → same output. Unknown/empty meta returns the
 * html unchanged.
 *
 * @param {string} html — the built index.html
 * @param {{ title?: string, description?: string, image?: string, url?: string, type?: string }} meta
 * @returns {string}
 */
export function injectGalleryMeta(html, meta) {
  if (typeof html !== 'string' || !meta) return html;
  let out = html;

  if (meta.title) {
    out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeText(meta.title)}</title>`);
    out = upsertMeta(out, 'property', 'og:title', meta.title);
    out = upsertMeta(out, 'name', 'twitter:title', meta.title);
  }
  if (meta.description) {
    out = upsertMeta(out, 'name', 'description', meta.description);
    out = upsertMeta(out, 'property', 'og:description', meta.description);
    out = upsertMeta(out, 'name', 'twitter:description', meta.description);
  }
  if (meta.image) {
    out = upsertMeta(out, 'property', 'og:image', meta.image);
    out = upsertMeta(out, 'name', 'twitter:image', meta.image);
  }
  if (meta.url) out = upsertMeta(out, 'property', 'og:url', meta.url);
  if (meta.type) out = upsertMeta(out, 'property', 'og:type', meta.type);

  return out;
}
