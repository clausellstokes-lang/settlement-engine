/**
 * ST-3 pins — the composer's pipeline-as-data (DESIGN_FMG_WEAVE D12).
 *
 * The car's value is not that the composer now runs a list; it is that FOUR HIDDEN
 * COUPLINGS which were previously invisible are declared AND executable. Each is
 * pinned here by running the mechanism, not by reading the declaration — a coupling
 * whose guard cannot fail is not a guard.
 *
 * The placement-join arm is a DISCOVERY arm: it hands the join a member array in
 * the wrong order, which is a state the composer cannot currently produce. It is
 * pinning the repair against a future reorder, and it would have FAILED against the
 * index join this car replaced.
 */
import { describe, test, expect } from 'vitest';
import {
  runComposerSteps,
  COMPOSER_STEP_CONTRACT,
  COMPOSER_STEP_ORDER,
  COMPOSER_COUPLINGS,
  COMPOSER_COUPLING_IDS,
} from '../../../src/lib/instantWorld/composerPipeline.js';
import { composeInstantWorld, placeMembers } from '../../../src/lib/instantWorld/composeInstantWorld.js';
// ⭐ THE CREATE BOUNDARY'S ASYNC PRELUDE — A TEST IS A CALLER LIKE ANY OTHER
// (2026-09-08, lane LIGHT car 1b). `composeInstantWorld` is a classified BIRTH and
// is SYNCHRONOUS by design, so it cannot load the lazy payload the law it mints
// needs: since the living-content dial was lit, every world it mints is a v2 world,
// and the seam THROWS rather than degrading when the roster payload was never
// loaded. Production awaits `loadGenerationLawPayloads()` on the async edge of each
// of the composer's three callers; this file awaits it at module scope, which is
// where it has to be because this family composes outside a hook.
import { loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';

await loadGenerationLawPayloads();


describe('ST-3 — the declared contract', () => {
  test('every step declares the three contract words', () => {
    expect(COMPOSER_STEP_CONTRACT.length).toBeGreaterThan(0);
    for (const step of COMPOSER_STEP_CONTRACT) {
      expect(typeof step.name).toBe('string');
      expect(Array.isArray(step.reads)).toBe(true);
      expect(Array.isArray(step.provides)).toBe(true);
      expect(Array.isArray(step.mutates)).toBe(true);
    }
  });

  test('the two in-place passes declare `mutates`, never `provides`', () => {
    // The coupling that a `provides`-only reader would miss entirely.
    for (const name of ['dedupeFactionNames', 'materializeGenesisTies']) {
      const step = COMPOSER_STEP_CONTRACT.find(s => s.name === name);
      expect(step, `${name} must be in the contract`).toBeTruthy();
      expect(step.mutates).toContain('settlements');
      expect(step.provides).toHaveLength(0);
    }
  });

  test('the founding-tie step sits between the de-dup and the discovery', () => {
    // A1.2.12's ordering law, expressed against the contract rather than the source.
    const i = (n) => COMPOSER_STEP_ORDER.indexOf(n);
    expect(i('dedupeFactionNames')).toBeLessThan(i('materializeGenesisTies'));
    expect(i('materializeGenesisTies')).toBeLessThan(i('discoverChannels'));
  });
});

describe('ST-3 — the order guard actually refuses', () => {
  const noop = (name) => ({ name, fn: () => ({}) });

  test('a list matching the contract runs', () => {
    const ctx = {};
    expect(() => runComposerSteps(COMPOSER_STEP_ORDER.map(noop), ctx)).not.toThrow();
  });

  test('a REORDERED list is refused', () => {
    const swapped = [...COMPOSER_STEP_ORDER];
    [swapped[3], swapped[4]] = [swapped[4], swapped[3]];
    expect(() => runComposerSteps(swapped.map(noop), {}))
      .toThrow(/does not match the declared contract/);
  });

  test('a DROPPED step is refused', () => {
    const short = COMPOSER_STEP_ORDER.slice(0, -1);
    expect(() => runComposerSteps(short.map(noop), {}))
      .toThrow(/does not match the declared contract/);
  });

  test('a RENAMED step is refused', () => {
    const renamed = [...COMPOSER_STEP_ORDER];
    renamed[0] = 'derivePlanButDifferently';
    expect(() => runComposerSteps(renamed.map(noop), {}))
      .toThrow(/does not match the declared contract/);
  });
});

describe('ST-3 — strict mode catches an undeclared write', () => {
  test('a step that writes a key it did not declare is caught', () => {
    const steps = COMPOSER_STEP_ORDER.map((name) => ({
      name,
      // `derivePlan` declares only `plan`; writing a second key is the violation.
      fn: name === 'derivePlan'
        ? () => ({ plan: { seed: 's' }, smuggled: 1 })
        : () => ({}),
    }));
    expect(() => runComposerSteps(steps, {}, { strict: true }))
      .toThrow(/wrote undeclared context keys: smuggled/);
  });

  test('violations can be COLLECTED instead of thrown', () => {
    const seen = [];
    const steps = COMPOSER_STEP_ORDER.map((name) => ({
      name,
      fn: name === 'derivePlan' ? () => ({ plan: {}, smuggled: 1 }) : () => ({}),
    }));
    runComposerSteps(steps, {}, { strict: true, onViolation: (v) => seen.push(v) });
    expect(seen).toEqual([{ step: 'derivePlan', keys: ['smuggled'] }]);
  });

  test('a step writing only what it declared is quiet', () => {
    const steps = COMPOSER_STEP_ORDER.map((name) => ({
      name, fn: name === 'derivePlan' ? () => ({ plan: { seed: 's' } }) : () => ({}),
    }));
    expect(() => runComposerSteps(steps, {}, { strict: true })).not.toThrow();
  });
});

describe('ST-3 — the four couplings are declared', () => {
  test('all four are present, each with a rule and a named guard', () => {
    expect([...COMPOSER_COUPLING_IDS].sort())
      .toEqual(['id_order', 'in_place_mutation', 'placement_join', 'shared_now']);
    for (const c of COMPOSER_COUPLINGS) {
      expect(typeof c.rule).toBe('string');
      expect(c.rule.length).toBeGreaterThan(20);
      expect(typeof c.guardedBy).toBe('string');
    }
  });
});

describe('ST-3 — coupling `placement_join` (a DISCOVERY arm)', () => {
  // This is the coupling that was a latent DEFECT rather than merely undocumented.
  // The old join read `settlements[i]` while walking `plan.sites`; these cases hand
  // it a member array whose order does NOT match the site order, which the index
  // join would have got wrong silently.
  const plan = {
    sites: [
      { slot: 0, burgId: 'b0', x: 10, y: 11 },
      { slot: 1, burgId: 'b1', x: 20, y: 21 },
      { slot: 2, burgId: 'b2', x: 30, y: 31 },
    ],
  };
  const members = [
    { id: 'm0', _slot: 0 },
    { id: 'm1', _slot: 1 },
    { id: 'm2', _slot: 2 },
  ];

  test('in matching order, each site gets its own member', () => {
    const p = placeMembers({ plan, settlements: members, now: 'T' });
    expect(p.b0.settlementId).toBe('m0');
    expect(p.b1.settlementId).toBe('m1');
    expect(p.b2.settlementId).toBe('m2');
  });

  test('a REVERSED member array still places every member on its OWN site', () => {
    const p = placeMembers({ plan, settlements: [...members].reverse(), now: 'T' });
    // Under the retired index join this read m2 / m1 / m0 — every settlement on
    // its neighbour's site, with nothing failing loudly.
    expect(p.b0.settlementId).toBe('m0');
    expect(p.b1.settlementId).toBe('m1');
    expect(p.b2.settlementId).toBe('m2');
  });

  test('a member missing from the array leaves its site UNPLACED, never mis-placed', () => {
    const p = placeMembers({ plan, settlements: [members[0], members[2]], now: 'T' });
    expect(p.b0.settlementId).toBe('m0');
    expect(p.b1).toBeUndefined();
    expect(p.b2.settlementId).toBe('m2');
  });

  test('the composed realm satisfies the join invariant end to end', () => {
    const { campaign, settlements, plan: composedPlan } = composeInstantWorld({
      seed: 'st3-join', basicConfig: { realmSize: 'medium' },
    });
    const slotOfId = new Map(settlements.map(s => [s.id, s._slot]));
    for (const site of composedPlan.sites) {
      const placement = campaign.mapState.placements[site.burgId];
      expect(slotOfId.get(placement.settlementId)).toBe(site.slot);
    }
  });
});

describe('ST-3 — coupling `id_order` and `shared_now`', () => {
  test('the campaign takes the FIRST id and members follow in slot order', () => {
    let n = 0;
    const { campaign, settlements } = composeInstantWorld({
      seed: 'st3-ids',
      basicConfig: { realmSize: 'small' },
      idFactory: () => `ord-${n++}`,
      clock: () => 'T',
    });
    expect(campaign.id).toBe('ord-0');
    const bySlot = [...settlements].sort((a, b) => a._slot - b._slot);
    bySlot.forEach((s, i) => expect(s.id).toBe(`ord-${i + 1}`));
  });

  test('every timestamp in the bundle is the ONE clock reading', () => {
    let reads = 0;
    const NOW = '2026-03-03T03:03:03.000Z';
    const { campaign, settlements } = composeInstantWorld({
      seed: 'st3-now',
      basicConfig: { realmSize: 'small' },
      idFactory: (() => { let k = 0; return () => `t-${k++}`; })(),
      clock: () => { reads++; return NOW; },
    });
    // Read exactly once — a second read is how a bundle's parts start disagreeing.
    expect(reads).toBe(1);
    expect(campaign.createdAt).toBe(NOW);
    expect(campaign.updatedAt).toBe(NOW);
    expect(campaign.mapState.savedAt).toBe(NOW);
    expect(campaign.wizardNews.updatedAt).toBe(NOW);
    for (const s of settlements) expect(s.savedAt).toBe(NOW);
    for (const p of Object.values(campaign.mapState.placements)) {
      expect(p.placedAt).toBe(NOW);
    }
  });
});
