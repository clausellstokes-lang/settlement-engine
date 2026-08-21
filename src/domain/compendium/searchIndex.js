/**
 * domain/compendium/searchIndex.js — P139 / CP-4 global type-ahead search.
 *
 * The Compendium's per-tab search only ever filters the tab you're
 * already on. The critique (CP-4) flagged that a reader who knows the
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

import { COMPENDIUM_DATA as CD } from './generated/compendiumData.generated.js';
import { compareCodepoint } from '../deterministicSort.js';

// Valid destination tabs — must mirror the TABS ids in CompendiumPanel EXACTLY.
// Pinned by tests/domain/compendiumSearch.test.js, which source-scans the panel's
// TABS block so a new tab (like 'living', added 2026-07-16 — the global index had
// drifted: the Living World tab was in the panel but not here, so a search could
// never route to it) reds this until it is added (domain-region-dossier-guidance-5).
export const COMPENDIUM_TABS = Object.freeze([
  'overview', 'tiers', 'economy', 'power', 'institutions', 'operations', 'arcane',
  'living', 'lenses', 'facets', 'stress', 'calamity', 'neighbour', 'az',
]);

/**
 * @typedef {Object} CompendiumEntry
 * @property {string} id
 * @property {string} term
 * @property {string} category
 * @property {string} tab
 * @property {string} anchor
 * @property {string} [keywords]
 */

// kebab-case slug for stable entry ids and anchor fallbacks.
/** @param {unknown} s @returns {string} */
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

// Tier keywords DERIVE their population range from CD.tiers (the engine
// POPULATION_RANGES), so the old stale bands ('Thorp 20-80', 'Town 900-4000') can
// never resurrect in the search surface. Only the qualitative keywords are authored.
/** @type {Record<string, string>} */
const TIER_KW = {
  thorp: 'smallest single institution subsistence',
  hamlet: 'local subsistence minimal trade',
  village: 'surplus weekly market guilds begin',
  town: 'specialization guilds form',
  city: 'institutional diversity factional politics',
  metropolis: 'largest all systems active complex factions',
};
const TIER_ENTRIES = CD.tiers.map((t) => ({
  id: `tier-${slug(t.label)}`, term: t.label, category: 'Tier', tab: 'tiers', anchor: 'tiers',
  keywords: `${TIER_KW[t.id] || ''} ${t.min}-${t.max}`,
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

// The engine's canonical monster-threat vocabulary is heartland/frontier/plagued
// (config display names Safe Heartland / Active Frontier / Embattled Region). The old
// 'Safe'/'Dangerous' were phantom rungs; keep them only as search keywords.
const THREAT_ENTRIES = [
  ['Safe Heartland', 'heartland safe monsters rumor civilian institutions'],
  ['Active Frontier', 'frontier active managed threat walls garrison patrols'],
  ['Embattled Region', 'plagued embattled dangerous monster plague crisis siege-like militia war'],
].map(([term, kw]) => ({
  id: `threat-${slug(term)}`, term, category: 'Monster Threat', tab: 'tiers', anchor: 'threat', keywords: kw,
}));

const ECONOMY_ENTRIES = [
  ['Prosperity Tiers', 'subsistence to wealthy derived output wealth'],
  ['Priority Sliders', 'shift institutional probability economy military religion magic criminal'],
  ['Exports & Imports', 'surplus production gaps trade vulnerability dependency'],
  ['Supply Chains', 'linked production sequences broken input degrades'],
  ['Coherence Check', 'viability score coherent marginal not coherent economic logical sense fragile supporting prosperity'],
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

// The Living World tab (aboutLiving.systems) — the premium living-simulation systems
// the reader searches for by name ("war", "pantheon", "chronicle") without knowing the
// tab. Concise navigation entries mirroring the four LivingWorldTab systems; anchor
// 'living-world' (CompendiumPanel ANCHOR_MAP). (guidance-5: this tab was searchable
// nowhere before.)
const LIVING_ENTRIES = [
  ['Advance Time', 'push the world forward a month living simulation region responds premium cartographer'],
  ['The Self-Ending War', 'siege coalition war exhaustion homeostasis burns out returns to peace'],
  ['The Living Pantheon', 'deity contest converts seats cult major faith rises alignment corruption'],
  ['The Chronicle', 'history pulse record scrubbable what happened self-writing'],
].map(([term, kw]) => ({
  id: `living-${slug(term)}`, term, category: 'Living World', tab: 'living', anchor: 'living-world', keywords: kw,
}));

// ── Derived entries from the shared arrays (zero-drift) ────────────────────

const ARCHETYPE_ENTRIES = CD.archetypes.entries.map((a) => ({
  id: `arch-${slug(a.name)}`,
  term: a.name,
  category: 'Archetype',
  tab: 'power',
  anchor: 'archetypes',
  keywords: `${a.cat} ${a.cond} ${a.desc}`,
}));

const REL_ENTRIES = CD.relationships.entries.map((r) => ({
  id: `rel-${slug(r.id)}`,
  term: r.label,
  category: 'Neighbour Relationship',
  tab: 'neighbour',
  anchor: 'neighbours',
  keywords: r.effect,
}));

// ── New registry hubs — derived from the generated artifact (zero-drift) ────
// The premade-deity roster was removed (owner ruling 2026-07-21: no premade
// deities; they enter a world only via custom-content authoring), so there is no
// deity index entry — custom-deity authoring lives in the My Custom Content workspace.

// The operation entry's display term is the authored, human label; the raw
// camelCase opType stays searchable via keywords, and the anchor keeps the
// op-<slug(opType)> form so existing deep-links survive.
const OPERATION_ENTRIES = CD.operations.entries.map((o) => ({
  id: `op-${slug(o.opType)}`,
  term: o.label,
  category: 'Operation',
  tab: 'operations',
  anchor: `op-${slug(o.opType)}`,
  keywords: `${o.opType} ${o.klass} ${o.targetScope} ${o.receiptRef || ''} ${o.undoToken ? 'undo reversible' : 'one-way'}`,
}));

const SYSTEM_ENTRIES = CD.systems.map((s) => ({
  id: `system-${slug(s.id)}`,
  term: s.label,
  category: 'Living World System',
  tab: 'living',
  anchor: `system-${slug(s.id)}`,
  keywords: `${s.flag} ${s.dormant ? 'dormant' : s.presets.join(' ')} simulation`,
}));

const LENS_ENTRIES = CD.lenses.entries.map((l) => ({
  id: `lens-${slug(l.id)}`,
  term: l.label,
  category: 'Map Lens',
  tab: 'lenses',
  anchor: `lens-${slug(l.id)}`,
  keywords: `${l.id} map style render`,
}));

const CALAMITY_ENTRIES = CD.calamity.flavors.map((f) => ({
  id: `calamity-${slug(f.key)}`,
  term: f.title,
  category: 'Calamity',
  tab: 'calamity',
  anchor: `calamity-${slug(f.key)}`,
  keywords: `${f.key} disaster great calamity`,
}));

// The W6 band ladders (prosperity, priority, chain status, coherence, food security,
// stability, strain, severity, magnitude, capture, pantheon rank, magic level/legality)
// were unreachable via the search box. Derive one entry per ladder from CD.bandLadders
// (registry-derived, zero-drift), so searching a rung name ('Struggling', 'Capture',
// 'Forbidden') routes to the ladder's tab.
const LADDER_ENTRIES = CD.bandLadders.map((l) => ({
  id: `ladder-${slug(l.id)}`,
  term: l.concept,
  category: 'Concept',
  tab: l.tab,
  anchor: l.anchor,
  keywords: `${l.levels.map((x) => x.name).join(' ')} ${l.blurb}`,
}));

/**
 * The flat, frozen index. Order here is the stable tiebreak order when
 * two entries score equally (after term-length).
 * @type {ReadonlyArray<CompendiumEntry>}
 */
export const COMPENDIUM_INDEX = Object.freeze(/** @type {CompendiumEntry[]} */ ([
  ...TIER_ENTRIES,
  ...ROUTE_ENTRIES,
  ...THREAT_ENTRIES,
  ...ECONOMY_ENTRIES,
  ...ARCHETYPE_ENTRIES,
  ...ARCANE_ENTRIES,
  ...LIVING_ENTRIES,
  ...SYSTEM_ENTRIES,
  ...STRESS_ENTRIES,
  ...REL_ENTRIES,
  ...CROSS_SETTLEMENT_ENTRIES,
  ...LADDER_ENTRIES,
  ...OPERATION_ENTRIES,
  ...LENS_ENTRIES,
  ...CALAMITY_ENTRIES,
].map(Object.freeze)));

// ── Scoring ────────────────────────────────────────────────────────────────

/**
 * @param {CompendiumEntry} entry
 * @param {string} q
 * @param {string[]} tokens
 * @returns {number}
 */
function scoreEntry(entry, q, tokens) {
  const term = entry.term.toLowerCase();
  const haystack = `${term} ${(entry.keywords || '').toLowerCase()} ${entry.category.toLowerCase()}`;

  if (term === q) return 100;
  if (term.startsWith(q)) return 80;
  // word-boundary start inside a multi-word term (e.g. "city" in "Mage City")
  if (term.split(/\s+/).some(w => w.startsWith(q))) return 65;
  if (term.includes(q)) return 55;
  if (haystack.includes(q)) return 35;
  // every token present somewhere — handles out-of-order multi-word queries
  if (tokens.length > 1 && tokens.every(t => haystack.includes(t))) return 20;
  return 0;
}

/**
 * Search the Compendium index. Pure; returns ranked navigation targets.
 *
 * @param {string} query — raw user input.
 * @param {{ limit?: number, index?: ReadonlyArray<CompendiumEntry> }} [opts]
 * @returns {Array<CompendiumEntry>} ranked entries (the index objects themselves).
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
    return compareCodepoint(a.entry.term, b.entry.term);
  });

  return scored.slice(0, limit).map(s => s.entry);
}
