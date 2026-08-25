---
name: golden-batch-shift2-discharged-shift3-landed
description: "⭐⭐ THE GOLDEN BATCH LANDED @ b0912f7f — SHIFT-2 discharged and the Lord Mayor's civic-hall narrowing recorded as SHIFT-3 in ONE re-record; 25 of 525 rows moved, and the triple cross-check that made the re-record trustworthy is the reusable method"
metadata: 
  node_type: memory
  type: program state + verification method
  created: 2026-08-11
  lane: Lane S — THE GOLDEN BATCH
  measured_at: b0912f7f (parent da31d170)
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-11T23:42:17.914Z
---

LANDED 2026-08-11 as **b0912f7f**, authorized under `OWNER_DECISION_QUEUE` §17.1 (the
2026-08-11 owner grant licensing ONE seed-line move). Three files:
`src/generators/factionRoles.js`, `tests/fixtures/generator-golden-master.json`,
`docs/GOLDEN_SHIFT_LEDGER_MAIN.md`.

## Program state

- **SHIFT-2 is DISCHARGED.** `generatorGoldenMaster` had been **RED BY DESIGN** since
  `0f85ced0` (the institution-link repair recorded but deliberately not re-recorded). It is
  now GREEN. Any handoff still claiming that red is stale.
- **SHIFT-3 recorded**: the noble `linkToInst` went
  `/council|court|hall|government/` → `/council|court|government|\b(?:town|city)\s?halls?\b/`.
  The bare `hall` alternative had been linking the Lord Mayor to gambling dens and mercenary
  hiring halls.
- **25 of 525 rows moved, 0 added, 0 removed.** SHIFT-3's 5 rows are a strict SUBSET of
  SHIFT-2's 25 — the narrowing can only touch a row that already carried a noble link, and
  **only 25 of 525 rows carry ANY structural link at all** (the link set and SHIFT-2's drift
  set are provably the SAME 25 keys).
- All five mis-links fell through to the settlement's REAL `Town hall`, so **no settlement
  lost a link; five gained the correct one.** Lord Mayor→Town hall 10→15; Free company hall
  3→0, Adventurers' charter hall 1→0, Hireling hall 1→0; Mayor and council (7), Elder Grove
  Council (1) and Archmagister→Bardic college (2) untouched. Total links unchanged at 25.

## ⭐ THE REUSABLE METHOD — three cross-checks before trusting a golden re-record

A hash manifest cannot show WHY it moved, so earn the trust三 ways:

1. **Compute the manifest INDEPENDENTLY of the test harness** — a separate node script
   driving the same pipeline over the same corpus. It must equal the `UPDATE_GOLDEN` output
   on all 525 rows. (Catches a harness bug re-recording garbage.)
2. **Reproduce the PRIOR lane's tabled 'after' hashes.** 20 of my 25 re-recorded hashes
   matched SHIFT-2's ledger table EXACTLY — hashes written weeks earlier, on another lane,
   from a different tree — and the 5 that differed were exactly my measured increment. This
   is the strongest single receipt available and it is FREE if the ledger tabled its hashes.
3. **In-process A/B with manifest controls.** `FACTION_ROLES` is a mutable export, so you can
   flip `FACTION_ROLES.noble[0].linkToInst` between old and new in ONE process and diff the
   real shipped links. ⚠ The A/B is only trustworthy if each pass reproduces its
   independently-computed manifest byte-for-byte — assert that as a CONTROL, or module-level
   caching can silently contaminate the second pass.

⚠ The corpus probe must read the **real shipped** `linkedInstitutionIds` off the generated
NPCs, not re-simulate the match — re-simulation cannot see the coverage rules in
`ensureFactionStructuralNpcs` (only UNCOVERED offices get synthesized), and over-counts badly
(a re-simulation said 23 noble matches where the pipeline ships far fewer).

⚠ `JSON.stringify(obj, Object.keys(obj).sort(), 2)` — the golden test's own idiom — passes
the key array as a **REPLACER**. Harmless for a flat string map; it silently STRIPS nested
object fields. Bit me once on a link-census dump.

## Gate note

The full 17-step gate was proven on an **isolated detached worktree** carrying only this
commit's content — never on the shared tree, which carried a sibling lane's WIP that
independently reddened five tests. Two-run control (bare HEAD vs HEAD+mine, both 4 files /
108 tests passed, identical) is what exonerated this change.
