---
name: ui-cohort-triaged-31-true-positives
description: "The UNREVIEWED-UI cohort triaged TWICE — original 68b/63c/31a on 162; the 2026-08-11 ADVERSARIAL RE-DERIVATION on the 128 alive at HEAD found 34a/54b/40c (prior restricted = 20a) — the +14 delta is ONE habit (\"detector artifact\" rows never asked whether the real object carries the key); 14 user-visible defects incl. capital, and TWO GENERATION-side bugs outside the cohort"
metadata: 
  node_type: memory
  type: project
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-11T18:40:42.181Z
---

## ⭐⭐ ADVERSARIAL RE-DERIVATION AT HEAD `ffc85a90` (2026-08-11, Fable-chaired lane)

The cohort at HEAD is **51 files / 128 identities / 193 reads** (162 was the schema-4
size; accounting closes exactly: 162 − 10 cured/re-frozen − 3 cured in genesis − 4 M9 −
17 M6 = 128; pinned at `observedShapeReaders.walker.test.js:497`). Independent re-hunt of
every writer, blind to the prior verdicts: **34 (a) / 54 (b) / 40 (c) / 0 (d)**; agreement
with the prior ledger on 114/128. ⚠⚠ **THE ENTIRE DELTA IS ONE METHODOLOGICAL HABIT: the
prior lane classified all 21 `raw` rows "detector artifact" and stopped — mis-binding
explains why the detector FIRED, not that the real object CARRIES the key. Asked the
second question, 12 of 21 are dead.** Full table: session c42c8924 scratchpad
`laneD-ui-cohort-triage.md`. Detector-correction candidates for ONE governed schema-6
mint (never piecemeal — `--write` throws on governed paths): globals exclusion
(`window.history.replaceState` binds to settlement history), `toLocaleString` missing
from `BUILTIN_MEMBERS`, the M9 `why` string names a function that does not exist
(`deriveOwnNeighbourEntry`), M6 docstring describes the wrong mechanism, `cohortNotice`
wording. Three OPEN CHAIR RULINGS: the `stresses` registered-alias exemption question;
`worldPulse on campaignState` (writer emits `{lastTick,lastInterval,updatedAt}`, read
asks `.events`); the `eventLog` leaf-name-merging vs empty-container question (35 rows).

Triaged 2026-08-11, 162/162, cohort size CONFIRMED by reproducing the governed
heuristic leg read-only (files 2083 / reads 120427 / resolved 9255 / findings 2182 /
UI reads 260) — the maintenance re-freeze did NOT move it. ⚠ The cohort is **DERIVED**
(`cohortOf(inventory, ['src/components/'])`), NOT tagged: grepping the artifact for
`UNREVIEWED-UI` correctly returns ZERO. Pinned live at
`observedShapeReaders.walker.test.js:346`. Ledger: scratchpad `uicohort-ledger.json`
+ `uicohort-REPORT.md`. Counts: **(b) 68 / (c) 63 / (a) 31**, of which **14 are
USER-VISIBLE** and 17 are dead arms of live OR-chains.

## ⚠⚠ THE USER-VISIBLE 9 (each CONFIRMED; full list in the ledger)
1. **`neighbors on settlement`** (townMap/edgeAnnotations.js:69) — `buildEdgeAnnotations`
   returns `[]` for EVERY settlement, always; the town map's exit roads have **NEVER**
   carried wayfinding labels and `SettlementMapNotes` never renders "ROADS OUT". The
   generator writes `neighborRelationship`; `settlement.schema.js:63` records `neighbors`
   as a FUTURE alias normalize deliberately does not synthesize. Same shape as the
   prominent-relationship defect, broader.
2. **`capital`/`isCapital`** (PlacementsLayer.jsx:125) — `isCapital` has ZERO repo
   occurrences, so **no settlement can EVER display as a capital** (TierIcon.jsx:39
   always picks plain brown).
3. **`port`/`tradeRouteAccess`** (PlacementsLayer.jsx:124) — the read is one level too
   SHALLOW (written at `settlement.config`), so PortBadge has never appeared. ⚠⚠ **the
   same bug at `lib/roadNetwork.js:169` makes `isPort` always false IN GENERATION.**
4. **`campaignId on save`** (ProvenanceBlock.jsx:30-31) — no writer exists (migration
   104: no `campaign_id` column was ever created; membership runs the other way via
   `campaign.settlementIds`), so the Provenance **Campaign** row renders an em-dash
   even FOR CAMPAIGN MEMBERS. Actively misleading; the correct derivation exists twice.
5. **`ancientRuin on history` ×2** — writer gated on `config.ancientRuinsEnabled`, which
   has **ZERO production occurrences** (test fixtures only): the ruin glyph and the
   "ANCIENT RUIN NEARBY" card can never render, though authored prose exists and the
   capability atlas documents it as shipping. ⚠ Fixing = ENABLING A FEATURE, not repair.
6. `recentEvents` (OutputContainer.jsx:187) · 7. `latentPantheon`
   (PantheonActivationStrip.jsx:39 — writer deliberately deleted under the deity
   doctrine, so the milestone is PERMANENTLY unchecked under copy asserting otherwise)
   · 8. `culture`/`cultureName`/`terrain` (PlacementDetailCard.jsx:53-54 — the gate at
   :112 means the block never MOUNTS; canonical `resolveSettlementTerrain` bypassed)
   · 9. `decreed on stressors` (heraldFeed.js:74; siblings `source==='dm'` and
   `visibility==='covert'` are ALSO dead).

## ⚠⚠ TWO GENERATION-SIDE DEFECTS FOUND OUTSIDE THE COHORT
- `lib/roadNetwork.js:169` — `isPort` always false in GENERATION (see 3).
- `factionRoles.js:150-154` — a bare `?.id` at GENERATION time where institutions have
  no `id`, so **`linkedInstitutionIds` is unconditionally EMPTY for every faction
  structural NPC**, breaking pillar-NPC ripple, successor ranking, and the
  SuccessorPrompt role dropdown.
⛔ **BOTH CHANGE SAME-SEED OUTPUT** — they are [[the-promise-ratified]] territory: fix
only with a declared one-time shift and owner visibility, never silently.
- `EngineSections.jsx` is DEAD CODE with zero product importers; deleting it clears 6
  cohort rows, and its fixture greens on a shape the engine cannot produce
  ([[fixture-mirrors-deriver-dead-arm-class]] again).

## ⭐ TWO MECHANISMS THE TAXONOMY LACKED (now seven)
- **M7 — ROOT-NAME IDENTIFIER PRIOR** (`legacy-reader-shape-scan.mjs:309-316`): a bare
  identifier named `settlement`/`save`/`campaign`/`worldState`/`pulseResult`/
  `wizardNews` binds to that ROOT SHAPE regardless of what it holds — distinct from M1,
  which fires on PROPERTY ACCESS. It DOMINATES this cohort because UI components name
  locals `settlement` while holding library-save wrappers.
- **LEAF-NAME SHAPE MERGING**: `foldCorpus` keys by LEAF NAME, so the regional graph's
  `eventLog` and `campaignState.eventLog` become ONE shape.
- ⚠ `campaignState` (3 keys) and `save` (5 keys) are harness **STUBS** — every other key
  on them reds by construction, which alone explains most of the 68 class-(b) rows.

## ⭐ RATIFIED JUDGMENT (chair): five rows reclassified (b)→(a)
`sp.deployment`, `via.incomeSources`, `c.description`, `c.type`, `t.title`. **Class (b)
requires a writer for that EXACT key; a dead arm rescued by a sibling arm is still a
reader with no writer** — the rescue belongs in the user-visibility column, not the
class. Correct, and it keeps the debt surface honest.

⚠ METHOD HAZARD: `file` is only a PARTIAL NUL detector — it flags a Markdown file as
"data" but reported a NUL-bearing JSON as clean "JSON data". Verify by BYTE SCAN.
