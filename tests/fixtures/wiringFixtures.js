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
 * `economyStateProse.js:558`'s `shadowEconomyPoolKey`.
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
 * `powerStateProse.js:305`'s `STABILITY_LADDER` uses. Rung 3 read only the object-literal
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

// ═══════════════════════════════════════════════════════════════════════════════════
// ARCH CAR 0 — the controls for the six new columns. Each fixture switches ONE column
// on, and each ships with the paired composer that switches it off again, so an arm that
// reds on everything is distinguishable from one that reds on the thing it names.
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * A DEFAULT WEARING A READING'S CLOTHES (ARCH §3.3). `threatPoolKey` supplies its own
 * fallback, so an absent producer value arrives as `'frontier'` and no predicate over it
 * can tell absence from the fallback. `gatePoolKey` beside it GUARDS presence first, which
 * is the same read done honestly and the shape `wallRationalePoolKey` actually ships.
 */
export const COMPOSER_DEFAULTING_READ = `
import { readStateProse } from './stateProseKernel.js';

export function threatPoolKey(config) {
  const threat = config?.monsterThreat || 'frontier';
  if (threat === 'plagued') return 'THREAT: embattled';
  return null;
}

export function gatePoolKey(defenseProfile) {
  const gate = defenseProfile?.economicGates?.military;
  if (typeof gate === 'number' && Number.isFinite(gate) && gate < 1) return 'GATE: underfunded';
  return null;
}

export function fixtureProse(settlement, readings, options) {
  readStateProse(CORPUS, 'DS-FIX-10', threatPoolKey(readings.config), { slots: { settlement: settlement.name } });
  return readStateProse(CORPUS, 'DS-FIX-10', gatePoolKey(readings.defenseProfile), { slots: { settlement: settlement.name } });
}
`;

/** The same composer with the fallback struck: the read becomes a MEASUREMENT. */
export const COMPOSER_DEFAULTING_READ_GUARDED = COMPOSER_DEFAULTING_READ
  .replace("config?.monsterThreat || 'frontier'", 'config?.monsterThreat');

/**
 * A COVERT SOURCE (ARCH §2.5, T-F5). `covertWatchPoolKey` reads
 * `compromisedSecurityInstitutions(settlement).covert`, so its pool may hold no unmarked
 * variant and can never be a candidate on the player face. The revealed sibling is the same
 * shape over the same call and is NOT covert, which is what makes the column a reading of
 * the PATH and not of the call.
 *
 * ⚠ TWO KEY FUNCTIONS AND NOT TWO BRANCHES OF ONE, DELIBERATELY. `tests` is every reading
 * the KEY FUNCTION touches (ARCH §3.2's `fieldsRead`), so two branches of one function share
 * one read set and the covert column could not tell them apart — it would mark the revealed
 * pool too. That is the conservative, fail-closed answer on a spine and it is the RIGHT one;
 * it is simply not a control, because a column that answers `true` for both proves nothing.
 */
export const COMPOSER_COVERT_SOURCE = `
import { readStateProse } from './stateProseKernel.js';

export function covertWatchPoolKey(compromised) {
  if (compromised?.covert?.length > 0) return 'WATCH: bought, unexposed';
  return null;
}

export function revealedWatchPoolKey(compromised) {
  if (compromised?.revealed?.length > 0) return 'WATCH: bought, on the record';
  return null;
}

export function fixtureProse(settlement, readings, options) {
  const compromised = compromisedSecurityInstitutions(settlement);
  readStateProse(CORPUS, 'DS-FIX-11', covertWatchPoolKey(compromised), { slots: { settlement: settlement.name } });
  return readStateProse(CORPUS, 'DS-FIX-11', revealedWatchPoolKey(compromised), { slots: { settlement: settlement.name } });
}
`;

/** A variant with NO `dm-only` mark on a covert pool — the projector error of ARCH §2.5. */
export const UNMARKED_ON_A_COVERT_PATH = Object.freeze([
  { text: 'The watch at {settlement} answers to a purse it does not name.', slots: ['settlement'], marks: [] },
  { text: 'At {settlement} the watch is bought, and quietly.', slots: ['settlement'], marks: [] },
]);

/** The same two variants marked `dm-only`, which is what the covert column requires. */
export const MARKED_ON_A_COVERT_PATH = Object.freeze([
  { text: 'The watch at {settlement} answers to a purse it does not name.', slots: ['settlement'], marks: ['dm-only'] },
  { text: 'At {settlement} the watch is bought, and quietly.', slots: ['settlement'], marks: ['dm-only'] },
]);

/**
 * A POLARITY BLOCK (ARCH §4.5, T-F3). Four spines over one polarity field (`walls`), split
 * across THREE key functions so their read sets genuinely differ: `gate` is tested by one
 * spine only, so a would-be modifier of `gate` attaches to the other three — an attach set
 * SPANNING both value classes of `walls`. That is the projector refusal car 4 builds and the
 * set car 0 must be able to hand it.
 *
 * ⚠ THREE FUNCTIONS AND NOT ONE LADDER, for the same reason the covert fixture uses two:
 * `tests` is function-wide, so a four-branch ladder gives all four pools one read set and
 * every attach set collapses to empty. The estate's own DS-DEF-11 is a single four-fact
 * ladder and its attach sets ARE empty under this grain — which is the conservative answer
 * and a finding in its own right, not a fixture to be arranged around.
 */
export const COMPOSER_POLARITY = `
import { readStateProse } from './stateProseKernel.js';

export function wallStrainedPoolKey(forces, gate) {
  if (forces?.walls?.present === true && gate < 1) return 'WALLED-STRAINED';
  return null;
}

export function wallQuietPoolKey(forces) {
  if (forces?.walls?.present === true) return 'WALLED-QUIET';
  return null;
}

export function unwalledPoolKey(forces, tier) {
  if (forces?.walls?.present === false && tier === 'hamlet') return 'UNWALLED-SMALL';
  if (forces?.walls?.present === false) return 'UNWALLED-LARGE';
  return null;
}

export function fixtureProse(settlement, forces, gate, tier, options) {
  readStateProse(CORPUS, 'DS-FIX-12', wallStrainedPoolKey(forces, gate), { slots: { settlement: settlement.name } });
  readStateProse(CORPUS, 'DS-FIX-12', wallQuietPoolKey(forces), { slots: { settlement: settlement.name } });
  return readStateProse(CORPUS, 'DS-FIX-12', unwalledPoolKey(forces, tier), { slots: { settlement: settlement.name } });
}
`;

/**
 * THE SHIPPED LADDER, WHOLE — `defenseStateProse.js:962`'s `wallRationalePoolKey` as a
 * fixture, because the BRANCH GRAIN (SITTING §O.1) has three distinct shapes to get right
 * and only this one carries all three at once:
 *
 *   an ENCLOSING guard (`walls`) that every literal inside the block must have satisfied;
 *   a PRECEDING SIBLING that EXITS (`militaryGate < 1` returns), so the literals after it
 *     were reached by DECIDING it false — ARCH §6.3's "gate (by exclusion)";
 *   a SIBLING BLOCK that exits, after which the guards INSIDE it are NOT on the path — the
 *     UNWALLED literals must read `{walls, tier}` and never the gate or the family.
 *
 * A reader that walks backwards to the nearest `if` gets the first two and fails the third,
 * which is why the fixture is the whole ladder and not a two-branch cut of it.
 */
export const COMPOSER_BRANCH_GRAIN = `
export function wallRationalePoolKey(walls, monsterThreat, militaryGate, tier) {
  if (walls) {
    if (typeof militaryGate === 'number' && militaryGate < 1) {
      return 'WALLED-STRAINED';
    }
    const family = measuredMonsterFamily(monsterThreat);
    if (!family) return null;
    return family === 'settled' ? 'WALLED-QUIET' : 'WALLED-THREATENED';
  }
  const size = text(tier).toLowerCase();
  if (SMALL_TIERS.includes(size)) return 'UNWALLED-SMALL';
  return TOWN_PLUS_TIERS.includes(size) ? 'UNWALLED-LARGE' : null;
}

export function fixtureProse(settlement, options) {
  return readStateProse(CORPUS, 'DS-FIX-13', wallRationalePoolKey(settlement.walls, settlement.monsterThreat, settlement.militaryGate, settlement.tier), {
    slots: { settlement: settlement.name },
  });
}
`;

/**
 * THE SAME LADDER WITH THE ENCLOSING GUARD DISSOLVED — every branch now sits at the top
 * level, so a reader that keeps the path collapses `WALLED-STRAINED` and `UNWALLED-SMALL`
 * onto one read set. The paired negative for the branch grain: with this source the four
 * pools stop disagreeing, and an arm that cannot tell the two sources apart is measuring
 * the fixture.
 */
export const COMPOSER_BRANCH_FLAT = `
export function wallRationalePoolKey(walls, monsterThreat, militaryGate, tier) {
  const family = measuredMonsterFamily(monsterThreat);
  const size = text(tier).toLowerCase();
  if (walls && militaryGate < 1 && family && size) return 'WALLED-STRAINED';
  if (walls && militaryGate && family && size) return 'WALLED-QUIET';
  if (walls && militaryGate && family && size) return 'WALLED-THREATENED';
  if (walls && militaryGate && family && size) return 'UNWALLED-SMALL';
  return null;
}

export function fixtureProse(settlement, options) {
  return readStateProse(CORPUS, 'DS-FIX-13', wallRationalePoolKey(settlement.walls, settlement.monsterThreat, settlement.militaryGate, settlement.tier), {
    slots: { settlement: settlement.name },
  });
}
`;

/**
 * A NUMERIC POOL KEY (P-F12). A key matching `^\\d+$` is refused at projection because a
 * desk that iterated its own pools by index would select one, which is the "never by
 * iterating `pools`" law of ARCH §4.1.
 */
export const COMPOSER_NUMERIC_KEY = `
import { readStateProse } from './stateProseKernel.js';

export function rungPoolKey(reading) {
  if (reading?.rung === 1) return '1';
  if (reading?.rung === 2) return 'RUNG: the second';
  return null;
}

export function fixtureProse(settlement, readings, options) {
  return readStateProse(CORPUS, 'DS-FIX-13', rungPoolKey(readings.reading), {
    slots: { settlement: settlement.name },
  });
}
`;

/**
 * A firing record where one pool of a MOUNTED block fires on every town of one tier and on
 * none of another — ARCH §16 item 7's per-tier silence, as data.
 * @param {number} perTier
 * @returns {Array<{tier: string, fired: Array<{block: string, pool: string}>}>}
 */
export function firingsByTier(perTier) {
  /** @type {Array<{tier: string, fired: Array<{block: string, pool: string}>}>} */
  const out = [];
  for (const tier of ['hamlet', 'city']) {
    for (let i = 0; i < perTier; i++) {
      out.push({
        tier,
        fired: tier === 'city'
          ? [{ block: 'DS-FIX-12', pool: 'WALLED-QUIET' }]
          : [{ block: 'DS-FIX-12', pool: 'UNWALLED-SMALL' }],
      });
    }
  }
  return out;
}
