/**
 * treasuryConservation.walker.test.js — THE CONSERVATION WALKER (W-COIN-2).
 *
 * A NEW INVARIANT CLASS, and it is worth saying what makes it one. The estate already
 * pins single-writer contracts (the field manifest), dormancy (raw-byte oracles) and
 * vocabulary totality (the kind-pool walkers). None of them can see the failure this
 * file exists for: coin that appears or vanishes without an entry in the ledger that is
 * supposed to account for it. That failure is invisible to every one of those
 * instruments — the writer is still the only writer, the dark path is still
 * byte-identical, the vocabulary is still closed — and it is the single most common way
 * a simulated economy rots. FMG's own arc is the receipt: their burg sales credit with no
 * counterparty debit, their poll tax where "the money simply appears".
 *
 * THE LAW, in one line: `Δ coin === coinFlowBalance(coinFlows)`, exactly, in integers, at
 * every settlement on every lit tick — with `shortfall` OUTSIDE the sum, because it is
 * coin that was demanded and NOT paid.
 *
 * ── WHICH GREENS HERE ARE DISCOVERY AND WHICH ARE REGRESSION ──────────────────
 * Stated up front, because "an arm that cannot discover anything is a green that means
 * less than it looks":
 *   • DISCOVERY — the executed identity over the writer (§3), the cross-settlement
 *     identity over the primitive + applicator (§4), the receipt reachability BY
 *     EXECUTION (§5), and the upkeep-basis liveness arm (§6), which reads the REAL
 *     deployment producer and would red the day its field moves.
 *   • CONTROLS — §7's four planted leaks. They are not coverage; they are the proof that
 *     §3 and §4 can convict at all. Every one of them doctors data or source IN MEMORY
 *     and asserts a RED, and none of them touches a file on disk.
 *   • REGRESSION, ARMED BUT NOT DISCOVERING TODAY — the transfer half of §4. No mover
 *     ships a coin leg in this train (the eight enumerated flows sit behind their own
 *     observation-window fork), so §4 drives the primitive directly. It is the guard the
 *     first mover with a coin leg will land against, and it is armed now so that mover
 *     cannot be the thing that also writes its own proof.
 *
 * ⛔ THIS FILE MUTATES NOTHING ON DISK. Every control is an in-memory doctoring of a
 * string or a record, so the file is safe to run on a shared working tree — the standing
 * reason the sweep-plant promotion defers for walkers of this family.
 *
 * @enforced-module src/domain/worldPulse/treasury.js
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  COIN_FLOW_TERMS,
  UPKEEP_BANDS,
  UPKEEP_LEDGERS,
  TREASURY_RECEIPT_KINDS,
  TREASURY_TUNING,
  coinFlowBalance,
  coinOf,
  advanceTreasury,
  computeCoinTransfer,
  applyCoinDeltasToUpdates,
  computeUpkeep,
  upkeepBandFor,
  upkeepCostOfBand,
} from '../../src/domain/worldPulse/treasury.js';
import { seedDeploymentState } from '../../src/domain/worldPulse/warArmyRecord.js';
import { SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_RULES } from '../../src/domain/worldPulse/simulationRules.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TREASURY_SRC_PATH = 'src/domain/worldPulse/treasury.js';
const treasurySrc = readFileSync(join(ROOT, TREASURY_SRC_PATH), 'utf8');

const LIT = Object.freeze({ treasuryEnabled: true });

/** The five terms, as the ledger a checker walks. */
const MOVEMENT_TERMS = Object.freeze(['taxed', 'transferredIn', 'upkeep', 'transferredOut']);

/**
 * A settlement whose ledger is open at `coin`, taxable through a real `incomeSources`
 * shape, and tiered so its capacity and base yield are the shipped ones.
 * @param {{ coin?: number, tier?: string, prosperity?: string,
 *           sources?: Array<Record<string, unknown>>, institutions?: unknown[] }} [o]
 */
function town({ coin = 0, tier = 'town', prosperity = 'Moderate', sources, institutions = [], seat } = {}) {
  return {
    tier,
    institutions,
    // A seat is how a settlement acquires a ruling power other than the fail-neutral
    // `mixed` — and `mixed` levies at `light`, which carries no legitimacy price. So a
    // world built without seats can never draw the price receipt, which is exactly what
    // §5's reachability arm discovered on its first run.
    powerStructure: seat
      ? { governingName: 'The Seat', factions: [{ faction: 'The Seat', category: seat, power: 40, isGoverning: true }] }
      : {},
    economicState: {
      prosperity,
      incomeSources: sources || [
        { source: 'Agricultural Rents', percentage: 55 },
        { source: 'Market Taxes', percentage: 25 },
        { source: 'Military Levy', percentage: 20 },
      ],
      treasury: {
        coin,
        openedTick: 1,
        lastTick: 1,
        coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 },
      },
    },
  };
}

/** A settlement that has never been taxed and has no ledger. */
function unopened(extra = {}) {
  return { tier: 'town', institutions: [], economicState: { incomeSources: [] }, ...extra };
}

/** A REAL stateful deployment record at the given offensive capacity, minted by the
 *  estate's own producer rather than hand-built — the whole point of §6. */
function realDeployment(offensive, tick = 3) {
  return seedDeploymentState({
    targetId: 'target', cap: { theoretical: offensive, offensive, homeDefense: offensive, facets: {} },
    tick, logisticsBurden: 0.2, role: 'siege',
  });
}

/**
 * THE CHECKER. Walk a settlement one lit tick and return the verdict the law demands:
 * the coin actually moved, the coin the ledger accounts for, and whether they agree.
 * Every arm below — including every planted leak — is judged through this one function,
 * so a control cannot pass by being checked more leniently than the real drive.
 * @param {any} settlement @param {Record<string, unknown>} options
 */
function tickVerdict(settlement, options = {}) {
  const before = coinOf(settlement);
  const { settlement: after, summary } = advanceTreasury(settlement, { rules: LIT, ...options });
  const flows = /** @type {any} */ (after)?.economicState?.treasury?.coinFlows;
  const moved = coinOf(after) - before;
  const accounted = coinFlowBalance(flows);
  return { before, after, summary, flows, moved, accounted, balanced: moved === accounted };
}

// ── 1 · THE LEDGER IS CLOSED ─────────────────────────────────────────────────

describe('the coin ledger is a closed vocabulary, and its shape cannot drift', () => {
  test('COIN_FLOW_TERMS is frozen, exact, and duplicate-free', () => {
    expect(Object.isFrozen(COIN_FLOW_TERMS)).toBe(true);
    expect([...COIN_FLOW_TERMS].sort()).toEqual(
      ['shortfall', 'taxed', 'transferredIn', 'transferredOut', 'upkeep'],
    );
    expect(new Set(COIN_FLOW_TERMS).size).toBe(COIN_FLOW_TERMS.length);
  });

  test('every `coinFlows` literal the writer builds carries EXACTLY those five keys', () => {
    // The source scan, not a fixture read: a sixth key added to one of the two literals
    // would be a term nothing balances, and the identity would silently stop covering it.
    const literals = [...treasurySrc.matchAll(/coinFlows:\s*\{([^}]*)\}/g)].map((m) => m[1]);
    expect(literals.length, 'no `coinFlows` literal found — re-point this scan').toBeGreaterThanOrEqual(1);
    for (const body of literals) {
      const keys = [...body.matchAll(/(\w+)\s*:/g)].map((m) => m[1]).filter((k) => k !== 'record');
      // A spread-and-patch literal names a subset; a full literal names all five. Either
      // way NO key may appear that the closed vocabulary does not contain.
      const foreign = keys.filter((k) => !COIN_FLOW_TERMS.includes(k));
      expect(foreign, `\`coinFlows\` literal names a term the ledger cannot balance: ${foreign}`).toEqual([]);
    }
    // …and the arm is not vacuous: the full literal really does name all five.
    const full = literals.find((b) => COIN_FLOW_TERMS.every((t) => b.includes(`${t}:`)));
    expect(full, 'no literal names all five terms — the record shape moved').toBeTruthy();
  });

  test('CONTROL: a foreign term planted in a `coinFlows` literal is convicted', () => {
    // PLANTED CONTROL, in memory. This is the scan above, re-run over doctored source.
    const doctored = treasurySrc.replace(
      'coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 }',
      'coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0, skimmed: 0 }',
    );
    expect(doctored, 'the plant did not apply — re-point the control').not.toBe(treasurySrc);
    const foreign = [...doctored.matchAll(/coinFlows:\s*\{([^}]*)\}/g)]
      .flatMap((m) => [...m[1].matchAll(/(\w+)\s*:/g)].map((k) => k[1]))
      .filter((k) => !COIN_FLOW_TERMS.includes(k));
    expect(foreign).toContain('skimmed');
  });

  test('SHORTFALL IS NOT A MOVEMENT — the balance ignores it, by execution', () => {
    // The leak nobody looks for: counting unpaid demand as if coin had moved. It leaks in
    // the OPPOSITE direction from the leak everyone hunts, so it gets its own arm.
    const base = { taxed: 40, upkeep: 25, transferredIn: 0, transferredOut: 0, shortfall: 0 };
    expect(coinFlowBalance(base)).toBe(15);
    expect(coinFlowBalance({ ...base, shortfall: 9_999 })).toBe(15);
    // …and the balance is REAL arithmetic, not a constant: each movement term moves it.
    expect(coinFlowBalance({ ...base, taxed: 41 })).toBe(16);
    expect(coinFlowBalance({ ...base, upkeep: 26 })).toBe(14);
    expect(coinFlowBalance({ ...base, transferredIn: 7 })).toBe(22);
    expect(coinFlowBalance({ ...base, transferredOut: 7 })).toBe(8);
    for (const term of MOVEMENT_TERMS) expect(COIN_FLOW_TERMS).toContain(term);
  });
});

// ── 2 · THE UPKEEP LAW ───────────────────────────────────────────────────────

describe('the upkeep sink is one law, parameterized by a closed ledger roster', () => {
  test('UPKEEP_LEDGERS holds only ledgers with a live reader', () => {
    expect(Object.isFrozen(UPKEEP_LEDGERS)).toBe(true);
    // Exactly what ships. W-SEAT's SEAT-8 adds `civilContests` and `interventions` WITH
    // their call sites; a member landing ahead of its reader is the dead-arm class that
    // struck `treasury_shortfall` out of the receipt roster one car ago.
    expect([...UPKEEP_LEDGERS]).toEqual(['deployments']);
    expect(treasurySrc).toMatch(/ledger: 'deployments'/);
  });

  test('an unknown ledger is refused rather than silently charged', () => {
    const charged = computeUpkeep(1000, [{ ledger: 'civilContests', record: realDeployment(60) }]);
    expect(charged.owed).toBe(0);
    expect(charged.entries).toEqual([]);
    // …and the SAME record under the known ledger really does charge, so the refusal
    // above is the roster working and not a broken reader.
    expect(computeUpkeep(1000, [{ ledger: 'deployments', record: realDeployment(60) }]).owed)
      .toBeGreaterThan(0);
  });

  test('the band table is total, ordered, and every band is an UPKEEP_BANDS member', () => {
    const rows = TREASURY_TUNING.UPKEEP_BY_STRENGTH_BAND;
    expect(rows.length).toBeGreaterThan(1);
    expect(rows[rows.length - 1].upToStrength, 'the last row must be the catch-all').toBe(null);
    for (const row of rows) {
      expect(UPKEEP_BANDS, `${row.band} is not in the closed band vocabulary`).toContain(row.band);
      expect(Number.isInteger(row.coin)).toBe(true);
      expect(row.coin).toBeGreaterThan(0);
    }
    // Thresholds ascend, and so do costs — a table that crossed would price a bigger
    // army cheaper, which is the kind of thing nobody notices in a frozen literal.
    const bounded = rows.filter((r) => r.upToStrength !== null).map((r) => r.upToStrength);
    expect([...bounded].sort((a, b) => a - b)).toEqual(bounded);
    const costs = rows.map((r) => r.coin);
    expect([...costs].sort((a, b) => a - b)).toEqual(costs);
    // TOTALITY by execution across the whole 0..100 capacity scale plus the far edge.
    for (const strength of [0.4, 1, 20, 20.5, 35, 55, 55.1, 100, 1e6]) {
      const band = upkeepBandFor({ targetId: 't', currentEffectiveStrength: strength });
      expect(UPKEEP_BANDS).toContain(band);
      expect(band, `strength ${strength} fell through the table`).not.toBe('none');
    }
    expect(upkeepBandFor(null)).toBe('none');
    expect(upkeepBandFor({ currentEffectiveStrength: 60 })).toBe('none');   // no targetId — not a commitment
    expect(upkeepBandFor({ targetId: 't', currentEffectiveStrength: 0 })).toBe('none');
    expect(upkeepCostOfBand('none')).toBe(0);
  });

  test('upkeep spends to ZERO and never below — the reserve floor is a TRANSFER clause', () => {
    // The distinction is the reason COIN_RESERVE exists in its own words: the reserve
    // protects the vault from being emptied by a treaty *so that* a court can still pay
    // its garrison. Upkeep IS the garrison, so it spends the last coin.
    const reserve = TREASURY_TUNING.COIN_RESERVE;
    expect(reserve).toBeGreaterThan(0);
    const band = upkeepBandFor(realDeployment(60));
    const cost = upkeepCostOfBand(band);
    expect(cost).toBeGreaterThan(reserve);              // else this arm proves nothing
    const poor = computeUpkeep(reserve, [{ ledger: 'deployments', record: realDeployment(60) }]);
    expect(poor.paid).toBe(reserve);                    // it spent THROUGH the reserve
    expect(poor.shortfall).toBe(cost - reserve);
    const broke = computeUpkeep(0, [{ ledger: 'deployments', record: realDeployment(60) }]);
    expect(broke.paid).toBe(0);
    expect(broke.shortfall).toBe(cost);
    expect(broke.owed).toBe(cost);
  });

  test('partial payment is the law — never all-or-nothing, never an overdraft', () => {
    const record = realDeployment(60);
    const cost = upkeepCostOfBand(upkeepBandFor(record));
    for (const purse of [0, 1, cost - 1, cost, cost + 1]) {
      const r = computeUpkeep(purse, [{ ledger: 'deployments', record }]);
      expect(r.paid).toBe(Math.min(purse, cost));
      expect(r.shortfall).toBe(cost - r.paid);
      expect(r.paid + r.shortfall).toBe(r.owed);
      expect(r.paid).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(r.paid)).toBe(true);
    }
  });
});

// ── 3 · THE IDENTITY, EXECUTED OVER THE WRITER ───────────────────────────────

describe('CONSERVATION at the writer: Δ coin === coinFlowBalance(coinFlows), exactly', () => {
  test('holds tick by tick across a world with a mint, a sink, a stop and two suspensions', () => {
    /** @type {Array<{ name: string, settlement: any, options: Record<string, unknown> }>} */
    const world = [
      { name: 'taxing town', settlement: town({ coin: 0 }), options: {} },
      { name: 'paying town', settlement: town({ coin: 400 }), options: { deployment: realDeployment(50) } },
      { name: 'broke hamlet', settlement: town({ coin: 0, tier: 'hamlet' }), options: { deployment: realDeployment(60) } },
      { name: 'besieged city', settlement: town({ coin: 300, tier: 'city' }), options: { blockade: { type: 'siege' } } },
      { name: 'occupied town', settlement: town({ coin: 90 }), options: { blockade: { type: 'occupation' } } },
      { name: 'full thorp', settlement: town({ coin: 120, tier: 'thorp' }), options: {} },  // capacity 120 — the stop
      // The one seat that pays a legitimacy price every tick: a criminal court levies at
      // `extractive` on three rows. The price is an OPINION delta riding the summary — it
      // must never appear in the coin ledger, and this row is what would catch it if it did.
      { name: 'criminal seat', settlement: town({ coin: 200, seat: 'criminal' }), options: {} },
    ];
    let sawMint = 0;
    let sawSink = 0;
    let sawStop = 0;
    let sawShortfall = 0;
    let sawPrice = 0;
    for (let tick = 2; tick <= 13; tick += 1) {
      for (const row of world) {
        const v = tickVerdict(row.settlement, { ...row.options, tick });
        expect(
          v.balanced,
          `${row.name} @${tick}: coin moved ${v.moved} but the ledger accounts for ${v.accounted}`,
        ).toBe(true);
        expect(Number.isInteger(coinOf(v.after))).toBe(true);
        expect(coinOf(v.after)).toBeGreaterThanOrEqual(0);
        if (v.summary.taxed > 0) sawMint += 1;
        if (v.summary.upkeepPaid > 0) sawSink += 1;
        if (v.summary.taxStopped > 0) sawStop += 1;
        if (v.summary.shortfall > 0) sawShortfall += 1;
        if (v.summary.legitimacyDelta < 0) sawPrice += 1;
        row.settlement = v.after;
      }
    }
    // ⭐ ANTI-VACUITY. An identity over a world where nothing happened is a green that
    // means nothing, and this program has shipped one of those before. Every branch the
    // identity is supposed to cover must have actually fired.
    expect(sawMint, 'no tick minted — the identity proved nothing').toBeGreaterThan(0);
    expect(sawSink, 'no tick paid upkeep').toBeGreaterThan(0);
    expect(sawStop, 'no tick was capacity-stopped').toBeGreaterThan(0);
    expect(sawShortfall, 'no tick shortfalled').toBeGreaterThan(0);
    // ⭐ AND THE OPINION WRITE FIRED WITHOUT EVER ENTERING THE COIN LEDGER. The identity
    // above held on every one of those ticks, which is the direction-of-read law (§4.4)
    // proven rather than asserted: the stock's one opinion write moves no coin.
    expect(sawPrice, 'no tick paid a legitimacy price').toBeGreaterThan(0);
  });

  test('a capacity-stopped mint never enters the vault, and a shortfall never leaves it', () => {
    // The two halves of the identity that are easiest to get wrong in opposite directions.
    const stopped = tickVerdict(town({ coin: 120, tier: 'thorp' }), { tick: 5 });
    expect(stopped.summary.taxStopped).toBeGreaterThan(0);
    expect(stopped.flows.taxed).toBe(stopped.summary.taxed);
    expect(stopped.moved).toBe(stopped.summary.taxed - stopped.summary.upkeepPaid);

    const short = tickVerdict(town({ coin: 0, tier: 'hamlet' }), { tick: 5, deployment: realDeployment(60) });
    expect(short.summary.shortfall).toBeGreaterThan(0);
    expect(short.flows.shortfall).toBe(short.summary.shortfall);
    // The unpaid demand moved NO coin: the whole delta is explained by what was paid.
    expect(short.moved).toBe(short.summary.taxed - short.summary.upkeepPaid);
    expect(coinOf(short.after)).toBeGreaterThanOrEqual(0);
  });

  test('a DARK tick moves nothing and accounts for nothing — the identity holds trivially', () => {
    const before = town({ coin: 500 });
    const { settlement: after, summary } = advanceTreasury(before, { tick: 9, rules: {} });
    expect(summary).toBe(null);
    expect(after).toBe(before);                          // BY REFERENCE — a key is a byte
  });
});

// ── 4 · THE IDENTITY, EXECUTED ACROSS SETTLEMENTS ────────────────────────────

describe('CONSERVATION across settlements: Σ Δ coin === −Σ destroyed, exactly', () => {
  test('holds over concurrent draws with a capacity clamp, a reserve edge and an absent leg', () => {
    const reserve = TREASURY_TUNING.COIN_RESERVE;
    const world = {
      payerA: town({ coin: 1000, tier: 'city' }),
      payerB: town({ coin: 800, tier: 'city' }),
      payerBroke: town({ coin: reserve + 1 }),
      payee: town({ coin: 0, tier: 'thorp' }),           // capacity 120 — the clamp edge
      bystander: unopened(),
    };
    const updates = Object.entries(world).map(([saveId, settlement]) => ({ saveId, settlement }));
    const index = new Map(updates.map((u, i) => [String(u.saveId), i]));
    const before = updates.reduce((sum, u) => sum + coinOf(/** @type {any} */ (u.settlement)), 0);

    /** @type {Map<string, number>} */
    const deltas = new Map();
    let destroyed = 0;
    let committedDebit = 0;
    let committedCredit = 0;
    for (const draw of [
      { from: 'payerA', amount: 300 },
      { from: 'payerB', amount: 200 },
      { from: 'payerBroke', amount: 500 },               // reserve edge — shortfalls whole
      { from: 'bystander', amount: 100 },                // absent leg — returns null
    ]) {
      const r = computeCoinTransfer({
        payer: world[draw.from], payee: world.payee, amount: draw.amount,
        committedDebit: draw.from === 'payerB' ? committedDebit : 0, committedCredit,
      });
      if (!r || r.shortfall) continue;
      deltas.set(draw.from, (deltas.get(draw.from) || 0) - r.debited);
      deltas.set('payee', (deltas.get('payee') || 0) + r.credited);
      destroyed += r.destroyed;
      committedCredit += r.credited;
      if (draw.from === 'payerA') committedDebit = r.debited;
    }
    const after = applyCoinDeltasToUpdates(updates, index, deltas)
      .reduce((sum, u) => sum + coinOf(/** @type {any} */ (u.settlement)), 0);
    expect(after - before).toBe(-destroyed);
    expect(destroyed, 'nothing was destroyed — the sink arm proved nothing').toBeGreaterThan(0);
    expect(deltas.size, 'fewer than two parties moved').toBeGreaterThan(1);
  });
});

// ── 5 · RECEIPT REACHABILITY, BY EXECUTION ───────────────────────────────────

describe('every declared receipt kind is DRAWN by a real drive — not merely present in source', () => {
  test('all seven kinds are emitted by executing the writer', () => {
    // ⭐ THE UPGRADE OVER THE ARM THAT FOUND THE FIRST DEAD KIND. 1a's reachability check
    // was a source regex for `kind: '<name>'`, which convicted a declared-but-unreachable
    // kind only because nothing had written the literal. A kind CAN be written into a
    // branch no input reaches — drawn, counted, and unreachable — and a regex cannot tell
    // the difference. This arm executes until every kind has actually been seen.
    /** @type {Set<string>} */
    const seen = new Set();
    const drives = [
      { settlement: unopened(), options: { tick: 1 } },                                  // opens
      { settlement: town({ coin: 0 }), options: { tick: 4 } },                           // taxes
      // A NOBLE seat resolves to `autocrat`, which levies at `heavy` — the lightest band
      // that carries a legitimacy price at all. The seatless towns above resolve to the
      // fail-neutral `mixed`, whose `light` levy is priceless, so this drive is the ONLY
      // one here that can draw the price receipt.
      { settlement: town({ coin: 0, seat: 'noble' }), options: { tick: 4 } },
      { settlement: town({ coin: 400 }), options: { tick: 4, deployment: realDeployment(50) } },
      { settlement: town({ coin: 0, tier: 'hamlet' }), options: { tick: 4, deployment: realDeployment(60) } },
      { settlement: town({ coin: 10 }), options: { tick: 4, blockade: { type: 'siege' } } },
      { settlement: town({ coin: 10 }), options: { tick: 4, blockade: { type: 'occupation' } } },
    ];
    for (const drive of drives) {
      const { summary } = advanceTreasury(drive.settlement, { rules: LIT, ...drive.options });
      for (const receipt of summary.receipts) seen.add(receipt.kind);
    }
    expect([...seen].sort()).toEqual([...TREASURY_RECEIPT_KINDS].sort());
  });
});

// ── 6 · THE UPKEEP BASIS IS ALIVE ON THE WORLDS THAT HAVE WARS ───────────────

describe('the upkeep basis is a field the shipped worlds actually carry', () => {
  test('a REAL seeded deployment record bands to a real charge', () => {
    // Read the estate's OWN producer, never a hand-built fixture: this is the arm that
    // reds the day `currentEffectiveStrength` is renamed, re-scaled, or stops being
    // seeded — the failure that would otherwise make every army in every world free.
    const record = realDeployment(48);
    expect(record.currentEffectiveStrength).toBeGreaterThan(0);
    const band = upkeepBandFor(record);
    expect(band).not.toBe('none');
    expect(UPKEEP_BANDS).toContain(band);
    expect(upkeepCostOfBand(band)).toBeGreaterThan(0);
  });

  test('⛔ THE CHARTER\'S NAMED FIELD WOULD HAVE BEEN DEAD ON THE FLAGSHIP WAR PRESET', () => {
    // MEASURED, AND KEPT AS A STANDING ARM RATHER THAN A PARAGRAPH. The design body named
    // `UPKEEP_PER_TICK(deployedPopulation band)`. `deployedPopulation` is written in
    // exactly two places, both behind `warEconomyDrainEnabled` / `warLevyEnabled`, and
    // `seedDeploymentState` does not mint it at all — so on `dramatic_campaign`, the one
    // preset besides full_simulation that lights `warLayerEnabled`, an upkeep keyed on it
    // would have been identically zero on every world anyone plays. Same shape as the
    // criminal-income exclusion this lane cured one car ago: an input that is real in the
    // source and absent in the worlds.
    const seeded = seedDeploymentState({
      targetId: 't', cap: { theoretical: 50, offensive: 50, homeDefense: 50, facets: {} },
      tick: 1, logisticsBurden: 0,
    });
    // THE LIVENESS ANCHOR for the negative below: the producer really did produce a
    // record, and that record really does carry the field this module reads instead. A
    // bare absence assertion would pass just as happily against `{}`.
    expect(seeded).toHaveProperty('currentEffectiveStrength');
    expect(seeded.currentEffectiveStrength).toBeGreaterThan(0);
    expect(seeded).not.toHaveProperty('deployedPopulation'); // anchored: the two assertions directly above prove the producer returned a populated record carrying the field we DO read, so an emptied or renamed producer reds there rather than passing here.

    const dramatic = SIMULATION_RULE_PRESETS.dramatic_campaign.rules;
    expect(dramatic.warLayerEnabled, 'dramatic_campaign no longer lights war — re-read this arm').toBe(true);
    expect(dramatic.warEconomyDrainEnabled).not.toBe(true);
    expect(dramatic.warLevyEnabled).not.toBe(true);
    expect(DEFAULT_SIMULATION_RULES.warEconomyDrainEnabled).toBe(false);
    expect(DEFAULT_SIMULATION_RULES.warLevyEnabled).toBe(false);
    // …and the CONTRAST that proves the reading: full_simulation DOES light both, so the
    // field is not dead everywhere — it is dead exactly where this arm says it is.
    expect(SIMULATION_RULE_PRESETS.full_simulation.rules.warEconomyDrainEnabled).toBe(true);
    expect(SIMULATION_RULE_PRESETS.full_simulation.rules.warLevyEnabled).toBe(true);
  });
});

// ── 7 · THE PLANTED LEAKS — the proof the arms above can convict ─────────────

describe('PLANTED CONTROLS: a leak in any direction is convicted', () => {
  /** Doctor a settlement's post-tick coin by `delta` without touching its ledger, and
   *  judge it through the SAME balance the real arms use. */
  const leak = (delta) => {
    const before = town({ coin: 400 });
    const { settlement: after } = advanceTreasury(before, { rules: LIT, tick: 6 });
    const treasury = /** @type {any} */ (after).economicState.treasury;
    const moved = (treasury.coin + delta) - coinOf(before);
    return { moved, accounted: coinFlowBalance(treasury.coinFlows) };
  };

  test('a MINT LEAK — coin appearing with no term to explain it — reds', () => {
    const v = leak(+37);
    expect(v.moved).not.toBe(v.accounted);
    expect(v.moved - v.accounted).toBe(37);
  });

  test('a SINK LEAK — coin vanishing with no term to explain it — reds', () => {
    const v = leak(-37);
    expect(v.moved).not.toBe(v.accounted);
    expect(v.accounted - v.moved).toBe(37);
  });

  test('the UNDOCTORED drive balances — so the two arms above are not refusing everything', () => {
    const v = leak(0);
    expect(v.moved).toBe(v.accounted);
  });

  test('a BALANCE that counted `shortfall` as a movement would mis-state a shortfalling tick', () => {
    // The fourth leak, and the only one the real balance function itself could carry. A
    // shortfalling drive is judged twice — once by the shipped law, once by a doctored
    // law that adds the unpaid demand — and the two MUST disagree, or `shortfall` has
    // stopped being excluded and nothing else in this file would notice.
    const v = tickVerdict(town({ coin: 0, tier: 'hamlet' }), { tick: 6, deployment: realDeployment(60) });
    expect(v.flows.shortfall).toBeGreaterThan(0);
    expect(v.balanced).toBe(true);
    const doctored = coinFlowBalance(v.flows) - Number(v.flows.shortfall);
    expect(doctored).not.toBe(v.moved);
  });

  test('CONTROL: the source really does exclude shortfall from the balance', () => {
    // The doctored-source half of the same claim, so the exclusion is proven structurally
    // as well as behaviourally: the balance body must not read the term at all.
    const body = /export function coinFlowBalance\([^)]*\)\s*\{([\s\S]*?)\n\}/.exec(treasurySrc);
    expect(body, 'coinFlowBalance moved — re-point this control').toBeTruthy();
    expect(body[1]).not.toMatch(/shortfall/); // anchored: the arm directly above proves by execution that a shortfalling tick still balances, so an emptied or renamed body reds there rather than passing here.
    for (const term of MOVEMENT_TERMS) expect(body[1]).toContain(term);
  });
});
