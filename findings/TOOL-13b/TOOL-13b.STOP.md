# TOOL-13b — STOP on commits 1, 2 and 3: the premise is refuted by execution

**Lane:** TOOL-13b, Opus BUILD. **Chair:** Fable 5.1, session a9df403c.
**Stamp (from `date`, same call as the runs):** 2026-09-20 08:32–08:42 EDT.
**Worktree:** `$SP/lane-tool-13b`, branch `tool-13b-2026-09-20`, base `c33446830`.
**Nothing is committed.** `git status --short` names exactly one path, the commit-4 guard,
STAGED and uncommitted pending this ruling.

---

## THE SMALLEST MEASURED CONTRADICTION

**Commits 1, 2 and 3 all edit a DETECTOR SOURCE, and the plain gate run refuses a
detector source that has moved by so much as one comment byte — before the scan begins.**

The brief's law is *"`node scripts/check-observed-shape-readers.mjs` (the plain run) green
after every commit"* and *"the plain scanner run prints `exactly matching the frozen
inventory` after every commit"*. That law and commits 1–3 cannot both hold.

### PROBE-A — one comment byte appended to `scripts/check-observed-shape-readers.mjs`

```
$ printf '// PROBE-A: one comment byte…\n' >> scripts/check-observed-shape-readers.mjs
$ node scripts/check-observed-shape-readers.mjs
EXIT=1
observed-shape DETECTOR SOURCE changed since the schema-22 instrument was governed
(scripts/check-observed-shape-readers.mjs); an ordinary gate/write cannot migrate the
instrument. Build and review the governed migration bundle instead.
```

7 s, and the corpus is never built: the refusal is at `run()`'s provenance branch
(`check-observed-shape-readers.mjs:3044–3071`), which compares
`baseline.scannerProvenance.detectorDigest` against the live `detectorTree` digest and
then classifies the drift. `scripts/check-observed-shape-readers.mjs` is itself the first
entry of `scannerToolFiles()` and `isDetectorSourcePath()` returns **true** for it, so
`drift.detectorSources` is non-empty and the branch returns 1. **Probe withdrawn;
`git status --short` = 0 lines.** (CONFIRMED)

### PROBE-B — one comment byte appended to `scripts/lib/legacy-reader-shape-scan.mjs`

```
$ node scripts/check-observed-shape-readers.mjs
EXIT=1
Error: legacy observed-shape detector does not reconstruct governed Git blob
0310fa9fdda873c1b382cf18c3936707e8e4addf
    at assertGovernedLegacyDetectorSource (scripts/lib/observed-shape-governance.mjs:127)
    at governedLegacyDetectorSha256 … governedLegacyAlgorithmOf …
    at validateHeuristicMigrationReceipt … validateLeafBaseline … validateSchema22Baseline
    at run (scripts/check-observed-shape-readers.mjs:3030)
```

The byte-freeze throws even earlier than the provenance gate. **And it is not a refusal of
everything** — the same arm on the clean file accepts:

```
BYTE-FREEZE ACCEPTED, sha256=79c08bb74c31bcffd75407822536ec509cad746898bd5fbe067481b273547bed
```

**Probe withdrawn; `git status --short` = 0 lines.** (CONFIRMED)

### THE CONTROL that proves the two refusals are about *which file*, not *any edit*

The commit-4 guard adds **+112 lines to `tests/lint/observedShapeReaders.walker.test.js`**
and the same plain run stays green:

```
EXIT=0
observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.
(stderr: 0 lines)
```

The instrument says so in its own voice, in the bank fence's refusal message
(`check-observed-shape-readers.mjs:1620`): *"tests/lint is not a governed input, so the
chain stays clean."* (CONFIRMED)

---

## WHAT THIS DOES AND DOES NOT REFUTE

| commit | edits | verdict |
|---|---|---|
| 1 — the denominator field | `scripts/check-observed-shape-readers.mjs` | **REFUTED.** Any byte reds the plain run. TOOL-13 §7.2's *"computing it in `check-observed-shape-readers.mjs` as a post-scan derivation keeps it out of the frozen blob"* was labelled **PLAUSIBLE, not built** — measured, it is false. The blob is not the only freeze; the FILE is a governed detector source. |
| 2 — M12 settled | same file | **REFUTED** by the same wall. ⚠ The M12 *question* is nonetheless **ANSWERED by measurement** — see the receipt §2. The answer is "keep it"; recording that answer where it belongs is what the wall forbids. |
| 3 — the header correction | `scripts/lib/legacy-reader-shape-scan.mjs` | **DOUBLY REFUTED.** It is a detector source AND byte-frozen to blob `0310fa9f`; the file's own header already warns *"appending one comment is refused"*. |
| 4 — the erasure guard | `tests/lint/observedShapeReaders.walker.test.js` | **PREMISE HOLDS.** Built, measured, its counterforce executed, staged, green on the plain run. Awaiting its gate batch. |

**The door all three need is the one the brief ruled out** — the migration-bundle door
(`--write --migrate-schema=23 --migration-review=<bundle>`), executed on a branch cut at
exactly the consist tip (the recorded content-addressed/history-bound hazard). That is a
rung, not a lane act, and it is the chair's to rule.

## THE THREE PATHS, AND THE CHAIR'S RULING (addendum 84, 2026-09-20, vetoable)

1. ⭐ **RULED — fold 1–3 into the governed schema-23 rung.** They cost one rung between
   them, they mint zero findings and erase zero rows, and the same rung carries TOOL-13a's
   root widening — which needs a bundle anyway and whose 13 erased rows are now named and
   triaged (receipt §3.2). One bundle, four cures. TOOL-13a is the chair's mint on a branch
   cut at the integration tip; the three are its members M1, M2 and M3 (**receipt §1.1**,
   which holds the two exact refusal lines its compile lane starts from).
2. ⛔ **CLOSED WITH REASON, NOT DEFERRED — the re-spelling outside the governed set.** A
   NEW `scripts/observed-shape-denominator.mjs` would red nothing, but *a second mechanism
   beside a governed one is the shape the estate forbids*. I had recommended against it; it
   is now forbidden and **must not be revived** by a later lane reading this file.
3. **NOT TAKEN — close 1–3 with reason and land 4 alone.** Superseded by path 1.

**Commit 4 RUNS ITS GATE** (chair, same addendum): the queue is EM-B1f (batches 1–3), then
FIX-L1 and FIX-P5, then this lane, resumed with "the gate is yours". Until then the one
staged file stays staged and nothing else is written.

⛔ Owner law satisfied: there is no deferred work here. 1, 2 and 3 have a **slot** (the
schema-23 rung); the re-spelling is **closed with reason**; commit 4 has a **gate slot**.
