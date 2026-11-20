/**
 * FRAME-7 · SR1 (the brief `docs/chair/2026-11-20/content/frame7/SR1-BUILD.md`; the design `frame7/SR1-PROPOSAL.md` as the
 * chair approved it at 20:04 UTC, each point vetoable by the owner): THE STAKES' REASON, said by what the record holds.
 *
 * A NEW birth's `loses` row says why THIS power loses by its matched system, and a `split` row draws one of three wordings,
 * each from `data/crisis/stakeReasonLines.js :: STAKE_REASON_LINES` by a keyed hash over the record's own identity (the
 * seed, the crisis kind, the power's name), filled by the stake's own power (`fillAgreement`). The two readers that ask
 * what a row IS compare a KEY (`stakeReasonKey`), never a sentence: `crisisCast.js :: bruntCandidates` (the losers) and
 * `crisisPage.js :: stakeShown` (the untouched). A saved town keeps its stored sentence.
 *
 * THIS FILE REDS WHEN a pre-SR1 literal moves or the cast stops re-exporting the one set; when a text a row can hold has
 * no key (or a key of the wrong stake); when a wording fails its agreement, says "the town", or repeats the cast's brunt
 * line for its system; when a born town's loses or split row is not the wording its keyed hash draws (the pins below), or
 * a re-derivation draws another; when a reader of a split or an untouched row reads the sentence; or when the page
 * rewrites a saved reason.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { CAST_REASONS, STAKE_REASONS, bruntCandidates, deriveStakes } from '../../../src/domain/crisis/crisisCast.js';
import { composeCrisisPage } from '../../../src/domain/crisis/crisisPage.js';
import { fillAgreement } from '../../../src/domain/display/powerSentenceName.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

/** The data file, read so that each title reds on its own on a tree without it (red first). @type {any} */
const L = await import('../../../src/data/crisis/stakeReasonLines.js').catch(() => ({}));

const SYSTEMS = ['public_legitimacy', 'defense_readiness', 'trade_connectivity', 'social_trust', 'tax_revenue', 'law_order',
  'healing_capacity', 'food_security', 'labor_capacity', 'housing_pressure', 'faction_stability'];
/** @param {string} form @param {string} power */
const said = (form, power) => fillAgreement(form, { power });
/** Every wording of the two pools, with its key. @returns {Array<[string, string]>} */
const wordings = () => [
  ...Object.values(L.STAKE_REASON_LINES?.loses || {}).flat().map((f) => /** @type {[string, string]} */ (['loses', f])),
  ...(L.LOSES_FALLBACK || []).map((f) => /** @type {[string, string]} */ (['loses', f])),
  ...(L.STAKE_REASON_LINES?.split || []).map((f) => /** @type {[string, string]} */ (['split', f])),
];
/** @param {any} s */
const stakesOf = (s) => (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean).flatMap((/** @type {any} */ e) => e.cast?.stakes || []);

describe('SR1: the data file is the stake reasons\' one home', () => {
  it('every pre-SR1 literal stands byte for byte, and crisisCast.js re-exports that one set', () => {
    expect(L.STAKE_REASONS).toBe(STAKE_REASONS);
    expect(STAKE_REASONS.loses).toBe('its own people feel the crisis first');
    expect(STAKE_REASONS.split).toBe('gains and loses by it at once');
    expect(STAKE_REASONS.untouched).toBe('it could side with either camp');
    expect(Object.keys(STAKE_REASONS)).toHaveLength(34);
  });

  it('the loses pools are keyed by the systems a loss can match; each wording agrees with its power in both numbers', () => {
    expect(Object.keys(L.STAKE_REASON_LINES?.loses || {}).sort()).toEqual([...SYSTEMS].sort());
    expect(L.STAKE_REASON_LINES.split).toHaveLength(3);
    expect(wordings()).toHaveLength(25); // 21 by system, the fallback, 3 split
    for (const [, form] of wordings()) {
      for (const power of ['Elder Council', 'Merchant Guilds']) {
        const text = said(form, power);
        expect(text.split(' ').length, form).toBeGreaterThan(4);
        // anchored: the filled sentence is asserted present (five words or more) on the line above
        expect(text, form).not.toMatch(/[{}|]/);
        // anchored: the filled sentence is asserted present (five words or more) two lines above
        expect(text, form).not.toMatch(/\bthe town\b/);
      }
      // anchored: the plural form's own possessive is asserted present first, then the singular's absent
      if (form.includes('{power|its|their}')) { expect(said(form, 'Merchant Guilds')).toMatch(/\btheir\b/); expect(said(form, 'Merchant Guilds')).not.toMatch(/\bits\b/); }
    }
    expect(said(L.STAKE_REASON_LINES.loses.public_legitimacy[0], 'Merchant Guilds')).toBe('they govern, and the crisis is laid at their door');
    expect(said(L.STAKE_REASON_LINES.loses.public_legitimacy[0], 'Elder Council')).toBe('it governs, and the crisis is laid at its door');
    expect(said(L.LOSES_FALLBACK[0], 'Elder Council')).toBe(STAKE_REASONS.loses);
    expect(said(L.STAKE_REASON_LINES.split[0], 'Merchant Guilds')).toBe(STAKE_REASONS.split);
  });

  it('no loses wording repeats the cast\'s brunt line for its system', () => {
    for (const [sys, forms] of Object.entries(L.STAKE_REASON_LINES?.loses || {})) {
      const brunt = /** @type {Record<string, string>} */ (CAST_REASONS.bruntBase)[sys];
      for (const f of /** @type {string[]} */ (forms)) for (const power of ['Elder Council', 'Merchant Guilds']) expect(said(f, power), sys).not.toBe(brunt);
    }
    expect(Object.keys(L.STAKE_REASON_LINES?.loses || {}).length).toBeGreaterThan(0);
  });
});

describe('SR1: stakeReasonKey, the closed reverse map', () => {
  it('every text a row can hold maps to its key: each wording in both numbers, and every pre-SR1 literal', () => {
    expect(typeof L.stakeReasonKey).toBe('function');
    for (const [key, form] of wordings()) {
      for (const power of ['Elder Council', 'Merchant Guilds']) expect(L.stakeReasonKey(said(form, power)), form).toBe(key);
    }
    for (const [key, text] of Object.entries(STAKE_REASONS)) expect(L.stakeReasonKey(text), text).toBe(key);
    expect(L.stakeReasonKey('their own people feel the crisis first')).toBe('loses'); // C2B (b)'s plural, a saved town's
  });

  it('any other text, or no text, has no key', () => {
    expect(typeof L.stakeReasonKey).toBe('function');
    for (const v of ['', 'the DM\'s own words', 'they could side with either camp', null, undefined, 3]) expect(L.stakeReasonKey(v)).toBe(null);
  });
});

/** Born towns of B7's crisis pool (gen.mjs's birth), the rows measured at SR1's tip (SR1-RESULTS.md). */
const SIEGE = 'b7-under_siege-town-1';
const PLAGUE = 'b7-plague_onset-town-1';
/** @type {Record<string, any>} */
const born = {};
beforeAll(() => {
  born[SIEGE] = generateSettlementPipeline({ settType: 'town', stressType: 'under_siege' }, null, { seed: SIEGE, customContent: {} });
  born[PLAGUE] = generateSettlementPipeline({ settType: 'town', stressType: 'plague_onset' }, null, { seed: PLAGUE, customContent: {} });
}, 120_000);

describe('SR1: a new birth says why this power loses, by its matched system, at birth', () => {
  it(`${SIEGE}: each loser says its own system's wording in its own number; a split power draws from the split pool`, () => {
    const byPower = Object.fromEntries(stakesOf(born[SIEGE]).map((/** @type {any} */ k) => [k.factionId, k]));
    expectAbsentWithAnchor([byPower['Town Council']?.reason], STAKE_REASONS.loses, 'people look to it first for an answer', `${SIEGE} Town Council`);
    expectAbsentWithAnchor([byPower['Merchant Guilds']?.reason], 'their own people feel the crisis first', 'their trade is the first thing the crisis cuts', `${SIEGE} Merchant Guilds`);
    expect(byPower['Craft Guilds']).toEqual({ factionId: 'Craft Guilds', stake: 'loses', reason: 'they live by trade, and trade is what suffers' });
    expectAbsentWithAnchor([byPower['War Council']?.reason], STAKE_REASONS.split, 'has as much to gain from it as to lose', `${SIEGE} War Council`);
    expect(byPower['War Council']?.stake).toBe('split');
  });

  it('the pick is the keyed hash: the same record re-derives the same reasons; another seed may say another', () => {
    const s = born[SIEGE];
    const stored = stakesOf(s);
    expect(deriveStakes(s, 'under_siege', SIEGE)).toEqual(stored);
    const elsewhere = deriveStakes(s, 'under_siege', 'another-seed');
    expect(elsewhere.map((k) => [k.factionId, k.stake])).toEqual(stored.map((/** @type {any} */ k) => [k.factionId, k.stake]));
    for (const k of elsewhere) expect(L.stakeReasonKey(k.reason), k.reason).toBe(L.stakeReasonKey(stored.find((/** @type {any} */ x) => x.factionId === k.factionId).reason));
  });

  it('each draw is noted in the presumption ledger under its pool, by a keyed hash (drawKind H)', () => {
    const notes = /** @type {any[]} */ (withPresumptionLedger(() => deriveStakes(born[SIEGE], 'under_siege', SIEGE)).ledger);
    const ledger = notes.filter((e) => String(e.pool).startsWith('STAKE_REASON_LINES.'));
    expect(ledger.map((e) => [e.pool, e.drawKind]).sort()).toEqual([
      ['STAKE_REASON_LINES.loses.public_legitimacy', 'H'], ['STAKE_REASON_LINES.loses.trade_connectivity', 'H'],
      ['STAKE_REASON_LINES.loses.trade_connectivity', 'H'], ['STAKE_REASON_LINES.split', 'H'], ['STAKE_REASON_LINES.split', 'H'],
    ].sort());
  });
});

describe('SR1: the readers compare a key, never a sentence', () => {
  it(`${PLAGUE}: the brunt's losers hold a split power whatever split wording it says, the same as under the old literal`, () => {
    const s = born[PLAGUE];
    const stakes = stakesOf(s);
    const religious = stakes.find((/** @type {any} */ k) => k.factionId === 'Religious Authorities');
    expectAbsentWithAnchor([religious?.reason], STAKE_REASONS.split, 'stand to win by it and to lose by it alike', `${PLAGUE} Religious Authorities`);
    const asOld = stakes.map((/** @type {any} */ k) => (k.stake === 'split' && L.stakeReasonKey(k.reason) === 'split' ? { ...k, reason: STAKE_REASONS.split } : k));
    const now = bruntCandidates(s, 'plague_onset', stakes).candidates;
    expect(now).toEqual(bruntCandidates(s, 'plague_onset', asOld).candidates);
    expect(now.some((r) => r.kind === 'faction' && r.id === 'Religious Authorities')).toBe(true);
  });

  it('the page routes a stored untouched row by its key, and prints a split row of any wording as split', () => {
    const town = { tier: 'town', name: 'Testholm', powerStructure: { factions: [], conflicts: [] },
      stress: [{ type: 'famine', label: 'Famine', cast: { nature: 'natural', roles: [], absent: [], levers: [], stakes: [
        { factionId: 'Manor Household', stake: 'split', reason: STAKE_REASONS.untouched },
        { factionId: 'Merchant Guilds', stake: 'split', reason: 'stand to win by it and to lose by it alike' },
      ] } }] };
    const rows = composeCrisisPage(/** @type {any} */ (town), { audience: 'owner' }).flatMap((sec) => sec.stakes);
    expect(rows.map((k) => [k.factionId, k.stake, k.reason])).toEqual([['Merchant Guilds', 'split', 'stand to win by it and to lose by it alike']]);
  });
});

describe('SR1: at birth only (a saved town keeps its stored sentence)', () => {
  it('a saved town\'s pre-SR1 loses and split reasons print as stored, and their readers still read them', () => {
    const saved = { tier: 'town', name: 'Testholm', stress: [{ type: 'under_siege', label: 'Under Siege',
      cast: { nature: 'external', roles: [], absent: [], levers: [], stakes: [
        { factionId: 'Elder Council', stake: 'loses', reason: STAKE_REASONS.loses },
        { factionId: 'Merchant Guilds', stake: 'loses', reason: 'their own people feel the crisis first' },
        { factionId: 'War Council', stake: 'split', reason: STAKE_REASONS.split },
      ] } }] };
    const rows = composeCrisisPage(/** @type {any} */ (saved), { audience: 'owner' }).flatMap((sec) => sec.stakes);
    expect(rows.map((k) => k.reason)).toEqual([STAKE_REASONS.loses, 'their own people feel the crisis first', STAKE_REASONS.split]);
    expect(rows.map((k) => L.stakeReasonKey(k.reason))).toEqual(['loses', 'loses', 'split']);
  });
});
