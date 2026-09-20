# EM-A2b — compile evidence

Every fact `EM-A2b.md` and `EM-A2b.manifest.json` call verified is proved by a command below with
its real output. A fact with no command here is not verified.

**Lane:** EM COMPILE LANE P2 (Opus), session 923472dc, letter `b`. **Read only** in `$SP/consist`;
**wrote only** under `$SP/lane-em-b-scratch/`. No vitest, no eslint, no writing script.

---

## §0 · The base

Identical to `EM-A2a.evidence.md` §0 and not restated: `d31af2cee` confirmed at 11:01:32 EDT
before any measurement; ten commits moved the branch to `7aa769830` by 11:33:21; `d31af2cee` **IS
an ancestor**; the window is four docs plus `.gitignore` plus one edit to an existing test file;
**every path this packet measures is blob-identical across the window**, including:

```
IDENTICAL  src/data/namingData.js                    IDENTICAL  src/domain/npc/npcOps.js
IDENTICAL  src/generators/npcGenerator.js            IDENTICAL  src/kernel/rngContext.js
IDENTICAL  src/domain/display/pantheonDepth.js       IDENTICAL  src/domain/resourceTerrainCompatibility.js
IDENTICAL  src/data/tradeGoodsData.js                IDENTICAL  src/data/institutionServices.js
IDENTICAL  src/generators/steps/resolveConfig.js     IDENTICAL  src/components/ConfigurationPanel.jsx
IDENTICAL  src/domain/deterministicSort.js           IDENTICAL  tests/lint/.lighting-census-baseline.json
```

Worktree clean (`git status --short` → no output). Base held at `d31af2cee` per ruling (6).

---

## §1 · ⛔⛔ THE BLOCK — `worldFact.tradeAccess`, the smallest measured contradiction

The chair's ruling (5): *"find the wizard's canonical option lists by symbol and name them; never
a second copy."* For six of the seven world facts a symbol exists. For trade access:

**(a) The wizard's set lives only as JSX `<option>` literals in a component:**

```
$ grep -n "<option value=" src/components/ConfigurationPanel.jsx | sed -n '3,9p'
325: <option value="random_trade">Random</option>
326: <option value="road">Road</option>          327: <option value="river">River</option>
328: <option value="port">Port</option>          329: <option value="crossroads">Crossroads</option>
330: <option value="isolated">Isolated</option>  331: <option value="mountain_pass">Mountain Pass</option>
```

**(b) The generator's set is a module-PRIVATE `const`:**

```
$ node -e '<extract TERRAIN_ROUTE_POOLS from src/generators/steps/resolveConfig.js>'
["crossroads","isolated","port","river","road"]
exported? false

$ grep -n "^export" src/generators/steps/resolveConfig.js
24:export const TERRAIN_WEIGHTS = [
41:export const CULTURES = [
```

⇒ only two symbols are exported from the wizard's own config step, and neither is the route set.

**(c) The two sets DISAGREE.** The wizard offers **six** (`road, river, port, crossroads,
isolated, mountain_pass`); the generator rolls **five**. `mountain_pass` is offerable and drawn
never.

⇒ Reading the wizard's set would make `src/domain/edit/pools.js` import `.jsx` (a §P4 layering
violation) and re-typing it is the **"second copy"** the ruling forbids; the generator's set has no
symbol to name; and the two are not the same set, so neither is silently substitutable. **This is
an authority disagreement between two shipped sources, and `PACKET_STANDARD.md` is explicit: the
packet is BLOCKED and a coding agent never adjudicates it.** No instruction for that pool is
written. Two unblock paths are costed at the packet's §2. **RAISED R1.**

---

## §2 · `requiredSymbols` — every row proved present, verbatim

```
1  src/data/namingData.js                     :: export const NAMING_DATA
2  src/domain/npc/npcOps.js                   :: export function instantNpc   (export + 1 JSDoc)
1  src/generators/npcGenerator.js             :: export const generateSettlementName
1  src/domain/display/pantheonDepth.js        :: export function pantheonStandings
1  src/domain/resourceTerrainCompatibility.js :: export const getCompatibleResources
1  src/data/tradeGoodsData.js                 :: export const GOODS_CATEGORIES
1  src/data/institutionServices.js            :: export const INSTITUTION_SERVICES
1  src/domain/deterministicSort.js            :: export const compareCodepoint
```

---

## §3 · The seven pools' sources — EXECUTED by live import

```
$ node --input-type=module -e '<imports>; …'
NAMING_DATA cultures: 11 ["germanic","latin","celtic","arabic","norse","slavic","east_asian",
  "mesoamerican","south_asian","steppe","greek"]
cultures with full name pools: 11   (maleNames + femaleNames + surnames on every one)
GOODS_CATEGORIES keys: 7 ["AGRICULTURAL","RAW_MATERIALS","MANUFACTURED","LUXURY","SERVICES",
  "FOOD_PROCESSED","TRADE"]
INSTITUTION_SERVICES keys: 285
getCompatibleResources(port,coastal) -> array len 33
  [{"key":"fishing_grounds","label":"Fishing Grounds","desc":"Deep-water or reef fishing close to
    shore; …","commodities":["fish", …
```

⭐ **`getCompatibleResources` returns OBJECTS, not strings.** The pool must map to `.key`; a pool
of `.label`s would put display strings into a fact set — the display-seam mistake §12.7 forbids,
arriving by a different door. B4 asserts the pool holds no `.label` value.

⭐ **285 services** is the vocabulary's true size, not an error. Recorded and raised (R4) as a
`PoolField` affordance question for EM-D2, not solved here.

**The services vocabulary has two reachable homes; the source is named, not the re-export:**

```
$ grep -n "^export" src/data/institutionServices.js | head -1
8:export const INSTITUTION_SERVICES = {

$ grep -n "INSTITUTION_SERVICES" src/data/tradeGoodsData.js
138:export { INSTITUTION_SERVICES } from "./institutionServices.js";
```

**The pantheon reader, and the `[]`-when-absent contract the deity doctrine rests on:**

```
$ sed -n '95,103p' src/domain/display/pantheonDepth.js
 * The pantheon ledger as a sorted, normalized array of deity entries (descending
 * seats, then codepoint id). [] when dormant/absent.
export function pantheonStandings(worldState) {
  const pantheon = worldState?.pantheon && typeof worldState.pantheon === 'object'
    ? worldState.pantheon : null;
  if (!pantheon) return [];
```

---

## §4 · The refuted name-generator premise, and the chair's cure

```
$ grep -n "^export" src/generators/npcGenerator.js | tail -1
1719:export const generateSettlementName = (r = 'germanic') => {

$ sed -n '1719,1722p' src/generators/npcGenerator.js
export const generateSettlementName = (r = 'germanic') => {
  const prefixData = NAMING_DATA[resolveNameCulture(r)] || NAMING_DATA.germanic;
  … `${prefixData.settlementPrefixes[Math.floor(_rng() * …)]}${…}`;

$ grep -n "_rng" src/generators/npcGenerator.js | head -1
16:import { random as _rng, pick as ctxPick } from '../kernel/rngContext.js';

$ sed -n '70,76p' src/kernel/rngContext.js
function _roll() { if (_activeRng) return _activeRng.random();
  throw new Error('[rngContext] a PRNG helper was called with no active seeded RNG. …

$ sed -n '240,247p' src/generators/npcGenerator.js
const pickFirst = (culture = 'germanic', gender = 'male', …) => {     // NOT exported
  … const firstName = namePool[Math.floor(_rng() * namePool.length)];
```

⇒ the only exported name producer **throws** outside a seeded run and **consumes a world draw**
inside one (§P5 HZ-PRNG forbids the second by name); the NPC producer is module-private.

**The chair's ruling (4) names the cure, and it is already in `src/domain`:**

```
$ sed -n '218,222p' src/domain/npc/npcOps.js
export function instantNpc({ seed = '', namingData = null, … } = {}) {
  const rng = createPRNG(`instant-npc:${seed}`);          // a ROOT composition
  …
  const name = pickFromNaming(rng, namingData, gender);   // the bag PASSED IN
```

**And the bundle reason the bag is passed rather than imported:**

```
$ wc -l src/data/namingData.js ; ls -la src/data/namingData.js
    4038 src/data/namingData.js
-rw-r--r--  1 cstokes  wheel  68656 … src/data/namingData.js

$ sed -n '19,21p' src/domain/townCartography/cartographyWards.js
 * src/data/namingData.js here would drag a 68,656-byte table into the bounded
 * … The canonical home of the pools stays src/data/namingData.js;
```

⇒ the estate has already refused that exact import into a bounded leaf, for that exact reason.

---

## §5 · The registration ledger — the smaller obligation, measured

**P2.1 — this packet adds NO new test file, so only `titles` moves:**

```
$ sed -n '515,518p;612p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests')).filter((p) => /\.test\.(js|jsx)$/.test(p))…
      files: TEST_FILES.length,

$ cat tests/lint/.lighting-census-baseline.json   (tail)
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
```

⇒ `+0 files / +0 parked / +0 credited / +7 titles / +0 suiteTitles` — a **smaller** obligation than
a naive reading predicts, stated so the terminal's re-derivation is not surprised.

**P2.2 not owed** (no `tests/lint/` file — `mutationCoverage.shared.mjs:36-37`). **P2.4 cannot
move** (`SURFACE_CLOSURE_STOP` includes `'src/store/'`). **P2.5 not owed** (no chooser mint; and
`chooserTotality`'s `SCAN_ROOTS` exclude `src/domain/edit` anyway). **P2.3 not owed**, and the
scanner covers every `.js` under `src/` so the check is in `checks`.

**Collision:**

```
$ node -e '<load PACKET_MANIFEST.json>; per path …>'
src/domain/edit/pools.js       | total holders: 0 | NON-TERMINAL: 0
tests/domain/editPools.test.js | total holders: 0 | NON-TERMINAL: 0
--- statuses present across all 182 packets: LANDED,SUPERSEDED
```

⚠ **The live collision is with EM-A2a**, which creates both files. They share both paths and must
serialize; DRAFT reserves exactly as READY does.

---

## §6 · What this lane did NOT measure, and says so

- **Whether `src/data/tradeGoodsData.js` and `src/data/institutionServices.js` are already inside
  the eager first-paint closure.** The packet imports them statically; if either is lazy today,
  this adds a first-paint edge against the 1,040,000-byte budget
  (`tests/build/vendorPdfLazy.test.js`). **RAISED R2** — an unmeasured path is not a verified fact,
  and the packet says so rather than asserting safety.
- **The largest name-pool cross product.** §8 directs the implementer to measure and report it; a
  truncation would make `rollFrom` non-total and is a STOP.

## §7 · What this lane did NOT do

Ran no vitest, eslint or writing script. Wrote nothing in the consist or the ledger. Named no
symbol it did not prove present. **Did not stamp the preamble's hash** (ruling 6). Raised no budget
and invented no figure. **Adjudicated nothing** — the block (R1) is the chair's, and R2–R4 are
listed in the packet's §13.
