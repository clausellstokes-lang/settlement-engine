# EM-B1h — evidence. Every verified fact, with the command that proved it.

Lane: Opus COMPILE (session 7d3418f8, 2026-09-19). Read tree: `$SP/read-tip-ad7ddf2c9`, detached
at **`ad7ddf2c9`**, `git status --short` **EMPTY** before and after. No test was run; no npm
script, no vitest, no eslint CLI, no build. `eslint`'s `Linter` was imported as a LIBRARY from
the read tree's symlinked `node_modules` (the estate's own technique for a `max-lines` figure);
`esbuild` was invoked on **scratch files only**. All harness scripts use ABSOLUTE paths and none
imports a kit instrument (the `process.chdir(TREE)` hazard).

---

## §1 · The tree and the preamble

```
$ git -C $SP/read-tip-ad7ddf2c9 rev-parse --short HEAD
ad7ddf2c9
$ git -C $SP/read-tip-ad7ddf2c9 status --short
(empty)

$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1
```

⇒ **MATCHES the hash the dispatch message carries** (including §P2 row 12). CONFIRMED.

---

## §2 · The write and read sites — THIRTEEN and TWO, not eight

`scan-fates.mjs`. The strip is `commentsOnly`, copied **verbatim** from the LANDED
`tests/domain/ruinInstitution.test.js:187` (EM-B1e's A7): it blanks `//` and `/* */` and SKIPS
string/template literals **without blanking their contents** — unlike
`tests/helpers/codeOnlySource.js`, which blanks them.

```
$ node scan-fates.mjs
src non-test .js/.jsx files scanned: 2246

=== WRITE SITES (code, comments stripped) === count=13
  src/domain/worldPulse/calamityKernel.js:247: worldPulseFate: fate, remnantReason: reason,
  src/domain/worldPulse/calamityKernel.js:309: worldPulseFate: 'demoted_by_disaster',
  src/domain/worldPulse/institutionLifecycle.js:959: worldPulseFate: null,
  src/domain/worldPulse/institutionLifecycle.js:1019: worldPulseFate: fate,
  src/domain/worldPulse/institutionLifecycle.js:1061: worldPulseFate: fate,
  src/domain/worldPulse/institutionLifecycle.js:1103: worldPulseFate: null,
  src/domain/worldPulse/magicRegimeLifecycle.js:357: worldPulseFate: magicClosureFate(patch.form),
  src/domain/worldPulse/magicRegimeLifecycle.js:374: worldPulseFate: null,
  src/domain/worldPulse/settlementLifecycleFirstClass.js:601: ? { ...inst, status: 'removed', _worldPulseInactive: true, worldPulseFate: 'abandoned_with_the_settlement', … }
  src/domain/worldPulse/tierOutcomeApply.js:162: worldPulseFate: fate.fate,
  src/domain/worldPulse/tierOutcomeApply.js:265: worldPulseFate: null,
  src/domain/worldPulse/upswingKernel.js:516: insts[idx] = { …, worldPulseFate: 'upgraded_by_reconstruction' };
  src/domain/worldPulse/upswingKernel.js:763: insts.push({ …, worldPulseFate: 'founded_by_flourishing' });

=== READ SITES (.worldPulseFate, code) === count=2
  src/domain/provenance/rosterProvenance.js:258: const fate = textOrNull(inst.worldPulseFate);
  src/domain/worldPulse/causeLifecycle.js:139: if (inst.worldPulseFate) return true;

RAW (comments kept): write-shaped 13, read-shaped 2
```

⇒ **SIX writer files, THIRTEEN write sites (five literal, four computed, four `null` clears),
TWO non-branching readers.** The raw and stripped counts agree, so no site hides in a comment.
⇒ ⛔ **the charter row's "eight writers" is refuted as a FIGURE; its premise is confirmed.**

---

## §3 · Every value each writer can produce — SEVENTEEN, traced

| # | site | what it writes | values |
|---|---|---|---|
| W1 | `calamityKernel.js:247` | the `fate` ARGUMENT of `ruinInstitution` | `destroyed_by_disaster` (both callers, `:317`/`:321`); **`ruined_by_decree` after EM-B1a** |
| W2 | `calamityKernel.js:309` | literal | `demoted_by_disaster` |
| W3 | `institutionLifecycle.js:959` | **`null`** — reopen clears | — |
| W4 | `institutionLifecycle.js:1019` | `:1013` `const fate = patch.fate \|\| closureFateForInstitution(target);` | `shuttered` · `bankrupt` · `closed_for_want_of_custom` |
| W5 | `institutionLifecycle.js:1061` | `:1055` `const fate = patch.fate \|\| 'abolished';` | `abolished` · **`disbanded`** (from `moralInstitutionPressure.js:348`) |
| W6 | `institutionLifecycle.js:1103` | **`null`** — re-raise clears | — |
| W7 | `magicRegimeLifecycle.js:357` | `magicClosureFate(patch.form)` | `bankrupt` · `closed_for_want_of_custom` |
| W8 | `magicRegimeLifecycle.js:374` | **`null`** — magic reopen clears | — |
| W9 | `settlementLifecycleFirstClass.js:601` | literal | `abandoned_with_the_settlement` |
| W10 | `tierOutcomeApply.js:162` | `demotionFateForInstitution(inst).fate` | `reduced_to_watch_post` · `abandoned` · `privatized` · `survives_as_remnant` · `downsized` · `captured_by_local_powers` · `hollowed_out` |
| W11 | `tierOutcomeApply.js:265` | **`null`** — tier reactivation clears | — |
| W12 | `upswingKernel.js:516` | literal | `upgraded_by_reconstruction` |
| W13 | `upswingKernel.js:763` | literal | `founded_by_flourishing` |

The two `patch.fate ||` overrides were traced to their only producers in `src/`:

```
$ git grep -n "institutionPatch" -- 'src/**'
  src/domain/worldPulse/institutionLifecycle.js:846:        institutionPatch: {   → :851 fate: closureFateForInstitution(target.inst)
  src/domain/worldPulse/moralInstitutionPressure.js:374:        institutionPatch: {   → :379 fate,
  src/domain/worldPulse/institutionLifecycle.js:777:  (a BUILD patch — carries no fate)
  src/domain/worldPulse/moralInstitutionPressure.js:528:  (a FOUND patch — carries no fate)
$ grep -n "const fate" src/domain/worldPulse/moralInstitutionPressure.js
  348:      const fate = best.martial ? 'disbanded' : 'abolished';
```

⇒ ⛔ **`disbanded` is produced by a file that writes NO `worldPulseFate` at all.** A write-site
scan cannot see it. **This is why the walker's `derived` arm checks DERIVERS, not only literals.**

⇒ **SEVENTEEN distinct values + `null`. With `ruined_by_decree`, EIGHTEEN members.**

---

## §4 · The derivers' WHOLE HISTORY — no retired spelling

```
$ for rev in $(git rev-list --all -- src/domain/worldPulse/institutionLifecycle.js); do
    git show "$rev:$P2" | grep -A8 "function closureFateForInstitution" | grep -oE "return '[a-z_]+'"; done | sort -u
  return 'bankrupt'
  return 'closed_for_want_of_custom'
  return 'shuttered'                                   (30 revisions · exactly three, always)

$ for rev in $(git rev-list --all -- src/domain/worldPulse/tierOutcomeApply.js); do
    git show "$rev:$P" | grep -oE "\bfate: '[a-z_]+'"; done | sort -u
  fate: 'abandoned'   fate: 'added'*   fate: 'captured_by_local_powers'   fate: 'downsized'
  fate: 'hollowed_out'   fate: 'privatized'   fate: 'reactivated'*   fate: 'reduced_to_watch_post'
  fate: 'survives_as_remnant'                          (* = institutionHistory fates, NOT worldPulseFate — R4)

$ for rev in $(git rev-list --all -- src/domain/worldPulse/magicRegimeLifecycle.js); do
    git show "$rev:$P" | grep -A4 "function magicClosureFate" | grep -oE "'[a-z_]+'"; done | sort -u
  'bankrupt'   'closed_for_want_of_custom'

$ for rev in $(git rev-list --all -- src/domain/worldPulse/moralInstitutionPressure.js); do
    git show "$rev:$P" | grep -oE "const fate = .*"; done | sort -u
  const fate = best.martial ? 'disbanded' : 'abolished';

$ for f in <the six writer files>; do for rev in $(git rev-list --all -- $f); do
    git show "$rev:$f" | grep -oE "worldPulseFate: '[a-z_]+'"; done; done | sort -u
  worldPulseFate: 'abandoned_with_the_settlement'
  worldPulseFate: 'demoted_by_disaster'
  worldPulseFate: 'destroyed_by_disaster'
  worldPulseFate: 'founded_by_flourishing'
  worldPulseFate: 'upgraded_by_reconstruction'
```

⇒ ⭐ **NO RETIRED SPELLING EXISTS IN THE REPO'S HISTORY.** Every value any revision of any
writer could produce is a member of the proposed eighteen. (The limit of this claim — a user's
saved world outside the repo — is **R5**.)

---

## §5 · Bundle placement — measured four ways

`scan-bundles.mjs`. `importsOf` / `resolveRel` copied **verbatim** from `vite.config.js`'s
`computeEagerModuleGraph` (`:248-274`); the eager set was additionally read from the config's
**own exported** `EAGER_FIRST_PAINT_MODULES` rather than a replica.

```
$ node scan-bundles.mjs
### generation.worker (ZERO SLACK, ceiling 1401208)  static=220 · static+dynamic=228
    --  calamityKernel.js  institutionLifecycle.js  tierOutcomeApply.js  upswingKernel.js
    --  settlementLifecycleFirstClass.js  magicRegimeLifecycle.js  moralInstitutionPressure.js
    --  institutionStatusModel.js  rosterProvenance.js  causeLifecycle.js  entities/status.js
      ⇒ NOT ONE candidate is in the zero-slack closure.

### advanceInterval.worker (NO ceiling today; TOOL-3)  static=549 · static+dynamic=549
    IN  calamityKernel.js · institutionLifecycle.js · tierOutcomeApply.js · upswingKernel.js
    IN  settlementLifecycleFirstClass.js · moralInstitutionPressure.js · causeLifecycle.js · entities/status.js
    --  magicRegimeLifecycle.js · rosterProvenance.js

### townSceneExport.worker (no ceiling) static=125 — none
### townScene.worker static=18 / dyn=119 — none
### customContentPreview.worker static=267 / dyn=271 — tierOutcomeApply.js, entities/status.js

### LAZY ENGINE CHUNK — the manualChunks rule is id.includes('/src/generators/')  ⇒ NONE

$ node -e "const m = await import('./vite.config.js'); …"
EAGER_FIRST_PAINT_MODULES size = 268
--  calamityKernel.js          IN  tierOutcomeApply.js
--  institutionLifecycle.js    IN  entities/status.js
--  upswingKernel.js           IN  entities/npcs.js
--  settlementLifecycleFirstClass.js  --  magicRegimeLifecycle.js
--  moralInstitutionPressure.js  --  institutionStatusModel.js
--  rosterProvenance.js          --  causeLifecycle.js

### EDGE-SHARED BUNDLE INPUT MEMBERSHIP (the metas' own `inputs` lists)
  aiCharterBundle.meta.json:      114 inputs · src/domain/entities/status.js
  aiGroundingBundle.meta.json:     74 inputs · NONE
  aiOutputSchemaBundle.meta.json: 115 inputs · src/domain/entities/status.js
  analyticsEventsBundle.meta.json:  2 inputs · NONE
  intentAtlasBundle.meta.json:      2 inputs · NONE
  TOTAL inputs across the five metas: 307
```

⇒ **No writer file and neither CREATE target is an input of any edge-shared bundle** ⇒ §P2
rows 10 and 12 **NOT OWED**, and no `supabase/functions/_shared/**` row.
⇒ `src/domain/entities/status.js` would owe **seven generated artifacts** — which is why §3.2
refuses it as the home.

### §5.1 · The decisive closure measurement

```
$ node -e "<closure walk, importsOf verbatim>"
calamityKernel.js static closure:        327 modules, 7,093,875 raw bytes
envoyErrandVocabulary.js (zero-import):    1 module
```

⇒ ⭐ **a consumer that wants only the eighteen words inherits 327 modules from the kernel home
and ONE from a leaf.** §P2 row 11: *"THE CURE IS THE PLACEMENT BEFORE IT IS THE CEILING."*

---

## §6 · The bytes

```
$ $T/node_modules/.bin/esbuild --minify --format=esm price-vocab.js  → 519 B
$ $T/node_modules/.bin/esbuild --minify --format=esm price-guard.js  → 220 B
```

Emitted vocabulary (whole): `const t=Object.freeze(["abandoned","abandoned_with_the_settlement",
"abolished","bankrupt","captured_by_local_powers","closed_for_want_of_custom","demoted_by_disaster",
"destroyed_by_disaster","disbanded","downsized","founded_by_flourishing","hollowed_out","privatized",
"reduced_to_watch_post","ruined_by_decree","shuttered","survives_as_remnant","upgraded_by_reconstruction"]),
_=new Set(t);function d(e){return typeof e=="string"&&_.has(e)}export{t as WORLD_PULSE_FATES,…}`

⇒ **≤739 B, stated as an UPPER BOUND** (esbuild preserves the export names per module; rollup
scope-hoists and mangles them inside `advanceInterval.worker`). That worker has **no ceiling
today**. **R2.**

---

## §7 · The registered manifest — collision and ownership

```
$ node -e "<read docs/implementation/PACKET_MANIFEST.json>"
entries: 189   statuses: {"LANDED":186,"SUPERSEDED":2,"READY":1}

  scripts/mutation-coverage-manifest.json -> AO-2+3[LANDED] … EM-P0[LANDED], EM-B1d[READY]
  src/domain/worldPulse/calamityKernel.js -> EM-B1e[LANDED]
  src/domain/worldPulse/institutionLifecycle.js -> MF-T2Q[LANDED]
  src/domain/worldPulse/tierOutcomeApply.js -> NOBODY
  src/domain/worldPulse/upswingKernel.js -> CS-B1[LANDED]
  src/domain/worldPulse/settlementLifecycleFirstClass.js -> NOBODY
  src/domain/worldPulse/magicRegimeLifecycle.js -> NOBODY
  src/domain/worldPulse/moralInstitutionPressure.js -> NOBODY
  src/domain/provenance/rosterProvenance.js -> NOBODY
  src/domain/worldPulse/causeLifecycle.js -> NOBODY

--- the ONLY non-terminal entry:
   EM-B1d READY :: … | REGISTER scripts/mutation-coverage-manifest.json | …
```

⇒ ⛔ **EM-B1d [READY] reserves the mutation-coverage manifest.** The only live collision.

```
--- requiredSymbols rows naming any candidate path, ANY packet, ANY status ---
  CS-B1[LANDED]   upswingKernel.js   :: export function advanceUpswing / BOOM_MIN_DWELL / <a line>
  MF-T2R[LANDED]  calamityKernel.js  :: export function forceCalamityStrike
  MF-T2Q[LANDED]  institutionLifecycle.js :: export function applyInstitutionLifecycleOutcome / function foundingStampFrom
  EM-B1e[LANDED]  calamityKernel.js  :: export function strikeCapForTier / export function forceCalamityStrike
  EM-B1e[LANDED]  rosterProvenance.js :: const INACTIVE_STATUSES
  EM-B1e[LANDED]  causeLifecycle.js  :: worldPulseFate
```

⇒ **Four LANDED pins sit on `calamityKernel.js`, the one file this packet MODIFIES.** All four
are outside the edited region; two of them (`forceCalamityStrike`, `strikeCapForTier`) are
carried into this packet's `requiredSymbols` so the landed pins are discharged here too.
⇒ **No `retiredSymbols` row is owed anywhere:** this packet removes, renames and moves **no**
symbol. It adds a leaf and one predicate.

---

## §8 · No reader is a display surface

```
$ git grep -n "lastLifecycle" -- 'src/**'
  src/domain/provenance/rosterProvenance.js:61  · :294 · :323 · :363 · :375 · :384 · :390
  (every hit is inside the PRODUCER itself — no consumer anywhere in src/)

$ git grep -n "institutionProvenanceOf" -- 'src/**'
  src/components/new/tabs/OverviewTab.jsx:27  (import)
  src/components/new/tabs/OverviewTab.jsx:57  const { created } = institutionProvenanceOf(inst);
  src/domain/provenance/rosterProvenance.js:288 (the export)
```

⇒ ⭐ **the ONE consumer destructures `created` ONLY.** `lastLifecycle.fate` — the projection that
carries `worldPulseFate` — reaches **no surface**. ⇒ the fate is ENGINE vocabulary; the voice law
does not apply. A6 asserts this rather than assuming it.

---

## §9 · `requiredSymbols` verbatim, and the CREATE targets

```
$ grep -cF -- "<symbol>" "<path>"      (at ad7ddf2c9)
1  export function ruinInstitution                      src/domain/worldPulse/calamityKernel.js
1  export function forceCalamityStrike                  src/domain/worldPulse/calamityKernel.js
1  export function strikeCapForTier                     src/domain/worldPulse/calamityKernel.js
1  worldPulseFate: 'demoted_by_disaster'                src/domain/worldPulse/calamityKernel.js
1  function closureFateForInstitution                   src/domain/worldPulse/institutionLifecycle.js
1  function demotionFateForInstitution                  src/domain/worldPulse/tierOutcomeApply.js
1  export function magicClosureFate                     src/domain/worldPulse/magicRegimeLifecycle.js
1  const fate = best.martial ? 'disbanded' : 'abolished';  src/domain/worldPulse/moralInstitutionPressure.js
1  worldPulseFate: 'abandoned_with_the_settlement'      src/domain/worldPulse/settlementLifecycleFirstClass.js
1  worldPulseFate: 'upgraded_by_reconstruction'         src/domain/worldPulse/upswingKernel.js
1  worldPulseFate: 'founded_by_flourishing'             src/domain/worldPulse/upswingKernel.js
1  const NONSTANDING_STATUS                             src/domain/worldPulse/causeLifecycle.js
1  function institutionLastLifecycle                    src/domain/provenance/rosterProvenance.js
1  export const ENFORCER_DIRS                           tests/lint/mutationCoverage.shared.mjs
1  const SCAN_ROOTS                                     tests/lint/chooserTotality.walker.test.js
                                                        ⇒ FIFTEEN rows, each exactly once.

$ ls / git ls-files --error-unmatch
src/domain/worldPulse/worldPulseFates.js          disk:ABSENT  git:UNTRACKED
tests/lint/worldPulseFateTotality.walker.test.js  disk:ABSENT  git:UNTRACKED
```

**POST-EDIT SIMULATION, row by row.** Fourteen of the fifteen rows are on files the packet does
NOT edit ⇒ trivially PRESENT after the build. The fifteenth,
`export function ruinInstitution`, is on the one MODIFIED file: the packet inserts a predicate
**inside the body** and extends the import clause, and **never re-spells, renames or moves the
signature line** ⇒ PRESENT. ⇒ **`retiredSymbols`: NONE.** ⇒ **no other LANDED packet's row for
any (path, symbol) pair this packet touches needs discharging beyond the two carried in §7.**

---

## §10 · The lighting census counts TEST files only

```
$ grep -n "TEST_FILES" tests/lint/sovereigntyLightingContract.walker.test.js
  515:const TEST_FILES = walk(join(ROOT, 'tests'))
  602: const parked = TEST_FILES.filter(…)      603: const credited = TEST_FILES.filter(…)
  612:      files: TEST_FILES.length,
```

⇒ ⭐ **a new `src/` leaf moves NOTHING.** `EM-PREAMBLE.md` §P2 row 1 is right and
`LANE-EM-COMPILE.md`'s contrary sentence is stale (**R6**). The delta this packet causes is
**`+1 files / +0 parked / +1 credited / +4 titles / +1 suiteTitles`** — one new `tests/lint`
file, one literal `describe`, four straight-line `it`.

---

## §11 · Hot files, `max-lines`, and the one that is missing from the list

```
$ sed -n '/## Hot files/,/EconomicsTab.jsx joined/p' docs/implementation/PACKET_STANDARD.md
| src/components/new/tabs/EconomicsTab.jsx | 600 | 600 | 0 |
| src/components/OutputContainer.jsx       | 599 | 600 | 1 |
| src/domain/worldPulse/convergence.js     | 798 | 800 | 2 |
| src/domain/worldPulse/peaceTerms.js      | 797 | 800 | 3 |
| src/domain/worldPulse/informationStatecraft.js | 780 | 800 | 20 |

$ for f in calamityKernel institutionLifecycle tierOutcomeApply upswingKernel \
           settlementLifecycleFirstClass magicRegimeLifecycle; do grep -c "$f" PACKET_STANDARD.md; done
0 0 0 0 0 0                      ⇒ none of the six is on the standing list

$ node scan-flagged.mjs   (eslint Linter, skipBlankLines + skipComments)
  457  src/domain/worldPulse/calamityKernel.js               ← the ONLY edited file
  798  src/domain/worldPulse/institutionLifecycle.js         ⛔⛔ HOT, UNLISTED
  228  src/domain/worldPulse/tierOutcomeApply.js
  640  src/domain/worldPulse/upswingKernel.js
  462  src/domain/worldPulse/settlementLifecycleFirstClass.js
  200  src/domain/worldPulse/magicRegimeLifecycle.js
  838  src/domain/worldPulse/roadsKernel.js
CONTROL: scripts/.size-baseline.json → "src/domain/worldPulse/roadsKernel.js": 838   ← EXACT match

$ grep -n "max-lines" eslint.config.js  → :687  files: ['src/domain/**/*.js'], max: 800
```

⇒ The control reproduces eslint's own arithmetic exactly, so these are measurements.
⇒ **`institutionLifecycle.js` is 798/800 — `convergence.js`'s row — and it is NOT on the list
(R3).** The packet does not touch it.
⇒ `calamityKernel.js` has **343 lines of headroom** against a ≤5-line edit; no `max-lines` STOP.

---

## §12 · The homonym table and the trigger — two independent readings, agreeing

`scan-homonyms.mjs`. **Reading A (strict):** a member is a HOMONYM iff some file outside the
seven-file roster declares `const SCREAMING_SNAKE = <collection>` whose initialiser contains the
quoted token. **Reading B (loose control):** the quoted token appears anywhere in CODE outside
the roster.

```
member                            A(vocabs)  verdict   where
destroyed_by_disaster                 0      TRIGGER
demoted_by_disaster                   0      TRIGGER
shuttered                             0      TRIGGER
bankrupt                              0      TRIGGER
closed_for_want_of_custom             0      TRIGGER
abolished                             1      HOMONYM   NONSTANDING_STATUS × worldPulse/causeLifecycle.js
disbanded                             1      HOMONYM   NONSTANDING_STATUS × worldPulse/causeLifecycle.js
abandoned_with_the_settlement         0      TRIGGER
reduced_to_watch_post                 0      TRIGGER
abandoned                             3      HOMONYM   FOSSIL_KINDS × undercity/colonization.js ;
                                                       DEAD_ENDPOINT_STATUS × worldPulse/corruptionWeb.js ;
                                                       PLAN_STATES × worldPulse/demographicsPlans.js
privatized · survives_as_remnant · downsized ·
captured_by_local_powers · hollowed_out ·
upgraded_by_reconstruction · founded_by_flourishing
                                      0 each  TRIGGER

TRIGGER SET (14): { destroyed_by_disaster, demoted_by_disaster, shuttered, bankrupt,
  closed_for_want_of_custom, abandoned_with_the_settlement, reduced_to_watch_post, privatized,
  survives_as_remnant, downsized, captured_by_local_powers, hollowed_out,
  upgraded_by_reconstruction, founded_by_flourishing }

--- Reading B (looser control): files containing the quoted token outside the roster ---
  abolished 1 · disbanded 1 (both causeLifecycle.js) · abandoned 7 · EVERY OTHER MEMBER 0
```

⇒ **The two readings agree exactly.** Spot-checked by hand: `bankrupt` and `shuttered` appear
elsewhere only inside PROSE sentences (`"…a deceased or bankrupt party."`,
`"…shuttered shops"`), never as a quoted token — which is precisely the discriminating property.

```
$ sed -n '134p' src/domain/worldPulse/causeLifecycle.js
const NONSTANDING_STATUS = new Set(['removed','destroyed','remnant','ruined','defunct','closed','disbanded','abolished']);
```

⇒ ⭐ `abolished` and `disbanded` are simultaneously a FATE and a STATUS — **in the very file that
reads `worldPulseFate`.** Triggering on them would convict the reader.

---

## §13 · FLAGGED == the six writer files, both directions

```
$ node scan-flagged.mjs
FLAGGED files (src/, comment-stripped, any of the 14 trigger tokens): 6
  src/domain/worldPulse/calamityKernel.js
  src/domain/worldPulse/institutionLifecycle.js
  src/domain/worldPulse/magicRegimeLifecycle.js
  src/domain/worldPulse/settlementLifecycleFirstClass.js
  src/domain/worldPulse/tierOutcomeApply.js
  src/domain/worldPulse/upswingKernel.js

Of those, which WRITE worldPulseFate:   WRITER ×6  (no "NOT A WRITER" row)
All files that WRITE worldPulseFate:    flagged ×6 (no "UNFLAGGED" row)
```

⇒ ⭐ **SET-EQUAL IN BOTH DIRECTIONS, with no offender either way.** The walker's central
assertion is true at the tip before a line is written, which is what makes it a *freeze* rather
than a *cure*.

---

## §14 · §7's table and the JSON are SET-EQUAL, and every action is in `PACKET_ACTIONS`

```
$ node -e "<parse EM-B1h.md §7 and EM-B1h.manifest.json>"
JSON parses OK. id=EM-B1h status=DRAFT
PACKET_ACTIONS = CREATE,DOC,MODIFY,REGISTER,TEST
rows with an action outside PACKET_ACTIONS: 0

--- §7 TABLE ---                                 --- JSON changeManifest ---
  CREATE   src/domain/worldPulse/worldPulseFates.js          (identical, same order)
  MODIFY   src/domain/worldPulse/calamityKernel.js
  CREATE   tests/lint/worldPulseFateTotality.walker.test.js
  REGISTER scripts/mutation-coverage-manifest.json

SET-EQUAL both directions: true
  only in Markdown: []      only in JSON: []      counts: md=4 json=4
requiredSymbols rows: 15    acceptanceCases: 6 (<=8)    checks arrays: 11

$ node -e "<one test directory per checks array>"
  [0] tests/lint   [1] tests/domain   [2] tests/domain/provenance   [3] tests/property
  [4] tests/simulation   [5] eslint (tests/lint)   [6..10] no test paths
                                                   ⇒ ONE directory per array, satisfied.
```

---

## §15 · The `tests/` sweep by LITERAL and by VALUE (step 12)

```
$ node scan-values.mjs          (5,625 files across src, tests, scripts, supabase, api, docs/content)

--- ruined_by_decree ---   tests/domain/ruinInstitution.test.js:52 (const DECREE_FATE), :316
      ⇒ present in tests/ ONLY, placed there by EM-B1e's own landing. Its only occurrences.
--- destroyed_by_disaster --- calamityKernel.js :227 :317 :321 ; ruinInstitution.test.js :48 :49 :53
--- abandoned_with_the_settlement --- settlementLifecycleFirstClass.js:601 ; settlementLifecycleFirstClass.test.js:424
--- founded_by_flourishing --- upswingKernel.js:763 ; upswingKernel.test.js:491
--- captured_by_local_powers --- tierOutcomeApply.js:147 ; causeResolutionLifecycle.test.js:321 ;
                                 scripts/audit/cause-lifecycle-soak.mjs:171
--- shuttered / bankrupt / closed_for_want_of_custom --- their derivers, plus prose sites, plus
      evaluateInstitutionLifecycle.test.js:165 · institutionLifecycle.test.js:375 · magicRegimeLifecycle.test.js:219
--- demoted_by_disaster · reduced_to_watch_post · privatized · survives_as_remnant · downsized ·
    hollowed_out · upgraded_by_reconstruction --- their own site ONLY

================ JSON DATA SWEEP ================
json files: 97   ⇒ NO worldPulseFate KEY IN ANY .json UNDER tests/ src/ public/
```

⇒ **No golden or fixture carries the key**, so the packet is golden-neutral by construction as
well as by intent.

### The decisive one — every `fate` VALUE passed to `ruinInstitution` in `tests/`

```
$ git grep -n "ruinInstitution(" -- 'src/**' 'tests/**'
  src/…/calamityKernel.js:242 (the definition) · :317 fate:'destroyed_by_disaster' · :321 same
  tests/domain/ruinInstitution.test.js: ELEVEN call sites at :244 :260 :261 :262 :263 :264 :265
    :266 :267 :268 :274 :293 :296 :297 :303 :304
$ grep -n "fate:" tests/domain/ruinInstitution.test.js
  every value is DECREE_FATE ('ruined_by_decree') or DISASTER_FATE ('destroyed_by_disaster'),
  plus the deliberate negatives '' and { toString: () => DECREE_FATE }
```

⇒ ⭐⭐ **BOTH LIVE VALUES ARE MEMBERS ⇒ NO ARM OF THE LANDED SUITE REDS, AND NO `TEST` ROW IS
OWED.** The negatives (`''`, a non-string) still throw on the existing TYPE check because §6
places the new predicate AFTER it — which is why acceptance **A2 pins the check ORDER by
message** rather than merely asserting that something throws.

### The one constraint the sweep produced

```
$ sed -n '326,332p' tests/domain/ruinInstitution.test.js
  it('A7 one writer in src/, the matcher proved live, and the convergence fence held', () => {
    const files = walkFiles(join(ROOT, 'src')).filter(…);
    const hits = files.filter((p) => RUIN_WRITE_RE.test(commentsOnly(readFileSync(p,'utf8'))))…
    expect(hits).toEqual(['src/domain/worldPulse/calamityKernel.js']);
```

⇒ ⛔ **the new leaf is inside this LANDED arm's scan.** It must not contain the quoted token
`status: 'ruined'` in code or a template literal (a `//` or `/* */` gloss is blanked by the strip
and is safe). Declared in §7's CREATE instruction and in §11's STOP list.

---

## §15.1 · The standing-institution reading (N8) — receipted, not asserted

```
$ sed -n '137,142p' src/domain/worldPulse/causeLifecycle.js
function institutionDestroyed(inst) {
  if (!inst) return false;
  if (inst._worldPulseInactive === true || inst._worldPulseMorallyAbolished === true) return true;
  if (inst.worldPulseFate) return true;            ← decides on the KEY's presence alone
  return NONSTANDING_STATUS.has(norm(inst.status));
}

$ sed -n '763p' src/domain/worldPulse/upswingKernel.js
  insts.push({ name: 'Academy', category: 'academic', status: 'active', worldPulseFate: 'founded_by_flourishing' });

$ sed -n '515,516p' src/domain/worldPulse/upswingKernel.js
  const idx = insts.findIndex((i) => String(i.name) === upgrade.from && String(i.status || 'active') === 'active');
  if (idx >= 0) { insts[idx] = { ...insts[idx], …, worldPulseFate: 'upgraded_by_reconstruction' }; }
```

⇒ ⚠ **Both `upswingKernel` fates are stamped on institutions whose `status` stays `'active'` and
which carry no `_worldPulseInactive`** — so `institutionDestroyed` answers **true** for a
flourishing academy, on the third line, purely because the key is present. ⛔ **PRE-EXISTING: this
packet neither creates nor changes that reading** (it adds no reader and removes no value). It is
recorded because closing the vocabulary is what makes the question visible. **N8 — slotted to
EM-B1a's pre-proof beside EM-B1e's R9, since both turn on what this truthiness is allowed to
mean.**

---

## §16 · ⭐ VERSION 2 — the kinds, derived by execution from the record literals

`scan-kinds.mjs` classifies each of the thirteen write sites by the **sibling keys of its own
record literal**, not by the fate's English.

```
$ node scan-kinds.mjs
calamityKernel.js:247   ruinInstitution     status:'ruined'  _worldPulseInactive  _worldPulseEconomyClosed
calamityKernel.js:309   calamity DEMOTE     ⭐ NONE — no status change, no inactive flag
institutionLifecycle.js:1019  CLOSE         status:'remnant' _worldPulseInactive  _worldPulseEconomyClosed
institutionLifecycle.js:1061  ABOLISH       status:'remnant' _worldPulseInactive  _worldPulseMorallyAbolished
institutionLifecycle.js:959   REOPEN(clear) status:'active'  _worldPulseInactive  _worldPulseEconomyClosed      (all FALSE)
institutionLifecycle.js:1103  RE-RAISE(clr) status:'active'  … _worldPulseMorallyAbolished _worldPulseFounded   (flags FALSE)
magicRegimeLifecycle.js:357   magic CLOSE   status:'remnant' _worldPulseInactive  _worldPulseEconomyClosed
magicRegimeLifecycle.js:374   magic REOPEN  status:'active'  _worldPulseInactive  _worldPulseEconomyClosed      (all FALSE)
settlementLifecycleFirstClass.js:601 DEATH  status:'removed' _worldPulseInactive
tierOutcomeApply.js:162 tier DEMOTION       status: fate.status  _worldPulseInactive
tierOutcomeApply.js:265 tier REACTIVATION   status:'active'  … _worldPulseTierAdded                             (flags FALSE)
upswingKernel.js:516    UPGRADE             ⭐ NONE — no status change, no inactive flag
upswingKernel.js:763    FOUNDING            status:'active'
```

Corroborated by reading the three decisive sites directly:

```
$ sed -n '291p' src/domain/worldPulse/calamityKernel.js
    const idx = list.findIndex((i) => String(i.name) === name && String(i.status || 'active') === 'active');
$ awk 'NR>=283 && NR<=313' src/domain/worldPulse/calamityKernel.js | grep -n "status\|_worldPulseInactive\|_worldPulseEconomyClosed"
8:    const idx = list.findIndex(… === 'active');        ← the SELECTION only; the record writes none
$ sed -n '295,297p' src/domain/worldPulse/calamityKernel.js
      // The greater falls a rung: rename in place, KEEPING THE SLOT STANDING. …

$ sed -n '158,163p' src/domain/worldPulse/tierOutcomeApply.js
function deactivateForDemotion(inst, outcome, toTier) {
  const fate = demotionFateForInstitution(inst);
  return { ...inst, status: fate.status, _worldPulseInactive: true, worldPulseFate: fate.fate, …
$ grep -oE "\{ fate: '[a-z_]+', status: '[a-z]+' \}" src/domain/worldPulse/tierOutcomeApply.js | sort -u
  … status: 'remnant' ×6 and status: 'removed' ×1 — never 'active'

$ sed -n '515,516p;763p' src/domain/worldPulse/upswingKernel.js
  const idx = insts.findIndex((i) => … String(i.status || 'active') === 'active');
    insts[idx] = { ...insts[idx], name: upgrade.to, promotedFrom: upgrade.from, worldPulseFate: 'upgraded_by_reconstruction' };
    insts.push({ name: 'Academy', category: 'academic', status: 'active', worldPulseFate: 'founded_by_flourishing' });
```

⇒ ⭐ **THREE KINDS: `closure` 15 · `standing` 1 · `rise` 2 = 18.**
⇒ ⛔ **The six names flagged for a second look are ALL `closure`** — `deactivateForDemotion` sets
`_worldPulseInactive: true` and a non-active status for **all seven** demotion fates, however
gentle the word. ⇒ ⛔ **`demoted_by_disaster` is the member that needed the third kind**, and the
branch's own comment says why.

### §16.1 · The second vocabulary, member by member

```
=== LIFECYCLE_BUILD_FATES / LIFECYCLE_CLOSE_FATES (institutionLifecycle.js:634-635) ===
  LIFECYCLE_BUILD_FATES (2): built, reopened
  LIFECYCLE_CLOSE_FATES (3): shuttered, bankrupt, closed_for_want_of_custom
  the proposed 'closure' kind (15): abandoned, abandoned_with_the_settlement, abolished, bankrupt,
    captured_by_local_powers, closed_for_want_of_custom, destroyed_by_disaster, disbanded, downsized,
    hollowed_out, privatized, reduced_to_watch_post, ruined_by_decree, shuttered, survives_as_remnant

  MEMBER-BY-MEMBER: is each closure-kind member in LIFECYCLE_CLOSE_FATES?
    IN  bankrupt · closed_for_want_of_custom · shuttered
    --  abandoned · abandoned_with_the_settlement · abolished · captured_by_local_powers
    --  destroyed_by_disaster · disbanded · downsized · hollowed_out · privatized
    --  reduced_to_watch_post · ruined_by_decree · survives_as_remnant
  REVERSE: all 3 of 3 LIFECYCLE_CLOSE_FATES members are in the closure kind.
  ⇒ LIFECYCLE_CLOSE_FATES is a STRICT SUBSET of the closure kind: 3 of 15.
  ⇒ LIFECYCLE_BUILD_FATES members in WORLD_PULSE_FATES: 0 of 2.

=== institutionHistory[].fate — all ten write sites ===
  institutionLifecycle.js:971 'reopened' · :998 'built' · :1031 fate (the CLOSE variable, :1013)
  institutionLifecycle.js:1073 fate (the ABOLISH variable, :1055) · :1118 'founded' · :1147 'founded'
  entrepotKernel.js:79 'built' · tierOutcomeApply.js:256 'reactivated' · :278 'added'
  tierOutcomeApply.js:290 demotionFateForInstitution(inst).fate

=== institutionHistory[].fate  vs  WORLD_PULSE_FATES ===
  institutionHistory values : 17
  SHARED (12): shuttered, bankrupt, closed_for_want_of_custom, abolished, disbanded,
               reduced_to_watch_post, abandoned, privatized, survives_as_remnant, downsized,
               captured_by_local_powers, hollowed_out
  ONLY institutionHistory (5): reopened, built, founded, reactivated, added
  ONLY WORLD_PULSE_FATES  (6): abandoned_with_the_settlement, demoted_by_disaster,
               destroyed_by_disaster, founded_by_flourishing, ruined_by_decree, upgraded_by_reconstruction
  ⇒ A DIFFERENT, OVERLAPPING VOCABULARY
```

⇒ the walker's roster does **not** cover those write sites and must not pretend to. ⚠ The damping
counter `priorLifecycleCounts` counts **only the three economic closures**; deriving it from the
kind would take it from 3 counted words to 15 — a **lived-behaviour change** (R6).

### §16.2 · The bytes, both shapes and both guard homes

```
$ $T/node_modules/.bin/esbuild --minify --format=esm <file>
shape-a   (a frozen list BESIDE a frozen kind map)          1248 B
shape-c   (the kind map as source, the list derived)   ⭐    910 B      −338 B
guard-a   (the predicate inline in the kernel)               204 B
guard-b   (the leaf's exported assert, called)         ⭐     98 B      −106 B
```

⇒ the leaf is **910 B** and the kernel fragment **98 B** ⇒ **≤1,008 B**, an upper bound (esbuild
preserves export names per module; rollup mangles them inside the worker chunk). Version 1 was
739 B; the **+269 B is the KIND data**. Kernel effective lines: **+2** (option B) against **+4**.

### §16.3 · ⭐ THE REGISTER VERSION 1 MISSED — `couplingInclusion`

```
$ grep -n "CENSUS_SCOPE_RE\|ARGUED_ROSTER_CEILING = " tests/lint/couplingInclusion.walker.test.js
  1051:const ARGUED_ROSTER_CEILING = 28;
  1054:const CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//;

$ sed -n '1565,1575p' tests/lint/couplingInclusion.walker.test.js
  test('a NEW unlayered module REDS — it must get a family, an argument, or the baseline', () => {
    … `${rel} matches NO layer family pattern, so every cross-layer read through it is INVISIBLE
       to this ratchet. Give it a LAYER_PATTERNS home (the usual answer), or an ARGUED_UNLAYERED
       entry with a written reason, or — ONLY FOR PRE-PROGRAM DEBT — a line in
       tests/lint/.coupling-unlayered-baseline.json.`
    expect(escaped).toEqual([]);

$ node -e "<count ARGUED_UNLAYERED keys and read the ceiling>"
ARGUED_UNLAYERED keys: 28
  substrate rows with reads: []: 20
ARGUED_ROSTER_CEILING = 28 (MATCHES the live roster)

$ sed -n '473,477p' tests/lint/couplingInclusion.walker.test.js        ← THE PRECEDENT ROW
  'src/domain/worldPulse/bandFamilies.js': Object.freeze({
    kind: 'substrate',
    reason: 'SP substrate — the shared band/severity vocabulary, spelled by every layer',
    reads: Object.freeze([]),
  }),

$ sed -n '504,513p' tests/lint/couplingInclusion.walker.test.js        ← WHAT THE ROW MUST SATISFY
    expect(DOMAIN_MODULES, `${module} vanished`).toContain(module);
    expect(LAYER_OF.has(module), `${module} acquired a layer home`).toBe(false);
    expect(['host','substrate'], `${module} has no recognised argument kind`).toContain(argument.kind);
    expect(argument.reason.length, `${module} is excluded without a reason`).toBeGreaterThan(20);
  … expect(Object.keys(ARGUED_UNLAYERED).length, …).toBe(ARGUED_ROSTER_CEILING);   ← EXACT EQUALITY
```

**And no pair is minted, so neither baseline moves:**

```
$ sed -n '1164,1174p' tests/lint/couplingInclusion.walker.test.js
function scanCrossLayerPairs() {
  for (const [rel, layer] of [...LAYER_OF].sort()) {        ← LAYERED modules only
    for (const dep of relativeImportsOf(rel)) {
      const depLayer = LAYER_OF.get(dep);
      if (!depLayer || depLayer === layer) continue;        ← an UNLAYERED dep is skipped

$ node -e "<test every LAYER_PATTERNS regex against calamityKernel.js and worldPulseFates.js>"
(no output — NEITHER name matches any layer family)
$ grep -n "calamityKernel" tests/lint/.coupling-unlayered-baseline.json
36:  "src/domain/worldPulse/calamityKernel.js",          (of a 179-entry file)
```

⇒ ⭐ the leaf is imported only by an **already-unlayered** module ⇒ **no cross-layer pair**, and
`tests/lint/.coupling-inclusion-baseline.json` / `.coupling-unlayered-baseline.json` are **NOT
rows of this packet.**

```
$ node -e "<who reserves these paths in PACKET_MANIFEST.json>"
  tests/lint/couplingInclusion.walker.test.js -> IN-1A[LANDED], HB-0[LANDED], HB-1[LANDED],
      HB-2[LANDED], INT-3B[LANDED], WC-0A[LANDED], WC-0C[LANDED], WC-0E[LANDED],
      WF-1A[LANDED], WF-1F[LANDED]                      ⇒ TEN packets, ALL LANDED — FREE
  tests/lint/.coupling-unlayered-baseline.json -> NOBODY
  tests/lint/.coupling-inclusion-baseline.json -> NOBODY
```

### §16.4 · The other registers swept for a new `worldPulse` leaf — all NOT OWED

```
$ grep -rln "unused export|dead export|unreferenced export"  tests/lint/ scripts/   → no dead-export walker
$ grep -n "no-unused-vars|import/no-unused-modules" eslint.config.js               → no unused-EXPORT rule
$ head tests/lint/vocabularyTotality.walker.test.js
    "For each producer→consumer vocabulary contract below, the consumer's recognized set must
     equal the producer's emitted set EXACTLY, both ways"
      ⇒ a PRODUCER→CONSUMER register. This vocabulary has NO enumerating consumer (by design),
        so NO row is owed. ⭐ EM-B1i — the first consumer — is exactly when a row becomes owed.
$ grep -n "toBe([0-9]+)" tests/lint/engineTelemetryWall.walker.test.js   → SIM_METRIC_NAMES.length = 13 only
      (per-root FLOORS, not file counts; a frozen-data leaf with no telemetry import is inert)
$ tests/lint/entropyRootCensus.walker.test.js  → PRNG call sites; the leaf draws none
$ tests/lint/deepCloneHotPath.test.js          → no exact counts
$ tests/lint/domainStrictBaseline.test.js      → "a new file gets an allowance of 0 (base[file] ?? 0)"
      ⇒ nothing owed; the leaf must simply be strict-clean and any-free (both typechecks in `checks`)
$ grep -c export src/domain/worldPulse/index.js → 24, and it names neither calamityKernel,
      envoyErrandVocabulary nor bandFamilies ⇒ the barrel is NOT a register a new leaf must join
```

### §16.5 · Version 2's `requiredSymbols` — all EIGHTEEN verbatim, and the row the simulation cut

```
$ grep -cF -- "<symbol>" "<path>"      (at ad7ddf2c9)
1  export function ruinInstitution                     src/domain/worldPulse/calamityKernel.js
1  export function forceCalamityStrike                 src/domain/worldPulse/calamityKernel.js
1  export function strikeCapForTier                    src/domain/worldPulse/calamityKernel.js
1  worldPulseFate: 'demoted_by_disaster'               src/domain/worldPulse/calamityKernel.js
1  function closureFateForInstitution                  src/domain/worldPulse/institutionLifecycle.js
1  const LIFECYCLE_CLOSE_FATES                         src/domain/worldPulse/institutionLifecycle.js
1  function demotionFateForInstitution                 src/domain/worldPulse/tierOutcomeApply.js
1  export function magicClosureFate                    src/domain/worldPulse/magicRegimeLifecycle.js
1  const fate = best.martial ? 'disbanded' : 'abolished';  src/domain/worldPulse/moralInstitutionPressure.js
1  worldPulseFate: 'abandoned_with_the_settlement'     src/domain/worldPulse/settlementLifecycleFirstClass.js
1  worldPulseFate: 'upgraded_by_reconstruction'        src/domain/worldPulse/upswingKernel.js
1  worldPulseFate: 'founded_by_flourishing'            src/domain/worldPulse/upswingKernel.js
1  const NONSTANDING_STATUS                            src/domain/worldPulse/causeLifecycle.js
1  function institutionLastLifecycle                   src/domain/provenance/rosterProvenance.js
1  const ARGUED_UNLAYERED = Object.freeze({            tests/lint/couplingInclusion.walker.test.js
1  const ARGUED_ROSTER_CEILING                         tests/lint/couplingInclusion.walker.test.js
1  export const ENFORCER_DIRS                          tests/lint/mutationCoverage.shared.mjs
1  const SCAN_ROOTS                                    tests/lint/chooserTotality.walker.test.js
                                        ⇒ rows: 18   rows NOT exactly 1: 0
```

⭐ **THE POST-EDIT SIMULATION CUT A ROW BEFORE IT WAS WRITTEN.** `const ARGUED_ROSTER_CEILING = 28`
also resolves once — but **row 5 RE-SPELLS that line (28 → 29)** and `requiredSymbols` is asserted
verbatim at every status, so `check:packet`'s first step would red the moment the cure was made
(the EM-P3 lesson; the row the chair cut from EM-B1d version 5). It is **not** a `retiredSymbols`
row either — the symbol survives, only its value changes. The stable prefix
`const ARGUED_ROSTER_CEILING` is named instead and is proved present once above.

```
$ node -e "<§7 table vs JSON changeManifest>"
SET-EQUAL both directions: true    onlyMd: []   onlyJson: []    (5 = 5)
rows with an action outside PACKET_ACTIONS: 0
requiredSymbols: 18 | acceptanceCases: 7 (<=8) | checks: 11 | one test directory per array — OK

$ ls / git ls-files --error-unmatch
src/domain/worldPulse/worldPulseFates.js          disk:ABSENT  git:UNTRACKED
tests/lint/worldPulseFateTotality.walker.test.js  disk:ABSENT  git:UNTRACKED
```

---

## §17 · Closing state

```
$ git -C $SP/read-tip-ad7ddf2c9 rev-parse --short HEAD   → ad7ddf2c9
$ git -C $SP/read-tip-ad7ddf2c9 status --short           → (empty)
```

⇒ **The read tree is unchanged.** Nothing was edited, staged or committed anywhere. All scratch
artefacts live under `$SP/lane-em-compile-EM-B1h-scratch/`
(`scan-fates.mjs`, `scan-values.mjs`, `scan-bundles.mjs`, `scan-homonyms.mjs`, `scan-flagged.mjs`,
`price-vocab.js`, `price-guard.js` and the two minified outputs).
