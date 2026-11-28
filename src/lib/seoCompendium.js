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
import { ORIGIN, SITE_NAME, VIEW_DESCRIPTIONS, upsertMeta, upsertJsonLd } from './seo.js';
import { tabForSectionSlug } from './compendiumSections.js';

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

// ── THE SECTION PAGES (/compendium/<section-slug>; lib/compendiumSections.js) ──
// Each section page carries its own head. These are the per-tab titles and
// descriptions the panel set under `?tab=` (Tier 8.7), moved here unchanged so the
// prerender bakes the same head the lazy panel refines to. `custom` had none under
// `?tab=`; it composes the section label into the same title pattern and reuses the
// compendium's own route description, so no new copy is written for it.
/** @type {Readonly<Record<string, { title: string, desc: string }>>} keyed by tab id. */
export const COMPENDIUM_SECTION_META = Object.freeze({
  tiers:        { title: 'Settlement tiers & trade routes: SettlementForge Compendium',
                  desc: 'Reference for thorp through metropolis tiers, trade route effects (road / crossroads / port / river / mountain pass / isolated), and monster threat levels in SettlementForge.' },
  economy:      { title: 'Economy reference: SettlementForge Compendium',
                  desc: 'Prosperity, priority bands, trade, supply chains, coherence. The simulator\'s economic model, documented.' },
  power:        { title: 'Kinds of power: SettlementForge Compendium',
                  desc: 'Forty-plus settlement archetypes (Merchant Republic, Mage Theocracy, Frontier Outpost, Crusader Synthesis) keyed to slider + threat conditions.' },
  arcane:       { title: 'Magic & religion reference: SettlementForge Compendium',
                  desc: 'How magic and religious institutions interact in the simulator: heresy suppression, arcane economy, theocratic governance, sacred goods trade.' },
  living:       { title: 'Living World reference: SettlementForge Compendium',
                  desc: 'The systems that wake once a campaign advances: the causal substrate, pressures, the world pulse, the war layer, and the living pantheon. Opt-in, off by default.' },
  stress:       { title: 'Stress conditions: SettlementForge Compendium',
                  desc: 'Famine, siege, plague, political fracture, monster pressure: how each stress shifts institutions, powers, and supply chains.' },
  neighbour:    { title: 'Neighbour System reference: SettlementForge Compendium',
                  desc: 'Trade partner, ally, patron, client, rival, cold war, hostile. How linked settlements modify each other\'s economy, military, and criminal presence.' },
  institutions: { title: 'Institutional catalog: SettlementForge Compendium',
                  desc: 'Every institution the simulator can generate, the conditions that select it, what it implies for the settlement, and how it interacts with others.' },
  operations:   { title: 'The operation registry: SettlementForge Compendium',
                  desc: 'Every operation the engine can perform, with its class (canon / macro / mechanical), scope, the receipt it leaves, and whether it can be undone. The AI never appears as an author.' },
  calamity:     { title: 'Calamity reference: SettlementForge Compendium',
                  desc: 'The one unified calamity mechanic, its cosmetic terrain flavours, and its severity bands. Honest by design: a flood and a fire differ in the telling, not the maths.' },
  az:           { title: 'A–Z index: SettlementForge Compendium',
                  desc: 'Every named Compendium entry in one alphabetical index: archetypes, operations, systems, and more, each a stable deep-link.' },
  custom:       { title: 'My Custom Content: SettlementForge Compendium',
                  desc: VIEW_DESCRIPTIONS.compendium },
});

/**
 * The PURE head of a section page (prerender and runtime share it).
 * @param {string} slug a reserved section slug
 * @returns {{ title: string, description: string, canonical: string, ogType: string }|null}
 */
export function compendiumSectionHead(slug) {
  const tab = tabForSectionSlug(slug);
  const meta = tab ? COMPENDIUM_SECTION_META[tab] : undefined;
  if (!meta) return null;
  return {
    title: meta.title,
    description: meta.desc,
    canonical: `${ORIGIN}/compendium/${encodeURIComponent(slug)}`,
    ogType: 'website',
  };
}

/** Apply a section page's head at runtime (the SPA half). Safe no-op without a document. */
export function setCompendiumSectionMeta(slug) {
  if (typeof document === 'undefined') return;
  const h = compendiumSectionHead(slug);
  if (!h) return;
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
}
