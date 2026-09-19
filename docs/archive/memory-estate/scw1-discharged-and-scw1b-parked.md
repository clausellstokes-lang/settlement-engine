---
name: scw1-discharged-and-scw1b-parked
description: "⛔⛔ SITE-COHERENCE WAVE 1 IS DISCHARGED, NOT DEFERRED @ ba219802 — its row left the OSR baseline at the schema-4 genesis 2a7fb033, so the deliverable had NO SUBJECT. ⏸ SCW-1b (the CLI half of M14) is PARKED: ride the next schema mint, NEVER mint for prose. ⚠ INDEX LINE OWED — MEMORY.md was at its 17KB ceiling."
metadata: 
  node_type: memory
  type: project
  created: 2026-08-12
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-12T18:16:20.259Z
---

# SCW-1 discharged; SCW-1b parked with a named home

Landed `ba219802` (branch `claude/composite-r4`, base `b5442c07`), by Lane AH under the Fable
chair, executing the SCW-1 disposition drafted by Lane AF.

⚠⚠ **THIS ROW HAS NO LINE IN `MEMORY.md`.** The index measured **17,090 bytes** at write time —
at the recorded hard ceiling where the tail goes invisible — and two lanes were live, so adding a
line was refused rather than risking the fold hazard. **Link it at the next index fold.**

## ⛔⛔ THE HEADLINE — A PLAN ROW IS NOT OPEN WORK, EVEN WHEN IT NAMES A FILE AND THREE VALUES

`SITE_COHERENCE_PLAN.md` Wave 1 was chartered to close a revert door by hand-deleting one row
from `scripts/.observed-shape-readers-baseline.json`. **At `b5442c07` that row did not exist.**
It left the baseline at the **schema-4 genesis `2a7fb033`** (2026-08-10) as a side effect of the
OSR mint programme — eleven days before the wave would have been dispatched, and while the plan
still read as open work. The wave is **DISCHARGED**, not deferred and not landed. Terminal status
recorded as `SUPERSEDED`; it was never promoted to a packet, so **no `PACKET_MANIFEST.json` row
exists or is owed**.

## The three facts that kill the wave, each re-derived at `b5442c07`

1. **No subject.** `townLayoutV2.js`'s whole frozen row is `{"biome on config": 2}`. The
   inventory went 3261/2168/551 files (schema 2) → **1954/1381/381** (schema 6).
2. **`bankable` is gone** — zero occurrences in `check-observed-shape-readers.mjs`. Schema 4
   replaced the report-only arm with a refusal: a fallen or vanished row is a `STALE ROW` and
   `run()` returns **1**.
3. **The revert door is closed and the walker holds it.** `compare()` reads an absent row as
   `ceiling 0`, so a restored read arrives as GROWTH, and the walker asserts
   `{violations: 0, stale: 0}`.

`M11`, `M12`, `M13`, `M16` are annotated SUPERSEDED in `SITE_COHERENCE_AUDIT.md`.

## ⭐⭐ THE ONE SURVIVOR, AND WHY IT SPLIT — M14 IS NOW A VALIDATOR THROW

The printed shrink instruction (*"delete the row when it reaches 0"*) never mentions `total` or
`identities`. Following it literally **no longer reds a walker static test — it hits a hard throw
in `validateLeafBaseline`** (`scripts/lib/observed-shape-baseline.mjs`,
*"observed-shape baseline totals are inconsistent"*), so every consumer of the baseline dies and
the CLI cannot reach the scan to explain itself. ⭐ The refusal is already pinned in
`tests/lint/observedShapeBaseline.test.js`, so **no new pin was owed — the gap was purely text.**

- ✅ **CURED (gate-facing half).** The SHRINK-ONLY assertion message in
  `tests/lint/observedShapeReaders.walker.test.js` now carries the whole legal act: a lawful
  shrink is the governed **`--write` re-freeze on a clean tree**, which re-derives `inventory`,
  `total` and `identities` from ONE scan together (`baselineOf`), **never** a hand-edit of rows.
  That file is **NOT** in `scannerToolFiles()`, so the edit was free.
- ⏸ **`SCW-1b` PARKED — ride the next schema mint, NEVER mint for prose.** The same clause is
  owed in `ratchetMessage`, the two `stale.push` STALE-ROW strings, and the generated `_doc`
  literal in `baselineOf` — all four inside `check-observed-shape-readers.mjs`, **governed
  scanner path #3 of 11**, where a byte costs a two-commit mint plus a corpus rebuild.
  ⚠ Navigate by SYMBOL; those addresses rot with every mint. ⚠ `_doc` is GENERATED — a hand-edit
  validates and is silently overwritten at the next mint. Its home is the plan's Deferred section.

## Rulings recorded in the same change

- **Owner-queue #4** (*make `bankable` fail the gate*) — **CLOSED AS DISCHARGED, not built**:
  both halves are already true. The `--bank` rider is **DECLINED** — a flag would become an
  **eleventh governed scanner path** for an act `--write` already performs. ⚠ Owner-visible: it
  closes a row the owner signed, so it is recorded as a discharge, not a silent removal.
- **CD-6 / `M12`'s wider claim** (31 `id on factions` reads across 15 files): measured at schema
  **2**. **Do not re-chase it and do not assume it survived** — the inventory is now ~40% of what
  it was, with four post-filters narrowing the detector.
- **Blockers `B1` and `B2` CLEARED**; the sequencing rationale's "Wave 1 early" item STRUCK.
- ⚠⚠ **A standing note now sits at the plan's wave list**: every wave re-verifies its own
  premises at compile time, because **Wave 1's were dead** while the document read as open work.

## Hazards this lane re-confirmed the hard way

- ⚠⚠ **The harness reported exit 0 on a vitest run whose true exit was 1.** Only the in-shell
  `echo "TRUE_EXIT=$?"` caught it. Trust no exit status you did not capture yourself.
- ⚠ **`tests/docs/enforcement-claims.test.js` is a BASELINED FAILING TEST** (entry 5 of
  `scripts/.test-ratchet-baseline.json`). It reds on six naked claims in
  `FABLE_VALIDATION_QUEUE.md`, `GOLDEN_SHIFT_LEDGER.md` and `IN-0C.md` — **not your change**.
  ⭐ It scans root `*.md` + `docs/**/*.md` for a claim vocabulary, so **any doc prose containing
  `fails the gate` / `machine-enforced` / `zero violations` / `0 problems` needs a co-located
  `@enforced-by` tag within ±3 lines.** Reword; never quote the token while warning about it.
- ⚠ A plumbing commit leaves **your own files as `MM` stale-index residue**. Clearing it is one
  `git update-index --add -- <explicit paths>` on the real index, after the CAS `update-ref`.
- ⚠ `docs/implementation/INDEX.md:157` still reads *"the program is 0-of-9 landed"* and calls
  SCW-0 READY, while its own row 50 says LANDED at `d648e788`. **Chair-owed**, untouched here
  because another lane holds that file.
