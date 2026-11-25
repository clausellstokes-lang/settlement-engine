# BRIEF: NEED-ATOM (CLOSE-8's cure 3b; the tenth chair's R24q 7). ONE BUILDER. A UNIT OF SOURCE.

## THE FAULT (CLOSE-7's READS-117 item 7, CONFIRMED by run there)
`src/domain/facts/needNotBroughtIn.js :: needListOf` is the eager copy of the page's need list ("Needed, and not brought in:",
`src/domain/display/tradeListDisplay.js :: importsAsPrinted(record).needed`). Its `dealtInHere` drops a need a live house deals in
unless a live house is SHORT of it; it reads "short" ONLY from non-imported GAP ROWS of a live house. The page reads shortness from
the MARK (`crisisStoppedRow.js :: rowShortOf`'s gate over `facts/houseInputAtHand.js :: housesShortOf`). On r2r-town-54 (desert,
"Erdenbuurt", at the line's tip) the Butchers (a house that STANDS) are marked short of livestock but have no gap row, so the page
prints `["Livestock for meat and draft", "clay"]` and the atom says `["clay"]`. `tests/generators/faultsNeed.test.js` item 1 is red
at the line (it is on RED-AT-LINE). THE ATOM IS WRONG; THE PAGE IS RIGHT. Do not change the page.

## WHAT TO BUILD
1. RED FIRST: the existing `faultsNeed` item 1 is red at the base on r2r-town-54; add nothing that merely restates it unless the
   existing arm does not name the town. Say the red's exact title and failing count at the base.
2. THE CURE: the atom's copy of the page's "short" rule reads the houses that STAND and the mark the page reads, in the record's
   own words (this leaf is EAGER: it may not import `houseInputAtHand.js`, `tradeListDisplay.js` or any module pinned lazy in
   `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN`; if the rule needs a table, copy only what is needed and have the guard
   `faultsNeed.test.js` hold the copy equal to its home, as the file's other copies are held). Read `housesShortOf` and
   `rowShortOf` WHOLE before writing a line. No draw moves; no stored field moves; no new vocabulary row.
3. THE RULE AS A CHECK OVER EVERY BIRTH of C and V (900 each): for every birth, `needListOf(record)` equals the page's own
   list, AND every need the page drops as "dealt in here" is dealt in by a house that stands and is not short of it, with an
   oracle INDEPENDENT of the leaf: the raw roster (`record.institutions`, alive) and the catalogue (`src/data/institutionalCatalog.js`
   or wherever a house's inputs are catalogued: find it) for which house needs what. Count before (at the base) and after; after
   must be 0 on both. Use the births tool (`tools/births.mjs` + `births.census.jsx` beside this brief, with a MEASURE module you
   write: `export function measure(town) -> object`). Plans: `node tools/make-plan.mjs planC.json` and
   `node tools/make-visitor-plan.mjs tools/plan-lit.json planV.json`.
4. NAME EVERY READER of the atom (`needListOf`, `needNotBroughtInOf`, `goodNeededNotBroughtIn`, `goodsNeededNotBroughtIn`, the
   `need not brought in` vocabulary key through `factsOf`): file :: symbol, and for each whether a page prints from it. Then: how
   many births of C and V change what any reader returns (records moved by sha256 per field, `tools/measure-keys.mjs`): expected
   few or none, because the atom feeds wording gates; every moved field named with its cause.

## WHERE
- Worktree: `/home/user/wt/need-atom` on branch `lane/close-8-2026-11-25-need-atom-wip`, already cut at the line's tip 09c29806b
  with node_modules and `.husky/_` linked. Commit there by explicit paths. DO NOT PUSH (CLOSE-8 pushes).
- Files you may change: `src/domain/facts/needNotBroughtIn.js`, `tests/generators/faultsNeed.test.js`, a new test file if needed
  (basename must avoid census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|
  roundtrip|golden|contract|pin), and `scripts/mutation-coverage-manifest.json` ONLY if a new file under tests/generators needs its
  row (a `rationale` row as the file's others). Anything else: STOP and report.
- Measures and tools: `/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/need-atom/` (no commit there; CLOSE-8
  commits it).

## LAWS
- Every heavy run (vitest, tsc, births) through the gate mutex: `GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- <cmd>
  > <log> 2>&1; echo "exit=$?" >> <log>`; read logs by `tail`/`grep`, never a gate through a pipe. One heavy run at a time.
- The hooks are never bypassed (`--no-verify`, `core.hooksPath`, HUSKY=0): never.
- Before you say green: `npm run typecheck:ratchet` and `npm run typecheck:domain:strict` (ceilings 167 and 1113) in the worktree;
  `npx vitest run tests/generators/faultsNeed.test.js` and your test; `npx vitest run tests/copy` whole (a src/domain change);
  `npx vitest run tests/lint` whole (a test file changed). Known reds of `tests/lint` at the line: `proseComposed` A0b,
  `proseCorpusBytes` RAW and GZIP, the size signings: name any other.
- First paint: this leaf is eager. Say whether your change adds an import; if it does, STOP and report before building more.
- No golden, fingerprint, register or budget is re-recorded by you. A permission refusal stands: report it, try nothing else.

## REPORT (at most 300 words + one table), written also to `need-atom/REPORT.md`
The commit(s); red at the base (title, count) and green after; the every-birth check before/after on C and V; records moved
C/V with fields; the readers list; the gates' counts; anything you could not do.
