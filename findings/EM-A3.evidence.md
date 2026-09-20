# EM-A3 — EXECUTED EVIDENCE

Every fact the packet calls VERIFIED has a command here with its real output. All commands were run with `cd $SP/consist` where
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`.
**Nothing was written, staged or committed in the consist or the ledger. No vitest, no eslint, no `npm run check`, and — deliberately — NEITHER register script in any mode, read-only or otherwise.**

The base, the clean-tree proof and the disclosed mid-compile branch moves are recorded once, in `EM-A1.evidence.md` **E-0** and **E-29**, and bind here identically: the verified base is `d31af2ceebf643818201b2e2ab4a556765d2fc7c`, and **no path this packet measures moved in either window** (the six that moved are `.gitignore`, the three editor docs, the new `EM-PREAMBLE.md` and `tests/build/generationWorkerLazy.test.js` — a MODIFY, not an ADD, so the lighting census's `files` figure still holds).

---

## F-1 · BOTH REGISTER BASELINES EXIST AT THEIR REAL PATHS

```
$ ls -la scripts/check-writer-reach.mjs scripts/check-observed-shape-readers.mjs \
        scripts/.writer-reach-baseline.json scripts/.observed-shape-readers-baseline.json
-rw-r--r--  1 cstokes  wheel  1520907  scripts/.observed-shape-readers-baseline.json
-rw-r--r--  1 cstokes  wheel   717300  scripts/.writer-reach-baseline.json
-rw-r--r--  1 cstokes  wheel   182617  scripts/check-observed-shape-readers.mjs
-rw-r--r--  1 cstokes  wheel    22867  scripts/check-writer-reach.mjs
```

The charter's EM-A3 cell says *"paths pre-proved"*. These are the paths.

## F-2 · REGISTER A — ITS KEYS, ITS POPULATION, AND ⛔ ITS STOP SET

```
$ node -e 'const b=JSON.parse(require("fs").readFileSync("scripts/.writer-reach-baseline.json","utf8")); …'
ALL KEYS: _doc, schema, frozenAtSha, charter, minRows, corpusMeta, shapesDigest, detectorDigest,
          verdictDigest, surfaceRoots, webDisplayDirs, stopSet, countingClasses, reportOnlyClasses,
          closureSizes, population, scanStats, registerDigest, pendingSurfaceCeiling,
          reviewableDarkCount, darkUnregistered, surfaceReach, rebankHistory

_doc[0]  : WRWALKER — the writer-with-no-reader register (HORIZON §7, §1.10).
schema   : 1
frozenAtSha : "5123689dff88b48a9948ba4160736aa87ba2d3c3"
minRows  : 40
surfaceReach identities n= 6537
darkUnregistered n= 1290 | minRows 40 | pendingSurfaceCeiling 3 | reviewableDarkCount 495
population   : {"judged":6537,"lit":572,"litName":4671,"dark":1294,"thinKeys":9144,"thinShapes":962,"knownShapes":337}
scanStats    : {"files":1633,"sites":38877,"propRead":36809,"elemRead":0,"destructure":2054,"inOp":14,
                "rGrades":5981,"nGrades":886152,"resolvedReceivers":6747}
closureSizes : {"web-display":725,"web-transitive":907,"dossier-pdf":418,"campaign-pdf":75,
                "world-book":92,"foundry":328,"json-export":8,"news":29}

⛔ stopSet          : ["src/generators/","src/store/","src/workers/","src/lib/instantWorld/"]
   webDisplayDirs   : ["src/components/","src/domain/display/","src/pdf/"]
   countingClasses  : ["web-display","dossier-pdf","campaign-pdf","world-book","foundry","news"]
   reportOnlyClasses: ["web-transitive","json-export"]
   surfaceRoots     : {"web":["src/main.jsx"],
                       "dossier-pdf":["src/pdf/SettlementPDF.jsx","src/utils/generateSettlementPDF.js","src/utils/pdfRender.worker.js"],
                       "campaign-pdf":["src/utils/generateCampaignPDF.js"],
                       "world-book":["src/utils/generateWorldBook.js"],
                       "foundry":["src/foundry/generateFoundryModule.js","src/foundry/journalPages.js"],
                       "json-export":["src/lib/worldExport.js"]}

$ node -e '… console.log("has per-file readers map?", Object.keys(b).includes("readers"));'
writer-reach has per-file readers map? false
```

**Two facts, both load-bearing for §11 BLOCK-A.** `src/generators/` is in `stopSet`, and there is no `readers` key — the artifact carries per-surface-CLASS grades only.

## F-3 · THE SCANNER'S OWN LAW — why the stop set and the grades mean what they mean

```
$ sed -n '107,120p' scripts/lib/writer-reach-scan.mjs
/**
 * THE STOP SET — the engine boundary every closure halts at. Load-bearing at the
 * FILE level (Car 0 control 3: the same read planted at a `src/generators/` path
 * lights nothing). WORKER's core and lane body are STOP by construction (§1.12),
 * so neither can ever be credited or convicted.
 *
 * ⚠ NOT `src/domain/worldPulse/**`: display modules import pulse leaves for
 * constants and read models, and a STOP inside domain would mint false DARKs by
 * the hundred. The cost that judgment priced is now `web-transitive`'s REPORTED
 * figure rather than a leak into the counting class.
 */
export const SURFACE_CLOSURE_STOP = Object.freeze([
  'src/generators/', 'src/store/', 'src/workers/', 'src/lib/instantWorld/',
]);

$ sed -n '79,91p' scripts/lib/writer-reach-scan.mjs
/**
 * Classes COMPUTED and REPORTED but never counted toward LIT.
 * `web-transitive` — reachable only through files the web root drags in, never
 * through a component, a display read model or the PDF (⟦G0-2⟧).
 * `json-export` — the export CONTROL is not wired …
 */
export const REPORT_ONLY_CLASSES = Object.freeze(['web-transitive', 'json-export']);

/** The dirs that make a web-closure file a DISPLAY file — the counting half. */
export const WEB_DISPLAY_DIRS = Object.freeze(['src/components/', 'src/domain/display/', 'src/pdf/']);
```

The `readers` map is computed and then **not persisted**:

```
$ sed -n '470,484p' scripts/lib/writer-reach-scan.mjs
      let verdict = 'DARK';
      if (counting.some((cls) => reach[cls] === 'R')) verdict = 'LIT';
      else if (counting.some((cls) => reach[cls] === 'N')) verdict = 'LIT-NAME';
      verdicts.set(identity, {
        identity, key, shape, rows: record.rows, verdict, reach,
        readers: { R: [...entry.R].sort(), N: [...entry.N].sort() },
      });
```

And the grade grammar is closed at three values:

```
$ sed -n '490,501p' scripts/lib/writer-reach-scan.mjs
export function parseReach(text) {
  …
    if (!['R', 'N', 'A'].includes(grade)) throw new Error(`writer-reach: unknown reach grade: ${grade}`);
```

⭐ **The substitute the chair may authorize is real and is named so the ruling is informed.** `scanSurfaceReads` takes an arbitrary `files` list and returns the per-file map:

```
$ sed -n '346,356p' scripts/lib/writer-reach-scan.mjs
/**
 * Record every READ SITE of a written key across the in-closure files, over OSR's
 * resolver unchanged. Four site kinds: property access, string element access,
 * object binding patterns …, and `'k' in x`. …
 * @returns {{ reads: Map<string, {R: Set<string>, N: Set<string>}>, stats: object }}
 */
export function scanSurfaceReads({ index, corpus, files, root, minRows = MIN_ROWS, keysToShapes, relOverride = null }) {
```

It is exported, so a census COULD call it over a declared scope — at the cost of `buildObservedCorpus` inside a lint test. That is option (b) in §11 BLOCK-A, and it is the chair's to take.

## F-4 · ⛔ THE MEASURED REACH OF EVERY CANDIDATE FIELD — none is display-only

```
$ node -e '… const sr=b.surfaceReach; for (const shape of ["institutions","npcs","factions"]) … '
### shape=institutions  identities=41
    category        => campaign-pdf=R dossier-pdf=R foundry=R json-export=N web-display=R web-transitive=R world-book=R
    desc            => campaign-pdf=N dossier-pdf=R foundry=R web-display=R web-transitive=N world-book=N
    name            => campaign-pdf=R dossier-pdf=R foundry=R json-export=N news=N web-display=R web-transitive=R world-book=R
    factionSource   => campaign-pdf=R dossier-pdf=R foundry=R web-transitive=R world-book=R
    tags            => campaign-pdf=R dossier-pdf=R foundry=R news=N web-display=R web-transitive=R world-book=R
    …
### shape=npcs  identities=108
    name            => campaign-pdf=R dossier-pdf=R foundry=R json-export=A news=R web-display=R web-transitive=R world-book=R
    role            => campaign-pdf=R dossier-pdf=R foundry=R json-export=A news=N web-display=R web-transitive=R world-book=R
    category        => campaign-pdf=R dossier-pdf=R foundry=R json-export=A web-display=R web-transitive=R world-book=R
    title           => campaign-pdf=R dossier-pdf=R foundry=R json-export=A web-display=R web-transitive=R world-book=R
    factionAffiliation => campaign-pdf=R dossier-pdf=R foundry=R json-export=A web-display=R web-transitive=R world-book=R
    …
### shape=factions  identities=46
    faction         => campaign-pdf=R dossier-pdf=R foundry=R news=R web-display=R web-transitive=R world-book=R
    name            => campaign-pdf=R dossier-pdf=R foundry=R json-export=N news=R web-display=R web-transitive=R world-book=R
    category        => campaign-pdf=R dossier-pdf=R foundry=R json-export=N web-display=R web-transitive=R world-book=R
    power           => campaign-pdf=R dossier-pdf=R foundry=R web-display=R web-transitive=R world-book=R
    desc            => campaign-pdf=R dossier-pdf=R foundry=R web-display=R web-transitive=R world-book=R
    …

$ node -e 'const dark=new Set(b.darkUnregistered.map(d=>d.identity)); …'
DARK? name on institutions           => false
DARK? name on npcs                   => false
DARK? name on factions               => false
DARK? faction on factions            => false
DARK? category on institutions       => false
DARK? category on factions           => false
DARK? role on npcs                   => false
DARK? power on factions              => false
```

Every candidate carries `web-transitive=R` — a grounded read by a web-closure file **outside** `src/components/`, `src/domain/display/` and `src/pdf/`. **§11 BLOCK-C is this table.**

⚠ Note the shape of the absence too: `institutions[].class`, `institutions[].standing`, `institutions[].note`, `npcs[].disposition`, `npcs[].note`, `factions[].archetype` and `factions[].stance` appear in **none** of the three lists — they are not in the corpus at all, because no generator writes them (`EM-A1.evidence.md` E-7).

## F-5 · REGISTER B — ITS KEYS AND ITS POPULATION

```
$ node -e 'const b=JSON.parse(require("fs").readFileSync("scripts/.observed-shape-readers-baseline.json","utf8")); …'
ALL KEYS + types:
  _doc: array n=61          corpusMeta: object     digests: object
  frozen: "2026-09-19"      frozenAtSha: "31ab5d18bdd44ba0691c2e16f3ae8f3cfef36eb1"
  identities: 1390          inventory: object keys n=387
  manifests: object         migrationReview: object keys n=24
  minRows: number           originMinRows: number
  rowTags: object keys n=35 scanStats: object      scannerProvenance: object
  schema: number            sentinel: object       total: number

_doc[0] : READER-WITH-NO-WRITER INVENTORY — per-file HEURISTIC-LEAF identities and governed ceilings.

inventory sample keys: src/components/BuyThisDossier.jsx | src/components/OutputContainer.jsx |
                       src/components/SettlementsPanel.jsx | src/components/ShareToGallery.jsx |
                       src/components/compendium/CatalogTabs.jsx
inventory[first]     : {"mapEdits on settlement":1}
```

The value of an inventory entry is `{ "<key> on <shape>": count }` — a per-file map, but only over the reader-with-no-writer population.

## F-6 · ⛔ REGISTER B COVERS THE SUBJECT IN EXACTLY ONE ROW

```
$ node -e '… const byRoot={}; for (const f of files) { const r=f.split("/").slice(0,2).join("/"); byRoot[r]=(byRoot[r]||0)+1; } …'
observed-shape inventory files n= 387
inventory by root: {"src/components":50,"src/data":2,"src/domain":256,"src/foundry":1,
                    "src/generators":26,"src/hooks":2,"src/lib":19,"src/pdf":12,
                    "src/store":17,"src/utils":2}

$ node -e '… for (const f of files) for (const id of Object.keys(inv[f]))
            if (/(^name|^role|^category|^faction|^power) on (institutions|npcs|factions)$/.test(id)) …'
observed-shape rows matching the three card shapes: 1
   src/pdf/lib/viewModel.js  ::  faction on npcs = 3
```

The inventory DOES reach into `src/generators` (26 files), but only for keys **nothing writes**. A declared editable field is written by the generator, so it is out of this population by construction — and the single matching row confirms it empirically: one row, in a PDF view model, for a key no generator writes on `npcs`.

## F-7 · THE VALUE-JOIN HALF IS FULLY EXECUTABLE — the four declared lists, by live import

```
$ node -e 'import("./src/domain/factionRename.js").then(m => { … })'
EXPORT KEYS: FACTION_RENAME_SURFACES, NON_CASCADED_SURFACES, NPC_NON_CASCADED_SURFACES,
             NPC_RENAME_SURFACES, applyFactionRenameToPartner, applyFactionRenameToSettlement,
             applyNpcRenameToPartner, applyNpcRenameToSettlement, factionRenameChanges,
             npcRenameChanges, renameInterSettlementReference, resolveFactionForRename

FACTION_RENAME_SURFACES count: 32
  key   powerStructure.factions[].faction          key   powerStructure.factions[].name
  key   powerStructure.governingName               key   powerStructure.government
  key   powerStructure.factionRelationships[].pair[]
  key   npcs[].factionAffiliation                  key   npcs[].secondaryAffiliation
  key   npcs[].linkedFactionIds[]                  prose npcs[].secret.what
  prose npcs[].secret.stakes                       prose npcs[].role
  prose npcs[].factionGoal
  key   factions[].members[].factionAffiliation    key   factions[].members[].secondaryAffiliation
  key   factions[].members[].linkedFactionIds[]    prose factions[].members[].secret.what
  prose factions[].members[].secret.stakes         prose factions[].members[].role
  prose factions[].members[].factionGoal
  key   institutions[].factionSource               key   factions[].name
  key   factions[].powerFactionName
  prose relationships[].npc1Role                   prose relationships[].npc2Role
  key   interSettlementRelationships[].factionName key   interSettlementRelationships[].partnerFactionName
  prose powerStructure.factions[].desc             prose powerStructure.factionRelationships[].narrative
  prose powerStructure.factionRelationships[].dmNote
  prose powerStructure.recentConflict              prose history.currentTensions[].factions[]
  prose pressureSentence

NPC_RENAME_SURFACES count: 5
  key   npcs[].name                                key   factions[].members[].name
  key   relationships[].npc1Name                   key   relationships[].npc2Name
  key   interSettlementRelationships[].npcName

NON_CASCADED_SURFACES count: 16
NPC_NON_CASCADED_SURFACES count: 13
```

The `kind` split is the module's own, and its docblock states why it is load-bearing:

```
$ sed -n '231,240p' src/domain/factionRename.js
 * The enumerated cascade denominator. Every entry is a stored field that holds
 * a faction DISPLAY NAME (or prose naming one) on a saved settlement. `kind`
 * separates exact-key rewrites from whole-word prose substitution, because the
 * two carry different risks: a key rewrite must match exactly or it corrupts a
 * join, while prose substitution must respect word boundaries or it mangles an
 * unrelated word.
```

⛔ **No institution NAME appears in either denominator.** The one institution entry, `institutions[].factionSource`, holds a FACTION name. See `EM-A1.evidence.md` E-8/E-9.

## F-8 · TEST PRECEDENTS, BY PATH AND TITLE

```
$ grep -n "describe(\|  test(" tests/domain/factionRename.test.js | head
189:describe('faction rename — the INDEPENDENT denominator', () => {
190:  test('every stored path that carries a faction name is declared, or ruled out in writing', () => {
224:  test('renaming any roster faction on any seed leaves nothing stale but the declared exemptions', () => {
251:  test('the two ledgers are disjoint and every non-cascade decision carries its reason', () => {
262:describe('faction rename — the declared surface set', () => {
275:  test('TOTALITY: a fixture holding the name at every declared surface moves all of them', () => {

$ grep -n "^describe(\|^  test(" tests/lint/habitBandsReconciliation.walker.test.js
111:describe('HB — the Bands line reconciles against the tuning seam, both directions', () => {
112:  test('the parsers see a real denominator, and every wave in the volume carries a line', () => {
167:  test('GUARD-THE-GUARD: a Bands line planted on a no-bands wave REDS', () => {
```

⭐ `factionRename.test.js`'s header states the anti-vacuity law this census inherits (the R-5 closing cure):

```
$ sed -n '10,27p' tests/domain/factionRename.test.js
 * WHY THIS FILE WAS REBUILT (R-5 closing cure). The first version of this pin
 * measured FACTION_RENAME_SURFACES against a hand-written PROBES map that named
 * the very same paths. That is a self-referential exam: the denominator was the
 * module's own answer sheet, so a stored field the module had never heard of was
 * invisible to the test BY CONSTRUCTION, and the pin reported a confident green
 * over four reader-visible surfaces that never moved.
```

## F-9 · THE LIGHTING CENSUS'S SCOPE AND REGISTER (shared with EM-A1 · E-14)

```
$ sed -n '515,518p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests'))
  .filter((p) => /\.test\.(js|jsx)$/.test(p))

$ cat tests/lint/.lighting-census-baseline.json   (figures)
  "measuredAtSha": "e5a27a1a5e83569e198ab36e0879ee70fdaefe8a",
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
```

One new TEST file moves `files` by one. No `src/` file moves it — the cause `EM-PREAMBLE.md` §P2.1 states is refuted (`EM-A1.md` §11 BLOCK-5).

## F-10 · THE MUTATION-COVERAGE OBLIGATION

```
$ sed -n '36,46p' tests/lint/mutationCoverage.shared.mjs
export const ENFORCER_DIRS = [ 'tests/lint', 'tests/design', 'tests/docs', 'tests/data',
  'tests/copy', 'tests/security', 'tests/edgeFunctions', 'tests/generators' ];

$ node -e '… scripts/mutation-coverage-manifest.json …'
top keys: _doc, uncoveredBaseline, rationales, invariants, meta
invariants total: 704 | tests/lint rows: 171
a walker row: tests/lint/dossierMountRegistry.walker.test.js
{"kind":"mutation","label":"dossier-mounts/a corpus block leaves the dark list with no mount"}
```

`tests/lint/flavorFields.census.test.js` lands inside the first enforcer dir and owes exactly one `invariants` row.

## F-11 · WHY THIS PACKET MOVES NEITHER REGISTER (the §P2.4 statement, with its measurement)

```
$ node -e '… b.surfaceRoots …'
surfaceRoots : {"web":["src/main.jsx"], "dossier-pdf":[…], "campaign-pdf":[…],
                "world-book":[…], "foundry":[…], "json-export":["src/lib/worldExport.js"]}
```

Every closure is rooted in `src/`; none walks `tests/`. A new file at `tests/lint/flavorFields.census.test.js` is therefore in no closure and can add no reader. And the census dereferences no settlement record — it reads declaration rows and two frozen JSON artifacts, and the register grades four read-site kinds over in-closure files (`scanSurfaceReads`, F-3), none of which a `JSON.parse` of a baseline in a test file can be.

The `readersProof` edit in `src/domain/edit/fieldDeclarations.js` changes only string VALUES inside a frozen table. A string value is not a property access, a string element access, a destructuring binding, or an `in` test. **Neither `--write` nor a mint is owed.**

## F-12 · EVERY `requiredSymbols` ROW EXISTS VERBATIM (`grep -cF`, each ≥ 1)

```
src/domain/factionRename.js                          export const FACTION_RENAME_SURFACES           1
src/domain/factionRename.js                          export const NPC_RENAME_SURFACES               1
src/domain/factionRename.js                          export const NON_CASCADED_SURFACES             1
src/domain/factionRename.js                          export const NPC_NON_CASCADED_SURFACES         1
scripts/check-writer-reach.mjs                       export const BASELINE_PATH                     1
scripts/lib/writer-reach-scan.mjs                    export const SURFACE_CLOSURE_STOP              1
scripts/lib/writer-reach-scan.mjs                    export const WEB_DISPLAY_DIRS                  1
scripts/lib/writer-reach-scan.mjs                    export function parseReach                     1
scripts/check-observed-shape-readers.mjs             export const EXPLAINED_WRITER_EXEMPTIONS       1
scripts/.writer-reach-baseline.json                  "stopSet"                                      1
scripts/.observed-shape-readers-baseline.json        "inventory"                                    2
tests/lint/mutationCoverage.shared.mjs               export const ENFORCER_DIRS                     1
```

⚠ `src/domain/edit/fieldDeclarations.js` is the packet's MODIFY target and is **absent at the base**, so no `requiredSymbols` row names it — `PACKET_STANDARD.md`: *"A symbol the deliverable CREATES cannot be named until it exists."* It is EM-A1's to create and EM-A1's flip to LANDED is where its symbols are named.

And every file the `checks` name exists (except the two EM-A1 creates):

```
OK      tests/lint/mutationCoverageManifest.test.js
OK      tests/lint/sovereigntyLightingContract.walker.test.js
OK      tests/lint/negativeAssertionAnchor.walker.test.js
OK      tests/domain/factionRename.test.js
ABSENT  tests/domain/editDeclarations.test.js          (EM-A1 creates it)
ABSENT  tests/lint/flavorFields.census.test.js         (this packet creates it)
```

## F-13 · THE OBSERVED-SHAPE DOOR THIS PACKET DOES NOT OPEN

```
$ grep -n 'EXPLAINED_WRITER_EXEMPTIONS' scripts/check-observed-shape-readers.mjs | head -4
446: * `EXPLAINED_WRITER_EXEMPTIONS` as an M8 admission-list entry, which is the
463: * is deleted from `EXPLAINED_WRITER_EXEMPTIONS` rather than re-pointed at some
1140:export const EXPLAINED_WRITER_EXEMPTIONS = Object.freeze([
1290:export function assertExplainedWriterExemptions(entries = EXPLAINED_WRITER_EXEMPTIONS)
```

Named as a `requiredSymbols` row so the packet preserves it, and priced at **zero** in §7: no save-time key is read at this wave. `EM-PREAMBLE.md` §P2.3 assigns that door to EM-B3 and makes the mint a chair act.

## F-14 · SIBLING NAME-VALUED DERIVATIONS FOUND AND LEFT ALONE (receipt item 2)

```
$ grep -n '^export' src/generators/power/factionCategories.js
149:export const inferFactionCategory = (factionName) => {

$ grep -n 'archetype' src/generators/factionRoles.js | head -3
  2: * generators/factionRoles.js — Faction archetype → structural NPC roles.
 13: * its archetype via name pattern, and synthesizes the implied NPCs if
179: * Map a faction to its structural-role archetype via the shared canonical detector,
```

Both read a faction's DISPLAY NAME as a fact, and both live under `src/generators/` — the directory `stopSet` excludes from every writer-reach closure (F-2, F-3). They are the clearest live instances of the reader family §11 BLOCK-A says neither register can see. **Recorded, not investigated.**

---

# ADDENDUM — THE CHAIR'S §934.44 AMENDMENT (design §14)

The amendment landed mid-lane at `3b6478fb3`, a descendant of this packet's verified base. Its provenance, the six-path window and the byte-identity argument are recorded once, in `EM-A1.evidence.md` **E-29**, and bind here identically.

## F-15 · WHAT THE AMENDMENT CHANGED FOR *THIS* PACKET — measured from the diff

```
$ git diff d31af2cee HEAD -- docs/implementation/charters/EDIT-MODE-TRAIN.md
   (the EM-A1 row and the EM-F1 row are the ONLY table rows that change)
-| **EM-A1** declarations | … the first three card types (institution, npc, faction) … |
+| **EM-A1** declarations | … every editable ROOT field of the first card types (institution, npc, faction, power seat) … `provenance: 'root'` and the field's `writer` by symbol … AND refuses a declaration whose writer reads any other world fact (design §14) |
```

**EM-A3's charter row is untouched by the amendment** — the diff shows no change to it. The census keeps its own half, exactly as the chair's message states.

```
$ git diff d31af2cee HEAD -- docs/ARCH_EDIT_MODE_AND_DECREES.md | grep '^[-+]1\.\|^[-+]2\.'
-1. `editDeclarations.walker` — every card rendering a pencil has a declaration; every `pool` field names a pool in `POOLS`.
+1. `editDeclarations.walker` — … ; every declared field is a ROOT (its named writer reads no other world fact …), and a derived field is REFUSED (§14).
```

Instrument **1** gains the root arm; instrument **2** (this packet's) is unchanged in the diff. That is the estate's own answer to "which file owns which arm", and it is the first reason recorded in §12.

## F-16 · ⛔ THE SUBJECT COLLAPSES — after §14, the `free` population is EMPTY

`EM-A1.evidence.md` E-31 through E-36 measure the writer of every field the amendment names. The result, restated here because it is THIS packet's subject:

| card | field | §14 verdict | consequence for this census |
|---|---|---|---|
| npc | `name` | **ROOT** | declarable — but it is `NPC_RENAME_SURFACES[0]` (F-7), so `free-cascade`, not `free` |
| npc | `role` | DERIVED (reads `institutions`) | dropped |
| npc | `disposition` | no such field | dropped |
| institution | `name` | DERIVED (`worldLaw.allowsInstitution`) | dropped |
| institution | `class`, `standing` | no such field | dropped |
| faction | `faction` | DERIVED (`buildGovernanceLabels` reads six world facts) | dropped |
| faction | `archetype`, `stance` | no such field | dropped |
| faction | `power` | DERIVED (`economicState.prosperity`) ⚠ contradicts §14's vetoable default | dropped |
| power seat | holder | DERIVED, and double-written | dropped |

**One field survives; it is `free-cascade`; therefore `kind: 'free'` rows: ZERO.**

```
$ node -e 'import("./src/domain/factionRename.js").then(m => {
    console.log("npcs[].name in NPC_RENAME_SURFACES?",
      m.NPC_RENAME_SURFACES.some(r => r.path === "npcs[].name" && r.kind === "key")); })'
npcs[].name in NPC_RENAME_SURFACES? true
```

So the census's property-read half has no subject at wave 1 (§11 BLOCK-D), while its value-join half stays non-vacuous: it would classify `npc.name` as JOINING and assert `free-cascade`.

## F-17 · THE ROOT ARM'S SOURCE QUESTION IS THE *SAME* MEASUREMENT AS BLOCK-A, ANSWERED THE OTHER WAY

The amendment asks EM-A1's root arm to measure *"from the writer-reach and observed-shape baselines under scripts/, plus the generator step's own reads"*. This lane measured all three (F-2, F-3, F-5, F-6):

| source | root arm (what a WRITER reads) | flavor census (who READS a field) |
|---|---|---|
| `scripts/.writer-reach-baseline.json` | **NO** — every writer is under `src/generators/`, the closure `stopSet` | **NO** — same stop set hides the derivation readers |
| `scripts/.observed-shape-readers-baseline.json` | **NO** — reader-with-no-writer population | **NO** — same |
| the generator step's own source | **YES** — decidable over the writer's parameters and body (`EM-A1.md` §6.3) | **not offered by the amendment**, but it is the same kind of cure |

⭐ **The chair's own amendment supplies the shape of BLOCK-A's cure.** It added a third source for the root arm precisely because the two baselines could not carry it. BLOCK-A reports that the flavor census has the identical problem and no third source was added for it. Naming that symmetry is this lane's whole contribution to the ruling; **choosing the cure is the chair's**, and the three options stay as §11 BLOCK-A states them.

---

# ADDENDUM 2 — THE SECOND CHAIR AMENDMENT (ODQ §934.44–§934.45), at `7aa769830`

## F-18 · J-T1 BLOB IDENTITY — this packet's own sources, executed

The full 27-path run is `EM-A1.evidence.md` **E-40**. The six paths THIS packet reads are in it, and all six are **SAME** from `d31af2cee` to `7aa769830`:

```
SAME scripts/.writer-reach-baseline.json
SAME scripts/.observed-shape-readers-baseline.json
SAME scripts/lib/writer-reach-scan.mjs
SAME scripts/check-writer-reach.mjs
SAME scripts/check-observed-shape-readers.mjs
SAME src/domain/factionRename.js
```

Neither register moved, neither scanner moved, the cascade did not move. **Every figure in §5 and §11 is valid at the base AND at the current tip.** That is the chair's item (6) discharged by blob hash.

## F-19 · WHAT THE SECOND AMENDMENT CHANGES HERE — measured, and it is two things

**(a) The arm-ownership question is RULED, not delegated.** Item 5: *"EM-A3's flavor census keeps its half … and adds nothing else; the root check is A1's walker."* The four reasons this lane had assembled independently (§12) now read as corroboration rather than as a judgment, and the packet's `Judgment calls` line returns to `NONE`.

**(b) §14 FINAL gives this instrument a SUBJECT it did not have under the first amendment.** Design §14 FINAL, fourth kind of fact:

> **Annotation** — the free notes; the DM's layer only; **the flavor census proves nothing reads them.**

That is this packet's arm named as the definition of a whole fact-kind. Under §934.44's superseded test the `free` population was empty (BLOCK-D's arithmetic); under §934.45 an annotation field is a first-class kind whose ONLY admission test is this census. **BLOCK-A therefore gets sharper, not softer:** the instrument that defines a fact-kind cannot be built from two baselines that cannot see `src/generators/`, and the chair's own item-1 cure for EM-A1's root arm (*"plus the generator step's own reads"*) has no counterpart here.

⛔ **BLOCK-A is unchanged by anything in either amendment**, and F-2/F-3/F-5/F-6 are its whole proof: the writer-reach baseline halts at `src/generators/` and persists no per-file reader map; the observed-shape baseline is the reader-with-no-writer population and carries exactly ONE row touching the three card shapes. The three options in §11 BLOCK-A stand as written, and none is chosen here.
