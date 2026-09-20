# EM-B1a — compile evidence

Every fact `EM-B1a.md` and `EM-B1a.manifest.json` call verified is proved by a command below with
its real output. A fact with no command here is not verified.

**Lane:** EM COMPILE LANE P2 (Opus), session 923472dc, letter `b`. **Read only** in `$SP/consist`
and the ledger; **wrote only** under `$SP/lane-em-b-scratch/`. No vitest, no eslint, no writing
script.

---

## §0 · The base

As `EM-A2a.evidence.md` §0 and not restated: `d31af2cee` confirmed at 11:01:32 EDT **before any
measurement**; ten commits moved the branch to `7aa769830` by 11:33:21 as the chair's rulings
landed; `d31af2cee` **IS an ancestor**; the window is four docs plus `.gitignore` plus one edit to
an existing test file. **Every path this packet measures is blob-identical across the window:**

```
IDENTICAL  src/domain/factionRename.js            IDENTICAL  src/generators/power/rulingStructure.js
IDENTICAL  src/generators/structuralValidator.js  IDENTICAL  src/data/spatialData.js
IDENTICAL  src/domain/factionArchetypes.js        IDENTICAL  src/domain/deterministicSort.js
IDENTICAL  tests/lint/sovereigntyLightingContract.walker.test.js
IDENTICAL  tests/lint/.lighting-census-baseline.json
IDENTICAL  tests/lint/mutationCoverage.shared.mjs IDENTICAL  scripts/lib/writer-reach-scan.mjs
IDENTICAL  docs/implementation/PACKET_MANIFEST.json
```

Worktree clean. Base held at `d31af2cee` per the chair's ruling (6).

---

## §0a · The chair's rulings, read at their source

The rulings arrived mid-compile and were **taken on the tree, not on the message**:

```
$ grep -n "Op types" docs/ARCH_EDIT_MODE_AND_DECREES.md
105:- **Op types (twenty-five, in two packets):** HOME (EM-B1a): set-field, add-institution,
remove-institution, set-institution-state (§15), add-npc, remove-npc, set-npc-status (§15),
add-faction, remove-faction, set-power-holder, rebalance-power, set-relationship, rename-faction,
rename-npc, rename-settlement (§12.3), set-world-fact (§14), found-phantom, promote-phantom.
OFF-STAGE (EM-B1b, §13): declare-war, make-peace, open-trade, close-trade, send-force,
recall-force, resolve-outcome (victory/defeat/stalemate/truce). `set-state` is STRUCK (system
states are derived, §14).
```

⇒ counted: **eighteen HOME**, seven off-stage, `set-state` struck. The lane's earlier open
question (20 vs 23) is **CLOSED** by the amended ARCH and ruling (2).

**Design §15, the two new vocabularies, verbatim:**

```
$ sed -n '<§15>,$p' docs/DESIGN_EDIT_MODE_AND_DECREES.md
## 15. Entity states: exile, jail, ruin, impairment (the owner, ODQ §934.46; 2026-09-19)
- **NPC status** ∈ { present, exiled, jailed, dead, departed, missing }. …
- **Institution state** ∈ { active, impaired, ruined, destroyed, abandoned, under-construction }. …
- **Destruction is a state; removal is erasure.** Both stay available, each with a cause from the
  removal pool. The record keeps what was destroyed; it forgets what was removed.
- **Ops:** `set-npc-status` and `set-institution-state` join the home set (EM-B1a); … The
  vocabularies are FINITE-SEMANTICS pools, never free text, and the readers that consume them are
  named in the packet that adds each field.
```

⇒ A7 pins both vocabularies as exact sorted lists, asserts neither is `kind:'free'`, and asserts
`set-institution-state('destroyed')` and `remove-institution` are DISTINCT — the §15 sentence made
structural. ⚠ The clause *"the readers … are named in the packet that adds each field"* places the
reader census on EM-A1/EM-B2, not here: this packet mints the **op**, not the field.

**Design §14 final, the clause that keeps `set-world-fact` a declaration:**

```
$ grep -n "One engine: re-derive with pins" -A 6 docs/DESIGN_EDIT_MODE_AND_DECREES.md
**One engine: re-derive with pins.** `rederive(record, config′, layer)` runs the pipeline's
derivation steps against the record's chosen facts held fixed … Fresh generation with no pins is
the golden and cannot move. …
… EM-B2 is pinned re-derivation — the load-bearing packet …
```

⇒ the engine is EM-B2's; A8 proves this packet resolves no pool and calls no `rederive`.

---

## §1 · `requiredSymbols` — every row proved present, verbatim

```
1  src/domain/factionRename.js            :: export function applyFactionRenameToSettlement
1  src/domain/factionRename.js            :: export function factionRenameChanges
1  src/domain/factionRename.js            :: export function applyNpcRenameToSettlement
1  src/domain/factionRename.js            :: export function npcRenameChanges
1  src/domain/factionRename.js            :: export function resolveFactionForRename
1  src/domain/factionRename.js            :: export const FACTION_RENAME_SURFACES
1  src/domain/factionRename.js            :: export const NPC_RENAME_SURFACES
1  src/generators/power/rulingStructure.js :: export const renormalizeFactionPower
1  src/generators/structuralValidator.js  :: export const checkInstCompat
1  src/generators/structuralValidator.js  :: export const checkStructuralValidity
1  src/data/spatialData.js                :: export const GATE_FEATURES
1  src/domain/factionArchetypes.js        :: export const FACTION_ARCHETYPES
1  src/domain/deterministicSort.js        :: export const compareCodepoint
```

**No symbol the packet CREATES (`OP_TYPES`, `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, `makeOp`,
`validateOp`) is named** — the standard withdraws "preserves **or creates**" before LANDED.

---

## §2 · ⛔ `checkInstCompat` is a prose picker — the finding the chair accepted (ruling 7)

```
$ sed -n '269,284p' src/generators/structuralValidator.js
export const checkInstCompat = (institutions, tier, _magicPriority) => {
  const names = nativeSemanticNames(institutions).map(name => name.toLowerCase());
  const has   = (...keywords) => keywords.some(k => names.some(n => n.includes(k)));
  if (has('great cathedral')) {
    return pickRandom([
      "The great cathedral's spire is the tallest thing for miles.",
      'A cathedral dominates the skyline. …' ]);
  }
  if (has('cathedral') && tier !== 'thorp' && tier !== 'hamlet') { return pickRandom([…]); }
  …

$ grep -n "pickRandom" src/generators/structuralValidator.js | head -1
7:import {getTradeRouteFeatures, pickRandom, tierAtLeast} from './helpers.js';
```

⇒ `(institutions, tier, _magicPriority) → string` — a narrative sentence, chosen with a draw. No
boolean, no violations, no verdict.

**The symbols that actually do the job:**

```
$ sed -n '348,351p;859p' src/generators/structuralValidator.js
export const checkStructuralValidity = (institutions, config = {}) => {
  const violations  = [];
  const suggestions = [];
  return { violations, suggestions };

$ grep -n "export const GATE_FEATURES" -A 9 src/data/spatialData.js
34:export const GATE_FEATURES = {
35-  "Gates (if walled)": { suggestionOnly: true,
37-    requires: ["Town walls", "City walls and gates", "Massive walls and fortifications"],
38-    reason: "Gates are entry points in walls. Walls must exist first." },
40-  Citadel: { requires: ["City walls and gates", "Massive walls and fortifications"],
42-    reason: "Inner fortress requires outer defenses." },
```

⇒ a live `requires` prerequisite table whose first rows are exactly the design's example shape.
Ruling (7) accepts the finding; the charter's EM-C3 row is corrected. All three are named in this
packet's `requiredSymbols` and **called nowhere**, so the correction travels in the manifest.

---

## §3 · `renormalizeFactionPower` MUTATES IN PLACE — measured

```
$ sed -n '35,60p' src/generators/power/rulingStructure.js
export const renormalizeFactionPower = (factions) => {
  if (!factions || !factions.length) return factions;
  const total = factions.reduce((sum, f) => sum + (f.power || 0), 0);
  if (total <= 0) return factions;
  …
  shares.forEach((s) => { factions[s.i].power = s.floor; });   // ⛔ IN-PLACE WRITE
  return factions;                                             // ⛔ THE SAME REFERENCE
};
```

⇒ largest-remainder to an exact 100, ties by current order; the argument returns unchanged on an
empty or all-zero roster. **A caller assuming purity would corrupt a roster.** Recorded for EM-C3,
which is the packet that will call it.

---

## §4 · The rename cascade — shape and the join-key evidence

```
$ grep -n "^export" src/domain/factionRename.js
241:export const FACTION_RENAME_SURFACES   281:export const NON_CASCADED_SURFACES
317:export const NPC_RENAME_SURFACES       341:export const NPC_NON_CASCADED_SURFACES
540:export function resolveFactionForRename   565:export function renameInterSettlementReference
621:export function applyFactionRenameToSettlement   768:export function factionRenameChanges
796:export function applyFactionRenameToPartner     845:export function applyNpcRenameToSettlement
908:export function npcRenameChanges        941:export function applyNpcRenameToPartner

$ sed -n '615,622p' src/domain/factionRename.js
 * @returns {{ changed: boolean, touched: string[] }} `touched` names the surfaces that
 *   actually moved, for receipts and for the cascade pin.
export function applyFactionRenameToSettlement(settlement, oldName, newName) {
  const touched = [];
  if (!isRecord(settlement) || !oldName || !newName || oldName === newName) {
    return { changed: false, touched };

$ sed -n '35,40p;241,258p' src/domain/factionRename.js
 * NAMES ARE JOIN KEYS. That is the whole difficulty. …
export const FACTION_RENAME_SURFACES = Object.freeze([
  { path: `${ROSTER}.faction`, kind: 'key', why: 'the canonical display name' },
  … { path: 'powerStructure.governingName', … }, { path: `${PAIRWISE}.pair[]`, … },
  // The NPC family, declared once and mirrored across both homes … Spread rather
  // than hand-listed so the two homes cannot drift — the drift IS the bug this replaced.
  ...NPC_HOMES.flatMap(home => NPC_FACTION_FIELDS.map(field => ({ … }))),
  { path: 'institutions[].factionSource', … }, { path: 'factions[].name', … }, …
```

⇒ HZ-JOINKEY's ground, and the reason the three `rename-*` ops delegate rather than re-implement
(A5 scans for exactly that).

---

## §5 · The registration ledger — every verdict executed

**P2.1 — the census counts TEST files (ruling 8 accepts it):**

```
$ sed -n '515,518p;612p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests')).filter((p) => /\.test\.(js|jsx)$/.test(p))…
      files: TEST_FILES.length,

$ cat tests/lint/.lighting-census-baseline.json   (tail)
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
```

⇒ `+1 / +0 / +1 / +8 / +1`, driven by the new TEST file.

**P2.2 — NOT owed here; the split moved it to EM-B1b with the walker:**

```
$ grep -n "ENFORCER_DIRS" -A 2 tests/lint/mutationCoverage.shared.mjs
36:export const ENFORCER_DIRS = [
37:  'tests/lint',
```

⇒ this packet adds no `tests/lint/` file. ⭐ The chair's split moved the obligation **cleanly with
the file that incurs it**.

**P2.4 cannot move** (`SURFACE_CLOSURE_STOP` includes `'src/store/'`,
`scripts/lib/writer-reach-scan.mjs:115-117`). **P2.5 not owed** — this packet mints no chooser and
no pool and draws nothing at all. **P2.3 not owed**; the scanner covers every `.js` under `src/`
(`check-observed-shape-readers.mjs:250`), so the leaf IS scanned and the check is in `checks`.

**Collision and CREATE-absence:**

```
$ node -e '<load PACKET_MANIFEST.json>; per path …>'
src/domain/edit/operations.js       | total holders: 0 | NON-TERMINAL: 0
tests/domain/editOperations.test.js | total holders: 0 | NON-TERMINAL: 0
--- statuses present across all 182 packets: LANDED,SUPERSEDED

ABSENT src/domain/edit/operations.js     ABSENT tests/domain/editOperations.test.js
```

⚠ The live collision is with **EM-B1b**, which appends to both files.

---

## §6 · The budget arithmetic at eighteen home ops

The cap is **effective** lines (eslint `max-lines`, `skipBlankLines`, `skipComments`), so header
and rationale comments cost nothing:

| part | per unit | count | effective |
|---|---:|---:|---:|
| op rows (ten declared fields each, tightly written) | 8–9 | 18 | 144–162 |
| `makeOp` | — | — | ~15 |
| `validateOp` (the seven-step algorithm) | — | — | ~40 |
| closed vocabularies (`OP_STAGES`, policies, target kinds, payload-spec kinds) | — | — | ~12 |
| helpers + freezing | — | — | ~15 |
| imports | — | — | ~5 |
| **total** | | | **≈231–249 of 250** |

⇒ **inside the cap, with ≤19 lines of margin.** Per the chair's instruction — *if over, propose the
next split line; do not squeeze* — the estimate is **not** over, so the packet stands whole and
**EM-B1c** (the three `rename-*` ops + `set-world-fact`, ≈36 effective) is pre-declared as the
contingency on the principled line *rows that delegate to another packet's machinery*. §11 makes
crossing 250 a STOP.

---

## §7 · The test precedents

```
$ grep -n "describe(\|  it(" tests/domain/institutionFounding.test.js | head -3
113:describe('MF-T2Q — the institution founding year', () => {
114:  it('dates a pulse-built institution by the calendar year it came to stand', () => {
125:  it('never re-dates on the re-founded path — a founding is its FIRST founding', () => {

$ grep -n "SCAN_ROOTS" -A 6 tests/lint/chooserTotality.walker.test.js
64:const SCAN_ROOTS = Object.freeze([ 'src/domain/worldPulse', 'src/domain/spatial',
   'src/domain/traditions', 'src/domain/region' ]);
```

⚠ **`tests/domain/factionRename.test.js` was NOT measured by this lane** and is named nowhere in
the packet; §10 directs the implementer to resolve the cascade's real suite path at preflight.
**RAISED R3.** An unmeasured path is not a verified fact.

---

## §8 · What this lane did NOT do

- Ran **no** vitest, eslint, `npm run check`, or any writing script.
- Wrote **nothing** in `$SP/consist` or `/Users/cstokes/Desktop/settlement-engine`.
- Named **no** symbol it did not prove present (§1).
- Took the chair's rulings **on the tree, not on the message** — ARCH §9, design §14 and §15 are
  all quoted above (§0a).
- **Did not stamp the preamble's hash** (ruling 6).
- Raised **no** budget and invented **no** figure; the ≈231–249 range is labelled an ESTIMATE.
- Adjudicated **nothing**: R1–R3 are listed in the packet's §13 for the chair.

---

## §9 · REVISION 3 — the vocabulary growth, measured (the chair's ruling 1, §934.47 add. 3)

**The order, read at its source on the ledger checkout (read-only):**

```
$ sed -n '<§15>,+6p' /Users/cstokes/Desktop/settlement-engine/docs/DESIGN_EDIT_MODE_AND_DECREES.md
- **NPC status** ∈ { active, exiled, jailed, dead, missing, retired, removed } — the tree's
  `NpcStatus` typedef (`entities/npcs.js`, six values) plus `jailed`, the owner's word, added to
  the typedef by EM-B1a with every enumerating consumer named (§934.47 addendum 3): "present" is
  `active`, "departed" is `retired`. …
- **Institution state** ∈ { active, impaired, ruined, destroyed, vacant, removed } — the tree's
  `EntityStatus` typedef (five values) plus `ruined`, the owner's word, added by EM-B1a
  (§934.47 addendum 3): "abandoned" is `vacant`. …
```

**The enumerating-consumer scan — each member grepped across `src/`, tests excluded:**

```
$ git grep -n "'exiled'" -- 'src/**' | grep -v '\.test\.'
src/domain/density/factionLifecycle.js:75:export const ROSTER_ABSENT_STATUSES = Object.freeze(['dead', 'exiled', 'removed']);
src/domain/entities/npcs.js:30:/** @typedef {'active'|'dead'|'missing'|'exiled'|'retired'|'removed'} NpcStatus
src/domain/entities/successors.js:63:    .filter(n => n.status !== 'dead' && n.status !== 'removed' && n.status !== 'exiled')
src/domain/worldPulse/envoyCasting.js:98:  if (['dead','killed','missing','exiled','imprisoned'].includes(status)) return false;
src/domain/worldPulse/magicFormsPractitioner.js:79:const LOST_NPC_STATUS = new Set(['dead','removed','exiled','missing','retired']);

$ git grep -n "'vacant'\|'impaired'" -- 'src/**' | grep -v '\.test\.'   (enumerating sites only)
src/domain/entities/status.js:23   the EntityStatus typedef
src/domain/entities/status.js:88-92  STATUS_ACTIVE / IMPAIRED / REMOVED / DESTROYED / VACANT
src/domain/events/affordanceManifest.js:197: status === 'impaired' || 'removed' || 'destroyed'
src/domain/events/targetRosters.js:103:      the same triple
src/components/new/SummaryTab.jsx:56: vacant:{c:'#1a3a8b',bg:'#f0f0fd',br:'#a0a0d4',label:'vacant'}
```

⇒ **2 typedef files + 7 enumerating consumers = NINE existing logic-bearing production files**
against a cap of **THREE**. The chair's ruling (1) named this exact condition, so the growth
**SPLITS into EM-B1d** and EM-B1a keeps **zero** existing production files modified.

**F-V1 — the pre-existing foreign spelling, executed:**

```
$ sed -n '95,100p' src/domain/worldPulse/envoyCasting.js
export function rosterPersonAvailable(npc) {
  if (isOffStage(npc)) return false;
  const status = text(npc.status).toLowerCase();
  if (['dead', 'killed', 'missing', 'exiled', 'imprisoned'].includes(status)) return false;
```

⇒ `killed` and `imprisoned` are **not** `NpcStatus` members. `imprisoned` is a near-synonym of the
owner's new `jailed`, live in a pulse arm today. Adding `jailed` without ruling on it ships two
spellings of one idea. **RAISED R5.**

**F-V2 — the hot file one step behind the badge row:**

```
$ grep -n "EconomicsTab" docs/implementation/PACKET_STANDARD.md
470:| `src/components/new/tabs/EconomicsTab.jsx` | 600 | 600 | 0 |
```

⇒ zero headroom against a ceiling `max-lines` reds above. It enumerates a DIFFERENT union
(supply-chain status), so it is not in the roster — but any lane extending status badges must
measure it first. **Recorded, not investigated.**

---
---

# PACKET VERSION 2 — THE RE-PIN TO DESIGN §19 RULING 6

**Lane:** EM COMPILE LANE B1a-REPIN (Opus), session 7d3418f8, dispatched by the successor chair
2026-09-19 ~14:2x EDT. **Read only** in the detached worktree `$SP/read-tip-023eda2ec` and the
ledger checkout through `git show HEAD:<path>`; **wrote only** under `$SP/lane-b1a-repin-scratch/`.
No vitest, no eslint, no `npm run check`, no writing script, no edit anywhere else.

⛔ **THE PREVIOUS CHAIR'S file:line FIGURES WERE TAKEN AS HINTS AND EVERY ONE WAS RE-FOUND BY
SYMBOL.** One of them was wrong and is corrected below (§11.3).

---

## §10 · The tree, confirmed before any measurement

```
$ git -C $SP/read-tip-023eda2ec rev-parse HEAD
023eda2ec2f8dd2d9286584d2496c6ac4ea5309e

$ git -C $SP/read-tip-023eda2ec status --short
(no output — the worktree is clean)
```

⇒ the dispatch's sha, exactly. Every §10–§15 command below runs in that worktree.

**The order, read at its source on the ledger (never from that checkout's stale working files):**

```
$ git -C /Users/cstokes/Desktop/settlement-engine show HEAD:docs/DESIGN_EDIT_MODE_AND_DECREES.md \
    | sed -n '254,315p'      (§18 and §19, whole)
…
6. **The conditions, corrected.** Of the four predicates EM-B1a declared ABSENT: "a plot in
motion" is LIVE (`worldState.stressors.some(s => s.type === 'coup_detat')`); "an open route" is
TWO predicates — LIVE via `REGIONAL_CHANNEL_TYPES` `trade_route` with status `confirmed`
(`region/graph.js`), and LIVE-GATED via `readRouteNetwork(ws).edges` behind
`routeLifecycleEnabled` (off by default; the seal names which). "A pending peace offer" and "an
envoy arrived at us" confirm as gaps — with the nuance that an envoy's arrival is LIVE on the
SENDER's errand (readable across the campaign for a real neighbour) and absent only for a phantom.
EM-B1a's `worldConditions.js` is re-pinned to this before promotion.
```

---

## §11 · The two corrections, each re-found BY SYMBOL

### §11.1 · `plotInMotion` is LIVE — and the constant IS exported

```
$ grep -n "COUP_STRESSOR_TYPE" src/domain/worldPulse/coup.js
51:export const COUP_STRESSOR_TYPE = 'coup_detat';
60:  return outcome?.ruleId === `stressor_${COUP_STRESSOR_TYPE}_residual`;
92:    if (stressor?.type !== COUP_STRESSOR_TYPE) continue;

$ git grep -n "COUP_STRESSOR_TYPE" -- 'src/**'
src/domain/worldPulse/coup.js:51:export const COUP_STRESSOR_TYPE = 'coup_detat';
src/domain/worldPulse/coup.js:60:  return outcome?.ruleId === `stressor_${COUP_STRESSOR_TYPE}_residual`;
src/domain/worldPulse/coup.js:92:    if (stressor?.type !== COUP_STRESSOR_TYPE) continue;
```

⇒ the chair's ruling 1 said *"through its exported constant, never the bare string, if the
constant is exported — measure"*. **It is exported**, at `:51`. `worldConditions.js` imports it.

**The field it reads, on the constructed world:**

```
$ grep -n "stressors" src/domain/worldPulse/worldState.js
318:    stressors: [],
594:    stressors: cloneStressors(raw?.stressors),

$ sed -n '315,320p' src/domain/worldPulse/worldState.js
    rngSeed: `world-pulse:${seedPart}`,
    volatility: 'normal',
    simulationRules: normalizeSimulationRules(),
    stressors: [],
    relationshipStates: {},
```

⇒ ⭐ **`simulationRules` (`:317`) and `stressors` (`:318`) are constructed on ONE object** — the
measurement §12 turns on.

**The type is live across the estate, not a dead word:**

```
$ git grep -n "coup_detat" -- 'src/**' | head
src/domain/certification/subsystemRowsPeople.js:51:  'coup_detat',
src/domain/display/chronicleGraph.js:65:  coup_detat: 'succession_coup', …
src/domain/display/rumorFallbackPhrasePools.js:899:  coup_detat: 'a seizure of the seat',
src/domain/realm/heraldRouting.js:268:  … coup_detat: 'events', …
src/domain/rulingPower.js:13: *   - the coup_detat stressor verdict (worldPulse/coup.js) …
src/domain/worldPulse/assizeKernel.js:119:const UNREST_TYPES = new Set(['rebellion', 'political_fracture', 'coup_detat', 'slave_revolt']);
```

### §11.2 · `openRoute`, reader 1 — the regional channel, LIVE and ungated

```
$ grep -n "export function activeChannelsFrom\|export const REGIONAL_CHANNEL_STATUSES\|export const REGIONAL_CHANNEL_TYPES" src/domain/region/graph.js
47:export const REGIONAL_CHANNEL_TYPES = Object.freeze([
66:export const REGIONAL_CHANNEL_STATUSES = Object.freeze([
825:export function activeChannelsFrom(graph, settlementId, options = {}) {

$ sed -n '47,70p' src/domain/region/graph.js
export const REGIONAL_CHANNEL_TYPES = Object.freeze([
  // P0: logistics/economic
  'trade_dependency',
  'export_market',
  'trade_route',          ← :51
  …
export const REGIONAL_CHANNEL_STATUSES = Object.freeze([
  'suggested',
  'confirmed',            ← :68

$ sed -n '825,837p' src/domain/region/graph.js
export function activeChannelsFrom(graph, settlementId, options = {}) {
  const { includeSuggested = false, types = null, visibility = null, excludeHidden = false } = options;
  …
  return ensureRegionalGraph(graph || {}).channels.filter(channel => {
    if (String(channel.from) !== String(settlementId)) return false;
    if (typeSet && !typeSet.has(channel.type)) return false;
    …
    if (channel.status === 'confirmed') return true;      ← :834
    return includeSuggested && channel.status === 'suggested';
  });
```

⇒ ⭐ **the reader's own default `includeSuggested = false` IS the ruling's "with status
`confirmed`"** — so `worldConditions.js` never spells the status literal and the status rule stays
in one place. There is **no per-member exported constant** for `'trade_route'` (the only sibling
grouping is `P0_CHANNEL_TYPES` at `:83`), which is why the packet names the VOCABULARY in
`requiredSymbols` and asserts membership in A2 rather than importing a constant that does not exist.

### §11.3 · `openRoute`, reader 2 — LIVE-GATED, and ⛔ THE SURVEY'S PATH DOES NOT EXIST

```
$ git grep -n "routeLifecycleEnabled" -- 'src/**' | grep -v certification | grep -v subsystemRows
src/domain/worldPulse/commercialReasons.js:56: *  … dark behind routeLifecycleEnabled
src/domain/worldPulse/demographicsRates.js:97: * routeLifecycleEnabled / magicEconomyEnabled …
src/domain/worldPulse/envoyErrandVocabulary.js:39:  'routeLifecycleEnabled',
src/domain/worldPulse/institutionStatusModel.js:55: * routeLifecycleEnabled / npcConsequencesEnabled convention …
src/domain/worldPulse/routeNetworkLedger.js:20: * `routeLifecycleEnabled` is VIRTUAL: it has NO entry in DEFAULT_SIMULATION_RULES
src/domain/worldPulse/routeNetworkLedger.js:205: * `simulationRules.routeLifecycleEnabled === true`, defensively. ABSENT means
src/domain/worldPulse/routeNetworkLedger.js:214:    && … (rules).routeLifecycleEnabled === true);
src/domain/worldPulse/simulationRules.js:964:    // … `routeLifecycleEnabled` is
src/domain/worldPulse/simulationRules.js:976:    routeLifecycleEnabled: false,
```

⛔⛔ **THE SURVEY CITED `src/domain/simulationRules.js:976`. THAT PATH DOES NOT EXIST.** The file
is **`src/domain/worldPulse/simulationRules.js`**, and the line number happens to be right.

**Its default, measured — the flag is dark because it is ABSENT, not because it is false:**

```
$ grep -n "DEFAULT_SIMULATION_RULES *=" src/domain/worldPulse/simulationRules.js
61:export const DEFAULT_SIMULATION_RULES = Object.freeze({
$ awk 'NR>=61 && /^\}\);/ {print "ends at "NR; exit}' src/domain/worldPulse/simulationRules.js
ends at 180
```

⇒ `routeLifecycleEnabled` appears **nowhere in `:61-180`** (the grep above shows its only two
sites in that file are `:964` and `:976`), so **it has no default entry at all**.

```
$ grep -n "^  [a-z_]*: preset(" src/domain/worldPulse/simulationRules.js | awk -F: '$1<=976' | tail -1
867:  full_simulation: preset('full_simulation', 'Full Simulation', {

$ sed -n '974,977p' src/domain/worldPulse/simulationRules.js
    // Preset identity is untouched: RULE_COMPARISON_KEYS derives from
    // DEFAULT_SIMULATION_RULES, which this key is absent from … LIGHTING IT belongs at the
    // declared golden boundary once J2's flows, J3's charter/decay events and J4's consumers land.
    routeLifecycleEnabled: false,
```

⇒ the **only** declaration in `src/` is a `false` inside the `full_simulation` preset (`:867`).
**DARK BY DEFAULT, and dark even in the everything-on preset.**

**The module's own Law 7, and the reader and gate by symbol:**

```
$ sed -n '19,23p' src/domain/worldPulse/routeNetworkLedger.js
 * `routeLifecycleEnabled` is VIRTUAL: it has NO entry in DEFAULT_SIMULATION_RULES
 * (the WAVES / ONE_REGEN / neutralNeighborsEnabled convention), so it adds no
 * persisted bytes to a legacy save and does not join RULE_COMPARISON_KEYS. Every
 * gate reads `=== true`, so absent means dormant.

$ sed -n '203,216p' src/domain/worldPulse/routeNetworkLedger.js
 * Is THE ORGANIC ROUTE LIFECYCLE lit for this world? Reads
 * `simulationRules.routeLifecycleEnabled === true`, defensively. ABSENT means
 * false means DORMANT (Law 7). Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
export function routeLifecycleActive(worldState) {            ← :210
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && … (rules).routeLifecycleEnabled === true);

$ sed -n '441,452p' src/domain/worldPulse/routeNetworkLedger.js
 * Read the network ledger off a world, DEFENSIVELY. A world that never had one,
 * a world whose ledger was dropped, and a world persisted before this layer
 * existed all answer the same way: null. …
export function readRouteNetwork(worldState) {                ← :450
```

⇒ ⭐ **the gate's `null`/absent answer IS the dormant answer**, so `worldConditions.js`'s
false-on-absence law composes with it without a `try`/`catch`.

---

## §12 · ⭐ THE CHAIR'S REACHABILITY QUESTION — ANSWERED, NOT BLOCKED

> *"Measure how a pure `(record, campaignState) => boolean` predicate reaches the rules flag; if it
> cannot without a third argument, that is a BLOCKED finding."*

**It reaches it with no third argument. Three measurements:**

1. **The predicate calls the GATE, not the flag.** `routeLifecycleActive(worldState)` takes a
   **worldState**, not a rules object (§11.3, `:206-210`).
2. **One object carries both.** `worldState.js:317` `simulationRules: normalizeSimulationRules()`
   and `:318` `stressors: []` (§11.1).
3. **`campaignState` already had to carry `worldState` for version 1's six live predicates:**

```
$ grep -n "export function liveSieges" src/domain/display/warStatus.js
88:export function liveSieges({ worldState, regionalGraph } = /** @type {any} */ ({})) {

$ grep -n "export function atWarWith" src/domain/roads/embassyHazard.js
74:export function atWarWith(graph, worldState, a, b) {

$ git grep -n "regionalGraph" -- 'src/store/**' | head -3
src/store/aiSlice.js:121:    const regionalGraph = state.getCampaignRegionalGraph?.(campaign.id) || campaign.regionalGraph;
src/store/aiSlice.js:123:      campaign: { ...campaign, worldState, regionalGraph },
```

⇒ `{ worldState, regionalGraph }` is the object the store already composes. **NO BLOCKED FINDING;
no signature invented.**

---

## §13 · The two gaps, confirmed — and the envoy nuance by symbol

### §13.1 · `pendingPeaceOffer` — a gap

```
$ grep -c -i "offer\|pending" src/domain/worldPulse/peaceReasons.js
0

$ grep -n -i "offer\|pending" src/domain/worldPulse/peaceReasons.js
(no output)

$ grep -n "isBilateralPeaceOffer" src/domain/worldPulse/warPeaceDecision.js | head -2
61:export function isBilateralPeaceOffer(outcome) {
181:  if (!isBilateralPeaceOffer(outcome)) return null;

$ git grep -n "peaceOffer" -- 'src/**'
src/domain/worldPulse/envoyErrandOffer.js:130: … || payload.peaceOffer !== true
src/domain/worldPulse/envoyErrandOffer.js:159:      peaceOffer: true,
src/domain/worldPulse/relationshipEvolution.js:519:    && outcome.proposalPayload?.peaceOffer === true
src/domain/worldPulse/settlementStrategy.js:898:            peaceOffer: true,
src/domain/worldPulse/warPeaceDecision.js:66:    && payload.peaceOffer === true;
```

⇒ every site is a **proposal payload in flight**; there is no standing "an offer is pending"
field on a record. **`source: 'EM-E4'` confirmed**, exactly as the ruling says.

### §13.2 · `envoyArrived` — LIVE on the SENDER's errand, absent only for a phantom

```
$ grep -n "ENVOY_POSITION_BANDS" src/domain/worldPulse/envoyErrandVocabulary.js
116:export const ENVOY_POSITION_BANDS = Object.freeze(['departed', 'underway', 'near', 'arrived']);
429:export const POSITION_BAND_SET = new Set(ENVOY_POSITION_BANDS);

$ sed -n '624,629p' src/domain/worldPulse/envoyErrandRecords.js
  const finalOutboundPosition = positionRef.journey === 'outbound'
    && Number(positionRef.legIndex) === outbound.length - 1
    && positionRef.progressBand === 'arrived';
  const finalReturnPosition = positionRef.journey === 'return'
    && Number(positionRef.legIndex) === returning.length - 1
    && positionRef.progressBand === 'arrived';

$ grep -n "export function envoyErrandsOf" src/domain/worldPulse/envoyErrandRecords.js
866:export function envoyErrandsOf(worldState) {

$ sed -n '865,868p' src/domain/worldPulse/envoyErrandRecords.js
/** Read-only normalized projection. Returned rows never alias the world. */
export function envoyErrandsOf(worldState) {
  return normalizeEnvoyErrands(asObject(worldState)[ENVOY_ERRAND_LEDGER_KEY]);
```

⇒ the arrival is a real, readable fact on the SENDER's errand — **`'arrived'` is a declared band,
`positionRef.progressBand === 'arrived'` with `journey === 'outbound'` is the arrival, and
`envoyErrandsOf(worldState)` is the read**. The gap is our **INBOUND** read, which E4 lands
(design §19 ruling 7); for a **phantom** there is no errand ledger at all (§13 / §P8). The row
stays `source: 'EM-E4'` and its note records the nuance by symbol.

---

## §14 · Version 1's six LIVE rows — every file:line re-confirmed at `023eda2ec`

```
$ grep -n "export function atWarWith" src/domain/roads/embassyHazard.js
74:export function atWarWith(graph, worldState, a, b) {
$ grep -n "export function atWarWithIdx" src/domain/worldPulse/tickIndices.js
413:export function atWarWithIdx(graph, worldState, a, b) {
$ grep -n "export function liveSieges" src/domain/display/warStatus.js
88:export function liveSieges({ worldState, regionalGraph } = … ) {
$ grep -n "export function hasBeliefMaps" src/domain/display/settlementBeliefs.js
188:export function hasBeliefMaps(worldState) {
$ grep -n "export const PRIMARY_RELATIONSHIP_TYPES" -A 3 src/domain/worldPulse/relationshipCompatibility.js
41:export const PRIMARY_RELATIONSHIP_TYPES = Object.freeze([
42-  'neutral',
43-  'trade_partner',
$ grep -n "NpcStatus" src/domain/entities/npcs.js
30:/** @typedef {'active'|'dead'|'missing'|'exiled'|'retired'|'removed'} NpcStatus
$ grep -n "relationshipStates: {}" src/domain/worldPulse/worldState.js
319:    relationshipStates: {},
$ sed -n '117,120p' src/domain/briefs/composers.js
export function activeWarPairs(worldState) {                 ← :117
  const deployments = worldState && typeof worldState.deployments === 'object' && worldState.deployments
    ? … (worldState.deployments)                             ← :118
$ grep -n "state.deployments" src/domain/worldPulse/applyWorldPulse.js | head -1
409:        const armyFree = !(state.deployments && state.deployments[besieger]);
```

⇒ **all eight citations hold unchanged.**

⛔ **THE `requiredSymbols` COVERAGE OF THESE READERS, COUNTED AGAINST THE MANIFEST (R10):** of
§16.1's **eleven rows**, two declare no reader (`pendingPeaceOffer`, `envoyArrived`); **four are
covered** — `plotInMotion` (`COUP_STRESSOR_TYPE`, added at version 2), `openRoute` reader 1
(`activeChannelsFrom` + `REGIONAL_CHANNEL_TYPES`, added), `openRoute` reader 2 (`readRouteNetwork`
+ `routeLifecycleActive`, added) and `npcPresent` (through the pre-existing `NpcStatus` row);
**five are NOT** — `warInProgress`, `forceInField`, `siegeInProgress`, `tradeWith`, `beliefExists`,
whose six symbols (`atWarWith`, `atWarWithIdx`, `activeWarPairs`, `liveSieges`,
`PRIMARY_RELATIONSHIP_TYPES`, `hasBeliefMaps`) appear **nowhere in the manifest**, at version 1 or
version 2. Ruling 7 scoped this lane to the readers the re-pin names, so the lane did not add them.
**Raised as R10.**

ⓘ One refinement, RECORDED NOT APPLIED (the row was not
in the ruling's scope): `forceInField`'s field DOES have an exported reader in the tree,
`activeWarPairs(worldState)` at `briefs/composers.js:117` — but it returns *war pairs*, not a
per-settlement boolean, so version 1's note (*"a FIELD, with no exported predicate — the leaf
writes the reader"*) stands. The symbol is named here so a later lane does not re-discover it.

---

## §15 · The base, the drift and the manifest

### §15.1 · ⭐ NOT ONE `requiredSymbols` PATH MOVED — so the base is held

```
$ git merge-base --is-ancestor d31af2cee 023eda2ec && echo "IS an ancestor"
IS an ancestor

$ git diff --stat d31af2cee 023eda2ec -- \
    src/domain/factionRename.js src/generators/power/rulingStructure.js \
    src/generators/structuralValidator.js src/data/spatialData.js \
    src/domain/factionArchetypes.js src/domain/deterministicSort.js \
    src/domain/rulingPower.js src/domain/entities/npcs.js src/domain/entities/status.js \
    src/domain/worldPulse/coup.js src/domain/region/graph.js \
    src/domain/worldPulse/routeNetworkLedger.js
(no output — not one of the twelve paths moved)
```

⇒ the nine version-1 paths **and the three version-2 adds** are all blob-identical across the
window. **The base stays `d31af2cee`** (the chair re-pins at promotion, not this lane).

**All 23 `requiredSymbols` rows proved present VERBATIM at `023eda2ec`** (the validator's own
test — `implementation-packets.mjs:163`, *"requiredSymbols must still be present verbatim"*):

```
$ node -e '<load EM-B1a.manifest.json; count each row.symbol in its file at 023eda2ec>'
 1  src/domain/factionRename.js                  :: export function applyFactionRenameToSettlement
 1  src/domain/factionRename.js                  :: export function factionRenameChanges
 1  src/domain/factionRename.js                  :: export function applyNpcRenameToSettlement
 1  src/domain/factionRename.js                  :: export function npcRenameChanges
 1  src/domain/factionRename.js                  :: export function resolveFactionForRename
 1  src/domain/factionRename.js                  :: export const FACTION_RENAME_SURFACES
 1  src/domain/factionRename.js                  :: export const NPC_RENAME_SURFACES
 1  src/generators/power/rulingStructure.js      :: export const renormalizeFactionPower
 1  src/generators/structuralValidator.js        :: export const checkInstCompat
 1  src/generators/structuralValidator.js        :: export const checkStructuralValidity
 1  src/data/spatialData.js                      :: export const GATE_FEATURES
 1  src/domain/factionArchetypes.js              :: export const FACTION_ARCHETYPES
 1  src/domain/deterministicSort.js              :: export const compareCodepoint
 1  src/generators/power/rulingStructure.js      :: export const generatePowerStructure
 9  src/domain/rulingPower.js                    :: previousGovernments
 3  src/domain/entities/npcs.js                  :: NpcStatus
 1  src/domain/entities/npcs.js                  :: export function createNpc
 4  src/domain/entities/status.js                :: EntityStatus
 1  src/domain/worldPulse/coup.js                :: export const COUP_STRESSOR_TYPE
 1  src/domain/region/graph.js                   :: export function activeChannelsFrom
 1  src/domain/region/graph.js                   :: export const REGIONAL_CHANNEL_TYPES
 1  src/domain/worldPulse/routeNetworkLedger.js  :: export function readRouteNetwork
 1  src/domain/worldPulse/routeNetworkLedger.js  :: export function routeLifecycleActive
ALL 23 ROWS PRESENT VERBATIM AT 023eda2ec ✓
```

⛔ **TWO VERSION-1 RECEIPTS DO NOT REPRODUCE, AND THE MANIFEST'S FIGURES ARE CORRECTED** (the
symbols are present either way; the quoted COUNTS were wrong, not stale):

```
$ grep -c 'previousGovernments' src/domain/rulingPower.js
8                                     (version 1's note quoted "-> 4")
$ git show d31af2cee:src/domain/rulingPower.js | grep -c 'previousGovernments'
8                                     ⇒ identical at the packet's own base: a wrong receipt, not drift
$ grep -c 'EntityStatus' src/domain/entities/status.js
4                                     (version 1's note quoted "-> 2")
$ git show d31af2cee:src/domain/entities/status.js | grep -c 'EntityStatus'
4                                     ⇒ same: wrong, not drift
```

**Both load-bearing contract facts behind those rows re-confirmed anyway:**

```
$ sed -n '653,662p' src/domain/rulingPower.js
      ...settlement,
      powerStructure: {
        ...ps,
        factions: rosterFactions,
        governingName: toGovernment,         ← :657
        government: toGovernment,
        previousGovernments,
        publicLegitimacy,
$ sed -n '785,787p' src/generators/power/rulingStructure.js
    // it must always name the faction entry that carries isGoverning.
    governingName: (factions.find((f) => f.isGoverning) || {}).faction || null,   ← :787
$ sed -n '23p' src/domain/entities/status.js
/** @typedef {'active'|'impaired'|'removed'|'destroyed'|'vacant'} EntityStatus
```

### §15.2 · ⚠ THE LIGHTING CENSUS TUPLE MOVED IN THE WINDOW — a re-pin hazard (R11)

```
$ git show d31af2cee:tests/lint/.lighting-census-baseline.json | grep -o '"files": *[0-9]*\|…'
"files": 2645  "parked": 383  "credited": 2262  "titles": 25009  "suiteTitles": 6670

$ grep -o '"files": *[0-9]*\|…' tests/lint/.lighting-census-baseline.json      (at 023eda2ec)
"files": 2646  "parked": 383  "credited": 2263  "titles": 25005  "suiteTitles": 6671
```

⇒ §7's tuple and its verbatim interior red (*"expected 2646 to be 2645"*) are **correct at the
held base and stale the moment the base is re-pinned** — at `023eda2ec` the red reads *"expected
2647 to be 2646"*. Named in advance; the lane changed nothing, because the base did not move.

### §15.3 · All THREE CREATE targets absent at `023eda2ec`

```
$ for p in src/domain/edit/operations.js src/domain/edit/worldConditions.js \
           tests/domain/editOperations.test.js; do test -e "$p" && echo "PRESENT $p" || echo "ABSENT  $p"; done
ABSENT  src/domain/edit/operations.js
ABSENT  src/domain/edit/worldConditions.js
ABSENT  tests/domain/editOperations.test.js
```

⇒ version 1's §4 named only two of the three; corrected at version 2 (the manifest was already right).

### §15.4 · The `plotInMotion` scoping finding behind R9 — measured, NOT adjudicated

```
$ sed -n '207,215p' src/domain/worldPulse/foodStockpile.js
export function blockadeFor(worldStateStressors = [], settlementId) {
  const sid = String(settlementId);
  for (const s of worldStateStressors || []) {
    if (!BLOCKADE_TYPES.has(s?.type)) continue;
    if (!ACTIVE_STAGES.has(s.lifecycleStage || 'active')) continue;
    if (!(s.affectedSettlementIds || []).map(String).includes(sid)) continue;

$ grep -n "const ACTIVE_STAGES" src/domain/worldPulse/foodStockpile.js
98:const ACTIVE_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

$ grep -n "export function famineFor" src/domain/worldPulse/foodStockpile.js
234:export function famineFor(worldStateStressors = [], settlementId) {

$ grep -n "originSettlementId" src/domain/worldPulse/coup.js
96:      stressor.originSettlementId || (stressor.affectedSettlementIds || [])[0] || '',
```

⇒ the estate's own per-settlement stressor readers scope by **`affectedSettlementIds`** AND by
**`ACTIVE_STAGES`**; ruling 6's expression does neither. **The lane wrote the ruling AS GIVEN and
raised R9**; it did not adjudicate and did not invent a scoping the chair has not ruled.

---

## §16 · What THIS lane did NOT do

- Ran **no** vitest, eslint, `npm run check`, or any writing script; **ran no gate**.
- Wrote **nothing** outside `$SP/lane-b1a-repin-scratch/`. Touched no other worktree or lane
  directory; read the ledger only through `git show HEAD:<path>`.
- **Re-pinned no base** — measured that none was owed and left it to the chair (§15.1).
- **Adjudicated nothing.** R8–R11 are listed for the chair; the `plotInMotion` scoping (R9) and
  the eighteen-vs-fourteen op count (R8) are both left exactly as the chair's own documents have
  them.
- Named **no** symbol it did not prove present (§15.1), and **invented no signature** — §12
  measured the reachability instead of asserting it.
- Changed **nothing** in §5, §6, §7, §8, §9's A1/A3/A5/A6/A7/A8, §10, §11, §12, §14 or §15 of the
  packet: version 2's order was the condition roster and the budget it moves.

---
---

# THE CHAIR'S RULINGS R8–R11 — applied, each measured

Same path law: read only `$SP/read-tip-023eda2ec` (HEAD re-confirmed
`023eda2ec2f8dd2d9286584d2496c6ac4ea5309e`, worktree clean), wrote only under
`$SP/lane-b1a-repin-scratch/`, **ran no gate**.

---

## §17 · R8 — FOURTEEN, and the arithmetic derived in the open

The roster is now spelled **once**, at the packet's §6, in `compareCodepoint` order:

```text
add-faction · add-institution · add-npc · found-phantom · promote-phantom · rebalance-power ·
remove-faction · remove-institution · remove-npc · set-field · set-institution-state ·
set-npc-status · set-power-holder · set-relationship                             ⇒ FOURTEEN
```

**EM-B1c's five, named beside it:** `rename-faction`, `rename-npc`, `rename-settlement`,
`set-world-fact` (the four that LEFT, on §3's split line *rows that delegate to another packet's
machinery*) **plus `schedule-event`**, the nineteenth home op, which was never in version 1's
eighteen at all. **18 − 4 = 14 here; B1c carries 5.**

**`operations.js` re-measured at fourteen rows — the derivation, not an assertion:**

| part | per unit | count | effective |
|---|---:|---:|---:|
| op rows (ten declared fields each) | 8–9 | **14** | **112–126** |
| the `requires: { world, registry }` split | +1 | 14 | **+14** |
| `makeOp` · `validateOp` · vocabularies · helpers+freezing · imports | — | — | 15+40+12+15+5 = **87** |
| **total** | | | **≈213–227 of 250** — ≥23 margin ✅ |

⇒ this reproduces R6's closure figure exactly. At eighteen the same arithmetic gives
144–162 + 18 + 87 = **≈249–267, over the cap** — which is why EM-B1c exists.

**Packet total:** ≈213–227 + ≈83–93 = **≈296–320 of 400** ✅.

---

## §18 · R9 — the scoping audit, all eleven rows measured

### §18.1 · The five rows whose readers ALREADY hold both properties

```
$ sed -n '61,66p' src/domain/roads/embassyHazard.js
export function atOpenWar(graph, homeId, hostId) {
  return warFrontsInto(graph, hostId).includes(homeId)
    || warFrontsFrom(graph, hostId).includes(homeId)
    || warFrontsInto(graph, homeId).includes(hostId)
    || warFrontsFrom(graph, homeId).includes(hostId);
```
⇒ `warInProgress`: **pair-scoped by construction**, both directions between exactly those two.

```
$ sed -n '129,136p' src/domain/display/warStatus.js
 * The settlements currently fielding an army abroad, codepoint-sorted by home id.
export function activeDeployments(worldState) {
  const deployments = worldState?.deployments && …
  return Object.keys(deployments).sort(codepoint).map(homeId => {
```
⇒ `forceInField`: the ledger is **KEYED BY the fielding settlement's own id**, and *"currently"* is
the stage. `deployments[record.id]` is the whole scoped read.

```
$ sed -n '825,835p' src/domain/region/graph.js
export function activeChannelsFrom(graph, settlementId, options = {}) {
  const { includeSuggested = false, … } = options;
  return ensureRegionalGraph(graph || {}).channels.filter(channel => {
    if (String(channel.from) !== String(settlementId)) return false;     ← :830 SUBJECT
    …
    if (channel.status === 'confirmed') return true;                     ← :834 STAGE
```
⇒ `openRoute` r1: **both properties are the reader's own first and last filter lines.**

`npcPresent`: the people are the record's own; `status === 'active'` is the stage. Both held.

### §18.2 · ⛔⛔ THE ONE SERIOUS FIND — `beliefExists`' reader was REALM-WIDE

```
$ sed -n '185,191p' src/domain/display/settlementBeliefs.js
/**
 * Panel-presence gate: does this world carry ANY belief map? Dormant (no key) ⇒
 * false ⇒ no "what they believe" surface renders ⇒ byte-identical UI.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 */
export function hasBeliefMaps(worldState) {
  const maps = getSpatialLedger(worldState, 'beliefMaps');
  return !!maps && typeof maps === 'object' && !Array.isArray(maps) && Object.keys(maps).length > 0;
```

⇒ **the reader version 1 named answers a REALM question.** Under the chair's law it would offer
the seal on town A because town B has a belief map — the defect the law names.

**The fact is still LIVE: the ledger is keyed by observer id.**

```
$ sed -n '149,151p' src/domain/display/settlementBeliefs.js
  const maps = asObject(getSpatialLedger(worldState, 'beliefMaps'));
  const byFaction = asObject(maps[String(observerId)]);          ← keyed by OBSERVER

$ sed -n '89p' src/domain/briefs/composers.js
    ? /** @type {Record<string, unknown>} */ (ledgers).beliefMaps : null;

$ git grep -n "export function getSpatialLedger" -- 'src/**'
src/domain/spatial/spatialLedgerAccess.js:78:export function getSpatialLedger(worldState, key) {
```

⇒ the leaf reads **`getSpatialLedger(ws,'beliefMaps')[record.id]`** and `hasBeliefMaps` **demotes
to a dormancy pre-gate**. ✅ **A READER defect, not a FACT defect — the LIVE verdict stands, so
this is NOT a BLOCKED finding.**

### §18.3 · The four other rows the leaf must filter

```
$ sed -n '84,89p' src/domain/display/warStatus.js
 * @returns {Array<{ targetId: string, coalition: string[], frontCount: number, visibility: string }>}
 *   codepoint-sorted by targetId; empty when no sieges are live.
export function liveSieges({ worldState, regionalGraph } = … ) {
  const fronts = confirmedWarFronts(regionalGraph);
```
⇒ `siegeInProgress`: **every live siege in the realm**; filter `targetId === id || coalition.includes(id)`.
**Stage already held** — `confirmedWarFronts` plus live deployments.

```
$ sed -n '44,47p' src/domain/worldPulse/peaceTermsGraph.js
/** Find the REAL graph edge key between two settlements (the relationshipStates
 *  overlay is keyed by the edge's own id, so a synthesized key would orphan). */
$ grep -n "export function edgeKeyBetween" src/domain/worldPulse/relationshipEvolution.js
339:export function edgeKeyBetween(edges, a, b) {
```
⇒ `tradeWith`: filter by **the pair's edge key**; `null` when no edge connects them ⇒ `false`.

```
$ sed -n '207,213p' src/domain/worldPulse/foodStockpile.js
export function blockadeFor(worldStateStressors = [], settlementId) {
  const sid = String(settlementId);
  for (const s of worldStateStressors || []) {
    if (!BLOCKADE_TYPES.has(s?.type)) continue;
    if (!ACTIVE_STAGES.has(s.lifecycleStage || 'active')) continue;      ← STAGE
    if (!(s.affectedSettlementIds || []).map(String).includes(sid)) continue;   ← SUBJECT

$ grep -n "const ACTIVE_STAGES" src/domain/worldPulse/foodStockpile.js
98:const ACTIVE_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);
$ grep -c "export const ACTIVE_STAGES" src/domain/worldPulse/foodStockpile.js
0                                        ⛔ MODULE-PRIVATE — the leaf declares its own four

$ sed -n '34,42p' src/domain/worldPulse/stressorsCore.js
export const STRESSOR_LIFECYCLE_STAGES = Object.freeze([
  'emerging', 'active', 'peaking', 'easing', 'resolved', 'residual', 'dormant',
]);
```
⇒ `plotInMotion`: the precedent is `blockadeFor`/`famineFor` (`:207`/`:234`) and it does **both**.
`ACTIVE_STAGES`' home is `foodStockpile.js:98` **and it is not exported**, so the leaf declares the
same four and A2 asserts them set-equal to the exported **seven minus** `resolved`/`residual`/`dormant`.

```
$ sed -n '116,120p' src/domain/worldPulse/routeNetworkLedger.js
 * @typedef {Object} RouteEdge
 * @property {string} a                 endpoint, codepoint-low
 * @property {string} b                 endpoint, codepoint-high
 * @property {string} grade             one of ROUTE_GRADES

$ grep -n "export const ROUTE_GRADES" src/domain/worldPulse/routeNetworkLedger.js
64:export const ROUTE_GRADES = Object.freeze(['highway', 'road', 'track', 'hidden']);
```
⇒ `openRoute` r2: filter `e.a === id || e.b === id` **and** `e.grade !== 'hidden'` — the module's
own decay law is *"the bottom rung is HIDDEN rather than absence"*, so a decayed way is still an
edge and would otherwise offer "Direct trade" down an overgrown remnant.

### §18.4 · The audit's tally, and the cost

| | reader already scoped | leaf must filter |
|---|---:|---:|
| SUBJECT | 4 (`warInProgress`, `forceInField`, `npcPresent`, `openRoute` r1) | **5** (`siegeInProgress`, `tradeWith`, `beliefExists`, `plotInMotion`, `openRoute` r2) |
| STAGE | 7 | **2** (`plotInMotion`, `openRoute` r2) |

**+≈8 effective lines** ⇒ leaf 2 at **≈83–93 of 250**, ≥157 margin ⇒ **PROCEED, no split.**

⛔ **NO BLOCKED FINDING: nothing in the audit contradicts a row's LIVE verdict.** The only
verdict-adjacent find is §18.2, and it is a reader correction, not a fact refutation.

---

## §19 · R10 — the nine owed rows, and the one that has no symbol

```
$ for each: grep -c '<exact declaration text>' <file>
1  src/domain/roads/embassyHazard.js                    :: export function atWarWith
1  src/domain/worldPulse/tickIndices.js                 :: export function atWarWithIdx
1  src/domain/display/warStatus.js                      :: export function liveSieges
1  src/domain/worldPulse/relationshipCompatibility.js   :: export const PRIMARY_RELATIONSHIP_TYPES
1  src/domain/worldPulse/relationshipEvolution.js       :: export function edgeKeyBetween
1  src/domain/display/settlementBeliefs.js              :: export function hasBeliefMaps
1  src/domain/spatial/spatialLedgerAccess.js            :: export function getSpatialLedger
1  src/domain/worldPulse/routeNetworkLedger.js          :: export const ROUTE_GRADES
1  src/domain/worldPulse/stressorsCore.js               :: export const STRESSOR_LIFECYCLE_STAGES
```

⇒ **`requiredSymbols` 18 → 23 → 32.** Four of the nine (`edgeKeyBetween`, `getSpatialLedger`,
`ROUTE_GRADES`, `STRESSOR_LIFECYCLE_STAGES`) exist **because R9's scoping made the leaf call them**.

⛔ **`forceInField` GETS NO ROW, AND THE STANDARD IS THE REASON.** Its reader is a **field** —
`worldState.deployments[record.id]`, a keyed lookup. The two exported functions over that field
return *war pairs* (`activeWarPairs`, `briefs/composers.js:117`) and *deployment rows*
(`activeDeployments`, `warStatus.js:133`), **not a per-settlement boolean**, so the leaf calls
neither. Naming one would pin a symbol the deliverable does not reach — exactly what *"only what
the deliverable must PRESERVE"* forbids. Its protection is **A2 arm 4's keyed negative control**.

**All 32 rows present verbatim, and the base re-proved over the NEW twenty-path list:**

```
$ node -e '<load the manifest; count each row.symbol in its file at 023eda2ec>'
ALL 32 ROWS PRESENT VERBATIM AT 023eda2ec ✓
distinct paths: 20

$ git diff --stat d31af2cee 023eda2ec -- <the twenty paths, read from the manifest itself>
(no output — NOT ONE of the twenty moved)
```

⇒ the base stays **`d31af2cee`**; the chair re-pins at promotion.

---

## §20 · R11 — the census as a delta, derived from the walker's own expressions

```
$ sed -n '601,604p' tests/lint/sovereigntyLightingContract.walker.test.js
  const parked = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length > 0);
  const credited = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length === 0);
  const titles = credited.reduce((sum, { src }) => sum + liveTitlesIn(src).length, 0);
  const suiteTitles = credited.reduce((sum, { src }) => sum + liveSuiteTitlesIn(src).length, 0);

$ sed -n '515,518p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests'))
  .filter((p) => /\.test\.(js|jsx)$/.test(p))
```

| figure | delta | derived from |
|---|---:|---|
| `files` | **+1** | the one `CREATE` TEST row; the two `src/domain/edit/**` leaves move it by ZERO |
| `parked` | **+0** | the new file carries no park reason |
| `credited` | **+1** | unparked ⇒ credited; moves with `files`, never apart |
| `titles` | **+8** | the eight straight-line `it` arms A1–A8 — **this figure IS the acceptance count** |
| `suiteTitles` | **+1** | the ONE literal `describe` (§P3.4 forbids nesting) |

§7 now carries this table, the line *"the absolute tuple is stamped by the chair at promotion from
`tests/lint/.lighting-census-baseline.json`; a hand-composed absolute here is the stale-numeral
class"*, and the verbatim-red **shape** with a placeholder: `expected ‹B›+1 to be ‹B›`, marked as
a form rather than a figure. **Every absolute tuple is gone from the packet** — the header's base
note and §3's baseline posture now point at §7's rule instead of quoting numbers.

---

## §21 · What this lane still did NOT do, applying the rulings

Ran **no** gate, vitest, eslint or writing script. Wrote **only** under
`$SP/lane-b1a-repin-scratch/`. Re-pinned **no** base. **Invented no symbol** — every one of the
nine new rows is a quoted `grep -c` → 1, and the one reader with no symbol (`forceInField`) is
**declared as having none** rather than given an invented row. **Adjudicated nothing:** where the
audit found a reader defect (§18.2) it is reported as a correction with the docstring that proves
it, and where it found nothing contradicting a verdict it says so plainly.
