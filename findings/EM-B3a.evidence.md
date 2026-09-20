# EM-B3 — COMPILE EVIDENCE (lane EM COMPILE P4, letter `d`, chair session 923472dc)

Every fact the packet asserts, with the command that proved it and its output. A fact
with no command here is not a verified fact and does not appear in the packet.

- **Worktree:** `$SP/consist` with `SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
- **Verified base:** `fixes-2026-09-18-consist` @ `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Compiled:** 2026-09-19, 11:02–11:2x EDT (`date` read in the same command as each stamp below)

---

## E0 · Base confirmation, and the HEAD that moved under the lane

```
$ date; git -C $SP/consist rev-parse HEAD; git -C $SP/consist rev-parse --abbrev-ref HEAD
Sat Sep 19 11:02:27 EDT 2026
d31af2ceebf643818201b2e2ab4a556765d2fc7c
fixes-2026-09-18-consist
```

The base printed exactly as the brief requires. **It then moved twice while the lane
measured** — both times by the chair, both times docs-only for this packet's surface:

```
$ date; git -C $SP/consist rev-parse HEAD
Sat Sep 19 11:15:58 EDT 2026
023085560682e98d719e88533e713a67f9b5dc37

$ git log --oneline d31af2cee..HEAD
023085560 DOC: the phantom consequence rule folds onto the build branch (design §13, the ARCH's phantom/Op/tick rows, the charter's EM-F1 row; ODQ §934.43)
7a0fe5889 The generation worker's ceiling re-mints exact at 1,399,946 B, attributed per module to the sacred-house layout derivation (§934.19 addendum; vetoable)
34f320829 The preview persona's env file is development-scoped and ignored: .env.*.local
02968876b DOC: the EM family packet preamble — the settlement editor's invariants signed once (ODQ §934.36–§934.42; design §12 governs)

$ git diff --stat d31af2cee..HEAD
 .gitignore                                      |  3 +
 docs/ARCH_EDIT_MODE_AND_DECREES.md              |  8 ++-
 docs/DESIGN_EDIT_MODE_AND_DECREES.md            | 21 +++++++
 docs/implementation/charters/EDIT-MODE-TRAIN.md |  2 +-
 docs/implementation/preambles/EM-PREAMBLE.md    | 80 +++++++++++++++++++++++++
 tests/build/generationWorkerLazy.test.js        |  8 ++-
 6 files changed, 117 insertions(+), 5 deletions(-)
```

**Every path this packet measures is byte-identical across the whole window** — proved by
blob sha, not by reading the diffstat:

```
$ for f in <28 measured paths>; do a=$(git rev-parse d31af2cee:$f); b=$(git rev-parse HEAD:$f); [ "$a" = "$b" ] && echo "SAME  $f" || echo "DIFF  $f  $a -> $b"; done
SAME  src/store/persistProjection.js          SAME  src/store/persistMerge.js
SAME  src/domain/display/publicSafe.js        SAME  src/domain/display/worldSnapshotPublic.js
SAME  src/lib/importScrub.js                  SAME  src/lib/saves.js
SAME  src/lib/accountData.js                  SAME  src/lib/accountImport.js
SAME  src/lib/worldExport.js                  SAME  src/data/sampleSettlements.js
SAME  src/domain/normalizeSettlement.js       SAME  src/domain/ai/personaSlicer.js
SAME  scripts/check-observed-shape-readers.mjs SAME scripts/.observed-shape-readers-baseline.json
SAME  scripts/.test-ratchet-baseline.json     SAME  tests/store/lifecycleRoundTrip.test.js
SAME  tests/security/snapshotDenylistDrift.test.js   SAME tests/security/worldSnapshotDenyCensus.test.js
SAME  tests/security/townMapEditsPublicDrop.test.js  SAME tests/lib/importScrub.test.js
SAME  tests/lib/worldExport.test.js           SAME  tests/helpers/sourceContract.js
SAME  tests/lint/.lighting-census-baseline.json
SAME  supabase/migrations/136_world_snapshot_deny_census_lift.sql
SAME  docs/implementation/PACKET_STANDARD.md
DIFF  docs/ARCH_EDIT_MODE_AND_DECREES.md  15274dd9f -> a7f5fc6ba
DIFF  docs/DESIGN_EDIT_MODE_AND_DECREES.md 7ac136cae -> 6ea98c7d2
DIFF  docs/implementation/charters/EDIT-MODE-TRAIN.md ecac8ca0f -> 56d87c73d
```

The three moved authority docs were diffed line by line: the ARCH's `phantoms.js` row,
its `Op` typedef (`stage?: 'home'|'off-stage'`) and §6's off-stage sentence, the charter's
**EM-F1** row, and a purely additive design **§13**. **No row this packet cites moved** —
ARCH §1's `persistProjection` row, ARCH §3, ARCH §4, the charter's **EM-B3** row and
design §5 / §11 / §12.4 are byte-unchanged inside those files.

Ruling taken: the packet's **verified base stays `d31af2cee`** (the sha the launch message
pinned and the sha every measurement below was executed at). The chair may re-stamp it to
the current tip under `PACKET_STANDARD.md`'s docs-only-descendant clause (**J-T1**) without
re-measuring anything here, and **should**, because `docs/implementation/preambles/EM-PREAMBLE.md`
is only a COMMITTED file from `02968876b` onward — at `d31af2cee` the preamble the header
cites was an uncommitted working-tree file.

**Lane hygiene note, recorded rather than hidden:** one measurement (E7) needed eslint's own
`Linter`, which resolves only from the worktree's `node_modules`. The lane copied its probe
to `$SP/consist/node_modules/.__lane_d_m2.mjs`, ran it, and deleted it in the same command.
`git -C $SP/consist status --porcelain` printed **empty** immediately afterwards; no tracked
path was touched. Later probes were written only under `$SP/lane-em-d-scratch/`.

---

## E1 · `partializeStoreState` and the persist projection's key handling

```
$ sed -n '245,284p' src/store/persistProjection.js
export function partializeStoreState(state) {
  const { settlement = null, lastSeed = null } = state || {};
  return {
    config: state.config,
    configExplicitFields: state.configExplicitFields,
    institutionToggles: state.institutionToggles,
    categoryToggles: state.categoryToggles,
    goodsToggles: state.goodsToggles,
    servicesToggles: state.servicesToggles,
    displayPrefs: state.displayPrefs,
    advanceAutoResolve: state.advanceAutoResolve,
    anonDraft: state.auth?.user == null && state.draftOrigin === 'anon' && settlement
      ? { settlement, lastSeed }
      : retireOrKeepStoredDraft(settlement, lastSeed, state.retiringDraftIdentity),
  };
}
```

**MEASURED:** the projection is **device-local** (`PERSIST_KEY = 'settlementforge'`,
localStorage, `src/store/index.js` `partialize: partializeStoreState`). It carries **nine**
top-level keys and **no `saveId` is in scope anywhere in the file**:

```
$ grep -c 'saveId' src/store/persistProjection.js
0
```

The one world it persists is the **anonymous draft**, written under exactly one rule
(file header, lines 40–43): `state.draftOrigin === 'anon' && auth.user == null`, and
written **WHOLE** ("The whole settlement is persisted, not a projection of it. A restored
draft must be byte-identical to the one generated", lines 117–120).

## E2 · Where a SAVE's settlement keys actually persist

```
$ sed -n '156,158p' src/lib/saves.js
  if (entry.settlement !== undefined) {
    row.data = entry.settlement;
    row.neighbour_links = entry.settlement?.neighbourNetwork || null;
```

**MEASURED:** the whole settlement blob is the `data` column. Confirmed by the two landed
precedents for a library-only settlement-record key:

```
$ git grep -n "mapEdits" -- src/store src/lib | head
src/store/operationRegistry.js:314:  // (`settlement.mapEdits`: nudges / layout-variant reroll / legend prefs / bespoke styles)
src/store/settlementSlice.js:1686:   * §763.1). It was the SM-3 persist triple for the blob-resident `settlement.mapEdits`,
```
Neither `mapEdits` nor `fogSessions` appears in `partializeStoreState` or in
`ZUSTAND_PERSIST_KEYS`; both ride the blob.

## E3 · The persisted-key instrument, by its REAL path

```
$ git grep -n 'ZUSTAND_PERSIST_KEYS' -- tests src scripts
src/store/campaignWorldPulseSlice.js:268:  // Registered in tests/store/lifecycleRoundTrip.test.js ZUSTAND_PERSIST_KEYS. It is
src/store/displayPrefsSlice.js:52: *                tests/store/lifecycleRoundTrip.test.js ZUSTAND_PERSIST_KEYS.
tests/store/lifecycleRoundTrip.test.js:141:const ZUSTAND_PERSIST_KEYS = Object.freeze([
tests/store/lifecycleRoundTrip.test.js:692:      discovered, ZUSTAND_PERSIST_KEYS,
tests/store/lifecycleRoundTrip.test.js:1129:    const rePartialized = Object.fromEntries(ZUSTAND_PERSIST_KEYS.map((k) => [k, merged[k]]));
```

**REAL PATH:** `tests/store/lifecycleRoundTrip.test.js`, constant `ZUSTAND_PERSIST_KEYS`
(:141), enforced by the arm titled
`zustand persist: the partialize key list matches the registry exactly (source scan)` (:684),
which scans `persistProjection.js`'s return block for `(\w+):\s*state\.\w+` and asserts an
**exact set** against the registry. Its members are the nine keys of E1.

**REFUTATION.** `ARCH_EDIT_MODE_AND_DECREES.md` §3 says "the persisted-key instrument … its
key set grows by two". That instrument's key set is the **store-root zustand projection**.
`dmLayer` and `decrees` are **settlement-record** keys (design §2.5, §5; ARCH §3 first
sentence: "Two keys join the saved settlement record"), and the tree has **no settlement-blob
key registry at all** — `SAVE_ENVELOPE_LOCAL_KEYS` (:257) registers the save ENVELOPE, and
`SETTLEMENTS_DB_WRITER_COLUMNS` (:277) registers DB COLUMNS; neither enumerates blob keys.
Growing `ZUSTAND_PERSIST_KEYS` by two would mint two **store-root persisted keys** — a second
home for state the design places on the record, which is the STOP the preamble's §P4 names.

## E4 · `mergePersistedState`'s validation of persisted keys

```
$ sed -n '52,107p' src/store/persistMerge.js    (read whole; 107 lines)
```

**MEASURED:** `mergePersistedState` handles exactly `anonDraft`, `config`,
`configExplicitFields`, the four toggle maps, `displayPrefs`, and the derived
`settlement` / `lastSeed` / `draftOrigin`. It performs **no validation of any
settlement-record key** and imports nothing from the observed-shape register.

**REFUTATION.** ARCH §4's "`mergePersistedState` validates both against the observed-shape
exemptions" is unsupported: the function has no such arm and the register is a build-time
script (`scripts/check-observed-shape-readers.mjs`), not a runtime import.

## E5 · Unknown top-level settlement keys pass through normalization

```
$ grep -n 'export function normalizeSettlement' -A 20 src/domain/normalizeSettlement.js | sed -n '1,20p'
162:export function normalizeSettlement(settlement) {
178:  const out = { ...settlement };
```
Spread — unknown keys survive. The landed pin for this exact behaviour:
`tests/store/lifecycleRoundTrip.test.js:1917`
`a settlement blob still carrying the retired fogSessions key loads and is ignored`.

## E6 · The three hand-mirrored denylists, and what each already denies

```
$ node <probe>.mjs   # imports the live modules + tests/helpers/sourceContract.js
dmLayer PRIVATE: true  COVERT: false
decrees PRIVATE: false COVERT: false
dmlayer PRIVATE: true  COVERT: false
DmLayer PRIVATE: true  COVERT: false
PRIVATE source: (secret|private|\bdm|\bgm|guidance|dossierNotes|tabNotes|\bnotes?\b|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|latentPantheon|seed|_config)
COVERT  source: (covert|rngSeed|seed|rollExplanation|rollExplanations|diceDetail|explanation|preSnapshot|preWorldState|preRegionalGraph|preSaves)

NET-CURRENT scanner migration file: 136_world_snapshot_deny_census_lift.sql
JS_TOKENS count: 35
JS_TOKENS: ["covert","rngseed","seed","rollexplanation","rollexplanations","dicedetail","explanation","presnapshot","preworldstate","preregionalgraph","presaves","secret","private","dm","gm","guidance","dossiernotes","tabnotes","note","notes","plothook","plot_hooks","hook","compass","chronicle","pinnednpc","aidata","aisettlement","aidailylife","narrativenotes","identitymarkers","frictionpoints","connectionsmap","latentpantheon","_config"]
SQL_ALTS count: 33
SQL_ALTS: ["covert","rngseed","seed","rollexplanations?","dicedetail","explanation","presnapshot","preworldstate","preregionalgraph","presaves",".*secret.*",".*private.*",".*dm.*",".*gm.*",".*guidance.*",".*dossiernotes.*",".*tabnotes.*",".*notes?.*",".*plothook.*",".*plot_hooks.*",".*hook.*",".*compass.*",".*chronicle.*",".*pinnednpc.*",".*aidata.*",".*aisettlement.*",".*aidailylife.*",".*narrativenotes.*",".*identitymarkers.*",".*frictionpoints.*",".*connectionsmap.*",".*latentpantheon.*",".*_config.*"]
sqlDenies(dmlayer): true
sqlDenies(dmLayer): true
sqlDenies(decrees): false
sqlDenies(dm): true
sqlDenies(seed): true
```
(The probe is `$SP/lane-em-d-scratch/_m1.mjs`; it reproduces `tests/security/snapshotDenylistDrift.test.js`'s own
extraction — `netCurrentScannerSql`, `jsRegexTokens`, `sqlRegexAlternation`, `sqlDenies` — verbatim.)

**THE TWO FACTS THAT SHAPE THE PACKET:**
1. **`dmLayer` ALREADY joins all three mirrors** through `PRIVATE_KEY_RE`'s `\bdm` token and
   the SQL's `.*dm.*` alternative. It needs **no new token anywhere**; adding one would be the
   redundant second guard §P6's anti-vacuity rules refuse.
2. **`decrees` joins none of them.** Adding it to `PRIVATE_KEY_RE` **reds**
   `tests/security/snapshotDenylistDrift.test.js` (JS_TOKENS 35 → 36; `sqlDenies('decrees') === false`)
   unless the net-current SQL scanner is re-created with the token. **That is a migration.**

The drift test's own mechanism, quoted (`tests/security/snapshotDenylistDrift.test.js:78-84`):
`test.each(JS_TOKENS)('the net-current SQL sanitizer denies the "%s" key (membership)', …)`.

## E7 · The deep-denylist half is already closed at the ROOT by a fail-closed allowlist

```
$ sed -n '52,61p' src/domain/display/publicSafe.js   # PUBLIC_TOPLEVEL_KEYS, 39 frozen members
```
Neither `dmLayer` nor `decrees` is a member, so `toPublicSafe` default mode drops both by
construction (`:357` iterates the allowlist, never the source's own keys). The landed
precedent for exactly this pin is `tests/security/townMapEditsPublicDrop.test.js` (43 lines,
2 cases: `mapEdits is NOT an allowlisted top-level public key` / `the DEFAULT (fail-closed)
projection drops mapEdits but keeps allowlisted content`).

`toPublicSafe({ full: true })` **skips that gate** (`:244-345`) and deep-clones, stripping only
what it names: `aiData`, `aiDailyLife`, `dossierNotes`, `dmNotes`, `notes`, `narrativeNotes`,
`_seed`, `_regenSeed`, `_config`, `customContentRoster`, `customContentProvenance`,
`config.latentPantheon`, `config._seed`. **This is where `publicSafe` must "name them
explicitly"** (design §12.4) — an unnamed `dmLayer`/`decrees` rides a DM-full share.

## E8 · `worldSnapshotPublic`, and what naming them costs

```
$ grep -n '^export ' src/domain/display/worldSnapshotPublic.js
42:export const WORLD_SNAPSHOT_PUBLIC_SCHEMA_VERSION = 1;
66:export const WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST = Object.freeze(['pantheon']);
68:export const WORLD_SNAPSHOT_HARD_DENY = Object.freeze([...26 keys...]);
134:export const COVERT_KEY_RE = …
608:export function serializeWorldSnapshotPublic(worldState, regionalGraph, memberSettlements = [], opts = {}) {
670:export default serializeWorldSnapshotPublic;
```
Its census (`tests/security/worldSnapshotDenyCensus.test.js`) asserts only
`CONDITIONAL_LEDGER_KEYS − allowlist ⊆ HARD_DENY`, disjointness, and four named members —
**never an exact HARD_DENY set**. So adding two non-ledger keys reds nothing there.

Its three other readers were checked:
```
$ git grep -n 'WORLD_SNAPSHOT_HARD_DENY' -- src tests scripts
tests/domain/worldSnapshotPublic.test.js:132   for (const denied of WORLD_SNAPSHOT_HARD_DENY) expect(keys.has(denied)).toBe(false);
tests/domain/worldSnapshotPublic.test.js:280   (same, under a covert opt-in attempt)
tests/lib/worldExport.test.js:119              expect(serialized.includes(`"${key}"`)).toBe(false)   # the PLAYER export
```
All three are **absence** assertions over an allowlist-built output, so both new members are
satisfied by construction — and `worldExport.test.js:119` becomes a free third proof that the
player world export carries neither key.

## E9 · The three travel surfaces, measured

**FORK (sample fork).** `src/data/sampleSettlements.js:181 forkConfigFor(sample)` returns the
sample's config **minus `seed`**; `:166 forkSeedFor(sample, userId)` builds the generation
ARGUMENT. Both call sites (`src/components/generate/FoundingWorlds.jsx:95`,
`src/components/SettlementsPanel.jsx:161`) then run the generator with `intent: 'sampleFork'`
(`src/lib/generationIntent.js:32 GENERATION_INTENT_SAMPLE_FORK`). **A fork is a fresh
generation**, so it can carry neither key unless a generator writes one — and none does (E11).

**IMPORT.** `src/lib/importScrub.js` is, by its own header, "the SINGLE writer for the
imported-settlement dormancy strip", routed by **all three** import paths:
```
$ git grep -n 'scrubImported\|scrubGallery' -- src
src/store/galleryImportSettlement.js:71:    settlement: scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({
src/store/galleryImportMap.js:290:        settlement: scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({
src/lib/accountImport.js:617:  const settlement = scrubImportedTreasury({
```
The gallery paths' SOURCE is the server's public projection (`fetchDossierForImport`), which
already drops both keys by the top-level allowlist (E7). The account path's source is the
owner's own export file — so **the export is the seam**, which is what ARCH §3 says
("A personal backup export omits them under the same rule").

**GALLERY.** `toPublicSafe` (E7) + `serializeWorldSnapshotPublic` (E8). `src/lib/gallery.js`
never projects a settlement itself; the client reads server-sanitized rows.

**THE EXPORT.** `src/lib/accountData.js:206 preflightAccountExport` builds
`payload.settlements` from the store's saved settlements **verbatim** (`:340-348`), and
`:405 buildAccountExport` returns `preflight.value`. So a backup export would carry both keys
today. `src/lib/worldExport.js:112 buildWorldExport` needs **no change**: its player variant
routes through default `toPublicSafe` and its DM variant through `toPublicSafe({full:true})`,
so it inherits E7's cure for free.

**THE ANONYMOUS ENVELOPE.** Closed by E1's gate: an edited world is a SAVE, whose
`draftOrigin` is `'account'` (`tests/store/lifecycleRoundTrip.test.js:1417`
`opening a save from the library claims it, whatever origin its blob carries`), and case (a)
requires `'anon'`. No production change; a runtime case proves it.

## E10 · The observed-shape register — measured, and it does NOT move

```
$ python3 -c "...json.load(open('scripts/.observed-shape-readers-baseline.json'))..."
schema: 22   total: 1964   files in inventory: 387   frozenAtSha: 31ab5d18bdd44ba0691c2e16f3ae8f3cfef36eb1

src/domain/display/publicSafe.js         -> {'covert on settlement': 1}
src/domain/display/worldSnapshotPublic.js-> ABSENT
src/lib/accountData.js                   -> ABSENT
src/lib/importScrub.js                   -> ABSENT
src/store/persistProjection.js           -> ABSENT
src/lib/saves.js                         -> {'_seed on config': 1, 'neighbourNetwork on settlement': 2}

--- rows naming decrees / dmLayer ---
src/domain/ai/personaSlicer.js  appliedDecrees on settlement  1
src/domain/ai/personaSlicer.js  decrees on settlement         1
```

```
$ grep -n 'decrees' src/domain/ai/personaSlicer.js
172:    decrees: (home?.appliedDecrees || home?.decrees || []).slice(0, 6),
```

**FOUR MEASURED CONSEQUENCES.**
1. `decrees on settlement` is **already a banked identity** (count 1, `personaSlicer.js`).
   `dmLayer on settlement` does not exist yet.
2. `publicSafe.js` carries **exactly one** row (`covert on settlement`, the `value.covert === true`
   read at `:148`) and **none** for its thirteen `delete clone.<key>` statements — so a
   `delete clone.dmLayer` / `delete clone.decrees` adds **no** inventory row.
3. `importScrub.js` is ABSENT from the inventory although it names five keys — because its
   drops are **destructure-drops** (`const { _seed, … , ...rest } = config`). The same spelling
   in `accountData.js` therefore adds **no** row.
4. Therefore **EM-B3 moves the observed-shape register by ZERO rows**, and owes **no**
   `EXPLAINED_WRITER_EXEMPTIONS` mint. The mint is earned by the first `src/domain/edit/**`
   READER — `dmLayer.js` (EM-B2, `dmLayer on settlement`, a growth ⇒ mint) and `registry.js`
   (EM-C1, `decrees on settlement` 1 → 2, a growth ⇒ mint).

The door's shape, for the chair who executes the mint later:
```
$ sed -n '1262,1276p' scripts/check-observed-shape-readers.mjs
const EXPLAINED_WRITER_MECHANISMS = Object.freeze(['save-time-writer','closed-ingest','admission-list', … 'conditional-generator-branch']);
$ sed -n '1290,1325p'  # assertExplainedWriterExemptions
  fields must be exactly 'identity,mechanism,ruling,why,writer'
  identity must match /^\S+ on \S+$/ and be unique
  writer must match /^src\// and /\.(js|jsx)$/
  why must be ≥ 40 chars; ruling passes assertExplainedWriterReason
$ sed -n '2926p'
  throw new Error(`observed-shape --migrate-schema=${BASELINE_SCHEMA} requires --write and a nonempty --migration-review=<bundle.json>`);
```
The nearest landed precedent row is `neighbourNetwork on settlement` / `save-time-writer` /
`src/lib/saves.js` (`:1170-1179`) — the same class `dmLayer`/`decrees` will take.

## E11 · Neither key exists anywhere in the tree today

```
$ git grep -n '\bdmLayer\b' -- src tests scripts supabase
(no output)
$ git grep -n '\bdecrees\b' -- src tests scripts supabase | head
scripts/.observed-shape-readers-baseline.json:331:   "decrees on settlement": 1,
src/components/map/AdvanceReport.jsx:317,325,326,333,334,340,341,342,395   # a LOCAL view-model field, not a settlement key
```

## E12 · Effective lines (eslint's own `Linter`, `max-lines` `{skipBlankLines:true, skipComments:true}`)

```
src/store/persistProjection.js                       effective: 42     raw: 285
src/domain/display/publicSafe.js                     effective: 132    raw: 490
src/domain/display/worldSnapshotPublic.js            effective: 332    raw: 671
src/lib/importScrub.js                               effective: 39     raw: 168
scripts/check-observed-shape-readers.mjs             effective: 2107   raw: 3364
tests/store/lifecycleRoundTrip.test.js               effective: 1315   raw: 1988
tests/security/snapshotDenylistDrift.test.js         effective: 43     raw: 86
tests/security/townMapEditsPublicDrop.test.js        effective: 19     raw: 43
```
(`src/lib/accountData.js` measured separately at 527 raw.)

**HOT FILES:** the standing list is `EconomicsTab.jsx` (600/600), `OutputContainer.jsx` (599/600),
`convergence.js` (798/800), `peaceTerms.js` (797/800), `informationStatecraft.js` (780/800).
**No file in this packet's manifest is on it.** The applicable layer ceiling is 800 effective
for `src/domain/**` and `src/**` (eslint.config.js `:712`, `:741`); the largest file touched is
`worldSnapshotPublic.js` at **332 / 800 — 468 lines of headroom**. None carries a
`scripts/.size-baseline.json` entry:
```
$ python3 -c "... 'src/domain/display/publicSafe.js' in baseline ..."   →  no HIT for any target
```

## E13 · Census and ratchet posture

```
$ cat tests/lint/.lighting-census-baseline.json
measuredAtSha: e5a27a1a5e83569e198ab36e0879ee70fdaefe8a   measuredBy: the chair (Fable 5.1, session 923472dc)
files 2645 · parked 383 · credited 2262 · titles 25009 · suiteTitles 6670
```
An exact-equality tuple ⇒ **two new test files force an INTERIOR RED by construction**
(`PACKET_STANDARD.md`, "Train landings"). Predicted, from the packet's own literal title plan:
**files 2645→2647 · parked 383→383 · credited 2262→2264 · titles 25009→25017 (+8) · suiteTitles 6670→6674 (+4)**.

```
$ python3 -c "...scripts/.test-ratchet-baseline.json..."
measuredAtSha 48929d82d939f06a1cfe89335e7a355483c27690 · totalTests 32771 · totalFiles 2518 · skippedCeiling 1
$ grep -n 'SCOPE_FLOOR_RATIO' scripts/check-test-ratchet.mjs   # :1387, :1407 — a FLOOR, not an equality
```
⇒ **adding test files does not move the test ratchet.**

```
$ grep -n "tests/lint" tests/lint/mutationCoverage.shared.mjs
37:  'tests/lint',
```
⇒ this packet adds **no** `tests/lint/` file, so **no** `scripts/mutation-coverage-manifest.json`
row is owed.

## E14 · Change-path reservation (the §45.2 status-sequence question)

```
$ python3 -c "...PACKET_MANIFEST.json..."
rows naming any target path: [('H26','LANDED','MODIFY','scripts/check-observed-shape-readers.mjs'),
                              ('AO-0','LANDED','MODIFY','scripts/check-observed-shape-readers.mjs')]
non-terminal packets in the manifest: []
migration rows >= 200: []
```
⇒ **zero** change paths are reserved by a live packet; `publicSafe.js`, `worldSnapshotPublic.js`
and `accountData.js` have never appeared in any packet's `changeManifest`.
`supabase/migrations/` runs to `201_staff_unlock_surveyor_entitlement.sql`, so **202 is free**.
Landed migration precedent for a packet CREATE row: `TM-2A` (196), `WEB-1` (197), `WEB-2` (198), `WEB-3` (199).

## E15 · Required-symbol resolution (every row of the manifest, proved)

```
$ grep -n '<anchor>' <file>
src/store/persistProjection.js:245   export function partializeStoreState(state) {
src/domain/display/publicSafe.js:101 export const PRIVATE_KEY_RE = /(secret|private|\bdm|…)/i;
src/domain/display/publicSafe.js:52  export const PUBLIC_TOPLEVEL_KEYS = Object.freeze([
src/domain/display/publicSafe.js:244 export function toPublicSafe(settlement, { full = false, memberOverrides = null } = {}) {
src/domain/display/worldSnapshotPublic.js:134 export const COVERT_KEY_RE = /(covert|rngSeed|…)/i;
src/domain/display/worldSnapshotPublic.js:68  export const WORLD_SNAPSHOT_HARD_DENY = Object.freeze([
src/domain/display/worldSnapshotPublic.js:608 export function serializeWorldSnapshotPublic(worldState, regionalGraph, memberSettlements = [], opts = {}) {
src/lib/accountData.js:206           export function preflightAccountExport(state = {}) {
src/lib/accountData.js:405           export function buildAccountExport(state = {}) {
src/lib/saves.js  (saves service)    row.data = entry.settlement                      (:157)
src/lib/importScrub.js:87            export function scrubImportedTreasury(settlement) {
src/store/persistMerge.js:52         export function mergePersistedState(persistedState, currentState) {
src/domain/normalizeSettlement.js:162 export function normalizeSettlement(settlement) {
src/data/sampleSettlements.js:181    export function forkConfigFor(sample) {
src/data/sampleSettlements.js:166    export function forkSeedFor(sample, userId) {
src/lib/worldExport.js:112           export function buildWorldExport(world, options = {}) {
scripts/check-observed-shape-readers.mjs:1140 export const EXPLAINED_WRITER_EXEMPTIONS = Object.freeze([
```

```
$ for f in tests/store/decreeRegistryPersistence.test.js tests/lib/editTravel.test.js src/domain/edit/dmLayer.js; do git cat-file -e HEAD:$f 2>/dev/null && echo EXISTS $f || echo ABSENT $f; done
ABSENT tests/store/decreeRegistryPersistence.test.js
ABSENT tests/lib/editTravel.test.js
ABSENT src/domain/edit/dmLayer.js
```
⇒ the two TEST targets are absent (correct for CREATE), and **EM-B2 has not landed**, which is
the packet's named dependency.

## E16 · Test precedents whose SHAPE this packet copies

| Proof shape | Path | describe / it |
|---|---|---|
| public-drop pin for a library-only settlement key | `tests/security/townMapEditsPublicDrop.test.js` | `SM-3 — mapEdits is dropped from the public projection` › `mapEdits is NOT an allowlisted top-level public key` |
| save → list → writeAll → list byte-exact fixpoint | `tests/store/lifecycleRoundTrip.test.js` | `E-C saves envelope — the local substrate…` › `save → list → writeAll → list is a byte-exact fixpoint (the reload/import hop)` |
| retired-key pass-through tolerance | `tests/store/lifecycleRoundTrip.test.js` | `a settlement blob still carrying the retired fogSessions key loads and is ignored` |
| anchored negative over a real allowlist | `tests/store/lifecycleRoundTrip.test.js:1937` | `expectAbsentWithAnchor([...PUBLIC_TOPLEVEL_KEYS], 'fogSessions', 'spatialLayout', …)` |
| a settlement-level import/export strip, incl. reference-identity | `tests/lib/importScrub.test.js` | `W-COIN A1.8 — scrubImportedTreasury: imports arrive COINLESS` › `is REFERENCE-IDENTICAL when there is nothing to strip` |
| a deep string scan of a whole export payload | `tests/lib/worldExport.test.js` | `buildWorldExport — THE PLAYER VARIANT LEAKS NOTHING COVERT (load-bearing)` |

---

## E17 · The measured contradictions this compile hands the chair

**K1 — the charter's `M src/store/persistProjection.js` row and ARCH §3's
"the persisted-key instrument … grows by two" are REFUTED.** Smallest contradiction:
`partializeStoreState` (`persistProjection.js:245`) is the **device-local** projection; it has
no `saveId` (`grep -c saveId` → **0**); its key set is pinned by `ZUSTAND_PERSIST_KEYS`
(`lifecycleRoundTrip.test.js:141`); and the two landed settlement-record keys of the same class
(`mapEdits`, `fogSessions`) appear in **neither**, riding `row.data = entry.settlement`
(`saves.js:157`) instead. ⇒ this packet names `partializeStoreState` in `requiredSymbols`
(a PRESERVE) and **does not modify the file**. Adopting the charter's row literally would mint
two store-root persisted keys and take the packet to **four** existing logic files, over the
budget's three.

**K2 — `decrees` cannot join the client denylist without a MIGRATION.** Smallest contradiction:
`PRIVATE_KEY_RE.test('decrees') === false` and `sqlDenies('decrees') === false`, while
`snapshotDenylistDrift.test.js:78` asserts **every** client token is denied by the net-current
SQL scanner. ⇒ design §12.4 is not satisfiable client-only; the packet prices
`supabase/migrations/202_edit_registry_public_denylist.sql`. A migration is an owner-gated
class, and this repository records the gate in the very file being edited
(`publicSafe.js:299-305`: *"THE SERVER TWIN IS NOT LANDED AND IS OWNER-GATED … a migration and
belongs on the owner's desk"*). **The chair or the owner must rule before this row is written.**

**K3 — the charter's `scripts/check-observed-shape-readers.mjs` REGISTER row is not EM-B3's.**
Measured at E10: the register moves by **zero** rows for this packet's spellings, and the mint
is earned by EM-B2 (`dmLayer on settlement`, new) and EM-C1 (`decrees on settlement`, 1 → 2).
Naming a REGISTER row this member does not earn would be a false claim under §P2.3.

**K4 — `dmLayer` needs no denylist edit at all** (E6). Design §12.4's "both keys join the three
hand-mirrored denylists" is **already true for `dmLayer` at the base**. The packet records the
measurement rather than adding a redundant token.

---

## E18 · The manifest's own shape, measured against `validate:packets`

Three rules were read out of the validator rather than guessed, and each changed the manifest
this lane emitted:

```
$ sed -n '692p' scripts/implementation-packets.mjs
      if (localChangePaths.has(row.path)) addError(errors, `${idLabel} contains duplicate change path: ${row.path}`);

$ python3 -c "...count packets with a duplicated changeManifest path..."
packets with duplicate changeManifest paths: 0 of 182
```
⇒ the two `publicSafe.js` seams (`PRIVATE_KEY_RE` and `toPublicSafe`'s full branch) are **ONE**
`MODIFY` row with both regions named in its note, not two rows.

```
$ sed -n '709,711p' scripts/implementation-packets.mjs
      if (row.action !== 'CREATE' && !fileExists(rootDir, row.path)) {
        addError(errors, `${at}.path does not exist for ${String(row.action)}: ${row.path}`);
      }
```
⇒ a `TEST` or `REGISTER` row whose path is absent at the base is a **validation error**. The two
new test files and the new migration therefore take `CREATE`. The estate's own usage agrees:
```
$ python3 -c "...actions used on tests/ paths..."
Counter({'TEST': 287, 'CREATE': 134, 'MODIFY': 112, 'REGISTER': 7})
CREATE examples: AO-2+3 tests/lint/newsVoiceContract.walker.test.js · TC-3A tests/domain/townCartographyWards.test.js · SC-1 tests/components/surveyorProposalCard.test.jsx
```

```
$ python3 -c "...key shapes across every changeManifest row..."
Counter({('action','path'): 947, ('_note','action','path'): 281, ('action','path','retiredBy'): 97, ('_note','action','path','retiredBy'): 60})
rows carrying symbol: 0
```
⇒ the per-row note goes in `_note` (281 landed rows use it); **no** row in the estate carries a
`symbol` key, so this manifest carries none either. The by-symbol navigation lives in the
packet's §5 and §7 tables, which is where the standard puts it.

```
$ sed -n '977,982p' scripts/implementation-packets.mjs
  const symbolEvidence = requiredSymbols.map((row) => {
    const source = readRepositoryFile(rootDir, row.path);
    const excerpt = extractSymbolExcerpt(source, row.symbol);
    if (!excerpt) throw new Error(`required symbol disappeared: ${row.path} :: ${row.symbol}`);
```
⇒ `requiredSymbols` resolution is a substring match at the row's path. **All 26 rows were
executed:**
```
$ while IFS='|' read -r p s; do grep -qF -- "$s" "$p" && echo "OK $p :: $s" || echo "MISS …"; done <<'…'
OK  (26 of 26 — zero MISS)
```
and every one is a **PRESERVE**: not one names a symbol this deliverable creates
(`withoutEditState`, the migration function's new body, the two test files' titles are named
**nowhere** in the manifest until the flip to LANDED, per `PACKET_STANDARD.md`'s §101.4 rule).

Cross-packet reservation, re-checked against the live manifest at this base (E14): zero
non-terminal packets, so **no** change path is reserved; `supabase/migrations/` runs to
`201_staff_unlock_surveyor_entitlement.sql`, so `202` is free.

---

## E19 · THE SPLIT — the chair's K2 addition, priced by execution

The chair accepted K1/K2/K3, ruled K4, and added to EM-B3's charge: *"the migration must ALSO
register in the rehearsal train … price those as REGISTER/DOC rows; if that takes the packet
over budget, STOP AND SPLIT."* Priced from the chair's own two cars, both ancestors of the base.

```
$ git rev-parse HEAD          # the rulings landed
7aa76983045acee4fff5e9b657727ac4771d1a42
$ grep -n 'EM-B3' docs/implementation/charters/EDIT-MODE-TRAIN.md
16:| **EM-B3** the registry key + travel (as measured at compile) | … `partializeStoreState` (PRESERVED, not modified) … | B2 → B3 → B4 in sequence; no path collision |
```

**The per-migration cost, isolated from the one-time cures that already landed:**

```
$ git show 1d5c79a34 --numstat -- scripts/ops/migrationRehearsalCore.mjs tests/ops/migrationRehearsal.test.js docs/DEPLOY.md
1	1	docs/DEPLOY.md
50	5	scripts/ops/migrationRehearsalCore.mjs
52	14	tests/ops/migrationRehearsal.test.js
$ git show 87b87c406 --numstat
1	1	ARCHITECTURE.md
4	3	docs/CURRENT_STATE.md
1	1	tests/docs/architectureFreshness.test.js
$ awk '/id: .staff-unlock-surveyor-entitlement./,/^  \}\),/' scripts/ops/migrationRehearsalCore.mjs | wc -l
      34
```
Car 1's builder cure (wave-boundary applied heads) and car 2's regex widening (admitting the
SINGULAR "migration ahead") are **already landed and are NOT re-done**. What a NEW migration
owes is: `MIGRATION_TRAIN_REPO_HEAD` `+1/-1`, one **34-line** `MIGRATION_WAVES` row, five
figures in `tests/ops/migrationRehearsal.test.js` plus one by-id tail pin, and three one-line
doc heads.

```
$ grep -n 'pendingCount\|repoHead).toBe\|appliedHead: 200' tests/ops/migrationRehearsal.test.js
78:    expect(plan.repoHead).toBe(201);
79:    expect(plan.pendingCount).toBe(80);
418:    expect(live).toMatchObject({ appliedHead: 200, repoHead: 201, pendingCount: 1 });
$ cat supabase/applied-head.json
{ "appliedHead": 200, "appliedAt": "2026-09-16", … "note": "… Bump this in the SAME commit/PR as the `supabase db push` …" }
$ grep -n 'migration' docs/CURRENT_STATE.md | head -3
5:> … migrations are contiguous to 201 at
79:1. **Migration train.** Working-tree migration head 201 is 1 migration ahead
$ git show 87b87c406 -- tests/docs/architectureFreshness.test.js | grep '^+' | tail -1
+      /migration head (\d+) is (\d+) migrations? ahead\s+of the live-verified production head (\d+)/,
```
⇒ the regex already admits the PLURAL, so 202's two-migration gap needs **no** test edit.

**Is `migrationRehearsalCore.mjs` logic-bearing?** Measured rather than asserted:
```
$ grep -c 'if (\|for (\|\.filter(\|\.map(\|throw new Error' scripts/ops/migrationRehearsalCore.mjs
96
$ grep -n '^export function' scripts/ops/migrationRehearsalCore.mjs | wc -l
       9        # incl. buildMigrationRehearsalPlan (:658)
```
⇒ unambiguously logic-bearing. It is the **fourth** such file in a combined EM-B3.

**THE THREE CEILINGS, each independently breached** — existing logic-bearing production files
`4 > 3`; acceptance cases `9 > 8`; behaviour families `2 > 1`. **STOP AND SPLIT executed.**

**THE ORDER, measured.** `tests/security/snapshotDenylistDrift.test.js` was read whole (E6):
three tests — the scanner is locatable, both sets are non-vacuous (floors of 30), and
`test.each(JS_TOKENS)` asserts each CLIENT token is SQL-denied. **There is no SQL-side subset
arm.** So mirror three may land before its client token at zero cost, and must never land
after it. **B3b first, B3a second — zero interior reds.**

**Negative control for the new SQL alternative:**
```
$ grep -nio 'decree[a-z]*' tests/security/galleryWorldSnapshotScanner.pglite.test.js tests/security/gallerySanitize.pglite.test.js tests/security/gallerySanitizeAllowlist.contract.test.js tests/domain/display/publicSafe.test.js
(no output)
```
⇒ `.*decrees.*` rejects nothing that exists in any fixture.

**Both manifests, executed against the validator's own rules:**
```
requiredSymbols resolved: 36   MISS: 0
ok  EM-B3a MODIFY src/domain/display/publicSafe.js (exists)          … 5 rows, 0 duplicates
ok  EM-B3b CREATE supabase/migrations/202_edit_registry_public_denylist.sql (absent)  … 6 rows, 0 duplicates
shared change paths between the halves: NONE
```
Every non-CREATE path exists; every CREATE path is absent; no path is duplicated within a
packet or shared across the two, so the §45.2 status-sequence simulation is clean at every
intermediate state.

---

# PRE-PROOF APPENDIX — EM-B3a re-measured at the build tip `a41a0e109`

Added 2026-09-19 by the Opus PRE-PROOF lane (chair session 7d3418f8), read-only, in the
detached read tree `$SP/read-tip-a41a0e109`. **Sections E0–E19 above are the compile's
receipts at `d31af2cee` and are NOT rewritten**; every section below is a new measurement at
the tip. No gate was run by this lane and none is claimed.

## E20 · The tree, the base, and the J-T1 window

```
$ git -C $SP/read-tip-a41a0e109 rev-parse HEAD
a41a0e109bdee8fe3a0df082bf35b36d2399301e
$ git -C $SP/read-tip-a41a0e109 status --porcelain | head -20
(no output — clean)
$ date
Sat Sep 19 15:08:27 EDT 2026
```

Ancestry, both directions of interest:

```
$ git merge-base --is-ancestor d31af2ceebf643818201b2e2ab4a556765d2fc7c HEAD && echo "YES ancestor"
YES ancestor
$ git merge-base --is-ancestor ac46d2daf HEAD && echo "YES ancestor"
YES ancestor
$ git log --oneline -1 ac46d2daf
ac46d2daf EM-B3b: migration 202 teaches the net-current gallery scanner to deny the settlement
          editor's keys, and registers itself in the rehearsal train and the three doc heads
```

**THE J-T1 WINDOW — every change-manifest path and every `requiredSymbols` path, base → tip:**

```
$ git diff --stat d31af2ceebf643818201b2e2ab4a556765d2fc7c a41a0e109 -- \
    src/domain/display/publicSafe.js src/domain/display/worldSnapshotPublic.js \
    src/lib/accountData.js tests/store/decreeRegistryPersistence.test.js \
    tests/lib/editTravel.test.js src/store/persistProjection.js src/store/persistMerge.js \
    src/lib/saves.js src/lib/importScrub.js src/lib/worldExport.js src/lib/generationIntent.js \
    src/data/sampleSettlements.js src/domain/normalizeSettlement.js \
    tests/store/lifecycleRoundTrip.test.js tests/security/snapshotDenylistDrift.test.js \
    tests/security/worldSnapshotDenyCensus.test.js \
    tests/security/gallerySanitizeAllowlist.contract.test.js \
    tests/security/townMapEditsPublicDrop.test.js tests/lib/worldExport.test.js \
    tests/lib/importScrub.test.js \
    supabase/migrations/136_world_snapshot_deny_census_lift.sql \
    scripts/check-observed-shape-readers.mjs
(no output)
```

**ZERO of the 20 declared substrate paths and ZERO of the 5 change paths moved in the window.**
Spot-proof by blob identity on the largest touched file:

```
$ git rev-parse d31af2cee:src/domain/display/publicSafe.js
bdeafe467a423b30399c28388a70a9af928f6d67
$ git rev-parse a41a0e109:src/domain/display/publicSafe.js
bdeafe467a423b30399c28388a70a9af928f6d67
```

CREATE targets, at the tip:

```
$ git ls-files tests/store/decreeRegistryPersistence.test.js tests/lib/editTravel.test.js
(no output)
ABSENT (good): tests/store/decreeRegistryPersistence.test.js
ABSENT (good): tests/lib/editTravel.test.js
```

The named dependency EM-B2's writer is still absent:

```
$ ls src/domain/edit/
ls: src/domain/edit/: No such file or directory
$ git ls-files 'src/domain/edit/**'
(no output)
```

Preamble hash, verified (the chair still stamps the header line):

```
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
95e9a5f4aee51bb5aaa434883a708c5f2a4c71d2a49aa4ec99f9076a98c2afaa  docs/implementation/preambles/EM-PREAMBLE.md
```

## E21 · Required-symbol re-resolution at `a41a0e109` — 26 of 26, plus one owed addition

Every manifest row re-grepped `-F` (fixed-string) against its own path at the tip:

```
REQUIRED SYMBOLS: 26
OK   count=1  src/store/persistProjection.js  ::  export function partializeStoreState
OK   count=1  src/store/persistMerge.js  ::  export function mergePersistedState
OK   count=1  src/domain/display/publicSafe.js  ::  export const PRIVATE_KEY_RE
OK   count=1  src/domain/display/publicSafe.js  ::  export const PUBLIC_TOPLEVEL_KEYS
OK   count=1  src/domain/display/publicSafe.js  ::  export function toPublicSafe
OK   count=1  src/domain/display/worldSnapshotPublic.js  ::  export const COVERT_KEY_RE
OK   count=1  src/domain/display/worldSnapshotPublic.js  ::  export const WORLD_SNAPSHOT_HARD_DENY
OK   count=1  src/domain/display/worldSnapshotPublic.js  ::  export function serializeWorldSnapshotPublic
OK   count=1  src/lib/accountData.js  ::  export function preflightAccountExport
OK   count=1  src/lib/accountData.js  ::  export function buildAccountExport
OK   count=1  src/lib/saves.js  ::  row.data = entry.settlement
OK   count=1  src/lib/importScrub.js  ::  export function scrubImportedTreasury
OK   count=1  src/lib/worldExport.js  ::  export function buildWorldExport
OK   count=1  src/lib/generationIntent.js  ::  export const GENERATION_INTENT_SAMPLE_FORK
OK   count=1  src/data/sampleSettlements.js  ::  export function forkConfigFor
OK   count=1  src/data/sampleSettlements.js  ::  export function forkSeedFor
OK   count=1  src/domain/normalizeSettlement.js  ::  export function normalizeSettlement
OK   count=1  tests/store/lifecycleRoundTrip.test.js  ::  const ZUSTAND_PERSIST_KEYS = Object.freeze([
OK   count=1  tests/security/snapshotDenylistDrift.test.js  ::  the net-current SQL sanitizer denies the "%s" key (membership)
OK   count=4  tests/security/worldSnapshotDenyCensus.test.js  ::  WORLD_SNAPSHOT_HARD_DENY
OK   count=1  tests/security/gallerySanitizeAllowlist.contract.test.js  ::  SQL 123 allowlist == JS PUBLIC_TOPLEVEL_KEYS
OK   count=1  tests/security/townMapEditsPublicDrop.test.js  ::  mapEdits is NOT an allowlisted top-level public key
OK   count=1  tests/lib/worldExport.test.js  ::  no worldState HARD-DENY ledger key appears anywhere in the player export
OK   count=2  tests/lib/importScrub.test.js  ::  is REFERENCE-IDENTICAL when there is nothing to strip
OK   count=1  supabase/migrations/136_world_snapshot_deny_census_lift.sql  ::  create or replace function public._gallery_world_snapshot_is_safe
OK   count=1  scripts/check-observed-shape-readers.mjs  ::  export const EXPLAINED_WRITER_EXEMPTIONS
--- resolved=26  missing=0 ---
```

**ONE ROW IS OWED AND IS ADDED (none is removed).** The premise of §8 step 3 and §10's
"Expected" — `sqlDenies('decrees')` is already `true` — is carried at the tip by migration
**202**, not by 136 (E22). A symbol the deliverable must find unchanged is a required symbol,
so `supabase/migrations/202_edit_registry_public_denylist.sql` joins the list and its path
therefore joins the sealed dispatch's substrate check:

```
$ grep -c -F "create or replace function public._gallery_world_snapshot_is_safe" \
    supabase/migrations/202_edit_registry_public_denylist.sql
1
$ grep -n -F ".*decrees.*" supabase/migrations/202_edit_registry_public_denylist.sql
24:--   (2) the private-channel alternation gains ONE alternative, `.*decrees.*`, beside
50:--   'dmLayer','decrees' hard_deny members and the one `.*decrees.*` alternative removed.
123:        || '|.*decrees.*'
$ grep -n -F "'dmLayer','decrees'" supabase/migrations/202_edit_registry_public_denylist.sql
22:--   (1) `hard_deny` gains 'dmLayer','decrees' after the always-present private keys, so
50:--   'dmLayer','decrees' hard_deny members and the one `.*decrees.*` alternative removed.
77:    'dmLayer','decrees',
```

136's row stays: its body is what 202 recreates verbatim, its symbol still resolves, and the
standard forbids a silent removal.

## E22 · THE ONE REFUTED FACT — the net-current scanner moved 136 → 202, and `sqlDenies('decrees')` flipped

Executed through the drift test's **own** extractors (`tests/helpers/sourceContract.js`
`jsRegexTokens` / `sqlRegexAlternation`) over the same latest-wins walk
`snapshotDenylistDrift.test.js:30-45` performs, at the tip:

```
NET-CURRENT SCANNER FILE: 202_edit_registry_public_denylist.sql
JS_TOKENS.length = 35
SQL_ALTS.length  = 34
sqlDenies("dmlayer")        = true
sqlDenies("dmLayer")        = true
sqlDenies("decrees")        = true
sqlDenies("appliedDecrees") = true
sqlDenies("decreesApplied") = true
uncovered (JS tokens with no SQL twin) = []
PRIVATE_KEY_RE.test("dmLayer") = true
PRIVATE_KEY_RE.test("decrees") = false
COVERT_KEY_RE.test("dmLayer")  = false
COVERT_KEY_RE.test("decrees")  = false
--- simulating the packet's single-token insert ---
simulated after-length = 36   delta = 1   new tokens = ["decrees"]
```

| Fact | At the compile's base `d31af2cee` (E6) | At the tip `a41a0e109` | Cause |
|---|---|---|---|
| net-current scanner file | `136_world_snapshot_deny_census_lift.sql` | **`202_edit_registry_public_denylist.sql`** | EM-B3b landed at `ac46d2daf` |
| SQL alternatives | 33 | **34** (`.*decrees.*` added) | EM-B3b |
| `sqlDenies('decrees')` | `false` | **`true`** | EM-B3b |
| `sqlDenies('dmlayer')` | `true` | `true` | unchanged |
| `JS_TOKENS.length` | 35 | 35 (→ 36 after this packet) | unchanged |

**This is the packet's own declared precondition arriving, not a contradiction.** §11's K2 STOP
("`EM-B3b` has not landed, or `sqlDenies('decrees')` is still `false`") is measured NOT to fire,
and §8 step 3's check is measured to pass before the first edit. Every sentence in the DRAFT
that speaks of B3b in the future tense is rewritten to the measured past in packet version 2.

## E23 · The lighting census baseline MOVED under the packet — the prediction is re-cut as a DELTA

```
$ git diff --stat d31af2cee a41a0e109 -- tests/lint/.lighting-census-baseline.json
 tests/lint/.lighting-census-baseline.json | 14 +++++++-------
 1 file changed, 7 insertions(+), 7 deletions(-)
```

| Figure | Baseline at `d31af2cee` (the DRAFT's absolutes) | Baseline at `a41a0e109` |
|---|---:|---:|
| `files` | 2645 | **2646** |
| `parked` | 383 | **383** |
| `credited` | 2262 | **2263** |
| `titles` | 25009 | **25005** |
| `suiteTitles` | 6670 | **6671** |

```
$ git show a41a0e109:tests/lint/.lighting-census-baseline.json | tail -8
  "measuredAtSha": "baf8ccc1da4f7e327ad1d4d053ad814a830a90bf",
  "measuredBy": "EM-P0",
  "date": "2026-09-19",
  "note": "EM-P0: one new test file (the pinned-mode battery)",
  "files": 2646,
  "parked": 383,
  "credited": 2263,
  "titles": 25005,
  "suiteTitles": 6671
}
```

Two landings moved it inside the window: `ed9d99295` (train EM-T1's terminal — thirteen vacuous
census arms collapsed to two victory arms, `titles 25009 → 24998`) and EM-P0's terminal
(one new test file). **Every absolute in §10's interior-red block is therefore stale.** It is
re-cut as the DELTA this packet causes, derived from its own two CREATE rows:

| Figure | Semantics (walker `:602-613`) | EM-B3a's delta | Derivation |
|---|---|---:|---|
| `files` | every `*.test.js(x)` under `tests/` | **+2** | the two CREATE rows |
| `parked` | files with ≥1 park reason | **+0** | every title is a literal; no `.each`, no loop-generated test (§P3.4) |
| `credited` | files with zero park reasons | **+2** | both new files are credited |
| `titles` | literal test titles in credited files | **+8** | 5 tests in `decreeRegistryPersistence` + 3 in `editTravel` |
| `suiteTitles` | literal `describe` titles in credited files | **+4** | 2 describes in each file |

The walker's own definitions, quoted:

```
602:  const parked = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length > 0);
603:  const credited = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length === 0);
604:  const titles = credited.reduce((sum, { src }) => sum + liveTitlesIn(src).length, 0);
605:  const suiteTitles = credited.reduce((sum, { src }) => sum + liveSuiteTitlesIn(src).length, 0);
```

## E24 · The mutation-coverage obligation, priced at the tip — ZERO rows owed

The enumeration rule executed against the tip's own module
(`tests/lint/mutationCoverage.shared.mjs`):

```
ENFORCER_DIRS = ["tests/lint","tests/design","tests/docs","tests/data","tests/copy",
                 "tests/security","tests/edgeFunctions","tests/generators"]
tests/store is an ENFORCER_DIR? false
tests/lib   is an ENFORCER_DIR? false
tests/store/decreeRegistryPersistence.test.js | enforcer-dir: false | NAME_PATTERN: false | ENUMERATED: false
tests/lib/editTravel.test.js                  | enforcer-dir: false | NAME_PATTERN: false | ENUMERATED: false
enumerated invariant files TODAY = 705
```

**Neither CREATE directory is an enforcer dir, AND neither basename trips `NAME_PATTERN`**
(`census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin`).
Membership is dir-OR-name, so the DRAFT's justification ("no `tests/lint/` file added") is
narrower than the rule; the conclusion is unchanged and now rests on the rule's both arms.

⚠ `scripts/mutation-coverage-manifest.json` is currently reserved by **EM-P2 (STALE,
non-terminal)**. EM-B3a does not name it and owes no row, so there is no contention.

## E25 · ⭐ THE BUNDLE BUDGETS, PRICED — all four closures measured; the packet reaches NONE

Charter amendment of 2026-09-19 / ODQ §934.19 addendum 2. The three `src/` paths this packet
modifies were classified against every byte ceiling the estate holds, using the repo's **own**
derivations rather than a replica.

**(a) First-paint eager closure** — `EAGER_FIRST_PAINT_MODULES`, imported live from
`vite.config.js` (the export exists precisely so a guard measures THIS derivation):

```
EAGER_FIRST_PAINT_MODULES size = 268
NOT-EAGER  src/domain/display/publicSafe.js
NOT-EAGER  src/domain/display/worldSnapshotPublic.js
NOT-EAGER  src/lib/accountData.js
--- sanity: a known eager module ---
main.jsx eager? true      lookups.js eager? true
```

Budgets guarded: `CLOSURE_BUDGET_BYTES = 1_048_000` raw, `337_000` gzip, `283_000` brotli
(`tests/build/vendorPdfLazy.test.js:565,595,596`). **NOT REACHED.**

**(b) Generation worker** — `WORKER_BUNDLE_CEILING_BYTES = 1401128`
(`tests/build/generationWorkerLazy.test.js:138`), EXACT and monotone-down, zero slack. Static
closure of the worker entry computed with `vite.config.js`'s own `resolveRel` / `importsOf`
(static edges only; dynamic `import()` is a lazy boundary):

```
=== STATIC CLOSURE OF src/workers/generation.worker.js : 219 modules ===
   OUT src/domain/display/publicSafe.js
   OUT src/domain/display/worldSnapshotPublic.js
   OUT src/lib/accountData.js
```

**NOT REACHED.** The other four worker entries were measured too, for completeness:
`advanceInterval.worker.js` (549 modules) OUT/OUT/OUT · `townScene.worker.js` (18) OUT/OUT/OUT ·
`customContentPreview.worker.js` (266) OUT/OUT/OUT · `townSceneExport.worker.js` (125)
**IN `publicSafe.js`** / OUT / OUT. ⚠ That last one is the only worker closure this packet
touches, and **no byte ceiling names it**:

```
$ grep -rn "townSceneExport" tests/build/
(no output)
```

**(c) Lazy engine chunk** — `expect(size).toBeLessThan(679_000)`
(`tests/build/vendorPdfLazy.test.js:787`; measured 678,131 at `023eda2ec`, so **869 B of
margin**), plus `engineChunkLazy.test.js:67`'s `< 1_400_000` band. The chunk's membership rule
is literal (`vite.config.js:863,879`):

```
if (id.includes('/src/generators/')) return 'engine';
if (id.includes('/src/data/narrativeData.js')) return 'engine';
```

and the `engine-core` rule is `isEngineSharedDomain(id)`. Re-running
`computeEngineSharedDomain()` verbatim and applying `ENGINE_SHARED_DOMAIN_EXCISIONS`:

```
ENGINE_SHARED_DOMAIN (pre-excision) size = 68
ENGINE_SHARED_DOMAIN (post-excision) size = 51
OUT of engine-core  /src/domain/display/publicSafe.js
OUT of engine-core  /src/domain/display/worldSnapshotPublic.js
OUT of engine-core  /src/lib/accountData.js
/src/domain/display/publicSafe.js          | /src/generators/ ? false | /src/data/ ? false
/src/domain/display/worldSnapshotPublic.js | /src/generators/ ? false | /src/data/ ? false
/src/lib/accountData.js                    | /src/generators/ ? false | /src/data/ ? false
```

No `manualChunks` rule names any of the three, and none is in `engine-core`. Their static
importers are all outside `/src/generators/`:

```
$ git grep -n "from '.*publicSafe" -- 'src/**'
src/components/GalleryMemberVisibility.jsx:14 · src/domain/briefs/composers.js:25
src/domain/display/dmScreen.js:12 · src/domain/display/visibilityAudit.js:23
src/domain/display/worldSnapshotPublic.js:36 · src/domain/townMap/audienceProjection.js:16
src/domain/townScene/sceneProjection.js:10 · src/lib/gallery.js:17
src/lib/worldExport.js:46 · src/utils/generateWorldBook.js:35
$ git grep -n "from '.*worldSnapshotPublic" -- 'src/**'
src/components/gallery/MapShareEditor.jsx:24 · src/lib/worldExport.js:47
$ git grep -n "from '.*accountData" -- 'src/**'
src/components/account/AccountDataPrivacySection.jsx:27
```

**NOT REACHED.**

**(d) Edge-shared bundles** — the closure derived from the committed metas' own `inputs`
(the standard's "Edge-shared bundle closures" section forbids re-typing a count):

```
supabase/functions/_shared/aiCharterBundle.meta.json        inputs: 114 | hits: []
supabase/functions/_shared/aiGroundingBundle.meta.json      inputs:  74 | hits: []
supabase/functions/_shared/aiOutputSchemaBundle.meta.json   inputs: 115 | hits: []
supabase/functions/_shared/analyticsEventsBundle.meta.json  inputs:   2 | hits: []
supabase/functions/_shared/intentAtlasBundle.meta.json      inputs:   2 | hits: []
```

**NOT REACHED — so "Generated artifacts: `NONE`" is re-confirmed at the tip and no dirty-build
obligation exists.**

⛔ **VERDICT: this packet lands in NO budgeted chunk, so it carries NO bundle-ceiling TEST row
and the build lane owes no re-mint.** Its whole production delta is +10 effective lines across
three modules that every budgeted closure is measured not to reach. **Residual, stated
affirmatively:** an unassigned module's final chunk is Rollup's co-location decision, which
only a real `npm run build` settles; this lane ran none and claims none. The measurement above
is the static-graph claim, which is what every `tests/build/` guard itself asserts against.

## E26 · Facts re-found BY SYMBOL at the tip — six corrections, all compile-era, none drift

Because E20 proves every substrate path byte-identical across the window, each miss below was
already wrong at `d31af2cee`; none is base movement.

```
$ grep -n -E "export const PUBLIC_TOPLEVEL_KEYS|export const PRIVATE_KEY_RE|export function toPublicSafe|export function veilPublicPayload" src/domain/display/publicSafe.js
52:export const PUBLIC_TOPLEVEL_KEYS = Object.freeze([
101:export const PRIVATE_KEY_RE = /(secret|private|\bdm|…|latentPantheon|seed|_config)/i;
244:export function toPublicSafe(settlement, { full = false, memberOverrides = null } = {}) {
487:export function veilPublicPayload(payload) {
$ git show d31af2cee:src/domain/display/publicSafe.js | grep -n -F "export function veilPublicPayload"
487:export function veilPublicPayload(payload) {
```

```
$ node -e '…' (live import)
PUBLIC_TOPLEVEL_KEYS.length = 38   frozen? true
holds dmLayer? false | holds decrees? false | holds spatialLayout (the live anchor)? true
WORLD_SNAPSHOT_HARD_DENY.length = 26  frozen? true
HARD_DENY holds dmLayer? false | decrees? false
```

```
$ git ls-files | grep -i galleryImport
src/store/galleryImportMap.js
src/store/galleryImportSettlement.js
$ git grep -n "scrubImportedTreasury" -- 'src/**'
src/lib/accountImport.js:617 · src/store/galleryImportMap.js:290 · src/store/galleryImportSettlement.js:71
```

```
$ wc -l tests/security/townMapEditsPublicDrop.test.js
      42 tests/security/townMapEditsPublicDrop.test.js
$ grep -c -E "^\s*(it|test)\(" tests/security/townMapEditsPublicDrop.test.js
2
$ grep -n "const payload = " src/lib/accountData.js
341:  const payload = /** @type {AccountExportPayload} */ ({
```

| # | The DRAFT says | Measured at `a41a0e109` | Where |
|---|---|---|---|
| 1 | `veilPublicPayload` (`:481`) | **`:487`** | §5 Receipt/audience row |
| 2 | "a **39**-member frozen allowlist" | **38 members** | §5 Reader/projection (settlement) row |
| 3 | `galleryImportSettlement.js:71`, `galleryImportMap.js:290` (implied `src/lib/`) | **`src/store/`**; both line numbers exact | §2, §5 import row, §12 |
| 4 | `townMapEditsPublicDrop.test.js` "43 lines, 2 cases" | **42 lines**, 2 cases | §5 Test-precedent row |
| 5 | "the payload literal at `:340`" | **`:341`** (`:340` closes `preflight`) | §7 accountData row |
| 6 | "134 … `CREATE` … against **287** `TEST`" | 134 CREATE / **288** TEST | §7 CREATE-vs-TEST note |

```
$ node -e '…count LANDED changeManifest rows whose path starts with tests/…'
LANDED rows on tests/ paths:  CREATE=134  TEST=288
```

**Everything else in §5 re-found exact**, by symbol:
`saves.js:157` `row.data = entry.settlement` · `SETTLEMENTS_DB_WRITER_COLUMNS`
(`lifecycleRoundTrip.test.js:277`) = **twelve** columns, no blob key ·
`partializeStoreState` (`persistProjection.js:245`), **nine** returned keys,
`grep -c saveId` → **0**, the `draftOrigin === 'anon' && auth.user == null` gate ·
`PUBLIC_TOPLEVEL_KEYS` iterated at `:357` · the `full` branch names exactly **thirteen** keys
(`aiData, aiDailyLife, dossierNotes, dmNotes, notes, narrativeNotes, _seed, _regenSeed, _config,
customContentRoster, customContentProvenance, config.latentPantheon, config._seed`) and
narrows `aiSettlement`; `delete clone.narrativeNotes;` is `:268`, so the two new deletes land at
`:269` — after the DM-notes run and before the seed carriers at `:278-280`, exactly as §6 says ·
`WORLD_SNAPSHOT_HARD_DENY` `:68` with `'deferredPartyImpacts'` at `:80` closing the
always-present block · `COVERT_KEY_RE` `:134` · `serializeWorldSnapshotPublic` `:608` ·
`snapshotDenylistDrift.test.js:78` · `normalizeSettlement` `:162`, spread `:178`,
`lifecycleRoundTrip.test.js:1917` · `mergePersistedState` `persistMerge.js:52`, file **107**
lines whole · `forkSeedFor:166`, `forkConfigFor:181`, `generationIntent.js:32` ·
`scrubImportedTreasury` `importScrub.js:87` · `preflightAccountExport:206`,
`buildAccountExport:405` (which calls preflight at `:406` and returns `preflight.value`) ·
`buildWorldExport` `worldExport.js:112` · `EXPLAINED_WRITER_EXEMPTIONS:1140`,
`assertExplainedWriterExemptions:1290` · `generatorGoldenMaster` **525** rows.

**The observed-shape register, re-measured (K3 holds):**

```
.inventory."src/domain/display/publicSafe.js"  -> {"covert on settlement":1}          ← ONE row, none for the thirteen deletes
.inventory."src/domain/ai/personaSlicer.js"    -> {"appliedDecrees on settlement":1, …, "decrees on settlement":1, …}
src/domain/ai/personaSlicer.js:172:    decrees: (home?.appliedDecrees || home?.decrees || []).slice(0, 6),
worldSnapshotPublic.js / accountData.js / importScrub.js  -> ABSENT from .inventory
                                                              (present only in the three file-census manifests)
inventory total keys: 387
```

⚠ One precision: the DRAFT writes the attribution as `personaSlicer.js:172`; the file is
`src/domain/**ai**/personaSlicer.js` (there is no `src/domain/display/personaSlicer.js`).
Line 172 is exact. `importScrub.js` is itself absent from the inventory while using the
destructure-drop spelling (`scrubImportedConfig`, `:49`) — which is the standing proof that the
§8 algorithm's spelling moves the register by zero rows.

## E27 · Budget, hot files, and collision — re-measured at the tip

Effective lines, eslint's own `Linter` under `max-lines {skipBlankLines:true, skipComments:true}`:

```
src/domain/display/publicSafe.js               effective = 132
src/domain/display/worldSnapshotPublic.js      effective = 332
src/lib/accountData.js                         effective = 365
src/store/persistMerge.js                      effective = 34
```

§3's row stands exactly: the largest file touched is `worldSnapshotPublic.js` at **332 / 800**,
**468** lines of headroom. The standing hot-file list, re-executed — **none is in this manifest**:

```
src/components/new/tabs/EconomicsTab.jsx               effective = 599
src/components/OutputContainer.jsx                     effective = 600
src/domain/worldPulse/convergence.js                   effective = 764
src/domain/worldPulse/peaceTerms.js                    effective = 797
src/domain/worldPulse/informationStatecraft.js         effective = 781
```

Collision / reservation, re-measured (E14's absolute has moved; the load-bearing claim has not):

```
TOTAL packets: 188
NON-TERMINAL packets estate-wide: 3      EM-B3a [DRAFT] · EM-P3 [DRAFT] · EM-P2 [STALE]
EM-P3  [DRAFT] paths=5  OVERLAP WITH EM-B3a: NONE
EM-P2  [STALE] paths=4  OVERLAP WITH EM-B3a: NONE
who reserves EM-B3a's five change paths?  EM-B3a alone.
EM-B3b [LANDED] and EM-B3 [SUPERSEDED] are terminal and reserve nothing.
```

## E28 · The sealed dispatch, read check by check (`scripts/implementation-session.mjs`)

| Check | Source | Verdict at `a41a0e109` once the chair promotes and re-stamps the base |
|---|---|---|
| status is READY | `:274` `if (packet.status !== 'READY') throw` | **passes after promotion.** ⛔ Today it would refuse — and it would refuse for a second reason: §4/§10 spell the id **`EM-B3`**, which is `SUPERSEDED`. Fixed in version 2 to `EM-B3a`. |
| branch identity | `:352-353` `dispatch branch mismatch: expected <verifiedBranch>` | passes iff the implementer's worktree is ON the verified branch (the standing one-build-lane-holds-the-branch rule) |
| ancestry | `:176-183` `merge-base --is-ancestor <verifiedBase> HEAD` | **passes** — `d31af2cee` is an ancestor of the tip; and if the base is re-stamped to the tip, `:184` `if (head === packet.verifiedBase) return;` short-circuits the substrate check entirely |
| substrate unchanged | `:185-196` `git diff --name-only <base>..<head> -- <non-CREATE change paths + requiredSymbols paths>` must be empty | **passes at base = tip.** E20's window is empty over the existing 20 paths; adding 202 makes it empty ONLY once the base is re-stamped — see the ⛔ note below |
| capsule carries every substrate path | `:198-200` | passes; the capsule is generated from the same manifest |
| CREATE targets absent and Git-clean | `:205-211` | **passes** — both absent and untracked (E20) |
| non-CREATE targets Git-clean | `:212-213` | passes in a clean worktree |

⛔ **ONE REAL CONSEQUENCE OF ADDING 202, AND THE CHAIR MUST SEE IT.** `ac46d2daf` (EM-B3b) is a
**descendant** of `d31af2cee`, so `supabase/migrations/202_*.sql` **did change inside the
window** `d31af2cee..a41a0e109` — it was created there. If the new required-symbol row is added
while the verified base stays `d31af2cee`, the substrate check at `:195` throws
`verified-base descendant changed declared substrate: supabase/migrations/202_edit_registry_public_denylist.sql`.

**The cure is the one the brief already prescribes and the DRAFT's own base note requests: the
chair RE-STAMPS the verified base to the tip `a41a0e109`.** Then `:184` short-circuits and the
question cannot arise. Measured:

```
$ git diff --name-only d31af2cee a41a0e109 -- supabase/migrations/202_edit_registry_public_denylist.sql
supabase/migrations/202_edit_registry_public_denylist.sql
$ git diff --name-only a41a0e109 a41a0e109 -- supabase/migrations/202_edit_registry_public_denylist.sql
(no output)
```

⇒ **Adding the 202 row and re-stamping the base to `a41a0e109` are ONE act, not two.** The chair
must do both or neither.

## E29 · The chair's rulings B3a-1 … B3a-3, measured against the tree (version 3)

The chair returned three rulings on the version-2 pre-proof. Each premise was re-measured here
before the packet was edited; **all three hold.**

**B3a-1 — the veil precedes the writer.** The ordering is measured in two independent places:

```
$ sed -n '155p' docs/DESIGN_EDIT_MODE_AND_DECREES.md
4. **Neither persisted key is scrubbed on the travel paths.** RULING (lane B, before any
   surface): `dmLayer` and `decrees` join the three hand-mirrored denylists and their drift
   test, and `publicSafe` / `worldSnapshotPublic` name them explicitly; the travel instrument
   is a RUNTIME test …
$ grep -n "EM-T3\|EM-T6" docs/implementation/charters/EDIT-MODE-TRAIN.md
28:| **EM-T3** | EM-P2 · EM-P3 · EM-B3a · EM-B1d …
31:| **EM-T6** | EM-A2a · EM-B1a (after B1d and B1e) · EM-B2a (the `dmLayer on settlement`
     exemptions mint at its terminal) …
```

Design §12 governs earlier sections by its own terms (`:150`), and §12.4 says **"lane B, before
any surface"**. The train plan puts **EM-B3a in EM-T3** and **EM-B2a in EM-T6**. ⇒ version 2's
STOP line *"EM-B2 has not landed, so no writer of either key exists"* was **inverted and would
have stopped a lawful build lane on the packet's own text.** Struck; replaced by the invariant
in §11.

The independence claim was re-checked too: `src/domain/edit/` does not exist at the tip (E20),
and all eight acceptance cases drive existing symbols only — `saves.save/list/writeAll`,
`normalizeSettlement`, `toPublicSafe`, `serializeWorldSnapshotPublic`, `buildAccountExport`,
`forkSeedFor`/`forkConfigFor` + the generator, and `partializeStoreState` — every one of which
resolves in the manifest's own `requiredSymbols` (27/27). **No acceptance case needs a writer.**

Also measured, and it is why the manifest needs no structural change for this ruling:

```
$ node -e '…union of every key used across all 188 manifest packets…'
_verifiedBaseNote, acceptanceCases, changeManifest, checks, id, landedAt, packetPath,
requiredSymbols, retiredSymbols, status, supersededBy, verifiedBase
packets carrying a dependency-ish field: 0
$ grep -rn "dependsOn\|dependencies\|dependsUpon" scripts/implementation-packets.mjs scripts/implementation-session.mjs
(no output)
```

⇒ **`Depends on` is packet prose only.** Neither `validate:packets` nor the sealed dispatch reads
a dependency, so inverting the dependency graph changes no manifest field and no dispatch check.
(Train-plan `dependsOn` exists in the premise-map schema, which is the plan's artifact, not the
packet manifest's.)

**B3a-2 — the inner shapes are opaque.** Design §14 (`:201`) is later than §12 and is the owner's
final shape:

> `dmLayer` records the DM's overrides: `roots` (by `<cardType>:<entityId>:<field>`) and
> `worldFacts` (by config key).

Version 2's §6 reproduced the ARCH §2 spelling `{ entities, minted, phantoms }`, which §14
supersedes. **Nothing in this packet reads either interior**, which was verified against every
mechanism it touches: `PUBLIC_TOPLEVEL_KEYS` membership (key names), `PRIVATE_KEY_RE` and the
SQL alternation (key names), `WORLD_SNAPSHOT_HARD_DENY` (key names), `delete clone.<key>`, and
the destructure-drop. ⇒ the typedef is marked **illustrative — EM-B2a owns the shape**, and
A1/A4/A5 were swept for field-level assertions. Three were found and cured: A1's "one minted id,
one phantom" and "`orderIndex` 0 and 1, one `pending` one `applied`"; A4's
`dmLayer: { entities: {}, minted: {}, phantoms: {} }`; A5's "no id is re-minted". The fixture
requirement that replaces them — **a nested object plus an order-observable array inside each
key, asserted by deep equality** — still catches reordering and normalisation, which is what
those cases exist to catch.

**B3a-3 —** recorded: `EM-B3c` is the chair's chartered SQL-side subset walker; §12 carries it
as a named follow-up and §11's K2 keeps only the executed check.

**Step 8 dry read, RE-RUN at `a41a0e109` against the version-3 manifest:**

```
declared substrate paths: 21
substrate diff at base=tip: EMPTY (passes)
CREATE tests/store/decreeRegistryPersistence.test.js | exists: false | tracked: no
CREATE tests/lib/editTravel.test.js                  | exists: false | tracked: no
MODIFY src/domain/display/publicSafe.js              | exists: true
MODIFY src/domain/display/worldSnapshotPublic.js     | exists: true
MODIFY src/lib/accountData.js                        | exists: true
requiredSymbols resolved: 27   missing: 0
```

Unchanged from E28 in every check. The rulings touched prose, two acceptance-case wordings and
one manifest string; they moved no path, no symbol, no status and no base.
