/**
 * tests/domain/crisis/crisisCreditorLine.test.js — THE CREDITOR NAMED ON THE DEBT CRISIS'S PAGE (FRAME-6 · P4A; B7 §P4a, the
 * brief docs/chair/2026-11-20/content/frame4/FRAME4-BRIEFS-U0-P1B-P4A.md "U2 = P4a"; the chair's rulings of 2026-11-20,
 * each vetoable by the owner: the new line is drawn FOR THE OWNER ONLY, behind the crisis page's audience argument; the
 * lender is never named; the criminal power is not made the creditor here, that is P4b's).
 *
 * On the owner's page an `indebted` section gains one derived line, outside the stored role vocabulary (no cast row, no
 * stored string): the creditor is the power the debt crisis raised as its creditor, read by the record's own marker (the
 * stored stake row whose power's `desc` opens with the crisis's `RAISED_BY_CRISIS` text, `creditorAgent`), never by its
 * display name; its face is the roster person holding rank 1 in it; an Outstanding Debt tie touching the face adds one
 * fixed clause in the tie's own direction (`from` owes `to`). Rate 1, no hash.
 *
 *   1. LIVENESS (red at the base): the owner's page gains the line, exactly, on six of B7's indebted towns (each tie
 *      direction, each pronoun case of the names rule, and no tie).
 *   2. EVERY OTHER READER (green at the base and after): today's page; the owner's page differs ONLY by the line.
 *   3. WHERE THE RECORD DOES NOT HOLD IT: no face, no marked creditor, the Crown Creditors' arm (the houses hold the debt:
 *      not an outside lender), every other kind, a calm town: the owner's page is today's, byte for byte.
 *   4. THE RULE: read by the marker, not the name; a debt tie not touching the face is not used; a DM-edited cast keeps the
 *      line (it reads the stakes and the roster, which the DM's edit does not touch); nothing is stored.
 */
import { describe, expect, test } from 'vitest';
import * as pageModule from '../../../src/domain/crisis/crisisPage.js';
import { CAST_EDIT_PATH } from '../../../src/domain/crisis/crisisCast.js';
import { TONIGHT_AUDIENCES } from '../../../src/domain/summary/tonightSheet.js';
import { STRESS_TYPE_MAP } from '../../../src/data/stressTypes.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const { composeCrisisPage } = pageModule;

const born = new Map();
/** One birth per seed, kept (births are slow). `b7-<kind>-<tier>-<i>` forced; `b7-natural-…` natural; `p4a-crown-…` forced indebted. */
const town = (seed) => {
  if (!born.has(seed)) {
    const crown = /^p4a-crown-([a-z]+)-\d+$/.exec(seed);
    const [, kind, tier] = crown ? [null, 'indebted', crown[1]] : /^b7-(.+)-([a-z]+)-\d+$/.exec(seed);
    born.set(seed, generateSettlementPipeline(kind === 'natural' ? { settType: tier } : { settType: tier, stressType: kind }, null, { seed, customContent: {} }));
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

/** The debt crisis's section of a page. */
const debtOf = (page) => page.find((x) => x.type === 'indebted') ?? null;
/** The page with the P4a line cut (what a stranger's page must equal). */
const cut = (page) => page.map((x) => { const { creditor, ...rest } = x; return rest; });
/** The debt entry of a record. */
const entryOf = (s) => [s.stress].flat().find((e) => e?.type === 'indebted');

/** B7's indebted towns, re-born at this tree: the owner's line, as measured (P4A-RESULTS.md, measure 3). */
const REACHED = [
  // the face is owed (the tie's `to`), a debtor of the other gender: the face's pronoun, as object
  ['b7-indebted-city-1', "The city owes an outside lender, never named; Deepa Mishra, the creditor's agent, speaks for them, and the innkeeper Aarav Deshpande owes her besides."],
  ['b7-indebted-thorp-3', "The thorp owes an outside lender, never named; Ísgerðr Haraldsson, the creditor's agent, speaks for them, and the head shepherd Ubbi Ragnarsson owes her besides."],
  // no Outstanding Debt tie touches the face
  ['b7-indebted-town-2', "The town owes an outside lender, never named; Naoise Kennedy, the creditor's agent, speaks for them."],
  // the face owes (the tie's `from`), to a person of the other gender: the face's pronoun, as subject
  ['b7-indebted-village-0', "The village owes an outside lender, never named; Hlíf Sigmundsson, the creditor's agent, speaks for them, and she owes the master of the hunt Palnatoke Ketilsson besides."],
  // the face owes, to a person of the same gender: the face's role, never a pronoun two people could take
  ['b7-indebted-thorp-1', "The thorp owes an outside lender, never named; Sigrid Bauer, the creditor's agent, speaks for them, and the creditor's agent owes the head shepherd Sophia Becker besides."],
  ['b7-indebted-town-3', "The town owes an outside lender, never named; Bakab May, the creditor's agent, speaks for them, and the creditor's agent owes the lord's appointee Snake Ku besides."],
];

describe('P4A: the creditor named on the debt crisis\'s page, for the owner', () => {
  test('the closed set: fixed sentences, frozen, naming no one but the record\'s face and the tie\'s other end', () => {
    const set = pageModule.CRISIS_CREDITOR_LINE;
    expect(Object.isFrozen(set)).toBe(true);
    expect(Object.isFrozen(set.line)).toBe(true);
    expect(Object.isFrozen(set.tie)).toBe(true);
    expect(set).toEqual({
      line: { creditorAgent: 'The town owes an outside lender, never named; {face}, {title}, speaks for them{tie}.' },
      tie: { owedToFace: ', and {other} owes {face} besides', faceOwes: ', and {face} owes {other} besides' },
    });
  });

  test(`the owner's page gains the line on B7's indebted towns (${REACHED.length}); nothing is stored`, () => {
    const failures = collectSeedFailures(REACHED, ([seed, line]) => {
      const s = town(seed);
      const before = JSON.stringify(s);
      expect(debtOf(composeCrisisPage(s, OWNER))?.creditor, `${seed}: the owner's line`).toBe(line);
      expect(JSON.stringify(s), `${seed}: composing stored nothing`).toBe(before);
    });
    expectNoSeedFailures(failures, 'the owner\'s page names the creditor\'s face');
  }, 120000);

  test('a reader who is not the owner gets today\'s page byte for byte; the owner\'s differs only by the line', () => {
    const failures = collectSeedFailures(REACHED.map(([seed]) => seed), (seed) => {
      const s = town(seed);
      const today = composeCrisisPage(s);
      expect(debtOf(today), `${seed}: today's page has the debt's section`).toBeTruthy();
      expect(Object.hasOwn(debtOf(today), 'creditor'), `${seed}: today's page has no line`).toBe(false);
      for (const [label, args] of STRANGERS) expect(composeCrisisPage(s, ...args), `${seed} ${label}: today's page`).toEqual(today);
      const own = composeCrisisPage(s, OWNER);
      expect(own.filter((x) => Object.hasOwn(x, 'creditor')).map((x) => x.type), `${seed}: the line is the debt's alone`).toEqual(['indebted']);
      expect(cut(own), `${seed}: the owner's page less the line is today's`).toEqual(today);
    });
    expectNoSeedFailures(failures, 'every stranger gets today\'s page');
  }, 120000);

  test('where no face stands, or no power carries the creditor\'s marker, the owner\'s page is today\'s', () => {
    const s = town('b7-indebted-town-2');
    const power = entryOf(s).cast.stakes.find((k) => /^Resident agent of the external creditor/.test(s.powerStructure.factions.find((f) => f.faction === k.factionId)?.desc || '')).factionId;
    // no face: the rank-1 membership is gone (the power stands, faceless)
    const faceless = structuredClone(s);
    for (const n of faceless.npcs) n.memberships = (n.memberships || []).filter((m) => !(m.power === power && m.rank === 1));
    expect(composeCrisisPage(faceless, OWNER), 'no face: today\'s page').toEqual(composeCrisisPage(faceless));
    // no marker: the same power, the same name and face, a description the crisis did not write
    const unmarked = structuredClone(s);
    unmarked.powerStructure.factions.find((f) => f.faction === power).desc = 'A house of the town.';
    expect(composeCrisisPage(unmarked, OWNER), 'no marker: today\'s page').toEqual(composeCrisisPage(unmarked));
  }, 120000);

  test('the creditor is read by the record\'s marker, not by its display name', () => {
    const s = town('b7-indebted-city-1');
    const line = debtOf(composeCrisisPage(s, OWNER)).creditor;
    const renamed = structuredClone(s);
    const OLD = "Creditor's Representative";
    const NEW = 'The Counting House';
    renamed.powerStructure.factions.find((f) => f.faction === OLD).faction = NEW;
    for (const k of entryOf(renamed).cast.stakes) if (k.factionId === OLD) k.factionId = NEW;
    for (const n of renamed.npcs) for (const m of n.memberships || []) if (m.power === OLD) m.power = NEW;
    expect(debtOf(composeCrisisPage(renamed, OWNER)).creditor, 'renamed: the same line').toBe(line);
    expect(line.includes(OLD), 'the power is not named in the line').toBe(false);
  }, 120000);

  test('the Crown Creditors\' arm (the houses hold the crown\'s debt, not an outside lender): the owner\'s page is today\'s', () => {
    const s = town('p4a-crown-metropolis-44');
    const crown = s.powerStructure.factions.find((f) => /^A coalition of noble houses that hold the crown's debt\./.test(f.desc || ''));
    expect(crown, 'the arm is on the record').toBeTruthy();
    expect(entryOf(s).cast.stakes.some((k) => k.factionId === crown.faction), 'its stake row is stored').toBe(true);
    expect(composeCrisisPage(s, OWNER), 'today\'s page').toEqual(composeCrisisPage(s));
  }, 120000);

  test('a debt tie that does not touch the face is not used; the clause follows the face\'s own tie alone', () => {
    const s = town('b7-indebted-city-1');
    const face = s.npcs.find((n) => n.name === 'Deepa Mishra');
    const fid = face.id || face.name;
    const untied = structuredClone(s);
    untied.relationships = untied.relationships.filter((t) => !(t.typeName === 'Outstanding Debt' && (t.from === fid || t.to === fid)));
    expect(untied.relationships.some((t) => t.typeName === 'Outstanding Debt'), 'other debt ties stand on the record').toBe(true);
    expect(debtOf(composeCrisisPage(untied, OWNER)).creditor).toBe("The city owes an outside lender, never named; Deepa Mishra, the creditor's agent, speaks for them.");
  }, 120000);

  test('a DM-edited cast keeps the line (it reads the stakes and the roster, not the cast\'s roles); strangers get today\'s page', () => {
    const s = town('b7-indebted-city-1');
    const someone = s.npcs.find((n) => !n.temporary && n.name !== 'Deepa Mishra');
    entryOf(s)._userEdits = { [CAST_EDIT_PATH]: { value: `treater=npc:${someone.id || someone.name}` } };
    const own = debtOf(composeCrisisPage(s, OWNER));
    expect(own.edited).toBe(true);
    expect(own.creditor).toBe(REACHED[0][1]);
    expect(cut(composeCrisisPage(s, OWNER))).toEqual(composeCrisisPage(s));
    for (const [label, args] of STRANGERS) expect(composeCrisisPage(s, ...args), `${label}: today's page`).toEqual(composeCrisisPage(s));
  }, 120000);

  test('every other kind, and a calm town: the owner\'s page is today\'s', () => {
    const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    const seeds = Object.keys(STRESS_TYPE_MAP).filter((k) => k !== 'indebted').map((kind, i) => {
      const gate = STRESS_TYPE_MAP[kind].requiresTier;
      const tiers = TIERS.filter((t) => !gate || TIERS.indexOf(t) >= TIERS.indexOf(gate));
      return `b7-${kind}-${tiers[(i + 2) % tiers.length]}-1`;
    });
    // the owner's page of another kind may carry P1B's owner-only clause on an absence row (pinned in crisisOutsideHand.test.js):
    // it is cut from both sides here, so this arm holds P4a's line alone
    const lessP1b = (page) => page.map((x) => ({ ...x, absent: x.absent.map((a) => ({ ...a, reason: a.reason.split('; ')[0] })) }));
    const failures = collectSeedFailures([...seeds, 'b7-natural-thorp-0', 'b7-natural-city-1'], (seed) => {
      const s = town(seed);
      const own = composeCrisisPage(s, OWNER);
      expect(own.some((x) => Object.hasOwn(x, 'creditor')), `${seed}: no line`).toBe(false);
      expect(lessP1b(own), `${seed}: today's page`).toEqual(lessP1b(composeCrisisPage(s)));
    });
    expectNoSeedFailures(failures, 'no other kind and no calm town gains a line');
  }, 300000);
});
