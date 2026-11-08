/**
 * plotHookParties.test.js — THE THREE CLASSES AND THE PARTIES (the people car, PEOPLE-3 HOOKS,
 * step 2; docs/chair/2026-11-07/BRIEF-PEOPLE-3-HOOKS-2026-11-07.md; the owner: "It should be both
 * tensions, people, and history and it doesn't mean that hooks are between specific individual
 * people it could be between powers, groups, or historical").
 *
 * The claims: every collected hook carries a class (person / tension / history) and its parties;
 * the economics and safety hooks are tensions of the place (R-P6); the conflict line is between
 * the TWO POWERS; a history hook is between the event; THE GATE'S PARTY ARM refuses a hook naming
 * a person not on the roster or a power that does not exist (the planted refusals), and keeps the
 * same hook when the party is real (the liveness anchor); two people's identical person hooks are
 * two hooks (a party is a fact), while two identical tension hooks still fold.
 */
import { describe, expect, it } from 'vitest';
import { PLOT_HOOK_CLASSES, collectPlotHooks, plotHookClassOf } from '../../../src/domain/dossier/plotHooks.js';
import { hookPartyRosterOf, hookPartyViolations } from '../../../src/domain/coherence/hookTruth.js';

const POWERS = { factions: [{ faction: 'Merchant Guilds' }, { faction: 'Military/Guard' }] };
const base = (over = {}) => ({
  name: 'Ashford',
  tier: 'village',
  institutions: [],
  powerStructure: POWERS,
  npcs: [
    { id: 'npc_mill', name: 'Ada', category: 'other', memberships: [{ power: 'Merchant Guilds', rank: 1 }], plotHooks: ['A stranger passed through, asked specific questions, and left before they could follow up.'] },
    { id: 'npc_watch', name: 'Bo', category: 'military', memberships: [{ power: 'Military/Guard', rank: 1 }], plotHooks: ['A recruit they turned away has since joined a different outfit.'] },
  ],
  ...over,
});

describe('the three classes', () => {
  it('the vocabulary is closed at three; a stored hook without a class reads by its category', () => {
    expect(PLOT_HOOK_CLASSES).toEqual(['person', 'tension', 'history']);
    expect(plotHookClassOf({ category: 'npc' })).toBe('person');
    for (const c of ['faction', 'tension', 'economics', 'safety']) expect(plotHookClassOf({ category: c })).toBe('tension');
    expect(plotHookClassOf({ category: 'history' })).toBe('history');
    expect(plotHookClassOf({ category: 'relationship' })).toBe('tension');
  });

  it('every source lands in its class with its parties', () => {
    const s = base({
      conflicts: [{ parties: ['Merchant Guilds', 'Military/Guard'], issue: 'Tolls', intensity: 'moderate', plotHooks: ['The dispute is complicated by the fact that key members of both factions share business interests that neither wants exposed during arbitration.'] }],
      history: {
        currentTensions: [{ type: 'guild_conflict', description: 'd', factions: ['Merchant Guilds', 'Upstart guilds'], plotHooks: ['The upstarts have hired a lawyer from the capital.'] }],
        historicalEvents: [{ type: 'disaster', name: 'The Great Flood', yearsAgo: 40, plotHooks: ['The flood marks are still on the mill wall.'] }],
      },
      economicViability: { plotHooks: [{ hook: 'The grain merchants are hoarding against a bad winter.', severity: 'high' }] },
      economicState: { safetyProfile: { plotHooks: ['A pickpocket ring works the market on fair days.'] } },
    });
    const hooks = collectPlotHooks(s);
    const byText = (t) => hooks.find((h) => h.text.startsWith(t));
    expect(byText('A stranger passed through')).toMatchObject({ class: 'person', parties: [{ kind: 'person', id: 'npc_mill' }] });
    expect(byText('A stranger passed through').links).toEqual([{ kind: 'npc', label: 'Ada', id: 'npc_mill' }]);
    expect(byText('The dispute is complicated')).toMatchObject({ class: 'tension', parties: [{ kind: 'power', name: 'Merchant Guilds' }, { kind: 'power', name: 'Military/Guard' }] });
    expect(byText('The upstarts')).toMatchObject({ class: 'tension', parties: [{ kind: 'power', name: 'Merchant Guilds' }, { kind: 'group', name: 'Upstart guilds' }] });
    expect(byText('The flood marks')).toMatchObject({ class: 'history', parties: [{ kind: 'history', eventId: 'The Great Flood' }] });
    expect(byText('The grain merchants')).toMatchObject({ class: 'tension', category: 'economics', parties: [{ kind: 'place' }] });
    expect(byText('A pickpocket ring')).toMatchObject({ class: 'tension', category: 'safety', parties: [{ kind: 'place' }] });
    expect(hooks.every((h) => PLOT_HOOK_CLASSES.includes(h.class) && Array.isArray(h.parties))).toBe(true);
  });
});

describe('THE GATE\'S PARTY ARM (a party is a fact)', () => {
  it('the arm itself: a stranger and a power that does not exist are refused; real parties pass', () => {
    const roster = hookPartyRosterOf(base());
    expect(hookPartyViolations([{ kind: 'person', id: 'npc_mill' }, { kind: 'power', name: 'Military/Guard' }], roster)).toEqual([]);
    expect(hookPartyViolations([{ kind: 'person', id: 'npc_ghost' }], roster).map((f) => f.code)).toEqual(['party_not_on_the_roster']);
    expect(hookPartyViolations([{ kind: 'power', name: 'The Old Grouping' }], roster).map((f) => f.code)).toEqual(['power_that_does_not_exist']);
    expect(hookPartyViolations([{ kind: 'group', name: 'Upstart guilds' }, { kind: 'place' }, { kind: 'history', eventId: null }], roster)).toEqual([]);
    // an UNKNOWN roster refuses nothing (the defence half's `defenseKnown` rule)
    const unknown = hookPartyRosterOf({ npcs: [], powerStructure: null });
    expect(unknown).toEqual({ rosterPersonIds: null, rosterPowerNames: null });
    expect(hookPartyViolations([{ kind: 'person', id: 'npc_ghost' }, { kind: 'power', name: 'The Old Grouping' }], unknown)).toEqual([]);
  });

  it('PLANTED: a conflict between a power and a grouping no power row carries is refused at the page; the real conflict stands', () => {
    const line = 'One faction has been using official authority to harass the other\'s members. The harassment is technically legal.';
    const planted = base({ conflicts: [{ parties: ['Merchant Guilds', 'The Old Grouping'], issue: 'Tolls', intensity: 'high', plotHooks: [line] }] });
    expect(collectPlotHooks(planted).some((h) => h.text === line)).toBe(false);
    // liveness anchor: the same hook between two real powers is kept
    const real = base({ conflicts: [{ parties: ['Merchant Guilds', 'Military/Guard'], issue: 'Tolls', intensity: 'high', plotHooks: [line] }] });
    expect(collectPlotHooks(real).some((h) => h.text === line)).toBe(true);
  });

  it('PLANTED: a crisis hook bound to a power that does not exist is refused; the cast hook of a real person stands', () => {
    const stress = (loser) => ({
      type: 'famine',
      label: 'Famine',
      cast: {
        roles: [{ role: 'blamed', kind: 'npc', id: 'npc_mill', name: 'Ada', reason: 'the mill tithe rose in the dry year' }],
        levers: [{ institution: 'Granary', holderId: 'npc_mill', holderName: 'Ada' }],
        stakes: [{ factionId: loser, stake: 'loses', reason: 'its tolls carry the grain' }],
      },
    });
    const real = collectPlotHooks(base({ stress: stress('Merchant Guilds') })).filter((h) => h.crisis);
    const planted = collectPlotHooks(base({ stress: stress('The Old Grouping') })).filter((h) => h.crisis);
    // liveness: the real lever hook is there, between its holder and the power that loses
    const lever = real.find((h) => h.parties.some((p) => p.kind === 'power' && p.name === 'Merchant Guilds' && h.text.includes('loses')));
    expect(lever).toBeTruthy();
    expect(planted.some((h) => h.text.includes('The Old Grouping'))).toBe(false);
  });
});

describe('the dedupe: a person hook is that person\'s', () => {
  it('two representatives on the same authored line are two hooks; two identical place hooks fold to one', () => {
    const line = 'Something they were told was destroyed is apparently not destroyed.';
    const s = base({
      npcs: base().npcs.map((n) => ({ ...n, plotHooks: [line] })),
      economicState: { safetyProfile: { plotHooks: ['A pickpocket ring works the market on fair days.', 'A pickpocket ring works the market on fair days.'] } },
    });
    const hooks = collectPlotHooks(s);
    expect(hooks.filter((h) => h.class === 'person').map((h) => h.parties[0].id).sort()).toEqual(['npc_mill', 'npc_watch']);
    expect(hooks.filter((h) => h.text.startsWith('A pickpocket ring'))).toHaveLength(1);
  });
});
