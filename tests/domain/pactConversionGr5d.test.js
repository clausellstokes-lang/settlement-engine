/**
 * tests/domain/pactConversionGr5d.test.js — GR-RENEWAL U3: CONVERSION (GR-5d; the lane brief
 * BUILD-FP-GR-renewal-lane.md; J-GR-9 rules the shape, R-24 rules it the court's).
 *
 * A compelled alliance whose record was honoured throughout (`worstObservedEver`, the monotone
 * memory GR-5A landed, read BY NAME) and whose pair's trust has crossed the band becomes a chosen
 * one when its renewal is accepted: a `converted` LINEAGE ACT on the living record through the one
 * amendment writer, the compelled clause closed and the frozen composable pair (mutual defence and
 * non-aggression) written in its place, held by both courts; provenance `converted`; the new
 * holders re-sworn (GR-1). Below the band, or on a record that was ever seen strained, the renewal
 * renews AS IS. The conversion is the COURT'S, never a DM's direction (R-24): the DM's lever is the
 * relationship label through `set-relationship`.
 *
 * The standing instrument is the WAR DOOR's (its clauses drafted by `draftTerms`, its record in the
 * shape `peaceTerms.js :: mintTreaty` writes). The new symbols are read through NAMESPACE imports,
 * so the red-first plant of the pre-change sources reds each arm by title.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import * as renewal from '../../src/domain/worldPulse/pactRenewal.js';
import * as amendment from '../../src/domain/worldPulse/pactAmendment.js';
import { advancePeacetimePacts } from '../../src/domain/worldPulse/pactFormation.js';
import { openPactProposal, pactProposalsOf } from '../../src/domain/worldPulse/pactProposals.js';
import { treatyLedgerOf } from '../../src/domain/worldPulse/treatyEnforcement.js';
import { termBudgetFor } from '../../src/domain/worldPulse/peaceTermsAppraisal.js';
import { TERM_CATALOG } from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { draftTerms } from '../../src/domain/worldPulse/peaceTermsDrafting.js';
import { treatyPairKey } from '../../src/domain/worldPulse/peaceTermsPrimitives.js';
import { RELATIONSHIP_DEFAULTS } from '../../src/domain/worldPulse/relationshipState.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { A_ECONOMY, B_ECONOMY, SEAT, pactWorld, relKey } from '../helpers/pactFixture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SIGN_TICK = 0;
const LIT = Object.freeze({ treatyRenewalEnabled: true, oathHolderEnabled: true });
const npc = (id, name, seat) => ({ id, name, factionAffiliation: seat, role: 'official' });
const court = (id, economicState, roster) => ({
  id, name: id,
  settlement: {
    id, name: id, economicState: { ...economicState },
    powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: `${id} seat`, category: 'military', power: 78, isGoverning: true }], conflicts: [] },
    npcs: roster.map((row) => ({ ...row })),
  },
});
const snapshotOf = () => ({
  settlements: [court('L', B_ECONOMY, [npc('npc_l1', 'Lorn Ashe', 'L seat')]), court('V', A_ECONOMY, [npc('npc_v1', 'Varo Keel', 'V seat')])],
  regionalGraph: { edges: [{ from: 'L', to: 'V' }] },
});
const settlementOf = (id) => snapshotOf().settlements.find((item) => item.id === id)?.settlement ?? null;
/** The trust at which the pair converts in these arms, and one a step below the band. */
const HIGH_TRUST = 0.72;
const LOW_TRUST = 0.6;
/** A war's end that bound L to march under V's banner and to pay V tribute: the war door's own
 *  drafter at the recorded margin's own value, in the record shape the war door writes. The budget
 *  affords both clauses the same span, so both still bind when the window opens. */
function compelledTreaty(extra = {}) {
  const { margin01 } = termBudgetFor(0.3);
  const drafted = draftTerms({
    ranked: [{ termType: 'compelled_alliance', value: 1 }, { termType: 'tribute', value: 1 }],
    budget: 4, margin01, press: 1, tick: SIGN_TICK,
  });
  return {
    parties: ['V', 'L'], victorId: 'V', loserId: 'L', victorName: 'V', loserName: 'L',
    mintedTick: SIGN_TICK, believedMarginAtSignature: 0.3, budgetGranted: 4, budgetSpent: drafted.budgetSpent,
    treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR, terms: drafted.terms, complianceState: 'honored',
    receipts: ['The Peace of L: signed under V terms.'], ...extra,
  };
}
/** L pictures V holding what L lacks, so L's own evidence can answer a question from V. */
const tradeBeliefs = () => ({ L: { [SEAT]: { V: { scarcityBands: { food: 'scant', raw_material: 'plentiful' } } } } });
function world({ trust = HIGH_TRUST, treaty = compelledTreaty(), rules = LIT } = {}) {
  return pactWorld({
    flag: true, rules, beliefs: tradeBeliefs(),
    relationshipStates: { [relKey('L', 'V')]: { relationshipType: 'trade_partner', trust, resentment: 0.1 } },
    treaties: { [treatyPairKey('V', 'L')]: treaty },
  });
}
const instrumentOf = (w) => Object.values(treatyLedgerOf(w) || {})[0];
const ends = (treaty) => Math.max(...treaty.terms.map((t) => t.expiresTick));
const opensAt = (treaty) => ends(treaty) - renewal.RENEWAL_WINDOW_TUNING.WINDOW_WEEKS;
const COMPELLED = 'compelled_alliance';
/** A renewal V asks inside the window, and the tick's answer signed, settled by the leaf's fold. */
function settledAt(w, { verdict = 'signed' } = {}) {
  const treaty = instrumentOf(w);
  const at = opensAt(treaty) + 1;
  const opened = openPactProposal({
    worldState: { ...w, tick: at }, from: 'V', to: 'L', trigger: 'renewal',
    sheet: { terms: renewal.draftRenewalSheet(treaty, at) }, tick: at,
  });
  const row = pactProposalsOf(opened.worldState)[0];
  const due = row.answerDueTick;
  const settled = renewal.settleRenewalProposal({
    worldState: { ...opened.worldState, tick: due }, proposal: row,
    answer: { verdict, receipt: 'The answer came.', offer01: 0.9, reserve01: 0.5 },
    tick: due, settlementOf, snapshot: snapshotOf(),
  });
  return { due, row, settled, after: settled && settled.ledger ? Object.values(settled.ledger)[0] : null };
}

describe('GR-RENEWAL U3 — conversion (GR-5d): a compelled alliance honoured throughout, its trust past the band, becomes a chosen one at its renewal', () => {
  it('U3-A1: a crossing converts: the compelled clause closes, the composable pair is held by both, the act is converted, the provenance says so, and the new holders swear', () => {
    const w = world();
    const before = instrumentOf(w);
    expect(before.terms.map((t) => t.type).sort(), 'the war door drafted both clauses').toEqual([COMPELLED, 'tribute']);
    const { due, settled, after } = settledAt(w);
    expect(settled.receipt).toMatchObject({ kind: 'pact_converted', ending: 'signed', fromId: 'V', toId: 'L' });
    const compelled = before.terms.find((t) => t.type === COMPELLED);
    const span = compelled.expiresTick - compelled.mintedTick;
    // The pair runs on the compelled clause's span from the signing, held by BOTH courts.
    // anchored: `before` carries the compelled clause (its span is read just above); the conversion closed it.
    expect(after.terms.filter((t) => t.type === COMPELLED)).toEqual([]);
    const pair = after.terms.filter((t) => t.beneficiary === 'both');
    expect(pair.map((t) => [t.type, t.family, t.mintedTick, t.expiresTick]).sort()).toEqual(
      [...amendment.COMPOSABLE_SECURITY_PAIR].map((type) => [type, TERM_CATALOG[type].family, due, due + span]).sort(),
    );
    // The rest of the accepted sheet renews AS IS on its own span.
    const tribute = before.terms.find((t) => t.type === 'tribute');
    expect(after.terms.filter((t) => t.type === 'tribute').map((t) => [t.mintedTick, t.expiresTick]))
      .toEqual([[due, due + (tribute.expiresTick - tribute.mintedTick)]]);
    // ONE act on the living record, at the same key, and the record says how it stands now.
    expect(Object.keys(settled.ledger)).toEqual([treatyPairKey('V', 'L')]);
    expect(after.lineage.map((entry) => entry.act)).toEqual(['formed', 'converted']);
    expect(after.lineage.at(-1).termIds).toEqual(pair.concat(after.terms.filter((t) => t.type === 'tribute')).map(amendment.termIdOf).sort());
    expect(after.provenance).toBe('converted');
    expect(amendment.provenanceOf(after)).toBe('converted');
    // GR-1: the new holders swear at the act.
    expect(after.sworn).toEqual({
      L: { npcId: 'npc_l1', name: 'Lorn Ashe', swornTick: due },
      V: { npcId: 'npc_v1', name: 'Varo Keel', swornTick: due },
    });
    expect(settled.receipt.superseded).toEqual(before.terms.map(amendment.termIdOf).sort());
  });

  it('U3-A2: below the band nothing converts: the renewal renews the compelled alliance AS IS', () => {
    const w = world({ trust: LOW_TRUST });
    expect(LOW_TRUST).toBeLessThan(renewal.CONVERSION_TUNING.TRUST_BAND);
    const { due, settled, after } = settledAt(w);
    expect(settled.receipt.kind).toBe('pact_renewed');
    expect(after.lineage.map((entry) => entry.act)).toEqual(['formed', 'renewed']);
    expect(after.terms.map((t) => [t.type, t.mintedTick]).sort()).toEqual(instrumentOf(w).terms.map((t) => [t.type, due]).sort());
    // anchored: the same instrument at HIGH_TRUST carries the pair in U3-A1; the trust is the only change.
    expect(after.terms.filter((t) => t.beneficiary === 'both')).toEqual([]);
    // anchored: U3-A1 writes provenance on the converted record; the renewed record keeps none.
    expect(Object.hasOwn(after, 'provenance')).toBe(false);
    // AT THE BAND ITSELF the pair converts: the crossing is inclusive.
    expect(settledAt(world({ trust: renewal.CONVERSION_TUNING.TRUST_BAND })).settled.receipt.kind).toBe('pact_converted');
  });

  it('U3-A3: the gate is the RECORDED history: a compelled alliance ever seen strained does not convert, though it reads honoured today', () => {
    const strained = world({ treaty: compelledTreaty({ worstObservedEver: 'strained' }) });
    expect(instrumentOf(strained).complianceState, 'the record reads honoured this tick').toBe('honored');
    const { settled, after } = settledAt(strained);
    expect(settled.receipt.kind).toBe('pact_renewed');
    // anchored: U3-A1 converts the same instrument with no memory of strain; the memory is the only change.
    expect(after.terms.filter((t) => t.beneficiary === 'both')).toEqual([]);
    expect(after.worstObservedEver, 'the memory rides the act').toBe('strained');
    // A memory of honour written by the fold converts exactly as an absent one reads.
    expect(settledAt(world({ treaty: compelledTreaty({ worstObservedEver: 'honored' }) })).settled.receipt.kind).toBe('pact_converted');
  });

  it('U3-A4: only a compelled alliance converts, and only one the accepted sheet re-offers; a refusal converts nothing', () => {
    // A war's end with no compelled alliance renews AS IS at any trust.
    const { margin01 } = termBudgetFor(0.3);
    const tributeOnly = draftTerms({ ranked: [{ termType: 'tribute', value: 1 }], budget: 3, margin01, press: 1, tick: SIGN_TICK });
    const plain = world({ treaty: compelledTreaty({ terms: tributeOnly.terms, budgetSpent: tributeOnly.budgetSpent }) });
    expect(settledAt(plain).settled.receipt.kind).toBe('pact_renewed');
    // A sheet that no longer carries the compelled clause (the DM's hand or a spent clause) renews what it carries.
    const w = world();
    const treaty = instrumentOf(w);
    const at = opensAt(treaty) + 1;
    const withoutCompelled = renewal.draftRenewalSheet(treaty, at).filter((t) => t.type !== COMPELLED);
    const opened = openPactProposal({ worldState: { ...w, tick: at }, from: 'V', to: 'L', trigger: 'renewal', sheet: { terms: withoutCompelled }, tick: at });
    const row = pactProposalsOf(opened.worldState)[0];
    const partial = renewal.settleRenewalProposal({
      worldState: opened.worldState, proposal: row, answer: { verdict: 'signed', receipt: '', offer01: 1, reserve01: 0 },
      tick: row.answerDueTick, settlementOf, snapshot: snapshotOf(),
    });
    expect(partial.receipt.kind).toBe('pact_renewed');
    // anchored: U3-A1 converts the same instrument when the sheet re-offers the compelled clause; the sheet is the only change.
    expect(Object.values(partial.ledger)[0].terms.filter((t) => t.beneficiary === 'both')).toEqual([]);
    // A REFUSED renewal lapses clean and converts nothing, however high the trust.
    const refused = settledAt(world(), { verdict: 'no_overlap' });
    expect([refused.settled.receipt.kind, refused.settled.ledger]).toEqual(['pact_renewal_lapsed', null]);
  });

  it('U3-A5: the act is growth, and a war between the two allies closes what they chose', () => {
    expect(amendment.PACT_LINEAGE_ACTS).toContain('converted');
    expect([...amendment.PACT_LINEAGE_ACTS]).toEqual([...amendment.PACT_LINEAGE_ACTS].sort());
    expect(amendment.PACT_PROVENANCE).toContain('converted');
    const { settled } = settledAt(world());
    const converted = { ...world(), spatialLedgers: { ...world().spatialLedgers, treaties: settled.ledger } };
    const atWar = { ...converted, relationshipStates: { [relKey('L', 'V')]: { relationshipType: 'hostile', trust: 0.1 } } };
    const after = Object.values(settled.ledger)[0];
    const closure = amendment.closeTermsBrokenByWar({ worldState: atWar, aId: 'L', bId: 'V', tick: after.lineage.at(-1).tick + 1 });
    expect(closure.closed).toEqual(expect.arrayContaining(after.terms.filter((t) => t.beneficiary === 'both').map(amendment.termIdOf)));
  });

  it('U3-A6: the band is a DRAFT row, measured against the relationship plane: above a trading pair\'s trust, below an allied pair\'s', () => {
    const register = JSON.parse(readFileSync(join(ROOT, 'tests/lint/.tuning-register.json'), 'utf8'));
    const row = register.tables['src/domain/worldPulse/pactRenewal.js#CONVERSION_TUNING'];
    expect([row?.status, row?.unit, row?.band, row?.signedAt]).toEqual(['draft', { TRUST_BAND: 'fraction01' }, null, null]);
    const band = renewal.CONVERSION_TUNING.TRUST_BAND;
    // A pair that merely trades, a client, a vassal: none converts on its default trust.
    for (const type of ['client', 'neutral', 'trade_partner', 'vassal']) expect(RELATIONSHIP_DEFAULTS[type].trust, type).toBeLessThan(band);
    // A pair the plane already reads as allied converts on its default trust.
    expect(RELATIONSHIP_DEFAULTS.allied.trust).toBeGreaterThanOrEqual(band);
    // THE MINT'S OWN NUDGE, from the war door's drafter (peaceTermsOverlay.js adds 0.15 of the compelled
    // clause's magnitude to the bound party's trust): a client or a vassal never crosses on it alone.
    const nudges = [0, 0.25, 0.5, 0.75, 1].flatMap((margin01) => [0.6, 1, 1.4].flatMap((press) => [1.2, 3, 6].map((budget) =>
      0.15 * draftTerms({ ranked: [{ termType: COMPELLED, value: 1 }], budget, margin01, press, tick: 0 }).terms[0].magnitude)));
    expect(nudges.length).toBe(45);
    for (const type of ['client', 'vassal']) expect(RELATIONSHIP_DEFAULTS[type].trust + Math.max(...nudges), type).toBeLessThan(band);
  });

  it('U3-A7: the whole road: the victor asks in the window\'s first weeks, the bound party answers on its own evidence, and the alliance converts', () => {
    const w = world();
    const treaty = instrumentOf(w);
    const at = opensAt(treaty);
    const asked = advancePeacetimePacts({ snapshot: snapshotOf(), worldState: { ...w, tick: at }, tick: at });
    const row = pactProposalsOf(asked.worldState).find((r) => r.trigger === 'renewal');
    expect([row.from, row.to]).toEqual(['V', 'L']);
    const answered = advancePeacetimePacts({ snapshot: snapshotOf(), worldState: { ...asked.worldState, tick: row.answerDueTick }, tick: row.answerDueTick });
    expect(answered.receipts.find((r) => r.kind === 'pact_converted')).toMatchObject({ fromId: 'V', toId: 'L', ending: 'signed' });
    const after = instrumentOf(answered.worldState);
    expect([after.provenance, after.lineage.at(-1).act]).toEqual(['converted', 'converted']);
  });

  it('U3-A8: dark means nothing converts, and a converted record round-trips whole', () => {
    for (const rules of [{ oathHolderEnabled: true }, { oathHolderEnabled: true, treatyRenewalEnabled: false }]) {
      // anchored: the lit world converts in U3-A1; the renewal layer is the only change, and the leaf answers nothing.
      expect(settledAt(world({ rules })).settled).toBe(null);
    }
    const after = settledAt(world()).after;
    expect([after.provenance, after.lineage.at(-1).act], 'the record under the round trip is a converted one').toEqual(['converted', 'converted']);
    expect(JSON.parse(JSON.stringify(after))).toEqual(after);
    expect(amendment.worstObservedEverOf(after)).toBe('honored');
  });
});
