/**
 * seoCompendium.js — per-ENTRY Compendium document head (the V-19 long tail).
 *
 * The Compendium is the organic search funnel: 289 named entries (tiers,
 * archetypes, deities, operations, systems …), each a stable path route
 * (/compendium/:entryId) that both the build-time prerender
 * (scripts/prerender-routes.mjs) and the lazy CompendiumPanel refine to that
 * entry's OWN <head> — its term, category, canonical, and a DefinedTerm JSON-LD
 * node linked to the compendium DefinedTermSet.
 *
 * Split out of the eager first-paint path (like seoDossier.js): the prerender
 * imports it in Node at build time, and CompendiumPanel imports it lazily, so
 * none of this reaches first paint. PURE — no DOM, no env — so the prerender's
 * baked head is byte-for-byte the SPA's runtime head (the prerender pins verify).
 *
 * House voice: the copy authored here is crawler-facing, so it follows the
 * no-em-dash register even though the voiceMechanics guard does not scan lib/.
 */
import { ORIGIN, SITE_NAME, upsertMeta, upsertJsonLd } from './seo.js';

/** The compendium's own hub — the DefinedTermSet every entry belongs to. */
const COMPENDIUM_URL = `${ORIGIN}/compendium`;
const COMPENDIUM_SET_NAME = 'SettlementForge Compendium';

/** Canonical path for a single Compendium entry id. */
export function compendiumEntryPath(id) {
  return `/compendium/${encodeURIComponent(id)}`;
}

/**
 * The PURE per-entry head projection. Same input entry (from
 * domain/compendium/searchIndex.js COMPENDIUM_INDEX) always yields the same
 * head, so build and runtime cannot drift.
 *
 * @param {{ id: string, term: string, category: string, tab?: string,
 *   anchor?: string, keywords?: string }} entry
 * @returns {{ title: string, description: string, canonical: string,
 *   ogType: string, jsonLd: object }}
 */
export function compendiumEntryHead(entry) {
  const term = String(entry?.term || '').trim();
  const category = String(entry?.category || '').trim();
  const id = String(entry?.id || '').trim();
  const canonical = `${ORIGIN}${compendiumEntryPath(id)}`;

  // Honest, receipt-true one-liner: the term, its category, and that it renders
  // from the engine's own registries (the compendium's whole promise). The
  // engine's own descriptor keywords ride the prerendered body summary, not the
  // meta description, so a snippet never reads as a keyword list.
  const lead = category
    ? `${term}, a ${category.toLowerCase()} in the ${COMPENDIUM_SET_NAME}.`
    : `${term} in the ${COMPENDIUM_SET_NAME}.`;
  const description = `${lead} Every entry renders from the deterministic engine's own registries, so the reference cannot drift from what the simulator does.`;

  return {
    title: `${term} · ${COMPENDIUM_SET_NAME}`,
    description,
    canonical,
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: term,
      description,
      termCode: id,
      url: canonical,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: COMPENDIUM_SET_NAME,
        url: COMPENDIUM_URL,
      },
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${ORIGIN}/` },
    },
  };
}

/**
 * Apply a Compendium entry's head at runtime (the SPA half). A JS-rendering
 * crawler that lands on /compendium/<id> would otherwise see App's generic
 * compendium head overwrite the prerendered entry head; this refines it back to
 * the entry so the rendered DOM matches the baked HTML (bar 14: nothing findable
 * lies). Mirrors seoDossier.setSharedDossierMeta. Safe no-op without a document.
 * @param {{ id: string, term: string, category: string }} entry
 */
export function setCompendiumEntryMeta(entry) {
  if (typeof document === 'undefined' || !entry) return;
  const h = compendiumEntryHead(entry);
  document.title = h.title;
  upsertMeta('name', 'description', h.description);
  upsertMeta('property', 'og:title', h.title);
  upsertMeta('property', 'og:description', h.description);
  upsertMeta('property', 'og:type', h.ogType);
  upsertMeta('property', 'og:url', h.canonical);
  upsertMeta('name', 'twitter:title', h.title);
  upsertMeta('name', 'twitter:description', h.description);
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', h.canonical);
  upsertJsonLd('ld-compendium-entry', h.jsonLd);
}

/** Remove the per-entry DefinedTerm JSON-LD when leaving an entry (cleanup). */
export function clearCompendiumEntryMeta() {
  if (typeof document === 'undefined') return;
  const el = document.head.querySelector('script[type="application/ld+json"]#ld-compendium-entry');
  if (el) el.remove();
}
