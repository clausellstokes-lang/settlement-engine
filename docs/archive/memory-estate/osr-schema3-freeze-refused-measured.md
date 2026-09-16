---
name: osr-schema3-freeze-refused-measured
description: "⛔⛔ THE CR-OSR-FREEZE-3 SCHEMA-3 FREEZE IS NOT LANE-EXECUTABLE AT HEAD 7699e367 (Opus freeze lane, 2026-08-10, MEASURED, nothing edited): ruling 3 says schema 3 derives from the HEURISTIC leg, but the schema-3 validator REFUSES 2168/2168 heuristic identities and 664 rows break its count===1 law; ⚠⚠ FIVE independent blockers, each executed — and the two that outlive any schema redesign are 171 UNREVIEWED GROWTH ROWS and a freeze that cannot green the gate WITHOUT A COMMIT"
metadata:
  type: project
  date: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T22:07:26.626Z
---

Opus lane dispatched to execute CR-OSR-FREEZE-1..3 (see
[[osr-resolver-state-identity-ruling]] tail). Worktree `.claude/worktrees/minifold`,
HEAD `7699e367`, tree clean before and after. **NOTHING WAS EDITED** — the lane stopped
at a quotable refusal per its brief. All figures below are executed receipts.

## ⛔ The five blockers, each measured

1. **The exact full-tree scan is dead at HEAD — REPRODUCED, not inherited.** With the
   declared `src/components/` exclusion applied, `--scan-only` in an integrity-counted
   archive (6,274 tracked paths in, 6,274 out; worktree's own `node_modules` symlinked)
   died at **read #963, `src/data/constants.js:56` (`prosperityRank`'s `prosperity?.tier`)**
   with `abstract-state growth steps 16385 > 16384`, exit 1, **883 s total** (161 s corpus
   + 722 s scan) at `--max-old-space-size=12288`. It had reached only **36 of 2,081 files**.
   The heap effect named in the failure is `src/generators/computeActiveChains.js`.
2. **⚠⚠ THE SCHEMA-3 VALIDATOR REFUSES THE HEURISTIC LEG OUTRIGHT.** Ruling 3 says the
   schema-3 baseline derives from the heuristic leg, but schema 3 IS DEFINED as the
   exact per-site identity: `parseExactBaselineIdentity` refused **2,168 of 2,168** live
   schema-2 identities (`"definitionId on plan"` → "identity is malformed"), and
   `validateInventory`'s `count !== 1` law independently refuses **664 rows** (max count
   **24**). The schema-3 sentinel/stats additionally demand `usableOrigins`/`originKeys`/
   `transitions`/`resolvedOrigins`, which `scanSentinelOf('legacy-leaf')` never emits.
3. **The governed bundle structurally requires a full-tree EXACT artifact.** The legacy
   artifact cannot even be produced without one (`--scan-mode=legacy-leaf` →
   "requires --corpus-artifact=<validated-exact-artifact.json>", and that artifact must
   be `scanMode: 'exact-origin'`); `assertArtifactPair` refuses a non-exact `currentArtifact`;
   and `migrationReport.target.inventoryDigest` IS `currentArtifact.digests.inventory`.
4. **⚠⚠ 171 UNREVIEWED GROWTH ROWS — the blocker that survives ANY schema redesign.**
   The heuristic leg at HEAD does not reproduce its own frozen inventory: **158 NEW +
   13 INCREASED** identities (also 799 gone, 11 decreased). `predecessorRowsOf` classes
   new/increased as `report.issues`, and `validateReviewLedger` THROWS on any issue. The
   freeze would bank 171 never-reviewed reader-with-no-writer rows.
5. **⚠⚠ A FREEZE CANNOT GREEN THE GATE WITHOUT A COMMIT.** `validateBaselineHistory`
   hunts a committed schema-3 genesis in `git rev-list --ancestry-path <subjectSha>..HEAD`;
   with subjectSha === HEAD that list is **0 commits** (executed), so an uncommitted
   schema-3 baseline throws "no committed schema-3 genesis descendant". Resume-order
   step 8 says this in words. A no-commit lane can never deliver "the gate exits 0".

## ⚠⚠ The heuristic leg WORKS — and the frozen baseline is stale against it

Full-tree legacy-leaf at HEAD: **2,081 files, 120,252 reads, 9,261 resolved, 4.3 s**
(after a 111.8 s corpus). Inventory **397 files / 1,527 identities / 2,196 total**
vs frozen **551 / 2,168 / 3,261** at `ec525a59`.

⚠⚠ **The anti-vacuity floor FIRES**: `resolvedReads: 9261 < 11189 (90% of the frozen
12433)`. The cause is legitimate, not a collapse — `corpusMeta.shapeCount` went
**305 → 1,321** when the corpus builder gained the graph-schema-2 origins, and the legacy
detector only emits when `objects.length === 1`, so more observed shapes means more
ambiguous receivers and fewer findings. PLAUSIBLE (not executed): instrument the
multi-shape rejection count to settle it. Either way the freeze must re-floor the sentinel
with the cause stated, never silently.

⚠ The UI coverage the CR-OSR-SCOPE-1 exclusion leans on is REAL but the recorded figure is
STALE: **53 files / 162 identities** at HEAD, not the 88/250 in the older note.

## Why nothing was rewired (deliberate, vetoable)

Gate-leg rewiring (ruling 2) and the walker rewiring were NOT landed. Alone they deliver
nothing and hide a contradiction: the gate returns 1 on the schema pin **before any scan**,
so a heuristic-authority gate is dark until the freeze; and if someone then ran the only
migration path that exists, it would mint an EXACT schema-3 baseline that a heuristic gate
can never match. Blocker 4 also means a heuristic gate reds on anti-vacuity today. That is
the "PARTIAL — a cure you can bypass" status the hazard-conversion law names as the one
that hides.

**What the chair must rule:** whether schema 3 is redefined in place as the heuristic-leaf
identity, or a schema 4 is minted for it (leaving 3 as the retired exact definition); plus
a disposition for the 171 growth rows; plus which lane may COMMIT the genesis baseline.
The exact-artifact-free half of the migration (`predecessorRows`) already does the whole
schema-2→N reconciliation and needs no exact artifact — that is the reusable half.

Related: [[osr-resolver-state-identity-ruling]] · [[osr-identity-repair-landed-and-growth-wall]] ·
[[observed-shape-readers-walker-landed]] · [[hazard-conversion-law]].
