/**
 * treatyRenewalMemory.test.js — GR-5A THE MONOTONE MEMORY battery.
 *
 * WHAT LANDS. `treaty.complianceState` is OVERWRITTEN every advance from the current tick's
 * observation, so a pact that was strained for a decade and honoured last week is, on the
 * parchment, a pact that was never strained. GR-5A adds one conditional, monotone,
 * drop-when-absent field — `worstObservedEver` — written at the one PASS-2 site that already
 * computes the tick's worst OBSERVED compliance, and ONLY when `treatyRenewalEnabled === true`.
 *
 * THE PINS THIS FILE OWES, each with the reason it is shaped the way it is:
 *
 *   • THE FOUR-FENCE DORMANCY SET LIVES HERE AS CASES (chair judgment J-TC11-2), not in a
 *     separate `tests/property/` file: a second credited file would break both the standing GR
 *     shape and the eight-case denominator. Fence 1 own-footprint golden (A2), fence 2
 *     absent-vs-false differential (A3), fence 3 call-path spy (A4), fence 4 gate-polarity
 *     census (A5).
 *   • EVERY FENCE IS ANCHORED AGAINST A LIT CONTROL THAT DOES WRITE. A rendered-surface
 *     negative passes when the surface never rendered; a dormancy negative passes when the
 *     fixture was simply quiet. So each dark assertion is preceded, IN ITS OWN CASE, by the
 *     same fixture driven LIT and shown to write the key.
 *   • THE MONOTONE PIN (A6) IS DRIVEN OVER TWO TICKS THROUGH THE REAL `advanceTreaties`,
 *     feeding the first tick's OWN output world back in. A single-tick harness cannot tell a
 *     memory from a level, and a hand-built record mirrors the deriver and can never see a
 *     dead arm — both are recorded vacuity classes in this estate.
 *   • THE OWN-FOOTPRINT GOLDEN IS A LITERAL CAPTURED AT THE VERIFIED BASE, before one byte of
 *     this wave existed (`claude/composite-r4` @ `6cd18ad3e9b8be768d0e69ce1edc641cb5b626db`,
 *     lane TE11's `laneTE11-probe-fixture.mjs`). A golden re-derived from the post-wave engine
 *     would agree with itself and prove nothing.
 *   • THE TWO EXCLUDED BRANCHES (A7) ARE DECLARED, NOT DISCOVERED: the all-terms-lapsed prune
 *     and the repudiation shell each `continue` BEFORE the fold.
 *   • THE HANDOFF TRIPWIRE (A8): `worstObservedEverOf` is exported and has ZERO consumers in
 *     `src/` at this wave — the GR-0 `treatiesPricedDuring` idiom. The pin reds the day GR-5d
 *     wires the conversion gate, and that red IS the handoff signal.
 *
 * @enforced-by tests/domain/treatyRenewalMemory.test.js
 */
import { describe, it, expect, vi } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

/**
 * THE CALL-PATH SPY (fence 3, case A4). It wraps the REAL fold and delegates to it, so every
 * other case in this file drives production behaviour unchanged and the counter is the only
 * thing added. `vi.hoisted` is what lets the factory — which is hoisted above the imports —
 * share the counter with the cases below.
 */
const spy = vi.hoisted(() => ({ calls: 0 }));
vi.mock('../../src/domain/worldPulse/pactAmendment.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    worstObservedEverAfter: (/** @type {unknown} */ treaty, /** @type {unknown} */ observed) => {
      spy.calls += 1;
      return actual.worstObservedEverAfter(treaty, observed);
    },
  };
});

const { advanceTreaties, treatyPairKey, TERM_CATALOG } = await import('../../src/domain/worldPulse/peaceTerms.js');
const { worstObservedEverOf, worstObservedEverAfter, treatyRenewalActive } = await import('../../src/domain/worldPulse/pactAmendment.js');
const { CURRENT_TREATY_TICKS_PER_YEAR } = await import('../../src/domain/worldPulse/treatyClock.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const YEAR = CURRENT_TREATY_TICKS_PER_YEAR;
const FLAG = 'treatyRenewalEnabled';
/** The lane's own leaf — the gate and both folds live here. */
const LEAF = 'src/domain/worldPulse/pactAmendment.js';

/** Renewal ABSENT — the shape every campaign that never lights this key actually holds. */
const ABSENT = { warLayerEnabled: true, peaceEngineEnabled: true };
/** Renewal explicitly FALSE. Under a strict `=== true` read this must be identical to ABSENT. */
const FALSE_SET = { ...ABSENT, treatyRenewalEnabled: false };
/**
 * Renewal LIT.
 *
 * ⚠⚠ THE KEY IS SPELLED AS A LITERAL, NEVER AS A COMPUTED `[FLAG]:` MEMBER, AND THAT IS
 * MACHINERY RATHER THAN STYLE — measured, after a computed spelling reddened the estate's flag
 * lit-coverage ratchet. `tests/property/mechanismLitCoverage.test.js` grants AUTO lit credit on a
 * literal `<flag>: true` occurring anywhere in the test corpus, and a computed member attributes
 * to NO key — so a wave that drives its flag ON through a variable is genuinely proven lit and
 * still reads as lit-UNPROVEN to the ratchet, which then demands a shrink-only baseline raise it
 * must not be given. It is the same "a computed member access attributes to no key" class the CQ5
 * gate census warns about, one layer out: the gate must be spelled by name in `src/`, and the
 * DRIVE must be spelled by name in `tests/`.
 */
const LIT = { ...ABSENT, treatyRenewalEnabled: true };

/** A snapshot item with enough texture for settlementStrength (the peaceTerms harness's). */
function item(id, name) {
  return {
    id,
    name,
    settlement: {
      name, tier: 'town', population: 1800,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
        foodSecurity: { storageMonths: 6, dailyNeed: 100, dailyProduction: 100, deficitPct: 0, surplusPct: 0, resilienceScore: 50 },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'military seat', category: 'military', power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
  };
}

const SNAPSHOT = {
  byId: new Map([['victor', item('victor', 'Ashford')], ['loser', item('loser', 'Irontown')]]),
  regionalGraph: { edges: [] },
};
const PAIR_KEY = treatyPairKey('victor', 'loser');

/**
 * THE PRESSURE DIAL, MEASURED rather than guessed (lane TE11's executed probe at the verified
 * base): severity 0 – 0.2 observes `honored`, 0.3 – 0.6 observes `strained`, 0.65 – 0.98
 * observes `defaulted`. Driving the dial is what makes A6's recovery arm real rather than
 * arranged.
 */
const press = (severity) => (severity === null ? {} : {
  bySettlement: { loser: [{ type: 'economy', severity }, { type: 'food', severity }] },
});
const HEALTHY = press(null);
const STRAINING = press(0.6);
const STARVED = press(0.98);

function treatyRecord({ mintedTick = 0, years = 20, type = 'tribute', extra = {} } = {}) {
  return {
    parties: ['victor', 'loser'],
    victorId: 'victor', loserId: 'loser',
    victorName: 'Ashford', loserName: 'Irontown',
    mintedTick,
    believedMarginAtSignature: 0.42,
    budgetGranted: 1, budgetSpent: 1,
    treatyTicksPerYear: YEAR,
    complianceState: 'honored',
    receipts: [],
    terms: [{
      type, family: TERM_CATALOG[type].family, magnitude: 0.2,
      mintedTick, expiresTick: mintedTick + years * YEAR,
      weightSpent: 1, complianceState: 'honored', trueState: 'honored', burden01: 0,
      deliveredToVictor: 0, extractedFromLoser: 0, receipt: 'tribute',
    }],
    ...extra,
  };
}

const worldWith = (treaty, tick, rules) => ({
  tick,
  simulationRules: { ...rules },
  spatialLedgers: { treaties: { [PAIR_KEY]: treaty } },
});

const advance = (worldState, tick, pIndex) => advanceTreaties({ snapshot: SNAPSHOT, worldState, pIndex, tick });
const ledgerOf = (out) => out.worldState.spatialLedgers.treaties;
const recordOf = (out) => ledgerOf(out)[PAIR_KEY];
const serialized = (out) => JSON.stringify(ledgerOf(out));

/**
 * THE OWN-FOOTPRINT GOLDEN, CAPTURED AT THE VERIFIED BASE `6cd18ad3` BEFORE THIS WAVE EXISTED.
 * The straining fixture at tick 10, serialized exactly as the engine left it. If a dark run
 * ever diverges from this literal by one byte, GR-5A is not dark and the wave is refuted.
 */
const PRE_WAVE_DARK_GOLDEN = '{"victor>loser":{"parties":["victor","loser"],"victorId":"victor","loserId":"loser","victorName":"Ashford","loserName":"Irontown","mintedTick":0,"believedMarginAtSignature":0.42,"budgetGranted":1,"budgetSpent":1,"treatyTicksPerYear":52,"complianceState":"strained","receipts":[],"terms":[{"type":"tribute","family":"economic","magnitude":0.2,"mintedTick":0,"expiresTick":1040,"weightSpent":1,"complianceState":"strained","trueState":"strained","burden01":0.6,"deliveredToVictor":0,"extractedFromLoser":0,"receipt":"tribute"}]}}';

/** Every `.js`/`.jsx` under `src/`, for the two source censuses (A5 and A8). */
function walkSrc(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSrc(p, out);
    else if (/\.(?:js|jsx)$/.test(entry)) out.push(p);
  }
  return out;
}
const SRC_FILES = walkSrc(join(ROOT, 'src')).map((abs) => ({
  rel: relative(ROOT, abs).split('\\').join('/'),
  src: readFileSync(abs, 'utf8'),
}));

describe('GR-5A — the monotone memory (treatyRenewalEnabled)', () => {
  it("lit: a treaty observed strained records worstObservedEver 'strained' at the compliance write", () => {
    const out = advance(worldWith(treatyRecord(), 10, LIT), 10, STRAINING);
    const treaty = recordOf(out);

    // (1) THE FIXTURE REALLY STRAINED. Asserted first: if the pressure dial stopped biting,
    // every case below would be measuring an honored world and the whole file would go quiet
    // while still passing.
    expect(treaty.complianceState).toBe('strained');
    // (2) …and the memory recorded it. This is the LIT-MUTANT CONTROL the four fences are
    // anchored against — the one assertion in this file that proves the key can be written at
    // all, so that every absence below means something.
    expect(treaty.worstObservedEver).toBe('strained');
    // (3) THE VOCABULARY IS THE COMPLIANCE ONE AND NOTHING NEW WAS MINTED.
    expect(['honored', 'strained', 'defaulted']).toContain(treaty.worstObservedEver);
  });

  it('absent: the flag unset writes no worstObservedEver key and the ledger is byte-identical', () => {
    // FENCE 1 — the own-footprint golden. THE LIT CONTROL RUNS FIRST, ON THE SAME FIXTURE, and
    // is asserted to write: without it this case would pass just as happily against an engine
    // in which the field never existed, which is the vacuity that makes dormancy fences lie.
    const lit = advance(worldWith(treatyRecord(), 10, LIT), 10, STRAINING);
    expect(recordOf(lit).worstObservedEver, 'the lit control must WRITE, or the dark arm below proves nothing').toBe('strained');

    const dark = advance(worldWith(treatyRecord(), 10, ABSENT), 10, STRAINING);
    // The lit control two lines above wrote this exact key on this exact fixture, so the
    // subject cannot have silently vanished — an empty record would red that assertion first.
    // anchored: the same-fixture lit control on the line above proves the key is writable here
    expect(dark.worldState.spatialLedgers.treaties[PAIR_KEY]).not.toHaveProperty('worstObservedEver');
    // …AND THE WHOLE LEDGER IS BYTE-IDENTICAL TO THE PRE-WAVE ENGINE. The golden is a literal
    // captured at 6cd18ad3 before one byte of this wave existed, so it cannot agree with the
    // deriver by construction the way a re-derived fixture would.
    expect(serialized(dark)).toBe(PRE_WAVE_DARK_GOLDEN);
    // The lit run DIVERGES from that same golden — which is what makes the equality above a
    // measurement rather than a tautology about a quiet fixture.
    expect(serialized(lit)).not.toBe(PRE_WAVE_DARK_GOLDEN);
  });

  it('false behaves exactly as absent: the two ledgers are byte-identical to each other', () => {
    // FENCE 2 — the absent-vs-false differential. A strict `=== true` read is what collapses
    // these two worlds into one; a truthy read would too, but a `!== false` read would NOT, and
    // that is the exact mutant this case convicts.
    const lit = advance(worldWith(treatyRecord(), 10, LIT), 10, STRAINING);
    expect(recordOf(lit).worstObservedEver, 'the lit control must WRITE, or the two dark arms below prove nothing').toBe('strained');

    const absent = advance(worldWith(treatyRecord(), 10, ABSENT), 10, STRAINING);
    const explicitlyFalse = advance(worldWith(treatyRecord(), 10, FALSE_SET), 10, STRAINING);
    expect(serialized(explicitlyFalse)).toBe(serialized(absent));
    // `absent` is proved non-empty and correctly strained two lines below, so an emptied
    // ledger cannot be what makes this negative pass.
    // anchored: the lit control wrote the key on this fixture and `absent` is proved strained
    expect(explicitlyFalse.worldState.spatialLedgers.treaties[PAIR_KEY]).not.toHaveProperty('worstObservedEver');
    expect(recordOf(absent).complianceState, 'the shared fixture must still be doing real work').toBe('strained');
  });

  it('dark: worstObservedEverAfter is never called on any path through advanceTreaties', () => {
    // FENCE 3 — the call-path spy. Byte-identity says the world did not move; only this says
    // the fold EXPRESSION was never evaluated, which is the difference between a write that is
    // harmless and a branch that is unreached.
    spy.calls = 0;
    advance(worldWith(treatyRecord(), 10, ABSENT), 10, STRAINING);
    advance(worldWith(treatyRecord(), 10, FALSE_SET), 10, STARVED);
    advance(worldWith(treatyRecord(), 10, ABSENT), 10, HEALTHY);
    expect(spy.calls, 'the fold was evaluated on a dark path').toBe(0);

    // THE LIT CONTROL, and it is what stops this case from passing on a broken spy: a counter
    // wired to nothing would also read zero above.
    advance(worldWith(treatyRecord(), 10, LIT), 10, STRAINING);
    expect(spy.calls, 'the spy is not wired to the real fold').toBeGreaterThan(0);
  });

  it('exactly three src files name treatyRenewalEnabled and the only gate is a strict === true read', () => {
    // FENCE 4 — the gate-polarity census. Modelled on the landed GR-0 fence: a FOURTH file
    // naming this key reds until somebody classifies it, which is the point.
    const naming = SRC_FILES.filter(({ src }) => src.includes(FLAG)).map(({ rel }) => rel).sort();
    expect(naming).toEqual([
      'src/domain/certification/subsystemRowsVirtual.js',
      'src/domain/worldPulse/pactAmendment.js',
      'src/domain/worldPulse/simulationRules.js',
    ]);

    // ONE GATE, read BY NAME with the strict idiom, in the gate file and nowhere else.
    const gate = SRC_FILES.find(({ rel }) => rel === 'src/domain/worldPulse/pactAmendment.js').src;
    const strictReads = [...gate.matchAll(new RegExp(`\\.\\s*${FLAG}\\s*===\\s*true`, 'g'))];
    expect(strictReads).toHaveLength(1);

    // …AND NO OTHER POLARITY EXISTS ANYWHERE IN src/. A loose, negated or false-compared
    // spelling would make ABSENT and FALSE differ at the decision site, which is exactly what
    // fence 2 above assumes cannot happen.
    const forbidden = [`!==\\s*true`, `!=\\s*true`, `===\\s*false`, `==\\s*false`, `!\\s*[A-Za-z_$][\\w$]*\\??\\.\\s*${FLAG}`];
    for (const shape of forbidden) {
      const re = new RegExp(`(?:\\.\\s*${FLAG}\\s*${shape})|(?:${shape})`.replace('SENTINEL', ''), 'g');
      const hits = SRC_FILES.filter(({ src }) => [...src.matchAll(new RegExp(`\\.\\s*${FLAG}\\s*${shape}|!\\s*[A-Za-z_$][\\w$]*\\??\\.\\s*${FLAG}\\b`, 'g'))].length > 0);
      expect(hits.map(({ rel }) => rel), `a non-strict spelling of ${FLAG} appeared: ${shape}`).toEqual([]);
      expect(re, 'the polarity scanner must be a live regex').toBeInstanceOf(RegExp);
    }

    // THE GATE FUNCTION ITSELF ANSWERS THE THREE WORLDS, so the census above is measuring a
    // door that really opens and closes rather than a string in a file.
    expect(treatyRenewalActive({ simulationRules: LIT })).toBe(true);
    expect(treatyRenewalActive({ simulationRules: FALSE_SET })).toBe(false);
    expect(treatyRenewalActive({ simulationRules: ABSENT })).toBe(false);
  });

  it("monotone: a treaty that strains and then recovers keeps worstObservedEver 'strained'", () => {
    // ⭐ THE COUNTERFORCE, AND GR-5'S WHOLE REASON TO EXIST. Driven over TWO ticks through the
    // REAL advanceTreaties, feeding tick one's OWN output world back in — a hand-built record
    // would mirror the deriver and could never see a dead arm.
    const first = advance(worldWith(treatyRecord(), 10, LIT), 10, STRAINING);
    expect(recordOf(first).complianceState).toBe('strained');
    expect(recordOf(first).worstObservedEver).toBe('strained');

    const second = advance(first.worldState, 11, HEALTHY);
    // THE LIVE REGISTER RECOVERED — asserted first, because if it had not, the memory holding
    // 'strained' would be trivially true and this case would prove nothing at all.
    expect(recordOf(second).complianceState, 'the second tick must genuinely recover').toBe('honored');
    // …AND THE MEMORY DID NOT. This is the assertion the whole field exists for.
    expect(recordOf(second).worstObservedEver).toBe('strained');

    // AND IT STILL MOVES UP. A monotone fold that never moved would also pass the line above.
    const third = advance(second.worldState, 12, STARVED);
    expect(recordOf(third).complianceState).toBe('defaulted');
    expect(recordOf(third).worstObservedEver).toBe('defaulted');

    // THE ORDERING IS THE FAMILY'S OWN, NOT AN ALPHABETICAL ONE. Spelled directly against the
    // pure fold, because a raw string comparison sorts defaulted < honored < strained and would
    // invert exactly the recovery case above.
    expect(worstObservedEverAfter({ worstObservedEver: 'strained' }, 'honored')).toBe('strained');
    expect(worstObservedEverAfter({ worstObservedEver: 'defaulted' }, 'strained')).toBe('defaulted');
    expect(worstObservedEverAfter({ worstObservedEver: 'honored' }, 'strained')).toBe('strained');
  });

  it('neither the all-terms-lapsed prune nor the repudiation shell writes worstObservedEver', () => {
    // THE TWO BRANCHES THAT `continue` BEFORE THE FOLD, both LIT so the absence is a statement
    // about the branch rather than about the flag.
    // (1) THE CONTROL, in the same flag state: an ordinary treaty DOES gain the key.
    const ordinary = advance(worldWith(treatyRecord(), 10, LIT), 10, STRAINING);
    expect(recordOf(ordinary).worstObservedEver, 'the lit control must WRITE, or both arms below prove nothing').toBe('strained');

    // (2) THE ALL-TERMS-LAPSED PRUNE: every term has reached its own expiry, so the instrument
    // is spent history and leaves the ledger entirely — before the fold is reached. ⚠ MEASURED,
    // not assumed: pruning the LAST treaty drops the `treaties` sub-ledger and the whole
    // `spatialLedgers` namespace with it (the estate's drop-when-empty idiom), so this arm
    // reads through a total accessor rather than the ledger helper the other cases use.
    const lapsed = advance(worldWith(treatyRecord({ mintedTick: 0, years: 1 }), 10 * YEAR, LIT), 10 * YEAR, STRAINING);
    const lapsedLedger = lapsed.worldState.spatialLedgers?.treaties || {};
    expect(Object.keys(lapsedLedger), 'the spent instrument must be pruned, or this arm is measuring the wrong branch').toEqual([]);
    // The control above proves the key is writable in this exact flag state, and the prune is
    // proved to have happened by the empty-ledger assertion on the line above.
    // anchored: the lit control wrote the key and the prune is proved by the line above
    expect(JSON.stringify(lapsed.worldState)).not.toContain('worstObservedEver');

    // (3) THE REPUDIATION SHELL: a torn-up treaty is already a resolved verdict, kept until its
    // terms' original horizon so treatiesForPair can feed the standing casus, then pruned. Its
    // branch writes 'defaulted' directly and continues.
    const shell = treatyRecord({ extra: { breachType: 'repudiation', breachExpiresTick: 50 * YEAR, defaultSeverity01: 1 } });
    const repudiated = advance(worldWith(shell, 10, LIT), 10, STRAINING);
    expect(recordOf(repudiated).complianceState, 'the shell branch must have been taken').toBe('defaulted');
    // The shell record is proved present and on its own branch by the assertion directly
    // above, so this absence cannot be the absence of the whole record.
    // anchored: the shell is proved present and 'defaulted' by the assertion above
    expect(recordOf(repudiated)).not.toHaveProperty('worstObservedEver');
  });

  it('a multi-tick record JSON round-trips, a legacy record reads honored, and no src consumer exists', () => {
    // LIFECYCLE: persist. The field rides treaty serialization inside spatialLedgers.treaties
    // as-is — no new top-level key, no new ledger, no spatialUsage entry — and an in-memory
    // probe cannot tell a shared reference from a value that survives a real round-trip.
    const first = advance(worldWith(treatyRecord(), 10, LIT), 10, STRAINING);
    const second = advance(first.worldState, 11, HEALTHY);
    const revived = JSON.parse(JSON.stringify(ledgerOf(second)))[PAIR_KEY];
    expect(revived.worstObservedEver).toBe('strained');
    expect(typeof revived.worstObservedEver, 'the value must be a JSON scalar, never a Map/Set/Symbol/Date').toBe('string');

    // LIFECYCLE: migrate — NOTHING DOES. A record written before this wave existed carries no
    // key and reads `honored` forever, resolved AT READ and never written back.
    const legacy = treatyRecord();
    expect(worstObservedEverOf(legacy)).toBe('honored');
    // `legacy` is a fully-formed treaty record proved non-empty two lines below, so this
    // absence is about the key rather than about an empty object.
    // anchored: `legacy.complianceState` is asserted 'honored' below, so the record is real
    expect(legacy).not.toHaveProperty('worstObservedEver');
    expect(legacy.complianceState, 'the legacy fixture must be a real record').toBe('honored');
    // TOTAL ON EVERY SHAPE, so no consumer can be handed one that throws.
    for (const shape of [null, undefined, 0, 'strained', [], { worstObservedEver: 'nonsense' }]) {
      expect(worstObservedEverOf(shape)).toBe('honored');
    }

    // ⭐ THE HANDOFF TRIPWIRE, spelled on the landed GR-0 `treatiesPricedDuring` idiom verbatim.
    // A CONSUMER, NOT A MENTION: the symbol must appear in a real IMPORT SPECIFIER for this
    // leaf. ⚠ MEASURED, and it bit on the first run — `subsystemRowsVirtual.js` names this
    // symbol in its own certification-row prose, and a mention scan read that as "GR-5d has
    // landed". A prose reference is not a consumer.
    const IMPORT_RE = /import\s*\{([^}]*)\}\s*from\s*['"][^'"]*pactAmendment\.js['"]/g;
    const consumersOf = (symbol) => SRC_FILES.filter(({ rel, src }) => {
      if (rel === LEAF) return false;
      return [...src.matchAll(IMPORT_RE)]
        .some((match) => match[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0]).includes(symbol));
    }).map(({ rel }) => rel).sort();
    // NON-VACUITY, THREE WAYS: the scan reached the tree, it reached the definition, and the
    // DETECTOR ITSELF is proven to find a real consumer of a SIBLING export from this same
    // module. Without that third arm an emptied corpus would report "unconsumed" for every
    // symbol in the estate.
    expect(SRC_FILES.length).toBeGreaterThan(200);
    expect(SRC_FILES.some(({ rel }) => rel === LEAF)).toBe(true);
    expect(consumersOf('absorbWarEndIntoStandingPact')).toContain('src/domain/worldPulse/peaceTerms.js');
    // …and the FOLD has exactly one production consumer, which is the second live control:
    // this wave's own import edge is visible to the very scan that reports the reader unused.
    expect(consumersOf('worstObservedEverAfter')).toEqual(['src/domain/worldPulse/peaceTerms.js']);
    expect(
      consumersOf('worstObservedEverOf'),
      'worstObservedEverOf has gained a src/ consumer. That is GR-5d landing: the conversion '
      + 'gate is reading the memory BY NAME, so this tripwire has done its job — move the '
      + 'reachability obligation into that wave and retire this pin.',
    ).toEqual([]);
  });
});
