# CS / CS-A2 — `cs-1`, the belief silence-decay cure (member 2 of 4 of `cs-a`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `eab6eba053e09732f12acbfe563874db02f056ce`
  (`beliefMap.js` blob `08499928`, byte-identical to the R-CSA audit base `d5a6c009`)
- **Landed:** `014a1c60`. **Measured:** the base trajectory tracks the triangular
  `0.92^(n(n+1)/2)` exactly at every tick and prunes at **9**; the cure follows the
  round4-accumulated recurrence exactly at **all 42 live ticks** and prunes at **43**;
  `lastUpdateTick` holds one distinct value across the whole run. `Math.pow` parts from
  the recurrence at **tick 7**, worst-case **1.364e-4**. Two planted mutants, restored
  with `cmp` exit 0: reverting the silence branch red **3 of 23**; the naive
  `lastUpdateTick = now` cure red **exactly 1 of 23** — the invariance arm, the arm that
  exists for that wrong cure. Member battery **6 files / 84 tests** with only the two
  declared-shift goldens red. Effective lines **778 → 778**.
- **Train:** `cs-a`, family **CS** (un-stamped, cap 4), member **2 of 4**.
- **Preamble:** none — see CS-A1 §preamble for the reasoning; CS is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§72.1** (cs-1 confirmed: belief silence
  decay compounds as `0.92^(n(n+1)/2)` against the documented half-life-8; prune at 9
  ticks rather than ~42; the frozen `lastUpdateTick` is the mechanism; each cure lands
  with a TRAJECTORY pin, not only a pure-function pin) · **§72.3** (the trajectory-pin
  requirement and the declared-shift discipline) · **§107.2** (**J-TC20-3 SIGNED**: the
  cure is the UNIFORM ONE-STEP decay model; the persisted `lastDecayTick` anchor is
  REFUSED as a schema act in owner territory; ⛔ the round4-accumulation nuance BINDS the
  pin's shape) · **§80.2 / §27** (goldens re-record ONCE at THE ONE REGEN).
- **Compile of record:** `laneTC20-CSGEN-PLAN.md`.

---

## §1 · WHAT IS THERE NOW

Inside `reconcileSlot`, both branches compute a silence window against the prior record's
`lastUpdateTick` — and the silence branch then **persists the decayed confidence while
leaving `lastUpdateTick` frozen**. The next pass therefore decays an already-decayed
value over a window one tick longer. The exponent is triangular.

**Measured at this base** through the real `advanceBeliefMaps`, cold-start seeded at
confidence 1 and silent thereafter:

| silent tick | base | cure | documented `0.92^n` | triangular `0.92^(n(n+1)/2)` |
|---:|---:|---:|---:|---:|
| 1 | 0.92 | 0.92 | 0.9200 | 0.9200 |
| 4 | 0.4344 | 0.7164 | 0.7164 | 0.4344 |
| 8 | 0.0497 | 0.5133 | 0.5132 | 0.0497 |
| 9 | **PRUNED** | 0.4722 | 0.4722 | 0.0235 |
| 43 | — | **PRUNED** | 0.0277 | — |

Base tracks the triangular column **exactly at every tick**. The prune tick moves
**9 → 43**. `SIEGE_AWARENESS_CONFIDENCE = 0.35` is first crossed at base tick 5 and cure
tick 13; half confidence moves from base tick 4 to cure tick 9, which is the documented
"half-life ≈ 8 ticks" told honestly for the first time.

## §2 · WHAT REPLACES IT — THE UNIFORM ONE-STEP MODEL

Exactly one `SILENCE_DECAY` step is applied per advance pass, in **both** branches:
`silent` becomes `priorRec ? 1 : 0` in the fresh-report branch and `1` in the silence
branch.

⚠ **`lastUpdateTick` is deliberately NOT touched.** It also gates the fresh-report filter
(`arrivalTick > lastUpdateTick`), so moving it would silently drop reports that arrived
during silence. That is the audit's own warning and this cure respects it.

**Why uniform, and not `silent = 0` in the fresh branch.** A belief refreshed on
consecutive ticks already decays exactly once today (`now − lastUpdateTick = 1`). The
uniform model reproduces that case byte-identically; a zero would change the never-silent
case as well, moving strictly more bytes for no correctness gain. The uniform model
diverges from base only from the **second** consecutive silent tick — which is precisely
the defect's own footprint.

**The refused alternative, recorded (J-TC20-3, chair-signed).** A persisted `lastDecayTick`
anchor is exactly right across a dormancy gap, where the uniform model under-decays
because it ties decay to advance passes rather than to tick delta. It was refused because
it adds a field to a persisted conditional ledger — a schema act, owner territory — and
would move bytes on every belief record rather than only the silent ones. The trade is
recorded honestly rather than hidden: **decay is now tied to advance passes, not to tick
delta.**

## §3 · ⛔ THE TRAJECTORY PIN — AND THE `Math.pow` TRAP THE RULING NAMES

§107.2 binds the pin's shape, and the binding is not theoretical. **Measured at this
base against the cured tree:**

```
first 12 observed  = [0.92,0.8464,0.7787,0.7164,0.6591,0.6064,0.5579,0.5133,0.4722,0.4344,0.3996,0.3676]
round4 recurrence  = [0.92,0.8464,0.7787,0.7164,0.6591,0.6064,0.5579,0.5133,0.4722,0.4344,0.3996,0.3676]
round4(Math.pow)   = [0.92,0.8464,0.7787,0.7164,0.6591,0.6064,0.5578,0.5132,0.4722,0.4344,0.3996,0.3677]

observed === round4-accumulated recurrence  : true   (EXACT, all 42 live ticks)
observed === round4(Math.pow(0.92, n))      : false  (diverges first at tick 7)
max |recurrence − Math.pow|                 : 1.364e-4
```

⛔ **A pin written the obvious way — exact equality against `Math.pow(0.92, n)` — would be
FALSE at tick 7.** The recurrence `c₀ = 1; cₙ = round4(cₙ₋₁ × 0.92)` *is* the semantics,
because `round4` is applied once per persistence pass. Loosening a tolerance would be the
wrong repair.

⚠ The compile stated the divergence as "up to 1.0e-4"; the measured worst case over the
full live run is **1.364e-4**. The corrected figure is recorded here rather than inherited.

The pin drives the real `advanceBeliefMaps` from a cold start through **12 consecutive
silent ticks**, asserting the whole collected array against the recurrence, and adds three
arms the single-call fixture could never see:

- **`lastUpdateTick` is unchanged across all twelve ticks** — the invariant the cure must
  not break, and the one a naive `lastUpdateTick = now` cure would violate silently.
- **the prune tick is 43** — one number carrying the whole semantic claim, and the figure a
  regression moves first.
- **the negative control**: the triangular trajectory the base produced is asserted to be
  what the cure does NOT produce, so the pin cannot pass against a reverted cure.

## §4 · THE DECLARED SHIFT THIS MEMBER OWNS

`worldState.spatialLedgers.beliefMaps[*][*][*].confidence01` on every belief-active
campaign, from the **second consecutive silent tick onward**; the pruned-belief
cardinality; and every downstream confidence consumer — siege awareness, council-schism
detection, believed-need scaling, ally-intel vetting. Goldens re-record ONCE at THE ONE
REGEN, never here.

## §5 · CHANGE MANIFEST

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/domain/worldPulse/beliefMap.js` |
| 2 | TEST | `tests/domain/beliefMap.test.js` |

Handwritten files: **2**. Effective lines: **778 → 778** (line-neutral; 22 of headroom
under the layer's 800 ceiling). New production leaves: **0**. Flags: **0**.
`retiredSymbols`: **NONE**.

⚠ `tests/fixtures/belief-map-golden.json` is **not** in the manifest: under §72.3 and
§80.2 this train carries the shift DECLARATION, and every golden re-records at THE ONE
REGEN. A golden test that reds because output legitimately moved is the declaration
arriving, not a defect.

## §6 · STOP CONDITIONS

1. `lastUpdateTick` moves under the cure.
2. The observed trajectory stops matching the round4-accumulated recurrence exactly.
3. The prune tick is anything other than 43.
4. A golden OUTSIDE the declared belief surface moves.
