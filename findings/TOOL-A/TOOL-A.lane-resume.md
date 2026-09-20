# TOOL-A — LANE RESUME NOTE (paused at the gate, and paused for the chair's ruling)

Lane `TOOL-A`. Worktree `$SP/lane-tool-a`, branch `tooling-a-2026-09-19`, base `58fcfe614`.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

---

## ⛔ THE CHAIR'S RULING IS NEEDED BEFORE THE BATCH CAN GO GREEN

The arm is BUILT and PROVEN red-first. It reds on exactly ONE packet in the estate: **`EM-B1d`,
the only non-terminal packet**, for three independent and genuine divergences between its §7
table and its JSON manifest. Full evidence: `TOOL-A.evidence.md` §1.4-1.5.

```
$ node scripts/implementation-packets.mjs validate          # WITH the arm, at 58fcfe614
EM-B1d disagrees with itself on the action for supabase/functions/_shared/aiCharterBundle.js: change-manifest table says REGENERATE, JSON changeManifest says MODIFY.
EM-B1d disagrees with itself on the action for supabase/functions/_shared/aiOutputSchemaBundle.js: change-manifest table says REGENERATE, JSON changeManifest says MODIFY.
EM-B1d names aiCharterBundle.meta.json in its change-manifest table (line 512) but its JSON changeManifest does not. …
EM-B1d names aiOutputSchemaBundle.meta.json in its change-manifest table (line 513) but its JSON changeManifest does not. …
EM-B1d names supabase/functions/_shared/aiCharterBundle.meta.json in its JSON changeManifest but its change-manifest table does not. …
EM-B1d names supabase/functions/_shared/aiOutputSchemaBundle.meta.json in its JSON changeManifest but its change-manifest table does not. …
EM-B1d names tests/lint/.lighting-census-baseline.json in its change-manifest table (line 514) but its JSON changeManifest does not. …
EM-B1d.packetPath change-manifest row at line 512 declares an action outside the vocabulary: REGENERATE. …
EM-B1d.packetPath change-manifest row at line 513 declares an action outside the vocabulary: REGENERATE. …
exit=1
```
⛔ **This blocks the slot**: `validate:packets` is step 3 of `npm run check`, the first step of
`check:packet`'s sealed plan, and a precondition of `implementation:dispatch`.

**The lane recommends disposition (i): the chair fixes `EM-B1d`'s §7 table** — drop the
deferred `tests/lint/.lighting-census-baseline.json` row (`EM-PREAMBLE.md` §P2 row 1 already
forbids the edit that row schedules), give each `.meta.json` its own row spelled
repository-relatively, and change the two `REGENERATE` words to `MODIFY`. Alternatives (a dated
waiver row; landing the arm after `EM-B1d` flips to LANDED) are priced in the evidence file.
⚠ **`EM-B1d` is READY, so its bytes are sealed into any live dispatch: this is a re-placement,
not a quiet edit.** The lane did not touch the packet.

Two assertions in the suite carry this: `tests/scripts/implementationPackets.test.js`'s live-manifest
row (`expect(validatePacketManifest(live, {})).toEqual({ ok: true, errors: [] })`) and any
`validate:packets` invocation. Both go green the moment the chair's disposition lands.

---

## WHAT IS ALREADY DONE (ungated, executed)

- **The hole, executed at the base.** `node scripts/implementation-packets.mjs validate` on the
  PRE-ARM tree printed `valid: 188 packets (1 READY)`, exit 0, while `EM-B1d` diverged.
- **The estate measured.** 188 packets (185 LANDED · 2 SUPERSEDED · 1 READY); 121 carry a
  parseable change-manifest table (81 agree, 40 disagree), 67 carry none — all terminal.
- **RED-FIRST, executed** with `node $SP/lane-tool-a-scratch/redfirst.mjs`, which runs the same
  13 fixture scenarios against HEAD's validator (extracted to
  `$SP/lane-tool-a-scratch/implementation-packets.PREARM.mjs`, sha256
  `59a995f605b9d15fd6605e006ef37cde7f8d57633d5b4c3580e707a56e9780c5`) and against the cured one:
  **PRE-ARM 5 passed / 8 FAILED; CURED 13 passed / 0 failed.**
- **Goldens identical** before the first edit and after the last:
  `7177cd6e…8f1e` generator-golden-master.json · `921c51cf…4b41` dossier-prose-manifest-golden.json.
- **TOOL-2 round 1 measured and proposed** — `TOOL-A.tool2-proposal.md`; **round 2 (the chair's
  three conditions) measured and BUILT** — see the TOOL-2 section at the foot of this note.

## FILES STAGED (`git add <explicit paths>`; nothing else in the tree)

```
TOOL-1
M  docs/implementation/PACKET_STANDARD.md        +14   the agreement law, in "Change manifest"
M  docs/implementation/PACKET_TEMPLATE.md        +6    the same law where an author copies it
M  scripts/implementation-packets.mjs           +258   the arm + 3 exported pure readers
M  tests/scripts/implementationPackets.test.js  +212   1 new `it`, 13 arms; fixture republishing
M  tests/scripts/implementationSession.test.js   +12   its READY fixture packet gains its §7 table
TOOL-2
A  scripts/dist-gate-honesty.mjs               +161   the SIDE-EFFECT-FREE leaf the build imports
A  tests/setup/distGateHonesty.js              +100   the worker side: live read, and the refusal
M  tests/lint/testRatchet.test.js              +175   three tests plus the live-reader pin
M  vite.config.js                               +23   imports the LEAF; setupFiles entry; env key
```
⛔ **The two commits are separate.** TOOL-1 is the five files above it; TOOL-2 is the three
below. Stage each commit's paths explicitly; never `git add -A`.

---

## THE GATED BATCH — run in this order, ONE TEST DIRECTORY PER INVOCATION

Prefix every vitest command exactly as written; ⛔ never drop the two exports.

```sh
cd "$SP/lane-tool-a"

# 1 · the validator's own suite plus every sibling that imports it
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/scripts/implementationPackets.test.js tests/scripts/implementationGate.test.js \
  tests/scripts/implementationSession.test.js tests/scripts/baseStateCapsule.test.js

# 2 · the standing instruments that live under tests/lint/
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/mutationCoverageManifest.test.js

# 3 · the standing instrument under tests/copy/
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/copy/voiceMechanics.test.js

# 4 · scoped eslint on every touched CODE file (docs are not linted)
npx eslint scripts/implementation-packets.mjs tests/scripts/implementationPackets.test.js \
  tests/scripts/implementationSession.test.js

# 5 · the lighting census walker, ONCE, SEPARATELY — ⛔ EXPECTED RED, NEVER REFREEZE
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js

# 6 · (superseded) TOOL-2's round-1 observation run is now step 8 below, which proves the
#     same hazard AND the cure in one command. Do not run it twice.
```

⛔ A gate line with no printed test count DID NOT RUN. Quote every count line.

**Neither typecheck is in this batch, and that is measured, not assumed.** `tsconfig.full.json`
includes only `src/{kernel,domain,store,lib,hooks,generators,pdf,foundry}` and EXCLUDES `tests`;
`typecheck:domain:strict` is domain-only. No file this lane touched is inside either resolved
set, so neither ratchet's count can move.

## EXPECTED RESULTS, PREDICTED BEFORE THE RUN

| step | prediction |
|---|---|
| 1 | GREEN **once the chair disposes of `EM-B1d`**; until then exactly ONE failing assertion — the live-manifest row in `implementationPackets.test.js` — with the nine `EM-B1d` errors quoted |
| 2 | GREEN |
| 3 | GREEN (this lane touched no `src/` string literal) |
| 4 | clean (`scripts/**` and `tests/**` carry no `max-lines` rule — confirmed in `eslint.config.js`; `scripts/.size-baseline.json` has no entry for this file) |
| 5′ | ⚠ step 5 now also collects TOOL-2's two new titles, so the predicted delta below is the COMBINED one |
| 5 | ⛔ **EXPECTED RED.** Live tuple at the tip `files 2646 · parked 383 · credited 2263 · titles 25005 · suiteTitles 6671` (`tests/lint/.lighting-census-baseline.json`, `measuredBy: EM-P0`). **THIS LANE'S COMBINED DELTA (TOOL-1 + TOOL-2): `files +0 · parked +0 · credited +0 · titles +4 · suiteTitles +0`** — one new `it` in tests/scripts/implementationPackets.test.js plus three new `test()` titles in tests/lint/testRatchet.test.js; no new *.test.js file, no new suite (tests/setup/*.js is invisible to the census). Predicted red: `titles` expected 25009 to be 25005. ⛔ NEVER refreeze; record the measured tuple and this delta |
| 6 | the file reports as skipped and the process exits 0 — the TOOL-2 hazard, observed |

## AFTER THE BATCH

1. Re-verify the goldens are byte-identical to the two hashes above.
2. Commit on `tooling-a-2026-09-19` by explicit pathspec, subject:
   `TOOL-1: validate:packets compares a non-terminal packet's §7 table with its JSON change manifest — 121 packets parsed, 0 red at the base`
   ⚠ **the "0 red at the base" clause is only true after the chair's `EM-B1d` disposition.** If
   the chair rules a waiver instead, the subject says so and the waiver row is added first.
3. TOOL-2 stays unbuilt until the chair rules on Shape B vs Shape A.

---
# TOOL-2 — BUILT, SPLIT per the chair's production-safety ruling, and ready for the gate

## THE SPLIT, AND WHY IT IS A DEPLOY MATTER

`vite.config.js` previously imported `tests/setup/distGateHonesty.js`, the very module whose top
level carries the refusal. Every `vite build`, which is every production deploy, evaluates that
import while constructing the config. The throw was unreachable there only because
`globalThis.__vitest_worker__` is undefined in the main process, which is one vitest internal
away from a deploy that dies inside its own config. Split as ruled:

| file | role | top level |
|---|---|---|
| `scripts/dist-gate-honesty.mjs` (**NEW**) | the leaf: `shouldRefuseDistGatedFile`, `distGateRefusalMessage`, `distGateFocusedRun`, `tokenNamesDistCorpus`, `distGatedCorpus`, `DIST_GATED_TREE`, `DIST_GATED_DIR` | **declarations and exports only** |
| `tests/setup/distGateHonesty.js` | the worker side: imports the leaf, reads the live state, throws | the refusal |
| `vite.config.js` | imports **only the leaf**; still names the setup module as a `setupFiles` STRING, which vitest loads at test time | none |

**`scripts/` rather than `tests/`, and the reason is measurable:** `vercel.json`'s
`ignoreCommand` runs `node scripts/vercel-ignore-build.mjs`, so `scripts/` is provably present at
deploy time while nothing proves `tests/` is. **No measured reason `scripts/` is wrong was
found** (§ register deltas below).

## PROVED, NOT TRUSTED — three executed checks, quoted

```
$ node --input-type=module -e "globalThis.__vitest_worker__ = { filepath: '<abs>/tests/build/firstPaintNonJs.test.js' };
    process.env.DIST_GATE_FOCUSED='1'; delete process.env.VERIFY_DIST; delete process.env.DIST_GATE_ALLOW_SKIP;
    const m = await import('./scripts/dist-gate-honesty.mjs'); ..."
{"imported":true,"refuse":true}
  exit=0
```
The leaf imports cleanly under the EXACT state that makes its own decision return `true`. Both
halves in one process, so the planted state cannot be doing nothing.

```
$ node --input-type=module -e "<the identical preamble>; await import('./tests/setup/distGateHonesty.js');"
Error: tests/build/firstPaintNonJs.test.js is a post-build contract and dist/ is absent, so its
gated suites would skip and this run would exit zero with nothing proved. Three exits: run `npm
run build` and re-run this command, or run `npm run verify:dist` for the strict post-build
corpus, or set `DIST_GATE_ALLOW_SKIP=1` to skip these suites knowingly.
```

```
$ node --input-type=module -e "const c=await import('./vite.config.js');
    const cfg=c.default({mode:'production',command:'build'}); ..."
LOADED. setupFiles: ["./tests/setup/fastCheckSeed.js","./tests/setup/distGateHonesty.js"]
test.env: {"DIST_GATE_FOCUSED":""}
  exit=0
```
**All three are re-asserted inside the suite** by the new test
`the leaf the build config imports is inert, and only the setup module throws`, which spawns a
real child process for each half and then pins that `vite.config.js` IMPORTS the leaf and never
the throwing module (the assertion is on import statements only, because the `setupFiles` string
entry is correct and required).

## THE TOKEN TABLE — 17 rows, executed in plain node, the four `--dir` rows added

```
  inert  npm test                                   ARM   a lane, by path
  inert  npm run test:watch                         ARM   the brief's lane idiom
  inert  npm run test:coverage                      ARM   verify:dist (then passes on VERIFY_DIST)
  inert  test:coverage:floors / CI coverage-floors  ARM   a lane, by name filter
  inert  the ratchet SOURCE phase (a NEGATIVE       ARM   --dir tests/build      (SPACE form)
         filter: --exclude=tests/build/**)          ARM   --dir=tests/build      (EQUALS form)
  inert  a space-separated flag value (--pool       ARM   --dir=tests/build/     (trailing separator)
         threads)                                   ARM   --dir=./tests/build    (dot prefix)
  inert  --reporter verbose
  inert  a non-corpus directory (tests/)
  inert  another suite entirely
                                                    ALL 17 PASS
```
A run scoped to the corpus by flag has NAMED it as surely as by positional, so both `--dir`
spellings arm. ⛔ A NEGATIVE filter names the corpus only to REMOVE it: the leaf reads the value
of `--dir` and of no other flag, so the ratchet's `--exclude=tests/build/**` stays inert, which
matters because that spelling rides every `npm run check`.

## RED-FIRST, executed

`git show HEAD:scripts/dist-gate-honesty.mjs` → `fatal: path … exists on disk, but not in
'HEAD'`, and `tests/lint/testRatchet.test.js` imports that leaf at its top, so before the cure
the whole file fails to collect. Cured truth table **15 of 15**; token table **17 of 17**.

## FILES STAGED FOR TOOL-2

```
A  scripts/dist-gate-honesty.mjs   +161  the side-effect-free leaf the build config imports
A  tests/setup/distGateHonesty.js  +100  the worker side: live read, and the refusal
M  tests/lint/testRatchet.test.js  +175  three tests: the refusal truth table, the token table,
                                         the inert-leaf proof; plus the live-reader pin
M  vite.config.js                   +23  one import of the LEAF, one setupFiles entry, one env key
```

## TOOL-2's GATED BATCH — run AFTER TOOL-1's steps 1-5

```sh
cd "$SP/lane-tool-a"

# 7 · the guard's own tests
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/testRatchet.test.js

# 8 · ⭐ THE SWEEP PROOF, and it is cheap. `vitest list` COLLECTS by running each test
#     module (vitest 4.1.8: `list` calls ctx.collect() unless --filesOnly, and --staticParse
#     defaults FALSE — "Parse files statically instead of running them to collect tests
#     (default: false)"), so it evaluates exactly the module top level where the refusal
#     lives. UNFILTERED, with no dist/ in this worktree.
#     EXPECTED: exit 0, tests/build/ files present in the listing, NO refusal anywhere.
#     That is the five unfiltered sweeps' collection path, end to end, for the price of a
#     collection instead of a 40-minute suite.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest list

# 9 · ⭐ THE FOCUSED REFUSAL — EXPECTED: a hard RED whose message names the file and the three
#     exits. Quote it. This is the only step in TOOL-2's batch allowed to be red.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/build/firstPaintNonJs.test.js

# 10 · ⭐ THE NAMED OPT-OUT — EXPECTED: the old behaviour, a skip, exit 0. Quote the count line.
DIST_GATE_ALLOW_SKIP=1 GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/build/firstPaintNonJs.test.js

# 11 · ⭐ SCOPED BY FLAG — EXPECTED: refusal, exactly as step 9. A lane that scopes by --dir
#      has named the corpus.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --dir tests/build

# 12 · the anti-regression sweep of a NON-build directory, which also proves the config
#      change did not disturb ordinary collection
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/scripts/

# 13 · scoped eslint on the four TOOL-2 files
npx eslint scripts/dist-gate-honesty.mjs tests/setup/distGateHonesty.js \
  tests/lint/testRatchet.test.js vite.config.js
```

⚠ **If step 8 turns out NOT to evaluate module top levels** (the listing prints and no refusal
appears even when step 9 reds), say so and fall back to the next-cheapest real proof:
`npx vitest run --dir tests/domain` with no `dist/`, which is a filtered run that does NOT name
the corpus and must therefore stay inert while collecting hundreds of files. That is weaker
evidence about the sweeps and must be labelled so.

## TOOL-2 REGISTERS, AS DELTAS — including the new `scripts/` file

Lighting census `files +0 · parked +0 · credited +0 · titles +3 · suiteTitles +0` (three new
literal `test()` titles in an existing `describe`; neither `scripts/*.mjs` nor `tests/setup/*.js`
is visible to a census that filters `*.test.js`). **TOOL-1 and TOOL-2 together: `titles +4`.**

**The new `scripts/` file, answered item by item as the chair asked:**
- **A scripts census?** None. No test enumerates or counts `scripts/`; every walker that
  mentions the directory either builds its own temp root (`governedArtifactIo`) or scans `src/`.
- **A size baseline?** No entry, and none owed: `scripts/.size-baseline.json` has zero
  `scripts/` keys, and no `max-lines` rule covers `scripts/**` (the four layer rules are
  `src/components/**/*.jsx`, `src/generators/**/*.js`, `src/domain/**/*.js`, `src/*.jsx`).
- **`.mjs` or `.js`?** `.mjs` is the idiom by a wide margin: 86 of the 92 JavaScript files at the
  top of `scripts/` are `.mjs`, and the eslint block covering `scripts/**/*.{js,mjs,cjs}` gives
  node globals and `no-unused-vars` as a warning, with no size rule.
- **`@enforced-by`?** Carried, matching `implementation-gate.mjs` and `check-test-ratchet.mjs`.
  `tests/docs/enforcedByExists.test.js` walks `scripts/` and asserts each named target EXISTS;
  ours names `tests/lint/testRatchet.test.js`, which does. Its two counts are FLOORS
  (`>= 30` and `>= 40`), so one more tag moves nothing.
- Mutation-coverage manifest: **no row owed** (no new `*.test.js`; `tests/setup` and `scripts`
  are not ENFORCER_DIRS). Typecheck ratchets: unmoved (`tsconfig.full.json` excludes `tests` and
  includes only `src/` subsets). Goldens: unmoved.

## TOOL-2 RESIDUALS, NAMED NOT HIDDEN

- **The `tests/` import risk is GONE:** `vite.config.js` now depends on `scripts/`, which
  `vercel.json` provably ships. Re-verified after the split by loading the config under
  `command: 'build'` in plain node (quoted above).
- **Two files define "dist exists" as `dist/index.html` + `dist/assets`**
  (`campaignRuntimeLazy`, `envoyPersistenceHydrationLazy`) rather than the majority `dist/` +
  `dist/assets` the guard uses. A tree with `assets` but no `index.html` would pass the guard
  while those two still skip. Narrow, and the strict phase still owns them.
- **A name filter shorter than four characters leaves the guard inert** (`npx vitest run map`).
- **`check:packet` executes a packet's own `checks` argv**, so a packet naming a `tests/build/`
  file would refuse; **zero placed packets do today** (measured over `PACKET_MANIFEST.json`).
  The cure there is packet bytes, which are the chair's.
- **The vacuity risk is CLOSED:** the guard reads `globalThis.__vitest_worker__.filepath`, and
  the suite asserts the live reader sees its own path while running under vitest. If vitest
  moves that state, that assertion reds instead of the guard dying quietly.

## SCRATCH ARTEFACTS (all under `$SP/lane-tool-a-scratch/`, none in the repo)

`TOOL-A.evidence.md` · `TOOL-A.tool2-proposal.md` · `TOOL-A.lane-resume.md` ·
`measure-tables.mjs` · `measure-compare.mjs` · `measure-dist.mjs` · `measure-dist2.mjs` ·
`redfirst.mjs` · `redfirst-tool2.mjs` · `TOOL-A.tool2-section.md` · `implementation-packets.PREARM.mjs`
