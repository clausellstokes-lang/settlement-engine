/**
 * seo.js — per-route document head for the client-rendered SPA.
 *
 * index.html carries the site-level defaults + the home canonical; this refines
 * title / description / canonical / OG per route (and marks private + app + auth
 * routes noindex) for JS-capable crawlers. Imperative DOM upserts, mirroring the
 * pattern CompendiumPanel already uses — Compendium keeps owning its richer
 * per-TAB description/canonical refinement on top of the base set here.
 *
 * NOTE: descriptions authored here are user/crawler-facing copy, so they follow
 * the house voice (no em dash) even though the voiceMechanics guard does not scan
 * this file.
 */
import { titleForView, viewToPath } from './routes.js';

const ORIGIN = 'https://settlementforge.com';
const DEFAULT_DESCRIPTION = 'SettlementForge generates living tabletop-RPG settlements with economies, factions, NPCs, and history, then simulates them as a persistent world for game masters.';

// Hand-written descriptions for the public content routes. Everything else falls
// back to the site default (and the private routes below get noindex regardless).
const VIEW_DESCRIPTIONS = {
  home:       DEFAULT_DESCRIPTION,
  generate:   'Generate a living tabletop-RPG settlement in seconds: economy, factions, NPCs, institutions, and history, ready for the table.',
  compendium: 'The SettlementForge compendium: settlement tiers, trade and economy, power and faction archetypes, religion, stress, the neighbour system, and the institution catalog.',
  pricing:    'SettlementForge pricing. Generate and save settlements for free, or unlock the Realm, AI narration, and cross-settlement simulation.',
  howto:      'How SettlementForge works, and how it compares to map tools and AI generators, for game masters building a living world.',
  gallery:    'Browse settlements and realms shared by the SettlementForge community.',
};

// Private / app / transient routes that must never index. Mirrors robots.txt.
const NOINDEX_VIEWS = new Set([
  'settlements', 'realm', 'map', 'workshop', 'account', 'admin',
  'signin', 'register', 'reset-password', 'set-new-password',
  'verify-email', 'confirm-email', 'dossier-success',
]);

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setRobotsNoindex(noindex) {
  const existing = document.head.querySelector('meta[name="robots"]');
  if (noindex) {
    if (existing) existing.setAttribute('content', 'noindex, nofollow');
    else upsertMeta('name', 'robots', 'noindex, nofollow');
  } else if (existing) {
    existing.remove();
  }
}

/**
 * Apply the per-route head for `view`. Called from App on every route change.
 * Home keeps the canonical '/' (matching the static tag and the '/'-to-/home
 * front door); every other route canonicalizes to its own path.
 * @param {string} view
 */
export function applyDocumentHead(view) {
  if (typeof document === 'undefined') return;
  const title = titleForView(view);
  const description = VIEW_DESCRIPTIONS[view] || DEFAULT_DESCRIPTION;
  const path = view === 'home' ? '/' : (viewToPath(view) || '/');
  const canonical = ORIGIN + path;

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonical);
  upsertCanonical(canonical);
  setRobotsNoindex(NOINDEX_VIEWS.has(view));
}
