/**
 * scripts/audit/soak-review/corpus.mjs — the soak's deterministic corpus: seed `soak1k-<i>`,
 * config a pure function of i, born the way the app births one.
 *
 * THE INPUTS ARE DRAWN INDEPENDENTLY (lane SOAK-2 unit 5, "SOAK-3"; the chair's ruling of
 * 2026-11-04). The corpus once wrapped the certification soak's divisor matrix
 * (`scripts/audit/generation-certification-soak.mjs :: configForIndex`), whose strides lock
 * dimensions together inside a tier (content profile ~ culture V 0.975, terrain ~ stress cell
 * 0.634), so a culture effect could not be told from a content-profile effect. Now the tier is
 * the only stratum (`TIER_ORDER[i mod 6]`, an equal share each) and every other dimension —
 * culture, terrain, route, monster threat, content profile, magic scenario, the four priority
 * sliders — is drawn on its own from the kernel's PRNG (`src/kernel/prng.js :: createPRNG`)
 * keyed by (`CORPUS_SEED`, index, dimension name), over the certification soak's own value
 * lists (`GENERATION_DIMENSIONS`, read, never edited). The same index always gives the same
 * cell.
 *
 * THE STRESS CELL is dealt so every cell keeps its share: twenty cells — NONE (forced: the
 * pool mode with an empty pool, `stressGenerator.js :: generateStress` mode 2 → null), RANDOM
 * (the app's own roll), each of the fifteen types forced singly, and three PAIR cells — in
 * rounds of twenty per tier, each round a fresh seeded shuffle keyed by (tier, round), so at
 * 1,000 every cell appears at least eight times in every tier and 48 times in all, and which
 * cell a settlement draws is independent of its other inputs. A PAIR cell draws its pair
 * from the unordered pairs whose members both pass `requiresTier` for the tier
 * (`src/data/stressTypes.js :: STRESS_TYPE_MAP`; the random roll's own gate).
 *
 * Birth: `loadGenerationLawPayloads` once, then `birthConfig({ ...DEFAULT_CONFIG, ...cell })` and
 * `generateSettlementPipeline(config, null, { seed })` — the calls of
 * tests/domain/foodEnduranceLine.test.js. The certification soak runs NO world-pulse ticks
 * (it inspects the dossier as generated), so neither does this corpus: a pulse leg would be a
 * second program, not the certification soak's ticks.
 */
import { createHash } from 'node:crypto';

import { GENERATION_DIMENSIONS } from '../generation-certification-soak.mjs';
import { createPRNG } from '../../../src/kernel/prng.js';
import { STRESS_TYPE_MAP } from '../../../src/data/stressTypes.js';
import { TIER_ORDER } from '../../../src/data/constants.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';

export const STRESS_KEYS = Object.freeze(Object.keys(STRESS_TYPE_MAP));
export const STRESS_CELLS = Object.freeze(['none', 'random', ...STRESS_KEYS, 'pair', 'pair', 'pair']);

const tierAtLeast = (tier, floor) => TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(floor);
const allows = (type, tier) => !STRESS_TYPE_MAP[type]?.requiresTier || tierAtLeast(tier, STRESS_TYPE_MAP[type].requiresTier);
const PAIRS = (() => {
  const out = [];
  for (let a = 0; a < STRESS_KEYS.length; a += 1) for (let b = a + 1; b < STRESS_KEYS.length; b += 1) out.push([STRESS_KEYS[a], STRESS_KEYS[b]]);
  return Object.freeze(out);
})();

/** The corpus's one fixed seed: every draw below is keyed by it, the index and the dimension. */
export const CORPUS_SEED = 'soak-corpus-v2';
const rngFor = (...key) => createPRNG([CORPUS_SEED, ...key].join('|'));

/** The tier of index i: the one stratum. */
export const tierFor = (i) => TIER_ORDER[i % TIER_ORDER.length];

/** The stress cell for index i, and the config keys that force it. */
export function stressForIndex(i, tier) {
  const k = Math.floor(i / TIER_ORDER.length); // i's place among its tier's settlements
  const round = Math.floor(k / STRESS_CELLS.length);
  const deal = rngFor('stress-round', tier, round).shuffle(STRESS_CELLS.map((_, n) => n));
  const cell = STRESS_CELLS[deal[k % STRESS_CELLS.length]];
  if (cell === 'none') return { cell, keys: { selectedStressesRandom: false, selectedStresses: [], stressType: null, stressTypes: [] } };
  if (cell === 'random') return { cell, keys: {} };
  if (cell === 'pair') {
    const allowed = PAIRS.filter((pair) => pair.every((t) => allows(t, tier)));
    const pair = rngFor(i, 'stress-pair').pick(allowed);
    return { cell: `pair:${pair.join('+')}`, keys: { stressTypes: [...pair], stressType: null } };
  }
  return { cell, keys: { stressType: cell, stressTypes: [cell] } };
}

/** The matrix of index i: the tier, then every other input drawn on its own. */
export function matrixFor(i) {
  const draw = (dimension, values) => rngFor(i, dimension).pick(values);
  const slider = (dimension) => rngFor(i, dimension).randInt(0, 100);
  const D = GENERATION_DIMENSIONS;
  return {
    settType: tierFor(i),
    culture: draw('culture', D.cultures),
    terrainOverride: draw('terrain', D.terrains),
    tradeRouteAccess: draw('route', D.routes),
    monsterThreat: draw('monsterThreat', D.threats),
    contentProfile: draw('contentProfile', D.contentProfiles),
    ...draw('magicScenario', D.magicScenarios),
    priorityEconomy: slider('priorityEconomy'),
    priorityMilitary: slider('priorityMilitary'),
    priorityReligion: slider('priorityReligion'),
    priorityCriminal: slider('priorityCriminal'),
  };
}

export function seedFor(i) { return `soak1k-${i}`; }

/** The full input of settlement i: its seed, the matrix cell and the config the app would pass. */
export function cellFor(i) {
  const matrix = matrixFor(i);
  const stress = stressForIndex(i, matrix.settType);
  return { seed: seedFor(i), matrix, stressCell: stress.cell, input: { ...DEFAULT_CONFIG, ...matrix, ...stress.keys } };
}

let lawsLoaded = null;
export function ensureLaws() { lawsLoaded ??= loadGenerationLawPayloads(); return lawsLoaded; }

export const sha = (value) => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex').slice(0, 16);

/** Birth settlement i. */
export function birth(i) {
  const cell = cellFor(i);
  const config = birthConfig(cell.input);
  const settlement = generateSettlementPipeline(config, null, { seed: cell.seed });
  return { ...cell, config, settlement };
}
