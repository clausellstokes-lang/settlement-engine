# EP / EP-3A — the writer and the stamp (stage 3 of the `ep-1` split promotion)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `da8207f3e4d6f4f7683e9e9e63e3de4b8b60d14d`
  (the EP-1 terminal — stage 2 of this same train, ODQ §191)
- **Train:** `ep-1`, family **EP**, member **4** of 5. **This packet is stage 3 and promotes
  ALONGSIDE EP-2**, which is lawful because those two are mutually path-disjoint and because
  EP-1's LANDED status released `pulseKernel.js`. GV-4's reservation of
  `spatialLedgerCoverage.walker.test.js` (`EP.M15`) was spent at `ec744330` and is re-verified
  spent here: `validate:packets` reports **0 READY** at this base.
- **Preamble:** none. A family preamble is a chair act and EP still has none.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§191** (stage three dispatched) · **§188.3**
  (the four-stage split promotion) · **§102.3** (the mutation-coverage trigger is a NAME
  PATTERN) · **§75** (the mutant-control idiom) · **§183.3** (no lane inherits `BASE_STATE`
  figures) · chair ruling **R-BLD-10** and **J-EP-11** (the ONE declared kernel ratchet-up).
- **Design authority:** `docs/DESIGN_FP_ARCH_EP.md` §3b.1a, §3b.1b, §3b.2 (family 1), §3b.3,
  §4 (EP-3 slice A), §8.1 row 2.
- **Compile of record:** `laneTC24-EP-PLAN.md` §3.4, annex rows `EP.M11`, `EP.M15`, `EP.M20`.
- **THE FLAG:** `advanceEpochEnabled` — a NO-FLAG SLICE. The §49/§50/§148 bill was paid by
  EP-1; this member touches no manifest and mints no key.

---

## §1 · WHAT THIS WAVE DOES

An advance-epoch program that freshens only the pulse ROOT ships a "fresh future" that is
bit-for-bit the OLD one for everything the pulse `rng` never reaches — road cadence, NPC
succession contests, city demographic responses, sovereignty-market buyers, and the three DM
realm verbs. FIFTEEN compositions at EIGHT read sites build their draw key from
`worldState.rngSeed` DIRECTLY, five module boundaries downstream of the argument the epoch
arrives on. **The only thing every one of them already holds is THE WORLD.** So the epoch is
STAMPED onto the world the calendar advance produced, and the far sites read it back off the
world they were handed.

## §2 · THE CURE

**THE LEAF — `src/domain/advanceEpochLedger.js` (NEW, 21 effective of ≤ 140).** A plain
`src/domain/` leaf, outside both `worldPulse/` and `spatial/` because it is SUBSTRATE whose
importers span sibling directories. It exports the writer and the family-1 accessor; slice B
grows it with `byYear` and `yearStreamSeedOf`.

**THE STAMP — seam edit 9, `;`-joined onto the line at which the calendar moves, at +0.**
`worldState = stampAdvanceEpochYear(worldState, epochTerm);` immediately after
`nextWorldStateForPulse`. The ordering is the whole correctness: a year is entered by the
calendar advance and by nothing else, so the only state that can carry the stamp is the one
that advance produced, and the only moment is between it and the first draw keyed on the new
tick.

**THE EIGHT RE-ROOTS.** RS-5 (`roadsKernel.js`, feeding rows 2/4 and 10/11/12 by hand-down) ·
RS-9 (`npcLadderKernel.js`, ⚠ THE SPLIT READ) · RS-10 (`demographicsKernel.js`) · RS-11
(`demographicsPlans.js`) · RS-12 (`sovereigntyMarketStage.js`) · RS-13/14/15
(`realmVerbExecution.js`). **The receivers need no edit at all** — they take whatever the read
site composed, which is why this slice is smaller than its row count suggests.

**THE MANIFEST ROW.** `advanceEpoch` in `src/lib/spatialUsage.js#EXEMPT_LEDGER_KEYS`, with its
written reason, IN THE SAME COMMIT — the coverage walker asserts `classified === written` as
exact set equality over every `setSpatialLedger` write under `src/domain`, so without it this
slice reds on day one.

**Budgets, all measured with eslint's own `Linter`:** the leaf **21** (≤ 140) ·
`pulseKernel.js` 1580 → **1581**, the ONE declared J-EP-11 import line and the stamp at +0 ·
`roadsKernel.js` **838 → 838, DELTA 0** · `spatialUsage.js` +1 · the four other re-rooted
modules +1 each (all far under the 800 layer ceiling).

## §3 · ⛔ TWO FINDINGS THAT CHANGED THE CURE

**⛔⛔ THE VOLUME'S `tickStreamSeedOf(worldState, { absent })` CANNOT REPRODUCE FIVE OF THE SIX
SITE COERCIONS, AND §3b.3 REQUIRES BYTE-VERBATIM.** The sketched body renders any
string-or-number as `String(raw)` and everything else as `absent`. Measured against the
volume's OWN per-site notes, it contradicts three of them outright: `String(v || '')` renders
`0` as `''` and the sketch renders `'0'`; the demographics TYPEOF-STRING guard renders a
numeric seed `'realm'` — the volume says it "must keep doing so" — and the sketch renders
`'123'`; `text(v) || 'realm'` renders an EMPTY-STRING seed `'realm'` — the volume says so
explicitly — and the sketch renders `''`.

**THE CURE, and it is stronger than the spelling it replaces: the accessor takes the SITE'S
OWN EXPRESSION as `base`.** `tickStreamSeedOf(worldState, { base: <the HEAD expression,
unmoved> })`. Byte-verbatim becomes STRUCTURAL rather than transcribed — the coercion is the
one already at the site — and the dark arm returns the argument BY IDENTITY, value and type,
so a `||`-chain site whose branch depends on the raw value's type is identical dark by
construction. ⭐ It also leaves every read site where it was: **the read-site census is
UNMOVED at twenty-two**, because each of the eight still reads `.rngSeed` on its own line.
*Vetoable: the veto is to spell `{ absent }` and accept five sites whose dark output differs
from HEAD.*

**⛔ THE RE-ROOT NEEDS AN IMPORT LINE, AND `roadsKernel.js` SITS AT EXACTLY ITS FROZEN 838.**
The volume budgets that file "one-line edits only" and prices the re-root at one line without
pricing the import. The train's ONE chair-signed ratchet-up (J-EP-11) is spent on the kernel.
**CURE: the leaf import is `;`-joined onto an existing import line, at +0 effective lines** —
the same token-level technique the kernel seam used, for the same reason, measured 838 → 838.
*Vetoable: the veto is a second chair-signed ratchet-up to 839.*

## §4 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the stamp survives to the world the kernel RETURNS and through a real JSON round-trip, as `{ tick, epoch }` at the ADVANCED tick |
| A2 | M3: a dark multi-tick advance over an aspatial fixture leaves NO `spatialLedgers` namespace at all |
| A3 | the writer keys on the FLAG-GATED term — a real epoch in a dark world stamps nothing, against a lit control that does |
| A4 | the four organically-reached in-pulse rows each observe a call and each composes from THIS TICK's epoch |
| A5 | the three DM-order rows each observe a call at their own door and compose from the world's own epoch |
| A6 | the two-epoch pin: every row composes a DIFFERENT key across two epochs LIT, and BYTE-IDENTICAL keys DARK under four hostile seed inputs |
| A7 | exactly ONE module in `src` writes the sub-key, with three planted positives and two discrimination negatives |
| A8 | the classification gate: the TICK-anchored half of the read-site census IS the re-root roster, per module, and the YEAR-KEYED half is untouched |

## §5 · CHECKS

```
npx vitest run tests/domain/advanceEpochStampSurvival.test.js \
  tests/lint/advanceEpochSingleWriter.walker.test.js \
  tests/lint/entropyRootCensus.walker.test.js \
  tests/lib/spatialLedgerCoverage.walker.test.js \
  tests/lint/sizeBaseline.test.js \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/domain/roadsKernel.test.js tests/domain/npcLadderKernel.test.js \
  tests/domain/demographicsKernel.test.js tests/domain/realmVerbExecution.test.js
```

## §6 · PRICED OBLIGATIONS

| obligation | verdict |
|---|---|
| **size baseline — `pulseKernel.js`** | ⛔ **INCURRED, AND IT IS THE TRAIN'S ONE DECLARED RATCHET-UP.** 1580 → 1581, the J-EP-11 import line, recorded in `.size-baseline.json` with its authority beside the R-BLD-10 key that reserves the exception. The stamp itself is +0 |
| **size baseline — `roadsKernel.js`** | **INCURRED AND DISCHARGED AT ZERO.** 838 → 838, tolerance-zero in both directions, bought by the `;`-joined import (§3) |
| **§102.3 — mutation coverage** | ⛔ **INCURRED** by `tests/lint/advanceEpochSingleWriter.walker.test.js` (an enforcer dir). One `invariants` row added SURGICALLY: `git diff --stat` = **5 insertions, 0 deletions**, so PACKET_MANIFEST's never-re-serialise law held. Meta-test RED before, GREEN after (8/8). `advanceEpochStampSurvival.test.js` matches no token and owes nothing — verified by RUNNING the meta-test |
| **test census** | ⛔ **INCURRED, and re-recorded ONCE FOR THE WHOLE STAGE HERE** (EP-2 may not share this path). 2,456/364/2,092/20,439/5,725 → 2,459/364/2,095/20,469/5,734; the delta decomposes exactly as 11 + 12 + 4 + 3 titles with nothing left over |
| **entropy-root census** | ⛔ **INCURRED, and the READ-SITE half did NOT move.** Twenty-two, unchanged, because the `{ base }` shape leaves every read in place. What moved: three composition row TEXTS (the sanctioned edit-a-dispositioned-row case), two hand-off anchors, and the closure record 68/30 → 70/31 — the 31st file is the new leaf and the +2 lines are its own two prose mentions |
| **spatial-ledger manifest** | ⛔ **INCURRED AND PAID IN THE SAME COMMIT.** The `advanceEpoch` EXEMPT row with its written reason. ⚠ The standing classification hazard applies — the TRACKED half FAILS OPEN — so the row is EXEMPT rather than TRACKED and the walker's `classified === written` equality is what proves it live |
| **§85.4 — seeded-chooser registry** | **NOT INCURRED.** The leaf COMPOSES seeds and chooses nothing; the registry's taxonomy was preflighted at this base |
| **coupling registry** | **NOT INCURRED at this scope.** The new leaf is imported by six modules the graph already carries; `couplingInclusion.walker.test.js` re-run green at this tip rather than argued |
| **§104.4 — edge-shared closures** | **NOT INCURRED.** No file this member touches is an input to any bundle closure, resolved from the committed metas |
| **declared shift** | **NOT INCURRED.** Byte-identical dark by construction — the writer returns the IDENTICAL reference dark and the accessor returns its argument by identity |

## §7 · MUTANTS, ALL EXECUTED ON THE LIVE SUBJECT, EACH RESTORED `cmp`-EXACT

| mutant | plant | result |
|---|---|---|
| **(i)** ⭐ | drop the `latest.tick !== worldState.tick` check from the accessor | **2 failed \| 10 passed** — BOTH of its detectors: the integration cell (a DARK advance over a PREVIOUSLY-LIT world) and the unit cell |
| **(ii)** | a wholesale world replacement at `pulseKernel`'s `memoryState` seam | **5 failed \| 6 passed** — every post-apply in-pulse row **and** the returned-world arm, exactly as the volume predicts |
| **(v)** | delete seam edit 9 outright | **5 failed \| 6 passed** — the stamp, the rows and the arm together |
| **(vi)** | a SECOND `setSpatialLedger(…, 'advanceEpoch', …)` planted in the kernel | **1 failed \| 3 passed** — the single-writer roster |

⭐ **MUTANT (i) IS THE ONE WITH NO FAMILY-2 TWIN, and it needed a fixture nobody would build
by accident.** It is invisible to every LIT assertion — the naive accessor still returns an
epoch-bearing key on a lit run — and invisible to every FRESH-dark run too, because a world
that never ran lit has no stamp to mis-select. The cell that catches it is a DARK advance
over a world that ran LIT AND THEN HAD THE RULE TURNED OFF, asserted against a LITERAL
absence rather than as a differential.

## §8 · HAZARDS AND DISPOSITIONS

- **⚠⚠ RS-11's OWN RE-ROOT IS UNREACHABLE ON EVERY PRODUCTION PATH, and that is recorded
  rather than papered over.** `demographicsPlans.js` re-roots inside its existing chain
  because `realmId` SHADOWS; MEASURED, its only caller in `src` always passes a realmId (that
  is RS-10), so the `||` short-circuits and the accessor never runs there. An observed-call
  floor for it would have meant a red on a correct build or a rigged fixture — the
  unreachable-arm vacuity class. The row is proven in two honest halves instead: the epoch
  reaches rows 22/23 because RS-10's value is what flows down the chain (asserted, including
  that the shadowed term is NOT evaluated), and RS-11's own fallback is exercised at its door.
- **⚠ `tests/lib/spatialLedgerCoverage.walker.test.js` NEEDS NO EDIT.** The compile reserved
  it as a change path; measured, the EXEMPT row alone satisfies `classified === written`, and
  the walker re-runs green untouched. Dropped from the manifest with the measurement recorded.
- **⚠ TWO OBSERVED-CALL FLOORS FOUND REAL FIXTURE GAPS, which is the floor doing its job.**
  Both the roads stage and the sovereignty market return inert without a canonized
  `spatialDigest`, and the market's gate is an EXACT conjunction over the six envoy
  prerequisite rules plus demographics. `FORCE_CALAMITY` needs `disastersEnabled`, which is in
  no pulse rule set. Each was a zero reported by the floor, and each was cured in the FIXTURE.
- **⚠ THE THREE DM DOORS ARE IN SCOPE FOR THE SELECTION RULE, deliberately.** A DM order
  resolves in the epoch the world it acts on is living in — stable for a given world, fresh
  after an undo and re-advance. A world that ran LIT and then lost the flag keeps a selectable
  `latest` until the next advance moves the tick; that is bounded to one tick and is pinned.

## §9 · WHAT SLICE B INHERITS

- **The leaf, the writer, seam edit 9, the +1 import line and the manifest row are SPENT.**
  Slice B grows the SAME writer with its `byYear` half (FIRST-WINS, same object reference
  re-used on a mid-year tick), adds `yearStreamSeedOf` to an import line that already exists
  at +0, and lands seam edits 7 and 8. `src/lib/spatialUsage.js` gets ZERO edits.
- ⛔ **THE `{ base }` SHAPE BINDS FOR THE YEAR ACCESSOR TOO** — `yearStreamSeedOf(worldState,
  year, { base, yearBase })`, `yearBase` still REQUIRED and defaultless (J-EP-13). Spelling it
  `{ absent }` would reintroduce §3's refuted transcription for the year sites.
- ⛔ **RS-9 IS STILL HALF-DONE BY DESIGN.** Its family-2 row 20 is epoch-blind until slice B
  adds a SECOND, separately-named argument beside the tick anchor. The classification gate in
  `entropyRootCensus.walker.test.js` asserts today's state in both directions, so slice B's
  arrival is visible rather than assumed.
- **The kernel's ledger is now spent too:** 1581 is the ceiling, and slice B is +0.
