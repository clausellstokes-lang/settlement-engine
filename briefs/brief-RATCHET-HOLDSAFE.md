# LANE: RATCHET-HOLDSAFE — the test-ratchet instrument gets an honest read-only mode, and the anchored-negative walker states its marker rule
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · Fable retrovalidation of this act is the chair's own⟧

## READ FIRST
`$SC/briefs/_PREAMBLE.md` · `$SC/receipt-docket-3.md` (the two findings this brief cures: `scripts/check-test-ratchet.mjs:163` shells out to an unfiltered `npx vitest run` even without `--update`, so a "read-only" call breaks a vitest hold; and `tests/lint/negativeAssertionAnchor.walker.test.js`'s `// anchored:` marker must be the line IMMEDIATELY above the assertion — a wrapped comment reads as un-anchored, which cost a lane two attempts).

## YOUR DOCK
`$SC/laneHOLDSAFE`, detached at product **`5e28d5c83`** (porcelain 0). Never rebase; the chair replays `laneHOLDSAFE:5e28d5c83` at §900. ⛔ Never materialise `node_modules`, never `npm install`, never `git stash`, never `git checkout --` on foreign content. ⛔ **VITEST HOLD IS IN FORCE** until the chair sends RESUME: run NO vitest (and note: the very instrument you are curing spawns vitest — do not invoke it live); record every proof as OWED-UNTIL-RESUME with its exact command.

## THE ACT
1. **Measure first.** Read `scripts/check-test-ratchet.mjs` whole: which modes exist, where the vitest child is spawned, what the census compares (the baseline file vs the run's failures), and what a caller gets today without `--update`. Confirm by reading, not running, that the plain invocation spawns the whole suite.
2. **Add an honest read-only mode** that spawns NOTHING: `--from-log <vitest json/log path>` (or `--from-report`) that computes the census verdict from an existing vitest run's output, and a `--dry` that prints what WOULD run (the vitest argv, the baseline path, the ceilings) and exits 0. Keep the default behaviour byte-identical for every existing caller (grep `package.json`, `scripts/`, `.husky/`, `.github/` for every invocation and list them in the receipt with their mode). The docblock must say plainly: "the default mode RUNS THE WHOLE SUITE; under a vitest hold use --dry or --from-log".
3. **Prove** with node only: `--dry` exits 0 and spawns no child (assert with a `child_process` spy or by `ps` before/after); `--from-log` over a captured vitest json from the receipts (`$SC/*.log` has several; or a synthetic one) reproduces the verdict the live run gave; the default mode's argv is unchanged (a snapshot pin, OWED under vitest).
4. **The walker's rule**: in `negativeAssertionAnchor.walker.test.js`'s docblock and failure message, state the marker rule ("`// anchored:` must be the line immediately above the assertion; a wrapped comment is un-anchored") — a doc cure only; move no title, no figure.

## FENCES
No register act; no change to any baseline; no change to the census's verdict logic. Commit per step, `Seat: Opus 5 — Fable-unvalidated`, `Lane: RATCHET-HOLDSAFE`, `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. Receipt `$SC/receipt-ratchet-holdsafe.md`, PARTIAL header first, RETROVALIDATION ROW last, tip sha last.
