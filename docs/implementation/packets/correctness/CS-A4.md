# CS / CS-A4 — `cs-5`, the recalled-army derive window (member 4 of 4 of `cs-a`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `eab6eba053e09732f12acbfe563874db02f056ce`
  (the train's dispatch base). This member is nonetheless authored ON TOP of CS-A3's
  implementation `874c642b3fe7cd5ce15e4116fbda76f127a146f2`, which shares its file and
  reached a terminal status in the same commit that promoted this packet — the two may
  never be live simultaneously.
- **Landed:** `24c675af` — the train's terminal implementation. **Measured:** the defect
  reproduces (a recalled army reaching `position01 = 1` at its abandoned target on tick 2),
  and — the finding this member turned up — the estate's own landed line-digest fixture
  mints a field battle on **every** tick against an already-beaten, already-recalled
  column (60 → 39.57 → 23.78 → 13.08). ⭐ CS-A3 does not close that; **this member does**,
  because the derive loop was clobbering the retreat record back into a march each tick so
  `hostilePairFor`'s RETREAT exclusion never fired. A landed test was pinning that defect
  and its body is corrected (title byte-identical). Deleting the guard reds **3 of 44**,
  including the corrected test. Effective lines **792 → 796** — four of the eight budgeted
  for this member and CS-A3 together. Member battery **4 files / 121 tests, exit 0**.
  Census re-derived whole: **2438/364/2074/20208/5672 → 2438/364/2074/20220/5676**.
- **`dependsOn`: CS-A3.** The edge is real, not bookkeeping: CS-A3's cure is what lets a
  RETREAT record survive the collision loop at all; this member's cure is what keeps that
  record from being clobbered by the next derive pass. Landing this member without CS-A3
  would protect a record still reachable by a second same-tick battle.
- **Train:** `cs-a`, family **CS** (un-stamped, cap 4), member **4 of 4** — and the
  train's LAST tests-moving member, so it carries the lighting-census re-record.
- **Preamble:** none — CS is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§72.1** (cs-5 confirmed, latent: the
  transit derive loop re-materializes a recalled army in a one-tick window) · **§72.3**
  (trajectory pin, accumulator visible) · **§107.2** (the shared 792/800 ceiling, +8 for
  CS-A3 and CS-A4 together) · **§44** (Road-A split promotion, applied inside the train) ·
  **§102.3 / §104.4** (the priced obligations) · **§80.2 / §27**.
- **Compile of record:** `laneTC20-CSGEN-PLAN.md`.

---

## §1 · WHAT IS THERE NOW

The derive loop skips only on a missing `targetId`; `dep.recalled` is never consulted. A
RETREAT record has `destId === originId === homeId ≠ targetId`, so the "new campaign"
test is **always true** for it and the loop re-seeds a fresh MARCH with
`departTick = num(dep.sinceTick, nowTick)` — the **original** commitment tick — which
`stepArmyPosition` can carry straight to `position01 = 1`.

**An army recalled from the field re-appears ARRIVED at the target it abandoned.**
Executed at this base, with a `recalled` stamp applied after tick 0:

```
tick 0: a[retreat a->a pos=0 str=15.125]   (beaten, routed home)
tick 1: a[retreat a->a pos=0 str=4.5753]   (clobbered and re-fought)
tick 2: a[march a->d pos=1 str=4.5753]     ← ARRIVED at d, the abandoned objective
```

## §2 · WHY IT IS LATENT, STATED PRECISELY

In the composed pulse `evaluateWarLayer` (`pulseKernel.js:845`) resolves a recalled
deployment as a withdrawal and **deletes the record** (`warDeployment.js:368-376`) before
`advanceArmyTransit` (`:2279`) runs. A recall stamped on tick N is therefore consumed at
tick N+1 **before** the derive pass ever sees it, and the defect cannot fire.

⚠ **The compile's blast-radius row and this packet part company on one point, and the
correction is measured.** Driving the kernel standalone, the guard fires far more widely
than "latent" suggests — because `advanceArmyTransit` **stamps `recalled` itself**, with
`cause: 'field_battle_retreat'`, on every retreating loser. Under the composed pulse that
stamp is also consumed by the war layer first, so the latency verdict stands; but the
estate's own kernel-level fixtures drive the kernel WITHOUT the war layer, and there the
guard is live on every field-battle retreat. The live windows are therefore:

1. the **same-tick** stampers running between the two passes — `applyWorldPulse.js`
   `sue_for_peace` and `return_home`, and `warRulingsEvidence.js`; and
2. **any driver that advances transit without the war layer**, which includes the
   kernel's own test surface.

## §3 · WHAT REPLACES IT — TWO GUARDS, AND A LANDED CONSUMER FORCED THE SECOND

⛔ **The compile's single top-of-loop `continue` is REFUTED by a landed feature, measured
at the terminal gate rather than predicted.** WR-7b's envoy interception deliberately
stamps `deployments[a].recalled` with `cause: 'envoy_terms_carried_home'` and then needs
the transit record to keep advancing so the carried term sheet rides home. A top-of-loop
skip dropped the whole record — `armyTransitLedger(...)` came back **null** and
`tests/domain/armyTransitEnvoyWr7b.test.js` threw. The cure therefore has two halves, and
the shapes they leave behind are deliberately different:

1. **the SEED half** — a recalled deployment is never RE-SEEDED onto a fresh march. This
   is the guard the defect needs, because a RETREAT record's `destId` equals its
   `originId` and so can never equal `targetId`, which is why the seed branch was always
   taken for one. A column in that state gets no record, which is correct: it is going
   home and the war layer owns the homecoming.
2. **the ONGOING half** — a recalled column that still holds a live record KEEPS it, but
   its position is HELD at the prior tick, so it can never step to `position01 = 1` and
   "arrive" somewhere its deployment has already broken off from.

⚠ **The intermediate shape was tried and measured insufficient**: moving the guard into
the seed branch alone fixed WR-7b but let a recalled *marching* column continue to its
target and arrive — cs-5's primary live window (`sue_for_peace` / `return_home` stamped on
a marching army). Only the pair satisfies both. **Each half carries its own planted
mutant** and reds alone (§ Landed), which is the STOP condition the compile's CS-A3 shape
failed.

⛔ **The compile's trajectory pin for this member is not satisfiable as written, and is
corrected here rather than approximated.** It asks the pin to assert that at tick n+1 the
army's record is "still the RETREAT record". Under the SEED half the army gets **no record
at all** that pass — the ledger is rebuilt from `deployments` every tick — so for a beaten
column the record is ABSENT, not preserved, and asserting preservation would red against
the cure. **The invariant is ARRIVAL, not the record's existence**, and that is what the pin
asserts: `position01` never reaches 1 and never advances after the recall, at every tick,
whichever of the two shapes the column is in.

## §4 · ⛔ THE TRAJECTORY PIN

Three ticks, the record's identity printed per tick, with a same-tick `recalled` stamp
applied between the battle and the next `advanceArmyTransit` call:

- the army is **never re-seeded as a MARCH toward `targetId`** on any tick after the
  recall;
- its `position01` **never reaches 1** — the arrival the defect produced;
- asserted **at every tick**, not only at the end: a final-state assertion would pass
  against a record that was clobbered and then coincidentally re-derived;
- the negative control: an **un-recalled** deployment in the same fixture still derives
  its march normally, so the guard is proved to be reading `recalled` rather than
  suppressing the loop wholesale.

## §5 · SIZE AND THE PRICED OBLIGATIONS

| tree | effective | note |
|---|---:|---|
| base | 792 | ceiling 800 |
| CS-A3 | 795 | +3 |
| **CS-A3 + CS-A4** | **796** | **+4 of the +8 budgeted — 4 lines of headroom remain** |

**The lighting census** rides this member as the train's last tests-moving one. ⚠ The
compile's `CS.M11` tuple (`…/20206/5672`) is **stale**: `prf-1` moved titles +2 after the
compile was written, so the live tuple at this base is
**`2438 / 364 / 2074 / 20208 / 5672`**. The re-record is read from the walker's OWN
failure output, never predicted, and `files` / `parked` / `credited` must not move — no
member of this train creates a test file.

**Not incurred, verified rather than asserted:** no bundle regeneration (§104.4 — no
touched file sits in any of the five edge-shared closures), no new `tests/lint/` coverage
row (§102.3 — no new lint file), no registry mint (§85.4), no coupling-registry row, and
no `mutation-coverage-manifest.json` row.

## §6 · CHANGE MANIFEST

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/domain/worldPulse/armyTransitKernel.js` |
| 2 | TEST | `tests/domain/armyTransitFieldCombat.test.js` |
| 3 | TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` |

Handwritten files: **3**. New production leaves: **0**. Flags: **0**. Persisted record
families: **0**. `retiredSymbols`: **NONE**.

## §7 · STOP CONDITIONS

1. `files`, `parked`, or `credited` moves in the lighting census.
2. CS-A3 and CS-A4 together need a ninth effective line.
3. The census figures are predicted rather than read from the walker's own output.
4. A same-seed golden moves outside the declared surface.
