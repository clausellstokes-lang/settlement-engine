/**
 * npcAgencyNewsLines.test.js — STYLE-2-PULSE-FOLLOWUP (2026-11-09): the lines npcAgency's
 * own writers put on the Herald's news card, driven through the shipped composer
 * (`evaluateNpcRules`), never a copy of a template.
 *
 * The rows are the PULSE audit's (STYLE-AUDIT-2-PULSE-2026-11-09, ledger A2 and ledger B):
 *   A2·171 — the ideal reason. A card corrupted at generation carries its ideal as the token
 *            `corrupted_<ideal>`, and the reason printed the prefix AND its own "corrupted"
 *            word: "Rare corrupted corrupted mercy ideal modifies behavior." (2 of the 4,177
 *            cards at bd07005b9). The prefix is the card's state, not a word for the page.
 *   A2·169–171 — the three reasons under every NPC move (168 cards each at bd07005b9) printed
 *            the engine's tokens and its gate: "civic role favors reform.", "Pressure sat well
 *            clear of the gate, and the ambition behind it is steady.", "Rare corrupted … ideal
 *            modifies behavior." They now say, in plain words, what kind of person makes the
 *            move, what pushed them, and what they hold to (ruling C2).
 */
import { describe, expect, it } from 'vitest';

import { evaluateNpcRules, pressureIndex } from '../../src/domain/worldPulse/index.js';
import { NPC_DRIVE_REASON, NPC_GOAL_NEWS, NPC_ROLE_MEANS, NPC_ROLE_NOUN, NPC_ROLE_REASON, npcCandidateReasons } from '../../src/domain/worldPulse/eventProse.js';
import { NPC_ROLE_ARCHETYPES } from '../../src/domain/worldPulse/npcAgency.js';

/** One NPC under heavy legitimacy pressure, so its preferred reform/expose move fires. */
function actorSnapshot(overrides = {}) {
  const state = {
    npcId: 'a:clerk', settlementId: 'a', name: 'Ilse Brandt', roleArchetype: 'civic',
    factionId: 'council', factionSeat: 'agent_protege', dotRank: 1,
    shortGoal: 'win_public_legitimacy', longGoal: 'secure_office',
    ideal: 'mercy', flaw: 'pride', ambition: 0.8, loyalty: 0.5, momentum: 0, corruption: false,
    goalProgress: { short: 0, long: 0 }, rivalryTargets: [],
    contextSignature: 'village|local|', contextTier: 'village',
    ...overrides,
  };
  return {
    worldState: { tick: 4, npcStates: { [state.npcId]: state }, relationshipStates: {} },
    regionalGraph: { edges: [] },
    settlements: [{ id: 'a', name: 'Aschberg', settlement: { name: 'Aschberg', tier: 'village', npcs: [] }, activeConditions: [] }],
  };
}
const PRESSURE = pressureIndex([{ settlementId: 'a', kind: 'legitimacy', score: 0.9 }]);

function actionOf(overrides) {
  const out = evaluateNpcRules(actorSnapshot(overrides), PRESSURE, { tick: 5 });
  const action = out.find((c) => /^npc_/.test(c.candidateType)
    && !['npc_goal_culmination', 'npc_goal_rebranch'].includes(c.candidateType));
  expect(action, 'the planted NPC acts').toBeTruthy();
  return action;
}

describe('A2·171 — the ideal prints once, without the state token', () => {
  it('a card corrupted at generation (ideal `corrupted_mercy`) names the ideal once', () => {
    const action = actionOf({ ideal: 'corrupted_mercy', corruption: true });
    const all = action.reasons.join(' ');
    expect(all, 'the ideal is in the reasons').toContain('mercy');
    // anchored: the toContain above proves the joined reasons live and holding the ideal.
    expect(all, 'no doubled word').not.toMatch(/corrupted corrupted/i);
    // anchored: the same live string as the line above.
    expect(all, 'no state token').not.toMatch(/corrupted_/);
  });

  it('an exposed card whose ideal still carries the token prints the plain ideal', () => {
    const action = actionOf({ ideal: 'corrupted_order', corruption: false });
    const all = action.reasons.join(' ');
    expect(all, 'the ideal is in the reasons').toContain('order');
    // anchored: the toContain above proves the joined reasons live and holding the ideal.
    expect(all, 'the token never prints').not.toMatch(/corrupted/i);
  });
});

describe("A2·169–171 — the move's reasons in plain words", () => {
  const MACHINERY = /role favors|the gate|Pressure sat|ambition behind it|modifies behavior|_/;
  const BANDS = [[0.9, 0.9], [0.9, 0.5], [0.5, 0.9], [0.5, 0.5]];

  it('the shipped composer says who makes the move, what pushed them, and what they hold to', () => {
    const action = actionOf({});
    expect(action.reasons).toHaveLength(3);
    const tellings = NPC_ROLE_REASON.map((v) => v({ name: 'Ilse Brandt', role: 'a citizen' }));
    expect(tellings, 'the role reason is one of its tellings, naming a citizen').toContain(action.reasons[0]);
    const drives = NPC_DRIVE_REASON.map((v) => v({ name: 'Ilse Brandt', hard: true, hungry: true }));
    expect(drives, 'the drive reason is a hard-times, hungry telling').toContain(action.reasons[1]);
    expect(action.reasons[2]).toBe('Ideal: mercy.');
  });

  it('a corrupted card says its ideal once, in words', () => {
    const action = actionOf({ ideal: 'corrupted_mercy', corruption: true });
    expect(action.reasons[2]).toBe('Ilse Brandt believes in mercy, but in a twisted form.');
  });

  it('every role the engine infers has a plain noun, and no telling carries a token or the gate', () => {
    expect(Object.keys(NPC_ROLE_NOUN).sort()).toEqual(Object.keys(NPC_ROLE_ARCHETYPES).sort());
    for (const role of Object.values(NPC_ROLE_NOUN)) {
      for (const v of NPC_ROLE_REASON) {
        const line = v({ name: 'Ilse Brandt', role });
        expect(line, role).toMatch(new RegExp(role, 'i'));
        // anchored: the toMatch above proves the line live before the negative reads it.
        expect(line, line).not.toMatch(MACHINERY);
      }
    }
    for (const v of NPC_DRIVE_REASON) {
      for (const [p, a] of BANDS) {
        const line = v({ name: 'Ilse Brandt', hard: p > 0.66, hungry: a > 0.7 });
        expect(line).toContain('Ilse Brandt');
        // anchored: the toContain above proves the line live.
        expect(line, line).not.toMatch(MACHINERY);
      }
    }
  });

  it("one NPC's one move keeps exactly FOUR drive spellings over the gate's live range (the metronome needs them fixed)", () => {
    const spellings = new Set();
    for (let i = 0; i <= 20; i += 1) {
      for (let j = 0; j <= 20; j += 1) {
        const pressure = 0.34 + 0.66 * (i / 20);
        const ambition = 0.42 + 0.58 * (j / 20);
        spellings.add(npcCandidateReasons({ npcId: 'a:clerk', name: 'Ilse Brandt', ambition, ideal: 'order' }, pressure, 'reform')[1]);
      }
    }
    expect(spellings.size).toBe(4);
    // and the four tellings of the four bands are sixteen distinct sentences
    const all = new Set(NPC_DRIVE_REASON.flatMap((v) => BANDS.map(([p, a]) => v({ name: 'N', hard: p > 0.66, hungry: a > 0.7 }))));
    expect(all.size).toBe(16);
  });
});

/** A long ambition at its threshold, so the culmination beat fires. */
function culminationOf(overrides = {}) {
  const out = evaluateNpcRules(actorSnapshot({ goalProgress: { short: 0, long: 0.9 }, ...overrides }), PRESSURE, { tick: 5 });
  const c = out.find((x) => x.candidateType === 'npc_goal_culmination');
  expect(c, 'the culmination fires').toBeTruthy();
  return c;
}

describe('B·2–4 — a long ambition achieved, said in words', () => {
  const MACHINERY = /goal progress|threshold|Role: |; goal:|the \w+ role|path gave|"|_/;

  it('the aim is the worded goal, never the quoted token, on every telling of every cell', () => {
    for (let tick = 0; tick < 24; tick += 1) {
      const c = evaluateNpcRules(actorSnapshot({ goalProgress: { short: 0, long: 0.9 } }), PRESSURE, { tick })
        .find((x) => x.candidateType === 'npc_goal_culmination');
      expect(c.summary).toContain('secure an office');
      for (const line of [c.summary, ...c.reasons]) {
        expect(line).toContain('Ilse Brandt');
        // anchored: the toContain above proves the line live.
        expect(line, line).not.toMatch(MACHINERY);
      }
    }
  });

  it('the role is said as the means the NPC worked through, for every role', () => {
    expect(Object.keys(NPC_ROLE_MEANS).sort()).toEqual(Object.keys(NPC_ROLE_ARCHETYPES).sort());
    const c = culminationOf({ roleArchetype: 'merchant' });
    expect(c.reasons[1]).toContain(NPC_ROLE_MEANS.merchant);
  });

  it('the four tellings of each cell stay four (a pool size move shifts every pick)', () => {
    for (const cell of ['headline', 'summary', 'progressReason', 'roleReason']) {
      expect(NPC_GOAL_NEWS.culmination[cell], cell).toHaveLength(4);
    }
  });
});

/** The NPC's context has changed (a famine arrived), so the goal rebranch fires. */
function rebranchOf(overrides = {}, tick = 5) {
  const snap = actorSnapshot({ contextSignature: 'village|local|', ...overrides });
  snap.settlements[0].activeConditions = [{ archetype: 'famine', label: 'Famine pressure' }];
  const r = evaluateNpcRules(snap, PRESSURE, { tick }).find((x) => x.candidateType === 'npc_goal_rebranch');
  expect(r, 'the rebranch fires').toBeTruthy();
  return r;
}

describe('B·8–10 — a change of ambition, said in words', () => {
  const MACHINERY = /context|circumstances|footing|ideal|flaw|Personality|anchored|_/i;

  it('the summary names the aim given up and the aim taken up, in words, on every telling', () => {
    for (let tick = 0; tick < 24; tick += 1) {
      const r = rebranchOf({}, tick);
      const turned = r.npcPatch.longGoal !== 'secure_office' ? 'longGoal' : 'shortGoal';
      const oldAim = turned === 'longGoal' ? 'secure an office' : "win the public's trust";
      expect(r.summary, r.summary).toContain(oldAim);
      expect(r.summary).toContain('Ilse Brandt');
      for (const line of [r.summary, ...r.reasons]) {
        expect(line).toContain('Ilse Brandt');
        // anchored: the toContain above proves the line live.
        expect(line, line).not.toMatch(MACHINERY);
      }
    }
  });

  it('the traits are said once, without the corrupted_ token', () => {
    const r = rebranchOf({ ideal: 'corrupted_justice', flaw: 'corrupted_greed', corruption: true });
    expect(r.reasons[1]).toMatch(/justice/);
    expect(r.reasons[1]).toMatch(/greed/);
    // anchored: the two toMatch above prove the line live and holding both traits.
    expect(r.reasons[1]).not.toMatch(/corrupted/);
  });
});
