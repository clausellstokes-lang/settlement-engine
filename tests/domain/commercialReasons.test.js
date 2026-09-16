/**
 * commercialReasons.test.js — TR-1's behavioural pins: the negatives hardest.
 *
 * The named pins of DESIGN_FP_TRADE.md §5 TR-1 and DESIGN_FP_ARCH_TR.md §4, each executed
 * here: healthy-partnership-mints-nothing, the amendment-B suppression receipt naming its
 * stock read, decay-to-zero when the producing state heals, the T-7 TELLABLE (a compact
 * kept nine 52-week years and broken in the ninth), the JSON round-trip, and the
 * same-state re-derivation THE PROMISE requires.
 *
 * ⚠ THE CORPUS IS SWEPT, NOT GENERATED — a disclosed divergence from the architecture's
 * wording, made deliberately and recorded rather than glossed. The architecture asks for
 * "generated corpora"; TR-1 ships as a DARK INSTRUMENT with no kernel mount, so no
 * generated world runs this writer at all and a generated-world pin would exercise the
 * generator rather than the ledger. What is swept instead is the ledger's OWN evidence
 * space — every relationship type the estate defines, crossed with the toll, salience,
 * trust and resentment ranges the three live scorers read — which is a strictly larger
 * sample of the thing under test. The generated-world arm is DEFERRED to the wiring wave
 * that mounts this writer in the pulse, where it can be honest; it is written down here
 * so it is not re-found as a gap.
 */
import { describe, expect, test } from 'vitest';

import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { RELATIONSHIP_DEFAULTS } from '../../src/domain/worldPulse/relationshipState.js';
import {
  COMMERCIAL_REASON_MIRRORS,
  PARTNERSHIP_REASON_TYPES,
  SEVERANCE_REASON_TYPES,
} from '../../src/domain/worldPulse/commercialReasonTaxonomy.js';
import {
  COMMERCIAL_REASONS_LEDGER,
  COMMERCIAL_REASON_TUNING,
  advanceCommercialReasons,
  amendmentBSuppressions,
  casusCommerciiActive,
  commercialPairKey,
  makeCommercialPressureRead,
  scoreCommercialReasons,
} from '../../src/domain/worldPulse/commercialReasons.js';

const SEVERANCE = new Set(SEVERANCE_REASON_TYPES);
const LIT = Object.freeze({ casusCommerciiEnabled: true });

/** A two-town snapshot with one authored edge. Names resolve, so receipts can address. */
function snapshotOf(relationshipType, extra = {}) {
  const byId = new Map([
    ['a', { id: 'a', name: 'Aldenmoor', settlement: { id: 'a', name: 'Aldenmoor' } }],
    ['b', { id: 'b', name: 'Thornwall', settlement: { id: 'b', name: 'Thornwall' } }],
  ]);
  return {
    byId,
    settlements: [{ id: 'a' }, { id: 'b' }],
    relationships: [{ from: 'a', to: 'b', relationshipType }],
    worldState: {
      relationshipStates: {
        'a|b': { relationshipType, ...(RELATIONSHIP_DEFAULTS[relationshipType] || {}), ...extra },
      },
    },
  };
}

/** A world carrying only the ledgers TR-1 reads. */
const worldOf = (ledgers = {}) => (Object.keys(ledgers).length ? { spatialLedgers: { ...ledgers } } : {});

/** Every severance record on a directed pair. */
function severancesOf(ledger, fromId, toId) {
  const rows = ledger?.[commercialPairKey(fromId, toId)] || [];
  return rows.filter((row) => SEVERANCE.has(row.type));
}

describe('TR-1 the gate — dark is a no-op, not a quiet run', () => {
  test('an absent or false flag returns the world\'s OWN reference and no ledger', () => {
    const worldState = worldOf({ entrepots: { b: { centrality: 0.95, toll: 1 } } });
    for (const rules of [undefined, {}, { casusCommerciiEnabled: false }, { casusCommerciiEnabled: 'true' }, { casusCommerciiEnabled: 1 }]) {
      const out = advanceCommercialReasons({ snapshot: snapshotOf('hostile'), worldState, tick: 9, rules });
      expect(out.worldState, JSON.stringify(rules)).toBe(worldState);
      expect(out.ledger).toBeNull();
      expect(out.crossings).toEqual([]);
      expect(out.suppressions).toEqual([]);
      expect(casusCommerciiActive(rules)).toBe(false);
    }
    // anchored: the SAME world and snapshot DO mint under a strict-true flag, so every
    // absence above is the gate working rather than a fixture that could never produce.
    const lit = advanceCommercialReasons({ snapshot: snapshotOf('hostile'), worldState, tick: 9, rules: LIT });
    expect(lit.ledger).toBeTruthy();
    expect(casusCommerciiActive(LIT)).toBe(true);
  });
});

describe('TR-1 the negative arm — a healthy partnership mints no severance', () => {
  test('across the whole live evidence space, no warm pair acquires a grievance', () => {
    // THE SWEEP. Every relationship type the estate defines that is not a no-trade type,
    // crossed with fair-or-better tolls and the full salience range. A healthy pair may
    // and should accrue PARTNERSHIP records; what it must never do is acquire a severance.
    const warmTypes = Object.keys(RELATIONSHIP_DEFAULTS).filter((type) => type !== 'hostile');
    const fairTolls = [0, 0.1, 0.2, 0.3, 0.4];
    let mintedPartnerships = 0;
    let cases = 0;
    for (const type of warmTypes) {
      for (const toll of fairTolls) {
        for (const centrality of [0, 0.3, 0.6, 0.95]) {
          const snapshot = snapshotOf(type, { resentment: 0 });
          const worldState = worldOf({ entrepots: { b: { centrality, toll } } });
          const out = advanceCommercialReasons({ snapshot, worldState, tick: 4, rules: LIT });
          cases += 1;
          const grievances = severancesOf(out.ledger, 'a', 'b').map((row) => row.type);
          expect(grievances, `${type} toll=${toll} centrality=${centrality}`).toEqual([]);
          mintedPartnerships += (out.ledger?.[commercialPairKey('a', 'b')] || []).length;
        }
      }
    }
    expect(cases).toBeGreaterThanOrEqual(160);
    // NON-VACUITY, BOTH WAYS. The sweep must have produced SOMETHING (or it proves only
    // that the writer is dead), and the same machinery must produce a severance when the
    // state actually warrants one (or the absence above is a fixture that cannot mint).
    expect(mintedPartnerships).toBeGreaterThan(0);
    const gouged = advanceCommercialReasons({
      snapshot: snapshotOf('trade_partner'),
      worldState: worldOf({ entrepots: { b: { centrality: 0.9, toll: 1 } } }),
      tick: 4,
      rules: LIT,
    });
    expect(severancesOf(gouged.ledger, 'a', 'b').map((row) => row.type)).toEqual(['toll_extortion']);
  });

  test('a hostile pair\'s exclusion only bites when the tie it cut was worth something', () => {
    // The same read, both signs, and the FALSE branch reachable: shutting a market nobody
    // used is not an injury, which is why market_exclusion is scaled by salience rather
    // than minted on the relationship label alone.
    const out = advanceCommercialReasons({
      snapshot: snapshotOf('hostile'), worldState: worldOf(), tick: 3, rules: LIT,
    });
    expect(severancesOf(out.ledger, 'a', 'b').map((row) => row.type)).not.toContain('market_exclusion');
    // And the scorer DOES mint it once the tie carries value — proved directly, since no
    // trade-link fixture in this file gives the salience read anything to find.
    const { scored } = scoreCommercialReasons({ marketClosed: true, salience01: 0.9, trust01: 0, resentment01: 0 });
    const exclusion = scored.find((row) => row.type === 'market_exclusion');
    expect(exclusion.magnitude01).toBeGreaterThan(COMMERCIAL_REASON_TUNING.MIN_MAGNITUDE);
  });
});

describe('TR-1 amendment B — a casus contradicted by a live read scores nothing', () => {
  test('famine_profiteering against physically empty warehouses is struck out, with the read named', () => {
    const snapshot = snapshotOf('trade_partner');
    // The belief-side producer does not exist yet, so the seam supplies the grievance —
    // which is the ONLY way this arm is reachable today and is why it is driven here.
    const seams = { [commercialPairKey('a', 'b')]: { famine_profiteering: { severance01: 0.9 } } };

    // ARM ONE — the warehouses hold grain: the casus stands.
    const stocked = advanceCommercialReasons({
      snapshot,
      worldState: worldOf({ commodityStocks: { b: { grain: 40 } } }),
      tick: 7,
      rules: LIT,
      seams,
    });
    expect(stocked.suppressions).toEqual([]);

    // ARM TWO — the warehouses stand empty: the casus is REFUSED, not merely reduced.
    const empty = advanceCommercialReasons({
      snapshot,
      worldState: worldOf({ commodityStocks: { b: { grain: 0 } } }),
      tick: 7,
      rules: LIT,
      seams,
    });
    expect(severancesOf(empty.ledger, 'a', 'b').map((row) => row.type)).not.toContain('famine_profiteering');
    expect(empty.suppressions).toHaveLength(1);
    const [strike] = empty.suppressions;
    expect(strike.type).toBe('famine_profiteering');
    // THE RECEIPT NAMES THE READ. Not "a read said otherwise" — the exact engine address a
    // reader can go and look at.
    expect(strike.read).toBe('spatialLedgers.commodityStocks');
    expect(strike.receipt.length).toBeGreaterThan(0);
    expect(strike.pairKey).toBe(commercialPairKey('a', 'b'));

    // SILENCE IS NOT EVIDENCE. A world that has never run the commodity layer has no stock
    // read at all, and an absent read must contradict nothing — otherwise the suppression
    // would strike out every casus in every world before the first caravan moved.
    const silent = advanceCommercialReasons({ snapshot, worldState: worldOf(), tick: 7, rules: LIT, seams });
    expect(silent.suppressions).toEqual([]);
    expect(amendmentBSuppressions({})).toEqual([]);
    expect(amendmentBSuppressions({ stockUnits: 0 })).toHaveLength(1);
  });

  test('a suppressed casus leaves NO zero-magnitude row behind', () => {
    // The ledger records live magnitudes only. A zero row would be exactly the ratchet
    // this layer refuses — a grievance the world can hold forever without paying for it.
    const out = advanceCommercialReasons({
      snapshot: snapshotOf('trade_partner'),
      worldState: worldOf({ commodityStocks: { b: { grain: 0 } } }),
      tick: 7,
      rules: LIT,
      seams: { [commercialPairKey('a', 'b')]: { famine_profiteering: { severance01: 0.9 } } },
    });
    for (const row of out.ledger?.[commercialPairKey('a', 'b')] || []) {
      expect(row.magnitude01).toBeGreaterThanOrEqual(COMMERCIAL_REASON_TUNING.MIN_MAGNITUDE);
    }
  });
});

describe('TR-1 decay — the record drops when the producing state heals', () => {
  test('a healed toll drops the pair, and an emptied ledger drops its whole namespace', () => {
    const snapshot = snapshotOf('trade_partner');
    const gouging = worldOf({ entrepots: { b: { centrality: 0.9, toll: 1 } } });
    const angry = advanceCommercialReasons({ snapshot, worldState: gouging, tick: 10, rules: LIT });
    expect(severancesOf(angry.ledger, 'a', 'b')).toHaveLength(1);

    // The toll comes down. Nothing decays the record on a timer — it simply is not
    // recomputed, which is what state-derived presence means.
    const healed = worldOf({ entrepots: { b: { centrality: 0.9, toll: 0 } } });
    const calm = advanceCommercialReasons({
      snapshot, worldState: { ...healed, spatialLedgers: { ...healed.spatialLedgers, [COMMERCIAL_REASONS_LEDGER]: angry.ledger } }, tick: 30, rules: LIT,
    });
    expect(severancesOf(calm.ledger, 'a', 'b')).toEqual([]);

    // AND THE DROP IS TOTAL. A world whose grievances all healed carries no key at all —
    // byte-identical to one that never had any.
    const soleLedger = { spatialLedgers: { [COMMERCIAL_REASONS_LEDGER]: angry.ledger } };
    const emptied = advanceCommercialReasons({
      snapshot: snapshotOf('allied'), worldState: soleLedger, tick: 40, rules: LIT,
    });
    expect(emptied.ledger).toBeNull();
    expect('spatialLedgers' in emptied.worldState).toBe(false);
  });
});

describe('TR-1 the T-7 TELLABLE — nine years kept, and the ninth broken', () => {
  test('a compact honored nine 52-week years carries its own age, then the breach mints', () => {
    // The clock is the estate's, not this wave's: 52-week years through the treaty clock's
    // own constant, so a change to the world's year length moves this fixture with it.
    const year = CURRENT_TREATY_TICKS_PER_YEAR;
    expect(year).toBe(52);
    const snapshot = snapshotOf('trade_partner');
    const pairKey = commercialPairKey('a', 'b');
    const honored = { [pairKey]: { contract_default: { partnership01: 0.8 } } };

    let worldState = worldOf();
    let ledger = null;
    for (let y = 0; y < 9; y += 1) {
      const out = advanceCommercialReasons({
        snapshot, worldState, tick: y * year, rules: LIT, seams: honored,
      });
      worldState = out.worldState;
      ledger = out.ledger;
    }
    const kept = (ledger[pairKey] || []).find((row) => row.type === 'contract_honored');
    expect(kept).toBeTruthy();
    // THE SLOW CLOCK. atTick survives every refold, so the ledger can say how long the
    // compact has stood — nine years, in the world's own weeks.
    expect(kept.atTick).toBe(0);
    const nowTick = 8 * year;
    expect((nowTick - kept.atTick) / year).toBe(8);
    // The receipt is stable across all nine folds — a standing compact says the same
    // sentence, it does not re-roll its prose every season.
    const first = advanceCommercialReasons({ snapshot, worldState: worldOf(), tick: 0, rules: LIT, seams: honored });
    expect(kept.receipt).toBe(first.ledger[pairKey].find((row) => row.type === 'contract_honored').receipt);
    expect(kept.receipt.length).toBeGreaterThan(0);

    // THE NINTH YEAR BREAKS IT. The same seam, the other sign.
    const breach = { [pairKey]: { contract_default: { severance01: 0.75 } } };
    const broken = advanceCommercialReasons({
      snapshot, worldState, tick: 9 * year, rules: LIT, seams: breach,
    });
    const rows = broken.ledger[pairKey].map((row) => row.type);
    expect(rows).toContain('contract_default');
    expect(rows).not.toContain('contract_honored');
    // The breach is a CROSSING the Herald may carry, minted EXACTLY ONCE on the tick it
    // crossed — and its casus receipt travels with it.
    const crossings = broken.crossings.filter((row) => row.casusType === 'contract_default');
    expect(crossings).toHaveLength(1);
    expect(crossings[0].kind).toBe('commercial_severance_crossing');
    expect(crossings[0].casusReceipt.length).toBeGreaterThan(0);
    // …and NOT again on the next tick, while the same breach still stands.
    const again = advanceCommercialReasons({
      snapshot, worldState: broken.worldState, tick: 9 * year + 1, rules: LIT, seams: breach,
    });
    expect(again.crossings.filter((row) => row.casusType === 'contract_default')).toEqual([]);
  });
});

describe('TR-1 lifecycle — persist, re-derive, round-trip', () => {
  test('the ledger survives a JSON round-trip byte-identically', () => {
    const out = advanceCommercialReasons({
      snapshot: snapshotOf('trade_partner'),
      worldState: worldOf({ entrepots: { b: { centrality: 0.9, toll: 1 } } }),
      tick: 11,
      rules: LIT,
    });
    const round = JSON.parse(JSON.stringify(out.worldState));
    expect(round).toEqual(out.worldState);
    expect(JSON.stringify(round.spatialLedgers[COMMERCIAL_REASONS_LEDGER]))
      .toBe(JSON.stringify(out.ledger));
    // The reader works identically off the round-tripped world — the writer/reader
    // spelling pin, executed against the REAL writer's output rather than a fixture.
    const before = makeCommercialPressureRead(out.worldState).severancePressureOf('a', 'b');
    const after = makeCommercialPressureRead(round).severancePressureOf('a', 'b');
    expect(after).toEqual(before);
    expect(after.magnitude01).toBeGreaterThan(0);
  });

  test('SAME STATE, SAME ENTRIES — the ledger is RE-DERIVED, never accumulated', () => {
    // THE PROMISE, applied to the one rebuildable ledger in this program: replaying the
    // same ticks from the same state must reproduce the same rows, key for key.
    const snapshot = snapshotOf('trade_partner');
    const seed = () => worldOf({ entrepots: { b: { centrality: 0.72, toll: 0.85 } } });
    const replay = (ticks) => {
      let worldState = seed();
      let ledger = null;
      for (const tick of ticks) {
        const out = advanceCommercialReasons({ snapshot, worldState, tick, rules: LIT });
        worldState = out.worldState;
        ledger = out.ledger;
      }
      return ledger;
    };
    expect(JSON.stringify(replay([0, 5, 12, 30]))).toBe(JSON.stringify(replay([0, 5, 12, 30])));
    // Zero PRNG: the SAME state at the same tick with NO history produces the same rows a
    // full replay produced, apart from the atTick memory the replay legitimately carries.
    const fresh = replay([30]);
    const carried = replay([0, 5, 12, 30]);
    const types = (ledger) => (ledger[commercialPairKey('a', 'b')] || []).map((row) => row.type);
    expect(types(fresh)).toEqual(types(carried));
    expect(fresh[commercialPairKey('a', 'b')][0].atTick).toBe(30);
    expect(carried[commercialPairKey('a', 'b')][0].atTick).toBe(0);
  });

  test('keys and records are codepoint-ordered, so the serialization is byte-stable', () => {
    const { scored } = scoreCommercialReasons({
      toll01: 1, dependence01: 1, marketClosed: true, salience01: 1, trust01: 1, resentment01: 1,
    });
    const kept = scored.filter((row) => row.magnitude01 >= COMMERCIAL_REASON_TUNING.MIN_MAGNITUDE);
    expect(kept.length).toBeGreaterThan(2);
    const out = advanceCommercialReasons({
      snapshot: snapshotOf('hostile', { trust: 0.9, resentment: 0.9 }),
      worldState: worldOf({ entrepots: { a: { centrality: 1, toll: 1 }, b: { centrality: 1, toll: 1 } } }),
      tick: 2,
      rules: LIT,
    });
    expect(Object.keys(out.ledger)).toEqual([...Object.keys(out.ledger)].sort());
    for (const rows of Object.values(out.ledger)) {
      expect(rows.map((row) => row.type)).toEqual([...rows.map((row) => row.type)].sort());
    }
  });
});

describe('TR-1 the war seam read — one factory, two signs', () => {
  test('severance pressure and partnership restraint come off the SAME rows', () => {
    const ledger = {
      [commercialPairKey('a', 'b')]: [
        { type: 'toll_extortion', magnitude01: 0.8, receipt: 'the toll is a wound', atTick: 1 },
        { type: 'contract_default', magnitude01: 0.3, receipt: 'the compact is broken', atTick: 1 },
        { type: 'dependency_comfort', magnitude01: 0.55, receipt: 'the tie holds', atTick: 1 },
      ],
    };
    const read = makeCommercialPressureRead({ spatialLedgers: { [COMMERCIAL_REASONS_LEDGER]: ledger } });
    // The STRONGEST of each sign, not a sum — a court acts on its sharpest grievance.
    expect(read.severancePressureOf('a', 'b')).toEqual({
      magnitude01: 0.8, type: 'toll_extortion', receipt: 'the toll is a wound',
    });
    expect(read.partnershipRestraintOf('a', 'b')).toEqual({
      magnitude01: 0.55, type: 'dependency_comfort', receipt: 'the tie holds',
    });
    // DIRECTED: b's case against a is a different row set, and here an empty one.
    expect(read.severancePressureOf('b', 'a').magnitude01).toBe(0);
    // Absent ledger ⇒ zero on both signs ⇒ every consumer is byte-identical.
    const dark = makeCommercialPressureRead({});
    expect(dark.severancePressureOf('a', 'b')).toEqual({ magnitude01: 0, type: null, receipt: '' });
    expect(dark.partnershipRestraintOf('a', 'b')).toEqual({ magnitude01: 0, type: null, receipt: '' });
  });

  test('every taxonomy type is classifiable by the seam reader, both signs', () => {
    // Totality at the CONSUMER, not just at the taxonomy: a type the reader could not
    // classify would silently count as neither pressure nor restraint.
    for (const type of SEVERANCE_REASON_TYPES) {
      const world = { spatialLedgers: { [COMMERCIAL_REASONS_LEDGER]: {
        [commercialPairKey('a', 'b')]: [{ type, magnitude01: 0.5, receipt: 'r', atTick: 0 }],
      } } };
      const read = makeCommercialPressureRead(world);
      expect(read.severancePressureOf('a', 'b').type, type).toBe(type);
      expect(read.partnershipRestraintOf('a', 'b').magnitude01, type).toBe(0);
    }
    for (const type of PARTNERSHIP_REASON_TYPES) {
      const world = { spatialLedgers: { [COMMERCIAL_REASONS_LEDGER]: {
        [commercialPairKey('a', 'b')]: [{ type, magnitude01: 0.5, receipt: 'r', atTick: 0 }],
      } } };
      const read = makeCommercialPressureRead(world);
      expect(read.partnershipRestraintOf('a', 'b').type, type).toBe(type);
      expect(read.severancePressureOf('a', 'b').magnitude01, type).toBe(0);
    }
    expect(Object.keys(COMMERCIAL_REASON_MIRRORS)).toHaveLength(8);
  });
});
