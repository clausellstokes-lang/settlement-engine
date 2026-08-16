/**
 * soakScriptSeams.test.js — SK-0's proof surface (sk-a; ODQ §141, §143, §145.2).
 *
 * ⛔ NOT ONE OF THESE ARMS RUNS A SOAK. §145.2 forbids it, and every rule SK-0 added
 * was extracted into `scripts/audit/soakRules.mjs` precisely so it could be proven by
 * pure function call plus a planted mutant. A soak is the most expensive possible way
 * to learn that a spread was written on the wrong line.
 *
 * SEVEN ARMS
 *   1  the key-set identity — an overlay key reaches the DARK control too
 *   2  the MUTANT — the same composition with the overlay applied BELOW the derivation
 *      must FAIL arm 1. Without this arm, arm 1 is a comment.
 *   3  absence ≠ falseness — WHY arm 1 matters, so a later reader cannot delete it
 *   4  the import direction: scripts/audit ↛ scripts/soak, with a planted violation
 *   5  byte-identity with no overlay, against a CAPTURED pre-change golden
 *   6  the --skip-divergence contract: computed properties, and the refusals
 *   7  the §180.3a address-chain instrument, and the deep key census that settles SK.U1
 */

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  CHECKPOINT_IDENTITY_KEYS,
  DARK_NON_BOOLEAN_OVERRIDES,
  buildCheckpoint,
  checkpointIdentity,
  checkpointIdentityMismatch,
  collectUndefinedKeyPaths,
  composeSoakRules,
  deepKeyCensus,
  parseLightingOverlay,
  replantUndefinedKeys,
  seasonsOverride,
  soakInvocationRefusals,
  soakProperties,
} from '../../scripts/audit/soakRules.mjs';
import { measureAddressChain } from '../../scripts/audit/behavioral-observation.mjs';
import {
  DEFAULT_SIMULATION_RULES,
  SIMULATION_RULE_PRESETS,
  normalizeSimulationRules,
} from '../../src/domain/worldPulse/simulationRules.js';

const ROOT = resolve(process.cwd());
const PRESET = SIMULATION_RULE_PRESETS.full_simulation.rules;
const BASELINE = JSON.parse(readFileSync(join(ROOT, 'tests/soak-harness/soakRulesBaseline.json'), 'utf8'));

/**
 * THE MUTANT, held here rather than edited into the real file: the identical
 * composition with the overlay spread AFTER `darkRules` is derived. This is the most
 * plausible way the law dies — a later hand adds a seam and puts the spread on the
 * line that reads more naturally.
 */
function composeSoakRulesWithOverlayBelow({ preset, seasons = 'preset', overlay = {} }) {
  const fullRules = { ...preset, ...seasonsOverride(seasons) };
  const darkRules = Object.fromEntries(Object.entries(fullRules).map(([key, value]) => (
    [key, typeof value === 'boolean' ? false : value]
  )));
  Object.assign(darkRules, DARK_NON_BOOLEAN_OVERRIDES);
  return { fullRules: { ...fullRules, ...overlay }, darkRules };
}

const IMPORT_SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(|\brequire\s*\()\s*['"]([^'"]+)['"]/g;
function specifiersIn(source) {
  return [...source.matchAll(IMPORT_SPECIFIER)].map((match) => match[1]);
}
function filesBelow(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesBelow(path);
    return /\.[cm]?js$/.test(entry.name) ? [path] : [];
  });
}

describe("the soak script's extracted seams", () => {
  it('ARM 1 — an overlay key reaches the DARK control, because the overlay is above the derivation', () => {
    const overlay = { espionageEnabled: true, aFlagNoPresetDeclares: true };
    const { fullRules, darkRules } = composeSoakRules({ preset: PRESET, seasons: 'preset', overlay });
    expect(Object.keys(darkRules).sort()).toEqual(Object.keys(fullRules).sort());
    // The dark control must hold an EXPLICIT false, not an absence, for the new key.
    expect(Object.prototype.hasOwnProperty.call(darkRules, 'aFlagNoPresetDeclares')).toBe(true);
    expect(darkRules.aFlagNoPresetDeclares).toBe(false);
    expect(fullRules.aFlagNoPresetDeclares).toBe(true);
  });

  it('ARM 2 — the MUTANT that applies the overlay BELOW the derivation fails arm 1', () => {
    const overlay = { aFlagNoPresetDeclares: true };
    const mutant = composeSoakRulesWithOverlayBelow({ preset: PRESET, seasons: 'preset', overlay });
    // The mutant's key sets DIVERGE by exactly the overlay's new key — which is the
    // damage: the lit run declares it, the dark control has never heard of it.
    expect(Object.keys(mutant.fullRules).sort()).not.toEqual(Object.keys(mutant.darkRules).sort());
    expect(Object.prototype.hasOwnProperty.call(mutant.darkRules, 'aFlagNoPresetDeclares')).toBe(false);
    const missing = Object.keys(mutant.fullRules)
      .filter((key) => !Object.prototype.hasOwnProperty.call(mutant.darkRules, key));
    expect(missing).toEqual(['aFlagNoPresetDeclares']);
    // And the real function, on the identical input, does NOT lose it.
    const real = composeSoakRules({ preset: PRESET, seasons: 'preset', overlay });
    expect(Object.keys(real.fullRules).filter((key) => !(key in real.darkRules))).toEqual([]);
  });

  it('ARM 3 — absence is NOT falseness: the normalizer defaults these booleans TRUE', () => {
    const defaultTrue = Object.entries(DEFAULT_SIMULATION_RULES)
      .filter(([, value]) => value === true)
      .map(([key]) => key);
    expect(defaultTrue.length).toBeGreaterThan(0);
    const wrong = [];
    for (const key of defaultTrue) {
      // Absent from the input ⇒ the normalizer supplies TRUE.
      if (normalizeSimulationRules({})[key] !== true) wrong.push(`${key}: absent did not default true`);
      // Explicitly false ⇒ false. So absence and explicit-false are DIFFERENT inputs,
      // which is exactly why arm 1's key-set identity is load-bearing and not cosmetic.
      if (normalizeSimulationRules({ [key]: false })[key] !== false) wrong.push(`${key}: explicit false did not stay false`);
    }
    expect(wrong).toEqual([]);
  });

  it('ARM 4 — no module under scripts/audit imports from scripts/soak', () => {
    const audit = filesBelow(join(ROOT, 'scripts/audit'));
    expect(audit.length).toBeGreaterThanOrEqual(25);
    const violations = audit.flatMap((file) => specifiersIn(readFileSync(file, 'utf8'))
      .filter((specifier) => /(^|\/)scripts\/soak\//.test(specifier) || /(^|\/)\.\.\/soak\//.test(specifier))
      .map((specifier) => `${file.slice(ROOT.length + 1)} -> ${specifier}`));
    expect(violations).toEqual([]);
    // PLANTED VIOLATION — the detector really convicts. `scripts/audit` is inside
    // REALM_SCALE_SOURCE_PATHS and `scripts/soak` is not, so an edge in this
    // direction would put soak-behaviour-determining code outside the certification
    // source fingerprint, silently.
    const planted = "import { grid } from '../soak/pool.mjs';\nimport x from 'scripts/soak/run.mjs';";
    expect(specifiersIn(planted)
      .filter((specifier) => /(^|\/)scripts\/soak\//.test(specifier) || /(^|\/)\.\.\/soak\//.test(specifier)))
      .toEqual(['../soak/pool.mjs', 'scripts/soak/run.mjs']);
  });

  it('ARM 5 — with no overlay the extraction is byte-identical to the literal it replaced', () => {
    // The golden was CAPTURED by executing the pre-change literal block at 0cbb0177,
    // never hand-authored: a hand-written expectation would only mirror the new code.
    expect(BASELINE.capturedAtHead).toBe('0cbb0177b177717873804200e908a27d42363ed4');
    for (const seasons of ['preset', 'on', 'off']) {
      const composed = composeSoakRules({ preset: PRESET, seasons, overlay: {} });
      expect(composed.fullRules, `fullRules moved for --seasons ${seasons}`)
        .toEqual(BASELINE.seasons[seasons].fullRules);
      expect(composed.darkRules, `darkRules moved for --seasons ${seasons}`)
        .toEqual(BASELINE.seasons[seasons].darkRules);
    }
    // The golden is non-vacuous: it carries the whole preset, and its three variants
    // genuinely differ on the one key --seasons controls.
    expect(Object.keys(BASELINE.seasons.preset.fullRules).length).toBe(Object.keys(PRESET).length);
    expect(BASELINE.seasons.on.fullRules.seasonsEnabled).toBe(true);
    expect(BASELINE.seasons.off.fullRules.seasonsEnabled).toBe(false);
    // The lighting parser is fail-LOUD: a malformed pair is named, never dropped.
    expect(parseLightingOverlay('a=true,b=false,c=3,d=full').overlay)
      .toEqual({ a: true, b: false, c: 3, d: 'full' });
    expect(parseLightingOverlay('oops,b=1').refusals).toEqual(['--lighting pair "oops" is not key=value']);
  });

  it('ARM 6 — properties are COMPUTED, and the unearned-claim routes are refused', () => {
    const executed = soakProperties({ failures: [], seedDivergenceExecuted: true });
    const skipped = soakProperties({ failures: [], seedDivergenceExecuted: false });
    expect(executed).toEqual([
      'no_crash', 'rerun_identical', 'seed_divergent', 'population_bounded',
      'isolated_worker_executed', 'isolated_worker_output_identical',
    ]);
    // NEGATIVE CONTROL, stated as a collection so it cannot go vacuous: a skipped run
    // publishes every other property and NOT the one it did not earn.
    expect(skipped.filter((property) => property === 'seed_divergent')).toEqual([]);
    expect(skipped).toEqual([
      'no_crash', 'rerun_identical', 'population_bounded',
      'isolated_worker_executed', 'isolated_worker_output_identical',
    ]);
    expect(soakProperties({ failures: ['x'], seedDivergenceExecuted: true })).toEqual([]);

    // The three refusals, each by its own cause, each naming its law.
    expect(soakInvocationRefusals({})).toEqual([]);
    expect(soakInvocationRefusals({ skipDivergence: true })).toEqual([]);
    const caseRefusal = soakInvocationRefusals({ skipDivergence: true, caseId: 'rs-1' });
    expect(caseRefusal.length).toBe(1);
    expect(caseRefusal[0]).toContain('--skip-divergence with --case-id');
    expect(caseRefusal[0]).toContain('seed_divergent');
    const restoreRefusal = soakInvocationRefusals({ restoreFrom: '/tmp/c.json', caseId: 'rs-1' });
    expect(restoreRefusal.length).toBe(1);
    expect(restoreRefusal[0]).toContain('--restore-from with --case-id');
    expect(soakInvocationRefusals({ checkpointEvery: '2' })).toEqual([]);
    for (const bad of ['0', '-1', '1.5', 'yearly']) {
      const refused = soakInvocationRefusals({ checkpointEvery: bad });
      expect(refused.length, `--checkpoint-every ${bad} was accepted`).toBe(1);
      expect(refused[0]).toContain('is not an integer >= 1');
    }
    // A restore into a DIFFERENT world is refused on the three identity keys, and
    // node/platform/arch are deliberately NOT among them — a mismatch there is
    // ENGINE-VARIANCE, which the capsule layer reports, never a world-identity failure.
    expect([...CHECKPOINT_IDENTITY_KEYS]).toEqual(['seed', 'settlements', 'sourceSha']);
    const identity = checkpointIdentity({
      year: 2, seed: 's', years: 4, settlements: 4, sourceSha: 'abc',
      nodeVersion: 'v20.0.0', platform: 'linux', arch: 'x64', schemaVersion: 5,
    });
    expect(checkpointIdentityMismatch(identity, { seed: 's', settlements: 4, sourceSha: 'abc' })).toEqual([]);
    expect(checkpointIdentityMismatch(identity, { seed: 'other', settlements: 4, sourceSha: 'abc' }).length).toBe(1);
    expect(checkpointIdentityMismatch(identity, { seed: 's', settlements: 4, sourceSha: '' }).length).toBe(1);
    expect(buildCheckpoint({ identity, campaign: { a: 1 }, saves: [] }).kind).toBe('whole_world_soak_checkpoint');
  });

  it('ARM 7 — the deep key census sees what the composite hash cannot, and the address chain is measured', () => {
    // ⛔ SK.U1's instrument. `JSON.stringify` DROPS an undefined-valued key, so the
    // composite hash — itself stringify-based — is identical across the loss while
    // the engine's `'k' in obj` is not. The census must see it or the restore proof
    // is green and meaningless.
    const live = { worldState: { rngSeed: 's', ghost: undefined, tick: 4 } };
    const roundTripped = JSON.parse(JSON.stringify(live));
    expect(JSON.stringify(live)).toBe(JSON.stringify(roundTripped));
    const before = deepKeyCensus(live);
    const after = deepKeyCensus(roundTripped);
    expect(before.filter((key) => !after.includes(key))).toEqual([
      '$.worldState.ghost=undefined',
      '$.worldState:object{3}',
    ]);
    // …and a lossless payload censuses identically, so the instrument is not simply
    // reporting difference for everything.
    const clean = { worldState: { rngSeed: 's', tick: 4 }, saves: [{ id: 'a' }] };
    expect(deepKeyCensus(clean)).toEqual(deepKeyCensus(JSON.parse(JSON.stringify(clean))));
    // Map/Set/Date are the other three round-trip casualties, and they are visible.
    expect(deepKeyCensus({ m: new Map([['k', 1]]) })).toContain('$.m:Map[1]');

    // ⚠ ALIAS-INSENSITIVITY, the defect the first executed probe found. A live realm
    // is a DAG and its round-tripped copy is a TREE, so a walker with one global
    // `seen` set reports a difference at every SHARED reference — 121 artifacts around
    // 12 real findings on the first run. A shared-but-acyclic node must census the
    // same on both sides; a genuine cycle must still terminate.
    const shared = { k: 1 };
    const dag = { left: shared, right: shared };
    expect(deepKeyCensus(dag)).toEqual(deepKeyCensus(JSON.parse(JSON.stringify(dag))));
    const cyclic = { name: 'root' };
    cyclic.self = cyclic;
    expect(deepKeyCensus(cyclic)).toContain('$.self:cycle');

    // ⭐ THE SK.U1 CURE, and its counterfactual. The paths are collected as SEGMENT
    // ARRAYS because real realm keys carry dots and colons.
    const realmish = {
      saves: [{ settlement: { stress: { icon: undefined, level: 2 } } }],
      'edge.a.b': { 'trade:news.1': { note: undefined } },
    };
    const paths = collectUndefinedKeyPaths(realmish);
    expect(paths).toEqual([
      ['saves', 0, 'settlement', 'stress', 'icon'],
      ['edge.a.b', 'trade:news.1', 'note'],
    ]);
    // COUNTERFACTUAL — without the replant the census DIVERGES. This is the arm that
    // makes the cure's pin non-vacuous: it fails if the replant becomes a no-op.
    const withoutCure = JSON.parse(JSON.stringify(realmish));
    expect(deepKeyCensus(withoutCure)).not.toEqual(deepKeyCensus(realmish));
    // …and WITH it the census is identical, because the realm is the same realm.
    const withCure = JSON.parse(JSON.stringify(realmish));
    const replanted = replantUndefinedKeys(withCure, paths);
    expect(replanted).toEqual({ planted: 2, unreachable: [] });
    expect(deepKeyCensus(withCure)).toEqual(deepKeyCensus(realmish));
    // An unreachable path is REPORTED, never swallowed — a silent skip is the exact
    // failure the cure exists to prevent.
    expect(replantUndefinedKeys({}, [['missing', 'deep', 'key']]))
      .toEqual({ planted: 0, unreachable: [['missing', 'deep', 'key']] });

    // ⭐ §180.3a — the address-chain instrument. Four mandatory parts; the depth walk
    // is CONTIGUOUS, so an NPC id with no faction is an incomplete chain rather than
    // the best possible score.
    const empty = measureAddressChain([]);
    expect(empty.rows).toBe(0);
    expect(empty.fullyAddressedRateMilli).toBe(0);
    const measured = measureAddressChain([
      { settlementIds: ['a'], powerId: 'p', factionId: 'f', npcId: 'n', impactKind: 'travel', reasons: ['because'] },
      { settlementIds: ['a'], impactKind: 'calamity', reasons: ['storm'] },
      { settlementIds: ['a'], npcId: 'n', kind: 'applied' },
      { headline: 'unaddressed' },
    ]);
    expect(measured.rows).toBe(4);
    expect(measured.depthHistogram).toEqual({ 0: 1, 1: 2, 2: 0, 3: 0, 4: 1 });
    expect(measured.fullyAddressed).toBe(2);
    expect(measured.affectedSettlements).toBe(3);
    expect(measured.reason).toBe(2);
    expect(measured.typedAction).toBe(3);
    expect(measured.fullyAddressedRateMilli).toBe(500);
    // Rates are INTEGER MILLI so no float formatting can fork the Node and SQL faces.
    for (const [key, value] of Object.entries(measured)) {
      if (!key.endsWith('RateMilli')) continue;
      expect(Number.isInteger(value), `${key} is not an integer`).toBe(true);
    }
  });
});
