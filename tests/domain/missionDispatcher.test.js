/**
 * missionDispatcher.test.js — W-OPS car O1, §3.12's deliberation road.
 *
 * The four claims this file exists to execute:
 *   1. THE CAP holds per principal per tick, and its default is the errand family's own
 *      concurrency number rather than a knob this lane invented (a PARITY PIN, so a retune
 *      upstream reds here instead of drifting).
 *   2. THE ORDER IS DETERMINISTIC AND INPUT-ORDER-INDEPENDENT — codepoint-stable first,
 *      then one seeded key over (principal, tick, demand).
 *   3. THE ONE-MINT LAW binds BOTH WAYS: covered demands are consumed, uncovered ones
 *      dispatch. A rule proven on one arm is a rule nobody has proven.
 *   4. DARK: no production caller, and the candidate's `type` word matches no applier arm
 *      in the tree, so the leaf is inert even if something wires it by accident.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { DOCTRINE_TARGETINGS } from '../../src/domain/worldPulse/espionage/espionageDoctrine.js';
import { DELIBERATION_VERDICTS } from '../../src/domain/worldPulse/espionage/espionageMath.js';
import { MAX_CONCURRENT_ENVOYS } from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
// LGT-P5-WOPS: the door this leaf's flag was minted onto. The read lives in the espionage
// family's one door module by necessity — this leaf is pure and injected and has no
// receiver to gate on, and it is also the espionage set's ONE admitted importer, which the
// reachability-chain fence requires to name neither that module nor the layer flag.
import { missionDispatcherActive } from '../../src/domain/worldPulse/espionage/espionageGate.js';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import {
  DISPATCH_CAP_PER_PRINCIPAL_PER_TICK,
  DISPATCH_REFUSALS,
  OPERATION_CANDIDATE_TYPE,
  admittedStandings,
  dispatchKey,
  dispatchMissionCandidates,
  dispatchRefusalTotality,
} from '../../src/domain/worldPulse/operations/missionDispatcher.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Every .js/.jsx under src/, absolute. */
function srcFiles() {
  /** @type {string[]} */
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) out.push(full);
    }
  };
  walk(join(ROOT, 'src'));
  return out;
}

/**
 * A demand that clears door 4: stale deciding belief, a castable operative, not urgent,
 * not already dispatched. Perturb one field per arm.
 */
function staleDemand(id, subjectId) {
  return {
    demandId: id,
    kind: 'confirm_belief',
    subjectId,
    decidingConfidence01: 0.1,
    urgent: false,
    dispatched: false,
  };
}

/**
 * The standing call shape: one principal, one tick, a castable operative, and the widest
 * doctrine — so every other test perturbs exactly one thing.
 */
function dispatch(demands, extra = {}) {
  return dispatchMissionCandidates({
    principalId: 'court.a',
    tick: 12,
    demands,
    openOperations: [],
    targeting: 'all_courts',
    frequency01: 0.5,
    castable: true,
    ...extra,
  });
}

describe('W-OPS O1 — the per-principal per-tick cap', () => {
  test('the default cap MIRRORS the errand family\'s concurrency number (parity pin)', () => {
    expect(DISPATCH_CAP_PER_PRINCIPAL_PER_TICK).toBe(MAX_CONCURRENT_ENVOYS);
    expect(DISPATCH_CAP_PER_PRINCIPAL_PER_TICK).toBe(2);
  });

  test('six eligible demands yield exactly two candidates and four over_cap refusals', () => {
    const demands = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'].map((id) => staleDemand(id, `s.${id}`));
    const out = dispatch(demands);
    expect(out.candidates.length).toBe(2);
    expect(out.cap).toBe(2);
    expect(out.considered).toBe(6);
    expect(out.refusals.filter((row) => row.reason === 'over_cap').length).toBe(4);
  });

  test('an explicit cap is honoured, and a cap of zero dispatches nothing at all', () => {
    const demands = ['d1', 'd2', 'd3'].map((id) => staleDemand(id, `s.${id}`));
    expect(dispatch(demands, { cap: 1 }).candidates.length).toBe(1);
    expect(dispatch(demands, { cap: 0 }).candidates.length).toBe(0);
    expect(dispatch(demands, { cap: 0 }).refusals.every((row) => row.reason === 'over_cap')).toBe(true);
  });

  test('a garbage cap falls back to the default rather than to unbounded dispatch', () => {
    const demands = ['d1', 'd2', 'd3', 'd4'].map((id) => staleDemand(id, `s.${id}`));
    expect(dispatch(demands, { cap: -3 }).candidates.length).toBe(2);
    expect(dispatch(demands, { cap: 'many' }).candidates.length).toBe(2);
    expect(dispatch(demands, { cap: 2.5 }).candidates.length).toBe(2);
  });

  test('the cap is PER PRINCIPAL — two principals each get their own two', () => {
    const demands = ['d1', 'd2', 'd3'].map((id) => staleDemand(id, `s.${id}`));
    const a = dispatch(demands, { principalId: 'court.a' });
    const b = dispatch(demands, { principalId: 'court.b' });
    expect(a.candidates.length).toBe(2);
    expect(b.candidates.length).toBe(2);
  });
});

describe('W-OPS O1 — determinism: seeded per (principal, tick), codepoint-stable', () => {
  test('the same call twice is byte-identical', () => {
    const demands = ['d1', 'd2', 'd3', 'd4'].map((id) => staleDemand(id, `s.${id}`));
    expect(JSON.stringify(dispatch(demands))).toBe(JSON.stringify(dispatch(demands)));
  });

  test('INPUT ORDER CANNOT MOVE THE CUT — a reversed demand list yields the same candidates', () => {
    const demands = ['d1', 'd2', 'd3', 'd4', 'd5'].map((id) => staleDemand(id, `s.${id}`));
    const forward = dispatch(demands).candidates.map((row) => row.metadata.demandId);
    const reversed = dispatch([...demands].reverse()).candidates.map((row) => row.metadata.demandId);
    const rotated = dispatch([...demands.slice(2), ...demands.slice(0, 2)])
      .candidates.map((row) => row.metadata.demandId);
    expect(reversed).toEqual(forward);
    expect(rotated).toEqual(forward);
  });

  test('a different tick may choose differently, and the key says why', () => {
    expect(dispatchKey('court.a', 12)).toBe('ops.dispatch.court_a.12');
    expect(dispatchKey('court.a', 13)).toBe('ops.dispatch.court_a.13');
    expect(dispatchKey('Court A!', 12)).toBe('ops.dispatch.court_a.12');
  });

  test('the stream is namespaced away from the espionage lane\'s own two keys', () => {
    const key = dispatchKey('court.a', 12);
    expect(key.startsWith('ops.dispatch.')).toBe(true);
    expect(key.startsWith('es.')).toBe(false);
  });

  test('across many ticks the cap is never exceeded and the output never varies within a tick', () => {
    /** @type {string[]} */
    const failures = [];
    const demands = ['d1', 'd2', 'd3', 'd4', 'd5'].map((id) => staleDemand(id, `s.${id}`));
    for (let tickIndex = 0; tickIndex < 40; tickIndex += 1) {
      const once = dispatch(demands, { tick: tickIndex });
      const twice = dispatch([...demands].reverse(), { tick: tickIndex });
      if (once.candidates.length > 2) failures.push(`tick ${tickIndex}: cap exceeded`);
      if (JSON.stringify(once) !== JSON.stringify(twice)) failures.push(`tick ${tickIndex}: order-dependent`);
    }
    expect(failures).toEqual([]);
  });
});

describe('W-OPS O1 — THE ONE-MINT LAW, proven on both arms', () => {
  test('a demand the principal already has an operation open about is CONSUMED', () => {
    const out = dispatch([staleDemand('d1', 'court.b')], {
      openOperations: [{ principalId: 'court.a', subjectId: 'court.b' }],
    });
    expect(out.candidates).toEqual([]);
    expect(out.refusals).toEqual([{ demandId: 'd1', reason: 'already_open' }]);
  });

  test('THE OTHER ARM — the identical demand with nothing open DOES dispatch', () => {
    const out = dispatch([staleDemand('d1', 'court.b')], { openOperations: [] });
    expect(out.candidates.length).toBe(1);
    expect(out.refusals).toEqual([]);
  });

  test('an operation open for a DIFFERENT principal consumes nothing', () => {
    const out = dispatch([staleDemand('d1', 'court.b')], {
      openOperations: [{ principalId: 'court.z', subjectId: 'court.b' }],
    });
    expect(out.candidates.length).toBe(1);
  });

  test('the match is on subject and not on kind — a second product about one court is still a flood', () => {
    const out = dispatch([{ ...staleDemand('d1', 'court.b'), kind: 'acquire_intel' }], {
      openOperations: [{ principalId: 'court.a', subjectId: 'court.b', kind: 'confirm_belief' }],
    });
    expect(out.refusals).toEqual([{ demandId: 'd1', reason: 'already_open' }]);
  });

  test('a garbage open-operations list is ignored rather than trusted', () => {
    expect(dispatch([staleDemand('d1', 'court.b')], { openOperations: null }).candidates.length).toBe(1);
    expect(dispatch([staleDemand('d1', 'court.b')], { openOperations: [null, 7] }).candidates.length).toBe(1);
  });
});

describe('W-OPS O1 — ES-5\'s doctrine targeting, derived from the producer\'s own words', () => {
  test('the admitted-standing table covers exactly the three doctrine targetings', () => {
    const covered = DOCTRINE_TARGETINGS.filter((word) => admittedStandings(word) !== null);
    expect(covered).toEqual([...DOCTRINE_TARGETINGS]);
    expect(admittedStandings('not_a_doctrine')).toBe(null);
  });

  test('a benevolent court watches foes only — a rival subject is excluded', () => {
    const foe = { ...staleDemand('d1', 'court.b'), subjectStanding: 'foe' };
    const rival = { ...staleDemand('d2', 'court.c'), subjectStanding: 'rival' };
    const out = dispatch([foe, rival], { targeting: 'foes_only' });
    expect(out.candidates.map((row) => row.metadata.demandId)).toEqual(['d1']);
    expect(out.refusals).toEqual([{ demandId: 'd2', reason: 'doctrine_excludes' }]);
  });

  test('rivals_and_foes admits both, and all_courts admits the neutral too', () => {
    const rows = [
      { ...staleDemand('d1', 'court.b'), subjectStanding: 'foe' },
      { ...staleDemand('d2', 'court.c'), subjectStanding: 'rival' },
      { ...staleDemand('d3', 'court.d'), subjectStanding: 'neutral' },
    ];
    const narrow = dispatch(rows, { targeting: 'rivals_and_foes', cap: 9 });
    expect(narrow.candidates.length).toBe(2);
    expect(narrow.refusals).toEqual([{ demandId: 'd3', reason: 'doctrine_excludes' }]);
    expect(dispatch(rows, { targeting: 'all_courts', cap: 9 }).candidates.length).toBe(3);
  });

  test('FAIL-CLOSED: an unreadable doctrine admits nobody, and a missing standing admits only under all_courts', () => {
    const demand = { ...staleDemand('d1', 'court.b'), subjectStanding: 'foe' };
    expect(dispatch([demand], { targeting: null }).refusals)
      .toEqual([{ demandId: 'd1', reason: 'doctrine_excludes' }]);
    expect(dispatch([staleDemand('d1', 'court.b')], { targeting: 'foes_only' }).refusals)
      .toEqual([{ demandId: 'd1', reason: 'doctrine_excludes' }]);
    expect(dispatch([staleDemand('d1', 'court.b')], { targeting: 'all_courts' }).candidates.length)
      .toBe(1);
  });

  test('the doctrine door sits BEFORE the one-mint read — an excluded subject is never even compared', () => {
    const out = dispatch([{ ...staleDemand('d1', 'court.b'), subjectStanding: 'neutral' }], {
      targeting: 'foes_only',
      openOperations: [{ principalId: 'court.a', subjectId: 'court.b' }],
    });
    expect(out.refusals).toEqual([{ demandId: 'd1', reason: 'doctrine_excludes' }]);
  });
});

describe('W-OPS O1 — §3.12\'s verdicts are IMPORTED, and every door is separately reachable', () => {
  test('urgency forces act_now — a court under the knife does not wait for a spy', () => {
    const out = dispatch([{ ...staleDemand('d1', 'court.b'), urgent: true }]);
    expect(out.candidates).toEqual([]);
    expect(out.refusals).toEqual([{ demandId: 'd1', reason: 'act_now' }]);
  });

  test('a deciding belief that is already good enough refuses with act_now', () => {
    const out = dispatch([{ ...staleDemand('d1', 'court.b'), decidingConfidence01: 0.95 }]);
    expect(out.refusals).toEqual([{ demandId: 'd1', reason: 'act_now' }]);
  });

  test('an uncastable court refuses with act_now — no operative, no wait', () => {
    const out = dispatch([staleDemand('d1', 'court.b')], { castable: false });
    expect(out.refusals).toEqual([{ demandId: 'd1', reason: 'act_now' }]);
  });

  test('patience runs out — a long-dispatched demand refuses with wait_expired', () => {
    const out = dispatch([{ ...staleDemand('d1', 'court.b'), dispatched: true, ticksSinceDispatch: 99 }]);
    expect(out.refusals).toEqual([{ demandId: 'd1', reason: 'wait_expired' }]);
  });

  test('a demand still inside its patience window is already waiting and mints nothing new', () => {
    const out = dispatch([{ ...staleDemand('d1', 'court.b'), dispatched: true, ticksSinceDispatch: 1 }]);
    expect(out.candidates.length).toBe(1);
  });

  test('an unqualified kind is refused BEFORE the deliberation read is consulted', () => {
    const out = dispatch([{ ...staleDemand('d1', 'court.b'), kind: 'place_agent', urgent: true }]);
    expect(out.refusals).toEqual([{ demandId: 'd1', reason: 'kind_unqualified' }]);
  });

  test('a malformed demand refuses in its own word rather than falling into a default arm', () => {
    const out = dispatch([null, { demandId: 'd2' }, staleDemand('d3', 'court.b')]);
    expect(out.refusals.filter((row) => row.reason === 'malformed_demand').length).toBe(2);
    expect(out.candidates.length).toBe(1);
  });

  test('the refusal vocabulary is DERIVED from §3.12\'s verdict set, never transcribed beside it', () => {
    expect(DISPATCH_REFUSALS).toEqual(dispatchRefusalTotality());
    const carried = DELIBERATION_VERDICTS.filter((verdict) => verdict !== 'dispatch_and_wait');
    expect(carried.every((verdict) => DISPATCH_REFUSALS.includes(verdict))).toBe(true);
    expect(carried).toEqual(['act_now', 'wait_expired']);
  });

  test('a call with no principal or no demand array returns the empty shape rather than throwing', () => {
    expect(dispatchMissionCandidates().candidates).toEqual([]);
    expect(dispatchMissionCandidates({ principalId: '' }).considered).toBe(0);
    expect(dispatchMissionCandidates({ principalId: 'court.a', demands: 'lots' }).candidates).toEqual([]);
  });
});

describe('W-OPS O1 — the candidate rides the EXISTING grammar, and stays a proposal', () => {
  test('the emitted candidate carries every core field of npcAgency\'s candidate literal', () => {
    const candidate = dispatch([staleDemand('d1', 'court.b')]).candidates[0];
    const core = [
      'id', 'type', 'candidateType', 'ruleId', 'ruleFamily', 'targetSaveId',
      'severity', 'probability', 'applyMode', 'headline', 'summary', 'reasons',
      'metadata', 'conflictTags',
    ];
    expect(core.filter((field) => !(field in candidate))).toEqual([]);
  });

  test('THE PARITY PIN — every core field is still a field of npcAgency\'s own literal', () => {
    const agency = readFileSync(join(ROOT, 'src/domain/worldPulse/npcAgency.js'), 'utf8');
    const core = [
      'id', 'type', 'candidateType', 'ruleId', 'ruleFamily', 'targetSaveId',
      'severity', 'probability', 'applyMode', 'headline', 'summary', 'reasons',
      'metadata', 'conflictTags',
    ];
    const absent = core.filter((field) => !new RegExp(`\\n\\s{4}${field}:`).test(agency));
    expect(
      absent,
      'The candidate grammar moved upstream. Re-read npcAgency.js\'s candidate literal and'
      + ' move this mirror with it rather than emitting a shape the collector drops.',
    ).toEqual([]);
  });

  test('applyMode is ALWAYS proposal — the ES-7 autonomous refusal, honoured in the data', () => {
    const demands = ['d1', 'd2'].map((id) => staleDemand(id, `s.${id}`));
    const modes = [...new Set(dispatch(demands).candidates.map((row) => row.applyMode))];
    expect(modes).toEqual(['proposal']);
  });

  test('the candidate names its verified receipt family, so the qualification travels with it', () => {
    const candidate = dispatch([staleDemand('d1', 'court.b')]).candidates[0];
    expect(candidate.metadata.receiptFamily).toBe('espionage_product_confirm');
    expect(candidate.metadata.operationClass).toBe('MISSION');
    expect(candidate.id).toBe('candidate.operation.confirm_belief.d1.12');
  });

  test('SEVERITY IS THE CONFIDENCE GAP AND PROBABILITY THE COURT\'S CADENCE — never the rank roll', () => {
    const near = dispatch([{ ...staleDemand('d1', 'court.b'), decidingConfidence01: 0.4 }],
      { frequency01: 0.25 }).candidates[0];
    expect(near.severity).toBeCloseTo(0.6, 10);
    expect(near.probability).toBe(0.25);
    // The roll rides metadata, where it cannot be mistaken for a judgement.
    expect(typeof near.metadata.rank01).toBe('number');
    expect(near.severity === near.metadata.rank01).toBe(false);
  });

  test('an unreadable deciding belief is MAXIMALLY unconfirmed, agreeing with the door that let it through', () => {
    const blank = dispatch([{ ...staleDemand('d1', 'court.b'), decidingConfidence01: 'soon' }])
      .candidates[0];
    expect(blank.severity).toBe(1);
  });

  test('both ranked fields stay inside the unit interval on garbage inputs', () => {
    const wild = dispatch([{ ...staleDemand('d1', 'court.b'), decidingConfidence01: -9 }],
      { frequency01: 47 }).candidates[0];
    expect(wild.severity).toBe(1);
    expect(wild.probability).toBe(1);
    expect(dispatch([staleDemand('d1', 'court.b')], { frequency01: 'often' }).candidates[0].probability)
      .toBe(0);
  });
});

describe('W-OPS O1 — DARK: no production caller, and no applier arm to fall into', () => {
  test('nothing under src/ imports the dispatcher', () => {
    // An IMPORT SPECIFIER census, not a mention census — the grammar leaf's header names
    // this file on purpose (it is where the flag seam is written down), and a header is
    // not a caller.
    const importers = srcFiles()
      .filter((file) => !file.endsWith('missionDispatcher.js'))
      .filter((file) => /from\s+'[^']*missionDispatcher\.js'/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file))
      .sort();
    expect(importers).toEqual([]);
  });

  test('the candidate type word matches NO applier arm in the tree — inert even if miswired', () => {
    const applier = readFileSync(join(ROOT, 'src/domain/worldPulse/applyWorldPulse.js'), 'utf8');
    const arms = [...applier.matchAll(/outcome\.type === '([a-z_]+)'/g)].map((hit) => hit[1]);
    expect(arms.length > 0).toBe(true);
    expect(arms.includes(OPERATION_CANDIDATE_TYPE)).toBe(false);
    expect(OPERATION_CANDIDATE_TYPE).toBe('operation');
  });

  test('the leaf touches no world — every input arrives as an argument', () => {
    const source = readFileSync(
      join(ROOT, 'src/domain/worldPulse/operations/missionDispatcher.js'), 'utf8',
    );
    const body = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(/worldState/.test(body)).toBe(false);
    expect(/Math\.random|Date\.now|new Date\(/.test(body)).toBe(false);
  });
});

// ── THE DOOR, MINTED 2026-09-05 BY LGT-P5-WOPS ───────────────────────────────────

describe('W-OPS O1 — the CR-WR10-C door, and the polarity census that keeps it single', () => {
  /** The world shape ES-0 actually demands: a positive canon marker and a non-omniscient
   * info mode (`beliefsActive`), the errand spine, and the layer flag. Measured from the
   * gate's own source rather than assumed, so a fixture that could never satisfy the
   * conjunction cannot make these arms pass by accident. */
  const litWorld = (extra = {}) => ({
    spatialCanonVersion: 1,
    simulationRules: {
      infoMode: 'full',
      errandSpineEnabled: true,
      espionageEnabled: true,
      missionDispatcherEnabled: true,
      ...extra,
    },
  });

  test('⭐ THE ONE GATE READ IS LIT, AND IT IS THE FAMILY DOOR — not this leaf', () => {
    expect(missionDispatcherActive(litWorld())).toBe(true);
    expect(missionDispatcherActive(litWorld({ missionDispatcherEnabled: false }))).toBe(false);
    expect(missionDispatcherActive({ simulationRules: {} })).toBe(false);
    expect(missionDispatcherActive(null)).toBe(false);
    expect(missionDispatcherActive(undefined)).toBe(false);
  });

  test('⛔ STRICT, NOT TRUTHY: every truthy non-true spelling reads exactly like absent', () => {
    const absent = missionDispatcherActive(litWorld({ missionDispatcherEnabled: undefined }));
    expect(absent).toBe(false);
    for (const truthy of [1, 'true', {}, []]) {
      expect(
        missionDispatcherActive(litWorld({ missionDispatcherEnabled: truthy })),
        `a truthy non-true ${JSON.stringify(truthy)} must read exactly like absent`,
      ).toBe(absent);
    }
  });

  test('⛔ THE CONJUNCTION: a lit dispatcher over a dark espionage layer stays dark', () => {
    // Each of ES-0's three doors dropped ALONE — a test that proves only the last has
    // proven nothing about the first two.
    expect(missionDispatcherActive({ simulationRules: litWorld().simulationRules })).toBe(false);
    expect(missionDispatcherActive(litWorld({ errandSpineEnabled: false }))).toBe(false);
    expect(missionDispatcherActive(litWorld({ espionageEnabled: false }))).toBe(false);
    // NON-VACUITY: all three open is TRUE, so the refusals above are refusals.
    expect(missionDispatcherActive(litWorld())).toBe(true);
  });

  test('⛔ THE POLARITY CENSUS: exactly ONE by-name read in src/, and it is strict', () => {
    // A READ, NOT A MENTION: the manifest member, the certification row's `rule` field and
    // this leaf's own header all NAME the key and gate nothing, so the scan looks for the
    // COMPARISON — the only shape engineGatedRuleKeys counts as a gate.
    const KEY = 'missionDispatcherEnabled';
    const READ_RE = new RegExp(`\\b${KEY}\\s*(?:===|!==|==|!=)`);
    const readers = srcFiles()
      .map((file) => ({
        rel: relative(ROOT, file).split('\\').join('/'),
        code: readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' '),
      }))
      .filter((entry) => READ_RE.test(entry.code))
      .map((entry) => entry.rel)
      .sort();
    expect(readers).toEqual(['src/domain/worldPulse/espionage/espionageGate.js']);
    // NON-VACUITY, and the negative control that proves the scan discriminates.
    expect(READ_RE.test('rules.missionDispatcherEnabled === true')).toBe(true);
    expect(READ_RE.test('the door is `missionDispatcherEnabled`')).toBe(false);
  });

  test('⛔ THE KEY IS VIRTUAL: absent from the defaults and from every preset spread', () => {
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, 'missionDispatcherEnabled')).toBe(false);
    for (const [id, preset] of Object.entries(SIMULATION_RULE_PRESETS)) {
      expect(
        Object.prototype.hasOwnProperty.call(preset.rules, 'missionDispatcherEnabled'),
        `${id} declares the key — a virtual key must be false everywhere by ABSENCE`,
      ).toBe(false);
    }
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain('missionDispatcherEnabled');
  });
});
