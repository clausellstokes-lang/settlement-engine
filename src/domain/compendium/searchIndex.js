/**
 * domain/compendium/searchIndex.js - P139 / CP-4 global type-ahead search.
 *
 * The Compendium's per-tab search only ever filters the tab you're
 * already on. The critique (CP-4) flagged that a reader who knows the
 * word "theocracy" but not which tab it lives under has no way in - the
 * search is local, the knowledge is global.
 *
 * This module builds ONE flat, searchable index across every built-in
 * catalog section and exposes a pure `searchCompendium(query)` that
 * returns ranked navigation targets. Each result carries the `tab` it
 * lives on and an `anchor` hash, so the UI can switch tabs and scroll
 * the reader to the right place.
 *
 * The index is a NAVIGATION aid, not the display source - the tabs still
 * render their own content. That decoupling is deliberate: a slightly
 * stale index entry still routes the reader to a valid, live tab rather
 * than 404-ing. The two big arrays (archetypes, relationship types) are
 * imported from `catalogData.js`, the same source the tabs render, so
 * those stay drift-free automatically.
 *
 * Pure module - no React, no DOM, no flags. Safe to unit test in node.
 */

import { ARCHETYPES, REL_TYPES } from './catalogData.js';

// Valid destination tabs - must mirror the TABS ids in CompendiumPanel.
export const COMPENDIUM_TABS = Object.freeze([
  'tiers', 'economy', 'power', 'arcane', 'stress', 'neighbour', 'institutions',
]);

// kebab-case slug for stable entry ids and anchor fallbacks.
function slug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Curated reference entries for the smaller, hardcoded sections ──────────
// These mirror the inline arrays the Tiers / Economy / Magic / Stress
// tabs render. They're concise on purpose - enough to match a query and
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

const ARCANE_ENTRIES = [
  ['Magic as Economic Buffer', 'high magic buffer deficits substitute production'],
  ['Magic Suppression', 'heresy religion magic goods suppressed'],
  ['Arcane-Criminal Ecosystem', 'arcane black market criminal magic'],
  ['Religion & Governance', 'theocracy religious fraud church'],
  ['Magic & Faith Unified', 'mage theocracy arcane clergy governs'],
].map(([term, kw]) => ({
  id: `arcane-${slug(term)}`, term, category: 'Magic & Religion', tab: 'arcane', anchor: 'magic', keywords: kw,
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
  ...STRESS_ENTRIES,
  ...REL_ENTRIES,
  ...CROSS_SETTLEMENT_ENTRIES,
].map(Object.freeze));

// ── Scoring ────────────────────────────────────────────────────────────────

function scoreEntry(entry, q, tokens) {
  const term = entry.term.toLowerCase();
  const haystack = `${term} ${(entry.keywords || '').toLowerCase()} ${entry.category.toLowerCase()}`;

  if (term === q) return 100;
  if (term.startsWith(q)) return 80;
  // word-boundary start inside a multi-word term (e.g. "city" in "Mage City")
  if (term.split(/\s+/).some(w => w.startsWith(q))) return 65;
  if (term.includes(q)) return 55;
  if (haystack.includes(q)) return 35;
  // every token present somewhere - handles out-of-order multi-word queries
  if (tokens.length > 1 && tokens.every(t => haystack.includes(t))) return 20;
  return 0;
}

/**
 * Search the Compendium index. Pure; returns ranked navigation targets.
 *
 * @param {string} query - raw user input.
 * @param {{ limit?: number, index?: ReadonlyArray<object> }} [opts]
 * @returns {Array<object>} ranked entries (the index objects themselves).
 */
export function searchCompendium(query, opts = {}) {
  const limit = opts.limit ?? 8;
  const index = opts.index ?? COMPENDIUM_INDEX;
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

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
