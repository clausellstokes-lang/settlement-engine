/**
 * domain/compendium/bandLadders.js — THE COMPENDIUM BAND LADDERS (W6).
 *
 * THE COMPLAINT. The Compendium described banded concepts in general terms but
 * never ENUMERATED their bands: the Economy tab said prosperity runs "Subsistence
 * to Affluent" ('Affluent' is not even a real rung) and left the reader to guess
 * what a settlement AT each rung is like. A banded object's entry must render its
 * full ladder — every level named, each with a one-line reading of how to
 * interpret a settlement sitting there.
 *
 * THE ANSWER (FINITE-SEMANTICS). One pure projection of the engine's TYPED band
 * tables into a uniform ladder shape the compendium tabs render, so the reference
 * can never drift from what the simulation actually does. This is the same
 * generate-from-the-registry idiom as domain/display/glossary.js; the two share a
 * source for the three system-state ladders (stability / strain / capture), so a
 * reading authored once shows up in the glossary AND the compendium, pinned by
 * ONE freshness guard.
 *
 * SOURCES — names are READ from the canonical table, never hand-duplicated here:
 *   - Prosperity ... PROSPERITY_TIERS (src/data/constants.js) — the canonical rank
 *                    list. The enum carries no interpretation, so the per-rung
 *                    READING is authored below (PROSPERITY_READINGS) with a
 *                    both-directions coverage pin (the glossary *_DEFS idiom).
 *   - Stability .... glossary 'stability-band'  (state/bands.js BAND_HINT).
 *   - Strain ....... glossary 'strain-band'     (capacityModel CAPACITY_BANDS).
 *   - Capture ...... glossary 'capture-rung'    (corruption CAPTURE_LADDER).
 *   The last three READ both name and reading from the glossary derivation — zero
 *   authoring, zero drift (their readings live in glossary.js, freshness-pinned).
 *
 * THE PIN (tests/ui/compendiumBandLadders.test.jsx): a totality walker — every
 * ladder renders every canonical band with a non-empty reading, and the compendium
 * DOM actually shows each rung. A new band added to any canonical table without a
 * reading REDS. That is what makes the "describes but never enumerates" complaint
 * structurally unrepeatable.
 *
 * FIRST-PAINT: imported only by the lazy Compendium (CatalogTabs → CompendiumPanel,
 * mounted via lazy() in AppViews). It pulls the glossary derivation, which is a
 * lazy reference surface, so the chunk cost is runtime-only — zero first-paint bytes.
 *
 * PURE + deterministic: frozen sources, stable source order, no store, no wall-clock.
 */

import { PROSPERITY_TIERS } from '../../data/constants.js';
import { glossaryByCategory } from '../display/glossary.js';

/**
 * Authored one-line readings for the prosperity rungs. PROSPERITY_TIERS carries
 * only names, so the interpretation is authored HERE (the glossary *_DEFS idiom)
 * with a both-directions coverage pin: a new rung without a reading REDS, an
 * orphan reading REDS. Never invents a fact — each line states what a settlement
 * at that rung is like economically, anchored to the causalState PROSPERITY_BASE
 * 0-100 scale (Subsistence 28 ... Moderate 50 ... Wealthy 86). House voice: terse,
 * present tense, no em-dash, no exclamation, no engine tokens.
 * @type {Readonly<Record<string, string>>}
 */
const PROSPERITY_READINGS = Object.freeze({
  Subsistence: 'Bare survival. The settlement feeds itself and little more, with no cushion for a bad season.',
  Struggling:  'Chronically short. Basic needs are met unevenly and any shock is felt at once.',
  Poor:        'Getting by. Essentials are covered but there is no surplus to build with or trade on.',
  Moderate:    'Steady and ordinary. The settlement supports itself with a thin margin to spare.',
  Comfortable: 'Reliable surplus. Trade and craft carry it well past subsistence, and reserves exist.',
  Prosperous:  'Visibly well off. Surplus funds its institutions and defenses across a broad web of trade.',
  Wealthy:     'Abundant. The settlement commands wide trade and reserves deep enough to outlast most crises.',
});

/**
 * @typedef {Object} BandLevel
 * @property {string} name    — the display name of the rung (already humanized).
 * @property {string} reading — one sentence on how to read a settlement at this rung.
 */

/**
 * @typedef {Object} BandLadder
 * @property {string} id      — stable slug (the anchor/test key).
 * @property {string} concept — the display heading.
 * @property {string} blurb   — one line on what the concept is (adapted from the
 *                              existing glossary section copy / compendium card).
 * @property {string} tab     — the compendium tab that renders this ladder.
 * @property {string} anchor  — the tab's section #anchor (matches the glossary LINK map).
 * @property {ReadonlyArray<BandLevel>} levels — worst-to-best or source order.
 */

/**
 * Pull a glossary category as a ladder of {name, reading}. The glossary already
 * humanizes the term and carries a non-empty, freshness-pinned definition, so this
 * is a straight read — no authoring, no drift.
 * @param {string} category
 * @returns {BandLevel[]}
 */
function glossaryLadder(category) {
  const groups = glossaryByCategory();
  const entries = groups[category] || [];
  return entries.map((e) => ({ name: e.term, reading: e.definition }));
}

/**
 * THE DERIVATION — build every band ladder the compendium renders, from the live
 * typed tables. Pure, deterministic (stable source order). Returns a frozen array.
 * @returns {ReadonlyArray<BandLadder>}
 */
export function buildCompendiumBandLadders() {
  /** @type {BandLadder[]} */
  const out = [
    {
      id: 'prosperity',
      concept: 'Prosperity',
      blurb: 'Derived from export volume, income sources, supply chains, trade route, and safety. Not a dial you set. An output you read.',
      tab: 'economy',
      anchor: 'economy',
      levels: PROSPERITY_TIERS.map((name) => ({
        name,
        reading: /** @type {Record<string, string>} */ (PROSPERITY_READINGS)[name],
      })),
    },
    {
      id: 'stability',
      concept: 'Settlement Stability',
      blurb: 'How a settlement’s overall health reads at a glance, on a 0 to 100 scale.',
      tab: 'stress',
      anchor: 'stress',
      levels: glossaryLadder('stability-band'),
    },
    {
      id: 'strain',
      concept: 'Capacity Strain',
      blurb: 'How a single capacity such as food, defense, or healing reads against the demand on it.',
      tab: 'stress',
      anchor: 'stress',
      levels: glossaryLadder('strain-band'),
    },
    {
      id: 'capture',
      concept: 'Criminal Capture',
      blurb: 'How far a criminal interest has taken a seat of power.',
      tab: 'power',
      anchor: 'power',
      levels: glossaryLadder('capture-rung'),
    },
  ];
  return Object.freeze(out.map((l) => Object.freeze({ ...l, levels: Object.freeze(l.levels) })));
}

/**
 * The band ladders that belong to one compendium tab, in render order.
 * @param {string} tab
 * @returns {ReadonlyArray<BandLadder>}
 */
export function bandLaddersForTab(tab) {
  return buildCompendiumBandLadders().filter((l) => l.tab === tab);
}
