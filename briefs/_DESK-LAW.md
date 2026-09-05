# THE DESK-CAR LAW — read before any desk car. Every clause below was paid for by a landed car.
(Chair: Fable 5.1 · every desk lane is Opus 5. `$SC` = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad · main repo /Users/cstokes/Desktop/settlement-engine)

## What a desk car IS
A corpus leaf under `src/data/dossierStateProse/` holds authored prose pools keyed by producer tokens. A DESK module
(`src/domain/display/stateProse/<leaf>StateProse.js`) maps the settlement's STATE onto pool keys through the kernel
(`stateProseKernel.js`). A MOUNT (`dossierMounts.js` → `DOSSIER_MOUNTS`) names the position `<tab>.<position>` where one
block renders, at a RUNG (`sentence` = the ONE position that speaks; `glance` = band word + rows, no sentence). A desk
car (1) adds or extends the desk, (2) adds mount rows AND strikes the same ids from `UNMOUNTED_BLOCKS` in the SAME
commit, (3) adds a REAL draw site in the host tab component, (4) pins it. **Read `dossierMounts.js` WHOLE first** — its
docblock is the law (key on the canonical producer TOKEN never the corpus WORD; a mounted-but-unreachable pool is a
FINDING to declare, a read of a key no writer produces is a DEFECT to remove; one fact, one sentence per page-set).

## The five traps, each measured
1. ⛔ **THE CITATION LAW.** The walker's reachability arm only checks that a mount id appears as a string literal at exactly
   ONE site under `src/components`. It cannot tell a real draw from a decorative literal — planting bare literals PASSES
   THE GATE AND LIES. A mount is real only if the rendered DOM carries the corpus sentence/band; prove it with a UI test
   that renders the tab with a fixture and asserts the text (shape: `tests/ui/economicsTabFlow.test.js`).
2. ⛔ **THE PAID SURFACE.** O2GATE (450f7dbb7) threads `publicDossier` into EconomicsTab so corpus sentences never render on
   the anonymous gallery dossier. NO walker arm enforces this yet (DESK-9) — you gate it BY HAND on every position you add
   and you PROVE it with a test that renders the public variant and asserts the sentence is ABSENT. State in the receipt
   what the anonymous dossier shows at each of your positions.
3. ⛔ **DIMENSION-BEARING BLOCKS.** A mount over a block whose pools declare a STATE dimension (`STATE_MARK_DIMENSIONS` in
   the kernel: severity / deficit / anchor) must DECLARE `dimensions` on the row or the walker reds; the kernel fails
   CLOSED (renders nothing) rather than lying. Probe your leaf's `"marks"` arrays before choosing positions.
4. ⛔ **A FIXTURE CAN BE THE ONLY WRITER OF THE FIELD OR THE SHAPE IT GRADES.** Your test fixture must carry the field in
   the SHAPE the real producer writes (arrays stay arrays). Derive the fixture from a generated settlement, never from
   the desk's own expectations; a desk green on a hand-shaped fixture and dark on every real world is the bitten case.
5. ⛔ **SIZE CEILINGS.** `src/components/*.jsx` has a LAYER ceiling of 600 effective lines (eslint Linter count, not
   `wc -l`); `OutputContainer.jsx` sits at 600/600 — edits there must be PHYSICAL-LINE-NEUTRAL. Measure your host tab
   BEFORE and AFTER (`npx eslint --format json` or the Linter API as `receipt-deskwiring` did) and quote both figures.
   Extract a new position leaf (`<Tab>Glance.jsx`-style) rather than growing a tab past the line.

## Registers — you take NONE; you RECORD deltas
A desk car moves four registers, all landing-owned, taken by the chair at the composed tip: the mounts baseline
(`tests/lint/.dossier-mounts-baseline.json`, shrink-only, banked at landing) · prose-numerics (path-and-line addressed,
so ANY edit to a file carrying frozen rows RELOCATES rows — net zero, record the file) · the lighting census (a title
count asserted EXACTLY: a new test file reds THREE censuses — test-ratchet totalFiles, lighting census, the
known-failure file list — so prefer adding cases to an existing desk test unless the brief says otherwise, and NAME every
new test file) · writer-reach (a read moved behind a JSX prop grades N — a FALSE DARK; the chair absorbs it with plain
`--write`; ⛔ never "cure" the component to appease the scanner). Write the predicted deltas in the receipt.

## Proof — every exit captured in-shell, every figure quoted
Before ANY vitest: the quiet-window law — a gate may be running on this machine. Probe `uptime` load-1 < 4.0 AND
`ps -ax -o command | grep -c '[v]itest/dist/workers'` == 0 for THREE consecutive 60-second probes, then run vitest ONLY
through the mutex: `sh scripts/gate-mutex.sh --run -- npx vitest run <files>`. Required: your desk test(s) · the three
walkers `tests/lint/dossierMountRegistry.walker.test.js`, `tests/lint/couplingDesk.walker.test.js`,
`tests/lint/autoresolveTwoMount.walker.test.js` · `npx vitest run tests/lint/` WHOLE (exit + the failing-arm list; only
`clampPrimitiveBaseline` may remain red and it is not yours) · your UI flow test(s) · `npm run typecheck:domain:strict`
(the REAL script; `domainStrictBaseline.test.js` is green on injected inputs) · `npx eslint` on every file you touched.
Plant your desk change back out and prove the walker/UI tests RED without it. No `npm run build` (the chair builds).

## Git
Dock rules: never `npm install`, never materialise `node_modules` (symlinks by design), never `git stash`, never `git
add -A`. Stage explicit files; check the pre-commit hook did not re-stage more than you wrote (`git show --stat HEAD`).
Commit per car, message body = what and why + RECEIPTS; trailers `Seat: Opus 5 — Fable-unvalidated` and `Lane: <name>`;
⛔ never `--amend` (an amend voids the trailer the retrovalidation reads) — a fix is a new car. In `dossierMounts.js`
touch ONLY your leaf: append your mount rows at the END of `DOSSIER_MOUNTS`, remove ONLY your ids from
`UNMOUNTED_BLOCKS`, keep ONE id per line (a parallel desk lane edits the same file; the chair merges with a token-level
resolver that needs that shape). Hand back: the sha list, the receipt at `$SC/receipt-<lane>.md` (PARTIAL header FIRST,
CONFIRMED/PLAUSIBLE per claim, a RETROVALIDATION ROW at the end), porcelain 0.
