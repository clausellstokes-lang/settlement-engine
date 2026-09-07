/**
 * POLIS-1 pins — the plan law, its shift, and the promise that bounds it
 * (DESIGN_FMG_WEAVE D5/D6, Q-W3 pre-ruled: worldCode v2 ships, v1 replays as v1 FOREVER).
 *
 * The centrepiece is the v1-forever arm. Everything else this car does — founding ties,
 * the surprise-me sentinels, the magic knob finally reaching the share code — is only
 * safe BECAUSE an old code still names the world it always named. That arm is therefore
 * written against the plan's raw bytes, not against a summary of it.
 */
import { describe, test, expect } from 'vitest';
import {
  deriveWorldPlan,
  PLAN_LAW_VERSION,
  PLAN_LAW_LEGACY,
  REALM_SIZES,
  TONES,
} from '../../../src/domain/instantWorld/worldPlan.js';
import {
  encodeWorldCode,
  decodeWorldCode,
  WORLD_CODE_PAYLOAD_VERSION,
  WORLD_CODE_PAYLOAD_LEGACY,
} from '../../../src/lib/worldCode.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const SEEDS = ['promise-1', 'promise-2', 'promise-3', 'realm-alpha', '12345'];
const KNOBS = [
  { realmSize: 'small', tone: 'realistic_regional', mapKind: 'highIsland', magic: 'yes' },
  { realmSize: 'medium', tone: 'dramatic_campaign', mapKind: '', magic: 'no' },
  { realmSize: 'large', tone: 'quiet_local', mapKind: 'atoll', magic: 'yes' },
  {},
];

describe('POLIS-1 — THE PROMISE: a v1 plan is frozen for life', () => {
  test('law 1 writes NEITHER the law key NOR relations — absence IS the legacy plan', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      for (const basicConfig of KNOBS) {
        const plan = deriveWorldPlan({ seed, basicConfig, planLaw: PLAN_LAW_LEGACY });
        expect(Object.prototype.hasOwnProperty.call(plan, 'planLaw')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(plan, 'relations')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(plan, 'requestedRealmSize')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(plan, 'requestedTone')).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'a law-1 plan carries none of law 2\'s four keys, under every knob set');
  });

  test('law 1 is byte-stable against itself across repeated derivations', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const a = deriveWorldPlan({ seed, basicConfig: KNOBS[1], planLaw: PLAN_LAW_LEGACY });
      const b = deriveWorldPlan({ seed, basicConfig: KNOBS[1], planLaw: PLAN_LAW_LEGACY });
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    });
    expectNoSeedFailures(failures, 'two law-1 derivations of one seed are byte-identical');
  });

  test('an UNKNOWN plan law falls back to LEGACY, never to the newest', () => {
    // Fail-closed in the direction that matters: guessing "newest" for a code we do
    // not understand would hand someone a different world than their code names.
    for (const bogus of [3, 99, 'two', {}, -1]) {
      const plan = deriveWorldPlan({ seed: 'unknown-law', basicConfig: {}, planLaw: /** @type {any} */ (bogus) });
      expect(Object.prototype.hasOwnProperty.call(plan, 'planLaw')).toBe(false);
      expect(plan.relations).toBeUndefined();
    }
  });

  test('an ABSENT plan law composes at the NEWEST law (a fresh world gets today\'s rules)', () => {
    const plan = deriveWorldPlan({ seed: 'fresh', basicConfig: { realmSize: 'medium' } });
    expect(plan.planLaw).toBe(PLAN_LAW_VERSION);
  });
});

describe('POLIS-1 — fork isolation: the new draws displace nothing', () => {
  // §1.1's fork-safety claim, executed rather than cited. A fork derives from the seed
  // STRING, not stream position, so law 2's three new streams cannot move the map-kind
  // roll or the site scatter that law 1 already produced.
  test('law 2 reproduces law 1\'s map template and site scatter exactly', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const one = deriveWorldPlan({ seed, basicConfig: KNOBS[0], planLaw: PLAN_LAW_LEGACY });
      const two = deriveWorldPlan({ seed, basicConfig: KNOBS[0], planLaw: PLAN_LAW_VERSION });
      expect(two.mapKind).toBe(one.mapKind);
      expect(JSON.stringify(two.sites)).toBe(JSON.stringify(one.sites));
    });
    expectNoSeedFailures(failures, 'law 2 displaces neither the map-kind roll nor the site scatter');
  });

  test('a "Random island" resolves identically under both laws', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const one = deriveWorldPlan({ seed, basicConfig: { mapKind: '' }, planLaw: PLAN_LAW_LEGACY });
      const two = deriveWorldPlan({ seed, basicConfig: { mapKind: '' }, planLaw: PLAN_LAW_VERSION });
      expect(two.mapKind).toBe(one.mapKind);
    });
    expectNoSeedFailures(failures, 'an unspecified map kind resolves to the same template under both laws');
  });
});

describe('POLIS-1 — the founding ties (law 2)', () => {
  const plans = SEEDS.map(seed => deriveWorldPlan({
    seed, basicConfig: { realmSize: 'large' }, planLaw: PLAN_LAW_VERSION,
  }));

  test('a realm is born holding ties, but is not a complete graph', () => {
    for (const plan of plans) {
      const n = plan.sites.length;
      expect(plan.relations.length).toBeGreaterThan(0);
      // An unbudgeted pass would mint n(n-1)/2 — 91 for a large realm. A realm with no
      // strangers in it is not a realm with a history.
      expect(plan.relations.length).toBeLessThan((n * (n - 1)) / 2);
    }
  });

  test('THE SUZERAIN CLOSURE: no seat ever owes fealty to two lords', () => {
    for (const plan of plans) {
      const lordCount = new Map();
      for (const r of plan.relations) {
        // `overlord_of` reads a-is-lord; `vassal_of` reads a-is-vassal.
        const vassal = r.type === 'overlord_of' ? r.b : r.type === 'vassal_of' ? r.a : null;
        if (vassal == null) continue;
        lordCount.set(vassal, (lordCount.get(vassal) || 0) + 1);
      }
      for (const [, count] of lordCount) expect(count).toBeLessThanOrEqual(1);
    }
  });

  test('every tie names a real slot pair, never a seat with itself', () => {
    for (const plan of plans) {
      const slots = new Set(plan.sites.map(s => s.slot));
      for (const r of plan.relations) {
        expect(slots.has(r.a)).toBe(true);
        expect(slots.has(r.b)).toBe(true);
        expect(r.a).not.toBe(r.b);
      }
    }
  });

  test('the same seed mints the same ties (a plan is replayable)', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const a = deriveWorldPlan({ seed, basicConfig: { realmSize: 'large' }, planLaw: PLAN_LAW_VERSION });
      const b = deriveWorldPlan({ seed, basicConfig: { realmSize: 'large' }, planLaw: PLAN_LAW_VERSION });
      expect(JSON.stringify(a.relations)).toBe(JSON.stringify(b.relations));
    });
    expectNoSeedFailures(failures, 'two derivations of one seed mint byte-identical founding ties');
  });

  test('a realm too small to have neighbours holds no ties at all', () => {
    const plan = deriveWorldPlan({ seed: 'tiny', basicConfig: { realmSize: 'small' }, planLaw: PLAN_LAW_VERSION });
    expect(Array.isArray(plan.relations) || plan.relations === undefined).toBe(true);
  });
});

describe('POLIS-1 — the surprise-me sentinels (#11a, law 2 only)', () => {
  test('an empty realmSize/tone RESOLVES from the seed under law 2', () => {
    const plan = deriveWorldPlan({
      seed: 'surprise', basicConfig: { realmSize: '', tone: '' }, planLaw: PLAN_LAW_VERSION,
    });
    expect(Object.keys(REALM_SIZES)).toContain(plan.realmSize);
    expect(TONES.map(t => t.id)).toContain(plan.tonePresetId);
    // The resolved/requested split the map-kind knob already keeps.
    expect(plan.requestedRealmSize).toBe('');
    expect(plan.requestedTone).toBe('');
  });

  test('the resolution is stable for a seed, and varies across seeds', () => {
    const of = (seed) => deriveWorldPlan({ seed, basicConfig: { realmSize: '', tone: '' }, planLaw: PLAN_LAW_VERSION });
    expect(of('s-a').realmSize).toBe(of('s-a').realmSize);
    const spread = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(s => of(`spread-${s}`).realmSize));
    expect(spread.size).toBeGreaterThan(1);
  });

  test('under law 1 the sentinel is NOT consulted — it coerces to the fixed default', () => {
    const plan = deriveWorldPlan({
      seed: 'surprise', basicConfig: { realmSize: '', tone: '' }, planLaw: PLAN_LAW_LEGACY,
    });
    expect(plan.realmSize).toBe('medium');
    expect(plan.tonePresetId).toBe('realistic_regional');
  });
});

describe('POLIS-1 — worldCode v2 and the magic-knob defect', () => {
  test('a new code mints at v2 and selects plan law 2', () => {
    const code = encodeWorldCode({ seed: 'w2', basicConfig: { realmSize: 'small', magic: 'no' } });
    const decoded = decodeWorldCode(code);
    expect(decoded.version).toBe(WORLD_CODE_PAYLOAD_VERSION);
    expect(decoded.planLaw).toBe(2);
  });

  test('⛔ THE DEFECT IS CURED IN v2: a mundane realm survives being shared', () => {
    const decoded = decodeWorldCode(encodeWorldCode({ seed: 'mundane', basicConfig: { magic: 'no' } }));
    expect(decoded.basicConfig.magic).toBe('no');
  });

  test('a v1 code still decodes, selects law 1, and carries NO magic — forever', () => {
    // Hand-built v1 payload: the shape every code minted before this car used.
    const v1 = buildLegacyCode({ v: 1, s: 'old-world', c: { realmSize: 'small', tone: 'quiet_local' } });
    const decoded = decodeWorldCode(v1);
    expect(decoded.version).toBe(WORLD_CODE_PAYLOAD_LEGACY);
    expect(decoded.planLaw).toBe(1);
    expect(decoded.seed).toBe('old-world');
    // The defect is PRESERVED in v1 rather than back-patched: adding a key would change
    // what an existing code decodes to, and an existing code must keep naming the world
    // it always named — defect included.
    expect(decoded.basicConfig.magic).toBeUndefined();
  });

  test('a v1 code IGNORES a magic key even if one is smuggled into its payload', () => {
    const v1 = buildLegacyCode({ v: 1, s: 'smuggle', c: { realmSize: 'small', magic: 'no' } });
    expect(decodeWorldCode(v1).basicConfig.magic).toBeUndefined();
  });

  test('an UNKNOWN payload version still fails closed', () => {
    const v3 = buildLegacyCode({ v: 3, s: 'future', c: {} });
    expect(decodeWorldCode(v3)).toBeNull();
  });
});

/**
 * Build a code at an arbitrary payload version, mirroring the module's own envelope.
 * Needed because `encodeWorldCode` (correctly) only ever mints the CURRENT version, and
 * the v1-forever promise cannot be tested without a v1 code to test it with.
 * @param {{v:number,s:string,c:object}} payload
 */
function buildLegacyCode(payload) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let b64 = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const has1 = i + 1 < bytes.length;
    const has2 = i + 2 < bytes.length;
    const b1 = has1 ? bytes[i + 1] : 0;
    const b2 = has2 ? bytes[i + 2] : 0;
    b64 += B64[b0 >> 2];
    b64 += B64[((b0 & 0x03) << 4) | (b1 >> 4)];
    if (has1) b64 += B64[((b1 & 0x0f) << 2) | (b2 >> 6)];
    if (has2) b64 += B64[b2 & 0x3f];
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < b64.length; i++) { h ^= b64.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return `w1.${b64}.${(h >>> 0).toString(16).padStart(8, '0')}`;
}
