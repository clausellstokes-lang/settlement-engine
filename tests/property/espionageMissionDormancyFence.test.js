/**
 * espionageMissionDormancyFence.test.js — ES-1's FOUR-FENCE dormancy set, its lit-mutant
 * control, and every guard door dropped ALONE.
 *
 * ⚠ READ THIS BESIDE `espionageDormancyFence.test.js`, WHICH IS ES-0's AND STILL CORRECT.
 * That file's fence 1 is an IMPORT-CLOSURE CENSUS — no production module imports the
 * espionage set — and its header says the fence is REPLACED by a driven byte-identity
 * golden "in the commit that added the caller". ES-1 DID NOT ADD ONE, and the distinction
 * is the whole shape of this wave: ES-1 builds the covert mission's DOOR (the mint, the
 * validation, the vocabulary, the casting law, the traveller franchise), not the traffic
 * through it. The dispatcher that decides a court wants a confirmation is a later wave's.
 * So ES-0's fence 1 stays green BECAUSE IT IS STILL TRUE, and this file adds the fence
 * ES-1 genuinely owes — over the ERRAND FAMILY, which ES-1 really did edit in live code.
 *
 *   FENCE 1 — THE DRIVEN BYTE-IDENTITY GOLDEN, over a ten-tick run that really mints,
 *     really advances, really patches a rumour and really closes a row. ES-1 edited six
 *     live errand-family functions; the claim is that all six are byte-invisible to a
 *     world that mints no covert mission, and it is measured against a run that DOES mint
 *     one when it is allowed to. Not a stored hash — a CALL, so there is nothing to rot.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE vs every truthy-but-not-true
 *     spelling, over the gate AND over the mint head. No fixture, so it cannot rot. Its
 *     designed blind spot is that it stays green if the feature runs in BOTH
 *     configurations, which is why it never ships alone.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. A state pin cannot see a feature that ran and wrote
 *     nothing; a strict pass-through spy on `normalizeCovertMission` can. The subject is
 *     the mint head, and the direction is load-bearing for the recorded WR-10 reason:
 *     `errandMint.js` IMPORTS the validation from `envoyErrandRecords.js`, so mocking
 *     that module really does intercept. Dark the count is ZERO; lit it is not.
 *
 *   FENCE 4 — THE FRANCHISE POLARITY CENSUS over the real source tree. `covert_envoy` is
 *     a live word in a closed set, and the thing that keeps it dormant is that exactly ONE
 *     call site can produce it and that site compares `covert === true`. The census
 *     asserts BOTH halves: one production spelling of the kind constant outside its own
 *     home, and no loose truthiness at the fork.
 *
 *   THE PER-DOOR PINS. `mintCovertMission` refuses behind THREE independent doors — the
 *     espionage gate's own conjunction, the spine flag one layer down, and the covert
 *     cargo validation. Each is dropped ALONE, because this estate has twice shipped a
 *     guard a second guard silently covered for.
 *
 *   THE LIT MUTANT. A door that can never open is a dead door wearing a fence's clothes,
 *     and every assertion above would pass over it unchanged. So the set closes by
 *     satisfying every door and requiring a real mission to be written.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = { validate: 0 };

vi.mock('../../src/domain/worldPulse/envoyErrandRecords.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    // STRICT pass-through: rest-args in, the original's result out. Instrumenting the
    // module cannot perturb a byte of the runs the other fences measure.
    normalizeCovertMission: (/** @type {any[]} */ ...args) => {
      calls.validate += 1;
      return actual.normalizeCovertMission(...args);
    },
  };
});

const {
  advanceEnvoyErrands,
  applyEnvoyRumorPatch,
  closeEnvoyErrandsForNpcDeath,
  envoyErrandsOf,
} = await import('../../src/domain/worldPulse/envoyErrand.js');
const { mintErrandSpine } = await import('../../src/domain/worldPulse/errandMint.js');
const { mintCovertMission, castCovertOperative } = await import('../../src/domain/worldPulse/espionage/espionageMissions.js');
const { espionageActive } = await import('../../src/domain/worldPulse/espionage/espionageGate.js');
const { COVERT_ENVOY_KIND, mayUseHiddenPaths } = await import('../../src/domain/worldPulse/routeNetworkConsumers.js');
const {
  mintOne, peaceOffer, routePlan, spineWorld,
} = await import('../helpers/errandSpineFixture.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'espionageEnabled';
const KIND_HOME = 'src/domain/worldPulse/routeNetworkConsumers.js';

const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * Strip COMMENTS ONLY, leaving string contents intact. `codeOnly` blanks strings as well,
 * which is right for a gate-polarity census and wrong for hunting a string literal — see
 * fence 4's note. Both blankers are used below, each on the half it can actually see.
 */
const commentless = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

/** A bare `'covert_envoy'` in any quoting style. */
const LITERAL_RE = /['"`]covert_envoy['"`]/;

/** The mission cargo the LIT arm of every fence below writes. */
const MISSION = Object.freeze({
  demand: 'confirm',
  itinerary: Object.freeze([Object.freeze({ face: 'declared', settlementId: 'irontown', stayTicks: 2 })]),
  product: 'confirm',
  subjectId: 'irontown',
});

/**
 * A world with the errand spine LIT and the espionage flag under test. The spine is lit in
 * every arm on purpose: this fence is about the COVERT arm's dormancy, and holding the
 * substrate flag constant is what stops it measuring SP-D's dormancy a second time.
 * @param {{espionage?: unknown}} [args]
 */
function espionageWorld({ espionage } = {}) {
  const seed = spineWorld({ spine: true });
  return {
    ...seed,
    spatialCanonVersion: 1,
    simulationRules: {
      ...seed.simulationRules,
      infoMode: 'unreliable',
      ...(espionage === undefined ? {} : { [FLAG]: espionage }),
    },
  };
}

/**
 * THE ADVERSARIAL RUN. Ten ticks with the war layer busy: two errands from two origins, a
 * rumour patch that really steps a picture, the scheduled advance every tick, and a DM
 * KILL that closes one row terminal — the SAME run SP-D's fence uses, now carrying covert
 * cargo when the caller allows it.
 *
 * @param {{mission?: unknown}} [args] `mission:null` omits the covert argument entirely,
 *   which is the PRE-ES-1 call signature — what every live call site passes today.
 */
function tenTicks({ mission = null } = {}) {
  const cargo = mission
    ? { purposeClass: 'covert', declaredPurpose: 'diplomatic', covert: mission }
    : { purposeClass: 'covert', declaredPurpose: 'diplomatic' };
  let worldState = mintOne(espionageWorld({ espionage: true }), cargo).worldState;
  worldState = mintOne(worldState, {
    ...cargo,
    outcome: peaceOffer({ id: 'peace.offer.2', from: 'brackwater', to: 'irontown' }),
    npcId: 'npc.envoy.2',
    routePlan: routePlan({ from: 'brackwater', to: 'irontown' }),
  }).worldState;
  const ledgerHashes = [];
  for (let tick = 11; tick <= 20; tick += 1) {
    worldState = advanceEnvoyErrands({ worldState, tick }).worldState;
    if (tick === 13) {
      worldState = applyEnvoyRumorPatch({
        worldState,
        errandId: String(envoyErrandsOf(worldState)[0].id),
        patch: { sourceEventId: 'rumor.1', field: 'strengthBand', direction: 'fall' },
      }).worldState;
    }
    if (tick === 17) {
      worldState = closeEnvoyErrandsForNpcDeath({
        worldState, npcId: 'npc.envoy.2', tick, cause: 'dm_removed',
      }).worldState;
    }
    ledgerHashes.push(hash(envoyErrandsOf(worldState)));
  }
  return { worldState, ledgerHashes, ledger: envoyErrandsOf(worldState) };
}

/** Run `fn` with a zeroed FENCE-3 counter and hand back what it saw. */
function counted(fn) {
  calls.validate = 0;
  const value = fn();
  return { value, validate: calls.validate };
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));

describe('ES-1 dormancy — FENCE 1: the covert arm has no footprint', () => {
  test('a run that mints NO mission is byte-identical to the PRE-ES-1 call signature', () => {
    const preEs1 = tenTicks({ mission: null });
    const withoutCargo = tenTicks();
    expect(withoutCargo.ledgerHashes).toEqual(preEs1.ledgerHashes);
    expect(hash(withoutCargo.ledger)).toBe(hash(preEs1.ledger));
    // anchored: the LIT control below writes a mission into this same ten-tick run, which
    // is what makes this an absence rather than an empty subject.
    // anchored: the LIT control in the next test asserts BOTH of these words present in
    // this exact ten-tick ledger, and the two assertions below prove this run really
    // moved (a row closed terminal, every row carries a class) — so the ledger is a
    // populated subject and these absences are the covert arm's own footprint.
    expect(JSON.stringify(preEs1.ledger)).not.toContain('itinerary'); // anchored: the LIT control asserts this word PRESENT in the same ten-tick ledger
    expect(JSON.stringify(preEs1.ledger)).not.toContain('subjectId'); // anchored: the LIT control asserts this word PRESENT in the same ten-tick ledger
    // The run really exercised the lifecycle rather than sitting still: one row closed
    // terminal by the DM kill, and every row still carries SP-D's own cargo.
    expect(preEs1.ledger.some((row) => row.state === 'lost')).toBe(true);
    expect(preEs1.ledger.every((row) => row.purposeClass === 'covert')).toBe(true);
  });

  test('and the SAME run WITH a mission really carries it — the control', () => {
    const lit = tenTicks({ mission: MISSION });
    const dark = tenTicks({ mission: null });
    expect(JSON.stringify(lit.ledger)).toContain('itinerary');
    expect(JSON.stringify(lit.ledger)).toContain('subjectId');
    expect(hash(lit.ledger)).not.toBe(hash(dark.ledger));
    // Every tick diverges, not merely the last: the mission rides the whole lifecycle
    // including the terminal close.
    expect(lit.ledgerHashes).not.toEqual(dark.ledgerHashes);
    expect(lit.ledger.every((row) => row.covert?.product === 'confirm')).toBe(true);
  });
});

describe('ES-1 dormancy — FENCE 2: absent, false and every truthy spelling are one world', () => {
  test('at the gate, over the whole door matrix', () => {
    for (const spine of [undefined, false, true]) {
      const world = (espionage) => ({
        spatialCanonVersion: 1,
        simulationRules: {
          infoMode: 'unreliable',
          ...(spine === undefined ? {} : { errandSpineEnabled: spine }),
          ...(espionage === undefined ? {} : { [FLAG]: espionage }),
        },
      });
      const absent = espionageActive(world(undefined));
      expect(absent, `absent/false diverged at spine=${String(spine)}`)
        .toBe(espionageActive(world(false)));
      expect(absent).toBe(false);
      for (const value of [1, 'true', {}, [], 'yes']) {
        expect(espionageActive(world(value)), `${String(value)} opened the gate`).toBe(false);
      }
    }
  });

  test('at the MISSION HEAD, where a truthy spelling would mint a real row', () => {
    const args = {
      purpose: 'sue',
      covert: MISSION,
      routePlan: routePlan(),
      fromId: 'ashford',
      toId: 'irontown',
      notBeforeTick: 10,
    };
    const absent = mintCovertMission({ worldState: espionageWorld(), ...args });
    expect(absent).toEqual({ ok: false, fields: {}, plan: null, reason: 'dark' });
    for (const value of [false, 1, 'true', {}, [], 'yes']) {
      expect(mintCovertMission({ worldState: espionageWorld({ espionage: value }), ...args }),
        `${String(value)} opened the mission head`).toEqual(absent);
    }
    // ...and the ONE spelling that DOES differ, so the equalities above discriminate.
    const lit = mintCovertMission({ worldState: espionageWorld({ espionage: true }), ...args });
    expect(lit.ok).toBe(true);
    expect(lit.fields.covert).toEqual(MISSION);
  });
});

describe('ES-1 dormancy — FENCE 3: the covert validation never runs at all', () => {
  test('a mint with NO covert cargo validates ZERO times; one with cargo validates', () => {
    const args = {
      purpose: 'sue',
      purposeClass: 'covert',
      declaredPurpose: 'diplomatic',
      routePlan: routePlan(),
      fromId: 'ashford',
      toId: 'irontown',
      journey: 'outbound',
      notBeforeTick: 10,
    };
    const lit = espionageWorld({ espionage: true });
    const noCargo = counted(() => mintErrandSpine({ worldState: lit, ...args }));
    const darkSpine = counted(() => mintErrandSpine({
      worldState: spineWorld(), ...args, covert: MISSION,
    }));
    const withCargo = counted(() => mintErrandSpine({ worldState: lit, ...args, covert: MISSION }));
    expect(noCargo.validate, 'a mint with no mission still validated one').toBe(0);
    expect(darkSpine.validate, 'a DARK spine read the covert cargo').toBe(0);
    // The lit count is what makes the two zeroes evidence rather than an artifact of a spy
    // that never wired up.
    expect(withCargo.validate).toBeGreaterThan(0);
    expect(noCargo.value.fields.covert).toBeUndefined();
    expect(darkSpine.value.fields).toEqual({});
    expect(withCargo.value.fields.covert).toEqual(MISSION);
  });

  test('a whole ten-tick run with no mission never validates one', () => {
    const seen = counted(() => tenTicks({ mission: null }));
    expect(seen.validate, 'the advance stage read covert cargo nobody wrote').toBe(0);
    // anchored: the same run WITH cargo does validate, so the zero above is a measurement.
    expect(counted(() => tenTicks({ mission: MISSION })).validate).toBeGreaterThan(0);
  });
});

describe('ES-1 dormancy — FENCE 4: the hidden franchise has exactly one production door', () => {
  test('the covert kind is spelled ONCE outside its home, and never as a bare literal', () => {
    const consumers = SRC_FILES
      .filter(({ rel }) => rel !== KIND_HOME)
      .filter(({ src }) => codeOnly(src).includes('COVERT_ENVOY_KIND'))
      .map(({ rel }) => rel)
      .sort();
    // ONE door: the route solve. A second production consumer is a second way into the
    // franchise and wants this fence re-argued rather than quietly extended.
    expect(consumers).toEqual(['src/domain/worldPulse/envoyDiplomacy.js']);
    // NO BARE LITERAL anywhere but the vocabulary's own home — a hand-typed `'covert_envoy'`
    // is one character away from failing closed in silence, because `mayUseHiddenPaths`
    // refuses what it does not recognise and says nothing about it.
    //
    // ⚠ THIS HALF MUST NOT USE `codeOnly`, AND THE FIRST SPELLING OF IT DID. That blanker
    // erases STRING CONTENTS as well as comments — which is correct for a gate-polarity
    // census and fatal here, because the thing being hunted IS a string. The scan returned
    // an empty offender list having proved nothing, and its guard-the-guard tested the
    // regex directly rather than THROUGH the predicate, so the vacuity was invisible: the
    // recorded defense-in-depth-hides-its-own-deletion shape. Comments are stripped, and
    // only comments.
    const holders = SRC_FILES
      .filter(({ rel }) => rel !== KIND_HOME)
      .filter(({ src }) => LITERAL_RE.test(commentless(src)))
      .map(({ rel }) => rel);
    expect(holders).toEqual([]);
    // GUARD THE GUARD, THROUGH THE PREDICATE rather than beside it: the detector finds a
    // planted literal, and it finds the REAL one in the kind's own home (which the filter
    // above excludes on purpose), so the emptiness is a measurement.
    expect(LITERAL_RE.test(commentless("const k = 'covert_envoy';"))).toBe(true);
    expect(LITERAL_RE.test(commentless("// a lane would spell 'covert_envoy' here"))).toBe(false);
    expect(LITERAL_RE.test(commentless(
      SRC_FILES.find(({ rel }) => rel === KIND_HOME).src,
    )), 'the kind vanished from its own home').toBe(true);
    expect(SRC_FILES.length).toBeGreaterThan(1500);
  });

  test('the fork compares === true, so no truthy caller can reach the franchise', () => {
    const raw = SRC_FILES.find(({ rel }) => rel === 'src/domain/worldPulse/envoyDiplomacy.js').src;
    const source = codeOnly(raw);
    // The exact spelling, pinned. A loose `covert ?` would make an accidental truthy
    // argument a hidden-path grant. The STRUCTURE is pinned against the blanked source
    // (where a comment cannot forge it) and the WHOLE expression against the commentless
    // one, because the blanker erases the `'envoy'` half along with every other string.
    expect(source).toMatch(/covert\s*===\s*true\s*\?\s*COVERT_ENVOY_KIND\s*:/);
    // anchored: the line above proves the STRICT form is present in this same blanked
    // source, so the loose form's absence is a polarity measurement rather than a claim
    // about a file that stopped being read.
    expect(source).not.toMatch(/kind:\s*covert\s*\?/); // anchored: the line above proves the STRICT form is present in this same blanked source
    expect(commentless(raw)).toMatch(
      /kind:\s*covert\s*===\s*true\s*\?\s*COVERT_ENVOY_KIND\s*:\s*'envoy'/,
    );
    // And the franchise itself still fails closed on everything it does not name.
    expect(mayUseHiddenPaths(COVERT_ENVOY_KIND)).toBe(true);
    expect(mayUseHiddenPaths('envoy')).toBe(false);
    expect(mayUseHiddenPaths('covert')).toBe(false);
    expect(mayUseHiddenPaths('covert_envoys')).toBe(false);
  });
});

describe('ES-1 — THE THREE DOORS, each dropped ALONE', () => {
  const args = {
    purpose: 'sue',
    covert: MISSION,
    routePlan: routePlan(),
    fromId: 'ashford',
    toId: 'irontown',
    notBeforeTick: 10,
  };

  test('door 1: the espionage gate — the mission head refuses before the spine is asked', () => {
    // Dropped by each of the gate's own three conditions in turn, so this door cannot rest
    // on a neighbour either.
    const base = espionageWorld({ espionage: true });
    const without = (patch) => ({ ...base, simulationRules: { ...base.simulationRules, ...patch } });
    expect(mintCovertMission({ worldState: { ...base, spatialCanonVersion: 0 }, ...args }).reason)
      .toBe('dark');
    expect(mintCovertMission({ worldState: without({ infoMode: 'omniscient' }), ...args }).reason)
      .toBe('dark');
    expect(mintCovertMission({ worldState: without({ errandSpineEnabled: false }), ...args }).reason)
      .toBe('dark');
    expect(mintCovertMission({ worldState: without({ espionageEnabled: false }), ...args }).reason)
      .toBe('dark');
  });

  test('door 2: the SPINE flag, reached directly, refuses the same cargo one layer down', () => {
    // `mintCovertMission` can never show this door because its own gate requires the spine
    // lit. Driving the spine head directly is what proves the second door is not decorative.
    const spineDark = mintErrandSpine({
      worldState: spineWorld(), ...args, purposeClass: 'covert', declaredPurpose: 'diplomatic',
    });
    expect(spineDark.reason).toBe('dark');
    expect(spineDark.fields).toEqual({});
    const spineLit = mintErrandSpine({
      worldState: spineWorld({ spine: true }), ...args, purposeClass: 'covert', declaredPurpose: 'diplomatic',
    });
    expect(spineLit.reason).toBe('spine');
  });

  test('door 3: the covert VALIDATION, with both other doors satisfied', () => {
    const lit = espionageWorld({ espionage: true });
    expect(mintCovertMission({ worldState: lit, ...args, covert: { ...MISSION, product: 'x' } }).reason)
      .toBe('invalid_product');
    // ...and the identical world with lawful cargo mints, so the refusal discriminates.
    expect(mintCovertMission({ worldState: lit, ...args }).ok).toBe(true);
  });

  test('and casting carries its OWN gate, which is not the mint\'s', () => {
    const settlement = {
      id: 'ashford',
      npcs: [{ id: 'n.1', name: 'Tam', role: 'carter', importance: 'minor', faction: 'crown' }],
      powerStructure: { factions: [{ faction: 'crown', power: 40 }] },
    };
    expect(castCovertOperative({
      worldState: espionageWorld(), settlementId: 'ashford', settlement,
    }).reason).toBe('dark');
    expect(castCovertOperative({
      worldState: espionageWorld({ espionage: true }), settlementId: 'ashford', settlement,
    }).reason).toBe('cast');
  });
});

describe('ES-1 — THE LIT MUTANT: the door opens, and opening it writes a real mission', () => {
  test('all doors satisfied mints a mission onto a persisted row', () => {
    // A door that can never open is a DEAD door wearing a dormancy fence's clothes, and
    // every assertion above would pass over it unchanged.
    const world = espionageWorld({ espionage: true });
    expect(espionageActive(world)).toBe(true);
    // THE LITERAL DRIVE, spelled out rather than composed, for the lit-coverage census —
    // everything above reaches the flag through a computed key, which that walker cannot
    // see and which therefore reads as a mechanism shipped lit-unproven.
    expect(espionageActive({
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'unreliable', errandSpineEnabled: true, espionageEnabled: true },
    })).toBe(true);
    const lit = tenTicks({ mission: MISSION });
    expect(lit.ledger.length).toBeGreaterThan(0);
    expect(lit.ledger.every((row) => row.covert?.subjectId === 'irontown')).toBe(true);
    expect(lit.ledger.every((row) => row.declaredPurpose === 'diplomatic')).toBe(true);
  });
});
