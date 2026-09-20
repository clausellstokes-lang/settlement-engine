# EM-R6 — EVIDENCE, version 3

Opus COMPILE lane, session a9df403c, 2026-09-20 ~01:5x–03:0x EDT.
**Read tree** `$SP/read-tip-32602dc60`, HEAD `32602dc607b7423838249cf57d73baf08feb047d`;
`git status --short` **EMPTY at the start and at the end** (§14).
Nothing written outside `$SP/lane-em-compile-EM-R6-scratch/`. No vitest, no eslint, no npm script,
no build; plain `node` on scratch scripts, one process at a time.

⚠ **Version 1's 23 sections are preserved whole at `EM-R6.evidence.v1.md` and version 2's at
`EM-R6.evidence.v2.md`.** Nothing there is rewritten. Where a version-2 figure is refuted, the
refutation is here with the command that refuted it.

⭐ **THE METHOD CHANGED IN ONE IMPORTANT WAY.** Version 2's harness (`tools/proto2.mjs`) re-declared
the cascade inside itself, so its figures were figures about the harness. Version 3's harness
(`tools/proto4.mjs`) **imports the priced candidate source** from `candidate-v3/`, so every figure
below is a figure about the module the packet contracts. `candidate-v3/clone.js` is a verbatim copy
of the tree's; `candidate-v3/factionRename.js` is a 1-line documented SHIM exporting only
`NPC_HOMES`, whose value is pinned verbatim in §5.

---

## §1 · The tree, the window, and the preamble

```
$ git -C $SP/read-tip-32602dc60 rev-parse HEAD
32602dc607b7423838249cf57d73baf08feb047d
$ git -C $SP/read-tip-32602dc60 status --short
                                              ← EMPTY
$ date
Sun Sep 20 01:54:39 EDT 2026
```

**The J-T1 window, run in the same command that reads the tip:**

```
$ git diff --stat e5bdfd031 32602dc60 -- src/domain/clone.js src/domain/factionRename.js \
    src/domain/townMap/anchors.js src/generators/factionRoles.js src/generators/safetyProfile.js \
    src/generators/computeActiveChains.js src/generators/priorityHelpers.js \
    src/domain/institutionRename.js src/domain/institutionRemoval.js \
    tests/domain/institutionRename.test.js tests/domain/institutionRemoval.test.js
                                              ← NOTHING PRINTED
$ git diff --stat e5bdfd031 32602dc60 -- tests/domain/factionRename.test.js tests/helpers/goldenMasterCorpus.js
                                              ← NOTHING PRINTED
$ git log --oneline e5bdfd031..32602dc60
32602dc60 CURE-D: the prose-wiring census re-taken and the holder table's three stale producer citations re-addressed …
145acdb75 CURE-C: EM-B1e's acceptance file is statically registered — credited, seven titles, no assertion changed
8955b67a8 CURE-B: the prose-numerics baseline re-addressed for train EM-T3's landings — 2 rows, addresses only …
2d72c8b7a CURE-A2: the move-vocabulary walker's twin mask takes the same horizontal-whitespace cure …
08cb42e31 CURE-A: the model walker blanks import lines by horizontal whitespace only …
```

⇒ **five commits, none touching a declared path.** Every version-2 fact about the tree stands; what
version 3 changes is the CLASSIFICATION of four paths, ruled by ODQ §934.61.

```
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1  docs/implementation/preambles/EM-PREAMBLE.md
```
⇒ **unchanged from `e5bdfd031`.** Left unstamped by design.

**The CREATE targets:**

```
src/domain/institutionRename.js                  disk:ABSENT  git:UNKNOWN
src/domain/institutionRemoval.js                 disk:ABSENT  git:UNKNOWN
tests/domain/institutionRename.test.js           disk:ABSENT  git:UNKNOWN
tests/domain/institutionRemoval.test.js          disk:ABSENT  git:UNKNOWN
```

---

## §2 · THE FULL-CORPUS RUN — the rename and removal arms, through the candidate source

```
$ node tools/proto4.mjs 525
tip=32602dc60 rows=525 inst=17361 s=116.1 cascade=36 nonCascaded=15 catalogueNames=280
RENAME  : {"cases":525,"handlesBefore":4034,"staleOnCascade":0,"stalePaths":{},"newDangles":0,
           "touched":"25 paths moved",
           "residue":{"simulationTrace[].downstreamEffects[].target":550,
                      "economicState.activeChains[].processingInstitutions[]":175}}
REMOVAL : {"cases":525,"newDangles":0,
           "kindsSeen":["delete-dependency-object","delete-key","drop-entry","drop-item","drop-record"],
           "orphanKinds":{"chain-lost-its-last-processor":125,
                          "chain-label-names-a-removed-house":28},
           "orphanOnKeptChain":20}
PARTITION: {"beforeOk":525,"afterRenameOk":525,"afterRemovalOk":525,"rows":525}
IMMUTABLE: {"cases":525,"sameTouched":525,"inputUnmutated":525,"sameOrphans":525} keysetGained 0
MIRROR: {"paired":4884,"disagreeBaseline":0,"oneHomeRedRows":257,"twoHomeRedRows":0}
```

The 63-row stride agrees in shape (`$ node tools/proto4.mjs 63`): 63 rows, 2,428 institutions,
5.0 s, 532 handles, 0 stale, 0 new dangles, all five removal kinds, `UNDECLARED_AGAINST_V3: []`.

⇒ **A2, A3, A4, A5, A6(iii) and A7 are CONFIRMED by execution at the tip.**

---

## §3 · ⛔ THE BASELINE DANGLE COUNT IS ZERO — version 2's 7,399 is REFUTED

```
BASELINE DANGLES (reference set): 0 {}
```

The denominator is the cascade rows whose key name itself declares an institution reference —
excluding `institutions[].name` (the subject), `spatialLayout.quarters[].landmarks[]`,
`secondaryAffiliation`, `economicState.activeChains[].label` and the two DERIVED DISPLAY LABEL rows
(all of which lawfully hold non-institution strings), and excluding a parenthetical provenance
sentinel (§7).

**Over 525 rows, 17,361 institutions: ZERO pre-existing dangling reference joins, on ZERO paths.**

Version 2 reported 7,399 with per-settlement medians "thorp 11 · city 23" and built A4's gate to
subtract them. That population was: **4,453 catalogue-vocabulary values** (of which 1,568 the same
values counted twice, because the three `exploitation` arms partition `resourceChains[]`),
**2,525 matched patterns** (all of which still match a present institution under the producer's own
matcher), and **421 parenthetical sentinels**. **§934.61 ruled none of them a reference.** A4's gate
stays a DELTA anyway, because a SAVED record may carry dangles the generator never wrote.

---

## §4 · ⭐ THE THREE-ARM DENOMINATOR PIN, AND ITS RED CONTROL

```
PIN: { "exactArmPaths": 42, "catArmPaths": 17, "normArmPaths": 10, "THRESHOLD": 50,
  "armPathsAtThreshold": [
    "economicState.compound.inst.names[]",
    "economicState.institutionalServices[].institutions[]",
    "economicState.safetyProfile.compound.inst.names[]",
    "economicState.safetyProfile.criminalInstitutions[]",
    "structuralSuggestions[].suggested[]" ],
  "UNDECLARED_AGAINST_V2": [ …all five of the above… ],
  "UNDECLARED_AGAINST_V3": [] }

catRates (top): structuralSuggestions[].suggested[]                          136/136   100 %
                resourceAnalysis.exploitation.unexploited[].processing…[]    552/1317   41.9 %
                resourceAnalysis.gaps[].missing[]                            783/2016   38.8 %
                resourceAnalysis.resourceChains[].processingInstitutions[]  1132/3212   35.2 %
                resourceAnalysis.exploitation.fullyExploited[]…              349/1040   33.6 %
                generationCoherenceReceipt.repairs[].subject                  125/408   30.6 %
normRates (top): economicState.safetyProfile.compound.inst.names[]         17361/17361 100 %
                 economicState.compound.inst.names[]                       17361/17361 100 %
                 economicState.institutionalServices[].institutions[]        1764/1764 100 %
                 economicState.safetyProfile.criminalInstitutions[]          1164/1164 100 %
                 defenseProfile.institutions.garrison[].catalogId             170/422   40.3 %
                 institutions[].catalogId                                   1921/15278  12.6 %
```

⭐ **THE ARMS EARNED THEIR PLACE ON ARRIVAL.** Against version 2's lists they find **five**
undeclared paths — the RED CONTROL, and the reason A1(iv) is mandatory. Against version 3's lists
they find **none**. The exact arm alone finds 42 paths and **cannot see any of the five**, because
every one of them has **zero** values exactly equal to a roster name.

⚠ **`catalogId` paths sit below the 50 % predominance threshold** (`institutions[].catalogId`
12.6 %, `defenseProfile.institutions.garrison[].catalogId` 40.3 %) and are correctly not swept in:
a `catalogId` is a slug of the CANONICAL catalogue name, so it normalises onto a roster name only
when the instance name is the catalogue name. **That is why the arms are scoped by predominance and
not by "any hit"** — an "any hit" rule would drag both `catalogId` paths and several `dependsOn[]`
and `chainId` paths in.

---

## §5 · The four-kinds classification, path by path, with the producer that decides it

**(b) CATALOGUE VOCABULARY — `structuralSuggestions[].suggested[]`, 136 of 136 catalogue names:**

```
$ git grep -n "suggested" -- src/generators/structuralValidator.js
  718:      suggested: ['Town walls', 'City walls and gates'],
  726:      suggested: ['Warehouse district'],
  734:      suggested: ['Alchemist quarter', 'Alchemist shop'],
  751:      suggested: ['Docks/port facilities'],
  770:      suggested: ['Courthouse', 'Multiple court buildings'],
  …
$ git grep -n "structuralSuggestions" -- src/components/new/tabs/OverviewTab.jsx
  668: … Consider: {v.suggested.join(', ')}.
```
⇒ authored advice about what the town SHOULD build. **NON_CASCADED.**

**(d) DERIVED DISPLAY LABEL #2 — `economicState.institutionalServices[].institutions[]`:**

```
$ git grep -n "institutionalServices" -- src/generators/economy/economicState.js
  777:  const instServices = deriveInstitutionalServices(institutions || []);
  886:      institutionalServices: instServices,
$ <src/generators/computeActiveChains.js, deriveInstitutionalServices>
      const matched = institutions
        .filter(i => def.patterns.some(p => institutionMatchesKeyword(i, p)))
        .map(i => (i.name || '').toLowerCase());
      …  institutions: matched.slice(0, 2),
$ git grep -n "svc.institutions" -- src/components
  src/components/new/tabs/EconomicsTab.jsx:241:
      <span …>Via:</span>{svc.institutions.map(institutionDisplayName).join(' · ')}
$ <src/domain/display/institutionDisplayName.js:111>
      return DISPLAY_BY_LOWER.get(raw.toLowerCase()) ?? raw;      ← falls through for a DM name
```
```
LABEL-lower: {"values":1764,"exact":0,"lowerOfRoster":1764,"other":0,"allLower":1764,
              "renamedRows":260,"renamedLower":260}
```
⇒ **1,764 of 1,764 are lower-case variants of a roster name and 1,764 of 1,764 are all-lowercase**,
so "every value here is lowercase" is a producer invariant. Reader-visible. **CASCADED under
`label`, rewritten LOWERCASED** — and the rename writes the lowercased new name on **260 of 260**
rows that carry it.

**(d) DERIVED DISPLAY LABEL #1 — `economicState.safetyProfile.criminalInstitutions[]`:**

```
$ <src/generators/safetyProfile.js:605-616>
  const criminalInstitutions = institutions
    .map(institution => Object.entries(CRIMINAL_INST_LABELS).find(
      ([canonicalName]) => institutionMatchesNativeName(institution, canonicalName),
    )?.[1] || null).filter(Boolean);
$ <src/domain/factionRename.js:289>   the FACTION cascade's own ruling on this path:
  'a fixed vocabulary label from the CRIMINAL_INST_LABELS table … naming an INSTITUTION rather
   than referring to the faction … AN INSTITUTION OWNS ITS OWN NAME'
```
```
LABEL-verbatim: {"values":1164,"exact":0,"caseFold":1164,"normOnly":0,"neither":0,
                 "renamedRows":273,"renamedVerbatim":273,"removedRows":273,"removedGone":273}
```
⇒ **1,164 of 1,164 case-variants, 0 exact.** **CASCADED under `label`, rewritten VERBATIM**;
the rename lands on **273 of 273** rows and the removal drops it on **273 of 273**.

**A FROZEN STAMP — `economicState.compound.inst.names[]` and its `safetyProfile` alias:**

```
$ <src/generators/priorityHelpers.js, getInstitutionNames>
  const names = nativeSemanticNames(institutions).map(name => name.toLowerCase());
  return { hasMilitaryInst: …, hasThievesGuild: …, names };        ← the lowercased roster
$ <src/generators/priorityHelpers.js:277>  export const getInstFlags = (config, institutions) => {
    const inst = getInstitutionNames(institutions); …
$ <src/generators/economy/economicState.js:51-62>
  // ⛔⛔ RAW ROSTER, STAMPED ONCE (`compound:` at :883), NEVER RECOMPUTED ON ADVANCE.
  //  … a ruined courthouse still sets `hasCourtSystem` … ⛔ BOTH CURES … ARE OWNER-GATED …
  //  Trace, pricing, the §708.7 rule: docs/ENGINE_DEFECT_DISPOSITIONS.md §4.
    ecoInstFlags = getInstFlags(config, institutions),
    … safetyProfile = generateSafetyProfile(config, tier, institutions),
$ git grep -rn "inst\.names\|inst?\.names" -- src | grep -i names
  src/domain/display/stateProse/defenseStateProse.js:262:  * A `compound.inst` civic-facility reading …   ← a COMMENT; no reader
```
⇒ **17,361 values on each of two aliased paths, 100 % normalised-equal, 0 readers.**
**NON_CASCADED, `kind: 'frozen-stamp'`** — rewriting the names while the booleans stay stamped
would leave the array no longer justifying the flags it produced, inside an owner-gated freeze.

**The `NPC_HOMES` value pinned for the harness shim:**
```
$ git grep -n "const NPC_HOMES" -- src/domain/factionRename.js
  src/domain/factionRename.js:168:const NPC_HOMES = Object.freeze(['npcs[]', 'factions[].members[]']);
```

---

## §6 · ⛔ THE FACTION-HANDLE PIN — version 2's "88" refuted and the rule proved by execution

```
THIEVES: {"npcHome":488,"memberHome":488,"rowsWith":327,"asInstitution":0,
          "chapterRows":156,"chapterRenameRows":156,"untouchedAfterChapterRename":156}
$ git grep -n "Thieves' guild" -- src/data/institutionalCatalog.js
  1998:      "Thieves' guild chapter": {
  2435:      "Thieves' guild (powerful)": {
$ git grep -n "Thieves' Guild" -- src/generators
  src/generators/npcGenerator.js:1337:            ? "Thieves' Guild"
  src/generators/power/rulingStructure.js:671:      faction: "Thieves' Guild",
```

- **There is no catalogue institution named `"Thieves' guild"`** — version 2's sentence
  ("beside the catalogue institution `Thieves' guild`") names a record that does not exist.
- **The figure is 488 per home / 976 total / 327 of 525 rows**, not 88.
- **0 of 525 rows carry the literal as an institution name.**
- ⭐ **On all 156 rows that hold a `Thieves' guild chapter` institution, renaming it through the
  candidate cascade leaves the count of `"Thieves' Guild"` handles EXACTLY unchanged — 156 of 156.**
  A case-folded match on `secondaryAffiliation` would have rewritten a faction handle on an
  institution rename. **A6(v) is CONFIRMED by execution.**

---

## §7 · FIX-D5, PRICED — the sentinel vocabulary's live/dark split

```
SENTINELS: {"(arcane underground)":246,"(smuggling)":173,"(covert)":2} vocab 12 rows 260
```
**3 live of 12 spellings (421 values on 260 of 525 rows); 9 dark over the whole golden corpus.**

```
$ node tools/efflines3.mjs …/candidate-v3/institutionRename.js
    raw 263  EFFECTIVE 215                          ← WITH the vocabulary
$ node tools/efflines3.mjs …/candidate-v3/_noSentinel.js
    raw 257  EFFECTIVE 210                          ← the same leaf with it removed
$ esbuild --minify < institutionRename.js | wc -c     10173
$ esbuild --minify < _noSentinel.js        | wc -c      9907
```
⇒ **PRICE: +5 effective lines, +266 minified bytes.** Chair question 4.

---

## §8 · Placement, re-measured two ways at the tip

```
$ node tools/placement3.mjs
METHOD A — vite.config.js EAGER_FIRST_PAINT_MODULES: 268 modules
  control src/store/settlementSlice.js eager? true
  src/domain/factionRename.js eager? false
  src/domain/clone.js eager? true
METHOD B — generation worker (static only): 220 modules        (static+dynamic: 228)
  src/domain/factionRename.js: absent
  src/domain/clone.js: ⛔ IN CLOSURE
  src/lib/narrativeMutations.js: ⛔ IN CLOSURE
  src/generators/safetyProfile.js: ⛔ IN CLOSURE
  src/generators/computeActiveChains.js: ⛔ IN CLOSURE
  src/generators/priorityHelpers.js: ⛔ IN CLOSURE
ENGINE CHUNK RULE — a module lands in `engine` iff its id contains /src/generators/:
  src/generators/safetyProfile.js: IN engine
  src/generators/computeActiveChains.js: IN engine
  src/generators/priorityHelpers.js: IN engine
```
⭐ **NEW IN VERSION 3:** the three producers version 3 adds to `requiredSymbols` are **all in the
zero-slack worker closure AND the lazy `engine` chunk**. The packet imports none of them and edits
none of them; the rows exist so that a later "fix the label at the producer" (FIX-D2/FIX-D3
territory) is visibly a build with a worker re-mint, not a domain edit.

```
$ <edge-shared metas>  total inputs across the five committed metas: 307
                       0 hits for factionRename / clone.js / safetyProfile / computeActiveChains / priorityHelpers
```

---

## §9 · Collision, against the live registered manifest

```
$ node -e "…docs/implementation/PACKET_MANIFEST.json…"
entries 190
NO COLLISION on any of the nine paths
```
(the nine: the four CREATE targets, `src/domain/factionRename.js`, `src/domain/clone.js`, and the
three producers.) ⚠ Registered entries only; the kit's DRAFTs are the chair's check at placement.

---

## §10 · `requiredSymbols` — each proven by its own `grep -cF`

```
src/domain/clone.js                    export function deepClone                   -> 1
src/domain/factionRename.js            const NPC_HOMES                             -> 1
src/domain/factionRename.js            export const FACTION_RENAME_SURFACES        -> 1
src/domain/townMap/anchors.js          export function anchorForInstitution        -> 1
src/generators/factionRoles.js         linkedInstitutionIds                        -> 4
src/generators/safetyProfile.js        CRIMINAL_INST_LABELS                        -> 2
src/generators/computeActiveChains.js  export function deriveInstitutionalServices -> 1
src/generators/priorityHelpers.js      export const getInstFlags                   -> 1
```

**THE POST-EDIT SIMULATION.** The validator asserts a required symbol with a plain substring check:

```
$ grep -n "source.includes(row.symbol)" scripts/implementation-packets.mjs
  802:      if (!source.includes(row.symbol)) {
```
The packet's only MODIFY turns `const NPC_HOMES` into `export const NPC_HOMES`, and the pinned text
survives as a substring. ⇒ **every one of the eight rows is PRESENT after the build; NO
`retiredSymbols` row is owed anywhere; no other packet's rows need discharging** (§9).

---

## §11 · The registration ledger, each row executed

```
$ node -e "NAME_PATTERN test"            institutionRename.test.js            false
                                         institutionRemoval.test.js           false
                                         institutionRenameContract.test.js    true    ← the control
                                         institutionRenameCensus.test.js      true    ← the control
$ <tests/lint/mutationCoverage.shared.mjs:36-45>  ENFORCER_DIRS = [tests/lint, tests/design,
    tests/docs, tests/data, tests/copy, tests/security, tests/edgeFunctions, tests/generators]
    → tests/domain is NOT among them                                  ⇒ MUTATION-COVERAGE NOT OWED

$ <docs/content/wiring-census.json>  stamp.files: 7, all under src/domain/display/stateProse/
    → src/domain/factionRename.js is NOT stamped                      ⇒ WIRING CENSUS NOT OWED

$ for b in tests/lint/.*-baseline.json; do grep -cF 'src/domain/factionRename.js' $b; done
    14 files, every one → 0     ⚠ version 2 said "sixteen"            ⇒ LINE-ADDRESSED NOT OWED
$ git grep -n "src/domain/factionRename.js:[0-9]" -- src docs/content tests
    (no output)                                                        ⇒ NO CITATION BY LINE

$ <tests/lint/sovereigntyLightingContract.walker.test.js>
  :602  const parked   = TEST_FILES.filter(({src}) => parkReasonsFor(src).length > 0);
  :603  const credited = TEST_FILES.filter(({src}) => parkReasonsFor(src).length === 0);
  :604  const titles      = credited.reduce((s,{src}) => s + liveTitlesIn(src).length, 0);
  :605  const suiteTitles = credited.reduce((s,{src}) => s + liveSuiteTitlesIn(src).length, 0);
  :1478 // A CREDITED SUITE'S TITLE IS NOT EVIDENCE — it goes to `suiteTitles`
    ⇒ LIGHTING DELTA: +2 files / +0 parked / +2 credited / +10 titles / +2 suiteTitles
    ⛔ NO ABSOLUTE TUPLE IS QUOTED ANYWHERE IN THE PACKET.

$ for lit in institutionRename institutionRemoval INSTITUTION_RENAME_SURFACES applyInstitutionRename \
      chain-lost-its-last-processor chain-label-names-a-removed-house SERVICE_PROVENANCE_SENTINELS; do
      git grep -c -F -- "$lit" -- src tests; done
    every one → 0 files
$ git grep -n -F -- "orphaned:" -- src tests
  tests/domain/institutionStatusLifecycle.test.js:10: *  was hand-orphaned: the before is dirty …
  tests/domain/razingWitnessWr8.test.js:185:          // …and no verdict is orphaned: every judgment band …
    ⇒ 2 occurrences, BOTH comment prose, NO code key.  ⚠ version 2 said "entirely absent".
```

---

## §12 · The budget, with the counter's control

```
$ node tools/efflines3.mjs …
CONTROL — scripts/.size-baseline.json has 7 entries; checking the first 6 against this counter:
  src/domain/explanation.js: baseline 827  counted 827  EXACT
  src/domain/worldPulse/applyWorldPulse.js: baseline 907  counted 907  EXACT
  src/domain/worldPulse/pulseKernel.js: baseline 1581  counted 1581  EXACT
  src/domain/worldPulse/roadsKernel.js: baseline 838  counted 838  EXACT
  src/domain/worldPulse/warTermination.js: baseline 818  counted 818  EXACT
  src/generators/npcGenerator.js: baseline 1345  counted 1345  EXACT
  CONTROL RESULT: 6/6 exact
  src/domain/factionRename.js baseline entry: NONE

src/domain/factionRename.js:            raw 960  EFFECTIVE 388     (headroom 412 of 800)
candidate-v3/institutionRename.js:      raw 263  EFFECTIVE 215     ✅ of 250
candidate-v3/institutionRemoval.js:     raw  88  EFFECTIVE  73     ✅ of 250
candidate-v2/institutionRename.js:      raw 266  EFFECTIVE 219     ← reproduces version 2's figure

$ esbuild --version                     0.28.1
$ esbuild --minify < institutionRename.js  | wc -c    10173
$ esbuild --minify < institutionRemoval.js | wc -c     2624
```
⇒ **215 + 73 + 1 = 289 of 400; 10,173 + 2,624 = 12,797 B minified.**

---

## §13 · The manifest, proved well-formed and set-equal with the packet's §7 table

```
$ sed -n '30,36p' scripts/implementation-packets.mjs
export const PACKET_ACTIONS = Object.freeze([ 'CREATE', 'DOC', 'MODIFY', 'REGISTER', 'TEST', ]);

$ node -e "…parse both, sort both, compare…"
JSON changeManifest rows:            §7 TABLE rows parsed from the packet:
  CREATE src/domain/institutionRemoval.js        CREATE src/domain/institutionRemoval.js
  CREATE src/domain/institutionRename.js         CREATE src/domain/institutionRename.js
  CREATE tests/domain/institutionRemoval.test.js CREATE tests/domain/institutionRemoval.test.js
  CREATE tests/domain/institutionRename.test.js  CREATE tests/domain/institutionRename.test.js
  MODIFY src/domain/factionRename.js             MODIFY src/domain/factionRename.js
SET-EQUAL: true
every action in PACKET_ACTIONS: true
acceptanceCases: 8 all {id,case} objects: true   ids: A1,A2,A3,A4,A5,A6,A7,A8
requiredSymbols: 8
checks: 10 | generator among checks: false
last check: ["npm","run","typecheck:domain:strict"]
```
⇒ **no generator is among `checks`, so brief step 14a has nothing to order last** — recorded as a
measurement, not an omission.

---

## §14 · The tree, at the end

```
$ git -C $SP/read-tip-32602dc60 rev-parse HEAD
32602dc607b7423838249cf57d73baf08feb047d
$ git -C $SP/read-tip-32602dc60 status --short
                                              ← EMPTY
```

**WHAT WAS NOT EXECUTED, AND WHY.** `scripts/check-observed-shape-readers.mjs` and
`scripts/check-writer-reach.mjs` were **read, not run** — they are tree scripts and outside this
lane's permission. Both verdicts in §7 of the packet are **PLAUSIBLE**, both commands are in
`checks`, and §12 of the packet makes executing them the build lane's named job. No eslint, no
vitest, no npm script, no build was run by this lane.
