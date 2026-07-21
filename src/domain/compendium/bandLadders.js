/**
 * domain/compendium/bandLadders.js — THE BANDED-CONCEPT LADDERS (generator input).
 *
 * THE COMPLAINT. The Compendium described banded concepts in general terms but
 * never ENUMERATED their bands: the Economy tab said prosperity runs "Subsistence
 * to Affluent" ('Affluent' was never a real rung; the prose had drifted from the
 * typed truth) and left the reader to guess what a settlement AT each rung is like.
 * A banded object's entry must render its full ladder — every level named, each
 * with a one-line reading of how to interpret a settlement sitting there.
 *
 * WHAT THIS IS. A pure assembly of the four banded concepts the Compendium shows
 * as ladders, projected from the engine's TYPED tables. It is a GENERATOR INPUT,
 * not a runtime import: generate-compendium-data.mjs bakes buildBandLadders() into
 * the frozen COMPENDIUM_DATA artifact (CD.bandLadders), and the tabs render from
 * that artifact — so the ladders obey the REGISTRY-RENDER LAW (every enumerable the
 * Compendium shows renders from CD, byte-identity + parity pinned) and add ZERO
 * engine weight to the lazy Compendium chunk (CD is pure data).
 *
 * SOURCES — names are READ from the canonical table, never hand-duplicated:
 *   - Prosperity ... PROSPERITY_TIERS (src/data/constants.js). The enum carries no
 *                    interpretation, so the per-rung READING is authored below
 *                    (PROSPERITY_READINGS), both-directions coverage-pinned.
 *   - Stability .... glossary 'stability-band' (state/bands.js BAND_HINT).
 *   - Strain ....... glossary 'strain-band'    (capacityModel CAPACITY_BANDS).
 *   - Capture ...... glossary 'capture-rung'   (corruption CAPTURE_LADDER).
 *   The last three READ both name and reading from the glossary derivation — zero
 *   authoring, zero drift (their readings live in glossary.js, freshness-pinned,
 *   and the tab/anchor routing mirrors the glossary's own LINK map).
 *
 * THE PIN (tests/ui/compendiumBandLadders.test.jsx): a totality walker — every
 * ladder carries every canonical rung with a non-empty reading, and the tab DOM
 * renders each rung. A new band added to any canonical table without a reading
 * REDS. That makes the "describes but never enumerates" complaint unrepeatable.
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
export const PROSPERITY_READINGS = Object.freeze({
  Subsistence: 'Bare survival. The settlement feeds itself and little more, with no cushion for a bad season.',
  Struggling:  'Chronically short. Basic needs are met unevenly and any shock is felt at once.',
  Poor:        'Getting by. Essentials are covered but there is no surplus to build with or trade on.',
  Moderate:    'Steady and ordinary. The settlement supports itself with a thin margin to spare.',
  Comfortable: 'Reliable surplus. Trade and craft carry it well past subsistence, and reserves exist.',
  Prosperous:  'Visibly well off. Surplus funds its institutions and defenses across a broad web of trade.',
  Wealthy:     'Abundant. The settlement commands wide trade and reserves deep enough to outlast most crises.',
});

/**
 * Authored per-ladder framing: the concept name, the tab it renders in (mirrors the
 * glossary LINK map), and a one-line blurb of what the concept IS (kept em-dash-free
 * and free of engine tokens). Order here is the Compendium render order.
 * @type {ReadonlyArray<{id:string, concept:string, blurb:string, tab:string, anchor:string, category?:string}>}
 */
const LADDER_META = Object.freeze([
  { id: 'prosperity', concept: 'Prosperity', tab: 'economy', anchor: 'economy',
    blurb: 'Derived from export volume, income sources, supply chains, trade route, and safety. Not a dial you set. An output you read.' },
  { id: 'stability', concept: 'Settlement Stability', tab: 'stress', anchor: 'stress', category: 'stability-band',
    blurb: 'How a settlement’s overall health reads at a glance, on a 0 to 100 scale.' },
  { id: 'strain', concept: 'Capacity Strain', tab: 'stress', anchor: 'stress', category: 'strain-band',
    blurb: 'How a single capacity such as food, defense, or healing reads against the demand on it.' },
  { id: 'capture', concept: 'Criminal Capture', tab: 'power', anchor: 'power', category: 'capture-rung',
    blurb: 'How far a criminal interest has taken a seat of power.' },
]);

/**
 * @typedef {Object} BandLevel
 * @property {string} name    — the display name of the rung (already humanized).
 * @property {string} reading — one sentence on how to read a settlement at this rung.
 */

/**
 * Build the levels for one ladder. Prosperity reads names from PROSPERITY_TIERS and
 * pairs each with its authored reading; the glossary-backed ladders read name +
 * reading straight from the glossary derivation.
 * @param {{id:string, category?:string}} meta
 * @returns {BandLevel[]}
 */
function levelsFor(meta) {
  if (meta.id === 'prosperity') {
    return PROSPERITY_TIERS.map((name) => ({
      name,
      reading: /** @type {Record<string, string>} */ (PROSPERITY_READINGS)[name],
    }));
  }
  const entries = glossaryByCategory()[/** @type {string} */ (meta.category)] || [];
  return entries.map((e) => ({ name: e.term, reading: e.definition }));
}

/**
 * THE ASSEMBLY — build every banded-concept ladder the Compendium renders, from the
 * live typed tables. Pure, deterministic. Returns plain JSON-serialisable objects so
 * the generator can bake the result into COMPENDIUM_DATA verbatim.
 * @returns {Array<{id:string, concept:string, blurb:string, tab:string, anchor:string, levels:BandLevel[]}>}
 */
export function buildBandLadders() {
  return LADDER_META.map((meta) => ({
    id: meta.id,
    concept: meta.concept,
    blurb: meta.blurb,
    tab: meta.tab,
    anchor: meta.anchor,
    levels: levelsFor(meta),
  }));
}
