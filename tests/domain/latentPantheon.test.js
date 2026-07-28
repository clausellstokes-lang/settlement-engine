/**
 * latentPantheon.test.js — the activation seam (Phase 4 W-F5 stage 2;
 * PREMIUM GATE addendum).
 *
 * The seam is a pure, RNG-FREE copy of a latent record into the live embed keys.
 * Pinned here: determinism/byte-equality, idempotence, conservatism (no latent /
 * already active / DM-authored ⇒ untouched), latency preservation, and the
 * neutrality-theorem inertness flip — the subsystem gate is CLOSED before
 * activation and OPEN after, on the very same settlement data.
 *
 * ⚠️ THE SEAM IS NOW LEGACY-ONLY (T4 ONE-REGEN batch). The premade deity pool and
 * the `seedStartingPantheon` step that baked a pantheon into every seed were
 * retired under the deity doctrine, so the seam's only input is a record
 * PERSISTED in an older save. The final describe block is the doctrine made
 * executable, and it carries the two lifecycle facts that batch is accountable
 * for: a fresh generation bakes NOTHING, and a LIVE embed on the input config
 * survives a full regeneration (the property the deleted step's own guard used
 * to be the sole guarantor of).
 */

import { describe, expect, test } from 'vitest';

import {
  latentPantheonOf, hasActivePantheon, activateLatentPantheon,
} from '../../src/domain/worldPulse/latentPantheon.js';
import { isSubsystemActive } from '../../src/domain/worldPulse/subsystemActivation.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const PATRON = Object.freeze({
  _deityRef: 'deity:core:thessa', name: 'Thessa of the Hearth', alignmentAxis: 'good',
  temperamentAxis: 'peacelike', rankAxis: 'major', lawAxis: 'neutral',
  domain: 'hearth', portfolio: 'Bread, birth, and the fire that outlasts winter.',
});
const CULT = Object.freeze({
  _deityRef: 'deity:core:pell', name: 'Pell the Unwritten', alignmentAxis: 'neutral',
  temperamentAxis: 'neutral', rankAxis: 'cult', lawAxis: 'chaotic', domain: 'mischief',
});

const latentSettlement = (cults) => ({
  name: 'Hearthholt', tier: 'town', population: 2000,
  config: { tradeRouteAccess: 'road', latentPantheon: Object.freeze({ patron: PATRON, ...(cults ? { cults: Object.freeze(cults) } : {}) }) },
  institutions: [], powerStructure: {},
});

const snapshotOf = (s) => ({ settlements: [{ id: 's0', name: s.name, settlement: s }] });

describe('latentPantheon — the rng-free activation seam', () => {
  test('activation copies the latent patron + cults into live embeds, byte-equal', () => {
    const before = latentSettlement([CULT]);
    const after = activateLatentPantheon(before);
    expect(after).not.toBe(before);                       // a new object (pure, no mutation)
    expect(before.config.primaryDeitySnapshot).toBeUndefined(); // input untouched
    expect(after.config.primaryDeityRef).toBe('deity:core:thessa');
    expect(after.config.primaryDeitySnapshot).toEqual(PATRON);  // byte-equal copy (portfolio rides along)
    expect(after.config.cultDeitySnapshots).toEqual([CULT]);
    expect(Object.isFrozen(after.config.primaryDeitySnapshot)).toBe(true);
    expect(Object.isFrozen(after.config.cultDeitySnapshots)).toBe(true);
    // Latency preserved: the latent record remains the seed's truth.
    expect(latentPantheonOf(after)).toEqual({ patron: PATRON, cults: [CULT] });
  });

  test('deterministic: same input ⇒ deep-equal output (no rng anywhere in the seam)', () => {
    const a = activateLatentPantheon(latentSettlement([CULT]));
    const b = activateLatentPantheon(latentSettlement([CULT]));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  test('idempotent: re-activation returns the SAME reference, never a double-write', () => {
    const once = activateLatentPantheon(latentSettlement([CULT]));
    const twice = activateLatentPantheon(once);
    expect(twice).toBe(once);
  });

  test('conservative: no latent record ⇒ untouched; an explicit live deity is never clobbered', () => {
    const bare = { name: 'Plainstead', tier: 'village', config: { tradeRouteAccess: 'road' } };
    expect(activateLatentPantheon(bare)).toBe(bare);
    expect(activateLatentPantheon(null)).toBe(null);
    expect(activateLatentPantheon(undefined)).toBe(undefined);
    // A DM-assigned deity outranks the latent seed (activation is a no-op).
    const dmGod = { _deityRef: 'custom:lu_own', name: 'Own', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major', lawAxis: 'lawful' };
    const assigned = { ...latentSettlement(), config: { ...latentSettlement().config, primaryDeityRef: dmGod._deityRef, primaryDeitySnapshot: dmGod } };
    const out = activateLatentPantheon(assigned);
    expect(out).toBe(assigned);
    expect(out.config.primaryDeitySnapshot.name).toBe('Own');
  });

  test('a patron-only latent record activates without minting a cult key (dormancy shape discipline)', () => {
    const after = activateLatentPantheon(latentSettlement());
    expect(after.config.primaryDeitySnapshot).toEqual(PATRON);
    expect(after.config.cultDeitySnapshots).toBeUndefined();
  });

  test('NEUTRALITY THEOREM: the subsystem gate is CLOSED pre-activation and OPEN post-activation', () => {
    const latent = latentSettlement([CULT]);
    expect(hasActivePantheon(latent)).toBe(false);
    expect(isSubsystemActive(snapshotOf(latent), 'religion')).toBe(false);   // latent gods are engine-invisible
    const active = activateLatentPantheon(latent);
    expect(hasActivePantheon(active)).toBe(true);
    expect(isSubsystemActive(snapshotOf(active), 'religion')).toBe(true);    // the key turns, the engine wakes
  });

  test('end-to-end: a settlement carrying a PERSISTED latent record activates it verbatim', () => {
    // This used to generate a settlement and read the pantheon the pipeline baked
    // into it. The T4 batch retired the premade pool, so generation bakes nothing
    // — the seam's input is now exclusively a PERSISTED record from an older
    // save. That is what this drives: the same end-to-end assertions, sourced the
    // way the seam is actually fed today.
    const s = latentSettlement([CULT]);
    const latent = latentPantheonOf(s);
    expect(latent?.patron).toBeTruthy();
    expect(isSubsystemActive(snapshotOf(s), 'religion')).toBe(false);
    const active = activateLatentPantheon(s);
    expect(active.config.primaryDeitySnapshot).toEqual(latent.patron);
    if (latent.cults) expect(active.config.cultDeitySnapshots).toEqual(latent.cults);
    expect(isSubsystemActive(snapshotOf(active), 'religion')).toBe(true);
    // Idempotence holds on the real object too.
    expect(activateLatentPantheon(active)).toBe(active);
  });
});

describe('the deity doctrine, made executable (T4 ONE-REGEN batch)', () => {
  const GEN_CONFIG = Object.freeze({
    settType: 'city', culture: 'mediterranean', terrainOverride: 'coastal',
    tradeRouteAccess: 'port', monsterThreat: 'civilized',
  });

  test('a freshly generated settlement bakes NO pantheon and NO faith key — no premade deities', () => {
    const s = generateSettlementPipeline(GEN_CONFIG, null, { seed: 'seam-e2e', customContent: {} });
    // Anchored negatives: assert against the CONFIG THAT EXISTS, so a config that
    // vanished entirely (which would make every absence assertion vacuously true)
    // fails this pin instead of passing it.
    expect(s.config).toBeTruthy();
    expect(s.config.tradeRouteAccess).toBe('port');
    expect(latentPantheonOf(s)).toBe(null);
    expect(s.config.latentPantheon).toBeUndefined();
    expect(s.config.faith).toBeUndefined();
    // And with nothing latent, the seam is a conservative no-op on real output.
    expect(activateLatentPantheon(s)).toBe(s);
    expect(isSubsystemActive(snapshotOf(s), 'religion')).toBe(false);
  }, 30_000);

  test('REGENERATION preserves a LIVE embed carried on the input config', () => {
    // The retired step used to guard this: it refused to bake latent gods beneath
    // an explicit live deity. With the step gone, nothing else asserted that a
    // DM-assigned (or previously activated) patron survives a full regeneration —
    // the property would have been silently orphaned. This is that guard's heir.
    const s = generateSettlementPipeline(
      { ...GEN_CONFIG, primaryDeityRef: PATRON._deityRef, primaryDeitySnapshot: PATRON },
      null, { seed: 'seam-e2e', customContent: {} },
    );
    expect(s.config.primaryDeitySnapshot).toEqual(PATRON);
    expect(s.config.primaryDeityRef).toBe(PATRON._deityRef);
    // A live embed means the religion subsystem is awake on generated output.
    expect(isSubsystemActive(snapshotOf(s), 'religion')).toBe(true);
  }, 30_000);
});
