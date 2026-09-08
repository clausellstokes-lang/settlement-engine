/**
 * tests/fixtures/wiringFixtures.js — the wiring census's controls, as DATA.
 *
 * Every fixture here is a tiny composer SOURCE plus the pools it would key, built so that
 * exactly one property of the census can be switched on and off. A control that changes two
 * things at once proves nothing about either.
 *
 * The fixtures are strings on purpose: `wiringCensus` reads source text and never a file, so
 * a control is a literal in this file rather than a temp tree — and the same literal can be
 * mutated by one character to make the paired negative.
 */

/** A composer whose key function selects two of its three pools by a readable predicate. */
export const COMPOSER_TWO_BRANCHES = `
import { readStateProse } from './stateProseKernel.js';

export function moodPoolKey(reading) {
  if (reading?.mood === 'calm') return 'MOOD: calm';
  if (reading?.mood === 'restive') return 'MOOD: restive';
  return null;
}

export function fixtureProse(settlement, readings, options) {
  return readStateProse(CORPUS, 'DS-FIX-1', moodPoolKey(readings.reading), {
    slots: { settlement: settlement.name, seat: readings.seat },
  });
}
`;

/**
 * The same composer with the SECOND branch removed. The pool "MOOD: restive" then has no
 * branch that selects it, which is control (c1): a pool whose key function returns a key no
 * branch selects must read WIRING-UNRESOLVED, never a guess from the pool's own name.
 */
export const COMPOSER_ONE_BRANCH = COMPOSER_TWO_BRANCHES
  .replace("  if (reading?.mood === 'restive') return 'MOOD: restive';\n", '');

/** A composer that keys through a TEMPLATE, so rung 2 of the ladder has its own control. */
export const COMPOSER_TEMPLATE = `
export function posturePoolKey(war) {
  const status = text(war?.status);
  if (!status) return null;
  return \`posture \${status}\`;
}
`;

/** A composer that keys through a module-level TABLE — rung 3. */
export const COMPOSER_TABLE = `
const TERRAIN_POOL_OF = Object.freeze({
  coastal: 'TERRAIN: Coastal',
  upland: 'TERRAIN: Upland',
});

export function terrainPoolKey(config) {
  return TERRAIN_POOL_OF[config?.terrainType] || null;
}
`;

/**
 * A key function whose guard reads `ledger.ghostField` — a reading rooted in NOTHING the
 * composers hold. Control (c3): a predicate over a field the block's reading function never
 * obtains is a finding, not a crash. The census reports it by rooting each predicate field
 * and asking whether car 5's held-facts census carries that root, so the SAME fixture is
 * both halves of the pair: name `ledger` as held and the finding goes away.
 */
export const COMPOSER_PREDICATE_OVER_UNREAD = `
export function driftPoolKey(ledger) {
  if (ledger?.ghostField === 'yes') return 'DRIFT: yes';
  return null;
}
`;

/**
 * The pools each fixture composer keys. A pool is `{text, slots}` per variant, in the shape
 * `loadStateLeaves` hands the walker.
 * @param {ReadonlyArray<{text: string, slots?: string[]}>} variants
 * @returns {ReadonlyArray<{text: string, slots?: string[]}>}
 */
export function pool(variants) { return variants; }

/** Two variants naming only {settlement} — the THIN tier's slot limb. */
export const SETTLEMENT_ONLY = Object.freeze([
  { text: 'The quiet at {settlement} is the quiet of a town with nothing to say.', slots: ['settlement'] },
  { text: 'Nothing at {settlement} has moved since the last account was taken.', slots: ['settlement'] },
]);

/** Two variants naming a slot no bag offers — control (c2). */
export const NAMES_AN_UNFILLED_SLOT = Object.freeze([
  { text: 'The {seat} at {settlement} keeps the rolls.', slots: ['seat', 'settlement'] },
  { text: 'At {settlement} the {seat} is where the rolls are kept.', slots: ['seat', 'settlement'] },
]);

/** The same two variants with the unfilled slot removed — the paired positive. */
export const NAMES_ONLY_FILLED_SLOTS = Object.freeze([
  { text: 'The hall at {settlement} keeps the rolls.', slots: ['settlement'] },
  { text: 'At {settlement} the hall is where the rolls are kept.', slots: ['settlement'] },
]);

/**
 * A firing record built so that two facts co-fire on every town and no pool is keyed on
 * both, and a third fact fires beside a fact it IS keyed with. The pair arm must report the
 * first and refuse the second.
 * @param {number} towns
 * @returns {Array<Array<{block: string, pool: string}>>}
 */
export function firingsCoFiring(towns) {
  /** @type {Array<Array<{block: string, pool: string}>>} */
  const out = [];
  for (let i = 0; i < towns; i++) {
    out.push([
      { block: 'DS-FIX-1', pool: 'MOOD: calm' },
      { block: 'DS-FIX-2', pool: 'TERRAIN: Coastal' },
    ]);
  }
  return out;
}
