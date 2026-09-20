# EM-A2 — compile evidence

Every fact `EM-A2.md` and `EM-A2.manifest.json` call verified is proved by a command below with
its real output. A fact with no command here is not verified and must not be read as one.

**Lane:** EM COMPILE LANE P2 (Opus), session 923472dc, letter `b`.
**Worktree read (never written):** `$SP/consist`, `SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`.
**Wrote only under:** `$SP/lane-em-b-scratch/`.
**Ran no vitest, no eslint --fix, no `npm run check`, no writing script.** All reads.

---

## §0 · The base, its movement, and the byte-identity proof

```
$ git -C $SP/consist rev-parse HEAD            # 11:01:32 EDT, before any measurement
d31af2ceebf643818201b2e2ab4a556765d2fc7c
$ git -C $SP/consist rev-parse --abbrev-ref HEAD
fixes-2026-09-18-consist
$ date
Sat Sep 19 11:01:32 EDT 2026
```

✅ The brief's pinned base was confirmed BEFORE measuring, as the brief requires.

**It then moved twice under the lane.**

```
$ date; git -C $SP/consist rev-parse HEAD      # mid-compile
Sat Sep 19 11:06:09 EDT 2026
02968876bee94807a4c1b216600b3966ceb0bbd9

$ date; git -C $SP/consist rev-parse HEAD      # after the chair's §934.43 amendment
Sat Sep 19 11:17:13 EDT 2026
a03ebb09a17e0a96c1d6261a41257430bb7fbd32
```

```
$ git merge-base --is-ancestor d31af2ceebf643818201b2e2ab4a556765d2fc7c HEAD && echo "YES ancestor"
YES ancestor

$ git log --oneline d31af2ceebf643818201b2e2ab4a556765d2fc7c..HEAD
a03ebb09a DOC: the EM preamble carries the phantom consequence rule (HZ-PHANTOM, a STOP condition, the §13 citation; ODQ §934.43)
023085560 DOC: the phantom consequence rule folds onto the build branch (design §13, the ARCH's phantom/Op/tick rows, the charter's EM-F1 row; ODQ §934.43)
7a0fe5889 The generation worker's ceiling re-mints exact at 1,399,946 B, attributed per module to the sacred-house layout derivation (§934.19 addendum; vetoable)
34f320829 The preview persona's env file is development-scoped and ignored: .env.*.local
02968876b DOC: the EM family packet preamble — the settlement editor's invariants signed once (ODQ §934.36–§934.42; design §12 governs)

$ git diff --stat d31af2ceebf643818201b2e2ab4a556765d2fc7c..HEAD
 .gitignore                                      |  3 +
 docs/ARCH_EDIT_MODE_AND_DECREES.md              |  8 ++-
 docs/DESIGN_EDIT_MODE_AND_DECREES.md            | 21 +++++++
 docs/implementation/charters/EDIT-MODE-TRAIN.md |  2 +-
 docs/implementation/preambles/EM-PREAMBLE.md    | 80 +++++++++++++++++++++++++
 tests/build/generationWorkerLazy.test.js        |  8 ++-
 6 files changed, 117 insertions(+), 5 deletions(-)
```

⭐ **The only non-docs paths in the window are `.gitignore` and an EDIT to an existing test file.**
An edit to an existing `*.test.js` cannot move the lighting census's `files` figure (which counts
files, not lines) — and the census baseline is proved unmoved below, so it cannot have moved
`titles` either.

**Blob-identity of every measured path across the FULL window `d31af2cee..a03ebb09a`:**

```
$ for p in <the 23 paths>; do a=$(git rev-parse d31af2cee...:$p); b=$(git rev-parse HEAD:$p); ...
IDENTICAL  src/generators/lookups.js
IDENTICAL  src/kernel/prng.js
IDENTICAL  src/kernel/rngContext.js
IDENTICAL  src/generators/npcGenerator.js
IDENTICAL  src/data/namingData.js
IDENTICAL  src/domain/factionArchetypes.js
IDENTICAL  src/domain/npc/npcOps.js
IDENTICAL  src/data/resourceData.js
IDENTICAL  src/domain/display/pantheonDepth.js
IDENTICAL  src/domain/factionRename.js
IDENTICAL  src/generators/power/rulingStructure.js
IDENTICAL  src/generators/structuralValidator.js
IDENTICAL  src/domain/dossier/powerStrata.js
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
```

⇒ `PACKET_STANDARD.md`'s **J-T1** clause is satisfied: the descendant is docs-plus-two-unrelated-files
with **every measured path byte-identical**, so every figure below stands at either sha. The packet
holds `d31af2cee`. **RAISED R0.**

**The worktree was clean when measured (so no foreign dirt is being read as tree state):**

```
$ git -C $SP/consist status --short
(no output)
```

**The preamble's hash, measured at both shas (it moved with the §934.43 amendment):**

```
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
398e562b125edbf61cd9fcfa855c219411fa738af1a8047bb307cc1e60558abb  docs/implementation/preambles/EM-PREAMBLE.md

$ git show 02968876b:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256
481dab280694981bd6460901b774ba3b57c9d7a95271d05bf92966e94e31b3f1  -
```

---

## §1 · `requiredSymbols` — every row proved present, verbatim

The validator resolves a `requiredSymbols` row against the live tree at EVERY status, so each row
below is the exact declaration text and its count in its own file.

```
$ while IFS='|' read -r f s; do n=$(grep -c -- "$s" "$f"); echo "$n  $f  ::  $s"; done <<EOF
1  src/generators/lookups.js  ::  export const getInstitutionsForTier
1  src/generators/lookups.js  ::  export const getInstitutionalCatalog
1  src/generators/lookups.js  ::  export const institutionAvailableAtTier
1  src/kernel/prng.js  ::  export function createPRNG
1  src/data/namingData.js  ::  export const NAMING_DATA
2  src/domain/npc/npcOps.js  ::  export function instantNpc
1  src/domain/factionArchetypes.js  ::  export const FACTION_ARCHETYPES
1  src/domain/dossier/powerStrata.js  ::  export const RELATIONSHIP_KIND_ORDER
1  src/data/resourceData.js  ::  export const RESOURCE_DATA
1  src/data/resourceData.js  ::  export const SPECIAL_RESOURCES
1  src/domain/display/pantheonDepth.js  ::  export function pantheonStandings
1  src/data/constants.js  ::  export const TIER_ORDER
1  src/domain/deterministicSort.js  ::  export const compareCodepoint
```

⚠ `instantNpc` counts **2** — the `export function` line plus one JSDoc reference above it. The
export is real; the second hit is prose. Noted so the count is not read as a duplicate export.

**No symbol the packet CREATES (`POOLS`, `poolValues`, `rollFrom`) is named in the manifest.**
`PACKET_STANDARD.md`'s change-manifest section withdraws the old "preserves **or creates**"
wording as UNENFORCEABLE before LANDED; those three are added at the flip.

---

## §2 · The catalogue measurements — EXECUTED by live import, not read off a table

```
$ node --input-type=module -e '<imports>; …'
NAMING_DATA cultures: 11 ["germanic","latin","celtic","arabic","norse","slavic","east_asian","mesoamerican","south_asian","steppe","greek"]
cultures with full name pools: 11 ["germanic","latin","celtic","arabic","norse","slavic","east_asian","mesoamerican","south_asian","steppe","greek"]
RESOURCE_DATA keys: 33
SPECIAL_RESOURCES keys: 6
TIER_ORDER: ["thorp","hamlet","village","town","city","metropolis"]
FACTION_ARCHETYPES values: 13 ["government","noble","military","merchant","religious","criminal","arcane","craft","labor","outsider","occupation","civic","other"]
getInstitutionsForTier(town) -> ctor: Set size: 85
getInstitutionalCatalog(town) -> categories: 10 rows: 85
```

⭐ **Two facts here are load-bearing and would have been wrong if assumed.**
(a) `getInstitutionsForTier` returns a **`Set`**, not an array — so `poolValues` must spread it,
and a packet that wrote `.map`/`.sort` straight onto the return would have thrown.
(b) The two lookups **agree at 85 rows**, which is what lets the pool use either one without
writing a second tier gate.

`RELATIONSHIP_KIND_ORDER`, read at its source:

```
$ sed -n '170,190p' src/domain/dossier/powerStrata.js
 * The order THE WEB presents relationship kinds in: … This is a
 * PRESENTATION order only …
export const RELATIONSHIP_KIND_ORDER = Object.freeze([
  'corrupted', 'competitive', 'tense', 'subordinate', 'dependent', 'symbiotic',
]);
```

The rejected sibling:

```
$ grep -n "export const PRIMARY_RELATIONSHIP_TYPES" -A 8 src/domain/worldPulse/relationshipCompatibility.js
41:export const PRIMARY_RELATIONSHIP_TYPES = Object.freeze([
42-  'neutral', 43-  'trade_partner', 44-  'allied', 45-  'patron',
46-  'client', 47-  'vassal', 48-  'rival', 49-  'cold_war',
```

⇒ finding **F2**: two live vocabularies answer to "the relationship kinds". The intra-settlement
six is the faction card's. **RAISED R3.**

`pantheonStandings`, and the `[]`-when-absent contract the deity doctrine rests on:

```
$ sed -n '95,105p' src/domain/display/pantheonDepth.js
 * The pantheon ledger as a sorted, normalized array of deity entries (descending
 * seats, then codepoint id). [] when dormant/absent.
 * @param {any} worldState
 * @returns {Array<{ id: string, seats: number, wins: number, losses: number, tier: string, fromMajor: number }>}
export function pantheonStandings(worldState) {
  const pantheon = worldState?.pantheon && typeof worldState.pantheon === 'object' ? worldState.pantheon : null;
  if (!pantheon) return [];
```

---

## §3 · Finding F1 — the name generator premise, refuted

**The charter names "the name generator's export". There is one, and it cannot be used.**

```
$ grep -n "^export" src/generators/npcGenerator.js | tail -1
1719:export const generateSettlementName = (r = 'germanic') => {

$ sed -n '1719,1723p' src/generators/npcGenerator.js
export const generateSettlementName = (r = 'germanic') => {
  const prefixData = NAMING_DATA[resolveNameCulture(r)] || NAMING_DATA.germanic;
  const suffixData = NAMING_DATA[r === 'mixed' ? resolveNameCulture(r) : resolveNameCulture(r)] || prefixData;
  return `${prefixData.settlementPrefixes[Math.floor(_rng() * prefixData.settlementPrefixes.length)]}${…}`;
};

$ grep -n "_rng" src/generators/npcGenerator.js | head -1
16:import { random as _rng, pick as ctxPick } from '../kernel/rngContext.js';
```

**And `rngContext` fails closed:**

```
$ sed -n '30,31p;70,80p' src/kernel/rngContext.js
let _activeRng = null;
function _roll() {
  if (_activeRng) return _activeRng.random();
  throw new Error(
    '[rngContext] a PRNG helper was called with no active seeded RNG. '
    + 'The result would not be reproducible from its seed, so this fails closed. …
```

⇒ calling the export **throws** outside a seeded run and **consumes a world draw** inside one —
the second is what preamble §P5 HZ-PRNG forbids by name.

**The NPC name producer is not exported at all:**

```
$ sed -n '240,251p' src/generators/npcGenerator.js
const pickFirst = (culture = 'germanic', gender = 'male', withSurname = true, tier = 'town') => {
  …
  const firstName = namePool[Math.floor(_rng() * namePool.length)];
```

**The estate's own answer, already in `src/domain`:**

```
$ grep -n "^import" src/domain/npc/npcOps.js | head -1
25:import { createPRNG } from '../../kernel/prng.js';

$ sed -n '<pickFromNaming>,+7p' src/domain/npc/npcOps.js
function pickFromNaming(rng, cultureData, gender) {
  const first = (gender === 'female' ? cultureData?.femaleNames : cultureData?.maleNames) || cultureData?.maleNames || [];
  const last = cultureData?.surnames || [];
  const fn = first.length ? rng.pick(first) : 'Anon';
  …
}

$ sed -n '218,222p' src/domain/npc/npcOps.js
export function instantNpc({ seed = '', namingData = null, role = null, institutionId = null, settlementId = null } = {}) {
  const rng = createPRNG(`instant-npc:${seed}`);
```

⇒ a **root composition**, not a fork, and the culture bag **passed in**. EM-A2 copies it.
**RAISED R2.**

---

## §4 · The PRNG contract, and why `rollFrom` never forks

```
$ sed -n '22,36p;84p' src/kernel/prng.js
export function createPRNG(seed) {
  const _rng = seedrandom(seed);
  const rng = {
    seed,
    random: () => _rng(),
    pick: (arr) => {
      if (!arr || arr.length === 0) return undefined;
      return arr[Math.floor(_rng() * arr.length)];
    },
    …
    fork: (label) => createPRNG(`${seed}::${label}`),
```

```
$ sed -n '66,84p' src/kernel/prng.js      (the fork-delimiter law, abridged)
 * THE '::' DELIMITER IS LOAD-BEARING VOCABULARY, not an internal detail. …
 * tests/kernel/prngForkLabelDelimiter.test.js freezes the families that embed
 * the delimiter and reds when a new one lands without that check.
 * Changing the derivation itself … is owner-gated under THE PROMISE.

$ grep -n "RESERVED_ROOT_SEGMENT_HEADS" tests/kernel/prngForkLabelDelimiter.test.js
104:const RESERVED_ROOT_SEGMENT_HEADS = Object.freeze(['epoch']);
56:const EMBEDDED_DELIMITER_FAMILIES = Object.freeze({
```

⇒ `rollFrom` spells `` `edit-pool:${poolId}:${seed}:${entryId}:${n}` `` with **single colons** and
never calls `fork`, so neither `EMBEDDED_DELIMITER_FAMILIES` nor the reserved `epoch` head can
move. `pick` returning **`undefined`** on an empty array is why the contract converts to `null`.

⚠ **The brief's path hint `src/generators/kernel/prng.js` does not exist.** Re-found by symbol:

```
$ ls src/generators/kernel
ls: src/generators/kernel: No such file or directory
$ git grep -n "createPRNG" -- 'src/**' | grep "function createPRNG"
src/kernel/prng.js:22:export function createPRNG(seed) {
```

---

## §5 · The tier gate and the forbidden display seams

```
$ sed -n '67,68p;142,149p;182,193p' src/generators/lookups.js
export const institutionAvailableAtTier = (def, tier) =>
  !def?.minTier || tierAtLeast(tier, def.minTier);

export const getInstitutionalCatalog = (tier) => {
  if (!tier || tier === 'random' || tier === 'custom') {
    return filterCatalogByTierGate(institutionalCatalog['village'] || {}, 'village');
  }
  if (tier === 'metropolis') return filterCatalogByTierGate(mergeTierCatalogs(['city','metropolis']), 'metropolis');
  if (tier === 'all') return mergeTierCatalogs(TIER_ORDER);
  return filterCatalogByTierGate(institutionalCatalog[tier] || {}, tier);
};

export const getInstitutionsForTier = (tier) => {
  const tiers = tier === 'metropolis' ? ['city', 'metropolis'] : [tier];
  const names = new Set();
  …
  return names;
};
```

The seam design §12.7 forbids, and the exact reason:

```
$ grep -n "^export" src/domain/display/resourceDisplayName.js
64:export const RESOURCE_DISPLAY_LABELS = Object.freeze({
130:export function resourceDisplayName(value) {
```

⇒ a relabeling map that passes unknowns through — which is why it is not a catalogue and cannot
be a pool source.

---

## §6 · The bundle law — why `pools.js` imports no large table

```
$ wc -l src/data/namingData.js
    4038 src/data/namingData.js
$ ls -la src/data/namingData.js
-rw-r--r--  1 cstokes  wheel  68656 … src/data/namingData.js

$ sed -n '19,22p' src/domain/townCartography/cartographyWards.js
 * src/data/namingData.js here would drag a 68,656-byte table into the bounded
 * … The canonical home of the pools stays src/data/namingData.js;
```

```
$ sed -n '10,24p' src/data/goods/identity.js
 * `resourceData.js` is in the eager first-paint `data` chunk (three first-paint
 * modules reach it: events/mutateWorld.js, resourceSemantics.js and
 * resourceTerrainCompatibility.js). …
 * ⛔ NEVER re-export a chains-half table from this file. … one such line silently moves ~390 kB
 * of chain/demand/tier tables from `data-lazy` into the first-paint closure and
 * blows the 1,040,000-byte budget.
 * @enforced-by tests/build/vendorPdfLazy.test.js
```

⇒ the name table is passed in; `resourceData.js` is imported statically because it is **already**
in the eager closure and the pool adds no new edge.

---

## §7 · The registration ledger — every verdict, executed

**P2.1 — the census counts TEST files, not `src/` files (finding F3).**

```
$ sed -n '515,518p;612p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests'))
  .filter((p) => /\.test\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p)…, src: readFileSync(p, 'utf8') }))
  .sort((a, b) => a.rel.localeCompare(b.rel));
      files: TEST_FILES.length,
```

The live tuple (the register, not the walker's prose):

```
$ cat tests/lint/.lighting-census-baseline.json   (tail)
  "measuredAtSha": "e5a27a1a5e83569e198ab36e0879ee70fdaefe8a",
  "measuredBy": "the chair (Fable 5.1, session 923472dc)",
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
```

⇒ predicted delta `+1 / +0 / +1 / +8 / +1`, driven by `tests/domain/editPools.test.js`.
⚠ The preamble's §P2.1 wording ("a new file under `src/domain/**` … moves the census") is refuted
by the code above. **RAISED R4.**

**P2.2 — no mutation-coverage row is owed.**

```
$ grep -n "ENFORCER_DIRS" -A 2 tests/lint/mutationCoverage.shared.mjs
36:export const ENFORCER_DIRS = [
37:  'tests/lint',
```

⇒ the obligation attaches to `tests/lint/`; this packet's only test file is `tests/domain/`.

**P2.4 — the writer-reach register CANNOT move.**

```
$ sed -n '115,117p' scripts/lib/writer-reach-scan.mjs
export const SURFACE_CLOSURE_STOP = Object.freeze([
  'src/generators/', 'src/store/', 'src/workers/', 'src/lib/instantWorld/',
]);
```

⇒ `pools.js` reaches a surface only through `src/store/editSlice.js`, and `src/store/` is a STOP.
Neither a shrink nor a mint is owed.

**P2.5 — the decision-fork and mechanism-coverage registers do not reach `src/domain/edit`.**

```
$ grep -n "SCAN_ROOTS" -A 6 tests/lint/chooserTotality.walker.test.js
64:const SCAN_ROOTS = Object.freeze([
65-  'src/domain/worldPulse',
66-  'src/domain/spatial',
67-  'src/domain/traditions',
68-  'src/domain/region',
69-]);

$ sed -n '25,31p' scripts/soak/flagConstraints.mjs
 * flagged this conditionally (OQ-7) … §85.4 prices two obligations on "any wave minting a
 * SEEDED CHOOSER OR POOL": (a) a decision-fork classification row in the habit fork registry,
 * whose walker scans `src/domain`, and (b) a mechanism-coverage baseline row, whose walker
 * enumerates `src/domain/worldPulse` modules. … Neither obligation attaches.
```

⇒ NOT OWED, by the same measured form `flagConstraints.mjs` itself used. **RAISED R5.**

**P2.3 — the observed-shape scanner does see `src/domain/edit`, so the check is run plain:**

```
$ sed -n '250p' scripts/check-observed-shape-readers.mjs
/** Every `.js`/`.jsx` under `src/` — the whole app, not just `src/domain`: the
```

⇒ `pools.js` IS scanned; it reads no save-time key, so no exemption is owed, and the check is in
`checks` so motion convicts rather than hides.

**Collision and CREATE-absence — the scan, executed:**

```
$ node -e '<load PACKET_MANIFEST.json>; per path, count holders and NON-TERMINAL holders'
src/domain/edit/pools.js                              | total holders: 0  | NON-TERMINAL: 0
tests/domain/editPools.test.js                        | total holders: 0  | NON-TERMINAL: 0
scripts/mutation-coverage-manifest.json               | total holders: 26 | NON-TERMINAL: 0
tests/lint/sovereigntyLightingContract.walker.test.js | total holders: 89 | NON-TERMINAL: 0
--- statuses present across all 182 packets: LANDED,SUPERSEDED
```

⭐ **Every registered packet is TERMINAL at this base**, so nothing in the manifest reserves any
path. The live collision is therefore with the **EM siblings being compiled right now** — the
moment two of them enter at DRAFT holding the census walker, `validate:packets` reds, because
DRAFT reserves exactly as READY does. That is what the §7 deferral box exists for.

$ for p in src/domain/edit/pools.js tests/domain/editPools.test.js src/domain/edit; do …
ABSENT  src/domain/edit/pools.js
ABSENT  tests/domain/editPools.test.js
ABSENT  src/domain/edit
```

⚠ `src/domain/edit/` does not exist yet — EM-A2 or EM-A1, whichever lands first, creates the
directory. That is not a manifest row (a directory is not a file) and is recorded so it is not
mistaken for a missing CREATE.

---

## §8 · The test precedent the acceptance copies

```
$ grep -n "describe(\|  it(" tests/domain/institutionFounding.test.js | head -12
113:describe('MF-T2Q — the institution founding year', () => {
114:  it('dates a pulse-built institution by the calendar year it came to stand', () => {
125:  it('never re-dates on the re-founded path — a founding is its FIRST founding', () => {
151:  it('dates a deferred outcome by when it landed, not by when it was proposed', () => {
165:  it('types every institution, and absence is the typed value', () => {
185:  it('dates institutionHistory entries without moving the 24-entry ring cap', () => {
200:  it('stays unreachable from generation, so the generator golden cannot move', () => {
213:  it('leaves the already-standing no-op a same-reference no-op', () => {
```

⇒ one literal `describe`, seven straight-line `it`, positive control first — the shape preamble
§P3.4 requires and A1–A8 copy.

---

## §9 · What this lane did NOT do

- Ran **no** vitest, eslint, `npm run check`, or any writing script.
- Wrote **nothing** in `$SP/consist` or in `/Users/cstokes/Desktop/settlement-engine`.
- Named **no** symbol it did not prove present (§1).
- Raised **no** budget and invented **no** figure. The ≈145 effective-line estimate is labelled an
  ESTIMATE in the packet and in the manifest note, with the re-measurement and the STOP that
  follows it both written into §11.
- Adjudicated **nothing**: R0–R5 are listed in the packet's §13 for the chair.
