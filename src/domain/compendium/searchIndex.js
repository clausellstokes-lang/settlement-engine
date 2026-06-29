/**
 * domain/compendium/searchIndex.js — global type-ahead search.
 *
 * The Compendium's per-tab search only ever filters the tab you're
 * already on. A reader who knows the
 * word "theocracy" but not which tab it lives under has no way in — the
 * search is local, the knowledge is global.
 *
 * This module builds ONE flat, searchable index across every built-in
 * catalog section and exposes a pure `searchCompendium(query)` that
 * returns ranked navigation targets. Each result carries the `tab` it
 * lives on and an `anchor` hash, so the UI can switch tabs and scroll
 * the reader to the right place.
 *
 * The index is a NAVIGATION aid, not the display source — the tabs still
 * render their own content. That decoupling is deliberate: a slightly
 * stale index entry still routes the reader to a valid, live tab rather
 * than 404-ing. The two big arrays (archetypes, relationship types) are
 * imported from `catalogData.js`, the same source the tabs render, so
 * those stay drift-free automatically.
 *
 * Pure module — no React, no DOM, no flags. Safe to unit test in node.
 */

import { ARCHETYPES, REL_TYPES } from './catalogData.js';
// Pull institution names straight from the DATA layer, not generators/lookups —
// domain may import data/ (a lower layer both sit above), but a domain→generators
// import is a forbidden layering edge (see domainGeneratorsBoundary.test.js). This
// is the same table the Institutions tab ultimately renders, so it stays drift-free.
import { institutionalCatalog } from '../../data/institutionalCatalog.js';

// Valid destination tabs — must mirror the TABS ids in CompendiumPanel.
// 'living' is the Living World tab; without it the module's own "search the
// whole Compendium" promise excluded the most engine-deep tab.
export const COMPENDIUM_TABS = Object.freeze([
  'tiers', 'economy', 'power', 'arcane', 'living', 'stress', 'neighbour', 'institutions',
]);

// kebab-case slug for stable entry ids and anchor fallbacks.
/** @param {any} s */
function slug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Curated reference entries for the smaller, hardcoded sections ──────────
// These mirror the inline arrays the Tiers / Economy / Magic / Stress
// tabs render. They're concise on purpose — enough to match a query and
// route the reader, not a second copy of the prose.

const TIER_ENTRIES = [
  ['Thorp', 'smallest hamlet 20-80 single institution subsistence'],
  ['Hamlet', '80-400 local subsistence minimal trade'],
  ['Village', '400-900 surplus weekly market guilds begin'],
  ['Town', '900-4000 specialization guilds form'],
  ['City', '4000-25000 institutional diversity factional politics'],
  ['Metropolis', '25000+ largest all systems active complex factions'],
].map(([term, kw]) => ({
  id: `tier-${slug(term)}`, term, category: 'Tier', tab: 'tiers', anchor: 'tiers', keywords: kw,
}));

const ROUTE_ENTRIES = [
  ['Road', 'standard land access moderate trade'],
  ['Crossroads', 'multiple road intersections high diversity'],
  ['Port', 'sea river access maritime fishing naval'],
  ['River', 'inland waterway bulk movement mill granary'],
  ['Mountain Pass', 'chokepoint toll garrison'],
  ['Isolated', 'no trade route subsistence secrets'],
].map(([term, kw]) => ({
  id: `route-${slug(term)}`, term, category: 'Trade Route', tab: 'tiers', anchor: 'trade-routes', keywords: kw,
}));

const THREAT_ENTRIES = [
  ['Safe', 'heartland monsters rumor civilian institutions'],
  ['Frontier', 'active managed threat walls garrison patrols'],
  ['Dangerous', 'constant threat military dominates'],
  ['Plagued', 'monster plague crisis siege-like militia'],
].map(([term, kw]) => ({
  id: `threat-${slug(term)}`, term, category: 'Monster Threat', tab: 'tiers', anchor: 'threat', keywords: kw,
}));

const ECONOMY_ENTRIES = [
  ['Prosperity Tiers', 'subsistence to affluent derived output wealth'],
  ['Priority Sliders', 'shift institutional probability economy military religion magic criminal'],
  ['Exports & Imports', 'surplus production gaps trade vulnerability dependency'],
  ['Supply Chains', 'linked production sequences broken input degrades'],
  ['Viability Score', 'economic stress analysis fragile supporting prosperity'],
].map(([term, kw]) => ({
  id: `econ-${slug(term)}`, term, category: 'Economy', tab: 'economy', anchor: 'economy', keywords: kw,
}));

// Category names the live tab label ('Religion & the Pantheon'); the legacy
// `#magic` anchor is kept for deep-link stability. Only the human-facing
// category string changed when the tab was renamed off the stale 'Magic &
// Religion'.
const ARCANE_ENTRIES = [
  ['Magic as Economic Buffer', 'high magic buffer deficits substitute production'],
  ['Magic Suppression', 'heresy religion magic goods suppressed'],
  ['Arcane-Criminal Ecosystem', 'arcane black market criminal magic'],
  ['Religion & Governance', 'theocracy religious fraud church'],
  ['Magic & Faith Unified', 'mage theocracy arcane clergy governs'],
].map(([term, kw]) => ({
  id: `arcane-${slug(term)}`, term, category: 'Religion & the Pantheon', tab: 'arcane', anchor: 'magic', keywords: kw,
}));

// Living World — the static→living-world bridge. Mirrors LIVING_WORLD_GROUPS in
// CatalogTabs with high-frequency simulation synonyms so the highest-signal
// terms (world pulse, advance time, war, siege, pressures, legitimacy, unrest)
// route to the tab instead of dead-ending on "No matches". The anchor
// `living-world` already exists on the tab and ANCHOR_TO_TAB maps it.
const LIVING_WORLD_ENTRIES = [
  ['Causal Substrate', 'sixteen canonical variables legitimacy food security unrest religious authority advance time tick re-derived prior state'],
  ['Pressures & Strength', 'nine pressures military economic social religious settlement strength defend yield signal strategy'],
  ['World Pulse', 'per-tick advance tick advance time stressors fire populations trade drift institutions born die proposals dm off by default'],
  ['War Layer', 'armies march sieges conquest rulers war exhaustion self-ending peace dormant'],
  ['Religion & Pantheon', 'assigned deities contest converts seats corruption aggression magic legality dormant primary deity religion dynamics'],
].map(([term, kw]) => ({
  id: `living-${slug(term)}`, term, category: 'Living World', tab: 'living', anchor: 'living-world', keywords: kw,
}));

const STRESS_ENTRIES = [
  ['Famine', 'food supply failure grain exports collapse'],
  ['Plague', 'disease population loss social trust collapsed'],
  ['Siege', 'military encirclement imports cut defense'],
  ['Political Fracture', 'governance contested factions legitimacy'],
].map(([term, kw]) => ({
  id: `stress-${slug(term)}`, term, category: 'Stress', tab: 'stress', anchor: 'stress', keywords: kw,
}));

const CROSS_SETTLEMENT_ENTRIES = [
  ['NPC Contacts', 'named npcs paired category relationship'],
  ['Cross-Settlement Conflicts', 'disputes market contests border incursions intelligence'],
  ['Bidirectional Cascade', 'rename npc faction propagates linked partner'],
  ['Delink Cleanup', 'removing link removes contacts conflicts'],
].map(([term, kw]) => ({
  id: `xset-${slug(term)}`, term, category: 'Neighbour System', tab: 'neighbour', anchor: 'neighbours', keywords: kw,
}));

// ── Derived entries from the shared arrays (zero-drift) ────────────────────

const ARCHETYPE_ENTRIES = ARCHETYPES.map((a) => ({
  id: `arch-${slug(a.name)}`,
  term: a.name,
  category: 'Archetype',
  tab: 'power',
  anchor: 'archetypes',
  keywords: `${a.cat} ${a.cond} ${a.desc}`,
}));

const REL_ENTRIES = REL_TYPES.map((r) => ({
  id: `rel-${slug(r.id)}`,
  term: r.label,
  category: 'Neighbour Relationship',
  tab: 'neighbour',
  anchor: 'neighbours',
  keywords: r.effect,
}));

// Institution entries derived from the SAME data table the Institutions tab
// ultimately renders (zero-drift). Walk tiers → categories → institutions,
// dedupe by name, and cap so the largest catalog can't flood the index or
// unbalance ranking — enough to route the reader to the tab, not a second copy
// of every entry. Best-effort: a malformed table yields no rows rather than
// throwing (the index stays a navigation aid).
const INSTITUTION_CAP = 80;
const INSTITUTION_ENTRIES = (() => {
  const seen = new Set();
  const out = [];
  for (const tierCat of Object.values(institutionalCatalog || {})) {
    for (const [category, insts] of Object.entries(tierCat || {})) {
      for (const [name, def] of Object.entries(insts || {})) {
        if (!name || seen.has(name)) continue;
        seen.add(name);
        out.push({
          id: `inst-${slug(name)}`,
          term: name,
          category: 'Institution',
          tab: 'institutions',
          anchor: 'institutions',
          keywords: `${category} ${def?.desc || ''} ${(def?.tags || []).join(' ')}`.trim(),
        });
        if (out.length >= INSTITUTION_CAP) return out;
      }
    }
  }
  return out;
})();

/**
 * The flat, frozen index. Order here is the stable tiebreak order when
 * two entries score equally (after term-length).
 */
export const COMPENDIUM_INDEX = Object.freeze([
  ...TIER_ENTRIES,
  ...ROUTE_ENTRIES,
  ...THREAT_ENTRIES,
  ...ECONOMY_ENTRIES,
  ...ARCHETYPE_ENTRIES,
  ...ARCANE_ENTRIES,
  ...LIVING_WORLD_ENTRIES,
  ...STRESS_ENTRIES,
  ...REL_ENTRIES,
  ...CROSS_SETTLEMENT_ENTRIES,
  ...INSTITUTION_ENTRIES,
].map(Object.freeze));

// ── Scoring ────────────────────────────────────────────────────────────────

/** @param {any} entry @param {string} q @param {string[]} tokens */
function scoreEntry(entry, q, tokens) {
  const term = entry.term.toLowerCase();
  const haystack = `${term} ${(entry.keywords || '').toLowerCase()} ${entry.category.toLowerCase()}`;

  if (term === q) return 100;
  if (term.startsWith(q)) return 80;
  // word-boundary start inside a multi-word term (e.g. "city" in "Mage City")
  if (term.split(/\s+/).some(/** @param {string} w */ w => w.startsWith(q))) return 65;
  if (term.includes(q)) return 55;
  if (haystack.includes(q)) return 35;
  // every token present somewhere — handles out-of-order multi-word queries
  if (tokens.length > 1 && tokens.every(/** @param {string} t */ t => haystack.includes(t))) return 20;
  return 0;
}

/**
 * Search the Compendium index. Pure; returns ranked navigation targets.
 *
 * @param {string} query — raw user input.
 * @param {{ limit?: number, index?: ReadonlyArray<object> }} [opts]
 * @returns {Array<object>} ranked entries (the index objects themselves).
 */
export function searchCompendium(query, opts = {}) {
  const limit = opts.limit ?? 8;
  const index = opts.index ?? COMPENDIUM_INDEX;
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  /** @type {Array<{ entry: any, score: number }>} */
  const scored = [];
  for (const entry of index) {
    const score = scoreEntry(entry, q, tokens);
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // shorter term = more specific match → rank first
    if (a.entry.term.length !== b.entry.term.length) {
      return a.entry.term.length - b.entry.term.length;
    }
    return a.entry.term.localeCompare(b.entry.term);
  });

  return scored.slice(0, limit).map(s => s.entry);
}
