/**
 * tests/domain/crisisHooks.test.js — the hooks a crisis adds, bound to its cast
 * (src/domain/crisis/crisisHooks.js; the HOOKS-UNDER-STRESS lane, SOAK-1000 §3): one hook naming a
 * line role's holder with the role's reason, one naming the lever and the faction that loses, both
 * spoken only where the record does not contradict them; and the catalog crisis hook's `{holder}`
 * slot, filled by name only where the sentence names a role the cast holds.
 */
import { describe, it, expect } from 'vitest';
import {
  CRISIS_HOOK_SLOTS, CRISIS_NOUN, crisisHooksOf, lineRoleHolderOf, slotCrisisHook,
} from '../../src/domain/crisis/crisisHooks.js';
import { CAST_REASONS, CRISIS_NATURE, STAKE_REASONS } from '../../src/domain/crisis/crisisCast.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { hookTruthViolations, settlementHookFacts } from '../../src/domain/coherence/hookTruth.js';

const npcRow = (role, id, name, reason) => ({ role, kind: 'npc', id, name, reason, temporary: false });
const cast = (roles, levers = [], stakes = []) => ({
  nature: 'natural', rank: 1, roles, absent: [], stakes, levers,
  ifNothingIsDone: { residualEffects: [] }, playersSeeFirst: [], links: [],
});
const town = (extra = {}) => ({
  tier: 'town',
  npcs: [
    { id: 'n1', name: 'Mara Vell', role: 'Miller', memberships: [{ power: 'Millers’ Guild', rank: 1 }] },
    { id: 'n2', name: 'Oswin Hale', role: 'Mayor', memberships: [{ power: 'Town Council', rank: 1 }] },
  ],
  ...extra,
});

describe('crisisHooksOf: one hook bound to the cast, one bound to the lever', () => {
  it('the cast hook names the line role\'s holder, with their house and the role\'s reason as its fact', () => {
    const entry = { type: 'famine', cast: cast([npcRow('brunt', 'n1', 'Mara Vell', CAST_REASONS.bruntBase.food_security)]) };
    const [hook] = crisisHooksOf(town(), entry);
    expect(hook).toEqual({
      text: 'In the famine, Mara Vell of Millers’ Guild takes the worst of it: the hunger falls first on its people.',
      bound: 'cast',
      link: { kind: 'npc', id: 'n1', label: 'Mara Vell' },
    });
  });

  it('a person in two powers is named of their FIRST-RANK power (PEOPLE-2 CAST-DERIVED: the card\'s best standing)', () => {
    const entry = { type: 'famine', cast: cast([npcRow('brunt', 'n1', 'Mara Vell', CAST_REASONS.bruntBase.food_security)]) };
    const s = town();
    s.npcs[0] = { ...s.npcs[0], memberships: [{ power: 'Town Council', rank: 3 }, { power: 'Millers’ Guild', rank: 1 }] };
    expect(crisisHooksOf(s, entry)[0].text).toBe('In the famine, Mara Vell of Millers’ Guild takes the worst of it: the hunger falls first on its people.');
    s.npcs[0] = { ...s.npcs[0], memberships: [] };
    expect(crisisHooksOf(s, entry)[0].text).toBe('In the famine, Mara Vell takes the worst of it: the hunger falls first on its people.');
  });

  it('the lever hook names the house the players can push, its holder, and the faction that loses with the reason', () => {
    const entry = {
      type: 'famine',
      cast: cast([], [{ institution: 'Town granary', holderId: 'n1', holderName: 'Mara Vell' }],
        [{ factionId: 'Merchants', stake: 'gains', reason: STAKE_REASONS.gainsHolds }, { factionId: 'Town Council', stake: 'loses', reason: STAKE_REASONS.loses }]),
    };
    expect(crisisHooksOf(town(), entry)).toEqual([{
      text: 'The famine turns on the town granary, run by Mara Vell: if it gives way, Town Council loses most, because the crisis hits its base.',
      bound: 'lever',
      link: { kind: 'faction', id: 'Town Council', label: 'Town Council' },
    }]);
  });

  it('a person holding a line role is preferred over a house holding an earlier one; the required roles\' order decides among people', () => {
    const c = cast([
      { role: 'brunt', kind: 'faction', id: 'Farmers', name: 'Farmers', reason: 'r', temporary: false },
      npcRow('lever', 'n1', 'Mara Vell', CAST_REASONS.leverRuns),
      npcRow('exploiter', 'n2', 'Oswin Hale', CAST_REASONS.exploiterPower),
    ]);
    expect(lineRoleHolderOf('famine', c)).toMatchObject({ role: 'lever', name: 'Mara Vell' });
    // an occasional role is never the line role
    expect(lineRoleHolderOf('famine', cast([npcRow('exploiter', 'n2', 'Oswin Hale', 'r')]))).toBeNull();
  });

  it('a crisis with no cast, no holder and no lever adds nothing', () => {
    expect(crisisHooksOf(town(), { type: 'famine' })).toEqual([]);
    expect(crisisHooksOf(town(), { type: 'famine', cast: cast([]) })).toEqual([]);
  });

  it('on a place the record calls fed, a famine hook says "the crisis", never the word the classifier refuses', () => {
    const fed = town({ economicState: { foodSecurity: { label: 'Secure' } } });
    const entry = { type: 'famine', cast: cast([npcRow('lever', 'n1', 'Mara Vell', CAST_REASONS.leverRuns)]) };
    const [hook] = crisisHooksOf(fed, entry);
    expect(hook.text).toBe('In the crisis, Mara Vell of Millers’ Guild holds the key to it: runs the office that decides how the crisis goes.');
    expect(hookTruthViolations(hook.text, settlementHookFacts(fed))).toEqual([]);
  });

  it('the tier noun is spoken through the estate\'s one rewrite ("the town" in a hamlet becomes "the hamlet")', () => {
    const hamlet = town({ tier: 'hamlet' });
    const entry = { type: 'under_siege', cast: cast([{ role: 'defender', kind: 'institution', id: 'Watch house', name: 'Watch house', reason: CAST_REASONS.defenderInstitution, temporary: false }]) };
    const [hook] = crisisHooksOf(hamlet, entry);
    expect(hook.text).toBe("In the siege, the Watch house leads the defence: the hamlet's defence, with no one on the roster leading it.");
    expect(hookTruthViolations(hook.text, settlementHookFacts(hamlet))).toEqual([]);
  });

  it('every kind of the catalog has a noun and a nature', () => {
    expect(Object.keys(CRISIS_NOUN).sort()).toEqual(Object.keys(STRESS_TYPE_MAP).sort());
    expect(Object.keys(CRISIS_NATURE).sort()).toEqual(Object.keys(STRESS_TYPE_MAP).sort());
  });
});

describe('slotCrisisHook: the catalog sentence gains a {holder} slot only where it names a role the cast holds', () => {
  it('every slot\'s phrase occurs exactly once in its catalog sentence (a slot in the sentence, never a second sentence)', () => {
    for (const [kind, slots] of Object.entries(CRISIS_HOOK_SLOTS)) {
      const text = STRESS_TYPE_MAP[kind].crisisHook;
      for (const slot of slots) expect(text.split(slot.phrase).length - 1, `${kind}: ${slot.phrase}`).toBe(1);
    }
  });

  it('the plague\'s healer is named when the cast holds the lever in a person', () => {
    const c = cast([npcRow('lever', 'h1', 'Hesk Marrow', CAST_REASONS.leverRuns)]);
    expect(slotCrisisHook('plague_onset', STRESS_TYPE_MAP.plague_onset.crisisHook, c)).toBe(
      'Hesk Marrow, the healer who identified the outbreak first, has gone quiet. Their last message suggested the disease is not natural. Accessing them means navigating a quarantine that is not being enforced consistently.',
    );
  });

  it('the siege names both the one who would treat and the defender, and one person never fills both slots', () => {
    const base = STRESS_TYPE_MAP.under_siege.crisisHook;
    const two = cast([npcRow('defender', 'd', 'Karl Hoffmann', 'r'), npcRow('treater', 't', 'Andreas Hoffmann', 'r')]);
    expect(slotCrisisHook('under_siege', base, two)).toBe(
      'The settlement is surrounded. Andreas Hoffmann is considering terms. Karl Hoffmann is considering a desperate sortie. The players arrive as this decision is being forced.',
    );
    const one = cast([npcRow('defender', 'd', 'Karl Hoffmann', 'r'), npcRow('treater', 'd', 'Karl Hoffmann', 'r')]);
    expect(slotCrisisHook('under_siege', base, one)).toBe(
      'The settlement is surrounded. Karl Hoffmann is considering terms. Someone else is considering a desperate sortie. The players arrive as this decision is being forced.',
    );
  });

  it('a crisis with no holder for the slot keeps its sentence as written: a house, an institution, the wrong reason, no cast', () => {
    const famine = STRESS_TYPE_MAP.famine.crisisHook;
    const house = cast([{ role: 'lever', kind: 'institution', id: 'Fish market', name: 'Fish market', reason: CAST_REASONS.leverInstitution, temporary: false }]);
    expect(slotCrisisHook('famine', famine, house)).toBe(famine);
    expect(slotCrisisHook('famine', famine, null)).toBe(famine);
    // the governing-faction sentences take no slot (a faction name stored in prose is the rename
    // cascade's question, held for the chair): the seat and the governing house leave them as written
    const insurgency = STRESS_TYPE_MAP.insurgency.crisisHook;
    const seat = cast([npcRow('target', 'n2', 'Oswin Hale', CAST_REASONS.targetSeat)]);
    expect(slotCrisisHook('insurgency', insurgency, seat)).toBe(insurgency);
    const governing = cast([{ role: 'target', kind: 'faction', id: 'Town Council', name: 'Town Council', reason: CAST_REASONS.targetGoverning, temporary: false }]);
    expect(slotCrisisHook('insurgency', insurgency, governing)).toBe(insurgency);
    expect(Object.keys(CRISIS_HOOK_SLOTS).sort()).toEqual(['famine', 'occupied', 'plague_onset', 'under_siege']);
  });

  it('a kind with no slot, and a sentence that does not carry the phrase, are returned unchanged', () => {
    const c = cast([npcRow('lever', 'n1', 'Mara Vell', 'r')]);
    expect(slotCrisisHook('mass_migration', STRESS_TYPE_MAP.mass_migration.crisisHook, c)).toBe(STRESS_TYPE_MAP.mass_migration.crisisHook);
    expect(slotCrisisHook('famine', 'The DM’s own words.', c)).toBe('The DM’s own words.');
  });
});

// SW-6 CRISIS-SURFACES (W4 row 262; STYLE-RULINGS-2 B3): the garbled casting lines — "Occupation Authority
// speaks for the occupier here: leads the occupying power" (soak1k-2), "leads the defence: leads the military"
// (soak1k-5). The clause says the role; a reason that only echoes it is not printed after it.
describe('crisisHooksOf: a cast hook never echoes its own clause', () => {
  const occupier = { role: 'face', kind: 'faction', id: 'Occupation Authority', name: 'Occupation Authority', reason: CAST_REASONS.face, temporary: false };
  it('the occupier\'s house as its own face reads as one plain sentence', () => {
    const [hook] = crisisHooksOf(town(), { type: 'occupied', cast: { ...cast([occupier]), nature: 'external' } });
    expect(hook.text).toBe('In the occupation, the occupier\'s orders come through Occupation Authority.');
  });
  it('a defender who leads the military is not told twice that they lead it', () => {
    const [hook] = crisisHooksOf(town(), { type: 'wartime', cast: { ...cast([npcRow('defender', 'n2', 'Oswin Hale', CAST_REASONS.defenderMilitary)]), nature: 'external' } });
    expect(hook.text).toBe('In the war, Oswin Hale of Town Council leads the defence.');
  });
});

// SW-6 CRISIS-SURFACES (W4 rows 266, 267; STYLE-RULINGS-2 B3): "The raids turns on the Professional city watch …
// decides how the raids goes" (soak1k-4); "The war turns on the Blacksmiths (3-10)" (soak1k-5); "the Inns and
// taverns (district)" (soak1k-0). The verb agrees with the noun, and the house reads as prose.
describe('crisisHooksOf: the lever hook in plain grammar', () => {
  const lever = (institution, holderName = null) => ({ institution, holderId: holderName ? 'n2' : null, holderName });
  it('a plural crisis noun takes a plural verb, and the catalogue\'s capital does not print mid-sentence', () => {
    const hooks = crisisHooksOf(town(), { type: 'monster_pressure', cast: cast([], [lever('Professional city watch', 'Oswin Hale')]) });
    expect(hooks.map((h) => h.text)).toEqual(['The raids turn on the professional city watch, run by Oswin Hale: whoever wins it over decides how the raids go.']);
  });
  it('the roster\'s count and district tags never print in the sentence', () => {
    const loser = { factionId: 'Town Council', stake: 'loses', reason: STAKE_REASONS.loses };
    const war = crisisHooksOf(town(), { type: 'wartime', cast: { ...cast([], [lever('Blacksmiths (3-10)', 'Oswin Hale')], [loser]), nature: 'external' } });
    expect(war.map((h) => h.text).join(' ')).not.toMatch(/\(|\)/);
    expect(war[0].text).toMatch(/^The war turns on the blacksmiths, run by Oswin Hale: /);
    const inns = crisisHooksOf(town(), { type: 'mass_migration', cast: cast([], [lever('Inns and taverns (district)')]) });
    expect(inns[0].text).toBe('The migration turns on the inns and taverns: whoever wins it over decides how the migration goes.');
  });
});

// SW-6 CRISIS-SURFACES (STYLE-RULINGS-2 B3): "Nawal al-Aziz of Guild Council takes the worst of it: it takes the
// blame, and its good name pays for the crisis" (soak1k-3) — "it" for a person. The reason speaks of the house.
describe('crisisHooksOf: a person is never "it"', () => {
  it('the legitimacy brunt\'s reason names the house that takes the blame, for a person or the house alike', () => {
    const [hook] = crisisHooksOf(town(), { type: 'famine', cast: cast([npcRow('brunt', 'n2', 'Oswin Hale', CAST_REASONS.bruntBase.public_legitimacy)]) });
    expect(hook.text).toBe('In the famine, Oswin Hale of Town Council takes the worst of it: the blame falls on the house, and its good name pays for the crisis.');
    expect(hook.text).not.toMatch(/: it takes/);
  });
});
