/**
 * plotHooks.test.js — dossier plot-hook collection pins.
 *
 * Tension-sourced hooks used to stamp `role: tension.description.slice(0, 80)`
 * with no ellipsis, shipping mid-word fragments ('…resist investi') into the
 * dossier. The role now carries the full description.
 */
import { describe, expect, test } from 'vitest';

import { collectPlotHooks, groupPlotHooksBySourcePage, plotHookSourcePage } from '../../src/domain/dossier/plotHooks.js';
import { hookTruthFindings } from '../../src/domain/coherence/hookTruthFindings.js';

describe('collectPlotHooks canonical input shapes', () => {
  test('keeps normalized {text} hooks and drops alias-only objects', () => {
    const hooks = collectPlotHooks({
      npcs: [{
        id: 'npc.witness',
        name: 'The Witness',
        plotHooks: [
          { text: 'The normalized dossier hook survives.' },
          { description: 'This unrelated alias must not become a hook.' },
        ],
      }],
    });
    expect(hooks.map((hook) => hook.text)).toEqual([
      'The normalized dossier hook survives.',
    ]);
  });
});

describe('collectPlotHooks tension roles', () => {
  const description =
    'Merchant guilds resist investigation into the missing harbor ledgers while dock crews trade accusations.';

  function tensionHooks() {
    return collectPlotHooks({
      history: {
        currentTensions: [{
          type: 'guild_conflict',
          description,
          plotHooks: ['Someone is paying to keep the ledgers lost'],
        }],
      },
    }).filter(h => h.category === 'tension');
  }

  test('role carries the full tension description, not an 80-char fragment', () => {
    expect(description.length).toBeGreaterThan(80);
    const [hook] = tensionHooks();
    expect(hook).toBeTruthy();
    expect(hook.role).toBe(description);
  });

  test('role is never a mid-word fragment of the description', () => {
    const [hook] = tensionHooks();
    // A proper role is either the whole description or ends at a word
    // boundary — it must not stop partway through a word.
    expect(description.startsWith(hook.role)).toBe(true);
    const next = description[hook.role.length];
    expect(next === undefined || /\s/.test(next)).toBe(true);
  });
});

describe('collectPlotHooks — THE TRADITIONS register (T-5)', () => {
  const rec = (over) => ({
    id: 't.x', name: 'The Harvest Feast', coreMotif: { element: 'harvest', act: 'feast' },
    window: { startWeekOfYear: 30, weeks: 1 }, scaleBand: 3,
    lastOutcome: null, suppressedBy: null, adoptedFrom: null, mutationLog: [], ...over,
  });

  test('a failed festival raises a tradition-category hook naming the town', () => {
    const hooks = collectPlotHooks({ name: 'Ashford', traditions: [rec({ lastOutcome: 'failure' })] });
    const t = hooks.filter(h => h.source === 'Traditions');
    expect(t.length).toBe(1);
    expect(t[0].source).toBe('Traditions');
    expect(t[0].role).toBe('The Harvest Feast');
    expect(t[0].text).toContain('The Harvest Feast');
    expect(t[0].priority).toBe(8);
  });

  test('a suppressed rite outranks a bare outcome (one hook per record)', () => {
    const hooks = collectPlotHooks({
      name: 'Ashford',
      traditions: [rec({ suppressedBy: { overlordId: 'b' }, lastOutcome: 'failure' })],
    });
    const t = hooks.filter(h => h.source === 'Traditions');
    expect(t.length).toBe(1);
    // the suppressed-rite theme (not the failure theme) — precedence resolved to 'suppressed'
    expect(t[0].text.toLowerCase()).toMatch(/overlord|banned|forced under|behind closed doors|secret|resistance/);
    expect(t[0].priority).toBe(8);
  });

  test('a settlement with no traditions mirror adds no tradition hooks (byte-identical)', () => {
    expect(collectPlotHooks({ name: 'Ashford' }).filter(h => h.source === 'Traditions')).toEqual([]);
    expect(collectPlotHooks({ name: 'Ashford', traditions: [rec({ lastOutcome: 'good' })] })
      .filter(h => h.source === 'Traditions')).toEqual([]); // a quiet rite raises none
  });
});

describe('the source page of a hook (chair ruling X-2: Plot Hooks groups its cards by the page the fact lives on)', () => {
  test('each category maps to its page; traditions are told apart by their source label', () => {
    const page = (hook) => plotHookSourcePage(hook).id;
    expect(page({ category: 'npc' })).toBe('npcs');
    expect(page({ category: 'faction' })).toBe('relationships');
    expect(page({ category: 'relationship' })).toBe('relationships');
    expect(page({ category: 'tension' })).toBe('history');
    expect(page({ category: 'tension', source: 'Traditions' })).toBe('traditions');
    expect(page({ category: 'history' })).toBe('history');
    expect(page({ category: 'economics' })).toBe('viability');
    expect(page({ category: 'safety' })).toBe('defense');
    expect(page({ category: 'unknown-token' })).toBe('history');
  });

  test('groups follow page order, keep collector order inside, and omit empty pages', () => {
    const hooks = [
      { category: 'safety', text: 's1' }, { category: 'npc', text: 'n1' },
      { category: 'tension', text: 't1' }, { category: 'npc', text: 'n2' },
    ];
    const groups = groupPlotHooksBySourcePage(hooks);
    expect(groups.map((g) => g.page.label)).toEqual(['NPCs', 'History', 'Defense']);
    expect(groups[0].hooks.map((h) => h.text)).toEqual(['n1', 'n2']);
    expect(groupPlotHooksBySourcePage([])).toEqual([]);
  });
});

// THE CRISIS HOOKS, FIRST (the HOOKS-UNDER-STRESS lane, SOAK-1000 §3): a crisis entry's stored
// hooks are collected ahead of the place's own, and the record's truth check reads them.
describe('collectPlotHooks: a crisis\'s cast hooks come first', () => {
  const cast = { nature: 'natural', rank: 1, roles: [{ role: 'brunt', kind: 'npc', id: 'n1', name: 'Mara Vell', reason: 'the hunger falls first on its people', temporary: false }], absent: [], stakes: [], levers: [] };
  const npcs = [
    { id: 'n1', name: 'Mara Vell', role: 'Miller', power: 10, influence: 'high', plotHooks: ['Mara keeps a second ledger.'] },
    { id: 'n2', name: 'Oswin Hale', role: 'Mayor', power: 4, plotHooks: ['Oswin owes a debt he cannot name.'] },
  ];
  const crisisTown = () => ({
    name: 'Vellbrook', tier: 'town', npcs,
    stress: [{
      type: 'famine', label: 'Famine', cast,
      plotHooks: [{ text: 'In the famine, the brunt falls on Mara Vell: the hunger falls first on its people.', bound: 'cast', link: { kind: 'npc', id: 'n1', label: 'Mara Vell' } }],
    }],
  });

  test('a hand-built town with one crisis and a cast: the hook list leads with the hook naming the holder', () => {
    const hooks = collectPlotHooks(crisisTown());
    expect(hooks[0]).toMatchObject({
      text: 'In the famine, the brunt falls on Mara Vell: the hunger falls first on its people.',
      source: 'Famine', category: 'tension', priority: 10, crisis: 'famine',
      links: [{ kind: 'npc', id: 'n1', label: 'Mara Vell' }],
    });
    // the place's own hooks follow, in the order they always had, the count above them a floor
    expect(hooks.slice(1).map((h) => h.text)).toEqual(['Mara keeps a second ledger.', 'Oswin owes a debt he cannot name.']);
  });

  test('a single (non-list) crisis entry is read too, and a calm place\'s list is exactly its own hooks', () => {
    const single = { ...crisisTown(), stress: crisisTown().stress[0] };
    expect(collectPlotHooks(single)[0].crisis).toBe('famine');
    const calm = { ...crisisTown(), stress: null };
    expect(collectPlotHooks(calm).map((h) => h.text)).toEqual(['Mara keeps a second ledger.', 'Oswin owes a debt he cannot name.']);
    expect(collectPlotHooks(calm).some((h) => 'crisis' in h)).toBe(false);
  });

  test('the record\'s truth check reads a crisis hook (a false one is a finding; the page refuses it)', () => {
    const town = { ...crisisTown(), economicState: { foodSecurity: { label: 'Secure' } } };
    town.stress = [{ ...town.stress[0], plotHooks: ['The settlement is starving and its people turn to banditry.'] }];
    expect(hookTruthFindings(town).map((f) => f.code)).toEqual(['famine_words_on_a_fed_place']);
    expect(collectPlotHooks(town).some((h) => h.crisis)).toBe(false);
  });
});
