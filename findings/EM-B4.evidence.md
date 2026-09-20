# EM-B4 — evidence (lane EM COMPILE P3, letter `c`, Opus, session 923472dc)

Same worktree, same base, same tool discipline as `EM-B2.evidence.md`. §E0 of that file
(the base confirmation, the mid-compile drift window and the byte-identity proof) applies
verbatim here and is not repeated. Facts already receipted there are cross-referenced,
never restated as new.

---

## E1 · WHAT THE CHARTER ASKS FOR

`docs/implementation/charters/EDIT-MODE-TRAIN.md`, wave 1, row **EM-B4** (blob
`ecac8ca0f8e3bcfb995e59fcfb0577fcb237d965`, byte-identical across the drift window):

> **EM-B4** the migration | `scripts/migrate-edit-registry.mjs` folds inline edits and the
> Surveyor's staged state into the layer/registry, idempotent, `--check`; the Change Dock
> (flag-off) is retired, not merged | C the script; T `tests/scripts/migrateEditRegistry.test.js`
> | the Surveyor's review artifact shape | B3

`docs/ARCH_EDIT_MODE_AND_DECREES.md` §3, third bullet:

> `scripts/migrate-edit-registry.mjs` folds each save's existing Change Dock pending changes
> (a flag-off surface that is RETIRED, not merged) into `decrees` (`pending`, `addedBy: 'dm'`,
> order preserved) and its inline edits into the record + `dmLayer` (drafts) or `decrees`
> (canonized), idempotent, with a `--check` arm; packet EM-B4, before any surface.

Three inputs are named: **Change Dock pending changes**, **the Surveyor's staged state**, and
**inline edits**. Each is measured below. Two of the three do not exist as the charter assumes,
and the medium itself is refuted.

---

## E2 · ⛔ REFUTATION 1 — A REPO-SIDE NODE CLI CANNOT REACH A SINGLE SAVE

Where saves actually live:

```
$ grep -n "LOCAL_KEY\|localStorage" src/lib/saves.js | head
4: * Uses Supabase when configured, falls back to localStorage.
16:const LOCAL_KEY = 'dnd_settlement_saves';
105:    const parsed = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
125:  localStorage.setItem(LOCAL_KEY, JSON.stringify(saves));
869:  writeAll: isConfigured ? null             : localWriteAll,

$ sed -n '369,372p' src/lib/saves.js
    .from('settlements')
    .select('id, name, tier, seed, gallery_share_narrated, ... updated_at')
```

Every save is either in a BROWSER's `localStorage['dnd_settlement_saves']` or in a per-user row
of the Supabase `settlements` table behind that user's own session. A node process run from the
repository can read neither: there is no localStorage, and no service credential is available to
or appropriate for a packet-dispatched script.

What the estate actually does instead — an IN-APP, UNCONDITIONAL, IDEMPOTENT migration that runs
on every read and write of a save:

```
$ git grep -n "migrateSaveToV2" -- src
src/lib/saves.js:190:function migrateSaveToV2(entry) {
src/lib/saves.js:195:  // objects users keep. Because migrateSaveToV2 runs on every read AND write
src/lib/saves.js:331:      .map(migrateSaveToV2)
src/lib/saves.js:443:  const v2 = migrateSaveToV2(entry);
src/lib/saves.js:503:  const v2 = migrateSaveToV2(entry);
src/lib/saves.js:684:    creates: creates.map(entry => mutationRow(migrateSaveToV2(entry))),
src/lib/saves.js:713:  return (await localLoad()).map(...).map(migrateSaveToV2).map(migrateSettlementShape);
src/lib/saves.js:743:  const v2 = migrateSaveToV2(entry);
src/lib/saves.js:775:  const v2 = migrateSaveToV2(entry);
src/lib/saves.js:850:  for (const entry of creates) next.unshift({ ...migrateSaveToV2(entry), savedAt: Date.now() });

$ grep -n "^export function" src/domain/settlementMigrations.js
90:export function migrateSettlementToLatest(settlement) {
141:export function listMigrations() {
162:export function diagnoseMigrationChain() {

$ sed -n '30,60p' src/domain/settlementMigrations.js
const MIGRATIONS = Object.freeze([
  { from: 0, to: 1, description: 'Stamp schemaVersion = 1. ...', migrate(settlement) {...} },
  // Future:
  // { from: 1, to: 2, description: '...', migrate(s) { ... } },
]);
```

`src/domain/settlementMigrations.js`'s own header states the contract: migrations are pure,
append-only, `to === from + 1`, applied by `migrateSettlementToLatest(settlement)` on load, and
idempotent on an already-current settlement. `src/lib/saves.js:713` applies BOTH
`migrateSaveToV2` and `migrateSettlementShape` to every loaded save.

And the estate has exactly ONE `scripts/migrate-*`, which migrates a repository baseline file —
not user data:

```
$ ls scripts/ | grep -i "^migrate"
migrate-observed-shape-readers.mjs
```

**This is also the `PACKET_STANDARD.md` "Ungated persistence" law read forward:** "⛔ An arm that
normalizes or cleans PERSISTED state runs UNCONDITIONALLY... a world generated while the flag is
dark keeps its saves un-normalized, and the rot is discovered later by a reader that cannot tell
a stale shape from a new one." A CLI a user never runs is the strongest possible form of the
failure that clause forbids: the normalization would never execute at all.

---

## E3 · ⛔ REFUTATION 2 — THERE IS NO PERSISTED SURVEYOR STAGED STATE TO FOLD

The Surveyor's review artifact, by symbol:

```
$ grep -n "^export" src/domain/intent/interpretReview.js
27:export const REVIEW_ACTIONS = Object.freeze(['approve', 'edit', 'reject', 'pending']);
44:export function resolveCorrectionClass(decision, op, action) {
75:export function reviewInterpretation(interpretation, decisions = {}) {
119:export function correctionRate(interpretation, decisions = {}) {
131:export function addedOpCorrection() {
137:export function isInterpretCorrectionClass(cls) {
```

Its exact shapes (`sed -n '58,75p' src/domain/intent/interpretReview.js`):

    @typedef {{ opType: string, params: Record<string, unknown>, label: string,
               protectedFlags: string[], edited?: boolean }} ReviewOp
    @typedef {{ action?: string, consented?: boolean, editedParams?: Record<string, unknown>,
               editedType?: string, correctionClass?: string }} ReviewDecision
    reviewInterpretation(interpretation, decisions) -> {
      accepted:    Array<{ index: number, op: ReviewOp }>,
      blocked:     Array<{ index: number, reason: 'needs_consent' }>,
      corrections: Array<{ index: number, class: string }>,
    }

The module's own header: "PURE, lazy-only (rides the interpret panel chunk), emits only enum
strings — zero eager bytes, no content in the correction signal."

**Where that state lives — React component state, and nowhere else:**

```
$ grep -n "useState" src/components/surveyor/InterpretApplyPanel.jsx
151:  const [sessionText, setSessionText] = useState(initialPrompt);
152:  const [loading, setLoading] = useState(false);
153:  const [result, setResult] = useState(null);     // { interpretation, seed, interpretRef, musings, byok } | { error }
154:  const [decisions, setDecisions] = useState({});
155:  const [applyResult, setApplyResult] = useState(null);
156:  const [applying, setApplying] = useState(false);
157:  const [recoveringCommandId, setRecoveringCommandId] = useState(null);
158:  const [recoveryError, setRecoveryError] = useState(null);

$ git grep -n "interpretation" -- src/store
(no output)

$ git grep -n "surveyor" -- src/store src/lib/saves.js
src/store/authSlice.js:135:  ... has_surveyor_entitlement() ...
src/store/campaignRegionalSlice.js:189: ... the surveyor autonomy ...
src/store/campaignSlice.js:400:  'surveyorInstructions', // AutonomyPanel (domain/autonomy STANDING_INSTRUCTIONS_KEY)
src/store/settlementSliceHelpers.js:424: ... the surveyor's ...
src/store/userRouteCharter.js:118: ... beside 'surveyor' (AI-proposed) and 'system'.
```

`interpretation`, `decisions` and `applyResult` never leave the component. `src/store` holds no
`interpretation` at all. The one persisted Surveyor artifact is `'surveyorInstructions'` — the
AutonomyPanel's STANDING instructions, not staged proposals. **A tab close discards the review;
there is nothing on any save for a migration to fold.**

---

## E4 · THE CHANGE DOCK — SESSION-ONLY, SO ITS INPUT SET IS EMPTY

The Change Dock is the `SettlementWorkbench` surface behind the `settlementWorkbench` flag, with
the pending-edit queue underneath it:

```
$ grep -n "^export" src/store/settlementPendingEdits.js
67:export const QUEUE_WIRED_PROSE_PATHS = Object.freeze({
93:export function pendingEditContext(state) {
127:export function pendingEditWriteCapability(state) {
252:export function queuePendingEdit(get, set, kind, payload) {
428:export function pendingEditCommandScope(state, selection = null) {
553:export async function commitPendingEditScope(get, set, selection = null) {
780:export function refreshPendingEditScope(get, set, selection = null) {
863:export function discardPendingEditScope(get, set, selection = null) {
879:export function isWorldPendingEdit(intent) {

$ grep -n "^export" src/store/settlementPendingEditWriters.js
65:export function applyNpcOp(get, set, edit) {
206:export function applyTableEvent(get, set, edit) {
296:export function applyEditOp(get, set, edit) {

$ git grep -n "pendingEditsQueue" -- src/store | head -3
src/store/settlementLifecycleHelpers.js:256:    state.pendingEditsQueue   = [];
src/store/settlementPendingEdits.js:275:    draft.pendingEditsQueue = appendEdit(draft.pendingEditsQueue || [], intent);
```

The store key is `pendingEditsQueue`. It appears in NEITHER persistence surface:

```
$ grep -n "pendingEdits" src/store/persistProjection.js
(no output)
```
`partializeStoreState` (`src/store/persistProjection.js:245`) returns exactly
`config, configExplicitFields, institutionToggles, categoryToggles, goodsToggles,
servicesToggles, displayPrefs, advanceAutoResolve, anonDraft` — nine keys, no queue.

```
$ grep -n "SAVED_SETTLEMENT_PATCH_KEYS" -A 7 src/store/settlementSliceHelpers.js
318:export const SAVED_SETTLEMENT_PATCH_KEYS = Object.freeze([
319-  'settlement', 'campaignState', 'timestamp', 'aiData', ... 'gallery_member_overrides',
324-]);
```
No queue key on the save row either. The estate's own audit agrees in as many words
(`docs/CAPABILITY_REMEDIATION_PLAN.md:167`): *"Not live today (flag OFF in flagRegistry) and
session-only (pendingEditsQueue is outside the persist allowlist)."*

⚠ `src/config/flagRegistry.js` does NOT exist at this base (`ugrep: No such file or directory`),
so the flag's live home is unmeasured here and is named as a chair question rather than asserted.

**Consequence.** Design §12.13's ruling — the Change Dock is RETIRED, not merged — is correct and
costless: a session-only queue has nothing persisted to migrate. But it also means the charter's
first named input contributes ZERO rows.

---

## E5 · WHAT IS ACTUALLY LEFT — INLINE EDITS, WHICH IS EM-B2'S BLOCK

With the Change Dock empty and the Surveyor unpersisted, the migration's only real input is the
inline-edit record, measured in `EM-B2.evidence.md` §E5:

- `src/domain/userEdits.js:181` `applyUserEdit(entity, path, newValue)` writes the field and
  records `entity._userEdits[path] = { value, originalValue, editedAt }`, plus
  `entity._authored = true` (`:205`).
- `src/domain/userEdits.js:351` `walkUserEdits(settlement)` is the whole-tree iterator a fold
  would read through; `:405 countSettlementEdits`, `:424 summarizeUserEdits`.
- `EDITABLE_FIELDS` (`:73`) declares 6 entity types plus 14 settlement-root prose paths, and its
  `npc` list carries **`role`**, which `ARCH_EDIT_MODE_AND_DECREES.md` §9 declares a POOL field
  of the npc card.

So EM-B4's surviving scope is exactly the state whose OWNERSHIP is unresolved. It cannot fold
`_userEdits` into `dmLayer` until the chair has ruled whether `dmLayer` subsumes, excludes or
coexists with `_userEdits` (EM-B2 §0). **EM-B4 inherits that block and adds two of its own.**

---

## E6 · WHAT A CHAIR FORK WOULD COST — MEASURED BEFORE IT IS PROPOSED

If the chair moves the fold into the existing in-app chain (fork **F-IN-APP**), the append-only
contract requires a new `{ from: 1, to: 2 }` entry and a `SCHEMA_VERSION` bump. **That bump moves
every golden row**, measured:

```
$ grep -n "export const SCHEMA_VERSION" src/domain/settlement.schema.js
47:export const SCHEMA_VERSION     = 1;
$ grep -n "schemaVersion" src/domain/normalizeSettlement.js | head -2
167:      schemaVersion:     SCHEMA_VERSION,
$ grep -n "normalizeSettlement" src/generators/steps/assembleSettlement.js
33:import { normalizeSettlement } from '../../domain/normalizeSettlement.js';
324:  return { settlement: reapplyEventConditions(promoteStressorsToConditions(normalizeSettlement(settlement))) };
$ sed -n '796,801p' tests/property/generatorGoldenMaster.test.js
function hashFor(config) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
}
$ python3 -c "import json;print(len(json.load(open('tests/fixtures/generator-golden-master.json'))))"
525
```

The pipeline's output is normalized at `assembleSettlement.js:324`, `normalizeSettlement` stamps
`schemaVersion: SCHEMA_VERSION` at `:167`, and the golden hashes the whole serialised settlement.
**Bumping `SCHEMA_VERSION` 1 → 2 re-records all 525 rows**, which `EM-PREAMBLE.md` §P3.1 makes a
standing STOP for every EM member ("Motion is a STOP"). The fork is therefore only lawful if the
fold is a version-LESS normalization arm — exactly the shape `migrateSaveToV2` already is
(it runs on every read and write and stamps no version), and the shape the "Ungated persistence"
law describes. That is the cheapest lawful fork and it is priced in the packet's §0.

---

## E7 · REGISTRATION COST, PRICED AT COMPILE

```
$ ls tests/scripts/
baseStateCapsule.test.js  gateMutex.test.js  implementationGate.test.js
implementationPackets.test.js  implementationSession.test.js

$ grep -n "tests/scripts" scripts/mutation-coverage-manifest.json
(no output)

$ sed -n '36,49p' tests/lint/mutationCoverage.shared.mjs
export const ENFORCER_DIRS = ['tests/lint','tests/design','tests/docs','tests/data',
  'tests/copy','tests/security','tests/edgeFunctions','tests/generators'];
export const NAME_PATTERN =
  /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i;
```

`tests/scripts/` exists and is NOT one of the eight enforcer dirs; `migrateEditRegistry.test.js`
matches no `NAME_PATTERN` token. **No `scripts/mutation-coverage-manifest.json` row is owed** —
confirmed empirically by the zero existing `tests/scripts` rows in that manifest.

The lighting census DOES move, and for the same measured reason as EM-B2 (evidence
`EM-B2.evidence.md` §E7a): `files` is `TEST_FILES.length` over `walk(join(ROOT, 'tests'))`, so
the packet's ONE new test file is the whole cause. Baseline at `e5a27a1a5`:
`files 2645 / parked 383 / credited 2262 / titles 25009 / suiteTitles 6670`.

`scripts/check-writer-reach.mjs` and `scripts/check-observed-shape-readers.mjs` **cannot move on
this packet under any fork**: a migration adds no customer surface (wave 1 is headless) and mints
no new written identity of its own — the keys it folds INTO are EM-B3's, and their exemption row
is EM-B3's chair act through the migration-bundle door. Under fork **F-IN-APP** the fold module
would be a new `src/domain/**` reader of `dmLayer`, which re-raises EM-B3's exemption question at
EM-B3's own door and still never at this packet's.

---

## E8 · TEST PRECEDENTS, BY PATH AND NAME

```
$ grep -n "describe(\|  it(" tests/domain/settlementMigrations.test.js | head
21:describe('Tier 1.4 — migration chain integrity', () => {
22:  it('diagnoseMigrationChain returns null on a well-formed chain', () => {
26:  it('listMigrations exposes every registered migration', () => {
47:  it('every migration increments version by exactly 1', () => {
62:describe('Tier 1.4 — migrateSettlementToLatest behavior', () => {
83:  it('is idempotent on an already-current settlement', () => {
90:  it('does not mutate the input', () => {
97:  it('returns the same value for null / non-object inputs (no crash)', () => {

$ grep -n "describe(\|  it(" tests/scripts/implementationPackets.test.js | head -6
127:describe('IA-1 implementation packet manifest and capsule', () => {
143:  it('accepts the canonical fixture and exposes pure header/index/path helpers', () => {
261:  it('rejects an indexed packet omitted from the manifest', () => {
271:  it('fails closed on unknown status and duplicate packet identity or paths', () => {
398:  it('enforces the eight-case ceiling and argv-form checks for READY packets', () => {
```

`tests/domain/settlementMigrations.test.js` is the exact proof shape a fold owes — chain
integrity, idempotency, non-mutation, and the nullish/non-object safety arm. Both files use flat
literal registration, as `EM-PREAMBLE.md` §P3.4 requires.

A `--check` arm precedent, for whichever fork the chair signs:

```
$ grep -n "\-\-check" scripts/wiring-census.mjs | head -4
10: * census ships as DATA: docs/content/wiring-census.json, written here, `--check`-gated
15: *   --check               refuse on a stale byte or a stale stamp; write nothing
1472:  const checkOnly = argv.includes('--check');
```

---

## E9 · WHAT WAS NOT RUN, AND WHY

No `vitest`, no `eslint --fix`, no `npm run check`, no writing script, no edit to the consist or
the ledger. `git`, `grep`, `sed`, `wc`, `ls` and `python3 -c` over committed JSON only — all
read-only. `requiredSymbols` existence is proved against the BLOB at `d31af2cee` in
`EM-B2.evidence.md` §E11, which covers every row this manifest names.

---

## E10 · EVERY FILE NAMED IN A `checks` ARGV ARRAY EXISTS AT THE BASE

```
$ for f in ...; do git cat-file -e d31af2ceebf643818201b2e2ab4a556765d2fc7c:$f && echo EXISTS $f; done
EXISTS tests/domain/userEdits.test.js
EXISTS tests/store/persistMerge.test.js
EXISTS tests/domain/settlementMigrations.test.js
EXISTS tests/store/lifecycleRoundTrip.test.js
EXISTS tests/domain/regenerationDelta.test.js
EXISTS tests/property/generatorGoldenMaster.test.js
EXISTS tests/property/dossierProseManifest.test.js
EXISTS tests/lint/sovereigntyLightingContract.walker.test.js
EXISTS tests/lint/mutationCoverageManifest.test.js
EXISTS tests/lint/sizeBaseline.test.js
```

Zero ABSENT, for both EM-B2's and EM-B4's argv arrays. The only paths a `checks` array names
that do NOT exist are the ones each packet CREATES, which is the intended state for a
non-terminal packet.

---

## E11 · ⭐ THE BASE MOVED A SECOND TIME — see `EM-B2.evidence.md` §E12

Seven commits now separate this packet's base from the worktree HEAD
(`7c538ec89edc1ec52dd3310d998da06089547280`). Of the twenty-two paths this compile measured,
exactly ONE moved — `docs/implementation/charters/EDIT-MODE-TRAIN.md` — and its two moved rows
are **EM-A1**'s and **EM-F1**'s. **This packet's own EM-B4 row is byte-identical at both
revisions** (verified by `git show <rev>:<charter> | grep -n "EM-B4"` at each end), so every
figure above holds.

The substantive news is design §14 ("Edit at the source, never at the derivation"; ODQ §934.44),
quoted in full in `EM-B2.evidence.md` §E12. Its consequence for the FOLD is recorded in this
packet's §0.5: most of `EDITABLE_FIELDS`'s fourteen settlement-root paths are DERIVED prose under
§14's own taxonomy, and its five `history.*` paths are additionally ruled immutable — so the
fold's input denominator is unsettled until the chair rules which of those paths survive §14.
