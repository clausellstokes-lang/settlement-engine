/**
 * tests/domain/crisisCastFindings.test.js — the crisis cast's self-check
 * (src/domain/coherence/crisisCastFindings.js; docs/DESIGN_CRISIS_TAB.md): every cast member's
 * faction stake agrees with the role, no contradictory pair across a town's crises, no cap
 * exceeded. Each fault is planted and caught; 120 generated towns (the first seat's corpus: half
 * random stress, half forced pairs) carry none.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { crisisCastFindings } from '../../src/domain/coherence/crisisCastFindings.js';
import { CAST_REASONS } from '../../src/domain/crisis/crisisCast.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KINDS = Object.keys(STRESS_TYPE_MAP);
const row = (role, id, name, reason = 'r') => ({ role, kind: 'npc', id, name, reason, temporary: false });
const cast = (roles, stakes) => ({ nature: 'natural', rank: 1, roles, absent: [], stakes, levers: [], ifNothingIsDone: { residualEffects: [] }, playersSeeFirst: [], links: [] });
const town = (stress, extra = []) => ({
  npcs: [
    { id: 'a', name: 'Ada', memberships: [{ power: 'Merchants', rank: 1 }] },
    { id: 'b', name: 'Bran', memberships: [{ power: 'Council', rank: 1 }] },
    ...extra,
  ],
  stress,
});

describe('the crisis cast\'s self-check', () => {
  it('an exploiter whose faction does not gain, and a scapegoat whose faction does not lose, are findings', () => {
    const s = town([{ type: 'famine', cast: cast(
      [row('exploiter', 'a', 'Ada', CAST_REASONS.exploiterPower), row('scapegoat', 'b', 'Bran', CAST_REASONS.scapegoatSeat)],
      [{ factionId: 'Merchants', stake: 'loses', reason: 'x' }, { factionId: 'Council', stake: 'gains', reason: 'y' }],
    ) }]);
    expect(crisisCastFindings(s).map((f) => [f.code, f.crisis])).toEqual([['stake_disagrees', 'famine'], ['stake_disagrees', 'famine']]);
  });

  it('agreeing stakes are clean, and the DM\'s rows are never judged', () => {
    const s = town([{ type: 'famine', cast: cast(
      [row('exploiter', 'a', 'Ada', CAST_REASONS.exploiterPower), row('scapegoat', 'a', 'Ada', CAST_REASONS.dm)],
      [{ factionId: 'Merchants', stake: 'gains', reason: 'x' }],
    ) }]);
    expect(crisisCastFindings(s)).toEqual([]); // anchored: the planted-fault title above proves the instrument reds on a disagreeing stake
  });

  it('a contradictory pair across two crises is a finding', () => {
    const s = town([
      { type: 'famine', cast: cast([row('brunt', 'a', 'Ada')], []) },
      { type: 'under_siege', cast: cast([row('profiteer', 'a', 'Ada', CAST_REASONS.exploiterPower)], [{ factionId: 'Merchants', stake: 'gains', reason: 'x' }]) },
    ]);
    expect(crisisCastFindings(s)).toEqual([{ code: 'contradictory_pair', crisis: 'under_siege', detail: 'Ada is profiteer in under_siege and brunt in famine' }]);
  });

  it('a cap exceeded is a finding: two exploiters, two temporary people', () => {
    const gains = [{ factionId: 'Merchants', stake: 'gains', reason: 'x' }, { factionId: 'Council', stake: 'gains', reason: 'x' }];
    const s = town([
      { type: 'famine', cast: cast([row('exploiter', 'a', 'Ada', CAST_REASONS.exploiterPower)], gains) },
      { type: 'plague_onset', cast: cast([row('exploiter', 'b', 'Bran', CAST_REASONS.exploiterPower)], gains) },
    ], [{ id: 't1', name: 'T1', temporary: true }, { id: 't2', name: 'T2', temporary: true }]);
    expect(crisisCastFindings(s).map((f) => f.detail)).toEqual(['2 exploiter in one town (cap 1)', '2 temporary in one town (cap 1)']);
  });

  it('120 generated towns: no finding', () => {
    let crises = 0;
    const failures = collectSeedFailures(Array.from({ length: 120 }, (_, i) => `tonight-cast-${i}`), (seed, i) => {
      const s = i % 2 === 0
        ? generateSettlementPipeline({ settType: TIERS[i % TIERS.length] }, null, { seed, customContent: {} })
        : generateSettlementPipeline({ settType: TIERS[i % TIERS.length], stressTypes: [KINDS[i % KINDS.length], KINDS[(i * 5 + 2) % KINDS.length]].filter((k, j, a) => a.indexOf(k) === j) }, null, { seed, customContent: {} });
      crises += (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean).length;
      const found = crisisCastFindings(s);
      if (found.length) throw new Error(found.map((f) => `${f.code} ${f.crisis}: ${f.detail}`).join(' | '));
    });
    expectNoSeedFailures(failures, 'the cast self-check over 120 towns');
    expect(crises).toBeGreaterThan(60);
  }, 300000);
});
