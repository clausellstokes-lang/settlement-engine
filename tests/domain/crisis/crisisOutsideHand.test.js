/**
 * tests/domain/crisis/crisisOutsideHand.test.js — THE INFILTRATION'S OUTSIDE HAND, REACHED (FRAME-5 · P1B; B7 §P1b, the
 * brief docs/chair/2026-11-20/content/frame4/FRAME4-BRIEFS-U0-P1B-P4A.md "U1 = P1b"; the chair's rulings of 2026-11-20,
 * each vetoable by the owner: the new words are drawn FOR THE OWNER ONLY, behind the crisis page's audience argument; the
 * hand itself is never named; the infiltrator power's face is not used).
 *
 * Where an infiltrated town's instigator is absent with the stored reason "an outside hand, unnamed", the absence and its
 * stored reason STAY; on the owner's page the line that shows that absence adds who reaches the hand: the keeper of a
 * house where strangers lodge, by the standing trouble's own outsider rule (troubleCast.js: the live roster, nobody an
 * active crisis's cast holds, strongest first, `LODGING_HOUSE`, the house in the record's own wording). Rate 1, no hash.
 *
 *   1. LIVENESS (red at the base): the owner's page gains the words, exactly, on the towns B7 drafted.
 *   2. EVERY OTHER READER (green at the base and after): no options, `{}`, null, each non-owner audience, an unknown
 *      value: today's page, and the owner's page differs from it ONLY by the clause.
 *   3. WHERE NO KEEPER STANDS, OR NO SUCH ABSENCE: the owner's page is today's, byte for byte (B7's thorp; a calm town;
 *      one town of every other kind).
 *   4. THE RULE: a keeper an active crisis's cast holds is passed over for the next; the hand and the infiltrator's face
 *      are never named; a DM-edited cast shows no absence row, so the words follow it.
 */
import { describe, expect, test } from 'vitest';
import { composeCrisisPage, CRISIS_ABSENCE_REACH } from '../../../src/domain/crisis/crisisPage.js';
import { CAST_ABSENCES, CAST_EDIT_PATH } from '../../../src/domain/crisis/crisisCast.js';
import { TONIGHT_AUDIENCES } from '../../../src/domain/summary/tonightSheet.js';
import { STRESS_TYPE_MAP } from '../../../src/data/stressTypes.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const forced = (seed, tier, kind) => generateSettlementPipeline({ settType: tier, stressType: kind }, null, { seed, customContent: {} });
const born = new Map();
/** One birth per seed, kept (births are slow). @param {string} seed */
const town = (seed) => {
  if (!born.has(seed)) {
    const [, kind, tier] = /^b7-(.+)-([a-z]+)-\d+$/.exec(seed);
    born.set(seed, kind === 'natural' ? generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} }) : forced(seed, tier, kind));
  }
  return structuredClone(born.get(seed));
};

const OWNER = { audience: TONIGHT_AUDIENCES.owner };
/** Every reader who is not the owner. */
const STRANGERS = [
  ['no options', []], ['undefined', [undefined]], ['null', [null]], ['{}', [{}]], ['{ audience: undefined }', [{ audience: undefined }]],
  ["{ audience: 'player' }", [{ audience: TONIGHT_AUDIENCES.player }]], ["{ audience: 'gallery' }", [{ audience: TONIGHT_AUDIENCES.gallery }]],
  ["{ audience: 'Owner' }", [{ audience: 'Owner' }]], ["'owner' (not an options object)", ['owner']],
];

/** The instigator's absence row of the infiltration's section. */
const handRow = (page) => page.find((x) => x.type === 'infiltrated')?.absent.find((a) => a.role === 'instigator') ?? null;
/** The page with the P1b clause cut from every absence row (what a stranger's page must equal). */
const cut = (page) => page.map((x) => ({ ...x, absent: x.absent.map((a) => ({ ...a, reason: a.reason.split('; ')[0] })) }));

/** B7's drafted towns, re-born at this tree: the owner's line, as measured (P1B-RESULTS.md, measure 3). */
const REACHED = [
  ['b7-infiltrated-hamlet-1', 'an outside hand, unnamed; Chae Yang keeps the alehouse where its people come and go'],
  ['b7-infiltrated-town-0', 'an outside hand, unnamed; Peppo Schubert keeps the taverns where its people come and go'],
  ['b7-infiltrated-town-1', 'an outside hand, unnamed; Pitao Ucan keeps the inn where its people come and go'],
];
/** Infiltrated towns with the hand absent and NO free lodging keeper. */
const UNREACHED = ['b7-infiltrated-thorp-0'];

describe('P1B: the infiltration\'s outside hand, reached on the owner\'s page', () => {
  test('the closed set: one fixed sentence, frozen, naming no one but the record\'s keeper and house', () => {
    expect(Object.isFrozen(CRISIS_ABSENCE_REACH)).toBe(true);
    expect(CRISIS_ABSENCE_REACH).toEqual({ outsideHand: '{keeper} keeps the {house} where its people come and go' });
  });

  test(`the owner's page gains the words on B7's drafted towns (${REACHED.length}); the stored absence stays`, () => {
    const failures = collectSeedFailures(REACHED, ([seed, line]) => {
      const s = town(seed);
      const stored = [s.stress].flat().find((e) => e?.type === 'infiltrated').cast.absent.find((a) => a.role === 'instigator');
      expect(stored.reason, `${seed}: the stored reason is the hand's`).toBe(CAST_ABSENCES.outsideHand);
      expect(handRow(composeCrisisPage(s, OWNER))?.reason, `${seed}: the owner's line`).toBe(line);
      expect(stored.reason, `${seed}: composing stored nothing`).toBe(CAST_ABSENCES.outsideHand);
    });
    expectNoSeedFailures(failures, 'the owner\'s page reaches the hand through the lodging keeper');
  }, 120000);

  test('a reader who is not the owner gets today\'s page byte for byte; the owner\'s differs only by the clause', () => {
    const failures = collectSeedFailures([...REACHED.map(([seed]) => seed), ...UNREACHED], (seed) => {
      const s = town(seed);
      const today = composeCrisisPage(s);
      expect(handRow(today)?.reason, `${seed}: today's line is the stored reason alone`).toBe(CAST_ABSENCES.outsideHand);
      for (const [label, args] of STRANGERS) expect(composeCrisisPage(s, ...args), `${seed} ${label}: today's page`).toEqual(today);
      const own = composeCrisisPage(s, OWNER);
      expect(cut(own), `${seed}: the owner's page less the clause is today's`).toEqual(today);
    });
    expectNoSeedFailures(failures, 'every stranger gets today\'s page');
  }, 120000);

  test('where no lodging keeper stands, the owner\'s page is today\'s, byte for byte', () => {
    const failures = collectSeedFailures(UNREACHED, (seed) => {
      const s = town(seed);
      expect(handRow(composeCrisisPage(s, OWNER))?.reason, `${seed}: the hand's absence is shown`).toBe(CAST_ABSENCES.outsideHand);
      expect(composeCrisisPage(s, OWNER), `${seed}: today's page`).toEqual(composeCrisisPage(s));
    });
    expectNoSeedFailures(failures, 'no keeper, no words');
  }, 120000);

  test('every other kind, and a calm town: the owner\'s page is today\'s', () => {
    const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    const seeds = Object.keys(STRESS_TYPE_MAP).filter((k) => k !== 'infiltrated').map((kind, i) => {
      const gate = STRESS_TYPE_MAP[kind].requiresTier;
      const tiers = TIERS.filter((t) => !gate || TIERS.indexOf(t) >= TIERS.indexOf(gate));
      return `b7-${kind}-${tiers[(i + 4) % tiers.length]}-0`;
    });
    const failures = collectSeedFailures([...seeds, 'b7-natural-thorp-0', 'b7-natural-town-0'], (seed) => {
      const s = town(seed);
      expect(composeCrisisPage(s, OWNER), `${seed}: today's page`).toEqual(composeCrisisPage(s));
    });
    expectNoSeedFailures(failures, 'no other kind and no calm town gains a word');
  }, 300000);

  test('the keeper is FREE: one an active crisis\'s cast holds is passed over for the next strongest, or for none', () => {
    const s = town('b7-infiltrated-town-0');
    const first = handRow(composeCrisisPage(s, OWNER)).reason;
    const keeper = s.npcs.find((n) => first.includes(`; ${n.name} keeps the`));
    expect(keeper, 'the keeper is on the roster').toBeTruthy();
    // the keeper now holds a role in the cast (a collaborator), as a person of the record would
    const entry = [s.stress].flat().find((e) => e?.type === 'infiltrated');
    entry.cast.roles.push({ role: 'collaborator', kind: 'npc', id: keeper.id || keeper.name, name: keeper.name, reason: 'its power could go either way', temporary: false });
    const next = handRow(composeCrisisPage(s, OWNER)).reason;
    expect(next.includes(keeper.name), 'a held keeper is not named for the hand').toBe(false);
    expect(next.startsWith(CAST_ABSENCES.outsideHand), 'the stored reason stays first').toBe(true);
  }, 120000);

  test('the hand itself is never named, nor the infiltrator power\'s face (the bloc\'s speaker)', () => {
    const failures = collectSeedFailures(REACHED, ([seed]) => {
      const s = town(seed);
      const bloc = s.powerStructure.factions.find((f) => /^An external interest/.test(f.desc || ''));
      expect(bloc, `${seed}: the infiltrator power is on the record`).toBeTruthy();
      const blocName = bloc.faction || bloc.name;
      const faces = s.npcs.filter((n) => (n.memberships || []).some((m) => m.power === blocName));
      const line = handRow(composeCrisisPage(s, OWNER)).reason;
      expect(line.includes(blocName), `${seed}: the power is not named`).toBe(false);
      for (const n of faces) expect(line.includes(n.name), `${seed}: ${n.name} of the bloc is not named`).toBe(false);
    });
    expectNoSeedFailures(failures, 'the hand stays unnamed');
  }, 120000);

  test('a DM-edited cast shows no absence row, and so no words, for any reader', () => {
    const s = town('b7-infiltrated-town-0');
    const entry = [s.stress].flat().find((e) => e?.type === 'infiltrated');
    const someone = s.npcs.find((n) => !n.temporary);
    entry._userEdits = { [CAST_EDIT_PATH]: { value: `instigator=npc:${someone.id || someone.name}` } };
    const own = composeCrisisPage(s, OWNER).find((x) => x.type === 'infiltrated');
    expect(own.edited).toBe(true);
    expect(own.absent).toEqual([]);
    expect(composeCrisisPage(s, OWNER)).toEqual(composeCrisisPage(s));
  }, 120000);
});
