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

/**
 * THE SHIPPED LADDER SHAPE — four `if` branches before the last literal, modelled on
 * `economyStateProse.js:557`'s `shadowEconomyPoolKey`.
 *
 * ⛔ THIS FIXTURE EXISTS BECAUSE `COMPOSER_TWO_BRANCHES` COULD NOT FAIL ON THE ESTATE'S OWN
 * SHAPE (INSTR-912 car 10, cure 1). The guard reader anchored its `$`-terminated match at the
 * LEFTMOST `if (`, so with one branch before the literal it read the right guard and with
 * four it swallowed every statement in between — 143 of 310 RESOLVED rows carried
 * `predicate: []` and eleven carried a code fragment as their VALUE, for two whole cars,
 * while the one-branch control stayed green. A control that cannot exercise the shipped shape
 * is a control that measures the fixture.
 *
 * The three tiers carry THREE DIFFERENT thresholds on purpose: under a leftmost reader they
 * collapse into one blob, so "each branch recovers its own value" is the discriminating
 * assertion and not a restatement.
 */
export const COMPOSER_FOUR_BRANCHES = `
import { readStateProse } from './stateProseKernel.js';

export function shadowEconomyPoolKey(safetyProfile) {
  const capture = Number(safetyProfile?.blackMarketCapture);
  if (!Number.isFinite(capture)) return null;
  if (capture >= 30) return 'TIER: a large share off the books';
  if (capture >= 15) return 'TIER: significant off-book activity';
  if (capture >= 3) return 'TIER: minor shadow activity';
  return null;
}

export function fixtureProse(settlement, safetyProfile, options) {
  return readStateProse(CORPUS, 'DS-FIX-6', shadowEconomyPoolKey(safetyProfile), {
    slots: { settlement: settlement.name },
  });
}
`;

/**
 * A fact spoken to ONLY through a deeper path, beside one whose guard the reader cannot
 * parse at all — the two halves of the MISSING tier's 41 % overstatement (car 10, cure 3).
 *
 * `exportPosturePoolKey`'s predicate names `readings.exportPosture.status` while the held
 * fact is `readings.exportPosture`, so a membership test with no `rootOf` calls it MISSING.
 * `flowDriftPoolKey` guards with a regex, which `predicateRows` correctly declines to turn
 * into a `{field, op, value}` row — so the pool carries `predicate: []` and the fact it plainly
 * READS is invisible unless `fieldsRead` is unioned in.
 */
export const COMPOSER_DEEP_PATH = `
export function exportPosturePoolKey(exportPosture) {
  if (exportPosture?.status === 'net exporter') return 'POSTURE: net exporter';
  return null;
}

export function flowDriftPoolKey(flowDrift) {
  if (/\\bstalled\\b/.test(String(flowDrift?.label))) return 'DRIFT: stalled';
  return null;
}

export function fixtureProse(settlement, readings, options) {
  readStateProse(CORPUS, 'DS-FIX-7', exportPosturePoolKey(readings.exportPosture), {});
  return readStateProse(CORPUS, 'DS-FIX-7', flowDriftPoolKey(readings.flowDrift), {});
}
`;

/**
 * A module-level key table written as a PAIR ARRAY and consulted through `.find`, the shape
 * `powerStateProse.js:304`'s `STABILITY_LADDER` uses. Rung 3 read only the object-literal
 * shape, so four DS-POW-2 pools carried the reason *no module-level key table names it* while
 * a module-level key table named every one (car 10, cure 6).
 */
export const COMPOSER_PAIR_TABLE = `
const STABILITY_LADDER = Object.freeze([
  ['stable', 'STABILITY: stable matched'],
  ['critical', 'STABILITY: critical matched'],
]);

export function stabilityPoolKey(stability) {
  const first = text(stability);
  const hit = STABILITY_LADDER.find(([token]) => token === first);
  return hit ? hit[1] : null;
}
`;

/**
 * A key function whose FIRST key is written in DOUBLE quotes and carries an apostrophe —
 * `warFaithStateProse.js:668`'s shape. Two independent faults met here (car 10, cure 7): a
 * single-quote regex scanner read the apostrophe as an opening quote and ate every later key
 * in the function, and a double-quoted key was never a key form at all. One scanner that
 * knows all three quote characters closes both.
 */
export const COMPOSER_DOUBLE_QUOTED_KEY = `
export function nichePoolKey(ranks) {
  if (ranks?.contested === 'yes') {
    return "NICHE: the patron's niche carries a contestant";
  }
  if (ranks?.contested === 'no') return 'NICHE: every niche uncontested';
  if (ranks?.contested === 'none') return 'NICHE: no ranks were recorded';
  return null;
}
`;

/** The same composer with the double-quoted key struck — the paired negative for cure 7. */
export const COMPOSER_DOUBLE_QUOTED_KEY_REMOVED = COMPOSER_DOUBLE_QUOTED_KEY
  .replace('    return "NICHE: the patron\'s niche carries a contestant";\n', '    return null;\n');

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
