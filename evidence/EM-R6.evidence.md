# EM-R6 — EVIDENCE, version 2

Opus COMPILE lane, session 7d3418f8, 2026-09-19 ~19:4x–20:3x EDT.
Read tree **`$SP/read-tip-e5bdfd031`**, HEAD **`e5bdfd031`**, `git status --short` **EMPTY at the
start and at the end**. Nothing written outside `$SP/lane-em-compile-EM-R6-scratch/`. No vitest,
no eslint, no npm script, no build; plain `node` on scratch scripts, one process at a time.

⚠ **VERSION 1's EVIDENCE IS PRESERVED WHOLE** at `EM-R6.evidence.v1.md` (23 sections, measured at
`ad7ddf2c9`). §1–§2 below prove that **not one of its facts moved**; §20–§27 are the new
measurements this version adds. A fact without a command is not verified.

---

## §1 · The new tip, the empty window, and the preamble hash

```
$ git -C $SP/read-tip-e5bdfd031 rev-parse --short HEAD && git ... status --short && date
e5bdfd031
--- status ---
--- (empty above = clean) ---
Sat Sep 19 19:47:15 EDT 2026
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1
```

⇒ the preamble hash is **UNCHANGED** from `ad7ddf2c9`. (HZ-STAMP: the clock was read in the same
command as the SHA.)

## §2 · ⭐ THE J-T1 WINDOW — EMPTY over every declared path

```
$ git diff --stat ad7ddf2c9 e5bdfd031 -- \
    src/domain/institutionRename.js src/domain/institutionRemoval.js \
    tests/domain/institutionRename.test.js tests/domain/institutionRemoval.test.js \
    src/domain/factionRename.js src/domain/clone.js \
    src/domain/townMap/anchors.js src/generators/factionRoles.js
(no output)
```

```
$ git log --oneline ad7ddf2c9..e5bdfd031
e5bdfd031 PACKETS: EM-B3c placed and READY at 63de6da75 (version 2) …
63de6da75 DOC: the fifth fold — design §22.3 and §22.4 … and the charter's amendments …
1feb5c9ba PACKETS: EM-B1d LANDED at 95e494bdb (version 5) — train EM-T3's last member …
95e494bdb EM-B1d: jailed joins NpcStatus; availability splits from the house roster …
$ git diff --stat ad7ddf2c9 e5bdfd031 | tail -3
 tests/generators/densityLaw.test.js                |  18 +
 tests/lint/statusUnionTotality.walker.test.js      | 445 ++++++++++++++
 22 files changed, 1619 insertions(+), 34 deletions(-)
```

⇒ **EM-B1d version 5 landed, and it touched none of this packet's paths.** Its new export is
confirmed as somebody else's surface:

```
$ git grep -n "NPC_UNAVAILABLE_STATUSES" -- src
src/domain/entities/npcs.js:105:export const NPC_UNAVAILABLE_STATUSES = Object.freeze(['dead','exiled','jailed','removed']);
src/domain/entities/successors.js:16:import { NPC_UNAVAILABLE_STATUSES } from './npcs.js';
src/domain/density/factionLifecycle.js:69: * … `NPC_UNAVAILABLE_STATUSES` in entities/npcs.js — but
```

⇒ **Every verified fact of version 1 still holds, and every line number in §5 is unchanged.**

## §20 · ⭐ BRIEF STEP 15 — STAMPED FILES: NOT OWED

```
$ node -e "…docs/content/wiring-census.json stamp.files…"
stamp.files entries: 7
   src/domain/factionRename.js              not stamped
   src/domain/clone.js                      not stamped
   src/domain/townMap/anchors.js            not stamped
   src/generators/factionRoles.js           not stamped
   sample keys: [ 'src/domain/display/stateProse/generalStateProse.js',
                  'src/domain/display/stateProse/powerStateProse.js',
                  'src/domain/display/stateProse/economyStateProse.js', … ]
```

⇒ the census stamps **seven** producer files, all under `src/domain/display/stateProse/`. This
packet's only MODIFY is **not stamped**, so `tests/lint/proseWiringCensus.walker.test.js` cannot
red on `stale-bytes` and **`docs/content/wiring-census.json` is NOT a change-manifest row.**

## §21 · ⭐ BRIEF STEP 13 — EVERY LINE-ADDRESSED REGISTER, SWEPT

```
$ for f in tests/lint/.*.json; do grep -c "factionRename" "$f"; done
  .coupling-inclusion-baseline.json        0      .prose-family-contract-baseline.json  0
  .coupling-unlayered-baseline.json        0      .prose-numerics-baseline.json         0
  .domain-any-baseline.json                0      .site-coherence-baseline.json         0
  .dossier-mounts-baseline.json            0      .transcendental-math-baseline.json    0
  .ledger-citation-baseline.json           0      .tuning-inventory.json                0
  .lighting-census-baseline.json           0      .tuning-register.json                 0
  .migration-searchpath-baseline.json      0      .wizard-news-authoring-baseline.json  0
  .news-headline-contract-baseline.json    0
  .news-voice-baseline.json                0
$ grep -n "BASELINE_PATH" tests/lint/proseNumerics.test.js
20:const BASELINE_PATH = join(ROOT, 'tests/lint/.prose-numerics-baseline.json');
```

⇒ `src/domain/factionRename.js` appears in **NONE of the sixteen** `tests/lint` baselines, so no
register addresses it by line and the exact-identity hazard is **structurally absent**.

## §22 · ⭐ BRIEF STEP 14b — WHAT A TITLE IS WORTH, read from the walker itself

```
$ git grep -n "titles\|suiteTitles" tests/lint/sovereigntyLightingContract.walker.test.js
548:const CENSUS_FIGURE_KEYS = Object.freeze(['files','parked','credited','titles','suiteTitles']);
604:  const titles      = credited.reduce((sum,{src}) => sum + liveTitlesIn(src).length, 0);
605:  const suiteTitles = credited.reduce((sum,{src}) => sum + liveSuiteTitlesIn(src).length, 0);
1380:  // TWO TITLE ARRAYS, NEVER ONE — the tenth statement. `titles` is the EVIDENCE layer and only
1381:  // a credited TEST ever writes to it; `suiteTitles` is kept so the split is observable
1478:    // A CREDITED SUITE'S TITLE IS NOT EVIDENCE — it goes to `suiteTitles`, which nothing joins
```

⇒ **`it` titles are `titles`; `describe` titles are `suiteTitles`; both sum over CREDITED files
only.** This packet's delta — two NEW files, each ONE literal `describe` with straight-line literal
`it`s (six + four) — is therefore `+2 files / +0 parked / +2 credited / +10 titles / +2 suiteTitles`.
Both files are NEW and straight-line, so step 14b's "a promised `credited +1` lands as `parked +1`"
cannot bite; `parkReasonsFor` is a check for edits to EXISTING files, and this packet edits none.

## §23 · ⭐ BRIEF STEP 14a — NO GENERATOR IS AMONG `checks`

```
$ node -e "…scan the manifest's checks for a generator…"
generators among checks: 0 (0 = step 14a has nothing to order)
```

Every command was read for what it WRITES: `check-observed-shape-readers.mjs` and
`check-writer-reach.mjs` are invoked as **readers** (no `--write`, `--genesis` or `--rebank`);
`implementation-packets.mjs validate` writes nothing; no `build:*` script appears. ⇒ nothing
re-stamps a declared path mid-chain, so no step is ordered last for that reason. **Recorded as a
measurement, not an omission.**

## §24 · ⭐ THE CASCADE AND REMOVAL, RE-EXECUTED AT `e5bdfd031` UNDER R3 — 63 ROWS AND 525

```
$ node tools/proto2.mjs 63
tip=e5bdfd031 rows=63 seconds=3.1  declared surfaces=38
RENAME  : {"cases":63,"handlesBefore":550,"staleOnCascadeRows":0,"staleAfterAny":65,
           "stalePaths":{"simulationTrace[].downstreamEffects[].target":60,
                         "resourceAnalysis.resourceConditions[].label":4,
                         "economicState.activeChains[].resource":1},
           "newDangles":0,"newDangleKinds":{},"touchedRows":"30 distinct rows observed moving"}
REMOVAL : {"cases":63,"newDangles":0,"newDangleKinds":{},
           "orphanKinds":{"chain-lost-its-last-processor":44,"chain-label-names-a-removed-house":2},
           "removalKindsSeen":["delete-dependency-object","delete-key","drop-entry","drop-item","drop-record"]}

$ node tools/proto2.mjs 525
tip=e5bdfd031 rows=525 seconds=20.9  declared surfaces=38
RENAME  : {"cases":525,"handlesBefore":4227,"staleOnCascadeRows":0,"staleAfterAny":528,
           "stalePaths":{"simulationTrace[].downstreamEffects[].target":468,
                         "resourceAnalysis.resourceConditions[].label":48,
                         "economicState.activeChains[].resource":12},
           "newDangles":0,"newDangleKinds":{},"touchedRows":"30 distinct rows observed moving"}
REMOVAL : {"cases":525,"newDangles":0,"newDangleKinds":{},
           "orphanKinds":{"chain-lost-its-last-processor":304,"chain-label-names-a-removed-house":7},
           "residual":{"simulationTrace[].downstreamEffects[].target":468,
                       "resourceAnalysis.resourceConditions[].label":48,
                       "economicState.activeChains[].resource":12,
                       "economicState.activeChains[].label":7},
           "removalKindsSeen":["delete-dependency-object","delete-key","drop-entry","drop-item","drop-record"]}
```

⇒ **THE CASCADE IS TOTAL AT THE NEW TIP AND OVER THE FULL CORPUS: 4,227 handles, ZERO stale on any
of the 38 declared rows, ZERO new dangling joins.**
⇒ **THE REMOVAL SWEEP ADDS ZERO NEW DANGLING JOINS OF ANY KIND** against each record's own
baseline, and **all five removal kinds are observed firing.**
⇒ Every residue is on one of the **five** declared `NON_CASCADED` paths — the four paths R3 ruled
in have left the residue list entirely.

## §25 · ⭐⭐ THE DISJOINTNESS ARM (the chair's R3 ii), EXECUTED OVER THE FULL CORPUS

```
$ node tools/proto2.mjs 525
⭐ DISJOINTNESS ARM: {"values":1828,"instOnly":708,"facOnly":658,"both":0,"neither":462,"bothSamples":[]}
$ node tools/proto2.mjs 63
⭐ DISJOINTNESS ARM: {"values":236,"instOnly":92,"facOnly":56,"both":0,"neither":88,"bothSamples":[]}
```

⇒ over **1,828** `secondaryAffiliation` values on the full corpus: **708 name an institution only,
658 name a faction only, 462 name neither, and ZERO name BOTH.** A field cascaded by two writers
is lawful exactly while that holds, which is why the arm is in A1 and reds the day it stops.
⚠ The 462 "neither" are the free vocabulary (`"criminal network"`, `"Thieves' Guild"`), and the
88 of them spelling `"Thieves' Guild"` beside the catalogue `"Thieves' guild"` are the case
near-miss the chair slotted to FIX-D1.

## §26 · ⭐ R3(iii) — WHY THE CHAIN LABEL IS `report-only`, AND THE SECOND ORPHAN KIND

```
$ node -e "…surfaces-525.json chainKeys…"
  economicState.activeChains[].label   present 6676 of 6676 chains   ⇒ absent on 0
$ node tools/proto2.mjs 525
CHAIN LABEL on removal: {"rowsWithStaleLabel":7,"notes":7,"keptProcessors":4,
  "samples":[{"kind":"chain-label-names-a-removed-house","chainId":"black_market","processorsLeft":0},
             …,{"kind":"chain-label-names-a-removed-house","chainId":"black_market","processorsLeft":2}, …]}
```

⇒ the label is present on **6,676 of 6,676** chains, so **absence is not a shape this record
carries** and a removal cannot delete it. It STANDS, and the loss is carried by a second declared
orphan note — measured **7 times over 525 removals, 4 of them on a chain that kept other
processors**, so the stale label is a real reader-visible fact and not merely a side effect of the
chain emptying.

**Neither `OrphanKind` literal, nor the key itself, collides at the tip:**

```
$ git grep -rn "chain-lost-its-last-processor\|chain-label-names-a-removed-house" -- src tests
(no output)
$ git grep -rn "orphaned:" -- src tests
tests/domain/institutionStatusLifecycle.test.js:10: *       was hand-orphaned: the before is dirty …
tests/domain/razingWitnessWr8.test.js:185:    // …and no verdict is orphaned: every judgment band …
```

⇒ both hits are **English prose in comments**; no `orphaned` key and no colliding vocabulary exists.

## §27 · ⭐ R3(i) — THE LANDMARK ROW'S RESIDUE, PRICED OVER THE CORPUS

```
$ node tools/proto2.mjs 525
LANDMARK fixed-table collision: {"matches":1664,"fixedTable":60}
```

⇒ **1,604 of 1,664 (96.4 %)** matching landmarks are copies of an institution name written by
`spatialGenerator.js`'s `instNames` branches; **60 (3.6 %)** are fixed-table literals (the word
`"Alehouse"` in the quarter named `"Alehouse & Common"`). The cascade moves all 1,664 under the
exact-match guard; the 60 are the row's declared residue.

The producer and the live reader, re-confirmed at the new tip (full quotations in
`EM-R6.evidence.v1.md` §7):

```
$ git grep -rn "landmarks" -- src/generators | head -4
src/generators/spatialGenerator.js:67:      landmarks: instNames …
src/generators/spatialGenerator.js:105:     landmarks: ["Tannery Row","Slaughterhouse","Dyer's Bridge"],   ← FIXED
src/generators/spatialGenerator.js:137:     landmarks: ['Common well','Alehouse','Notice post'],           ← FIXED
$ sed -n '387,396p' src/domain/districtProfile.js
// Match institutions by name overlap with the quarter's name / landmarks.
function inferInstitutions(quarter, settlement) {
  const haystack = `${quarter.name || ''} ${(quarter.landmarks || []).join(' ')}`.toLowerCase();
```

## §28 · THE BUDGET, RE-PRICED UNDER R3 — and version 1's under-estimate

```
$ node tools/_eff.mjs candidate-v2/institutionRename.js candidate-v2/institutionRemoval.js
CONTROL — scripts/.size-baseline.json, 6 entries:  6/6 EXACT
  (explanation.js 827 · applyWorldPulse.js 907 · pulseKernel.js 1581 ·
   roadsKernel.js 838 · warTermination.js 818 · npcGenerator.js 1345)

candidate-v2/institutionRename.js    raw 266  EFFECTIVE 219
candidate-v2/institutionRemoval.js   raw  70  EFFECTIVE  65
```

```
$ node --input-type=module -e "…esbuild.transform({minify:true})…"
v2 institutionRename.js        raw  11877 B   minified   6999 B
v2 institutionRemoval.js       raw   3708 B   minified   2088 B
v1 rename (for the delta)      raw  10812 B   minified   6176 B
v1 removal (for the delta)     raw   3140 B   minified   1760 B
esbuild 0.28.1
$ node --check candidate-v2/institutionRename.js
rename leaf: parses
```

⇒ **219 + 65 = 284 effective** (both under 250; the packet under 400) and **6,999 + 2,088 =
9,087 B minified**.
⚠ **VERSION 1 PREDICTED "≈214" FOR THE RENAME LEAF AND UNDER-PRICED IT BY 5**: the chain-label
walk and R2's import line were not in that estimate. The packet quotes the measurement, and the
prediction is recorded as having been wrong.

## §29 · COLLISION, `requiredSymbols` AND THE REGISTERS, RE-VERIFIED AT `e5bdfd031`

```
$ node -e "…PACKET_MANIFEST.json at e5bdfd031…"
entries: 190 {"LANDED":187,"SUPERSEDED":2,"READY":1}
  src/domain/institutionRename.js           cm:NONE  rs:NONE
  src/domain/institutionRemoval.js          cm:NONE  rs:NONE
  tests/domain/institutionRename.test.js    cm:NONE  rs:NONE
  tests/domain/institutionRemoval.test.js   cm:NONE  rs:NONE
  src/domain/factionRename.js               cm:NONE  rs:NONE
  src/domain/clone.js                       cm:NONE  rs:NONE
```

```
$ node -e "…source.includes(symbol) for every requiredSymbols row…"
  includes: true  count: 1   src/domain/clone.js :: export function deepClone
  includes: true  count: 1   src/domain/factionRename.js :: const NPC_HOMES
  includes: true  count: 1   src/domain/factionRename.js :: export const FACTION_RENAME_SURFACES
  includes: true  count: 1   src/domain/townMap/anchors.js :: export function anchorForInstitution
  includes: true  count: 4   src/generators/factionRoles.js :: linkedInstitutionIds
$ sed -n '802,804p' scripts/implementation-packets.mjs
      if (!source.includes(row.symbol)) {
        addError(errors, `${at}.symbol is missing from ${row.path}: ${row.symbol}`);
      }
$ node -e "console.log('export const NPC_HOMES = Object.freeze([...])'.includes('const NPC_HOMES'))"
true
```

⇒ **COLLISION GROUP: NONE** across all 190 registered entries; all five `requiredSymbols` resolve;
and ⭐ **R2's `export` token leaves the pinned text present verbatim — NO `retiredSymbols` row is
owed anywhere.**

```
$ node --input-type=module -e "…tests/lint/mutationCoverage.shared.mjs at the new tip…"
   institutionRename.test.js  NAME_PATTERN: false
   institutionRemoval.test.js NAME_PATTERN: false
   tests/domain in ENFORCER_DIRS: false
```

## §30 · R9's PREMISE, MEASURED

```
$ node -e "…census-525.json…"
  observed linkedInstitutionIds paths: [["npcs[].linkedInstitutionIds[]",25]]
  powerStructure.factions[].name present on generated data: 0 of 3378
```

⇒ `factions[].members[].linkedInstitutionIds[]` is **observed ZERO times** while
`npcs[].linkedInstitutionIds[]` is observed 25 — so the packet's 38th declared row is a
**symmetry declaration** under the `NPC_HOMES` law. Its precedent is exact and in the model
itself: `FACTION_RENAME_SURFACES` declares `${ROSTER}.name`, which **never exists on generated
data** (0 of 3,378). **RAISED R9.**

## §31 · MANIFEST SELF-CHECKS, EXECUTED

```
$ node -e "…validate EM-R6.manifest.json…"
JSON PARSES. id EM-R6 status DRAFT
changeManifest: 5 | requiredSymbols: 5 | acceptanceCases: 8 | checks: 10
acceptanceCases all {id,case} OBJECTS? true          ← the brief's newest step
all actions valid? true                              ← every word ∈ PACKET_ACTIONS
generators among checks: 0                           ← step 14a has nothing to order
$ node -e "…§7 table vs manifest…"
table 5 manifest 5 SET-EQUAL: true
table not in manifest: [] | manifest not in table: []
```

## §32 · The tree at the end

```
$ git -C $SP/read-tip-e5bdfd031 status --short
(no output)
$ git -C $SP/read-tip-e5bdfd031 rev-parse --short HEAD
e5bdfd031
```
