# CS / CS-A3 — `cs-2`, the beaten army's second same-tick battle (member 3 of 4 of `cs-a`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `eab6eba053e09732f12acbfe563874db02f056ce`
  (`armyTransitKernel.js` blob `0dc38438`, byte-identical to the R-CSA audit base
  `d5a6c009`)
- **Train:** `cs-a`, family **CS** (un-stamped, cap 4), member **3 of 4**. CS-A4 shares
  this file and is therefore NOT promoted until this member reaches a terminal status —
  the §44 Road-A split promotion applied inside a train, forced by the validator's
  change-path reservation.
- **Preamble:** none — CS is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§72.1** (cs-2 confirmed: a beaten army
  fights a second same-tick battle at full home-ground advantage; the retreat exclusion
  runs only at collision detection; the cure lands with a TRAJECTORY pin) · **§72.3**
  (trajectory pins, accumulator visible, negative control per branch) · **§107.2**
  (ceilings named: `armyTransitKernel.js` 792/800, **+8 for CS-A3 and CS-A4 together**) ·
  **§80.2 / §27** (declared shift; goldens at THE ONE REGEN).
- **Compile of record:** `laneTC20-CSGEN-PLAN.md`.

---

## §1 · WHAT IS THERE NOW, AND IT REPRODUCES AT THIS BASE

The collision list is computed **once** at `:772`. The retreat exclusion lives only in
`hostilePairFor` (`:543-545`), which ran at **detection** time. Inside the loop the
loser's record is replaced by a RETREAT record with `position01: 0`, and
`groundAdvantage01 = clamp01(1 - rec.position01)` — so a record reset to zero fights its
next battle with **full defender's-ground advantage**, on ground it has just abandoned.

Executed at this base on a three-army crossing-path fixture (A marching on D; B and C both
hostile to A; paths overlapping):

```
tick 0: a[retreat a->a pos=0 str=15.125] b[march b->a pos=0 str=485] c[march c->a pos=0 str=194]
   news(2): wizard_news.0.field_battle.a.b | wizard_news.0.field_battle.a.c
```

**A fights twice in one tick and is mauled twice: 50 → 27.5 → 15.125.**

## §2 · ⛔ THE COMPILE'S TWO-ARM GUARD IS REFUTED BY MEASUREMENT — AND THE CURE IS WIDER

The compile specified two arms and asserted "**both are needed and neither subsumes the
other**", reasoning that `retreated` would catch this tick's losers "even when
`retreatRoute` returned no path (so the record kept its old role)". **Both halves of that
claim are measured false**, and the second one leaves the defect live.

**(a) The two arms are mutually redundant.** `retreated.add(result.loserId)` is lexically
inside the `if (scored …) { if (retreatRec) { records[…] = retreatRec; … } }` block, so
`retreated.has(id)` strictly implies `records[id].role === RETREAT`; and `a`/`b` are
re-read from `records` at the top of every loop iteration, so the role arm sees the
rewritten record. Four variants were built and driven through the same fixture — both
arms, role only, `retreated` only, and a fought-set — and **all four produce byte-identical
output**. Each arm alone therefore reds nothing that the other does not already catch:
the recorded redundant-guard-vacuity class, exactly.

**(b) Neither arm closes the no-retreat-route case.** When `retreatRoute` returns no path
the record is never replaced, so its role stays MARCH **and** `retreated` is never
populated — the two are populated by the same block. Executed with routing forced to fail:

```
base,        retreatRoute → null :  news(2)   a mauled 50 → 27.5 → 15.125
compile cure, retreatRoute → null :  news(2)   a mauled 50 → 27.5 → 15.125   ← UNCURED
this cure,    retreatRoute → null :  news(1)   a mauled 50 → 27.5            ← CURED
```

**The cure therefore keys on having been BEATEN this tick, not on having successfully
retreated** — which is what §72.1's own invariant says ("a beaten pair fights ONCE per
encounter"), and what the compile's own trajectory pin demands. A `fought` Set is
populated with the loser of every resolved battle, unconditionally, and a pending
collision naming a member of it is skipped.

⚠ **The winner is deliberately NOT registered.** §72.1 rules this defect as *the beaten
army's* second same-tick battle, and the pathology — a `position01: 0` retreat record
handing back full home-ground advantage — is the loser's alone. Blocking a fresh, unbeaten
army from meeting a second hostile column would be a wider behaviour change than the
ruling authorises. Recorded so the narrower reading is visible rather than assumed.

⚠ **The existing `retreated` Set is left exactly as it is.** It has a second consumer —
the deployment withdrawal write-back at `:886-897`, which stamps
`recalled: { cause: 'field_battle_retreat' }` — so widening it would flag armies that
could not route home for withdrawal, a behaviour change outside this member's scope.

## §3 · ⛔ THE TRAJECTORY PIN

A **three-army crossing-path fixture** driven through `advanceArmyTransit` for **three
consecutive ticks**, asserting **per tick, across all three**:

- **(a)** at most one `field_battle` news entry names the beaten army — the accumulator is
  the per-army battle count, asserted every tick rather than once;
- **(b)** A's strength falls at most once per tick (base mauls it twice: 50 → 27.5 →
  15.125);
- **(c)** after the losing tick A's record carries `role === ARMY_ROLES.RETREAT` and its
  `position01` is not consumed as ground advantage by any later battle — the retreat
  lifecycle across ticks, which a single-tick fixture structurally cannot see and which
  the audit named as the unpinned gap;
- **(d)** the negative control the compile's shape could not have passed: **with retreat
  routing unavailable**, the beaten army still fights only once. This arm is what
  discriminates this cure from the refuted two-arm shape, and it reds against either of
  those arms alone.

## §4 · SIZE — INSIDE THE SHARED BUDGET, MEASURED

`armyTransitKernel.js`, eslint's own `Linter`, never `wc -l`:

| tree | effective | note |
|---|---:|---|
| base | **792** | ceiling 800, +8 budgeted for CS-A3 **and** CS-A4 together |
| CS-A3 alone (this cure) | **795** | +3 |
| CS-A3 + CS-A4 | **796** | **+4 of the +8 budget — 4 lines of headroom remain** |

The compile's two-arm shape measured +2, one line cheaper, and does not cure the defect.
The extra line buys the `fought` declaration and its unconditional registration.

## §5 · CHANGE MANIFEST

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/domain/worldPulse/armyTransitKernel.js` |
| 2 | TEST | `tests/domain/armyTransitFieldCombat.test.js` |

Handwritten files: **2**. New production leaves: **0**. Flags: **0**. Persisted record
families: **0**. `retiredSymbols`: **NONE**.

## §6 · STOP CONDITIONS

1. CS-A3 and CS-A4 together need a ninth effective line — a plan-level STOP, never a
   ceiling raise. (Measured: they need four.)
2. Any guard arm shipped cannot be shown to red alone under a planted mutant.
3. A same-seed golden moves outside the declared multi-army crossing-path surface.
