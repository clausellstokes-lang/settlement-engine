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
  TAX_FORMS,
  TAX_RATE_BANDS,
  TAX_PROFILE,
  INCOME_SOURCE_FORMS,
  taxFormFor,
  taxFormShares,
  isCoerciveCell,
  computeTaxYield,
  applyTreasuryLegitimacyDeltas,
  coffersRead,
  CRIMINAL_INCOME_LABELS,
  isCriminalIncome,
} from '../../src/domain/worldPulse/treasury.js';
import { transferRulingPower } from '../../src/domain/rulingPower.js';
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
    // is exactly what the SHIPPED cars emit — never a kind held in reserve.
    // ⭐ THE LAW WORKING AS INTENDED, recorded because it is the point: 1a declared four
    // kinds, and this assertion is what forced 1b's two to arrive IN THE SAME ACT as the
    // mint and the price that draw them — and then forced W-COIN-2's two to arrive in the
    // same act as the SINK that draws them.
    expect([...TREASURY_RECEIPT_KINDS].sort()).toEqual([
      'legitimacy_price', 'suspended_by_occupation', 'suspended_by_siege',
      'tax_receipt', 'treasury_opened', 'treasury_shortfall', 'upkeep_paid',
    ]);
    // ⭐ AND THE ONE THAT CAME BACK, which is this roster's own proof in both directions.
    // `treasury_shortfall` was declared in 1a, convicted by the reachability arm below as
    // a kind nothing could draw (the transfer primitive reports shortfall as a FIELD, and
    // 1a shipped no caller to convert one into a summary receipt), and STRUCK. W-COIN-2's
    // upkeep sink is the first thing in the design that can genuinely fail to pay, so the
    // kind returns WITH a live emitter rather than ahead of one.
    const src = fs.readFileSync(path.join(ROOT, 'src/domain/worldPulse/treasury.js'), 'utf8');
    // …and every declared kind is REACHABLE: each is emitted somewhere in this module.
    for (const kind of TREASURY_RECEIPT_KINDS) {
      expect(src, `${kind} is declared but nothing pushes it`).toMatch(new RegExp(`kind: '${kind}'`));
    }
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

// ══ W-COIN-1b — TAXATION ═════════════════════════════════════════════════════

/** A settlement with a real income ledger, so the mint has structure to tax. */
const taxable = (extra = {}, rows = [
  { source: 'Agricultural Rents', percentage: 40, desc: 'rents' },
  { source: 'Toll Revenue', percentage: 30, desc: 'tolls' },
  { source: 'Military Levy', percentage: 20, desc: 'levy' },
  { source: 'Black Market Revenue', percentage: 10, desc: 'racket', isCriminal: true },
]) => ({
  tier: 'town',
  institutions: [],
  economicState: { prosperity: 'Moderate', incomeSources: rows },
  powerStructure: {
    governingName: 'The Seat',
    factions: [{ faction: 'The Seat', category: 'government', power: 40, isGoverning: true }],
  },
  ...extra,
});

describe('TAX_FORMS / TAX_RATE_BANDS / the profile — closed, frozen, total', () => {
  it('the vocabularies are closed, frozen, ordered and duplicate-free', () => {
    expect(Object.isFrozen(TAX_FORMS)).toBe(true);
    expect(Object.isFrozen(TAX_RATE_BANDS)).toBe(true);
    expect(TAX_FORMS).toEqual([
      'land_rents', 'market_tolls', 'port_customs', 'licensing',
      'justice_fees', 'tithe_share', 'levy_extraction', 'misc_trade',
    ]);
    expect(TAX_RATE_BANDS).toEqual(['none', 'light', 'customary', 'heavy', 'extractive']);
    expect(new Set(TAX_FORMS).size).toBe(TAX_FORMS.length);
    expect(new Set(TAX_RATE_BANDS).size).toBe(TAX_RATE_BANDS.length);
  });

  it('THE PROFILE WALKER, BOTH WAYS: every power has a row, every row is total, no strays', () => {
    expect([...Object.keys(TAX_PROFILE)].sort()).toEqual([...RULING_POWERS].sort());
    for (const power of RULING_POWERS) {
      const row = TAX_PROFILE[power];
      expect(Object.isFrozen(row), `${power} row is not frozen`).toBe(true);
      expect([...Object.keys(row)].sort(), `${power} row is not total over TAX_FORMS`)
        .toEqual([...TAX_FORMS].sort());
      for (const [form, band] of Object.entries(row)) {
        expect(TAX_RATE_BANDS, `${power}.${form} = ${band} is not a band`).toContain(band);
      }
    }
  });

  it('EXTRACTIVE is reachable ONLY on a coercive row — structurally, not by convention', () => {
    for (const power of RULING_POWERS) {
      for (const [form, band] of Object.entries(TAX_PROFILE[power])) {
        if (band !== 'extractive') continue;
        expect(isCoerciveCell(power, form), `${power}.${form} is extractive but not coercive`).toBe(true);
      }
    }
    // …and the arm is not vacuous: some cell really is extractive, and some really is not
    // permitted to be.
    const extractives = RULING_POWERS.flatMap((p) => Object.entries(TAX_PROFILE[p])
      .filter(([, b]) => b === 'extractive').map(([f]) => `${p}.${f}`));
    expect(extractives.length).toBeGreaterThan(0);
    expect(isCoerciveCell('council', 'market_tolls')).toBe(false);
    expect(isCoerciveCell('council', 'levy_extraction')).toBe(true);
    expect(isCoerciveCell('criminal', 'market_tolls')).toBe(true);
  });
});

describe('the label → form mapping is TOTAL over what the generator can emit', () => {
  // ⚠⚠ THE DENOMINATOR SPANS TWO FILES, AND THE CHARTER'S DID NOT. `economicState.js` is
  // the ONE writer of `economicState.incomeSources`, so the charter scanned it alone —
  // but two of the literals it pushes are BUILT in `tradeGoods.js` and handed over as
  // `incomeBonuses`. A one-file scan would have declared totality over a set missing two
  // rows it could never see, which is precisely the shape of a denominator break.
  const GENERATOR_FILES = [
    'src/generators/economy/economicState.js',
    'src/generators/economy/tradeGoods.js',
  ];
  const emittedLiterals = () => {
    const found = new Set();
    for (const rel of GENERATOR_FILES) {
      const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
      for (const m of src.matchAll(/source:\s*'([^']+)'/g)) found.add(m[1]);
    }
    return [...found].sort();
  };

  it('every literal the generators can emit maps to a declared form', () => {
    const literals = emittedLiterals();
    // The scan REACHED something — a regex that stopped matching would otherwise
    // "prove" totality over the empty set.
    expect(literals.length).toBeGreaterThan(20);
    for (const literal of literals) {
      const form = taxFormFor(literal);
      expect(TAX_FORMS, `${literal} mapped outside the closed vocabulary`).toContain(form);
      expect(
        Object.hasOwn(INCOME_SOURCE_FORMS, literal),
        `${literal} is emitted by a generator but has no row in INCOME_SOURCE_FORMS —`
        + ' it would silently fall to misc_trade. Add the row or argue the catchall.',
      ).toBe(true);
    }
    // …and the two tradeGoods literals are really in the denominator, by name, so a
    // future single-file scan cannot quietly shrink it back.
    expect(literals).toContain('Entrepôt Trade');
    expect(literals).toContain('International Commerce');
  });

  it('the table names no literal the generators cannot emit (no dead rows)', () => {
    const literals = new Set(emittedLiterals());
    for (const declared of Object.keys(INCOME_SOURCE_FORMS)) {
      expect(literals.has(declared), `${declared} is mapped but no generator emits it`).toBe(true);
    }
  });

  it('an UNMATCHED or custom label falls to misc_trade — the vocabulary stays closed', () => {
    for (const odd of ['_good_ Saffron', 'Totally Invented Revenue', '', null, undefined, 42]) {
      expect(taxFormFor(odd)).toBe('misc_trade');
    }
  });

  it('every declared form is REACHABLE from some real literal (no unreachable bucket)', () => {
    const reached = new Set(Object.values(INCOME_SOURCE_FORMS));
    expect([...reached].sort()).toEqual([...TAX_FORMS].sort());
  });
});

describe('the criminal-income vocabulary is closed and TOTAL over the generator', () => {
  // ⚠⚠ WHY THE LABEL SET EXISTS AT ALL, MEASURED. The observed-shape corpus saw 3,068
  // `incomeSources` rows across its whole seed × config matrix and NOT ONE carried
  // `isCriminal` (observed keys: desc, percentage, priorityNote, source, weight). The
  // generator writes the flag, but only down a branch those worlds never take — so an
  // exclusion resting on the flag ALONE is dead on every world anyone has generated, and
  // the racket would be taxed as if it paid tax with no test able to see it.
  it('names exactly the labels the generator can author, and no others', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/generators/economy/economicState.js'), 'utf8');
    // The label ternary sits directly above the one `isCriminal: true` push.
    const push = src.indexOf('isCriminal: true');
    expect(push, 'the criminal income push moved — re-point this scan').toBeGreaterThan(-1);
    const block = src.slice(Math.max(0, push - 1400), push);
    const authored = [...block.matchAll(/(?:'([^']*Revenue|[^']*untaxed\))'|"([^"]*Revenue)")/g)]
      .map((m) => m[1] ?? m[2]).filter(Boolean);
    expect(authored.length, 'the label scan found nothing — it has drifted off its subject')
      .toBeGreaterThan(3);
    for (const label of authored) {
      expect(CRIMINAL_INCOME_LABELS, `${label} is authored by the generator but unlisted`).toContain(label);
    }
    for (const label of CRIMINAL_INCOME_LABELS) {
      expect(authored, `${label} is listed but the generator cannot author it`).toContain(label);
    }
  });

  it('detects the racket BOTH ways — by label and by the explicit flag', () => {
    for (const label of CRIMINAL_INCOME_LABELS) {
      expect(isCriminalIncome({ source: label, percentage: 10 }), `${label} read as lawful`).toBe(true);
    }
    // The flag alone still works, for a custom row wearing no known name.
    expect(isCriminalIncome({ source: '_good_ Contraband Saffron', isCriminal: true })).toBe(true);
    // …and an ordinary row is not swept up.
    expect(isCriminalIncome({ source: 'Agricultural Rents', percentage: 40 })).toBe(false);
    for (const junk of [null, undefined, 'nope', 42, []]) {
      expect(isCriminalIncome(/** @type {any} */ (junk))).toBe(false);
    }
  });

  it('a labelled racket row is excluded even with NO isCriminal flag present', () => {
    // The arm that would have been dead before the label set landed.
    const shares = taxFormShares(taxable({}, [
      { source: 'Agricultural Rents', percentage: 60 },
      { source: 'Black Market Revenue', percentage: 40 },  // no flag, just the name
    ]));
    expect(shares.land_rents).toBe(1);
    expect(Object.keys(shares)).toEqual(['land_rents']);
  });
});

describe('taxFormShares — criminal rows are never a tax base', () => {
  it("excludes isCriminal rows and renormalises over what is left", () => {
    const shares = taxFormShares(taxable());
    // 40/30/20 of the LAWFUL 90, not of the 100 that includes the racket.
    expect(shares.land_rents).toBeCloseTo(40 / 90, 10);
    expect(shares.market_tolls).toBeCloseTo(30 / 90, 10);
    expect(shares.levy_extraction).toBeCloseTo(20 / 90, 10);
    // anchored: the three shares above are asserted to exact values off this same fixture,
    // so a shares map that had gone empty reds there rather than passing here.
    expect(Object.hasOwn(shares, 'misc_trade')).toBe(false);
    expect(Object.values(shares).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it('a settlement whose ENTIRE ledger is criminal has no tax base at all', () => {
    const allCrime = taxable({}, [{ source: 'Shadow Economy (untaxed)', percentage: 100, isCriminal: true }]);
    expect(taxFormShares(allCrime)).toEqual({});
    expect(computeTaxYield(allCrime, { rulingPower: 'criminal' }).minted).toBe(0);
  });

  it('a missing, empty or malformed ledger yields no shares and never throws', () => {
    // ⚠ `undefined` is deliberately NOT in this list: it would trigger the helper's own
    // DEFAULT ledger and quietly test the happy path while reading like a null case.
    for (const rows of [[], null, 'nope', 42, {}, [null, 42, {}], [{ percentage: 'x' }]]) {
      expect(taxFormShares(taxable({}, /** @type {any} */ (rows))), `${JSON.stringify(rows)} produced shares`).toEqual({});
    }
    expect(taxFormShares(null)).toEqual({});
    expect(taxFormShares({ tier: 'town', economicState: {} })).toEqual({});
  });
});

describe('computeTaxYield — the mint, and the loop it cannot close', () => {
  it('mints integer coin from structure × band × prosperity', () => {
    const out = computeTaxYield(taxable(), { rulingPower: 'council' });
    expect(Number.isInteger(out.minted)).toBe(true);
    expect(out.minted).toBeGreaterThan(0);
    for (const entry of out.entries) {
      expect(TAX_FORMS).toContain(entry.form);
      expect(TAX_RATE_BANDS).toContain(entry.band);
      expect(Number.isInteger(entry.amount)).toBe(true);
    }
  });

  it('the ruling power CHANGES the yield — the profile is load-bearing', () => {
    const league = computeTaxYield(taxable(), { rulingPower: 'merchant_league' });
    const theocracy = computeTaxYield(taxable(), { rulingPower: 'theocracy' });
    // A merchant league taxes tolls heavy where a theocracy taxes them light.
    const bandOf = (out, form) => out.entries.find((e) => e.form === form)?.band;
    expect(bandOf(league, 'market_tolls')).toBe('heavy');
    expect(bandOf(theocracy, 'market_tolls')).toBe('light');
    expect(league.minted).toBeGreaterThan(theocracy.minted);
  });

  it('⛔ THE MINT READS THE STOCK ONLY AT THE CAPACITY STOP — no feedback loop can exist', () => {
    // §11.1's exact attack. A vault with more coin in it must not mint more (or less)
    // except by running out of headroom, so a rich crown does not tax harder for being
    // rich and tax → transfer → tax cannot close.
    const poor = taxable();
    const rich = { ...poor, economicState: { ...poor.economicState, treasury: { coin: 500, openedTick: 1, lastTick: 1, coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 } } } };
    const capacity = treasuryCapacity(poor);
    expect(capacity).toBeGreaterThan(600); // headroom remains at 500 held
    expect(computeTaxYield(rich, { rulingPower: 'council' }).minted)
      .toBe(computeTaxYield(poor, { rulingPower: 'council' }).minted);
  });

  it('THE CAPACITY STOP: at capacity nothing is minted, and there is no phantom mint-and-burn', () => {
    const s = taxable({ tier: 'thorp' });
    const cap = treasuryCapacity(s);
    const full = { ...s, economicState: { ...s.economicState, treasury: { coin: cap, openedTick: 1, lastTick: 1, coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 } } } };
    const out = computeTaxYield(full, { rulingPower: 'autocrat' });
    expect(out.minted).toBe(0);
    // …and what it WOULD have minted is reported rather than silently burned.
    expect(out.stopped).toBeGreaterThan(0);
  });

  it('A1.16 BOTH HALVES: a capacity-stopped tick STILL pays the band price', () => {
    // The crown that squeezes and cannot even bank the coin still pays the resentment.
    const s = taxable({ tier: 'thorp' });
    const cap = treasuryCapacity(s);
    const full = { ...s, economicState: { ...s.economicState, treasury: { coin: cap, openedTick: 1, lastTick: 1, coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 } } } };
    const out = computeTaxYield(full, { rulingPower: 'criminal' });
    expect(out.minted).toBe(0);
    expect(out.legitimacyDelta).toBeLessThan(0);
  });

  it('the legitimacy price follows the BAND, is bounded, integer, and never positive', () => {
    const council = computeTaxYield(taxable(), { rulingPower: 'council' });
    const criminal = computeTaxYield(taxable(), { rulingPower: 'criminal' });
    // A council on light levies pays nothing; a criminal seat pays.
    expect(council.legitimacyDelta).toBe(0);
    expect(criminal.legitimacyDelta).toBeLessThan(0);
    for (const power of RULING_POWERS) {
      const out = computeTaxYield(taxable(), { rulingPower: power });
      expect(Number.isInteger(out.legitimacyDelta)).toBe(true);
      expect(out.legitimacyDelta).toBeLessThanOrEqual(0);
      expect(out.legitimacyDelta).toBeGreaterThanOrEqual(-TREASURY_TUNING.LEGITIMACY_PRICE_CAP);
      expect(Object.is(out.legitimacyDelta, -0), 'a −0 price serializes as "-0"').toBe(false);
    }
  });

  it('A1.14 — siege and occupation both zero the yield, and neither mints inward', () => {
    for (const suspension of TREASURY_SUSPENSIONS) {
      const out = computeTaxYield(taxable(), { rulingPower: 'autocrat', suspension });
      expect(out.minted, `${suspension} still minted`).toBe(0);
      for (const entry of out.entries) expect(entry.amount).toBe(0);
    }
  });

  it('an unknown ruling power falls to the mixed row rather than throwing', () => {
    const out = computeTaxYield(taxable(), { rulingPower: 'not_a_power' });
    const mixed = computeTaxYield(taxable(), { rulingPower: 'mixed' });
    expect(out.minted).toBe(mixed.minted);
  });
});

describe('the writer mints, receipts and prices — end to end', () => {
  const lit = { treasuryEnabled: true };

  it('a lit tick mints into coinFlows.taxed and receipts the resolved bands', () => {
    const first = advanceTreasury(taxable(), { tick: 1, rules: lit });
    const second = advanceTreasury(first.settlement, { tick: 2, rules: lit });
    const t = second.settlement.economicState.treasury;
    expect(t.coin).toBeGreaterThan(0);
    expect(t.coinFlows.taxed).toBe(second.summary.taxed);
    expect(second.summary.receipts.map((r) => r.kind)).toContain('tax_receipt');
    // THE BAND IS RECORDED AT FLOW TIME — history is never re-derived from current rates.
    for (const entry of second.summary.taxEntries) {
      expect(TAX_RATE_BANDS).toContain(entry.band);
      expect(TAX_FORMS).toContain(entry.form);
    }
  });

  it('the ruling power on the summary comes from the ONE resolver', () => {
    const merchantSeat = taxable({
      powerStructure: {
        governingName: 'The Seat',
        factions: [{ faction: 'The Seat', category: 'merchant', power: 40, isGoverning: true }],
      },
    });
    const r = advanceTreasury(merchantSeat, { tick: 1, rules: lit });
    expect(r.summary.rulingPower).toBe('merchant_league');
    expect(r.summary.rulingBasis).toBe('governing_archetype');
    // …and a seatless settlement is priced on the mixed row and SAYS so.
    const seatless = advanceTreasury(taxable({ powerStructure: { factions: [] } }), { tick: 1, rules: lit });
    expect(seatless.summary.rulingPower).toBe('mixed');
    expect(seatless.summary.rulingBasis).toBe('no_governing_faction');
  });

  it('§11.11 COUP COMPOSITION: a coup retypes taxation, and both orders agree', () => {
    // The A1.12 stamp is what makes this true: the seat wears the winner's archetype, so
    // the resolver reads the new power on the very next tick without W-COIN code.
    const before = taxable({
      powerStructure: {
        governingName: 'The Seat',
        factions: [
          { faction: 'The Seat', category: 'government', power: 40, isGoverning: true },
          { faction: 'Coin Hall', category: 'merchant', power: 30 },
        ],
      },
    });
    const asCouncil = advanceTreasury(before, { tick: 1, rules: lit });
    expect(asCouncil.summary.rulingPower).toBe('council');
    const couped = transferRulingPower(before, 'Coin Hall', { cause: 'coup', tick: 1 });
    expect(couped.error).toBeNull();
    const asLeague = advanceTreasury(couped.settlement, { tick: 2, rules: lit });
    expect(asLeague.summary.rulingPower).toBe('merchant_league');
    // ORDER TWO: tax first, then coup, then tax — the second tick reads the NEW power.
    const taxedThenCouped = transferRulingPower(asCouncil.settlement, 'Coin Hall', { cause: 'coup', tick: 1 });
    const after = advanceTreasury(taxedThenCouped.settlement, { tick: 2, rules: lit });
    expect(after.summary.rulingPower).toBe('merchant_league');
    // Deterministic: the same power ⇒ the same per-form bands, whichever order got there.
    expect(after.summary.taxEntries.map((e) => [e.form, e.band]))
      .toEqual(asLeague.summary.taxEntries.map((e) => [e.form, e.band]));
  });

  it('NO PROSPERITY WRITE ANYWHERE, and the ONLY opinion write is the legitimacy price', () => {
    const r = advanceTreasury(taxable(), { tick: 1, rules: lit });
    // The direction-of-read law, executed: prosperity in, nothing out.
    expect(r.settlement.economicState.prosperity).toBe('Moderate');
    expect(r.settlement.powerStructure).toEqual(taxable().powerStructure);
    // …and a source scan, because one fixture cannot prove an absence across a module.
    const src = fs.readFileSync(path.join(ROOT, 'src/domain/worldPulse/treasury.js'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(src).not.toMatch(/applyProsperityDeltasToUpdates/); // anchored: the same stripped source is asserted to contain the legitimacy applicator two lines below, so a source read that returned nothing reds there rather than passing here.
    expect(src).not.toMatch(/prosperity\s*:/); // anchored: as above — the module is proven non-empty and proven to carry its real imports by the assertions below.
    expect(src).toMatch(/applyLegitimacyDeltasToUpdates/);
    expect(src.length).toBeGreaterThan(1000);
  });
});

describe('applyTreasuryLegitimacyDeltas — one applicator, not a second', () => {
  const updatesFor = (score) => [{
    saveId: 's0',
    settlement: { powerStructure: { publicLegitimacy: { score, label: 'Accepted' } } },
  }];

  it('routes bounded integer deltas through the EXISTING applicator', () => {
    const out = applyTreasuryLegitimacyDeltas(updatesFor(55), new Map([['s0', -3]]));
    expect(out[0].settlement.powerStructure.publicLegitimacy.score).toBe(52);
  });

  it('clamps at the [0,100] domain the existing applicator owns', () => {
    expect(applyTreasuryLegitimacyDeltas(updatesFor(2), new Map([['s0', -50]]))[0]
      .settlement.powerStructure.publicLegitimacy.score).toBe(0);
  });

  it('returns the INPUT ARRAY BY REFERENCE when nothing moved', () => {
    const updates = updatesFor(55);
    expect(applyTreasuryLegitimacyDeltas(updates, new Map())).toBe(updates);
    expect(applyTreasuryLegitimacyDeltas(updates, new Map([['s0', 0]]))).toBe(updates);
    expect(applyTreasuryLegitimacyDeltas(updates, new Map([['missing', -3]]))).toBe(updates);
  });

  it('SKIPS a legacy bare-number or absent legitimacy, exactly as the applicator does', () => {
    const legacy = [{ saveId: 's0', settlement: { powerStructure: { publicLegitimacy: 55 } } }];
    expect(applyTreasuryLegitimacyDeltas(legacy, new Map([['s0', -3]]))[0]
      .settlement.powerStructure.publicLegitimacy).toBe(55);
  });

  it('is a call-shape adapter, NOT a second applicator (source scan)', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/domain/worldPulse/treasury.js'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    // It must DELEGATE, never re-implement the clamp.
    expect(src).toMatch(/applyLegitimacyDeltasToUpdates\(/);
    expect(src).not.toMatch(/publicLegitimacy/); // anchored: the delegation match above proves this same stripped source is non-empty and carries the real call, so an emptied read reds there.
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

// ── W-COIN-3's PRIMITIVE, LANDING AHEAD OF ITS CALLERS ───────────────────────

describe('coffersRead — ONE reading of "how long can this crown pay its army"', () => {
  // It ships in this car with NO caller in the tree; both callers — readWarHomeFront and
  // readCoalitionExpenditure — arrive in the next one. That is the same posture 1a took
  // with computeCoinTransfer, and it is deliberate: the primitive lands fully unit-tested
  // and unreached rather than arriving inside the car that also writes its proof.
  const army = { targetId: 'peer', currentEffectiveStrength: 50 };   // bands to `host`, 25/tick
  const vault = (coin, openedTick = 0) => ({
    tier: 'town',
    institutions: [],
    economicState: { treasury: { coin, openedTick, lastTick: 0, coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 } } },
  });

  it('refuses to speak until all THREE conditions hold', () => {
    const window = TREASURY_TUNING.COVERAGE_OBSERVED_AFTER;
    // (a) no army in the field.
    expect(coffersRead(vault(500), { targetId: 'peer' }, 100).observed).toBe(false);
    expect(coffersRead(vault(500), null, 100).observed).toBe(false);
    // (b) no ledger — and a MALFORMED ledger reads as absent, never as an empty vault.
    expect(coffersRead({ tier: 'town' }, army, 100).observed).toBe(false);
    expect(coffersRead(vault('lots'), army, 100).observed).toBe(false);
    // (c) the ledger is younger than the observation window. A treasury that opened last
    // tick is empty because it is NEW, and a war read that could not tell that apart from
    // a broke crown would manufacture decisive pressure out of lighting a flag.
    expect(coffersRead(vault(0, 100), army, 100 + window - 1).observed).toBe(false);
    expect(coffersRead(vault(0, 100), army, 100 + window).observed).toBe(true);
    // …and an unreadable tick fails inert rather than throwing.
    expect(coffersRead(vault(0, 100), army, undefined).observed).toBe(false);
  });

  it('an UNOBSERVED read reports a zero score that its callers must not use as one', () => {
    // The distinction the dilution hazard turns on: `observed:false` is "there is no such
    // question here", NOT "the answer is zero". The score field is zero only because a
    // number must be something; the caller reads `observed` and omits the component.
    const unobserved = coffersRead(vault(500), null, 100);
    expect(unobserved).toEqual({ observed: false, score01: 0, coverageTicks: 0, upkeepPerTick: 0 });
  });

  it('pressure is the INVERSE of coverage, and the horizon is where it ends', () => {
    const at = (coin) => coffersRead(vault(coin, 0), army, 100);
    const perTick = at(0).upkeepPerTick;
    expect(perTick).toBeGreaterThan(0);
    const horizon = TREASURY_TUNING.COVERAGE_FULL_AT;
    expect(at(0).score01).toBe(1);                                   // cannot pay a single tick
    expect(at(perTick * horizon).score01).toBe(0);                   // exactly the horizon
    expect(at(perTick * horizon * 10).score01).toBe(0);              // clamped, never negative
    expect(at(perTick * (horizon / 2)).score01).toBeCloseTo(0.5, 10);
    expect(at(perTick * 3).coverageTicks).toBeCloseTo(3, 10);
  });
});
