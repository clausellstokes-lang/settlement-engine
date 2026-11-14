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
import { MIGRATION_HOOK_BY_DIRECTION } from '../../src/generators/stressNarrative.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { hookTruthViolations, settlementHookFacts } from '../../src/domain/coherence/hookTruth.js';
import { crisisHookFor, crisisHooksOf, houseInProse } from '../../src/domain/crisis/crisisHooks.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';
import { CAST_EDIT_PATH, formatCastRoles } from '../../src/domain/crisis/crisisCast.js';
import { composeCrisisPage } from '../../src/domain/crisis/crisisPage.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';

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

// THE HOOKS UNDER STRESS (the HOOKS-UNDER-STRESS lane, SOAK-1000 §3): every generated crisis's cast
// adds a cast-bound and a lever-bound hook, read first by the collector off the stored cast, and the
// catalog crisis hook gains its holder's name where the sentence names a role a person holds.
describe('a generated crisis adds the hooks its cast derives', () => {
  it('a famine town\'s hook list leads with the hook naming its cast holder, then the lever and the faction that loses', () => {
    const s = gen('cast-step-famine', 'town', ['famine']);
    const [entry] = entriesOf(s);
    const holder = entry.cast.roles.find((r) => r.role === 'brunt' || r.role === 'lever');
    const hooks = collectPlotHooks(s);
    expect(hooks[0].crisis).toBe('famine');
    expect(hooks[0].text).toContain(holder.name);
    expect(hooks[0].text).toContain(holder.reason);
    expect(hooks[1].crisis).toBe('famine');
    expect(hooks[1].text).toContain(houseInProse(entry.cast.levers[0].institution)); // SW-6 (4b1827494): re-keyed by identity — the house prints as prose
    expect('plotHooks' in entry).toBe(false); // read off the cast, never stored
  });

  it('120 generated towns: crisis hooks lead; each is true on the record; the place\'s own hooks stay beneath them, in their order', () => {
    const SEEDS = Array.from({ length: 120 }, (_, i) => `tonight-cast-${i}`);
    let crises = 0;
    let bound = 0;
    const failures = collectSeedFailures(SEEDS, (seed, i) => {
      const s = i % 2 === 0
        ? generateSettlementPipeline({ settType: TIERS[i % TIERS.length] }, null, { seed, customContent: {} })
        : gen(seed, TIERS[i % TIERS.length], [KINDS[i % KINDS.length], KINDS[(i * 5 + 2) % KINDS.length]].filter((k, j, a) => a.indexOf(k) === j));
      const entries = entriesOf(s);
      const facts = settlementHookFacts(s);
      for (const e of entries) {
        crises += 1;
        const added = crisisHooksOf(s, e);
        if (added.some((h) => h.bound === 'cast')) bound += 1;
        for (const h of added) {
          const found = hookTruthViolations(h.text, facts);
          if (found.length) throw new Error(`${e.type}: "${h.text}" — ${found.map((f) => f.code).join(', ')}`);
        }
      }
      const hooks = collectPlotHooks(s);
      const lead = hooks.findIndex((h) => !h.crisis);
      if (hooks.slice(lead < 0 ? hooks.length : lead).some((h) => h.crisis)) throw new Error('a crisis hook below a place hook');
      // the floor: the same record with the crisis hooks taken off collects exactly the place's own hooks
      const bare = { ...s, stress: entries.length ? entries.map(({ cast: _drop, ...rest }) => rest) : s.stress };
      const own = hooks.filter((h) => !h.crisis).map((h) => h.text);
      if (JSON.stringify(collectPlotHooks(bare).map((h) => h.text)) !== JSON.stringify(own)) throw new Error('the place\'s own hooks moved');
    });
    expectNoSeedFailures(failures, 'the crisis hooks over 120 towns');
    // measured at the lane's tip: 128 of 137 crises carry a cast-bound hook; the rest are casts with
    // no line role held (wartime with no defender, an infiltration's outside hand)
    expect(bound / crises).toBeGreaterThan(0.9);
  }, 240000);

  it('the crisis hook is stored as the catalog\'s sentence (its template) and filled with the holder where it is read', () => {
    const s = gen('slot-plague_onset-0', 'town', ['plague_onset']);
    const plague = entriesOf(s)[0];
    const lever = plague.cast.roles.find((r) => r.role === 'lever');
    expect(lever.kind).toBe('npc');
    expect(plague.crisisHook).toBe(STRESS_TYPE_MAP.plague_onset.crisisHook);
    expect(crisisHookFor(s, plague)).toBe(STRESS_TYPE_MAP.plague_onset.crisisHook
      .replace('The healer who identified the outbreak first', `${lever.name}, the healer who identified the outbreak first,`));
    const m = gen('slot-migration-0', 'town', ['mass_migration']);
    // W4 PEOPLE second seat 2026-11-07 (#8, WAVE-RULINGS item 8): a migration entry stores the hook its
    // own direction names (stressNarrative.js :: MIGRATION_HOOK_BY_DIRECTION, arrivals at birth), not the
    // catalogue's type-level sentence; the pin re-keys to that template, and it carries no holder slot.
    expect(crisisHookFor(m, entriesOf(m)[0])).toBe(MIGRATION_HOOK_BY_DIRECTION.arrivals);
    expect(entriesOf(m)[0].crisisHook).not.toBe(STRESS_TYPE_MAP.mass_migration.crisisHook);
  });

  it('a DM\'s cast edit renames the holder in the printed crisis hook: the Crisis page (tab, print chapter, journal) and the print view model', () => {
    const s = gen('slot-plague_onset-0', 'town', ['plague_onset']);
    const entry = entriesOf(s)[0];
    const engine = entry.cast.roles.find((r) => r.role === 'lever');
    const other = s.npcs.find((n) => !n.temporary && n.name && n.name !== engine.name);
    applyUserEdit(entry, CAST_EDIT_PATH, formatCastRoles([{ role: 'lever', kind: 'npc', id: other.id || other.name }]), { editedAt: '2026-11-04T00:00:00Z' });
    const named = `${other.name}, the healer who identified the outbreak first,`;
    expect(composeCrisisPage(s)[0].hook).toContain(named);
    const vm = JSON.stringify(buildViewModel({ settlement: s }));
    expect(vm).toContain(named);
    expect(vm.includes(`${engine.name}, the healer who identified`)).toBe(false); // anchored: the edited name is asserted present on the line above
  });

  it('a calm place stores no crisis hook and collects none', () => {
    const s = generateSettlementPipeline({ settType: 'village', selectedStressesRandom: false, selectedStresses: [] }, null, { seed: 'cast-step-calm', customContent: {} });
    expect(s.stress).toBeNull();
    expect(collectPlotHooks(s).some((h) => 'crisis' in h)).toBe(false); // anchored: s.stress is pinned null on the line above
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
