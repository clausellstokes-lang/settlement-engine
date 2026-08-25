---
name: osr-detector-change-requires-schema-mint
description: "⛔⛔ A DETECTOR CHANGE TO THE SCHEMA-4 OSR INSTRUMENT IS NOT LANE-EXECUTABLE (measured 2026-08-11, nothing landed): check-observed-shape-readers.mjs:1290 refuses any run where the live detectorTree digest differs from the frozen one, and ALL 11 governed scanner paths are inside that digest — so editing ANY of them reds the gate AND makes `--write` THROW, even on a clean committed tree; adding a 12th path additionally breaks validateBaselineHistory because it does not exist at genesis 894325ff; and `--write --migrate-schema=4` is refused outright at :1258 because the baseline is already schema 4. ⚠⚠ This EXECUTION-REFUTES CR-OSR-FREEZE-6-R1's premise that M6 would land as 'an ORDINARY migration (schema 4 → schema 4)'. The only lawful path is MINTING SCHEMA 5 — chair/owner-gated."
metadata:
  type: project
  date: 2026-08-11
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T11:08:12.163Z
---

## The law, in one sentence

The observed-shape instrument's own baseline `_doc` states it — **"Detector changes
require a new governed instrument migration"** — and `check-observed-shape-readers.mjs`
enforces it absolutely. There is no maintenance path that changes what the detector
reports.

## The three measured blockers (M6 follow-on lane, 2026-08-11, nothing landed)

Attempting to land CR-OSR-FREEZE-6's M6 shape-family post-filter:

1. **Gate mode → exit 1.** `:1290` refuses when
   `baseline.scannerProvenance.detectorDigest !== before.detectorTree.digest`.
   Message: *"observed-shape detector or unscanned execution input changed since the
   schema-4 instrument was governed; an ordinary gate/write cannot migrate the
   instrument"*. Negative control: same command, same tree, edit reverted → exit 0.
2. **`--write` → THROWS** (`:1294`), proven on a CLEAN COMMITTED tree in a throwaway
   detached worktree. ⭐ The guard fires BEFORE the corpus build, so this proof costs
   seconds, not the ~4 min a full scan takes.
3. **`--write --migrate-schema=4` → refused at `:1258`**: *"observed-shape baseline is
   already schema 4; a migration review cannot authorize ordinary maintenance."*

## Why no placement escapes it

`scannerToolFiles()` is an **11-path list** (package.json, package-lock.json,
check-observed-shape-readers.mjs, lib/governed-artifact-io.mjs,
lib/legacy-reader-shape-scan.mjs, lib/observed-shape-baseline.mjs,
lib/observed-shape-corpus.mjs, lib/observed-shape-governance.mjs,
lib/reader-shape-scan.mjs, migrate-observed-shape-readers.mjs,
tests/fixtures/spatialPackFixtures.js) and the detectorTree digest is a manifest over
exactly those.

- Editing **any** of the 11 moves the digest → blockers 1–2.
- Adding a **12th** ALSO breaks `validateBaselineHistory`: `committedInputManifestsFor`
  reads the CURRENT path list out of the GENESIS commit `894325ff`, and a file that did
  not exist there throws *"observed-shape subject commit omits governed detector
  input(s)"*.
- A new **ungoverned** module does not help — the orchestrator must import it, and the
  orchestrator is one of the 11.

⚠ Note the asymmetry that makes this survivable: the genesis-time figures in
`migrationReview` are recomputed FROM the genesis commit, so they are stable across
scanner edits. It is the LIVE-vs-frozen comparison at `:1290` that bites.

## How to apply

- **Before designing any OSR detector/filter change, price a schema mint into the plan.**
  The design work is not wasted, but the landing is a migration, not a lane.
- ⛔ Do NOT amend the `:1290` guard to admit a shrink-only detector change. That is
  CR-OSR-FREEZE-4-R1's explicitly rejected anti-pattern (weakening a guard to fit an
  operation). Two chair rulings already refused this shape.
- Follow CR-OSR-FREEZE-4's ratified precedent: **prep lands WITH its migration or not at
  all.** Vault the work (`refs/preserved/…`, or a verified `git apply --check`-clean
  patch) rather than half-landing a module nothing calls.
- ⭐ The cheap decisive probe for "will this land?" is `--write` in a detached worktree
  with the edit committed — it fails fast, before the corpus.

Related: [[osr-resolver-state-identity-ruling]] (CR-OSR-FREEZE-6 / -6-R1, and the
refuted premise) · [[osr-schema3-freeze-refused-measured]] ·
[[observed-shape-readers-walker-landed]].
