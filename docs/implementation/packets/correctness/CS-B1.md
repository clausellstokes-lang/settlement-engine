# CS / CS-B1 — the boom mint's missing `severed` predicate (member 2 of `cs-b`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `eab6eba053e09732f12acbfe563874db02f056ce`
  (the `cs-a` train's dispatch base; authored on top of cs-b's `6d19d5e7`)
- **Train:** `cs-b`, family **CS** (un-stamped, cap 4), member **2**. Its change paths are
  disjoint from CS-B0, CS-B2 and CS-B3, so all three of this train's remaining members
  are promoted together and no staged promotion is needed.
- **Preamble:** none — CS is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§72.1** (cs-3 confirmed: "boom mints under
  live embattlement then busts from nothing — the mint gate omits its own bust branch's
  `severed` predicate") · **§107.3** (J-TC20-4 SIGNED: cs-3 gates the **MINT**, not the
  dwell) · **§72.3** (the trajectory pin is mandatory) · **§111.3**.
- **Compile of record:** `laneTC20-CSGEN-PLAN.md` §4.5.

---

## §1 · THE DEFECT

`src/domain/worldPulse/upswingKernel.js:617` computes, for every settlement, every tick:

```js
const severed = embattled || throughput < T.BUST_THROUGHPUT || veinGone;
```

It is then consulted at exactly **one** site — `:621`, inside `if (prior?.phase === 'boom')`,
where it drives the bust. The **mint** branch at `:669-704` gates on throughput, centrality
and dwell alone, and never asks whether the town is under siege.

⛔ **So a settlement embattled from tick 0 accumulates dwell, mints a boom under live
siege, and busts on the very next tick.** Measured at this base, driving the estate's own
boom fixture (throughput 4, centrality 0.5) embattled from the first tick:

| tick | base — the defect | this cure |
|---:|---|---|
| 0-1 | `building`, dwell 1 → 2 | `building`, dwell 1 → 2 |
| 2 | **`boom_enter` mints under live siege** | `building`, dwell 3 |
| 3 | **bust** — prosperity Comfortable → Moderate, legitimacy 55 → 52, a `Trade Bust` condition | `building`, dwell 4 |
| 4-5 | the bust holds | `building`, dwell 5 → 6 |

The town is one prosperity band and three legitimacy points poorer, and carries a crisis
condition, **for a boom it never had**. That is a punishment minted from nothing, against
the module's own "no new capital from nothing" law.

## §2 · WHAT REPLACES IT

The mint gate carries the same predicate its own bust branch already enforces:

```js
if (!severed && dwell >= T.BOOM_MIN_DWELL) {
```

`severed` is already in scope; the change is one token on one line.

⚠ **§107.3 SIGNED THE MINT GATE, NOT THE DWELL ACCUMULATION, and the difference is the
whole behaviour.** Dwell keeps building under embattlement, so the boom **arrives the tick
the siege lifts** — the siege DELAYED it. Gating the accumulator instead would RESET the
clock — the siege KILLED it — which is a different world model and is not what was signed.
Measured: with the siege lifted after six embattled ticks, `boom_enter` mints on the **lift
tick itself**, not three ticks later.

## §3 · THE TRAJECTORY PIN (§72.3)

`tests/domain/upswingKernel.test.js` gains one suite of three arms, driving the real mover
tick by tick with the **accumulator on show**:

1. **The trajectory** — six embattled ticks: `dwell` is asserted as the exact sequence
   `[1,2,3,4,5,6]`, the phase stays `building` throughout, no receipt of any kind is
   emitted, no condition is minted, and prosperity and legitimacy never move. The arm also
   asserts that dwell CROSSES `BOOM_MIN_DWELL` mid-run, so the silence is a refusal to mint
   rather than a threshold that was never reached.
2. **The siege delayed it, it did not kill it** — lifting at tick 7 mints `boom_enter` on
   that very tick, and the boom sustains rather than flickering into a bust.
3. **The negative control** — the identical fixture unembattled mints at tick 3 on schedule.

⛔ **Why a single-tick fixture cannot do this.** At ticks 0, 1 and 2 base and cure agree
exactly; the divergence is a multi-tick story. This is the fixture-blind-spot class §72.1
named when it ruled that each of these cures lands with a trajectory pin.

**Mutants, both executed:** reverting the cure reds arms 1 and 2 and leaves arm 3 green;
planting the refused "gate the accumulation too" shape also reds arms 1 and 2, with the
discriminating message `expected [ +0, +0, +0, +0, +0, +0 ] to deeply equal [ 1, 2, 3, 4, 5, 6 ]`
and `the boom mints on the LIFT tick, with no fresh dwell to serve: expected [] to deeply
equal [ 'boom_enter' ]`. Arm 2 is therefore what pins §107.3's signed reading.

## §4 · SIZE AND MANIFEST

`src/domain/worldPulse/upswingKernel.js`: **640 → 640** effective lines (eslint's own
`Linter` under `max-lines { skipBlankLines: true, skipComments: true }`), against the
domain layer's 800 ceiling — **exactly line-neutral**, 160 of headroom untouched. The cure
adds one token to an existing line; everything else is comment, which the count excludes.

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/domain/worldPulse/upswingKernel.js` |
| 2 | MODIFY | `tests/domain/upswingKernel.test.js` |

Handwritten files: **2**. New production leaves: **0**. Flags: **0**. Persisted record
families: **0**. `retiredSymbols`: **NONE**. **+3 test titles, +1 suite title** — the
lighting census re-record for this train is carried by CS-B3, its last tests-moving member.

**Explicitly out of scope, deferred and documented:** the audit's **E-2** — a
`flourishing_enter` two ticks after a bust in an embattled town, because `peace01Of` at
`:198-204` reads war fronts and strangulation but not embattlement. §72.1 rules cs-3 as the
mint-gate cure only, and widening `peace01Of` would move the flourishing ledger for every
embattled settlement in every campaign, a materially larger blast radius than the whole
rest of `cs-b`. **Deliberately deferred — documented, not a bug to re-find.**

## §5 · STOP CONDITIONS

1. Any same-seed golden moves. This cure is expected to be **output-neutral** for every
   settlement that is not embattled while approaching a boom.
2. The dwell accumulator stops building under embattlement — that is the refused reading.
3. `upswingKernel.js` grows by even one effective line.
