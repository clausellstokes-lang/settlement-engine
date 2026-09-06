# RECEIPT — LANE OSR-SCHEMA18 — ⚠ **PARTIAL: PREMISES MEASURED, ACT IN FLIGHT**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: OSR-SCHEMA18 · 2026-09-05 evening⟧

## OUTCOME TABLE
| # | premise (brief line) | measured at `b0cbc67a1` | verdict | sha |
|---|---|---|---|---|
| P1 | register `schema` 17, `subjectSha` `0742f8ff5…`, `simulationFlagsLit` 80 (L15) | schema **17**, subjectSha **`0742f8ff5997bb5ddb369c152cb31d587dde7121`**, flagsLit **80** | ✅ CONFIRMED | — |
| P2 | `merge-base --is-ancestor 0742f8ff5 HEAD` is FALSE (L16) | exit **1** = NOT an ancestor (object exists, exit 0) | ✅ CONFIRMED — the lane lives | — |
| P3a | plain gate → **exit 0** (L17) | **exit 1 in 0 s**, throws `observed-shape migration genesis is not a committed ancestor of current HEAD` before scanning | ⛔ **BRIEF LINE 17 IS WRONG** — see CORRECTION 1 | — |
| P3b | `--write` → REFUSED (L17) | refused by the same throw | ✅ CONFIRMED | — |
| P4 | writerReach's two arms banked; `OWED_CEILING` 5 (L18) | both rows present in `scripts/.test-ratchet-baseline.json:43,60`; `testRatchet.test.js:929` `OWED_CEILING = 5` | ✅ CONFIRMED | — |
| P5 | ninth exemption retired at §900? (L19 item 2) | **declared roster 9**, register banks **41 addresses across 8 identities**; `isCriminal on incomeSources` banks nothing | ⛔ **NOT DONE** — see FINDING F1 | — |
| P6 | walker comments `:372`/`:1254` say "roster is still nine" — stale or true? (L19) | roster **is** nine ⇒ the comments are **ACCURATE**, not stale | ✅ comments correct; F1 is the live item | — |
| P7 | `_doc` stale (L19 item 3) | `_doc[9]` "SCHEMA 10 … eight-identity M8/M9 bank"; `_doc[20]` "Schemas 4–9 are the RETIRED numeric predecessors" | ✅ CONFIRMED stale — cured in the genesis write | — |
| P8 | L-HOMES-2 rename: pure identifier swap, zero identity movement? (L20) | **NO — three consumers match the identifier as TEXT, not as a binding** | ⛔ **REFUSED with measurement** — see REFUSAL R1 | — |
| P9 | `simulationFlagsLit` moves 80 → 81 (L26) | live corpus meta **81**; the **only** one of nine fields that moves | ✅ CONFIRMED | — |
| P10 | ratchet `totalTests` = 31970 for the capsule (L28) | `scripts/.test-ratchet-baseline.json` `totalTests` **31970** | ✅ CONFIRMED | — |

## ⛔ CORRECTION 1 — BRIEF LINE 17 IS FALSE AT THIS SHA
> "`node scripts/check-observed-shape-readers.mjs` (plain) → expected exit 0"

**Measured: exit 1, in 0 seconds, without scanning at all.** `run()` calls
`validateBaselineHistory(baseline)` in the ordinary gate branch (`check-observed-shape-readers.mjs:2798`),
BEFORE the scan, and it throws on the same `git merge-base --is-ancestor` the ruling names:

```
Error: observed-shape migration genesis is not a committed ancestor of current HEAD
  [cause]: Command failed: git merge-base --is-ancestor 0742f8ff5997bb5ddb369c152cb31d587dde7121 HEAD
```

⭐ **`RULING-OSR-900-NO-WRITE.md`'s ADDENDUM already said this** — "`base-state-capsule.mjs` shells out to
`node scripts/check-observed-shape-readers.mjs`, whose default run ALSO validates history" — so the ruling is
right and only the brief's step-0 table is wrong. Nothing about the ACT changes: the refusal is broader than
the brief claimed, which makes this lane more necessary, not less. The brief's own STOP condition is attached
to P2 (ancestry), and P2 HOLDS.
⚠ Consequence for the chair: the claim "the gate is green at the §901 tip" cannot be true for the CLI — the
CLI has been dark on this lineage since the cherry-pick. Only the vitest walker was green.

## ⭐ THE REGISTER IS EXACT AT THE TIP — CONFIRMED BY EXECUTION, NOT BY THE RULING'S WORD
`--scan-only --scan-mode=legacy-leaf` bypasses the gate branch (and so the history validator) and reaches a
real scan. Exit **0**, 15 s:

| | live scan at `b0cbc67a1` | frozen register |
|---|---|---|
| findings | **1972** | 1972 |
| files | **386** | 386 |
| identities | **1397** | 1397 |
| inventory row diff | **GONE 0 · NEW 0 · COUNT-MOVED 0** | — |
| bank | "9 declared identit(ies) … banked and enforced **62** read(s) across **8** of them" | rowTags 41 addresses / 8 identities |
| filters | M6 124 · M11 11 · M12 0 | — |

⇒ **rung 18 is a VERDICT-ONLY / RE-ANCHORING rung**, the same class as 13, 14, 15 and 16 — its
reconciliation must be EMPTY. Rung 17 was the row-moving kind; this one is not.

## ⭐ EVERY REGISTER FIGURE, PREDICTED IN WRITING BEFORE ANY INSTRUMENT RUNS
(preamble rule. Measured from the pre-state scan artifact against the frozen register.)

| field | prediction |
|---|---|
| `schema` | 17 → **18** |
| `inventory` | **BYTE-IDENTICAL** — 386 files, 1397 identities |
| `total` | **1972**, unmoved |
| `identities` | **1397**, unmoved |
| `rowTags` | **UNMOVED** (41 addresses, 8 identities) |
| `minRows` / `originMinRows` | 40 / 8, unmoved |
| `corpusMeta.simulationFlagsLit` | 80 → **81** (SEAT-78's `irregularForceEnabled`) |
| `corpusMeta` — the other EIGHT fields | **UNMOVED** (seeds 4 · configs 4 · generations 16 · pulseIntervals 12 · shapeCount 1299 · steadingsMinted 12 · originCount 8560 · transitionCount 14496) |
| `scanStats` | files 2162 → **2176** · reads 124468 → **125631** · resolved 9563 → **9669** · unresolved 114905 → **115962** |
| `sentinel` | resolvedReads 9563 → **9669**; totalKeys **6532** and usableShapes **337** unmoved |
| report `predecessorGone` / `New` / `Increased` / `Decreased` | **0 / 0 / 0 / 0** |
| report `issues` | **exactly 1** — the scanner transition, naming THREE delta paths |
| `_doc` | `[9]` and `[20]` cured; every other line byte-identical |
| `migrationReview.subjectSha` | **my own rung car**, an ancestor of the dock HEAD |

⛔ **THE FENCE THAT MATTERS: `predecessorNew` must be 0 AND `predecessorGone` must be 0.** Unlike rung 17,
a single moved row in EITHER direction falsifies this rung — the tip's inventory already reconciles exactly,
so any movement would mean my own cars changed the detector's verdict, which a re-anchoring may not do.

## PROGRESS
- [x] brief, preamble, brief-17, receipt-17, both rulings read in order
- [x] step 0: every premise re-derived — 8 confirmed, 1 brief line corrected, 1 refusal
- [x] step 1: the rename car — **REFUSED with measurement (R1)**
- [ ] step 2: schema 18 rung minted
- [ ] step 3: genesis + `_doc` cure in the same write
- [ ] step 4: two-walker proof
- [ ] step 5: capsule shell-out
- [ ] step 6: cost
- [ ] RETROVALIDATION ROW

**DOCK:** `$SC/laneOSR18` HEAD `b0cbc67a15baf0997028ab501c7ee09565f93980`, porcelain **0**, detached,
453 `node_modules` symlinks, no `core.hooksPath`, `.git/hooks` samples only.
`git -C <main> rev-parse claude/composite-r4` = **the same sha** — my base IS the product tip. ✅
