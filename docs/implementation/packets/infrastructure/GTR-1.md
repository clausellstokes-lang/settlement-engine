# Infrastructure / GTR-1 — one test phase, one artifact authority

- **Status:** READY
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `357e7778e6318895c2ecb06dd5c7caed4dfe8863`
- **Last revalidated:** 2026-08-13 at `357e7778e6318895c2ecb06dd5c7caed4dfe8863`
- **Owner authority:** universal standing authorization recorded in ledger commit
  `1ed18d27c86d2a1fb108d7b75ab82de2de00fc4d`; the measured H26 full-gate STOP.
- **Depends on:** IA-1's per-test ratchet and post-build verification topology.
- **Collision group:** `gate-integrity` — no other lane may edit the five implementation
  paths until the pair lands.
- **Commit authority:** coding edits the four handwritten paths and does not commit or
  regenerate the baseline. The coordinator alone proves and lands the 4+1 pair.
- **Behavior posture:** test/gate machinery only. Product code, simulation output,
  persistence, goldens, feature flags, tuning, and dependencies remain unchanged.
- **Census posture:** zero new test or suite titles and no new test file. GTR-1 does not
  claim the lighting-census row; H26 remains its sole holder while blocked.

## 1. Measured contradiction

H26's detached genesis was correct on its own acceptance surface, but its mandatory bare
full gate stopped at `test:ratchet` in a clean checkout. The same committed source produced
different skip counts solely from untracked build artifacts:

- with `dist/`: `tests/build/**` contributed 61 non-running rows;
- without `dist/`: the same subtree contributed 112 non-running rows;
- the difference was exactly 51 environment-only rows;
- outside `tests/build/**`, both runs had exactly one legitimate skip;
- all 16 frozen failures live outside `tests/build/**`;
- after a fresh build, the dedicated dist run passed 403/403 across 50 files with zero
  failed, skipped, pending, todo, uncollected, missing, or out-of-scope rows.

The current chain asks the source-debt ratchet to enumerate artifact-dependent contracts
before the artifact exists, then asks `verify:dist` to run those contracts again after the
build. A warmed checkout hides the defect; a clean checkout exposes it.

Rejected cures:

- raising the skip ceiling to 113 banks 51 environmental holes;
- building before the source ratchet duplicates a full build in the independent CI test
  job and leaves standalone `test:ratchet` artifact-dependent;
- subtracting build skips without strengthening the post-build phase lets a future
  `.skip` disappear;
- stubbing `dist/` cannot satisfy the real chunk, byte, route, and boot contracts.

## 2. Outcome

Give every test exactly one authoritative gate phase:

1. `test:ratchet` owns all source tests except `tests/build/**`, before the build.
2. `verify:dist` owns the exact recursively discovered `tests/build/**/*.{test,spec}`
   corpus after the build, with `VERIFY_DIST=1`.
3. The post-build mode fails on any failed, skipped, pending, todo, collapsed,
   uncollected, missing, duplicate, or out-of-scope row.
4. Raw `npm test` stays unfiltered for diagnosis and burn-down work.
5. The source baseline is mechanically regenerated against the committed code-half SHA;
   its skip ceiling shrinks to the one non-build skip and its 16 attributed failure rows
   remain byte-for-byte in substance.

## 3. Hard scope

- one infrastructure behavior family;
- exactly four handwritten implementation paths plus one generated baseline path;
- no new test title, suite title, test file, dependency, source module, product behavior,
  golden, persisted shape, feature flag, budget, timeout, or raised ceiling;
- at most eight acceptance cases;
- the package check order remains `test:ratchet → build → verify:dist`;
- CI grouping remains parallel; only its assertions are clarified.

## 4. Exact change manifest

### Code half — exactly four handwritten paths

| Action | Path | Instruction |
|---|---|---|
| MODIFY | `scripts/check-test-ratchet.mjs` | Add explicit source and strict dist modes, exact phase ownership, on-disk build-test discovery, and fail-closed result accounting. |
| MODIFY | `package.json` | Keep raw `test` unfiltered; retain source ratchet before build; route `verify:dist` through strict dist mode inside the held mutex. |
| TEST | `tests/lint/testRatchet.test.js` | Extend existing titles only: exercise both modes, phase disjointness, every dist refusal, and the exact-scope positive. |
| TEST | `tests/build/ciCheckParity.test.js` | Extend an existing title only: pin source-test ownership and build-before-dist order in local and CI topology. |

### Genesis — exactly one mechanically generated path

| Action | Path | Instruction |
|---|---|---|
| MODIFY | `scripts/.test-ratchet-baseline.json` | Run the existing remove-only update at the immutable code-half SHA in a clean detached checkout. Entries may only remain or shrink; the skip ceiling must not exceed 1. |

No other path may change.

## 5. Exact contracts

### 5.1 Source mode

- Default, `--update`, and `--bootstrap` invoke Vitest with exactly one exclusion:
  `tests/build/**`.
- The parsed report must contain zero paths under `tests/build/`; a runner that ignores
  the exclusion is refused.
- Existing no-report, zero-row, scope-floor, collapse, uncollected, regression, hidden
  debt, and remove-only laws remain active.
- The baseline describes this source phase only. Every live baseline failure path must be
  outside `tests/build/**`.
- Raw `npm test` retains the exact unfiltered command and contains no exclude.

### 5.2 Strict post-build mode

`node scripts/check-test-ratchet.mjs --verify-dist`:

- is incompatible with `--update` and `--bootstrap`;
- supplies `VERIFY_DIST=1` itself and invokes exactly `npx vitest run tests/build/` with
  the JSON reporter/output file seam;
- recursively discovers every build test file from disk using the repository's supported
  test/spec extensions;
- requires a nonempty discovered set and a nonempty parseable report;
- requires the report's normalized file set to equal the discovered set exactly;
- rejects every file outside `tests/build/**` and every discovered file absent from the
  report;
- rejects runner nonzero, collection failure, collapsed row, failed row, and every
  `pending`, `skipped`, or `todo` row;
- exits zero only when every discovered build test ran and passed.

The strict mode does not read, write, or compare the source-debt baseline. Build tests are
not debt-bankable: after the artifact exists they pass whole or the phase is red.

### 5.3 Package and CI topology

- `test` stays `sh scripts/gate-mutex.sh --run -- npx vitest run`.
- `test:ratchet` and `test:ratchet:update` remain mutex-held source-mode commands.
- `verify:dist` is mutex-held strict dist mode; it does not acquire the mutex twice.
- Local `check` keeps source ratchet before build and strict dist mode after build.
- CI's test group runs the source ratchet only. CI's build group builds before strict
  dist verification. Aggregate parity remains exact.

### 5.4 Generated baseline

- Code is committed first so `measuredAtSha` can name immutable bytes.
- In a fresh detached checkout at that SHA, run `npm run test:ratchet:update` with no
  `dist/` prerequisite.
- The generated baseline is the sole genesis diff.
- The 16 existing attributed failure identities remain exact unless a real repair makes
  one pass, in which case the existing remove-only law requires and records the shrink.
- `skippedCeiling` must be 1 or lower. It may never be hand-written or raised.
- `totalTests` and `totalFiles` are accepted only as tool-derived source-phase figures,
  not copied from this packet.

## 6. Ordered implementation and atomic pair

1. Seal GTR-1 and capture `validate:packets`, the focused base suites, raw package
   topology, a clean-checkout source report, and a fresh post-build report.
2. Edit only the four code-half paths. Do not touch the baseline.
3. Run the focused tests and ESLint. Plant each negative through the existing injected
   runner seam; restore exact bytes.
4. Build the four-path code-half commit object from a private index, parented to the
   sealed dispatch SHA, without moving the branch.
5. Materialize it in a clean detached checkout. The source ratchet may be red only
   because the committed baseline still describes the former whole-suite phase; any
   functional failure stops.
6. Run the remove-only update there. Prove the baseline is the only diff, review every
   field and create the one-path genesis commit with the code half as parent.
7. In a fresh detached checkout at genesis, with no pre-existing `dist/`, run focused
   tests, ESLint, both typechecks, and bare `npm run check:tail`. All 17 steps must run
   and exit zero; strict dist must report zero non-running rows.
8. Copy the proven pair bytes to the shared worktree, verify equality, then execute one
   old-value CAS from the sealed dispatch SHA to genesis. Never expose the code half as
   the branch tip and never squash the pair.
9. Prove exact 4+1 path sets, clean authored paths, ancestry, and baseline SHA binding.
10. Chair flips GTR-1 terminal, returns H26 to READY with its base/session restamped,
    validates packets, and then H26 is recompiled and regenerated from the new parent.

## 7. Acceptance matrix

| ID | Case | Required observation |
|---|---|---|
| A1 | phase split | source mode excludes `tests/build/**`, its report contains none, raw `npm test` remains unfiltered, and all frozen failure rows belong to source mode |
| A2 | strict exact set | dist mode discovers the on-disk build-test set and accepts only an exactly equal, nonempty all-passed report |
| A3 | dist negative set | missing, extra, out-of-scope, failed, uncollected, collapsed, skipped, pending, and todo fixtures each exit nonzero for their named cause |
| A4 | mode grammar | `--verify-dist` refuses update/bootstrap combinations and supplies exact `VERIFY_DIST=1` plus exact build-test argv without nested mutex acquisition |
| A5 | topology | local and CI source phases precede build only where intended; build precedes strict dist verification; aggregate step parity remains exact |
| A6 | environment invariant | source results and skip count are identical with `dist/` absent or present; post-build reports every discovered build test run and passed |
| A7 | monotone genesis | remove-only generation binds the code-half SHA, preserves or shrinks 16 attributed entries, and derives a skip ceiling no greater than 1 |
| A8 | landing proof | exact four-path code plus one-path genesis commits, clean-checkout 17-step gate green, no product/golden/census motion, one old-value CAS |

Do not add a ninth case or a second behavior family.

## 8. Verification commands

Pre-edit and code-half:

```sh
npm run validate:packets
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/testRatchet.test.js \
  tests/build/ciCheckParity.test.js
npx eslint \
  scripts/check-test-ratchet.mjs \
  tests/lint/testRatchet.test.js \
  tests/build/ciCheckParity.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
```

Genesis, from a clean detached checkout with no built artifact before the gate:

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/testRatchet.test.js \
  tests/build/ciCheckParity.test.js
npm run test:ratchet
npm run build
npm run verify:dist
npm run check:tail
```

Never pipe a gate. The final command is bare and must report all 17 steps.

## 9. Mandatory STOP conditions

Stop without speculative repair if:

1. the live branch/base, five target paths, H26 reservation, or packet status differs;
2. any existing frozen failure belongs to `tests/build/**`;
3. raw `npm test` would need filtering or CI would need a duplicate pre-test build;
4. strict dist cannot derive an exact on-disk file set or any build test remains non-running;
5. source mode still changes with `dist/` present versus absent;
6. code-half failures exceed the exact baseline phase-mismatch set;
7. the generated baseline changes more than the one JSON path, adds an entry, raises a
   ceiling, or is hand-authored;
8. any product source, dependency, golden, feature flag, tuning value, timeout, budget,
   lighting-census figure, or second baseline must move;
9. either commit's path set differs, the branch moves, or the clean full gate is nonzero;
10. an architectural judgment remains for the implementer.

STOP means no partial landing, no ceiling accommodation, and no H26 retry.

## 10. Completion receipt

Report the verified base and seal, exact 4+1 SHAs and paths, effective deltas, A1–A8,
dist-present/dist-absent source equality, source totals, strict dist discovered/reported
file and test totals, zero-nonrun proof, baseline before/after fields, all commands/exits,
both typechecks, all 17 full-gate steps, product/golden/census delta (`NONE`), one-CAS
proof, final clean state, deviations (`NONE` or STOP), and judgment calls (`NONE`).
