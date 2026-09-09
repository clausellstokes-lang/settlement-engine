# LANE: OSR-SCHEMA17 — mint the rung, widen the corpus by TOPOLOGY only, and free the 23-car desk consist
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · Fable retrovalidation of this act is the chair's own⟧

## READ FIRST, IN THIS ORDER — the history is the brief
1. `$SC/briefs/_PREAMBLE.md` — the hard rules.
2. `$SC/rulings/RULING-OSR-MINT-ISCRIMINAL.md` — the FIRST ruling. **Withdrawn.** Read it for what NOT to do.
3. `$SC/rulings/RULING-OSR-MINT-WITHDRAWN.md` — why it was withdrawn, and the replacement ruling (widen the corpus).
4. `$SC/rulings/DECISION-OSR-DEFERRED.md` — why the replacement was ALSO refused by measurement, and the strictly better cure a lane measured.
5. `$SC/rulings/RULING-SCOPE-CORRECTIONS.md` §2 — the wave's schema-16 rung is SPENT; **17 is the next free rung and nothing has claimed it.**

Three Opus lanes in a row corrected the chair on this surface, each by measurement, each rightly. **This brief is the fourth attempt, written by a different seat, and it exists only because the earlier lanes' refusals converged on ONE act that no ruling had yet authorised.** You are executing that act — and you are still expected to refuse it if your measurement disagrees.

## YOUR DOCK
`$SC/laneINTEG-tree`, detached at **`940d161ca`** (23 cars over product `90702c3e9`), porcelain **0**, `node_modules` 454 symlinks incl. `pg`. ⛔ Never materialise them, never `npm install`. ⚠ **The product tip will have MOVED by the time you finish** (the clamp consist is landing); do not rebase — the chair replays.

## THE SITUATION, MEASURED BY THREE LANES
- `economyStateProse.js:328` reads `isCriminal` on `incomeSources`. The observed-shape ratchet reports it as a read of a key no writer produces. **It is not a defect**: `criminalIncomePoolKey` is a real lens (fires on 52–83 % of STRESS-loaded worlds) and its docblock records a deliberate design rule, *"keyed on the FLAG, never on the LABEL"*. Re-pointing and deleting are both out.
- The finding is **corpus reach**: the observed-shape corpus is 4 seeds × 4 configs, none stress-loaded — 0 of 118 observed `incomeSources` rows carry the flag.
- ⛔ **The corpus file `scripts/lib/observed-shape-corpus.mjs` is a governed DETECTOR SOURCE** (`isDetectorSourcePath` → true). Any edit to it makes the plain gate return 1 **without scanning**, until a new schema rung is minted through `scripts/migrate-observed-shape-readers.mjs`. That is the designed door; schema 15 was cut for a change in this very file.
- ⛔ **Widening by adding a CONFIG is NOT a shrink**: it clears 33 rows but **mints 20 new ones** across 15 files, because 20 saves instead of 16 re-rolls the pulse past `MIN_ROWS = 40`.
- ⭐ **The strictly better cure, measured by OSRCORPUS:** push the stress settlements into `roots` but **NOT** into `generated`, leaving producer 2's pulse untouched. Result: clears the target, **0 new rows**, 12 frozen rows cleared (all true shrinks), 2 of 9 `corpusMeta` fields move, cost inside the base band. It also clears two sibling `isCriminal` reads (`EconomicsTab.jsx`, `treasury.js`).

## THE ACT — in this order, each step proved before the next
1. **Re-derive the premise.** Confirm `isDetectorSourcePath('scripts/lib/observed-shape-corpus.mjs')` is true; confirm the topology-only change clears the target with **zero** new identities. **If either fails, STOP and report** — do not proceed to a mint on a premise you have not measured yourself.
2. **Apply the topology-only corpus change** (stress settlements into `roots`, not `generated`). Keep the diff minimal and documented at the edit site: say why `roots` and why not `generated`.
3. **Mint schema 17 through the governed migration path** (`migrate-observed-shape-readers.mjs` — it has `--migrate`, `--target-schema`, `--predecessor`, `--review`, `--write`). Follow the shape of the 15→16 mint at `0cf7185e1` / `1980bdaa7` in the product history: target constant, predecessor row, scanner transition entry, validator entry, `BASELINE_SCHEMA` bump, header paragraph, and the genesis re-freeze with the inventory **byte-identical except for the true shrinks**. Read that mint before writing yours.
4. **Take the governed shrink re-freeze** and inspect **every vanished row by name**: a row that vanishes because the corpus now sees its writer is a true shrink; a row that vanishes for any other reason is a finding you report, not one `--write` absorbs.
5. **Record the corpus's new generation cost** (before/after wall-clock for one scan) — the chair pays it on every future run.

## ⛔ FENCES
- **Exactly one rung: 17.** No ceiling moves. No identity is hand-added. No read is deleted or re-pointed.
- ⛔ **Do not add a CONFIG.** That is the 20-new-rows path a lane already refuted.
- ⚠ The `SHRINK-ONLY: … no row has vanished` arm reds between the corpus change and the re-freeze; that is the governed sequence, not a surprise. It must be green at your final commit.
- ⛔ Take **no other** register act. `typecheck:domain:strict` must stay exit 0 at its current ceiling (run the REAL script — `domainStrictBaseline.test.js` is green on injected inputs and proves nothing).

## PROVE IT
`node scripts/check-observed-shape-readers.mjs` → exit 0 · `npx vitest run tests/lint/observedShapeReaders.walker.test.js` green · `npx vitest run tests/lint/` with exit + failing-arm list (**only `clampPrimitiveBaseline` may remain**, and it is not yours) · the three desk suites at **136** · `npm run typecheck:domain:strict` exit 0. **Plant the corpus change back out and prove the two arms red again.** Every exit captured in-shell.

Commit per step with `Seat: Opus 5 — Fable-unvalidated` and `Lane: OSR-SCHEMA17`. Receipt to `$SC/receipt-osr-schema17.md`, PARTIAL header FIRST. End with a RETROVALIDATION ROW.
