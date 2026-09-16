/**
 * tests/domain/pietyCausalLifts.test.js — Phase 4 W-F4 piety sites #6/#9.
 *
 * The two causalState deity lifts deferred by W-F3 now compose the LOCAL piety
 * amplifier (config.faithProfile.piety), read as a plain projected field:
 *   #6 deriveReligiousAuthority rank lift → Math.round(rankLift × localMult)
 *   #9 deriveLawOrder law swing → Math.round(±swing × localMult × megaphoneLaw)
 *
 * Guarantees pinned here:
 *  - NO piety record ⇒ literal ×1.0 ⇒ byte-identical to the pre-amplifier lift,
 *    with the receipt explanation UNCHANGED (the generation / deity-free anchor).
 *  - A present record with localMult exactly 1.0 ⇒ also byte-identical (fallback
 *    and identity agree).
 *  - A devout record scales the lift and names the amplifier in the cause chain
 *    (the legibility law); a LAW-opposed runner-up dampens the law swing only.
 */

import { describe, it, expect } from 'vitest';
import { deriveSystemVariable } from '../../src/domain/causalState.js';

const RANK = { major: 18, minor: 10, cult: 5 };
const SWING = 8;

/** A minimal settlement with a patron snapshot and an optional projected piety record. */
const withDeity = ({ rankAxis = 'major', lawAxis, alignmentAxis = 'neutral', piety } = {}) => ({
  name: 'T', tier: 'town', population: 2000,
  config: {
    monsterThreat: 'safe', terrain: 'plain',
    primaryDeitySnapshot: { _deityRef: 'custom:test', name: 'Test God', rankAxis, lawAxis, alignmentAxis },
    ...(piety ? { faithProfile: { piety } } : {}),
  },
  powerStructure: { factions: [] },
  activeConditions: [],
});

const contrib = (v, effect) => v.contributors.find((c) => c.effect === effect);

describe('site #6 — rank→religious_authority × localMult', () => {
  it('no piety record ⇒ the raw rank lift, explanation unchanged (byte-identity anchor)', () => {
    const v = deriveSystemVariable('religious_authority', withDeity({ rankAxis: 'major' }));
    const c = contrib(v, 'deity_patronage');
    expect(c.delta).toBe(RANK.major);
    expect(c.reason).toBe('Test God (major) anchors religious authority.');
  });

  it('a present record with localMult exactly 1.0 ⇒ identical to no record', () => {
    const v = deriveSystemVariable('religious_authority', withDeity({ rankAxis: 'major', piety: { localMult: 1 } }));
    const c = contrib(v, 'deity_patronage');
    expect(c.delta).toBe(RANK.major);
    expect(c.reason).toBe('Test God (major) anchors religious authority.');
  });

  it('a devout record scales the lift and names the amplifier', () => {
    const v = deriveSystemVariable('religious_authority', withDeity({ rankAxis: 'major', piety: { localMult: 1.5 } }));
    const c = contrib(v, 'deity_patronage');
    expect(c.delta).toBe(Math.round(RANK.major * 1.5)); // 27
    expect(c.reason).toContain('(piety ×1.50)');
  });

  it('a low-piety record shrinks the lift below baseline', () => {
    const v = deriveSystemVariable('religious_authority', withDeity({ rankAxis: 'minor', piety: { localMult: 0.7 } }));
    const c = contrib(v, 'deity_patronage');
    expect(c.delta).toBe(Math.round(RANK.minor * 0.7)); // 7
  });
});

describe('site #9 — deity→law_order × localMult × megaphoneLaw', () => {
  it('no piety record ⇒ the raw ±swing, explanation unchanged (byte-identity anchor)', () => {
    const v = deriveSystemVariable('law_order', withDeity({ lawAxis: 'lawful' }));
    const c = contrib(v, 'lawful_patron');
    expect(c.delta).toBe(SWING);
    expect(c.reason).toBe('Test God (lawful) strengthens law & order.');
  });

  it('a devout record with no opposed law rival scales the swing', () => {
    const v = deriveSystemVariable('law_order', withDeity({ lawAxis: 'lawful', piety: { localMult: 1.5, dampener: { megaphoneLaw: 1 } } }));
    const c = contrib(v, 'lawful_patron');
    expect(c.delta).toBe(Math.round(SWING * 1.5)); // 12
    expect(c.reason).toContain('(piety ×1.50)');
  });

  it('a LAW-opposed runner-up dampens the swing on the law channel only', () => {
    const full = deriveSystemVariable('law_order', withDeity({ lawAxis: 'lawful', piety: { localMult: 1.5, dampener: { megaphoneLaw: 1 } } }));
    const damped = deriveSystemVariable('law_order', withDeity({ lawAxis: 'lawful', piety: { localMult: 1.5, dampener: { megaphoneLaw: 0.5 } } }));
    expect(contrib(damped, 'lawful_patron').delta).toBe(Math.round(SWING * 1.5 * 0.5)); // 6
    expect(contrib(damped, 'lawful_patron').delta).toBeLessThan(contrib(full, 'lawful_patron').delta);
  });

  it('a chaotic devout patron erodes order harder (signed)', () => {
    const v = deriveSystemVariable('law_order', withDeity({ lawAxis: 'chaotic', piety: { localMult: 1.5, dampener: { megaphoneLaw: 1 } } }));
    const c = contrib(v, 'chaotic_patron');
    expect(c.delta).toBe(Math.round(-SWING * 1.5)); // -12
    expect(c.reason).toContain('erodes order and tolerates corruption');
  });
});
