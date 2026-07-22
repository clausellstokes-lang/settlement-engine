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
 * Priority bands — the five-rung ladder the engine reads every priority slider
 * through (priorityToCategory, src/generators/economy/prosperity.js). The slider
 * values run 5 to 95 (default 50); these bands decide how strongly a domain shapes
 * the settlement. Names + cut-points stated in each reading; authored, coverage-pinned.
 * @type {ReadonlyArray<BandLevel>}
 */
const PRIORITY_LEVELS = Object.freeze([
  { name: 'Very Low',  reading: 'At or below 15. The engine expects almost nothing of this domain; its institutions are unlikely and its mark on the settlement is faint.' },
  { name: 'Low',       reading: 'Up to 35. A minor emphasis. A few of this domain\'s institutions may appear, but it does not steer the settlement.' },
  { name: 'Medium',    reading: 'Up to 65. The default weight. This domain carries ordinary influence, neither driving the settlement nor absent from it.' },
  { name: 'High',      reading: 'Up to 85. A strong emphasis. The engine expects this domain\'s institutions to be present and to leave a mark.' },
  { name: 'Very High', reading: 'Above 85. A dominant priority. This domain\'s institutions are expected in force and can define the settlement\'s character.' },
]);

/**
 * Supply-chain status — the states the SupplyChainsPanel shows on every chain chip
 * (src/components/new/SupplyChainsPanel.jsx STATUS). Readings paraphrase the canonical
 * status meanings authored as comments in src/domain/supplyChainState.js (honesty gate:
 * lifted, not invented; em-dash-free). Two further engine states, captured and
 * collapsing, are defined but not yet produced by the generator (stated in the blurb).
 * @type {ReadonlyArray<BandLevel>}
 */
const CHAIN_STATUS_LEVELS = Object.freeze([
  { name: 'Running',             reading: 'The chain runs normally with all of its inputs available.' },
  { name: 'Vulnerable',          reading: 'The chain still runs, but under stress; a shock would bite.' },
  { name: 'Impaired',            reading: 'The chain is producing below its normal output.' },
  { name: 'Broken',              reading: 'The chain is offline after a hard failure somewhere upstream.' },
  { name: 'Entrepot',            reading: 'A healthy re-export hub: goods pass through the settlement rather than being made here.' },
  { name: 'Magically Sustained', reading: 'The chain runs on a magical supplement, not on its own health.' },
]);

/**
 * Coherence verdicts — the three verdicts the settlement's coherence check returns
 * (src/components/new/tabs/ViabilityTab.jsx: COHERENT / MARGINAL COHERENCE / NOT
 * COHERENT). It is NOT a numeric score; the tab checks whether the settlement makes
 * logical sense. Authored, coverage-pinned.
 * @type {ReadonlyArray<BandLevel>}
 */
const COHERENCE_LEVELS = Object.freeze([
  { name: 'Coherent',           reading: 'The pieces fit. The settlement holds together with no survival-blocking problem.' },
  { name: 'Marginal Coherence', reading: 'Survivable but strained. It works, yet real weaknesses show.' },
  { name: 'Not Coherent',       reading: 'A critical issue prevents the settlement from surviving as described.' },
]);

/**
 * Pantheon rank — the living-world tier a deity holds, which rises and falls with
 * its seats (a seat is a settlement whose patron is this god). Rank is EARNED through
 * spread, not authored. Seat/tick numbers stated here are pinned to PANTHEON_TUNING by
 * tests/ui/compendiumFaith.test.jsx, so a tuning change reds the copy. Authored.
 * @type {ReadonlyArray<BandLevel>}
 */
const PANTHEON_RANK_LEVELS = Object.freeze([
  { name: 'Cult',  reading: 'A fringe following, with fewer than two settlement seats.' },
  { name: 'Minor', reading: 'Two or three settlement seats.' },
  { name: 'Major', reading: 'Four or more settlement seats, and only a major god can shift a realm\'s magic legality.' },
]);

/**
 * Magic level — the band the generator emits from the Magic priority slider
 * (getMagicLevel, src/data/constants.js: 0 none, <=25 low, <=65 medium, else high).
 * The thresholds stated here are pinned to getMagicLevel by tests/ui/compendiumFaith.test.jsx.
 * @type {ReadonlyArray<BandLevel>}
 */
const MAGIC_LEVEL_LEVELS = Object.freeze([
  { name: 'None',   reading: 'Magic is disabled in this world. There is no magical economy.' },
  { name: 'Low',    reading: 'A magic priority at or below 25. Magic is rare and limited.' },
  { name: 'Medium', reading: 'A magic priority up to 65. A moderate, everyday presence.' },
  { name: 'High',   reading: 'A magic priority above 65. Magic is broad and pervasive.' },
]);

/**
 * Magic legality — the legality facet the magic profile bands (magicLegalityBands,
 * src/domain/magicProfile.js). The dead-magic floor 'absent' is noted in the blurb
 * rather than laddered. Readings state the plain meaning of each legal standing.
 * @type {ReadonlyArray<BandLevel>}
 */
const MAGIC_LEGALITY_LEVELS = Object.freeze([
  { name: 'Forbidden',  reading: 'Magic is outlawed; practicing it is a crime.' },
  { name: 'Restricted', reading: 'Magic is tightly controlled, permitted only in narrow licensed forms.' },
  { name: 'Regulated',  reading: 'Magic is legal but overseen, with rules on who may practice and how.' },
  { name: 'Tolerated',  reading: 'Magic is accepted as an ordinary part of life.' },
  { name: 'Celebrated', reading: 'Magic is embraced and openly honored.' },
]);

/**
 * Food security — the label the food generator stamps from local production, imports,
 * and any magical supplement against demand (src/generators/foodGenerator.js: surplus
 * >40%, deficit >5% / >15% / >40%, plus the famine floor). Thresholds stated in each
 * reading; pinned to the foodGenerator labels by tests/ui/compendiumFoodSecurity.test.jsx.
 * @type {ReadonlyArray<BandLevel>}
 */
const FOOD_SECURITY_LEVELS = Object.freeze([
  { name: 'Surplus',          reading: 'A food surplus above 40 percent. Reserves cushion a bad season and can lift prosperity.' },
  { name: 'Secure',           reading: 'The settlement feeds itself with a small margin.' },
  { name: 'Pressured',        reading: 'A food deficit above 5 percent. The margin is thin and a shock would bite.' },
  { name: 'Import-Dependent', reading: 'A food deficit above 15 percent, covered by imports. A cut trade route turns it into a crisis.' },
  { name: 'Deficit',          reading: 'A food deficit above 40 percent. The settlement cannot feed itself.' },
  { name: 'Active Famine',    reading: 'Famine. Food has failed outright, and it caps prosperity no matter how strong the trade.' },
]);

/**
 * Public legitimacy — how far the populace accepts the ruling power (factionDynamics.js:
 * Endorsed >=75, Approved >=60, Tolerated >=45, Contested >=30, else Legitimacy Crisis).
 * Thresholds stated in each reading; pinned to the factionDynamics labels by
 * tests/ui/compendiumPower.test.jsx. Authored.
 * @type {ReadonlyArray<BandLevel>}
 */
const LEGITIMACY_LEVELS = Object.freeze([
  { name: 'Endorsed',          reading: 'At or above 75. The ruling power is broadly accepted; it governs at full strength and crime finds little room.' },
  { name: 'Approved',          reading: 'At or above 60. Accepted, with a modest edge in the ruling power\'s favour.' },
  { name: 'Tolerated',         reading: 'At or above 45. The ruling power holds on sufferance, with no edge either way.' },
  { name: 'Contested',         reading: 'At or above 30. Acceptance is fraying; the ruling power weakens and crime gains ground.' },
  { name: 'Legitimacy Crisis', reading: 'Below 30. The ruling power has lost the populace; governance can fracture and crime fills the vacuum.' },
]);

/**
 * Safety — how safe daily life is, from enforcement against criminal presence
 * (safetyProfile.js: Very Safe >=3.5x, Safe >=2.0x, Moderate >=1.2x, Unsafe >=0.6x,
 * else Dangerous). Pinned to the safetyProfile labels. Authored.
 * @type {ReadonlyArray<BandLevel>}
 */
const SAFETY_LEVELS = Object.freeze([
  { name: 'Very Safe', reading: 'Enforcement is at least 3.5 times the criminal presence. Fortress towns and occupations sit here.' },
  { name: 'Safe',      reading: 'Enforcement is clearly dominant and criminal elements are suppressed.' },
  { name: 'Moderate',  reading: 'A functional equilibrium; law is present but crime exists.' },
  { name: 'Unsafe',    reading: 'Criminal activity measurably outpaces enforcement.' },
  { name: 'Dangerous', reading: 'Organized crime or a crisis has overwhelmed the watch.' },
]);

/**
 * Defense readiness — the badge each of the five defense arms carries
 * (defenseDisplay.js readinessBadge: Strong >=65, Adequate >=40, Weak >=20, else
 * Critical). Pinned to the readinessBadge thresholds. Authored.
 * @type {ReadonlyArray<BandLevel>}
 */
const DEFENSE_READINESS_LEVELS = Object.freeze([
  { name: 'Strong',   reading: 'Readiness at or above 65. This pressure is well covered.' },
  { name: 'Adequate', reading: 'At or above 40. Covered, but with little margin.' },
  { name: 'Weak',     reading: 'At or above 20. Thinly covered; a real threat would strain it.' },
  { name: 'Critical', reading: 'Below 20. Effectively uncovered against this pressure.' },
]);

/**
 * Authored per-ladder framing: the concept name, the tab it renders in (mirrors the
 * glossary LINK map), and a one-line blurb of what the concept IS (kept em-dash-free
 * and free of engine tokens). A `levels` field carries an authored rung list; a
 * `category` field reads rungs from the glossary; prosperity is special-cased.
 * Order here is the Compendium render order.
 * @type {ReadonlyArray<{id:string, concept:string, blurb:string, tab:string, anchor:string, category?:string, levels?:ReadonlyArray<BandLevel>}>}
 */
const LADDER_META = Object.freeze([
  { id: 'prosperity', concept: 'Prosperity', tab: 'economy', anchor: 'economy',
    blurb: 'Derived from export volume, income sources, supply chains, trade route, and safety. Not a dial you set. An output you read.' },
  { id: 'priority', concept: 'Priority Bands', tab: 'economy', anchor: 'economy', levels: PRIORITY_LEVELS,
    blurb: 'The five priority sliders (economy, military, magic, religion, and criminal) run from 5 to 95 and default to 50. The engine reads each slider on these five bands to decide how strongly that domain shapes the settlement. The magic slider also resolves to a separate magic level the world reads (see the Magic and Religion tab).' },
  { id: 'chain-status', concept: 'Chain Status', tab: 'economy', anchor: 'economy', levels: CHAIN_STATUS_LEVELS,
    blurb: 'Every supply chain the settlement runs carries a status shown as a chip on the dossier. These are the states you will see. Two further engine states, captured and collapsing, are defined but not yet produced by the generator.' },
  { id: 'coherence', concept: 'Coherence Check', tab: 'economy', anchor: 'economy', levels: COHERENCE_LEVELS,
    blurb: 'Not a score. The engine checks whether the settlement makes logical sense and returns one of three verdicts. The findings behind a verdict are graded critical (survival-blocking), implausible (breaks historical believability), dependency (relies on open trade), or inefficiency (waste the settlement can survive).' },
  { id: 'food-security', concept: 'Food Security', tab: 'economy', anchor: 'economy', levels: FOOD_SECURITY_LEVELS,
    blurb: 'How well the settlement feeds itself, read from local production, imports, and any magical supplement against demand. A famine or a severe deficit caps prosperity no matter how strong the trade.' },
  { id: 'stability', concept: 'Settlement Stability', tab: 'stress', anchor: 'stress', category: 'stability-band',
    blurb: 'How a settlement’s overall health reads at a glance, on a 0 to 100 scale.' },
  { id: 'strain', concept: 'Capacity Strain', tab: 'stress', anchor: 'stress', category: 'strain-band',
    blurb: 'How a single capacity such as food, defense, or healing reads against the demand on it.' },
  { id: 'severity', concept: 'Stressor Severity', tab: 'stress', anchor: 'stress', category: 'severity',
    blurb: 'How hard a stressor hits when the DM applies one.' },
  { id: 'magnitude', concept: 'Relief Magnitude', tab: 'stress', anchor: 'stress', category: 'magnitude',
    blurb: 'How much an ally gives when it sends relief.' },
  { id: 'safety', concept: 'Safety', tab: 'stress', anchor: 'stress', levels: SAFETY_LEVELS,
    blurb: 'How safe daily life is, read from enforcement against criminal presence. A crisis stress can override the label with a compound form, such as Tense under an active siege.' },
  { id: 'defense-readiness', concept: 'Defense Readiness', tab: 'stress', anchor: 'stress', levels: DEFENSE_READINESS_LEVELS,
    blurb: 'Each of the five defense arms (beasts and monsters, invasion and war, internal security, economic survival, disasters and famine) carries a readiness badge on this scale. The settlement\'s overall defense reads from well defended down to undefended.' },
  { id: 'legitimacy', concept: 'Public Legitimacy', tab: 'power', anchor: 'power', levels: LEGITIMACY_LEVELS,
    blurb: 'How far the populace accepts the ruling power, on a 0 to 100 scale built from prosperity, safety, defense, and food. It scales how well the ruling power performs and, inversely, how much room crime finds.' },
  { id: 'capture', concept: 'Criminal Capture', tab: 'power', anchor: 'power', category: 'capture-rung',
    blurb: 'How far a criminal interest has taken a seat of power.' },
  { id: 'pantheon-rank', concept: 'Pantheon Rank', tab: 'arcane', anchor: 'faith', levels: PANTHEON_RANK_LEVELS,
    blurb: 'A seat is a settlement whose patron is this god. Rank rises with seats (cult to minor at two, minor to major at four) and falls back below them, but a change must hold for two ticks, and at most two ranks change across the whole realm each tick. Rank is earned through spread, so a single custom deity can rise on its own.' },
  { id: 'magic-level', concept: 'Magic Level', tab: 'arcane', anchor: 'magic', levels: MAGIC_LEVEL_LEVELS,
    blurb: 'The Magic priority slider resolves to one of these levels. None means magic is disabled in the world, not a slider position. The level sets how available magic is and feeds its legality, risk, and role.' },
  { id: 'magic-legality', concept: 'Magic Legality', tab: 'arcane', anchor: 'magic', levels: MAGIC_LEGALITY_LEVELS,
    blurb: 'Where magic exists, its standing in law runs from forbidden to celebrated. Only a major god can shift a realm\'s legality (see the deity axes above). A world with no magic reads as absent.' },
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
 * @param {{id:string, category?:string, levels?:ReadonlyArray<BandLevel>}} meta
 * @returns {BandLevel[]}
 */
function levelsFor(meta) {
  if (meta.id === 'prosperity') {
    return PROSPERITY_TIERS.map((name) => ({
      name,
      reading: /** @type {Record<string, string>} */ (PROSPERITY_READINGS)[name],
    }));
  }
  // An authored rung list (priority / chain-status / coherence) rides on the meta.
  if (meta.levels) return meta.levels.map((l) => ({ name: l.name, reading: l.reading }));
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
