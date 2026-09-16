# CS / CS-A1 — `gen-1a`, the no-replacement tell/speech draw (member 1 of 4 of `cs-a`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `eab6eba053e09732f12acbfe563874db02f056ce`
  (the `prf-1` train's terminal; `npcGenerator.js` blob `a5876b73`, unmoved from the
  R-GEN audit base `d5a6c009`)
- **Landed:** `75e608ad` — chain: base `eab6eba0` → `8cf97677` (P1) → **`75e608ad`
  (CS-A1)** → `014a1c60` → `874c642b` → `9bb72151` (P2) → `24c675af` → the terminal.
  **Measured:** duplicate tells **120/240 → 0**, duplicate speech **128/240 → 0**;
  roll totals shifted **0 of 32 seeds**; rosters resized **0 of 240**; corpus-wide field
  delta confined to `personality.tell` and `personality.speech`, with `name`, `secret` and
  `plotHooks` at **zero** deltas across 2207 NPCs. Two planted mutants each reddened
  **exactly the accumulator arm** (1 failed / 12 passed), restored with `cmp` exit 0.
  Member battery **5 files / 68 tests, exit 0**. Effective lines **1350 → 1350**, the
  exact baseline floor, so no `.size-baseline.json` motion. Declared shift:
  `generatorGoldenMaster` moves **501 configs**, enumerated and NOT re-recorded.
- **Train:** `cs-a`, family **CS** (un-stamped, cap 4), member **1 of 4**. Ordered first
  on measured blast radius (225 of 240 corpus hashes move) per §74.2's
  highest-first instruction.
- **Preamble:** ⚠ **none, deliberately.** CS is its own family and has no preamble.
  `INFRA-PREAMBLE.md` is NOT cited — its declared volume is the build-machinery family
  and it states an INFRA member "may write nothing under `src/` at all", while this
  member's whole subject is `src/generators/npcGenerator.js`. Citing it would be a
  false authority citation.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§80.2** (gen-1 signed as a declared
  shift; within-settlement duplication is the defect) · **§107.2** (**J-TC20-1 SIGNED**:
  gen-1 NARROWS to the tells/speech arm; the secrets arm is REFUSED IN PART and
  re-charters into gen-2 because pool width, not draw discipline, is its defect; the
  §80.2 cure-pointer correction is adopted — `drawUnique` in `hookVariety.js` is the
  prior art, not `npc_identity`) · **§72.3 / §80.2** (the declared-shift discipline:
  same-seed output moves BY DESIGN and goldens re-record ONCE at THE ONE REGEN, never
  in this train) · **§27** (build-everything ordering).
- **Compile of record:** `laneTC20-CSGEN-PLAN.md` (the annex the premise map names).

---

## §1 · WHAT IS THERE NOW

`MANNERISMS` and `SPEECH_PATTERNS` are **30 authored entries each**. Every NPC draws
one of each with `pickFromArray`, which is `rngContext.pick` — a plain seeded pick
**with replacement**. A metropolis carries ~18 NPCs, so the birthday bound makes a
within-settlement collision near-certain, and the corpus agrees.

Measured at this base over a 240-settlement corpus (6 tiers × 40 seeds):

| defect | base |
|---|---:|
| settlements repeating a tell | **120 / 240** (metropolis **40/40**) |
| settlements repeating a speech pattern | **128 / 240** (metropolis **40/40**) |

## §2 · WHAT REPLACES IT — FOUR LINE-NEUTRAL EDITS AGAINST LANDED MACHINERY

`drawUnique` is already imported at `:16`, already carries **HK-LAW-6** (exactly one
`_rng()` in every arm), and the settlement-scoped `hookRegistry` is already threaded to
all three `generateSingleNPC` call sites. This is a wiring job, not a new mechanism.

The registry gains `tells` and `speech` Sets; `generateReligionType` gains the registry
parameter; the two draws route through `drawUnique`.

⭐ **The `reg?.` optional chain is the established idiom at this exact site**, recorded
in the file's own comment at `:82`: a call site that forgets to thread the registry
degrades silently to naive picks rather than throwing, and the **pins** are the real
guard. The only other call site is `tests/domain/corruptionTraitGate.test.js`, which
passes no argument and therefore keeps its present behaviour exactly.

⚠ **No `secrets` Set is authored.** The compile proposed one (J-TC20-6) to spare gen-2 a
second edit to a file at an exact ceiling. It is omitted: §107.2 REFUSED the secrets arm
IN PART, so the Set would be state no landed code reads, and the ceiling argument that
bought it does not hold — see §5, where the cure measures line-neutral and owes no
baseline motion at all.

## §3 · WHY THIS IS SAFE BY CONSTRUCTION — AND THEN MEASURED ANYWAY

`pick(arr)` (`rngContext.js:117`) is `arr[Math.floor(_roll() * arr.length)]` — exactly
one roll. `drawUnique` with no registry is the byte-identical expression; with a registry
it still spends exactly one `_rng()` on every path (`:96`, `:101`, `:116`). The swap is
therefore roll-for-roll identical at the draw site.

That is the argument. The receipt is the measurement, over the same 240-settlement
corpus with `_roll` instrumented:

| measure | result |
|---|---|
| seeds whose TOTAL roll count shifts | **0 of 32** |
| NPC rosters resized | **0 of 240** |
| NPC total | **2207 → 2207** |
| corpus hashes that move | **225 of 240** |
| fields that differ, corpus-wide | **`personality.tell` (1123) and `personality.speech` (1049) — nothing else** |
| duplicate tells / speech | **120 → 0** and **128 → 0** |
| duplicate secrets / hooks | **83 → 83** and **14 → 14** (untouched, by design) |

**`name`, `secret` and `plotHooks` show zero deltas across all 2207 NPCs** — the
independent confirmation that the rng stream is unperturbed.

## §4 · ⛔ THE TRAJECTORY PIN — THE ACCUMULATOR IS VISIBLE

§72.3 refuses a pure-function pin here, and rightly: `drawUnique` is already pinned as a
function. What was never pinned is the **registry filling across a settlement's whole NPC
population**. The pin lands in `tests/generators/hookThemeDraws.test.js` beside the
existing corpus describe, and has three arms:

1. **the prefix arm** — one metropolis at a fixed seed; `npcs.map(n => n.personality.tell)`
   and `.speech` have no duplicate at **every prefix length k = 2..n**, with the pool size
   read from `MANNERISMS.length` rather than a literal. A registry that stops accumulating
   partway reds here; a final-state-only assertion would not.
2. **the negative control** — the same generation with the registry Sets absent reproduces
   a duplicate, so arm 1 cannot pass vacuously.
3. **the roll-budget arm** — the same seed generated with and without the registry Sets
   spends an **equal** total number of rolls. This is the neutrality half, and it is
   written so that a future secrets wiring would red it.

## §5 · SIZE — THE COMPILE'S RATCHET-DOWN IS NOT INCURRED

⚠ **The compile predicted `1350 → 1346` and an owed `scripts/.size-baseline.json`
ratchet-down (GEN.M6). Measured at this base with eslint's own `Linter` under
`max-lines { skipBlankLines: true, skipComments: true }`, this cure is EXACTLY
line-neutral: 1350 → 1350.** Each of the four edits replaces one line with one line. The
baseline row therefore stays at its exact floor and **`scripts/.size-baseline.json` is not
touched** — re-recording it to 1346 would red the ratchet's own arm in the other
direction. The path is absent from the change manifest for that reason.

## §6 · CHANGE MANIFEST

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/generators/npcGenerator.js` |
| 2 | TEST | `tests/generators/hookThemeDraws.test.js` |

Handwritten files: **2**. New production leaves: **0**. Flags: **0**. Persisted record
families: **0**. `retiredSymbols`: **NONE** — no export is removed or renamed;
`generateReligionType` changes arity only, which its sole production call site and its
sole test call site both tolerate by construction.

⚠ `tests/simulation/distributionEnvelopes.test.js` is in the member's BATTERY but not its
change manifest: its ENVELOPE 3 governs plot-hook repeat rate, and hooks are measured
unmoved (14 → 14). It is run as a non-motion consumer proof, not edited.

## §7 · STOP CONDITIONS

1. The roll-budget arm reds — the wiring has reached a value-conditional consumer. STOP
   and report; do not loosen the pin.
2. Any NPC roster resizes, or any field other than `personality.tell` / `.speech` moves.
3. `npcGenerator.js` grows past its exact 1350 baseline (an eslint `max-lines` error and a
   plan-level STOP, never a renegotiation).
4. A same-seed golden moves in a family the declared shift does not name.
