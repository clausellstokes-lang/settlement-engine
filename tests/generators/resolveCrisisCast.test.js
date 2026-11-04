/**
 * tests/generators/resolveCrisisCast.test.js — the pipeline step that writes each active
 * crisis's derived cast onto its stress entry (src/generators/steps/resolveCrisisCast.js),
 * the temporary person's one-per-town rule, and its removal by crisisResolve
 * (src/domain/crisisLifecycle.js :: crisisResolve). docs/DESIGN_CRISIS_TAB.md.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { crisisResolve } from '../../src/domain/crisisLifecycle.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KINDS = Object.keys(STRESS_TYPE_MAP);
const entriesOf = (s) => (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean);
const gen = (seed, settType, stressTypes) => generateSettlementPipeline({ settType, stressTypes }, null, { seed, customContent: {} });

describe('resolveCrisisCast writes the cast onto every active crisis', () => {
  it('a famine town carries a cast on its stress entry, with its nature and both required roles answered', () => {
    const s = gen('cast-step-famine', 'town', ['famine']);
    const [entry] = entriesOf(s);
    expect(entry.cast).toBeTruthy();
    expect(entry.cast.nature).toBe('natural');
    for (const role of ['brunt', 'lever']) {
      expect(entry.cast.roles.some((r) => r.role === role) || entry.cast.absent.some((a) => a.role === role)).toBe(true);
    }
  });

  it('120 generated towns: every crisis is cast; at most one temporary person a town, each flagged with the crises it serves', () => {
    const SEEDS = Array.from({ length: 120 }, (_, i) => `cast-step-${i}`);
    let crises = 0;
    let withTemporary = 0;
    const failures = collectSeedFailures(SEEDS, (seed, i) => {
      const kinds = [KINDS[i % KINDS.length], KINDS[(i * 5 + 2) % KINDS.length]].filter((k, j, a) => a.indexOf(k) === j);
      const s = gen(seed, TIERS[i % TIERS.length], kinds);
      const entries = entriesOf(s);
      const temps = s.npcs.filter((n) => n.temporary);
      if (temps.length > 1) throw new Error(`${temps.length} temporary people`);
      for (const e of entries) {
        crises += 1;
        if (!e.cast || !Array.isArray(e.cast.roles)) throw new Error(`${e.type}: no cast`);
        if (e.cast.roles.some((r) => r.temporary)) withTemporary += 1;
      }
      for (const t of temps) {
        if (!Array.isArray(t.crisisIds) || !t.crisisIds.length) throw new Error('a temporary person serves no crisis');
        for (const id of t.crisisIds) if (!entries.some((e) => e.type === id)) throw new Error(`${t.name} serves ${id}, which is not active`);
      }
    });
    expectNoSeedFailures(failures, 'the cast step over 120 towns');
    // The design's measured target: temporary people in under one crisis in ten.
    expect(withTemporary / crises).toBeLessThan(1 / 10);
  }, 240000);

  it('a town with no crisis is untouched: no cast, no temporary person', () => {
    const s = generateSettlementPipeline({ settType: 'village', selectedStressesRandom: false, selectedStresses: [] }, null, { seed: 'cast-step-calm', customContent: {} });
    expect(s.stress).toBeNull();
    expect(s.npcs.filter((n) => n.temporary)).toEqual([]); // anchored: s.stress is pinned null on the line above
  });
});

describe('crisisResolve takes the temporary person with the crisis that brought them', () => {
  const town = () => ({
    stress: [{ type: 'plague_onset', label: 'Plague' }, { type: 'mass_migration', label: 'Migration' }],
    stressors: null,
    npcs: [
      { id: 'n1', name: 'Mara Vell', role: 'Mayor' },
      { id: 'npc_temp_healer', name: 'Hesk Marrow', role: 'Healer', temporary: true, temporaryKind: 'healer', crisisIds: ['plague_onset', 'mass_migration'] },
    ],
    activeConditions: [],
    config: {},
  });
  const resolve = (s, type) => crisisResolve({ settlement: s, event: { id: 'e1', type: 'RESOLVE_STRESSOR', targetId: type, payload: { stressorType: type } } }).settlement;

  it('a temporary person who still serves another crisis stays, that crisis kept', () => {
    const next = resolve(town(), 'plague_onset');
    expect(next.npcs.find((n) => n.temporary)).toMatchObject({ crisisIds: ['mass_migration'] });
  });

  it('resolving the last crisis a temporary person serves removes them', () => {
    const next = resolve(resolve(town(), 'plague_onset'), 'mass_migration');
    expect(next.npcs.map((n) => n.name)).toEqual(['Mara Vell']);
  });
});
