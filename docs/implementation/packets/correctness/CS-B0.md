# CS / CS-B0 — the cultural axis gets its OWN seeding path (member 1 of `cs-b`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `eab6eba053e09732f12acbfe563874db02f056ce`
  (the `cs-a` train's dispatch base; authored on top of cs-a's terminal `e3b596a2`)
- **Train:** `cs-b`, family **CS** (un-stamped, cap 4), member **1**. Its change paths are
  disjoint from every other cs-b member, so no staged promotion is needed inside this train.
- **Preamble:** none — CS is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§110.1** (the chair's ruling on lane TE20's
  open fork: option (a) — the cultural feeder gets its own seeding path and the
  `beliefAxesCultural` STALENESS pin is restored **UNCHANGED**; truncating CS-A2 is
  REFUSED because the cure is signed and correct and the defect it exposed is downstream
  and real) · **§72.1 / §72.3** · **§80.2 / §27**.
- **Compile of record:** `laneTC20-CSGEN-PLAN.md` + `laneTE20-receipt.md` §10.2, which is
  the evidence §110.1 ruled on.

---

## §1 · THE DEFECT, AND WHY NOTHING SAW IT FOR SO LONG

`foldBeliefAxes` seeds the CULTURAL axis from ground truth when the observer has no prior
label. The test it used was **key presence**:

```js
const priorLabel = prior && typeof prior === 'object' && 'observanceLabel' in prior
  ? prior.observanceLabel ?? null
  : groundTruth.observanceLabel;
```

⛔ **A belief first folded before its subject's traditions had materialized wrote
`observanceLabel: null` — and from that moment the key EXISTED, so the ground-truth fallback
could never fire again.** The label was latched at `null` permanently, and the only escape
was a `tradition_change` beat clearing `CAT_ADOPT_ACCURACY`. An observer that never happened
to hear a rededication therefore held **no** belief about a neighbour's rite, forever.

⭐ **It was invisible until `cs-1` (CS-A2) landed, and that is the whole story.** Under the
old triangular silence decay a belief pruned every ~9 silent ticks and re-materialized with
`prior === null` — which broke the latch and re-seeded the label from truth. Measured at
cs-a's base, that is exactly what the D-1c fixture was showing:

| tick | truth | BASE `bBelief` | HEAD (cs-1 landed) |
|---:|---|---|---|
| 10 | old | **old** | *(none)* |
| 12 | **new** | **old** ← "the lag" | *(none)* |
| 14 | new | new | new |

**The "staleness" that pin observed was churn residue — a periodic re-copy of TRUTH — not
the rumor net working.** Curing the decay removed the churn and exposed the latch beneath
it. Ground truth is byte-identical between the two columns at every tick; only the observer's
label acquisition moved.

## §2 · WHAT REPLACES IT

The cold seed fires whenever the observer has **no label yet** — key absent **or**
present-but-null — so the axis has a seeding path of its own rather than living off another
subsystem's prune/re-seed cycle.

⛔ **THE STALENESS FEATURE IS UNTOUCHED, AND THAT IS THE POINT OF THE SHAPE.** Once a label
is held, the PRIOR still wins unless a fresh `tradition_change` clears
`CAT_ADOPT_ACCURACY`. This decides only where a *first* label comes from, never whether a
held one survives. `DESIGN_DEEP_COUPLINGS` §5 feeder B — "a rival that heard nothing still
believes the old rite persists after politics rededicated it" — is restored to working for
the reason it claims to work, rather than as a side effect of decay churn.

## §3 · THE PIN — RESTORED UNCHANGED, WHICH IS THE RULING

§110.1 rules that `tests/domain/beliefAxesCultural.test.js`'s STALENESS pin is restored
**unchanged**. It is: **not one character of that test file is edited by this member.** It
passes again because the engine now does what the pin always claimed.

That is deliberate and it is the strongest available proof. A pin rewritten to match new
behaviour proves only that someone rewrote it; a pin that was **written years before, left
untouched, and goes from red to green** proves the behaviour it describes is back.

## §4 · SIZE AND MANIFEST

`src/domain/worldPulse/beliefAxes.js`: **110 → 112** effective lines (eslint's own `Linter`),
against the layer's 800 ceiling — 688 of headroom. The two added lines are the split
conditional; the rest of the change is comment, which the count excludes.

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/domain/worldPulse/beliefAxes.js` |

Handwritten files: **1**. New production leaves: **0**. Flags: **0**. Persisted record
families: **0**. `retiredSymbols`: **NONE**. **No test file is touched**, so the lighting
census does not move for this member.

## §5 · STOP CONDITIONS

1. `beliefAxesCultural`'s STALENESS pin needs ANY edit to pass — that would refute §110.1's
   premise that the pin was right and the engine was wrong.
2. A held label starts being overwritten by ground truth (the staleness feature would be
   dead rather than cured).
3. Either belief dormancy contract arm moves.
