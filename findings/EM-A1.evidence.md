# EM-A1 — EXECUTED EVIDENCE

Every fact the packet calls VERIFIED has a command here with its real output. A fact without a command is not verified. All commands were run with `cd $SP/consist` where
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`.
**Nothing was written, staged or committed in the consist or the ledger. No vitest, no eslint, no `npm run check`, no writing script was run.**

---

## E-0 · THE BASE, AND A BASE-MOVE DISCLOSED

```
$ date
Sat Sep 19 11:01:08 EDT 2026
$ git -C $SP/consist rev-parse HEAD
d31af2ceebf643818201b2e2ab4a556765d2fc7c
$ git status --porcelain | wc -l
       0
$ git rev-parse --abbrev-ref HEAD
fixes-2026-09-18-consist
$ git log --oneline -3
d31af2cee DOC: the settlement editor's contract folds onto the build branch — the design (§12 governs), the architecture as amended, and the packet-train charter (ODQ §934.36–§934.42)
f3809a72f The wiring census is re-stamped at the consist's final tip, in its forced order
6af17820c The Outlook receipt's culture line takes the prose floor, and the two phone-floor registers re-record what the third browser pass moved
```

The base is the DOCS-ONLY child of the consist tip `f3809a72f` that ODQ §934.42 names:

```
$ git diff --name-status f3809a72f d31af2cee
A	docs/ARCH_EDIT_MODE_AND_DECREES.md
A	docs/DESIGN_EDIT_MODE_AND_DECREES.md
A	docs/implementation/charters/EDIT-MODE-TRAIN.md
```

⚠ **THE BRANCH MOVED UNDER THIS LANE MID-COMPILE, and the window is disclosed rather than absorbed.**

```
$ date
Sat Sep 19 11:11:09 EDT 2026
$ git rev-parse HEAD
34f320829656957d3cfb33ff28b1772859ca5b0a
$ git status --porcelain | head
                                        (empty — clean)
$ git log --oneline d31af2ceebf643818201b2e2ab4a556765d2fc7c..HEAD
34f320829 The preview persona's env file is development-scoped and ignored: .env.*.local
02968876b DOC: the EM family packet preamble — the settlement editor's invariants signed once (ODQ §934.36–§934.42; design §12 governs)
$ git diff --name-status d31af2ceebf643818201b2e2ab4a556765d2fc7c HEAD
M	.gitignore
A	docs/implementation/preambles/EM-PREAMBLE.md
$ git merge-base --is-ancestor d31af2ceebf643818201b2e2ab4a556765d2fc7c HEAD && echo YES
YES
```

**Two paths moved and NEITHER is a path this compile measured.** Every `src/**`, `scripts/**`, `tests/**` and `docs/implementation/{PACKET_STANDARD,PACKET_TEMPLATE,PACKET_MANIFEST}` path, and both `docs/*_EDIT_MODE_AND_DECREES.md` and the charter, are byte-identical across the window by construction of the diff above. The verified base stays `d31af2cee` as the brief fixes it, and every measurement below is valid at it. The new `EM-PREAMBLE.md` was read and is cited; its live SHA-256 at `34f320829` is `481dab280694981bd6460901b774ba3b57c9d7a95271d05bf92966e94e31b3f1` — recorded only so the chair can see which text this lane read; the packet header carries the brief's `TO BE STAMPED BY THE CHAIR` verbatim.

---

## E-1 · THE PREAMBLE EXISTS AND IS TRACKED

```
$ git ls-files docs/implementation/preambles/EM-PREAMBLE.md
docs/implementation/preambles/EM-PREAMBLE.md
$ git cat-file -e HEAD:docs/implementation/preambles/EM-PREAMBLE.md && echo "IN HEAD"
IN HEAD
$ git log --oneline -2 -- docs/implementation/preambles/EM-PREAMBLE.md
02968876b DOC: the EM family packet preamble — the settlement editor's invariants signed once (ODQ §934.36–§934.42; design §12 governs)
$ wc -l docs/implementation/preambles/EM-PREAMBLE.md
      80
```

⚠ It is **not present at the verified base `d31af2cee`** — it arrives at `02968876b`, inside the disclosed window.

## E-2 · EVERY CREATE TARGET IS ABSENT; `POOLS` AND `src/components/edit/**` DO NOT EXIST

```
$ for f in src/domain/edit/fieldDeclarations.js src/domain/edit/types.js src/domain/edit/pools.js \
    tests/domain/editDeclarations.test.js tests/lint/editDeclarations.walker.test.js \
    tests/lint/flavorFields.census.test.js docs/implementation/packets/settlement-editor; do
    [ -e "$f" ] && echo "PRESENT $f" || echo "ABSENT  $f"; done
ABSENT  src/domain/edit/fieldDeclarations.js
ABSENT  src/domain/edit/types.js
ABSENT  src/domain/edit/pools.js
ABSENT  tests/domain/editDeclarations.test.js
ABSENT  tests/lint/editDeclarations.walker.test.js
ABSENT  tests/lint/flavorFields.census.test.js
ABSENT  docs/implementation/packets/settlement-editor

$ ls -la src/domain/edit
ls: src/domain/edit: No such file or directory

$ git grep -n 'export const POOLS' -- src/
src/domain/worldPulse/peopleLedger.js:59:export const POOLS = Object.freeze(['block', 'census', 'column', 'free_unit']);

$ grep -c 'settlement-editor\|edit-mode' docs/implementation/PACKET_MANIFEST.json
0
```

The only `POOLS` in `src/` is an unrelated peopleLedger vocabulary. No EM packet is in the manifest yet.

## E-3 · THE TIER-GATED CATALOGUE EXPORTS (design §12.7)

```
$ grep -n '^export' src/generators/lookups.js
25:export const getTierOrder        = () => TIER_ORDER;
26:export const getPopulationRanges = () => POPULATION_RANGES;
67:export const institutionAvailableAtTier = (def, tier) =>
142:export const getInstitutionalCatalog = (tier) => {
162:export const getFullCatalogWithTierMeta = () => {
182:export const getInstitutionsForTier = (tier) => {
```

## E-4 · THE DISPLAY SEAM IS A SEPARATE HOME (never the pool source)

```
$ git grep -ln 'export function institutionDisplayName\|export const institutionDisplayName' -- src/
src/domain/display/institutionDisplayName.js
```

## E-5 · THE RENAME CASCADE'S FOUR DECLARED SURFACE LISTS, BY LIVE IMPORT

```
$ node -e 'import("./src/domain/factionRename.js").then(m => { … })'
EXPORT KEYS: FACTION_RENAME_SURFACES, NON_CASCADED_SURFACES, NPC_NON_CASCADED_SURFACES, NPC_RENAME_SURFACES, applyFactionRenameToPartner, applyFactionRenameToSettlement, applyNpcRenameToPartner, applyNpcRenameToSettlement, factionRenameChanges, npcRenameChanges, renameInterSettlementReference, resolveFactionForRename
FACTION_RENAME_SURFACES count: 32
  F key   powerStructure.factions[].faction
  F key   powerStructure.factions[].name
  F key   powerStructure.governingName
  F key   powerStructure.government
  F key   powerStructure.factionRelationships[].pair[]
  F key   npcs[].factionAffiliation
  F key   npcs[].secondaryAffiliation
  F key   npcs[].linkedFactionIds[]
  F prose npcs[].secret.what
  F prose npcs[].secret.stakes
  F prose npcs[].role
  F prose npcs[].factionGoal
  F key   factions[].members[].factionAffiliation
  F key   factions[].members[].secondaryAffiliation
  F key   factions[].members[].linkedFactionIds[]
  F prose factions[].members[].secret.what
  F prose factions[].members[].secret.stakes
  F prose factions[].members[].role
  F prose factions[].members[].factionGoal
  F key   institutions[].factionSource
  F key   factions[].name
  F key   factions[].powerFactionName
  F prose relationships[].npc1Role
  F prose relationships[].npc2Role
  F key   interSettlementRelationships[].factionName
  F key   interSettlementRelationships[].partnerFactionName
  F prose powerStructure.factions[].desc
  F prose powerStructure.factionRelationships[].narrative
  F prose powerStructure.factionRelationships[].dmNote
  F prose powerStructure.recentConflict
  F prose history.currentTensions[].factions[]
  F prose pressureSentence
NPC_RENAME_SURFACES count: 5
  N key   npcs[].name
  N key   factions[].members[].name
  N key   relationships[].npc1Name
  N key   relationships[].npc2Name
  N key   interSettlementRelationships[].npcName
NON_CASCADED_SURFACES count: 16
NPC_NON_CASCADED_SURFACES count: 13
```

⛔ **Not one of the 37 cascaded surfaces is an institution NAME.** The single institution entry is `institutions[].factionSource`, which holds a FACTION name.

## E-6 · THE THREE CARD RECORDS' LIVE SHAPES — ONE EXECUTED GENERATION

```
$ node -e '(async () => {
  const { generateSettlementPipeline } = await import("./src/generators/generateSettlementPipeline.js");
  const cfg = { settType: "town", culture: "germanic", terrainOverride: "plains", tradeRouteAccess: "road", monsterThreat: "civilized" };
  const s = generateSettlementPipeline(cfg, null, { seed: "em-a1-probe", customContent: {} });  … })()'
institutions n= 54
  institutions[0] KEYS: baseChance, catalogId, category, desc, name, priorityCategory, required, source, tags
  institutions[0]: {"category":"Economy","name":"Town granary","required":true,"baseChance":1,"desc":"Shared grain stores that even out the harvests and hold off famine.","tags":["essential","food"],"priorityCategory":"economy","source":"required","catalogId":"town_granary"}

npcs n= 9
  npcs[0] KEYS: activeConstraint, category, corrupt, factionAffiliation, gender, goal, id, influence, name, personality, physical, plotHooks, power, presentation, role, secondaryAffiliation, secret, settlementCondition, structuralPosition, structuralRank, title

powerStructure KEYS: conflicts, criminalCaptureState, economyInputFingerprint, factionRelationships, factions, governingName, government, powerProjectionVersion, publicLegitimacy, recentConflict, stability
powerStructure.factions n= 6
  psFactions[0] KEYS: category, desc, faction, isGoverning, modifier, power, powerLabel, rawPower
  psFactions[0]: {"faction":"Guild Council","modifier":null,"power":31,"desc":"The guilds collectively govern; economic power directly translates to political authority.","isGoverning":true,"category":"economy","rawPower":28,"powerLabel":"Strong"}

top-level factions n= 1 KEYS: dominantCategory, members, name, powerFactionCat, powerFactionName, powerFactionPower
```

The generation entry point is the one the golden master itself uses — `tests/property/generatorGoldenMaster.test.js:798`:
`const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });`

## E-7 · THE UNION OVER THREE TIERS — so an absent field cannot be a tier accident

```
$ node -e '… for (const t of ["village","town","city"]) { … union of every record's keys … }'
### tier=village
  INST union: baseChance, cascadeAdded, cascadeBoost, catalogId, category, desc, exclusiveGroup, name, priorityCategory, required, source, tags, tier
  NPC  union: activeConstraint, category, factionAffiliation, gender, goal, id, influence, institution, name, personality, physical, plotHooks, power, presentation, role, secondaryAffiliation, secret, settlementCondition, structuralPosition, structuralRank, title
  FAC  union: category, desc, faction, isGoverning, modifier, power, powerLabel, rawPower
  probes: inst.class=false inst.standing=false inst.note=false | npc.disposition=false npc.note=false | fac.archetype=false fac.stance=false fac.name=false
### tier=town
  INST union: baseChance, cascadeAdded, cascadeBoost, catalogId, category, desc, exclusiveGroup, forbiddenTradeRoutes, name, priorityCategory, required, source, tags, tier
  NPC  union: activeConstraint, category, corrupt, corruptTies, corruptionVector, factionAffiliation, factionGoal, gender, goal, id, influence, institution, name, personality, physical, plotHooks, power, presentation, role, secondaryAffiliation, secret, settlementCondition, structuralPosition, structuralRank, title
  FAC  union: category, desc, faction, isGoverning, modifier, power, powerLabel, rawPower
  probes: inst.class=false inst.standing=false inst.note=false | npc.disposition=false npc.note=false | fac.archetype=false fac.stance=false fac.name=false
### tier=city
  INST union: baseChance, cascadeAdded, cascadeBoost, catalogId, category, desc, exclusiveGroup, forbiddenTradeRoutes, magicLicense, name, priorityCategory, required, serviceKeys, source, tags, tier
  NPC  union: activeConstraint, category, corrupt, factionAffiliation, gender, goal, id, influence, institution, name, personality, physical, plotHooks, power, presentation, role, secondaryAffiliation, secret, settlementCondition, structuralPosition, structuralRank, title
  FAC  union: category, desc, faction, isGoverning, modifier, power, powerLabel, rawPower
  probes: inst.class=false inst.standing=false inst.note=false | npc.disposition=false npc.note=false | fac.archetype=false fac.stance=false fac.name=false
```

**§11 BLOCK-2 is this table.** Seven ARCH §9 slots are absent at every tier, and `powerStructure.factions[].name` is absent on a generated record (the cascade writes it only when a record already carries it — `factionRename.js` header, the FACTION-ACCESS LAW).

## E-8 · THERE IS NO INSTITUTION RENAME CASCADE

```
$ git grep -ln -i 'institutionRename\|renameInstitution' -- src/ scripts/ tests/
                                        (no output — zero files)

$ git ls-files 'src/**' | grep -i -E 'rename'
src/components/dossier/WorkbenchFactionRename.jsx
src/domain/factionRename.js
src/store/settlementRenameHelpers.js

$ grep -n '^export' src/store/settlementRenameHelpers.js
77:export function renameSettlementImpl(get, set, id, newName)
173:export function recordCanonFlavorEntryImpl(get, set, {
224:export function canonizeSavedSettlementImpl(get, set, id)
316:export async function renameFactionImpl(get, set, factionIndex, newName)
422:export async function renameNpcImpl(get, set, npcIndex, newName)
```

Three rename lanes exist — settlement, faction, NPC. **None is an institution's.** `src/domain/factionRename.js`'s own header, line 4: *"IT OWNS TWO CASCADES, NOT ONE."*

## E-9 · `institutions[].name` IS A VALUE JOIN KEY — 9 of 9

```
$ node -e '(async () => {
  const { generateSettlementPipeline } = await import("./src/generators/generateSettlementPipeline.js");
  let tot=0, joined=0;
  for (const seed of ["j1","j2","j3","j4"]) for (const t of ["village","town","city"]) {
    const s = generateSettlementPipeline({ settType:t, … }, null, { seed, customContent:{} });
    const names=new Set((s.institutions||[]).map(i=>i.name));
    for (const n of (s.npcs||[])) if (typeof n.institution==="string") { tot++; if (names.has(n.institution)) joined++; }
  } … })()'
npcs carrying .institution: 9 | of those, value EQUALS an institutions[].name: 9
   town/j1: npc."Hired blades" == an institutions[].name
   city/j1: npc."Mages' guild" == an institutions[].name
   village/j2: npc."Veteran's lodge" == an institutions[].name
   town/j2: npc."Bowyers & fletchers (guild)" == an institutions[].name
   city/j2: npc."Multiple adventurers' guilds" == an institutions[].name
   town/j3: npc."Bowyers & fletchers (guild)" == an institutions[].name
```

**§11 BLOCK-1 is E-8 plus E-9**: the institution's display name is joined on by `npcs[].institution` and no cascade in the tree rewrites it.

## E-10 · THE CARD COMPONENTS — INSTITUTION IS NAMEABLE

```
$ grep -n '^export' src/components/primitives/InstitutionCard.jsx
44:export default function InstitutionCard({ open, institution, settlement, onClose }) {
$ wc -l src/components/primitives/InstitutionCard.jsx
     171

$ grep -n '^export' src/components/new/tabs/NPCsTab.jsx | head
19:export function NPCsTab({
180:export default React.memo(NPCsTab);

$ grep -n 'function \|export ' src/components/new/tabs/power/PowerStrata.jsx | head
72:function rulerRisk(p) {
97:function groupSupportByBasis(support) {
113:export function ThePowers({ settlement, powers, factionSupport }) {
241:export function TheFactions({ settlement, roster, expandedFaction, setExpandedFaction, focusIndex, focusedRowRef }) {
343:export function TheWeb({ groups }) {
404:export function PowerStrata({ settlement, powerStructure, expandedFaction, setExpandedFaction, focusIndex, focusedRowRef }) {
```

## E-11 · WHAT OPENS THE INSTITUTION CARD

```
$ git grep -n 'InstitutionCard' -- src/ | grep -v 'primitives/InstitutionCard.jsx:'
src/components/primitives/InstitutionLink.jsx:49:import InstitutionCard from './InstitutionCard.jsx';
src/components/primitives/InstitutionLink.jsx:122:      <InstitutionCard open={open} institution={inst} settlement={settlement} onClose={() => setOpen(false)} />
src/pdf/sections/Institutions.jsx:163:function InstitutionCard({ inst, idx, entityIndex }) {
   … (plus 20 comment-only references)
```

⚠ `src/pdf/sections/Institutions.jsx:163` declares a SECOND, unexported `InstitutionCard` — a name collision between the web popover and a PDF sub-component. A walker binding by name alone would match both.

## E-12 · THE PER-NPC CARD IS MODULE-LOCAL

```
$ git grep -n 'NPCInlineCard' -- src/
src/components/OutputContainer.jsx:414:  // normalized pin keys so NPCInlineCard can do O(1) lookups and the backend
src/components/new/npcComponents.jsx:109:        <NPCInlineCard
src/components/new/npcComponents.jsx:186:function NPCInlineCard({

$ git grep -n 'export function NPCInlineCard\|export default function NPCInlineCard\|function NPCInlineCard' -- src/
src/components/new/npcComponents.jsx:186:function NPCInlineCard({

$ grep -n '^export' src/components/new/npcComponents.jsx
63:export function NPCCategoryGroup({
123:export function NPCRelCard2({rel, style={…}}) {
163:export function ConflictCard({conflict:c}) {
```

One declaration site, **no export**. `NPCCategoryGroup` renders it at `:109`.

## E-13 · THE PER-FACTION CARD IS ANONYMOUS

`src/components/new/tabs/power/PowerStrata.jsx`, inside `export function TheFactions` at `:241`:

```
      <div style={{ border: `1px solid ${SEAM}` }}>
        {roster.map((r, i) => {
          const c = FACTION_COLORS[i % FACTION_COLORS.length];
          const f = r.faction || {};
          …
```

No named per-faction component exists. The roster row is a view model `{ name, power, faction: <record> }`, not the record itself.

## E-14 · THE LIGHTING CENSUS COUNTS **TEST FILES**, NOT `src/` FILES

```
$ sed -n '515,518p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests'))
  .filter((p) => /\.test\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }))
  .sort((a, b) => a.rel.localeCompare(b.rel));

$ grep -n 'toBe(CENSUS\.' tests/lint/sovereigntyLightingContract.walker.test.js
7460:      .toBe(CENSUS.files);
7463:      .toBe(CENSUS.parked);
7465:      .toBe(CENSUS.credited);
7469:      .toBe(CENSUS.titles);
7476:      .toBe(CENSUS.suiteTitles);
7482:      .toBe(CENSUS.files);      # CENSUS.parked + CENSUS.credited

$ sed -n '602,613p' tests/lint/sovereigntyLightingContract.walker.test.js
  const parked = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length > 0);
  const credited = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length === 0);
      files: TEST_FILES.length,

$ cat tests/lint/.lighting-census-baseline.json   (figures block)
  "measuredAtSha": "e5a27a1a5e83569e198ab36e0879ee70fdaefe8a",
  "measuredBy": "the chair (Fable 5.1, session 923472dc)",
  "date": "2026-09-19",
  "note": "2026-09-19 fixes consist, lanes 35-37: seven new files (suites, seams, a shift record) — files 2638→2645; no title moved by hand",
  "files": 2645,
  "parked": 383,
  "credited": 2262,
  "titles": 25009,
  "suiteTitles": 6670

$ git merge-base --is-ancestor e5a27a1a5e83569e198ab36e0879ee70fdaefe8a HEAD && echo YES
YES
$ git rev-list --count e5a27a1a5e83569e198ab36e0879ee70fdaefe8a..HEAD
7
```

**This is §11 BLOCK-5.** `EM-PREAMBLE.md` §P2.1 says a new `src/domain/**` or `src/components/**` file moves this census. The scan is `walk(ROOT/'tests')` filtered to `*.test.js|jsx`. A `src/` file is invisible to it; a `tests/` suite file moves it by one. The register's own `note` names the same population.

## E-15 · THE MUTATION-COVERAGE OBLIGATION

```
$ sed -n '36,46p' tests/lint/mutationCoverage.shared.mjs
export const ENFORCER_DIRS = [
  'tests/lint',
  'tests/design',
  'tests/docs',
  'tests/data',
  'tests/copy',
  'tests/security',
  'tests/edgeFunctions',
  'tests/generators',
];

$ node -e 'const m=JSON.parse(require("fs").readFileSync("scripts/mutation-coverage-manifest.json","utf8")); …'
top keys: _doc, uncoveredBaseline, rationales, invariants, meta
invariants total: 704 | tests/lint rows: 171
a walker row: tests/lint/dossierMountRegistry.walker.test.js
{"kind":"mutation","label":"dossier-mounts/a corpus block leaves the dark list with no mount"}
```

## E-16 · TEST PRECEDENTS, BY PATH AND TITLE

```
$ grep -n "describe(\|  test(" tests/domain/factionRename.test.js | head -14
189:describe('faction rename — the INDEPENDENT denominator', () => {
190:  test('every stored path that carries a faction name is declared, or ruled out in writing', () => {
224:  test('renaming any roster faction on any seed leaves nothing stale but the declared exemptions', () => {
251:  test('the two ledgers are disjoint and every non-cascade decision carries its reason', () => {
262:describe('faction rename — the declared surface set', () => {
263:  test('the generator actually exercises the cascade (the fixture is not empty)', () => {
275:  test('TOTALITY: a fixture holding the name at every declared surface moves all of them', () => {
348:describe('faction rename — every exercised surface moves', () => {
404:describe('faction rename — what it must NOT touch', () => {

$ grep -n "^describe(\|^  test(" tests/lint/habitBandsReconciliation.walker.test.js
111:describe('HB — the Bands line reconciles against the tuning seam, both directions', () => {
112:  test('the parsers see a real denominator, and every wave in the volume carries a line', () => {
125:  test('the waves the seam NAMES as tuning-bearing are exactly the waves that carry bands', () => {
135:  test('the count of no-bands waves the seam states equals the count the volume carries', () => {
141:  test('every declared absence NAMES what the wave authors instead', () => {
154:  test('the Bands token STARTS its line, so decoration can never hide a declaration', () => {
167:  test('GUARD-THE-GUARD: a Bands line planted on a no-bands wave REDS', () => {
```

⭐ `factionRename.test.js`'s own header states the shape law A3 and the census both copy: *"THE DENOMINATOR IS INDEPENDENT … It never reads the module's declarations."*

## E-17 · THE WRITER-REACH REGISTER GRADES FOUR READ-SITE KINDS — none is a string literal

```
$ sed -n '400,440p' scripts/lib/writer-reach-scan.mjs   (scanSurfaceReads' visitor)
      if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) { … }
      else if (ts.isElementAccessExpression(node) && … ts.isStringLiteralLike(node.argumentExpression)) { … }
      else if (ts.isObjectBindingPattern(node)) { … }
      else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.InKeyword && …) { … }
```

Property access, string element access, destructuring, and `'k' in x`. A field NAME sitting as a string value inside a frozen declaration table is none of the four, so `fieldDeclarations.js` adds no reader and the register does not move. This is the executed answer `EM-PREAMBLE.md` §P2.4 requires the member to state.

## E-18 · THE PACKET-HEADER PARSER'S ANCHOR (why the status value stands alone on its line)

```
$ sed -n '294,313p' scripts/implementation-packets.mjs
export function parsePacketHeader(markdown) {
  const preamble = markdown.split(/^##\s/m, 1)[0];
  const heading = preamble.match(/^#\s+(.+?)\s*$/m)?.[1] ?? null;
  const statusRows = [...preamble.matchAll(
    /^\s*(?:-\s*)?\*\*Status:\*\*\s*`?([A-Za-z]+)`?\s*$/gmi,
  )];
  …
  const branchMatch = baseValue.match(
    /^`?([A-Za-z0-9][A-Za-z0-9._/-]*)`?\s+at\s+`?([0-9a-f]{40})`?$/i,
  );
```

## E-19 · EVERY `requiredSymbols` ROW EXISTS VERBATIM (`grep -cF`, each ≥ 1)

```
src/domain/factionRename.js                          export const FACTION_RENAME_SURFACES           1
src/domain/factionRename.js                          export const NPC_RENAME_SURFACES               1
src/domain/factionRename.js                          export const NON_CASCADED_SURFACES             1
src/domain/factionRename.js                          export const NPC_NON_CASCADED_SURFACES         1
src/components/primitives/InstitutionCard.jsx        export default function InstitutionCard        1
src/components/new/tabs/NPCsTab.jsx                  export function NPCsTab                        1
src/components/new/tabs/power/PowerStrata.jsx        export function TheFactions                    1
src/generators/lookups.js                            export const getInstitutionsForTier            1
src/generators/lookups.js                            export const getInstitutionalCatalog           1
tests/lint/mutationCoverage.shared.mjs               export const ENFORCER_DIRS                     1
```

And every file the `checks` name exists:

```
OK tests/lint/mutationCoverageManifest.test.js
OK tests/lint/sovereigntyLightingContract.walker.test.js
OK tests/lint/negativeAssertionAnchor.walker.test.js
OK tests/domain/factionRename.test.js
```

## E-20 · THE GOLDEN POSTURE FILES EXIST AND ARE UNTOUCHED BY THE MANIFEST

```
$ ls -la tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js
-rw-r--r--  1 cstokes  wheel  65976 tests/property/generatorGoldenMaster.test.js
-rw-r--r--  1 cstokes  wheel  38220 tests/property/dossierProseManifest.test.js
```

Neither path appears in `EM-A1.manifest.json`'s `changeManifest`. Golden posture: UNCHANGED.

## E-21 · A NOTE ON FIXTURES THAT ARE NOT SHAPE ORACLES

```
$ node -e '… sampleDossier + save-museum + legacy-saves …'
src/data/sampleDossier.json         institutions[0] KEYS: id, name, category, size, weight   (hand-authored, carries _comment)
                                    powerStructure KEYS: (empty)
tests/fixtures/save-museum/02-v2-draft-2026-06.json      hasPowerStructure: false | inst n= 0 | npcs n= 0
tests/fixtures/save-museum/03-campaign-canon-2026-07.json hasPowerStructure: false | inst n= 0 | npcs n= 0
tests/fixtures/legacy-saves/april-2026-v1.json            hasPowerStructure: false | inst n= 0 | npcs n= 0
```

Recorded so a later lane does not read a shape off one of them. Every shape figure in this packet comes from an executed pipeline generation (E-6, E-7).

---

# ADDENDUM — THE CHAIR'S §934.44 AMENDMENT (design §14, "edit at the source, never at the derivation")

The amendment arrived mid-lane. It is on the consist at `3b6478fb3`, a DESCENDANT of this packet's verified base. The base does not move (the brief fixes it); the amendment is carried into the packet as authority and every field it names is measured below.

## E-29 · THE AMENDMENT'S OWN PROVENANCE, MEASURED

```
$ date
Sat Sep 19 11:22:49 EDT 2026
$ git rev-parse HEAD
a03ebb09a17e0a96c1d6261a41257430bb7fbd32      # …and 3b6478fb3 on the next read
$ git status --porcelain
                                              (empty — clean)
$ git log --oneline d31af2ceebf643818201b2e2ab4a556765d2fc7c..HEAD
3b6478fb3 DOC: edit at the source, never at the derivation folds onto the build branch (design §14, the ARCH's declaration type, walker and card list, the charter's EM-A1 row; ODQ §934.44)
a03ebb09a DOC: the EM preamble carries the phantom consequence rule (HZ-PHANTOM, a STOP condition, the §13 citation; ODQ §934.43)
023085560 DOC: the phantom consequence rule folds onto the build branch (design §13, the ARCH's phantom/Op/tick rows, the charter's EM-F1 row; ODQ §934.43)
7a0fe5889 The generation worker's ceiling re-mints exact at 1,399,946 B, attributed per module to the sacred-house layout derivation (§934.19 addendum; vetoable)
34f320829 The preview persona's env file is development-scoped and ignored: .env.*.local
02968876b DOC: the EM family packet preamble — the settlement editor's invariants signed once (ODQ §934.36–§934.42; design §12 governs)
$ git diff --name-status d31af2ceebf643818201b2e2ab4a556765d2fc7c HEAD
M	.gitignore
M	docs/ARCH_EDIT_MODE_AND_DECREES.md
M	docs/DESIGN_EDIT_MODE_AND_DECREES.md
M	docs/implementation/charters/EDIT-MODE-TRAIN.md
A	docs/implementation/preambles/EM-PREAMBLE.md
M	tests/build/generationWorkerLazy.test.js
$ git merge-base --is-ancestor d31af2ceebf643818201b2e2ab4a556765d2fc7c HEAD && echo YES
YES
```

⭐ **Six paths moved; FIVE are docs and the sixth is `tests/build/generationWorkerLazy.test.js`, a worker-ceiling suite this packet neither names nor measures.** Every `src/**` and `scripts/**` path this compile measured is byte-identical across the window by construction of that diff, so every measurement below is valid at the verified base.

⚠ **One consequence the chair should note:** `tests/build/generationWorkerLazy.test.js` was MODIFIED, not added, so the lighting census's `files` figure (2645) still holds. Had it been an ADD, §7's predicted tuple would already be stale.

## E-30 · THE AMENDED AUTHORITY, READ

```
$ git diff d31af2cee HEAD -- docs/ARCH_EDIT_MODE_AND_DECREES.md
 /** @typedef {{ card: string, field: string, kind: FieldKind, pool?: string, label: string,
- *   group: string, maxLength?: number, readersProof?: string }} FieldDeclaration */
+ *   group: string, maxLength?: number, readersProof?: string,
+ *   provenance: 'root', writer: string }} FieldDeclaration */
+// `provenance` is always 'root' by construction (§14): the declaration census admits a field only
+// when its `writer` (a generator step, by symbol) reads nothing but the seed and the dials; the
+// walker refuses a derived field, so a declaration for one cannot exist.
…
-1. `editDeclarations.walker` — every card rendering a pencil has a declaration; every `pool` field names a pool in `POOLS`.
+1. `editDeclarations.walker` — every card rendering a pencil has a declaration; every `pool` field names a pool in `POOLS`; every declared field is a ROOT (its named writer reads no other world fact — measured from the writer-reach and observed-shape data and the generators' reads), and a derived field is REFUSED (§14).
…
-- **Card types with declarations:** … system state cards (typed states only: security, food security, order).
+- **Card types with declarations (ROOT facts only, §14):** … power seat (holder pool over factions/npcs). The system-state cards are STRUCK (derived).
```

Design §14's ROOT definition, verbatim from `docs/DESIGN_EDIT_MODE_AND_DECREES.md` at `3b6478fb3`:

> **Root** — a fact a generator step writes from the seed and the dials, **whose writer reads no other world fact**

## E-31 · ⭐ `npc.name` — THE ONE ROOT

```
$ grep -n "pickFirst" src/generators/npcGenerator.js
106:  const fullName = pickFirst(culture, gender, true, tier);
225:// ─── NPC name helpers (pickFirst, pickCulturalTitle, filterByGuild) ───
240:const pickFirst = (culture = 'germanic', gender = 'male', withSurname = true, tier = 'town') => {

$ sed -n '240p' src/generators/npcGenerator.js
const pickFirst = (culture = 'germanic', gender = 'male', withSurname = true, tier = 'town') => {

$ grep -c 'const pickFirst' src/generators/npcGenerator.js
1
```

Formal parameters: `culture` (a DIAL), `gender` (the step's own seeded roll — `const gender = _rng() > 0.5 ? 'male' : 'female';` at `:105`), `withSurname` (a literal), `tier` (a DIAL). **No member of `WORLD_FACT_PARAMS`. ROOT.** And the record's assignment is `name: fullName` (`:131`).

⚠ `pickFirst` is **module-local — no `export`** — which is why §6.2 resolves `writer` against source rather than exports. One declaration site, so "exactly once" is satisfiable.

## E-32 · `npc.role` — DERIVED (the amendment's own flagged example, confirmed)

```
$ sed -n '1440,1448p' src/generators/npcGenerator.js
export const generateNPCs = (
  settlement,
  culture = 'germanic',
  config = {},
  generationContext = null,
  massTarget = null,
) => {
  const { tier, institutions } = settlement;
  const worldLaw = resolveGenerationWorldLaw(generationContext, config);
  const weights = { ...computeNPCWeights(config, institutions), tradeRouteAccess: config?.tradeRouteAccess || 'road' };

$ sed -n '1471,1472p' src/generators/npcGenerator.js
  const candidates = getUpgradeOpportunities(institutions, tier, weights)
    .filter(worldLaw.allowsRole);

$ sed -n '1492,1502p' src/generators/npcGenerator.js
  if (powerFactionCats.has('crafts') || powerFactionCats.has('economy')) {
    const existingRoles = new Set(candidates.map(c => c.role));
    const hasGuild = institutions.some(isCommerceGuild);
    const waterRoute = ['port', 'river', 'coastal'].includes(config?.tradeRouteAccess);
    const hasPort =
      waterRoute ||
      institutions.some(
        i =>
          /port|harbou?r/.test(nativeSemanticName(i).toLowerCase()),
      );

$ git grep -n 'export const getUpgradeOpportunities' -- src/
src/generators/economy/upgradeOpportunities.js:13:export const getUpgradeOpportunities = (institutions, tier, config = {}) => {
```

The role's candidate set is built from **`settlement.institutions`** and from **`powerFactionCats`** (the faction roster), plus `config.stressTypes`. `settlement`, `institutions` and `weights` are all in `WORLD_FACT_PARAMS`. **DERIVED — dropped, per the amendment's procedure.**

## E-33 · `institution.name` — DERIVED

```
$ sed -n '511,520p' src/generators/steps/assembleInstitutions.js
    const catInsts = resolvedCategory ? fullCatalogAllTiers[resolvedCategory] : null;
    if (!catInsts || !catInsts[instName]) return;
    const inst = catInsts[instName];
    if (!worldLaw.allowsInstitution({
      category: resolvedCategory,
      name: instName,
      ...inst,
      source: 'forced',
      forcedByToggle: true,
    })) return;
    const isInTier = !!((catalogForTier[resolvedCategory] || {})[instName]);
```

The name that reaches `institutions[].name` is a catalogue key admitted by `worldLaw.allowsInstitution`, gated on `catalogForTier` and the probability machinery. `worldLaw` is in `WORLD_FACT_READS`. **DERIVED — dropped.**

## E-34 · `faction.faction` AND `faction.power` — DERIVED

```
$ sed -n '79,92p' src/generators/power/rulingStructure.js
export const generatePowerStructure = (
  tier,
  economicState,
  neighbourRelationship,
  config,
  institutions = [],
  projection = {},
) => {

$ grep -n 'economicState\.' src/generators/power/rulingStructure.js | head
498:        (economicState == null ? void 0 : economicState.prosperity) === 'Wealthy' ||
499:        (economicState == null ? void 0 : economicState.prosperity) === 'Thriving'

$ grep -n -A 13 'export const buildGovernanceLabels' src/generators/power/governanceNarrative.js
694:export const buildGovernanceLabels = ({
695-  factions,
696-  config,
697-  stressFlags,
698-  instFlags: institutionFlags,
699-  neighbourRelationship,
700-  instNames: institutionNames,
701-  priorities,
702-  tier,
703-  governingFaction: configuredGoverningFaction,
704-  hasNobleInstitution,
705-  stressTypes,
706-  fallbackStressType,
707-}) => {
```

The faction LABEL comes from `buildGovernanceLabels`, whose destructured parameters include `factions`, `stressFlags`, `instFlags`, `neighbourRelationship`, `instNames` and `priorities` — six members of `WORLD_FACT_PARAMS`. The POWER SHARE is computed inside `generatePowerStructure`, which reads `economicState.prosperity` at `:498-499`. **Both DERIVED — dropped.**

⚠ **The power share's drop contradicts a chair default.** Design §14: *"A faction's power share is partly derived … It stays a ROOT under the totality guard … Vetoable."* The measurement says its writer reads `economicState`. A default and a measurement disagree; only the chair reconciles them (§11 BLOCK-0.3).

## E-35 · THE POWER SEAT'S HOLDER — DERIVED, AND DOUBLE-WRITTEN

```
$ git grep -n 'governingName' -- src/generators/
src/generators/power/economyReconciliation.js:277:  powerStructure.governingName = projected.governingName;
src/generators/power/rulingStructure.js:787:    governingName: (factions.find((f) => f.isGoverning) || {}).faction || null,
src/generators/steps/generatePower.js:86:    // …comment only…

$ sed -n '275,279p' src/generators/power/economyReconciliation.js
  powerStructure.factions = combinedFactions;
  powerStructure.governingName = projected.governingName;
  powerStructure.government = projected.government;
```

A projection of the roster (`factions.find(f => f.isGoverning).faction`), written at TWO sites. **DERIVED — dropped**, and the double writer is recorded as an out-of-scope observation.

## E-36 · `faction.archetype` — NO SUCH FIELD, AND ITS NEAREST REAL FIELD IS NAME-DERIVED

```
$ grep -n '^export' src/generators/power/factionCategories.js
149:export const inferFactionCategory = (factionName) => {

$ grep -n 'archetype' src/generators/factionRoles.js | head -3
  2: * generators/factionRoles.js — Faction archetype → structural NPC roles.
 13: * its archetype via name pattern, and synthesizes the implied NPCs if
179: * Map a faction to its structural-role archetype via the shared canonical detector,
```

The record carries `category`, not `archetype` (E-7), and `category` is inferred **from the faction's display NAME**. Recorded as an out-of-scope observation: it means a rename cascade over a faction name also moves a derived classification.

## E-37 · THE ROOT ARM'S THREE CANDIDATE SOURCES — only the third can answer

```
$ node -e '… scripts/.writer-reach-baseline.json …'
writer-reach stopSet: ["src/generators/","src/store/","src/workers/","src/lib/instantWorld/"]
writer-reach has per-file readers map? false

$ sed -n '107,118p' scripts/lib/writer-reach-scan.mjs
 * THE STOP SET — the engine boundary every closure halts at. Load-bearing at the
 * FILE level (Car 0 control 3: the same read planted at a `src/generators/` path
 * lights nothing).

$ node -e '… scripts/.observed-shape-readers-baseline.json …'
_doc[0] : READER-WITH-NO-WRITER INVENTORY — per-file HEURISTIC-LEAF identities and governed ceilings.
```

**Every declared writer lives under `src/generators/`, the directory the writer-reach closures halt at**, and the observed-shape inventory is the wrong population. The generator step's own source is the only source that decides the predicate — which is exactly what §6.3 specifies.

## E-28 · NO EDGE-SHARED BUNDLE CLOSURE REACHES `src/domain/edit/**`

```
$ grep -o "src/[A-Za-z0-9._/-]*" scripts/build-edge-shared.mjs | sort -u
src/domain/aiCharter.js
src/domain/aiGrounding.js
src/domain/aiOutputSchema.js
src/domain/intentAtlas.js
src/lib/analyticsEvents.js

$ grep -c "src/domain/edit" scripts/build-edge-shared.mjs
0
```

Five entry modules, none of them in `src/domain/edit/`. §7's `Generated artifacts: NONE` is measured, not assumed.

## E-38 · THE AMENDED `requiredSymbols` ROWS EXIST VERBATIM (`grep -cF`, each ≥ 1)

```
src/generators/npcGenerator.js            const pickFirst = (culture = 'germanic', gender = 'male', withSurname = true, tier = 'town')   1
src/generators/npcGenerator.js            export const generateNPCs                       1
src/generators/economy/upgradeOpportunities.js  export const getUpgradeOpportunities      1
src/generators/power/rulingStructure.js   export const generatePowerStructure             1
src/generators/power/rulingStructure.js   export const renormalizeFactionPower            1
src/generators/power/governanceNarrative.js  export const buildGovernanceLabels           1
src/generators/power/factionCategories.js export const inferFactionCategory               1
```

Each resolves exactly once, which is what §6.2 rule 2 requires of a `writer` string.

---

# ADDENDUM 2 — THE SECOND CHAIR AMENDMENT (design §14 FINAL + §15, ODQ §934.44–§934.45), at `7aa769830`

## E-40 · ⭐ J-T1 BLOB IDENTITY — EXECUTED over every measured path, `d31af2cee` → `7aa769830`

```
$ for p in <the 27 paths this packet measures>; do
    a=$(git rev-parse d31af2cee:$p); b=$(git rev-parse HEAD:$p)
    [ "$a" = "$b" ] && echo "SAME $p" || echo "MOVED $p  $a -> $b"; done
SAME src/domain/factionRename.js
SAME src/generators/npcGenerator.js
SAME src/generators/power/rulingStructure.js
SAME src/generators/power/governanceNarrative.js
SAME src/generators/power/factionCategories.js
SAME src/generators/economy/upgradeOpportunities.js
SAME src/generators/lookups.js
SAME src/generators/steps/assembleInstitutions.js
SAME src/generators/generateSettlementPipeline.js
SAME scripts/.writer-reach-baseline.json
SAME scripts/.observed-shape-readers-baseline.json
SAME scripts/lib/writer-reach-scan.mjs
SAME scripts/check-writer-reach.mjs
SAME scripts/check-observed-shape-readers.mjs
SAME scripts/mutation-coverage-manifest.json
SAME scripts/build-edge-shared.mjs
SAME tests/lint/sovereigntyLightingContract.walker.test.js
SAME tests/lint/.lighting-census-baseline.json
SAME tests/lint/mutationCoverage.shared.mjs
SAME tests/domain/factionRename.test.js
SAME tests/lint/habitBandsReconciliation.walker.test.js
SAME src/components/primitives/InstitutionCard.jsx
SAME src/components/new/npcComponents.jsx
SAME src/components/new/tabs/power/PowerStrata.jsx
SAME src/domain/worldPulse/habitForkRegistry.js
SAME tests/lint/chooserTotality.walker.test.js
SAME docs/implementation/PACKET_STANDARD.md
```

**27 of 27 SAME.** This is the chair's item (6) discharged by blob hash rather than by a path-list argument: every figure in this packet is valid at `d31af2cee` AND at the current tip. The chair re-pins at promotion.

## E-39 · ⛔⛔ THE DECISION-FORK REGISTRY HOLDS ZERO ROWS UNDER `src/generators/`

Found exactly by the standard's wording the chair named:

```
$ grep -n -A4 "decision-fork" docs/implementation/PACKET_STANDARD.md
297:**A seeded chooser or pool mint carries two obligations.** (a) Its decision-fork classification
298-row, classified by the registry's own taxonomy — no honest class is a STOP, never a guess. (b)
299-Its mechanism-coverage baseline row, appended with the standard rationale idiom.

$ git grep -ln "decision-fork" -- src/ scripts/ tests/ docs/implementation/
docs/implementation/PACKET_STANDARD.md
docs/implementation/packets/foreign-policy/WC-0E.md
docs/implementation/packets/infrastructure/EST-A.md
docs/implementation/packets/infrastructure/SK-4.md
docs/implementation/preambles/{EM,GR,HB,IN,INFRA,INT,WF}-PREAMBLE.md
scripts/soak/flagConstraints.mjs

$ grep -n -i 'decision-fork' scripts/soak/flagConstraints.mjs
26: * decision-fork classification row in the habit fork registry, whose walker scans
```

→ the registry is **`src/domain/worldPulse/habitForkRegistry.js`**.

```
$ grep -n '^export' src/domain/worldPulse/habitForkRegistry.js
53:export const FORK_DISPOSITIONS = Object.freeze(['LEARN', 'STAY', 'DEFER', 'DEAD_CODE']);
56:export const FORK_ARITIES = Object.freeze(['monadic', 'dyadic', 'per-action']);
59:export const FORK_CLASS_VOCABULARY = CIRCUMSTANCE_CLASSES;
67:export const NAMED_DOMAIN_LABELS = Object.freeze([
85:export const OWNER_DOMAIN_MAPPING = Object.freeze({
120:export const HABIT_FORK_REGISTRY = Object.freeze([

$ sed -n '1,8p' src/domain/worldPulse/habitForkRegistry.js
 * habitForkRegistry.js — HB-1. THE CLASSIFICATION OF EVERY WEIGHTED DECISION FORK THE
 * ESTATE CAN SEE …
 * ⛔ THE CHOOSER-TOTALITY STOP LAW. Every weighted decision fork in `src/domain` is
 * classified here as LEARN, STAY, DEFER or DEAD_CODE. A fork that lands unclassified REDS
 * the tree, and a wave that finds an unclassified fork STOPS.

$ node -e 'import("./src/domain/worldPulse/habitForkRegistry.js").then(m=>{const rows=m.HABIT_FORK_REGISTRY;
   console.log("row keys:", Object.keys(rows[0]).join(", "));
   const mods=[...new Set(rows.map(r=>r.module))];
   console.log("rows:", rows.length, "| distinct modules:", mods.length);
   console.log("rows whose JSON mentions src/generators:", rows.filter(r=>/src\/generators/.test(JSON.stringify(r))).length);});'
row keys: arity, actionVocabulary, closeSource, closeOwed, domain, forkId, module, symbol, discovery, disposition, reason, circumstanceClasses
rows: 42 | distinct modules: 32
rows whose JSON mentions src/generators: 0

   (every one of the 32 modules is under src/domain/ — worldPulse/*, region/*, …)

$ grep -n "SCAN_ROOTS\|DOMAIN_FILES = walk" tests/lint/chooserTotality.walker.test.js
64:const SCAN_ROOTS = Object.freeze([
65:  'src/domain/worldPulse',
66:  'src/domain/spatial',
67:  'src/domain/traditions',
68:  'src/domain/region',
175:const DOMAIN_FILES = walk(join(ROOT, 'src/domain'))
```

**42 rows, 32 modules, all `src/domain/`, ZERO `src/generators/`.** Every chooser EM-A1 must declare — `pickFirst` (`npcGenerator.js:240`), the role selection (`getUpgradeOpportunities`), the institution assembly, `buildGovernanceLabels` — is under `src/generators/`. Under the new predicate the root set is **empty for the editor**, and the walker would refuse every field. §11 BLOCK-0.

## E-41 · ⛔ THE WIZARD'S OPTION SETS — doubled, and the fuller home is a forbidden import

```
$ git grep -n "TERRAIN_OPTIONS\|CULTURE_OPTIONS" -- src/
src/components/gallery/galleryUtils.js:8:export const TERRAIN_OPTIONS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
src/components/gallery/galleryUtils.js:12:export const CULTURE_OPTIONS = ['germanic', 'latin', 'celtic', 'arabic', 'norse', 'slavic', 'east_asian', 'mesoamerican', 'south_asian', 'steppe', 'greek'];
src/components/gallery/GallerySidebar.jsx:8,12,83,89   (its only readers)

$ git grep -n 'export const CULTURE_PROFILE_KEYS' -- src/
src/data/cultureProfiles.js:525:export const CULTURE_PROFILE_KEYS = Object.freeze(Object.keys(CULTURE_PROFILES));

$ grep -n "const TERRAINS\|CULTURE_PROFILE_KEYS" tests/helpers/goldenMasterCorpus.js
20:import { CULTURE_PROFILE_KEYS } from '../../src/domain/cultureProfiles.js';
26:const CULTURES = [...CULTURE_PROFILE_KEYS, 'mediterranean'];
33:const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
```

Terrain has **three** spellings (the gallery's, the golden corpus's, and `getTerrainType`'s own table the corpus comment cites); culture has **two** (`CULTURE_OPTIONS`, 11, and `CULTURE_PROFILE_KEYS`). The only home carrying both named option sets is `src/components/gallery/galleryUtils.js`, and **`src/domain/edit/**` may import nothing from `src/components`** (ARCH §1's closing rule; `EM-PREAMBLE.md` §P4). *"Never a second copy"* cannot be satisfied by a lane choosing one. §11 BLOCK-0.2.

## E-42 · ✅ THE TWO NEW ROOT FIELDS (design §15), MEASURED

```
$ node -e '(async()=>{const {generateSettlementPipeline}=await import("./src/generators/generateSettlementPipeline.js");
  for (const t of ["village","town","city"]) { const s=generateSettlementPipeline({settType:t,…},null,{seed:"st-"+t,customContent:{}});
   const nS=(s.npcs||[]).filter(n=>"status" in n).map(n=>n.status);
   const iS=(s.institutions||[]).filter(i=>"status" in i).map(i=>i.status); … }})()'
village | npcs with .status: 0 of 5  []          | institutions with .status: 0 of 38 []
town    | npcs with .status: 1 of 7  ["active"]  | institutions with .status: 0 of 51 []
city    | npcs with .status: 3 of 15 ["active"]  | institutions with .status: 0 of 48 []
   npc .state? false | inst .state? false | inst .impairments? false (at generation)
```

**`npc.status` EXISTS, partially, value `'active'`. Its vocabulary:**

```
$ sed -n '30,34p' src/domain/entities/npcs.js
/** @typedef {'active'|'dead'|'missing'|'exiled'|'retired'|'removed'} NpcStatus
 * 'removed' comes from the shared entity lifecycle (see entities/status.js
 * EntityStatus — "NPC departed"); the rest are NPC-specific.
```

Design §15 names `{present, exiled, jailed, dead, departed, missing}`. **Three of six agree** (`exiled`, `dead`, `missing`); `present`/`jailed`/`departed` are absent and `active`/`retired`/`removed` are unnamed by §15. FINITE-SEMANTICS forbids the second spelling.

**Its writers are the ENTITY/OPS layer, not a generator chooser:**

```
$ git grep -n "status: 'active'" -- src/domain/
src/domain/entities/npcs.js:250:    status: 'active',
src/domain/events/mutateEntities.js:230,241,410:      status: 'active',
src/domain/events/mutateEntities.js:289:    : { ...inst, status: 'active' };      # the INSTITUTION one
src/domain/events/undoEvent.js:459:  let next = { ...rest, status: 'active' };
```

**`institution.state` DOES NOT EXIST.** The nearest live expressions of §15's vocabulary:

```
$ git grep -n "impairments" -- src/domain/worldPulse/ | head -5
src/domain/worldPulse/corruptionImpair.js:142:  return (inst?.impairments || []).some((i) => i?.type === 'corruption');
src/domain/worldPulse/blockadeTransport.js:46,62: (inst.impairments || []) …
                       → an ARRAY of TYPED entries, not a scalar state

$ git grep -n "ancientRuin\|impairedInstitution" -- src/
src/components/map/PlacementsLayer.jsx:110: settlement?.history?.ancientRuin      → a SETTLEMENT-level history record
src/components/new/economyDeskRead.js:88,89,109: impairedInstitution?: string|null
                       → "ONE house out of the impairment sets ServicesTab already builds"
```

`destroyed`, `abandoned` and `under-construction` have **no home measured anywhere**. Disposition in §1a.4.

---

# ADDENDUM 3 — THE CHAIR'S §934.47 RULINGS, MEASURED

## E-43 · ⭐ THE ROOT-CANDIDATE ENUMERATION — 60 settlements, per-field occupancy

```
$ node -e '(async()=>{const {generateSettlementPipeline}=await import("./src/generators/generateSettlementPipeline.js");
  for (const seed of ["w1","w2","w3","w4","w5"])
   for (const t of ["thorp","hamlet","village","town","city","metropolis"])
    for (const c of ["germanic","latin"]) { … union + occupancy per card shape … }})()'

### institutions[]  (records=2193)
   category 100% · name 100% · required 100% · desc 100% · tags 100% · source 100%
   priorityCategory 100% · baseChance 96% · catalogId 88% · exclusiveGroup 15% · tier 11%
   cascadeAdded 10% · cascadeBoost 10% · forbiddenTradeRoutes 4% · magicLicense 4%
   serviceKeys 1% · minTier 1% · nativeTier 1% · coherenceRepair 1% · facets 1%
   exclusiveGroupCoexists 1% · tradeRouteRequired 0% · terrainRequired 0% · factionSource 0%
   forbiddenResources 0%
   ⛔ NO `class`. NO `standing`. NO `state`. NO `status`.

### npcs[]  (records=551)
   id 100% · name 100% · role 100% · influence 100% · factionAffiliation 100%
   gender 90% · title 90% · category 90% · personality 90% · physical 90% · goal 90%
   secret 90% · plotHooks 90% · power 90% · presentation 90% · corrupt 72%
   structuralPosition 34% · activeConstraint 34% · settlementCondition 34% · structuralRank 34%
   secondaryAffiliation 21%
   importance 10% · status 10% · linkedInstitutionIds 10% · linkedFactionIds 10%
   legitimacyContribution 10% · stabilityContribution 10% · generatedAs 10%   ← all 53 of 551
   institution 6% · corruptionVector 3% · corruptTies 3% · stressNote 3% · factionGoal 1%
   ⛔ NO `disposition`.  ✅ `status` EXISTS at 10%.

### powerStructure.factions[]  (records=360)
   faction 100% · power 100% · desc 100% · category 100% · rawPower 100% · powerLabel 100%
   modifier 17% · isGoverning 17% · modifiers 3% · legitimacyCrisis 3% · crisisNote 3%
   captureState 2%
   ⛔ NO `type`. NO `archetype`. NO `stance`. NO `name`.

### factions[] (grouping)  (records=165)
   name 100% · members 100% · dominantCategory 100% · powerFactionName 100%
   powerFactionPower 100% · powerFactionCat 100% · powerFactionFallback 5%
   ⛔ NO `type`.
```

⛔⛔ **THE CHAIR'S PARENTHETICAL IS REFUTED.** *"(e.g. a faction's `type` for 'archetype')"* — **there is no `type` on any faction record**, on either home, over 525 faction records. The real counterpart is `category` (100%), and `category` is derived from the NAME by `inferFactionCategory` (`factionCategories.js:149`). The mapping recorded in §1c.2 is `archetype → category`, not `archetype → type`.

⭐ **`npcs[].status` rides with a family.** `importance`, `status`, `linkedInstitutionIds`, `linkedFactionIds`, `legitimacyContribution`, `stabilityContribution` and `generatedAs` are each on **exactly 53 of 551** records — one family, the structural-seat NPCs. A declaration that assumes `status` everywhere is wrong 90% of the time.

## E-44 · THE `GenerationForkRow` SHAPE EM-A1 NEEDS FROM EM-P2

The existing row shape (E-39) is:

```
row keys: arity, actionVocabulary, closeSource, closeOwed, domain, forkId, module,
          symbol, discovery, disposition, reason, circumstanceClasses
```

⛔ **There is no `outputKey`.** `forkId`, `module` and `symbol` are present and are exactly what a `writer` string needs; the join to a FIELD is what is missing. §1c.1 states the one shape change this packet asks EM-P2 to carry, and why `symbol` must resolve against source (`pickFirst` is module-local — E-31).

## E-45 · THE `npc.status` WRITERS THE RESPELLED VOCABULARY ATTACHES TO

```
$ git grep -n "status: 'active'" -- src/domain/
src/domain/entities/npcs.js:250:    status: 'active',
src/domain/events/mutateEntities.js:230:      status: 'active',
src/domain/events/mutateEntities.js:241:    status: 'active',
src/domain/events/mutateEntities.js:289:    : { ...inst, status: 'active' };     ← the INSTITUTION one
src/domain/events/mutateEntities.js:348:    : { ...faction, status: 'active' };
src/domain/events/mutateEntities.js:410:    status: 'active',
src/domain/events/undoEvent.js:459:  let next = { ...rest, status: 'active' };

$ sed -n '30,34p' src/domain/entities/npcs.js
/** @typedef {'active'|'dead'|'missing'|'exiled'|'retired'|'removed'} NpcStatus
```

The chair's respelling — `{active, exiled, jailed, dead, missing, retired, removed}` — is **the live set plus `jailed`**, so the declaration extends one vocabulary rather than forking a second. ⚠ `mutateEntities.js:289` and `:348` already write `status: 'active'` onto INSTITUTIONS and FACTIONS too, so the ops layer's status idiom is estate-wide; `institution.state` is a NEW scalar beside it, not a rename of it.
