/**
 * treatyOrientationWr10g.test.js — CR-WR10-G: WHO GIVES, WHO RECEIVES, AND WHO PAYS.
 *
 * Every treaty this engine had ever minted ended a war, so `victorId` and `loserId`
 * were not merely the names of two fields — they were the names of two ROLES that
 * dozens of reads spelled directly. WR-10's market mints a treaty with a seller and a
 * buyer and no war anywhere in it, and each pin below exists because a specific way of
 * getting that wrong is cheap, silent, and durable:
 *
 *   • THE COURT THAT DOES NOT EXIST. `String(treaty.loserId)` on a victor-free record
 *     is the four-character string `"undefined"`, and peaceTerms' PASS 2 threads that
 *     value into FOUR reads at once — the payer's granary, the monitor reach, the
 *     strain accrual, and the `defaultedBy` write. Measured on this file's fixtures
 *     with the pre-ruling spelling restored: a sale's whole consideration goes SILENTLY
 *     INERT (`extractedFromLoser` 0, compliance frozen at 'honored' forever) because
 *     every one of those reads addresses a court nobody can find. That is the failure
 *     the direction and default pins below catch, and it is worse than a loud one.
 *   • THE COLLAPSED AXIS. A sale's conveyance runs seller → buyer, and its
 *     CONSIDERATION runs buyer → seller. Reading one axis for both is a one-word
 *     mistake that makes a sale's stream terms draw grain out of the party that was
 *     owed it. Pinned on a real granary in both directions, with the collapse executed
 *     as a mutant.
 *   • THE BOUND PARTY. `demilitarizationCapFor` and `occupationHoldFor` used to read
 *     `loserId` and mean "the party this binds". On a sale that party is the BUYER.
 *     Both arms pinned — the cap the buyer bears, and the seller's freedom from it.
 *   • THE RENDERED LIE. The treaty document is the single source of every party id and
 *     name four display surfaces show. A deep scan asserts no reachable string in a
 *     sale's document is `"undefined"`, and the names resolve to real ids.
 *
 * Every negative here is anchored against a live sibling or an inline reason. No
 * fixture mirrors the deriver: the treaty records are hand-built in the shape the real
 * mints produce, and every read under test is the production one.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, it, expect } from 'vitest';

import {
  TERM_OBLIGATION_KINDS,
  TREATY_ORIENTATION_KINDS,
  TREATY_ROLE_WORDS,
  termObligationOf,
  treatyOrientationOf,
  treatyRoleWord,
} from '../../src/domain/worldPulse/treatyOrientation.js';
import { draftPactSheet, signPactProposal } from '../../src/domain/worldPulse/pactFormation.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import {
  advanceTreaties, demilitarizationCapFor, occupationHoldFor, treatyDocument,
  treatyPairKey, TERM_CATALOG,
} from '../../src/domain/worldPulse/peaceTerms.js';
import { hegemonyRead } from '../../src/domain/worldPulse/hegemony.js';
import { executeTreatyConveyances } from '../../src/domain/worldPulse/sovereigntyTransfer.js';
import { SOVEREIGNTY_REQUIRED_RULES } from '../../src/domain/worldPulse/sovereigntyAssets.js';
import { createOccupationRecord } from '../../src/domain/worldPulse/occupation.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const LIT = { warLayerEnabled: true, peaceEngineEnabled: true };
const SOVEREIGNTY_LIT = Object.fromEntries(SOVEREIGNTY_REQUIRED_RULES.map((k) => [k, true]));

// THE TWO COURTS ARE IDENTICAL — same granary, same population — so the ONLY thing that
// differs between the sale run and the war run below is the treaty's orientation. A
// direction pin whose two fixtures differ in wealth would be measuring the wealth.
const BUYER_MONTHS = 6;
const SELLER_MONTHS = 6;
const POP = 1800;

/** A snapshot item with a REAL granary, so a stream term has somewhere to move grain
 *  from and to and the direction pin measures physics rather than a no-op. */
function item(id, storageMonths, population = POP) {
  return {
    id,
    name: id,
    settlement: {
      name: id, tier: 'town', population,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
        foodSecurity: {
          storageMonths, dailyNeed: 100, dailyProduction: 100,
          deficitPct: 0, surplusPct: 0, resilienceScore: 50,
        },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'military seat', category: 'military', power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
  };
}

const PARTIES = [item('buyer', BUYER_MONTHS), item('seller', SELLER_MONTHS)];
const EDGES = [{ id: 'edge.buyer.seller', from: 'buyer', to: 'seller', relationshipType: 'neutral' }];

/** One term in the shape the mints write. */
function term(type, patch = {}) {
  const spec = TERM_CATALOG[type];
  const t = {
    type, family: spec.family, magnitude: 0.3, mintedTick: 0, expiresTick: 100,
    weightSpent: spec.weight, complianceState: 'honored', trueState: 'honored', burden01: 0,
    receipt: `${type} term`, ...patch,
  };
  if (spec.stream) { t.deliveredToVictor = t.deliveredToVictor ?? 0; t.extractedFromLoser = t.extractedFromLoser ?? 0; }
  if (spec.executor === 'seam') t.seam = true;
  return t;
}

/** THE SALE TREATY, exactly as CR-WR10-G declares it: sellerId/buyerId present, the war
 *  pair ABSENT (drop-when-absent — a key set to null is still a key and still a byte). */
function saleTreaty(terms, patch = {}) {
  return {
    parties: ['buyer', 'seller'],
    sellerId: 'seller', buyerId: 'buyer',
    sellerName: 'Seller Court', buyerName: 'Buyer Court',
    mintedTick: 0, budgetGranted: 0, budgetSpent: 0,
    complianceState: 'honored', terms, receipts: ['pin'], ...patch,
  };
}

/** THE WAR TREATY, the historic shape, unchanged. */
function warTreaty(terms, patch = {}) {
  return {
    parties: ['buyer', 'seller'],
    victorId: 'buyer', loserId: 'seller',
    victorName: 'Buyer Court', loserName: 'Seller Court',
    mintedTick: 0, believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored', terms, receipts: ['pin'], ...patch,
  };
}

function ledgerWorld(treaty, key, extra = {}) {
  return {
    tick: 10,
    simulationRules: { ...LIT },
    calendar: { elapsedWeeks: 30 },
    deployments: {},
    relationshipStates: {},
    spatialLedgers: { treaties: { [key]: treaty } },
    ...extra,
  };
}

/** Run the mover once over a ledger world. `pIndex` drives the obligor's capacity, which
 *  is what decides whether a term strains or defaults. */
function advance(worldState, pIndex = null, items = PARTIES) {
  const settlementUpdates = items.map((i) => ({ saveId: String(i.id), settlement: i.settlement }));
  return advanceTreaties({
    snapshot: { byId: new Map(items.map((i) => [String(i.id), i])), regionalGraph: { edges: EDGES } },
    worldState, settlementUpdates, graph: { edges: EDGES }, pIndex, tick: 10,
    now: '2026-01-01T00:00:00.000Z',
  });
}

/** A pressure index that crushes ONE settlement's economy and food — enough capacity
 *  loss for evolveCompliance to observe a default. */
function crushing(id) {
  return { get: (sid, kind) => (String(sid) === id && (kind === 'economy' || kind === 'food') ? { score: 95 } : undefined) };
}

/** The payer/payee granary read, straight off the mover's own settlementUpdates. */
function monthsIn(out, id) {
  const row = (out.settlementUpdates || []).find((u) => String(u.saveId) === id);
  return Number(row?.settlement?.economicState?.foodSecurity?.storageMonths);
}

/** Every string reachable in a value — the deep scan the rendered-lie pin uses. */
function allStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('CR-WR10-G — the orientation reader itself', () => {
  it('a WAR settlement reads the historic pair on BOTH axes: the loser gives AND owes', () => {
    const o = treatyOrientationOf(warTreaty([term('tribute')]));
    expect(o.kind).toBe('wartime');
    expect(o.resolved).toBe(true);
    expect(o.giverId).toBe('seller');
    expect(o.receiverId).toBe('buyer');
    // The axes COINCIDE here, and that coincidence is the whole reason the collapse
    // below was ever plausible: a wartime fixture cannot distinguish the two readings.
    expect(o.obligorId).toBe('seller');
    expect(o.obligeeId).toBe('buyer');
    expect(o.giverName).toBe('Seller Court');
    expect(o.receiverName).toBe('Buyer Court');
  });

  it('a SALE reads seller/buyer, and the obligation axis is the MIRROR of the conveyance axis', () => {
    const o = treatyOrientationOf(saleTreaty([term('tribute')]));
    expect(o.kind).toBe('sale');
    expect(o.resolved).toBe(true);
    // The conveyance: the seller hands the holding over.
    expect(o.giverId).toBe('seller');
    expect(o.receiverId).toBe('buyer');
    // THE MIRROR: the BUYER pays. This single assertion is the direction CR-WR10-G
    // asks for, and it is the one a collapsed implementation gets backwards.
    expect(o.obligorId, 'on a sale the BUYER pays').toBe('buyer');
    expect(o.obligeeId, 'and the SELLER is owed').toBe('seller');
    expect(o.obligorName).toBe('Buyer Court');
    expect(o.obligeeName).toBe('Seller Court');
  });

  it('MUTANT: collapsing the obligation axis onto the conveyance axis IS caught', () => {
    const o = treatyOrientationOf(saleTreaty([term('tribute')]));
    // The mutation under test: obligor := giver, the reading a single-axis
    // implementation produces. It is correct on the wartime record above and wrong here.
    const collapsed = { ...o, obligorId: o.giverId, obligeeId: o.receiverId };
    expect(collapsed.obligorId).not.toBe(o.obligorId);
    // anchored: the unmutated obligorId was asserted to be 'buyer' one test above, so
    // this inequality measures the mutation rather than a comparison that never holds.
    expect(collapsed.obligorId).toBe('seller');
    // …and the same mutation is INVISIBLE on the wartime record, which is exactly why
    // a war-only fixture set could never have caught it.
    const war = treatyOrientationOf(warTreaty([term('tribute')]));
    expect({ ...war, obligorId: war.giverId }).toEqual(war);
  });

  it('an unresolvable treaty yields EMPTY strings on every field — never the word "undefined"', () => {
    for (const shape of [null, undefined, {}, { terms: [] }, { victorId: 'lone' }, { buyerId: 'lone' },
      { victorId: 'same', loserId: 'same' }, { sellerId: 'same', buyerId: 'same' }]) {
      const o = treatyOrientationOf(shape);
      expect(o.kind).toBe('unknown');
      expect(o.resolved).toBe(false);
      expect([o.giverId, o.receiverId, o.obligorId, o.obligeeId,
        o.giverName, o.receiverName, o.obligorName, o.obligeeName]).toEqual(['', '', '', '', '', '', '', '']);
    }
    // THE PRE-GUARD BEHAVIOUR, REPRODUCED: the reading this module replaced really does
    // produce the four-character string, so the emptiness above is a cure and not a
    // property the tree always had.
    expect(String(/** @type {any} */ ({}).loserId)).toBe('undefined');
  });

  it('the kind vocabulary and the role words are closed, and the role word follows the instrument', () => {
    expect([...TREATY_ORIENTATION_KINDS].sort()).toEqual(['sale', 'unknown', 'wartime']);
    expect(Object.keys(TREATY_ROLE_WORDS).sort()).toEqual([...TREATY_ORIENTATION_KINDS].sort());
    const war = treatyOrientationOf(warTreaty([term('tribute')]));
    expect(treatyRoleWord(war, 'buyer')).toBe('victor');
    expect(treatyRoleWord(war, 'seller')).toBe('the bound party');
    const sale = treatyOrientationOf(saleTreaty([term('tribute')]));
    expect(treatyRoleWord(sale, 'buyer')).toBe('the buyer');
    expect(treatyRoleWord(sale, 'seller')).toBe('the seller');
    // A stranger is 'a party' under either instrument — the word is never guessed.
    expect(treatyRoleWord(sale, 'bystander')).toBe('a party');
    expect(treatyRoleWord(treatyOrientationOf({}), 'buyer')).toBe('a party');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CR-GR3B-3-R1 — THE PER-TERM OBLIGATION AXIS.
//
// A negotiated instrument has no victor and no seller, and §3.2's multi-round record
// proves it can have no single treaty-level direction either: one record, two clauses,
// opposite ways. So the axis is PER TERM and it is the datum the record already carries —
// the term's `beneficiary`. The party that asked is owed; the counterparty promises, is
// watched, pays, and is the one named when the clause defaults. A clause both courts hold
// binds them MUTUALLY and moves nothing in either direction.
//
// Every fixture below is minted by the REAL drafter and the REAL signer. A hand-built
// negotiated record would mirror the resolver it is meant to measure.
// ═══════════════════════════════════════════════════════════════════════════════

/** Mint a negotiated instrument through `draftPactSheet` → `signPactProposal`. */
function mintPact({ fromId, toId, trigger, reciprocal = false, signTick = 10, worldState = null }) {
  const sheet = draftPactSheet({ trigger, fromId, toId, reciprocal, tick: signTick - 4 });
  return signPactProposal({
    worldState: worldState || {
      rngSeed: 'gr3b-orient', simulationRules: { pactFormationEnabled: true },
      relationshipStates: {}, spatialLedgers: {},
    },
    proposal: { from: fromId, to: toId, sheet },
    tick: signTick,
  });
}

/** The persisted record, read straight off the mint's own ledger. */
const pactRecord = (signed) => getSpatialLedger(signed.worldState, 'treaties')[treatyPairKey('buyer', 'seller')];

/** Crushes EVERY court whatever its id — INCLUDING the empty id a mutual or unresolved
 *  clause resolves to. That is the only input that can drive a clause with no obligor
 *  into the branch that writes `defaultedBy`, so an absence pin below measures the guard
 *  rather than a code path the fixture could never have reached. */
const crushingAll = () => ({
  get: (_sid, kind) => ((kind === 'economy' || kind === 'food') ? { score: 95 } : undefined),
});

const UNRESOLVED_DUTY = { kind: 'unknown', resolved: false, mutual: false, obligorId: '', obligeeId: '' };

/** THE WEEKLY-CLOCK PAIR, and it is load-bearing rather than decorative. A negotiated
 *  instrument runs on the CURRENT 52-tick year, so one installment is a fifty-second of
 *  the yearly share — MEASURED to round away entirely between the two evenly-matched
 *  six-month courts above, which would make "the mutual clause moved nothing" vacuously
 *  true. This pair is the case where a weekly stream is actually felt: a populous payer
 *  with real headroom beside a small, near-empty payee. */
const HEAVY_PAYER_MONTHS = 8;
const HEAVY_PAYEE_MONTHS = 1;
const HEAVY = [item('buyer', HEAVY_PAYEE_MONTHS, 1500), item('seller', HEAVY_PAYER_MONTHS, 6000)];

describe('CR-GR3B-3-R1 — the per-term obligation reader', () => {
  it('A2: a clause BOTH courts hold is MUTUAL — resolved, and with no transfer direction', () => {
    const record = pactRecord(mintPact({ fromId: 'buyer', toId: 'seller', trigger: 'shared_threat' }));
    expect(record.terms.map((t) => t.beneficiary), 'the real drafter emits the symmetric clause').toEqual(['both']);
    const duty = termObligationOf(record, record.terms[0]);
    expect(duty).toEqual({ kind: 'negotiated', resolved: true, mutual: true, obligorId: '', obligeeId: '' });
    // ASSERTED DIRECTLY, NEVER INFERRED FROM THE EMPTY IDS. `resolved: true` with no ids
    // is a REAL verdict — "both hold this, and nobody hands anything over" — which is a
    // different answer from `unknown`, and the two must never be read as one.
    expect(duty.mutual, 'mutuality is its own field').toBe(true);
    expect(duty.resolved, 'and the verdict is a real one').toBe(true);
    expect(termObligationOf(record, record.terms[0])).not.toEqual(UNRESOLVED_DUTY);

    // NO TRANSFER DIRECTION, MEASURED ON REAL GRANARIES. The ladder never drafts a
    // symmetric TRANSFER clause (security terms are the only symmetric family and both
    // are `stream: false`), so the movement half is probed on a deliberately hand-shaped
    // stream clause: were it ever reachable, payer and payee resolve to the empty id.
    const key = treatyPairKey('buyer', 'seller');
    const runWith = (beneficiary, pIndex = null, items = HEAVY) => advance(
      ledgerWorld({ ...record, terms: [{ ...term('tribute', { magnitude: 0.9 }), beneficiary }] }, key),
      pIndex, items,
    );
    const storedOf = (out) => getSpatialLedger(out.worldState, 'treaties')[key];

    // MOVEMENT. A mutual clause resolves to the empty pair, so PASS 2 finds no payer and
    // no payee and the tick is COMPLETELY inert — not a delta that happened to round to 0.
    const mutualOut = runWith('both');
    expect(mutualOut.changed, 'a mutual clause moves nothing whatsoever').toBe(false);
    expect(mutualOut.settlementUpdates, 'and emits no settlement write at all').toBeUndefined();
    // anchored: the SAME clause on the SAME pair with ONE beneficiary really does move
    // grain out of the counterparty and into the beneficiary, so the inertness above
    // measures mutuality rather than a fixture that had nothing to move.
    const oneSidedOut = runWith('buyer');
    expect(storedOf(oneSidedOut).terms[0].extractedFromLoser, 'the control really pays').toBeGreaterThan(0);
    expect(storedOf(oneSidedOut).terms[0].deliveredToVictor, 'and is really received').toBeGreaterThan(0);
    expect(monthsIn(oneSidedOut, 'seller'), "the counterparty's granary fell").toBeLessThan(HEAVY_PAYER_MONTHS);
    expect(monthsIn(oneSidedOut, 'buyer'), "and the beneficiary's rose").toBeGreaterThan(HEAVY_PAYEE_MONTHS);

    // THE DEFAULT WRITE, under an index that crushes every court INCLUDING the empty id a
    // mutual clause resolves to — the only input that reaches the branch the guard guards.
    const mutualCrushed = storedOf(runWith('both', crushingAll()));
    expect(mutualCrushed.complianceState, 'the probe really did drive it into default').toBe('defaulted');
    expectAbsentWithAnchor(
      Object.keys(mutualCrushed), 'defaultedBy', 'complianceState',
      'the mutual clause is live and its compliance verdict IS written, and it still names no oathbreaker',
    );
    // anchored: the same crushing index on the one-sided clause DOES name an oathbreaker.
    expect(storedOf(runWith('buyer', crushingAll())).defaultedBy, 'the control accuses').toBe('seller');
  });

  it('A3: a reciprocal ask is TWO one-sided clauses on ONE record, resolving in mirrored directions', () => {
    const record = pactRecord(mintPact({
      fromId: 'buyer', toId: 'seller', trigger: 'trade_demand', reciprocal: true,
    }));
    expect(record.terms, 'one instrument, two clauses').toHaveLength(2);
    expect(record.terms.map((t) => t.beneficiary).sort()).toEqual(['buyer', 'seller']);
    const duties = record.terms.map((t) => termObligationOf(record, t));
    for (const duty of duties) {
      expect(duty.kind).toBe('negotiated');
      expect(duty.resolved).toBe(true);
      expect(duty.mutual, 'a reciprocal pair is NOT symmetric — each clause has a direction').toBe(false);
    }
    // MIRRORED: each clause's obligee is the other clause's obligor, on the same record.
    expect(duties[0].obligeeId).toBe(duties[1].obligorId);
    expect(duties[1].obligeeId).toBe(duties[0].obligorId);
    expect([duties[0].obligorId, duties[0].obligeeId].sort()).toEqual(['buyer', 'seller']);

    // WHEN BOTH DEFAULT the scalar `defaultedBy` names the obligor of the LAST defaulting
    // clause in stored order (§6.3's declared, vetoable rule) — DERIVED from the stored
    // record, never restated as a literal.
    const key = treatyPairKey('buyer', 'seller');
    const stored = getSpatialLedger(advance(ledgerWorld(record, key), crushingAll()).worldState, 'treaties')[key];
    expect(stored.complianceState, 'both clauses really did default').toBe('defaulted');
    expect(stored.terms.every((t) => t.complianceState === 'defaulted')).toBe(true);
    const last = stored.terms[stored.terms.length - 1];
    expect(stored.defaultedBy).toBe(termObligationOf(stored, last).obligorId);
    // anchored: the two clauses have OPPOSED obligors (asserted above), so naming the last
    // one is a choice this record can distinguish rather than the only answer available.
    expect(termObligationOf(stored, stored.terms[0]).obligorId).not.toBe(stored.defaultedBy);
    expect(typeof stored.defaultedBy, 'and the key stays a SCALAR string').toBe('string');
  });

  it('A6: every malformed or boundary shape FAILS CLOSED — no guess, no placeholder, no throw', () => {
    const parties = ['buyer', 'seller'];
    /** @type {Array<[string, unknown, unknown]>} */
    const cases = [
      ['a beneficiary absent from parties', { parties }, { beneficiary: 'stranger' }],
      ['a one-party record', { parties: ['buyer'] }, { beneficiary: 'buyer' }],
      ['a three-party record', { parties: ['buyer', 'seller', 'third'] }, { beneficiary: 'buyer' }],
      ['an empty beneficiary', { parties }, { beneficiary: '' }],
      ['a beneficiary equal to BOTH entries', { parties: ['buyer', 'buyer'] }, { beneficiary: 'buyer' }],
      ['no parties key at all', {}, { beneficiary: 'buyer' }],
      ['a non-string party id', { parties: [null, 'seller'] }, { beneficiary: 'seller' }],
      ['parties that is not an array', { parties: 'buyer,seller' }, { beneficiary: 'buyer' }],
      ['a null treaty', null, { beneficiary: 'buyer' }],
      ['an undefined treaty', undefined, { beneficiary: 'buyer' }],
      ['a null term', { parties }, null],
      ['an undefined term', { parties }, undefined],
      ['both null', null, null],
    ];
    for (const [why, treaty, termRow] of cases) {
      const duty = termObligationOf(treaty, termRow);
      expect(duty, why).toEqual(UNRESOLVED_DUTY);
      expect(`${duty.obligorId}${duty.obligeeId}`, `${why}: never the word "undefined"`).toBe('');
    }
    // anchored: the SAME reader resolves a well-formed clause one describe-block over, so
    // the thirteen unresolved verdicts above are a fail-closed policy rather than a reader
    // that can never resolve anything.
    const good = pactRecord(mintPact({ fromId: 'buyer', toId: 'seller', trigger: 'trade_demand' }));
    expect(termObligationOf(good, good.terms[0]).resolved).toBe(true);

    // AND NO `defaultedBy` IS WRITTEN for a clause naming a party the record does not
    // carry, even when the pass drives it all the way into default.
    const key = treatyPairKey('buyer', 'seller');
    const orphan = { ...good, terms: [{ ...term('tribute', { magnitude: 0.9 }), beneficiary: 'stranger' }] };
    const stored = getSpatialLedger(advance(ledgerWorld(orphan, key), crushingAll()).worldState, 'treaties')[key];
    expect(stored.complianceState, 'the probe really did reach the default branch').toBe('defaulted');
    expectAbsentWithAnchor(
      Object.keys(stored), 'defaultedBy', 'complianceState',
      'the compliance verdict IS written and the nameless clause still accuses nobody',
    );
  });

  it('A7: the per-term resolution survives save and load on a byte-identical record', () => {
    const first = mintPact({ fromId: 'buyer', toId: 'seller', trigger: 'trade_demand', reciprocal: true });
    const second = mintPact({
      fromId: 'seller', toId: 'buyer', trigger: 'shared_threat', signTick: 20, worldState: first.worldState,
    });
    expect(second.amended, 'ONE record, two lineage acts').toBe(true);
    const before = pactRecord(second);
    expect(before.terms, 'a mutual clause beside a mirrored pair').toHaveLength(3);

    const hydrated = ensureWorldState(JSON.parse(JSON.stringify(second.worldState)));
    const after = getSpatialLedger(hydrated, 'treaties')[treatyPairKey('buyer', 'seller')];
    expect(JSON.stringify(after), 'the record is byte-identical across the trip').toBe(JSON.stringify(before));
    expect(after.terms.map((t) => termObligationOf(after, t)))
      .toEqual(before.terms.map((t) => termObligationOf(before, t)));
    // …and both sides carry REAL verdicts, not two matching unresolved ones.
    expect(after.terms.map((t) => termObligationOf(after, t).kind)).toEqual(['negotiated', 'negotiated', 'negotiated']);
    expect(after.terms.filter((t) => termObligationOf(after, t).mutual)).toHaveLength(1);
    expect(after.terms.filter((t) => termObligationOf(after, t).obligorId)).toHaveLength(2);
  });

  it('the per-term vocabulary is CLOSED, and the instrument vocabulary is NOT widened', () => {
    expect([...TERM_OBLIGATION_KINDS].sort()).toEqual(['negotiated', 'sale', 'unknown', 'wartime']);
    // A SUPERSET BY EXACTLY ONE. The three instrument kinds pass through the delegation
    // arm; `negotiated` is the only kind this reader can add.
    expect([...TREATY_ORIENTATION_KINDS].sort()).toEqual(['sale', 'unknown', 'wartime']);
    expect(TREATY_ORIENTATION_KINDS.filter((k) => !TERM_OBLIGATION_KINDS.includes(k))).toEqual([]);
    expect(TERM_OBLIGATION_KINDS.filter((k) => !TREATY_ORIENTATION_KINDS.includes(k))).toEqual(['negotiated']);
    // The ROLE WORDS are not widened either: no consumer speaks a negotiated role yet, and
    // unconsumed vocabulary is the recorded self-referential-pin habitat.
    expect(Object.keys(TREATY_ROLE_WORDS).sort()).toEqual([...TREATY_ORIENTATION_KINDS].sort());

    // EVERY KIND THE READER CAN ACTUALLY EMIT IS A DECLARED MEMBER — walked over one
    // instrument of each provenance, so the closure is measured rather than asserted.
    const negotiated = pactRecord(mintPact({ fromId: 'buyer', toId: 'seller', trigger: 'trade_demand' }));
    const mutual = pactRecord(mintPact({ fromId: 'buyer', toId: 'seller', trigger: 'shared_threat' }));
    const emitted = [
      termObligationOf(warTreaty([term('tribute')]), term('tribute')),
      termObligationOf(saleTreaty([term('tribute')]), term('tribute')),
      termObligationOf(negotiated, negotiated.terms[0]),
      termObligationOf(mutual, mutual.terms[0]),
      termObligationOf({}, {}),
    ].map((duty) => duty.kind);
    expect([...new Set(emitted)].sort()).toEqual([...TERM_OBLIGATION_KINDS].sort());
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('CR-WR10-G — the four structurally-requires rows', () => {
  it('THE STREAM DRAWS FROM THE BUYER on a sale, and from the loser on a war settlement', () => {
    const key = treatyPairKey('buyer', 'seller');
    const sale = advance(ledgerWorld(saleTreaty([term('tribute', { magnitude: 0.9 })]), key));
    const t = getSpatialLedger(sale.worldState, 'treaties')[key].terms.find((x) => x.type === 'tribute');
    // THE LEDGER'S OWN RECORD of who lost and who gained — exact, unrounded by display.
    expect(t.extractedFromLoser, 'the obligor actually paid').toBeGreaterThan(0);
    expect(t.deliveredToVictor, 'the obligee actually received').toBeGreaterThan(0);
    // THE DIRECTION, MEASURED ON REAL GRANARIES: the BUYER's fell, the SELLER's did not.
    expect(monthsIn(sale, 'buyer'), "the buyer's granary fell").toBeLessThan(BUYER_MONTHS);
    expect(monthsIn(sale, 'seller'), "the seller's granary did not pay").toBeGreaterThanOrEqual(SELLER_MONTHS);
    expect(monthsIn(sale, 'seller'), 'and it received').toBeGreaterThan(SELLER_MONTHS);

    // THE CONTROL, SAME PARTIES, SAME TERM, WAR ORIENTATION: the flow REVERSES, so the
    // assertion above measures the orientation rather than which fixture is richer.
    const war = advance(ledgerWorld(warTreaty([term('tribute', { magnitude: 0.9 })]), key));
    expect(monthsIn(war, 'seller'), "the war loser's granary fell").toBeLessThan(SELLER_MONTHS);
    expect(monthsIn(war, 'buyer'), 'the war victor received').toBeGreaterThan(BUYER_MONTHS);
  });

  it('THE DEFAULT IS NEVER WRITTEN NAMELESS: a sale names the buyer, an orientation-less record names nobody', () => {
    const key = treatyPairKey('buyer', 'seller');
    const sale = advance(
      ledgerWorld(saleTreaty([term('tribute', { magnitude: 0.9 })]), key), crushing('buyer'),
    );
    const stored = getSpatialLedger(sale.worldState, 'treaties')[key];
    expect(stored.complianceState, 'the crushed obligor is observed in default').toBe('defaulted');
    expect(stored.defaultedBy, 'the BUYER is the oathbreaker on a sale').toBe('buyer');
    // anchored: `defaultedBy` was just asserted to be the live string 'buyer', so this
    // exclusion measures a real value rather than an absent key.
    expect(stored.defaultedBy).not.toBe('undefined');

    // THE ORIENTATION-LESS RECORD may not accuse anyone — and reaching that branch takes
    // a deliberate probe, because an unresolved treaty's obligor is the EMPTY id and the
    // ordinary pressure index has no entry for it, so its terms can never strain at all.
    // Crushing the empty id is the only input that drives the write the guard guards; a
    // pin that skipped this would assert an absence the code could never have produced.
    const orphanKey = treatyPairKey('buyer', 'seller');
    const orphanTreaty = saleTreaty([term('tribute', { magnitude: 0.9 })], { sellerId: undefined, buyerId: undefined });
    const orphan = advance(ledgerWorld(orphanTreaty, orphanKey), crushing(''));
    const orphanStored = getSpatialLedger(orphan.worldState, 'treaties')?.[orphanKey];
    expect(orphanStored, 'the nameless record survives the pass').toBeTruthy();
    expect(orphanStored.complianceState, 'the probe really did drive it into default').toBe('defaulted');
    expectAbsentWithAnchor(
      Object.keys(orphanStored), 'defaultedBy', 'complianceState',
      'the record is live and its compliance verdict IS written, and it still names no oathbreaker',
    );

    // AND THE HONEST PRODUCTION FACT beside the probe: with an ordinary index, a treaty
    // that cannot say who owes it simply never strains, so nothing is written at all.
    const inert = advance(
      ledgerWorld(saleTreaty([term('tribute', { magnitude: 0.9 })], { sellerId: undefined, buyerId: undefined }), orphanKey),
      crushing('buyer'),
    );
    expect(getSpatialLedger(inert.worldState, 'treaties')[orphanKey].complianceState).toBe('honored');
  });

  it('THE CAP BINDS THE BUYER on a sale — and the seller walks free of it', () => {
    const key = treatyPairKey('buyer', 'seller');
    const world = ledgerWorld(saleTreaty([term('demilitarization', { magnitude: 0.6 })]), key);
    const buyerCap = demilitarizationCapFor(world, 'buyer', 10);
    expect(buyerCap, 'the obligor bears the cap').toBeCloseTo(0.4, 6);
    // anchored: the buyer's cap is a live number one line above, so a null here is the
    // seller's genuine freedom from a term it did not promise.
    expect(demilitarizationCapFor(world, 'seller', 10), 'the obligee bears nothing').toBeNull();

    // THE WAR CONTROL: the identical term on the historic orientation binds the LOSER,
    // which is the seller — the exact reverse, on the same two names.
    const warWorld = ledgerWorld(warTreaty([term('demilitarization', { magnitude: 0.6 })]), key);
    expect(demilitarizationCapFor(warWorld, 'seller', 10)).toBeCloseTo(0.4, 6);
    expect(demilitarizationCapFor(warWorld, 'buyer', 10)).toBeNull();
  });

  it('THE OCCUPATION HOLD is directional through the same reader, on both instruments', () => {
    const key = treatyPairKey('buyer', 'seller');
    const sale = ledgerWorld(saleTreaty([term('occupation_continuation', { magnitude: 0.5 })]), key);
    expect(occupationHoldFor(sale, 'buyer', 'seller', 10), 'obligor held by obligee').toBe(true);
    // anchored: the true direction is asserted one line above, so this false is the
    // reversal being refused rather than a read that always returns false.
    expect(occupationHoldFor(sale, 'seller', 'buyer', 10)).toBe(false);

    const war = ledgerWorld(warTreaty([term('occupation_continuation', { magnitude: 0.5 })]), key);
    expect(occupationHoldFor(war, 'seller', 'buyer', 10), 'loser held by victor').toBe(true);
    expect(occupationHoldFor(war, 'buyer', 'seller', 10)).toBe(false);
  });

  it('THE CONVEYANCE derives its seller and buyer from the sale fields, not from a war pair', () => {
    const assetId = 'holding';
    const worldState = {
      simulationRules: { ...SOVEREIGNTY_LIT },
      occupations: { [assetId]: { ...createOccupationRecord('seller', 3), state: 'vassalized', stateHeld: 9, resistance: 0.04 } },
      relationshipStates: {},
    };
    const treaty = saleTreaty([{ type: 'sovereignty_transfer', family: 'sovereignty_transfer', assetId }]);
    const out = executeTreatyConveyances({
      treaty, worldState, settlementUpdates: [], edges: EDGES, tick: 12, now: null,
    });
    expect(out.worldState.occupations[assetId].occupierId, 'the BUYER holds it now').toBe('buyer');
    expect(out.worldState.occupations[assetId].state, 'the rung survived').toBe('vassalized');
    // The document recorded what it did, and named no war.
    expect(treaty.receipts.join(' ')).toContain('seller');
    expect(treaty.receipts.join(' ')).toContain('buyer');
    // The receipts were just proved non-empty and to name both courts.
    // anchored: the exclusion measures prose, not an empty string.
    expect(treaty.receipts.join(' ')).not.toContain('undefined');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('CR-WR10-G — the display surface renders no "undefined"', () => {
  it('a sale document resolves every party slot, names the instrument, and carries the holding', () => {
    const key = treatyPairKey('buyer', 'seller');
    const world = ledgerWorld(saleTreaty([
      { type: 'sovereignty_transfer', family: 'sovereignty_transfer', assetId: 'holding', magnitude: 1,
        mintedTick: 0, expiresTick: 100, complianceState: 'honored', burden01: 0 },
      term('tribute', { magnitude: 0.3 }),
    ]), key);
    const doc = treatyDocument(world, key);
    expect(doc, 'the document is live').toBeTruthy();
    expect(doc.orientationKind).toBe('sale');
    expect(doc.victorId, 'the receiver fills the historic victor slot').toBe('buyer');
    expect(doc.loserId, 'the giver fills the historic loser slot').toBe('seller');
    expect(doc.victorName).toBe('Buyer Court');
    expect(doc.loserName).toBe('Seller Court');
    expect(doc.receiverRole).toBe('the buyer');
    expect(doc.giverRole).toBe('the seller');
    expect(doc.terms.find((t) => t.type === 'sovereignty_transfer').assetId).toBe('holding');
    // THE DEEP SCAN. Every reachable string in what four display surfaces consume.
    const strings = allStrings(doc);
    expect(strings.length, 'the scan reached real prose').toBeGreaterThan(5);
    // The scan was just proved non-empty and the party names were asserted above.
    // anchored: the exclusion measures rendered values, not an empty walk.
    expect(strings).not.toContain('undefined');
    expect(strings.some((s) => s.includes('undefined'))).toBe(false);
  });

  it('a SALE ties a sphere and strains its buyer — the two consumers the totality claim missed', () => {
    // CR-WR10-G's claim is that EVERY consumer asks the reader. Two did not: the hegemony
    // sphere census and the revanchism burden read both spelled `treaty.victorId` /
    // `treaty.loserId` off a ledger row. Neither crashed on a victor-free sale — they read
    // the empty string and dropped the document — so the defect was a SILENCE: a court
    // that had just mortgaged itself to buy a town appeared in no sphere and bore no
    // strain. Both now ask the reader, and this pin is the behaviour that proves it, on a
    // sale document whose subordinating term really does bind the buyer.
    const key = treatyPairKey('buyer', 'seller');
    const sphereOf = (treaty) => hegemonyRead({
      worldState: ledgerWorld(treaty, key), settlements: PARTIES, minTies: 1,
    });

    const sale = sphereOf(saleTreaty([term('tribute', { magnitude: 0.9, burden01: 0.8 })]));
    expect(sale.hasHegemony, 'a sale tie is a subordinate tie like any other').toBe(true);
    expect(sale.spheres.length).toBe(1);
    expect(sale.spheres[0].centerId, 'the SELLER is owed, so the seller holds the tie').toBe('seller');
    expect(sale.spheres[0].members.map((m) => m.id), 'and the buyer is the subordinate').toEqual(['buyer']);

    // THE WAR CONTROL, same two names, same term: the direction REVERSES, so the read
    // above measures the orientation rather than which id sorts first.
    const war = sphereOf(warTreaty([term('tribute', { magnitude: 0.9, burden01: 0.8 })]));
    expect(war.spheres[0].centerId, 'the victor holds the wartime tie').toBe('buyer');
    expect(war.spheres[0].members.map((m) => m.id)).toEqual(['seller']);

    // The revanchism burden read is the second converted consumer; its direction is
    // pinned where its fixtures live (settlementPoliticsPins — "A SALE BURDENS ITS
    // BUYER"), and its membership in this ruling is held by the census below.
  });

  it('the historic war document is byte-identical in every field this ruling touched', () => {
    const key = treatyPairKey('buyer', 'seller');
    const doc = treatyDocument(ledgerWorld(warTreaty([term('tribute')]), key), key);
    expect(doc.victorId).toBe('buyer');
    expect(doc.loserId).toBe('seller');
    expect(doc.victorName).toBe('Buyer Court');
    expect(doc.loserName).toBe('Seller Court');
    expect(doc.pairKey).toBe(key);
    expect(doc.orientationKind).toBe('wartime');
    // A term with no assetId gains NO key — the drop-when-absent discipline, so every
    // treaty minted before WR-10 reads exactly as it always did.
    expect(Object.prototype.hasOwnProperty.call(doc.terms[0], 'assetId')).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THE CONSUMER CENSUS. CR-WR10-G's header makes a TOTALITY claim — "the orientation is
// read once, here, and every consumer asks this module instead of spelling the fields
// itself" — and a totality claim that nothing measures is a sentence, not a law. The
// first round-2 verification found it short by two: `hegemony.js` and
// `settlementPolitics.js` both spelled `treaty.victorId` / `treaty.loserId` straight off
// a ledger row. Neither threw on a victor-free sale; each read the empty string and
// dropped the document, so the gap was invisible to every existing test in the tree.
//
// The walk is TWO-WAY on purpose, because one-way coverage is how the last census went
// blind (R19): the DECLARED consumers must each import the reader, AND the discovered
// set of ledger-reading modules that still spell the war pair in code must be exactly the
// declared WRITER set. A new consumer that reads a treaty's parties by hand reds here on
// the day it lands, and a declared consumer that quietly stops asking reds too.
// ═══════════════════════════════════════════════════════════════════════════════
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Every module that resolves a treaty's parties, and why it must ask the reader. */
const ORIENTATION_CONSUMERS = Object.freeze([
  ['worldPulse/peaceTerms.js', "PASS 2's obligor drives the granary, the monitor reach, the strain accrual and the defaultedBy write"],
  ['worldPulse/peaceTermsDocument.js', 'the historic victor/loser slots four display surfaces read are RESOLVED, not copied'],
  ['worldPulse/treatyEnforcement.js', 'the cap and the occupation hold bind the party the terms bind'],
  ['worldPulse/sovereigntyTransfer.js', 'the conveyance runs giver → receiver, which is the OTHER axis'],
  ['worldPulse/sovereigntyMarketStage.js', 'the resale cooldown silences a holding\'s GIVER, war or sale alike'],
  ['worldPulse/hegemony.js', 'a sphere is a pattern in the obligation axis: the obligee holds the tie'],
  ['worldPulse/settlementPolitics.js', 'revanchism accrues on the party a treaty BINDS'],
]);

/** The ONE module allowed to spell the war pair in code: it WRITES those fields onto the
 *  record it mints, and reads them back off a carried term sheet — neither of which is a
 *  ledger row whose orientation is in question. */
const WAR_PAIR_WRITERS = Object.freeze(['worldPulse/peaceTerms.js']);

/** A module reads the treaty ledger when it names it. */
const READS_LEDGER_RE = /treatyLedgerOf\s*\(|['"`]treaties['"`]|\.treaties\b/;
/** A raw war-pair field access — the spelling this ruling replaced. */
const RAW_PAIR_RE = /\.(?:victorId|loserId)\b/;
/** Comments carry the OLD spelling on purpose (they explain what was cured), so the scan
 *  reads code only. A crude strip is correct here: a false positive costs a red, never a
 *  miss, and the negative control below proves the stripper does not swallow live code. */
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');

function walkJs(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkJs(p, out);
    else if (p.endsWith('.js')) out.push(p);
  }
  return out;
}

/** Every src/domain module that reads the treaty ledger, with what it spells. */
function ledgerReaders() {
  return walkJs(join(ROOT, 'src/domain')).map((p) => {
    const source = readFileSync(p, 'utf8');
    const code = stripComments(source);
    return {
      rel: relative(join(ROOT, 'src'), p).replace(/\\/g, '/'),
      readsLedger: READS_LEDGER_RE.test(code),
      spellsRawPair: RAW_PAIR_RE.test(code),
      asksTheReader: /from '\.\/treatyOrientation\.js'|from '\.\.\/worldPulse\/treatyOrientation\.js'/.test(source),
    };
  });
}

describe('CR-WR10-G — the consumer census (the totality claim, measured)', () => {
  it('EVERY DECLARED CONSUMER ASKS THE READER', () => {
    const byRel = new Map(ledgerReaders().map((row) => [row.rel, row]));
    const silent = [];
    for (const [rel] of ORIENTATION_CONSUMERS) {
      const row = byRel.get(`domain/${rel}`);
      expect(row, `${rel} is in the tree at the address this census names`).toBeTruthy();
      if (!row.asksTheReader) silent.push(rel);
    }
    expect(silent, 'these modules resolve a treaty\'s parties without asking').toEqual([]);
    expect(ORIENTATION_CONSUMERS.length, 'and the census is not an empty list').toBeGreaterThan(6);
  });

  it('NO LEDGER READER SPELLS THE WAR PAIR BY HAND — except the writer that mints it', () => {
    const offenders = ledgerReaders()
      .filter((row) => row.readsLedger && row.spellsRawPair)
      .map((row) => row.rel.replace(/^domain\//, ''))
      .sort();
    expect(offenders, 'the raw spelling survives only where the fields are WRITTEN')
      .toEqual([...WAR_PAIR_WRITERS].sort());

    // THE WALK IS LIVE, not an empty directory scan: the ledger-reading population is
    // real, and the two modules this round converted are inside it.
    const readers = ledgerReaders().filter((row) => row.readsLedger).map((row) => row.rel);
    expect(readers.length, 'the ledger really is read across the tree').toBeGreaterThan(8);
    expect(readers).toContain('domain/worldPulse/hegemony.js');
    expect(readers).toContain('domain/worldPulse/settlementPolitics.js');
  });

  it('THE DETECTOR ITSELF: it sees a raw read, and is not fooled by a comment', () => {
    // A census whose scanner has quietly stopped matching passes forever. Both halves are
    // exercised on synthetic sources, so the assertions above measure the tree rather
    // than a regex that no longer fires.
    const live = 'const centerId = String(treaty.victorId ?? "");';
    const commented = '// this used to read String(treaty.victorId) and it lied.';
    expect(RAW_PAIR_RE.test(stripComments(live)), 'a live read is seen').toBe(true);
    expect(RAW_PAIR_RE.test(stripComments(commented)), 'a comment about it is not').toBe(false);
    expect(READS_LEDGER_RE.test("getSpatialLedger(ws, 'treaties')"), 'and a ledger read is seen').toBe(true);
  });
});
