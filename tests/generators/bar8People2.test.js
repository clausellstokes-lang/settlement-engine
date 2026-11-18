/**
 * tests/generators/bar8People2.test.js — BAR8 PEOPLE-2 (the seat after K-PEOPLE; BRIEF-BAR8 § K-PEOPLE; rulings BR13, BR27 (4),
 * and the chair's call of 2026-11-18 05:14 UTC under the owner's deferral). Every anchor is a CONSTRUCTED record (rule N7: a
 * state no seat of the round is lifting), a negative beside a positive.
 *
 * (14b · the two other callers) THE SWAP CURE HOLDS WHERE `assignHandlers` IS CALLED OUTSIDE THE BIRTH: the v2 -> v3 migration
 *       (`domain/settlementMigrations.js :: migrateV2toV3`) and the DM's IMPOSE_CORRUPTION (`domain/events/mutateEntities.js ::
 *       imposeCorruption`). Two criminal houses, each with one face; each house's agent listed before the other's, so the round of
 *       the houses' pool deals A's agent to B's face and B's to A's (the swap). After either caller, each network is handled by
 *       its own house's face.
 * (14b · the owner's line) A STORED HANDLER THAT NAMES A CARD ON THE ROSTER IS NEVER REWRITTEN, by the load or by the event,
 *       even where it is the one-way deal (`.cross`, the deal's design). What the new exchange can change is a deal not yet
 *       made: a handler the roster no longer holds (the party's removal, `worldPulse/partyImpact.js`), re-dealt by the event.
 * (13b · the held friend) A TIE LINE THAT HOLDS SOMEONE INSIDE DECLARES THE PRISON, each line alone (the second reader: the
 *       description and the tension of `handler_leverage_loved` carry the same declaration on the same index, so reverting the
 *       description's `needs: ['prison']` alone turned nothing red).
 */
import { describe, expect, it } from 'vitest';
import { migrateSettlementToLatest } from '../../src/domain/settlementMigrations.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { SCHEMA_VERSION } from '../../src/domain/settlement.schema.js';
import { HANDLER_TIE_LINES } from '../../src/data/people/handlerTieLines.js';

const A = 'Thieves guild';
const B = 'Smuggling ring';
const T0 = '2026-11-18T00:00:00Z';

/** Two criminal houses with one face each; `agents` follow the faces in roster order. @param {any[]} agents @param {number} version */
const townWith = (agents, version) => ({
  schemaVersion: version,
  name: 'Constructed', tier: 'town',
  institutions: [{ name: A, category: 'criminal' }, { name: B, category: 'criminal' }],
  npcs: [
    { id: 'face_a', name: 'Ada Face', institution: { kind: 'house', key: A } },
    { id: 'face_b', name: 'Bram Face', institution: { kind: 'house', key: B } },
    ...agents,
  ],
});
/** an allegiance as birth writes it, in the houses' pool (no criminal power on the record) @param {string} house @param {string | null} handler */
const allegiance = (house, handler) => ({ power: null, house, vector: 'greed', via: null, handler, share: 0.15, veiled: true, covert: true });
/** @param {any} s @returns {Record<string, string | null>} each card's handler, by id */
const handlers = (s) => Object.fromEntries((s.npcs || []).filter((/** @type {any} */ n) => n?.allegiance).map((/** @type {any} */ n) => [String(n.id), n.allegiance.handler ?? null]));
/** @param {any} s @param {string} target @param {string} house */
const impose = (s, target, house) => mutateSettlement({ settlement: s, event: { type: 'IMPOSE_CORRUPTION', targetId: target, payload: { criminalInstitution: house }, timestamp: T0 } });

describe('BAR8 PEOPLE-2 (14b) · the swap cure holds in assignHandlers\' two other callers', () => {
  it('the migration (v2 -> v3): each house\'s network is handled by its own face', () => {
    const v2 = townWith([
      { id: 'agent_b', name: 'Bel Agent', corrupt: true, corruptTies: { criminalInstitution: B } },
      { id: 'agent_a', name: 'Arn Agent', corrupt: true, corruptTies: { criminalInstitution: A } },
    ], 2);
    const out = migrateSettlementToLatest(v2);
    const s = /** @type {any} */ (out).settlement || out;
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(handlers(s)).toEqual({ agent_b: 'face_b', agent_a: 'face_a' });
  });

  it('the event (IMPOSE_CORRUPTION, re-dealing a handler the roster no longer holds): each network is handled by its own face', () => {
    const s = townWith([
      { id: 'agent_b', name: 'Bel Agent', allegiance: allegiance(B, 'npc_gone') }, // its handler left the roster (the party's removal)
      { id: 'agent_a', name: 'Arn Agent' },
    ], SCHEMA_VERSION);
    expect(handlers(impose(s, 'agent_a', A))).toEqual({ agent_b: 'face_b', agent_a: 'face_a' });
  });
});

describe('BAR8 PEOPLE-2 (14b) · a stored handler that names a card on the roster is never rewritten', () => {
  // agent_b's network (B) is handled one way by A's face: the deal's design (`.cross`), stored, its handler alive
  const stored = () => townWith([
    { id: 'agent_b', name: 'Bel Agent', allegiance: allegiance(B, 'face_a') },
    { id: 'agent_a', name: 'Arn Agent' },
  ], SCHEMA_VERSION);

  it('at the load: every stored handler is kept', () => {
    const out = migrateSettlementToLatest(stored());
    expect(handlers(/** @type {any} */ (out).settlement || out)).toEqual({ agent_b: 'face_a' });
  });

  it('at the event: the new allegiance is dealt, and the stored one stands as it was', () => {
    const after = handlers(impose(stored(), 'agent_a', A));
    expect(after.agent_a, 'the event dealt the new allegiance a handler (the positive)').toBe('face_a');
    expect(after.agent_b, 'the stored handler, alive on the roster, is not rewritten').toBe('face_a');
  });
});

describe('BAR8 PEOPLE-2 (13b) · a tie line that holds someone inside declares the prison, each line alone', () => {
  const HELD = /\bheld by the\b|\binside\b|\bthe prisoner\b/;
  const r = { name: 'Rook' }; const s = { name: 'Sable' }; const f = { body: 'watch' };
  /** every line of the handler ties' table with its declaration @returns {Array<{ at: string, text: string, needs: string[] }>} */
  const rows = () => Object.entries(HANDLER_TIE_LINES).flatMap(([key, arch]) => ['desc', 'tension'].flatMap((part) => (/** @type {any} */ (arch)[part] || [])
    .map((/** @type {any} */ row, /** @type {number} */ i) => ({ at: `${key}.${part}[${i}]`, text: String(row.line(r, s, f)), needs: Array.isArray(row.needs) ? row.needs : [] }))));

  it('every line that holds someone inside declares `prison`; the three of them are found', () => {
    const held = rows().filter((x) => HELD.test(x.text));
    expect(held.map((x) => x.at).sort()).toEqual(['handler_leverage_crime.tension[3]', 'handler_leverage_loved.desc[3]', 'handler_leverage_loved.tension[3]']);
    expect(held.filter((x) => !x.needs.includes('prison')).map((x) => x.at)).toEqual([]);
  });

  it('THE POSITIVE BESIDE IT: no line that holds no one declares the prison', () => {
    const all = rows();
    expect(all.length).toBeGreaterThan(20);
    expect(all.filter((x) => x.needs.includes('prison') && !HELD.test(x.text)).map((x) => x.at)).toEqual([]);
  });
});
