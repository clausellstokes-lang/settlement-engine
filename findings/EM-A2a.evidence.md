# EM-A2a — compile evidence

Every fact `EM-A2a.md` and `EM-A2a.manifest.json` call verified is proved by a command below with
its real output. A fact with no command here is not verified.

**Lane:** EM COMPILE LANE P2 (Opus), session 923472dc, letter `b`.
**Read (never written):** `$SP/consist` and the ledger checkout. **Wrote only under:**
`$SP/lane-em-b-scratch/`. **Ran no vitest, no eslint, no `npm run check`, no writing script.**

---

## §0 · The base, its ten-commit movement, and the blob-identity proof

```
$ git -C $SP/consist rev-parse HEAD ; date     # BEFORE any measurement
d31af2ceebf643818201b2e2ab4a556765d2fc7c
Sat Sep 19 11:01:32 EDT 2026
```

✅ The brief's pinned base was confirmed before measuring, as the brief requires. It then moved
under the lane three times as the chair's rulings landed:

```
11:06:09 EDT  02968876b      11:17:13 EDT  a03ebb09a      11:33:21 EDT  7aa769830

$ git merge-base --is-ancestor d31af2cee... HEAD && echo "YES ancestor"
YES ancestor

$ git log --oneline d31af2cee.....HEAD
7aa769830 DOC: design §15 (entity states), the ARCH's op list and corrected §3, and the charter's B1 split / B3 as measured / C3 ground fold onto the build branch (ODQ §934.46, §934.36 addendum)
b43dfb771 DOC: design §14 final (world facts by consequence; one engine, re-derive with pins) …
2280742ab DOC: design §14 whole (root means chosen; the layer at the chooser) …
7c538ec89 DOC: the EM preamble carries the source rule (design §14, ODQ §934.44) …
3b6478fb3 DOC: edit at the source, never at the derivation folds onto the build branch …
a03ebb09a DOC: the EM preamble carries the phantom consequence rule …
023085560 DOC: the phantom consequence rule folds onto the build branch (design §13) …
7a0fe5889 The generation worker's ceiling re-mints exact at 1,399,946 B …
34f320829 The preview persona's env file is development-scoped and ignored: .env.*.local
02968876b DOC: the EM family packet preamble …

$ git diff --stat d31af2cee.....HEAD
 .gitignore | 3 + ; docs/ARCH_EDIT_MODE_AND_DECREES.md | 26 +++---
 docs/DESIGN_EDIT_MODE_AND_DECREES.md | 55 +++++++++ ;
 docs/implementation/charters/EDIT-MODE-TRAIN.md | 12 ++-- ;
 docs/implementation/preambles/EM-PREAMBLE.md | 81 ++++++++++++ ;
 tests/build/generationWorkerLazy.test.js | 8 ++-
 6 files changed, 168 insertions(+), 17 deletions(-)
```

⭐ **The only non-docs paths in the whole window are `.gitignore` and an EDIT to one existing test
file.** An edit to an existing `*.test.js` cannot move the census `files` figure (which counts
files, not lines), and the census baseline is proved unmoved below.

**Blob-identity across the FULL window `d31af2cee..7aa769830`, every path this packet measures:**

```
IDENTICAL  src/generators/lookups.js            IDENTICAL  src/kernel/prng.js
IDENTICAL  src/kernel/rngContext.js             IDENTICAL  src/domain/npc/npcOps.js
IDENTICAL  src/domain/factionArchetypes.js      IDENTICAL  src/domain/dossier/powerStrata.js
IDENTICAL  src/data/resourceData.js             IDENTICAL  src/data/constants.js
IDENTICAL  src/generators/steps/resolveConfig.js  IDENTICAL  src/data/stressTypes.js
IDENTICAL  src/domain/deterministicSort.js      IDENTICAL  src/components/ConfigurationPanel.jsx
IDENTICAL  tests/lint/sovereigntyLightingContract.walker.test.js
IDENTICAL  tests/lint/.lighting-census-baseline.json
IDENTICAL  tests/lint/mutationCoverage.shared.mjs
IDENTICAL  scripts/lib/writer-reach-scan.mjs    IDENTICAL  tests/lint/chooserTotality.walker.test.js
IDENTICAL  docs/implementation/PACKET_MANIFEST.json
```

⇒ `PACKET_STANDARD.md`'s **J-T1** clause is satisfied and the base is held at `d31af2cee` per the
chair's ruling (6).

```
$ git -C $SP/consist status --short
(no output — clean, so no foreign dirt is being read as tree state)
```

---

## §1 · `requiredSymbols` — every row proved present, verbatim

```
1  src/generators/lookups.js           :: export const getInstitutionsForTier
1  src/generators/lookups.js           :: export const getInstitutionalCatalog
1  src/generators/lookups.js           :: export const institutionAvailableAtTier
1  src/kernel/prng.js                  :: export function createPRNG
2  src/domain/npc/npcOps.js            :: export function instantNpc      (export + 1 JSDoc ref)
1  src/domain/factionArchetypes.js     :: export const FACTION_ARCHETYPES
1  src/domain/dossier/powerStrata.js   :: export const RELATIONSHIP_KIND_ORDER
1  src/data/resourceData.js            :: export const RESOURCE_DATA
1  src/data/resourceData.js            :: export const SPECIAL_RESOURCES
1  src/data/constants.js               :: export const TIER_ORDER
1  src/generators/steps/resolveConfig.js :: export const TERRAIN_WEIGHTS
1  src/generators/steps/resolveConfig.js :: export const CULTURES
1  src/data/stressTypes.js             :: export const STRESS_TYPE_MAP
1  src/domain/deterministicSort.js     :: export const compareCodepoint
```

**No symbol the packet CREATES (`POOLS`, `poolValues`, `rollFrom`) is named** — the standard
withdraws "preserves **or creates**" as unenforceable before LANDED.

---

## §2 · The eleven pools' sources — EXECUTED by live import

```
$ node --input-type=module -e '<imports>; …'
NAMING_DATA cultures: 11  (all 11 name-complete)
RESOURCE_DATA keys: 33      SPECIAL_RESOURCES keys: 6
TIER_ORDER: ["thorp","hamlet","village","town","city","metropolis"]
FACTION_ARCHETYPES values: 13 ["government","noble","military","merchant","religious","criminal",
  "arcane","craft","labor","outsider","occupation","civic","other"]
getInstitutionsForTier(town) -> ctor: Set   size: 85
getInstitutionalCatalog(town) -> categories: 10  rows: 85

TERRAIN_WEIGHTS keys: 7 ["plains","hills","forest","riverside","coastal","mountain","desert"]
CULTURES: 11
STRESS_TYPE_MAP keys: 15
wizard terrain === TERRAIN_WEIGHTS keys?  true
```

⭐ **Three facts here are load-bearing and would have been wrong if assumed.**
(a) `getInstitutionsForTier` returns a **`Set`**, so a packet that wrote `.map`/`.sort` onto the
return would have thrown. (b) The two lookups **agree at 85 rows**, which is what lets the pool use
either without a second tier gate. (c) **The wizard's seven terrain `<option>` values are exactly
`TERRAIN_WEIGHTS`' seven keys** — which is what makes A3's parity arm a real assertion rather than
a hope.

**The wizard's own menu, read at its source (by the TEST, never by the module):**

```
$ grep -n "<option value=" src/components/ConfigurationPanel.jsx | sed -n '9,16p'
348: <option value="auto">Auto (from route)</option>
349: <option value="plains">Plains / Farmland</option>    350: <option value="forest">…
351: <option value="hills">…   352: <option value="riverside">…   353: <option value="coastal">…
354: <option value="mountain">…  355: <option value="desert">Desert / Arid</option>
```

**`CULTURES` already carries the canonical claim in its own comment:**

```
$ sed -n '39,45p' src/generators/steps/resolveConfig.js
// Exported for the gallery facet-alignment contract (culture facet vocabulary
// must match the generator's own list).
export const CULTURES = [
  'germanic','latin','celtic','arabic','norse','slavic',
  'east_asian','mesoamerican','south_asian','steppe','greek',
];
```

⇒ the chair's ruling (5) is already in force for another consumer; the pool joins it rather than
minting a second copy.

**The stance vocabulary and its rejected sibling:**

```
$ sed -n '170,190p' src/domain/dossier/powerStrata.js
 * … This is a PRESENTATION order only …
export const RELATIONSHIP_KIND_ORDER = Object.freeze([
  'corrupted','competitive','tense','subordinate','dependent','symbiotic' ]);

$ grep -n "export const PRIMARY_RELATIONSHIP_TYPES" -A 8 src/domain/worldPulse/relationshipCompatibility.js
41: … 'neutral','trade_partner','allied','patron','client','vassal','rival','cold_war',
```

⇒ two live vocabularies answer to "the relationship kinds"; the chair's ruling (4) binds `stance`
to the intra-settlement six.

---

## §3 · The PRNG contract, and why `rollFrom` never forks

```
$ sed -n '22,36p;84p' src/kernel/prng.js
export function createPRNG(seed) { const _rng = seedrandom(seed);
  const rng = { seed, random: () => _rng(),
    pick: (arr) => { if (!arr || arr.length === 0) return undefined;
                     return arr[Math.floor(_rng() * arr.length)]; }, …
    fork: (label) => createPRNG(`${seed}::${label}`),

$ sed -n '66,78p' src/kernel/prng.js     (abridged)
 * THE '::' DELIMITER IS LOAD-BEARING VOCABULARY, not an internal detail. …
 * tests/kernel/prngForkLabelDelimiter.test.js freezes the families that embed
 * the delimiter and reds when a new one lands without that check.

$ grep -n "RESERVED_ROOT_SEGMENT_HEADS\|EMBEDDED_DELIMITER_FAMILIES" tests/kernel/prngForkLabelDelimiter.test.js
56:const EMBEDDED_DELIMITER_FAMILIES = Object.freeze({
104:const RESERVED_ROOT_SEGMENT_HEADS = Object.freeze(['epoch']);
```

⇒ `rollFrom` spells `` `edit-pool:${poolId}:${seed}:${entryId}:${n}` `` with **single colons** and
never calls `fork`, so neither register can move. `pick` returning **`undefined`** on an empty
array is why the contract converts to `null`.

**The precedent the chair's ruling (4) names:**

```
$ sed -n '218,219p' src/domain/npc/npcOps.js
export function instantNpc({ seed = '', namingData = null, … } = {}) {
  const rng = createPRNG(`instant-npc:${seed}`);
```

⇒ a ROOT composition, not a fork.

**The ambient context this leaf must not touch:**

```
$ sed -n '30p;70,76p' src/kernel/rngContext.js
let _activeRng = null;
function _roll() { if (_activeRng) return _activeRng.random();
  throw new Error('[rngContext] a PRNG helper was called with no active seeded RNG. …
```

⚠ **The brief's path hint `src/generators/kernel/prng.js` does not exist** — re-found by symbol at
`src/kernel/prng.js:22`.

---

## §4 · The registration ledger — every verdict executed

**P2.1 — the census counts TEST files, and the chair's ruling (8) accepts it:**

```
$ sed -n '515,518p;612p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests')).filter((p) => /\.test\.(js|jsx)$/.test(p))…
      files: TEST_FILES.length,

$ cat tests/lint/.lighting-census-baseline.json   (tail)
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
```

⇒ predicted `+1 / +0 / +1 / +8 / +1`, driven by `tests/domain/editPools.test.js`.

**P2.2 — no mutation-coverage row owed:**

```
$ grep -n "ENFORCER_DIRS" -A 2 tests/lint/mutationCoverage.shared.mjs
36:export const ENFORCER_DIRS = [
37:  'tests/lint',
```

**P2.4 — writer-reach cannot move:**

```
$ sed -n '115,117p' scripts/lib/writer-reach-scan.mjs
export const SURFACE_CLOSURE_STOP = Object.freeze([
  'src/generators/', 'src/store/', 'src/workers/', 'src/lib/instantWorld/' ]);
```

**P2.5 — the two chooser registers do not reach `src/domain/edit`:**

```
$ grep -n "SCAN_ROOTS" -A 6 tests/lint/chooserTotality.walker.test.js
64:const SCAN_ROOTS = Object.freeze([ 'src/domain/worldPulse', 'src/domain/spatial',
   'src/domain/traditions', 'src/domain/region' ]);

$ sed -n '25,31p' scripts/soak/flagConstraints.mjs
 * … (a) a decision-fork classification row …, whose walker scans `src/domain`, and (b) a
 * mechanism-coverage baseline row, whose walker enumerates `src/domain/worldPulse` modules.
 * … Neither obligation attaches.
```

⇒ NOT OWED, by the same measured form `flagConstraints.mjs` itself used for §85.4. **RAISED R2.**

**P2.3 — the OSR scanner does see the leaf, so the check is run plain:**

```
$ sed -n '250p' scripts/check-observed-shape-readers.mjs
/** Every `.js`/`.jsx` under `src/` — the whole app, not just `src/domain`: …
```

**Collision and CREATE-absence:**

```
$ node -e '<load PACKET_MANIFEST.json>; per path, holders and NON-TERMINAL holders'
src/domain/edit/pools.js        | total holders: 0 | NON-TERMINAL: 0
tests/domain/editPools.test.js  | total holders: 0 | NON-TERMINAL: 0
tests/lint/sovereigntyLightingContract.walker.test.js | holders: 89 | NON-TERMINAL: 0
--- statuses present across all 182 packets: LANDED,SUPERSEDED

$ for p in …; do [ -e "$p" ] && echo EXISTS || echo ABSENT; done
ABSENT src/domain/edit/pools.js        ABSENT tests/domain/editPools.test.js
```

⭐ Every registered packet is TERMINAL, so nothing in the manifest reserves any path. The live
collision is with the EM siblings compiled now — DRAFT reserves exactly as READY does — which is
what the §7 deferral box exists for.

---

## §5 · The ARCH's lagging pool line (R1)

```
$ grep -n "\*\*Pools:\*\*" docs/ARCH_EDIT_MODE_AND_DECREES.md
104:- **Pools:** `institution.class` …, `name.<culture>` …, `npc.role`, `faction.archetype`,
    `stance`, `cause.remove` …, `commodity` …, `deity` …, `tier`.

$ grep -n "Op types" docs/ARCH_EDIT_MODE_AND_DECREES.md
105:- **Op types (twenty-five, in two packets):** HOME (EM-B1a): … OFF-STAGE (EM-B1b, §13): …
```

⇒ §934.46 amended the op list in the same commit but **left the pool line at nine**, naming
neither the world-facts pools nor design §15's two vocabularies. A documentation correction.

---

## §6 · What this lane did NOT do

- Ran **no** vitest, eslint, `npm run check`, or any writing script.
- Wrote **nothing** in `$SP/consist` or `/Users/cstokes/Desktop/settlement-engine`.
- Named **no** symbol it did not prove present (§1).
- **Did not stamp the preamble's hash** — the chair's ruling (6) reserves that; the hash has moved
  with every ruling (`481dab28…` → `398e562b…` → the current value).
- Raised **no** budget and invented **no** figure. The ≈147 estimate is labelled an ESTIMATE, and
  §11 makes crossing 250 a STOP rather than a squeeze.
- Adjudicated **nothing**: R1–R3 are listed in the packet's §13 for the chair.
