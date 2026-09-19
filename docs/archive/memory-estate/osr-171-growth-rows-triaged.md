---
name: osr-171-growth-rows-triaged
description: "⭐⭐ CR-OSR-FREEZE-3-R2 IS DISCHARGED — all 171 heuristic-leg growth rows triaged at HEAD 7699e367 (Opus review lane, 2026-08-10, nothing edited): 115 DETECTOR ARTIFACT / 33 CORPUS-GROWTH BENIGN / 23 TRUE-POSITIVE; ⚠⚠ a name-based writer grep MISSES a computed field-list write (npcOps.js:98-100) — scan for the key as a QUOTED STRING; ⚠⚠ the growth is INSTRUMENT COVERAGE, not estate change — 142 of 171 rows sit in files untouched since ec525a59 and every read site of all 13 INCREASED plus 155 of 158 NEW already existed there; ledger = scratchpad/osrfreeze2-review-ledger.json, 2,326 decisions whose rowIds are byte-identical to the repo's own predecessorRowsOf"
metadata:
  type: project
  date: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T23:12:40.961Z
---

Lane brief: CR-OSR-FREEZE-3-R2 ("the 171 growth rows are reviewed first"). Worktree
`.claude/worktrees/minifold`, subject sha `7699e367`. **NO repo file was edited.**

## The measurement reproduces

Re-ran the heuristic (legacy-leaf) leg against a pristine 7699e367 archive (6,274 tracked
paths, the worktree's own `node_modules` symlinked). Reproduced the prior lane exactly:
**2,081 files / 120,252 reads / 9,261 resolved / 2,196 findings / 1,321 shapes**, and the
reconciliation **158 new + 13 increased + 799 gone + 11 decreased + 1,345 same = 2,326**
predecessor rows. Corpus 46.5 s, scan 3.1 s.

## The triage

| class | n | meaning |
|---|---|---|
| (c) detector artifact | 115 | one of the six instrument mechanisms — see [[osr-heuristic-leg-detector-mechanisms]] |
| (b) corpus-growth benign | 33 | writer located and quoted; almost all **corpus-unreached** (custom content, authored events, coalitions, isolation, lineage — paths the 4-seed corpus never enters) |
| (a) true-positive candidate | 23 | a guarded read of a key no writer produces |

⚠⚠ **A NAME-BASED WRITER GREP MISSES A COMPUTED FIELD-LIST WRITE.** One row was demoted
(a) → (b) on review: `factionLink on npcs` IS written, by
`domain/npc/npcOps.js:98-100` — `for (const f of SEAT_HELD_FIELDS) { if (f in target)
nextNpc[f] = target[f]; }` with the frozen list at `:71-74`. Neither `factionLink:` nor
`.factionLink =` appears anywhere, so a name grep sees nothing. **The tell is the key as a
QUOTED STRING.** Every remaining class-(a) key was re-scanned for quoted occurrences before
this file was finalized; the only hits were `npcVerdictApply.js:87-88`
(`{ key: 'dots'|'notability', to: 0 }`, a strip gated at `:179` by `hasOwnProperty` with an
explicit "does not grow one here" comment — not a writer) and
`compendium/generated/compendiumData.generated.js:468` (`"authored": true` inside an
archetypes COUNT block, never a generation entity). Both class-(a) verdicts survived.

## ⚠⚠ THE GROWTH IS THE INSTRUMENT, NOT THE ESTATE

- **142 of 171** rows sit in files **not touched at all** between `ec525a59` and HEAD.
- **All 13 INCREASED**: every read-site text occurs the *same number of times* at `ec525a59`
  as at HEAD. Not one gained a read site. An INCREASED row cannot introduce a new defect
  class — the (key, shape) pair was already banked *for that exact file*; only the site count
  under an already-reviewed identity widened.
- **155 of 158 NEW**: every read site already existed. Only 3 involve changed code
  (`src/domain/factionRefs.js` is new; `generationOwnership.js || createdByEventId` and
  `proseSeams.js || text` gained a site).
- **47 of 158 NEW** carry an identity the frozen baseline *already banks under a different
  file* — same defect, new site.
- Driver: `corpusMeta.shapeCount` **305 → 1,321** (the graph-schema-2 origins), which grows
  `known` (usableShapes 228 → 338), `singleHome` (1,053 names at HEAD) and `rootShapes`, so
  receivers that returned EMPTY now bind. Same cause as the anti-vacuity floor firing
  (resolvedReads 12,433 → 9,261).
- ⚠ `assertPredecessorExecutionCompatibility` (migrate-observed-shape-readers.mjs:245-254)
  checks only seeds/configs/generations/pulseIntervals — **never shapeCount** — so the
  migration cannot see that the corpus DEFINITION moved underneath the reconciliation.

## The 24 true positives, by family

- **prominentRelationship (8)** — the sharpest. Sole writer `genRelNarrative`
  (`generators/power/settlementNarrative.js:227-235`) returns exactly
  `{npc1, npc2, type, phrasing, full, tension}`. `Relationships.jsx:75/79` and
  `journalPages.js:336` read `otherSettlement`, `relationshipType`, `description`, `summary`,
  `flavor`, `flavour` — none written. `otherSettlement` has **zero writers repo-wide**. LIVE
  DISPLAY DEFECT: the PDF's PROMINENT RELATIONSHIP callout always renders
  "Neighbour · linked" and its body falls through to `''` while `full`/`phrasing`/`tension`
  hold the real text. Already banked for `Overview.jsx` in the frozen baseline.
- **settlement-root legacy slots (3)** — `hooks`, `supplyChains`, `plotHooks`. `aiLayer.js:214-216`
  *documents* that `settlement.plotHooks` is never written and is "kept as a legacy fallback".
- **herald caller-supplied markers (4)** — `__adjudicationPending`, `__forecast`, `__resolution`
  (read by two modules each, written by none; `heraldRouting.js:506` documents them as
  caller-supplied and no caller exists) and `decreed`.
- **npc ladder (2)** — `notability`, `dots`: JSDoc-declared, read, never written.
  `npcLadderState.js:202 dots: num(n.dots, 0)` writes a derived row from the writerless key.
  Bounded blast radius: `disposition.js:88-93` puts the dots/notability rungs BELOW a live
  `importance` string ladder, so an unranked NPC takes the 0.38 floor instead of 0.48/0.68/0.9.
- **locks (2)** — `locks.factions` / `locks.institutions`: `setLock`
  (`store/settlementSlice.js:1253-1261`) is the only writer and its three call sites pass only
  identity/geography/npcs/history, so `coup.js`'s lockedGoverningFaction shield can never arm.
- **singular/plural + name drift (4)** — `evidenceId` (writers spell the plural array
  `evidenceIds`; three readers repo-wide share the identical dead fallback),
  `coalitionEvidence on outcome` (every producer nests under `metadata:`),
  `authored on institutions` (live spellings are `_authored` and `source:'authored'`),
  `title on currentTensions`.

## The ledger

`scratchpad/osrfreeze2-review-ledger.json` — 2,326 decisions, all `accept`, every one with a
note; the 171 growth rows carry `[CR-OSR-FREEZE-3-R2 triage a|b|c] …`. **Verified against the
repo's own (non-exported) `predecessorRowsOf` by shimming an export into the scratch archive:
2,326 rowIds, same order, ZERO mismatches**, with a negative control showing the rowId digest
moves when a count changes. Portable half: `-decisions.json`. Provenance: `-provenance.json`.

⚠⚠ `bindings` is filled only for the three predecessor-derived digests; the other nine are
`null` because only the schema-4 lane's own report can supply them — and see
[[osr-review-ledger-cannot-clear-growth-rows]], because the ledger **cannot** green the
migration by itself no matter how complete it is.

## Deliberately not done

Nothing was fixed — the brief is triage-only. The 24 class-(a) rows are banked in the ledger as
reviewed with a `TRUE-POSITIVE, banked pending repair` note so the freeze does not silently
absorb them; each needs a repair lane, and the prominentRelationship eight are user-visible.

Related: [[osr-heuristic-leg-detector-mechanisms]] · [[osr-review-ledger-cannot-clear-growth-rows]] ·
[[osr-schema3-freeze-refused-measured]] · [[osr-resolver-state-identity-ruling]].
