# JOIN-REHEARSAL — the hand-back (2026-11-14)

Seat JOIN-REHEARSAL (session `session_01ACmDYarB3ndZpYxCZbimH2`), brief `docs/chair/2026-11-14/briefs/BRIEF-JOIN-REHEARSAL.md` on `lane/chair-2026-11-08`. A REHEARSAL of the join: every builder lane merged at its tip into the save branch `lane/join-rehearsal-2026-11-14`, started at the line's tip **976db5b19** (read back from origin at 03:21 UTC, unchanged). Nothing reached the line or any lane; nothing signed; no pull request.

## 1. The order that worked, the tips merged, the time

Full history first (`git fetch --depth=2147483647 origin …`, `is-shallow-repository` false, 18 s). One merge commit a lane, `git merge --no-ff --no-commit`, in the brief's order; every merge pushed (the lane hook's three gates green each time). `rerere.enabled true` in the clone: the cache is the clone's `.git/rr-cache` (the container's, lost with it); the resolutions are committed as remerge diffs under `docs/chair/2026-11-14/probes/JOIN-REHEARSAL/NN-<lane>.remerge.patch` (`git show --remerge-diff`, the edge bundles, the wiring census and the byte baseline left out: each is one side then re-derived).

| # | lane | tip merged (read at the merge) | merge commit | at (UTC) |
|---|---|---|---|---|
| 1 | r3-code-c | dbe379c13 | 1e25364ed | 03:23 |
| 2 | r3-tabs | 2903e2143 | 2207c4e84 | 03:30 |
| 3 | r2-code-a | e93a3e570 | 44d32838b | 03:35 |
| 4 | powers-follow-up | **ec6d70a0e** (the commit message says 18d249003, the tip read at 03:21: WRONG, the lane moved by one docs-only commit, ec6d70a0e "POWERS-11 … logged"; HEAD^2 of ca6485128 is ec6d70a0e) | ca6485128 | 03:41 |
| 5 | w2-fix-data | fb00318d9 | 2845c5fc5 | 03:48 |
| 6 | w2-fix-data-history (the data lane had not merged it) | 864948c8b | 58575662c | 03:55 |
| 7 | w2-write (corpus main) | 143d51c5d | aeebd5ccf | 04:00 |
| 8 | w2-write-side-eco | e0c1f8b60 | fd7ca8ea8 | 04:05 |
| 9 | w2-write-side-rest | 718fcbdcb | 099587260 | 04:12 |
| 10 | w2-c-leaves | 71624aad0 | efcac854f | 04:17 |
| 11 | r2-code-b | e285c603f | 5a7b5d2d8 | 04:24 |
| 12 | coherence-upkeep (defence) | f943c9772 | b9e0bf005 | 04:37–04:48 (the stop, §4) |
| — | the generated files by their doors | — | d8b7a5fde | 04:50 |

Times: merges 03:23–04:48 (each ~3–4 min of it the push hook); the generated files 1 min; the three gates 3 min (04:51–04:54); the census, §5.

## 2. Every code resolution (read at the cause; both lanes' cures stand)

- **`scripts/lib/table-pools.mjs`** (data, merge 5), `NOT_TABLE_CHANNELS`: both sides' rows kept, the powers lane's `TITLE_LINE_DECLARATIONS` then the data lane's `HISTORY_TEMPLATE_RECORD_DECLARATIONS` and `HISTORY_DESC_SIBLINGS`.
- **`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`** (corpus main, merge 7), one hunk, the defence gate line 2: the line's `[ledger · gate]` against the lane's `[ledger · gate · guardPresence · no crisis: under_siege]`; the lane's row carries the line's `gate` and adds its own conditions, so it holds both. The eco and rest blocks merged clean.
- **`tests/domain/corpusCureGuards.test.js`** (merges 8, 9): both sides' appended rows (6 main, 13 eco, 23 rest; no duplicate seed+pool+vid).
- **`src/domain/goods.schema.js`** (leaves, merge 10), the migration roster (JSDoc): the line's `registeredWords.js | identity | direct` and the lane's `chainWorking.js | identity | surface` both, in path order, each import read. `tests/joins/goods.test.js` green at the merge.
- **`src/components/new/tabs/EconomicsTab.jsx`** (r2-code-b, merge 11; read whole). Imports: r2b's `institutionHouseLabel` with the leaves lane's `tradeListsAsPrinted` and `chainOutputsShown` (`displayTradeList` has no use left in the file). The chain card: r2b's three-argument `chainFlowFacts(chain, instNames, shown)` (R2-CODE-B-7: a toll renamed by the access names it as its source) with the leaves lane's `outs = chainOutputsShown(chain, town)` (#555); the leaves lane's two-argument spread would have dropped R2-CODE-B-7. Line counts kept.
- **`src/domain/display/defenseDisplay.js`** (defence, merge 12), `foodEnduranceLine`, three hunks: the line's W2-A-LEAVES 2 + 20 (`actual`) and UPKEEP-8 (`would`) state ONE rule (the siege figure indicative only under a siege); both names kept as one fact (`const actual = end.besieged === true, would = !actual;`) because the auto-merged lines use both; UPKEEP-8's months (`storedMonths`, the stretch clause), which only the defence lane changed, stand. Line counts kept (the module's lines are cited). Read: the function whole and every use of the two names; NOT the file whole (the count; the true join reads it whole).
- **`src/domain/display/dossierViewModel.js`** (merge 12): both blocks appended at the foot stand (W2-A-LEAVES' `magicSourceOf`/`proseHouseName`, then UPKEEP-8's Outlook facts and `outputChipBesideWord`). Read: both blocks whole, not the file.
- **`src/domain/generation/generationForkRegistry.js`** (merge 12): `fnv1a32External` **23**, MEASURED by A6 at the joined tree (the line 16, the lane 42; NOT the sum 41: the upkeep roll's 24 were counted on the lane's own Comfortable probe row, which the joined tree re-deals); both causes kept in its note.
- **`tests/domain/foodEnduranceHeldStores.test.js`**: the lane's re-key (the same expectation plus its besieged arm). **`tests/lint/heldKeyWriterCensus.walker.test.js`**: both sides' symbol rows (pure reads, each with its reason).
- **`docs/implementation/PACKET_MANIFEST.json`** (merge 12, BY THE CHAIR'S RULING of 04:45, §4): one row, `EM-R0d.requiredSymbols[2].retiredBy` "§934.105 …".
- FOR THE CHAIR (a composition, not ruled by this seat): `dossierViewModel.js :: outlookFactsOf` (UPKEEP-8) reads the import list "as the Economics tab prints it" through `displayTradeList(primary + terrain)`; after the leaves lane the tab prints `trade.arriving` (`tradeListsAsPrinted` → `importsAsPrinted`: under a siege that stops trade nothing arrives, and unmet needs are split off). Both kept as written; the Outlook's `needsImports` may read a list the tab no longer prints.
- The other named code files (`EconomicsTrade.jsx`, `Services.jsx`, `SupplyChainFlow.jsx`) merged CLEAN in this order.

## 3. Every file taken from the branch side (re-derive at the true join, in §2n's order of the merge book on `lane/merge-15-point-49-wip-2026-11-14`)

| file | lanes whose side was NOT taken |
|---|---|
| `docs/content/prose-shift-register.json` | corpus-eco, corpus-rest |
| `docs/content/wiring-census.json` | r2-code-a, powers, data, data-history, corpus-main, corpus-eco, corpus-rest, leaves, defence |
| `scripts/.prose-byte-baseline.json` | data, corpus-main, corpus-eco, corpus-rest |
| `scripts/census/page-census.register.json` | corpus-main |
| `scripts/census/pool-dominance.register.json` | powers, data |
| `scripts/mutation-coverage-manifest.json` | defence |
| `src/data/dossierStateProse/defense.generated.js` | corpus-main |
| `supabase/functions/_shared/aiCharterBundle.js` | data |
| `supabase/functions/_shared/aiCharterBundle.meta.json` | r3-code-c, powers, data, leaves |
| `supabase/functions/_shared/aiGroundingBundle.js` | r3-code-c, powers, data, leaves |
| `supabase/functions/_shared/aiGroundingBundle.meta.json` | r3-code-c, powers, data, leaves |
| `supabase/functions/_shared/aiOutputSchemaBundle.js` | data |
| `supabase/functions/_shared/aiOutputSchemaBundle.meta.json` | r3-code-c, powers, data, leaves |
| `supabase/functions/_shared/analyticsEventsBundle.meta.json` | r3-code-c, powers, data, leaves |
| `supabase/functions/_shared/engineBundle.js` | r3-code-c, powers, data, leaves |
| `supabase/functions/_shared/engineBundle.meta.json` | r3-code-c, powers, data, leaves |
| `supabase/functions/_shared/intentAtlasBundle.meta.json` | r3-code-c, powers, data, leaves |
| `tests/components/phoneChromeFloor.census.test.js` | powers, leaves, r2-code-b |
| `tests/domain/composeStateProse.test.js` | corpus-eco, corpus-rest |
| `tests/domain/facts/textOf.test.js` | data, data-history |
| `tests/generators/generationForkCensus.test.js` | defence |
| `tests/lint/.lighting-census-baseline.json` | defence |
| `tests/lint/.prose-numerics-baseline.json` | defence |
| `tests/lint/.tuning-inventory.json` | defence |
| `tests/lint/institutionTable.walker.test.js` | defence |
| `tests/lint/presumedThings.register.json` | r3-code-c, r2-code-a, data, data-history, corpus-main, defence |
| `tests/lint/presumedThings.widened.register.json` | data, data-history, corpus-main |
| `tests/lint/proseComposed.walker.test.js` | corpus-eco, corpus-rest |
| `tests/lint/proseEntryContradiction.walker.test.js` | corpus-eco, corpus-rest |
| `tests/lint/proseMoveGrammar.walker.test.js` | corpus-eco, corpus-rest |
| `tests/lint/proseNumerics.test.js` | defence |
| `tests/lint/proseWiringCensus.walker.test.js` | corpus-eco, corpus-rest, defence |
| `tests/lint/rawColorLiteral.test.js` | r2-code-b |

Already RE-DERIVED at the joined tree (d8b7a5fde, by their doors, once): the edge bundles and metas (`npm run build:edge-shared`), `docs/content/wiring-census.json`, `src/data/dossierStateProse/defense.generated.js`, `src/data/dossierRelations.generated.js`.

**The doors: START FROM THE BOOK'S 2n** (every row of it with its door, its commands, the committed-tree rule and ONE order). What this seat adds to 2n, measured:
- **2n's order step 2 before step 4 does not run at the joined tree:** `node scripts/generate-dossier-state-prose.mjs` REFUSES ("the wiring census is STALE against 1 of its own stamped files: src/domain/display/stateProse/economyStateProse.js … Re-take the census before regenerating the leaves"); so is the corpus lane's `doors.sh` (projection first). The order that ran: `node scripts/wiring-census.mjs` → `generate-dossier-state-prose.mjs` → `wiring-census.mjs` → `wiring-census.mjs --check` → `generate-dossier-state-prose.mjs --check` (all exit 0: 856 pools, 2,948 variants, 169 relation rows; 69 state blocks, 78 causal families).
- **Doors for 2n's NOT FOUND rows, found in the corpus lane's own instruments** (`docs/chair/2026-11-13/probes/W2-WRITE-5/README.md`, now on this tree): the byte baseline `scripts/.prose-byte-baseline.json` by `bytes.mjs "<car>" "<why>"` from the tree root; the shift register `docs/content/prose-shift-register.json` by `repin.mjs` (via `iterate.sh`, from the projection contract's drift lines); the whitelisted count pins of `composeStateProse.test.js`, `proseWiringCensus` (incl. the histogram), `proseComposed`, `proseEntryContradiction` by `pins.py` (via `iterate.sh "<cause>"`, to a fixed point). Still NOT FOUND (no door in the file's header or under `scripts/`): `tests/lint/.prose-numerics-baseline.json` and `proseNumerics.test.js` (a register keyed by line; no environment door), `tests/lint/rawColorLiteral.test.js` (`BUDGET`, EXACT: the branch 1216, r2-code-b 1221; a pin re-keyed by hand with its cause, by its own walk), `institutionTable.walker`, `textOf.test.js`, `foodEnduranceHeldStores.test.js`, `corpusCureGuards.test.js` (compose as code, as 2n says).
- **Measured at the joined tree for the pins re-keyed by measurement:** `tests/domain/facts/textOf.test.js` object rows **115** (99 + r2a 6 + data 6 + data-history 4; the branch side reads 105). `generationForkCensus.test.js` at the joined tree: 4 red against the line's pins (A1 the control row's hash d4e728f3… against f4fc47a0…; A4; A5 two seeds now minted more than once; A6 fnv1a32 external 23 against 16): 2n step 7, the fork census control re-keyed in the stage.

## 4. The stop, and the chair's ruling (copied in substance)

At merge 12 the PRE-COMMIT hook refused the merge commit: `validate-packets-staged.sh` (lint-staged runs it because the lane's `docs/implementation/packets/settlement-editor/EM-R0d.md` is staged) "EM-R0d.requiredSymbols[2].symbol is missing from src/generators/defenseGenerator.js: const computeDefenseReadiness = …". EXECUTED: the defence lane's own tip f943c9772 fails the same validator (its 82c639b44, COHERENCE-UPKEEP-5 V3, replaced the function by the derived form). THE CHAIR'S RULING (04:45 UTC): the red is the defence lane's own; the packet law (§731.3) asks the removal for a `retiredBy` naming the authorizing section; the lane's seat makes that cure on its lane; FOR THE REHEARSAL this seat writes the SAME ONE ROW in its merge commit, `EM-R0d.requiredSymbols[2].retiredBy` "§934.105 (the owner's design of 2026-11-13: defence is the sum of its parts; COHERENCE-UPKEEP-5 V3 at 82c639b44 replaced computeDefenseReadiness by the derived form)", surgically (diff 2+/1−), said in the commit body to be the lane's owed cure made early on a save branch. Then `node scripts/implementation-packets.mjs validate` at the joined tree: **exit 0, "valid: 257 packets (0 READY)"** — no other packet error.

## 5. What the three gates met, and the reds listed (not cured)

At the joined tree d8b7a5fde, each through `sh scripts/gate-tail.sh`: `npm run typecheck:ratchet` exit 0; `npm run typecheck:domain:strict` exit 0; `npm run lint` exit 0 (and the lane hook's same three green at every push). The whole suite was NOT run (the brief).

Reds met in the governing files of the EconomicsTab resolution (45 files naming the tab, run at 5a7b5d2d8: 3 failed), each classed by running those files in archives of the line 976db5b19, each lane's tip and this branch's merges — **none is a merge resolution's; each is a lane's own, red at its own tip:**
- `tests/lint/chainPrintSites.walker.test.js` "no file reads a chain's name or source outside the three lists": `src/domain/display/tradeListDisplay.js` — **w2-c-leaves**, red at 71624aad0.
- `tests/ui/generalDeskTabFlow.test.js` fails to load: "drawnMember: NOTHING DRAWS at DS-GEN-18 :: STALLED · seed forge_town" — **w2-write (corpus main)**, red at 143d51c5d (first on this branch at aeebd5ccf).
- `tests/ui/economicsTabFlow.test.js` "economics.exportPosture" liveness anchor (expects "… beyond the town", prints "… beyond the village") — **w2-write-side-eco**, red at e0c1f8b60 (first on this branch at fd7ca8ea8).

## 6. The count (CENSUS-2's eight kinds), the line against the joined tree

CENSUS_TABLE_PENDING

## 7. Hazards

- **A push with nothing to send runs the whole check** (the chair's notice of 04:37, copied: two tests in it run git against the REAL repository from a linked worktree — the local branch moved, `core.bare=true`, a fixture user written; before every push `test -n "$(git rev-list origin/<branch>..<local>)"`, never chain a push after a step that can fail). This seat was bitten once (04:41, a push chained after the refused commit): the check stopped at `validate:packets`, step 3, before any test; refs and local config unchanged by snapshot; nothing reached origin. The push script now refuses an empty rev-list.
- lint-staged's `eslint --fix` runs on a merge commit's staged files (hundreds); the resolved files were compared byte for byte after the commit (unchanged).
- `npm ci` writes `core.hookspath=.husky/_` into the shared config (expected); rerere's keys too (`rerere.enabled`, `rerere.autoupdate false`).

## 8. How the instruments are re-made

A scratch worktree at the branch tip (`git worktree add <scratch>/wt -b <local> <tip>`, `npm ci`, `git config rerere.enabled true`); the merge book's §5 commands; the census by `sh <scratch>/c2/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree> <out outside the repo> 4` from `git archive origin/lane/census-2-2026-11-13 docs/chair/2026-11-13/probes/CENSUS-2`; the remerge patches by `git show --remerge-diff <merge>` for each first-parent merge since 976db5b19.
