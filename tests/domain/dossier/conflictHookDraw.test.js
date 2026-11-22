/**
 * conflictHookDraw.test.js — ONE HOOK PER CONFLICT, CHOSEN (the chair's ruling 3).
 *
 * The defect, measured on this lane's 120-settlement corpus (twenty per tier, seeds
 * `hooks-lane-2026-11-03-<tier>-<i>`) before the cure: 97 of 120 settlements read "Evidence
 * has surfaced suggesting a third party is deliberately escalating the tension between the
 * two factions", naming nobody and nothing, and 169 hook instances read the one
 * "A neutral figure is being pressured by both X and Y…" template. Both are written for
 * every conflict in the estate with no draw at all
 * (`src/generators/power/conflicts.js :: buildConflictPlotHooks`).
 */
import { describe, expect, test } from 'vitest';

import { HOOK_LINE_POOLS, conflictIssueFamily, createConflictHookDraw } from '../../../src/domain/dossier/hookLines.js';
import { collectPlotHooks } from '../../../src/domain/dossier/plotHooks.js';

const THIRD_PARTY = 'Evidence has surfaced suggesting a third party is deliberately escalating the tension between the two factions.';

/** @param {Array<{ parties: string[], issue: string, extra?: string[] }>} conflicts */
function record(conflicts) {
  return {
    name: 'Testholm',
    tier: 'town',
    conflicts: conflicts.map((c) => ({
      parties: c.parties,
      issue: c.issue,
      intensity: 'moderate',
      plotHooks: [
        `A neutral figure is being pressured by both ${c.parties[0]} and ${c.parties[1]} to take a side before the next council session.`,
        THIRD_PARTY,
        ...(c.extra || []),
      ],
    })),
  };
}

describe('the conflict hooks are drawn, not fixed', () => {
  test('the anonymous escalation sentence is gone, and the conflict still has a hook', () => {
    const hooks = collectPlotHooks(record([
      { parties: ['Merchant Guilds', "Thieves' Guild"], issue: 'Control of the market licensing process' },
    ]));
    const faction = hooks.filter((h) => h.category === 'faction');
    expect(faction).toHaveLength(1);
    // anchored: the conflict's one hook exists by the assertion above, so this is a
    // measurement of WHICH sentence it is, not of an empty collection.
    expect(faction[0].text).not.toBe(THIRD_PARTY);
  });

  test('the drawn hook names both parties and the issue the record holds', () => {
    const hooks = collectPlotHooks(record([
      { parties: ['Merchant Guilds', 'Military/Guard'], issue: 'Control of the dock taxation authority' },
    ]));
    const text = hooks.find((h) => h.category === 'faction')?.text || '';
    expect(text).toContain('Merchant Guilds');
    expect(text).toContain('Military/Guard');
    expect(text.toLowerCase()).toContain('the dock taxation authority');
  });

  test("a conflict's flag-conditioned hook rides through untouched", () => {
    const SPECIFIC = 'Someone is offering to resolve the conflict "permanently" for a price. Both factions have received the offer. Neither has refused yet.';
    const hooks = collectPlotHooks(record([
      { parties: ['Guild Council', 'Military/Guard'], issue: 'Succession to a council seat', extra: [SPECIFIC] },
    ]));
    expect(hooks.map((h) => h.text)).toContain(SPECIFIC);
  });

  test('two conflicts of one issue family read differently on the same page', () => {
    const hooks = collectPlotHooks(record([
      { parties: ['Merchant Guilds', 'Craft Guilds'], issue: 'Control of the market licensing process' },
      { parties: ['Religious Authorities', 'Elder Council'], issue: 'Control of the registration process for new arrivals' },
    ]));
    const faction = hooks.filter((h) => h.category === 'faction');
    expect(faction).toHaveLength(2);
    expect(faction[0].text).not.toBe(faction[1].text);
  });

  test('two settlements with the same quarrel over different issues read differently', () => {
    const a = collectPlotHooks(record([{ parties: ['Merchant Guilds', 'Military/Guard'], issue: 'Control of the dock taxation authority' }]));
    const b = collectPlotHooks(record([{ parties: ['Merchant Guilds', 'Military/Guard'], issue: 'Military conscription of guild apprentices' }]));
    const textA = a.find((h) => h.category === 'faction')?.text;
    const textB = b.find((h) => h.category === 'faction')?.text;
    expect(textA).toBeTruthy();
    // anchored: `textA` is a real sentence by the assertion above.
    expect(textB).not.toBe(textA);
  });

  test('the same record draws the same sentence every time (no rng, no clock)', () => {
    const spec = [{ parties: ['Merchant Guilds', "Thieves' Guild"], issue: 'Control of a key trade route checkpoint' }];
    const first = collectPlotHooks(record(spec)).map((h) => h.text);
    const second = collectPlotHooks(record(spec)).map((h) => h.text);
    expect(second).toEqual(first);
  });

  test('every issue a conflict can carry lands in a family with a pool', () => {
    // The issue strings `src/generators/power/conflicts.js` can store, read off the writer.
    const issues = [
      'Control of the market licensing process',
      'Jurisdiction over a disputed arrest',
      'Church land claims on guild property',
      'Arcane research permit regulations',
      'Control of the dock taxation authority',
      'Military conscription of guild apprentices',
      "Access to the criminal network's intelligence",
      'Succession to a council seat',
      'A mercenary contract being disputed by both parties',
      'Control of a key trade route checkpoint',
      'Rights to a lucrative war supply contract',
      'Authority over military conscription lists',
      'Control of the requisition enforcement apparatus',
      'Legitimacy of the current governing authority',
      'Whether to open back-channel negotiations with the insurgency',
      'Control of the intelligence on insurgent cells',
      'Allocation of housing and resources between established residents and newcomers',
      'Control of the documentation and registration process for new arrivals',
      "Custody of the settlement's religious records and property",
      'Whether the governing authority should formally declare a religious allegiance',
      'Whether to suppress, contain, or negotiate with the revolt leadership',
      'Accountability for the conditions that produced the revolt',
      'Control of the escape routes and networks supporting the revolt',
      'Degree of collaboration with the occupying authority',
      'Control of the remaining grain stores',
    ];
    const draw = createConflictHookDraw();
    for (const issue of issues) {
      const family = conflictIssueFamily(issue);
      expect(HOOK_LINE_POOLS.conflict[family], `no pool for the family of "${issue}"`).toBeTruthy();
      const [line] = draw({ parties: ['Alpha Faction', 'Beta Faction'], issue });
      expect(line).toContain('Alpha Faction');
      expect(line).toContain('Beta Faction');
    }
  });

  test('a conflict with no issue and no parties still reads as a sentence', () => {
    const [line] = createConflictHookDraw()({});
    expect(line.length).toBeGreaterThan(20);
    expect(line).toMatch(/\.$/);
  });
});
