/**
 * treasury.test.js — W-COIN-1a: the stock, the flag, the lifecycle.
 *
 * The estate's first conserved COIN stock. This file is the lane's unit bar; the
 * constitutional dark-path bar is its sibling treasuryDormancy.byteIdentity.test.js.
 *
 * ── WHICH GREENS HERE ARE DISCOVERY AND WHICH ARE REGRESSION ─────────────────
 * Stated up front because "an arm that cannot discover anything is a green that means
 * less than it looks", and this car ships one arm of each kind:
 *   • DISCOVERY — the transfer-primitive clauses, the conservation property, the
 *     capacity derivation, the resolver's two fall-throughs, the writer's suspension
 *     receipts and the cross-consumer unit assertion. Each drives real inputs through
 *     real code and can fail on a real defect today.
 *   • REGRESSION, ARMED BUT NOT DISCOVERING — the emitter half of the stage-order law
 *     (A1.4). W-COIN-1a ships ZERO coin-delta emitters, so the scan that would catch an
 *     emitter running before `settlement_clock` runs over an empty set. It is a guard
 *     for W-COIN-3, and the writer half of the same law IS discovering today.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  TREASURY_TUNING,
  TREASURY_RECEIPT_KINDS,
  TREASURY_SUSPENSIONS,
  RULING_POWER_BASES,
  treasuryActive,
  hasOpenTreasury,
  coinOf,
  treasuryCapacity,
  resolveRulingPower,
  computeCoinTransfer,
  applyCoinDeltasToUpdates,
  advanceTreasury,
} from '../../src/domain/worldPulse/treasury.js';
import { RULING_POWERS } from '../../src/domain/spatial/cohesionWeave.js';
import { FACTION_ARCHETYPES } from '../../src/domain/factionArchetypes.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** A settlement with an OPEN ledger holding `coin`. */
const withCoin = (coin, extra = {}) => ({
  tier: 'town',
  institutions: [],
  economicState: {
    treasury: {
      coin, openedTick: 1, lastTick: 1,
      coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 },
    },
  },
  ...extra,
});

/** A settlement whose ledger was NEVER opened — the shape of every dark world. */
const unopened = (extra = {}) => ({ tier: 'town', institutions: [], economicState: {}, ...extra });

/** A settlement whose governing seat carries `category`. */
const ruledBy = (category, extra = {}) => ({
  tier: 'town',
  institutions: [],
  economicState: {},
  powerStructure: {
    governingName: 'The Seat',
    factions: [
      { faction: 'The Seat', category, power: 40, isGoverning: true },
      { faction: 'Somebody Else', category: 'labor', power: 10 },
    ],
  },
  ...extra,
});

// ── THE FLAG DOOR ────────────────────────────────────────────────────────────

describe('treasuryActive — the ONE flag door', () => {
  it('opens on exactly true and on nothing else', () => {
    // The LITERAL lit drive this subsystem's coverage credit rests on.
    expect(treasuryActive({ treasuryEnabled: true })).toBe(true);
    for (const nope of [{}, null, undefined, 'nope', 0, [], { treasuryEnabled: false },
      { treasuryEnabled: 'true' }, { treasuryEnabled: 1 }, { treasuryEnabled: {} }]) {
      expect(treasuryActive(/** @type {any} */ (nope)), `${JSON.stringify(nope)} opened the door`).toBe(false);
    }
  });
});

// ── THE TYPED VOCABULARIES (FINITE-SEMANTICS: closed buckets, no free text) ──

describe('the closed vocabularies', () => {
  it('every vocabulary is frozen, non-empty and free of duplicates', () => {
    for (const [name, vocab] of Object.entries({
      TREASURY_RECEIPT_KINDS, TREASURY_SUSPENSIONS, RULING_POWER_BASES,
    })) {
      expect(Object.isFrozen(vocab), `${name} is not frozen`).toBe(true);
      expect(vocab.length, `${name} is empty`).toBeGreaterThan(0);
      expect(new Set(vocab).size, `${name} names a member twice`).toBe(vocab.length);
      for (const member of vocab) expect(typeof member).toBe('string');
    }
    expect(Object.isFrozen(TREASURY_TUNING)).toBe(true);
  });

  it('declares ONLY kinds this car can emit — no dead arms', () => {
    // A vocabulary that names a kind nothing can draw passes every existence census while
    // being invisible in the world, which this program has measured twice. So the roster
    // is exactly what 1a emits: the open, the two suspensions, and the shortfall the
    // transfer primitive receipts. 1b's `tax_receipt` and W-COIN-2's `upkeep_paid` join
    // in the same act as their emitters, not before.
    expect([...TREASURY_RECEIPT_KINDS].sort()).toEqual([
      'suspended_by_occupation', 'suspended_by_siege', 'treasury_opened', 'treasury_shortfall',
    ]);
  });

  it('the suspension vocabulary matches the blockade types the granary already reads', () => {
    // The vault and the granary answer to ONE reading of what is happening to a town.
    const foodSrc = fs.readFileSync(path.join(ROOT, 'src/domain/worldPulse/foodStockpile.js'), 'utf8');
    const declared = /const BLOCKADE_TYPES = new Set\(\[([^\]]*)\]\)/.exec(foodSrc);
    expect(declared, 'the granary\'s BLOCKADE_TYPES moved — re-point this assertion').toBeTruthy();
    const types = declared[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean);
    expect([...types].sort()).toEqual([...TREASURY_SUSPENSIONS].sort());
  });
});

// ── ACCESSORS + THE UNIT LAW ─────────────────────────────────────────────────

describe('the accessors — and the unit they defend', () => {
  it('coinOf reads absolute integer coin, 0 on an unopened or malformed ledger', () => {
    expect(coinOf(withCoin(1234))).toBe(1234);
    expect(coinOf(unopened())).toBe(0);
    expect(coinOf(null)).toBe(0);
    expect(coinOf(undefined)).toBe(0);
    // FAIL-INERT rather than fail-invented: a corrupt import is never handed a vault.
    for (const junk of ['500', null, [], { coin: 'lots' }, { coin: NaN }, { coin: Infinity }]) {
      const s = { tier: 'town', institutions: [], economicState: { treasury: junk } };
      expect(coinOf(/** @type {any} */ (s)), `${JSON.stringify(junk)} was read as a balance`).toBe(0);
      expect(hasOpenTreasury(/** @type {any} */ (s))).toBe(false);
    }
    // Never negative, always integral, whatever the record says.
    expect(coinOf(withCoin(-40))).toBe(0);
    expect(coinOf(withCoin(12.9))).toBe(12);
  });

  it('hasOpenTreasury is the no-backfill witness', () => {
    expect(hasOpenTreasury(withCoin(0))).toBe(true);   // opened AND empty is a real state
    expect(hasOpenTreasury(unopened())).toBe(false);
  });

  it('THE CROSS-CONSUMER UNIT ASSERTION: every consumer reads the SAME number off ONE fixture', () => {
    // §711.6, four sightings in this program's memory: a numeric field with no declared
    // unit acquires a different unit at every consumer, and nothing ever reds, because
    // each consumer is internally consistent. So every consumer of `coin` in the tree is
    // driven against ONE fixture and must agree on the SAME absolute integer — not a
    // per-capita figure, not a fraction of capacity, not a band index.
    const s = withCoin(600, { population: 1200, tier: 'town' });
    const capacity = treasuryCapacity(s);
    expect(coinOf(s)).toBe(600);
    // NOT per-capita: 600/1200 = 0.5 would be the classic misreading.
    expect(coinOf(s)).not.toBe(0.5); // anchored: the assertion above pins the accessor to the literal 600 this fixture holds, so a drifted accessor reds there rather than passing here.
    // NOT a fraction of capacity, and NOT a band index.
    expect(coinOf(s)).not.toBe(600 / capacity); // anchored: capacity is asserted non-zero on the next line, so this comparison is against a real quotient rather than against a division by nothing.
    expect(capacity).toBeGreaterThan(0);
    // The transfer primitive prices in the SAME unit: a 100-coin demand debits 100.
    const moved = computeCoinTransfer({ payer: s, payee: withCoin(0), amount: 100, captureFraction: 1 });
    expect(moved.debited).toBe(100);
    // The applicator moves the SAME unit: a −100 delta lands the balance at 500.
    const updates = [{ saveId: 'x', settlement: s }];
    const applied = applyCoinDeltasToUpdates(updates, new Map([['x', 0]]), new Map([['x', -100]]));
    expect(coinOf(/** @type {any} */ (applied[0].settlement))).toBe(500);
    // And the writer reports the SAME unit back on its summary.
    const advanced = advanceTreasury(s, { tick: 9, rules: { treasuryEnabled: true } });
    expect(advanced.summary.coin).toBe(600);
    expect(advanced.summary.capacity).toBe(capacity);
  });
});

// ── DERIVED CAPACITY ─────────────────────────────────────────────────────────

describe('treasuryCapacity — derived on every read, never persisted', () => {
  const at = (tier, institutions = []) => treasuryCapacity({ tier, institutions, economicState: {} });

  it('rises monotonically with tier and matches the frozen table', () => {
    const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    for (const tier of tiers) expect(at(tier)).toBe(TREASURY_TUNING.CAPACITY_BASE_BY_TIER[tier]);
    for (let i = 1; i < tiers.length; i += 1) {
      expect(at(tiers[i]), `${tiers[i]} does not out-hold ${tiers[i - 1]}`).toBeGreaterThan(at(tiers[i - 1]));
    }
  });

  it('an unknown or absent tier fails neutral at the village rung, never at zero', () => {
    // A zero ceiling would make every future mint a phantom mint-and-burn.
    expect(at('megalopolis')).toBe(TREASURY_TUNING.CAPACITY_BASE_DEFAULT);
    expect(at(undefined)).toBe(TREASURY_TUNING.CAPACITY_BASE_DEFAULT);
    expect(treasuryCapacity(null)).toBe(TREASURY_TUNING.CAPACITY_BASE_DEFAULT);
  });

  it('fiscal institutions raise it — the finance rung is either/or, the vault stacks', () => {
    const base = at('city');
    const m = TREASURY_TUNING.CAPACITY_INSTITUTION_MULTIPLIERS;
    const inst = (...names) => names.map((name) => ({ name, status: 'active' }));
    expect(at('city', inst('Banking House'))).toBe(Math.floor(base * m.minorFinance));
    expect(at('city', inst('Banking District'))).toBe(Math.floor(base * m.majorFinance));
    // Either/or: holding both does NOT stack the two finance rungs.
    expect(at('city', inst('Banking House', 'Banking District')))
      .toBe(Math.floor(base * m.majorFinance));
    // The civic vault DOES stack over the finance rung.
    expect(at('city', inst('Banking District', 'City Hall')))
      .toBe(Math.floor(base * m.majorFinance * m.civicVault));
    // …and an unrelated institution buys nothing.
    expect(at('city', inst('Granary', 'Tannery'))).toBe(base);
  });

  it('a RUINED fiscal institution raises nothing — the roster is ruin-filtered', () => {
    // A crediting read over the raw roster gives a flattened building its full function.
    // A banking district that burned down in a calamity must stop holding up a ceiling
    // the town has no means to hold, on every one of the ruin statuses and on the
    // pulse's own inactive stamp.
    const base = at('city');
    const m = TREASURY_TUNING.CAPACITY_INSTITUTION_MULTIPLIERS;
    for (const dead of [
      { name: 'Banking District', status: 'ruined' },
      { name: 'Banking District', status: 'destroyed' },
      { name: 'Banking District', status: 'removed' },
      { name: 'Banking District', status: 'remnant' },
      { name: 'Banking District', status: 'active', _worldPulseInactive: true },
    ]) {
      expect(at('city', [dead]), `${JSON.stringify(dead)} still raised the ceiling`).toBe(base);
    }
    // …and the SAME institution standing does raise it, so the filter is not just
    // refusing everything.
    expect(at('city', [{ name: 'Banking District', status: 'active' }]))
      .toBe(Math.floor(base * m.majorFinance));
    // A ruined MAJOR house does not mask a standing MINOR one: the town falls to the
    // rung it can actually staff rather than to nothing.
    expect(at('city', [
      { name: 'Banking District', status: 'ruined' },
      { name: 'Banking House', status: 'active' },
    ])).toBe(Math.floor(base * m.minorFinance));
  });

  it('is a pure derivation — it never writes the settlement it reads', () => {
    const s = withCoin(10, { tier: 'city', institutions: [{ name: 'Banking House', status: 'active' }] });
    const before = JSON.stringify(s);
    treasuryCapacity(s);
    expect(JSON.stringify(s)).toBe(before);
    // anchored: the capacity arms above prove this same fixture yields a real non-zero,
    // institution-sensitive figure, so the derivation being measured here is doing work.
    expect(Object.hasOwn(s.economicState.treasury, 'capacity')).toBe(false);
  });
});

// ── THE ONE GOVERNING RESOLUTION LAW (A1.12 / Q11) ───────────────────────────

describe('resolveRulingPower — the ONE governing resolution law', () => {
  it('maps every faction archetype onto the closed RULING_POWERS enum', () => {
    for (const archetype of Object.values(FACTION_ARCHETYPES)) {
      const { power, basis } = resolveRulingPower(ruledBy(archetype));
      expect(RULING_POWERS, `${archetype} escaped the closed enum`).toContain(power);
      expect(RULING_POWER_BASES, `${archetype} produced an unknown basis`).toContain(basis);
    }
  });

  it('reaches every RULING_POWERS value from a real archetype (no unreachable rows)', () => {
    // A profile row nothing can ever select is a row that ships untested forever — this
    // is what makes 1b's 6-row table honestly reachable rather than nominally complete.
    const reached = new Set(
      Object.values(FACTION_ARCHETYPES).map((a) => resolveRulingPower(ruledBy(a)).power),
    );
    expect([...reached].sort()).toEqual([...RULING_POWERS].sort());
  });

  it('the recognised archetypes resolve to their declared powers', () => {
    const expected = {
      noble: 'autocrat', military: 'autocrat', occupation: 'autocrat',
      government: 'council', civic: 'council', labor: 'council',
      religious: 'theocracy', arcane: 'theocracy',
      merchant: 'merchant_league', craft: 'merchant_league',
      criminal: 'criminal',
    };
    for (const [archetype, power] of Object.entries(expected)) {
      const r = resolveRulingPower(ruledBy(archetype));
      expect(r.power, `${archetype} resolved to ${r.power}`).toBe(power);
      expect(r.basis).toBe('governing_archetype');
    }
  });

  it('FAILS NEUTRAL and SAYS WHICH — the two fall-throughs are distinguishable', () => {
    // Never throws, never silently skips. A world that is all `mixed` for a structural
    // reason must be distinguishable from one that genuinely is mixed.
    for (const offMap of ['outsider', 'other']) {
      expect(resolveRulingPower(ruledBy(offMap)))
        .toEqual({ power: 'mixed', basis: 'archetype_off_map' });
    }
    const noSeat = { tier: 'town', institutions: [], economicState: {}, powerStructure: { factions: [{ faction: 'Nobody', category: 'labor', power: 5 }] } };
    expect(resolveRulingPower(noSeat)).toEqual({ power: 'mixed', basis: 'no_governing_faction' });
    for (const empty of [null, undefined, {}, { powerStructure: {} }, { powerStructure: { factions: [] } }]) {
      expect(resolveRulingPower(/** @type {any} */ (empty)))
        .toEqual({ power: 'mixed', basis: 'no_governing_faction' });
    }
  });

  it('NEVER reads the free-text powerStructure.government string', () => {
    // Q11/A1.23, ratified: the free-text field is never a type key. Two settlements whose
    // government STRINGS say opposite things but whose governing archetypes agree must
    // resolve identically — and the label alone must move nothing.
    const merchantSeat = ruledBy('merchant');
    const mislabelled = { ...merchantSeat, powerStructure: { ...merchantSeat.powerStructure, government: 'Theocratic Council', governingName: 'The Seat' } };
    expect(resolveRulingPower(mislabelled)).toEqual(resolveRulingPower(merchantSeat));
    expect(resolveRulingPower(mislabelled).power).toBe('merchant_league');
    // …and the source carries no read of the field at all.
    const src = fs.readFileSync(path.join(ROOT, 'src/domain/worldPulse/treasury.js'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(src).not.toMatch(/\.government\b/); // anchored: the same stripped source is asserted non-empty and to contain the module's real reads on the next two lines, so a source read that silently returned nothing reds there rather than passing here.
    expect(src.length).toBeGreaterThan(1000);
    expect(src).toMatch(/rulingPowerFromArchetype/);
  });
});

// ── THE TRANSFER PRIMITIVE — A1.1, CLAUSE BY CLAUSE ──────────────────────────

describe('computeCoinTransfer — the ONE transfer primitive', () => {
  it('CLAUSE 2 — NULL ON ABSENT, on either leg, so nothing half-executes', () => {
    expect(computeCoinTransfer({ payer: unopened(), payee: withCoin(500), amount: 50 })).toBeNull();
    expect(computeCoinTransfer({ payer: withCoin(500), payee: unopened(), amount: 50 })).toBeNull();
    expect(computeCoinTransfer({ payer: unopened(), payee: unopened(), amount: 50 })).toBeNull();
    // …and a non-demand is not a transfer at all.
    for (const amount of [0, -5, NaN, undefined]) {
      expect(computeCoinTransfer({ payer: withCoin(500), payee: withCoin(0), amount })).toBeNull();
    }
  });

  it('CLAUSE 1 — the reserve floor, ALL-OR-NOTHING, receipted as a shortfall', () => {
    const reserve = TREASURY_TUNING.COIN_RESERVE;
    // A payer holding exactly the reserve delivers NOTHING and receipts the WHOLE demand.
    expect(computeCoinTransfer({ payer: withCoin(reserve), payee: withCoin(0), amount: 10 }))
      .toEqual({ debited: 0, credited: 0, destroyed: 0, shortfall: 10 });
    // A payer that can pay only PART of the demand still delivers nothing: no leg is ever
    // half-executed and nothing is scraped off the floor.
    expect(computeCoinTransfer({ payer: withCoin(reserve + 9), payee: withCoin(0), amount: 10 }))
      .toEqual({ debited: 0, credited: 0, destroyed: 0, shortfall: 10 });
    // One coin more, and the whole demand moves.
    const paid = computeCoinTransfer({ payer: withCoin(reserve + 10), payee: withCoin(0), amount: 10, captureFraction: 1 });
    expect(paid).toEqual({ debited: 10, credited: 10, destroyed: 0, shortfall: 0 });
  });

  it('CLAUSES 3 + 4 — capture is a SINK, and flooring keeps it one under both roundings', () => {
    // Held well clear of the reserve floor so THIS arm measures rounding, not clause 1.
    const payer = withCoin(5000);
    const payee = withCoin(0, { tier: 'metropolis' });
    for (const [amount, capture] of [[100, 0.6], [7, 0.5], [3, 0.34], [999, 0.999], [10, 0]]) {
      const r = computeCoinTransfer({ payer, payee, amount, captureFraction: capture });
      expect(r.debited).toBe(amount);
      expect(Number.isInteger(r.credited), 'a credit escaped the integers').toBe(true);
      expect(r.credited, `${amount} × ${capture} minted coin`).toBeLessThanOrEqual(amount * capture);
      expect(r.credited + r.destroyed).toBe(r.debited);
      expect(r.destroyed).toBeGreaterThanOrEqual(0);
    }
    // A capture above 1 is CLAMPED to 1 rather than minting; a negative clamps to 0.
    expect(computeCoinTransfer({ payer, payee, amount: 50, captureFraction: 4 }).credited).toBe(50);
    expect(computeCoinTransfer({ payer, payee, amount: 50, captureFraction: -1 }).credited).toBe(0);
  });

  it('CLAUSE 5 — the payee\'s headroom clamps the credit, and the overflow is DESTROYED', () => {
    // The payer still loses what it paid: a full vault refunds nobody, exactly as a
    // sacked granary's overflow is lost rather than returned.
    const payer = withCoin(5000);
    const payee = withCoin(0, { tier: 'thorp' });          // capacity 120
    const cap = treasuryCapacity(payee);
    const r = computeCoinTransfer({ payer, payee, amount: 1000, captureFraction: 1 });
    expect(r.debited).toBe(1000);
    expect(r.credited).toBe(cap);
    expect(r.destroyed).toBe(1000 - cap);
    // A payee already at capacity receives nothing and the whole debit is destroyed.
    const full = computeCoinTransfer({ payer, payee: withCoin(cap, { tier: 'thorp' }), amount: 40, captureFraction: 1 });
    expect(full).toEqual({ debited: 40, credited: 0, destroyed: 40, shortfall: 0 });
  });

  it('CLAUSE 6 — same-tick composition: the second draw sees the vault the first left', () => {
    const reserve = TREASURY_TUNING.COIN_RESERVE;
    const payer = withCoin(reserve + 100);
    const payee = withCoin(0, { tier: 'metropolis' });
    // Two 60-coin demands in one tick. Independently each is payable…
    expect(computeCoinTransfer({ payer, payee, amount: 60 }).debited).toBe(60);
    // …but the SECOND, told what the first already reserved, cannot be paid, and says so
    // rather than driving the payer through its floor.
    expect(computeCoinTransfer({ payer, payee, amount: 60, committedDebit: 60 }))
      .toEqual({ debited: 0, credited: 0, destroyed: 0, shortfall: 60 });
    // The credit side composes too: a payee's headroom shrinks by this tick's earlier credits.
    const small = withCoin(0, { tier: 'thorp' });
    const capacity = treasuryCapacity(small);
    const second = computeCoinTransfer({ payer: withCoin(9999), payee: small, amount: 200, captureFraction: 1, committedCredit: capacity });
    expect(second.credited).toBe(0);
    expect(second.destroyed).toBe(200);
  });

  it('is PURE — it never writes either party', () => {
    const payer = withCoin(1000);
    const payee = withCoin(10);
    const before = [JSON.stringify(payer), JSON.stringify(payee)];
    computeCoinTransfer({ payer, payee, amount: 300 });
    expect([JSON.stringify(payer), JSON.stringify(payee)]).toEqual(before);
  });
});

// ── THE APPLICATOR ───────────────────────────────────────────────────────────

describe('applyCoinDeltasToUpdates — the ONE applicator', () => {
  const updatesFor = (settlements) => settlements.map((settlement, i) => ({ saveId: `s${i}`, settlement }));
  const indexFor = (updates) => new Map(updates.map((u, i) => [String(u.saveId), i]));

  it('applies integer deltas, clamped to [0, derived capacity]', () => {
    const updates = updatesFor([withCoin(100, { tier: 'town' }), withCoin(100, { tier: 'thorp' })]);
    const out = applyCoinDeltasToUpdates(updates, indexFor(updates), new Map([['s0', 250], ['s1', 9999]]));
    expect(coinOf(/** @type {any} */ (out[0].settlement))).toBe(350);
    // Clamped at the thorp's derived ceiling — the SAFETY NET, never the mechanism.
    expect(coinOf(/** @type {any} */ (out[1].settlement))).toBe(treasuryCapacity(out[1].settlement));
  });

  it('never drives a balance negative — coin has no negative half', () => {
    const updates = updatesFor([withCoin(30)]);
    const out = applyCoinDeltasToUpdates(updates, indexFor(updates), new Map([['s0', -900]]));
    expect(coinOf(/** @type {any} */ (out[0].settlement))).toBe(0);
  });

  it('SKIPS a settlement whose ledger was never opened — only the writer opens one', () => {
    const updates = updatesFor([unopened()]);
    const out = applyCoinDeltasToUpdates(updates, indexFor(updates), new Map([['s0', 500]]));
    expect(out).toBe(updates);                              // reference identity: nothing moved
    expect(hasOpenTreasury(/** @type {any} */ (out[0].settlement))).toBe(false);
  });

  it('returns the INPUT ARRAY BY REFERENCE when nothing moved', () => {
    const updates = updatesFor([withCoin(100)]);
    const index = indexFor(updates);
    expect(applyCoinDeltasToUpdates(updates, index, new Map())).toBe(updates);
    expect(applyCoinDeltasToUpdates(updates, index, new Map([['s0', 0]]))).toBe(updates);
    expect(applyCoinDeltasToUpdates(updates, index, new Map([['missing', 50]]))).toBe(updates);
    // A delta that rounds to the balance it started from is also "nothing moved".
    const full = updatesFor([withCoin(treasuryCapacity(withCoin(0, { tier: 'town' })), { tier: 'town' })]);
    expect(applyCoinDeltasToUpdates(full, indexFor(full), new Map([['s0', 10]]))).toBe(full);
  });

  it('preserves every other field of the record and the settlement', () => {
    const s = withCoin(100, { name: 'Ashford', population: 900 });
    const updates = updatesFor([s]);
    const out = applyCoinDeltasToUpdates(updates, indexFor(updates), new Map([['s0', 50]]));
    const next = /** @type {any} */ (out[0].settlement);
    expect(next.name).toBe('Ashford');
    expect(next.population).toBe(900);
    expect(next.economicState.treasury.openedTick).toBe(1);
    expect(next.economicState.treasury.coinFlows).toEqual(s.economicState.treasury.coinFlows);
    // …and the INPUT is untouched (pure).
    expect(coinOf(s)).toBe(100);
  });
});

// ── THE CONSERVATION PROPERTY (§1a.6) ────────────────────────────────────────

describe('CONSERVATION — Δ(Σ coin) === Σ mints − Σ sinks, exactly, in integers', () => {
  it('holds over a fixture with concurrent flows, a capacity edge and a reserve edge', () => {
    // The §1a.6 fixture: two payers into ONE payee in the same tick (the committed
    // composition path), a capacity-edge payee, a reserve-edge payer that shortfalls, and
    // an absent-record party whose legs return null. In 1a there is NO MINT, so the
    // identity reduces to Δ = −sinks; 1b EXTENDS this same property with the taxation
    // mint term rather than writing a second one.
    const reserve = TREASURY_TUNING.COIN_RESERVE;
    const world = {
      payerA: withCoin(1000, { tier: 'city' }),
      payerB: withCoin(800, { tier: 'city' }),
      payerBroke: withCoin(reserve + 1, { tier: 'town' }),
      payee: withCoin(0, { tier: 'thorp' }),               // capacity 120 — the clamp edge
      bystander: unopened({ tier: 'town' }),
    };
    const updates = Object.entries(world).map(([saveId, settlement]) => ({ saveId, settlement }));
    const index = new Map(updates.map((u, i) => [String(u.saveId), i]));
    const totalBefore = updates.reduce((sum, u) => sum + coinOf(/** @type {any} */ (u.settlement)), 0);

    /** @type {Map<string, number>} */
    const deltas = new Map();
    let sinks = 0;
    let committedDebit = 0;
    let committedCredit = 0;
    const draws = [
      { from: 'payerA', amount: 300 },
      { from: 'payerB', amount: 200 },                     // the SECOND draw into one payee
      { from: 'payerBroke', amount: 500 },                 // the reserve edge — shortfalls
      { from: 'bystander', amount: 100 },                  // the absent leg — returns null
    ];
    for (const draw of draws) {
      const r = computeCoinTransfer({
        payer: world[draw.from], payee: world.payee, amount: draw.amount,
        committedDebit: draw.from === 'payerB' ? committedDebit : 0, committedCredit,
      });
      if (!r) continue;                                    // the absent-record party
      if (r.shortfall) { expect(r.debited).toBe(0); continue; }
      deltas.set(draw.from, (deltas.get(draw.from) || 0) - r.debited);
      deltas.set('payee', (deltas.get('payee') || 0) + r.credited);
      sinks += r.destroyed;
      committedCredit += r.credited;
      if (draw.from === 'payerA') committedDebit = r.debited;
    }

    const applied = applyCoinDeltasToUpdates(updates, index, deltas);
    const totalAfter = applied.reduce((sum, u) => sum + coinOf(/** @type {any} */ (u.settlement)), 0);

    // EXACT integer equality, no epsilon. Mints are zero in this car.
    expect(totalAfter - totalBefore).toBe(0 - sinks);
    // …and the arm is not vacuous: real coin really moved and real coin was really destroyed.
    expect(sinks).toBeGreaterThan(0);
    expect(totalBefore - totalAfter).toBeGreaterThan(0);
    expect(deltas.size).toBeGreaterThan(1);
    // No balance anywhere is negative or fractional.
    for (const u of applied) {
      const coin = coinOf(/** @type {any} */ (u.settlement));
      expect(Number.isInteger(coin)).toBe(true);
      expect(coin).toBeGreaterThanOrEqual(0);
    }
  });
});

// ── THE PULSE WRITER + THE WRITER-DOOR RECEIPTS (A1.14) ──────────────────────

describe('advanceTreasury — the ONE pulse writer', () => {
  const lit = { treasuryEnabled: true };

  it('DARK: returns the input settlement BY REFERENCE and reads nothing', () => {
    const s = unopened();
    for (const rules of [undefined, {}, { treasuryEnabled: false }, { treasuryEnabled: 'true' }]) {
      const r = advanceTreasury(s, { tick: 5, rules });
      expect(r.settlement).toBe(s);
      expect(r.summary).toBeNull();
    }
  });

  it('LIT, first tick: opens EMPTY at the tick, and receipts the open', () => {
    const r = advanceTreasury(unopened(), { tick: 41, rules: lit });
    const t = /** @type {any} */ (r.settlement).economicState.treasury;
    expect(t).toEqual({
      coin: 0, openedTick: 41, lastTick: 41,
      coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 },
    });
    expect(r.summary.opened).toBe(true);
    expect(r.summary.receipts).toEqual([{ kind: 'treasury_opened', tick: 41 }]);
  });

  it('LIT, thereafter: lastTick moves, openedTick does NOT, and it never re-opens', () => {
    const first = advanceTreasury(unopened(), { tick: 41, rules: lit });
    const second = advanceTreasury(first.settlement, { tick: 42, rules: lit });
    const t = /** @type {any} */ (second.settlement).economicState.treasury;
    expect(t.openedTick).toBe(41);
    expect(t.lastTick).toBe(42);
    expect(second.summary.opened).toBe(false);
    expect(second.summary.receipts).toEqual([]);
  });

  it('LIT: never mints — 1a has no mint kind, and the zero row is the design', () => {
    let s = unopened();
    for (let tick = 1; tick <= 20; tick += 1) s = advanceTreasury(s, { tick, rules: lit }).settlement;
    expect(coinOf(/** @type {any} */ (s))).toBe(0);
    expect(/** @type {any} */ (s).economicState.treasury.coinFlows)
      .toEqual({ taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 });
  });

  it('A1.14 — BESIEGED suspends everything, and the receipt is typed', () => {
    const r = advanceTreasury(withCoin(400), { tick: 7, blockade: { type: 'siege' }, rules: lit });
    expect(r.summary.suspension).toBe('siege');
    expect(r.summary.receipts).toEqual([{ kind: 'suspended_by_siege', tick: 7 }]);
    expect(TREASURY_RECEIPT_KINDS).toContain(r.summary.receipts[0].kind);
  });

  it('A1.14 — OCCUPIED yields ZERO into the OWN vault, receipted, and never inward', () => {
    // No wrong-direction lived coin, ever: the outward transfer to the occupier is
    // W-COIN-3's, and until it exists an occupied town simply does not fill its own vault.
    const before = withCoin(400);
    const r = advanceTreasury(before, { tick: 7, blockade: { type: 'occupation' }, rules: lit });
    expect(r.summary.suspension).toBe('occupation');
    expect(r.summary.receipts).toEqual([{ kind: 'suspended_by_occupation', tick: 7 }]);
    expect(coinOf(/** @type {any} */ (r.settlement))).toBe(400);
  });

  it('an unrecognised or absent blockade suspends nothing', () => {
    for (const blockade of [null, undefined, {}, { type: 'famine' }, { type: 'plague' }]) {
      const r = advanceTreasury(withCoin(10), { tick: 3, blockade, rules: lit });
      expect(r.summary.suspension).toBeNull();
      expect(r.summary.receipts).toEqual([]);
    }
  });

  it('opens AND suspends in one tick, receipting both, in siege-outranks-occupation order', () => {
    const r = advanceTreasury(unopened(), { tick: 2, blockade: { type: 'siege' }, rules: lit });
    expect(r.summary.receipts.map((x) => x.kind)).toEqual(['treasury_opened', 'suspended_by_siege']);
  });

  it('receipts are EPHEMERAL — no history array is ever persisted', () => {
    let s = unopened();
    for (let tick = 1; tick <= 5; tick += 1) {
      s = advanceTreasury(s, { tick, blockade: { type: 'siege' }, rules: lit }).settlement;
    }
    const t = /** @type {any} */ (s).economicState.treasury;
    expect(Object.keys(t).sort()).toEqual(['coin', 'coinFlows', 'lastTick', 'openedTick']);
    // anchored: the key list above is an exact equality over a record built by five real
    // lit ticks, so a record that had stopped being written reds there rather than here.
    expect(Object.hasOwn(t, 'receipts')).toBe(false);
    expect(Object.hasOwn(t, 'history')).toBe(false);
    // …and capacity is DERIVED, so it is never persisted either.
    expect(Object.hasOwn(t, 'capacity')).toBe(false);
  });

  it('is PURE — the input settlement is never mutated', () => {
    const s = withCoin(100);
    const before = JSON.stringify(s);
    advanceTreasury(s, { tick: 99, rules: lit });
    expect(JSON.stringify(s)).toBe(before);
  });

  it('tolerates a nonsense tick and a nonsense settlement without throwing', () => {
    expect(advanceTreasury(null, { tick: 1, rules: lit }).summary).toBeNull();
    expect(advanceTreasury(/** @type {any} */ ('nope'), { tick: 1, rules: lit }).summary).toBeNull();
    const r = advanceTreasury(unopened(), { tick: NaN, rules: lit });
    expect(/** @type {any} */ (r.settlement).economicState.treasury.openedTick).toBe(0);
  });
});

// ── A1.4 — STAGE ORDER IS LAW, NOT LUCK ──────────────────────────────────────

describe('A1.4 stage order — the writer runs inside settlement_clock', () => {
  const kernel = fs.readFileSync(path.join(ROOT, 'src/domain/worldPulse/pulseKernel.js'), 'utf8');
  const stageAt = (name) => kernel.indexOf(`@pulse-stage: ${name}`);

  it('DISCOVERING: the ONE call site sits inside the settlement_clock stage', () => {
    const call = kernel.indexOf('advanceTreasury(');
    expect(call, 'the writer has no call site in the kernel').toBeGreaterThan(-1);
    // Exactly one call — two writers on one stock is the class this design forbids.
    expect(kernel.split('advanceTreasury(').length - 1).toBe(1);
    const clock = stageAt('settlement_clock');
    const next = stageAt('mover_planes');
    expect(clock).toBeGreaterThan(-1);
    expect(next).toBeGreaterThan(clock);
    expect(call).toBeGreaterThan(clock);
    expect(call).toBeLessThan(next);
    // …and it stands beside the granary advance, reading the SAME blockade record.
    expect(kernel.indexOf('advanceFoodStockpile(')).toBeLessThan(call);
  });

  it('ARMED, NOT DISCOVERING: every coin-delta emitter runs after settlement_clock', () => {
    // ⚠ SAY WHAT THIS GREEN MEANS. W-COIN-1a ships ZERO emitters, so this scan runs over
    // an EMPTY SET and cannot fail today. It is a REGRESSION guard for W-COIN-3, whose
    // movers grow the first coin legs: the moment one of them imports the applicator, the
    // arm below stops being empty and starts deciding. The writer half of the same law,
    // above, is discovering today.
    const walk = (dir, out = []) => {
      for (const e of fs.readdirSync(dir)) {
        const p = path.join(dir, e);
        if (fs.statSync(p).isDirectory()) walk(p, out);
        else if (/\.js$/.test(e)) out.push(p);
      }
      return out;
    };
    // ⚠ AN EMITTER IS A MODULE THAT IMPORTS THE APPLICATOR, NOT ONE THAT SAYS ITS NAME.
    // The first cut of this scan was a bare substring test over src/, and it was falsified
    // immediately and usefully: it flagged subsystemRowsVirtual.js, whose certification
    // PROSE names the applicator while importing nothing at all. A detector that counts
    // documentation as a call site would have to be loosened every time a lane wrote the
    // word down, and a loosened detector is how a real emitter eventually walks past.
    const IMPORTS_APPLICATOR = /import\s*\{[^}]*\bapplyCoinDeltasToUpdates\b[^}]*\}\s*from\s*['"][^'"]*treasury\.js['"]/;
    const emitters = walk(path.join(ROOT, 'src'))
      .filter((p) => !p.endsWith(`${path.sep}treasury.js`))
      .filter((p) => IMPORTS_APPLICATOR.test(fs.readFileSync(p, 'utf8')))
      .map((p) => path.relative(ROOT, p).replace(/\\/g, '/'));
    // …and the detector is proven to SEE: the same pattern matches a real import line.
    expect(IMPORTS_APPLICATOR.test(
      "import { applyCoinDeltasToUpdates } from './treasury.js';",
    ), 'the emitter detector cannot recognise an import it is meant to catch').toBe(true);
    expect(IMPORTS_APPLICATOR.test(
      'the row prose mentions applyCoinDeltasToUpdates without importing it',
    )).toBe(false);
    const stagesAfterSettlementClock = ['mover_planes', 'candidate_selection', 'permission_and_apply', 'consequence_fold', 'finalize_receipt'];
    for (const emitter of emitters) {
      const src = fs.readFileSync(path.join(ROOT, emitter), 'utf8');
      expect(stagesAfterSettlementClock.some((stage) => src.includes(stage)),
        `${emitter} emits coin deltas but names no pulse stage after settlement_clock (A1.4)`).toBe(true);
    }
    // The census figure itself, recorded so the transition from armed to deciding is visible.
    expect(emitters, 'a coin-delta emitter landed — this arm is now DECIDING, re-read A1.4').toEqual([]);
  });
});
