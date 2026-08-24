# LANE TE-CH-4-PREP — receipt

## STARTED 2026-08-24
- Mode: READ-ONLY investigation. No worktree, no vitest, no npm run check*, no commit.
- Slot verified: `git rev-parse claude/composite-r4` = 510c51b766a4ef329a697d61f3006e23d4fb2325
  (`510c51b76 TE-STACK-5: the census row — two cars, one gate, and the split proved at BOTH seams`)
- ⚠ LANE-LAW.md §SLOT BASE still names 79b78881ca86612ec312602c2e3dc6d06aa34df8. The slot has MOVED.
  Chair's brief (510c51b76) matches the live ref; LANE-LAW's slot line is STALE. Recorded, not edited.
- Deliverable: scratchpad/CH4-RULING-BRIEF.md

## RESUME POINT (t0)
- DONE: lane law read, slot confirmed.
- NEXT: inventory every occurrence of `noble` as classification token/tag/category/facet/role at the slot.
- Command: `git grep -n "noble" 510c51b76 -- src/ tests/ data/ | head`

## CHECKPOINT 1 — ground truth measured, harness CALIBRATED
**Harness:** `$SP/ch4src` = `git archive` of the slot's `src/`, `tests/fixtures/`, `package.json`
(no worktree, no checkout). `node_modules` = two symlinks only (`seedrandom`, `immer`); nothing
else in the import closure is a bare specifier. Plain `node v24.12.0`. NO vitest, NO gate.
**Corpus:** the repo's OWN published instrument — `tests/fixtures/cartographyCalibrationCorpus.js`
`calibrationRows()` = 504 rows (6 tiers x 12 cultures x 7 terrains, threat+seed rotated).
**CALIBRATION (this is what makes the readings trustworthy):** maxInstitutions per tier measured
`{thorp:11, hamlet:24, village:41, town:62, city:55, metropolis:63}` — EXACTLY the FROZEN figure
published at `tests/domain/townCartographyCalibration.test.js:218-223` (11/24/41/62/55/63,
re-measured by the estate at the MF-CG2-on-MF-CH3 tip, which IS this slot). Harness CONFIRMED.

**THE DEFECT IS FAR LARGER THAN ITS ONE-LINE DESCRIPTION.** 1803 quarters over 504 settlements:
merchant 595 · religious 500 · civic 222 · criminal 168 · arcane 115 · other 88 · industrial 71 ·
craft 44. **`noble` 0, `military` 0, `residential` 0, `foreign` 0 — FOUR of twelve categories are
unreachable, not one.** 712 of 1803 quarters (39.5%) carry a demonstrably wrong category.

## RESUME POINT (t1)
- DONE: slot confirmed; CH-4's real subject located (`districtProfile.inferCategory`,
  `CATEGORY_PATTERNS` at `src/domain/districtProfile.js:99-111`); harness built + calibrated;
  base histogram + per-shape attribution measured.
- NEXT: per-pattern attribution (which regex token wins on each shape), then blast radius of
  3+ candidate repair shapes, then the brief.
- Command: `cd $SP/ch4src && node CH4-attrib.mjs`

## COMPLETE — brief delivered at `$SP/CH4-RULING-BRIEF.md`
**Recommendation:** Shape D — a declared `QUARTER_CATEGORY` registry inside
`src/domain/districtProfile.js` (placed AFTER line 117 so `:112` does not move), consulted before
the keyword table, plus `den` -> `\bdens?\b` on line 113, plus a walker proving the registry equals
`spatialGenerator.js`'s authored quarter literals. NO change to the persisted record. NO reorder.
**Verdict:** CH-4 as scoped is REPAIR (chair's). Three riders are not — a persisted `category`
key (owner-gated persistence shape, and the recommendation avoids it); `military`/`foreign`
remaining unreachable (a GENERATOR gap = NEW CAPABILITY); and a §519 flag on the noble district's
dominant-faction line.

### Headline corrections to the inherited phrase
- "`noble` unclassifiable" understates it by 4x. FOUR categories are unreachable (`noble`,
  `military`, `residential`, `foreign`) and **712 of 1803 quarters (39.5%) are mis-typed**.
- §517.2's "0 of 10 quarters" — the live shape count is **12**; `Alehouse & Common` (64) and
  `Fishing Landing` (24) were not in the probe.
- `Mages' Quarter` is NOT a single verdict: **115 arcane / 44 craft**, split by the seeded
  institution draw. A shape-level probe cannot see it; it refutes every table-only repair.
- The only `criminal` district in the product is a false positive (`den` in "Resi-den-tial") and
  the only `craft` district is a false positive (a drawn `guild` landmark).

### NOT CH-4 (recorded so it is not re-found)
1. ⚠⚠ CH-1's `den` cure did NOT travel: `npcProfile.js:332` AND `:373` still carry bare `den`,
   matched against institution NAMES, with **4 mid-word false positives over 276 catalog names —
   the identical four rows CH-1 anchored**. Recommend a CH-7.
2. Six of twelve FACTION archetypes are 0 of 3272 instances (`noble`, `craft`, `labor`,
   `outsider`, `occupation`, `civic`). `noble` is unreachable in THREE places, not one.
3. `Roadside Shrine` and `Woodcutters' Ground` fire 0 times in 504 settlements.
4. 2 of 504 settlements produce zero quarters.
5. `inferInstitutions`'s `w.length > 4` substring match is the same defect class (PLAUSIBLE).
6. `arcaneClassifierCensus.walker.test.js` keys `KNOWN_UNCONVERTED` by `path:line`;
   `districtProfile.js:112` is a live row — any edit above it rots the key.

### Prohibitions honoured
No worktree, no `npm ci`, no vitest, no `npm run check*`, no commit/pin/push/packet. Files written:
this receipt and `CH4-RULING-BRIEF.md` only. Scratch: `ch4src/` (git-archive copy, 2 node_modules
symlinks), `CH4-*.mjs`, `CH4-quarters.json`, `CH4-perrow-base.json` — all inside the scratchpad.
