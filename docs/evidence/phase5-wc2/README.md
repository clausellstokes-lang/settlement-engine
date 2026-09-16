# Phase 5 W-C2 evidence — conquest feeds + the compensating market

Deterministic soak (`scripts/audit/conquest-market-soak.mjs`, pinned constants + seeded
PRNG cohorts). It **measures** the landed dynamics; it tunes nothing. Re-run:

```
node scripts/audit/conquest-market-soak.mjs > docs/evidence/phase5-wc2/conquest-market-soak.txt \
                                            2> docs/evidence/phase5-wc2/conquest-market-soak.json
```

Full panels in `conquest-market-soak.txt`; machine-readable envelopes in
`conquest-market-soak.json`.

## A — Conquest-yield envelope by conqueror plane (the conscience gradient)

A metropolis falls (sack, severity 0.8); every victor runs a slave market. The captive
channel is gated by the **cruelty-axis conscience read** against `ABOLITION_FLOOR` (0.6,
reused from the moral-institution machinery); the loot channel is amoral.

| plane | abolition read | permitted | captive yield | loot yield |
|---|---|---|---|---|
| lawful/neutral/chaotic-**good** | 0.900 | **NO** | **0.000** (revenue LOST) | 0.700 |
| true-neutral | 0.000 | yes | 0.920 | 0.700 |
| lawful-evil / chaotic-evil | 0.000 | yes | 0.920 | 0.700 |
| (deity-free warlord) | 0.000 | yes | 0.920 | 0.700 |

**Good planes forecloses the captive trade — the yield is lost, never laundered into loot.**
Neutral/evil/deity-free profit. Loot is plane-independent. Captive yield rises with the
taken town's tier (thorp 0.32 → village 0.56 → town 0.68 → city 0.80 → metropolis 0.92) —
the pop-tier gradient. The law axis does not move the gate (slavery is a cruelty question).

## B — Loot-pulse decay profile (a pulse, not a rebase)

One metropolis sack, then peace. `LOOT_DECAY` 0.09 (week tick).

| week | loot pulse | prosperity lift (economy-health +) |
|---|---|---|
| 0 | 0.600 | 0.210 |
| 4 | 0.411 | 0.144 |
| 13 | 0.176 | 0.062 |
| 26 | 0.052 | 0.018 |

Half-life ≈ **8 wk**; the pulse clears (≤ EPS) at **51 wk (~1 yr)**, and the ledger entry
**drops back to byte-neutral absent**. No permanent step-change — the market boom is spent
over a season, then gone.

## C — Rented-force tradeoff (readiness bought vs prosperity paid)

All three legs scale with `activity = shortfall × presence`, all bounded
(`SUPPLEMENT_MAX` 0.35 · `COST_MAX` 0.3 · `FIDELITY_MAX` 0.3):

| shortfall | presence | activity | supplement (+readiness) | upkeep cost (−prosperity) | fidelity penalty |
|---|---|---|---|---|---|
| 0.50 | 1.00 | 0.50 | 0.175 | 0.150 | 0.150 |
| 1.00 | 1.00 | 1.00 | 0.350 | 0.300 | 0.300 |

`shortfall = exposure − native capability`: a menaced, engaged, unready, floor-kit town
reads shortfall **1.0**; a ready, well-supplied town reads **~0.01** ⇒ no market ⇒
byte-neutral. Buying force costs prosperity in proportion — guns-vs-butter.

## D — Hired-steel fidelity penalty (composition under the cap)

Seeded cohort (4000) at the war-decision read; the merc penalty is **folded into the rust
argument** (`rust + merc`), summed under `fidelityNoise`'s `TOTAL_MAX` (0.75). chaosPull 0.

| force | rust(exp) | merc penalty | mean \|err\| | max \|err\| |
|---|---|---|---|---|
| seasoned, **sworn** | 0.00 | 0.00 | **0.000** | 0.000 |
| seasoned, hired | 0.00 | 0.30 | 0.148 | 0.300 |
| rusty, sworn | 0.19 | 0.00 | 0.094 | 0.190 |
| rusty, hired | 0.19 | 0.30 | 0.248 | 0.490 |

Sworn steel (no active market, merc 0) is **byte-identical** to today. Hired steel degrades
the risk-calculator read — bounded, and capped under `TOTAL_MAX` so it never dominates.

## Laws obeyed

- **Neutrality / conditional materialization** — no captures ⇒ no `conquestFeeds` key; no
  war shortfall meeting mercenary supply ⇒ no `mercenaryMarket` key. Both readers return the
  identity when absent (verified by `tests/domain/conquestMarketWC2.test.js` + the three
  golden/dormancy oracles staying byte-identical).
- **Determinism** — no rng in the feeds/market derivation (state-derived); the only seeded
  draw is the pre-existing per-decision fidelity fork the penalty composes into.
- **Every mechanic emits its cause** — loot / captive_trade / captive_trade_foreclosed on
  the conquest-feed record; supply_shortfall / mercenary_supply / rented_readiness /
  mercenary_upkeep / hired_steel_noise on the market record.
- **Week-scale constants** — `LOOT_DECAY` / `CAPTIVE_DECAY` justified at the week tick
  (half-lives ~2 months); the market is instantaneous (one-tick read-last/write-next lag).
