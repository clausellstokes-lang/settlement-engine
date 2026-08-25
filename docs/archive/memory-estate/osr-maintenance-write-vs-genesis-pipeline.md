---
name: osr-maintenance-write-vs-genesis-pipeline
description: "⭐⭐ AN OSR SHRINK RE-FREEZE IS `--write` ALONE — the genesis pipeline (legacy artifact → template → bundle → `--write --migrate-schema=4`) is REFUSED once the baseline is already schema 4, and the maintenance write passes the gate IN-TREE, UNCOMMITTED. Two briefs have now prescribed the genesis path for ordinary maintenance."
metadata:
  node_type: memory
  type: project
  created: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T03:18:56.812Z
---

# The OSR re-freeze has TWO instruments, and briefs keep naming the wrong one

Measured 2026-08-10 at `46357c94` while clearing the `stale: 12` red that `c74048e4`
introduced. The lane's brief prescribed the full GENESIS pipeline. It is structurally
unavailable, and the correct instrument is one command.

## The rule

- **GENESIS (schema N → 4, once ever):** legacy artifact → migration report →
  review template → carried decisions → bundle → `--write --migrate-schema=4`.
  Executed at `894325ff` + `2a7fb033`. **DONE. Not repeatable.**
- **ORDINARY MAINTENANCE (the lawful SHRINK, every time after):**
  `node scripts/check-observed-shape-readers.mjs --write` — no migration flags, no
  bundle, **no `bindings` object at all**.

⚠⚠ `--migrate-schema=4` against an already-schema-4 baseline THROWS at
`check-observed-shape-readers.mjs:1057-1060`: *"observed-shape baseline is already
schema 4; a migration review cannot authorize ordinary maintenance."* So the whole
hand-carried-`bindings` hazard ([[osr-resolver-state-identity-ruling]] hazard 1)
**cannot fire on a maintenance re-freeze** — there is no bundle to bind.

## ⭐ THE MAINTENANCE WRITE PASSES THE GATE IN-TREE, UNCOMMITTED

The recorded "the gate CLI cannot pass pre-commit BY DESIGN" constraint binds the
**genesis** only, whose `subjectSha` needs a committed schema-4 descendant. A
maintenance write REUSES the already-committed genesis receipt unchanged
(`migrationReceipt = baseline.migrationReview`), so `validateBaselineHistory` is
satisfied by the committed genesis at `2a7fb033`. **Measured: `npm run
check:observed-shape-readers` true exit 0 with the new baseline still uncommitted.**
No detached worktree is needed. Do not build one out of habit.

## What `--write` requires, and what it does NOT

- Requires the **OSR-scoped** paths clean and committed — `dirtyInputsFor()` (:507-522)
  is a bounded pathspec: `src`, the baseline json, and `scannerToolFiles()`
  (:160-174 — package.json, package-lock.json, the six OSR scripts/libs,
  `tests/fixtures/spatialPackFixtures.js`). ⭐ `tests/**` and every other script are
  OUTSIDE it, so a lane holding unrelated dirty test files can still re-freeze.
- The plain gate (no flags) does **not** require a clean tree at all — it runs the
  scan and prints `STALE ROW —` lines, which is how to enumerate the debt with
  addresses before writing.
- `--write` gates on **violations (growth) and vacuity only**. It does *not* gate on
  stale rows; `baselineOf()` rebuilds the inventory from the fresh live scan, so
  stale rows vanish by construction. Schema 4 permits **no dormant headroom**: any
  live count BELOW its frozen ceiling is itself a defect, not slack.

## The measured shrink (the shape of a healthy one)

`c74048e4` removed 12 frozen reads across 4 files. `--write` output:
`froze 2182 finding(s) / 1515 identit(ies) across 396 file(s)`.
Arithmetic closed in both directions: total 2196→2182 (**−14 = the exact sum of the
12 stale ceilings**, two of which were 2), identities 1527→1515 (−12), files 397→396
(`src/pdf/sections/Relationships.jsx` lost its last row). `migrationReview.subjectSha`
carried UNCHANGED at `894325ff` — **if that moves, you took the wrong path.**

## How to apply

Read the baseline's `schema` field FIRST. If it is already `BASELINE_SCHEMA`, the
only lawful re-freeze is plain `--write`, whatever the brief says. Enumerate the debt
with the bare gate, attribute each stale row to a commit (`git log -1 -- <file>`)
before writing, and check the −N arithmetic closes against the stale ceilings — a
shrink that does not reconcile is the finding, not the number.

Related: [[osr-resolver-state-identity-ruling]] (the genesis and its hazards) ·
[[observed-shape-readers-walker-landed]] · [[first-match-document-pin-class]].
