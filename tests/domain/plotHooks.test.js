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
    // RE-KEYED (PEOPLE-3 HOOKS, 2026-11-07): the `relationship` category, unemitted since X-2, is
    // deleted from the vocabulary; a stored hook still carrying the token falls to the default page.
    expect(page({ category: 'relationship' })).toBe('history');
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

// THE CRISIS HOOKS, FIRST (the HOOKS-UNDER-STRESS lane, SOAK-1000 §3): a crisis's cast adds hooks,
// read off the cast (never stored), collected ahead of the place's own; the record check reads them.
describe('collectPlotHooks: a crisis\'s cast hooks come first', () => {
  const cast = {
    nature: 'natural', rank: 1,
    roles: [{ role: 'brunt', kind: 'npc', id: 'n1', name: 'Mara Vell', reason: 'the hunger falls first on its people', temporary: false }],
    absent: [], stakes: [{ factionId: 'Town Council', stake: 'loses', reason: 'the crisis hits its base' }],
    levers: [{ institution: 'Town granary', holderId: 'n1', holderName: 'Mara Vell' }],
  };
  // RE-KEYED (PEOPLE-2 CAST-DERIVED, 3aa160a70): a person's house is read from its first-rank membership; the retired `factionAffiliation` became `memberships`.
  const npcs = [
    { id: 'n1', name: 'Mara Vell', role: 'Miller', power: 10, influence: 'high', memberships: [{ power: 'Millers', rank: 1 }], plotHooks: ['Mara keeps a second ledger.'] },
    { id: 'n2', name: 'Oswin Hale', role: 'Mayor', power: 4, memberships: [{ power: 'Town Council', rank: 1 }], plotHooks: ['Oswin owes a debt he cannot name.'] },
  ];
  const crisisTown = () => ({ name: 'Vellbrook', tier: 'town', npcs, stress: [{ type: 'famine', label: 'Famine', cast }] });
  const OWN = ['Mara keeps a second ledger.', 'Oswin owes a debt he cannot name.'];

  test('a hand-built town with one crisis and a cast: the hook list leads with the hook naming the holder', () => {
    const hooks = collectPlotHooks(crisisTown());
    expect(hooks[0]).toMatchObject({
      text: 'In the famine, Mara Vell of Millers takes the worst of it: the hunger falls first on its people.',
      source: 'Famine', category: 'tension', priority: 10, crisis: 'famine',
      links: [{ kind: 'npc', id: 'n1', label: 'Mara Vell' }],
    });
    expect(hooks[1]).toMatchObject({
      text: 'The famine turns on the Town granary, run by Mara Vell: if it gives way, Town Council loses most, because the crisis hits its base.',
      crisis: 'famine', links: [{ kind: 'faction', id: 'Town Council', label: 'Town Council' }],
    });
    // the place's own hooks follow, in the order they always had: the count above them is a floor
    expect(hooks.slice(2).map((h) => h.text)).toEqual(OWN);
  });

  test('a single (non-list) crisis entry is read too, and a calm place\'s list is exactly its own hooks', () => {
    const single = { ...crisisTown(), stress: crisisTown().stress[0] };
    expect(collectPlotHooks(single).map((h) => h.crisis)).toEqual(['famine', 'famine', undefined, undefined]);
    const calm = { ...crisisTown(), stress: null };
    expect(collectPlotHooks(calm).map((h) => h.text)).toEqual(OWN);
    expect(collectPlotHooks(calm).map((h) => 'crisis' in h)).toEqual([false, false]);
  });

  test('the DM\'s cast is the one named: an edited line role moves the hook to the DM\'s person', () => {
    const town = crisisTown();
    town.stress[0] = { ...town.stress[0], _userEdits: { castRoles: { value: 'brunt=npc:n2' } } };
    expect(collectPlotHooks(town)[0].text).toBe("In the famine, Oswin Hale of Town Council takes the worst of it: the DM's word.");
  });

  test('the record check reads the crisis hooks, and a cast sentence the record contradicts is never spoken on either', () => {
    const town = crisisTown();
    expect(hookTruthFindings(town)).toEqual([]);
    // a reason claiming soldiers where the defence roster holds no armed force
    const armed = {
      ...town,
      defenseProfile: { institutions: {} },
      stress: [{ type: 'famine', label: 'Famine', cast: { ...cast, levers: [], roles: [{ ...cast.roles[0], reason: 'its soldiers hold the granary' }] } }],
    };
    expect(hookTruthFindings(armed)).toEqual([]);
    expect(collectPlotHooks(armed).map((h) => h.text)).toEqual(OWN);
  });
});
