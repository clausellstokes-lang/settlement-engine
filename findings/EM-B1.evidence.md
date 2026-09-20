# EM-B1 — compile evidence

Every fact `EM-B1.md` and `EM-B1.manifest.json` call verified is proved by a command below with
its real output. A fact with no command here is not verified.

**Lane:** EM COMPILE LANE P2 (Opus), session 923472dc, letter `b`.
**Worktree read (never written):** `$SP/consist`. **Wrote only under:** `$SP/lane-em-b-scratch/`.
**Ran no vitest, no eslint, no `npm run check`, no writing script.** All reads.

---

## §0 · The base, its two movements, and the byte-identity proof

```
$ git -C $SP/consist rev-parse HEAD ; date     # before any measurement
d31af2ceebf643818201b2e2ab4a556765d2fc7c
Sat Sep 19 11:01:32 EDT 2026
```

✅ The brief's pinned base confirmed BEFORE measuring.

```
$ date; git rev-parse HEAD
Sat Sep 19 11:17:13 EDT 2026
a03ebb09a17e0a96c1d6261a41257430bb7fbd32

$ git merge-base --is-ancestor d31af2cee... HEAD && echo "YES ancestor"
YES ancestor

$ git log --oneline d31af2cee.....HEAD
a03ebb09a DOC: the EM preamble carries the phantom consequence rule (HZ-PHANTOM, a STOP condition, the §13 citation; ODQ §934.43)
023085560 DOC: the phantom consequence rule folds onto the build branch (design §13, the ARCH's phantom/Op/tick rows, the charter's EM-F1 row; ODQ §934.43)
7a0fe5889 The generation worker's ceiling re-mints exact at 1,399,946 B …
34f320829 The preview persona's env file is development-scoped and ignored: .env.*.local
02968876b DOC: the EM family packet preamble …

$ git diff --stat d31af2cee.....HEAD
 .gitignore | 3 + ; docs/ARCH_EDIT_MODE_AND_DECREES.md | 8 +- ;
 docs/DESIGN_EDIT_MODE_AND_DECREES.md | 21 + ;
 docs/implementation/charters/EDIT-MODE-TRAIN.md | 2 +- ;
 docs/implementation/preambles/EM-PREAMBLE.md | 80 + ;
 tests/build/generationWorkerLazy.test.js | 8 +-
 6 files changed, 117 insertions(+), 5 deletions(-)
```

**Blob-identity of every path this packet measures, across the FULL window:**

```
IDENTICAL  src/domain/factionRename.js
IDENTICAL  src/generators/power/rulingStructure.js
IDENTICAL  src/generators/structuralValidator.js
IDENTICAL  src/domain/factionArchetypes.js
IDENTICAL  src/domain/deterministicSort.js
IDENTICAL  src/data/constants.js
IDENTICAL  tests/lint/sovereigntyLightingContract.walker.test.js
IDENTICAL  tests/lint/.lighting-census-baseline.json
IDENTICAL  scripts/mutation-coverage-manifest.json
IDENTICAL  tests/lint/chooserTotality.walker.test.js
IDENTICAL  tests/lint/mutationCoverage.shared.mjs
IDENTICAL  scripts/lib/writer-reach-scan.mjs
IDENTICAL  docs/implementation/PACKET_MANIFEST.json
IDENTICAL  docs/implementation/PACKET_STANDARD.md
(+ the nine EM-A2 paths, all IDENTICAL — full list in EM-A2.evidence.md §0)
```

⇒ **J-T1** satisfied. The packet holds `d31af2cee`. **RAISED R0.**

```
$ git -C $SP/consist status --short
(no output — clean, so no foreign dirt is being read as tree state)

$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
398e562b125edbf61cd9fcfa855c219411fa738af1a8047bb307cc1e60558abb  …/EM-PREAMBLE.md
```

---

## §0a · The chair's amendment, read at its source

The amendment arrived mid-compile. It was NOT taken on the message alone — design §13, the ARCH's
amended rows and the preamble's amended rows were read in the tree.

```
$ sed -n '<§13>,$p' docs/DESIGN_EDIT_MODE_AND_DECREES.md
## 13. The phantom consequence rule (the owner, ODQ §934.43; 2026-09-19)
**The rule.** A phantom counterparty can absorb an act but never return one. …
**What a phantom act produces — exactly two things.**
1. **The home procedures.** … returns through the existing muster, casualty and upkeep
   mechanics exactly as any returning force does. …
2. **The record.** The chronicle carries the declaration or the outcome …
**What it never produces.** No war state, no treaty, no trade route, no envoy state, no
faction-power or legitimacy shift derived from the phantom. Phantoms never enter the world pulse …
**What this simplifies.** … the op catalogue (EM-B1) carries one `consequence` policy per
off-stage op — `home-procedures+record` for a phantom target, `world` for a real save — decided
at apply time by the target's reality; the tick hook (EM-E1) applies that policy and nothing else.
```

```
$ git diff d31af2cee...HEAD -- docs/ARCH_EDIT_MODE_AND_DECREES.md
-/** @typedef {{ type: string, target: EntityRef, payload: …
- *   duration?: number }} Op */
+ *   duration?: number, stage?: 'home'|'off-stage' }} Op */
+// An off-stage op's CONSEQUENCE is decided at apply time by the target's reality (§13):
+// a phantom → the home procedures + the record; a real save → the campaign's machinery.
…
+ `consequenceFor(target) → 'home-procedures+record' \| 'world'`      (the phantoms row)
```

```
$ git diff 02968876b..HEAD -- docs/implementation/preambles/EM-PREAMBLE.md
-| HZ-PHANTOM | a phantom is a minimal save record … promotion replaces the record in place |
+| HZ-PHANTOM | … **The phantom consequence rule (design §13, ODQ §934.43):** a phantom act
+  yields the HOME PROCEDURES … and the RECORD … and never world state; consequence the DM wants
+  is a separate home decree the registry may offer but never applies; … |
-…; an applied decree would be edited in place; or the tier gate would be spelled …
+…; an applied decree would be edited in place; a phantom-side world state (a war state, a
+ treaty, a route) would appear necessary; or the tier gate would be spelled …
```

⇒ the amendment is carried into `EM-B1.md` §1 (authority row 1), §6 (the policy table), §5
(forbidden alternatives), §9 (A3, A4, A8) and §11 (two new STOPs), with the resolver
`consequenceFor` left to EM-F1 and named nowhere in this packet's code.

⚠ **The charter's EM-B1 row itself is UNCHANGED in the window** — only the EM-F1 row moved:

```
$ git diff d31af2cee...HEAD -- docs/implementation/charters/EDIT-MODE-TRAIN.md
-| **EM-F1** phantoms as hidden saves | … off-stage ops … with home consequences; …
+| **EM-F1** phantoms as hidden saves | … off-stage ops … under THE PHANTOM CONSEQUENCE RULE
+  (design §13, §934.43) … `consequenceFor(target)`; the registry's PHANTOM/REAL badge; …
```

⇒ so EM-B1's charter row still names `checkInstCompat` and still says "the first twenty op types",
which is why R1 and R2 below are raised rather than assumed cured.

---

## §1 · `requiredSymbols` — every row proved present, verbatim

```
$ while IFS='|' read -r f s; do n=$(grep -c -- "$s" "$f"); echo "$n  $f  ::  $s"; done <<EOF
1  src/domain/factionRename.js  ::  export function applyFactionRenameToSettlement
1  src/domain/factionRename.js  ::  export function factionRenameChanges
1  src/domain/factionRename.js  ::  export function applyNpcRenameToSettlement
1  src/domain/factionRename.js  ::  export function npcRenameChanges
1  src/domain/factionRename.js  ::  export function resolveFactionForRename
1  src/domain/factionRename.js  ::  export const FACTION_RENAME_SURFACES
1  src/domain/factionRename.js  ::  export const NPC_RENAME_SURFACES
1  src/generators/power/rulingStructure.js  ::  export const renormalizeFactionPower
1  src/generators/structuralValidator.js  ::  export const checkInstCompat
1  src/generators/structuralValidator.js  ::  export const checkStructuralValidity
1  src/data/spatialData.js  ::  export const GATE_FEATURES
1  src/domain/factionArchetypes.js  ::  export const FACTION_ARCHETYPES
1  src/domain/deterministicSort.js  ::  export const compareCodepoint
```

**No symbol the packet CREATES (`OP_TYPES`, `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, `makeOp`,
`validateOp`) is named in the manifest** — the standard withdraws "preserves **or creates**" as
unenforceable before LANDED.

---

## §2 · ⛔ FINDING F-B1 — `checkInstCompat` is a prose picker, refuted by its own body

```
$ grep -n "^export" src/generators/structuralValidator.js
8:export { getBaseChance } from './institutionProbability.js';
26:export { SPECIAL_RESOURCES as RELATION_TYPES } from '../data/goods/identity.js';
32:export const SPATIAL_FEATURES = {
269:export const checkInstCompat = (institutions, tier, _magicPriority) => {
348:export const checkStructuralValidity = (institutions, config = {}) => {

$ sed -n '269,290p' src/generators/structuralValidator.js
export const checkInstCompat = (institutions, tier, _magicPriority) => {
  const names = nativeSemanticNames(institutions).map(name => name.toLowerCase());
  const has   = (...keywords) => keywords.some(k => names.some(n => n.includes(k)));
  if (has('great cathedral')) {
    return pickRandom([
      "The great cathedral's spire is the tallest thing for miles.",
      'A cathedral dominates the skyline. …',
    ]);
  }
  if (has('cathedral') && tier !== 'thorp' && tier !== 'hamlet') {
    return pickRandom([ 'A stone cathedral anchors the high ground.', … ]);
  }
  …

$ grep -n "pickRandom" src/generators/structuralValidator.js | head -1
7:import {getTradeRouteFeatures, pickRandom, tierAtLeast} from './helpers.js';
```

⇒ `(institutions, tier, _magicPriority) → string`. **A narrative sentence, chosen with a draw.**
No boolean, no violations, no verdict. It cannot be the prerequisite guard rule's ground.

**The symbols that are:**

```
$ sed -n '348,351p' src/generators/structuralValidator.js
export const checkStructuralValidity = (institutions, config = {}) => {
  const violations  = [];
  const suggestions = [];

$ grep -n "return { violations" src/generators/structuralValidator.js
859:  return { violations, suggestions };

$ grep -n "export const GATE_FEATURES" -A 12 src/data/spatialData.js
34:export const GATE_FEATURES = {
35-  "Gates (if walled)": {
36-    suggestionOnly: true,
37-    requires: ["Town walls", "City walls and gates", "Massive walls and fortifications"],
38-    reason: "Gates are entry points in walls. Walls must exist first."
39-  },
40-  Citadel: {
41-    requires: ["City walls and gates", "Massive walls and fortifications"],
42-    reason: "Inner fortress requires outer defenses."
43-  },
```

⇒ a live `requires` prerequisite table whose first rows are exactly the design's example shape.
**EM-B1 calls none of the three, so it is not blocked; EM-C3's charter row names the wrong symbol.
RAISED R2.**

---

## §3 · `renormalizeFactionPower` MUTATES IN PLACE — measured, not assumed

```
$ sed -n '35,60p' src/generators/power/rulingStructure.js
export const renormalizeFactionPower = (factions) => {
  if (!factions || !factions.length) return factions;
  const total = factions.reduce((sum, f) => sum + (f.power || 0), 0);
  if (total <= 0) return factions;
  const shares = factions.map((f, i) => { … });
  let leftover = 100 - shares.reduce((sum, s) => sum + s.floor, 0);
  shares.slice().sort((a, b) => b.remainder - a.remainder || a.i - b.i)
    .forEach((s) => { if (leftover > 0) { s.floor += 1; leftover -= 1; } });
  shares.forEach((s) => {
    factions[s.i].power = s.floor;          // ⛔ IN-PLACE WRITE
  });
  return factions;                          // ⛔ THE SAME REFERENCE
};
```

⇒ largest-remainder to an exact 100, ties by current order; the argument is returned unchanged
when the roster is empty or every power is ≤ 0. **A caller that assumed purity would corrupt a
roster.** Recorded in `requiredSymbols` for EM-C3, which is the packet that will call it.

---

## §4 · The rename cascade — shape and the join-key evidence

```
$ grep -n "^export" src/domain/factionRename.js
241:export const FACTION_RENAME_SURFACES = Object.freeze([
281:export const NON_CASCADED_SURFACES = Object.freeze([
317:export const NPC_RENAME_SURFACES = Object.freeze([
341:export const NPC_NON_CASCADED_SURFACES = Object.freeze([
540:export function resolveFactionForRename(settlement, factionIndex) {
565:export function renameInterSettlementReference(relationship, oldName, newName) {
621:export function applyFactionRenameToSettlement(settlement, oldName, newName) {
768:export function factionRenameChanges(settlement, oldName, newName) {
796:export function applyFactionRenameToPartner(partnerSettlement, hostName, oldName, newName) {
845:export function applyNpcRenameToSettlement(settlement, oldName, newName) {
908:export function npcRenameChanges(settlement, oldName, newName) {
941:export function applyNpcRenameToPartner(partnerSettlement, hostName, oldName, newName) {

$ sed -n '615,626p' src/domain/factionRename.js
 * @returns {{ changed: boolean, touched: string[] }} `touched` names the
 *   surfaces that actually moved, for receipts and for the cascade pin.
export function applyFactionRenameToSettlement(settlement, oldName, newName) {
  const touched = [];
  if (!isRecord(settlement) || !oldName || !newName || oldName === newName) {
    return { changed: false, touched };
  }

$ sed -n '762,772p' src/domain/factionRename.js
 * @returns {{ changed: boolean, touched: string[], changes: StoredRecord }}
export function factionRenameChanges(settlement, oldName, newName) {
  if (!isRecord(settlement)) return { changed: false, touched: [], changes: {} };
  for (const bucket of CASCADE_BUCKETS) { … deepClone … }
```

**The join-key evidence, in the file's own words:**

```
$ sed -n '35,47p;241,258p' src/domain/factionRename.js
 * NAMES ARE JOIN KEYS. That is the whole difficulty. Factions are referenced by
 * … governing seat, and breaks institution attribution. FACTION_RENAME_SURFACES
 * requires every path it finds to appear in FACTION_RENAME_SURFACES or in …
export const FACTION_RENAME_SURFACES = Object.freeze([
  { path: `${ROSTER}.faction`, kind: 'key', why: 'the canonical display name' },
  { path: `${ROSTER}.name`, kind: 'key', why: 'the legacy alias every tolerant reader falls back to' },
  { path: 'powerStructure.governingName', … },
  { path: 'powerStructure.government', … },
  { path: `${PAIRWISE}.pair[]`, … },
  // The NPC family, declared once and mirrored across both homes … Spread rather
  // than hand-listed so the two homes cannot drift — the drift IS the bug this replaced.
  ...NPC_HOMES.flatMap(home => NPC_FACTION_FIELDS.map(field => ({ … }))),
  { path: 'institutions[].factionSource', … },
  { path: 'factions[].name', … },
  { path: 'factions[].powerFactionName', … },
```

⇒ HZ-JOINKEY's ground, and the reason the `rename-*` ops delegate rather than re-implement (A5).

---

## §5 · The op-type count — ARCH §9's twenty carry no rename op

```
$ grep -n "Op types (first twenty)" docs/ARCH_EDIT_MODE_AND_DECREES.md
101:- **Op types (first twenty):** set-field, add-institution, remove-institution, add-npc,
remove-npc, add-faction, remove-faction, set-power-holder, rebalance-power, set-relationship,
declare-war (on-stage / phantom), make-peace, open-trade, close-trade, send-force, recall-force,
resolve-outcome (victory/defeat/stalemate/truce), found-phantom, promote-phantom, set-state.
```

Counted: **twenty, and not one is a rename.** Design §12.3 (governing) mandates three:

```
$ grep -n "free-cascade" docs/DESIGN_EDIT_MODE_AND_DECREES.md | head -3
… a third field kind, `free-cascade` — typeable, but a change is a typed op (`rename-faction`,
`rename-npc`, `rename-settlement`) that runs the existing cascade …
```

And the charter's EM-B1 row: *"`rename-*` ops call the existing cascade"*.

⇒ the catalogue must be **twenty-three**, or three of the twenty must be displaced. §12 governs, so
the packet specifies twenty-three — **and that moves the line estimate by ~15%. RAISED R1.**

**The chair's amendment fixes the off-stage seven exactly**, which is the partition A3 pins:
`declare-war, make-peace, open-trade, close-trade, send-force, recall-force, resolve-outcome`.

---

## §6 · The registration ledger — every verdict, executed

**P2.2 — the mutation-coverage row IS owed, and its shape is measured:**

```
$ grep -n "ENFORCER_DIRS" -A 2 tests/lint/mutationCoverage.shared.mjs
36:export const ENFORCER_DIRS = [
37:  'tests/lint',

$ sed -n '3,7p' tests/lint/mutationCoverage.shared.mjs
 * shared between tests/lint/mutationCoverageManifest.test.js (the meta-test) and …
 *   1. EVERY *.test.js / *.test.jsx under the EIGHT ENFORCER DIRS — those trees …

$ node -e '<load>; console.log(Object.keys(m)); console.log("invariants rows:", …)'
[ '_doc', 'uncoveredBaseline', 'rationales', 'invariants', 'meta' ]
invariants rows: 704
kinds: rationale,mutation,uncovered

$ ls -la scripts/mutation-coverage-manifest.json
-rw-r--r--  1 cstokes  wheel  471932 … scripts/mutation-coverage-manifest.json
```

A live `rationale` row, for the shape the packet's REGISTER row copies:

```
"tests/lint/customContentCharsetWiring.test.js": {
  "kind": "rationale",
  "rationale": "THE CHARSET WIRING WALKER (CHARSET Car 2). Its catching power is EXECUTED, not
   claimed, and it was executed as FOUR planted mutations on 2026-09-05, each planted, run under
   the gate mutex, restored by inverse edit and cmp-verified byte-identical … (1) Deleting
   `authoring: false` … reddened 'the account-import pack lane asks prepareImport for a restore'
   (TRUE_EXIT 1, 1 failed / 14 passed). …"
}
```

⇒ 704 → 705, surgical, and the rationale carries the EXECUTED account — which is why §8 writes it
after the mutants, never before.

**P2.1 — the census counts TEST files (the same refutation EM-A2 records as F3):**

```
$ sed -n '515,518p;612p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests')).filter((p) => /\.test\.(js|jsx)$/.test(p))…
      files: TEST_FILES.length,

$ cat tests/lint/.lighting-census-baseline.json   (tail)
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
```

⇒ predicted `+2 files / +0 parked / +2 credited / +8 titles / +2 suiteTitles`, driven by the two
new TEST files. **RAISED R4.**

**P2.4 — the writer-reach register cannot move:**

```
$ sed -n '115,117p' scripts/lib/writer-reach-scan.mjs
export const SURFACE_CLOSURE_STOP = Object.freeze([
  'src/generators/', 'src/store/', 'src/workers/', 'src/lib/instantWorld/',
]);
```

**P2.5 — not owed; this packet mints no chooser and draws nothing.** (And the register's roots do
not reach `src/domain/edit` in any case — `chooserTotality.walker.test.js:64-69`.)

**P2.3 — the OSR scanner sees the leaf, so the check is run plain:**

```
$ sed -n '250p' scripts/check-observed-shape-readers.mjs
/** Every `.js`/`.jsx` under `src/` — the whole app, not just `src/domain`: …
```

**Collision and CREATE-absence — the scan, executed:**

```
$ node -e '<load PACKET_MANIFEST.json>; per path, count holders and NON-TERMINAL holders'
src/domain/edit/operations.js                         | total holders: 0  | NON-TERMINAL: 0
tests/domain/editOperations.test.js                   | total holders: 0  | NON-TERMINAL: 0
tests/lint/opGuardCoverage.walker.test.js             | total holders: 0  | NON-TERMINAL: 0
scripts/mutation-coverage-manifest.json               | total holders: 26 | NON-TERMINAL: 0
tests/lint/sovereigntyLightingContract.walker.test.js | total holders: 89 | NON-TERMINAL: 0
--- statuses present across all 182 packets: LANDED,SUPERSEDED
```

⭐ **Every registered packet is TERMINAL at this base**, so nothing in the manifest reserves any
path — including the 26 terminal holders of the mutation-coverage manifest, which is why this
packet may claim its REGISTER row outright. The live collision is with the **EM siblings being
compiled now**: DRAFT reserves exactly as READY does, so two EM members holding the census walker
red `validate:packets`. Hence the §7 deferral.

$ for p in …; do [ -e "$p" ] && echo EXISTS || echo ABSENT; done
ABSENT  src/domain/edit/operations.js
ABSENT  tests/domain/editOperations.test.js
ABSENT  tests/lint/opGuardCoverage.walker.test.js
ABSENT  src/domain/edit
```

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
179:const IN_ROOTS = DOMAIN_FILES.filter((rel) => SCAN_ROOTS.some((r) => rel.startsWith(`${r}/`)));
182:function scanIdiomForks(files) { … }
```

⇒ A7 copies the register-walker shape (declared set SET-EQUAL to the live scan, both directions,
full offender list) that HB-1's A7/A8 established.

⚠ **`tests/domain/factionRename.test.js` was NOT measured by this lane.** It is named in the
packet's §10 from the estate's naming convention only, and the packet says so and directs the
implementer to resolve it at preflight. **RAISED R5.** An unmeasured path is not a verified fact.

---

## §8 · The budget arithmetic behind the STOP AND SPLIT

The cap is **effective** lines (eslint `max-lines`, `skipBlankLines`, `skipComments`), so header
and rationale comments cost nothing. The estimate is over the code, not the prose:

| part | per unit | count | effective |
|---|---:|---:|---:|
| op rows (ten declared fields each, written tightly) | 8–9 | 23 | 184–207 |
| `makeOp` | — | — | ~15 |
| `validateOp` (seven-step algorithm, §8) | — | — | ~40 |
| closed vocabularies (`OP_STAGES`, policies, target kinds, payload-spec) | — | — | ~12 |
| helpers + freezing | — | — | ~15 |
| imports | — | — | ~5 |
| **total at 23 types** | | | **≈267** |
| **total at the ARCH's bare 20** | | | **≈234** |

⇒ **over the 250 leaf cap on the reading design §12.3 compels**, and within 16 lines of it on the
other. Neither is a margin a compiler may certify, so §3 invokes STOP AND SPLIT along the line the
chair's own §934.43 amendment draws — **EM-B1a** (machinery + the sixteen home ops, ≈215) and
**EM-B1b** (the seven off-stage ops + the coverage walker + its register row, ≈83). **RAISED R3.**

⚠ The figures are ESTIMATES over code that does not exist, labelled as such in the packet and the
manifest, and §11 makes crossing 250 a STOP rather than a renegotiation.

---

## §9 · What this lane did NOT do

- Ran **no** vitest, eslint, `npm run check`, or any writing script.
- Wrote **nothing** in `$SP/consist` or in `/Users/cstokes/Desktop/settlement-engine`.
- Named **no** symbol it did not prove present (§1).
- Took the chair's amendment **on the tree, not on the message** — design §13, the ARCH diff and
  the preamble diff are all read above (§0a).
- Raised **no** budget and invented **no** figure.
- Adjudicated **nothing**: R0–R5 are listed in the packet's §13 for the chair. In particular the
  op-type COUNT (R1), the `checkInstCompat` correction (R2) and the SPLIT (R3) are the chair's.
