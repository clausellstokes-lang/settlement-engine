# EM-B2 — evidence (lane EM COMPILE P3, letter `c`, Opus, session 923472dc)

Every fact the packet calls VERIFIED appears below with the command that proved it and that
command's output. A fact with no command here is not verified and does not appear in the packet.

Worktree: `$SP/consist` with `SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`.
All commands run with `cd $SP/consist`. Clock read at each stamp (`date`).

---

## E0 · THE BASE, AND THE DRIFT THAT HAPPENED MID-COMPILE

```
$ date
Sat Sep 19 11:02:01 EDT 2026
$ git -C $SP/consist rev-parse HEAD
d31af2ceebf643818201b2e2ab4a556765d2fc7c
$ git -C $SP/consist rev-parse --abbrev-ref HEAD
fixes-2026-09-18-consist
```

The brief's base is confirmed. ⚠ At 11:11 the worktree HEAD had MOVED under this lane:

```
$ date
Sat Sep 19 11:11:55 EDT 2026
$ git log -1 --format='%H %ci %s' HEAD
34f320829656957d3cfb33ff28b1772859ca5b0a 2026-09-19 11:07:37 -0400 The preview persona's env file is development-scoped and ignored: .env.*.local
$ git merge-base --is-ancestor d31af2ceebf643818201b2e2ab4a556765d2fc7c HEAD && echo YES || echo NO
YES
$ git log --oneline d31af2ceebf643818201b2e2ab4a556765d2fc7c..HEAD
34f320829 The preview persona's env file is development-scoped and ignored: .env.*.local
02968876b DOC: the EM family packet preamble — the settlement editor's invariants signed once (ODQ §934.36–§934.42; design §12 governs)
$ git diff --name-only d31af2ceebf643818201b2e2ab4a556765d2fc7c..HEAD
.gitignore
docs/implementation/preambles/EM-PREAMBLE.md
```

Every path this compile measured is byte-identical across that window, proved by object id:

```
$ for f in src/domain/regenerationDelta.js src/domain/userEdits.js src/store/settlementSlice.js \
    src/store/persistProjection.js src/lib/saves.js src/domain/settlementMigrations.js \
    src/domain/intent/interpretReview.js src/components/surveyor/InterpretApplyPanel.jsx \
    tests/lint/.lighting-census-baseline.json scripts/mutation-coverage-manifest.json \
    scripts/check-observed-shape-readers.mjs tests/property/generatorGoldenMaster.test.js \
    docs/implementation/charters/EDIT-MODE-TRAIN.md; do ...; done
IDENTICAL src/domain/regenerationDelta.js 712eebc05efab84bf5064e12dbcc8ad79712ebfe
IDENTICAL src/domain/userEdits.js e3e8ab5af90b165cb7c5508e0bc55e6b9b569879
IDENTICAL src/store/settlementSlice.js 53564e7a6edeb42e063ced14bcd1bd8234a6104c
IDENTICAL src/store/persistProjection.js 2189260fc09d26ffdef0828eb91c9be907b1d8e6
IDENTICAL src/lib/saves.js 30ff82245ee94fffbe2d40556371eeb67d3c96bf
IDENTICAL src/domain/settlementMigrations.js b53a000270f83c4f524a0b5bf1bf2a19d8cd4f2f
IDENTICAL src/domain/intent/interpretReview.js a5f13ce64f7a798e33267bfd6fc346767ebd07ea
IDENTICAL src/components/surveyor/InterpretApplyPanel.jsx 17b9d8e6d839277f191a46aafffdf7ac6985cfaa
IDENTICAL tests/lint/.lighting-census-baseline.json b620751dafb330d967742b14f39a9e55d449958d
IDENTICAL scripts/mutation-coverage-manifest.json ecd2528623f00a5a5fa05f6a8d7d2412dbb07fc8
IDENTICAL scripts/check-observed-shape-readers.mjs 3119ba718a99e2fb30fda863ebe4438c09cb5f30
IDENTICAL tests/property/generatorGoldenMaster.test.js 1959cb65ae7f34084783d5d3aaca1757d68a63bd
IDENTICAL docs/implementation/charters/EDIT-MODE-TRAIN.md ecac8ca0f8e3bcfb995e59fcfb0577fcb237d965

$ git status --porcelain --untracked-files=all | head -10
(no output — zero foreign dirt)
```

So every measurement below holds at `d31af2cee` AND at `34f320829`. This is exactly the
`PACKET_STANDARD.md` J-T1 shape (a docs-only descendant with every measured path byte-identical).
The packet stays pinned at `d31af2cee` as the brief commands. ⭐ ONE CONSEQUENCE FOR THE CHAIR:
`docs/implementation/preambles/EM-PREAMBLE.md` does NOT exist at `d31af2cee` (it lands in
`02968876b`), so this packet's `requiredSymbols` deliberately does NOT name it. When the chair
re-points the verified base to `02968876b` or later, add the row
`{ path: "docs/implementation/preambles/EM-PREAMBLE.md", symbol: "# EM FAMILY PACKET PREAMBLE" }`
(the `EFF-M1B` precedent).

---

## E1 · GREENFIELD CONFIRMED — nothing the packet CREATES exists

```
$ ls src/domain/edit
ls: src/domain/edit: No such file or directory

$ git grep -n "dmLayer\|DM_ID_NS\|mintDmId" -- src tests scripts
(no output)

$ git grep -n "'dm:" -- src
(no output)
```

`src/domain/edit/` does not exist. `dmLayer`, `DM_ID_NS`, `mintDmId` appear nowhere in `src/`,
`tests/` or `scripts/`. No `'dm:'` identity namespace precedent exists in `src/`.

⚠ BUT `decrees` IS NOT GREENFIELD — two measured collisions on the noun:

```
$ git grep -n "\bdecrees\b" -- src scripts | head
scripts/.observed-shape-readers-baseline.json:331:   "decrees on settlement": 1,
src/components/map/AdvanceReport.jsx:325:function DecreeSection({ decrees }) {
src/domain/ai/personaSlicer.js:172:    decrees: (home?.appliedDecrees || home?.decrees || []).slice(0, 6),
src/domain/display/decreeTracker.js:344:export function decreesForAdvance(entry, provenance) {

$ sed -n '325,336p' scripts/.observed-shape-readers-baseline.json
  "src/domain/ai/personaSlicer.js": {
   "appliedDecrees on settlement": 1,
   ...
   "decrees on settlement": 1,
```

(a) `src/domain/display/decreeTracker.js` already owns a DISPLAY derivation named `decreesForAdvance`
over world-pulse advance entries, read by `src/components/map/AdvanceReport.jsx:395`.
(b) `src/domain/ai/personaSlicer.js:172` already READS `decrees` and `appliedDecrees` off a
settlement, and BOTH are banked observed-shape findings at ceiling 1.
Both are EM-B3's and EM-E2/E3's to reconcile; recorded here so no later lane re-finds them as new.

---

## E2 · THE REGENERATION PATH, BY SYMBOL

```
$ ls src/generators/pipeline/
ls: src/generators/pipeline/: No such file or directory
```
⚠ The brief's hint `src/generators/pipeline` does NOT exist. The real spellings are
`src/generators/pipeline.js` and `src/generators/generateSettlementPipeline.js`.

```
$ grep -n "regenSection" src/store/settlementSlice.js
456:  regenSection: async (section) => {

$ sed -n '456,470p' src/store/settlementSlice.js
  regenSection: async (section) => {
    const state = get();
    const { settlement, config, locks } = state;
    if (!settlement) return;
    ...
    if (sectionLocked(locks, section)) return makeActionResult('regenSection', { ok: false, ... });
```

`regenSection` is the ONE store action that re-runs generation for an already-existing
settlement. Measured facts of its body (`sed -n '470,590p' src/store/settlementSlice.js`):

- `if (get().phase === 'canon') return;` — **canon settlements never regenerate**. Draft rerolls only.
- exactly TWO branches: `if (section === 'npcs')` → `eng.regenNPCsPipeline(settlement, cfg, { locks })`
  then `await foldRegeneratedRoster(get, set, parts, _preservation)`; `else if (section === 'history')`
  → `const { history, _regenSeed } = eng.regenHistoryPipeline(settlement, cfg);`
- after the branches: `const { deriveRegenerationDelta } = await import('../domain/regenerationDelta.js');`
  `const after = get().settlement; const delta = deriveRegenerationDelta(before, after);`
  `set(s => { s.lastRegenerationDelta = delta; });`
- then the save write: `if (activeSaveId) { ... afterState.updateSavedSettlement(activeSaveId, savePartial);
  persistSaveUpdate(activeSaveId, { settlement: ..., campaignState: ... }); }`

**THE ONLY LAWFUL RE-APPLY SEAT** is between the branch's write and the `deriveRegenerationDelta`
call — a re-apply after the delta is computed would make the delta describe a world the reader
never sees.

---

## E3 · THE SETTLEMENT WRITER THE STORE USES

```
$ sed -n '637,646p' src/store/settlementSlice.js
  updateSavedSettlement: (id, partial) => {
    const unknown = unknownSavedSettlementPatchKeys(partial);
    if (unknown) return makeActionResult('updateSavedSettlement', { ok: false, ... });
    return set(state => {
      const idx = state.savedSettlements.findIndex(s => s.id === id);
      if (idx !== -1) Object.assign(state.savedSettlements[idx], partial);
    });
  },

$ grep -n "SAVED_SETTLEMENT_PATCH_KEYS" -A 8 src/store/settlementSliceHelpers.js
318:export const SAVED_SETTLEMENT_PATCH_KEYS = Object.freeze([
319-  'settlement', 'campaignState', 'timestamp', 'aiData',
320-  'is_public', 'public_slug', 'visibility', 'unlisted_slug',
321-  'gallery_description', 'gallery_title', 'gallery_image_url', 'gallery_image_alt',
322-  'gallery_tags', 'gallery_share_dm', 'gallery_share_narrated', 'gallery_importable',
323-  'gallery_member_overrides',
324-]);
```

The save-row patch surface is a CLOSED 17-key list. `dmLayer` and `decrees` are keys ON the
settlement blob (ARCH §3: "Two keys join the saved settlement record"), and `settlement` is
already a patch key — so no widening of `SAVED_SETTLEMENT_PATCH_KEYS` is owed by this family.

The durable write is `persistSaveUpdate` (`src/store/campaignSliceShared.js`), an enqueue+drain
against the durable outbox (`src/components/CampaignSyncBanner.jsx:4`).

---

## E4 · `deriveRegenerationDelta` — THE EXACT ENVELOPE

```
$ grep -n "^export" src/domain/regenerationDelta.js
90:export function deriveRegenerationDelta(before, after) {
183:export function regenerationDeltaSize(delta) {
198:export function newEntitiesByType(delta) {

$ wc -l src/domain/regenerationDelta.js
     206 src/domain/regenerationDelta.js
```

Both the nullish branch (`sed -n '94,108p'`) and the real return (`sed -n '160,175p'`) carry the
SAME ELEVEN KEYS, in this order:

    directEffects, rippleEffects, capacityShifts, dailyLifeShifts, preservedCanon,
    brokenDependencies, newEntities, removedEntities, newOpportunities, newRisks, summary

`preservedCanon` is `preserved` from `diffEntityCatalogs(before, after)` — an ENTITY-level diff
(design §12.12 names exactly this: "the delta card's 'kept' is an entity diff", so a field-level
section is new derivation).

Callers (`git grep -n deriveRegenerationDelta -- src tests`):
- `src/store/settlementSlice.js:550,552` (the regen path, lazy import)
- `src/components/settlement/VersionDiffView.jsx:37,145`
- `src/components/primitives/RegenerationDeltaCard.jsx:10` (doc reference; renders the envelope)
- `tests/domain/regenerationDelta.test.js` (17 cases)

---

## E5 · ⛔⛔ THE BLOCK — LIVE CODE REFUTES STATE OWNERSHIP AND THE REGENERATION LIFECYCLE

`src/domain/userEdits.js` ALREADY implements design §12.5 — edits applied ON WRITE with a
record of which fields are the DM's, re-applied through regeneration — for a declared field set.

```
$ grep -n "^export" src/domain/userEdits.js
73:export const EDITABLE_FIELDS = Object.freeze({
119:export const EDITABLE_ENTITY_TYPES = ...
127:export function isEditablePath(type, path) {
181:export function applyUserEdit(entity, path, newValue, options = {}) {
221:export function revertUserEdit(entity, path) {
254:export function getEditedPaths(entity) {
280:export function getOriginalValue(entity, path) {
292:export function getEffectiveValue(entity, path) {
351:export function walkUserEdits(settlement) {
405:export function countSettlementEdits(settlement) {
424:export function summarizeUserEdits(settlement) {
```

Its own header (`sed -n '1,55p' src/domain/userEdits.js`), verbatim:

    applyUserEdit(entity, path, newValue)  -> mutates entity, records original
    ...
    The edit record lives on the entity itself as a single `_userEdits` object:
      entity._userEdits = { 'secret.what': { value, originalValue, editedAt } };
    AND `_authored: true` is set on the entity so the existing domain/canonStatus.js tagger
    automatically promotes it to `source: 'user'`, `canonStatus: 'canon'`, `locked: true`.
    That tag is what carries an edited NPC through a section reroll:
    domain/regenerationPreservation.js reads it via regenerationMode's preservation rules and
    re-seats the character in the fresh roster.

The re-apply seams, measured:

```
$ grep -n "^export" src/domain/regenerationPreservation.js src/domain/historyPreservation.js
src/domain/regenerationPreservation.js:213:export function countPreservedNpcs(previousNpcs, options = {}) {
src/domain/regenerationPreservation.js:237:export function mergePreservedNpcs(previousNpcs, freshNpcs, options = {}) {
src/domain/historyPreservation.js:186:export function restoreAuthoredHistory(settlement, history) {

$ git grep -n "_authored" -- src | head
src/domain/canonStatus.js:99:  if (entity._authored === true || entity.userAuthored === true) return 'user';
src/domain/npc/characterEdit.js:105:export const AUTHORED_MARKER_KEY = '_authored';
src/domain/npc/characterEdit.js:160:  markerRuling: '_authored alone buys regen survival in all three modes (executed)',
src/domain/userEdits.js:205:  entity._authored = true;
src/domain/userEdits.js:231:    delete entity._authored;
```

And the store action that drives it:

```
$ sed -n '830,843p' src/store/settlementSlice.js
  applyUserEditAction: (kind, entityIndex, path, value) => {
    ...
      if (!isEditablePath(kind, path)) return;  // strict registry gate
      const entity = _resolveEntity(state.settlement, kind, entityIndex);
      if (!entity) return;
      domainApplyUserEdit(entity, path, value);
    ...
    if (changed) get().persistActiveSaveEdit?.();
  },
```

**THE SMALLEST MEASURED CONTRADICTION, at field level.** `EDITABLE_FIELDS` (`sed -n '73,118p'`)
declares for `npc`: `goal.short`, `secret.what`, `personality`, **`role`**. The charter's own
seed catalogue (`ARCH_EDIT_MODE_AND_DECREES.md` §9) declares for the npc card:
"name free-cascade with the generator's roll; **role pool** from the world's institutions;
disposition pool; note free".

So `npc.role` is declared editable by BOTH mechanisms — `_userEdits` (as typed prose, through
`applyUserEditAction`) and `dmLayer` (as a pooled fact, through `applyEdit`). That is TWO named
writers for one state, which `PACKET_STANDARD.md`'s budget forbids ("exactly one named writer for
any ONE state that changes"), and it is `PACKET_STANDARD.md`'s own MANDATORY STOP: "live code
refutes state ownership, lifecycle, or ordering".

Which mechanism owns a field both claim — and whether `dmLayer` subsumes, excludes, or coexists
with `_userEdits`/`_authored` — is a RULING, not a coding choice. The packet is BLOCKED on it.

---

## E6 · GOLDEN POSTURE — WHAT MOVES A GOLDEN, MEASURED

```
$ sed -n '796,802p' tests/property/generatorGoldenMaster.test.js
function hashFor(config) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
}
const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');

$ sed -n '13,14p' tests/property/generatorGoldenMaster.test.js
 * To regenerate after an INTENTIONAL output change, run:
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js

$ python3 -c "import json; d=json.load(open('tests/fixtures/generator-golden-master.json')); print(len(d))"
525

$ grep -n "MANIFEST_REL" tests/property/dossierProseManifest.test.js
83:const MANIFEST_REL = 'tests/fixtures/dossier-prose-manifest-golden.json';
```

The golden hashes the WHOLE serialised pipeline output. Any key that rides the settlement blob
moves all 525 rows. ⚠ `schemaVersion` is such a key:

```
$ grep -n "normalizeSettlement" src/generators/steps/assembleSettlement.js
33:import { normalizeSettlement } from '../../domain/normalizeSettlement.js';
324:  return { settlement: reapplyEventConditions(promoteStressorsToConditions(normalizeSettlement(settlement))) };
$ grep -n "schemaVersion" src/domain/normalizeSettlement.js | head -2
167:      schemaVersion:     SCHEMA_VERSION,
$ grep -n "export const SCHEMA_VERSION" src/domain/settlement.schema.js
47:export const SCHEMA_VERSION     = 1;
```

So bumping `SCHEMA_VERSION` moves EVERY golden row. This prices EM-B4's fork B (below) and is
a standing STOP for any wave-1 member.

**THE GOLDEN IS NOT MOVED BY THIS PACKET** and the update command above is FORBIDDEN to it.
`dmLayer` never enters a generated settlement: the pipeline has no writer for it, and the layer
is composed only at edit/regeneration time on a SAVED record.

---

## E7 · THE REGISTER MOVES, PRICED — AND ONE CORRECTION THE CHAIR OWES ITSELF

### (a) ⛔ THE LIGHTING CENSUS COUNTS **TEST** FILES, NOT `src/` FILES

```
$ sed -n '515,519p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests'))
  .filter((p) => /\.test\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p)..., src: readFileSync(p, 'utf8') }))
  .sort((a, b) => a.rel.localeCompare(b.rel));

$ sed -n '601,619p' tests/lint/sovereigntyLightingContract.walker.test.js
function measureCensus() {
  const parked = TEST_FILES.filter(...); const credited = TEST_FILES.filter(...);
  ...
    figures: { files: TEST_FILES.length, parked: parked.length, credited: credited.length,
               titles, suiteTitles },
}

$ cat tests/lint/.lighting-census-baseline.json   (figures only)
  "measuredAtSha": "e5a27a1a5e83569e198ab36e0879ee70fdaefe8a",
  "measuredBy": "the chair (Fable 5.1, session 923472dc)", "date": "2026-09-19",
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
```

⚠ **`EM-PREAMBLE.md` §P2.1 IS WRONG AND RE-STAMPS EVERY MEMBER.** It reads: "A new file under
`src/domain/**` or `src/components/**` moves the sovereignty-lighting census". Measured, it does
not: the walker walks `tests/` only, and `files` is `TEST_FILES.length`. What moves the tuple is
the member's NEW TEST FILES — which is exactly the red `PACKET_STANDARD.md` names by construction
("A member that adds a test file forces exactly this red"). The chair owes §P2.1 a correction, or
every EM member's predicted delta is attributed to the wrong cause.

The refreeze is a GENERATED artifact, never a hand edit (the baseline's own `_doc`):

    LIGHTING_CENSUS_REFREEZE='<lane or seat id>' LIGHTING_CENSUS_NOTE='<why it moved>' \
      npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js

    ⛔ NEVER HAND-EDIT THE FIVE FIGURES. ... It writes all five or none, and it EXITS NON-ZERO
    BY DESIGN so a refreeze can never be mistaken for a passing gate.

### (b) THE MUTATION-COVERAGE ROW — OWED FOR ONE OF THE TWO NEW TEST FILES

```
$ sed -n '36,52p' tests/lint/mutationCoverage.shared.mjs
export const ENFORCER_DIRS = ['tests/lint','tests/design','tests/docs','tests/data',
  'tests/copy','tests/security','tests/edgeFunctions','tests/generators'];
export const NAME_PATTERN =
  /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i;

$ sed -n '1174,1177p' scripts/mutation-coverage-manifest.json
    "tests/property/generatorGoldenMaster.test.js": {
      "kind": "rationale",
      "ref": "golden-byte-pin"
    },
```

`tests/property/dmLayerGoldenIsolation.test.js` matches `NAME_PATTERN` on `golden` → it OWES a
`scripts/mutation-coverage-manifest.json` `invariants` row, added surgically (the manifest is
never re-serialised whole). `tests/domain/dmLayer.test.js` matches no token and lives outside
the eight enforcer dirs → it owes NOTHING.

### (c) THE OBSERVED-SHAPE DOOR — **NOT OWED BY THIS PACKET**, measured

```
$ sed -n '1262,1274p' scripts/check-observed-shape-readers.mjs
const EXPLAINED_WRITER_MECHANISMS = Object.freeze([
  'save-time-writer', 'closed-ingest', 'admission-list', ... 'conditional-generator-branch',

$ sed -n '1290,1300p' scripts/check-observed-shape-readers.mjs
export function assertExplainedWriterExemptions(entries = EXPLAINED_WRITER_EXEMPTIONS) {
    const fields = Object.keys(entry || {}).sort().join(',');
    if (fields !== 'identity,mechanism,ruling,why,writer') { throw ... }
    if (!/^\S+ on \S+$/.test(entry.identity)) { throw ... }
    if (!/^src\//.test(entry.writer) || !/\.(js|jsx)$/.test(entry.writer)) { throw ... }

$ sed -n '1345,1358p' scripts/check-observed-shape-readers.mjs      # gate 0
    const spellings = writeShapesIn(source, key);
    if (!spellings.length) { throw new Error(`... is STALE: ${entry.writer} no longer writes
      ${key} in any of the ... measured write shapes ...`); }
```

Two measured reasons this packet owes no exemption row:

1. **Gate 0 would REFUSE it.** An exemption must name a `src/**.js` file that WRITES the key.
   At EM-B2 no `src/` file writes `settlement.dmLayer` — the key is composed onto the save by
   EM-B3's `persistProjection`/store work. Minting the row here makes it STALE by construction.
2. **The resolver yields no finding.** `scripts/lib/legacy-reader-shape-scan.mjs` (header,
   `sed -n '16,20p'`): "Resolution is DELIBERATELY PARTIAL AND SILENT. A receiver that does not
   resolve yields no finding: this walker never guesses"; and "parameters → the union of the
   arguments at f's CALL SITES". Wave 1 is headless, so `applyEdit` / `reapplyLayer` have NO
   `src/` call site at this packet's landing and their parameters cannot resolve.

So the row belongs to EM-B3, is a CHAIR act through the migration-bundle door, and is priced
here as a NAMED REGISTER row this packet does not execute. Its exact predicted spelling:
`{ identity: 'dmLayer on settlement', mechanism: 'save-time-writer', writer: '<EM-B3's writer>',
ruling: 'ODQ §934.40 / design §12.5 + §12.9', why: '<the save-time argument>' }`.

### (d) WRITER-REACH — CANNOT MOVE ON THIS PACKET

```
$ sed -n '12,35p' scripts/check-writer-reach.mjs
 *   (no flag) / --report / --report-to=<path outside the repo>   Measure and report. Never writes.
 *   --write       SHRINK-ONLY re-freeze. Refuses growth and refuses a missing baseline.
 *   --genesis --charter=§NNN    Once, chair-signed. REFUSES if a baseline already exists.
 *   --rebank --charter=§NNN     THE ONE GOVERNED GROWTH DOOR ...
 * ⚠ NOT IN `package.json`. The gate authority is the vitest walker ...
```

The register grades WRITTEN identities DARK when no customer surface reads them. This packet
writes no new persisted identity (EM-B3 does) and adds no customer surface (wave 1 is headless),
so `scripts/check-writer-reach.mjs` cannot move: **neither `--write` nor a mint is owed.**
`scripts/check-observed-shape-readers.mjs` likewise does not move here, per (c).

### (e) EDGE-SHARED BUNDLES — NOT IN ANY CLOSURE

```
$ for m in aiGrounding analyticsEvents aiCharter intentAtlas aiOutputSchema; do
    python3 -c "... print(len(inputs), 'regenerationDelta' in ' '.join(inputs))"; done
aiGroundingBundle:    74  False
analyticsEventsBundle: 2  False
aiCharterBundle:     114  False
intentAtlasBundle:     2  False
aiOutputSchemaBundle:115  False
```

`src/domain/regenerationDelta.js` sits in NONE of the five bundle closures (measured against each
meta's own `inputs` array, per `PACKET_STANDARD.md`). **No `npm run build:edge-shared` is owed.**

---

## E8 · THE HOT-FILE / SIZE-BASELINE MEASUREMENT AT THE RE-APPLY SEAT

Executed with eslint's own `Linter` under `max-lines` with `skipBlankLines` and `skipComments`
(never `wc -l`, never an inherited figure):

```
$ node -e "const {Linter}=require('eslint');const fs=require('fs');const l=new Linter();
  for (const f of [...]) { const msgs=l.verify(fs.readFileSync(f,'utf8'),
  {rules:{'max-lines':['error',{max:1,skipBlankLines:true,skipComments:true}]}},f);
  console.log(f,'->',msgs[0].message); }"
src/store/settlementSlice.js      -> File has too many lines (816). Maximum allowed is 1.
src/domain/regenerationDelta.js   -> File has too many lines (103). Maximum allowed is 1.
src/domain/userEdits.js           -> File has too many lines (209). Maximum allowed is 1.
src/store/persistProjection.js    -> File has too many lines (42).  Maximum allowed is 1.

$ grep -n '"src/store/settlementSlice.js"' scripts/.size-baseline.json
20:  "src/store/settlementSlice.js": 816
```

⛔⛔ **`src/store/settlementSlice.js` IS AT 816 EFFECTIVE AGAINST A FROZEN BASELINE OF 816 —
ZERO HEADROOM.** `eslint.config.js:89-97` turns each `.size-baseline.json` entry into a per-file
`max-lines: ['error', { max }]` override, and `tests/lint/sizeBaseline.test.js` keeps the map
honest shrink-only ("a file that grows past its number reds eslint ... Shrink-only, never raise").

It is not on `PACKET_STANDARD.md`'s standing hot list (it has a baseline entry and a door), but
the operative constraint is identical: **the re-apply call must be NET ZERO effective lines**, or
it must sit in a delegation leaf. The file already uses that idiom — the baseline's own `_doc`
records `settlementGenerateAction.js`, `settlementLifecycleHelpers.js`,
`settlementVersionHistoryActions.js` and `settlementSliceHelpers.js` as its extracted bodies.
The packet therefore shapes the seat one-line-for-one-line inside `regenSection`.

---

## E9 · TEST PRECEDENTS, BY PATH AND NAME

```
$ grep -n "describe(\|  it(" tests/domain/regenerationDelta.test.js | head
34:describe('deriveRegenerationDelta()', () => {
35:  it('returns canonical envelope shape', () => {
50:  it('identical snapshots produce empty deltas + "no changes" summary', () => {
60:  it('returns empty envelope for nullish input', () => {
114:  it('does not mutate either snapshot', () => {
125:describe('regenerationDeltaSize()', () => {
156:describe('real-settlement smoke', () => {

$ grep -n "describe(\|  it(" tests/property/beliefMapGolden.test.js | head
134:describe('belief-map golden (WAVE A, deterministic)', () => {
155:  it('covers the full corpus', () => {
159:  it('is deterministic across two runs (byte-identical projection)', () => {
163:  it('anti-vacuity: the belief maps are non-empty and the two modes differ', () => {
170:  it('every config produces the golden projection', () => {

$ grep -n "describe(\|  test(" tests/store/lifecycleRoundTrip.test.js | head
614:describe('E-C completeness — every persisted family is registered (new family ⇒ red)', () => {
755:describe('E-C worldState — ensure fixpoint, persist, clone, migrate, dormancy', () => {
756:  test('ensureWorldState is a byte-exact fixpoint on a fully-populated state (re-derive hop)', ...
763:  test('the persist hop (JSON round-trip) then re-ensure survives byte-exact', () => {
940:describe('E-C campaign record — create, persist, reload, migrate fixpoint, clone', () => {
```

All three shapes use FLAT literal `it`/`test` calls, which is what `EM-PREAMBLE.md` §P3.4 requires
(no `.each`, no looped or conditional registration, no nested describes).

---

## E10 · WHAT WAS NOT RUN, AND WHY

No `vitest`, no `eslint --fix`, no `npm run check`, no writing script, and no edit to the consist
or the ledger was executed by this lane, per the brief. `node -e` with eslint's `Linter` (E8),
`git`, `grep`, `sed`, `wc` and `python3 -c` over committed JSON are the only tools used; all are
read-only.

---

## E11 · EVERY `requiredSymbols` ROW PROVED PRESENT AT THE BASE

Each row is an EXACT substring of the file's blob at `d31af2cee` (never the live worktree),
so the manifest cannot name a symbol the base does not carry:

```
$ check() { git show d31af2ceebf643818201b2e2ab4a556765d2fc7c:"$1" | grep -qF "$2" \
    && echo "OK   $1 :: $2" || echo "MISS $1 :: $2"; }
OK   src/domain/regenerationDelta.js :: export function deriveRegenerationDelta
OK   src/domain/regenerationDelta.js :: export function regenerationDeltaSize
OK   src/domain/regenerationDelta.js :: export function newEntitiesByType
OK   src/store/settlementSlice.js :: regenSection: async (section) => {
OK   src/store/settlementSlice.js :: updateSavedSettlement: (id, partial) => {
OK   src/store/settlementSliceHelpers.js :: export const SAVED_SETTLEMENT_PATCH_KEYS
OK   src/domain/userEdits.js :: export function applyUserEdit
OK   src/domain/userEdits.js :: export const EDITABLE_FIELDS
OK   src/domain/userEdits.js :: export function walkUserEdits
OK   src/domain/regenerationPreservation.js :: export function mergePreservedNpcs
OK   src/domain/historyPreservation.js :: export function restoreAuthoredHistory
OK   src/domain/npc/characterEdit.js :: export const AUTHORED_MARKER_KEY
OK   src/generators/generateSettlementPipeline.js :: export function generateSettlementPipeline
OK   src/domain/settlementMigrations.js :: export function migrateSettlementToLatest
OK   src/domain/settlementMigrations.js :: export function listMigrations
OK   src/domain/settlementMigrations.js :: export function diagnoseMigrationChain
OK   src/domain/settlement.schema.js :: export const SCHEMA_VERSION
OK   src/domain/intent/interpretReview.js :: export function reviewInterpretation
OK   src/domain/intent/interpretReview.js :: export const REVIEW_ACTIONS
OK   src/store/persistProjection.js :: export function partializeStoreState
OK   src/lib/saves.js :: export const saves
OK   src/store/settlementPendingEdits.js :: export function queuePendingEdit
OK   tests/property/generatorGoldenMaster.test.js :: function hashFor(config)
OK   tests/property/dossierProseManifest.test.js :: const MANIFEST_REL
OK   tests/lint/sovereigntyLightingContract.walker.test.js :: const TEST_FILES = walk(join(ROOT, 'tests'))
OK   tests/lint/mutationCoverage.shared.mjs :: export const ENFORCER_DIRS
```

Zero MISS. Nothing the packet CREATES appears in `requiredSymbols`, per
`PACKET_STANDARD.md` ("A symbol the deliverable CREATES cannot be named until it exists").

---

## E12 · ⭐ THE BASE MOVED A SECOND TIME — DESIGN §14, MEASURED

```
$ date
Sat Sep 19 11:3x EDT 2026
$ git -C $SP/consist rev-parse HEAD
7c538ec89edc1ec52dd3310d998da06089547280
$ git -C $SP/consist log --oneline d31af2cee..HEAD
7c538ec89 DOC: the EM preamble carries the source rule (design §14, ODQ §934.44) ...
3b6478fb3 DOC: edit at the source, never at the derivation folds onto the build branch (design §14 ...)
a03ebb09a DOC: the EM preamble carries the phantom consequence rule (HZ-PHANTOM ... §934.43)
023085560 DOC: the phantom consequence rule folds onto the build branch (design §13 ... §934.43)
7a0fe5889 The generation worker's ceiling re-mints exact at 1,399,946 B ...
34f320829 The preview persona's env file is development-scoped and ignored: .env.*.local
02968876b DOC: the EM family packet preamble ...
$ git -C $SP/consist diff --name-only d31af2cee..HEAD
.gitignore
docs/ARCH_EDIT_MODE_AND_DECREES.md
docs/DESIGN_EDIT_MODE_AND_DECREES.md
docs/implementation/charters/EDIT-MODE-TRAIN.md
docs/implementation/preambles/EM-PREAMBLE.md
tests/build/generationWorkerLazy.test.js
```

Re-proved: of the twenty-two paths this compile measured, **exactly one moved** —
`docs/implementation/charters/EDIT-MODE-TRAIN.md`. Its diff is two rows, and **NEITHER IS MINE**:

```
$ git -C $SP/consist show d31af2cee:docs/.../EDIT-MODE-TRAIN.md | grep -n "EM-B2\|EM-B4"
$ git -C $SP/consist show HEAD:docs/.../EDIT-MODE-TRAIN.md      | grep -n "EM-B2\|EM-B4"
  (line 15 EM-B2 and line 17 EM-B4 are BYTE-IDENTICAL at both revisions)
```
The moved rows are **EM-A1** (a `provenance: 'root'` + `writer` declaration under design §14) and
**EM-F1** (the phantom consequence rule under design §13). Every `src/`, `tests/` and `scripts/`
path this compile measured is still byte-identical, so no figure above is stale.

**The new law, verbatim from `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14 at HEAD:**

    ## 14. Edit at the source, never at the derivation (the owner, ODQ §934.44; 2026-09-19)
    ... 2. **Root** — a fact a generator step writes from the seed and the dials, whose writer
    reads no other world fact: an NPC's name, ROLE and disposition; an institution's name, class
    and standing; a faction's name, archetype and stance; a power seat's holder. The editor's
    pencils and pools live here.
    3. **Derived** — the economy, the supply chains, the defense scores, food security, the
    system states, the history. Never editable. ... History is the chronicle's and immutable
    (THE PROMISE).
    **What leaves the editable set.** The system-state cards (security, food security, order)
    named in ARCH §9 are derived and are struck.

And `EM-PREAMBLE.md` at HEAD gains `HZ-DERIVED` (line 65).

**Measured against `EDITABLE_FIELDS` (`src/domain/userEdits.js:73`), §14 convicts the shipped
inline-edit surface on its own terms:** of its fourteen settlement-root paths,
`economicViability.summary`, `economicState.safetyProfile.safetyDesc`,
`guardEffectivenessDesc`, `economicDragDesc` and the five `history.*` paths are DERIVED under
§14's own taxonomy, and history is additionally ruled immutable. §14 also RULES `npc.role` a root
fact of the editor, which answers half of §E5's overlap and sharpens the other half.

This is recorded, not adjudicated. It is added to both packets' §0.5.

---

## E13 · ⛔⛔ THE CHAIR'S AMENDMENT (ODQ §934.44 addendum, consist `2280742ab`) — RE-MEASURED

The chair superseded §12.5's mechanism: the layer now acts AT THE CHOOSER, and a draft edit
re-runs generation with the layer consulted at each registered root chooser. The chair set two
gates — find the choosers through the decision-fork classification registry, and PROVE layer-key
stability across a regeneration or BLOCK. **Both gates fire.**

```
$ date; git -C $SP/consist rev-parse HEAD
Sat Sep 19 11:27:46 EDT 2026
2280742ab369cc8de8ef479b02072ac08a31db6d
$ git show 2280742ab:docs/implementation/charters/EDIT-MODE-TRAIN.md | sed -n '15p'
| **EM-B2** the layer at the chooser | `dmLayer.js` + the pipeline's `drawRoot(rng, key, pool, layer)`
hook at every registered root chooser of the four card kinds ... THE LOAD-BEARING PACKET —
splits into B2a (the hook at the choosers) and B2b (the orchestration + the delta section) if
its budget demands (design §14) | ...
$ git show 2280742ab:docs/ARCH_EDIT_MODE_AND_DECREES.md | sed -n '98p'
7. `dmLayerGoldenIsolation` — a property test: generation with an EMPTY layer equals the golden
master byte-for-byte; generation with a one-root layer differs from it only in that root and the
derivations downstream of it (the untouched roots identical, because the overridden chooser still
consumes its draw); the delta card reports the DM's fields.
```

### (a) ⛔ GATE ONE — THE DECISION-FORK REGISTRY DOES NOT SEE `src/generators`

```
$ sed -n '64,69p' tests/lint/chooserTotality.walker.test.js
const SCAN_ROOTS = Object.freeze([
  'src/domain/worldPulse',
  'src/domain/spatial',
  'src/domain/traditions',
  'src/domain/region',
]);
$ grep -o "module: *'[^']*'" src/domain/worldPulse/habitForkRegistry.js | sort -u | wc -l
32   (every one under src/domain/worldPulse, /spatial, /traditions or /region)
$ grep -c "generators" src/domain/worldPulse/habitForkRegistry.js
0
```

The registry (`HABIT_FORK_REGISTRY`, 43 rows, minted by HB-1) is the SIMULATION's, and its own
header says so: *"Every weighted decision fork in `src/domain` is classified here."* **Not one row
names a `src/generators` module, and `src/generators` is not a scan root.** So the root choosers
of the four card kinds are UNREGISTERED, and the chair's instruction "find the choosers through
the decision-fork classification registry" cannot be executed at this base. Design §14 itself
makes this a prerequisite, not a detail: *"a chooser without a registry row is registered first
or its field is dropped."* **Registering generation's choosers is a wave before EM-A1, not a
clause inside EM-B2.**

The chair's second locator does not close the gap either:

```
$ git grep -n "createPRNG(" -- src/generators | wc -l
6                    (in 4 files: crossSettlementConflicts.js, generateSettlementPipeline.js,
                      pipeline.js, power/economyReconciliation.js)
$ git grep -c "rng(" -- src/generators | awk -F: '{s+=$2} END {print s}'
74                   (across 19 files)
```
Generation threads ONE rng down through `runPipeline(initialContext, rng, options)`
(`src/generators/pipeline.js:152`); the choosers are 74 `rng(` draw sites in 19 files, not
`createPRNG(` sites. The entropy census (`tests/lint/entropyRootCensus.walker.test.js`) enumerates
rng ROOTS, not choosers — its one generators row is `NC-1
src/generators/power/economyReconciliation.js`, "a generator STEP-RNG fork seed".

### (b) ⛔⛔ GATE TWO — LAYER KEYS CANNOT BE STABLE: NO CARD KIND HAS A STABLE ID

The chair: *"if ids are minted from the PRNG stream, a regeneration with the same seed re-mints
the same ids... prove it or the packet is BLOCKED."* Measured, **none of the four card kinds mints
an id from the PRNG stream**:

```
$ sed -n '1629,1633p' src/generators/npcGenerator.js
  // Assign sequential IDs
  npcs.forEach((npc, idx) => {
    npc.id = `npc_${idx + 1}`;
  });
```
**NPC — POSITIONAL.** The id is the array INDEX, not a draw and not content.

```
$ git grep -n "\bid:" -- src/generators/steps/assembleInstitutions.js
701:      id: `repair.${generationRepairs.length + 1}`,      (a repair row only)
$ git grep -n "institutions.find(\|findIndex(i => i.name" -- src/generators/steps/assembleInstitutions.js | head -3
285:  const existingIdx = institutions.findIndex(i => i.name === existingName);
426:  const existing = institutions.find(i => i.name === instName);
492:  const existing = institutions.find(i => i.name === instName);
```
**INSTITUTION — BY NAME.** There is no general id mint; identity is the display name, which
design §12.3 makes a `free-cascade` field the DM may change.

```
$ git grep -n "id: *\`faction" -- src/generators
src/generators/density/densityAscension.js:142:      id: `faction.${slug(name)}`,
```
**FACTION — DERIVED FROM THE NAME.** A rename changes the id. **POWER SEAT** references an
npc or a faction and inherits both defects.

**The estate has already convicted this class, three times, in its own comments:**

```
$ git grep -n "npc_3\|npc_6 -> npc_8" -- src/domain | head
src/domain/locksPreservation.js:228: * moment a locked `npc_3` survives, `npc_3` may name somebody else and the lock
src/domain/npc/characterDrift.js:17:  * orphan, it REBINDS — a keeper moved npc_6 -> npc_8 while `npc_6` came to name a
src/domain/npc/characterEdit.js:51:  *    (`generators/npcGenerator.js` stamps `npc_${idx+1}`), and a preserved
src/domain/npc/characterEdit.js:53:  *    while `npc_3` came to name a different person. Every id-keyed SIDECAR is
```

**Why this is fatal rather than awkward.** Design §14 puts the ROSTERS in the editable set —
*"the rosters themselves (which institutions, NPCs and factions exist — additions and removals are
roster roots)"*. A roster root edit is precisely what shifts every later index and re-slugs every
renamed faction, so the layer key `npc:npc_3:role` silently comes to name a different person and
`faction.iron_guild` stops resolving the moment the DM renames the guild. Under the amended
mechanism the layer is consulted at the chooser on EVERY regeneration, so a mis-keyed layer does
not merely lose an edit — it applies the DM's value to the wrong entity, every time, forever.
**"Same seed + same layer = same world" cannot hold on this base.**

### (c) THE BUDGET, COUNTED — EM-B2 EXCEEDS IT EVEN IF BOTH GATES ARE CLEARED

Files holding root choosers for the four card kinds, measured:

| file | `rng(` draw sites | root fields it chooses |
|---|---:|---|
| `src/generators/npcGenerator.js` | 23 | npc name, role, disposition + the roster |
| `src/generators/steps/assembleInstitutions.js` | 0 direct (draws through helpers) | institution roster, class, standing |
| `src/generators/power/relationshipArchetypes.js` | 5 | faction archetype, stance |
| `src/generators/power/stressFactions.js` | 1 | faction roster, power share |
| `src/generators/power/rulingStructure.js` | 0 direct | the power seat's holder |
| `src/generators/pipeline.js` | (threads the single rng: `runPipeline(initialContext, rng, options)` :152) | the hook's host |

That is **five to six existing logic-bearing production files** before the orchestration
(`regenerateWithLayer`) and the delta section are counted, against the hard limit of **three**.
`PACKET_STANDARD.md`'s rule is not negotiable here — the packet STOPS AND SPLITS, and even the
split's B2a half does not fit until the chooser set is registered and bounded. The chair's own
row anticipated this ("splits into B2a ... and B2b ... if its budget demands").


---

## E14 · ⛔⛔ THE FINAL AMENDMENT (ODQ §934.44–§934.46, consist `7aa769830`) — THE PIPELINE MEASURED, AND THE SEAM DOES NOT EXIST

The chair's final mechanism is **re-derivation with pins**: `pinsFrom(record) → pins` and
`rederive(record, config′, layer) → record`, the derivation steps running with every chooser the
record holds PINNED. Gate (1): *"prove whether the deriving steps read the rosters from the
settlement object ... if any deriving step draws ... NAME IT ... and the packet STOPs with the
smallest measured one so a pipeline-seam packet can precede B2."* **The gate fires.**

### (a) THE PIPELINE, BY SYMBOL — 23 REGISTERED STEPS, RUN UNCONDITIONALLY

```
$ git grep -n "registerStep(" -- src/generators | wc -l
24     (1 definition at pipeline.js:93 + 23 registrations)
$ ls src/generators/steps/
assembleInstitutions assembleSettlement buildGenerationContext cascadePass coherenceRepairPass
corruptionPass economyReconcilePass factionCorrelationPass generateEconomy generateNarratives
generatePopulation generatePower index isolationPass neighbourFactions
powerEconomyReconcilePass resolveConfig resolveNeighbour resolveResources resolveStress
stepMetadata stressConfirmPass structuralValidationPass subsumptionPass
```

The runner, `export function runPipeline(initialContext, rng, options = {})`
(`src/generators/pipeline.js:152`), measured whole (`sed -n '152,210p'`):

```js
  const stepOrder = getStepOrder();
  const ctx = { ...initialContext };
  for (const name of stepOrder) {
    const step = _steps.get(name);
    const stepRng = rng.fork(name);          // per-step forked stream
    ...
      const patch = step.fn(ctx, stepRng);
      if (patch && typeof patch === 'object') Object.assign(ctx, patch);
    ...
  }
  return ctx;
```

**Every registered step runs, every time, with no condition.** And:

```
$ git grep -n "skip\|reuse\|existing\|pinned\|preserve" -- src/generators/pipeline.js
(no output)
```

⛔ **THERE IS NO PIN SEAM, NO SKIP BRANCH AND NO PRE-POPULATED-ROSTER PATH IN THE PIPELINE.**
`runPipeline` takes an `initialContext` and an `rng`; it takes no record. Nothing in the runner
can hold a chooser's output fixed.

⭐ ONE FACT IN THE MECHANISM'S FAVOUR, recorded because it is the half that works: `rng.fork(name)`
gives each step its OWN stream, so releasing a pin inside one step cannot shift another step's
draws. The per-step determinism the amendment needs is already there; the pin plumbing is not.

### (b) ⛔ THE ROOT-WRITING STEPS RE-DRAW AND RE-MINT, UNCONDITIONALLY

```
$ for f in src/generators/steps/*.js; do n=$(grep -c "rng(" $f); [ "$n" != 0 ] && echo "$f $n"; done
(no output — ZERO direct rng( draws in any step file)
```
The steps delegate; the draws live in the generator modules the steps call. The root-writing one:

```
$ git grep -n "generateNPCs" -- src/generators/steps
src/generators/steps/generatePopulation.js:11:import { generateNPCs, generateRelationships } from '../npcGenerator.js';
src/generators/steps/generatePopulation.js:63:  const npcs = generateNPCs(
$ sed -n '63,70p' src/generators/steps/generatePopulation.js
  const npcs = generateNPCs(
    { tier, institutions, powerStructure, economicState },
    culture, effectiveConfig, generationContext, densityMassTarget,
  );
  const relationships = generateRelationships(npcs, effectiveConfig, institutions);
  const factions = generateFactions(npcs, relationships);
```

`generateNPCs` is called **unconditionally**, takes **no roster argument**, and re-mints ids
positionally every run (`npcGenerator.js:1631`, `npc.id = \`npc_${idx + 1}\``; 23 `rng(` draw
sites in that file). `generateRelationships` and `generateFactions` then derive FROM the freshly
drawn roster in the same step. So `generatePopulation` is simultaneously ROOT-WRITING and
DERIVING, and the two halves are not separable at any existing seam.

**Gate (2) therefore fails on its own terms:** the pipeline does NOT accept a pre-populated
roster, and it DOES re-mint ids. Entity ids cannot "come from the record" because no step reads
a record.

### (c) THE SMALLEST MEASURED CONTRADICTION, stated once

> `runPipeline(initialContext, rng, options)` (`src/generators/pipeline.js:152`) runs all 23
> registered steps unconditionally against a context it builds from config alone; it accepts no
> record, and the module contains no skip, reuse, pin or preserve branch. `generatePopulation`
> calls `generateNPCs(...)` with no roster parameter, and `generateNPCs` re-mints
> `npc.id = \`npc_${idx + 1}\`` positionally on every run.
>
> Therefore `rederive(record, config′, layer)` has no seam to attach to at this base, and
> `pinsFrom(record)` has nothing to hand its pins to.

**This is exactly the case the chair pre-ruled: a PIPELINE-SEAM PACKET PRECEDES EM-B2.** That
packet's job is to give `runPipeline` a pin parameter and to split `generatePopulation`'s
root-writing half from its deriving half — a generator-architecture change with the golden master
as its own proof, and the owner's to authorize (it reshapes the one engine THE PROMISE rests on).

### (d) GATE (4) — THE CULTURE FACT, COUNTED

```
$ git grep -l "culture" -- src | wc -l                      145
$ git grep -l "culture" -- src/generators | wc -l            21
$ git grep -l "culture" -- src/domain/display src/pdf | wc -l 15
$ git grep -c "culture" -- src/generators/steps | sort -t: -k2 -rn | head -6
src/generators/steps/resolveConfig.js:18
src/generators/steps/assembleSettlement.js:6
src/generators/steps/buildGenerationContext.js:4
src/generators/steps/generatePopulation.js:3
src/generators/steps/economyReconcilePass.js:3
src/generators/steps/stepMetadata.js:2
```

**145 files in `src/` read `culture`**, 21 of them in `src/generators` and 15 in
`display` + `pdf`. Inside the pipeline it is read at the CONFIG-RESOLUTION step
(`resolveConfig.js`, 18 reads) and at `buildGenerationContext.js`, i.e. UPSTREAM of every
chooser — so a `config′` culture change re-derives essentially the whole world, and the naming
culture feeds `generateNPCs` directly (`generatePopulation.js:65` passes `culture`). The chair
predicted this fact would bite; measured, it is the widest of the world facts and it is the one
whose change cannot be bounded to "only the derivations move" without a named boundary. It is
recorded, not adjudicated.

### (e) THE BUDGET, AND THE SPLIT — with figures

Even granted the seam, the work spans: `src/generators/pipeline.js` (the pin parameter),
`src/generators/steps/generatePopulation.js` (the root/derive split), `npcGenerator.js`,
`steps/assembleInstitutions.js`, `power/relationshipArchetypes.js`, `power/stressFactions.js`,
`power/rulingStructure.js`, `src/domain/regenerationDelta.js`, plus the store's regeneration path
— **nine existing logic-bearing production files against a hard limit of three.**

**The ordering this lane proposes (a proposal, never a decision):**

| # | Packet | Scope | Existing logic files |
|---|---|---|---:|
| 0 | **EM-P0 — the pipeline seam** (NEW, owner-gated) | `runPipeline` gains a pins parameter; `generatePopulation` splits root-writing from deriving; the golden master is the proof | 2 |
| 0b | **EM-P1 — stable entity identity** (NEW, owner-gated) | ids for the four card kinds that survive a roster edit and a rename | 2–3 |
| 0c | **EM-P2 — register generation's choosers** (NEW) | the decision-fork registry's scan roots grow to `src/generators`; the root choosers get their rows | 1 + the walker |
| 1 | **EM-B2a** | `pinsFrom` + `rederive` over the four card kinds + the isolation property | 2 |
| 2 | **EM-B2b** | `config′` world-fact changes + the delta section | 2 |

Items 0, 0b and 0c are all prerequisites of EM-A1 as well, since §14 final reads the declarations
from the registry.

### (f) WHAT DID NOT CHANGE UNDER THIS AMENDMENT

The verified base stays `d31af2cee` with its J-T1 measurements (the chair re-pins at promotion);
`tests/property/dmLayerGoldenIsolation.test.js` still owes its
`scripts/mutation-coverage-manifest.json` row; the lighting census still moves by the packet's
TEST files only (`EM-B2.evidence.md` §E7a); and per the chair's K3 ruling the
`EXPLAINED_WRITER_EXEMPTIONS` mint for `dmLayer on settlement` is priced in EM-B2 as the chair's
own REGISTER row — noting that gate 0 (`assertExplainedWriterEvidence`, `check-observed-shape-readers.mjs:1345`)
requires the named `src/**` writer to actually write the key, so the row can only be minted at or
after the commit that writes it.
