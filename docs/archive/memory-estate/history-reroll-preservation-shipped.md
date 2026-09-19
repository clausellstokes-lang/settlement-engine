---
name: history-reroll-preservation-shipped
description: "History reroll no longer destroys campaign record, the coherence tail, or authored root prose — BUILT + gated 2026-07-26, UNCOMMITTED (mixed files); ⚠️ ONE owner question left open: is generated-beat identity worth inventing for historicalEvents[]/currentTensions[]"
metadata: 
  node_type: memory
  type: project
  originSessionId: e522b974-c196-4ff7-bdac-3da965f9223d
  modified: 2026-08-06T10:27:51.774Z
---

**Built 2026-07-26** in worktree `minifold` (branch `claude/composite-r4`, base `59f76448`),
closing three of the four losses recorded in the `regenSection('history')` DELIBERATELY
DEFERRED comment. Sibling of the same-day NPC fix ([[regen-edit-loss-hazard]]).

**What was actually wrong** (CONFIRMED by running `generateSettlementPipeline` at 5 tiers,
not by reading): `regenHistoryPipeline` returned `generateHistory`'s raw output, so a
history reroll shipped a strictly poorer object than a generated one — `siegeNarrative`
and `legacyAnnotations` keys ABSENT entirely, and `historicalCharacter` collapsed from a
paragraph of prose to a stub from a closed 6-string set (`"stable and prosperous"`,
`"marked by repeated calamities"`, …). Same defect shape as the NPC reroll before
`enrichNpcCoherence` was extracted [generators-domain-3].

**The three fixes, all as overlays on finished output (never generator inputs):**

1. `src/domain/historyPreservation.js` (NEW, pure) — `carryCampaignEvents` carries
   `campaignEra: true` entries across by `campaignEventId`, appended at the END where
   worldPulse's own three writers put them; `restoreAuthoredHistory` re-applies the
   settlement-root `_userEdits` values for the six editable `history.*` paths.
2. `src/generators/narrative/historyCoherence.js` (NEW) — owns `buildStressProfile`
   (MOVED out of narrativeGenerator) + `historySiegeNarrative` (the "strings only"
   filter) + `enrichHistoryCoherence`. `generateCoherence` now reads the first two, so
   assembly and reroll share one source.
3. `regenHistoryPipeline` runs carry → tail → authored-restore, in that order. The order
   is load-bearing: the tail mints `historicalCharacter`, which is itself editable, so
   restoring before enriching would undo the edit being preserved.

**Judgment calls (all vetoable):** campaign events carry UNCONDITIONALLY with no
regeneration-mode gate (no mode should delete a siege the party fought); the tail computes
over the MERGED events so `historicalCharacter` describes the array stored beside it;
`eventsTimeline` is deliberately NOT extended with campaign entries, matching post-advance
shape rather than inventing a better one.

**⚠️ OWNER QUESTION STILL OPEN (item 4a):** authored ENTRIES inside `historicalEvents[]` /
`currentTensions[]` still reroll away. They carry no id and no provenance marker, and
positional index is worthless across a reroll that changes the array's length — preserving
them needs an identity scheme minted for the purpose. "Is a generated beat worth minting
one for" is a product decision. Recorded at the three sites that would need it
(settlementSlice's history branch, historyPreservation.js deferral A, regenHistoryPipeline's
JSDoc). Second, smaller deferral: a restored root value leaves its `_userEdits.originalValue`
pointing at the older roll's text, so "Revert to generated" restores that, not the current
roll.

**Also NOT fixed, on purpose:** `[generators-pipeline-5]` (regenHistoryPipeline drops its
minted seed) stays open — the NPC twin returns `_regenSeed` at the settlement ROOT, and a
`history._regenSeed` would mean something different, so half-answering it was worse than
leaving it.

**Discovered in passing — ✅ NOW DELETED (2026-07-26, later session).**
`src/generators/historyGenerator.js:70` held `_getSettlementHistoryNote`, a DEAD third copy of
the same stress-profile derivation (the leading underscore exempted it from no-unused-vars,
whose allowlist is `/^_/u` — that is how a 47-line dead function hid from the lint gate).
Deleted along with the now-unused `POLITICAL_FLAVOR` import and `pickRandom2` from the helpers
destructure; `random01` stays (still used by the ancient-ruin draw). `scripts/.size-baseline.json`
lowered **864 → 826** to lock the win (826 is still over the 800 generators layer ceiling, so the
entry stays rather than being deleted). THE PROMISE held: a 50-settlement same-seed fingerprint
(10 configs × 5 seeds through `generateSettlementPipeline`) was byte-identical before/after.
⚠️ LEFT UNCOMMITTED for the same reason as the rest of this lane — BOTH files were already dirty
with another session's WIP (a 93/117-line worldLaw/historyTemplate refactor inside
historyGenerator.js; four other lowered numbers inside .size-baseline.json), so neither could be
staged without committing work that is not mine.

**Why:** the reroll is a headline verb on the dossier; before this, using it on a
campaign-advanced settlement silently deleted the table's own history, and using it at all
downgraded the prose the whole History tab is built to display.

**How to apply:** the pattern for any future section reroll is now established twice (NPCs,
history) — extract the assembly tail into a shared leaf, apply preservation as an overlay
AFTER enrichment, keep dormancy as SAME-REFERENCE return so an untouched settlement's
reroll is unchanged, and pin it against `generateSettlementPipeline` output plus the real
worldPulse writer, never fixtures.

**Receipts (2026-07-26).** New pin `tests/generators/regenHistoryEnrichment.test.js` 8/8,
proven non-vacuous by a temporary pre-fix mutation (6 of 8 went red, the 2 survivors being
the pure-domain dormancy units). THE PROMISE held: a same-seed fingerprint over 5 tiers was
byte-identical before/after the `buildStressProfile` move. Green: `typecheck:domain:strict`
(0 errors, ceiling 0), eslint on all 6 touched files, sizeBaseline (settlementSlice still
EXACTLY 1265 — the analysis rewrite was comment-only), domainAnyCastBaseline,
domainStrictBaseline, layerBoundaries, domainGeneratorsBoundary.

⚠️ **LEFT UNCOMMITTED, deliberately.** `generateSettlementPipeline.js`,
`narrativeGenerator.js` and `settlementSlice.js` each already carried large amounts of
another session's WIP (165/269 and 177/148 line deltas vs HEAD), so no file could be staged
without committing work that is not mine — including 2 pre-existing `npm run typecheck`
errors in `refreshRelationshipProjections`, code ABSENT at HEAD and therefore attributable
to the uncommitted NPC-preservation work, not to this change. See
[[minifold-tree-is-live]].

## ✅ COMMITTED @ `a88be4f1` — the UNCOMMITTED notes above are STALE

**Migrated from the memory index 2026-08-06; the commit state was measured 2026-08-05
and RE-CONFIRMED by executed `git` on 2026-08-06.** Both "LEFT UNCOMMITTED,
deliberately" passages above — and the frontmatter description's "UNCOMMITTED (mixed
files)" — describe the tree only as it stood on 2026-07-26. They are SUPERSEDED. Do
not re-derive a landing plan from them, and do not treat this lane as owed work.

Measured (2026-08-06, `git show`/`git cat-file` at the main tree):
- `a88be4f1` = `a88be4f1134ff0f4a7afa650eb14ff7894b8fb9b`, *"Composite integration:
  the cross-lane surface -- components, store, domain, edge, and their tests"*,
  **Sun Jul 26 16:25:29 2026 -0400**, on `claude/composite-r4`.
- `src/domain/historyPreservation.js` is ADDED by that commit (**+205 lines**);
  `src/store/settlementSlice.js` (434 changed) and `scripts/.size-baseline.json`
  (12 changed) ride the same commit.
- `src/generators/narrative/historyCoherence.js`,
  `tests/generators/regenHistoryEnrichment.test.js`,
  `src/generators/narrativeGenerator.js` and `src/generators/historyGenerator.js`
  are all PRESENT in the tree at `a88be4f1` — the whole lane is in, not just the
  new domain leaf.

⚠️ **Why the stale note survived so long, and the navigation hazard it leaves.**
`a88be4f1` sits on `claude/composite-r4`, NOT on the ledger branch
`review-fixes-2026-07-08`. Run from a ledger-branch HEAD,
`git log -- src/domain/historyPreservation.js` returns **NOTHING and exits 0**, which
reads exactly like "never committed" (executed 2026-08-06). Always name the build
branch — `git log claude/composite-r4 -- <path>` — or ask `git branch -a --contains
<sha>`, before concluding a build-era lane is unlanded.

Still open regardless of the commit state: the owner question at item 4a (identity
for authored entries inside `historicalEvents[]` / `currentTensions[]`), the
`_userEdits.originalValue` deferral, and `[generators-pipeline-5]`.
