# TOOL-A — evidence, measured BEFORE the first edit

Lane `TOOL-A`, worktree `$SP/lane-tool-a`, branch `tooling-a-2026-09-19`, base `58fcfe614`
(confirmed: `git branch --show-current` → `tooling-a-2026-09-19`; `git log -1 --oneline` →
`58fcfe614 PACKETS: EM-B1d placed and READY at 32f1ba048 …`; `git status --short` → empty).
Measured 2026-09-19 (`date` → `Sat Sep 19 17:20:05 EDT 2026`).

Goldens before the first edit:
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

---

## TOOL-1 · THE HOLE IS REAL — EXECUTED

```
$ node scripts/implementation-packets.mjs validate
[implementation-packets] valid: 188 packets (1 READY)
exit=0
```
**CONFIRMED.** The validator passes at `58fcfe614` although the estate's ONE non-terminal
packet's Markdown change-manifest table and its JSON `changeManifest` disagree in three
independent ways (§1.4 below). Nothing in `implementation-packets.mjs`,
`implementation-gate.mjs` or `implementation-session.mjs` reads the Markdown table:
all three read only `packet.changeManifest`. Read whole; the only Markdown any of them
parses is `parsePacketHeader` (heading, `Status:`, `Verified base:`) and
`parseIndexPacketStatuses` (INDEX.md rows). **CONFIRMED by reading all three files whole.**

### 1.1 · Estate denominator

| Figure | Count |
|---|---:|
| `.md` files under `docs/implementation/packets/` | 190 |
| packets in `PACKET_MANIFEST.json` | 188 |
| LANDED | 185 |
| SUPERSEDED | 2 |
| READY | 1 (`EM-B1d`) |
| DRAFT / STALE / BLOCKED | 0 |

**Non-terminal population at this base is ONE packet: `EM-B1d`.** (`TERMINAL_PACKET_STATUSES`
= `{LANDED, SUPERSEDED}`, `implementation-packets.mjs:43`.)

### 1.2 · How many packets carry a table the arm can PARSE

Discovery is by COLUMN SIGNATURE, not by heading: "§7" is a label, not a number. Measured
headings that hold a change manifest include `## 7. Exact change manifest` (42), `## §4 Change
manifest` (8), `## §6 · EXACT CHANGE MANIFEST` (6), `## 8. Exact change manifest` (4),
`## 6. Exact FOURTEEN-path implementation manifest …`, `## 11. Exact change manifest`,
`## 3. Exact change manifest and budgets` — **40+ distinct spellings**, and six packets put an
unrelated section at `## 7.` (`Ordered coding sequence`, `Checks`, `Acceptance matrix`, …).
Heading-matching is therefore refused as the discovery rule.

A table counts as a change-manifest table when its header row carries a cell matching
`action` AND a cell matching `file|path|target`.

| Status | packets | 0 candidate tables | exactly 1 | more than 1 |
|---|---:|---:|---:|---:|
| LANDED | 185 | 66 | 116 | 3 |
| SUPERSEDED | 2 | 1 | 1 | 0 |
| READY | 1 | 0 | 1 | 0 |

**121 of 188 packets (64%) carry at least one parseable table; 67 carry none — every one of
them TERMINAL and therefore exempt.** Against the JSON, of the 121: **81 AGREE exactly, 40
DISAGREE** (39 terminal + `EM-B1d`).

All 3 multi-candidate packets (`GTR-1`, `H26`, `AO-0`) split one change manifest across two
tables, and in all three the UNION's row count equals the JSON row count exactly — so the arm
takes the union of every candidate table, which is the measured-correct behaviour.

### 1.3 · Table shapes that exist (the parser must survive all of these)

- **Column order varies.** 41 distinct header signatures. Most common `Action | File |
  Symbol/region | Maximum delta | Coding instruction` (20). Also `# | action | path` (11),
  `Action | Path | Region / symbol | Effective-line delta | Instruction` (7),
  `Commit | Action | Path | …` (1), and **three with the columns reversed**:
  `path | action | effective`, `action | path | committed-blob sha256 | effective`,
  `file | action | sha256 of the COMMITTED blob | effective lines`. ⇒ columns are located
  by NAME, never by position.
- **A leading `#` ordinal column** in 39 signatures.
- **Case varies**: `Action` / `action`, `File` / `file` / `Path` / `path`.
- **Backticked paths** are the norm; the Action cell is usually backticked too, sometimes with
  a decoration in front (`⭐ \`TEST\``) or bold (`**MODIFY**`).
- **A row spanning several paths** — `EM-B1d` §7 row 8:
  `` `supabase/functions/_shared/aiCharterBundle.js` + `aiCharterBundle.meta.json` ``. The
  second token is a BARE BASENAME, not repository-relative.
- **A struck-through dropped row** — `EM-P3` §7 row 6:
  `~~\`MODIFY\` the wizard's option list~~ | — | — | **ROW DROPPED — MEASURED, NOT ASSUMED.**`
  Its File cell is an em dash, so it contributes no path. Benign under the arm.
- **Generated artifacts in PROSE instead of rows** — `EM-B1d` after its table:
  "**Generated artifacts:** ⛔ **FOUR — the two edge-shared bundles and their two sidecar
  metas**". The JSON names all four; the table names two-and-a-half.
- **Action words used in table cells across the whole estate:** `MODIFY`, `CREATE`, `TEST`,
  `DOC`, `REGISTER` — all five in `PACKET_ACTIONS` — **plus `REGENERATE`, which occurs in
  exactly ONE packet, `EM-B1d`, and is NOT in the validator's vocabulary.**

### 1.4 · ⛔ THE FINDING — `EM-B1d` (READY) would RED under the arm, for three independent reasons

This is reported, not repaired: the launch forbids editing the packet, and a READY packet's
content is the chair's.

`EM-B1d` §7 table (`docs/implementation/packets/settlement-editor/EM-B1d.md:503-514`) has 10
rows; its JSON `changeManifest` has 11.

**(a) One path in the Markdown that the JSON does not name.**
Markdown row 10: `` | `TEST` | `tests/lint/.lighting-census-baseline.json` | the tuple | `n/a` |
⛔ **DEFERRED TO THE TERMINAL — no edit** … `` and the note below the table says
"`EM-B1d.manifest.json` **omits** the path". This is DELIBERATE and law-backed:
`EM-PREAMBLE.md` §P2 row 1 — "the census is re-derived whole once, at the train's terminal —
BY THE CHAIR, NEVER INSIDE THE PACKET … a packet's §8 never schedules a refreeze and its §7
never lists the baseline as a generated artifact." ⇒ the LAW says the packet must not edit it;
the PACKET nonetheless carries it as a `TEST` row in §7. **The row and the law disagree, not
the row and the implementer.** Only 4 packets name this file at all, and **zero** JSON
`changeManifest` rows in the entire estate name it.

**(b) Two paths in the JSON that the Markdown does not name repository-relatively.**
`supabase/functions/_shared/aiCharterBundle.meta.json` and
`…/aiOutputSchemaBundle.meta.json` appear in the Markdown only as bare basenames appended
with `+` inside another row's File cell. Resolving a bare basename against its neighbour's
directory is INFERENCE, and inference is how the hole re-opens — so the arm reds and names
the row rather than guessing.

**(c) Two action disagreements.** Markdown says `REGENERATE` for
`supabase/functions/_shared/aiCharterBundle.js` and `…/aiOutputSchemaBundle.js`; the JSON says
`MODIFY`. `REGENERATE` is not one of `PACKET_ACTIONS`
(`CREATE, DOC, MODIFY, REGISTER, TEST`, `implementation-packets.mjs:30-36`) and occurs nowhere
else in the estate.

**Consequence.** The arm cannot ship GREEN at this base. It reds `validate:packets`, which is
step 3 of `npm run check`, the first step of `check:packet`'s sealed plan, and a precondition
of `implementation:dispatch` — **so composing this arm while `EM-B1d` stands as written would
block the slot that is building `EM-B1d`.** The chair rules the disposition (§1.5).

### 1.5 · The chair's fork, priced

| Disposition | Cost | Consequence |
|---|---|---|
| **(i) Fix `EM-B1d`'s §7 table** — drop the deferred census row (the preamble already forbids the edit it schedules), spell both `.meta.json` paths repository-relatively as their own rows, and change `REGENERATE` → `MODIFY` in the two bundle rows | one packet-Markdown edit by the chair; `EM-B1d` is READY, so its bytes are sealed into any live dispatch — **re-placement, not a quiet edit** | arm ships with no waiver machinery; 0 red at the base |
| **(ii) A dated waiver row** naming `EM-B1d` | a frozen roster in the validator | ⛔ the validator's own `COUPLING_REGISTRATION_LEGACY` comment (`:63-79`) says "An id may NEVER be added here to make a packet pass; adding is the one motion that arm exists to forbid" — a waiver here is exactly that motion, on the one packet the arm was built for |
| **(iii) Land the arm behind the train** — compose after `EM-B1d` flips to LANDED (terminal ⇒ exempt) | zero packet edits | the hole stays open across `EM-B1d`'s whole build, which is the window it was found in |

**The lane's recommendation is (i)**, and the lane does not act on it: a READY packet's content
and status are the chair's.

### 1.6 · Judgment calls inside the arm's shape (vetoable)

- **JUDGMENT: non-terminal = `!TERMINAL_PACKET_STATUSES.has(status)`, which includes `BLOCKED`,
  over the launch's literal list of `DRAFT`/`READY`/`STALE`.** Reason: the launch's own
  parenthetical points at the existing constant, and this is the exact predicate
  `reservesChangePaths` (`:676`) already uses — a packet that reserves change paths owes an
  honest table. `BLOCKED` is vacuous today (zero such packets), so the choice costs nothing now
  and fails LOUD later rather than silently. Reverse by naming the three statuses explicitly.
- **JUDGMENT: discovery by column signature, over discovery by heading.** Alternative rejected:
  a heading alternation — 40+ measured spellings, and six packets put a different section at
  `## 7.`, so heading-matching would both miss tables and hit wrong ones.
- **JUDGMENT: the union of every candidate table**, over "the first one". Measured on the three
  multi-table packets, where the union's row count equals the JSON's exactly.
- **JUDGMENT: an out-of-vocabulary action word is a RED, not a silent map to `MODIFY`.** The
  chair ruled "use the validator's own vocabulary"; `REGENERATE` occurs once, in the one packet
  the arm convicts, so mapping it would launder the exact finding the arm exists to surface.

---

## TOOL-2 · the dist-gated silent skip — MEASURE AND PROPOSE

(See `TOOL-A.tool2-proposal.md` for the proposal and the per-file gate measurement.)

---

# TOOL-2, ROUND 2 — the chair's conditions 2 and 3, executed BEFORE the edit

## ⛔⛔ TWO FINDINGS, BOTH REFUTING SHAPE B AS SPECIFIED

### FINDING A — `beforeAll` from a setup module DOES NOT RUN for a fully-skipped file

The chair's exact suspicion, and it is REAL. **CONFIRMED by reading the installed
`@vitest/runner@4.1.8` source**, `node_modules/@vitest/runner/dist/chunk-artifact.js`:

`interpretTaskModes`, lines 982-986 — applied to every suite INCLUDING the file suite
(`traverseSuite(file, parentIsOnly, false)`, line 989):
```js
// if all subtasks are skipped, mark as skip
if (suite.mode === "run" || suite.mode === "queued") {
  if (suite.tasks.length && suite.tasks.every((i) => i.mode !== "run" && i.mode !== "queued")) {
    suite.mode = "skip";
  }
}
```
`runSuite`, lines 3121-3135:
```js
if (suite.mode === "skip") {
  suite.result.state = "skip";
  updateTask("suite-finished", suite, runner);
} else {
  ...
  beforeAllCleanups = await $("suite.beforeAll", () => callSuiteHook(suite, suite, "beforeAll", runner, [suite]));
```

⇒ A `beforeAll` registered from `setupFiles` attaches to the FILE suite. When every
`describe` in the file is `describe.runIf(false)`, the file suite's own mode flips to
`"skip"` and **`beforeAll` is never called**. **Shape B's hook would work on the files that
need it least (mixed files such as `engineChunkLazy.test.js`, 15 tests / 7 gated) and fail
exactly on its worst case — `tests/build/firstPaintNonJs.test.js`, 8 of 8 gated, and on
`interiorLazy.test.js` (1 of 1), `pendingEditProseLazy.test.js` (2 of 2),
`factionRenameDoorLazy.test.js` (3 of 3), `townMapLazy.test.js` (3 of 3),
`versionDiffLazy.test.js` (3 of 3).**

**THE CURE: throw at the setup module's TOP LEVEL**, which executes per test file during
collection, before mode interpretation, so a fully-skipped file cannot dodge it. The module
reads `expect.getState().testPath`, which is a live getter over the worker's `filepath`
(`node_modules/vitest/dist/chunks/test.DNmyFkvJ.js:4113`), so it is correct at that moment.

### FINDING B — THE ENTRY-POINT CENSUS FINDS FOUR FOURTH-CLASS MEMBERS, AND ONE OF THEM GATES THE PRODUCTION DEPLOY

The partition claimed in the round-1 proposal — "any process that collects a `tests/build/**`
file is either `verify:dist` or a focused run" — **is FALSE.** It held for `npm run check` and
for the CI `check` jobs, and I generalized it without enumerating the rest. The census:

| # | Entry point | What actually runs | Collects `tests/build/**`? | Class |
|---|---|---|---|---|
| 1 | `npm test` | `gate-mutex --run -- npx vitest run` | **YES, whole suite** | ⛔ **FOURTH** |
| 2 | `npm run test:watch` | `gate-mutex --run -- npx vitest` | **YES** | ⛔ **FOURTH** |
| 3 | `npm run test:coverage` | `… npx vitest run --coverage` | **YES** | ⛔ **FOURTH** |
| 4 | `npm run test:coverage:floors` | `… npx vitest run --coverage --coverage.include=…` | **YES** | ⛔ **FOURTH** |
| 5 | `npm run test:ratchet` (`check` step 15; CI `check-tests` ci.yml:126) | `check-test-ratchet.mjs` → `npx vitest run --exclude="tests/build/**"` (`:137`, `:194-198`), and `:1020-1029` FAILS the ratchet if any build file leaks into the source report | NO | EXCLUDES |
| 6 | `npm run test:ratchet:update` | same runner as 5 | NO | EXCLUDES |
| 7 | `npm run verify:dist` (`check` step 17; CI `check-build` ci.yml:185) | `--verify-dist` → sets `VERIFY_DIST=1` (`:961`) and runs `npx vitest run tests/build/` (`:196`); `check` step 16 built first | YES | SETS `VERIFY_DIST=1` |
| 8 | `npm run check` / `check:tail` / `check:full` / `check:diagnose` | vitest only via 5 and 7 | via 5, 7 | SAFE |
| 9 | `npm run check:quick` | `implementation-gate.mjs quick` → validate:packets, 2 typechecks, eslint | **no vitest at all** | NO VITEST |
| 10 | `npm run check:packet` / `implementation:resume` | plan = validate-packets, 2 typechecks, eslint, then **the packet's own `checks` argv** | **conditional** — a packet MAY name a `tests/build/` file in `checks` | ⚠ see note |
| 11 | `.husky/pre-commit` | `npx lint-staged` (eslint --fix) | **no vitest** | NO VITEST |
| 12 | `.husky/pre-push` | `npm run check` then `npm run check:edge-behavior` (Deno) | via 8 | SAFE |
| 13 | CI `check-build` ci.yml:177-201 | `npm run build`; `npm run verify:dist`; `VERIFY_DIST=1 npx vitest run tests/build/bootSmoke.test.js` | YES | BUILDS FIRST **and** `VERIFY_DIST=1` |
| 14 | **CI `coverage-floors` ci.yml:350-390** | checkout → fetch ledger → setup-node → `npm ci` → `npm run test:coverage:floors`. **THERE IS NO `npm run build` STEP IN THIS JOB.** | **YES, whole suite, no `dist/`** | ⛔⛔ **FOURTH — AND `scripts/vercel-ignore-build.mjs` REQUIRES THIS JOB GREEN, so redding it BLOCKS THE PRODUCTION DEPLOY** (the job's own comment, ci.yml:366-368) |
| 15 | CI `determinism-hostile-locale` ci.yml:459 | `npx vitest run` + 8 explicit files, none under `tests/build/` | NO | DOES NOT COLLECT |
| 16 | CI `e2e`, `performance` | Playwright | — | NO VITEST |
| 17 | CI `deno-tests`, `check:edge-behavior` | Deno | — | NO VITEST |
| 18 | CI `mutation-sweep` → `scripts/mutation-sweep.sh` | ~30 × `npx vitest run <one explicit file>`, **every one outside `tests/build/`** | NO | DOES NOT COLLECT |
| 19 | CI `religion-soak`, `generation-certification`, `world-soak`; `.github/workflows/soak-research.yml` | `node scripts/…` only | — | NO VITEST |
| 20 | `scripts/ratchet-inventory.sh:124` | `./node_modules/.bin/vitest run "$WALKER"` — one walker file | NO | DOES NOT COLLECT |
| 21 | `scripts/preproof-train.mjs:262,329` | writes its OWN `<member>.vitest.config.mjs` in a throwaway worktree | **does not load `vite.config.js` at all** | UNREACHED |
| 22 | ⭐ A lane's focused run (the brief's mandated idiom) | `gate-mutex --run -- npx vitest run --pool=threads --maxWorkers=2 <files>` | YES when it names one | **THE TARGET** |

**Exhaustiveness:** `grep -rnE "vitest" .github/workflows/` returns exactly two non-comment
lines (ci.yml:201 and :459); `grep -rln "vitest" scripts/` returns 22 files, each inspected
above or a comment-only mention. Rows 1-4 and 14 are the fourth class.

⚠ **Row 10 is a live trap, not a hypothetical.** `check:packet` executes the packet's own
`checks` argv verbatim (`implementation-gate.mjs:180-183`). A packet whose `checks` name a
`tests/build/` file would refuse under Shape B unless its own argv carries the opt-out — and
a packet's `checks` are packet bytes, not `package.json` bytes, so the cure there is a packet
edit, which is the chair's. No placed packet names one today (measured: zero `checks` argv in
`PACKET_MANIFEST.json` contains `tests/build/`).

## THE CURE THAT REMOVES THE WHOLE FOURTH CLASS WITH NO `package.json` BYTE

Every fourth-class member is an UNFILTERED SWEEP. Every hazardous run is a FILTERED one. That
is the real discriminator, and it is the charter's own words: *"a lane that **NAMES** a
dist-gated file in a focused run"*.

`vite.config.js` is evaluated in the MAIN vitest process, whose `process.argv` IS the command
line (`npx vitest run <filters>`; `gate-mutex.sh` execs that command, so the filters survive).
So the config can decide once per run whether the run was FILTERED, and hand the answer to the
workers through `test.env`.

⚠ **`test.env` in Vitest 4 populates `import.meta.env`, not `process.env`** — CONFIRMED:
`setupCommonEnv` → `setupEnv(config.env)` writes `state.metaEnv`
(`node_modules/vitest/dist/chunks/setup-common.DYx3LtFI.js:23-41`), and it runs before the
setup files. ⛔ The key must NOT be `VITE_*`: a `VITE_`-prefixed key is what `vite build`
inlines (the standing hazard). `DIST_GATE_FOCUSED` lives only under the `test:` key, which
`vite build` never reads.

To make a mis-parsed flag value harmless, "filtered" is not merely "has a positional token":
the token must match the actual `tests/build/` corpus, read from disk in the config. So
`--pool threads` mis-read as a positional cannot arm the guard, while `npx vitest run
townMapLazy` (a NAME filter, not a path) can.

| entry point | filtered? | result |
|---|---|---|
| rows 1-4, 14 (the whole fourth class) | no positional matches the corpus | guard INERT — behaviour byte-identical to today |
| `verify:dist` (`npx vitest run tests/build/`) | yes | `VERIFY_DIST=1` → pass |
| CI bootSmoke (`VERIFY_DIST=1 npx vitest run tests/build/bootSmoke.test.js`) | yes | `VERIFY_DIST=1` → pass |
| a lane's `npx vitest run … tests/build/firstPaintNonJs.test.js` with no `dist/` | yes | **REFUSE** |

**This is a judgment call the chair may veto.** The alternative the chair named — the opt-out
in each invocation — costs **five `package.json` bytes** (`test`, `test:watch`,
`test:coverage`, `test:coverage:floors`, and nothing for CI row 14 since it calls script 4),
i.e. **a MINT TRIGGER**, and it leaves the guard dead for anyone who types `npx vitest run`
by hand. The argv discriminator costs zero `package.json` bytes and removes the class.

⚠ **THE VACUITY RISK, NAMED:** if the `vite.config.js` line is ever dropped,
`DIST_GATE_FOCUSED` is never set and the guard silently does nothing. The anti-vacuity control
is an assertion that the config really sets it; it can only be written once the chair approves
the wiring, so it is OWED, not skipped. It is named in the resume note.

**WHAT THIS LANE BUILT, AND WHAT IT DELIBERATELY DID NOT.** The decision function and its
truth-table test are built and staged. **`vite.config.js` IS NOT TOUCHED** — that one line is
what arms the guard, and arming it is precisely the fourth-class decision the chair reserved.
The module is therefore inert in the tree until the chair rules.
