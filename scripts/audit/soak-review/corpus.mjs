/**
 * scripts/audit/soak-review/corpus.mjs — the soak's deterministic corpus: seed `soak1k-<i>`,
 * config a pure function of i, born the way the app births one.
 *
 * THE MATRIX IS THE CERTIFICATION SOAK'S OWN (`scripts/audit/generation-certification-soak.mjs ::
 * configForIndex`: tier, culture, terrain, route, monster threat, content profile, magic scenario,
 * the four priority sliders). That generator carries no stress dimension, so this module layers
 * ONE on top and writes no second matrix: twenty stress cells — NONE (forced: the pool mode with
 * an empty pool, `stressGenerator.js :: generateStress` mode 2 → null), RANDOM (the app's own
 * roll, which itself fires a second stress about one time in ten), each of the fifteen types
 * forced singly, and three PAIR cells cycling through every unordered pair whose members both
 * pass their `requiresTier` gate for the tier (`src/data/stressTypes.js :: STRESS_TYPE_MAP`; the
 * random roll's own gate). The cell advances once per block of six consecutive indices, and the
 * tier cycles inside each block, so every tier meets every stress cell (no parity lock between
 * the stress stride and the tier stride).
 *
 * Birth: `loadGenerationLawPayloads` once, then `birthConfig({ ...DEFAULT_CONFIG, ...cell })` and
 * `generateSettlementPipeline(config, null, { seed })` — the calls of
 * tests/domain/foodEnduranceLine.test.js. The certification soak runs NO world-pulse ticks
 * (it inspects the dossier as generated), so neither does this corpus: a pulse leg would be a
 * second program, not the certification soak's ticks.
 */
import { createHash } from 'node:crypto';

import { configForIndex } from '../generation-certification-soak.mjs';
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

/** The stress cell for index i, and the config keys that force it. */
export function stressForIndex(i, tier) {
  const block = Math.floor(i / TIER_ORDER.length);
  const cellIndex = block % STRESS_CELLS.length;
  const cell = STRESS_CELLS[cellIndex];
  if (cell === 'none') return { cell, keys: { selectedStressesRandom: false, selectedStresses: [], stressType: null, stressTypes: [] } };
  if (cell === 'random') return { cell, keys: {} };
  if (cell === 'pair') {
    const pairCell = cellIndex - (STRESS_CELLS.length - 3);
    const ordinal = ((Math.floor(block / STRESS_CELLS.length) * 3 + pairCell) * TIER_ORDER.length + TIER_ORDER.indexOf(tier)) % PAIRS.length;
    for (let tries = 0; tries < PAIRS.length; tries += 1) {
      const pair = PAIRS[(ordinal + tries) % PAIRS.length];
      if (pair.every((t) => allows(t, tier))) return { cell: `pair:${pair.join('+')}`, keys: { stressTypes: [...pair], stressType: null } };
    }
  }
  return { cell, keys: { stressType: cell, stressTypes: [cell] } };
}

export function seedFor(i) { return `soak1k-${i}`; }

/** The full input of settlement i: its seed, the matrix cell and the config the app would pass. */
export function cellFor(i) {
  const matrix = configForIndex(i);
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
